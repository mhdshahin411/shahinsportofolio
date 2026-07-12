"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner, inputCls } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res || res.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/shahindevelopernkv");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f4] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-gray-900">
            Shahin<span className="text-[#16a34a]">.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to the admin panel</p>
          <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-[#16a34a]" />
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16a34a] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Spinner className="h-4 w-4" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
