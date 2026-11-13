import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 45000,
});

// ── Helpers ───────────────────────────────────────────────────────────────
function clearSession() {
  localStorage.removeItem('ievalx_token');
  localStorage.removeItem('ievalx_refresh_token');
  localStorage.removeItem('ievalx_user');
  localStorage.removeItem('currentCompanyId');
  window.location.href = '/auth';
}

function getToken() {
  return localStorage.getItem('ievalx_token');
}

function isRealJwt(token) {
  return token && token.includes('.');
}

function tokenExpiresIn(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 - Date.now();
  } catch {
    return -1;
  }
}

// ── Proactive refresh (runs while token is still valid) ──────────────────
const REFRESH_BUFFER_MS = 5 * 60 * 1000;        // refresh 5 min before expiry
let refreshTimer = null;

function scheduleRefresh() {
  clearTimeout(refreshTimer);
  const token = getToken();
  if (!token || !isRealJwt(token)) return;

  const remaining = tokenExpiresIn(token);
  const delay = remaining - REFRESH_BUFFER_MS;

  if (delay <= 0 && remaining > 0) {
    doRefresh();
  } else if (delay > 0) {
    refreshTimer = setTimeout(doRefresh, delay);
  }
}

async function doRefresh() {
  const token = getToken();
  if (!token || !isRealJwt(token)) return;

  const refreshToken = localStorage.getItem('ievalx_refresh_token');
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      refreshToken ? { refresh_token: refreshToken } : {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.setItem('ievalx_token', data.Token);
    if (data.Refresh_Token) localStorage.setItem('ievalx_refresh_token', data.Refresh_Token);
    scheduleRefresh();
  } catch {    const remaining = tokenExpiresIn(getToken());
    if (remaining <= 0) clearSession();
  }
}

// Start the timer on module load (handles page refresh / tab reopen)
scheduleRefresh();

// Call this from LoginForm after storing the token
export function onLoginSuccess(token) {
  localStorage.setItem('ievalx_token', token);
  scheduleRefresh();
}

// Call this from logout handler
export function onLogout() {
  clearTimeout(refreshTimer);
  localStorage.removeItem('ievalx_token');
  localStorage.removeItem('ievalx_refresh_token');
  localStorage.removeItem('ievalx_user');
  localStorage.removeItem('currentCompanyId');
  window.location.href = '/auth';
}

// ── GET response cache (30s TTL) ─────────────────────────────────────────
const _getCache = new Map();
const GET_CACHE_TTL = 30_000;

function _getCacheKey(config) {
  if (config.method !== 'get') return null;
  // Skip caching for auth endpoints
  if (config.url && config.url.includes('/auth/')) return null;
  const params = config.params ? JSON.stringify(config.params) : '';
  return `${config.baseURL || ''}${config.url}?${params}`;
}


let _freshGetDepth = 0;
export async function withFreshGet(fn) {
  _freshGetDepth += 1;
  try {
    return await fn();
  } finally {
    _freshGetDepth -= 1;
  }
}

// Drop every cached GET (called on logout so the next user never sees them).
export function clearGetCache() {
  _getCache.clear();
}

// Drop cached GETs whose key contains the given substring (e.g. '/jobs', '/candidates').
// Call after a mutation so the next read bypasses the 30s cache.
export function clearGetCacheFor(urlSubstring) {
  for (const key of _getCache.keys()) {
    if (key.includes(urlSubstring)) _getCache.delete(key);
  }
}

// Prune expired entries every 60s so the Map doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _getCache) {
    if (now - v.ts > GET_CACHE_TTL) _getCache.delete(k);
  }
}, 60_000);

// ── Request interceptor: attach access token + serve cache ───────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Return cached GET response if fresh
    const cacheKey = _getCacheKey(config);
    if (cacheKey && _freshGetDepth === 0) {
      const hit = _getCache.get(cacheKey);
      if (hit && Date.now() - hit.ts < GET_CACHE_TTL) {
        config.adapter = () => Promise.resolve(hit.response);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
  { synchronous: true }
);

// ── Single-flight token refresh (shared across concurrent 401s) ──────────
let _refreshInFlight = null;
async function refreshAccessToken() {
  const token = getToken();
  if (!token || !isRealJwt(token)) throw new Error('No valid token to refresh');
  const refreshToken = localStorage.getItem('ievalx_refresh_token');
  const { data } = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    refreshToken ? { refresh_token: refreshToken } : {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!data?.Token) throw new Error('Refresh response missing Token');
  localStorage.setItem('ievalx_token', data.Token);
  if (data.Refresh_Token) localStorage.setItem('ievalx_refresh_token', data.Refresh_Token);
  scheduleRefresh();
  return data.Token;
}

const AUTH_401_PASSTHROUGH = [
  '/auth/login',
  '/auth/login-discover',
  '/auth/forgot-password',
  '/auth/reset-roles-for-email',
  '/auth/resend-reset-otp',
  '/auth/verify-reset-otp',
  '/auth/reset-password',
];

function isAuthPassthrough(url) {
  if (!url) return false;
  return AUTH_401_PASSTHROUGH.some((p) => url.includes(p));
}

// ── Response interceptor: cache GETs + on 401, refresh once and retry ────
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    const cacheKey = _getCacheKey(response.config);
    if (cacheKey) {
      _getCache.set(cacheKey, { response, ts: Date.now() });
    }
    // After any successful write (POST/PUT/PATCH/DELETE), drop all cached GETs so every tab reloads fresh data
    const method = (response.config?.method || '').toLowerCase();
    if (method && method !== 'get') {
      clearGetCache();
    }
    return response;
  },
  async (error) => {
    const original = error.config;

    // Skip refresh-and-retry for auth endpoints — their 401s are meaningful.
    if (error.response?.status === 401 && isAuthPassthrough(original?.url)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        // Reuse one in-flight refresh if several requests 401 at once
        _refreshInFlight = _refreshInFlight || refreshAccessToken().finally(() => {
          _refreshInFlight = null;
        });
        const newToken = await _refreshInFlight;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);            // retry the original request
      } catch (_e) {
        clearSession();                  // refresh failed → session truly dead
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;