
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRefetchOnFocus } from '@/hooks/useRefetchOnFocus';
import complianceOfficerService from '@/services/api/company/complianceOfficerService';

let _officersCache = null;

const getBackendError = (err, fallback) =>
  err?.response?.data?.Error
  || err?.response?.data?.message
  || err?.response?.data?.error
  || err?.message
  || fallback;

const useComplianceOfficers = ({ formOpen = false } = {}) => {
  const [officers, setOfficers] = useState(() => _officersCache || []);
  const [loading,  setLoading]  = useState(() => !_officersCache);
  const [error,    setError]    = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchOfficers = useCallback(async () => {
    setError(null);
    try {
      const res = await complianceOfficerService.getOfficers();

      const list =
        res?.data?.results
        || res?.data?.Officers
        || res?.data?.officers
        || res?.data?.data
        || res?.data
        || [];
      const arr = Array.isArray(list) ? list : [];
      if (mountedRef.current) setOfficers(arr);
      return arr;
    } catch (err) {
      const msg = getBackendError(err, 'Failed to load compliance officers.');
      if (mountedRef.current) setError(msg);
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers().catch(() => { /* error already captured in state */ });
  }, [fetchOfficers]);


  useEffect(() => { _officersCache = officers; }, [officers]);

  useRefetchOnFocus(fetchOfficers, { enabled: !formOpen });

  // ── Add ──────────────────────────────────────────────────────────────────
  const addOfficer = useCallback(async (payload) => {
    try {
      const res = await complianceOfficerService.addOfficer(payload);
      const newOfficer = res?.data?.data || {
        id: Date.now(),
        ...payload,
        status: 'INACTIVE',
        joined: new Date().toISOString(),
      };
      const emailSent = res?.data?.emailSent ?? res?.data?.email_sent;

      if (mountedRef.current) {
        setOfficers((prev) => [newOfficer, ...prev]);
      }
      return { data: newOfficer, emailSent };
    } catch (err) {
      err.friendlyMessage = getBackendError(err, 'Failed to add compliance officer.');
      throw err;
    }
  }, []);

  // ── Edit ──────────────────────────────────────────────────────────────────
  const editOfficer = useCallback(async (id, payload) => {
    try {
      const res = await complianceOfficerService.editOfficer(id, payload);
      const updated = res?.data?.data || payload;
      if (mountedRef.current) {
        setOfficers((prev) =>
          prev.map((o) => (o.id === id ? { ...o, ...updated } : o))
        );
      }
      return updated;
    } catch (err) {
      err.friendlyMessage = getBackendError(err, 'Failed to update compliance officer.');
      throw err;
    }
  }, []);

  // ── Toggle status (optimistic) ───────────────────────────────────────────
  const toggleStatus = useCallback(async (officer) => {
    if (!officer?.id) throw new Error('toggleStatus called without a valid officer.');
    try {
      const res = await complianceOfficerService.toggleOfficerStatus(officer.id);
      const newStatus = res?.data?.status
        || (String(officer.status).toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');

      if (mountedRef.current) {
        setOfficers((prev) =>
          prev.map((o) => (o.id === officer.id ? { ...o, status: newStatus } : o))
        );
      }
      return newStatus;
    } catch (err) {
      err.friendlyMessage = getBackendError(err, 'Failed to update status.');
      throw err;
    }
  }, []);

  // ── Remove ───────────────────────────────────────────────────────────────
  const removeOfficer = useCallback(async (id) => {
    try {
      await complianceOfficerService.removeOfficer(id);
      if (mountedRef.current) {
        setOfficers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      err.friendlyMessage = getBackendError(err, 'Failed to remove compliance officer.');
      throw err;
    }
  }, []);

  return {
    officers,
    loading,
    error,
    refetch: fetchOfficers,
    addOfficer,
    editOfficer,
    toggleStatus,
    removeOfficer,
  };
};

export default useComplianceOfficers;
