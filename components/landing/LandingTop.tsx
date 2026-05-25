"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as IL from "./icons";
import { Reveal } from "./motion";
import GooeyNav from "./GooeyNav";

/* ============ LOGO ============ */
export function Logo({ size = 26, color = "var(--accent)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="StoreGenie">
      {/* 4-point sparkle, concave-cubic curves for premium taper */}
      <path
        d="M16 2.5
           C 16.4 9.6, 18.2 12.7, 22.5 14.4
           C 24.3 15.1, 26.5 15.6, 29.5 16
           C 26.5 16.4, 24.3 16.9, 22.5 17.6
           C 18.2 19.3, 16.4 22.4, 16 29.5
           C 15.6 22.4, 13.8 19.3, 9.5 17.6
           C 7.7 16.9, 5.5 16.4, 2.5 16
           C 5.5 15.6, 7.7 15.1, 9.5 14.4
           C 13.8 12.7, 15.6 9.6, 16 2.5 Z"
        fill={color}
      />
      {/* Small orbit dot — gives the mark personality */}
      <circle cx="26.5" cy="7" r="1.6" fill={color} opacity="0.85" />
    </svg>
  );
}

/* ============ STICKY NAV ============ */
export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(8, 8, 10, 0.92)" : "transparent",
      borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      transition: "background 0.2s ease, border-color 0.2s ease",
    }}>
      <div className="sg-container" style={{ display: "flex", alignItems: "center", height: 64, gap: 8 }}>
        {/* Logo */}
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.015em" }}>StoreGenie</span>
        </a>

        {/* Links */}
        <div style={{ marginLeft: 24, flex: 1 }}>
          <GooeyNav
            items={[
              { label: "Templates", href: "#templates" },
              { label: "Builder", href: "#builder" },
              { label: "Analytics", href: "#analytics" },
              { label: "Pricing", href: "#pricing" },
              { label: "Docs", href: "#" },
            ]}
            particleCount={12}
            particleDistances={[80, 8]}
            particleR={80}
            animationTime={500}
            timeVariance={250}
            colors={[1, 2, 3, 1, 2, 4]}
            initialActiveIndex={0}
          />
        </div>

        <button onClick={() => router.push('/login')} className="btn btn-ghost btn-sm">Sign in</button>
        <button onClick={() => router.push('/register')} className="btn btn-primary btn-sm">
          Start free
        </button>
      </div>
    </nav>
  );
}

/* ============ HERO ============ */
export function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pages: any[]; shopName: string } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem("builder_generated", JSON.stringify(data.pages));
      setResult(data);
    } catch {
      setError("Couldn't generate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="top" style={{ position: "relative", paddingTop: 110, paddingBottom: 80, overflow: "hidden" }}>
      <div className="bg-grid" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <div className="sg-container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

          {/* ── LEFT: Copy + Input ── */}
          <div>
            <Reveal>
              <a href="#" className="chip" style={{ marginBottom: 28, fontSize: 12 }}>
                <span className="chip-dot" />
                <span>Now in beta · Powered by Gemini</span>
                <IL.ArrowRight size={11} />
              </a>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="display" style={{
                fontSize: "clamp(42px, 5vw, 68px)", lineHeight: 1.0,
                letterSpacing: "-0.03em", fontWeight: 400, margin: "0 0 20px",
              }}>
                Build your dream store.<br />
                <span style={{ fontStyle: "italic", color: "var(--text-2)" }}>In one sentence.</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p style={{
                fontSize: 17, color: "var(--text-2)", lineHeight: 1.55,
                maxWidth: 460, margin: "0 0 32px", fontWeight: 400,
              }}>
                AI builds your entire shop — name, brand, products, layout — from a single line.
                Tweak what you don't like. Publish in one click.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div style={{
                background: "var(--surface)",
                border: `1px solid ${error ? "var(--bad)" : "var(--border-2)"}`,
                borderRadius: 12, display: "flex", alignItems: "center", padding: 6, gap: 8,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                  background: "var(--surface-3)", marginLeft: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: loading ? "var(--text-3)" : "var(--accent)", transition: "color 0.2s",
                }}>
                  {loading
                    ? <div style={{ width: 14, height: 14, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    : <IL.Sparkle size={14} stroke={2} />}
                </div>
                <input
                  value={prompt}
                  onChange={e => { setPrompt(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  placeholder="A mithai shop in Jaipur specializing in kaju katli…"
                  disabled={loading}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--text)", fontSize: 14, fontFamily: "inherit",
                    padding: "0 4px", fontWeight: 500,
                  }}
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="btn btn-primary"
                  style={{ height: 36, opacity: loading || !prompt.trim() ? 0.5 : 1 }}
                >
                  {loading ? "Generating…" : <><span>Generate</span> <IL.ArrowRight size={13} /></>}
                </button>
              </div>
              {error && <p style={{ marginTop: 8, fontSize: 13, color: "var(--bad)" }}>{error}</p>}
            </Reveal>

            <Reveal delay={3}>
              <div style={{ display: "flex", gap: 20, marginTop: 24, color: "var(--text-3)", fontSize: 12, flexWrap: "wrap" }}>
                {["No code required", "Ready in 8 seconds", "Hindi · English · Marathi", "Free forever plan"].map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <IL.Check size={11} stroke={2.2} />
                    <span style={{ fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: Preview ── */}
          <Reveal delay={2}>
            <div>
              {result
                ? <GeneratedCard result={result} onOpen={() => router.push("/builder")} />
                : <SampleStoreCard loading={loading} />}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Sample store preview (default right panel) ── */
function SampleStoreCard({ loading }: { loading: boolean }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-2)",
      borderRadius: 16, overflow: "hidden", position: "relative",
      boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
    }}>
      {/* Browser chrome */}
      <div style={{
        background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
        padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.75 }} />
          ))}
        </div>
        <div style={{
          flex: 1, maxWidth: 220, margin: "0 auto", height: 22, borderRadius: 5,
          background: "var(--bg-2)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", padding: "0 10px", gap: 6,
          fontSize: 10, color: "var(--text-3)",
        }}>
          <IL.Globe size={9} />
          <span className="mono">storegenie.in/krishna-mithai</span>
        </div>
      </div>

      {/* Storefront */}
      <div style={{ background: "#0c0c0f", padding: "20px 20px 24px" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Krishna Mithai</span>
          <div style={{ display: "flex", gap: 14, color: "var(--text-3)", fontSize: 10, fontWeight: 500 }}>
            {["Home", "Menu", "About", "Contact"].map(l => <span key={l}>{l}</span>)}
          </div>
          <div style={{ fontSize: 10, background: "var(--accent)", color: "#0a0a0c", padding: "4px 12px", borderRadius: 6, fontWeight: 700 }}>Order</div>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: "rgba(232,223,200,0.5)", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 10, textTransform: "uppercase" }}>Est. 1985 · Jaipur</div>
          <div className="display" style={{ fontSize: 34, lineHeight: 1.0, marginBottom: 10, letterSpacing: "-0.02em" }}>
            Shahi<br />Mithai
          </div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 16, maxWidth: 260, lineHeight: 1.55 }}>
            Pure desi sweets, handcrafted with love since three generations.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 11, background: "var(--accent)", color: "#0a0a0c", padding: "6px 16px", borderRadius: 8, fontWeight: 700 }}>Order Now</div>
            <div style={{ fontSize: 11, border: "1px solid var(--border-2)", padding: "6px 16px", borderRadius: 8, color: "var(--text-2)", fontWeight: 500 }}>See Menu</div>
          </div>
        </div>

        {/* Products */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ name: "Kaju Katli", price: "₹480", emoji: "🍬" }, { name: "Gulab Jamun", price: "₹180", emoji: "🟤" }, { name: "Badam Halwa", price: "₹320", emoji: "🟡" }].map((p, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: 10 }}>
              <div style={{ height: 52, background: "var(--bg-2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, marginTop: 2 }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(8,8,10,0.8)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 14, backdropFilter: "blur(6px)",
        }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <div style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>Generating your store…</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>Powered by Gemini</div>
        </div>
      )}
    </div>
  );
}

/* ── Generated output card (shown after generation) ── */
function GeneratedCard({ result, onOpen }: { result: { pages: any[]; shopName: string }; onOpen: () => void }) {
  const sections = result.pages?.[0]?.sections ?? [];
  const hero = sections.find((s: any) => s.type === "hero");
  const sectionColors: Record<string, string> = {
    navbar: "var(--surface-3)", hero: "#1a1a2e", products: "#1a2820",
    features: "#1e1a2e", about: "#221a1a", contact: "#1a1e22", footer: "#0f0f0f",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border-2)",
        borderRadius: 16, padding: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: "var(--surface-3)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)",
            flexShrink: 0,
          }}>
            <IL.Sparkle size={16} stroke={2} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Generated</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 1 }}>{result.shopName}</div>
          </div>
        </div>

        {/* Hero preview */}
        {hero && (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
            <div className="display" style={{ fontSize: 26, lineHeight: 1.05, marginBottom: 8, whiteSpace: "pre-line", letterSpacing: "-0.02em" }}>
              {hero.props.heading}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{hero.props.subtext}</div>
          </div>
        )}

        {/* Section pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {sections.map((s: any, i: number) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
              background: sectionColors[s.type] ?? "var(--surface-2)",
              border: "1px solid var(--border-2)", color: "var(--text-2)",
              textTransform: "capitalize",
            }}>{s.type}</span>
          ))}
        </div>

        <button onClick={onOpen} className="btn btn-primary" style={{ width: "100%", height: 42, fontSize: 14, fontWeight: 600 }}>
          Open in Builder <IL.ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

        <Reveal delay={3}>
          <div style={{
            display: "flex", gap: 24, justifyContent: "center", marginTop: 36,
            color: "var(--text-3)", fontSize: 12.5, flexWrap: "wrap"
          }}>
            {[
              "No code required",
              "Ready in 8 seconds",
              "Hindi · English · Marathi",
              "Free forever plan",
            ].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IL.Check size={12} stroke={2.2} />
                <span style={{ fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </Reveal>

/* ============ BROWSER MOCKUP (solid) ============ */


/* ============ TRUST ROW (static, no marquee) ============ */
export function LogoMarquee() {
  const items = [
    "YourStory", "Product Hunt #1", "Y Combinator", "Lightspeed", "TechCrunch", "Awwwards",
  ];
  return (
    <div style={{
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      padding: "44px 0"
    }}>
      <div className="sg-container">
        <div style={{
          fontSize: 12, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.12em",
          textAlign: "center", marginBottom: 28
        }}>
          TRUSTED BY 12,400+ INDIAN SHOPKEEPERS · BACKED BY
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {items.map((t) => (
            <div key={t} style={{
              fontSize: 16, fontWeight: 600, color: "var(--text-3)", letterSpacing: "-0.01em",
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
