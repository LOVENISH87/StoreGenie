"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const gemini_1 = require("../lib/gemini");
const replicate_1 = require("../lib/replicate");
const router = (0, express_1.Router)();
// All AI routes are protected
router.use(requireAuth_1.requireAuth);
router.post('/generate-site', async (req, res) => {
    try {
        const { ownerInput } = req.body;
        if (!ownerInput) {
            return res.status(400).json({ error: 'ownerInput is required' });
        }
        const result = await (0, gemini_1.generateSite)(ownerInput);
        res.json(result);
    }
    catch (error) {
        console.error('Gemini generate-site error:', error);
        res.status(500).json({ error: 'Failed to generate site' });
    }
});
router.post('/generate-product', async (req, res) => {
    try {
        const { productName } = req.body;
        if (!productName) {
            return res.status(400).json({ error: 'productName is required' });
        }
        const result = await (0, gemini_1.generateProduct)(productName);
        res.json(result);
    }
    catch (error) {
        console.error('Gemini generate-product error:', error);
        res.status(500).json({ error: 'Failed to generate product details' });
    }
});
router.post('/redesign', async (req, res) => {
    try {
        const { currentLayout, prompt } = req.body;
        if (!currentLayout || !prompt) {
            return res.status(400).json({ error: 'currentLayout and prompt are required' });
        }
        const result = await (0, gemini_1.redesignLayout)(currentLayout, prompt);
        res.json(result);
    }
    catch (error) {
        console.error('Gemini redesign error:', error);
        res.status(500).json({ error: 'Failed to redesign layout' });
    }
});
router.post('/generate-image', async (req, res) => {
    try {
        const { productName } = req.body;
        if (!productName) {
            return res.status(400).json({ error: 'productName is required' });
        }
        const imageUrl = await (0, replicate_1.generateProductImage)(productName);
        res.json({ imageUrl });
    }
    catch (error) {
        console.error('Replicate generate-image error:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});
exports.default = router;
