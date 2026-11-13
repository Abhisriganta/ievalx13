import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { C, FONT, REDUCED } from "./theme";
import { FadeUp, Eyebrow } from "./primitives";
import useApplyNavigation from "@/hooks/useApplyNavigation";
import imgCafe from "@/assets/images/how-it-works/cafe.jpg";
import imgCandF from "@/assets/images/how-it-works/cand-f.jpg";
import imgCandM from "@/assets/images/how-it-works/cand-m.jpg";
import imgInterviewer from "@/assets/images/how-it-works/interviewer.jpg";
import imgCampus from "@/assets/images/how-it-works/campus.jpg";

/* ══════════════════════════════════════════════════════════════════════════
   HowItWorksPreview — "How Hiring Works on iEvalX"
   Replaces the old "Every Step Here Has a Purpose" (EasyFind) section.
   · For Jobseekers / For Companies toggle
   · Illustrated product scenes with sample data. Photos (AI-generated, in
     src/assets/images/how-it-works) appear only on people-focused steps:
     find job, AI interview, live interview and campus drive.
   · Auto-plays each step, then flips to the other audience. Click a step to
     jump. Pauses on hover and when the tab is hidden.
   · Scenes are drawn on a fixed 1120×630 stage and scaled to fit, so the
     composition stays identical on every screen size.
   Sample names and figures inside the scenes are illustrative only.
   `howRef` (optional) lets the MegaNav "See how it works" link scroll here.
   ══════════════════════════════════════════════════════════════════════════ */

const STEP_MS = 5200;
const STAGE_W = 1120;

const VIEWS = {
  js: {
    tab: "For Jobseekers",
    who: "Jobseeker journey",
    lead: "Five steps from finding a real job to a fair, audited interview, with your skills seen at every step.",
    steps: [
      ["Find Job", "Verified jobs only"],
      ["Apply + IRS", "Resume scored against 100 JDs"],
      ["Assessment", "AI + coding + manual"],
      ["AI Interview", "30 min, fair and proctored"],
      ["Live Interview", "Protected by IAEM"],
      ["Result", "Your skills, seen"],
    ],
  },
  co: {
    tab: "For Companies",
    who: "Company journey",
    lead: "Six steps from posting a JD to a campus-scale shortlist, with proof behind every decision.",
    steps: [
      ["Posting", "Post a job with your JD"],
      ["Shortlisting", "IRS + CIR ranked list"],
      ["Assessment", "AI + manual + coding"],
      ["AI Interview", "30 min + 35+ checks"],
      ["Live Interview", "IAEM silent watch"],
      ["Campus Drive", "Online + on campus"],
      ["Result", "Proof, not promises"],
    ],
  },
};
const ORDER = ["js", "co"];

/* ── scenes ─────────────────────────────────────────────────────────────── */
const SCENES = {
  js: [
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "40px", top: "30px", width: "1040px", height: "500px" }}><img src={imgCafe} alt="" draggable="false" /></div>
    <div style={{ position: "absolute", left: "80px", top: "70px", width: "330px", display: "grid", gap: "12px" }}>
      <div className="hw-hl hw-in hw-d1" style={{ position: "relative", display: "flex", gap: "10px", alignItems: "center", padding: "12px 14px" }}><span className="hw-ic2">🔍</span><div><div style={{ fontSize: "15px", fontWeight: "800" }}>Product designer</div><div className="hw-sm">Bengaluru · 128 verified jobs</div></div></div>
      <div className="hw-jc hw-in hw-d2"><div className="hw-row"><div className="hw-co"><i style={{ background: "#5E7F5E" }}>ZL</i>Zentrix Labs</div><span className="hw-vbadge">✓ Verified</span></div><div className="hw-t">Product Designer</div><div className="hw-m">₹6–8 LPA · Bengaluru · Hybrid</div></div>
      <div className="hw-jc hw-in hw-d3"><div className="hw-row"><div className="hw-co"><i style={{ background: "#C08A5B" }}>PW</i>PixelWorks</div><span className="hw-vbadge">✓ Verified</span></div><div className="hw-t">UI/UX Designer</div><div className="hw-m">₹5–7 LPA · Remote</div></div>
      <div className="hw-jc hw-in hw-d4" style={{ opacity: ".92" }}><div className="hw-row"><div className="hw-co"><i style={{ background: "#24433E" }}>NB</i>Northbay Health</div><span className="hw-vbadge">✓ Verified</span></div><div className="hw-t">Visual Designer</div><div className="hw-m">₹7–9 LPA · Hyderabad</div></div>
    </div>
    <div className="hw-toast hw-pop" style={{ "--pd": "2.2s", left: "430px", top: "440px" }}><i>✓</i>Applied to Zentrix Labs</div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-hl hw-in" style={{ left: "200px", top: "50px", width: "330px", height: "440px", padding: "28px" }}>
      <div className="hw-row"><div><div style={{ fontSize: "17px", fontWeight: "800" }}>Priya Sharma</div><div className="hw-sm">Product Designer · 3 yrs</div></div><span className="hw-vbadge">📄 PDF</span></div>
      <div className="hw-sm" style={{ marginTop: "18px", color: "#3e4642", lineHeight: "1.6" }}>Designs user flows for SaaS products, from research to high-fidelity screens.</div>
      <div className="hw-lbl" style={{ marginTop: "18px" }}>Experience</div>
      <div style={{ fontSize: "13px", fontWeight: "700", marginTop: "6px" }}>UI Designer · Brightcart</div><div className="hw-sm">2023 – Present · Bengaluru</div>
      <div style={{ fontSize: "13px", fontWeight: "700", marginTop: "10px" }}>Design Intern · Loopware</div><div className="hw-sm">2022 · Pune</div>
      <div className="hw-lbl" style={{ marginTop: "18px" }}>Skills</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}><span className="hw-pill">Figma</span><span className="hw-pill">Wireframing</span><span className="hw-pill">User research</span></div>
    </div>
    <div className="hw-hl hw-in hw-d2" style={{ left: "580px", top: "70px", width: "320px", padding: "22px", textAlign: "center" }}>
      <div className="hw-k">IRS resume score</div>
      <div style={{ position: "relative", width: "150px", height: "150px", margin: "12px auto 6px" }}>
        <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}><circle cx="75" cy="75" r="48" fill="none" stroke="#EEF2EF" strokeWidth="12"/><circle className="hw-arc" cx="75" cy="75" r="48" fill="none" stroke="#7F9E7E" strokeWidth="12" strokeLinecap="round" strokeDasharray="302" strokeDashoffset="66"/></svg>
        <div style={{ position: "absolute", inset: "0", display: "grid", placeItems: "center" }}><div style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-1px" }}>78</div></div>
      </div>
      <div className="hw-sm">vs the latest 100 Product Designer JDs</div>
    </div>
    <div className="hw-hl hw-in hw-d4 hw-float" style={{ left: "600px", top: "350px", width: "300px" }}>
      <div className="hw-k">Add to get shortlisted</div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}><span className="hw-pill hw-red">+ Prototyping</span><span className="hw-pill hw-red">+ Design systems</span><span className="hw-pill hw-red">+ Usability testing</span></div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-hl hw-in hw-d5" style={{ left: "470px", top: "22px", padding: "8px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "700" }}>🔒 Proctored session · 22:14 left</div>
    <div className="hw-hl hw-in hw-d1" style={{ left: "150px", top: "80px", width: "250px", height: "360px", padding: "22px" }}>
      <span className="hw-ic2">🧠</span><div className="hw-v" style={{ marginTop: "14px" }}>AI Assessment</div><div className="hw-sm" style={{ marginTop: "6px" }}>Behavioural & skills</div>
      <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "22px" }}><div style={{ fontSize: "30px", fontWeight: "800" }}>92<span className="hw-sm" style={{ fontSize: "14px" }}>/100</span></div><div className="hw-track" style={{ marginTop: "8px" }}><i className="hw-grow" style={{ width: "92%" }} /></div><div className="hw-vbadge" style={{ marginTop: "10px" }}>✓ Scored</div></div>
    </div>
    <div className="hw-hl hw-in hw-d2 hw-shine" style={{ left: "430px", top: "70px", width: "270px", height: "380px", padding: "22px", border: "2px solid var(--sage)" }}>
      <span className="hw-ic2">&lt;/&gt;</span><div className="hw-v" style={{ marginTop: "14px" }}>Coding</div><div className="hw-sm" style={{ marginTop: "6px" }}>JavaScript · 2 of 3 solved</div>
      <div style={{ background: "#14221E", borderRadius: "10px", padding: "12px", marginTop: "12px", fontFamily: "ui-monospace,Menlo,monospace", fontSize: "11px", lineHeight: "1.7", color: "#cfe3d6" }}><span style={{ color: "#BED58F" }}>function</span> twoSum(nums, t) {"{"}<br />{"\u00a0"}{"\u00a0"}<span style={{ color: "#BED58F" }}>const</span> seen = new Map();<br />{"\u00a0"}{"\u00a0"}<span style={{ color: "#7b8f86" }}>// find the pair</span><br />{"}"}</div>
      <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "22px" }}><div className="hw-track"><i className="hw-grow" style={{ width: "66%" }} /></div><div className="hw-vbadge" style={{ marginTop: "10px" }}>● In progress</div></div>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "730px", top: "80px", width: "250px", height: "360px", padding: "22px" }}>
      <span className="hw-ic2">📝</span><div className="hw-v" style={{ marginTop: "14px" }}>Manual Review</div><div className="hw-sm" style={{ marginTop: "6px" }}>Reviewed by the hiring team</div>
      <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "22px" }}><div className="hw-pill hw-amber">Up next</div></div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "60px", top: "34px", width: "640px", height: "480px" }}><img src={imgCandF} alt="" draggable="false" /><div className="hw-shade"></div>
      <span className="hw-tag"><span className="hw-dot"></span>AI Interview</span><span className="hw-tag hw-r">18:42</span>
      <div className="hw-facebox" style={{ left: "250px", top: "110px", width: "150px", height: "170px" }}></div>
      <div style={{ position: "absolute", left: "18px", right: "18px", bottom: "18px", background: "rgba(0,0,0,.42)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "12px 14px", color: "#fff", fontSize: "14px", lineHeight: "1.45" }}><span style={{ fontSize: "10.5px", fontWeight: "700", color: "#BED58F" }}>AI INTERVIEWER · Q4 OF 8</span><br />Tell me about a time you solved a difficult problem.</div>
    </div>
    <div className="hw-vid hw-in hw-d1" style={{ left: "730px", top: "34px", width: "330px", height: "210px", background: "linear-gradient(160deg,#24433E,#0E1C18)", display: "grid", placeItems: "center" }}>
      <span className="hw-tag">AI Interviewer</span>
      <div><div className="hw-orb" style={{ width: "84px", height: "84px" }}></div><div className="hw-wave" style={{ marginTop: "14px" }}><i style={{ animationDelay: "0s" }} /><i style={{ animationDelay: ".12s" }} /><i style={{ animationDelay: ".24s" }} /><i style={{ animationDelay: ".36s" }} /><i style={{ animationDelay: ".48s" }} /><i style={{ animationDelay: ".3s" }} /></div></div>
    </div>
    <div className="hw-hl hw-in hw-d2" style={{ left: "730px", top: "262px", width: "330px" }}>
      <div className="hw-row"><div className="hw-k">Proctoring</div><span className="hw-vbadge">✓ All clear</span></div>
      <div className="hw-check"><i>✓</i>Face verified · one person</div>
      <div className="hw-check" style={{ paddingTop: "0" }}><i>✓</i>Focus on interview tab</div>
      <div className="hw-check" style={{ paddingTop: "0" }}><i>✓</i>Quiet environment</div>
    </div>
    <div className="hw-hl hw-in hw-d4" style={{ left: "730px", top: "446px", width: "330px", display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px" }}><b style={{ fontSize: "22px" }}>30</b><div className="hw-sm" style={{ lineHeight: "1.3" }}><b style={{ color: "var(--ink)" }}>minutes</b> · on your schedule</div></div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "60px", top: "40px", width: "490px", height: "370px" }}><img src={imgInterviewer} alt="" draggable="false" /><div className="hw-shade"></div><span className="hw-tag">Interviewer · verified</span><span className="hw-tag hw-r"><span className="hw-dot"></span>Live 12:34</span></div>
    <div className="hw-ph hw-in hw-d1" style={{ left: "570px", top: "40px", width: "490px", height: "370px" }}><img src={imgCandF} alt="" draggable="false" /><div className="hw-shade"></div><span className="hw-tag">You</span></div>
    <div className="hw-in hw-d2" style={{ position: "absolute", left: "490px", top: "150px", width: "140px", height: "140px", display: "grid", placeItems: "center" }}>
      <div className="hw-pulse" style={{ width: "140px", height: "140px", left: "0", top: "0" }}></div>
      <div style={{ width: "108px", height: "108px", borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 20px 50px rgba(2,33,36,.3)" }}>
        <svg width="56" height="64" viewBox="0 0 44 50" style={{ filter: "drop-shadow(0 0 14px rgba(63,209,122,.6))" }}><path d="M22 2 L40 9 V24 C40 36 32 44 22 48 C12 44 4 36 4 24 V9 Z" fill="#EDF3EC" stroke="#3FD17A" strokeWidth="2.5"/><path d="M14 25 L20 31 L31 19" fill="none" stroke="#5E7F5E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "250px", top: "432px", width: "620px", display: "flex", justifyContent: "space-around", textAlign: "center", padding: "12px 16px" }}>
      <div><div style={{ fontSize: "18px" }}>👁</div><div style={{ fontSize: "12.5px", fontWeight: "700", marginTop: "2px" }}>IAEM silent observer</div></div>
      <div><div style={{ fontSize: "18px" }}>🔒</div><div style={{ fontSize: "12.5px", fontWeight: "700", marginTop: "2px" }}>Identity can be hidden</div></div>
      <div><div style={{ fontSize: "18px" }}>⚖</div><div style={{ fontSize: "12.5px", fontWeight: "700", marginTop: "2px" }}>Fair, audited scoring</div></div>
    </div>
  
    </>
  ),
  (a) => (
    <>
    <div className="hw-result">
      <div style={{ flex: "1" }}>
        <div className="hw-in" style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "700", color: "#9fd3b0" }}>FOR JOBSEEKERS</div>
        <h3 className="hw-in hw-d1" style={{ marginTop: "10px" }}>Your real skills,<br /><em>finally seen.</em></h3>
        <p className="hw-in hw-d2">Fair interviews, verified companies, and one CIR that speaks for you on every application.</p>
        <button type="button" className="hw-btn hw-in hw-d3" onClick={a.onSeeker}>Get My CIR, Free →</button>
      </div>
      <div className="hw-stats">
        <div className="hw-stat hw-in hw-d2"><b>100 JDs</b><span>Your resume scored against the latest 100 for your role</span></div>
        <div className="hw-stat hw-in hw-d3"><b>6 skills</b><span>Scored in one AI interview, in your CIR</span></div>
        <div className="hw-stat hw-in hw-d4"><b>Every</b><span>Live interviewer audited by IAEM</span></div>
      </div>
    </div>
  
    </>
  ),
  ],
  co: [
  () => (
    <>
    <div className="hw-hl hw-in" style={{ left: "190px", top: "46px", width: "440px", height: "460px", padding: "26px" }}>
      <div style={{ fontSize: "18px", fontWeight: "800" }}>Publish Your Role</div>
      <div className="hw-lbl" style={{ marginTop: "18px" }}>Job title</div><div style={{ height: "34px", borderRadius: "10px", background: "#F6F8F3", marginTop: "6px", display: "flex", alignItems: "center", padding: "0 12px" }}><span className="hw-type" style={{ "--tw": "165px", "--n": "23", "--tt": ".9s", "--td": ".4s", fontSize: "13px", fontWeight: "700" }}>Senior Product Designer</span></div>
      <div className="hw-lbl" style={{ marginTop: "12px" }}>Location</div><div style={{ height: "34px", borderRadius: "10px", background: "#F6F8F3", marginTop: "6px", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", fontWeight: "600" }}>Bengaluru · Hybrid</div>
      <div className="hw-lbl" style={{ marginTop: "12px" }}>Salary range</div><div style={{ height: "34px", borderRadius: "10px", background: "#F6F8F3", marginTop: "6px", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "13px", fontWeight: "600" }}>₹18–24 LPA · Yearly</div>
      <div className="hw-lbl" style={{ marginTop: "12px" }}>Job description</div><div style={{ borderRadius: "10px", background: "#F6F8F3", marginTop: "6px", padding: "10px 12px", fontSize: "12px", lineHeight: "1.55", color: "#3e4642" }}>Lead end-to-end design for our hiring platform. 4+ yrs in product design, Figma and design systems.</div>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "600px", top: "120px", width: "300px", padding: "20px" }}>
      <div className="hw-row"><span className="hw-ic2">📄</span><span className="hw-vbadge">JD added</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "14px", textAlign: "center" }}>
        <div style={{ background: "#F6F8F3", borderRadius: "10px", padding: "10px 4px" }}><div style={{ fontSize: "16px" }}>📍</div><div className="hw-sm" style={{ fontSize: "10.5px", fontWeight: "700" }}>Bengaluru</div></div>
        <div style={{ background: "#F6F8F3", borderRadius: "10px", padding: "10px 4px" }}><div style={{ fontSize: "16px" }}>₹</div><div className="hw-sm" style={{ fontSize: "10.5px", fontWeight: "700" }}>18–24 LPA</div></div>
        <div style={{ background: "#F6F8F3", borderRadius: "10px", padding: "10px 4px" }}><div style={{ fontSize: "16px" }}>🗓</div><div className="hw-sm" style={{ fontSize: "10.5px", fontWeight: "700" }}>14 days</div></div>
      </div>
      <div className="hw-btn hw-sage" style={{ width: "100%", marginTop: "14px" }}>Publish</div>
    </div>
    <div className="hw-toast hw-pop" style={{ "--pd": "2.4s", left: "620px", top: "400px" }}><i>✓</i>Job is live · IRS starts matching</div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-hl hw-in" style={{ left: "120px", top: "60px", width: "300px", padding: "20px" }}>
      <div className="hw-k">CVs received</div><div style={{ fontSize: "40px", fontWeight: "800", letterSpacing: "-1px" }}>5,000</div>
      <div className="hw-sm">for Senior Product Designer</div>
      <div className="hw-lbl" style={{ marginTop: "16px" }}>IRS + CIR filters</div>
      <div className="hw-check"><i>✓</i>JD match ≥ 90%</div>
      <div className="hw-check" style={{ paddingTop: "0" }}><i>✓</i>Quick Interview ≥ 7.5</div>
      <div className="hw-check" style={{ paddingTop: "0" }}><i>✓</i>Bengaluru · ≤ ₹24 LPA</div>
    </div>
    <div className="hw-in hw-d2" style={{ position: "absolute", left: "440px", top: "210px", fontSize: "30px", color: "var(--sage)", fontWeight: "800" }}>→</div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "500px", top: "60px", width: "500px", padding: "20px" }}>
      <div className="hw-row"><div className="hw-k">Top matches</div><span className="hw-vbadge">120 shortlisted</span></div>
      <div style={{ display: "grid", gap: "12px", marginTop: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 140px 44px", gap: "12px", alignItems: "center" }}><span className="hw-av" style={{ width: "34px", height: "34px", background: "#5E7F5E", fontSize: "12px" }}>AR</span><div><b style={{ fontSize: "13px" }}>Ananya R.</b><div className="hw-sm" style={{ fontSize: "11px" }}>5 yrs · Bengaluru</div></div><div className="hw-track"><i className="hw-grow" style={{ width: "94%" }} /></div><b style={{ fontSize: "13px" }}>94%</b></div>
        <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 140px 44px", gap: "12px", alignItems: "center" }}><span className="hw-av" style={{ width: "34px", height: "34px", background: "#C08A5B", fontSize: "12px" }}>RM</span><div><b style={{ fontSize: "13px" }}>Rahul M.</b><div className="hw-sm" style={{ fontSize: "11px" }}>6 yrs · Hyderabad</div></div><div className="hw-track"><i className="hw-grow" style={{ width: "91%" }} /></div><b style={{ fontSize: "13px" }}>91%</b></div>
        <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 140px 44px", gap: "12px", alignItems: "center" }}><span className="hw-av" style={{ width: "34px", height: "34px", background: "#3E6E3E", fontSize: "12px" }}>SK</span><div><b style={{ fontSize: "13px" }}>Sneha K.</b><div className="hw-sm" style={{ fontSize: "11px" }}>4 yrs · Bengaluru</div></div><div className="hw-track"><i className="hw-grow" style={{ width: "88%" }} /></div><b style={{ fontSize: "13px" }}>88%</b></div>
        <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 140px 44px", gap: "12px", alignItems: "center", opacity: ".6" }}><span className="hw-av" style={{ width: "34px", height: "34px", background: "#7F9E7E", fontSize: "12px" }}>VP</span><div><b style={{ fontSize: "13px" }}>Vikram P.</b><div className="hw-sm" style={{ fontSize: "11px" }}>5 yrs · Pune</div></div><div className="hw-track"><i className="hw-grow" style={{ width: "84%" }} /></div><b style={{ fontSize: "13px" }}>84%</b></div>
      </div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-hl hw-in hw-d1" style={{ left: "200px", top: "70px", width: "260px", height: "400px", padding: "24px", textAlign: "center" }}>
      <div className="hw-av" style={{ width: "70px", height: "70px", background: "#5E7F5E", fontSize: "22px", margin: "0 auto" }}>AR</div>
      <div style={{ fontSize: "17px", fontWeight: "800", marginTop: "12px" }}>Ananya R.</div><div className="hw-sm">Senior Product Designer</div>
      <div className="hw-k" style={{ marginTop: "22px" }}>Overall</div><div style={{ fontSize: "48px", fontWeight: "800", letterSpacing: "-1px" }}>87</div>
      <span className="hw-pill hw-pop" style={{ "--pd": "1.6s", fontSize: "12px", padding: "6px 12px" }}>Strong hire</span>
    </div>
    <div style={{ position: "absolute", left: "500px", top: "90px", width: "420px" }}>
      <div className="hw-hl hw-in hw-d2" style={{ position: "relative", padding: "16px 18px" }}><div className="hw-row"><b>🧠 AI Assessment</b><b style={{ fontSize: "16px" }}>91<span className="hw-sm">/100</span></b></div><div className="hw-track" style={{ marginTop: "10px" }}><i className="hw-grow" style={{ width: "91%" }} /></div></div>
      <div className="hw-hl hw-in hw-d3" style={{ position: "relative", padding: "16px 18px", marginTop: "14px" }}><div className="hw-row"><b>&lt;/&gt; Coding</b><b style={{ fontSize: "16px" }}>87<span className="hw-sm">/100</span></b></div><div className="hw-track" style={{ marginTop: "10px" }}><i className="hw-grow" style={{ width: "87%" }} /></div></div>
      <div className="hw-hl hw-in hw-d4" style={{ position: "relative", padding: "16px 18px", marginTop: "14px" }}><div className="hw-row"><b>📝 Manual</b><b style={{ fontSize: "16px" }}>84<span className="hw-sm">/100</span></b></div><div className="hw-track" style={{ marginTop: "10px" }}><i className="hw-grow" style={{ width: "84%" }} /></div></div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "60px", top: "34px", width: "620px", height: "480px" }}><img src={imgCandM} alt="" draggable="false" /><div className="hw-shade"></div>
      <span className="hw-tag"><span className="hw-dot"></span>Candidate · AI Interview</span><span className="hw-tag hw-r">30 min</span>
      <div className="hw-facebox" style={{ left: "225px", top: "100px", width: "160px", height: "180px" }}></div>
      <div style={{ position: "absolute", left: "18px", bottom: "18px", display: "flex", gap: "6px", flexWrap: "wrap" }}><span className="hw-vbadge" style={{ background: "rgba(255,255,255,.9)" }}>👤 Face match</span><span className="hw-vbadge" style={{ background: "rgba(255,255,255,.9)" }}>👁 Focused</span><span className="hw-vbadge" style={{ background: "rgba(255,255,255,.9)" }}>🎙 One speaker</span></div>
    </div>
    <div className="hw-hl hw-in hw-d1" style={{ left: "710px", top: "34px", width: "350px", padding: "20px" }}>
      <div className="hw-row"><div><div className="hw-k">Live proctoring</div><div style={{ fontSize: "26px", fontWeight: "800" }}>35+ checks</div></div><span className="hw-vbadge">Low risk</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginTop: "14px" }}>
        <span className="hw-ic2" style={{ width: "100%", height: "46px" }}>👤</span><span className="hw-ic2" style={{ width: "100%", height: "46px" }}>👁</span><span className="hw-ic2" style={{ width: "100%", height: "46px" }}>🎙</span><span className="hw-ic2" style={{ width: "100%", height: "46px" }}>🖥</span>
      </div>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "710px", top: "250px", width: "350px", padding: "18px" }}>
      <div className="hw-k">AI interview insights</div>
      <div className="hw-row hw-sm" style={{ marginTop: "10px", fontSize: "12px" }}>Engagement<b style={{ color: "var(--ink)" }}>92%</b></div><div className="hw-track" style={{ marginTop: "4px" }}><i className="hw-grow" style={{ width: "92%" }} /></div>
      <div className="hw-row hw-sm" style={{ marginTop: "10px", fontSize: "12px" }}>Clarity<b style={{ color: "var(--ink)" }}>88%</b></div><div className="hw-track" style={{ marginTop: "4px" }}><i className="hw-grow" style={{ width: "88%" }} /></div>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "12px" }}><span className="hw-pill">Leadership</span><span className="hw-pill">Deadlines</span><span className="hw-pill">Problem solving</span></div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "60px", top: "40px", width: "400px", height: "300px" }}><img src={imgInterviewer} alt="" draggable="false" /><div className="hw-shade"></div><span className="hw-tag">Interviewer</span><span className="hw-tag hw-r"><span className="hw-dot"></span>Live</span></div>
    <div className="hw-ph hw-in hw-d1" style={{ left: "480px", top: "40px", width: "400px", height: "300px" }}><img src={imgCandM} alt="" style={{ filter: "blur(10px) saturate(.8)", transform: "scale(1.08)" }} draggable="false" /><div className="hw-shade"></div><span className="hw-tag">🔒 Candidate · identity hidden</span></div>
    <div className="hw-hl hw-in hw-d2" style={{ left: "900px", top: "40px", width: "160px", height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "10px" }}>
      <svg width="64" height="74" viewBox="0 0 44 50" style={{ filter: "drop-shadow(0 0 16px rgba(63,209,122,.6))" }}><path d="M22 2 L40 9 V24 C40 36 32 44 22 48 C12 44 4 36 4 24 V9 Z" fill="#EDF3EC" stroke="#3FD17A" strokeWidth="2.5"/><path d="M14 25 L20 31 L31 19" fill="none" stroke="#5E7F5E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <b style={{ fontSize: "14px" }}>IAEM<br />watching</b>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "60px", top: "366px", width: "500px", padding: "16px 18px" }}>
      <div className="hw-k">Interviewer score check</div>
      <div className="hw-row hw-sm" style={{ marginTop: "10px", fontSize: "12px" }}>Expected baseline<b style={{ color: "var(--ink)" }}>72</b></div><div className="hw-track" style={{ marginTop: "4px" }}><i style={{ width: "72%", background: "#c5d3c9" }} /></div>
      <div className="hw-row hw-sm" style={{ marginTop: "8px", fontSize: "12px" }}>Score given<b style={{ color: "var(--ink)" }}>85</b></div><div className="hw-track" style={{ marginTop: "4px" }}><i className="hw-grow" style={{ width: "85%" }} /></div>
    </div>
    <div className="hw-pop" style={{ "--pd": "1.7s", position: "absolute", left: "590px", top: "380px", width: "470px", background: "#FFF6E8", border: "1px solid #F1D9A8", borderRadius: "16px", padding: "16px 18px", boxShadow: "0 18px 40px rgba(2,33,36,.12)" }}>
      <div className="hw-row"><b style={{ fontSize: "14px" }}>⚠ Unusual score flagged</b><span className="hw-pill hw-amber">For review</span></div>
      <div className="hw-sm" style={{ marginTop: "4px" }}>Well above baseline. Sent to compliance before it counts.</div>
    </div>
  
    </>
  ),
  () => (
    <>
    <div className="hw-ph hw-in" style={{ left: "40px", top: "30px", width: "1040px", height: "500px" }}><img src={imgCampus} alt="" draggable="false" /><div className="hw-shade" style={{ background: "linear-gradient(90deg,rgba(2,33,36,.75),rgba(2,33,36,.25) 45%,rgba(0,0,0,0) 70%)" }}></div></div>
    <div className="hw-in hw-d1" style={{ position: "absolute", left: "84px", top: "80px", color: "#fff", maxWidth: "380px" }}>
      <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", color: "#BED58F" }}>CAMPUS DRIVE</div>
      <div style={{ fontSize: "34px", fontWeight: "800", lineHeight: "1.12", marginTop: "8px" }}>Hire a whole batch in one day</div>
      <div style={{ fontSize: "14px", color: "rgba(255,255,255,.8)", marginTop: "10px", lineHeight: "1.55" }}>Online or on campus. Every student's score lands in one ranked list.</div>
    </div>
    <div className="hw-hl hw-in hw-d3" style={{ left: "84px", top: "330px", width: "200px", padding: "14px 16px" }}><div className="hw-k">AI round</div><div style={{ fontSize: "22px", fontWeight: "800" }}>25 min</div><div className="hw-sm">per student, fresher level</div></div>
    <div className="hw-hl hw-in hw-d4" style={{ left: "300px", top: "330px", width: "200px", padding: "14px 16px" }}><div className="hw-k">Proctored</div><div style={{ fontSize: "22px", fontWeight: "800" }}>35+</div><div className="hw-sm">checks per session</div></div>
  
    </>
  ),
  (a) => (
    <>
    <div className="hw-result">
      <div style={{ flex: "1" }}>
        <div className="hw-in" style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "700", color: "#9fd3b0" }}>FOR COMPANIES</div>
        <h3 className="hw-in hw-d1" style={{ marginTop: "10px" }}>Verified skills.<br />Verified score.<br /><em>Verified interviewer.</em></h3>
        <p className="hw-in hw-d2">From JD to offer on one platform, with proof behind every shortlist.</p>
        <button type="button" className="hw-btn hw-in hw-d3" onClick={a.onCompany}>Hire Verified Talent →</button>
      </div>
      <div className="hw-stats">
        <div className="hw-stat hw-in hw-d2"><b>35+</b><span>Proctoring checks in every AI round</span></div>
        <div className="hw-stat hw-in hw-d3"><b>6 skills</b><span>Weighted competencies in every CIR</span></div>
        <div className="hw-stat hw-in hw-d4"><b>Every</b><span>Live interviewer audited by IAEM</span></div>
      </div>
    </div>
  
    </>
  ),
  ],
};

export default function HowItWorksPreview({ howRef }) {
  const navigate = useNavigate();
  const { goToAIInterview } = useApplyNavigation();

  const [view, setView] = useState("js");
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [scale, setScale] = useState(1);
  const pausedRef = useRef(false);
  const fitRef = useRef(null);

  const V = VIEWS[view];
  const last = V.steps.length - 1;

  /* scale the fixed stage to the container width */
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return undefined;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* preload the scene photos so steps switch without a flash */
  useEffect(() => {
    [imgCafe, imgCandF, imgCandM, imgInterviewer, imgCampus].forEach(src => { const im = new Image(); im.src = src; });
  }, []);

  /* auto-advance: next step, then flip to the other audience */
  useEffect(() => {
    const t = setTimeout(() => {
      if (pausedRef.current || document.hidden) { setCycle(c => c + 1); return; }
      if (idx < last) setIdx(idx + 1);
      else { setView(v => ORDER[(ORDER.indexOf(v) + 1) % ORDER.length]); setIdx(0); }
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [view, idx, cycle, last]);

  const pickView = (v) => { setView(v); setIdx(0); setCycle(c => c + 1); };
  const pickStep = (i) => { setIdx(i); setCycle(c => c + 1); };

  const actions = {
    onSeeker: () => goToAIInterview(),
    onCompany: () => navigate("/auth?view=register-company"),
  };

  const Scene = SCENES[view][idx];
  const step = V.steps[idx];

  return (
    <Box
      ref={howRef}
      className="hw-root"
      sx={{ position: "relative", mt: { xs: 8, md: 12 }, py: { xs: 7, md: 10 }, bgcolor: C.cream, overflow: "hidden" }}
      style={{ "--dur": `${STEP_MS}ms` }}
    >
      <Box component="style">{HW_CSS}</Box>

      {/* soft background glows */}
      <Box aria-hidden="true" sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 8% 10%, rgba(127,158,126,0.12), transparent 38%), radial-gradient(circle at 95% 90%, rgba(127,158,126,0.14), transparent 42%)",
      }} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <FadeUp>
          <Eyebrow>See It In Action</Eyebrow>
          <Typography sx={{
            fontFamily: FONT, fontSize: { xs: 26, sm: 30, md: 40 }, fontWeight: 700,
            color: C.ink, mt: 1.25, lineHeight: 1.15, textAlign: "center",
          }}>
            How Hiring Works on iEvalX
          </Typography>
          <Typography key={view} sx={{
            fontFamily: FONT, fontSize: 15, color: C.muted, mt: 1.5, lineHeight: 1.7,
            maxWidth: 620, mx: "auto", textAlign: "center",
            animation: REDUCED ? "none" : "hw-in .5s cubic-bezier(.22,1,.36,1) both",
          }}>
            {V.lead}
          </Typography>

          {/* audience toggle */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box className="hw-toggle" role="tablist" aria-label="Choose who you are">
              {ORDER.map(v => (
                <button key={v} type="button" role="tab" aria-selected={view === v}
                  className={view === v ? "hw-on" : undefined} onClick={() => pickView(v)}>
                  {VIEWS[v].tab}
                </button>
              ))}
            </Box>
          </Box>

          {/* step buttons */}
          <Box className="hw-strip">
            {V.steps.map((s, i) => (
              <button key={`${view}-${s[0]}`} type="button" onClick={() => pickStep(i)}
                className={i === idx ? "hw-on" : i < idx ? "hw-done" : undefined}
                aria-current={i === idx || undefined}>
                <b>{i < last ? i + 1 : "★"}</b><span>{s[0]}</span>
              </button>
            ))}
          </Box>
        </FadeUp>

        {/* scaled stage */}
        <FadeUp delay={0.15}>
          <div className="hw-fit" ref={fitRef}
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}>
            <div className="hw-stage" style={{ transform: `scale(${scale})` }}>
              <div key={`${view}-${idx}`} className="hw-scene hw-on hw-play">
                <Scene {...actions} />
              </div>
              <div className="hw-cap">
                <span className="hw-n">{idx < last ? `STEP ${idx + 1} / ${last}` : "THE RESULT"}</span>
                <span className="hw-t">{step[0]} <em>· {step[1]}</em></span>
                <span className="hw-who">{V.who}</span>
                <span key={`p-${view}-${idx}-${cycle}`} className="hw-prog hw-run" />
              </div>
            </div>
          </div>

          {/* phones: readable caption under the scaled stage */}
          <Box sx={{ display: { xs: "block", sm: "none" }, textAlign: "center", mt: 2 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "1px", color: C.sageDark }}>
              {idx < last ? `STEP ${idx + 1} / ${last}` : "THE RESULT"}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.ink, mt: 0.5 }}>
              {step[0]}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.muted }}>{step[1]}</Typography>
          </Box>
        </FadeUp>
      </Container>
    </Box>
  );
}

/* ── scoped styles (every class is prefixed hw- so nothing leaks) ───────── */
const HW_CSS = ".hw-shot{display:none}\n.hw-root{font-family:'Jost','DM Sans',sans-serif;--ink:#1F1F1F;--sage:#7F9E7E;--sageDark:#5E7F5E;--sageSoft:#EDF3EC;--cream:#F6F8F3;--line:#E7EAE3;--muted:#6F7470;--amber:#C08A5B;--pine:#022124;--pine2:#24433E;--green:#3FD17A;--red:#E0664F}\n\n\n\n\n\n\n/* \u2500\u2500 section \u2500\u2500 */\n\n\n\n\n\n.hw-toggle{display:inline-flex;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px;margin-top:22px;box-shadow:0 6px 18px rgba(31,49,43,.06)}\n.hw-toggle button{border:0;background:none;font-weight:600;font-size:14px;padding:10px 22px;border-radius:999px;cursor:pointer;color:var(--ink);transition:.3s}\n.hw-toggle button.hw-on{background:var(--ink);color:#fff}\n\n/* step strip */\n.hw-strip{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:28px auto 18px;position:relative}\n.hw-strip button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;display:flex;gap:7px;align-items:center;transition:.25s}\n.hw-strip button b{width:20px;height:20px;border-radius:50%;background:#EEF2EF;color:var(--sageDark);display:grid;place-items:center;font-size:11px}\n.hw-strip button.hw-on{background:var(--ink);color:#fff;border-color:var(--ink)}\n.hw-strip button.hw-on b{background:var(--sage);color:#fff}\n.hw-strip button.hw-done b{background:var(--sage);color:#fff}\n\n/* stage (fixed 1120x630, scaled to fit) */\n.hw-fit{position:relative;width:100%;max-width:1120px;margin:0 auto}\n.hw-fit::before{content:\"\";display:block;padding-top:56.25%}\n.hw-stage{position:absolute;left:0;top:0;width:1120px;height:630px;transform-origin:0 0;border-radius:22px;overflow:hidden;background:linear-gradient(140deg,#EAF1EC,#DCE8E0);box-shadow:0 30px 70px rgba(2,33,36,.18)}\n.hw-scene{position:absolute;inset:0 0 64px 0;opacity:0;transition:opacity .5s ease;pointer-events:none}\n.hw-scene.hw-on{opacity:1;pointer-events:auto}\n.hw-cap{position:absolute;left:0;right:0;bottom:0;height:64px;background:var(--pine);display:flex;align-items:center;gap:16px;padding:0 26px;color:#fff;z-index:5}\n.hw-cap .hw-n{font-size:13px;font-weight:700;color:#9fd3b0;letter-spacing:1px}\n.hw-cap .hw-t{font-size:19px;font-weight:700}\n.hw-cap .hw-t em{font-style:normal;color:#BED58F;font-weight:600}\n.hw-cap .hw-who{margin-left:auto;font-size:12px;font-weight:600;color:rgba(255,255,255,.6)}\n.hw-cap .hw-prog{position:absolute;left:0;bottom:0;height:3px;background:#BED58F;width:0}\n.hw-cap .hw-prog.hw-run{animation:hw-prog var(--dur) linear forwards}\n@keyframes hw-prog{to{width:100%}}\n\n/* entry animation, replayed with .hw-play */\n.hw-play .hw-in{animation:hw-in .6s cubic-bezier(.22,1,.36,1) both}\n.hw-play .hw-d1{animation-delay:.12s}.hw-play .hw-d2{animation-delay:.24s}.hw-play .hw-d3{animation-delay:.36s}.hw-play .hw-d4{animation-delay:.48s}.hw-play .hw-d5{animation-delay:.6s}.hw-play .hw-d6{animation-delay:.72s}.hw-play .hw-d7{animation-delay:.84s}\n@keyframes hw-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}\n.hw-play .hw-grow{animation:hw-grow 1.1s cubic-bezier(.22,1,.36,1) .5s both}\n@keyframes hw-grow{from{width:0}}\n.hw-play .hw-arc{animation:hw-arc 1.4s cubic-bezier(.22,1,.36,1) .4s both}\n@keyframes hw-arc{from{stroke-dashoffset:302}}\n.hw-play .hw-pop{animation:hw-pop .5s cubic-bezier(.34,1.5,.5,1) var(--pd,1.6s) both}\n@keyframes hw-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}\n\n/* shared ui */\n.hw-card{background:#fff;border-radius:16px;border:1px solid var(--line);box-shadow:0 16px 40px rgba(31,49,43,.10)}\n.hw-pill{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:99px;background:var(--sageSoft);color:var(--sageDark)}\n.hw-pill.hw-amber{background:#F7EDE3;color:#9A6A3F}\n.hw-pill.hw-dark{background:var(--ink);color:#fff}\n.hw-pill.hw-red{background:#FBE7E2;color:#B5452F}\n.hw-lbl{font-size:10.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.7px}\n.hw-h{font-size:20px;font-weight:800;letter-spacing:-.4px}\n.hw-sm{font-size:12px;color:var(--muted);line-height:1.45}\n.hw-btn{display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border-radius:99px;padding:9px 16px;background:var(--ink);color:#fff}\n.hw-btn.hw-sage{background:var(--sage)}\n.hw-av{border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800}\n.hw-track{height:7px;border-radius:99px;background:#EEF2EF;overflow:hidden}\n.hw-track i{display:block;height:100%;border-radius:99px;background:var(--sage)}\n.hw-row{display:flex;align-items:center;justify-content:space-between}\n.hw-check{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;padding:7px 0}\n.hw-check i{width:18px;height:18px;border-radius:6px;background:var(--sageSoft);color:var(--sageDark);display:grid;place-items:center;font-size:11px;font-style:normal;font-weight:900}\n.hw-callout{position:absolute;background:#fff;border-radius:14px;padding:11px 14px;box-shadow:0 14px 34px rgba(31,49,43,.14);font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:9px}\n.hw-callout .hw-ic{width:30px;height:30px;border-radius:10px;background:var(--sageSoft);display:grid;place-items:center;font-size:15px}\n.hw-callout small{display:block;font-size:11px;color:var(--muted);font-weight:500}\n.hw-toast{position:absolute;background:var(--pine);color:#fff;font-size:13px;font-weight:600;padding:11px 16px;border-radius:14px;display:flex;gap:9px;align-items:center;box-shadow:0 14px 30px rgba(2,33,36,.3)}\n.hw-toast i{width:18px;height:18px;border-radius:50%;background:var(--green);color:var(--pine);display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:900}\n\n/* phone */\n.hw-phone{position:absolute;width:250px;height:500px;border-radius:40px;background:#121614;padding:10px;box-shadow:0 34px 70px rgba(2,33,36,.3)}\n.hw-phone .hw-s{width:100%;height:100%;border-radius:31px;background:#fff;overflow:hidden;padding:40px 14px 14px;position:relative}\n.hw-phone .hw-s::before{content:\"\";position:absolute;top:8px;left:50%;transform:translateX(-50%);width:84px;height:22px;border-radius:20px;background:#121614}\n.hw-logo{font-weight:800;font-size:15px;letter-spacing:-.4px}.hw-logo b{color:var(--sage)}\n.hw-job{border:1px solid var(--line);border-radius:12px;padding:9px 10px;margin-top:8px;position:relative}\n.hw-job .hw-co{display:flex;gap:6px;align-items:center;font-size:10px;color:var(--muted);font-weight:600}\n.hw-job .hw-co span{width:18px;height:18px;border-radius:6px;color:#fff;font-size:8.5px;font-weight:800;display:grid;place-items:center}\n.hw-job .hw-t{font-size:12.5px;font-weight:700;margin-top:4px}\n.hw-meta{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px}\n.hw-meta span{font-size:9px;padding:2px 6px;border-radius:99px;background:#F3F6F4;font-weight:600;color:#4d5450}\n.hw-vt{position:absolute;top:8px;right:8px;font-size:9px}\n\n/* browser window */\n.hw-win{position:absolute;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 30px 70px rgba(2,33,36,.18);border:1px solid #dfe5e1}\n.hw-win .hw-bar{height:34px;background:#F3F6F4;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:7px;padding:0 14px}\n.hw-win .hw-bar i{width:10px;height:10px;border-radius:50%;background:#d5dbd7}\n.hw-win .hw-bar .hw-u{margin-left:14px;height:20px;border-radius:7px;background:#fff;font-size:10.5px;color:#8a908c;display:flex;align-items:center;padding:0 10px;min-width:280px}\n.hw-win .\n.hw-stepper{display:flex;gap:8px;margin-bottom:14px}\n.hw-stepper span{font-size:11px;font-weight:700;padding:6px 12px;border-radius:99px;background:#F1F4F2;color:#8a908c}\n.hw-stepper span.hw-on{background:var(--sage);color:#fff}\n.hw-stepper span.hw-ok{background:var(--sageSoft);color:var(--sageDark)}\n.hw-field{margin-bottom:10px}\n.hw-field .hw-lbl{font-size:9.5px}\n.hw-field div{height:32px;border:1px solid var(--line);border-radius:9px;margin-top:4px;display:flex;align-items:center;padding:0 10px;font-size:12.5px;font-weight:600}\n.hw-type{display:inline-block;overflow:hidden;white-space:nowrap;width:0;border-right:2px solid var(--sage)}\n.hw-play .hw-type{animation:hw-type var(--tt,.9s) steps(var(--n,20)) var(--td,.3s) forwards}\n@keyframes hw-type{to{width:var(--tw)}}\n\n/* video tiles */\n.hw-vid{position:absolute;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#2F423C,#14221E)}\n.hw-vid .hw-tag{position:absolute;left:12px;top:12px;font-size:10.5px;font-weight:700;color:#fff;background:rgba(0,0,0,.35);padding:4px 9px;border-radius:99px;display:flex;align-items:center;gap:6px;backdrop-filter:blur(4px)}\n.hw-vid .hw-tag.hw-r{left:auto;right:12px}\n.hw-dot{width:7px;height:7px;border-radius:50%;background:#FF5A4E;animation:hw-blink 1s infinite}\n@keyframes hw-blink{50%{opacity:.25}}\n.hw-fig{position:absolute;left:50%;bottom:0;transform:translateX(-50%)}\n.hw-fig .hw-hd{border-radius:50%;margin:0 auto}\n.hw-fig .hw-bd{border-radius:999px 999px 0 0;margin-top:8px}\n.hw-blur{filter:blur(6px);opacity:.85}\n.hw-orb{width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#BED58F,#5E7F5E 60%,#24433E);box-shadow:0 0 0 10px rgba(190,213,143,.12),0 0 60px rgba(190,213,143,.45);animation:hw-breath 2.4s ease-in-out infinite;margin:0 auto}\n@keyframes hw-breath{50%{transform:scale(1.07);box-shadow:0 0 0 18px rgba(190,213,143,.08),0 0 80px rgba(190,213,143,.55)}}\n.hw-wave{display:flex;gap:3px;align-items:center;justify-content:center;height:30px}\n.hw-wave i{width:4px;border-radius:3px;background:#BED58F;animation:hw-wv 1s ease-in-out infinite}\n@keyframes hw-wv{0%,100%{height:5px}50%{height:26px}}\n.hw-facebox{position:absolute;border:2px solid var(--green);border-radius:12px}\n\n/* code */\n.hw-code{background:#14221E;border-radius:12px;padding:12px 14px;font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1.7;color:#cfe3d6}\n.hw-code .hw-k{color:#BED58F}.hw-code .hw-f{color:#9fd3ff}.hw-code .hw-c{color:#7b8f86}\n.hw-caret{display:inline-block;width:6px;height:13px;background:#BED58F;vertical-align:middle;animation:hw-blink 1s infinite}\n\n/* result slide */\n.hw-result{position:absolute;inset:0 0 64px 0;background:linear-gradient(135deg,#022124,#24433E);color:#fff;display:flex;align-items:center;padding:0 80px;gap:60px}\n.hw-result h3{font-size:44px;line-height:1.08;font-weight:800;letter-spacing:-1px}\n.hw-result h3 em{font-style:normal;color:#BED58F}\n.hw-result p{color:rgba(255,255,255,.7);font-size:16px;margin-top:14px;line-height:1.55;max-width:460px}\n.hw-result .hw-stats{display:grid;gap:14px;flex:0 0 360px}\n.hw-result .hw-stat{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px 20px}\n.hw-result .hw-stat b{display:block;font-size:30px;font-weight:800;color:#BED58F}\n.hw-result .hw-stat span{font-size:13px;color:rgba(255,255,255,.75)}\n.hw-result .hw-btn{background:#BED58F;color:var(--pine);margin-top:22px;padding:12px 20px;font-size:14px}\n\n.hw-confetti i{position:absolute;width:8px;height:12px;border-radius:2px;opacity:0}\n.hw-play .hw-confetti i{animation:hw-fall 2.6s ease-in var(--cd) infinite}\n@keyframes hw-fall{0%{opacity:0;transform:translateY(-30px) rotate(0)}10%{opacity:1}100%{opacity:0;transform:translateY(420px) rotate(320deg)}}\n\n\n\n/* \u2500\u2500 illustration language: skeleton UI + one crisp highlight per scene \u2500\u2500 */\n.hw-sk{display:block;background:#E3EAE5;border-radius:6px;height:8px}\n.hw-sk.hw-dk{background:rgba(255,255,255,.14)}\n.hw-sk.hw-g{background:#CFE0D3}\n.hw-ghost{position:absolute;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);border-radius:20px;box-shadow:0 24px 60px rgba(2,33,36,.10);backdrop-filter:blur(6px)}\n.hw-hl{position:absolute;background:#fff;border-radius:16px;box-shadow:0 22px 50px rgba(2,33,36,.18);padding:14px 16px}\n.hw-hl .hw-k{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--muted)}\n.hw-hl .hw-v{font-size:17px;font-weight:800;letter-spacing:-.3px}\n.hw-ic2{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--sageSoft)}\n.hw-float{animation:hw-flt 5s ease-in-out infinite}\n@keyframes hw-flt{50%{transform:translateY(-8px)}}\n.hw-shine{position:relative;overflow:hidden}\n.hw-shine::after{content:\"\";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-100%);animation:hw-sh 2.8s ease-in-out infinite}\n@keyframes hw-sh{60%,100%{transform:translateX(100%)}}\n.hw-vbadge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;color:var(--sageDark);background:var(--sageSoft);border-radius:99px;padding:4px 10px}\n.hw-bigtag{position:absolute;left:50%;transform:translateX(-50%);top:26px;font-size:12px;font-weight:700;color:var(--sageDark);letter-spacing:1.5px;text-transform:uppercase}\n.hw-dots{position:absolute;display:grid;gap:10px}\n.hw-dots i{width:14px;height:14px;border-radius:50%;background:#C9D8CD}\n.hw-dots i.hw-on{background:var(--sage);box-shadow:0 0 0 5px rgba(127,158,126,.2)}\n.hw-play .hw-dots i{animation:hw-dfade .5s ease both}\n@keyframes hw-dfade{from{opacity:0;transform:scale(.4)}}\n.hw-funnel{position:absolute;left:380px;top:120px;width:360px;height:330px}\n.hw-shield{width:120px;height:136px;margin:0 auto;filter:drop-shadow(0 0 30px rgba(63,209,122,.55))}\n.hw-pulse{position:absolute;border-radius:50%;border:2px solid rgba(63,209,122,.5);animation:hw-pl 2.4s ease-out infinite}\n@keyframes hw-pl{from{transform:scale(.6);opacity:1}to{transform:scale(1.6);opacity:0}}\n\n.hw-ph{position:absolute;overflow:hidden;border-radius:18px;box-shadow:0 26px 60px rgba(2,33,36,.22)}\n.hw-ph img{width:100%;height:100%;object-fit:cover;display:block}\n.hw-play .hw-ph img{animation:hw-kb 7s ease-out both}\n@keyframes hw-kb{from{transform:scale(1.06)}to{transform:scale(1)}}\n.hw-ph .hw-tag{position:absolute;left:14px;top:14px;font-size:11px;font-weight:700;color:#fff;background:rgba(0,0,0,.42);padding:5px 10px;border-radius:99px;display:flex;align-items:center;gap:6px;backdrop-filter:blur(6px)}\n.hw-ph .hw-tag.hw-r{left:auto;right:14px}\n.hw-ph .hw-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.55))}\n.hw-ph .hw-facebox{border-color:#3FD17A;box-shadow:0 0 0 3px rgba(63,209,122,.25)}\n.hw-mini{display:flex;gap:10px;align-items:center}\n.hw-mini .hw-ic2{width:34px;height:34px;font-size:16px}\n.hw-jc{background:#fff;border-radius:14px;padding:12px 14px;box-shadow:0 14px 34px rgba(2,33,36,.16)}\n.hw-jc .hw-co{display:flex;gap:7px;align-items:center;font-size:11px;font-weight:600;color:var(--muted)}\n.hw-jc .hw-co i{width:20px;height:20px;border-radius:6px;display:grid;place-items:center;color:#fff;font-size:9px;font-weight:800;font-style:normal}\n.hw-jc .hw-t{font-size:14px;font-weight:700;margin-top:5px}\n.hw-jc .hw-m{font-size:11.5px;color:var(--muted);margin-top:3px}\n\n.hw-root .hw-strip button span{white-space:nowrap}\n@media (max-width:760px){.hw-root .hw-strip button span{display:none}}\n@media (prefers-reduced-motion: reduce){.hw-root *,.hw-root *::before,.hw-root *::after{animation:none!important;transition:none!important}.hw-root .hw-type{width:auto!important;border-right:0}}\n";