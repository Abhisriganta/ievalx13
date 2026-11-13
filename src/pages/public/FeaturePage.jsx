import { useRef } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Box, Typography, Stack, Container, Button, Paper } from "@mui/material";
import { ArrowForward, ArrowDownward, CheckCircleRounded } from "@mui/icons-material";
import { C, FONT, REDUCED, CAN_HOVER } from "../landing/theme";
import { FadeUp, Eyebrow } from "../landing/primitives";
import PublicLayout, { PageHero } from "./PublicLayout";
import useApplyNavigation from "@/hooks/useApplyNavigation";
import { FEATURE_PAGES } from "./featurePagesData";

/* ══════════════════════════════════════════════════════════════════════════
   PLATFORM FEATURE PAGE — /platform/:slug
   One template for every Platform mega-menu link (content in
   featurePagesData.js). Public: nothing here asks for login except the
   page's main CTA, which is auth-aware.
   ══════════════════════════════════════════════════════════════════════════ */

const SectionTitle = ({ eyebrow, title, intro, onDark = false }) => (
  <FadeUp>
    {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
    <Typography component="h2" sx={{
      fontFamily: FONT, fontSize: { xs: 26, md: 32 }, fontWeight: 700,
      color: onDark ? "#fff" : C.ink, textAlign: "center", mt: 1, lineHeight: 1.2,
    }}>
      {title}
    </Typography>
    {intro && (
      <Typography sx={{
        fontFamily: FONT, fontSize: { xs: 14, md: 15 }, color: onDark ? C.mutedOnDark : C.muted,
        textAlign: "center", mt: 1.5, mx: "auto", maxWidth: 640, lineHeight: 1.75,
      }}>
        {intro}
      </Typography>
    )}
  </FadeUp>
);

const cardSx = {
  bgcolor: "#fff", borderRadius: "18px", p: "22px 22px 24px", height: "100%",
  border: `1px solid ${C.line}`, boxShadow: "0 12px 30px rgba(2,33,36,0.05)",
  transition: REDUCED ? "none" : "all .3s cubic-bezier(0.22,1,0.36,1)",
  "&:hover": CAN_HOVER ? {
    transform: "translateY(-4px)", boxShadow: "0 22px 50px rgba(2,33,36,0.1)",
    borderColor: "rgba(127,158,126,0.5)",
  } : {},
};

function Block({ block }) {
  if (block.type === "cards") {
    return (
      <>
        <SectionTitle eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <Box sx={{
          display: "grid", gap: 2.5, mt: 4.5,
          gridTemplateColumns: {
            xs: "1fr", sm: "repeat(2, 1fr)",
            md: block.items.length === 4 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          },
        }}>
          {block.items.map((it, i) => (
            <FadeUp key={it.title} delay={(i % 3) * 0.08} sx={{ height: "100%" }}>
              <Paper elevation={0} sx={cardSx}>
                <Typography component="h3" sx={{ fontFamily: FONT, fontSize: 16.5, fontWeight: 700, color: C.ink }}>
                  {it.title}
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: C.muted, mt: 0.875, lineHeight: 1.7 }}>
                  {it.desc}
                </Typography>
              </Paper>
            </FadeUp>
          ))}
        </Box>
      </>
    );
  }

  if (block.type === "chips") {
    return (
      <>
        <SectionTitle eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <FadeUp delay={0.1}>
          <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1.25, mt: 4 }}>
            {block.items.map(t => (
              <Box key={t} component="span" sx={{
                fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.ink,
                bgcolor: "#fff", border: `1px solid ${C.line}`, borderRadius: 999,
                px: 2.25, py: 1.125,
              }}>
                {t}
              </Box>
            ))}
          </Stack>
        </FadeUp>
      </>
    );
  }

  if (block.type === "checklist") {
    return (
      <>
        <SectionTitle eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <Box sx={{
          display: "grid", gap: 1.75, mt: 4, mx: "auto", maxWidth: 860,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}>
          {block.items.map((t, i) => (
            <FadeUp key={t} delay={(i % 2) * 0.08}>
              <Stack direction="row" spacing={1.25} sx={{
                alignItems: "flex-start", bgcolor: "#fff", border: `1px solid ${C.line}`,
                borderRadius: "14px", p: "14px 16px",
              }}>
                <CheckCircleRounded sx={{ fontSize: 20, color: C.sageDark, mt: "1px" }} />
                <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: C.ink, lineHeight: 1.55 }}>{t}</Typography>
              </Stack>
            </FadeUp>
          ))}
        </Box>
      </>
    );
  }

  if (block.type === "callout") {
    return (
      <FadeUp>
        <Box sx={{
          bgcolor: C.sageSoft, borderRadius: "22px", px: { xs: 3, md: 6 }, py: { xs: 4, md: 5 },
          textAlign: "center",
        }}>
          <Eyebrow>{block.eyebrow}</Eyebrow>
          <Typography component="h2" sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: C.ink, mt: 1 }}>
            {block.title}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: 14, md: 15.5 }, color: "#4A524C", mt: 1.5, mx: "auto", maxWidth: 640, lineHeight: 1.75 }}>
            {block.text}
          </Typography>
        </Box>
      </FadeUp>
    );
  }

  return null;
}

export default function FeaturePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const stepsRef = useRef(null);
  const { goToAIInterview, isJobseeker, isAuthenticated } = useApplyNavigation();

  const page = FEATURE_PAGES[slug];
  if (!page) return <Navigate to="/" replace />;

  /* Jobseeker-only pages: jobseeker → page · guest → /auth (returns after login) · others → /what-we-offer */
  const goSeeker = (path) => {
    if (isJobseeker) return navigate(path);
    if (!isAuthenticated) return navigate("/auth", { state: { from: { pathname: path } } });
    return navigate("/what-we-offer");
  };

  const ACTIONS = {
    quickInterview: () => goSeeker("/jobseeker/profile"),
    practice:       goToAIInterview,
    resumeBuilder:  () => goSeeker("/jobseeker/workspace/resume-builder"),
    postJob:        () => navigate(isAuthenticated ? "/auth" : "/auth?view=register-company"),
    contact:        () => navigate("/support"),
  };
  const runCta = ACTIONS[page.cta.action] || (() => navigate("/auth"));

  const scrollToSteps = () =>
    stepsRef.current?.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });

  const primaryBtnSx = {
    fontFamily: FONT, textTransform: "none", borderRadius: "999px",
    px: 3, height: 48, fontSize: 14.5, fontWeight: 600, minWidth: 0, lineHeight: 1,
    transition: REDUCED ? "none" : "all .3s cubic-bezier(0.22,1,0.36,1)",
  };

  return (
    <PublicLayout>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        back={{ label: "Back to Home", to: "/" }}
      >
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button
            onClick={runCta}
            endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
            sx={{ ...primaryBtnSx, bgcolor: C.ink, color: "#fff", "&:hover": { bgcolor: C.sageDark } }}
          >
            {page.cta.label}
          </Button>
          <Button
            onClick={scrollToSteps}
            endIcon={<ArrowDownward sx={{ fontSize: "16px !important" }} />}
            sx={{
              ...primaryBtnSx, bgcolor: "rgba(255,255,255,0.55)", color: C.ink,
              border: "1.5px solid rgba(31,31,31,0.22)",
              "&:hover": { bgcolor: "#fff", borderColor: C.ink },
            }}
          >
            How it works
          </Button>
        </Stack>
      </PageHero>

      {/* ── what it is ── */}
      <Container maxWidth="md" sx={{ mt: { xs: 5, md: 7 } }}>
        <FadeUp>
          <Typography sx={{
            fontFamily: FONT, fontSize: { xs: 17, md: 21 }, fontWeight: 500, color: C.ink,
            textAlign: "center", lineHeight: 1.6,
          }}>
            {page.whatItIs}
          </Typography>
        </FadeUp>
      </Container>

      {/* ── how it works ── */}
      <Container maxWidth="lg" ref={stepsRef} sx={{ mt: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
        <SectionTitle eyebrow="How It Works" title={page.stepsTitle || `${page.steps.length} Simple Steps`} />
        <Box sx={{
          display: "grid", gap: 2.5, mt: 4.5,
          gridTemplateColumns: {
            xs: "1fr", sm: "repeat(2, 1fr)",
            md: `repeat(${page.steps.length}, 1fr)`,
          },
        }}>
          {page.steps.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.1} sx={{ height: "100%" }}>
              <Paper elevation={0} sx={{ ...cardSx, bgcolor: C.cream }}>
                <Typography sx={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, color: C.sage, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </Typography>
                <Typography component="h3" sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.ink, mt: 1.75 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: C.muted, mt: 0.875, lineHeight: 1.7 }}>
                  {s.desc}
                </Typography>
              </Paper>
            </FadeUp>
          ))}
        </Box>
      </Container>

      {/* ── feature-specific blocks ── */}
      {page.blocks.map(b => (
        <Container key={b.title} maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
          <Block block={b} />
        </Container>
      ))}

      {/* ── what you get ── */}
      <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
        <Block block={{ type: "checklist", eyebrow: "What You Get", title: "Built to Save You Time", items: page.benefits }} />
      </Container>

      {/* ── what makes it different ── */}
      <Box sx={{ bgcolor: C.ink, mt: { xs: 7, md: 10 }, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <FadeUp>
            <Eyebrow onDark>What Makes It Different</Eyebrow>
            <Typography sx={{
              fontFamily: FONT, fontSize: { xs: 20, md: 26 }, fontWeight: 600, color: "#fff",
              textAlign: "center", mt: 1.5, lineHeight: 1.5,
            }}>
              {page.different}
            </Typography>
          </FadeUp>
        </Container>
      </Box>

      {/* ── closing CTA ── */}
      <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 }, mb: { xs: 6, md: 9 } }}>
        <FadeUp>
          <Box sx={{
            borderRadius: "22px", overflow: "hidden",
            background: `linear-gradient(120deg, ${C.pine} 0%, ${C.pine2} 100%)`,
            px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 },
          }}>
            <Typography sx={{ fontFamily: FONT, fontSize: { xs: 21, md: 26 }, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
              {page.closing.title}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.mutedOnDark, mt: 1, maxWidth: 460, lineHeight: 1.75 }}>
              {page.closing.desc}
            </Typography>
            <Button
              onClick={runCta}
              endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
              sx={{ ...primaryBtnSx, mt: 3, bgcolor: C.sage, color: "#fff", "&:hover": { bgcolor: "#fff", color: C.pine } }}
            >
              {page.cta.label}
            </Button>
          </Box>
        </FadeUp>
      </Container>
    </PublicLayout>
  );
}