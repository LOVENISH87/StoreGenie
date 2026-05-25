import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

const router = Router();

// Helper to check if user owns the shop
const checkShopOwnership = async (shopId: string, userId: string) => {
  const { data } = await supabase.from('shops').select('user_id').eq('id', shopId).single();
  return data && data.user_id === userId;
};

router.get('/:shopId', async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { data, error } = await supabase
      .from('layouts')
      .select('page_data, updated_at')
      .eq('shop_id', shopId)
      .single();

    if (error) {
       if (error.code === 'PGRST116') {
         return res.json(null); // No layout yet
       }
       throw error;
    }
    
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:shopId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const shopId = req.params.shopId as string;
    const { page_data } = req.body;

    if (!page_data) {
      return res.status(400).json({ error: 'page_data is required' });
    }

    if (!(await checkShopOwnership(shopId, req.user.userId))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Upsert layout
    const { data, error } = await supabase
      .from('layouts')
      .upsert({ 
         shop_id: shopId, 
         page_data, 
         updated_at: new Date().toISOString() 
      }, { onConflict: 'shop_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
