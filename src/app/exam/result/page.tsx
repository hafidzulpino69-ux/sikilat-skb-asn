"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle,
  Layers,
  ChevronRight,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface LastExamResult {
  cardId: string;
  packageTitle: string;
  positionTitle: string;
  agencyName: string;
  score: number;
  highestScore: number;
  previousHighest: number;
  maxScore: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  userAnswers: Record<number, "A" | "B" | "C" | "D" | "E">;
  doubtfulQuestions?: Record<number, boolean>;
}

function ExamResultContent() {
  const router = useRouter();
  const [result, setResult] = useState<LastExamResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("skb_last_exam_result");
      if (raw) {
        try {
          const parsed: LastExamResult = JSON.parse(raw);
          setResult(parsed);
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback default mock jika diakses langsung
        setResult({
          cardId: "default-exam-card",
          packageTitle: "Paket 1: SKB Kejaksaan",
          positionTitle: "Petugas Pengelola Barang Bukti",
          agencyName: "Kejaksaan Republik Indonesia",
          score: 425,
          highestScore: 425,
          previousHighest: 400,
          maxScore: 500,
          totalQuestions: 100,
          correctCount: 85,
          wrongCount: 10,
          unansweredCount: 5,
          timeSpentSeconds: 4200,
          completedAt: new Date().toISOString(),
          userAnswers: {},
        });
      }
      setIsLoaded(true);
    }
  }, []);

  const formatSpentTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} Menit ${secs} Detik`;
  };

  const isPassing = (result?.score ?? 0) >= 350;
  const isNewRecord = result ? result.score >= result.highestScore && result.score > result.previousHighest : false;

  const handleRetakeExam = () => {
    if (!result) {
      router.push("/exam");
      return;
    }
    router.push(
      `/exam?cardId=${encodeURIComponent(result.cardId)}&packageTitle=${encodeURIComponent(result.packageTitle)}&position=${encodeURIComponent(result.positionTitle)}&agency=${encodeURIComponent(result.agencyName)}`
    );
  };

  if (!isLoaded || !result) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-[#042E64]">Memuat Hasil Ujian...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" inverted />

            <div className="flex items-center gap-3">
              <Link
                href="/my-packages"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#FB6E09]" />
                <span className="hidden sm:inline">Daftar Paket Anda</span>
                <span className="sm:hidden">Daftar Paket</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* HERO SCORE CARD: PEROLEHAN SKOR (MISAL: 425 / 500)                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div
            className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white ${
              isPassing ? "bg-gradient-to-r from-emerald-700 to-teal-800" : "bg-gradient-to-r from-amber-600 to-orange-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">
                  Laporan Hasil Simulasi CAT BKN
                </span>
                <h1 className="text-base sm:text-lg font-black leading-tight">
                  {result.packageTitle}
                </h1>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-md self-start sm:self-auto border border-white/30">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{isPassing ? "Memenuhi Passing Grade" : "Perlu Evaluasi"}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Tampilan Skor Utama */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="text-center md:text-left space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Perolehan Skor Ujian Anda
                </div>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-[#042E64] tracking-tight">
                    {result.score}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-400">
                    / {result.maxScore}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  Formasi: <strong className="text-[#042E64]">{result.positionTitle}</strong> • Instansi:{" "}
                  <strong className="text-[#042E64]">{result.agencyName}</strong>
                </div>
              </div>

              {/* Box Skor Tertinggi Tersimpan */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 text-center sm:text-right min-w-[240px] space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center justify-center sm:justify-end gap-1.5">
                  <Award className="w-4 h-4 text-[#FB6E09]" />
                  <span>Skor Tertinggi Akun:</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#FB6E09]">
                  {result.highestScore} <span className="text-sm text-slate-500 font-bold">/ 500</span>
                </div>
                {isNewRecord && (
                  <div className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    ★ Rekor Baru Tercapai!
                  </div>
                )}
                <div className="text-[10px] text-slate-500 font-medium">
                  Otomatis tersimpan &amp; ter-update di Daftar Paket
                </div>
              </div>
            </div>

            {/* Statistik 4 Kartu: Benar, Salah, Kosong, Akurasi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Jawaban Benar</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {result.correctCount}
                </div>
                <div className="text-[11px] font-semibold text-emerald-800/80">
                  +{result.correctCount * 5} Poin (x5)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-rose-800 flex items-center justify-center gap-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Jawaban Salah</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-700">
                  {result.wrongCount}
                </div>
                <div className="text-[11px] font-semibold text-rose-800/80">
                  0 Poin
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-center space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Tidak Dijawab</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-700">
                  {result.unansweredCount}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  0 Poin
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center space-y-1 shadow-2xs">
                <div className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waktu Digunakan</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-amber-900 pt-1">
                  {formatSpentTime(result.timeSpentSeconds)}
                </div>
                <div className="text-[11px] font-semibold text-amber-800/80">
                  dari 90 Menit
                </div>
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Tombol 'Lihat Pembahasan' diarahkan ke route khusus /pembahasan */}
                <Link
                  href="/pembahasan"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-[#FB6E09] text-white hover:bg-[#E45E00] shadow-[#FB6E09]/30"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lihat Pembahasan</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleRetakeExam}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-black text-sm text-[#042E64] bg-white border-2 border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-[#FB6E09]" />
                  <span>Kerjakan Ujian Lagi</span>
                </button>
              </div>

              <Link
                href="/my-packages"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-black text-sm text-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Kembali ke Daftar Paket
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BANNER PROMOSI HALAMAN PEMBAHASAN KHUSUS                                 */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-[#042E64] to-[#08428C] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-blue-400/20">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB6E09] text-white text-xs font-black uppercase tracking-wider shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Halaman Khusus Pembahasan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Evaluasi &amp; Pelajari Kunci Jawaban Resmi 100 Soal
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Tinjau kembali seluruh 100 butir soal simulasi CAT Anda. Dilengkapi dengan navigasi grid 1-100, tanda visual jawaban benar/salah, kunci jawaban valid BKN, serta kotak penjelasan mendalam.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Grid Navigasi 100 Soal
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Filter Benar / Salah
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Pembahasan Logis
              </span>
            </div>
          </div>

          <Link
            href="/pembahasan"
            className="shrink-0 py-4 px-8 rounded-2xl bg-[#FB6E09] text-white font-black text-sm hover:bg-[#E45E00] shadow-lg shadow-[#FB6E09]/30 transition-all flex items-center gap-2 hover:translate-x-1"
          >
            <span>Buka Pembahasan Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ExamResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-[#042E64]">Memuat Hasil Ujian...</span>
          </div>
        </div>
      }
    >
      <ExamResultContent />
    </Suspense>
  );
}
