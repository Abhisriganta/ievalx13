/* ══════════════════════════════════════════════════════════════════════════
   ABOUT iEVALX — content for /platform/about-ievalx
   Rendered by AboutIevalxPage.jsx. Text only — no layout here.
   Flow mirrors the real backend: ms-jobseeker, ms-jobs, ms-employer,
   ms-interview, ms-assessment, ms-iaem, ms-admin.
   ══════════════════════════════════════════════════════════════════════════ */

export const ABOUT_HERO = {
  eyebrow: "About iEvalX",
  title: "How iEvalX Works, Step by Step",
  subtitle:
    "Real talent, a fair process and outcomes you can trust. See exactly what happens from sign-up to hire, for jobseekers and for companies.",
  intro:
    "iEvalX is a job portal where every company is verified, every candidate is scored and every interviewer is audited — all in one place, from job post to offer letter.",
};

export const AUDIENCES = {
  /* ─────────────────────────── JOBSEEKERS ─────────────────────────── */
  seeker: {
    tab: "For Jobseekers",
    promise: "Verified companies. Verified jobs.",
    lead: "Seven steps from your first sign-up to your offer — with your skills visible at every stage.",
    steps: [
      {
        title: "Create your account",
        where: "Register",
        desc: "Sign up with your email and confirm it with a one-time code.",
      },
      {
        title: "Build your profile",
        where: "Profile",
        desc: "Add your resume, skills, education, experience, projects and languages. This is what employers see when you apply.",
      },
      {
        title: "Take the Quick Interview",
        where: "Profile → Take Quick Interview",
        desc: "A 10-minute voice interview built from your own resume.",
        points: [
          "Quick face check before you begin",
          "Retake any time, with fresh questions",
        ],
        result: "Your CIR: an overall score out of 10, six skill scores, strengths, gaps and a PDF report for you — recruiters see only your score, next to your application.",
      },
      {
        title: "Check and improve your resume",
        where: "Resume Builder",
        desc: "IRS checks your resume against real job descriptions for the role and level you pick.",
        points: [
          "See the skills you have and the ones you're missing",
          "Edit in place, keep two tailored versions",
          "AI assistant and job-description tailoring",
          "Share your resume as a PDF link",
        ],
        result: "A skill-gap report you can download and work from.",
      },
      {
        title: "Find and apply",
        where: "Find Jobs → Applied Jobs",
        desc: "Only published jobs from verified companies, approved before they go live.",
        points: [
          "A match score for your resume against each job",
          "Track every application: Applied → Shortlisted → Selected",
          "Save jobs for later, withdraw any time before a decision",
        ],
      },
      {
        title: "Complete your rounds",
        where: "Assessments · Smart Interviews",
        desc: "Each recruiter picks which of these rounds a job needs and in what order — not every job has all of them. You get one round at a time; the next opens only after you clear the current one. You're notified by email and in-app.",
        points: [
          "Assessment — MCQ, short answer, scenario and coding",
          "AI Interview — communication, technical and HR sections",
          "Document Interview — questions from the employer's document",
          "Live Interview — book a slot with a verified interviewer",
          "Campus Drive — AI interviews for placement drives",
          "Every assessment and AI interview is protected by 35+ proctoring checks",
        ],
      },
      {
        title: "Get your result",
        where: "Notifications · Applied Jobs",
        desc: "The employer moves you forward, puts you on hold or closes your application after each round.",
        result: "If selected: a direct call, an offer letter by email, or the company's own process.",
      },
    ],
    dashboardTitle: "Inside Your Dashboard",
    dashboard: [
      { name: "Overview",              desc: "Your scores, recommended jobs and quick stats." },
      { name: "Find Jobs",             desc: "Verified jobs with filters and match scores." },
      { name: "Applied & Saved Jobs",  desc: "Every application and its current status." },
      { name: "Assessments",           desc: "Tests sent to you by employers." },
      { name: "Smart Interviews",      desc: "AI, document, live and campus drive interviews." },
      { name: "AI Practice Interview", desc: "Rehearse by voice and get a readiness score per skill." },
      { name: "Candidate Performance", desc: "Your scores and interview history over time." },
      { name: "Resume Builder",        desc: "Build, check with IRS and tailor your resume." },
      { name: "Feed & Notifications",  desc: "Company posts, updates and round invites." },
    ],
    advantages: [
      "Apply only to jobs from verified companies",
      "Your CIR shows employers what you can do, not just your CV",
      "Know your skill gaps before the interviewer does",
      "Practise unlimited times before the real interview",
      "Live interviews are taken by audited interviewers",
      "Track every round and decision in one place",
    ],
    cta: { label: "Create your free account", action: "seeker" },
    closing: {
      title: "Let your skills speak before your resume does.",
      desc: "Sign up, take the Quick Interview and apply to verified jobs today.",
    },
  },

  /* ─────────────────────────── COMPANIES ─────────────────────────── */
  company: {
    tab: "For Companies",
    promise: "Save time and cost on every hire.",
    lead: "Eight steps from registration to hire — with proof behind every decision.",
    steps: [
      {
        title: "Register and get verified",
        where: "Company Registration",
        desc: "Add company, admin and address details, then all required documents.",
        points: [
          "The iEvalX team checks every document",
          "Rejected documents come back with a reason to re-upload",
        ],
        result: "Login opens once your company is verified.",
      },
      {
        title: "Set up your team",
        where: "Company Admin → Employers · Interviewers · Compliance Officers",
        desc: "Add the people who will hire with you.",
        points: [
          "Recruiters with roles — Hiring Manager, Senior Recruiter, Recruiter, HR Admin, Others",
          "Login details are emailed; password change on first login",
          "Invite interviewers and add compliance officers",
        ],
      },
      {
        title: "Post and approve jobs",
        where: "Job Postings · Jobs & Approvals",
        desc: "Jobs posted by the company admin go live straight away. Recruiter jobs wait for admin approval.",
        points: [
          "Rejected jobs return with a reason",
          "Edits and republishing need admin approval",
          "Assign a job to another recruiter any time",
          "Jobs close automatically on their deadline",
        ],
      },
      {
        title: "Review applicants",
        where: "Recruiter → Jobs & Applicants",
        desc: "Every applicant arrives with a resume match score and their Quick Interview CIR score.",
        points: ["Shortlist or reject one by one or in bulk"],
      },
      {
        title: "Build your hiring pipeline",
        where: "Scheduling Hub",
        desc: "Add shortlisted candidates and choose the rounds this job needs, in order.",
        points: [
          "Assessment, AI Interview, Document Interview or Live",
          "Set duration and time window per round",
          "AI drafts the assessment from your documents— nothing goes live until you approve",
          "Several pipelines per job, each with its own openings",
        ],
      },
      {
        title: "Run rounds and decide",
        where: "Scheduled Rounds → Round Approvals",
        desc: "Candidates in each round are ranked by a score.",
        points: ["Approve to the next round, hold or reject — you decide every move"],
      },
      {
        title: "Hire",
        where: "Pending Candidates → Final Hire",
        desc: "Candidates on hold wait in Pending and can be recalled into a new round. Final-round approvals move to Final Hire.",
        points: ["Hire by direct call, an offer letter emailed by iEvalX, or your own process"],
        result: "Openings filled are tracked against openings posted.",
      },
      {
        title: "Audit every live interview (IAEM)",
        where: "Interviewer Audit · Compliance",
        desc: "Live interviews are taken by verified interviewers and checked after every session.",
        points: [
          "Interviewers are approved by two different people and accept consent terms",
          "Only skill-matched interviewers offer slots; only eligible candidates can book",
          "Interviewers score without seeing the AI score — it's revealed after they submit",
          "8 audit checks on every interview, from score gaps to conduct",
          "Flagged interviews open a case with a deadline; formal action needs a second approver",
          "Compliance officers see alerts, co-sign requests and the full audit trail",
        ],
      },
    ],
    dashboardTitle: "Inside Your Dashboards",
    dashboard: [
      { name: "Company Overview",       desc: "Team workload, AI usage and recent activity." },
      { name: "Employers & Roles",      desc: "Add recruiters and control what they can do." },
      { name: "Jobs & Approvals",       desc: "Approve, reject and assign every job." },
      { name: "Employer Requests",      desc: "Edit and republish requests from recruiters." },
      { name: "Recruiter Overview",     desc: "Active jobs, applicants and your hiring funnel." },
      { name: "Scheduling Hub",         desc: "Pipelines, rounds and time windows." },
      { name: "Round Approvals",        desc: "Ranked results and decisions per round." },
      { name: "Final Hire",             desc: "Hiring outcomes, offer letters and openings filled." },
      { name: "Interviewer Audit",      desc: "Approvals, scheduling, cases, appeals and calibration." },
      { name: "Compliance",             desc: "Critical alerts, co-sign queue and audit trail." },
      { name: "Analytics & Engagement", desc: "Hiring insights and company posts." },
    ],
    advantages: [
      "Applicants arrive with a match score and a verified CIR score",
      "Two-level job approval keeps every posting on brand",
      "Assessments and AI interviews protected by 35+ proctoring checks",
      "Every round — AI, document, live — runs in one portal",
      "Interviewers are audited, not just candidates",
      "A full audit trail behind every hiring decision",
    ],
    cta: { label: "Register your company", action: "company" },
    closing: {
      title: "Hire on proof, not promises.",
      desc: "Register your company, get verified and post your first job.",
    },
  },
};

export const AUDIENCE_ORDER = ["seeker", "company"];

/* "Typical job portal vs iEvalX" — shared, not audience-specific. */
export const COMPARISON = {
  eyebrow: "Why iEvalX Is Different",
  title: "Not Just Another Job Portal",
  rows: [
    { topic: "Companies",     typical: "Anyone can post a job",              ievalx: "Every company verified by document checks" },
    { topic: "Jobs",          typical: "Live as soon as they're posted",     ievalx: "Approved by the company admin first" },
    { topic: "Your profile",  typical: "A resume in a pile",                 ievalx: "Your CIR score and match score with every application" },
    { topic: "Resume help",   typical: "Generic keyword tips",               ievalx: "IRS skill gaps from real job descriptions" },
    { topic: "Rounds",        typical: "Spread across email and other tools", ievalx: "Assessments, AI, document and live — one portal" },
    { topic: "Fair play",     typical: "No proctoring",                      ievalx: "35+ proctoring checks on tests and AI interviews" },
    { topic: "Interviewers",  typical: "Never reviewed",                     ievalx: "Audited after every live interview" },
  ],
};