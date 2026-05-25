import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    const { data, error } = await supabase
      .from("shops")
      .insert({ name: body.name, slug, description: body.description, phone: body.phone, address: body.address, theme: body.theme, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ shopId: data.id });
  } catch (error: any) {
    console.error("[shop/create]", error);
    return NextResponse.json({ error: error?.message ?? "Failed to create shop" }, { status: 500 });
  }
}
