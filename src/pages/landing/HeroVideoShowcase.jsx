import { useRef, useState } from "react";
import { Box } from "@mui/material";
import { C, REDUCED } from "./theme";

/* Landscape hero video bite — replaces the hero person image.
   Autoplays muted + loops; pause / mute controls sit bottom-left so the
   IRS/CIR card on the bottom-right corner never covers them. */
export default function HeroVideoShowcase({
  src = "/videos/hero-bite.mp4",
  poster = "/videos/hero-bite-poster.jpg",
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(!REDUCED);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const ctrl = {
    appearance: "none", border: 0, cursor: "pointer",
    width: 30, height: 30, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.95)",
    display: "grid", placeItems: "center", color: C.ink, fontSize: 12, lineHeight: 1,
    "&:hover": { bgcolor: "#fff" },
    "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
  };

  return (
    <Box sx={{
      position: "relative", zIndex: 3,
      width: { xs: "min(92vw, 420px)", md: 420, lg: 460 },
      aspectRatio: "16 / 9",
      bgcolor: "#fff", borderRadius: "26px", p: "7px", boxSizing: "border-box",
      boxShadow: "0 26px 60px rgba(31,49,43,0.22)",
      animation: REDUCED ? "none" : "heroVideoIn 1.1s cubic-bezier(0.22,1,0.36,1) 0.35s both",
      "@keyframes heroVideoIn": {
        from: { opacity: 0, transform: "translateY(40px)" },
        to:   { opacity: 1, transform: "translateY(0)" },
      },
    }}>
      <Box sx={{ position: "relative", width: "100%", height: "100%", borderRadius: "20px", overflow: "hidden", bgcolor: C.sageDark }}>
        <Box
          component="video"
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={!REDUCED}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="iEvalX AI interview preview"
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        <Box sx={{ position: "absolute", left: 12, bottom: 10, display: "flex", gap: 1 }}>
          <Box component="button" type="button" onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"} sx={ctrl}>
            {playing ? "❚❚" : "▶"}
          </Box>
          <Box component="button" type="button" onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"} sx={ctrl}>
            {muted ? "🔇" : "🔊"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}