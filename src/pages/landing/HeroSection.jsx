import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Container, Paper } from "@mui/material";
import { C, FONT, REDUCED } from "./theme";
import { useCounter, useInView } from "./hooks";
import { FadeUp } from "./primitives";
import { HERO_PERSON } from "./data";
import heroPersonArt from "../../assets/images/Herosection.png";
import JobSearchBar from "./JobSearchBar";
import useApplyNavigation from "@/hooks/useApplyNavigation";

/* Headline jobs figure on the stat card — one place to change it. */
const HERO_JOBS_STAT = { value: 5, suffix: " lakh+", label: "Jobs to explore", icon: "💼" };

/* Popular search chips under the search bar (Naukri-style).
   Each opens /jobs with the matching filter. */
const POPULAR_SEARCHES = [
  { label: "Fresher",    params: { exp: "Fresher" } },
  { label: "Remote",     params: { q: "Remote" } },
  { label: "Software",   params: { q: "Software" } },
  { label: "Internship", params: { q: "Intern" } },
  { label: "Data",       params: { q: "Data" } },
  { label: "Sales",      params: { q: "Sales" } },
  { label: "HR",         params: { q: "HR" } },
  { label: "Finance",    params: { q: "Finance" } },
];


/* ══ HERO VIEWS — "For Jobseekers" / "For Companies" toggle ═══════════════
   Each view has its own 3 benchmark headlines, sub-line and buttons.
   The headline rotates through its 3 quotes, then the toggle flips to the
   other view by itself. Every number is a real product figure:
   100 JDs (IRS) · 6 competencies (CIR) · 37 proctoring checks · IAEM on
   every live interview · 5 lakh+ jobs (HERO_JOBS_STAT). */
const HERO_VIEWS = {
  seeker: {
    tab: "For Jobseekers",
    quotes: [
      { bold: "Your Resume",   accent: "vs 100 JDs", light: "Know What's Missing" },
      { bold: "One Interview", accent: "Six Skills", light: "Scored in Your CIR" },
      { bold: "5 Lakh+ Jobs",  accent: "One Search", light: "At Verified Companies" },
    ],
    sub: "Upload your resume for an instant IRS score, take one AI interview for your CIR, and get matched to real jobs from verified companies. No keyword lottery, no interviewer bias.",
    primary: "Get My CIR",
    secondary: "Upload Resume",
  },
  company: {
    tab: "For Companies",
    quotes: [
      { bold: "Hire on Proof", accent: "35+ Checks",   light: "In Every AI Interview" },
      { bold: "Interviewers",  accent: "Audited Too", light: "Before You Shortlist" },
      { bold: "Post a JD",     accent: "Get Matches", light: "The Moment It's Live" },
    ],
    sub: "Post a job and IRS brings matched CVs instantly. Candidates take proctored AI rounds, IAEM audits every interviewer, and you shortlist from a ranked, verified list.",
    primary: "Hire Verified Talent",
    secondary: "See How IAEM Works",
  },
};
const HERO_VIEW_ORDER = ["seeker", "company"];

/* Trust badges above the headline */
const HERO_BADGES = ["Verified candidates", "Verified companies"];

/* Feature chips (company view, in place of the job search) — each opens its page */
const HERO_FEATURES = [
  { label: "IRS Instant Match", to: "/platform/resume-builder" },
  { label: "Quick Interview",   to: "/platform/quick-interview" },
  { label: "AI Interview",      to: "/services/ai-interviews" },
  { label: "IAEM Audit",        to: "/platform/iaem" },
  { label: "Proctoring",        to: "/services/assessments" },
  { label: "CIR",               to: "/platform/quick-interview" },
];

/* Trust bar under the hero content */
const HERO_TRUST = [
  { value: "5 lakh+",  label: "Jobs to explore" },
  { value: "Verified", label: "Companies only" },
  { value: "35+",      label: "Proctoring checks" },
  { value: "Every",    label: "Interviewer audited" },
];

const UPLOAD_PATH = "/jobseeker/profile?section=resume&action=upload";

/* Company logo circles seated on the ribbon (Lanciere in Accenture's old spot).
   `src` overrides the Google favicon lookup — Lanciere uses /public/lanciere-logo.png */
const HERO_COMPANY_LOGOS = [
  { name: "Google",                domain: "google.com",    fallback: "#4285F4" },
  { name: "Microsoft",             domain: "microsoft.com", fallback: "#5E5E5E" },
  { name: "Lanciere Technologies", src: "/lanciere-logo.png", fallback: "#1E88E5" },
  { name: "Amazon",                domain: "amazon.com",    fallback: "#FF9900" },
];
const QUOTE_MS = 4600;



function HeroQuoteRotator({ quotes, idx, quoteKey, onPick, pausedRef, dark }) {
  const q = quotes[idx];

  return (
    <Box
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <Typography component="h1" sx={{ fontFamily: FONT, color: C.ink, m: 0 }}>
        <Box
          key={quoteKey}
          sx={{
            minHeight: { xs: 104, sm: 136, md: 196, lg: 226 },
            "@keyframes heroLineIn": {
              from: { opacity: 0, transform: "translateY(26px)" },
              to:   { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes heroRuleIn": {
              from: { transform: "scaleX(0)" },
              to:   { transform: "scaleX(1)" },
            },
          }}
        >
          {/* bold line 1 */}
          <Box component="span" sx={{
            display: "block", fontWeight: 800,
            fontSize: { xs: 34, sm: 44, md: 58, lg: 66 }, lineHeight: 1.04,
            letterSpacing: "-1px", whiteSpace: "nowrap",
            animation: REDUCED ? "none" : "heroLineIn .65s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            {q.bold}
          </Box>
          {/* bold line 2 — the sage accent words */}
          <Box component="span" sx={{
            display: "block", fontWeight: 800,
            fontSize: { xs: 34, sm: 44, md: 58, lg: 66 }, lineHeight: 1.04,
            letterSpacing: "-1px", whiteSpace: "nowrap",
            animation: REDUCED ? "none" : "heroLineIn .65s cubic-bezier(0.22,1,0.36,1) .1s both",
          }}>
            <Box component="span" sx={{
              position: "relative", display: "inline-block",
              fontStyle: "italic", color: C.sageDark, pr: "0.06em",
              "&::after": {
                content: '""', position: "absolute", left: "2%", right: "4%",
                bottom: { xs: 2, md: 5 }, height: { xs: 4, md: 6 },
                borderRadius: 999, bgcolor: C.sage, opacity: 0.45,
                transformOrigin: "left center",
                animation: REDUCED ? "none" : "heroRuleIn .5s cubic-bezier(0.22,1,0.36,1) .5s both",
              },
            }}>
              {q.accent}
            </Box>
          </Box>
          {/* light line 3 */}
          <Box component="span" sx={{
            display: "block", fontWeight: 400,
            fontSize: { xs: 26, sm: 34, md: 44, lg: 50 }, lineHeight: 1.12,
            whiteSpace: "nowrap",
            animation: REDUCED ? "none" : "heroLineIn .65s cubic-bezier(0.22,1,0.36,1) .2s both",
          }}>
            {q.light}
          </Box>
        </Box>
      </Typography>

      {/* quote dots — jump anywhere; active pill is sage (jobseekers) or ink (companies) */}
      <Stack direction="row" spacing={0.875} sx={{ mt: 2.25, alignItems: "center" }}>
        {quotes.map((hq, i) => {
          const on = idx === i;
          const activeBg = dark ? C.ink : C.sage;
          return (
            <Box
              key={`${hq.bold}-${i}`}
              onClick={() => onPick(i)}
              role="button" tabIndex={0}
              aria-label={`Show headline ${i + 1}`}
              aria-current={on || undefined}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i); } }}
              sx={{
                height: 7, borderRadius: 999, cursor: "pointer", outline: "none",
                width: on ? 22 : 7,
                bgcolor: on ? activeBg : "rgba(31,31,31,0.18)",
                transition: REDUCED ? "none" : "all .35s cubic-bezier(0.22,1,0.36,1)",
                "&:hover, &:focus-visible": { bgcolor: on ? activeBg : "rgba(31,31,31,0.38)" },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

/* ══ floating info cards around the person (desktop only) ═══════════════
   Shown per view; the hidden view's cards fade out in place. */
function HeroInfoCard({ show, sx, glow = false, children }) {
  return (
    <Paper elevation={0} aria-hidden={!show} sx={{
      position: "absolute", zIndex: 6, display: { xs: "none", md: "block" },
      bgcolor: "#fff", borderRadius: 3.5, p: "16px 18px", textAlign: "left",
      boxShadow: glow
        ? "0 0 0 6px rgba(63,209,122,0.12), 0 0 50px rgba(63,209,122,0.45), 0 24px 55px rgba(31,49,43,0.25)"
        : "0 18px 45px rgba(31,49,43,0.18)",
      border: glow ? "2px solid rgba(63,209,122,0.55)" : "none",
      opacity: show ? 1 : 0,
      pointerEvents: show ? "auto" : "none",
      translate: show ? "0 0" : "0 14px",
      transition: REDUCED ? "none" : "opacity .45s cubic-bezier(0.22,1,0.36,1), translate .45s cubic-bezier(0.22,1,0.36,1)",
      ...sx,
    }}>
      {children}
    </Paper>
  );
}

function CardTitle({ icon, children }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      {icon && (
        <Box component="span" aria-hidden="true" sx={{
          width: 28, height: 28, borderRadius: "9px", bgcolor: C.sageSoft,
          display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0,
        }}>{icon}</Box>
      )}
      <Typography sx={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.ink }}>{children}</Typography>
    </Stack>
  );
}

function CardText({ children, sx }) {
  return <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: C.muted, lineHeight: 1.45, mt: 0.625, ...sx }}>{children}</Typography>;
}

function CirScoreCard({ show, sx }) {
  return (
    <HeroInfoCard show={show} sx={{ width: 205, ...sx }}>
      <CardTitle>CIR Score</CardTitle>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mt: 1 }}>
        <Box sx={{
          width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${C.sageDark} 87%, #E3EBE7 0)`,
          display: "grid", placeItems: "center",
        }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "50%", bgcolor: "#fff",
            display: "grid", placeItems: "center",
            fontFamily: FONT, fontWeight: 800, fontSize: 14, color: C.ink,
          }}>87</Box>
        </Box>
        <CardText sx={{ mt: 0 }}>One interview<br />6 competencies scored</CardText>
      </Stack>
    </HeroInfoCard>
  );
}

/* ══ hero person ════════════════════════════════════════════════════════
   Frameless by construction — there is NO arch/crop/shadow code path left.
   Source order:
     1. HERO_PERSON.src (optional custom transparent cutout from data.jsx)
     2. the bundled flat illustration (src/assets/hero-person.svg) — shipped
        inside the build, so it can never fail to load
   If a custom cutout errors, we drop to the bundled art, never to a frame. */
function HeroPersonImage() {
  const [failedCustom, setFailedCustom] = useState(false);
  const custom = HERO_PERSON.src && !failedCustom;
  return (
    <Box
      component="img"
      src={custom ? HERO_PERSON.src : heroPersonArt}
      alt={HERO_PERSON.alt}
      loading="eager"
      onError={() => { if (custom) setFailedCustom(true); }}
      sx={{
        display: "block",
        position: "relative", zIndex: 3,
        width: { xs: "min(84vw, 320px)", md: 420, lg: 470 },
        height: "auto",
        maxHeight: { xs: "min(112vw, 430px)", md: 530, lg: 590 },
        objectFit: "contain", objectPosition: "center",
        animation: REDUCED ? "none" : "heroPhotoIn 1.1s cubic-bezier(0.22,1,0.36,1) 0.35s both",
        "@keyframes heroPhotoIn": {
          from: { opacity: 0, transform: "translateY(60px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
      }}
    />
  );
}

function CompanyLogoChip({ name, domain, src, fallback }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <Box component="span" sx={{
      width: 26, height: 26, borderRadius: "50%", bgcolor: fallback,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, fontSize: 13, fontWeight: 700,
    }}>
      {name[0]}
    </Box>
  ) : (
    <Box
      component="img"
      src={src || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={`${name} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{ width: src ? 32 : 26, height: src ? 32 : 26, display: "block", objectFit: "contain" }}
    />
  );
}

function HiredStatCard() {
  const [ref, visible] = useInView(0.3);
  const count = useCounter(HERO_JOBS_STAT.value, 1600, visible);
  const stat = HERO_JOBS_STAT;
  // Each bar: entry height + a gentle continuous "breathe" range + timing offsets.
  const bars = [
    { h: 48, c: C.ink,  amp: 10, dur: 2.6, delay: 0.0 },
    { h: 64, c: C.ink,  amp: 14, dur: 2.9, delay: 0.3 },
    { h: 40, c: C.ink,  amp: 9,  dur: 2.4, delay: 0.6 },
    { h: 86, c: C.sage, amp: 12, dur: 3.1, delay: 0.15 },
    { h: 52, c: C.ink,  amp: 13, dur: 2.7, delay: 0.45 },
    { h: 66, c: C.sage, amp: 15, dur: 3.0, delay: 0.2 },
    { h: 44, c: C.ink,  amp: 10, dur: 2.5, delay: 0.5 },
  ];

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        position: "absolute", left: { xs: -8, md: "-14%" }, top: { xs: "48%", md: "44%" },
        bgcolor: "#fff", borderRadius: 3.5, p: "16px 22px",
        boxShadow: "0 22px 55px rgba(31,49,43,0.18)", zIndex: 6,
        minWidth: 148, textAlign: "center",
        // Entry: the whole card fades + lifts in.
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.94)",
        transition: REDUCED ? "none" : "opacity .6s cubic-bezier(0.22,1,0.36,1), transform .6s cubic-bezier(0.22,1,0.36,1)",
        // Continuous idle float once settled.
        animation: (visible && !REDUCED) ? "statFloat 5s ease-in-out .8s infinite" : "none",
        "@keyframes statFloat": {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%":     { transform: "translateY(-6px) scale(1)" },
        },
      }}
    >
      <Stack direction="row" spacing={0.875} sx={{ justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{
          fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.ink, lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {`${count}${stat.suffix}`}
        </Typography>
        <Box component="span" sx={{
          fontSize: 16, lineHeight: 1, display: "inline-block",
          transformOrigin: "bottom center",
          animation: (visible && !REDUCED) ? "briefcaseBob 2.4s ease-in-out infinite" : "none",
          "@keyframes briefcaseBob": {
            "0%,100%": { transform: "translateY(0) rotate(0deg)" },
            "30%":     { transform: "translateY(-3px) rotate(-8deg)" },
            "60%":     { transform: "translateY(-1px) rotate(6deg)" },
          },
        }}>
          {stat.icon}
        </Box>
      </Stack>

      <Stack direction="row" spacing={0.625} sx={{ justifyContent: "center", alignItems: "flex-end", my: 1.375, height: 40 }}>
        {bars.map((b, i) => (
          <Box
            key={i}
            sx={{
              width: { xs: "min(72vw, 7px)", sm: 7 }, borderRadius: "3px 3px 0 0",
              bgcolor: b.c,
              transformOrigin: "bottom center",
              // Entry grow from the baseline.
              height: visible ? `${b.h}%` : "10%",
              transition: REDUCED ? "none"
                : `height .7s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.07}s`,
              // After entry, breathe forever via scaleY (composited, no layout cost).
              animation: (visible && !REDUCED)
                ? `barBreathe${i} ${b.dur}s ease-in-out ${1 + b.delay}s infinite`
                : "none",
              [`@keyframes barBreathe${i}`]: {
                "0%,100%": { transform: "scaleY(1)" },
                "50%":     { transform: `scaleY(${1 + b.amp / b.h})` },
              },
            }}
          />
        ))}
      </Stack>

      <Typography sx={{ fontFamily: FONT, fontSize: 12, color: "#8A8F8B" }}>
        {stat.label}
      </Typography>
    </Paper>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const { goToAIInterview } = useApplyNavigation();

  /* toggle + headline rotation: 3 quotes per view, then the view flips */
  const [view, setView] = useState("seeker");
  const [qIdx, setQIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const pausedRef = useRef(false);
  const V = HERO_VIEWS[view];
  const isCompany = view === "company";

  useEffect(() => {
    const t = setTimeout(() => {
      if (pausedRef.current || document.hidden) { setCycle(c => c + 1); return; }
      if (qIdx < HERO_VIEWS[view].quotes.length - 1) {
        setQIdx(qIdx + 1);
      } else {
        setView(v => HERO_VIEW_ORDER[(HERO_VIEW_ORDER.indexOf(v) + 1) % HERO_VIEW_ORDER.length]);
        setQIdx(0);
      }
    }, QUOTE_MS);
    return () => clearTimeout(t);
  }, [view, qIdx, cycle]);

  const pickView  = (v) => { setView(v); setQIdx(0); setCycle(c => c + 1); };
  const pickQuote = (i) => { setQIdx(i); setCycle(c => c + 1); };

  const onPrimary   = () => (isCompany ? navigate("/auth?view=register-company") : goToAIInterview());
  const onSecondary = () => navigate(isCompany ? "/platform/iaem" : UPLOAD_PATH);


  /* 🔧 SEARCH REDIRECT — the popup results modal is gone. Searching now
     navigates to the dedicated /jobs results page with the filters encoded
     in the URL (?q=&exp=&loc=), Naukri/Indeed-style. */
  const goToResults = ({ query, experience, location }) => {
    const params = new URLSearchParams();
    if (query)      params.set("q",   query);
    if (experience) params.set("exp", experience);
    if (location)   params.set("loc", location);
    const qs = params.toString();
    navigate(qs ? `/jobs?${qs}` : "/jobs");
  };

  return (
    <>
      {/* ══ HERO WRAPPER — pale sage bg with the reference's layered diagonal
             geometry on the right (continuous behind nav + hero) ══ */}
      <Box sx={{
        bgcolor: C.hero, position: "relative",
        clipPath: { md: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" },
        pb: { xs: 6, md: 0 },
        /* 108vh: the bottom clip-path slices ~8% off the left edge, so going
           past 100vh keeps the visible hero filling the entire first fold */
        minHeight: { md: "108vh" },
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* ── BACKGROUND GEOMETRY — exact reference construction ──
            · pale base (wrapper bg)
            · translucent mid-sage under-wedge
            · solid sage main diagonal (steep edge, ~63% top → ~40% bottom)
            · lime corner triangle
            · ONE continuous white ribbon looping across the whole zone,
              drawing itself on load, with the company chips sitting ON its
              crests (Slack · Dribbble · Google · Reddit placement grammar) */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          display: { xs: "none", md: "block" },
        }}>
          <Box sx={{
            position: "absolute", inset: 0, bgcolor: "rgba(126,158,126,0.42)",
            clipPath: "polygon(56% 0, 100% 0, 100% 100%, 28% 100%)",
          }} />
          <Box sx={{
            position: "absolute", inset: 0, bgcolor: C.sage,
            clipPath: "polygon(63% 0, 100% 0, 100% 56%, 40% 100%, 32% 100%)",
          }} />
          <Box sx={{
            position: "absolute", inset: 0, bgcolor: "#BED58F",
            clipPath: "polygon(64% 100%, 100% 52%, 100% 100%)",
          }} />

          {/* ribbon band — right 58% of the hero; single continuous path */}
          <Box sx={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "58%" }}>
            <Box component="svg" viewBox="0 0 800 760" preserveAspectRatio="xMidYMid slice"
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <Box component="path"
                d="M -30 345 C 40 200, 120 130, 195 205 C 240 252, 268 300, 310 262 C 352 224, 330 152, 288 172 C 252 190, 268 262, 352 250 C 452 235, 470 128, 590 122 C 682 118, 700 210, 745 268 C 782 316, 810 360, 840 420"
                fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="6.5" strokeLinecap="round"
                pathLength="1"
                sx={{
                  strokeDasharray: 1, strokeDashoffset: REDUCED ? 0 : 1,
                  animation: REDUCED ? "none" : "ribbonDraw 2.4s cubic-bezier(0.45,0,0.2,1) 0.45s forwards",
                  "@keyframes ribbonDraw": { to: { strokeDashoffset: 0 } },
                }}
              />
            </Box>

            {/* company logo circles seated on the ribbon crests */}
            {[
              { co: HERO_COMPANY_LOGOS[0], sx: { left: "1%",  top: "27%" }, d: 0 },
              { co: HERO_COMPANY_LOGOS[1], sx: { left: "30%", top: "16%" }, d: 0.7 },
              { co: HERO_COMPANY_LOGOS[2], sx: { left: "70%", top: "13%" }, d: 1.4 },
              { co: HERO_COMPANY_LOGOS[3], sx: { left: "88%", top: "36%" }, d: 2.1 },
            ].map(({ co, sx, d }) => (
              <Box key={co.name} title={co.name} sx={{
                position: "absolute", ...sx, zIndex: 5, pointerEvents: "auto",
                width: 50, height: 50, borderRadius: "50%", bgcolor: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 12px 30px rgba(31,49,43,0.18)",
                opacity: REDUCED ? 1 : 0,
                animation: REDUCED ? "none"
                  : `chipPop .6s cubic-bezier(0.34,1.4,0.5,1) ${1.3 + d * 0.2}s forwards, heroFloat 4.5s ease-in-out ${2 + d}s infinite`,
                "@keyframes chipPop": {
                  from: { opacity: 0, transform: "scale(0.4) translateY(14px)" },
                  to:   { opacity: 1, transform: "scale(1) translateY(0)" },
                },
                "@keyframes heroFloat": {
                  "0%,100%": { transform: "translateY(0)" },
                  "50%":     { transform: "translateY(-9px)" },
                },
              }}>
                <CompanyLogoChip {...co} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── HERO CONTENT ── */}
        <Container maxWidth="xl" sx={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", pt: { xs: 12, md: 15 } }}>
          <Stack direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 6, md: 2 }} sx={{ alignItems: { md: "stretch" }, width: "100%", flex: 1 }}>

            {/* Left — heading, copy, underline search */}
            <Box sx={{
              flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              justifyContent: { xs: "center", md: "flex-start" }, pt: { xs: 5, md: 4 }, pb: { md: 10 },
              pl: { md: 6, lg: 10 },
            }}>
              {/* Jobseekers / Companies toggle */}
              <FadeUp>
                <Box role="tablist" aria-label="Choose who you are" sx={{
                  display: "inline-flex", p: 0.5, mb: 2, borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.75)", border: "1px solid rgba(31,31,31,0.08)",
                }}>
                  {HERO_VIEW_ORDER.map(v => {
                    const on = view === v;
                    return (
                      <Box key={v} component="button" type="button" role="tab" aria-selected={on}
                        onClick={() => pickView(v)}
                        sx={{
                          appearance: "none", border: 0, cursor: "pointer", borderRadius: 999,
                          px: { xs: 2, sm: 2.25 }, py: 1.125,
                          fontFamily: FONT, fontSize: { xs: 13, sm: 14 }, fontWeight: 600,
                          bgcolor: on ? C.ink : "transparent", color: on ? "#fff" : C.ink,
                          transition: REDUCED ? "none" : "background-color .3s, color .3s",
                          "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                        }}>
                        {HERO_VIEWS[v].tab}
                      </Box>
                    );
                  })}
                </Box>
              </FadeUp>

              {/* trust badges */}
              <FadeUp delay={0.05}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.25 }}>
                  {HERO_BADGES.map(b => (
                    <Box key={b} component="span" sx={{
                      display: "inline-flex", alignItems: "center", gap: 0.625,
                      px: 1.5, py: 0.625, borderRadius: 999, bgcolor: "rgba(255,255,255,0.7)",
                      fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.ink,
                    }}>
                      <Box component="span" aria-hidden="true" sx={{ color: C.sageDark, fontWeight: 800 }}>✓</Box>
                      {b}
                    </Box>
                  ))}
                </Box>
              </FadeUp>

              <HeroQuoteRotator
                quotes={V.quotes} idx={qIdx} quoteKey={`${view}-${qIdx}`}
                onPick={pickQuote} pausedRef={pausedRef} dark={isCompany}
              />

              {/* sub-line + buttons — re-fade on every view switch */}
              <Box key={view} sx={{
                animation: REDUCED ? "none" : "heroViewIn .5s cubic-bezier(0.22,1,0.36,1) both",
                "@keyframes heroViewIn": {
                  from: { opacity: 0, transform: "translateY(10px)" },
                  to:   { opacity: 1, transform: "translateY(0)" },
                },
              }}>
                <Typography sx={{
                  fontFamily: FONT, fontSize: { xs: 15, md: 17 }, lineHeight: 1.55,
                  color: "#3E4642", mt: 2.5, maxWidth: 580,
                }}>
                  {V.sub}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
                  <Box component="button" type="button" onClick={onPrimary} sx={{
                    appearance: "none", border: 0, cursor: "pointer", borderRadius: 999,
                    px: 3, py: 1.75, bgcolor: C.ink, color: "#fff",
                    fontFamily: FONT, fontSize: 15, fontWeight: 700,
                    transition: REDUCED ? "none" : "transform .2s, box-shadow .2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 24px rgba(31,31,31,0.2)" },
                    "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                  }}>
                    {V.primary}
                  </Box>
                  <Box component="button" type="button" onClick={onSecondary} sx={{
                    appearance: "none", border: 0, cursor: "pointer", borderRadius: 999,
                    px: 3, py: 1.75, bgcolor: "#fff", color: C.ink,
                    fontFamily: FONT, fontSize: 15, fontWeight: 700,
                    transition: REDUCED ? "none" : "transform .2s",
                    "&:hover": { transform: "translateY(-2px)" },
                    "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                  }}>
                    {V.secondary}
                  </Box>
                </Box>

                {isCompany ? (
                  /* company view — feature chips in place of the job search */
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 3, maxWidth: 660 }}>
                    {HERO_FEATURES.map(f => (
                      <Box
                        key={f.label} component="button" type="button"
                        onClick={() => navigate(f.to)}
                        sx={{
                          appearance: "none", cursor: "pointer", minHeight: 40,
                          display: "inline-flex", alignItems: "center", gap: 0.5,
                          bgcolor: "rgba(255,255,255,0.85)", border: "1px solid rgba(31,31,31,0.06)",
                          borderRadius: "12px", px: 1.75, py: 0.875,
                          fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.ink,
                          boxShadow: "0 4px 14px rgba(31,31,31,0.04)",
                          transition: REDUCED ? "none" : "background-color .2s, transform .2s",
                          "&:hover": { bgcolor: "#fff", transform: "translateY(-2px)" },
                          "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                        }}
                      >
                        {f.label}
                        <Box component="span" aria-hidden="true" sx={{ color: C.sage, fontSize: 16, lineHeight: 1 }}>›</Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  /* jobseeker view — job search + popular searches (unchanged behaviour) */
                  <>
                    <Box sx={{ mt: 3 }}>
                      <JobSearchBar onSearch={goToResults} />
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 2.5, maxWidth: 660 }}>
                      {POPULAR_SEARCHES.map(s => (
                        <Box
                          key={s.label} component="button" type="button"
                          onClick={() => navigate(`/jobs?${new URLSearchParams(s.params).toString()}`)}
                          sx={{
                            appearance: "none", cursor: "pointer", minHeight: 40,
                            display: "inline-flex", alignItems: "center", gap: 0.5,
                            bgcolor: "rgba(255,255,255,0.85)", border: "1px solid rgba(31,31,31,0.06)",
                            borderRadius: "12px", px: 1.75, py: 0.875,
                            fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.ink,
                            boxShadow: "0 4px 14px rgba(31,31,31,0.04)",
                            transition: REDUCED ? "none" : "background-color .2s, transform .2s",
                            "&:hover": { bgcolor: "#fff", transform: "translateY(-2px)" },
                            "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                          }}
                        >
                          {s.label}
                          <Box component="span" aria-hidden="true" sx={{ color: C.sage, fontSize: 16, lineHeight: 1 }}>›</Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>

            </Box>

            {/* Right — artwork raised and vertically centred so the full
                illustration is always visible above the partner strip */}
            <Box sx={{
              flex: 1, minWidth: 0, position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Box sx={{ position: "relative", mt: { xs: 2, md: 0 }, mb: { xs: 4, md: 7, lg: 8 } }}>
                {/* dark sage backdrop disc behind the person (reference) */}
                <Box sx={{
                  position: "absolute", zIndex: 2,
                  width: { md: 480, lg: 540 }, height: { md: 480, lg: 540 },
                  borderRadius: "50%", bgcolor: "rgba(108,139,107,0.55)",
                  left: "50%", top: "52%", transform: "translate(-50%, -50%)",
                  display: { xs: "none", md: "block" },
                }} />
                {/* Free-standing person — transparent cutout, no frame.
                    If the cutout PNG fails, we fall back to the arch-framed
                    stock photo so the hero always renders. */}
                <HeroPersonImage />

                {/* jobseeker cards */}
                {!isCompany && <HiredStatCard />}
                <HeroInfoCard show={!isCompany} sx={{ width: 235, left: "-28%", top: "12%" }}>
                  <CardTitle icon="🔍">IRS: Resume Score</CardTitle>
                  <CardText>Scored against the last 100 same-skill JDs.</CardText>
                  <CardText sx={{ color: C.ink, fontWeight: 600, mt: 1 }}>Missing: Docker · REST APIs · SQL</CardText>
                </HeroInfoCard>
                <CirScoreCard show={!isCompany} sx={{ right: "-10%", top: "66%" }} />

                {/* company cards */}
                <HeroInfoCard show={isCompany} sx={{ width: 250, left: "-22%", top: "12%" }}>
                  <CardTitle icon="🔍">IRS: Instant Match</CardTitle>
                  <CardText>Post a JD, get matched CVs instantly, ranked by Quick Interview score, location and salary.</CardText>
                </HeroInfoCard>
                <HeroInfoCard show={isCompany} glow sx={{
                  width: 240, p: "16px 18px", left: { md: "-20%", lg: "-24%", xl: "-50%" }, top: { md: "40%", xl: "38%" },
                }}>
                                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                    <Box component="svg" viewBox="0 0 44 50" aria-hidden="true" sx={{
                      width: 30, height: 34, flexShrink: 0,
                      filter: "drop-shadow(0 0 10px rgba(63,209,122,0.55))",
                    }}>
                      <path d="M22 2 L40 9 V24 C40 36 32 44 22 48 C12 44 4 36 4 24 V9 Z"
                        fill={C.sageSoft} stroke="#3FD17A" strokeWidth="2.5" />
                      <path d="M14 25 L20 31 L31 19" fill="none" stroke={C.sageDark}
                        strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>
                      IAEM Audited
                    </Typography>
                  </Stack>
                  <CardText>Every interviewer reviewed before you shortlist.</CardText>
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 1.25 }}>
                    {["35+ proctoring checks", "Panel fraud detection", "Interviewer score report"].map(t => (
                      <Box component="li" key={t} sx={{
                        display: "flex", alignItems: "center", gap: 1, py: 0.5,
                        borderTop: `1px solid ${C.line}`,
                        fontFamily: FONT, fontSize: 13, color: C.ink,
                      }}>
                        <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3FD17A", flexShrink: 0 }} />
                        {t}
                      </Box>
                    ))}
                  </Box>
                </HeroInfoCard>
                <CirScoreCard show={isCompany} sx={{ right: "-10%", top: "76%" }} />
              </Box>
            </Box>
          </Stack>

          {/* trust bar */}
          <FadeUp delay={0.35} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 0, md: 13 }, mx: { md: 6, lg: 10 }, position: "relative", zIndex: 4 }}>
            <Box sx={{
              display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              bgcolor: "#fff", borderRadius: "16px", overflow: "hidden",
              boxShadow: "0 10px 30px rgba(31,49,43,0.08)",
            }}>
              {HERO_TRUST.map((t, i) => (
                <Box key={t.label} sx={{
                  px: { xs: 2, md: 2.5 }, py: 2,
                  borderLeft: { xs: i % 2 ? `1px solid ${C.line}` : "none", md: i ? `1px solid ${C.line}` : "none" },
                  borderTop: { xs: i > 1 ? `1px solid ${C.line}` : "none", md: "none" },
                }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>{t.value}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: 12.5, color: C.muted }}>{t.label}</Typography>
                </Box>
              ))}
            </Box>
          </FadeUp>
        </Container>
      </Box>
    </>
  );
}