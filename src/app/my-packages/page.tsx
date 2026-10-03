"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PackageOpen,
  PlusCircle,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Database,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { PackageCard } from "@/components/dashboard";
import { supabase } from "@/utils/supabaseClient";
import type { ExamCardItem, ExamCardStatus } from "@/types";
import {
  SINGLE_PACKAGE_DURATION_MS,
  SINGLE_PACKAGE_DAYS,
  TOTAL_QUESTIONS,
  EXAM_DURATION_MINUTES,
} from "@/constants";
import { getAgencyShortName, calculateTimeLeft } from "@/utils";

export default function MyPackagesPage() {
  const router = useRouter();
  const [examCards, setExamCards] = useState<ExamCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Interval real-time countdown setiap detik (1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data asli dari Supabase (tabel packages & view package_score_summary)
  const fetchPackagesFromSupabase = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Ambil data master paket dari tabel packages
      const { data: packagesData, error: packagesError } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("package_number", { ascending: true })
        .order("created_at", { ascending: true });

      if (packagesError) throw packagesError;

      // 2. Ambil ringkasan skor & jumlah pengerjaan dari view package_score_summary
      const { data: summaryData, error: summaryError } = await supabase
        .from("package_score_summary")
        .select("*");

      if (summaryError) {
        console.warn("Peringatan membaca package_score_summary:", summaryError);
      }

      // 3. Petakan ringkasan skor berdasarkan package_id
      const summaryMap = new Map<
        string,
        { highest_score: number; attempts_count: number }
      >();

      if (summaryData) {
        summaryData.forEach((row: any) => {
          summaryMap.set(row.package_id, {
            highest_score: Number(row.highest_score) || 0,
            attempts_count: Number(row.attempts_count) || 0,
          });
        });
      }

      // 4. Transformasi data paket Supabase ke model UI ExamCardItem
      const cards: ExamCardItem[] = (packagesData || []).map((pkg: any) => {
        const summary = summaryMap.get(pkg.id) || {
          highest_score: 0,
          attempts_count: 0,
        };
        const attemptsCount = summary.attempts_count;
        const score = summary.highest_score;
        const status: ExamCardStatus =
          attemptsCount > 0 ? "Selesai" : "Belum Dikerjakan";

        // Perhitungan masa aktif paket
        const purchasedTime = pkg.created_at
          ? new Date(pkg.created_at).getTime()
          : Date.now();
        const durationMs = SINGLE_PACKAGE_DURATION_MS;
        const expiresTime = purchasedTime + durationMs;

        return {
          cardId: pkg.id,
          packageId: pkg.id,
          slug: pkg.slug,
          purchaseId: pkg.id,
          examNumber: pkg.package_number || 1,
          packageTitle: pkg.title,
          positionTitle: pkg.position_title,
          agencyName: pkg.agency_name,
          agencyShortName: getAgencyShortName(pkg.agency_name),
          score,
          maxScore: pkg.max_score || 500,
          status,
          attemptsCount,
          totalQuestions: pkg.total_questions || TOTAL_QUESTIONS,
          durationMinutes: pkg.duration_minutes || EXAM_DURATION_MINUTES,
          purchasedAt: new Date(purchasedTime).toISOString(),
          expiresAt: new Date(expiresTime).toISOString(),
          isBundling: false,
          validityDays: SINGLE_PACKAGE_DAYS,
        };
      });

      setExamCards(cards);
    } catch (err: any) {
      console.error("Gagal memuat paket dari Supabase:", err);
      setErrorMessage(
        err.message || "Gagal mengambil data paket soal dari server database Supabase."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mount effect & listener otomatis saat tab browser kembali aktif
  useEffect(() => {
    fetchPackagesFromSupabase();

    const handleFocus = () => {
      fetchPackagesFromSupabase();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchPackagesFromSupabase]);

  // Handler memulai simulasi ujian CAT
  const handleStartExam = (card: ExamCardItem) => {
    const timeLeft = calculateTimeLeft(card.expiresAt, currentTime);
    if (timeLeft.isExpired) {
      alert(
        "Maaf, masa aktif paket ini telah habis (Paket Hangus). Silakan lakukan pembelian ulang."
      );
      return;
    }

    router.push(
      `/exam?cardId=${encodeURIComponent(card.cardId)}&packageId=${encodeURIComponent(
        card.packageId || card.cardId
      )}&packageTitle=${encodeURIComponent(
        card.packageTitle
      )}&position=${encodeURIComponent(
        card.positionTitle
      )}&agency=${encodeURIComponent(card.agencyName)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FCF4E7]/90 backdrop-blur-md border-b-2 border-[#F0DCBE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchPackagesFromSupabase()}
                disabled={isLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#042E64] bg-white border border-[#F0DCBE] hover:bg-[#F4E3CB] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                title="Sinkronisasi data dengan Supabase"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#FB6E09] ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span>Muat Ulang</span>
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#042E64] hover:bg-[#0B3E84] rounded-xl transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#FB6E09]" />
                <span>Beli Formasi / Paket Lain</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Supabase Connected Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-[#042E64] flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#042E64] text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-[#FB6E09]" />
            </div>
            <div>
              <span className="font-bold text-[#042E64]">
                Terhubung ke Database Cloud Supabase:
              </span>{" "}
              <span className="text-slate-600">
                Nilai dan riwayat pengerjaan di bawah ini tersimpan secara permanen &amp; independen per paket.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchPackagesFromSupabase()}
            className="sm:hidden p-1.5 rounded-lg text-[#042E64] hover:bg-blue-100"
            title="Refresh data"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#FB6E09] ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Banner Error jika Supabase gagal diakses */}
        {errorMessage && (
          <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-rose-950">
                  Gagal Memuat Paket dari Supabase
                </div>
                <div className="text-xs text-rose-800 font-medium">
                  {errorMessage}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fetchPackagesFromSupabase()}
              className="text-xs font-black text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider">
              <PackageOpen className="w-3.5 h-3.5" />
              <span>Daftar Paket Anda</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
              Paket Soal Ujian yang Anda Miliki
            </h1>
            <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium">
              Data paket soal diambil langsung secara live dari tabel database Supabase Anda.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-[#F0DCBE] text-xs font-black text-[#042E64] hover:bg-[#F4E3CB] transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-[#FB6E09]" />
            <span>Kembali ke Pemilihan Formasi</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && examCards.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-[#F0DCBE] max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#FB6E09] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-black text-[#042E64]">
              Menghubungkan ke Supabase...
            </h3>
            <p className="text-xs text-[#042E64]/70 font-medium">
              Sedang mengambil daftar paket soal dan rekap skor dari server cloud.
            </p>
          </div>
        ) : !isLoading && examCards.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-[#F0DCBE] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#042E64]">
              Belum Ada Paket Soal di Database
            </h3>
            <p className="text-xs sm:text-sm text-[#042E64]/70 max-w-md mx-auto font-medium">
              Tabel packages di Supabase belum memiliki data aktif. Silakan jalankan script SQL insert data dummy pada Supabase SQL Editor.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => fetchPackagesFromSupabase()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-md shadow-[#FB6E09]/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang dari Database</span>
              </button>
            </div>
          </div>
        ) : (
          /* Grid Kotak Paket Hasil Supabase */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examCards.map((card) => {
              const timeLeft = calculateTimeLeft(card.expiresAt, currentTime);

              return (
                <PackageCard
                  key={card.cardId}
                  card={card}
                  timeLeft={timeLeft}
                  onStartExam={handleStartExam}
                />
              );
            })}
          </div>
        )}

        {/* Informasi Bantuan & Ketentuan */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#F0DCBE] text-[#042E64] flex items-start gap-3.5 text-xs sm:text-sm shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FB6E09]" />
          </div>
          <div className="space-y-1">
            <strong className="font-black text-[#042E64] text-sm">
              Sistem Database Cloud Supabase Aktif:
            </strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Setiap kali Anda menyelesaikan ujian, hasil nilai otomatis dikirim dan dicatat ke dalam tabel <code>exam_results</code> dengan relasi Foreign Key ke ID paket yang bersangkutan. Nilai tertinggi dan riwayat pengerjaan dihitung murni secara independen per paket soal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
