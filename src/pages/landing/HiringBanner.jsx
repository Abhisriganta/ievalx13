import { Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CloudUploadOutlined, CheckCircleRounded } from "@mui/icons-material";
import { C, FONT, REDUCED } from "./theme";
import { FadeUp } from "./primitives";
import { UPLOADCV_ART } from "./data";
import useApplyNavigation from "@/hooks/useApplyNavigation";

/* ══════════════════════════════════════════════════════════════════════════
   UPLOAD CV BANNER (top slot, under the partner strip) — option D layout in
   option B colours: soft sage card, dark headline, black Upload button,
   the existing upload illustration, and two floating "result" chips.
   Upload → profile resume upload (same route as before).
   "No CV? Build one with AI" → AI Resume Builder (guests go to login first
   and come back; other roles go to /platform/resume-builder).
   ══════════════════════════════════════════════════════════════════════════ */

const UPLOAD_PATH  = "/jobseeker/profile?section=resume&action=upload";
const BUILDER_PATH = "/jobseeker/workspace/resume-builder";

export default function HiringBanner() {
  const navigate = useNavigate();
  const { isJobseeker, isAuthenticated } = useApplyNavigation();

  const goBuilder = () => {
    if (isJobseeker) return navigate(BUILDER_PATH);
    if (!isAuthenticated) return navigate("/auth", { state: { from: { pathname: BUILDER_PATH } } });
    return navigate("/platform/resume-builder");
  };

  const chipSx = {
    position: "absolute", zIndex: 3, display: "flex", alignItems: "center", gap: 1.25,
    borderRadius: "14px", px: 1.75, py: 1.25, boxShadow: "0 12px 30px rgba(31,31,31,0.14)",
    fontFamily: FONT,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 9 } }}>
      <FadeUp>
        <Box sx={{
          position: "relative", overflow: "hidden",
          bgcolor: C.sageSoft || "#EDF3EC", borderRadius: { xs: "22px", md: "28px" },
          display: "grid", alignItems: "center",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 420px" },
          px: { xs: 3, sm: 4.5, md: 6.5 }, pt: { xs: 4.5, md: 0 },
          minHeight: { md: 340 },
        }}>
          {/* soft decorative circles */}
          <Box aria-hidden="true" sx={{
            position: "absolute", right: -80, top: -120, width: 420, height: 420,
            borderRadius: "50%", bgcolor: "rgba(127,158,126,0.16)",
          }} />
          <Box aria-hidden="true" sx={{
            position: "absolute", right: 180, bottom: -160, width: 300, height: 300,
            borderRadius: "50%", bgcolor: "rgba(198,217,143,0.35)",
          }} />

          {/* ── copy ── */}
          <Box sx={{ position: "relative", zIndex: 2, py: { md: 6 } }}>
            <Typography component="h2" sx={{
              fontFamily: FONT, fontWeight: 700, color: C.ink,
              fontSize: { xs: 28, sm: 34, md: 42 }, lineHeight: 1.08, letterSpacing: "-0.8px",
            }}>
              Your Next Job Starts
              <Box component="br" sx={{ display: { xs: "none", sm: "block" } }} />
              {" "}With One Upload
            </Typography>
            <Typography sx={{
              fontFamily: FONT, fontSize: { xs: 15, md: 16.5 }, lineHeight: 1.65,
              color: "#3F4440", mt: 1.75, maxWidth: 470,
            }}>
              Upload your CV to see your skill gaps, get a match score on every job and apply faster.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mt: 3.25 }}>
              <Box component="button" type="button" onClick={() => navigate(UPLOAD_PATH)} sx={{
                appearance: "none", border: 0, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 1,
                bgcolor: C.ink, color: "#fff", borderRadius: 999,
                px: 3.5, height: 52, fontFamily: FONT, fontSize: 15.5, fontWeight: 600,
                transition: REDUCED ? "none" : "background-color .25s ease, transform .25s ease",
                "&:hover": { bgcolor: C.sageDark, transform: "translateY(-2px)" },
                "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 3 },
              }}>
                <CloudUploadOutlined sx={{ fontSize: 20 }} />
                Upload CV
              </Box>
              <Box component="button" type="button" onClick={goBuilder} sx={{
                appearance: "none", border: 0, bgcolor: "transparent", p: 0, cursor: "pointer",
                minHeight: 44, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: C.ink,
                textDecoration: "underline", textUnderlineOffset: "4px",
                "&:hover, &:focus-visible": { color: C.sageDark, outline: "none" },
              }}>
                No CV? Build one with AI
              </Box>
            </Box>
          </Box>

          {/* ── illustration + floating result chips ── */}
          <Box sx={{ position: "relative", zIndex: 2, height: { xs: 260, md: 340 }, mt: { xs: 3, md: 0 } }}>
            <Box
              component="img"
              src={UPLOADCV_ART.src}
              alt={UPLOADCV_ART.alt}
              onError={e => { e.currentTarget.style.display = "none"; }}
              sx={{
                position: "absolute", right: { xs: "50%", md: 24 }, bottom: 0,
                transform: { xs: "translateX(50%)", md: "none" },
                height: { xs: 250, md: 320 }, width: "auto", display: "block",
              }}
            />

            <Box sx={{ ...chipSx, bgcolor: "#fff", left: { xs: 0, md: 0 }, top: { xs: 24, md: 56 } }}>
              <Box aria-hidden="true" sx={{
                width: 32, height: 38, borderRadius: "6px", bgcolor: "#FBEBEB", color: "#B5473A",
                fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                PDF
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>
                  resume.pdf
                </Typography>
                <Typography sx={{
                  fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#3E6E3E",
                  display: "flex", alignItems: "center", gap: 0.5, mt: 0.25,
                }}>
                  <CheckCircleRounded sx={{ fontSize: 13 }} /> Uploaded
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              ...chipSx, bgcolor: C.ink, color: "#fff", left: { xs: "auto", md: 28 }, right: { xs: 0, md: "auto" },
              bottom: { xs: 28, md: 44 }, fontSize: 13.5, fontWeight: 600,
            }}>
              92% resume match
            </Box>
          </Box>
        </Box>
      </FadeUp>
    </Container>
  );
}