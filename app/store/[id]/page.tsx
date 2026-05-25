"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const themes: Record<string, any> = {
  minimal: {
    container: "max-w-2xl mx-auto p-8",
    header: "text-center mb-12",
    title: "text-3xl font-light text-gray-800",
    desc: "text-gray-500 mt-2",
    grid: "grid gap-6",
    card: "border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition",
    image: "w-full h-48 object-cover",
    body: "p-4",
    name: "text-lg font-medium",
    price: "text-gray-600 mt-1",
  },
  bold: {
    container: "max-w-4xl mx-auto p-8",
    header: "text-center mb-12 bg-gradient-to-r from-orange-500 to-pink-500 -mx-8 p-12",
    title: "text-4xl font-black text-white",
    desc: "text-white/90 mt-2 text-lg",
    grid: "grid grid-cols-2 gap-8",
    card: "bg-white rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform",
    image: "w-full h-64 object-cover",
    body: "p-6",
    name: "text-xl font-bold text-gray-800",
    price: "text-orange-600 mt-2 text-xl font-bold",
  },
  classic: {
    container: "max-w-3xl mx-auto p-8 bg-amber-50 min-h-screen",
    header: "text-center mb-12 border-b-2 border-amber-200 pb-6",
    title: "text-3xl font-serif text-amber-900",
    desc: "text-amber-700 mt-2 italic",
    grid: "grid grid-cols-3 gap-6",
    card: "bg-white rounded border border-amber-200 overflow-hidden",
    image: "w-full h-40 object-cover",
    body: "p-4",
    name: "text-base font-serif text-amber-900",
    price: "text-amber-700 mt-1 font-medium",
  },
  modern: {
    container: "max-w-5xl mx-auto p-8",
    header: "text-center mb-12",
    title: "text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent",
    desc: "text-gray-500 mt-2",
    grid: "grid grid-cols-3 gap-6",
    card: "bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition",
    image: "w-full h-48 object-cover",
    body: "p-5",
    name: "text-lg font-semibold text-gray-800",
    price: "text-violet-600 mt-1 font-bold text-lg",
  },
};

export default function StorePage() {
  const params = useParams();
  const shopId = params.id as string;
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/shop/${shopId}`).then((r) => r.json()).then(setShop);
    fetch(`/api/products?shopId=${shopId}`).then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : []));
  }, [shopId]);

  if (!shop) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const theme = themes[shop.theme] || themes.minimal;

  return (
    <main className="min-h-screen bg-white">
      <div className={theme.container}>
        <header className={theme.header}>
          <h1 className={theme.title}>{shop.name}</h1>
          <p className={theme.desc}>{shop.description}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>{shop.phone}</span>
            <span>•</span>
            <span>{shop.address}</span>
          </div>
        </header>

        <div className={theme.grid}>
          {products.map((product) => (
            <div key={product.id} className={theme.card}>
              <img src={product.image} alt={product.name} className={theme.image} />
              <div className={theme.body}>
                <h3 className={theme.name}>{product.name}</h3>
                <p className={theme.price}>${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 py-12">No products yet. Check back soon!</p>
        )}
      </div>
    </main>
  );
}
