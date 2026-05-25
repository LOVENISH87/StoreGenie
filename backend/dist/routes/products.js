"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
// Helper to check if user owns the shop
const checkShopOwnership = async (shopId, userId) => {
    const { data } = await supabase_1.supabase.from('shops').select('user_id').eq('id', shopId).single();
    return data && data.user_id === userId;
};
router.get('/:shopId', async (req, res) => {
    try {
        const { shopId } = req.params;
        const { data, error } = await supabase_1.supabase
            .from('products')
            .select('*')
            .eq('shop_id', shopId)
            .order('sort_order', { ascending: true });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { shopId, name, price, emoji, description, image_url } = req.body;
        if (!shopId || !name || !price) {
            return res.status(400).json({ error: 'Shop ID, name, and price are required' });
        }
        if (!(await checkShopOwnership(shopId, req.user.userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { data, error } = await supabase_1.supabase
            .from('products')
            .insert([{ shop_id: shopId, name, price, emoji, description, image_url }])
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data: product } = await supabase_1.supabase.from('products').select('shop_id').eq('id', id).single();
        if (!product || !(await checkShopOwnership(product.shop_id, req.user.userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { data, error } = await supabase_1.supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:id', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: product } = await supabase_1.supabase.from('products').select('shop_id').eq('id', id).single();
        if (!product || !(await checkShopOwnership(product.shop_id, req.user.userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { error } = await supabase_1.supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.patch('/:id/availability', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_available } = req.body;
        const { data: product } = await supabase_1.supabase.from('products').select('shop_id').eq('id', id).single();
        if (!product || !(await checkShopOwnership(product.shop_id, req.user.userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const { data, error } = await supabase_1.supabase
            .from('products')
            .update({ is_available })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
