"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
  X,
  Lightbulb,
  Layers,
  Filter,
  RotateCcw,
  Sparkles,
  ListFilter,
  User,
  Briefcase,
  Building,
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

function PembahasanContent() {
  const router = useRouter();
  const [result, setResult] = useState<LastExamResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterType, setFilterType] = useState<"all" | "wrong" | "correct" | "unanswered">("all");
  const [viewMode, setViewMode] = useState<"interactive" | "list">("interactive");

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
        // Fallback data simulasi jika diakses langsung
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

  // Filter daftar soal
  const filteredQuestionIndices = useMemo(() => {
    if (!result) return questions.map((_, i) => i);

    return questions
      .map((q, index) => {
        const userAns = result.userAnswers[q.id];
        const isCorrect = userAns === q.correctAnswer;
        const isUnanswered = !userAns;
        const isWrong = !!userAns && !isCorrect;

        if (filterType === "correct" && !isCorrect) return -1;
        if (filterType === "wrong" && !isWrong) return -1;
        if (filterType === "unanswered" && !isUnanswered) return -1;
        return index;
      })
      .filter((idx) => idx !== -1);
  }, [questions, result, filterType]);

  // Pastikan currentIndex valid saat filter berubah
  useEffect(() => {
    if (filteredQuestionIndices.length > 0 && !filteredQuestionIndices.includes(currentIndex)) {
      setCurrentIndex(filteredQuestionIndices[0]);
    }
  }, [filteredQuestionIndices, currentIndex]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const userAns = result?.userAnswers[currentQuestion.id];
  const isCorrect = userAns === currentQuestion.correctAnswer;
  const isUnanswered = !userAns;

  const handleNext = () => {
    const currentPos = filteredQuestionIndices.indexOf(currentIndex);
    if (currentPos !== -1 && currentPos < filteredQuestionIndices.length - 1) {
      setCurrentIndex(filteredQuestionIndices[currentPos + 1]);
    } else if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    const currentPos = filteredQuestionIndices.indexOf(currentIndex);
    if (currentPos > 0) {
      setCurrentIndex(filteredQuestionIndices[currentPos - 1]);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getGridItemColor = (qId: number, idx: number) => {
    if (!result) return "bg-slate-100 text-slate-700 border-slate-300";
    const uAns = result.userAnswers[qId];
    const correctKey = questions[idx]?.correctAnswer;

    const isActive = currentIndex === idx;
    const ring = isActive ? "ring-3 ring-[#042E64] scale-110 font-black shadow-md z-10" : "";

    if (!uAns) {
      return `bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 ${ring}`;
    }
    if (uAns === correctKey) {
      return `bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs ${ring}`;
    }
    return `bg-rose-500 text-white border-rose-600 font-bold shadow-xs ${ring}`;
  };

  if (!isLoaded || !result) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-[#042E64]">Memuat Halaman Pembahasan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. HEADER HALAMAN PEMBAHASAN                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Judul Ringkasan Nilai */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" inverted />
            <div className="h-8 w-[1px] bg-blue-300/30 hidden md:block" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#FB6E09] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pembahasan Ujian SKB</span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                Pembahasan SKB - Nilai Anda:{" "}
                <span className="text-amber-300 text-base sm:text-lg">{result.score}</span> / {result.maxScore}
              </h1>
            </div>
          </div>

          {/* Quick Stats & Tombol Kembali */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Pill Ringkasan Jawaban */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B3E84] border border-blue-400/30 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{result.correctCount} Benar</span>
              </span>
              <span className="text-blue-300">•</span>
              <span className="flex items-center gap-1 text-rose-300">
                <XCircle className="w-3.5 h-3.5" />
                <span>{result.wrongCount} Salah</span>
              </span>
              <span className="text-blue-300">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{result.unansweredCount} Kosong</span>
              </span>
            </div>

            {/* Tombol Kembali ke Daftar Paket */}
            <Link
              href="/my-packages"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-sm shadow-[#FB6E09]/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Daftar Paket</span>
            </Link>
          </div>
        </div>

        {/* Sub-Header Metadata Formasi */}
        <div className="bg-[#03234d] px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-blue-100 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>Formasi: <strong className="text-white">{result.positionTitle}</strong></span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>Instansi: <strong className="text-white">{result.agencyName}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/exam/result"
              className="text-[11px] font-bold text-blue-200 hover:text-white underline decoration-blue-400/60"
            >
              ← Lihat Ringkasan Nilai
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. AREA SOAL & PEMBAHASAN DENGAN NAVIGASI GRID                             */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* KOLOM KIRI (SOAL & PENJELASAN PEMBAHASAN): 8 KOLOM                      */}
        {/* ======================================================================= */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header Kartu Soal */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl font-black text-sm bg-[#042E64] text-white">
                    Soal No. {currentQuestion.questionNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-[#042E64] border border-blue-200">
                    {currentQuestion.category}
                  </span>
                </div>

                {/* Indikator Status Jawaban Peserta */}
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
                {currentQuestion.questionText}
              </div>

              {/* List 5 Opsi Jawaban dengan Indikator Visual Terang */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pilihan Jawaban &amp; Kunci Resmi:
                </div>

                {currentQuestion.options.map((opt) => {
                  const isUserChoice = userAns === opt.key;
                  const isCorrectKey = currentQuestion.correctAnswer === opt.key;

                  let borderBg = "bg-white border-slate-200 text-slate-700";
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

                  if (isCorrectKey) {
                    // Kunci jawaban yang benar: HIJAU
                    borderBg = "bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                    badgeStyle = "bg-emerald-600 text-white font-black border-emerald-700";
                  } else if (isUserChoice && !isCorrectKey) {
                    // Jawaban pengguna yang salah: MERAH
                    borderBg = "bg-rose-50/80 border-rose-400 text-rose-950 font-semibold ring-2 ring-rose-300";
                    badgeStyle = "bg-rose-600 text-white font-black border-rose-700";
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${borderBg}`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border ${badgeStyle}`}
                      >
                        {opt.key}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm leading-snug pt-0.5 font-medium">
                        {opt.text}
                      </div>

                      {/* Label Status Badge */}
                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-black">
                        {isUserChoice && (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] shadow-2xs ${
                              isCorrectKey
                                ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                                : "bg-rose-200 text-rose-900 border border-rose-400"
                            }`}
                          >
                            {isCorrectKey ? "✓ Jawaban Anda (Benar)" : "✕ Jawaban Anda (Salah)"}
                          </span>
                        )}

                        {isCorrectKey && !isUserChoice && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            ★ Kunci Jawaban Benar
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================================================================= */}
              {/* KOTAK KHUSUS PENJELASAN PEMBAHASAN LOGIS                         */}
              {/* ================================================================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 text-blue-950 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#042E64]">
                  <Lightbulb className="w-4 h-4 text-[#FB6E09]" />
                  <span>Kunci Jawaban: {currentQuestion.correctAnswer} • Penjelasan Pembahasan:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            {/* Tombol Navigasi Soal Sebelumnya & Selanjutnya */}
            <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#042E64] border-2 border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Soal Sebelumnya</span>
              </button>

              <span className="text-xs font-bold text-slate-500">
                {currentIndex + 1} dari 100 Soal
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm text-white bg-[#042E64] hover:bg-[#0B3E84] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                <span>Soal Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* KOLOM KANAN: NAVIGASI GRID 100 SOAL & FILTER: 4 KOLOM                   */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between sticky top-28 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FB6E09]" />
                <h3 className="text-sm font-black text-[#042E64] uppercase tracking-wider">
                  Navigasi 100 Soal
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Total: 100
              </span>
            </div>

            {/* Filter Tabs Soal */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                  filterType === "all" ? "bg-white text-[#042E64] shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua (100)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("wrong")}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                  filterType === "wrong" ? "bg-rose-600 text-white shadow-xs font-black" : "text-rose-700 hover:bg-rose-100"
                }`}
              >
                Salah ({result.wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("correct")}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                  filterType === "correct" ? "bg-emerald-600 text-white shadow-xs font-black" : "text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                Benar ({result.correctCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("unanswered")}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                  filterType === "unanswered" ? "bg-slate-700 text-white shadow-xs font-black" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Kosong ({result.unansweredCount})
              </button>
            </div>

            {/* Legenda Warna */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-around text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Benar
              </span>
              <span className="flex items-center gap-1 text-rose-800">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Salah
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300" /> Kosong
              </span>
            </div>

            {/* Grid 1 sampai 100 */}
            <div className="max-h-[380px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const isVisibleInFilter = filteredQuestionIndices.includes(idx);
                  const btnColor = getGridItemColor(q.id, idx);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${btnColor} ${
                        !isVisibleInFilter ? "opacity-25" : ""
                      }`}
                      title={`Soal No. ${q.questionNumber}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 3. TOMBOL KEMBALI KE DAFTAR PAKET                                  */}
          {/* =================================================================== */}
          <div className="pt-3 border-t-2 border-slate-200 space-y-2">
            <Link
              href="/my-packages"
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-center text-white bg-[#042E64] hover:bg-[#0B3E84] active:bg-[#021B3D] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#042E64]/20"
            >
              <ArrowLeft className="w-4 h-4 text-[#FB6E09]" />
              <span>Kembali ke Daftar Paket</span>
            </Link>

            <Link
              href="/exam/result"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors block"
            >
              Lihat Ringkasan Skor Ujian
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function PembahasanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-[#042E64]">Memuat Pembahasan Soal...</span>
          </div>
        </div>
      }
    >
      <PembahasanContent />
    </Suspense>
  );
}
