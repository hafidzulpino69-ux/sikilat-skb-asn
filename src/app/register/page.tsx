"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/utils/supabaseClient";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("package");
  const redirectTo = searchParams.get("redirect") || (selectedPackage ? "/terms" : "/dashboard");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registrasi Akun Baru via Supabase Auth
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("Kata sandi harus minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("User already registered")
        ) {
          throw new Error("Alamat email ini sudah terdaftar. Silakan langsung masuk.");
        }
        throw error;
      }

      if (data?.user) {
        const userMeta = data.user.user_metadata || {};
        const displayName = userMeta.full_name || fullName || email.split("@")[0];

        // Simpan ke localStorage untuk profil frontend
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "skb_user",
            JSON.stringify({
              id: data.user.id,
              name: displayName,
              email: data.user.email,
              phone: phone.trim(),
            })
          );
        }

        // Jika session langsung aktif (Confirm email dimatikan di Supabase Dashboard)
        if (data.session) {
          router.push(redirectTo);
        } else {
          // Jika konfirmasi email aktif di Supabase
          setSuccessMessage(
            "Pendaftaran akun berhasil! Anda sekarang dapat langsung masuk menggunakan email dan kata sandi Anda."
          );
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message;
      setErrorMessage(msg || "Gagal membuat akun. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FCF4E7] via-[#F8EDDC] to-[#FCF4E7]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
            Buat Akun Peserta Baru
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#042E64]/75 font-medium">
            Daftar sekarang dengan Email dan Kata Sandi untuk mulai simulasi CAT BKN
          </p>
        </div>

        {/* Selected Package Banner if applicable */}
        {selectedPackage && (
          <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#FB6E09]/40 text-[#042E64] flex items-start gap-3 text-xs sm:text-sm shadow-md">
            <div className="w-8 h-8 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-[#FB6E09]" />
            </div>
            <div>
              <span className="font-black text-[#FB6E09]">Paket Pilihan: </span>
              <strong>
                {selectedPackage === "bundling-skb"
                  ? "Paket Bundling SKB (Rp80.000 / 3 Paket Ujian)"
                  : "SKB Formasi (Rp30.000)"}
              </strong>
            </div>
          </div>
        )}

        {/* Card Form */}
        <div className="mt-6 bg-white py-8 px-5 sm:px-10 shadow-xl shadow-[#042E64]/5 rounded-3xl border-2 border-[#F0DCBE]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-2.5 text-xs font-semibold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span>{successMessage}</span>
                <div className="mt-2">
                  <Link
                    href={`/login${selectedPackage ? `?package=${selectedPackage}` : ""}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 underline hover:text-emerald-950"
                  >
                    <span>Lanjut ke Halaman Masuk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Email & Password Registration Form */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-black text-[#042E64] uppercase tracking-wider mb-1.5"
              >
                Nama Lengkap Sesuai KTP
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#042E64]/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Budi Pratama, S.Kom"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border-2 border-[#F0DCBE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09] focus:border-[#FB6E09] text-[#042E64] placeholder-[#042E64]/40 font-medium transition-colors"
                />
              </div>
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-black text-[#042E64] uppercase tracking-wider mb-1.5"
              >
                Nomor WhatsApp Aktif
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#042E64]/40">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border-2 border-[#F0DCBE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09] focus:border-[#FB6E09] text-[#042E64] placeholder-[#042E64]/40 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder="peserta@email.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border-2 border-[#F0DCBE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09] focus:border-[#FB6E09] text-[#042E64] placeholder-[#042E64]/40 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-black text-[#042E64] uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
                <span className="text-[10px] text-[#042E64]/60 font-semibold">Min. 6 Karakter</span>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#FB6E09]/25 text-sm font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] disabled:opacity-70 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Membuat akun peserta...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Peserta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-[#042E64]/75 font-medium">
            Sudah memiliki akun?{" "}
            <Link
              href={`/login${selectedPackage ? `?package=${selectedPackage}` : ""}`}
              className="font-black text-[#FB6E09] hover:underline"
            >
              Masuk di sini
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCF4E7] flex items-center justify-center">
          <div className="text-[#042E64] font-black text-sm flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#FB6E09]" />
            <span>Memuat Formulir Pendaftaran...</span>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
