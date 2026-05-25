import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products } = await req.json();

    await Promise.all(
      products.map(({ id, order }: { id: string; order: number }) =>
        supabase.from("products").update({ order }).eq("id", id)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder products" }, { status: 500 });
  }
}
