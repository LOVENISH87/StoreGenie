"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/my-shops");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center font-sans p-6 relative">
      <div className="absolute top-8 left-8 sm:left-12">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#e8dfc8] transition-colors group">
          <span className="text-xl leading-none -translate-y-[1px]">&larr;</span>
          <span className="font-semibold text-sm tracking-wide">Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Welcome back!</h1>
          <p className="text-gray-400 text-sm md:text-base px-4">
            Simplify your workflow and boost your shop&apos;s productivity with{" "}
            <span className="text-[#e8dfc8] font-semibold">StoreGenie</span>.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-transparent border border-gray-800 rounded-full focus:outline-none focus:border-[#e8dfc8] focus:ring-1 focus:ring-[#e8dfc8] transition-all text-white placeholder-gray-600"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-transparent border border-gray-800 rounded-full focus:outline-none focus:border-[#e8dfc8] focus:ring-1 focus:ring-[#e8dfc8] transition-all text-white placeholder-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-xs text-gray-400 hover:text-[#e8dfc8] font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8dfc8] hover:bg-white text-[#08080a] font-bold py-3.5 rounded-full transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link href="/register" className="text-[#e8dfc8] font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
