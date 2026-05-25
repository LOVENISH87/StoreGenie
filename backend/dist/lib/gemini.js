"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSite = generateSite;
exports.generateProduct = generateProduct;
exports.redesignLayout = redesignLayout;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function generateSite(ownerInput) {
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
async function generateProduct(productName) {
    const prompt = `
    Product name: "${productName}"
    Return ONLY JSON: { "description": "string", "suggestedPrice": "string", "emoji": "string" }
    No explanation. Just JSON.
  `;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
}
async function redesignLayout(currentLayout, userPrompt) {
    const prompt = `
    Current layout JSON: ${JSON.stringify(currentLayout)}
    Owner request: "${userPrompt}"
    Return ONLY the updated layout JSON. No explanation.
  `;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
}
