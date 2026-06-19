"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1] opacity-[0.07] rounded-full blur-[120px]" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#6366f1] flex items-center justify-center mb-4 shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_8px_24px_-4px_rgba(99,102,241,0.5)]">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <h1 className="text-[#fafafa] text-lg font-semibold">Welcome back</h1>
          <p className="text-[#a1a1aa] text-sm mt-1">Sign in to the admin console</p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#a1a1aa] text-xs font-medium">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="bg-[#0a0a0a] border-[#262626] text-[#fafafa] h-10 placeholder:text-[#525252] focus-visible:ring-[#6366f1] focus-visible:ring-1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-[#a1a1aa] text-xs font-medium">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#0a0a0a] border-[#262626] text-[#fafafa] h-10 placeholder:text-[#525252] focus-visible:ring-[#6366f1] focus-visible:ring-1"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white h-10 mt-1 font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>

        <p className="text-center text-[#525252] text-xs mt-6">
          Protected admin area · Authorized access only
        </p>
      </div>
    </div>
  );
}