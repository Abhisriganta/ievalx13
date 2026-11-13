import { useState, useEffect, useCallback, useRef } from 'react';
import jobService from '../../services/api/employer/jobService';
import { withFreshGet } from '../../services/api/axiosInstance';
import { useRefetchOnFocus } from '../useRefetchOnFocus';

/**
 * @param {string} statusFilter — one of the display labels accepted by the
 *   backend's DISPLAY_STATUS_FILTER_MAP: 'all' | 'Active' | 'Offline' |
 *   'Draft' | 'Pending Approval' | 'Closed' | 'Rejected' | 'Removed'.
 */
export const useEmployerJobs = (statusFilter = 'all', { formOpen = false } = {}) => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  /* ── Fetch ──────────────────────────────────────────────────────── */
  const refresh = useCallback(async () => {
    if (isMountedRef.current) {
      if (!hasLoadedRef.current) setLoading(true);   
      setError('');
    }
    try {
      const data = await jobService.listMyJobs(statusFilter);
      if (!isMountedRef.current) return;
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      hasLoadedRef.current = true;
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useRefetchOnFocus(refresh, { enabled: !formOpen });

  const createJob = useCallback(async (payload) => {
    const res = await jobService.createJob(payload);
    withFreshGet(() => refresh());  // bypass GET cache after mutation
    return res;
  }, [refresh]);

  const updateJob = useCallback(async (id, payload) => {
    const res = await jobService.updateJob(id, payload);
    withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const deleteJob = useCallback(async (id) => {
    const res = await jobService.deleteJob(id);
    // Optimistic: remove locally, background refresh for server truth
    setJobs((prev) => prev.filter((j) => (j.job_id ?? j.id) !== id));
    withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const submitForApproval = useCallback(async (id) => {
    const res = await jobService.submitForApproval(id);
    setJobs((prev) => prev.map((j) => (j.job_id ?? j.id) === id ? { ...j, status: 'PENDING_APPROVAL' } : j));
    withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const publishJob = useCallback(async (id) => {
    const res = await jobService.publishJob(id);
    setJobs((prev) => prev.map((j) => (j.job_id ?? j.id) === id ? { ...j, status: 'PUBLISHED' } : j));
    withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const unpublishJob = useCallback(async (id) => {
    const res = await jobService.unpublishJob(id);
    setJobs((prev) => prev.map((j) => (j.job_id ?? j.id) === id ? { ...j, status: 'UNPUBLISHED' } : j));
    withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  /* ── Edit-access flow ──────────────────────────────────────────── */
  const requestEditAccess = useCallback(async (id, reason) => {
    const res = await jobService.requestEditAccess(id, reason);
    await withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const getEditRequestStatus = useCallback(
    (id) => jobService.getEditRequestStatus(id),
    []
  );

  /* ── Republish-request flow ────────────────────────────────────── */
  const requestRepublish = useCallback(async (id, reason) => {
    const res = await jobService.requestRepublish(id, reason);
    await withFreshGet(() => refresh());
    return res;
  }, [refresh]);

  const getRepublishRequestStatus = useCallback(
    (id) => jobService.getRepublishRequestStatus(id),
    []
  );

  // Read-only — no list refresh needed.
  const getJobDetail = useCallback((id) => jobService.getJobDetail(id), []);

  return {
    jobs,
    loading,
    error,
    refresh,
    createJob,
    updateJob,
    deleteJob,
    submitForApproval,
    publishJob,
    unpublishJob,
    requestEditAccess,
    getEditRequestStatus,
    requestRepublish,
    getRepublishRequestStatus,
    getJobDetail,
  };
};

export default useEmployerJobs;