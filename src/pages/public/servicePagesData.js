/* ══════════════════════════════════════════════════════════════════════════
   SERVICE PAGES — content for /services/:slug
   One entry per Services mega-menu link ("Talk to us" stays on /support).
   ServicePage.jsx renders every entry with the same layout as the Platform
   feature pages:
     hero → what it is → how it works → blocks[] → what you get →
     what makes it different → closing CTA
   `cta.action` keys are resolved in ServicePage.jsx (auth-aware redirects).
   No FAQs by design — FAQs live on the landing page only.
   ══════════════════════════════════════════════════════════════════════════ */

export const SERVICE_PAGES = {
  /* ── For candidates ──────────────────────────────────────────────────── */
  "ai-interviews": {
    eyebrow: "AI Interviews",
    title: "An Interview That Listens to Every Answer the Same Way",
    subtitle:
      "When an employer adds an AI interview round, you talk to an AI interviewer that knows the job and your resume. Same standard, same scoring, for every candidate.",
    cta: { label: "Go to My Interviews", action: "aiInterviews" },
    whatItIs:
      "An AI interview is a real hiring round, set by the employer for a specific job. The AI interviewer asks about the role and your experience, follows up on your answers and scores you on the spot.",
    steps: [
      { title: "Get invited", desc: "When you reach an AI interview round, it shows up in your dashboard." },
      { title: "Verify and join", desc: "A quick face check, then the interview starts by voice." },
      { title: "Talk it through", desc: "Questions come from the job description and your resume, with natural follow-ups." },
      { title: "See your results", desc: "Your scores are ready when you finish, and the employer sees the same report." },
    ],
    blocks: [

      {
        type: "cards",
        eyebrow: "Your Results · CIR Scores",
        title: "Six Competencies. One Score Out of 10.",
        intro: "Every AI interview is scored on the same six competencies as your Candidate Intelligence Report.",
        items: [
          { title: "Technical",       desc: "Depth on the skills the job needs." },
          { title: "Communication",   desc: "How clearly you explain your work." },
          { title: "Problem Solving", desc: "How you reason through a question." },
          { title: "Confidence",      desc: "Steadiness and ownership in your answers." },
          { title: "Clarity",         desc: "Structured, to-the-point responses." },
          { title: "Relevance",       desc: "Answers that stay on the question." },
        ],
      },
    ],
    benefits: [
      "Every candidate for the job is scored on the same rubric",
      "No interviewer mood, no time-of-day bias",
      "Proctored, so honest answers aren't undercut by shortcuts",
      "Results ready the moment you finish",
    ],
    different:
      "Most AI interview tools read from a fixed script. iEvalX builds the conversation from the job and your resume, and it follows up like a real interviewer.",
    closing: { title: "Your next interview could be the fairest one you've had.", desc: "Find your AI interview rounds in your dashboard." },
  },

  assessments: {
    eyebrow: "Assessments",
    title: "Tests Built for the Job, Guarded for Fairness",
    subtitle:
      "Take skill assessments made for the exact role you applied to, with coding in a built-in editor and 35+ checks that keep every result honest.",
    cta: { label: "Go to My Assessments", action: "assessments" },
    whatItIs:
      "An assessment is a timed test an employer adds to their hiring pipeline. It's built from the job description, so you're tested on what the role actually needs.",
    steps: [
      { title: "Check your setup", desc: "Camera, microphone and fullscreen are checked before you start." },
      { title: "Verify it's you", desc: "A quick face match against your profile photo." },
      { title: "Take the test", desc: "Multiple choice, scenarios, written answers or coding, depending on the job." },
      { title: "Submit and move on", desc: "Your result goes straight into the employer's ranked list." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "35+ Proctoring Checks",
        title: "What's Checked During Your Test",
        items: [
          { title: "Identity",     desc: "Your face, matched to your profile photo all session. A second voice." },
          { title: "Surroundings", desc: "A phone, book or another person in frame. Looking away for long." },
          { title: "Browser",      desc: "Leaving the tab, exiting fullscreen, copy-paste, developer tools." },
          { title: "Device",       desc: "Remote-desktop tools, virtual cameras and virtual machines." },
        ],
      },
    ],
    benefitsTitle: "Fair to You",
    benefits: [
      "You see a live warning before anything counts against you",
      "Employers see a timeline with snapshots, not a single label",
      "Everyone is held to the same rules",
      "Honest candidates aren't outscored by shortcuts",
    ],
    different:
      "Generic tests ask the same questions for every job. iEvalX tests are built from the role you applied to, and 35+ checks make sure your honest score stands.",
    closing: { title: "Show what you can do, on a test that's fair to everyone.", desc: "Your assessments are waiting in your dashboard." },
  },

  "live-interviews": {
    eyebrow: "Live Interviews",
    title: "Pick Your Slot. Meet a Skill-Matched Interviewer.",
    subtitle:
      "When you reach a live round, book a time that suits you and join a video interview with an interviewer chosen for the job's skills.",
    cta: { label: "Book My Interview", action: "liveInterview" },
    whatItIs:
      "Live interviews are the human rounds of a hiring pipeline. iEvalX handles the scheduling, the video room and the fairness checks, so you can focus on the conversation.",
    steps: [
      { title: "See open slots", desc: "When you reach a live round, available times appear in your dashboard." },
      { title: "Book in one click", desc: "Choose the slot that works for you. No email back-and-forth." },
      { title: "Check in", desc: "A quick face check, then a waiting room until the interviewer admits you." },
      { title: "Interview live", desc: "Video, screen share and chat in one room." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "In the Interview Room",
        title: "Everything You Need, in One Room",
        items: [
          { title: "Waiting room",      desc: "Join early and get admitted when the interviewer is ready." },
          { title: "Screen share",      desc: "Walk through your code, portfolio or slides." },
          { title: "Chat",              desc: "Share links or snippets without leaving the call." },
          { title: "Noise suppression", desc: "Your voice comes through clearly, even from a busy room." },
        ],
      },
      {
        type: "callout",
        eyebrow: "Fair to You",
        title: "The Interviewer Is Audited Too",
        text: "Every live interview is audited by IAEM. Off-topic questions, unfair scoring or rude conduct get flagged and reviewed, so one bad interviewer can't decide your outcome alone.",
      },
    ],
    benefits: [
      "Book the slot yourself, whenever it suits you",
      "Interviewers matched to the job's skills",
      "Video, screen share and chat in one room",
      "Every interview reviewed for fairness",
    ],
    different:
      "On most portals, you wait for someone to email you a time. On iEvalX, you book the slot yourself, and the interviewer is checked as carefully as you are.",
    closing: { title: "Your time, your slot, a fair interview.", desc: "Open slots appear in your dashboard when you reach a live round." },
  },

  /* ── For employers ───────────────────────────────────────────────────── */
  "employer-suite": {
    eyebrow: "Employer Suite",
    title: "Everything a Recruiter Does, in One Dashboard",
    subtitle:
      "Post jobs, shortlist applicants, run every round and close the hire. The Employer Suite is where your recruiters do their daily hiring work.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "Employers are the recruiters and HR members your company admin adds to iEvalX. Each one owns their jobs from posting to final hire, with a role that decides what they can do.",
    steps: [
      { title: "Post jobs",            desc: "Create a job and submit it. It goes live once your company admin approves it." },
      { title: "Shortlist applicants", desc: "Review applicants with their match and CIR scores. Shortlist or reject, one by one or in bulk." },
      { title: "Run the rounds",       desc: "Build a pipeline in the Scheduling Hub, choose the rounds and approve candidates round by round." },
      { title: "Close the hire",       desc: "Move final-round picks to Final Hire and record a direct call, offer letter or your own process." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Daily Responsibilities",
        title: "What an Employer Owns",
        items: [
          { title: "Jobs & Applicants",  desc: "Post, update with approval and track every job and its applicants." },
          { title: "Scheduling Hub",     desc: "Pipelines, rounds, time windows and invites for shortlisted candidates." },
          { title: "Round Approvals",    desc: "Ranked results per round. Approve, hold or reject each candidate." },
          { title: "Pending Candidates", desc: "Candidates on hold, ready to recall into a new round." },
          { title: "Final Hire",         desc: "Hiring outcomes, offer letters and openings filled." },
          { title: "Question Bank",      desc: "Build and reuse assessments, or let AI draft one from the job description." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Interviewer Audit · HR Side",
        title: "Managing Live Interviews",
        items: [
          { title: "Approve interviewers", desc: "Review interviewer sign-ups. A second approver confirms each one." },
          { title: "Release slots",        desc: "Open live-round slots to skill-matched interviewers and eligible candidates." },
          { title: "Resolve cases",        desc: "Review flagged interviews and decide the outcome." },
          { title: "Appeals and calibration", desc: "Handle interviewer appeals and run calibration sessions." },
        ],
      },
      {
        type: "chips",
        eyebrow: "Recruiter Roles",
        title: "The Right Access for Each Person",
        items: ["Hiring Manager", "Senior Recruiter", "Recruiter", "HR Admin", "Viewer"],
      },
    ],
    benefits: [
      "Every applicant arrives with a match score and CIR score",
      "Bulk shortlist, reject and invite",
      "Analytics on your jobs, hiring funnel and candidates",
      "Notifications for new applicants and round results",
    ],
    different:
      "Most portals give recruiters an inbox of resumes. iEvalX gives them scored applicants, built-in rounds and a hire board, all in one dashboard.",
    closing: { title: "Give your recruiters one place to hire.", desc: "Register your company and add your team." },
  },

  compliance: {
    eyebrow: "Compliance Suite",
    title: "Independent Oversight of Every Interview",
    subtitle:
      "Compliance officers watch over interviewer audit cases, co-sign serious actions and keep a complete record of every decision.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "Compliance officers are added by your company admin. They don't run hiring; they check that it was fair. They review flagged interviews with the full evidence and sign off before any formal action is taken against an interviewer.",
    steps: [
      { title: "Watch critical alerts", desc: "Critical audit signals and cases close to their deadline appear first." },
      { title: "Oversee cases",         desc: "Open any case to see the scores, transcript, recording and signals behind it." },
      { title: "Co-sign formal actions", desc: "Formal action against an interviewer needs a second approval. Approve or reject it." },
      { title: "Keep the record",       desc: "Every change, comment and decision is logged in the audit trail." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Daily Responsibilities",
        title: "What a Compliance Officer Owns",
        items: [
          { title: "Critical Alerts",   desc: "Critical cases and deadline breaches in one feed." },
          { title: "Case Oversight",    desc: "Every interviewer audit case with its evidence and status." },
          { title: "Co-Sign Requests",  desc: "Formal actions waiting for a second approval." },
          { title: "Audit Trail",       desc: "Who changed what, and when, on every case." },
          { title: "Signal Guidelines", desc: "The rules every interview is checked against." },
          { title: "AI Model Cards",    desc: "How each AI score is produced." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Case Deadlines",
        title: "Nothing Sits Unreviewed",
        items: [
          { title: "Critical", desc: "Within 24 hours." },
          { title: "High",     desc: "Within 3 days." },
          { title: "Medium",   desc: "Within 7 days." },
          { title: "Low",      desc: "Within 14 days." },
        ],
      },
    ],
    benefits: [
      "Independent from the recruiters making hiring decisions",
      "Full evidence behind every case",
      "No formal action without a second approval",
      "A defensible record behind every hire",
    ],
    different:
      "Most hiring tools have no one checking the checkers. iEvalX gives your compliance team their own seat, with the evidence and sign-off power to keep hiring fair.",
    closing: { title: "Hire fairly, and prove it.", desc: "Register your company and add your compliance officers." },
  },

  /* ── Campus drives (Jobs menu → Employers → "Run a campus drive") ───── */
  "campus-drive": {
    eyebrow: "Campus Drives",
    title: "Run a Campus Drive Without the Chaos.",
    subtitle:
      "Interview a whole batch of students with AI rounds built for freshers. Short sessions, student-level questions, and a ranked list at the end.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "Campus mode turns any AI interview round into a placement-drive format. Students join from their own dashboard, every session is proctored, and you review scores instead of running hundreds of first-round calls.",
    steps: [
      { title: "Post the role",        desc: "Create the job and add the students or applicants for the drive." },
      { title: "Switch on campus mode", desc: "Turn on Campus Placement Drive for the AI interview round." },
      { title: "Students take it",     desc: "The round appears in each student's Campus Drive tab, ready to start." },
      { title: "Shortlist the best",   desc: "Review scored, ranked results and move the top students forward." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Built for Freshers",
        title: "A Format That's Fair to Students",
        items: [
          { title: "25-minute sessions",     desc: "Short enough for a full batch in a single day." },
          { title: "Student-level questions", desc: "Asked at the level of a final-year student, not a senior hire." },
          { title: "Fresher difficulty",      desc: "Difficulty stays locked to Fresher for every student." },
          { title: "Easy rescheduling",       desc: "Students can move their slot without emailing your team." },
        ],
      },
      {
        type: "callout",
        eyebrow: "Every Session Proctored",
        title: "35+ Checks, Even at Scale",
        text: "Identity, surroundings, browser and device are checked in every campus session, so a large batch gets the same integrity as a single hire.",
      },
    ],
    benefits: [
      "Interview a full batch without booking interviewers",
      "Questions pitched at the fresher level",
      "Proctored sessions with a verified score for each student",
      "A ranked shortlist instead of a pile of CVs",
    ],
    different:
      "Most campus drives mean days of first-round calls and spreadsheets. On iEvalX, students take a fresher-level AI interview from anywhere, and you start with a ranked shortlist.",
    closing: { title: "Your next batch of hires is on campus.", desc: "Register your company and run your first drive." },
  },
  /* ── Added: Services menu → For jobseekers ───────────────────────────── */
  "instant-job-matches": {
    eyebrow: "Instant Job Matches",
    title: "Jobs That Fit You, Found for You",
    subtitle:
      "iEvalX matches your profile to verified jobs and tells you the moment a new one fits — no endless scrolling.",
    cta: { label: "See My Matches", action: "jobMatches" },
    whatItIs:
      "Instant Job Matches compares your profile with every live, approved job on iEvalX and shows the best fits first. New matching jobs are sent to you as they go live.",
    steps: [
      { title: "Complete your profile", desc: "Skills, experience, education, expected salary and preferred locations." },
      { title: "Get matched",           desc: "Jobs are scored against your profile and the best fits are recommended to you." },
      { title: "Get alerts",            desc: "When new jobs that match you are approved, you're notified." },
      { title: "Apply in one click",    desc: "Apply with the resume already saved in your profile." },
    ],
    blocks: [
      {
        type: "chips",
        eyebrow: "What We Match On",
        title: "More Than Just Keywords",
        items: ["Skills", "Experience", "Location", "Education", "Salary", "Languages", "Industry", "Certifications"],
      },
    ],
    benefits: [
      "Only verified companies and approved jobs",
      "Best-fit jobs shown first on your dashboard",
      "Alerts when a new matching job goes live",
      "A match score for your resume on every application",
    ],
    different:
      "Most portals make you search. iEvalX brings matching jobs to you — and every one of them comes from a verified company.",
    closing: { title: "Let the right jobs find you.", desc: "Complete your profile and see your matches." },
  },

  "application-tracker": {
    eyebrow: "Application Tracker",
    title: "Know Exactly Where Every Application Stands",
    subtitle:
      "Every job you apply to, every round you're in and every decision — tracked in one place, with an update the moment anything changes.",
    cta: { label: "Track My Applications", action: "applicationTracker" },
    whatItIs:
      "Application Tracker shows the live status of each application, from the moment you apply to the final decision, so you never have to wonder or chase an employer.",
    steps: [
      { title: "Apply",            desc: "Your application appears in Applied Jobs straight away." },
      { title: "Follow the status", desc: "See it move from Applied to Shortlisted to Selected." },
      { title: "Clear your rounds", desc: "Rounds sent by the employer appear in your dashboard, one at a time." },
      { title: "Get the decision", desc: "You're notified by email and in-app at every change." },
    ],
    blocks: [
      {
        type: "chips",
        eyebrow: "Every Status, Clearly Shown",
        title: "No More Guessing",
        items: ["Applied", "Shortlisted", "Selected", "On Hold", "Rejected", "Withdrawn"],
      },
    ],
    benefits: [
      "All applications in one list, in card or table view",
      "Email and in-app updates at every status change",
      "Withdraw any time before a final decision",
      "Save jobs to apply later",
    ],
    different:
      "On most portals your application disappears after you click Apply. On iEvalX you see every status and every round, as it happens.",
    closing: { title: "Stop wondering. Start tracking.", desc: "Your applications, rounds and results in one place." },
  },

  /* ── Added: Services menu → For companies ────────────────────────────── */
  "smart-shortlisting": {
    eyebrow: "Smart Shortlisting",
    title: "Shortlist on Scores, Not Guesswork",
    subtitle:
      "Every applicant arrives with a resume match score and their Quick Interview CIR score, so the strongest candidates stand out from the start.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "Smart Shortlisting puts two scores next to every applicant: how well their resume matches your job description, and their CIR score from the iEvalX Quick Interview.",
    steps: [
      { title: "Post your job",     desc: "Once approved, it goes live to verified candidates." },
      { title: "Applicants arrive", desc: "Each one is scored against your job description as they apply." },
      { title: "Compare at a glance", desc: "Match score and CIR score side by side on every applicant." },
      { title: "Shortlist",         desc: "Shortlist or reject one by one or in bulk, then add them to your pipeline." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Two Scores on Every Applicant",
        title: "See Fit and Skill Together",
        items: [
          { title: "Match score", desc: "How closely the resume matches your job description." },
          { title: "CIR score",   desc: "An overall score out of 10 from the candidate's proctored Quick Interview." },
        ],
      },
    ],
    benefits: [
      "Strong candidates surface without reading every CV",
      "Bulk shortlist and reject",
      "Candidates are emailed when their status changes",
      "Shortlisted candidates move straight into your hiring pipeline",
    ],
    different:
      "Most portals give you a stack of resumes. iEvalX gives you every applicant with a match score and a verified interview score.",
    closing: { title: "Your shortlist, ready in hours.", desc: "Register your company and post your first job." },
  },

  "verified-hiring": {
    eyebrow: "Verified Hiring",
    title: "Verified Companies. Approved Jobs. Trusted Teams.",
    subtitle:
      "Every company on iEvalX is document-verified, every recruiter job is approved before it goes live, and every action is logged.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "Verified Hiring is the trust layer of iEvalX. It protects candidates from fake postings and gives your company full control over who posts what.",
    steps: [
      { title: "Register",          desc: "Add your company details and upload MCA, Aadhaar, PAN, MSME and GST documents." },
      { title: "Get verified",      desc: "The iEvalX team checks each document. You can log in once verified." },
      { title: "Add your team",     desc: "Create recruiter accounts with roles. Login details are emailed to them." },
      { title: "Approve every job", desc: "Recruiter jobs go live only after company admin approval." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Control at Every Step",
        title: "Built for Teams That Hire Responsibly",
        items: [
          { title: "Document verification", desc: "Rejected documents come back with a reason to re-upload." },
          { title: "Recruiter roles",       desc: "Hiring Manager, Senior Recruiter, Recruiter, HR Admin and Viewer." },
          { title: "Job approvals",         desc: "Approve or reject recruiter jobs, with a reason on every rejection." },
          { title: "Edit and republish requests", desc: "Live jobs change only with admin approval." },
        ],
      },
    ],
    benefits: [
      "Candidates trust jobs from verified companies",
      "No job goes live without your approval",
      "Reassign jobs between recruiters any time",
      "An activity log behind every action",
    ],
    different:
      "On most portals anyone can post a job. On iEvalX every company is verified and every recruiter job is approved before candidates see it.",
    closing: { title: "Hire with a name candidates trust.", desc: "Register and get your company verified." },
  },
};