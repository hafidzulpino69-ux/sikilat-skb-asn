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
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LoadingState from "@/components/LoadingState";
import { PackageCard } from "@/components/dashboard";
import { supabase } from "@/utils/supabaseClient";
import type { ExamCardItem, ExamCardStatus } from "@/types";
import {
  SINGLE_PACKAGE_DURATION_MS,
  SINGLE_PACKAGE_DAYS,
  TOTAL_QUESTIONS,
  EXAM_DURATION_MINUTES,
} from "@/constants";
import { getAgencyShortName, calculateTimeLeft, loadPackageScores } from "@/utils";

export default function MyPackagesPage() {
  const router = useRouter();
  const [examCards, setExamCards] = useState<ExamCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState<boolean>(false);
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
      setErrorMessage(null);

      // 1. Ambil session user saat ini dari Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        // Jika belum login, arahkan ke login
        router.push("/login?redirect=/my-packages");
        return;
      }

      // 2. Ambil data kepemilikan paket dari user_packages (Clean Architecture)
      const { data: userPackagesData, error: userPackagesError } = await supabase
        .from("user_packages")
        .select("id, package_id, purchased_at, expires_at, package:packages(*)")
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: true });

      let finalCardsData: any[] = [];

      if (!userPackagesError && userPackagesData && userPackagesData.length > 0) {
        finalCardsData = userPackagesData
          .filter((up: any) => up.package && up.package.is_active !== false)
          .map((up: any) => ({
            ...up.package,
            user_package_id: up.id,
            purchased_at: up.purchased_at,
            expires_at: up.expires_at,
          }));
      } else {
        // Fallback: Ambil dari tabel packages langsung jika user_packages belum ada
        const { data: legacyPackages } = await supabase
          .from("packages")
          .select("*")
          .eq("is_active", true)
          .eq("user_id", user.id)
          .order("package_number", { ascending: true });

        if (legacyPackages) {
          finalCardsData = legacyPackages;
        }
      }

      // 3a. Ambil ringkasan skor & jumlah pengerjaan dari view package_score_summary milik user (VIEW Fase 2)
      const { data: summaryData } = await supabase
        .from("package_score_summary")
        .select("*")
        .eq("user_id", user.id);

      // 3b. Query cadangan langsung dari tabel exam_results milik user (antisipasi jika view belum sync atau RLS view)
      const { data: examResultsData } = await supabase
        .from("exam_results")
        .select("package_id, score, is_finished, completed_at")
        .eq("user_id", user.id);

      // 4. Petakan ringkasan skor komprehensif (View + Backup Exam Results + LocalStorage)
      const summaryMap = new Map<
        string,
        { highest_score: number; attempts_count: number; last_completed_at?: string }
      >();

      const setSummary = (
        key: string,
        score: number,
        attempts: number,
        completedAt?: string
      ) => {
        if (!key) return;
        const existing = summaryMap.get(key);
        const newHighest = Math.max(existing?.highest_score || 0, score || 0);
        const newAttempts = Math.max(existing?.attempts_count || 0, attempts || 0);
        const latestTime =
          completedAt &&
          (!existing?.last_completed_at || new Date(completedAt) > new Date(existing.last_completed_at))
            ? completedAt
            : existing?.last_completed_at;

        summaryMap.set(key, {
          highest_score: newHighest,
          attempts_count: newAttempts,
          last_completed_at: latestTime,
        });
      };

      // 4a. Masukkan data dari package_score_summary
      if (summaryData && Array.isArray(summaryData)) {
        summaryData.forEach((row: any) => {
          const score = Number(row.highest_score) || 0;
          const attempts = Number(row.attempts_count) || 0;
          if (row.package_id) setSummary(row.package_id, score, attempts, row.last_completed_at);
        });
      }

      // 4b. Agregasi langsung dari tabel exam_results (jika view belum me-reload hasil terbaru)
      if (examResultsData && Array.isArray(examResultsData) && examResultsData.length > 0) {
        const directStats: Record<string, { highest: number; count: number; lastAt?: string }> = {};

        examResultsData.forEach((r: any) => {
          const pId = r.package_id;
          if (!pId) return;
          const isDone = r.is_finished === true || (r.score && Number(r.score) > 0);
          if (!isDone) return;

          if (!directStats[pId]) {
            directStats[pId] = { highest: 0, count: 0, lastAt: r.completed_at };
          }
          directStats[pId].highest = Math.max(directStats[pId].highest, Number(r.score) || 0);
          directStats[pId].count += 1;
          if (
            r.completed_at &&
            (!directStats[pId].lastAt || new Date(r.completed_at) > new Date(directStats[pId].lastAt!))
          ) {
            directStats[pId].lastAt = r.completed_at;
          }
        });

        Object.entries(directStats).forEach(([pId, stat]) => {
          setSummary(pId, stat.highest, stat.count, stat.lastAt);
        });
      }

      // 4c. Gabungkan dengan skor di localStorage jika pernah melakukan latihan mandiri
      const localScores = loadPackageScores();
      if (localScores && typeof localScores === "object") {
        Object.entries(localScores).forEach(([k, rec]: [string, any]) => {
          const score = Number(rec.highestScore || rec.score) || 0;
          const attempts =
            Number(rec.attemptsCount || rec.attempts) || (rec.status === "Selesai" ? 1 : 0);
          setSummary(k, score, attempts, rec.lastCompletedAt);
        });
      }

      // 5. Transformasi data paket Supabase ke model UI ExamCardItem
      const cards: ExamCardItem[] = finalCardsData.map((pkg: any) => {
        const summary =
          summaryMap.get(pkg.id) ||
          summaryMap.get(pkg.user_package_id) || {
            highest_score: 0,
            attempts_count: 0,
            last_completed_at: undefined,
          };

        const attemptsCount = summary.attempts_count;
        const score = summary.highest_score;
        const status: ExamCardStatus =
          attemptsCount > 0 ? "Selesai" : "Belum Dikerjakan";

        // Perhitungan masa aktif paket
        const purchasedTime = pkg.purchased_at
          ? new Date(pkg.purchased_at).getTime()
          : pkg.created_at
          ? new Date(pkg.created_at).getTime()
          : Date.now();

        const expiresTime = pkg.expires_at
          ? new Date(pkg.expires_at).getTime()
          : purchasedTime + SINGLE_PACKAGE_DURATION_MS;

        return {
          cardId: pkg.id,
          packageId: pkg.id,
          slug: pkg.slug,
          userId: user.id,
          purchaseId: pkg.user_package_id || pkg.id,
          examNumber: pkg.package_number || 1,
          packageTitle: pkg.title,
          positionTitle: pkg.position_title,
          agencyName: pkg.agency_name,
          agencyShortName: getAgencyShortName(pkg.agency_name),
          score,
          maxScore: pkg.max_score || 500,
          status,
          attemptsCount,
          lastCompletedAt: summary.last_completed_at,
          totalQuestions: pkg.total_questions || TOTAL_QUESTIONS,
          durationMinutes: pkg.duration_minutes || EXAM_DURATION_MINUTES,
          purchasedAt: new Date(purchasedTime).toISOString(),
          expiresAt: new Date(expiresTime).toISOString(),
          isBundling: false,
          validityDays: SINGLE_PACKAGE_DAYS,
        };
      });

      setExamCards(cards);
    } catch {
      setErrorMessage(
        "Gagal memuat daftar paket soal Anda. Silakan coba beberapa saat lagi."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Mount effect & listener otomatis saat tab browser kembali aktif
  useEffect(() => {
    // Cek query param purchased=1
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("purchased") === "1") {
        setJustPurchased(true);
        window.history.replaceState(null, "", "/my-packages");
      }
    }

    void fetchPackagesFromSupabase();

    const handleFocus = () => {
      void fetchPackagesFromSupabase();
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
                title="Perbarui daftar paket"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#FB6E09] ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span>{isLoading ? "Memperbarui..." : "Muat Ulang"}</span>
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
        {/* Sinkronisasi Akun Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-[#042E64] flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#042E64] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#FB6E09]" />
            </div>
            <div>
              <span className="font-bold text-[#042E64]">
                Sinkronisasi Akun Aktif:
              </span>{" "}
              <span className="text-slate-600">
                Nilai dan riwayat pengerjaan paket tersimpan secara permanen dan otomatis di akun Anda.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchPackagesFromSupabase()}
            className="sm:hidden p-1.5 rounded-lg text-[#042E64] hover:bg-blue-100"
            title="Perbarui daftar paket"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#FB6E09] ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Banner sukses pembelian */}
        {justPurchased && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-sm animate-in fade-in duration-300">
            <span>✓ Pembayaran berhasil! Paket baru telah tersimpan di akun Anda dan siap dikerjakan.</span>
            <button
              type="button"
              onClick={() => setJustPurchased(false)}
              className="px-2 text-emerald-700 hover:text-emerald-900 cursor-pointer"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        )}

        {/* Banner Error jika Supabase gagal diakses */}
        {errorMessage && (
          <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-rose-950">
                  Gagal Memuat Paket Ujian
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
              Daftar paket tryout yang aktif dan siap dikerjakan untuk persiapan tes SKB Anda.
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
          <div className="bg-white rounded-3xl border-2 border-[#F0DCBE] max-w-md mx-auto shadow-sm">
            <LoadingState message="Mengambil data paket ujian..." />
          </div>
        ) : !isLoading && examCards.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-[#F0DCBE] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#042E64]">Belum Ada Paket Soal Aktif</h3>
            <p className="text-xs sm:text-sm text-[#042E64]/70 max-w-md mx-auto font-medium">
              Anda belum memiliki paket soal. Pilih instansi, jabatan, dan paket di dashboard untuk mulai berlatih.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-md shadow-[#FB6E09]/30 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pilih &amp; Beli Paket Sekarang</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Grid Kotak Paket */
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
              Ketentuan &amp; Riwayat Pengerjaan:
            </strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Setiap kali Anda menyelesaikan simulasi ujian CAT, nilai dan riwayat pengerjaan Anda akan langsung tercatat secara otomatis. Anda dapat mengulang latihan berkali-kali selama masa aktif paket masih berlaku, dan sistem akan menyimpan skor terbaik yang Anda raih.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
