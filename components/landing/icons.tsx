import React from 'react';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number | string;
  stroke?: number | string;
}

const Icon: React.FC<IconProps> = ({ children, size = 16, stroke = 1.6, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

export const Sparkle: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></Icon>;
export const Wand: React.FC<IconProps> = (p) => <Icon {...p}><path d="M15 4V2M15 14v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4" /><path d="M14 7L4 17l3 3L17 10z" /></Icon>;
export const Plus: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
export const Layout: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></Icon>;
export const Text: React.FC<IconProps> = (p) => <Icon {...p}><path d="M4 6h16M12 6v14M8 20h8"/></Icon>;
export const Box: React.FC<IconProps> = (p) => <Icon {...p}><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></Icon>;
export const Bolt: React.FC<IconProps> = (p) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></Icon>;
export const Play: React.FC<IconProps> = (p) => <Icon {...p}><path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none"/></Icon>;
export const Globe: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></Icon>;
export const Settings: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.9.3l-.1.1A2 2 0 113.1 17l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H1.9a2 2 0 110-4H2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1A2 2 0 116 4.2l.1.1a1.7 1.7 0 001.9.3H8a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></Icon>;
export const Home: React.FC<IconProps> = (p) => <Icon {...p}><path d="M3 11l9-8 9 8M5 9v12h14V9"/></Icon>;
export const File: React.FC<IconProps> = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></Icon>;
export const Layers: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></Icon>;
export const Image: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></Icon>;
export const ChevDown: React.FC<IconProps> = (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
export const ChevRight: React.FC<IconProps> = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
export const Close: React.FC<IconProps> = (p) => <Icon {...p}><path d="M18 6L6 18M6 6l12 12"/></Icon>;
export const Check: React.FC<IconProps> = (p) => <Icon {...p}><path d="M5 12l5 5L20 7"/></Icon>;
export const Share: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></Icon>;
export const Device: React.FC<IconProps> = (p) => <Icon {...p}><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></Icon>;
export const Phone: React.FC<IconProps> = (p) => <Icon {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></Icon>;
export const CMS: React.FC<IconProps> = (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></Icon>;
export const Blocks: React.FC<IconProps> = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Icon>;
export const Undo: React.FC<IconProps> = (p) => <Icon {...p}><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 010 10h-4"/></Icon>;
export const Redo: React.FC<IconProps> = (p) => <Icon {...p}><path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 000 10h4"/></Icon>;
export const Hand: React.FC<IconProps> = (p) => <Icon {...p}><path d="M18 11V6a2 2 0 10-4 0v5M14 10V4a2 2 0 10-4 0v6M10 10.5V6a2 2 0 10-4 0v8M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2a8 8 0 01-8-8v-1l3-3"/></Icon>;
export const Cursor: React.FC<IconProps> = (p) => <Icon {...p}><path d="M3 3l7.5 18 2-7 7-2L3 3z"/></Icon>;
export const Rupee: React.FC<IconProps> = (p) => <Icon {...p}><path d="M6 3h12M6 8h12M9 21l-6-9h4a5 5 0 005-5"/></Icon>;
export const Search: React.FC<IconProps> = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
export const ArrowRight: React.FC<IconProps> = (p) => <Icon {...p}><path d="M5 12h14M12 5l7 7-7 7"/></Icon>;
export const Star: React.FC<IconProps> = (p) => <Icon {...p}><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></Icon>;
