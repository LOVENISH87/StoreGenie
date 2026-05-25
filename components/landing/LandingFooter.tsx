"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as IFT from "./icons";
import { Reveal } from "./motion";
import { Logo } from "./LandingTop";

/* ============ AI ASSISTANT ============ */
export function AssistantSection() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div className="card" style={{ padding: 56 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}>AI assistant</div>
              <h2 className="display" style={{ margin: 0, fontSize: "clamp(32px, 4vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
                Your shop's brilliant assistant.
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20, lineHeight: 1.6 }}>
                Ask anything in Hindi, English, or Hinglish. Genie writes product descriptions,
                designs offer posters, drafts WhatsApp campaigns, and answers customer questions.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
                {["Write festive offer", "Design Diwali poster", "Translate to Marathi", "WhatsApp blast"].map((t) => (
                  <span key={t} className="chip" style={{ fontSize: 12 }}>{t}</span>
                ))}
              </div>
            </div>

            <ChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatMockup() {
  return (
    <div className="card" style={{
      padding: 16, height: 420, background: "var(--bg-2)",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12,
        borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-3)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
          <IFT.Sparkle size={13} stroke={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Genie</div>
          <div style={{ fontSize: 11, color: "var(--good)", display: "flex", alignItems: "center", gap: 4 }}>
            <span className="chip-dot"></span>Powered by Gemini
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "80%",
          padding: "9px 13px", borderRadius: "12px 12px 3px 12px",
          background: "var(--surface-3)", fontSize: 13, fontWeight: 500,
        }}>
          Diwali ke liye ek special offer poster banao
        </div>

        <div style={{ alignSelf: "flex-start", maxWidth: "85%", display: "flex", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <IFT.Sparkle size={10} stroke={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ padding: "9px 13px", borderRadius: "12px 12px 12px 3px",
              background: "var(--surface)", color: "var(--text)", fontSize: 13,
              border: "1px solid var(--border)", marginBottom: 8 }}>
              Ji haan. Here's a Diwali offer:
            </div>

            <div style={{
              borderRadius: 10, padding: 16, position: "relative", overflow: "hidden",
              background: "#1a0d08",
              border: "1px solid var(--border-2)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-warm)", letterSpacing: "0.12em", marginBottom: 6 }}>
                DIWALI SPECIAL · 7 DAYS ONLY
              </div>
              <div className="display" style={{ fontSize: 26, lineHeight: 1.0, color: "var(--text)" }}>
                Roshni ka<br />festival
              </div>
              <div style={{ marginTop: 12, padding: "5px 12px", background: "var(--accent)", color: "#0a0a0c",
                borderRadius: 999, fontSize: 11, fontWeight: 700, display: "inline-block" }}>
                20% OFF · ALL MASALAS
              </div>
              <div style={{ position: "absolute", right: 12, bottom: 12, fontSize: 36, opacity: 0.7 }}>🪔</div>
            </div>
          </div>
        </div>

        <div style={{ alignSelf: "flex-start", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Make poster bigger", "Translate to Marathi", "Send on WhatsApp"].map((s) => (
            <button key={s} className="chip" style={{ fontSize: 11, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px", background: "var(--surface)",
        border: "1px solid var(--border-2)", borderRadius: 8 }}>
        <span style={{ flex: 1, fontSize: 12.5, color: "var(--text-3)" }}>Ask Genie anything…</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--text-3)", padding: "2px 6px",
          background: "var(--surface-2)", borderRadius: 4 }}>⏎</span>
      </div>
    </div>
  );
}

/* ============ TESTIMONIALS ============ */
export function Testimonials() {
  const items = [
    { quote: "Maine ek line likhi aur 8 second mein puri website ready. Mere papa ko bhi samajh aa gaya kaise edit karna hai.", author: "Ramesh Sharma", role: "Masala shop · Jaipur" },
    { quote: "Customer ab WhatsApp pe order karte hain — phone calls 70% kam ho gaye. Sabse asaan setup tha.", author: "Priya Mehta", role: "Saree boutique · Mumbai" },
    { quote: "Diwali season mein 3x sales. Genie ne hi poster banaye aur WhatsApp message draft kiye.", author: "Krishna Patel", role: "Mithai shop · Indore" },
  ];
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div style={{ maxWidth: 620, marginBottom: 48 }}>
          <Reveal><div className="eyebrow" style={{ marginBottom: 18 }}>Customers</div></Reveal>
          <Reveal delay={1}>
            <h2 className="display" style={{ margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              From Johari Bazaar to your shop.
            </h2>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {items.map((t, i) => (
            <Reveal delay={i + 1} key={i}>
              <div className="card" style={{ padding: 28, height: "100%",
                display: "flex", flexDirection: "column", gap: 18 }}>
                <p style={{ fontSize: 14.5, color: "var(--text)", lineHeight: 1.55, margin: 0, flex: 1 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16,
                  borderTop: "1px solid var(--border)" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "var(--surface-3)",
                    border: "1px solid var(--border-2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>
                    {t.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.author}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ PRICING ============ */
export function PricingSection() {
  const tiers = [
    { name: "Starter", price: "₹0", subtitle: "Forever free", features: [
      "1 shop · 10 products",
      "AI-generated site",
      "storegenie.in subdomain",
      "WhatsApp ordering",
      "Mobile + desktop",
    ], cta: "Start free", highlight: false },
    { name: "Shop Pro", price: "₹299", subtitle: "/month", features: [
      "Unlimited products",
      "Custom domain",
      "AI image generation",
      "Analytics + insights",
      "Remove watermark",
      "Priority WhatsApp support",
    ], cta: "Start free trial", highlight: true },
    { name: "Bazaar", price: "₹999", subtitle: "/month", features: [
      "Multi-shop · up to 5",
      "Team collaboration",
      "Inventory sync",
      "Customer database",
      "Marketing tools",
      "Dedicated manager",
    ], cta: "Talk to sales", highlight: false },
  ];

  return (
    <section id="pricing" className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <div style={{ maxWidth: 620, margin: "0 auto 56px", textAlign: "center" }}>
          <Reveal><div className="eyebrow" style={{ marginBottom: 18, justifyContent: "center", display: "inline-flex" }}>Pricing</div></Reveal>
          <Reveal delay={1}>
            <h2 className="display" style={{ margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>
              Simple pricing for small shops.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p style={{ fontSize: 16, color: "var(--text-2)", marginTop: 20 }}>
              Start free. Upgrade when you outgrow it. No setup fees.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 1080, margin: "0 auto" }}>
          {tiers.map((t, i) => (
            <Reveal key={i} delay={i + 1}>
              <div style={{
                padding: 28, borderRadius: 14, position: "relative",
                background: t.highlight ? "var(--surface-2)" : "var(--surface)",
                border: t.highlight ? "1px solid var(--border-3)" : "1px solid var(--border)",
              }}>
                {t.highlight && <div style={{
                  position: "absolute", top: -11, left: 24,
                  padding: "3px 10px", background: "var(--text)", color: "#0a0a0c",
                  borderRadius: 999, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.04em",
                }}>POPULAR</div>}

                <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 10 }}>
                  {t.name.toUpperCase()}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.025em" }}>{t.price}</span>
                  <span style={{ color: "var(--text-3)", fontSize: 13 }}>{t.subtitle}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 22, minHeight: 18 }}>
                  {t.name === "Starter" && "Try it out, no card needed"}
                  {t.name === "Shop Pro" && "For growing shops"}
                  {t.name === "Bazaar" && "Wholesalers & multi-location"}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <IFT.Check size={13} stroke={2.4} style={{ color: t.highlight ? "var(--accent)" : "var(--text-3)", marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button className={t.highlight ? "btn btn-primary" : "btn"} style={{ width: "100%" }}>
                  {t.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ FINAL CTA ============ */
export function FinalCTA() {
  const router = useRouter();
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sg-container">
        <Reveal>
          <div className="card" style={{ padding: "80px 40px", textAlign: "center", background: "var(--surface)" }}>
            <h2 className="display" style={{
              margin: 0, fontSize: "clamp(42px, 6vw, 80px)", lineHeight: 1.0, letterSpacing: "-0.03em",
            }}>
              Your shop deserves a real website.
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-2)", marginTop: 22, maxWidth: 520, margin: "22px auto 0" }}>
              Type one sentence. Get a website. Share the link. Start selling.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32 }}>
              <button onClick={() => router.push('/dashboard')} className="btn btn-primary btn-lg">
                Start free <IFT.ArrowRight size={14} />
              </button>
              <button className="btn btn-lg">
                <IFT.Play size={12} /> Watch demo
              </button>
            </div>
            <div style={{ marginTop: 20, fontSize: 12.5, color: "var(--text-3)" }}>
              No credit card · No coding · Free forever plan
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  const cols = [
    { title: "Product", links: ["Templates", "Builder", "Analytics", "AI Assistant", "Pricing"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
    { title: "Resources", links: ["Help center", "API docs", "Status", "Changelog"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Refund policy"] },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--border)", paddingTop: 64, paddingBottom: 32 }}>
      <div className="sg-container">
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Logo size={26} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>StoreGenie</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6, maxWidth: 260, margin: 0 }}>
              The AI website builder for India's small shopkeepers. One sentence, one website, one click to publish.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)", letterSpacing: "0.06em", marginBottom: 14 }}>
                {c.title.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {c.links.map((l) => (
                  <a key={l} href="#" style={{ fontSize: 13, color: "var(--text-3)", transition: "color 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24,
          borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>
            © 2026 StoreGenie · Made in Bangalore
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: "var(--text-3)" }}>
            <span>English · हिन्दी · मराठी</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="chip-dot"></span>
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
