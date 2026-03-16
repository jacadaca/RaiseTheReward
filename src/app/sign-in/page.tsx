"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "register" | "success">("login");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMode("success");
  }

  if (mode === "success") {
    return (
      <>
        <Nav />
        <div className="max-w-[440px] mx-auto px-8 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 text-[28px] flex items-center justify-center mx-auto mb-4">
            &#10003;
          </div>
          <h1 className="font-serif text-[28px] tracking-tight mb-2">
            You&rsquo;re signed in
          </h1>
          <p className="text-[14px] text-gray-400 mb-6">
            Welcome back{email ? `, ${email}` : ""}. You can now donate to
            cases, track your contributions, and manage your reward funds.
          </p>
          <div className="flex gap-2.5 justify-center">
            <Link
              href="/cases"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-black text-white"
            >
              Browse cases
            </Link>
            <Link
              href="/submit"
              className="px-5 py-2 rounded-full text-[14px] font-semibold bg-white text-black border border-gray-300"
            >
              Start a Reward
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="max-w-[400px] mx-auto px-8 py-10">
        <h1 className="font-serif text-[28px] tracking-tight mb-1 text-center">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-[14px] text-gray-400 text-center mb-6">
          {mode === "login"
            ? "Sign in to manage your donations and reward funds."
            : "Join RTR to donate, submit cases, and track rewards."}
        </p>

        {/* Social buttons */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] border-gray-200 text-[14px] font-medium hover:bg-gray-50 mb-2">
          <span className="text-[18px]">G</span>
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-[1.5px] border-gray-200 text-[14px] font-medium hover:bg-gray-50 mb-4">
          <span className="text-[18px]">&#63743;</span>
          Continue with Apple
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[12px] text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-[12px] font-medium text-gray-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-3">
            <label className="text-[12px] font-medium text-gray-400 block mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
              placeholder={mode === "login" ? "Enter password" : "Create password"}
            />
          </div>

          {mode === "register" && (
            <div className="mb-3">
              <label className="text-[12px] font-medium text-gray-400 block mb-1">
                Full name
              </label>
              <input
                className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[14px] outline-none focus:border-gray-900"
                placeholder="Your full name"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-full text-[15px] font-semibold bg-[var(--color-brand)] text-white mt-1"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-[13px] text-gray-400 text-center mt-4">
          {mode === "login" ? (
            <>
              Don&rsquo;t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-black font-medium hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-black font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </>
  );
}
