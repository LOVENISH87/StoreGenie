import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { generateSite, generateProduct, redesignLayout } from '../lib/gemini';
import { generateProductImage } from '../lib/replicate';

const router = Router();

// All AI routes are protected
router.use(requireAuth);

router.post('/generate-site', async (req: AuthRequest, res: Response) => {
  try {
    const { ownerInput } = req.body;
    if (!ownerInput) {
      return res.status(400).json({ error: 'ownerInput is required' });
    }

    const result = await generateSite(ownerInput);
    res.json(result);
  } catch (error: any) {
    console.error('Gemini generate-site error:', error);
    res.status(500).json({ error: 'Failed to generate site' });
  }
});

router.post('/generate-product', async (req: AuthRequest, res: Response) => {
  try {
    const { productName } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const result = await generateProduct(productName);
    res.json(result);
  } catch (error: any) {
    console.error('Gemini generate-product error:', error);
    res.status(500).json({ error: 'Failed to generate product details' });
  }
});

router.post('/redesign', async (req: AuthRequest, res: Response) => {
  try {
    const { currentLayout, prompt } = req.body;
    if (!currentLayout || !prompt) {
      return res.status(400).json({ error: 'currentLayout and prompt are required' });
    }

    const result = await redesignLayout(currentLayout, prompt);
    res.json(result);
  } catch (error: any) {
    console.error('Gemini redesign error:', error);
    res.status(500).json({ error: 'Failed to redesign layout' });
  }
});

router.post('/generate-image', async (req: AuthRequest, res: Response) => {
  try {
    const { productName } = req.body;
    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const imageUrl = await generateProductImage(productName);
    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Replicate generate-image error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router;
