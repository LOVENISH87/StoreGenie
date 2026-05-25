"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import * as IF from "./icons";
import { Reveal } from "./motion";
import BorderGlow from "./BorderGlow";

/* ============ TEMPLATES ============ */
const TEMPLATES = [
  { name: "Saffron Spice",  category: "Masala / Kirana",     emoji: "🌶️", shop: "Ramesh Masala Wala",   theme: "Warm" },
  { name: "Silk Atelier",   category: "Saree / Apparel",     emoji: "👗", shop: "Mehta Silk House",     theme: "Mono" },
  { name: "Mithai Royale",  category: "Sweets / Bakery",     emoji: "🍬", shop: "Krishna Mithai",       theme: "Honey" },
  { name: "Verdant Fresh",  category: "Vegetables / Fruits", emoji: "🥬", shop: "Daily Subzi",          theme: "Leaf" },
  { name: "Chai Atelier",   category: "Tea / Coffee",        emoji: "🍵", shop: "Assam Tea Co.",        theme: "Amber" },
  { name: "Pottery Studio", category: "Handicraft",          emoji: "🏺", shop: "Khurja Pottery",       theme: "Stone" },
];

export function TemplatesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });

  return (
    <section id="templates" className="section">
      <div className="sg-container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 620 }}>
            <Reveal><div className="eyebrow" style={{ marginBottom: 18 }}>Templates</div></Reveal>
            <Reveal delay={1}>
              <h2 className="display" style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Start with a handcrafted base.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20, maxWidth: 520, lineHeight: 1.55 }}>
                Twelve templates, each tuned for a real Indian shop category. AI picks the right one —
                or pick your own.
              </p>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => scrollBy(-1)} className="btn" style={{ width: 40, height: 40, padding: 0, borderRadius: 8 }}>
                <IF.ArrowRight size={15} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button onClick={() => scrollBy(1)} className="btn" style={{ width: 40, height: 40, padding: 0, borderRadius: 8 }}>
                <IF.ArrowRight size={15} />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <div ref={scrollRef} className="h-scroll" style={{ padding: "4px 32px 8px" }}>
        {TEMPLATES.map((t, i) => <TemplateCard key={i} t={t} />)}
        <div style={{ width: 8 }}></div>
      </div>
    </section>
  );
}

function TemplateCard({ t }: { t: any }) {
  return (
    <BorderGlow
      backgroundColor="var(--surface)"
      borderRadius={12}
      glowRadius={52}
      glowIntensity={2.3}
      coneSpread={39}
      edgeSensitivity={0}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="hover-lift"
      style={{ width: 340, cursor: "pointer" }}
    >
      <div style={{ padding: 14 }}>
        {/* Preview */}
        <div style={{
          height: 240, borderRadius: 9, overflow: "hidden",
          background: "var(--bg-2)", border: "1px solid var(--border)",
          position: "relative", padding: 16, display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.1em" }}>
              {t.shop.toUpperCase()}
            </span>
            <span style={{ fontSize: 18, opacity: 0.7 }}>{t.emoji}</span>
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", lineHeight: 1.05, marginTop: 4, letterSpacing: "-0.02em" }}>
            {t.shop.split(" ").slice(0, 2).join(" ")}
          </div>
          <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{
                height: 60, borderRadius: 6,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, opacity: 0.6,
              }}>{t.emoji}</div>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div style={{ padding: "14px 4px 2px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{t.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{t.category}</div>
          </div>
          <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>{t.theme}</span>
        </div>
      </div>
    </BorderGlow>
  );
}

/* ============ BUILDER SHOWCASE ============ */
export function BuilderShowcase() {
  return (
    <section id="builder" className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <Reveal><div className="eyebrow" style={{ marginBottom: 18 }}>The builder</div></Reveal>
          <Reveal delay={1}>
            <h2 className="display" style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Drag, tweak, redesign — in plain English.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20, lineHeight: 1.55, maxWidth: 600 }}>
              A real-time visual canvas with multi-breakpoint preview and an inline AI bar that
              redesigns anything you select. Type a vibe — it just works.
            </p>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <BuilderMockup />
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 56 }}>
          {[
            { title: "Inline AI redesign", desc: "Select anything, type a vibe. Gemini rewrites the layout instantly.", icon: IF.Wand },
            { title: "Multi-breakpoint", desc: "Desktop, tablet, phone — all editable side-by-side on one canvas.", icon: IF.Device },
            { title: "Block library", desc: "Hero, products, announcement, contact, footer — drag-snap into place.", icon: IF.Blocks },
          ].map((f, i) => (
            <Reveal delay={i + 1} key={i}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "var(--surface-3)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                  color: "var(--accent)",
                }}>
                  <f.icon size={17} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "var(--text-3)", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuilderMockup() {
  const router = useRouter();
  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      background: "var(--surface)",
      border: "1px solid var(--border-2)",
      aspectRatio: "16/10",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top toolbar */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10,
        borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }}></div>
          ))}
        </div>
        <div style={{ width: 1, height: 14, background: "var(--border-2)", margin: "0 4px" }}></div>
        {["Insert", "Blocks", "Text", "Products", "AI"].map((t, i) => (
          <div key={t} style={{ fontSize: 12, color: i === 4 ? "var(--accent)" : "var(--text-3)", padding: "3px 8px", fontWeight: 500 }}>{t}</div>
        ))}
        <div style={{ flex: 1 }}></div>
        <div className="chip" style={{ padding: "3px 10px", fontSize: 11 }}>
          <span className="chip-dot"></span>Saved
        </div>
        <button onClick={() => router.push('/dashboard')} className="btn btn-primary btn-sm" style={{ height: 28, fontSize: 12 }}>
          Launch demo <IF.ArrowRight size={11} />
        </button>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 260px", flex: 1, minHeight: 0 }}>
        {/* Left panel */}
        <div style={{ padding: 14, borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
          <div style={{ display: "flex", padding: 3, gap: 2, background: "var(--surface-2)",
            borderRadius: 6, border: "1px solid var(--border)", marginBottom: 16 }}>
            {["Pages", "Layers", "Assets"].map((t, i) => (
              <div key={t} style={{
                flex: 1, height: 22, borderRadius: 4, fontSize: 10.5, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: i === 0 ? "var(--surface-3)" : "transparent",
                color: i === 0 ? "var(--text)" : "var(--text-3)",
              }}>{t}</div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>PAGES</div>
          {[
            { name: "Home", active: true },
            { name: "/products" },
            { name: "/about" },
            { name: "/contact" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
              borderRadius: 5, marginBottom: 2,
              background: p.active ? "var(--surface-2)" : "transparent",
              border: p.active ? "1px solid var(--border-2)" : "1px solid transparent",
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%",
                background: p.active ? "var(--accent)" : "var(--text-4)" }}></div>
              <span style={{ fontSize: 12, color: p.active ? "var(--text)" : "var(--text-2)",
                fontWeight: p.active ? 600 : 500 }}>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={{
          padding: 28, position: "relative",
          background: "var(--bg-2)",
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {/* Desktop */}
            <div style={{ flex: 1, maxWidth: 480 }}>
              <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 8,
                display: "flex", alignItems: "center", gap: 6 }}>
                <IF.Device size={11} /> Desktop · 1440
              </div>
              <div style={{
                borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)",
                background: "#0c0c0f", padding: 14,
              }}>
                <div style={{
                  padding: 12, borderRadius: 6,
                  background: "var(--surface-2)", marginBottom: 10,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.12em", marginBottom: 4 }}>JOHARI BAZAAR · JAIPUR</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Ramesh Masala</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {["🌿","🌶️","🟡","🟤","🟢","🍂"].map((e, i) => (
                    <div key={i} style={{
                      height: 44, borderRadius: 5,
                      background: "var(--surface)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
            {/* Phone */}
            <div style={{ width: 130 }}>
              <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 8,
                display: "flex", alignItems: "center", gap: 6 }}>
                <IF.Phone size={11} /> 390
              </div>
              <div style={{
                borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)",
                background: "#0c0c0f", padding: 8, height: 240,
              }}>
                <div style={{
                  padding: 8, borderRadius: 4,
                  background: "var(--surface-2)", marginBottom: 6,
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 11 }}>Ramesh M.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {["🌿","🌶️","🟡","🟤"].map((e, i) => (
                    <div key={i} style={{
                      height: 32, borderRadius: 3,
                      background: "var(--surface)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI bar (solid) */}
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "6px 10px 6px 12px",
              borderRadius: 8, minWidth: 360,
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
            }}>
              <IF.Sparkle size={12} stroke={2} style={{ color: "var(--accent)" }} />
              <span style={{ flex: 1, fontSize: 12, color: "var(--text-3)" }}>premium look mein bana de</span>
              <span className="mono" style={{ padding: "2px 6px", fontSize: 10,
                background: "var(--surface-3)", border: "1px solid var(--border-2)", borderRadius: 4, color: "var(--text-3)" }}>⌘ K</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding: 14, borderLeft: "1px solid var(--border)", background: "var(--surface)" }}>
          <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>SELECTED · BLOCK</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 16 }}>Hero · Shop intro</div>

          {["Position", "Size", "Brand", "Typography", "Effects"].map((s, i) => (
            <div key={s} style={{
              padding: "11px 0",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 11.5, color: i === 2 ? "var(--text)" : "var(--text-3)", fontWeight: i === 2 ? 600 : 500 }}>{s}</span>
              {i === 2 ? (
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { c: "var(--accent)", active: true },
                    { c: "var(--accent-cool)" },
                    { c: "var(--text-3)" },
                  ].map((sw, j) => (
                    <div key={j} style={{ width: 14, height: 14, borderRadius: 3, background: sw.c,
                      border: sw.active ? "1.5px solid var(--text)" : "1px solid var(--border-2)" }}></div>
                  ))}
                </div>
              ) : <IF.ChevDown size={11} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ ANALYTICS ============ */
export function AnalyticsSection() {
  return (
    <section id="analytics" className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "center" }}>
          <div>
            <Reveal><div className="eyebrow" style={{ marginBottom: 18 }}>Analytics</div></Reveal>
            <Reveal delay={1}>
              <h2 className="display" style={{ margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Know your shop like never before.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20, lineHeight: 1.6 }}>
                Real-time orders, visitor patterns, hot products, peak hours.
                Plain-Hindi insights delivered on WhatsApp every Sunday morning.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
                {[
                  "Daily, weekly, monthly views",
                  "Top sellers & dead stock alerts",
                  "WhatsApp summary every Sunday",
                  "Peak hours & customer return rate",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IF.Check size={14} stroke={2.2} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: 14, color: "var(--text-2)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <AnalyticsDashboardMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AnalyticsDashboardMockup() {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 500;
    const y = 120 - (40 + Math.sin(i * 0.6) * 30 + Math.cos(i * 0.3) * 20 + i * 1.5);
    return [x, y];
  });
  const path = "M " + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
  const areaPath = path + ` L 500 200 L 0 200 Z`;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>DASHBOARD</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Ramesh Masala Wala</div>
        </div>
        <div className="chip" style={{ padding: "3px 10px", fontSize: 11 }}>
          <span className="chip-dot"></span>Live
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Today", value: "₹12,400", delta: "+18%", good: true },
          { label: "Orders", value: "47", delta: "+9", good: true },
          { label: "Visitors", value: "284", delta: "−4%", good: false },
        ].map((s, i) => (
          <div key={i} style={{
            padding: 14, borderRadius: 10, background: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4,
              color: s.good ? "var(--good)" : "var(--bad)" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Revenue · last 24 days</div>
          <div style={{ display: "flex", gap: 2, background: "var(--surface-3)", borderRadius: 6, padding: 2 }}>
            {["1W", "1M", "3M"].map((p, i) => (
              <div key={p} style={{
                padding: "3px 9px", borderRadius: 4, fontSize: 10.5, fontWeight: 600,
                background: i === 1 ? "var(--surface)" : "transparent",
                color: i === 1 ? "var(--text)" : "var(--text-3)",
              }}>{p}</div>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 500 200" style={{ width: "100%", height: 160 }}>
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8dfc8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#e8dfc8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chart-grad)" />
          <path d={path} fill="none" stroke="#e8dfc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {pts.slice(-1).map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#e8dfc8" stroke="#0a0a0c" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Top sellers this week</div>
        {[
          { name: "Garam Masala", emoji: "🌿", count: 42, w: 100 },
          { name: "Kashmiri Mirch", emoji: "🌶️", count: 31, w: 74 },
          { name: "Chai Masala", emoji: "🍂", count: 18, w: 43 },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
            borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontSize: 16 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${p.w}%`, height: "100%", background: "var(--accent)" }}></div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{p.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ PRODUCTS ============ */
export function ProductsSection() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>
          <Reveal>
            <PhoneMockup />
          </Reveal>

          <div>
            <Reveal><div className="eyebrow" style={{ marginBottom: 18 }}>Products</div></Reveal>
            <Reveal delay={1}>
              <h2 className="display" style={{ margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Add a product just by typing.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20, lineHeight: 1.6 }}>
                Type "Kashmiri Mirch" — AI fills the description, suggests a fair price, and generates
                a clean product photo in seconds. No camera, no editor needed.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 28 }}>
                {[
                  ["AI descriptions", "Auto-written, locale-aware"],
                  ["Smart pricing", "Suggested from market data"],
                  ["Image generation", "Replicate SDXL, clean bg"],
                  ["Stock toggle", "One tap in/out of stock"],
                ].map(([t, d], i) => (
                  <div key={i} className="card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{d}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{
        width: 300, borderRadius: 36, padding: 8,
        background: "#000", border: "1px solid var(--border-2)",
      }}>
        <div style={{
          background: "var(--bg-2)", borderRadius: 28, overflow: "hidden",
          height: 560, position: "relative", padding: "40px 16px 16px",
          border: "1px solid var(--border)",
        }}>
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 100, height: 26, background: "#000", borderRadius: 999 }}></div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Add product</div>
              <div className="display" style={{ fontSize: 22, lineHeight: 1.1 }}>New item</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-3)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <IF.Sparkle size={13} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.08em" }}>NAME</div>
            <div className="input" style={{ background: "var(--surface)", display: "flex", alignItems: "center", fontWeight: 600 }}>
              Kashmiri Mirch
            </div>
          </div>

          <div style={{ padding: 12, borderRadius: 10,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <IF.Sparkle size={10} stroke={2} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em" }}>AI SUGGESTED</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.45 }}>
              Premium Kashmiri Mirch — sun-dried whole red chillies. Vibrant color, mild heat. Perfect for tandoori dishes.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 8, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.08em" }}>PRICE</div>
              <div className="input" style={{ background: "var(--surface)", display: "flex", alignItems: "center", fontWeight: 700, color: "var(--accent)", fontSize: 15 }}>
                ₹240 <span style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500, marginLeft: 4 }}>/100g</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.08em" }}>STOCK</div>
              <div style={{ padding: "8px 12px", background: "var(--surface)",
                border: "1px solid var(--border-2)", borderRadius: 8,
                fontSize: 13, fontWeight: 500, color: "var(--good)",
                display: "flex", alignItems: "center", justifyContent: "space-between", height: 38 }}>
                <span>Available</span>
                <div style={{ width: 26, height: 14, borderRadius: 999, background: "var(--good)", position: "relative" }}>
                  <div style={{ position: "absolute", right: 2, top: 2, width: 10, height: 10, background: "white", borderRadius: "50%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            height: 120, borderRadius: 10, position: "relative", overflow: "hidden",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{ fontSize: 60, opacity: 0.4 }}>🌶️</div>
            <div className="chip" style={{ position: "absolute", top: 8, right: 8, fontSize: 10, padding: "2px 8px" }}>
              <IF.Sparkle size={9} /> AI generated
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", height: 42 }}>
            <IF.Check size={13} /> Save product
          </button>
        </div>
      </div>
    </div>
  );
}
