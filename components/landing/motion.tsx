"use client";

import React, { useEffect, useRef, useState, HTMLAttributes } from 'react';

export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: "-40px 0px", ...options });
    
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  
  return [ref, inView] as const;
}

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
}

// Wrapper that adds a reveal-on-scroll fade-up to its children.
export function Reveal({ children, delay = 0, className = "", ...rest }: RevealProps) {
  const [ref, inView] = useInView();
  const cls = `reveal ${inView ? "in" : ""} ${delay ? `reveal-delay-${delay}` : ""} ${className}`.trim();
  return <div ref={ref} className={cls} {...rest}>{children}</div>;
}

// Magnetic button: pulls the inner content slightly toward the cursor on hover.
export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode, strength?: number, className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <span ref={ref} className={`magnet ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}

// Typewriter that cycles through phrases.
export function useTypewriter(phrases: string[], { typeSpeed = 50, deleteSpeed = 30, pauseAfter = 1600 } = {}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const cur = phrases[idx % phrases.length];
    let t: NodeJS.Timeout;
    if (phase === "typing") {
      if (text.length < cur.length) {
        t = setTimeout(() => setText(cur.slice(0, text.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("deleting"), pauseAfter);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      } else {
        setIdx(i => i + 1); setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, typeSpeed, deleteSpeed, pauseAfter, phrases]);

  return text;
}

// Track horizontal scroll progress of a container (returns 0..1).
export function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => {
      const max = el.scrollWidth - el.clientWidth;
      setP(max > 0 ? el.scrollLeft / max : 0);
    };
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    return () => el.removeEventListener("scroll", upd);
  }, [ref]);
  return p;
}

// Mouse-tilt a card slightly based on cursor position.
export function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateZ(0)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0)"; };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}
