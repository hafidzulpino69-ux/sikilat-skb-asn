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
import { DUMMY_EXAM_QUESTIONS } from "@/data/dummyExamQuestions";
import type { LastExamResult, ExamQuestion, QuestionFilterType, UserAnswersMap } from "@/types";
import { TOTAL_QUESTIONS } from "@/constants";
import { loadLastExamResult } from "@/utils";
import { DiscussionItem } from "@/components/discussion";

/** Données mock par défaut si accès direct */
const FALLBACK_RESULT: LastExamResult = {
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
};

function PembahasanContent() {
  const router = useRouter();
  const [result, setResult] = useState<LastExamResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterType, setFilterType] = useState<QuestionFilterType>("all");
  const [viewMode, setViewMode] = useState<"interactive" | "list">("interactive");

  const questions: ExamQuestion[] = DUMMY_EXAM_QUESTIONS;

  useEffect(() => {
    const loaded = loadLastExamResult();
    setResult(loaded ?? FALLBACK_RESULT);
    setIsLoaded(true);
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
          <span className="text-sm font-bold text-[#042E64]">Menyiapkan pembahasan dan analisis soal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* 1. HEADER HALAMAN PEMBAHASAN */}
      <header className="sticky top-0 z-40 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

            <Link
              href="/my-packages"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-sm shadow-[#FB6E09]/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Daftar Paket</span>
            </Link>
          </div>
        </div>

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

      {/* 2. AREA SOAL & PEMBAHASAN DENGAN NAVIGASI GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (SOAL & PENJELASAN): 8 KOLOM */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-5">
              <DiscussionItem question={currentQuestion} userAnswer={userAns} />
            </div>

            {/* Tombol Navigasi Sebelumnya & Selanjutnya */}
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
                {currentIndex + 1} dari {TOTAL_QUESTIONS} Soal
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

        {/* KOLOM KANAN: NAVIGASI GRID 100 SOAL & FILTER: 4 KOLOM */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between sticky top-28 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FB6E09]" />
                <h3 className="text-sm font-black text-[#042E64] uppercase tracking-wider">
                  Navigasi {TOTAL_QUESTIONS} Soal
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Total: {TOTAL_QUESTIONS}
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
                Semua ({TOTAL_QUESTIONS})
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

          {/* 3. TOMBOL KEMBALI KE DAFTAR PAKET */}
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
            <span className="text-sm font-bold text-[#042E64]">Menyiapkan pembahasan dan analisis soal...</span>
          </div>
        </div>
      }
    >
      <PembahasanContent />
    </Suspense>
  );
}
