import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, sectionType, props, pages, mode } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  let systemPrompt: string;

  if (mode === "page") {
    systemPrompt = `You are an AI ecommerce website builder.
The user wants to restyle their entire storefront. Current page structure:
${JSON.stringify(pages, null, 2)}

User instruction: "${prompt}"

Rewrite ALL text content inside every section's props (heading, subtext, body, logo, cta, ctaSecondary, badge, tagline, links, etc.) to match the instruction's tone, style, and theme.
Keep the EXACT same JSON structure — same pages array, same section types, same prop keys. Only update the string values.
Return ONLY a raw JSON object like:
{ "pages": [...updatedPages], "summary": "one sentence describing what changed" }
No markdown fences, no explanation, just raw JSON.`;
  } else {
    systemPrompt = `You are editing a "${sectionType}" section of an ecommerce website builder.
Current content: ${JSON.stringify(props)}
User instruction: "${prompt}"

Return ONLY a valid JSON object with the same keys as the current content, updated based on the instruction. No explanation, no markdown fences, just raw JSON.`;
  }

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GEMINI_API_KEY! },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  try {
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? "{}");

    if (mode === "page") {
      return NextResponse.json({ pages: parsed.pages, summary: parsed.summary });
    }
    return NextResponse.json({ props: parsed });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
