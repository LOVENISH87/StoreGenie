import React, { useContext, useState, useEffect } from "react";

// ─── Section type ─────────────────────────────────────────────────────────────

export type SectionType =
  | "navbar" | "hero" | "products" | "features"
  | "testimonials" | "about" | "contact" | "footer"
  | "banner" | "gallery" | "faq" | "pricing" | "newsletter";

export interface Section {
  id: string;
  type: SectionType;
  props: Record<string, string>;
  style?: { bg?: string };
}

// ─── Global theme ─────────────────────────────────────────────────────────────

export type GlobalTheme = {
  primaryColor: string;
  font: string;
  radius: string;
};

export const DEFAULT_THEME: GlobalTheme = {
  primaryColor: "#111827",
  font: "Inter, system-ui, sans-serif",
  radius: "10px",
};

export const ThemeContext = React.createContext<GlobalTheme>(DEFAULT_THEME);

// ─── Inline edit context ──────────────────────────────────────────────────────

type EditCtx = { enabled: boolean; onEdit: (key: string, value: string) => void };
export const InlineEditContext = React.createContext<EditCtx>({ enabled: false, onEdit: () => {} });

// ─── EditableText ─────────────────────────────────────────────────────────────

type EditableProps = {
  value: string;
  propKey: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
};

export function EditableText({
  value, propKey, as: Tag = "span", className = "", multiline = false, style,
}: EditableProps) {
  const { enabled, onEdit } = useContext(InlineEditContext);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  const commit = (v: string) => { onEdit(propKey, v); setEditing(false); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (!multiline && e.key === "Enter") { e.preventDefault(); commit(draft); }
    if (e.key === "Escape") { setDraft(value); setEditing(false); }
  };

  const editStyle: React.CSSProperties = {
    font: "inherit", color: "inherit", letterSpacing: "inherit",
    background: "rgba(219,234,254,0.55)", outline: "2px solid #3b82f6",
    outlineOffset: "1px", borderRadius: "3px", border: "none",
    padding: "1px 3px", display: "block", width: "100%", ...style,
  };

  if (!enabled) return <Tag className={className} style={style}>{value}</Tag>;

  if (editing) {
    return multiline
      ? <textarea autoFocus value={draft} rows={Math.max(2, draft.split("\n").length)}
          onChange={e => setDraft(e.target.value)} onBlur={e => commit(e.target.value)}
          onKeyDown={handleKeyDown} style={{ ...editStyle, resize: "none", lineHeight: "inherit" } as React.CSSProperties}
          className={className} />
      : <input autoFocus type="text" value={draft}
          onChange={e => setDraft(e.target.value)} onBlur={e => commit(e.target.value)}
          onKeyDown={handleKeyDown} style={editStyle} className={className} />;
  }

  return (
    <Tag className={`${className} cursor-text rounded-sm transition-colors hover:bg-blue-50/40`} style={style}
      title="Double-click to edit"
      onDoubleClick={(e: React.MouseEvent) => { e.stopPropagation(); setDraft(value); setEditing(true); }}>
      {value}
    </Tag>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const NavbarSection = ({ logo, links, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  const navLinks = (links || "Home,Products,About,Contact").split(",").map(l => l.trim());
  return (
    <nav style={{ background: sectionBg || undefined }} className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <EditableText value={logo || "StoreGenie"} propKey="logo" as="span"
        className="text-base font-bold text-gray-900 tracking-tight" />
      <div className="flex items-center gap-7">
        {navLinks.map(link => (
          <span key={link} className="text-sm text-gray-500 font-medium cursor-pointer hover:text-gray-900 transition-colors">{link}</span>
        ))}
      </div>
      <button style={{ background: theme.primaryColor, borderRadius: theme.radius }}
        className="text-white text-xs font-semibold px-4 py-2">Shop Now</button>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HeroSection = ({ heading, subtext, badge, cta, ctaSecondary, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  return (
    <section style={{ background: sectionBg || undefined }} className="flex items-center gap-12 px-10 py-16 bg-white">
      <div className="flex-1 min-w-0">
        {badge && (
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
            <EditableText value={badge} propKey="badge" />
          </div>
        )}
        <EditableText value={heading || "Premium Products\nFor Everyone"} propKey="heading" as="h1" multiline
          className="text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-5 whitespace-pre-line" />
        <EditableText value={subtext || "Handcrafted with care, delivered with speed."} propKey="subtext" as="p" multiline
          className="text-base text-gray-500 mb-8 max-w-sm leading-relaxed" />
        <div className="flex items-center gap-3">
          <button style={{ background: theme.primaryColor, borderRadius: theme.radius }}
            className="text-white px-6 py-2.5 font-semibold text-sm">
            <EditableText value={cta || "Shop Now"} propKey="cta" />
          </button>
          <button style={{ borderRadius: theme.radius }}
            className="text-gray-700 font-semibold text-sm px-6 py-2.5 border border-gray-200">
            <EditableText value={ctaSecondary || "Browse Catalog"} propKey="ctaSecondary" />
          </button>
        </div>
        <div className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100">
          {[["2.4k+", "Happy Customers"], ["98%", "Satisfaction Rate"], ["Free", "Shipping Always"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 w-72 h-72 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center">
        <div className="w-44 h-44 rounded-2xl bg-gray-200" />
      </div>
    </section>
  );
};

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { name: "Kashmir Saffron",  price: "₹899",  tag: "Bestseller", bg: "#FEF9EC" },
  { name: "Black Cardamom",   price: "₹399",  tag: null,         bg: "#F0FDF4" },
  { name: "Smoked Paprika",   price: "₹249",  tag: "New",        bg: "#EFF6FF" },
  { name: "Star Anise",       price: "₹329",  tag: null,         bg: "#FDF4FF" },
];

export const ProductsSection = ({ heading, subtext, columns, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  const cols = Math.min(Math.max(parseInt(columns) || 3, 2), 4);
  const items = PRODUCTS.slice(0, cols);
  return (
    <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-white">
      <div className="mb-10">
        <EditableText value={heading || "Our Products"} propKey="heading" as="h2"
          className="text-3xl font-bold text-gray-900 tracking-tight" />
        <EditableText value={subtext || "Handpicked selections, just for you"} propKey="subtext" as="p"
          className="text-gray-400 mt-2 text-sm" />
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {items.map((p, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
            <div suppressHydrationWarning className="h-48 flex items-center justify-center relative" style={{ background: p.bg }}>
              {p.tag && (
                <span className="absolute top-3 left-3 text-[10px] font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200">
                  {p.tag}
                </span>
              )}
              <div className="w-20 h-20 rounded-xl bg-white/60 shadow-sm" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Premium Quality</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-base font-bold text-gray-900">{p.price}</p>
                <button style={{ background: theme.primaryColor, borderRadius: theme.radius }}
                  className="text-white text-xs font-semibold px-3 py-1.5">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { title: "Free Shipping", desc: "On all orders over ₹499", icon: "→" },
  { title: "Easy Returns",  desc: "30-day hassle-free returns", icon: "↩" },
  { title: "Secure Payment", desc: "SSL encrypted checkout", icon: "◉" },
];

export const FeaturesSection = ({ heading, subtext, sectionBg }: Record<string, string>) => (
  <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-gray-50 border-y border-gray-100">
    <div className="text-center mb-12">
      <EditableText value={heading || "Why Choose Us"} propKey="heading" as="h2"
        className="text-3xl font-bold text-gray-900 tracking-tight" />
      <EditableText value={subtext || "We take care of everything so you don't have to"} propKey="subtext" as="p"
        className="text-gray-400 mt-2 text-sm" />
    </div>
    <div className="grid grid-cols-3 gap-8">
      {FEATURES.map((f, i) => (
        <div key={i} className="text-center">
          <div className="w-11 h-11 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-700 font-bold text-base">
            {f.icon}
          </div>
          <p className="font-semibold text-gray-900 text-sm mb-1">{f.title}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: "Anjali Sharma", initials: "AS", city: "Mumbai",    text: "The spices are incredibly fresh. My biryani has never tasted better. Ordering every month now." },
  { name: "Rohan Verma",   initials: "RV", city: "Delhi",     text: "Fast delivery and excellent packaging. The quality exceeded my expectations. Highly recommend." },
  { name: "Priya Nair",    initials: "PN", city: "Bangalore", text: "Authentic flavors that remind me of home cooking. Outstanding customer service as well." },
];

export const TestimonialsSection = ({ heading, sectionBg }: Record<string, string>) => (
  <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-white">
    <div className="text-center mb-12">
      <EditableText value={heading || "What Customers Say"} propKey="heading" as="h2"
        className="text-3xl font-bold text-gray-900 tracking-tight" />
      <div className="flex items-center justify-center gap-0.5 mt-3">
        {"★★★★★".split("").map((s, i) => <span key={i} className="text-amber-400 text-base">{s}</span>)}
        <span className="text-xs text-gray-400 ml-2">4.9 · 2,400+ reviews</span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-5">
      {TESTIMONIALS.map((r, i) => (
        <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex gap-0.5 mb-4">
            {"★★★★★".split("").map((s, j) => <span key={j} className="text-amber-400 text-xs">{s}</span>)}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
              {r.initials}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{r.name}</p>
              <p className="text-[10px] text-gray-400">{r.city}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ─── About ────────────────────────────────────────────────────────────────────

export const AboutSection = ({ heading, body, imagePosition, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  const imgRight = imagePosition === "right";
  const img = (
    <div className="shrink-0 w-64 h-56 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center">
      <div className="w-32 h-32 rounded-xl bg-gray-200" />
    </div>
  );
  const text = (
    <div className="flex-1">
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.primaryColor }}>Our Story</p>
      <EditableText value={heading || "Crafted With\nPassion & Purpose"} propKey="heading" as="h2" multiline
        className="text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-4 whitespace-pre-line" />
      <EditableText value={body || "We started with a simple belief — everyone deserves access to premium quality products at fair prices."} propKey="body" as="p" multiline
        className="text-sm text-gray-500 leading-relaxed max-w-sm" />
      <button className="mt-6 text-sm font-semibold flex items-center gap-1" style={{ color: theme.primaryColor }}>
        Learn More <span>→</span>
      </button>
    </div>
  );
  return (
    <section style={{ background: sectionBg || undefined }} className="flex items-center gap-14 px-10 py-14 bg-white">
      {imgRight ? <>{text}{img}</> : <>{img}{text}</>}
    </section>
  );
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const ContactSection = ({ heading, subtext, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  return (
    <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <EditableText value={heading || "Get in Touch"} propKey="heading" as="h2"
            className="text-3xl font-bold text-gray-900 tracking-tight" />
          <EditableText value={subtext || "Have questions? We'd love to hear from you."} propKey="subtext" as="p"
            className="text-gray-400 mt-2 text-sm" />
        </div>
        <div className="space-y-3">
          <input readOnly className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 bg-white" placeholder="Your name" />
          <input readOnly className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 bg-white" placeholder="Email address" />
          <textarea readOnly rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 bg-white resize-none" placeholder="Your message..." />
          <button className="w-full text-white py-2.5 font-semibold text-sm"
            style={{ background: theme.primaryColor, borderRadius: theme.radius }}>Send Message</button>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FooterSection = ({ logo, tagline, sectionBg }: Record<string, string>) => (
  <footer style={{ background: sectionBg || undefined }} className="px-10 py-12 bg-gray-900 text-white">
    <div className="grid grid-cols-4 gap-10 mb-10">
      <div>
        <EditableText value={logo || "StoreGenie"} propKey="logo" as="p"
          className="text-base font-bold mb-2" />
        <EditableText value={tagline || "Premium products, delivered to your door with care."} propKey="tagline" as="p" multiline
          className="text-xs text-gray-400 leading-relaxed" />
      </div>
      {[["Shop", ["All Products", "New Arrivals", "Bestsellers", "Sale"]], ["Company", ["About Us", "Our Story", "Blog", "Careers"]], ["Support", ["Contact", "Returns", "Shipping", "FAQ"]]].map(([title, items]) => (
        <div key={title as string}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{title as string}</p>
          <div className="space-y-2.5">
            {(items as string[]).map(item => <p key={item} className="text-xs text-gray-400">{item}</p>)}
          </div>
        </div>
      ))}
    </div>
    <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
      <p className="text-[11px] text-gray-600">© 2025 {logo || "StoreGenie"}. All rights reserved.</p>
      <div className="flex gap-5">
        {["Twitter", "Instagram", "Facebook"].map(s => <span key={s} className="text-[11px] text-gray-600">{s}</span>)}
      </div>
    </div>
  </footer>
);

// ─── Banner ───────────────────────────────────────────────────────────────────

export const BannerSection = ({ text, cta, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  return (
    <div style={{ background: sectionBg || theme.primaryColor }} className="px-6 py-2.5 flex items-center justify-center gap-4">
      <EditableText value={text || "🎉 Free shipping on all orders over ₹499"} propKey="text" as="p"
        className="text-sm font-medium text-white text-center" />
      {cta && (
        <EditableText value={cta} propKey="cta" as="span"
          className="text-xs font-bold underline text-white/80 hover:text-white shrink-0 cursor-pointer" />
      )}
    </div>
  );
};

// ─── Gallery ──────────────────────────────────────────────────────────────────

export const GallerySection = ({ heading, subtext, sectionBg }: Record<string, string>) => (
  <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-white">
    <div className="text-center mb-10">
      <EditableText value={heading || "Our Gallery"} propKey="heading" as="h2"
        className="text-3xl font-bold text-gray-900 tracking-tight" />
      <EditableText value={subtext || "A look inside our world"} propKey="subtext" as="p"
        className="text-gray-400 mt-2 text-sm" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 rounded-2xl bg-gray-100 h-56 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-gray-100 flex-1 flex items-center justify-center min-h-[100px]">
          <div className="w-8 h-8 rounded-xl bg-gray-200" />
        </div>
        <div className="rounded-2xl bg-gray-100 flex-1 flex items-center justify-center min-h-[100px]">
          <div className="w-8 h-8 rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="rounded-2xl bg-gray-100 h-36 flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl bg-gray-200" />
      </div>
      <div className="col-span-2 rounded-2xl bg-gray-100 h-36 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-200" />
      </div>
    </div>
  </section>
);

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: "What is your return policy?",       a: "We offer a 30-day hassle-free return policy on all items. No questions asked." },
  { q: "How long does shipping take?",      a: "Standard shipping takes 3–5 business days. Express options are also available." },
  { q: "Do you ship internationally?",      a: "Yes, we ship to 50+ countries worldwide with full tracking." },
  { q: "How can I track my order?",         a: "You'll receive a tracking link via email as soon as your order ships." },
];

export const FAQSection = ({ heading, subtext, sectionBg }: Record<string, string>) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-white">
      <div className="text-center mb-12">
        <EditableText value={heading || "Frequently Asked Questions"} propKey="heading" as="h2"
          className="text-3xl font-bold text-gray-900 tracking-tight" />
        <EditableText value={subtext || "Everything you need to know"} propKey="subtext" as="p"
          className="text-gray-400 mt-2 text-sm" />
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold text-gray-900">{item.q}</span>
              <span className={`text-gray-400 text-sm transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>▾</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-2 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Pricing ──────────────────────────────────────────────────────────────────

const PRICING_PLANS = [
  { name: "Starter",    price: "₹999",   period: "/mo", features: ["10 Products", "Basic Analytics", "Email Support", "Free SSL"],                            highlight: false },
  { name: "Pro",        price: "₹2,499", period: "/mo", features: ["Unlimited Products", "Advanced Analytics", "Priority Support", "Custom Domain"],           highlight: true  },
  { name: "Enterprise", price: "₹6,999", period: "/mo", features: ["Everything in Pro", "Dedicated Manager", "SLA Guarantee", "Custom Integrations"],          highlight: false },
];

export const PricingSection = ({ heading, subtext, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  return (
    <section style={{ background: sectionBg || undefined }} className="px-10 py-14 bg-gray-50 border-y border-gray-100">
      <div className="text-center mb-12">
        <EditableText value={heading || "Simple Pricing"} propKey="heading" as="h2"
          className="text-3xl font-bold text-gray-900 tracking-tight" />
        <EditableText value={subtext || "Pick the plan that works for you"} propKey="subtext" as="p"
          className="text-gray-400 mt-2 text-sm" />
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PRICING_PLANS.map((p, i) => (
          <div key={i} className="rounded-2xl p-6 bg-white border transition-shadow hover:shadow-md"
            style={p.highlight ? { borderColor: theme.primaryColor, borderWidth: 2 } : { borderColor: "#e5e7eb" }}>
            {p.highlight && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-4 inline-block"
                style={{ background: theme.primaryColor }}>Most Popular</span>
            )}
            <p className="text-sm font-bold text-gray-900 mb-1 mt-2">{p.name}</p>
            <div className="flex items-baseline gap-0.5 mb-5">
              <span className="text-3xl font-bold text-gray-900">{p.price}</span>
              <span className="text-xs text-gray-400">{p.period}</span>
            </div>
            <div className="space-y-2.5 mb-6">
              {p.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                  <span style={{ color: theme.primaryColor }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-sm font-semibold transition-colors"
              style={p.highlight
                ? { background: theme.primaryColor, color: "white", borderRadius: theme.radius }
                : { border: "1px solid #e5e7eb", color: "#374151", borderRadius: theme.radius, background: "white" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const NewsletterSection = ({ heading, subtext, placeholder, cta, sectionBg }: Record<string, string>) => {
  const theme = useContext(ThemeContext);
  return (
    <section style={{ background: sectionBg || undefined }} className="px-10 py-16 bg-gray-900">
      <div className="max-w-lg mx-auto text-center">
        <EditableText value={heading || "Stay in the Loop"} propKey="heading" as="h2"
          className="text-3xl font-bold text-white tracking-tight" />
        <EditableText value={subtext || "Get exclusive deals, new arrivals, and style tips in your inbox."} propKey="subtext" as="p" multiline
          className="text-gray-400 mt-3 text-sm leading-relaxed" />
        <div className="flex gap-2 mt-8">
          <input readOnly placeholder={placeholder || "Enter your email..."}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300 placeholder-gray-500" />
          <button className="px-5 py-2.5 text-sm font-semibold text-white shrink-0"
            style={{ background: theme.primaryColor, borderRadius: theme.radius }}>
            <EditableText value={cta || "Subscribe"} propKey="cta" />
          </button>
        </div>
        <p className="text-[11px] text-gray-600 mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

// ─── Renderer ─────────────────────────────────────────────────────────────────

export const SectionRenderer = ({ section }: { section: Section }) => {
  const p = section.style?.bg ? { ...section.props, sectionBg: section.style.bg } : section.props;
  switch (section.type) {
    case "navbar":       return <NavbarSection {...p} />;
    case "hero":         return <HeroSection {...p} />;
    case "products":     return <ProductsSection {...p} />;
    case "features":     return <FeaturesSection {...p} />;
    case "testimonials": return <TestimonialsSection {...p} />;
    case "about":        return <AboutSection {...p} />;
    case "contact":      return <ContactSection {...p} />;
    case "footer":       return <FooterSection {...p} />;
    case "banner":       return <BannerSection {...p} />;
    case "gallery":      return <GallerySection {...p} />;
    case "faq":          return <FAQSection {...p} />;
    case "pricing":      return <PricingSection {...p} />;
    case "newsletter":   return <NewsletterSection {...p} />;
  }
};
