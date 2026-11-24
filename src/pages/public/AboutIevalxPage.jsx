import { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Stack, Container, Button, Paper } from "@mui/material";
import { ArrowForward, ArrowDownward, CheckCircleRounded, CloseRounded } from "@mui/icons-material";
import { C, FONT, REDUCED, CAN_HOVER } from "../landing/theme";
import { FadeUp, Eyebrow } from "../landing/primitives";
import PublicLayout, { PageHero } from "./PublicLayout";
import useApplyNavigation from "@/hooks/useApplyNavigation";
import { ABOUT_HERO, AUDIENCES, AUDIENCE_ORDER, COMPARISON } from "./aboutIevalxData";

/* ══════════════════════════════════════════════════════════════════════════
   ABOUT iEVALX — /platform/about-ievalx
   The only link under the Platform mega-menu. One page, two journeys:
   For Jobseekers / For Companies (switch stored in ?for=companies so the
   view can be deep-linked). Content lives in aboutIevalxData.js.
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
  bgcolor: "#fff", borderRadius: "18px", border: `1px solid ${C.line}`,
  boxShadow: "0 12px 30px rgba(2,33,36,0.05)",
  transition: REDUCED ? "none" : "all .3s cubic-bezier(0.22,1,0.36,1)",
  "&:hover": CAN_HOVER ? {
    transform: "translateY(-3px)", boxShadow: "0 22px 50px rgba(2,33,36,0.1)",
    borderColor: "rgba(127,158,126,0.5)",
  } : {},
};

const btnSx = {
  fontFamily: FONT, textTransform: "none", borderRadius: "999px",
  px: 3, height: 48, fontSize: 14.5, fontWeight: 600, minWidth: 0, lineHeight: 1,
  transition: REDUCED ? "none" : "all .3s cubic-bezier(0.22,1,0.36,1)",
};

/* ── For Jobseekers / For Companies switch ─────────────────────────────── */
function AudienceSwitch({ value, onChange }) {
  return (
    <Box role="tablist" aria-label="Choose your journey" sx={{
      display: "inline-flex", p: "5px", borderRadius: "999px",
      bgcolor: "#fff", border: `1px solid ${C.line}`,
      boxShadow: "0 8px 24px rgba(2,33,36,0.08)",
    }}>
      {AUDIENCE_ORDER.map(key => {
        const on = value === key;
        return (
          <Box
            key={key}
            component="button"
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(key)}
            sx={{
              border: 0, cursor: "pointer", borderRadius: "999px",
              px: { xs: 2, sm: 3 }, height: { xs: 40, sm: 44 },
              fontFamily: FONT, fontSize: { xs: 13.5, sm: 14.5 }, fontWeight: 600,
              bgcolor: on ? C.ink : "transparent", color: on ? "#fff" : C.ink,
              transition: REDUCED ? "none" : "all .25s ease",
              "&:hover": !on && CAN_HOVER ? { bgcolor: C.sageSoft } : {},
              "&:focus-visible": { outline: `2px solid ${C.sage}`, outlineOffset: 2 },
            }}
          >
            {AUDIENCES[key].tab}
          </Box>
        );
      })}
    </Box>
  );
}

/* ── One step on the vertical timeline ─────────────────────────────────── */
function FlowStep({ step, index, isLast }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "44px 1fr", md: "60px 1fr" }, columnGap: { xs: 1.75, md: 2.5 } }}>
      {/* number + connecting line */}
      <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <Box sx={{
          width: { xs: 40, md: 52 }, height: { xs: 40, md: 52 }, borderRadius: "50%",
          bgcolor: C.ink, color: "#fff", display: "grid", placeItems: "center",
          fontFamily: FONT, fontWeight: 700, fontSize: { xs: 14, md: 17 },
          position: "relative", zIndex: 1, boxShadow: `0 0 0 6px ${C.cream}`,
        }}>
          {String(index + 1).padStart(2, "0")}
        </Box>
        {!isLast && (
          <Box sx={{
            position: "absolute", top: { xs: 40, md: 52 }, bottom: 0, width: "2px",
            bgcolor: "rgba(127,158,126,0.45)",
          }} />
        )}
      </Box>

      {/* content */}
      <Box sx={{ pb: isLast ? 0 : { xs: 3, md: 4 } }}>
        <FadeUp delay={0.05}>
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: "18px 18px 20px", md: "22px 26px 24px" } }}>
            <Box component="span" sx={{
              display: "inline-block", fontFamily: FONT, fontSize: 12, fontWeight: 600,
              color: C.sageDark, bgcolor: C.sageSoft, borderRadius: 999, px: 1.5, py: 0.5,
            }}>
              {step.where}
            </Box>
            <Typography component="h3" sx={{ fontFamily: FONT, fontSize: { xs: 17, md: 19 }, fontWeight: 700, color: C.ink, mt: 1.25 }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: C.muted, mt: 0.75, lineHeight: 1.7 }}>
              {step.desc}
            </Typography>

            {step.points?.length > 0 && (
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 1.75, display: "grid", gap: 1 }}>
                {step.points.map(p => (
                  <Stack key={p} component="li" direction="row" spacing={1.1} sx={{ alignItems: "flex-start" }}>
                    <CheckCircleRounded sx={{ fontSize: 18, color: C.sage, mt: "2px", flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.ink, lineHeight: 1.6 }}>{p}</Typography>
                  </Stack>
                ))}
              </Box>
            )}

            {step.result && (
              <Box sx={{
                mt: 2, p: "12px 14px", borderRadius: "12px", bgcolor: C.cream,
                borderLeft: `3px solid ${C.sage}`,
              }}>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}>
                  <Box component="span" sx={{ fontWeight: 700 }}>Result: </Box>{step.result}
                </Typography>
              </Box>
            )}
          </Paper>
        </FadeUp>
      </Box>
    </Box>
  );
}

export default function AboutIevalxPage() {
  const navigate = useNavigate();
  const flowRef = useRef(null);
  const [params, setParams] = useSearchParams();
  const { isAuthenticated } = useApplyNavigation();

  const audience = params.get("for") === "companies" ? "company" : "seeker";
  const data = AUDIENCES[audience];

  const setAudience = (key) =>
    setParams(key === "company" ? { for: "companies" } : {}, { replace: true });

  /* Logged-in users go to /auth, which already redirects to their dashboard. */
  const runCta = () => {
    if (isAuthenticated) return navigate("/auth");
    return navigate(data.cta.action === "company" ? "/auth?view=register-company" : "/auth?view=register");
  };

  const scrollToFlow = () =>
    flowRef.current?.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });

  return (
    <PublicLayout>
      <PageHero
        eyebrow={ABOUT_HERO.eyebrow}
        title={ABOUT_HERO.title}
        subtitle={ABOUT_HERO.subtitle}
        back={{ label: "Back to Home", to: "/" }}
      >
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button
            onClick={runCta}
            endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
            sx={{ ...btnSx, bgcolor: C.ink, color: "#fff", "&:hover": { bgcolor: C.sageDark } }}
          >
            {data.cta.label}
          </Button>
          <Button
            onClick={scrollToFlow}
            endIcon={<ArrowDownward sx={{ fontSize: "16px !important" }} />}
            sx={{
              ...btnSx, bgcolor: "rgba(255,255,255,0.55)", color: C.ink,
              border: "1.5px solid rgba(31,31,31,0.22)",
              "&:hover": { bgcolor: "#fff", borderColor: C.ink },
            }}
          >
            See the full flow
          </Button>
        </Stack>
      </PageHero>

      {/* ── what iEvalX is ── */}
      <Container maxWidth="md" sx={{ mt: { xs: 5, md: 7 } }}>
        <FadeUp>
          <Typography sx={{
            fontFamily: FONT, fontSize: { xs: 17, md: 21 }, fontWeight: 500, color: C.ink,
            textAlign: "center", lineHeight: 1.6,
          }}>
            {ABOUT_HERO.intro}
          </Typography>
        </FadeUp>
      </Container>

      {/* ── sticky audience switch ── */}
      <Box ref={flowRef} sx={{
        position: "sticky", top: { xs: 72, sm: 78, md: 104 }, zIndex: 5,
        mt: { xs: 5, md: 7 }, display: "flex", justifyContent: "center",
        scrollMarginTop: { xs: 72, md: 104 }, pointerEvents: "none",
        "& > *": { pointerEvents: "auto" },
      }}>
        <AudienceSwitch value={audience} onChange={setAudience} />
      </Box>

      {/* key on audience so the sections re-animate when the switch flips */}
      <Box key={audience}>
        {/* ── pin-to-pin flow ── */}
        <Container maxWidth="md" sx={{ mt: { xs: 4, md: 5 } }}>
          <SectionTitle eyebrow="How It Works" title={`${data.steps.length} Steps, Start to Finish`} intro={data.lead} />
          <Box sx={{ mt: { xs: 4, md: 5 } }}>
            {data.steps.map((s, i) => (
              <FlowStep key={s.title} step={s} index={i} isLast={i === data.steps.length - 1} />
            ))}
          </Box>
        </Container>

        {/* ── dashboard tour ── */}
        <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
          <SectionTitle eyebrow="Your Dashboard" title={data.dashboardTitle} />
          <Box sx={{
            display: "grid", gap: 2, mt: 4.5,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}>
            {data.dashboard.map((d, i) => (
              <FadeUp key={d.name} delay={(i % 3) * 0.06} sx={{ height: "100%" }}>
                <Paper elevation={0} sx={{ ...cardSx, p: "18px 20px", height: "100%" }}>
                  <Typography component="h3" sx={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.ink }}>
                    {d.name}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: 13.5, color: C.muted, mt: 0.625, lineHeight: 1.65 }}>
                    {d.desc}
                  </Typography>
                </Paper>
              </FadeUp>
            ))}
          </Box>
        </Container>

        {/* ── advantages ── */}
        <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
          <SectionTitle eyebrow="Advantages" title="What You Gain With iEvalX" />
          <Box sx={{
            display: "grid", gap: 1.75, mt: 4, mx: "auto", maxWidth: 860,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}>
            {data.advantages.map((t, i) => (
              <FadeUp key={t} delay={(i % 2) * 0.08}>
                <Stack direction="row" spacing={1.25} sx={{
                  alignItems: "flex-start", bgcolor: "#fff", border: `1px solid ${C.line}`,
                  borderRadius: "14px", p: "14px 16px", height: "100%",
                }}>
                  <CheckCircleRounded sx={{ fontSize: 20, color: C.sageDark, mt: "1px" }} />
                  <Typography sx={{ fontFamily: FONT, fontSize: 14.5, color: C.ink, lineHeight: 1.55 }}>{t}</Typography>
                </Stack>
              </FadeUp>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── typical portal vs iEvalX ── */}
      <Box sx={{ bgcolor: C.ink, mt: { xs: 7, md: 10 }, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <SectionTitle eyebrow={COMPARISON.eyebrow} title={COMPARISON.title} onDark />
          <FadeUp delay={0.1}>
            <Box sx={{ mt: 4.5, borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* header (desktop) */}
              <Box sx={{
                display: { xs: "none", md: "grid" }, gridTemplateColumns: "180px 1fr 1fr",
                bgcolor: C.inkCard, px: 3, py: 1.75,
              }}>
                {["", "Typical job portal", "iEvalX"].map((h, i) => (
                  <Typography key={i} sx={{
                    fontFamily: FONT, fontSize: 13, fontWeight: 600, letterSpacing: "1.5px",
                    textTransform: "uppercase", color: i === 2 ? C.sage : C.mutedOnDark,
                  }}>
                    {h}
                  </Typography>
                ))}
              </Box>
              {COMPARISON.rows.map((r, i) => (
                <Box key={r.topic} sx={{
                  display: "grid", gridTemplateColumns: { xs: "1fr", md: "180px 1fr 1fr" },
                  gap: { xs: 1, md: 0 }, px: { xs: 2.25, md: 3 }, py: { xs: 2, md: 2.25 },
                  borderTop: i === 0 ? { xs: 0, md: "1px solid rgba(255,255,255,0.08)" } : "1px solid rgba(255,255,255,0.08)",
                  alignItems: "center",
                }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff" }}>{r.topic}</Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", pr: { md: 2 } }}>
                    <CloseRounded sx={{ fontSize: 18, color: "rgba(255,255,255,0.4)", mt: "2px" }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.mutedOnDark, lineHeight: 1.55 }}>{r.typical}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                    <CheckCircleRounded sx={{ fontSize: 18, color: C.sage, mt: "2px" }} />
                    <Typography sx={{ fontFamily: FONT, fontSize: 14, color: "#fff", fontWeight: 500, lineHeight: 1.55 }}>{r.ievalx}</Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
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
            display: "flex", flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" }, justifyContent: "space-between", gap: 3,
          }}>
            <Box>
              <Typography sx={{ fontFamily: FONT, fontSize: { xs: 21, md: 26 }, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                {data.closing.title}
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.mutedOnDark, mt: 1, maxWidth: 460, lineHeight: 1.75 }}>
                {data.closing.desc}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5, flexShrink: 0 }}>
              <Button
                onClick={runCta}
                endIcon={<ArrowForward sx={{ fontSize: "16px !important" }} />}
                sx={{ ...btnSx, bgcolor: C.sage, color: "#fff", "&:hover": { bgcolor: "#fff", color: C.pine } }}
              >
                {data.cta.label}
              </Button>
              <Button
                onClick={() => { setAudience(audience === "seeker" ? "company" : "seeker"); scrollToFlow(); }}
                sx={{
                  ...btnSx, color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                {audience === "seeker" ? "See the company flow" : "See the jobseeker flow"}
              </Button>
            </Stack>
          </Box>
        </FadeUp>
      </Container>
    </PublicLayout>
  );
}