"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#2d1a12]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-8 border-t-8 border-[#78350f]"
      >
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-tight text-[#2d1a12]">
            ADMIN
          </h2>
          <p className="text-[#78350f] font-medium mt-2">
            Lynvista Management Portal
          </p>
        </div>

        <div className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#451a03] mb-2 uppercase tracking-wide">
              Admin Email
            </label>
            <div className="flex items-center border-2 border-[#78350f] rounded-xl bg-[#fdfaf9] focus-within:ring-4 focus-within:ring-amber-100 transition-all">
              <Mail className="ml-3 text-[#78350f]" size={20} />
              <input
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-transparent outline-none text-[#2d1a12] font-semibold"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#451a03] mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="flex items-center border-2 border-[#78350f] rounded-xl bg-[#fdfaf9] focus-within:ring-4 focus-within:ring-amber-100 transition-all">
              <Lock className="ml-3 text-[#78350f]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-transparent outline-none text-[#2d1a12] font-semibold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mr-3 text-[#78350f] hover:text-[#451a03]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-[#78350f] text-white rounded-xl font-black text-lg hover:bg-[#451a03] active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? "VERIFYING..." : "LOG IN NOW"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Secure Encrypted Session
        </p>
      </form>
    </div>
  );
}
