import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateSite(ownerInput: string) {
  const prompt = `
    A shop owner described their shop as: "${ownerInput}"

    Return ONLY a valid JSON object with these exact fields:
    {
      "shopName": "string",
      "tagline": "string",
      "brandColor": "string" (hex color matching the business type),
      "emoji": "string" (one emoji representing the shop),
      "description": "string" (2 sentences about the shop),
      "blocks": ["array of strings from: ['hero', 'product-grid', 'about', 'contact', 'footer']"],
      "suggestedProducts": [{"name": "string", "price": "string", "emoji": "string"}]
    }

    Rules:
    - brandColor must match the shop type (food = warm, fashion = elegant, etc.)
    - suggestedProducts should have 3-5 realistic products
    - No explanation, no markdown, just raw JSON
  `;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

export async function generateProduct(productName: string) {
  const prompt = `
    Product name: "${productName}"
    Return ONLY JSON: { "description": "string", "suggestedPrice": "string", "emoji": "string" }
    No explanation. Just JSON.
  `;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

export async function redesignLayout(currentLayout: any, userPrompt: string) {
  const prompt = `
    Current layout JSON: ${JSON.stringify(currentLayout)}
    Owner request: "${userPrompt}"
    Return ONLY the updated layout JSON. No explanation.
  `;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}
