import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

const router = Router();

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, location, tagline } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    let slug = generateSlug(name);
    
    // Ensure slug is unique
    let isUnique = false;
    let counter = 0;
    while (!isUnique) {
      const currentSlug = counter === 0 ? slug : `${slug}-${counter}`;
      const { data } = await supabase.from('shops').select('id').eq('slug', currentSlug).single();
      if (!data) {
        slug = currentSlug;
        isUnique = true;
      } else {
        counter++;
      }
    }

    const { data, error } = await supabase
      .from('shops')
      .insert([{ 
        user_id: req.user.userId, 
        name, 
        slug, 
        description, 
        location,
        tagline 
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', req.user.userId)
      .single();

    if (error) {
       if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Shop not found' });
       }
       throw error;
    }
    
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Verify ownership
    const { data: shop } = await supabase.from('shops').select('user_id').eq('id', id).single();
    if (!shop || shop.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/publish', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const { data: shop } = await supabase.from('shops').select('user_id').eq('id', id).single();
    if (!shop || shop.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase
      .from('shops')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/unpublish', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const { data: shop } = await supabase.from('shops').select('user_id').eq('id', id).single();
    if (!shop || shop.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase
      .from('shops')
      .update({ is_published: false })
      .eq('id', id)
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
