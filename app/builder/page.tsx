"use client";

import { useReducer, useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragEndEvent, DragStartEvent, DragOverlay, useDraggable, useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Section, SectionType, SectionRenderer,
  ThemeContext, DEFAULT_THEME, GlobalTheme, InlineEditContext,
} from "@/components/builder/Blocks";
import { createClient } from "@/utils/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Page = { id: string; name: string; sections: Section[] };

type HistoryState = { past: Page[][]; present: Page[]; future: Page[][] };
type HistoryAction = { type: "SET"; pages: Page[] } | { type: "UNDO" } | { type: "REDO" };

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "SET":
      return { past: [...state.past.slice(-19), state.present], present: action.pages, future: [] };
    case "UNDO":
      if (!state.past.length) return state;
      return { past: state.past.slice(0, -1), present: state.past[state.past.length - 1], future: [state.present, ...state.future] };
    case "REDO":
      if (!state.future.length) return state;
      return { past: [...state.past, state.present], present: state.future[0], future: state.future.slice(1) };
  }
}

// ─── Section library ──────────────────────────────────────────────────────────

const LIBRARY: { type: SectionType; label: string; desc: string; defaults: Record<string, string> }[] = [
  { type: "navbar",       label: "Navbar",       desc: "Logo + navigation links",   defaults: { logo: "StoreGenie", links: "Home,Products,About,Contact" } },
  { type: "hero",         label: "Hero",         desc: "Banner with CTA",           defaults: { heading: "Premium Products\nFor Everyone", subtext: "Handcrafted with care, delivered with speed.", badge: "New Collection", cta: "Shop Now", ctaSecondary: "Browse Catalog" } },
  { type: "products",     label: "Products",     desc: "Product grid",              defaults: { heading: "Our Products", subtext: "Handpicked selections, just for you", columns: "3" } },
  { type: "features",     label: "Features",     desc: "Key selling points",        defaults: { heading: "Why Choose Us", subtext: "We take care of everything so you don't have to" } },
  { type: "testimonials", label: "Testimonials", desc: "Customer reviews",          defaults: { heading: "What Customers Say" } },
  { type: "about",        label: "About",        desc: "Brand story section",       defaults: { heading: "Crafted With\nPassion & Purpose", body: "We started with a simple belief — everyone deserves access to premium quality products.", imagePosition: "left" } },
  { type: "contact",      label: "Contact",      desc: "Contact form",              defaults: { heading: "Get in Touch", subtext: "Have questions? We'd love to hear from you." } },
  { type: "footer",       label: "Footer",       desc: "Links and copyright",       defaults: { logo: "StoreGenie", tagline: "Premium products, delivered to your door with care." } },
  { type: "banner",      label: "Banner",      desc: "Announcement strip",         defaults: { text: "🎉 Free shipping on all orders over ₹499", cta: "Shop Now" } },
  { type: "gallery",     label: "Gallery",     desc: "Image grid showcase",        defaults: { heading: "Our Gallery", subtext: "A look inside our world" } },
  { type: "faq",         label: "FAQ",         desc: "Frequently asked questions", defaults: { heading: "Frequently Asked Questions", subtext: "Everything you need to know" } },
  { type: "pricing",     label: "Pricing",     desc: "Pricing tiers",              defaults: { heading: "Simple Pricing", subtext: "Pick the plan that works for you" } },
  { type: "newsletter",  label: "Newsletter",  desc: "Email signup",               defaults: { heading: "Stay in the Loop", subtext: "Get exclusive deals and new arrivals.", placeholder: "Enter your email...", cta: "Subscribe" } },
];

// ─── Property schemas ─────────────────────────────────────────────────────────

type FieldType = "text" | "textarea" | "select" | "image";
type Field = { key: string; label: string; type: FieldType; options?: string[] };

const SCHEMAS: Record<SectionType, Field[]> = {
  navbar:       [{ key: "logo", label: "Brand Name", type: "text" }, { key: "links", label: "Nav Links (comma separated)", type: "text" }],
  hero:         [{ key: "badge", label: "Badge", type: "text" }, { key: "heading", label: "Heading", type: "textarea" }, { key: "subtext", label: "Subtext", type: "textarea" }, { key: "cta", label: "Primary Button", type: "text" }, { key: "ctaSecondary", label: "Secondary Button", type: "text" }, { key: "image", label: "Hero Image", type: "image" }],
  products:     [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }, { key: "columns", label: "Columns", type: "select", options: ["2", "3", "4"] }],
  features:     [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }],
  testimonials: [{ key: "heading", label: "Heading", type: "text" }],
  about:        [{ key: "heading", label: "Heading", type: "textarea" }, { key: "body", label: "Body Text", type: "textarea" }, { key: "imagePosition", label: "Image Side", type: "select", options: ["left", "right"] }, { key: "image", label: "About Image", type: "image" }],
  contact:      [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }],
  footer:       [{ key: "logo", label: "Brand Name", type: "text" }, { key: "tagline", label: "Tagline", type: "textarea" }],
  banner:       [{ key: "text", label: "Announcement Text", type: "textarea" }, { key: "cta", label: "CTA Text", type: "text" }],
  gallery:      [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }, { key: "image1", label: "Image 1 (Large)", type: "image" }, { key: "image2", label: "Image 2", type: "image" }, { key: "image3", label: "Image 3", type: "image" }, { key: "image4", label: "Image 4 (Wide)", type: "image" }],
  faq:          [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }],
  pricing:      [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "text" }],
  newsletter:   [{ key: "heading", label: "Heading", type: "text" }, { key: "subtext", label: "Subtext", type: "textarea" }, { key: "placeholder", label: "Input Placeholder", type: "text" }, { key: "cta", label: "Button Text", type: "text" }],
};

// ─── Theme fonts + radius options ─────────────────────────────────────────────

const FONTS = [
  { label: "Inter",            value: "Inter, system-ui, sans-serif" },
  { label: "Poppins",          value: "Poppins, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { label: "Georgia",          value: "Georgia, serif" },
  { label: "Roboto Mono",      value: "'Roboto Mono', monospace" },
];

const RADII = [
  { label: "Sharp",   value: "2px" },
  { label: "Mild",    value: "6px" },
  { label: "Soft",    value: "10px" },
  { label: "Round",   value: "16px" },
  { label: "Full",    value: "9999px" },
];

// ─── Templates ────────────────────────────────────────────────────────────────

type TemplateType = {
  id: string; name: string; desc: string; previewBg: string;
  theme: GlobalTheme; pages: Page[];
};

const TEMPLATES: TemplateType[] = [
  {
    id: "minimal", name: "Minimal Boutique", desc: "Clean and spacious — perfect for premium goods",
    previewBg: "#f9fafb",
    theme: { primaryColor: "#111827", font: "Inter, system-ui, sans-serif", radius: "10px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t1s1", type: "navbar",       props: { logo: "Maison", links: "Shop,Collection,About,Contact" } },
      { id: "t1s2", type: "hero",         props: { heading: "Timeless Style,\nReduced to Essence", subtext: "Minimal by design, lasting in quality. Pieces that outlive trends.", badge: "New Season", cta: "Shop Collection", ctaSecondary: "Our Story" } },
      { id: "t1s3", type: "products",     props: { heading: "Featured Pieces", subtext: "Carefully curated selections", columns: "3" } },
      { id: "t1s4", type: "features",     props: { heading: "Our Commitment", subtext: "Quality over quantity, always" } },
      { id: "t1s5", type: "testimonials", props: { heading: "Loved By Many" } },
      { id: "t1s6", type: "footer",       props: { logo: "Maison", tagline: "Minimal luxury for the modern wardrobe." } },
    ]}],
  },
  {
    id: "luxury", name: "Luxury Skincare", desc: "Elegant serif typography with a warm golden palette",
    previewBg: "linear-gradient(135deg, #fef9ec, #f3e8d0)",
    theme: { primaryColor: "#92713C", font: "'Playfair Display', Georgia, serif", radius: "2px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t2s1", type: "navbar",       props: { logo: "LUMIÈRE", links: "Shop,Rituals,About,Journal" } },
      { id: "t2s2", type: "banner",       props: { text: "✦ Complimentary gift with orders over ₹3,999 ✦", cta: "Shop Now" } },
      { id: "t2s3", type: "hero",         props: { heading: "Rituals of\nRadiant Beauty", subtext: "Science-backed formulas inspired by ancient beauty wisdom. Reveal your most luminous skin.", badge: "New Formula", cta: "Discover More", ctaSecondary: "Our Ingredients" } },
      { id: "t2s4", type: "products",     props: { heading: "The Collection", subtext: "Each formula crafted with 97% natural ingredients", columns: "3" } },
      { id: "t2s5", type: "about",        props: { heading: "Beauty Born\nFrom Nature", body: "Every LUMIÈRE product is the result of years of research, marrying the finest botanicals with cutting-edge science. Luxury and sustainability are inseparable.", imagePosition: "right" } },
      { id: "t2s6", type: "testimonials", props: { heading: "Skin Stories" } },
      { id: "t2s7", type: "footer",       props: { logo: "LUMIÈRE", tagline: "Luxury skincare, consciously crafted." } },
    ]}],
  },
  {
    id: "streetwear", name: "Streetwear Drop", desc: "Bold and minimal — built for limited drops and hype",
    previewBg: "#0a0a0a",
    theme: { primaryColor: "#000000", font: "Inter, system-ui, sans-serif", radius: "3px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t3s1", type: "banner",       props: { text: "DROP 003 — LIVE NOW. LIMITED UNITS.", cta: "Shop Drop" } },
      { id: "t3s2", type: "navbar",       props: { logo: "VOID", links: "Drops,Archive,Lookbook,Community" } },
      { id: "t3s3", type: "hero",         props: { heading: "Wear the\nVoid", subtext: "No compromises. No trends. Just pieces built for those who move on their own terms.", badge: "Drop 003", cta: "Shop Now", ctaSecondary: "See Lookbook" } },
      { id: "t3s4", type: "products",     props: { heading: "Current Drop", subtext: "Limited runs. No restocks.", columns: "4" } },
      { id: "t3s5", type: "gallery",      props: { heading: "The Lookbook", subtext: "Styled in the streets" } },
      { id: "t3s6", type: "newsletter",   props: { heading: "Get Early Access", subtext: "Be first to know about drops, collabs, and restocks.", placeholder: "Drop your email", cta: "Join" } },
      { id: "t3s7", type: "footer",       props: { logo: "VOID", tagline: "No trends. Only timeless." } },
    ]}],
  },
  {
    id: "organic", name: "Organic Market", desc: "Earthy tones and rounded shapes for food and wellness",
    previewBg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    theme: { primaryColor: "#2D6A4F", font: "Poppins, sans-serif", radius: "16px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t4s1", type: "navbar",       props: { logo: "Harvest Co.", links: "Shop,Our Farm,Recipes,About" } },
      { id: "t4s2", type: "banner",       props: { text: "🌿 Farm-fresh delivery every Tuesday & Friday", cta: "Subscribe" } },
      { id: "t4s3", type: "hero",         props: { heading: "From Farm\nTo Your Table", subtext: "Certified organic produce, harvested at peak ripeness and delivered within 24 hours.", badge: "Just Harvested", cta: "Shop Now", ctaSecondary: "How It Works" } },
      { id: "t4s4", type: "features",     props: { heading: "Why Choose Organic", subtext: "Better for you, better for the planet" } },
      { id: "t4s5", type: "products",     props: { heading: "This Week's Harvest", subtext: "Fresh picks from our partner farms", columns: "3" } },
      { id: "t4s6", type: "about",        props: { heading: "Grown With\nCare & Purpose", body: "We partner with small-scale farmers who share our belief that good food starts with healthy soil. No pesticides, no shortcuts — just honest, nourishing produce.", imagePosition: "left" } },
      { id: "t4s7", type: "contact",      props: { heading: "Get In Touch", subtext: "Questions about our produce? We'd love to help." } },
      { id: "t4s8", type: "footer",       props: { logo: "Harvest Co.", tagline: "Nourishing communities, one harvest at a time." } },
    ]}],
  },
  {
    id: "tech", name: "Tech Gadgets", desc: "Monospace precision for electronics and gadget stores",
    previewBg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    theme: { primaryColor: "#2563EB", font: "'Roboto Mono', monospace", radius: "6px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t5s1", type: "navbar",       props: { logo: "VOLT", links: "Products,Specs,Reviews,Support" } },
      { id: "t5s2", type: "hero",         props: { heading: "Next-Gen\nTech. Now.", subtext: "Premium gadgets engineered for performance. Tested to the extreme, built to last.", badge: "New Arrival", cta: "Shop Now", ctaSecondary: "View Specs" } },
      { id: "t5s3", type: "products",     props: { heading: "Featured Products", subtext: "Handpicked for performance and value", columns: "3" } },
      { id: "t5s4", type: "features",     props: { heading: "Built Different", subtext: "Every product meets our strict quality standards" } },
      { id: "t5s5", type: "pricing",      props: { heading: "Warranty Plans", subtext: "Protect your investment" } },
      { id: "t5s6", type: "faq",          props: { heading: "Common Questions", subtext: "Everything you need to know before you buy" } },
      { id: "t5s7", type: "footer",       props: { logo: "VOLT", tagline: "Where innovation meets reliability." } },
    ]}],
  },
  {
    id: "jewelry", name: "Jewelry Studio", desc: "Romantic and refined, for artisan jewelry and accessories",
    previewBg: "linear-gradient(135deg, #fdf4ff, #fce7f3)",
    theme: { primaryColor: "#9D6E45", font: "'Playfair Display', Georgia, serif", radius: "20px" },
    pages: [{ id: "home", name: "Home", sections: [
      { id: "t6s1", type: "navbar",       props: { logo: "Aurelia", links: "Collections,Bespoke,Studio,About" } },
      { id: "t6s2", type: "hero",         props: { heading: "Adornments\nMade to Last", subtext: "Each piece is handcrafted in our studio using ethically sourced gemstones and recycled gold.", badge: "Artisan Crafted", cta: "Explore Collections", ctaSecondary: "Bespoke Orders" } },
      { id: "t6s3", type: "about",        props: { heading: "A Studio Built\nOn Craft", body: "Aurelia was born from a love of materials and meticulous making. Every ring, necklace, and bracelet is a small piece of art — designed to be worn and loved for generations.", imagePosition: "right" } },
      { id: "t6s4", type: "products",     props: { heading: "New Collection", subtext: "Pieces that hold meaning", columns: "3" } },
      { id: "t6s5", type: "testimonials", props: { heading: "Words From Our Wearers" } },
      { id: "t6s6", type: "newsletter",   props: { heading: "Join the Inner Circle", subtext: "Early access to new collections, studio events, and exclusive offers.", placeholder: "Your email address", cta: "Join" } },
      { id: "t6s7", type: "footer",       props: { logo: "Aurelia", tagline: "Handcrafted jewelry for the moments that matter." } },
    ]}],
  },
];

// ─── Templates modal ──────────────────────────────────────────────────────────

function TemplatesModal({ onClose, onApply }: { onClose: () => void; onApply: (t: TemplateType) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Start from a Template</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Choose a design — you can customize everything after</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => onApply(t)}
                className="group rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
                <div className="h-28 relative flex flex-col items-center justify-center gap-2 p-4" style={{ background: t.previewBg }}>
                  <div className="w-full h-2.5 rounded-sm bg-white/40" />
                  <div className="w-3/4 h-4 rounded-sm bg-white/60" />
                  <div className="w-1/2 h-2 rounded-sm bg-white/30" />
                  <div className="flex gap-1.5 mt-0.5">
                    <div className="h-5 w-14 rounded-sm bg-white/70" />
                    <div className="h-5 w-10 rounded-sm bg-white/25 border border-white/30" />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-white/60 shadow-sm"
                    style={{ background: t.theme.primaryColor }} />
                </div>
                <div className="px-3.5 py-3">
                  <p className="text-xs font-bold text-gray-900" style={{ fontFamily: t.theme.font.split(",")[0].replace(/'/g, "") }}>{t.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{t.desc}</p>
                  <button className="mt-2.5 w-full h-7 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Use Template →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section thumbnails ───────────────────────────────────────────────────────

function Thumbnail({ type }: { type: SectionType }) {
  const base = "h-10 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center px-2 gap-1.5";
  switch (type) {
    case "navbar": return (
      <div className={base}>
        <div className="w-7 h-2 bg-gray-700 rounded-sm shrink-0" />
        <div className="flex-1 flex justify-center gap-1">
          {[0,1,2].map(i => <div key={i} className="w-4 h-1.5 bg-gray-200 rounded-sm" />)}
        </div>
        <div className="w-7 h-3.5 bg-gray-800 rounded-sm shrink-0" />
      </div>
    );
    case "hero": return (
      <div className={base + " justify-between"}>
        <div className="flex-1 space-y-1 pr-2">
          <div className="w-16 h-2 bg-gray-800 rounded-sm" />
          <div className="w-10 h-1.5 bg-gray-300 rounded-sm" />
          <div className="w-8 h-2 bg-gray-700 rounded-sm mt-1" />
        </div>
        <div className="w-9 h-8 bg-gray-100 rounded-lg shrink-0" />
      </div>
    );
    case "products": return (
      <div className={base}>
        {[0,1,2].map(i => <div key={i} className="flex-1 h-8 bg-gray-100 rounded border border-gray-200" />)}
      </div>
    );
    case "features": return (
      <div className={base}>
        {[0,1,2].map(i => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="w-8 h-1.5 bg-gray-300 rounded-sm" />
          </div>
        ))}
      </div>
    );
    case "testimonials": return (
      <div className={base}>
        {[0,1,2].map(i => (
          <div key={i} className="flex-1 h-8 bg-gray-50 rounded border border-gray-200 p-1 space-y-1">
            <div className="flex gap-0.5">{[0,1,2].map(j => <div key={j} className="w-1.5 h-1.5 bg-amber-300 rounded-sm" />)}</div>
            <div className="w-full h-1 bg-gray-200 rounded-sm" />
          </div>
        ))}
      </div>
    );
    case "about": return (
      <div className={base}>
        <div className="w-10 h-8 bg-gray-100 rounded shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="w-12 h-2 bg-gray-800 rounded-sm" />
          <div className="w-16 h-1.5 bg-gray-300 rounded-sm" />
          <div className="w-8 h-1.5 bg-gray-300 rounded-sm" />
        </div>
      </div>
    );
    case "contact": return (
      <div className={base + " flex-col justify-center gap-1"}>
        <div className="w-full h-2 bg-gray-100 rounded border border-gray-200" />
        <div className="w-full h-2 bg-gray-100 rounded border border-gray-200" />
        <div className="w-full h-1.5 bg-gray-800 rounded-sm" />
      </div>
    );
    case "footer": return (
      <div className="h-10 bg-gray-900 rounded-lg flex items-center px-2 gap-2">
        <div className="w-8 h-2 bg-gray-600 rounded-sm" />
        <div className="flex-1 flex justify-end gap-1">
          {[0,1,2].map(i => <div key={i} className="w-5 h-1.5 bg-gray-700 rounded-sm" />)}
        </div>
      </div>
    );
    case "banner": return (
      <div className="h-10 bg-blue-600 rounded-lg flex items-center justify-center px-2 gap-2">
        <div className="w-24 h-2 bg-white/60 rounded-sm" />
        <div className="w-10 h-3 bg-white/30 rounded-sm" />
      </div>
    );
    case "gallery": return (
      <div className={base}>
        <div className="w-16 h-8 bg-gray-100 rounded border border-gray-200 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-3.5 bg-gray-100 rounded border border-gray-200" />
          <div className="h-3.5 bg-gray-100 rounded border border-gray-200" />
        </div>
      </div>
    );
    case "faq": return (
      <div className={base + " flex-col justify-center gap-1"}>
        {[0,1,2].map(i => (
          <div key={i} className="w-full h-2 bg-gray-100 rounded border border-gray-200 flex items-center px-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full mr-1" />
            <div className="flex-1 h-1 bg-gray-200 rounded-sm" />
          </div>
        ))}
      </div>
    );
    case "pricing": return (
      <div className={base}>
        {[0,1,2].map(i => (
          <div key={i} className={`flex-1 h-8 rounded border flex flex-col justify-center items-center gap-0.5 ${i === 1 ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="w-6 h-1.5 bg-gray-700 rounded-sm" />
            <div className="w-4 h-1 bg-gray-300 rounded-sm" />
          </div>
        ))}
      </div>
    );
    case "newsletter": return (
      <div className="h-10 bg-gray-900 rounded-lg flex items-center px-2 gap-1.5">
        <div className="flex-1 h-4 bg-gray-700 rounded border border-gray-600" />
        <div className="w-8 h-4 bg-gray-500 rounded" />
      </div>
    );
  }
}

// ─── Library draggable item ───────────────────────────────────────────────────

function LibraryItem({ lib, onAdd }: { lib: (typeof LIBRARY)[0]; onAdd: (t: SectionType) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `lib-${lib.type}` });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={() => onAdd(lib.type)}
      className={`w-full text-left rounded-xl border bg-white transition-all overflow-hidden cursor-grab active:cursor-grabbing select-none
        ${isDragging ? "opacity-40 border-blue-300 shadow-lg" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/40"}`}>
      <div className="px-2 pt-2 pointer-events-none"><Thumbnail type={lib.type} /></div>
      <div className="px-3 py-2 pointer-events-none">
        <p className="text-[11px] font-semibold text-gray-900">{lib.label}</p>
        <p className="text-[10px] text-gray-400">{lib.desc}</p>
      </div>
    </div>
  );
}

// ─── Canvas drop zone ─────────────────────────────────────────────────────────

function CanvasEmptyDrop() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-empty" });
  return (
    <div ref={setNodeRef}
      className={`flex flex-col items-center justify-center h-96 rounded-2xl border-2 border-dashed transition-colors mx-4 my-4
        ${isOver ? "border-blue-400 bg-blue-50/60" : "border-gray-200 text-gray-400"}`}>
      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center mb-4 text-xl">+</div>
      <p className={`text-sm font-medium ${isOver ? "text-blue-600" : "text-gray-500"}`}>
        {isOver ? "Drop to add section" : "Add or drag sections here"}
      </p>
      <p className="text-xs text-gray-400 mt-1">Click any section in the left panel</p>
    </div>
  );
}

// ─── Sortable section wrapper ─────────────────────────────────────────────────

function SortableSection({
  section, selected, onClick, onDelete, onDuplicate, onPropChange,
  onMoveUp, onMoveDown, canMoveUp, canMoveDown, onOpenAI,
}: {
  section: Section; selected: boolean;
  onClick: () => void; onDelete: () => void; onDuplicate: () => void;
  onPropChange: (key: string, value: string) => void;
  onMoveUp: () => void; onMoveDown: () => void;
  canMoveUp: boolean; canMoveDown: boolean;
  onOpenAI: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [hovered, setHovered] = useState(false);
  const showToolbar = (hovered || selected) && !isDragging;

  return (
    <InlineEditContext.Provider value={{ enabled: true, onEdit: onPropChange }}>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.35 : 1,
          outline: selected ? "2px solid #3b82f6" : hovered ? "2px dashed #93c5fd" : "none",
          outlineOffset: "-2px",
        }}
        className="relative cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Floating toolbar ── */}
        <div className={`absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 bg-white border border-gray-200 rounded-2xl shadow-lg px-1.5 py-1 select-none transition-all duration-150 ${showToolbar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

          {/* Type badge */}
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg mr-0.5">
            {section.type}
          </span>

          <div className="w-px h-3.5 bg-gray-200 mx-0.5" />

          {/* Move up */}
          <button onClick={e => { e.stopPropagation(); onMoveUp(); }} disabled={!canMoveUp} title="Move up"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 disabled:opacity-25 transition-colors text-sm">↑</button>

          {/* Move down */}
          <button onClick={e => { e.stopPropagation(); onMoveDown(); }} disabled={!canMoveDown} title="Move down"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 disabled:opacity-25 transition-colors text-sm">↓</button>

          {/* Drag handle */}
          <div {...attributes} {...listeners} title="Drag to reorder"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-grab active:cursor-grabbing transition-colors">
            <div className="grid grid-cols-2 gap-[3px]">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-[3px] h-[3px] rounded-full bg-current" />)}
            </div>
          </div>

          <div className="w-px h-3.5 bg-gray-200 mx-0.5" />

          {/* Duplicate */}
          <button onClick={e => { e.stopPropagation(); onDuplicate(); }} title="Duplicate"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
          </button>

          {/* AI edit */}
          <button onClick={e => { e.stopPropagation(); onOpenAI(); }} title="Edit with AI"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors text-base font-bold">✦</button>

          <div className="w-px h-3.5 bg-gray-200 mx-0.5" />

          {/* Delete */}
          <button onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-base leading-none">×</button>
        </div>

        <SectionRenderer section={section} />
      </div>
    </InlineEditContext.Provider>
  );
}

// ─── Initial pages ────────────────────────────────────────────────────────────

const INITIAL_PAGES: Page[] = [
  {
    id: "home",
    name: "Home",
    sections: [
      { id: "1", type: "navbar",       props: LIBRARY[0].defaults },
      { id: "2", type: "hero",         props: LIBRARY[1].defaults },
      { id: "3", type: "products",     props: LIBRARY[2].defaults },
      { id: "4", type: "testimonials", props: LIBRARY[4].defaults },
      { id: "5", type: "footer",       props: LIBRARY[7].defaults },
    ],
  },
];

function getStartingPages(): Page[] {
  try {
    const stored = localStorage.getItem("builder_generated");
    if (stored) {
      localStorage.removeItem("builder_generated");
      const pages = JSON.parse(stored);
      if (Array.isArray(pages) && pages.length > 0) return pages;
    }
  } catch {}
  return INITIAL_PAGES;
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const [history, dispatch] = useReducer(
    historyReducer,
    undefined,
    () => ({ past: [], present: getStartingPages(), future: [] })
  );
  const pages = history.present;

  const [activePageId, setActivePageId] = useState<string>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [leftTab, setLeftTab] = useState<"pages" | "sections" | "brand">("sections");
  const [rightTab, setRightTab] = useState<"properties" | "chat">("properties");
  const [search, setSearch] = useState("");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [draggedType, setDraggedType] = useState<SectionType | null>(null);
  const [saved, setSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Canvas viewport
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(40);
  const [panY, setPanY] = useState(60);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const isPanningRef = useRef(false);
  const didPanRef = useRef(false);
  // Stable refs so event handlers in useEffect don't go stale
  const zoomRef = useRef(zoom);
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);
  const spaceHeldRef = useRef(spaceHeld);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panXRef.current = panX; }, [panX]);
  useEffect(() => { panYRef.current = panY; }, [panY]);
  useEffect(() => { spaceHeldRef.current = spaceHeld; }, [spaceHeld]);

  // Theme
  const [theme, setTheme] = useState<GlobalTheme>(DEFAULT_THEME);

  // AI chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activePage = pages.find(p => p.id === activePageId) ?? pages[0];
  const sections = activePage?.sections ?? [];
  const selectedSection = sections.find(s => s.id === selectedId) ?? null;
  const schema = selectedSection ? SCHEMAS[selectedSection.type] : [];
  const filteredLibrary = LIBRARY.filter(l => l.label.toLowerCase().includes(search.toLowerCase()));

  const setPages = useCallback((p: Page[]) => dispatch({ type: "SET", pages: p }), []);

  const setSections = useCallback((s: Section[]) => {
    setPages(pages.map(p => p.id === activePageId ? { ...p, sections: s } : p));
  }, [pages, activePageId, setPages]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // ── Page operations ──

  const addPage = () => {
    const id = Date.now().toString();
    setPages([...pages, { id, name: `Page ${pages.length + 1}`, sections: [] }]);
    setActivePageId(id);
    setSelectedId(null);
  };

  const deletePage = (id: string) => {
    if (pages.length === 1) return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (id === activePageId) { setActivePageId(newPages[0].id); setSelectedId(null); }
  };

  const startRename = (page: Page) => { setEditingPageId(page.id); setRenameValue(page.name); };
  const commitRename = () => {
    if (!editingPageId) return;
    setPages(pages.map(p => p.id === editingPageId ? { ...p, name: renameValue.trim() || p.name } : p));
    setEditingPageId(null);
  };
  const switchPage = (id: string) => { setActivePageId(id); setSelectedId(null); };

  // ── Keyboard shortcuts ──

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); dispatch({ type: e.shiftKey ? "REDO" : "UNDO" }); }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); dispatch({ type: "REDO" }); }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (!selectedId) return;
        const section = sections.find(s => s.id === selectedId);
        if (!section) return;
        const clone = { ...section, id: Date.now().toString(), props: { ...section.props } };
        const idx = sections.findIndex(s => s.id === selectedId);
        setSections([...sections.slice(0, idx + 1), clone, ...sections.slice(idx + 1)]);
        setSelectedId(clone.id);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setSections(sections.filter(s => s.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, sections, setSections]);

  // ── DnD handlers ──

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    if (id.startsWith("lib-")) setDraggedType(id.replace("lib-", "") as SectionType);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedType(null);
    const activeId = active.id as string;

    if (activeId.startsWith("lib-")) {
      const type = activeId.replace("lib-", "") as SectionType;
      const lib = LIBRARY.find(l => l.type === type)!;
      const newSection: Section = { id: Date.now().toString(), type, props: { ...lib.defaults } };
      const overId = over?.id as string | undefined;
      const overIndex = overId ? sections.findIndex(s => s.id === overId) : -1;
      setSections(
        overIndex >= 0
          ? [...sections.slice(0, overIndex), newSection, ...sections.slice(overIndex)]
          : [...sections, newSection]
      );
      setSelectedId(newSection.id);
    } else if (over && active.id !== over.id) {
      const from = sections.findIndex(s => s.id === activeId);
      const to   = sections.findIndex(s => s.id === over.id as string);
      if (from !== -1 && to !== -1) setSections(arrayMove(sections, from, to));
    }
  };

  // ── Section operations ──

  const addSection = (type: SectionType) => {
    const lib = LIBRARY.find(l => l.type === type)!;
    const newSection: Section = { id: Date.now().toString(), type, props: { ...lib.defaults } };
    setSections([...sections, newSection]);
    setSelectedId(newSection.id);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    const clone = { ...section, id: Date.now().toString(), props: { ...section.props } };
    const idx = sections.findIndex(s => s.id === id);
    setSections([...sections.slice(0, idx + 1), clone, ...sections.slice(idx + 1)]);
    setSelectedId(clone.id);
  };

  const updateProp = (id: string, key: string, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, props: { ...s.props, [key]: value } } : s));
  };

  const moveSection = (id: string, dir: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    if (dir === "up" && idx > 0) setSections(arrayMove(sections, idx, idx - 1));
    if (dir === "down" && idx < sections.length - 1) setSections(arrayMove(sections, idx, idx + 1));
  };

  const updateSectionStyle = (id: string, patch: { bg?: string }) => {
    setSections(sections.map(s => s.id === id ? { ...s, style: { ...s.style, ...patch } } : s));
  };

  const handleImageUpload = (file: File, id: string, key: string) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProp(id, key, base64String);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to process image");
    }
  };

  // ── Canvas helpers ──

  const fitToScreen = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pageW = mobile ? 390 : 900;
    const newZoom = Math.min(1, (canvas.clientWidth - 80) / pageW);
    setZoom(newZoom);
    setPanX((canvas.clientWidth - pageW * newZoom) / 2);
    setPanY(60);
  }, [mobile]);

  const resetZoom = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pageW = mobile ? 390 : 900;
    setZoom(1);
    setPanX((canvas.clientWidth - pageW) / 2);
    setPanY(60);
  }, [mobile]);

  // Center page on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pageW = mobile ? 390 : 900;
    setPanX((canvas.clientWidth - pageW) / 2);
    setPanY(60);
  }, []); // eslint-disable-line

  // Non-passive wheel (zoom-to-cursor + pan)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normalize deltaMode: 0=pixels, 1=lines (~20px), 2=page
      const lineSize = 20;
      const norm = (d: number) => e.deltaMode === 1 ? d * lineSize : e.deltaMode === 2 ? d * 400 : d;
      if (e.ctrlKey || e.metaKey) {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const factor = Math.pow(1.1, -norm(e.deltaY) / 100);
        const prevZoom = zoomRef.current;
        const newZoom = Math.min(3, Math.max(0.15, prevZoom * factor));
        setZoom(newZoom);
        setPanX(cx - (cx - panXRef.current) * (newZoom / prevZoom));
        setPanY(cy - (cy - panYRef.current) * (newZoom / prevZoom));
      } else {
        setPanX(px => px - norm(e.deltaX));
        setPanY(py => py - norm(e.deltaY));
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  // Space key for pan cursor
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSpaceHeld(true);
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        if (canvasRef.current && !isPanningRef.current) canvasRef.current.style.cursor = "";
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  // Ctrl+0 → reset zoom
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "0") { e.preventDefault(); resetZoom(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resetZoom]);

  // Pointer handlers for drag pan (background), space+drag, middle-mouse
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInteractive = !!target.closest('button, input, textarea, a, select');
    const inPageCard = !!target.closest('[data-page-card]');
    const shouldPan = spaceHeldRef.current || e.button === 1 || (e.button === 0 && !isInteractive && !inPageCard);
    if (shouldPan) {
      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);
      panStartRef.current = { x: e.clientX, y: e.clientY, px: panXRef.current, py: panYRef.current };
      isPanningRef.current = true;
      didPanRef.current = false;
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningRef.current || !panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didPanRef.current = true;
    setPanX(panStartRef.current.px + dx);
    setPanY(panStartRef.current.py + dy);
  };

  const handlePointerUp = () => {
    isPanningRef.current = false;
    panStartRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = spaceHeldRef.current ? "grab" : "";
  };

  const applyTemplate = (t: TemplateType) => {
    const freshPages = t.pages.map(page => ({
      ...page,
      id: `page-${Math.random().toString(36).slice(2)}`,
      sections: page.sections.map(s => ({ ...s, id: `s-${Math.random().toString(36).slice(2)}` })),
    }));
    setTheme(t.theme);
    setPages(freshPages);
    setActivePageId(freshPages[0].id);
    setSelectedId(null);
    setShowTemplates(false);
  };

  const handleSave = async (isPublish = false) => {
    try {
      setSaved(true);
      const res = await fetch("/api/builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages, theme, isPublish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (isPublish && data.shopId) {
        window.open(`/store/${data.shopId}`, "_blank");
      } else {
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setSaved(false);
      alert("Failed to save layout");
    }
  };

  const handlePublish = () => handleSave(true);

  // ── AI chat (full-page) ──

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput.trim() };
    setChatMessages(msgs => [...msgs, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content, pages, mode: "page" }),
      });
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
        setChatMessages(msgs => [...msgs, {
          id: (Date.now() + 1).toString(), role: "assistant",
          content: data.summary || `Done! Rewrote your store based on: "${userMsg.content}"`,
        }]);
      } else {
        setChatMessages(msgs => [...msgs, { id: (Date.now() + 1).toString(), role: "assistant", content: "Couldn't parse the response. Try rephrasing." }]);
      }
    } catch {
      setChatMessages(msgs => [...msgs, { id: (Date.now() + 1).toString(), role: "assistant", content: "Network error. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className="flex flex-col h-screen bg-white overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* ── TOP BAR ── */}
        <header className="flex items-center justify-between px-5 h-12 bg-white border-b border-gray-200 shrink-0 z-30">
          <div className="flex items-center gap-3 w-52 shrink-0">
            <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-[10px] font-black text-white">S</div>
            <span className="text-sm font-bold text-gray-900 tracking-tight">StoreGenie</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-medium">Builder</span>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setShowTemplates(true)}
              className="h-7 px-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
              ⊞ Templates
            </button>
            <div className="w-px h-4 bg-gray-200 mx-0.5" />
            <button onClick={() => dispatch({ type: "UNDO" })} disabled={!history.past.length} title="Undo (Ctrl+Z)"
              className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors text-sm">↩</button>
            <button onClick={() => dispatch({ type: "REDO" })} disabled={!history.future.length} title="Redo (Ctrl+Y)"
              className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors text-sm">↪</button>
            <div className="w-px h-4 bg-gray-200 mx-1.5" />
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setMobile(false)}
                className={`h-6 px-2.5 rounded-md text-[11px] font-semibold transition-colors ${!mobile ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Desktop</button>
              <button onClick={() => setMobile(true)}
                className={`h-6 px-2.5 rounded-md text-[11px] font-semibold transition-colors ${mobile ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Mobile</button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-52 justify-end shrink-0">
            <button onClick={() => {
              localStorage.setItem("builder_preview_pages", JSON.stringify(pages));
              localStorage.setItem("builder_preview_theme", JSON.stringify(theme));
              window.open("/store/preview", "_blank");
            }} className="h-7 px-3 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Preview</button>
            <button onClick={() => handleSave(false)}
              className={`h-7 px-3 text-[11px] font-semibold rounded-md transition-colors ${saved ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {saved ? "Saved ✓" : "Save"}
            </button>
            <button onClick={handlePublish} className="h-7 px-3 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">Publish</button>
          </div>
        </header>

        {/* ── DndContext wraps both panels ── */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-1 overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <aside className="w-52 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
              <div className="flex border-b border-gray-200 shrink-0">
                {(["sections", "pages", "brand"] as const).map(tab => (
                  <button key={tab} onClick={() => setLeftTab(tab)}
                    className={`flex-1 py-2 text-[10px] font-semibold capitalize transition-colors ${leftTab === tab ? "text-gray-900 border-b-2 border-blue-500 bg-white" : "text-gray-400 hover:text-gray-600"}`}>
                    {tab === "brand" ? <><span className="text-sm">✦</span> Brand</> : tab}
                  </button>
                ))}
              </div>

              {/* ── Pages tab ── */}
              {leftTab === "pages" && (
                <div className="flex-1 overflow-y-auto flex flex-col">
                  <div className="p-2 space-y-1 flex-1">
                    {pages.map(page => (
                      <div key={page.id} onClick={() => switchPage(page.id)}
                        className={`group flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-colors
                          ${activePageId === page.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-100 border border-transparent"}`}>
                        <div className={`w-5 h-6 rounded border flex-shrink-0 ${activePageId === page.id ? "border-blue-300 bg-blue-100" : "border-gray-300 bg-white"}`}>
                          <div className="mt-1 mx-0.5 space-y-0.5">
                            <div className="h-0.5 bg-gray-300 rounded-sm" />
                            <div className="h-0.5 bg-gray-200 rounded-sm" />
                            <div className="h-0.5 bg-gray-200 rounded-sm w-2/3" />
                          </div>
                        </div>
                        {editingPageId === page.id ? (
                          <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingPageId(null); e.stopPropagation(); }}
                            onClick={e => e.stopPropagation()}
                            className="flex-1 min-w-0 text-[11px] font-medium bg-white border border-blue-400 rounded px-1 py-0.5 outline-none" />
                        ) : (
                          <span onDoubleClick={e => { e.stopPropagation(); startRename(page); }}
                            className={`flex-1 min-w-0 text-[11px] font-medium truncate ${activePageId === page.id ? "text-blue-700" : "text-gray-700"}`}>
                            {page.name}
                          </span>
                        )}
                        <button onClick={e => { e.stopPropagation(); deletePage(page.id); }} disabled={pages.length === 1}
                          className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 shrink-0 text-xs">×</button>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <button onClick={addPage}
                      className="w-full flex items-center justify-center gap-1.5 h-8 rounded-xl border border-dashed border-gray-300 text-[11px] font-semibold text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/40 transition-all">
                      <span className="text-base leading-none">+</span> Add page
                    </button>
                  </div>
                </div>
              )}

              {/* ── Sections tab ── */}
              {leftTab === "sections" && (
                <>
                  <div className="px-3 py-3 border-b border-gray-200 shrink-0">
                    <div className="relative">
                      <input type="text" placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full h-7 pl-7 pr-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors" />
                      <svg className="absolute left-2 top-1.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                    {filteredLibrary.map(lib => (
                      <LibraryItem key={lib.type} lib={lib} onAdd={addSection} />
                    ))}
                  </div>
                </>
              )}

              {/* ── Brand tab ── */}
              {leftTab === "brand" && (
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Primary color */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={theme.primaryColor}
                        onChange={e => setTheme(t => ({ ...t, primaryColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                      <input type="text" value={theme.primaryColor}
                        onChange={e => setTheme(t => ({ ...t, primaryColor: e.target.value }))}
                        className="flex-1 h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800 outline-none focus:border-blue-400" />
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Font</label>
                    <select value={theme.font} onChange={e => setTheme(t => ({ ...t, font: e.target.value }))}
                      className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-400">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>

                  {/* Border radius */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Button Style</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {RADII.map(r => (
                        <button key={r.value} onClick={() => setTheme(t => ({ ...t, radius: r.value }))}
                          className={`h-7 text-[10px] font-semibold rounded-lg border transition-colors ${theme.radius === r.value ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-500 hover:border-blue-200 bg-white"}`}>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preview</label>
                    <div className="rounded-xl border border-gray-100 p-3 space-y-2 bg-white" style={{ fontFamily: theme.font }}>
                      <p className="text-xs font-bold text-gray-900">Heading Sample</p>
                      <p className="text-[10px] text-gray-500">Body text looks like this in your store.</p>
                      <button style={{ background: theme.primaryColor, borderRadius: theme.radius }}
                        className="h-7 px-3 text-white text-[11px] font-semibold">
                        Button
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Layers (always visible on sections tab) ── */}
              {leftTab === "sections" && sections.length > 0 && (
                <div className="border-t border-gray-200 shrink-0">
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Layers</p>
                    <div className="space-y-0.5 max-h-36 overflow-y-auto">
                      {sections.map((s, i) => (
                        <div key={s.id} onClick={() => setSelectedId(s.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-[11px]
                            ${selectedId === s.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
                          <span className="text-gray-400 font-mono text-[9px] w-3">{i + 1}</span>
                          <span className="capitalize flex-1">{s.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* ── CANVAS ── */}
            {(() => {
              const dotSpacing = Math.max(20 * zoom, 6);
              const dotOffsetX = ((panX % dotSpacing) + dotSpacing) % dotSpacing;
              const dotOffsetY = ((panY % dotSpacing) + dotSpacing) % dotSpacing;
              const pageW = mobile ? 390 : 900;
              return (
                <div
                  ref={canvasRef}
                  className="flex-1 min-h-0 overflow-hidden relative"
                  style={{
                    background: `radial-gradient(circle, #a0aab4 1px, transparent 1px) ${dotOffsetX}px ${dotOffsetY}px / ${dotSpacing}px ${dotSpacing}px, #E8EAED`,
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onClick={() => { if (!didPanRef.current) setSelectedId(null); didPanRef.current = false; }}
                >
                  {/* Transformed page */}
                  <div style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: "0 0", position: "absolute", top: 0, left: 0 }}>

                    {/* Page tab strip */}
                    <div className="flex items-center gap-1 mb-1.5" style={{ width: pageW }}>
                      {pages.map(page => (
                        <button key={page.id} onClick={e => { e.stopPropagation(); switchPage(page.id); }}
                          className={`h-7 px-3 text-[11px] font-semibold rounded-t-lg transition-colors border border-b-0
                            ${page.id === activePageId ? "bg-white text-gray-900 border-gray-200" : "bg-gray-300/60 text-gray-500 hover:bg-gray-200 border-transparent"}`}>
                          {page.name}
                        </button>
                      ))}
                      <button onClick={e => { e.stopPropagation(); addPage(); }}
                        className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-base" title="Add page">+</button>
                    </div>

                    {/* Page */}
                    <div data-page-card onClick={e => e.stopPropagation()} className="bg-white"
                      style={{ width: pageW, minHeight: 1000, borderRadius: 8, overflow: "clip", fontFamily: theme.font, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
                      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {sections.length === 0
                          ? <CanvasEmptyDrop />
                          : sections.map((section, idx) => (
                            <SortableSection key={section.id} section={section} selected={selectedId === section.id}
                              onClick={() => setSelectedId(section.id)}
                              onDelete={() => deleteSection(section.id)}
                              onDuplicate={() => duplicateSection(section.id)}
                              onPropChange={(key, value) => updateProp(section.id, key, value)}
                              onMoveUp={() => moveSection(section.id, "up")}
                              onMoveDown={() => moveSection(section.id, "down")}
                              canMoveUp={idx > 0}
                              canMoveDown={idx < sections.length - 1}
                              onOpenAI={() => { setSelectedId(section.id); setRightTab("chat"); }}
                            />
                          ))
                        }
                      </SortableContext>
                    </div>

                  </div>

                  {/* Floating zoom controls */}
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-0.5 bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg px-1.5 py-1 select-none">
                    <button onClick={() => { const f = 1 / 1.25; const c = canvasRef.current; if (c) { const cx = c.clientWidth/2; const cy = c.clientHeight/2; const nz = Math.max(0.15, zoomRef.current * f); setZoom(nz); setPanX(cx - (cx - panXRef.current) * (nz / zoomRef.current)); setPanY(cy - (cy - panYRef.current) * (nz / zoomRef.current)); } }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-base transition-colors">−</button>
                    <button onClick={resetZoom} title="Reset zoom (Ctrl+0)"
                      className="h-6 px-2 text-[11px] font-mono font-semibold text-gray-700 hover:bg-gray-100 rounded-lg min-w-[44px] text-center transition-colors">
                      {Math.round(zoom * 100)}%
                    </button>
                    <button onClick={() => { const f = 1.25; const c = canvasRef.current; if (c) { const cx = c.clientWidth/2; const cy = c.clientHeight/2; const nz = Math.min(3, zoomRef.current * f); setZoom(nz); setPanX(cx - (cx - panXRef.current) * (nz / zoomRef.current)); setPanY(cy - (cy - panYRef.current) * (nz / zoomRef.current)); } }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-base transition-colors">+</button>
                    <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
                    <button onClick={fitToScreen} title="Fit to screen"
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors text-xs">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    </button>
                  </div>

                </div>
              );
            })()}

            {/* ── RIGHT PANEL ── */}
            <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 shrink-0">
                <button onClick={() => setRightTab("properties")}
                  className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors ${rightTab === "properties" ? "text-gray-900 border-b-2 border-blue-500 bg-white" : "text-gray-400 hover:text-gray-600"}`}>
                  Properties
                </button>
                <button onClick={() => setRightTab("chat")}
                  className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors ${rightTab === "chat" ? "text-gray-900 border-b-2 border-blue-500 bg-white" : "text-gray-400 hover:text-gray-600"}`}>
                  <span className="text-sm">✦</span> AI Chat
                </button>
              </div>

              {/* ── Properties tab ── */}
              {rightTab === "properties" && (
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {!selectedSection ? (
                    <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
                      <div className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center mb-3 text-gray-300 text-sm">↑</div>
                      <p className="text-xs font-medium text-gray-400">Select a section to edit its content</p>
                      <p className="text-[10px] text-gray-300 mt-1">Double-click text on canvas to edit inline</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Content</p>
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">{selectedSection.type}</span>
                      </div>

                      {schema.map(field => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{field.label}</label>
                          {field.type === "select" ? (
                            <select value={selectedSection.props[field.key] ?? ""} onChange={e => updateProp(selectedSection.id, field.key, e.target.value)}
                              className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-400 transition-colors">
                              {field.options!.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : field.type === "textarea" ? (
                            <textarea rows={3} value={selectedSection.props[field.key] ?? ""} onChange={e => updateProp(selectedSection.id, field.key, e.target.value)}
                              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed" />
                          ) : field.type === "image" ? (
                            <div className="flex flex-col gap-2">
                              {selectedSection.props[field.key] && (
                                <img src={selectedSection.props[field.key]} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                              )}
                              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], selectedSection.id, field.key)}
                                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                          ) : (
                            <input type="text" value={selectedSection.props[field.key] ?? ""} onChange={e => updateProp(selectedSection.id, field.key, e.target.value)}
                              className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-400 transition-colors" />
                          )}
                        </div>
                      ))}

                      {/* Section style controls */}
                      <div className="pt-3 border-t border-gray-100 space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Section Style</p>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">Background</label>
                          <div className="flex items-center gap-2">
                            <input type="color"
                              value={selectedSection.style?.bg || "#ffffff"}
                              onChange={e => updateSectionStyle(selectedSection.id, { bg: e.target.value })}
                              className="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shrink-0" />
                            <input type="text"
                              value={selectedSection.style?.bg || ""}
                              onChange={e => updateSectionStyle(selectedSection.id, { bg: e.target.value || undefined })}
                              placeholder="#ffffff or transparent"
                              className="flex-1 h-7 px-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono text-gray-700 outline-none focus:border-blue-400 min-w-0" />
                            {selectedSection.style?.bg && (
                              <button onClick={() => updateSectionStyle(selectedSection.id, { bg: undefined })}
                                className="w-6 h-6 text-gray-400 hover:text-red-400 text-sm flex items-center justify-center shrink-0">×</button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex gap-2">
                        <button onClick={() => duplicateSection(selectedSection.id)}
                          className="flex-1 h-7 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Duplicate</button>
                        <button onClick={() => deleteSection(selectedSection.id)}
                          className="flex-1 h-7 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                      </div>
                    </div>
                  )}

                  <div className="p-3 border-t border-gray-100 mt-auto">
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shortcuts</p>
                      {[["Ctrl+Z", "Undo"], ["Ctrl+D", "Duplicate"], ["Del", "Delete section"], ["Dbl-click", "Edit text"]].map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500">{label}</span>
                          <kbd className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-500">{key}</kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── AI Chat tab ── */}
              {rightTab === "chat" && (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Messages */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                    {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-40 text-center px-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 text-blue-600 text-2xl">✦</div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">AI Page Rewriter</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed">Describe a style or theme and AI will rewrite your entire storefront to match.</p>
                        <div className="mt-3 space-y-1.5 w-full">
                          {["luxury skincare brand", "streetwear clothing", "organic food store"].map(ex => (
                            <button key={ex} onClick={() => setChatInput(ex)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg border border-gray-200 text-[10px] text-gray-500 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                              "{ex}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed
                          ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2.5 flex items-center gap-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 150}ms` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-gray-100 shrink-0">
                    <div className="flex gap-2">
                      <input
                        value={chatInput} onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleChat()}
                        placeholder="e.g. make it look luxury..."
                        disabled={chatLoading}
                        className="flex-1 h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors" />
                      <button onClick={handleChat} disabled={!chatInput.trim() || chatLoading}
                        className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-lg disabled:opacity-30 hover:bg-blue-700 transition-colors text-sm shrink-0">
                        ↑
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1.5 text-center">Rewrites the entire page to match your prompt</p>
                  </div>
                </div>
              )}
            </aside>

          </div>

          {/* Drag overlay */}
          <DragOverlay dropAnimation={null}>
            {draggedType && (
              <div className="flex items-center gap-2 bg-white border border-blue-400 rounded-xl px-3 py-2 shadow-xl text-xs font-semibold text-gray-800 pointer-events-none select-none" style={{ width: 140 }}>
                <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-[9px] font-bold shrink-0">✦</div>
                {LIBRARY.find(l => l.type === draggedType)?.label}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      {showTemplates && (
        <TemplatesModal onClose={() => setShowTemplates(false)} onApply={applyTemplate} />
      )}
    </ThemeContext.Provider>
  );
}
