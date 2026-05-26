"use client";

import { useState, useEffect } from "react";
import { SectionRenderer, ThemeContext, DEFAULT_THEME, InlineEditContext, GlobalTheme, Page } from "@/components/builder/Blocks";

export default function PreviewPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [theme, setTheme] = useState<GlobalTheme>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const storedPages = localStorage.getItem("builder_preview_pages");
      if (storedPages) {
        setPages(JSON.parse(storedPages));
      }
      const storedTheme = localStorage.getItem("builder_preview_theme");
      if (storedTheme) {
        setTheme(JSON.parse(storedTheme));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (pages.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading preview...</div>;

  const homePage = pages[0];

  return (
    <ThemeContext.Provider value={theme}>
      <InlineEditContext.Provider value={{ enabled: false, onEdit: () => {} }}>
        <main className="min-h-screen bg-white">
          {homePage.sections.map(section => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </main>
      </InlineEditContext.Provider>
    </ThemeContext.Provider>
  );
}
