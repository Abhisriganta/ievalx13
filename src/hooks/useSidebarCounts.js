import { useEffect } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants';
import {
  userKeyOf,
  jobseekerQueries,
  employerQueries,
  companyQueries,
  interviewerQueries,
  complianceQueries,
} from '@/hooks/queries/sharedQueries';



const UPCOMING_STATUSES = new Set(['scheduled', 'invited', 'in_progress']);
const isUpcoming = (iv) => UPCOMING_STATUSES.has(iv?.status);

const ACTOR_COMPANY = 'COMPANY';

// Mirrors the resolution used in useJobsApprovals.js — company id can live
// on several keys, and for a company login the user's own id IS the company id.
const resolveCompanyId = (user) => {
  const rawRole      = user?.role || user?.User_Role || user?.user_role || '';
  const rawActorType = user?.actor_type || user?.Actor_Type || '';
  const isCompanyLogin =
    rawActorType.toUpperCase() === ACTOR_COMPANY ||
    rawRole.toLowerCase()      === 'company';
  return (
    user?.company_id ??
    user?.companyId  ??
    user?.Company_Id ??
    (isCompanyLogin ? (user?.id ?? user?.User_Id ?? user?.user_id) : null)
  );
};

// First segment of every queryKey for a role (see hooks/queries/sharedQueries.js)
const ROLE_SEGMENT = {
  [ROLES.COMPANY]:     'company',
  [ROLES.EMPLOYER]:    'employer',
  [ROLES.INTERVIEWER]: 'interviewer',
  [ROLES.COMPLIANCE]:  'compliance',
  [ROLES.JOBSEEKER]:   'jobseeker',
};

// Same endpoints, same order, as the old Promise.all per role.
const buildQueries = (role, user) => {
  const uk = userKeyOf(user);
  if (role === ROLES.COMPANY) {
    return [
      companyQueries.approvalStats(uk, resolveCompanyId(user)),
      companyQueries.pendingEditRequests(uk),
      companyQueries.pendingRepublishRequests(uk),
    ];
  }
  if (role === ROLES.EMPLOYER) {
    return [
      employerQueries.pendingCandidates(uk),
      employerQueries.interviewerApprovalQueue(uk),
      employerQueries.openCases(uk),
      employerQueries.pendingAppeals(uk),
    ];
  }
  if (role === ROLES.INTERVIEWER) {
    return [
      interviewerQueries.dashboardSummary(uk),
      interviewerQueries.myCases(uk),
      interviewerQueries.slotRequests(uk),
    ];
  }
  if (role === ROLES.COMPLIANCE) {
    return [
      complianceQueries.unreadAlerts(uk),
      complianceQueries.coSignQueue(uk),
    ];
  }
  if (role === ROLES.JOBSEEKER) {
    return [
      jobseekerQueries.applications(uk),
      jobseekerQueries.savedJobs(uk),
      jobseekerQueries.assessments(uk),
      jobseekerQueries.documentSessions(uk),
      jobseekerQueries.aiInterviewSessions(uk),
      jobseekerQueries.liveInterviewSlots(uk),
      jobseekerQueries.campusDriveUpcoming(uk),
    ];
  }
  return [];
};

// Same counting logic as before. `d` = query data in buildQueries order
// (undefined when a query is loading / failed — same as old safe() → null).
const computeCounts = (role, d) => {
  const next = {};

  if (role === ROLES.COMPANY) {
    const [stats, edits, republish] = d;
    if (stats && typeof stats.pending === 'number') next.jobsPending = stats.pending;
    if (Array.isArray(edits))     next.editRequests      = edits.length;
    if (Array.isArray(republish)) next.republishRequests = republish.length;
    next.employerRequestsTotal =
      (next.editRequests || 0) + (next.republishRequests || 0);

  } else if (role === ROLES.EMPLOYER) {
    const [pending, approvals, cases, appeals] = d;
    // getPendingCandidates() returns { data: rows }
    const pendingList = Array.isArray(pending) ? pending : pending?.data;
    if (Array.isArray(pendingList)) next.pendingCandidates = pendingList.length;
    const approvalList = approvals?.registrations;
    if (Array.isArray(approvalList)) next.pendingApprovals = approvalList.length;
    const caseList = cases?.cases;
    if (Array.isArray(caseList)) next.openCases = caseList.length;
    const appealList = appeals?.appeals;
    if (Array.isArray(appealList)) next.pendingAppeals = appealList.length;
    next.iaemTotal =
      (next.pendingApprovals || 0) +
      (next.openCases || 0) +
      (next.pendingAppeals || 0);

  } else if (role === ROLES.INTERVIEWER) {
    const [dashboard, myCases, mySlots] = d;
    if (dashboard) {
      if (typeof dashboard.calibration_due === 'number')
        next.calibrationDue = dashboard.calibration_due;
      if (typeof dashboard.pending_submissions === 'number')
        next.pendingSubmissions = dashboard.pending_submissions;
    }
    // Trust actual list endpoints over dashboard summary counts
    const caseList = myCases?.cases;
    next.openCases = Array.isArray(caseList) ? caseList.length : (dashboard?.open_cases || 0);
    const slotList = mySlots?.requests;
    next.pendingSlotRequests = Array.isArray(slotList)
      ? slotList.filter(r => !r.deadline || new Date(r.deadline) >= new Date()).length
      : (dashboard?.pending_slot_requests || 0);

  } else if (role === ROLES.COMPLIANCE) {
    const [alerts, cosigns] = d;
    if (typeof alerts?.total === 'number') next.criticalAlerts = alerts.total;
    const cosignList = cosigns?.pending;
    if (Array.isArray(cosignList)) next.pendingCoSigns = cosignList.length;

  } else if (role === ROLES.JOBSEEKER) {
    const [apps, saved, assess, docSess, aiSess, liveSlots, campus] = d;
    // getApplications() returns { applications, total }
    const appList = Array.isArray(apps) ? apps : apps?.applications;
    if (Array.isArray(appList)) next.appliedJobs = appList.length;
    if (Array.isArray(saved))   next.savedJobs   = saved.length;
    if (Array.isArray(assess)) {
      next.aiAssessments = assess.filter((a) => a?.status === 'not_started').length;
    }
    if (Array.isArray(docSess)) next.docInterviews = docSess.filter(isUpcoming).length;
    // getAIInterviewSessions() returns { results, avg_score, best_score }
    const aiList = Array.isArray(aiSess) ? aiSess : aiSess?.results;
    if (Array.isArray(aiList))    next.aiInterviews  = aiList.filter(isUpcoming).length;
    if (Array.isArray(liveSlots)) next.bookInterview = liveSlots.length; // service already filters upcoming
    if (Array.isArray(campus))    next.campusDrive   = campus.length;    // getUpcoming() already filters
    next.smartInterviewsTotal =
      (next.docInterviews || 0) +
      (next.aiInterviews  || 0) +
      (next.bookInterview || 0) +
      (next.campusDrive   || 0);
  }

  return next;
};

export default function useSidebarCounts() {
  const { role, user } = useAuth();
  const queryClient = useQueryClient();

  const ready   = Boolean(role && user);
  const queries = ready ? buildQueries(role, user) : [];

  const results = useQueries({ queries });

  const roleSegment = ROLE_SEGMENT[role];
  const userKey     = userKeyOf(user);
  useEffect(() => {
    if (!ready || !roleSegment) return;
    queryClient.refetchQueries(
      { queryKey: [roleSegment, userKey], stale: true, type: 'active' },
      { cancelRefetch: false },
    );
   }, [ready, roleSegment, userKey, queryClient]);

  useEffect(() => {
    if (!ready || roleSegment !== 'jobseeker') return;
    const onJobsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['jobseeker', userKey, 'savedJobs'], exact: true });
    };
    window.addEventListener('jobs-updated', onJobsUpdated);
    return () => window.removeEventListener('jobs-updated', onJobsUpdated);
  }, [ready, roleSegment, userKey, queryClient]);

  if (!ready) return {};
  return computeCounts(role, results.map((r) => r.data));
}