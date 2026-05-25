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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:shopId', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const { page_data } = req.body;
        if (!page_data) {
            return res.status(400).json({ error: 'page_data is required' });
        }
        if (!(await checkShopOwnership(shopId, req.user.userId))) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        // Upsert layout
        const { data, error } = await supabase_1.supabase
            .from('layouts')
            .upsert({
            shop_id: shopId,
            page_data,
            updated_at: new Date().toISOString()
        }, { onConflict: 'shop_id' })
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
