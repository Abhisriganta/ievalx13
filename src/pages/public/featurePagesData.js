/* ══════════════════════════════════════════════════════════════════════════
   PLATFORM FEATURE PAGES — content for /platform/:slug
   One entry per Platform mega-menu link. FeaturePage.jsx renders every entry
   with the same layout:
     hero → what it is → how it works → blocks[] → what you get →
     what makes it different → closing CTA
   `cta.action` keys are resolved in FeaturePage.jsx (auth-aware redirects).
   No FAQs here by design — FAQs live on the landing page only.
   ══════════════════════════════════════════════════════════════════════════ */

export const FEATURE_PAGES = {
  /* ── Job seekers ─────────────────────────────────────────────────────── */
  "quick-interview": {
    eyebrow: "Quick Interview",
    title: "Ten Minutes. One Interview. A Score Every Employer Sees.",
    subtitle:
           "A short AI voice interview built from your own resume. Finish it once, and your CIR score travels with every job you apply to.",
    cta: { label: "Take My Quick Interview", action: "quickInterview" },
    whatItIs:
      "The Quick Interview replaces the first phone screen. An AI interviewer asks about the skills and projects on your resume, listens to your answers and scores them on the spot.",
    steps: [
      { title: "Verify it's you", desc: "A quick face check before you start, so the score is yours alone." },
      { title: "Answer by voice", desc: "About 10 minutes of questions drawn from your resume. No coding, no trick puzzles." },
      { title: "Get your CIR", desc: "Your full report is ready for you the moment you finish. Employers see only your CIR score on your applications." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "CIR · Candidate Intelligence Report",
        title: "Six Competencies. One Score Out of 10.",
        items: [
          { title: "Technical",       desc: "Depth on the skills you claim." },
          { title: "Communication",   desc: "How clearly you explain your work." },
          { title: "Problem Solving", desc: "How you reason through a question." },
          { title: "Confidence",      desc: "Steadiness and ownership in your answers." },
          { title: "Clarity",         desc: "Structured, to-the-point responses." },
          { title: "Relevance",       desc: "Answers that stay on the question." },
        ],
      },
    ],
    benefits: [
      "Employers see proof of your skills, not just keywords on a page",
      "Your score sits on every application you send",
      "HR can shortlist you without a screening call",
      "Face-verified, so the result is trusted",
    ],
    different: "Most portals send your resume into a pile. iEvalX sends a verified, scored interview with it.",
    closing: { title: "Let your CIR speak before your resume does.", desc: "Ten minutes now saves weeks of waiting later." },
  },

  "ai-practice-interview": {
    eyebrow: "AI Practice Interview",
    title: "Rehearse With an AI Interviewer Before the Real One",
    subtitle:
      "Practise on the skills in your own resume, see where you're ready and where you're not, and walk into real interviews with fewer surprises.",
    cta: { label: "Start Practising", action: "practice" },
    whatItIs:
      "A practice room with an AI interviewer. It reads your resume, picks out your skills and interviews you on them, then tells you which ones are interview-ready.",
    steps: [
      { title: "Upload your resume", desc: "The AI lists the skills it finds." },
      { title: "Practise by voice", desc: "Answer questions on those skills, with natural follow-ups." },
      { title: "Read your feedback", desc: "A readiness score for each skill, plus your strengths and the gaps to work on." },
    ],
    blocks: [],
    benefits: [
      "A readiness score for every skill, not one vague overall grade",
      "Clear strengths and gaps after every session",
      "Questions based on your resume, not a generic question bank",
      "Practise as often as you like",
    ],
    different:
      "Most practice tools ask everyone the same stock questions. iEvalX practises you on your own resume, the same way the real Quick Interview and AI interview rounds will.",
    closing: { title: "Practise today. Perform tomorrow.", desc: "All you need is a resume, a microphone and a quiet spot." },
  },

  "resume-builder": {
    eyebrow: " Resume Builder + IRS",
    title: "Build the Resume Real Jobs Are Asking For",
    subtitle:
      "Write, tailor and check your resume in one place. IRS compares it with real job descriptions and shows exactly which skills are missing.",
    cta: { label: "Build My Resume", action: "resumeBuilder" },
    whatItIs:
      "Two tools on one page. The  helps you write and tailor your resume. IRS (Intelligent Resume Search) tells you how it stacks up against real openings for your role.",
    steps: [
      { title: "Pick your role and level", desc: "For example, Backend Developer, 2–4 years." },
      { title: "IRS compares", desc: "Your resume is checked against real job descriptions posted on iEvalX for that role and level." },
      { title: "See your gaps", desc: "The skills most of those jobs ask for, which you have, which you're missing and how often each appears." },
      { title: "Download the report", desc: "A PDF skill-gap report you can work from." },
    ],
    stepsTitle: "How IRS Resume Match Works",
    blocks: [
      {
        type: "cards",
        eyebrow: "Resume Builder",
        title: "Write and Tailor Without the Busywork",
        items: [
          { title: "Start your way",          desc: "Upload an existing resume or start from scratch." },
          { title: "Edit in place",           desc: "Click any line and rewrite it. No forms to fill." },
          { title: "Two tailored versions",   desc: "Keep one resume, create two variants for different roles." },
          { title: "An AI assistant that knows your resume", desc: "Ask it to sharpen a bullet, add impact or fit a job description." },
          { title: "Paste a job description", desc: "The key skills are pulled out so you can tailor to them." },
          { title: "Share in one click",      desc: "Send a PDF link instead of an attachment." },
        ],
      },
    ],
    benefits: [
      "A match score against your target role",
      "Missing skills ranked by how often employers ask for them",
      "A resume you can tailor and share in minutes",
      "The same match score on each job page before you apply",
    ],
    different:
      "Most resume builders only make your resume look good. iEvalX checks it against what employers are actually hiring for, then helps you close the gap.",
    closing: { title: "Know your gaps before the interviewer does.", desc: "Build, check and tailor your resume in one place." },
  },

  /* ── Companies ───────────────────────────────────────────────────────── */
  "hiring-pipeline": {
    eyebrow: "Interview Scheduling",
    title: "Post a Job. Design the Rounds. Let the Best Rise to the Top.",
    subtitle:
      "Build your hiring process round by round, schedule every round in one place and let candidates book their own live interview time. Every result is proctored, scored and ranked for you.",
    cta: { label: "Post a Job", action: "postJob" },
    whatItIs:
      "The hiring pipeline is where a job turns into a shortlist. You choose the rounds and when they run; iEvalX sends the invites, opens the slots, scores every candidate the same way and ranks the results.",
    steps: [
      { title: "Post a job", desc: "Your company admin approves it before it goes live." },
      { title: "Design your rounds", desc: "Choose the rounds this job needs, from assessments and interviews to live video, and set their order." },
            { title: "Schedule the rounds", desc: "Set when each round opens and closes. Candidates are invited by email and in-app, one round at a time." },
      { title: "Hire from ranked results", desc: "Review the top candidates per round and move your picks to Final Hire." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Assessments",
        title: "Paste a JD, Get a Test",
        items: [
          { title: "Drafted by AI, approved by you", desc: "AI writes the assessment from your job description. Nothing goes live until you approve it." },
          { title: "Nine question types",            desc: "Including multiple choice, scenarios and coding." },
          { title: "Built-in coding editor",         desc: "Python, Java, JavaScript, C++ and SQL, run and checked automatically." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Built-in Scheduling",
        title: "Every Round on Time. Every Slot Filled.",
        items: [
          { title: "Time windows per round", desc: "Each round opens and closes on the dates you set." },
          { title: "One-click invites",      desc: "Shortlisted candidates are invited by email and in-app together." },
          { title: "Self-booked live slots", desc: "Skill-matched interviewers open slots; candidates pick their own time." },
          { title: "Automatic reminders",    desc: "Candidates and interviewers are reminded before a live interview." },
          { title: "No-show tracking",       desc: "Missed slots are picked up automatically, so nothing sits in limbo." },
          { title: "Several pipelines per job", desc: "Run separate flows for different openings or batches." },
        ],
      },
      
     
    ],
    benefits: [
      "Ranked results for every round",
      "You approve every move: approve, hold or reject per round",
      "Pending and Final Hire boards to close the loop",
      "Hiring funnel, stage-aging and no-show analytics",
      "Campus drives for hiring freshers at scale",
    ],
    different:
      "Other tools give you one test or one video call. iEvalX gives you the whole pipeline: tests, interviews, proctoring and ranking in one place, with one score that follows the candidate through every round.",
    closing: { title: "Shortlist in hours, not weeks.", desc: "Post your first job and design its rounds in minutes." },
  },

  iaem: {
    eyebrow: "Interviewer Suite · IAEM",
    title: "Run Fair Interviews. Get Audited on Every One.",
    subtitle:
      "Interviewers take live rounds for your company, score candidates on a clear rubric and have every interview checked by IAEM.",
    cta: { label: "Register My Company", action: "postJob" },
    whatItIs:
      "Interviewers are invited by your company admin and approved by two people before they can interview. In their own dashboard they share availability, run live interviews, submit scores and keep their scoring calibrated.",
    steps: [
      { title: "Join and consent",    desc: "Accept the invite, activate the account and agree to the interview and audit terms." },
      { title: "Share availability",  desc: "Add open slots. Only interviewers whose skills match the job are offered." },
      { title: "Interview and score", desc: "Take the live round, then submit scores, a recommendation and a self-reflection. The AI score is shown only after you submit." },
      { title: "Stay calibrated",     desc: "Respond to any case on your interview, appeal if you disagree and complete calibration sessions." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "Daily Responsibilities",
        title: "What an Interviewer Owns",
        items: [
          { title: "My Available Slots",   desc: "Your availability and slot requests from HR." },
          { title: "Completed Interviews", desc: "Every interview you took, with the scores you submitted." },
          { title: "My Cases & Appeals",   desc: "Cases raised on your interviews. Respond or appeal." },
          { title: "Calibration",          desc: "Sessions against reference interviews, plus your scoring baseline." },
          { title: "Signal Guidelines",    desc: "What IAEM checks for, in plain language." },
          { title: "Profile",              desc: "Skills and seniority used to match you to jobs." },
        ],
      },
      {
        type: "checklist",
        eyebrow: "8 Audit Checks",
        title: "What IAEM Checks After Every Interview",
        items: [
          "Gap between your score and the AI score",
          "Quality of selection decisions",
          "Questions matched to the job description",
          "Questions pitched at the right experience level",
          "Similar difficulty for every candidate",
          "Professional conduct",
          "Misconduct",
          "Coverage and interview time",
        ],
      },
    ],
    benefits: [
      "Interviews only on jobs that match your skills",
      "Blind scoring keeps your judgement independent",
      "A fair chance to respond and appeal before any action",
      "Calibration helps you score consistently over time",
    ],
    different:
      "Most platforms only judge the candidate. On iEvalX the interviewer is reviewed too, so candidates get a fair interview and companies get a score they can trust.",
    closing: { title: "Interviews you can stand behind.", desc: "Register your company and invite your interviewers." },
  },

  /* ── Assessment Builder ─────────────────────────────────────────────── */
  "assessment-builder": {
    eyebrow: "Assessment Builder",
    title: "Build Assessments from Scratch or Let AI Generate Them in Minutes.",
    subtitle:
      "Two builders in one: a manual builder for full control over every question, and an AI builder that generates a complete test from your role, level and topic documents.",
    cta: { label: "Post a Job", action: "postJob" },
    whatItIs:
      "Every hiring pipeline needs a test. The Assessment Builder lets you create one yourself with the Manual Builder, or let AI generate the whole thing with the AI Builder. Upload topic documents to guide what gets tested. Either way, you review and approve before anything reaches a candidate.",
    steps: [
      { title: "Choose your builder", desc: "Manual for full control, AI for speed. Use both on the same job if you like." },
      { title: "Configure the test", desc: "Enter job role, experience level, upload topic documents, then set sections with question types, counts and time limits." },
      { title: "Review and approve", desc: "Every question is editable. AI-generated tests stay in draft until you approve." },
      { title: "Assign to candidates", desc: "The assessment becomes a round in your hiring pipeline, proctored automatically." },
    ],
    stepsTitle: "From Configuration to Live Test",
    blocks: [
      {
        type: "cards",
        eyebrow: "AI Assessment Builder",
        title: "Set a Role and Level. Get a Full Test.",
        intro: "Enter the job role and experience level, upload topic documents or type the topics to cover, and AI generates a complete assessment you can edit before it goes live.",
        items: [
          { title: "Role + level + topics",     desc: "Questions are built from the job role, experience level and your uploaded topic documents — not a generic bank." },
          { title: "Regenerate any question",    desc: "Don't like one? Regenerate just that question or an entire section without touching the rest." },
          { title: "Version history",            desc: "Every draft is saved. Roll back to any previous version if you change your mind." },
          { title: "Approve and go live",        desc: "Nothing reaches candidates until you review every question and hit approve." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Manual Assessment Builder",
        title: "Full Control Over Every Question",
        intro: "Build your own test from scratch, section by section, with the question types that fit the role.",
        items: [
          { title: "Multiple question types",    desc: "Multiple choice, scenario-based, written answers and coding questions." },
          { title: "In-browser coding editor",   desc: "Candidates write and run code in Python, Java, JavaScript, C++ or SQL, with visible and hidden test cases." },
          { title: "Section timers",             desc: "Set time limits per section so candidates can't spend the whole test on one part." },
          { title: "Question Bank",              desc: "Save questions to a reusable bank. Pull them into future assessments without rewriting." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Document Extraction",
        title: "Already Have Questions? Upload Them.",
        items: [
          { title: "Upload a document",          desc: "Upload a PDF, Word doc or text file with your existing questions." },
          { title: "AI extracts the questions",   desc: "Questions, options and correct answers are pulled out automatically." },
          { title: "Review and approve",         desc: "Edit anything the extraction missed, then approve the whole set." },
        ],
      },
    ],
    benefits: [
      "AI-generated tests ready in minutes, not days",
      "Manual builder for roles that need hand-crafted questions",
      "Built-in coding editor with multi-language support",
      "Every assessment is automatically proctored with 35+ checks",
      "Reusable Question Bank across all your jobs",
      "Human and AI evaluation of coding and written answers",
    ],
    different:
      "Most platforms give you a question bank and a timer. iEvalX gives you two builders — one that generates a test from your role, level and topics, and one that gives you full control — both proctored and scored automatically.",
    closing: { title: "Your next test is a few clicks away.", desc: "Set a role, pick an experience level, and have a proctored assessment ready in minutes." },
  },

  /* ── Proctoring and Security ────────────────────────────────────────── */
  "proctoring-security": {
    eyebrow: "Proctoring and Security",
    title: "35+ Checks. Every Assessment. Every AI Interview. Every Time.",
    subtitle:
      "Face verification, voice verification, gaze tracking, tab monitoring, device scanning and more — running silently in every proctored session so honest candidates aren't outscored by shortcuts.",
    cta: { label: "Talk to Us", action: "contact" },
    whatItIs:
      "Proctoring on iEvalX isn't a single webcam check. It's 35+ continuous checks across identity, surroundings, browser and device, running from the moment a session starts to the moment it ends. Every session gets a risk score from 0 to 100 and a timeline of exactly what happened.",
    steps: [
      { title: "Pre-check gate", desc: "Before the test starts, the candidate's face is matched against their enrolled photo. No match, no entry." },
      { title: "Continuous monitoring", desc: "35+ checks run throughout the session — face, voice, gaze, tab switches, fullscreen exits, copy-paste, dev tools, second screens." },
      { title: "Risk score generated", desc: "Each session ends with a 0–100 risk score and a snapshot timeline showing what happened and when." },
      { title: "Employer reviews", desc: "High-risk sessions are flagged. Employers see the evidence, not just a label." },
    ],
    stepsTitle: "How Proctoring Works",
    blocks: [
      {
        type: "cards",
        eyebrow: "Identity Verification",
        title: "Know Who's Taking the Test",
        items: [
          { title: "Face enrollment at registration", desc: "Candidates register their face with InsightFace when they create their account. This is the reference for every future session." },
          { title: "Voice enrollment",                desc: "A voice sample is recorded at registration for voice verification during sessions." },
          { title: "Live face match",                 desc: "Before every session, a live face check is matched against the enrolled photo. Failed match blocks entry." },
          { title: "Continuous face tracking",        desc: "Face presence and identity are checked throughout — if the face disappears or changes, it's flagged." },
        ],
      },
      {
        type: "cards",
        eyebrow: "35+ Checks",
        title: "What's Monitored During Every Session",
        items: [
          { title: "Face and gaze",         desc: "Face present, face matches enrolled photo, gaze direction, head pose, multiple faces in frame." },
          { title: "Voice",                 desc: "Voice matched against enrolled sample. Second voice detection." },
          { title: "Browser behaviour",     desc: "Tab switches, fullscreen exits, copy-paste attempts, developer tools, right-click." },
          { title: "Device integrity",      desc: "Remote desktop tools, virtual cameras, virtual machines, hidden overlay windows, second monitors." },
          { title: "Environment",           desc: "Phone in frame, book in frame, another person in frame, background noise analysis." },
          { title: "Native agent",          desc: "Optional desktop agent for deeper device scanning — heartbeat, batch violation reporting, session binding." },
        ],
      },
      {
        type: "cards",
        eyebrow: "Risk Scoring",
        title: "A Score, Not Just a Flag",
        intro: "Every session ends with a clear risk score and a full timeline, so employers make decisions based on evidence.",
        items: [
          { title: "Risk score 0–100",      desc: "One clear number summarising the session's integrity. Higher means more violations." },
          { title: "Snapshot timeline",      desc: "A chronological record of every event — what happened, when, and what the candidate's screen looked like." },
          { title: "Violation escalation",   desc: "Violations are ranked by severity. Repeated low-severity events escalate automatically." },
          { title: "Live warnings",          desc: "Candidates see a warning before anything counts against them. No silent gotchas." },
        ],
      },
      {
        type: "checklist",
        eyebrow: "Where It Runs",
        title: "Proctoring Covers Every Evaluated Session",
        items: [
          "assessments (manual and AI-generated)",
          "interview rounds",
          "Quick Interview (10-minute standalone)",
          "Campus drive sessions",
          "Document-based interview rounds",
        ],
      },
    ],
    benefits: [
      "Honest candidates keep their honest score",
      "Employers see evidence, not just a pass/fail flag",
      "Candidates get live warnings, not silent traps",
      "Same 35+ checks whether it's one candidate or a campus batch of 500",
      "Identity checked at the start of every session",
      "Risk scores sit beside every result in the hiring pipeline",
    ],
    different:
      "Most proctoring is a webcam snapshot and a tab-switch counter. iEvalX runs 35+ checks covering identity, voice, gaze, browser, device and environment — continuously, with a scored timeline, in every proctored session on the platform.",
    closing: { title: "Fair tests. Verified results. No shortcuts.", desc: "Every assessment and AI interview on iEvalX is proctored automatically." },
  },
};