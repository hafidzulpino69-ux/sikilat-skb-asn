"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("package");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<string | null>(null);

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMethod("email");

    // Simulasi delay autentikasi statis/mock
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "skb_mock_user",
          JSON.stringify({
            email: email || "peserta.skb@example.com",
            name: email ? email.split("@")[0] : "Peserta SIKILAT",
            package: selectedPackage || "bundling-skb",
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
          })
        );
      }
      setIsLoading(false);
      // Alur otomatis redirect ke halaman Syarat & Ketentuan (/terms)
      router.push("/terms");
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setAuthMethod("google");

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "skb_mock_user",
          JSON.stringify({
            email: "peserta.google@gmail.com",
            name: "Peserta SIKILAT (Google)",
            package: selectedPackage || "bundling-skb",
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
          })
        );
      }
      setIsLoading(false);
      // Alur otomatis redirect ke halaman Syarat & Ketentuan (/terms)
      router.push("/terms");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FCF4E7] via-[#F8EDDC] to-[#FCF4E7]">
      {/* Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#042E64]/75 font-medium">
            Masuk untuk mengakses materi tryout dan simulasi CAT BKN
          </p>
        </div>

        {/* Selected Package Banner if redirected from Promo */}
        {selectedPackage && (
          <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#FB6E09]/40 text-[#042E64] flex items-start gap-3 text-xs sm:text-sm shadow-md">
            <div className="w-8 h-8 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-[#FB6E09]" />
            </div>
            <div>
              <span className="font-black text-[#FB6E09]">Paket Dipilih: </span>
              <strong>
                {selectedPackage === "bundling-skb"
                  ? "Paket Bundling SKB (Rp45.000 / 3 Paket Ujian)"
                  : selectedPackage === "paket-satuan"
                  ? "Paket Satuan SKB (Rp20.000)"
                  : "Paket VIP Mentoring (Rp99.000)"}
              </strong>
              <div className="text-[11px] text-[#042E64]/70 mt-0.5 font-medium">
                Silakan masuk atau daftar untuk melanjutkan pengerjaan tryout.
              </div>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="mt-6 bg-white py-8 px-5 sm:px-10 shadow-xl shadow-[#042E64]/5 rounded-3xl border-2 border-[#F0DCBE]">
          {/* Sign in with Google */}
          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-[#F0DCBE] rounded-xl shadow-2xs text-sm font-bold text-[#042E64] bg-[#FCF4E7]/60 hover:bg-[#F4E3CB] active:bg-[#EAD4BA] disabled:opacity-60 transition-all cursor-pointer"
            >
              {isLoading && authMethod === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#FB6E09]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.37 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
              )}
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F0DCBE]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#042E64]/60 font-bold">
                Atau masuk dengan email
              </span>
            </div>
          </div>

          {/* Regular Email & Password Form */}
          <form onSubmit={handleMockLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-black text-[#042E64] uppercase tracking-wider mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#042E64]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border-2 border-[#F0DCBE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09] focus:border-[#FB6E09] text-[#042E64] placeholder-[#042E64]/40 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-black text-[#042E64] uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Fitur reset password (mock): Silakan masukkan password sembarang untuk masuk.");
                  }}
                  className="text-xs font-bold text-[#FB6E09] hover:underline"
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#042E64]/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border-2 border-[#F0DCBE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09] focus:border-[#FB6E09] text-[#042E64] placeholder-[#042E64]/40 font-medium transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#042E64]/50 hover:text-[#FB6E09] focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label="Lihat password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#FB6E09] rounded border-[#F0DCBE] focus:ring-[#FB6E09]"
                />
                <span className="text-xs font-medium text-[#042E64]/75">Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button (Primary Orange) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#FB6E09]/25 text-sm font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] disabled:opacity-70 transition-all cursor-pointer"
            >
              {isLoading && authMethod === "email" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Mock Tip */}
          <div className="mt-5 p-3 rounded-xl bg-[#FCF4E7] border border-[#F0DCBE] text-[11px] text-[#042E64]/80 flex items-start gap-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FB6E09] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#042E64]">Mode Mock Aktif:</strong> Klik &quot;Sign in with Google&quot; atau ketik email sembarang untuk menguji alur post-login.
            </span>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-[#042E64]/75 font-medium">
            Belum memiliki akun?{" "}
            <Link
              href={`/register${selectedPackage ? `?package=${selectedPackage}` : ""}`}
              className="font-black text-[#FB6E09] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-[#042E64]/70 hover:text-[#FB6E09] transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCF4E7]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FB6E09]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
