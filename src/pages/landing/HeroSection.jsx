import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Container, Paper } from "@mui/material";
import { C, FONT, REDUCED } from "./theme";
import { useCounter, useInView } from "./hooks";
import { FadeUp } from "./primitives";
import { HERO_PERSON } from "./data";
import heroPersonArt from "../../assets/images/Herosection.png";
import JobSearchBar from "./JobSearchBar";

/* Headline jobs figure on the stat card — one place to change it. */
const HERO_JOBS_STAT = { value: 5, suffix: " lakh+", label: "Jobs to explore", icon: "💼" };
/* Second stat the card rotates to — same number as the proctoring pages */
const HERO_PROCTOR_STAT = { value: 37, suffix: "-point", label: "AI proctoring checks", icon: "🛡️" };
const STAT_SWAP_MS = 4000;

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


const HERO_QUOTES = [
  { bold: "Evaluate", accent: "Your Skills", post: "", light: "With AI Interviews" },
  { bold: "Elevate",  accent: "Your Career", post: "", light: "With a Verified Score" },
  { bold: "Excel",    accent: "In Every",    post: "", light: "Interview You Take" },
];

/* Product-state chips seated on the ribbon (replace the brand-logo chips) */
const HERO_CHIPS = [
  { text: "AI interview", dot: "#3E6E3E" },
  { text: "CIR score 8.4 / 10",     dot: C.sage },
  { text: "92% resume match",       dot: "#C08A5B" },
  { text: "IRS: 3 skills to add",   dot: C.ink },
];
const QUOTE_MS = 4600;

/* Floating Lanciere logo on the ribbon, right side (file: /public/lanciere-logo.png) */
const HERO_LOGO = { name: "Lanciere Technologies", src: "/lanciere-logo.png", sx: { right: "9%", top: "21%" }, d: 1.75 };

function HeroQuoteRotator() {
  const [idx, setIdx] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setIdx(i => (i + 1) % HERO_QUOTES.length);
    }, QUOTE_MS);
    return () => clearInterval(tick);
  }, []);

  const q = HERO_QUOTES[idx];

  return (
    <Box
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <Typography component="h1" sx={{ fontFamily: FONT, color: C.ink, m: 0 }}>
        <Box
          key={idx}
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
          {/* bold line 2 — the sage accent word */}
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
            {q.post}
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

      {/* quote dots — jump anywhere, active stretches into a sage pill */}
      <Stack direction="row" spacing={0.875} sx={{ mt: 2.25, alignItems: "center" }}>
        {HERO_QUOTES.map((hq, i) => (
          <Box
            key={`${hq.bold}-${i}`}
            onClick={() => setIdx(i)}
            role="button" tabIndex={0}
            aria-label={`Show quote ${i + 1}`}
            aria-current={idx === i || undefined}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIdx(i); } }}
            sx={{
              height: 7, borderRadius: 999, cursor: "pointer", outline: "none",
              width: idx === i ? 22 : 7,
              bgcolor: idx === i ? C.sage : "rgba(31,31,31,0.18)",
              transition: REDUCED ? "none" : "all .35s cubic-bezier(0.22,1,0.36,1)",
              "&:hover, &:focus-visible": { bgcolor: idx === i ? C.sage : "rgba(31,31,31,0.38)" },
            }}
          />
        ))}
      </Stack>
    </Box>
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

function FeatureChip({ text, dot }) {
  return (
    <Box component="span" sx={{
      display: "inline-flex", alignItems: "center", gap: 1,
      fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.ink, whiteSpace: "nowrap",
    }}>
      <Box component="span" aria-hidden="true" sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: dot, flexShrink: 0 }} />
      {text}
    </Box>
  );
}

function HiredStatCard() {
  const [ref, visible] = useInView(0.3);
  const jobsCount = useCounter(HERO_JOBS_STAT.value, 1600, visible);
  const proctorCount = useCounter(HERO_PROCTOR_STAT.value, 1600, visible);
  const [statIdx, setStatIdx] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setStatIdx(i => (i === 0 ? 1 : 0)), STAT_SWAP_MS);
    return () => clearInterval(t);
  }, [visible]);
  const stat = statIdx === 0 ? HERO_JOBS_STAT : HERO_PROCTOR_STAT;
  const count = statIdx === 0 ? jobsCount : proctorCount;
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

            {/* product-state chips seated on the ribbon crests */}
            {[
              { chip: HERO_CHIPS[0], sx: { left: "0%",  top: "27%" }, d: 0 },
              { chip: HERO_CHIPS[1], sx: { left: "24%", top: "15%" }, d: 0.7 },
              { chip: HERO_CHIPS[2], sx: { left: "58%", top: "11%" }, d: 1.4 },
              { chip: HERO_CHIPS[3], sx: { right: "2%", top: "36%" }, d: 2.1 },
            ].map(({ chip, sx, d }) => (
              <Box key={chip.text} sx={{
                position: "absolute", ...sx, zIndex: 5, pointerEvents: "auto",
                height: 44, px: 2, borderRadius: 999, bgcolor: "#fff",
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
                <FeatureChip {...chip} />
              </Box>
            ))}

            {/* floating Lanciere company logo */}
            <Box component="img" src={HERO_LOGO.src} alt={`${HERO_LOGO.name} logo`} title={HERO_LOGO.name}
              onError={e => { e.currentTarget.style.display = "none"; }}
              sx={{
                position: "absolute", ...HERO_LOGO.sx, zIndex: 5,
                width: 54, height: 54, borderRadius: "50%", objectFit: "contain", display: "block",
                bgcolor: "#fff", p: "10px", boxSizing: "border-box",
                boxShadow: "0 12px 30px rgba(31,49,43,0.18)",
                opacity: REDUCED ? 1 : 0,
                animation: REDUCED ? "none"
                  : `chipPop .6s cubic-bezier(0.34,1.4,0.5,1) ${1.3 + HERO_LOGO.d * 0.2}s forwards, heroFloat 4.5s ease-in-out ${2 + HERO_LOGO.d}s infinite`,
              }} />
          </Box>
        </Box>

        {/* ── HERO CONTENT ── */}
        <Container maxWidth="xl" sx={{ position: "relative", flex: 1, display: "flex", pt: { xs: 12, md: 15 } }}>
          <Stack direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 6, md: 2 }} sx={{ alignItems: { md: "stretch" }, width: "100%" }}>

            {/* Left — heading, copy, underline search */}
            <Box sx={{
              flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              justifyContent: { xs: "center", md: "flex-start" }, pt: { xs: 5, md: 4 }, pb: { md: 10 },
              pl: { md: 6, lg: 10 },
            }}>
              <FadeUp>
                <Box sx={{
                  display: "inline-flex", alignItems: "center", gap: 1, alignSelf: "flex-start",
                  mb: 2.5, px: 2, py: 0.875, borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.7)", border: "1px solid rgba(31,31,31,0.08)",
                  fontFamily: FONT, fontSize: { xs: 12.5, sm: 13.5 }, fontWeight: 600, color: C.ink,
                }}>
                  <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: C.sageDark }} />
                  Evaluate. Elevate. Excel.
                </Box>
              </FadeUp>
              <HeroQuoteRotator />
              <FadeUp delay={0.2} sx={{ mt: { xs: 5, md: 7 } }}>
                <JobSearchBar onSearch={goToResults} />
              </FadeUp>
              <FadeUp delay={0.3}>
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
              </FadeUp>

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

                <HiredStatCard />
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}