import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Container, GlobalStyles, Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import publicSageTheme from "@/theme/publicSageTheme";
import { ArrowBack } from "@mui/icons-material";
import { C, FONT, REDUCED, CAN_HOVER } from "../landing/theme";
import { OffcanvasPanel } from "../landing/CardNav";
import MegaNav from "../landing/MegaNav";
import { usePublicJobs } from "@/services/api/publicJobsService";
import useApplyNavigation from "@/hooks/useApplyNavigation";
import FooterSection from "../landing/Footer";
import { FadeUp, Eyebrow } from "../landing/primitives";


export default function PublicLayout({ children, _hero }) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);

  
  const { goToAIInterview, goToAssessments, isJobseeker, isAuthenticated } = useApplyNavigation();

  // Jobseeker-only pages: jobseeker → page · guest → /auth (returns after login) · others → /what-we-offer
  const goSeeker = (path) => {
    if (isJobseeker) return navigate(path);
    if (!isAuthenticated) return navigate("/auth", { state: { from: { pathname: path } } });
    return navigate("/what-we-offer");
  };

  // Live PUBLISHED + APPROVED job count for the MegaNav "Jobs" featured tile
  // (shared cached fetch — the same request the landing sections use).
  const { jobs: liveJobs } = usePublicJobs();
  const liveCount = liveJobs ? liveJobs.length : null;

  // Fresh page = start at the top (react-router keeps scroll otherwise).
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);

  const SECTIONS = [
    {
      label: "Company", match: ["/our-story", "/what-we-offer", "/blogs"],
      groups: [
        { head: "Know us", links: [
          { label: "Our Story",     onClick: () => navigate("/our-story") },
          { label: "What we Offer", onClick: () => navigate("/what-we-offer") },
        ]},
        { head: "Resources", links: [
          { label: "Blog",    onClick: () => navigate("/blogs") },
          { label: "Support", onClick: () => navigate("/support") },
        ]},
      ],
      featured: {
        title: "Hiring you can audit",
        desc: "Every interview scored, every interviewer reviewed. Read why we built iEvalX.",
        cta: "Our Story", onClick: () => navigate("/our-story"),
      },
    },
    {
      label: "Platform", match: ["/platform"],
      groups: [
        { head: "For job seekers", links: [
          { label: "Quick Interview",       onClick: () => navigate("/platform/quick-interview") },
          { label: "AI Practice Interview", onClick: () => navigate("/platform/ai-practice-interview") },
          { label: "AI Resume Builder",     onClick: () => navigate("/platform/resume-builder") },
        ]},
        { head: "For companies", links: [
          { label: "Hiring Pipeline",        onClick: () => navigate("/platform/hiring-pipeline") },
          { label: "IAEM Interviewer Audit", onClick: () => navigate("/platform/iaem") },
        ]},
      ],
      featured: {
        title: "One interview. Six scores. Zero guesswork.",
        desc: "Skill-gap search, 10-minute AI interviews, verified CIR scores and audited interviewers.",
        cta: "What we Offer", onClick: () => navigate("/what-we-offer"),
      },
    },
    {
      label: "Jobs", match: ["/jobs", "/categories"],
      groups: [
        { head: "Find work", links: [
          { label: "Browse jobs",      onClick: () => navigate("/jobs") },
          { label: "Jobs by industry", onClick: () => navigate("/categories") },
        ]},
        { head: "Employers", links: [
          { label: "Post a job",         onClick: () => navigate("/auth?view=register-company") },
          { label: "Run a campus drive", onClick: () => navigate("/auth?view=register-company") },
        ]},
      ],
      featured: {
        title: liveCount == null
          ? "Verified openings live"
          : `${liveCount} verified opening${liveCount === 1 ? "" : "s"} live`,
        desc: "Every role is approved by a verified company. Apply with your CIR, not just your CV.",
        cta: "Browse jobs", onClick: () => navigate("/jobs"),
      },
    },
    {
      label: "Services", match: ["/support", "/services"],
      groups: [
        { head: "For candidates", links: [
          { label: "AI Interviews",         onClick: () => navigate("/services/ai-interviews") },
          { label: "Assessments",           onClick: () => navigate("/services/assessments") },
          { label: "Book a live interview", onClick: () => navigate("/services/live-interviews") },
        ]},
        { head: "For employers", links: [
          { label: "Employer suite",       onClick: () => navigate("/services/employer-suite") },
          { label: "Compliance and audit", onClick: () => navigate("/services/compliance") },
          { label: "Talk to us",           onClick: () => navigate("/support") },
        ]},
      ],
      featured: {
        title: "Shortlist in hours, not weeks",
        desc: "Ranked applicants, CIR scores and auto-advance rounds for hiring teams.",
        cta: "Get started", onClick: () => navigate("/auth?view=register-company"),
      },
    },
  ];

  return (
    /* Scoped sage theme — replaces the app-wide BLUE dashboard theme for
       every public page (/jobs drawer, checkboxes, inputs, selects). */
    <ThemeProvider theme={publicSageTheme}>
    <Box sx={{ fontFamily: FONT, color: C.text, bgcolor: C.cream, minHeight: "100vh" }}>
      <GlobalStyles
        styles={{
         
          "html, body": {
            overflowX: "clip",
            "@supports not (overflow: clip)": { overflowX: "hidden" },
          },
        }}
      />

      <MegaNav
        sections={SECTIONS}
        onLogoClick={() => navigate("/")}
        ctaLabel="Sign In"
        onCtaClick={() => navigate("/auth")}
        onDotsClick={() => setPanelOpen(true)}
      />
      <OffcanvasPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {children}

      <FooterSection />
    </Box>
    </ThemeProvider>
  );
}

/* ── PAGE HERO — pale sage band with breadcrumb-style eyebrow + title.
      Shared by all four public pages so their headers stay identical.  ──── */
export function PageHero({ eyebrow, title, subtitle, back, children }) {
  const navigate = useNavigate();
  return (
    <Box sx={{
      bgcolor: C.hero, position: "relative", overflow: "hidden",
      pt: { xs: 13, md: 16 }, pb: { xs: 4.5, md: 6.5 },
      clipPath: { md: "polygon(0 0, 100% 0, 100% 94%, 0 100%)" },
    }}>
      {/* soft background geometry echoing the landing hero */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: { xs: "none", md: "block" },
      }}>
        <Box sx={{
          position: "absolute", inset: 0, bgcolor: "rgba(126,158,126,0.28)",
          clipPath: "polygon(72% 0, 100% 0, 100% 100%, 55% 100%)",
        }} />
        <Box sx={{
          position: "absolute", inset: 0, bgcolor: "rgba(127,158,126,0.5)",
          clipPath: "polygon(82% 0, 100% 0, 100% 68%, 66% 100%, 62% 100%)",
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <FadeUp>
          {back && (
            <Box
              onClick={() => navigate(back.to)}
              role="link" tabIndex={0} aria-label={back.label}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(back.to); } }}
              sx={{
                display: "inline-flex", alignItems: "center", gap: 0.75,
                mb: 2.5, px: 1.75, height: 36, borderRadius: "999px",
                border: "1.5px solid rgba(31,31,31,0.22)", cursor: "pointer",
                outline: "none", userSelect: "none", bgcolor: "rgba(255,255,255,0.45)",
                fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.ink,
                transition: REDUCED ? "none" : "all .25s ease",
                "& svg": { transition: REDUCED ? "none" : "transform .25s cubic-bezier(0.22,1,0.36,1)" },
                "&:hover": CAN_HOVER ? {
                  bgcolor: C.ink, borderColor: C.ink, color: "#fff",
                  "& svg": { transform: "translateX(-3px)" },
                } : {},
                "&:focus-visible": { borderColor: C.ink },
              }}
            >
              <ArrowBack sx={{ fontSize: 15 }} />
              {back.label}
            </Box>
          )}
          <Eyebrow align="left">{eyebrow}</Eyebrow>
          <Typography component="h1" sx={{
            fontFamily: FONT, fontWeight: 800, color: C.ink,
            fontSize: { xs: 30, sm: 38, md: 48 },
            lineHeight: 1.1, letterSpacing: "-0.5px", mt: 1.5,
          }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{
              fontFamily: FONT, fontSize: { xs: 14, sm: 15.5 }, color: "#4A524C",
              mt: 1.75, maxWidth: 620, lineHeight: 1.75,
            }}>
              {subtitle}
            </Typography>
          )}
        </FadeUp>
        {children && <Box sx={{ mt: 3.5 }}>{children}</Box>}
      </Container>
    </Box>
  );
}