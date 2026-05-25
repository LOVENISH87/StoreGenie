"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Check your email to confirm your account, then log in.");
      setLoading(false);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Create an account</h1>
          <p className="text-gray-400 text-sm md:text-base px-4">
            Join <span className="text-[#e8dfc8] font-semibold">StoreGenie</span> and launch your dream store in seconds.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-red-800 bg-red-950/40 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-green-800 bg-green-950/40 text-green-400 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-transparent border border-gray-800 rounded-full focus:outline-none focus:border-[#e8dfc8] focus:ring-1 focus:ring-[#e8dfc8] transition-all text-white placeholder-gray-600"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-transparent border border-gray-800 rounded-full focus:outline-none focus:border-[#e8dfc8] focus:ring-1 focus:ring-[#e8dfc8] transition-all text-white placeholder-gray-600"
            />
          </div>
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
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-5 py-3.5 bg-transparent border border-gray-800 rounded-full focus:outline-none focus:border-[#e8dfc8] focus:ring-1 focus:ring-[#e8dfc8] transition-all text-white placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8dfc8] hover:bg-white text-[#08080a] font-bold py-3.5 rounded-full transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#e8dfc8] font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
