"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
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
  Filter,
  Check,
  X,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { DUMMY_EXAM_QUESTIONS, ExamQuestion } from "@/data/dummyExamQuestions";

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
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "wrong" | "correct" | "unanswered">("all");
  const [searchQuestionNo, setSearchQuestionNo] = useState<number | null>(null);

  const questions: ExamQuestion[] = DUMMY_EXAM_QUESTIONS;

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

  // Filter daftar soal pembahasan
  const filteredQuestions = useMemo(() => {
    if (!result) return questions;

    return questions.filter((q) => {
      const userAns = result.userAnswers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      const isUnanswered = !userAns;
      const isWrong = !!userAns && !isCorrect;

      if (filterType === "correct") return isCorrect;
      if (filterType === "wrong") return isWrong;
      if (filterType === "unanswered") return isUnanswered;
      return true;
    });
  }, [questions, result, filterType]);

  const handleRetakeExam = () => {
    if (!result) {
      router.push("/exam");
      return;
    }
    router.push(
      `/exam?cardId=${encodeURIComponent(result.cardId)}&packageTitle=${encodeURIComponent(result.packageTitle)}&position=${encodeURIComponent(result.positionTitle)}&agency=${encodeURIComponent(result.agencyName)}`
    );
  };

  const scrollToQuestion = (questionId: number) => {
    setShowDiscussion(true);
    setTimeout(() => {
      const element = document.getElementById(`discussion-question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  if (!isLoaded || !result) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-[#042E64]">Memuat Hasil Ujian &amp; Pembahasan...</span>
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
                {/* Tombol 'Lihat Pembahasan' Sesuai Instruksi User */}
                <button
                  type="button"
                  onClick={() => setShowDiscussion(!showDiscussion)}
                  className={`w-full sm:w-auto py-3.5 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    showDiscussion
                      ? "bg-[#042E64] text-white hover:bg-[#0B3E84]"
                      : "bg-[#FB6E09] text-white hover:bg-[#E45E00] shadow-[#FB6E09]/30"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showDiscussion ? "Tutup Pembahasan" : "Lihat Pembahasan"}</span>
                  {showDiscussion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

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
        {/* FITUR PEMBAHASAN DETAIL 100 SOAL                                         */}
        {/* ========================================================================= */}
        {showDiscussion && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header Pembahasan & Filter */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/90 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-[#042E64]" />
                    <span>Kunci Jawaban &amp; Pembahasan Resmi</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#042E64]">
                    Pembahasan 100 Soal CAT BKN
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
                      filterType === "all" ? "bg-white text-[#042E64] shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Semua ({questions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("wrong")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
                      filterType === "wrong" ? "bg-rose-600 text-white shadow-xs" : "text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    Salah ({result.wrongCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("correct")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
                      filterType === "correct" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    Benar ({result.correctCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("unanswered")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
                      filterType === "unanswered" ? "bg-slate-700 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Kosong ({result.unansweredCount})
                  </button>
                </div>
              </div>

              {/* Mini Quick Jump Grid 1 - 100 */}
              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Lompat Cepat ke Nomor Soal:
                </div>
                <div className="max-h-24 overflow-y-auto pr-1">
                  <div className="grid grid-cols-10 sm:grid-cols-20 gap-1">
                    {questions.map((q) => {
                      const userAns = result.userAnswers[q.id];
                      const isCorrect = userAns === q.correctAnswer;
                      const isUnanswered = !userAns;

                      let boxStyle = "bg-rose-500 text-white border-rose-600";
                      if (isCorrect) boxStyle = "bg-emerald-600 text-white border-emerald-700";
                      if (isUnanswered) boxStyle = "bg-slate-200 text-slate-700 border-slate-300";

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => scrollToQuestion(q.id)}
                          className={`h-7 rounded text-[11px] font-bold border transition-transform hover:scale-110 cursor-pointer ${boxStyle}`}
                          title={`Lihat Pembahasan No. ${q.questionNumber}`}
                        >
                          {q.questionNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* List 100 Soal dan Pembahasan */}
            <div className="space-y-5">
              {filteredQuestions.map((q) => {
                const userAns = result.userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isUnanswered = !userAns;

                return (
                  <div
                    key={q.id}
                    id={`discussion-question-${q.id}`}
                    className={`bg-white rounded-3xl border-2 transition-all p-5 sm:p-7 shadow-sm space-y-5 ${
                      isCorrect
                        ? "border-emerald-200 hover:border-emerald-400"
                        : isUnanswered
                        ? "border-slate-300"
                        : "border-rose-200 hover:border-rose-400"
                    }`}
                  >
                    {/* Header Soal & Indikator Hasil */}
                    <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-xl font-black text-sm bg-[#042E64] text-white">
                          Soal No. {q.questionNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-[#042E64] border border-blue-200">
                          {q.category}
                        </span>
                      </div>

                      <div>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
                            <span>Jawaban Anda Benar (+5 Poin)</span>
                          </span>
                        ) : isUnanswered ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>Tidak Dijawab (0 Poin)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                            <X className="w-3.5 h-3.5 stroke-[3] text-rose-600" />
                            <span>Jawaban Anda Salah (0 Poin)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Teks Soal */}
                    <div className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                      {q.questionText}
                    </div>

                    {/* Opsi Jawaban (A, B, C, D, E) */}
                    <div className="space-y-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isUserChoice = userAns === opt.key;
                        const isCorrectKey = q.correctAnswer === opt.key;

                        let cardStyle = "bg-white border-slate-200 text-slate-700";
                        let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

                        if (isCorrectKey) {
                          cardStyle = "bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400";
                          badgeStyle = "bg-emerald-600 text-white font-black";
                        } else if (isUserChoice && !isCorrectKey) {
                          cardStyle = "bg-rose-50/80 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-300";
                          badgeStyle = "bg-rose-600 text-white font-black";
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-3 sm:p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-colors ${cardStyle}`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 border ${badgeStyle}`}
                            >
                              {opt.key}
                            </div>

                            <div className="flex-1 text-xs sm:text-sm leading-snug pt-0.5">
                              {opt.text}
                            </div>

                            {/* Label Indikator Pilihan */}
                            <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-black">
                              {isUserChoice && (
                                <span
                                  className={`px-2 py-0.5 rounded-full ${
                                    isCorrectKey
                                      ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                                      : "bg-rose-200 text-rose-900 border border-rose-400"
                                  }`}
                                >
                                  {isCorrectKey ? "✓ Jawaban Anda (Benar)" : "✕ Jawaban Anda (Salah)"}
                                </span>
                              )}

                              {isCorrectKey && !isUserChoice && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ★ Kunci Jawaban Benar
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Kotak Teks Penjelasan Pembahasannya */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200/90 text-blue-950 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#042E64]">
                        <Lightbulb className="w-4 h-4 text-[#FB6E09]" />
                        <span>Kunci Jawaban: {q.correctAnswer} • Pembahasan Lengkap:</span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
