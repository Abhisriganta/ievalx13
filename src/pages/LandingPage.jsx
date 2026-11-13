import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import publicSageTheme from "@/theme/publicSageTheme";

import { C, FONT, REDUCED } from "./landing/theme";
import { OffcanvasPanel } from "./landing/CardNav";
import MegaNav from "./landing/MegaNav";
import { usePublicJobs } from "@/services/api/publicJobsService";
import useApplyNavigation from "@/hooks/useApplyNavigation";

import HeroSection from "./landing/HeroSection";
import PartnerMarquee from "./landing/PartnerMarquee";
import HiringBanner from "./landing/HiringBanner";
import TopIndustries from "./landing/TopIndustries";
import TopCompanies from "./landing/TopCompanies";
import EasyFind from "./landing/EasyFind";
import FeatureJobs from "./landing/FeatureJobs";
import Cta40 from "./landing/Cta40";
import TestimonialsSection from "./landing/Testimonials";
import FaqSection from "./landing/FaqSection";
import UploadCv from "./landing/UploadCv";
import BlogsSection from "./landing/Blogs";
import FooterSection from "./landing/Footer";



const LandingPage = () => {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);

 
  const { goToAIInterview, goToAssessments, isJobseeker, isAuthenticated } = useApplyNavigation();

  // Jobseeker-only pages: jobseeker → page · guest → /auth (returns after login) · others → /what-we-offer
  const goSeeker = (path) => {
    if (isJobseeker) return navigate(path);
    if (!isAuthenticated) return navigate("/auth", { state: { from: { pathname: path } } });
    return navigate("/what-we-offer");
  };

  // Live PUBLISHED + APPROVED job count for the MegaNav "Jobs" featured tile
  // (shared cached fetch — same request Feature Jobs / Categories use).
  const { jobs: liveJobs } = usePublicJobs();
  const liveCount = liveJobs ? liveJobs.length : null;

  const howRef     = useRef(null);
  const catRef     = useRef(null);
  const jobsRef    = useRef(null);
  const blogRef    = useRef(null);
  const testiRef   = useRef(null);

  const scrollTo = (ref) =>
    ref?.current?.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });

  const SECTIONS = [
    {
      label: "Company", match: ["/our-story", "/what-we-offer", "/blogs"],
      groups: [
        { head: "Know us", links: [
          { label: "Our Story",     onClick: () => navigate("/our-story") },
          { label: "What we Offer", onClick: () => navigate("/what-we-offer") },
          { label: "Testimonials",  onClick: () => scrollTo(testiRef) },
        ]},
        { head: "Resources", links: [
          { label: "Blog",    onClick: () => scrollTo(blogRef) },
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
        cta: "See how it works", onClick: () => scrollTo(howRef),
      },
    },
    {
      label: "Jobs", match: ["/jobs", "/categories"],
      groups: [
        { head: "Find work", links: [
          { label: "Browse jobs",       onClick: () => navigate("/jobs") },
          { label: "Jobs by industry",  onClick: () => navigate("/categories") },
          { label: "Featured openings", onClick: () => scrollTo(jobsRef) },
        ]},
        { head: "Employers", links: [
          { label: "Post a job",        onClick: () => navigate("/auth?view=register-company") },
          { label: "Run a campus drive", onClick: () => navigate("/services/campus-drive") },
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
          { label: "AI Interviews",        onClick: () => navigate("/services/ai-interviews") },
          { label: "Assessments",          onClick: () => navigate("/services/assessments") },
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
    /* Scoped sage theme — replaces the app-wide BLUE dashboard theme for the
       whole public landing subtree (drawers, checkboxes, inputs, selects). */
    <ThemeProvider theme={publicSageTheme}>
    <Box sx={{ fontFamily: FONT, color: C.text, bgcolor: C.cream }}>
    
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
        onLogoClick={() => window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" })}
        ctaLabel="Sign In"
        onCtaClick={() => navigate("/auth")}
        onDotsClick={() => setPanelOpen(true)}
      />

      {/* ── OFFCANVAS (fixed; outside the clip-path hero wrapper) ── */}
      <OffcanvasPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      <HeroSection />
      <PartnerMarquee />
      <HiringBanner />
      <TopIndustries catRef={catRef} />
      <TopCompanies />
      <EasyFind />
      <FeatureJobs jobsRef={jobsRef} />
      <Cta40 />
      <TestimonialsSection testiRef={testiRef} />
      <FaqSection />
      <UploadCv />
      <BlogsSection blogRef={blogRef} />
      <FooterSection />
    </Box>
    </ThemeProvider>
  );
};

export default LandingPage;