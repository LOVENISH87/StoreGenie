import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { pages, theme, isPublish } = await req.json();
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's first shop
    const { data: shops, error: shopsError } = await supabase
      .from("shops")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (shopsError) {
      return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
    }

    let shopId;
    if (!shops || shops.length === 0) {
      // Create a default shop if none exists
      const { data: newShop, error: createError } = await supabase
        .from("shops")
        .insert({
          user_id: user.id,
          name: "My Store",
          theme: "minimal"
        })
        .select("id")
        .single();

      if (createError || !newShop) {
        return NextResponse.json({ error: "Failed to create shop" }, { status: 500 });
      }
      shopId = newShop.id;
    } else {
      shopId = shops[0].id;
    }

    // Update shop with builder_data
    const { error: updateError } = await supabase
      .from("shops")
      .update({
        builder_data: { pages, theme }
      })
      .eq("id", shopId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to save layout" }, { status: 500 });
    }

    return NextResponse.json({ success: true, shopId, published: !!isPublish });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
