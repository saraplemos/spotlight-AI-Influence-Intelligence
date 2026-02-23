import { useState } from "react";

// ─── PROPERTY DATA (swap per client) ──────────────────────────────────────────
const PROPERTY = {
  name: "Grand Hotel Villa Serbelloni",
  location: "Bellagio, Lake Como, Italy",
  category: "Luxury Hotel · Italian Lakes",
  period: "February 2026",
  agency: "Spotlight Communications",
};

const VISIBILITY_SCORE = 42; // out of 100

const PLATFORM_SCORES = [
  { platform: "ChatGPT",    score: 68, cited: true,  color: "#10a37f" },
  { platform: "Perplexity", score: 22, cited: false, color: "#6366f1" },
  { platform: "Gemini",     score: 55, cited: true,  color: "#4285f4" },
  { platform: "Claude",     score: 18, cited: false, color: "#c17a3a" },
];

const QUERIES = [
  {
    id: 1,
    query: "Best luxury hotel Lake Como",
    volume: "High",
    chatgpt:    [{ n: "Vogue", t: "editorial" }, { n: "Condé Nast Traveler", t: "editorial" }],
    perplexity: [{ n: "YouTube (Luxury Travel)", t: "youtube" }],
    gemini:     [{ n: "Forbes Travel Guide", t: "editorial" }, { n: "World's 50 Best Hotels", t: "editorial" }, { n: "Condé Nast Traveler", t: "editorial" }],
    claude:     [{ n: "Elite Traveler", t: "editorial" }, { n: "Hotels.com", t: "aggregator" }, { n: "Luxury Escapes", t: "aggregator" }],
    property_mentioned: { chatgpt: false, perplexity: false, gemini: false, claude: false },
  },
  {
    id: 2,
    query: "Most exclusive hotel Bellagio Lake Como",
    volume: "Medium",
    chatgpt:    [{ n: "Condé Nast Traveller UK", t: "editorial" }, { n: "Telegraph Travel", t: "editorial" }],
    perplexity: [{ n: "Booking.com", t: "aggregator" }, { n: "TripAdvisor", t: "aggregator" }],
    gemini:     [{ n: "Forbes Travel Guide", t: "editorial" }, { n: "Condé Nast Traveler", t: "editorial" }],
    claude:     [{ n: "Mr & Mrs Smith", t: "specialist" }, { n: "Hotels.com", t: "aggregator" }],
    property_mentioned: { chatgpt: true, perplexity: false, gemini: true, claude: false },
  },
  {
    id: 3,
    query: "Luxury hotel Lake Como wedding venue",
    volume: "Medium",
    chatgpt:    [{ n: "Vogue", t: "editorial" }, { n: "Brides Magazine", t: "editorial" }],
    perplexity: [{ n: "Lake Como Wedding", t: "blog" }, { n: "Bridebook", t: "aggregator" }],
    gemini:     [{ n: "Condé Nast Traveler", t: "editorial" }, { n: "Hitched", t: "aggregator" }],
    claude:     [{ n: "Rock My Wedding", t: "blog" }, { n: "Venue Scanner", t: "aggregator" }],
    property_mentioned: { chatgpt: false, perplexity: false, gemini: false, claude: false },
  },
  {
    id: 4,
    query: "Where to stay Bellagio Lake Como",
    volume: "High",
    chatgpt:    [{ n: "Lonely Planet", t: "editorial" }, { n: "Condé Nast Traveler", t: "editorial" }],
    perplexity: [{ n: "TripAdvisor", t: "aggregator" }, { n: "Booking.com", t: "aggregator" }],
    gemini:     [{ n: "Lonely Planet", t: "editorial" }, { n: "Rick Steves", t: "specialist" }],
    claude:     [{ n: "TripAdvisor", t: "aggregator" }, { n: "Expedia", t: "aggregator" }, { n: "Hotels.com", t: "aggregator" }],
    property_mentioned: { chatgpt: true, perplexity: false, gemini: false, claude: false },
  },
  {
    id: 5,
    query: "Best luxury spa hotel Italy",
    volume: "High",
    chatgpt:    [{ n: "Condé Nast Traveler", t: "editorial" }, { n: "Forbes Travel Guide", t: "editorial" }],
    perplexity: [{ n: "The Luxury Travel Expert", t: "blog" }, { n: "Spa Business", t: "specialist" }],
    gemini:     [{ n: "Condé Nast Traveller", t: "editorial" }, { n: "Tatler", t: "editorial" }],
    claude:     [{ n: "Mr & Mrs Smith", t: "specialist" }, { n: "Small Luxury Hotels", t: "specialist" }],
    property_mentioned: { chatgpt: false, perplexity: false, gemini: false, claude: false },
  },
];

const GAPS = [
  {
    platform: "Perplexity",
    issue: "Aggregators dominating",
    detail: "Booking.com and TripAdvisor cited on 4/5 relevant queries. No premium editorial presence.",
    priority: "High",
  },
  {
    platform: "Claude",
    issue: "Invisible across category",
    detail: "No appearance in any of the 5 queries tested. Claude favours specialist operators and aggregators over hotel brand content.",
    priority: "High",
  },
  {
    platform: "All platforms",
    issue: "Wedding category gap",
    detail: "Zero appearances in wedding venue queries despite Villa Serbelloni being a top Lake Como venue. Significant missed opportunity.",
    priority: "Medium",
  },
  {
    platform: "All platforms",
    issue: "YouTube outranking print",
    detail: "Perplexity citing YouTube travel content for Lake Como luxury queries. No video content strategy in place.",
    priority: "Medium",
  },
];

const RECOMMENDATIONS = [
  {
    action: "Target Condé Nast Traveler US for a dedicated property feature",
    rationale: "Cited on 4/5 queries across ChatGPT and Gemini. A feature or readers' choice placement would directly improve AI visibility on both platforms.",
    timeframe: "Q2 2026",
  },
  {
    action: "Develop wedding editorial content with Vogue and Brides Magazine",
    rationale: "Both publications dominate wedding venue queries on ChatGPT. Currently zero visibility in this high-value category.",
    timeframe: "Q2–Q3 2026",
  },
  {
    action: "Pursue Forbes Travel Guide star rating / review",
    rationale: "Forbes cited consistently across ChatGPT and Gemini for Italian luxury hotel queries. Star rating would anchor AI citations long-term.",
    timeframe: "Q3 2026",
  },
  {
    action: "Commission a YouTube feature with a luxury travel creator",
    rationale: "Perplexity is citing YouTube content for Lake Como queries. A high-quality video would capture this citation channel.",
    timeframe: "Q3 2026",
  },
];

// ─── COLOUR / TYPE SYSTEM ──────────────────────────────────────────────────────
const SOURCE_COLORS = {
  editorial:  { bg: "rgba(212,175,55,0.12)",  border: "rgba(212,175,55,0.35)",  text: "#D4AF37" },
  official:   { bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.35)",  text: "#60a5fa" },
  specialist: { bg: "rgba(45,212,191,0.10)",  border: "rgba(45,212,191,0.35)",  text: "#2dd4bf" },
  aggregator: { bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.35)",  text: "#f97316" },
  blog:       { bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.35)", text: "#a78bfa" },
  youtube:    { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)",   text: "#ef4444" },
};

const PRIORITY_COLORS = {
  High:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#ef4444" },
  Medium: { bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)",  text: "#f97316" },
};

const PLATFORM_COLORS = {
  ChatGPT:    "#10a37f",
  Perplexity: "#6366f1",
  Gemini:     "#4285f4",
  Claude:     "#c17a3a",
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const Chip = ({ n, t }) => {
  const c = SOURCE_COLORS[t] || SOURCE_COLORS.blog;
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full mr-1 mb-1 whitespace-nowrap"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
      {n}
    </span>
  );
};

const ScoreRing = ({ score }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 60 ? "#D4AF37" : score >= 35 ? "#f97316" : "#ef4444";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="text-center" style={{ zIndex: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>/ 100</div>
      </div>
    </div>
  );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <div style={{ width: 3, height: 20, background: "#D4AF37", borderRadius: 2 }} />
    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
      {children}
    </span>
  </div>
);

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export default function PropertyReport() {
  const [activeQuery, setActiveQuery] = useState(null);
  const citedCount = PLATFORM_SCORES.filter(p => p.cited).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 2px; }
      `}</style>

      <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── HEADER ── */}
        <div style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", padding: "32px 48px 28px" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", color: "#D4AF37", textTransform: "uppercase", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", padding: "3px 10px", borderRadius: 2 }}>
                  AI Visibility Report
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>
                  {PROPERTY.period}
                </div>
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 6 }}>
                {PROPERTY.name}
              </h1>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                {PROPERTY.location} &nbsp;·&nbsp; {PROPERTY.category}
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Prepared by</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{PROPERTY.agency}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", marginTop: 8, textTransform: "uppercase" }}>
                Powered by Signal Noir
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "40px 48px", maxWidth: 1200 }}>

          {/* ── OVERALL SCORE ── */}
          <div className="flex gap-6 mb-12" style={{ alignItems: "stretch" }}>

            {/* Score ring */}
            <div className="flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(212,175,55,0.12)", borderRadius: 12, padding: "32px 40px", minWidth: 220 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 20 }}>AI Visibility Score</div>
              <ScoreRing score={VISIBILITY_SCORE} />
              <div className="mt-4 text-center">
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#f97316" }}>Below category average</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Category avg: 58 / 100</div>
              </div>
            </div>

            {/* Platform breakdown */}
            <div style={{ flex: 1, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "28px 32px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Visibility by Platform</div>
              <div className="flex flex-col gap-4">
                {PLATFORM_SCORES.map(p => (
                  <div key={p.platform}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.platform}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: p.cited ? "#D4AF37" : "rgba(255,255,255,0.25)" }}>
                          {p.cited ? "Appearing" : "Not appearing"}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{p.score}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.score}%`, background: p.color, borderRadius: 2, opacity: p.cited ? 1 : 0.35 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-col gap-4" style={{ minWidth: 180 }}>
              {[
                { label: "Platforms citing property", val: `${citedCount}/4`, color: citedCount >= 3 ? "#D4AF37" : "#f97316" },
                { label: "Queries tested", val: `${QUERIES.length}`, color: "#D4AF37" },
                { label: "Queries with appearance", val: `${QUERIES.filter(q => Object.values(q.property_mentioned).some(v => v)).length}/${QUERIES.length}`, color: "#f97316" },
                { label: "Priority gaps identified", val: `${GAPS.filter(g => g.priority === "High").length}`, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: s.color, marginTop: 6 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUERY INTELLIGENCE ── */}
          <div className="mb-12">
            <SectionLabel>Query Intelligence</SectionLabel>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20, marginTop: -12 }}>
              What each AI platform surfaces when potential guests search for your property category.
            </div>

            <div className="flex flex-col gap-3">
              {QUERIES.map(q => {
                const isOpen = activeQuery === q.id;
                const appearsAnywhere = Object.values(q.property_mentioned).some(v => v);
                return (
                  <div key={q.id}
                    onClick={() => setActiveQuery(isOpen ? null : q.id)}
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${appearsAnywhere ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>

                    {/* Row header */}
                    <div className="flex items-center justify-between" style={{ padding: "16px 24px" }}>
                      <div className="flex items-center gap-4">
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", minWidth: 20 }}>{q.id.toString().padStart(2, "0")}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{q.query}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 2, background: q.volume === "High" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)", color: q.volume === "High" ? "#D4AF37" : "rgba(255,255,255,0.3)" }}>
                          {q.volume} volume
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Appearing indicators */}
                        {["chatgpt", "perplexity", "gemini", "claude"].map(p => (
                          <div key={p} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: q.property_mentioned[p] ? "#D4AF37" : "rgba(255,255,255,0.12)" }} />
                          </div>
                        ))}
                        {appearsAnywhere && (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#D4AF37", letterSpacing: "0.1em", marginLeft: 4 }}>APPEARING</span>
                        )}
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16, marginLeft: 8 }}>{isOpen ? "−" : "+"}</span>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
                        <div className="grid grid-cols-4 gap-4">
                          {[
                            { key: "chatgpt",    label: "ChatGPT",    sources: q.chatgpt },
                            { key: "perplexity", label: "Perplexity", sources: q.perplexity },
                            { key: "gemini",     label: "Gemini",     sources: q.gemini },
                            { key: "claude",     label: "Claude",     sources: q.claude },
                          ].map(col => (
                            <div key={col.key}>
                              <div className="flex items-center gap-2 mb-3">
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: PLATFORM_COLORS[col.label] }} />
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: PLATFORM_COLORS[col.label], letterSpacing: "0.1em" }}>{col.label}</span>
                                {q.property_mentioned[col.key] && (
                                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#D4AF37", background: "rgba(212,175,55,0.1)", padding: "1px 5px", borderRadius: 2 }}>✓ cited</span>
                                )}
                              </div>
                              <div className="flex flex-wrap">
                                {col.sources.map((s, i) => <Chip key={i} {...s} />)}
                                {col.sources.length === 0 && (
                                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>No results</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── GAP ANALYSIS ── */}
          <div className="mb-12">
            <SectionLabel>Gap Analysis</SectionLabel>
            <div className="grid grid-cols-2 gap-4">
              {GAPS.map((g, i) => {
                const pc = PRIORITY_COLORS[g.priority];
                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 24px" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                          {g.platform}
                        </div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{g.issue}</div>
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 3, background: pc.bg, border: `1px solid ${pc.border}`, color: pc.text, whiteSpace: "nowrap", marginLeft: 12 }}>
                        {g.priority} priority
                      </span>
                    </div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{g.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RECOMMENDATIONS ── */}
          <div className="mb-8">
            <SectionLabel>Recommended Actions</SectionLabel>
            <div className="flex flex-col gap-3">
              {RECOMMENDATIONS.map((r, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "rgba(212,175,55,0.4)", lineHeight: 1, minWidth: 28, marginTop: 2 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500, marginBottom: 6 }}>{r.action}</div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{r.rationale}</p>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#D4AF37", letterSpacing: "0.1em", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "4px 10px", borderRadius: 3, whiteSpace: "nowrap", marginTop: 2 }}>
                    {r.timeframe}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>
              CONFIDENTIAL · {PROPERTY.agency} · {PROPERTY.period}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
              Signal Noir · AI Search Intelligence
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
