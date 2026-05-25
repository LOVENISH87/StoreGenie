import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "No API key configured" }, { status: 500 });
  }

  const systemPrompt = `You are generating a complete Indian ecommerce store from a user's one-line description.

User's store idea: "${prompt}"

Return a JSON object with this exact structure:
{
  "shopName": "the shop name",
  "sections": [
    { "type": "navbar", "props": { "logo": "Shop Name", "links": "Home,Products,About,Contact" } },
    { "type": "hero", "props": { "badge": "Badge Text", "heading": "Dramatic\\nHeading Here", "subtext": "One compelling sentence about the shop.", "cta": "Shop Now", "ctaSecondary": "Browse Catalog" } },
    { "type": "products", "props": { "heading": "Our Products", "subtext": "Handpicked selections for you", "columns": "3" } },
    { "type": "features", "props": { "heading": "Why Choose Us", "subtext": "What makes this shop special" } },
    { "type": "about", "props": { "heading": "Our\\nStory", "body": "2-3 sentences about the brand origin and values.", "imagePosition": "left" } },
    { "type": "footer", "props": { "logo": "Shop Name", "tagline": "A short memorable tagline." } }
  ]
}

Rules:
- Generate a real, specific shop name (not generic)
- Match all content precisely to the store type and category
- Use natural Hindi/regional words where they genuinely fit the brand voice
- Hero heading: dramatic, 2-3 words per line, use \\n for line breaks (e.g. "Shahi\\nMasala Wala")
- Badge: short, punchy (e.g. "Est. 1978", "100% Handmade", "Farm to Table")
- About body: authentic brand story, 2-3 sentences
- Return ONLY raw JSON, no markdown fences, no explanation, nothing else`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GEMINI_API_KEY! },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
      }),
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");

    const generated = JSON.parse(match[0]);
    if (!Array.isArray(generated.sections) || generated.sections.length === 0) {
      throw new Error("No sections");
    }

    const pages = [
      {
        id: "home",
        name: "Home",
        sections: generated.sections.map((s: { type: string; props: Record<string, string> }, i: number) => ({
          id: String(Date.now() + i),
          type: s.type,
          props: s.props,
        })),
      },
    ];

    return NextResponse.json({ pages, shopName: generated.shopName });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
