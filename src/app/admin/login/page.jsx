"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  AtSign,
  ArrowRight,
  HelpCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for the eye toggle
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // Trigger success DOM state
      setLoginSuccess(true);

      // Artificial delay to show the nice success animation before redirecting
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* The Image Component as a background */}
      <Image
        src="/images/Login.WebP"
        alt="Savanna sunset background"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="bg-[#FAF9F6] px-10 py-14 shadow-2xl w-full max-w-[420px] rounded-md relative flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#4A2E1B] tracking-tight mb-1">
            Lynvista Safaris
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C8279] font-bold">
            Administrative Portal
          </p>
        </div>

        {/* Success State Overlay / Content Replacement */}
        {loginSuccess ? (
          <div className="flex flex-col items-center justify-center w-full py-10 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
            <div className="w-16 h-16 bg-[#F2EDE4] rounded-full flex items-center justify-center mb-6">
              <Loader2 className="text-[#8C4B25] animate-spin" size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#4A2E1B] mb-2">
              Access Granted
            </h3>
            <p className="text-sm text-[#8C8279]">
              Establishing secure session...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-8">
            {/* Error Message DOM */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded text-center border border-red-100">
                {errorMessage}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-[#4A2E1B] font-bold mb-2">
                Administrator Email
              </label>
              <div className="flex items-center border-b border-[#DCD5CB] pb-2 focus-within:border-[#8C4B25] transition-colors">
                <AtSign className="text-[#A8A096]" size={16} />
                <input
                  type="email"
                  placeholder="admin@lynvista.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ml-3 bg-transparent text-sm text-[#4A2E1B] placeholder-[#C4BCB3] outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-[#4A2E1B] font-bold mb-2">
                Secure Password
              </label>
              <div className="flex items-center border-b border-[#DCD5CB] pb-2 focus-within:border-[#8C4B25] transition-colors relative">
                <Lock className="text-[#A8A096]" size={16} />
                <input
                  type={showPassword ? "text" : "password"} // Toggles between text and password
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ml-3 pr-8 bg-transparent text-sm tracking-widest text-[#4A2E1B] placeholder-[#C4BCB3] outline-none font-medium"
                  required
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-[#A8A096] hover:text-[#8C4B25] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8C4B25] text-white text-sm font-bold tracking-wide rounded-sm hover:bg-[#6D3A1B] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    LOG IN <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        {!loginSuccess && (
          <button className="flex items-center gap-1.5 text-[11px] text-[#A8A096] mt-10 hover:text-[#4A2E1B] transition-colors">
            <HelpCircle size={12} />
            System Support
          </button>
        )}
      </div>

      {/* Global Style for fade-in animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
}
