import { withFreshGet } from '@/services/api/axiosInstance';

import approvalService         from '@/services/api/company/approvalService';
import pendingCandidateService from '@/services/api/employer/pendingCandidateService';
import jobService              from '@/services/api/jobseeker/jobService';
import jobseekerService        from '@/services/api/jobseeker/jobseekerService';
import overviewService         from '@/services/api/jobseeker/overviewService';
import { aiAssessmentService } from '@/services/api/jobseeker/aiAssessmentService';
import smartInterviewService   from '@/services/api/jobseeker/smartInterviewService';
import campusDriveService      from '@/services/api/jobseeker/campusDriveService';
import interviewerService      from '@/services/api/iaem/interviewerService';
import interviewerCaseService  from '@/services/api/iaem/interviewerCaseService';
import complianceService       from '@/services/api/iaem/complianceService';
import hrInterviewerService    from '@/services/api/iaem/hrInterviewerService';
import caseService             from '@/services/api/iaem/caseService';
import appealService           from '@/services/api/iaem/appealService';


export const userKeyOf = (user) =>
  user?.id ?? user?.user_id ?? user?.User_Id ?? 'anon';

// React Query does not allow `undefined` as query data → normalise to null.
const fresh = (fn) => async () => (await withFreshGet(fn)) ?? null;

/* ── Jobseeker ─────────────────────────────────────────────────────────── */
export const jobseekerQueries = {
  // → { applications: [], total }
  applications: (uk) => ({
    queryKey: ['jobseeker', uk, 'applications'],
    queryFn:  fresh(() => jobService.getApplications()),
  }),
  // → [] of saved jobs
  savedJobs: (uk) => ({
    queryKey: ['jobseeker', uk, 'savedJobs'],
    queryFn:  fresh(() => jobService.getSavedJobs()),
  }),
  // → { results: [], avg_score, best_score }
  aiInterviewSessions: (uk) => ({
    queryKey: ['jobseeker', uk, 'aiInterviewSessions'],
    queryFn:  fresh(() => smartInterviewService.getAIInterviewSessions()),
  }),
  // → []
  assessments: (uk) => ({
    queryKey: ['jobseeker', uk, 'assessments'],
    queryFn:  fresh(() => aiAssessmentService.getAssessments()),
  }),
  // → []
  documentSessions: (uk) => ({
    queryKey: ['jobseeker', uk, 'documentSessions'],
    queryFn:  fresh(() => smartInterviewService.getDocumentBasedSessions()),
  }),
  // → [] (service already filters upcoming)
  liveInterviewSlots: (uk) => ({
    queryKey: ['jobseeker', uk, 'liveInterviewSlots'],
    queryFn:  fresh(() => smartInterviewService.getLiveInterviewSlots()),
  }),
  // → [] (service already filters upcoming)
  campusDriveUpcoming: (uk) => ({
    queryKey: ['jobseeker', uk, 'campusDriveUpcoming'],
    queryFn:  fresh(() => campusDriveService.getUpcoming()),
  }),
  // → { jobs: [] } | { results: [] } | []
  jobs: (uk, filters = {}) => ({
    queryKey: ['jobseeker', uk, 'jobs', filters],
    queryFn:  fresh(() => jobService.listJobs(filters)),
  }),
  // → response body of GET /jobseeker/skills/:id  ({ skills: [] } | [])
  //   null when there is no candidate id (same as before)
  skills: (uk, candidateId) => ({
    queryKey: ['jobseeker', uk, 'skills', candidateId ?? null],
    queryFn:  fresh(() => (candidateId
      ? jobseekerService.getSkills(candidateId).then((r) => r?.data)
      : null)),
  }),
  // → { industry_readiness, interviews, applications, rounds, ... }
  candidatePerformance: (uk) => ({
    queryKey: ['jobseeker', uk, 'candidatePerformance'],
    queryFn:  fresh(() => overviewService.getCandidatePerformance()),
  }),
};

/* ── Employer ──────────────────────────────────────────────────────────── */
export const employerQueries = {
  // → { data: [] }
  pendingCandidates: (uk) => ({
    queryKey: ['employer', uk, 'pendingCandidates'],
    queryFn:  fresh(() => pendingCandidateService.getPendingCandidates()),
  }),
  // → { registrations: [] }
  interviewerApprovalQueue: (uk) => ({
    queryKey: ['employer', uk, 'interviewerApprovalQueue'],
    queryFn:  fresh(() => hrInterviewerService.getApprovalQueue().then((r) => r.data)),
  }),
  // → { cases: [] }
  openCases: (uk) => ({
    queryKey: ['employer', uk, 'caseQueue', 'OPEN'],
    queryFn:  fresh(() => caseService.getCaseQueue({ state: 'OPEN' }).then((r) => r.data)),
  }),
  // → { appeals: [] }
  pendingAppeals: (uk) => ({
    queryKey: ['employer', uk, 'appealsQueue', 'PENDING'],
    queryFn:  fresh(() => appealService.getAppealsQueue({ status: 'PENDING' }).then((r) => r.data)),
  }),
};

/* ── Company ───────────────────────────────────────────────────────────── */
export const companyQueries = {
  // → { pending, ... }   (disabled when companyId is unknown — same as before)
  approvalStats: (uk, companyId) => ({
    queryKey: ['company', uk, 'approvalStats', companyId],
    queryFn:  fresh(() => approvalService.getStats(companyId)),
    enabled:  companyId != null,
  }),
  // → []
  pendingEditRequests: (uk) => ({
    queryKey: ['company', uk, 'editRequests', 'PENDING'],
    queryFn:  fresh(() => approvalService.listEditRequests('PENDING')),
  }),
  // → []
  pendingRepublishRequests: (uk) => ({
    queryKey: ['company', uk, 'republishRequests', 'PENDING'],
    queryFn:  fresh(() => approvalService.listRepublishRequests('PENDING')),
  }),
};

/* ── Interviewer ───────────────────────────────────────────────────────── */
export const interviewerQueries = {
  // → { calibration_due, pending_submissions, open_cases, pending_slot_requests, ... }
  dashboardSummary: (uk) => ({
    queryKey: ['interviewer', uk, 'dashboardSummary', { page_size: 1 }],
    queryFn:  fresh(() => interviewerService.getDashboardSummary({ page_size: 1 }).then((r) => r.data)),
  }),
  // → { cases: [] }
  myCases: (uk) => ({
    queryKey: ['interviewer', uk, 'myCases'],
    queryFn:  fresh(() => interviewerCaseService.getMyCases().then((r) => r.data)),
  }),
  // → { requests: [] }
  slotRequests: (uk) => ({
    queryKey: ['interviewer', uk, 'slotRequests'],
    queryFn:  fresh(() => interviewerService.getSlotRequests().then((r) => r.data)),
  }),
};

/* ── Compliance ────────────────────────────────────────────────────────── */
export const complianceQueries = {
  // → { total, ... }
  unreadAlerts: (uk) => ({
    queryKey: ['compliance', uk, 'alerts', { unread: 'true', page_size: 1 }],
    queryFn:  fresh(() => complianceService.getAlerts({ unread: 'true', page_size: 1 }).then((r) => r.data)),
  }),
  // → { pending: [] }
  coSignQueue: (uk) => ({
    queryKey: ['compliance', uk, 'coSignQueue'],
    queryFn:  fresh(() => complianceService.getCoSignQueue().then((r) => r.data)),
  }),
};