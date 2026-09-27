"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  Clock,
  Award,
  LogOut,
  FileCheck,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface UserData {
  name: string;
  email: string;
  package?: string;
  isLoggedIn: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>({
    name: "Peserta SIKILAT",
    email: "peserta@example.com",
    package: "bundling-skb",
    isLoggedIn: true,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skb_mock_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skb_mock_user");
      localStorage.removeItem("skb_terms_accepted");
    }
    router.push("/login");
  };

  const tryoutList = [
    {
      id: 1,
      title: "Paket 1: SKB Kemampuan Teknis Formasi",
      category: "Kompetensi Teknis Bidang",
      questions: 100,
      duration: "90 Menit",
      passingScore: 350,
      status: "Siap Dikerjakan",
    },
    {
      id: 2,
      title: "Paket 2: SKB Manajerial, Sosio-Kultural & Wawancara",
      category: "Kompetensi Non-Teknis",
      questions: 100,
      duration: "90 Menit",
      passingScore: 340,
      status: "Siap Dikerjakan",
    },
    {
      id: 3,
      title: "Paket 3: Simulasi Terpadu CAT BKN Terstandar",
      category: "Simulasi Prediksi Penuh",
      questions: 100,
      duration: "90 Menit",
      passingScore: 360,
      status: "Siap Dikerjakan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col">
      {/* Top Navbar Dashboard */}
      <header className="sticky top-0 z-30 bg-[#FCF4E7]/90 backdrop-blur-md border-b-2 border-[#F0DCBE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-black text-[#042E64]">{user.name}</span>
                <span className="text-[11px] text-[#042E64]/60 font-semibold">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Package Active Banner (Deep Navy #042E64) */}
        <div className="bg-[#042E64] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#042E64]/20 border-3 border-[#FB6E09] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/20 text-[#FB6E09] border border-[#FB6E09]/40 text-xs font-black">
              <Zap className="w-3.5 h-3.5 fill-[#FB6E09]" />
              <span>Status Akun: Terverifikasi & Aktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang, {user.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Anda telah menyetujui tata tertib dan memiliki akses penuh ke{" "}
              <strong className="text-[#FB6E09] underline">Paket Bundling SKB (3 Paket Ujian Lengkap)</strong> di platform SIKILAT SKB ASN.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0 w-full md:w-auto">
            <div className="font-black text-[#FB6E09] uppercase tracking-wider text-[11px]">
              Paket Aktif Saat Ini
            </div>
            <div className="text-base font-black text-white">Paket Bundling SKB 2026</div>
            <div className="flex items-center gap-2 text-blue-200 text-[11px] font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>3 Sesi Ujian Berstandar CAT BKN</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Tryout Tersedia</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">3 Paket</div>
            <div className="text-[11px] text-[#FB6E09] font-black flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> 300 Butir Soal CAT
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Tryout Dikerjakan</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">0 / 3</div>
            <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Belum ada ujian selesai
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Rata-Rata Skor</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">-</div>
            <div className="text-[11px] text-[#042E64]/50 font-semibold">Target Passing: &gt; 400</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Peringkat Nasional</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">-</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Aktif setelah tryout 1
            </div>
          </div>
        </div>

        {/* Tryout List Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#042E64]">Daftar Paket Ujian SKB Anda</h2>
            <p className="text-xs sm:text-sm text-[#042E64]/75 font-medium">
              Pilih paket di bawah ini untuk memulai simulasi sistem CAT BKN secara kilat dan terarah.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tryoutList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-[#F0DCBE] shadow-2xs hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/30">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#042E64] leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0DCBE] text-xs text-[#042E64]/80 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#FB6E09]" />
                      <span>{item.questions} Soal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FB6E09]" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Award className="w-4 h-4 text-[#FB6E09]" />
                      <span>Nilai Ambang Batas: <strong>{item.passingScore}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-[#FCF4E7]/60 border-t-2 border-[#F0DCBE]">
                  {/* Primary Orange "Mulai Ujian CAT" Button */}
                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        `SIKILAT SKB ASN - Simulasi CAT BKN: ${item.title}\n\nWaktu: ${item.duration} | Jumlah: ${item.questions} Soal.\n\nSelamat berjuang meraih NIP!`
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] transition-colors shadow-md shadow-[#FB6E09]/20 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Mulai Ujian CAT</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Tips Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#FB6E09]/40 text-[#042E64] flex items-start gap-3.5 text-xs sm:text-sm shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FB6E09]" />
          </div>
          <div className="space-y-1">
            <strong className="font-black text-[#042E64] text-sm">Tips Sukses Tryout SIKILAT SKB ASN:</strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Pastikan koneksi internet Anda stabil sebelum mengklik tombol &quot;Mulai Ujian CAT&quot;. Timer akan langsung berjalan mundur setelah lembar soal terbuka. Gunakan tombol &quot;Ragu-ragu&quot; untuk menandai soal yang membutuhkan analisis ulang.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
