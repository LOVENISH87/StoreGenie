"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  order: number;
}

function SortableProduct({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2 cursor-grab active:cursor-grabbing"
    >
      <div {...attributes} {...listeners} className="text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{product.name}</p>
        <p className="text-sm text-gray-500">${product.price}</p>
      </div>
      <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default function Dashboard() {
  const params = useParams();
  const shopId = params.id as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [shop, setShop] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch(`/api/shop/${shopId}`).then((r) => r.json()).then(setShop);
    fetch(`/api/products?shopId=${shopId}`).then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : []));
  }, [shopId]);

  const handleAddProduct = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, shopId, order: products.length }),
    });
    setNewProduct({ name: "", price: "", image: "" });
    const updated = await fetch(`/api/products?shopId=${shopId}`).then((r) => r.json());
    setProducts(Array.isArray(updated) ? updated : []);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      const newProducts = [...products];
      const [moved] = newProducts.splice(oldIndex, 1);
      newProducts.splice(newIndex, 0, moved);
      newProducts.forEach((p, i) => (p.order = i));
      setProducts(newProducts);
      await fetch("/api/products/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: newProducts.map((p) => ({ id: p.id, order: p.order })) }),
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/my-shops" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">
              ← My Shops
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{shop?.name}</h1>
            <p className="text-gray-500">Manage your products</p>
          </div>
          <a href={`/store/${shopId}`} target="_blank" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            View Store
          </a>
        </div>

        <form onSubmit={handleAddProduct} className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add Product</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product name"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              placeholder="Image URL"
              required
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Add Product
          </button>
        </form>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Products (Drag to reorder)</h2>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {products.map((product) => (
                <SortableProduct key={product.id} product={product} onDelete={handleDelete} />
              ))}
            </SortableContext>
          </DndContext>
          {products.length === 0 && (
            <p className="text-gray-500 text-center py-8">No products yet. Add your first product!</p>
          )}
        </div>
      </div>
    </main>
  );
}
