import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography, Container, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { VerifiedRounded, ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { C, FONT, REDUCED, CAN_HOVER } from "./theme";
import { FadeUp, Eyebrow, SageButton } from "./primitives";
import { usePublicJobs } from "@/services/api/publicJobsService";

/* ══════════════════════════════════════════════════════════════════════════
   TOP COMPANIES HIRING NOW — landing section (Naukri-style), placed under
   Top Industries. Built from the shared cached jobs list (usePublicJobs),
   so it adds no new request:
     • groups published jobs by company, ranks by open roles (desc)
     • filter tabs = the industries present among those companies
     • card: logo (or initials on company colour), name, Verified badge,
       open roles, industry, "View jobs" → /jobs?q=<company>
     • Naukri-style carousel: one horizontal row, prev/next arrows scroll
       by one card (scroll-snap; arrows disable at the ends; swipe works)
   Dev-only dummy companies show under `npm run dev` while the backend is
   unreachable; production never renders them. Renders nothing when there
   is no data in production, so no empty band ever shows.
   ══════════════════════════════════════════════════════════════════════════ */

const MAX_CARDS = 12;
const MAX_TABS  = 4;   // "All" + up to 4 industries

/* DEV-ONLY dummy companies — for local layout testing ONLY.
   import.meta.env.DEV is false in production builds, so these well-known
   names never appear on the live site (showing them there would imply they
   hire through iEvalX). Real companies replace them once the API responds. */
const logo = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const DEMO_COMPANIES = [
  { name: "TCS",               initials: "TCS", color: "#24433E", industry: "Information Technology", roles: 12, logoUrl: logo("tcs.com") },
  { name: "Infosys",           initials: "IN",  color: "#4F6E4E", industry: "Information Technology", roles: 10, logoUrl: logo("infosys.com") },
  { name: "HDFC Bank",         initials: "HD",  color: "#022124", industry: "Banking & Finance",      roles: 9,  logoUrl: logo("hdfcbank.com") },
  { name: "Wipro",             initials: "WI",  color: "#6C8B6B", industry: "Information Technology", roles: 8,  logoUrl: logo("wipro.com") },
  { name: "ICICI Bank",        initials: "IC",  color: "#C08A5B", industry: "Banking & Finance",      roles: 7,  logoUrl: logo("icicibank.com") },
  { name: "Apollo Hospitals",  initials: "AH",  color: "#7F9E7E", industry: "Healthcare",             roles: 6,  logoUrl: logo("apollohospitals.com") },
  { name: "HCLTech",           initials: "HCL", color: "#1F1F1F", industry: "Information Technology", roles: 6,  logoUrl: logo("hcltech.com") },
  { name: "Tata Motors",       initials: "TM",  color: "#24433E", industry: "Manufacturing",          roles: 5,  logoUrl: logo("tatamotors.com") },
  { name: "Mahindra",          initials: "MA",  color: "#C08A5B", industry: "Manufacturing",          roles: 4,  logoUrl: logo("mahindra.com") },
  { name: "Flipkart",          initials: "FK",  color: "#4F6E4E", industry: "E-commerce",             roles: 4,  logoUrl: logo("flipkart.com") },
  { name: "Axis Bank",         initials: "AX",  color: "#6C8B6B", industry: "Banking & Finance",      roles: 3,  logoUrl: logo("axisbank.com") },
  { name: "Fortis Healthcare", initials: "FH",  color: "#022124", industry: "Healthcare",             roles: 3,  logoUrl: logo("fortishealthcare.com") },
];

/* jobs → [{ name, logoUrl, initials, color, industry, roles }] ranked by roles */
function groupCompanies(jobs) {
  const map = new Map();
  for (const j of jobs || []) {
    const cur = map.get(j.co);
    if (cur) {
      cur.roles += 1;
      cur.industries[j.industry] = (cur.industries[j.industry] || 0) + 1;
      if (!cur.logoUrl && j.logoUrl) cur.logoUrl = j.logoUrl;
    } else {
      map.set(j.co, {
        name: j.co, logoUrl: j.logoUrl, initials: j.initials, color: j.color,
        roles: 1, industries: { [j.industry]: 1 },
      });
    }
  }
  return [...map.values()]
    .map(c => ({
      ...c,
      industry: Object.entries(c.industries).sort((a, b) => b[1] - a[1])[0][0],
    }))
    .sort((a, b) => (b.roles - a.roles) || a.name.localeCompare(b.name));
}

function CompanyLogo({ co }) {
  const [failed, setFailed] = useState(false);
  return co.logoUrl && !failed ? (
    <Box component="img" src={co.logoUrl} alt={`${co.name} logo`} loading="lazy"
      onError={() => setFailed(true)}
      sx={{
        width: 60, height: 60, borderRadius: "16px", objectFit: "contain",
        bgcolor: "#fff", border: `1px solid ${C.line}`, p: "10px",
      }} />
  ) : (
    <Box aria-hidden="true" sx={{
      width: 60, height: 60, borderRadius: "16px", bgcolor: co.color || C.sage,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, fontSize: 19, fontWeight: 700,
    }}>
      {co.initials}
    </Box>
  );
}

export default function TopCompanies() {
  const navigate = useNavigate();
  const { jobs, loading: apiLoading } = usePublicJobs();
  const [tab, setTab] = useState("All");
  const trackRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  /* arrow state from the track's scroll position */
  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setEdge(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  });

  /* back to the first card whenever the filter changes */
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [tab]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: REDUCED ? "auto" : "smooth" });
  };

  const live      = groupCompanies(jobs);
  const showDemo  = (import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO === "true") && live.length === 0;
  const loading   = apiLoading && !showDemo;
  const companies = showDemo ? DEMO_COMPANIES : live;

  const isEmpty   = !loading && companies.length === 0;

  /* tabs: industries with the most companies */
  const indCount = {};
  companies.forEach(c => { indCount[c.industry] = (indCount[c.industry] || 0) + 1; });
  const tabs = ["All", ...Object.entries(indCount)
    .sort((a, b) => b[1] - a[1]).slice(0, MAX_TABS).map(([name]) => name)];
  const activeTab = tabs.includes(tab) ? tab : "All";

  const shown = (activeTab === "All" ? companies : companies.filter(c => c.industry === activeTab))
    .slice(0, MAX_CARDS);

  const openCompany = (name) => navigate(`/jobs?q=${encodeURIComponent(name)}`);

  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: C.cream }}>
      <Container maxWidth="lg">
        <FadeUp>
          <Box sx={{ textAlign: "center" }}>
            <Eyebrow>Verified Employers</Eyebrow>
            <Typography component="h2" sx={{
              fontFamily: FONT, fontSize: { xs: 24, sm: 28, md: 36 }, fontWeight: 700, color: C.ink, mt: 2,
            }}>
              Top Companies Hiring Now
            </Typography>
            <Typography sx={{
              fontFamily: FONT, fontSize: { xs: 14, md: 15.5 }, color: C.muted, mt: 1.25, mx: "auto", maxWidth: 560,
            }}>
              Every company is verified before its first job goes live.
            </Typography>
          </Box>
        </FadeUp>

        {/* ── industry filter tabs ── */}
        {!loading && tabs.length > 2 && (
          <FadeUp delay={0.05}>
            <Box role="tablist" aria-label="Filter companies by industry" sx={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mt: 3.5,
            }}>
              {tabs.map(t => {
                const on = t === activeTab;
                return (
                  <Box key={t} component="button" type="button" role="tab" aria-selected={on}
                    onClick={() => setTab(t)}
                    sx={{
                      appearance: "none", cursor: "pointer", minHeight: 40,
                      fontFamily: FONT, fontSize: 14, fontWeight: 600,
                      px: 2.25, borderRadius: 999,
                      bgcolor: on ? C.ink : "#fff", color: on ? "#fff" : C.ink,
                      border: `1px solid ${on ? C.ink : C.line}`,
                      transition: REDUCED ? "none" : "all .2s",
                      "&:hover": on ? {} : { borderColor: C.sage },
                      "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                    }}>
                    {t}
                  </Box>
                );
              })}
            </Box>
          </FadeUp>
        )}

        {/* ── company cards: Naukri-style carousel ── */}
        <Box sx={{ position: "relative", mt: 4 }}>
          <Box
            ref={trackRef}
            role="region"
            aria-label="Top companies hiring now"
            sx={{
              display: "flex", gap: 2, overflowX: "auto", scrollSnapType: "x mandatory",
              scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
              py: 1, px: 0.5, mx: -0.5,
            }}
          >
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={250} sx={{
                borderRadius: "20px", flex: { xs: "0 0 78%", sm: "0 0 calc((100% - 16px) / 2)", md: "0 0 calc((100% - 48px) / 4)" },
              }} />
            ))}

            {!loading && shown.map(co => (
              <Box key={co.name} data-card sx={{
                flex: { xs: "0 0 78%", sm: "0 0 calc((100% - 16px) / 2)", md: "0 0 calc((100% - 48px) / 4)" },
                scrollSnapAlign: "start", minWidth: 0,
                bgcolor: "#fff", border: `1px solid ${C.line}`, borderRadius: "20px",
                p: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", gap: 1,
                transition: REDUCED ? "none" : "transform .25s, box-shadow .25s, border-color .25s",
                "&:hover": CAN_HOVER ? {
                  transform: "translateY(-4px)", boxShadow: "0 18px 40px rgba(31,31,31,0.08)",
                  borderColor: "rgba(127,158,126,0.5)",
                } : {},
              }}>
                <CompanyLogo co={co} />
                <Typography noWrap title={co.name} sx={{
                  fontFamily: FONT, fontSize: 16.5, fontWeight: 700, color: C.ink, mt: 0.75, maxWidth: "100%",
                }}>
                  {co.name}
                </Typography>
                <Box sx={{
                  display: "inline-flex", alignItems: "center", gap: 0.5,
                  fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#3E6E3E",
                  bgcolor: "#E5F0E4", borderRadius: 999, px: 1.25, py: 0.4,
                }}>
                  <VerifiedRounded sx={{ fontSize: 14 }} /> Verified
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: 13, color: C.muted }}>
                  {`${co.roles} open role${co.roles === 1 ? "" : "s"}`}
                </Typography>
                <Typography noWrap sx={{ fontFamily: FONT, fontSize: 12.5, color: C.muted, maxWidth: "100%" }}>
                  {co.industry}
                </Typography>
                <Box component="button" type="button" onClick={() => openCompany(co.name)}
                  aria-label={`View jobs at ${co.name}`}
                  sx={{
                    appearance: "none", cursor: "pointer", mt: "auto", minHeight: 40,
                    fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.sageDark,
                    bgcolor: "#fff", border: "1px solid #C9D2C7", borderRadius: 999, px: 2.75,
                    transition: REDUCED ? "none" : "all .2s",
                    "&:hover": { bgcolor: C.sage, borderColor: C.sage, color: "#fff" },
                    "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
                  }}>
                  View jobs
                </Box>
              </Box>
            ))}

            {/* ── no companies yet — friendly message instead of hiding the section ── */}
            {isEmpty && (
              <Box sx={{
                flex: "1 1 100%", textAlign: "center", py: { xs: 5, md: 6 }, px: 2,
                bgcolor: "#fff", border: `1px dashed ${C.line}`, borderRadius: "20px",
              }}>
                <Box aria-hidden="true" sx={{
                  width: 56, height: 56, borderRadius: "50%", mx: "auto",
                  bgcolor: "#E5F0E4", color: "#3E6E3E",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <VerifiedRounded sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.ink, mt: 2 }}>
                  Verified companies are on their way
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.muted, mt: 0.75, maxWidth: 440, mx: "auto" }}>
                  Companies will appear here as soon as verified employers publish their first openings.
                </Typography>
              </Box>
            )}
          </Box>

          {/* ── prev / next arrows (hidden on touch-size screens; swipe works there) ── */}
          {!loading && !isEmpty && [
            { dir: -1, label: "Previous companies", Icon: ChevronLeftRounded, side: { left: -22 }, off: edge.start },
            { dir: 1,  label: "Next companies",     Icon: ChevronRightRounded, side: { right: -22 }, off: edge.end },
          ].map(({ dir, label, Icon, side, off }) => (
            <Box key={dir} component="button" type="button" aria-label={label}
              onClick={() => scrollByCard(dir)} disabled={off}
              sx={{
                display: { xs: "none", md: "flex" }, position: "absolute", top: "50%", ...side,
                transform: "translateY(-50%)", zIndex: 2,
                width: 44, height: 44, borderRadius: "50%", alignItems: "center", justifyContent: "center",
                appearance: "none", cursor: off ? "default" : "pointer",
                bgcolor: "#fff", border: `1px solid ${C.line}`, color: C.ink,
                boxShadow: "0 8px 22px rgba(31,31,31,0.12)",
                opacity: off ? 0 : 1, pointerEvents: off ? "none" : "auto",
                transition: REDUCED ? "none" : "opacity .2s, background-color .2s",
                "&:hover": { bgcolor: C.sageSoft || "#EDF3EC" },
                "&:focus-visible": { outline: `2px solid ${C.sageDark}`, outlineOffset: 2 },
              }}>
              <Icon sx={{ fontSize: 26 }} />
            </Box>
          ))}
        </Box>

        {!loading && (
          <FadeUp delay={0.1}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4.5 }}>
              <SageButton onClick={() => navigate("/jobs")}>Browse All Jobs</SageButton>
            </Box>
          </FadeUp>
        )}
      </Container>
    </Box>
  );
}