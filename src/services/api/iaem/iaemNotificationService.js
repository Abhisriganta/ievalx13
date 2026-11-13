
import api from '../axiosInstance';

const BASE = '/iaem/notifications';

let _unreadPromise = null;
let _unreadCache = null;
let _unreadCacheTime = 0;

const iaemNotificationService = {

  getNotifications: (params = {}) =>
    api.get(`${BASE}/`, { params }),


  // ── Mark single notification as read ──────────────────────────────────
  // POST /api/iaem/notifications/<id>/read/
  markAsRead: (notificationId) =>
    api.post(`${BASE}/${notificationId}/read/`),

  // ── Mark all as read ──────────────────────────────────────────────────
  // POST /api/iaem/notifications/read-all/
  // Returns: { success, marked: <count> }
  markAllAsRead: () =>
    api.post(`${BASE}/read-all/`),

  getUnreadCount: (params = {}) => {
    const now = Date.now();
    if (_unreadCache && now - _unreadCacheTime < 10000) return Promise.resolve(_unreadCache);
    if (_unreadPromise) return _unreadPromise;
    _unreadPromise = api.get(`${BASE}/unread-count/`, { params })
      .then(res => { _unreadCache = res; _unreadCacheTime = Date.now(); return res; })
      .finally(() => { _unreadPromise = null; });
    return _unreadPromise;
  },
  // ── Delete single notification ──────────────────────────────────────
  deleteOne: (notificationId) =>
    api.delete(`${BASE}/${notificationId}/delete/`),

  // ── Delete all notifications ────────────────────────────────────────
  deleteAll: () =>
    api.delete(`${BASE}/delete-all/`),
};

export default iaemNotificationService;
