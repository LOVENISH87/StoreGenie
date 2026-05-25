"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Shop {
  id: string;
  name: string;
  description: string;
  theme: string;
}

export default function MyShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", phone: "", address: "", theme: "minimal" });
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.from("shops").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setShops(data ?? []);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCreate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    setFormError("");

    const res = await fetch("/api/shop/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error ?? "Failed to create shop");
      setCreating(false);
      return;
    }

    router.push(`/dashboard/${data.shopId}`);
  };

  const themes = ["minimal", "bold", "classic", "dark"];

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-900">
        <Link href="/" className="text-lg font-bold tracking-tight text-[#e8dfc8]">
          StoreGenie
        </Link>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Shops</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage your storefronts</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#e8dfc8] hover:bg-white text-[#08080a] font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
          >
            {showForm ? "Cancel" : "+ New Shop"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div ref={formRef} className="mb-10 p-6 rounded-2xl border border-gray-800 bg-gray-950">
            <h2 className="text-lg font-semibold mb-5">Create a new shop</h2>
            {formError && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Shop name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-gray-800 rounded-xl focus:outline-none focus:border-[#e8dfc8] transition-all text-white placeholder-gray-600 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-gray-800 rounded-xl focus:outline-none focus:border-[#e8dfc8] transition-all text-white placeholder-gray-600 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="px-4 py-3 bg-transparent border border-gray-800 rounded-xl focus:outline-none focus:border-[#e8dfc8] transition-all text-white placeholder-gray-600 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="px-4 py-3 bg-transparent border border-gray-800 rounded-xl focus:outline-none focus:border-[#e8dfc8] transition-all text-white placeholder-gray-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Theme</p>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, theme: t })}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border ${
                        form.theme === t
                          ? "bg-[#e8dfc8] text-[#08080a] border-[#e8dfc8]"
                          : "border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#e8dfc8] hover:bg-white text-[#08080a] font-bold py-3 rounded-full transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Shop"}
              </button>
            </form>
          </div>
        )}

        {/* Shops list */}
        {loading ? (
          <div className="text-gray-500 text-sm text-center py-16">Loading your shops...</div>
        ) : shops.length === 0 && !showForm ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 text-sm mb-4">You don&apos;t have any shops yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[#e8dfc8] text-sm font-semibold hover:underline"
            >
              Create your first shop →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="p-5 rounded-2xl border border-gray-800 bg-gray-950 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{shop.name}</h3>
                    {shop.description && (
                      <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{shop.description}</p>
                    )}
                  </div>
                  <span className="text-xs border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full capitalize">
                    {shop.theme}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/${shop.id}`}
                    className="flex-1 text-center text-sm font-medium bg-[#e8dfc8] text-[#08080a] px-3 py-2 rounded-full hover:bg-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/store/${shop.id}`}
                    target="_blank"
                    className="flex-1 text-center text-sm font-medium border border-gray-700 text-gray-300 px-3 py-2 rounded-full hover:border-gray-500 transition-colors"
                  >
                    View Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
