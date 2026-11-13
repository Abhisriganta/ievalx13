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
      "Take skill assessments made for the exact role you applied to, with coding in a built-in editor and 37 checks that keep every result honest.",
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
        eyebrow: "37-Point Proctoring",
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
      "Generic tests ask the same questions for every job. iEvalX tests are built from the role you applied to, and 37 checks make sure your honest score stands.",
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
    title: "One Workspace for Your Whole Hiring Team",
    subtitle:
      "Verify your company, bring in your HR team, interviewers and compliance officers, and run every job from posting to final hire in one place.",
    cta: { label: "Register My Company", action: "registerCompany" },
    whatItIs:
      "The Employer Suite is your company's home on iEvalX. It holds your team, your jobs, your candidates and your hiring data, with the right permissions for each person.",
    steps: [
      { title: "Register and verify", desc: "Upload your company documents for verification before you start hiring." },
      { title: "Add your team", desc: "Invite HR, interviewers and compliance officers, each with their own dashboard." },
      { title: "Post and approve", desc: "HR drafts jobs; your company admin approves them before they go live." },
      { title: "Hire and review", desc: "Shortlist from ranked results, move picks to Final Hire and track it all in analytics." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Every Applicant, on One Card",
        title: "Scored Before You Open the Resume",
        items: [
          { title: "Resume match",          desc: "How well the resume fits this job, with matched and missing skills." },
          { title: "Quick Interview score", desc: "A 10-minute AI interview result, before you spend a minute." },
          { title: "CIR",                   desc: "Six competencies in one score out of 10." },
          { title: "Proctoring risk",       desc: "How clean their assessments and AI interviews were." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Built for Teams",
        title: "The Right Dashboard for Every Role",
        items: [
          { title: "Company Admin",       desc: "Approves jobs, manages the team, reassigns job ownership." },
          { title: "HR / Recruiters",     desc: "Post jobs, design rounds, shortlist and hire." },
          { title: "Interviewers",        desc: "Run live rounds and score on a clear rubric." },
          { title: "Compliance Officers", desc: "Review flagged cases and keep the audit trail." },
        ],
      },
    ],
    benefits: [
      "Edit and republish requests, so live jobs never change without approval",
      "Pending and Final Hire boards to close every loop",
      "Analytics: hiring funnel, stage aging and no-shows",
      "Campus drives for hiring freshers at scale",
    ],
    different:
      "Most job portals give you a posting board and an inbox. iEvalX gives your whole team a verified workspace where every applicant arrives already scored.",
    closing: { title: "Bring your hiring team under one roof.", desc: "Register your company and invite your team in minutes." },
  },

  compliance: {
    eyebrow: "Compliance and Audit",
    title: "Every Hiring Decision, Backed by Evidence",
    subtitle:
      "Proctoring evidence on every test, audit cases on every interview, and a full trail behind every hire, all reviewed by your own compliance officers.",
    cta: { label: "Talk to Us", action: "contact" },
    whatItIs:
      "Compliance and Audit gives your compliance officers one place to check that hiring was fair on both sides of the table: candidates didn't cheat, and interviewers didn't cut corners.",
    steps: [
      { title: "Collect evidence", desc: "Every assessment and AI interview is proctored; every live interview is audited." },
      { title: "Flag automatically", desc: "High proctoring risk or an interviewer audit signal opens a case." },
      { title: "Review with deadlines", desc: "Each case has evidence, an owner and an SLA. Critical cases within 24 hours." },
      { title: "Decide and record", desc: "Formal actions need a second sign-off, and every step is logged." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Candidate Integrity",
        title: "Proctoring Evidence You Can Act On",
        items: [
          { title: "37 checks",         desc: "Across identity, surroundings, browser and device." },
          { title: "Risk score 0–100",  desc: "One clear number for every session." },
          { title: "Snapshot timeline", desc: "What happened and when, not just a flag." },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Interview Integrity · IAEM Cases",
        title: "What Gets Flagged in Live Interviews",
        items: [
          "Off-topic or level-mismatched questions",
          "Scores that don't match the evidence",
          "Rude conduct, harassment or discrimination",
          "Interviewers can appeal before any action is taken",
        ],
      },
      {
        type: "cards",
        eyebrow: "Governance Controls",
        title: "Controls Your Compliance Team Will Expect",
        items: [
          { title: "Four-eyes co-sign",  desc: "Formal actions need a second compliance officer." },
          { title: "Legal holds",        desc: "Keep evidence for a case that needs it." },
          { title: "Retention clean-up", desc: "Recordings and data deleted on schedule when no longer needed." },
          { title: "AI model cards",     desc: "See how each AI component scores and decides." },
          { title: "Audit trail",        desc: "Every review, decision and change is logged." },
          { title: "Case SLAs",          desc: "Deadlines on every case, so nothing sits unreviewed." },
        ],
      },
    ],
    benefits: [
      "One place for candidate and interviewer integrity",
      "Evidence attached to every flag",
      "Deadlines and owners on every case",
      "A defensible record behind every hire",
    ],
    different:
      "Most hiring tools hand you a result and a flag. iEvalX hands your compliance team the evidence, the deadlines and the sign-offs to stand behind every decision.",
    closing: { title: "Hire fairly, and prove it.", desc: "See how Compliance and Audit fits your hiring team." },
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
        title: "37 Checks, Even at Scale",
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
};