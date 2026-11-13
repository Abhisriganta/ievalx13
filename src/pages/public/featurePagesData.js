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
      "A short AI voice interview built from your own resume. Finish it once, and your Candidate Intelligence Report travels with every job you apply to.",
    cta: { label: "Take My Quick Interview", action: "quickInterview" },
    whatItIs:
      "The Quick Interview replaces the first phone screen. An AI interviewer asks about the skills and projects on your resume, listens to your answers and scores them on the spot.",
    steps: [
      { title: "Verify it's you", desc: "A quick face check before you start, so the score is yours alone." },
      { title: "Answer by voice", desc: "About 10 minutes of questions drawn from your resume. No coding, no trick puzzles." },
      { title: "Get your CIR", desc: "Your report is ready the moment you finish, and it's attached to your applications." },
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
    eyebrow: "AI Resume Builder + IRS",
    title: "Build the Resume Real Jobs Are Asking For",
    subtitle:
      "Write, tailor and check your resume in one place. IRS compares it with real job descriptions and shows exactly which skills are missing.",
    cta: { label: "Build My Resume", action: "resumeBuilder" },
    whatItIs:
      "Two tools on one page. The AI Resume Builder helps you write and tailor your resume. IRS (Intelligent Resume Search) tells you how it stacks up against real openings for your role.",
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
        eyebrow: "AI Resume Builder",
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
    eyebrow: "Hiring Pipeline",
    title: "Post a Job. Design the Rounds. Let the Best Rise to the Top.",
    subtitle:
      "Build your hiring process round by round: AI assessments, AI interviews and live video. Every result is proctored, scored and ranked for you.",
    cta: { label: "Post a Job", action: "postJob" },
    whatItIs:
      "The hiring pipeline is where a job turns into a shortlist. You choose the rounds; iEvalX runs them, scores every candidate the same way and ranks the results.",
    steps: [
      { title: "Post a job", desc: "Your company admin approves it before it goes live." },
      { title: "Design your rounds", desc: "Choose the rounds this job needs, from AI assessments and AI interviews to live video, and set their order." },
      { title: "Set a cut-off", desc: "Candidates who score above it move to the next round automatically." },
      { title: "Hire from ranked results", desc: "Review the top candidates per round and move your picks to Final Hire." },
    ],
    blocks: [
      {
        type: "cards",
        eyebrow: "AI Assessments",
        title: "Paste a JD, Get a Test",
        items: [
          { title: "Drafted by AI, approved by you", desc: "AI writes the assessment from your job description. Nothing goes live until you approve it." },
          { title: "Nine question types",            desc: "Including multiple choice, scenarios and coding." },
          { title: "Built-in coding editor",         desc: "Python, Java, JavaScript, C++ and SQL, run and checked automatically." },
        ],
      },
      {
        type: "cards",
        eyebrow: "37-Point Proctoring",
        title: "Every Assessment and AI Interview, Watched by 37 Checks",
        intro: "Each session ends with a risk score from 0 to 100 and a timeline of snapshots, so you see what happened, not just a flag.",
        items: [
          { title: "Identity",     desc: "Face matched to the enrolled photo all session. Second voices flagged." },
          { title: "Surroundings", desc: "Phone, book or an extra person in frame. Gaze and head turns." },
          { title: "Browser",      desc: "Tab switches, fullscreen exits, copy-paste and dev tools." },
          { title: "Device",       desc: "Remote desktop, virtual camera, virtual machine and hidden overlay windows." },
        ],
      },
      {
        type: "callout",
        eyebrow: "Live Video Rounds",
        title: "Live Interviews Without the Scheduling Back-and-Forth",
        text: "Waiting room, screen share, chat, recording and noise suppression. Candidates book their own slots.",
      },
    ],
    benefits: [
      "Ranked results for every round",
      "Auto-advance above your cut-off, auto-reject for no-shows",
      "Pending and Final Hire boards to close the loop",
      "Hiring funnel, stage-aging and no-show analytics",
      "Campus drives for hiring freshers at scale",
    ],
    different:
      "Other tools give you one test or one video call. iEvalX gives you the whole pipeline: tests, interviews, proctoring and ranking in one place, with one score that follows the candidate through every round.",
    closing: { title: "Shortlist in hours, not weeks.", desc: "Post your first job and design its rounds in minutes." },
  },

  iaem: {
    eyebrow: "IAEM · Interviewer Audit and Evaluation Module",
    title: "Every Candidate Is Evaluated. So Is Every Interviewer.",
    subtitle:
      "IAEM schedules your live interviews, matches interviewers by skill and audits every round for bias, off-topic questioning and misconduct before anyone is shortlisted.",
    cta: { label: "Talk to Us", action: "contact" },
    whatItIs:
      "Most hiring platforms only watch the candidate. IAEM watches the interview itself, so a bad interviewer can't quietly cost you a good hire, or wave through a weak one.",
    steps: [
      { title: "Smart scheduling", desc: "Interviewers are matched to each job by skill. Candidates book an open slot themselves." },
      { title: "Audit every round", desc: "Each live interview is checked against 8 audit signals." },
      { title: "Raise and resolve cases", desc: "Anything flagged becomes a case with evidence, a deadline and a clear owner." },
      { title: "Score the interviewer", desc: "An interviewer audit report sits beside the candidate's result before the shortlist is final." },
    ],
    blocks: [
      {
        type: "checklist",
        eyebrow: "Audit Signals",
        title: "What IAEM Flags",
        items: [
          "Questions off-topic for the job description",
          "Questions too hard or too easy for the level",
          "Scores that don't match the evidence",
          "Rude conduct, harassment or discrimination",
          "Interviews cut short before a rejection",
          "Unusual scoring patterns over time",
        ],
      },
      {
        type: "cards",
        eyebrow: "Built for Compliance",
        title: "An Audit Trail Behind Every Decision",
        items: [
          { title: "Cases with SLAs",          desc: "Critical cases must be handled within 24 hours." },
          { title: "Appeals",                  desc: "Interviewers can respond to a flag before action is taken." },
          { title: "Calibration",              desc: "Interviewers are benchmarked against reference interviews." },
          { title: "Four-eyes co-sign",        desc: "Formal actions need a second compliance officer." },
          { title: "Legal holds and retention", desc: "Keep evidence when needed, delete it on schedule when not." },
          { title: "AI model cards",           desc: "See how each AI component makes its decisions." },
        ],
      },
      {
        type: "callout",
        eyebrow: "Who Uses It",
        title: "One Module, Three Seats",
        text: "HR runs the schedules, interviewers run the rounds, and compliance officers review cases. Each gets its own dashboard.",
      },
    ],
    benefits: [
      "Skill-matched interviewers for every job",
      "Candidates self-book slots, with no hand-picked panels",
      "Every flag backed by evidence and a deadline",
      "Interviewer scores reviewed before the shortlist is final",
    ],
    different:
      "Job portals check candidates and stop there. With IAEM, every hiring decision has an audit trail behind it.",
    closing: { title: "Hiring you can audit, end to end.", desc: "See how IAEM fits your hiring team." },
  },
};