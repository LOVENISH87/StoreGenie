"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SectionRenderer, ThemeContext, DEFAULT_THEME, InlineEditContext, GlobalTheme, Page } from "@/components/builder/Blocks";

export default function StorePage() {
  const params = useParams();
  const shopId = params.id as string;
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shop/${shopId}`)
      .then((r) => r.json())
      .then((data) => {
        setShop(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load shop:", err);
        setLoading(false);
      });
  }, [shopId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading store...</div>;
  }

  if (!shop || shop.error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Store not found</div>;
  }

  // Parse builder data from shop
  const builderData = shop.builder_data || {};
  const pages: Page[] = builderData.pages || [];
  const theme: GlobalTheme = builderData.theme || DEFAULT_THEME;

  const homePage = pages.find((p: Page) => p.id === "home") || pages[0];

  if (!homePage) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">This store has not been published yet.</div>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <InlineEditContext.Provider value={{ enabled: false, onEdit: () => {} }}>
        <main className="min-h-screen bg-white">
          {homePage.sections.map((section: any) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </main>
      </InlineEditContext.Provider>
    </ThemeContext.Provider>
  );
}
