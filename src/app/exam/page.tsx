"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Flag,
  RotateCcw,
  Check,
  Award,
  Layers,
  Sparkles,
  User,
  Building,
  Briefcase,
  Maximize2,
  Minimize2,
  ArrowLeft,
  X,
  ShieldAlert,
  Save,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { DUMMY_EXAM_QUESTIONS, ExamQuestion } from "@/data/dummyExamQuestions";

// Waktu default ujian resmi: 90 Menit = 5400 Detik (01:30:00)
const TOTAL_EXAM_SECONDS = 90 * 60;
const TOTAL_QUESTIONS_COUNT = 100;

interface ExamAutosaveSession {
  cardId: string;
  secondsLeft: number;
  answers: Record<number, "A" | "B" | "C" | "D" | "E">;
  doubtfulQuestions: Record<number, boolean>;
  currentIndex: number;
  lastSavedAt: string;
}

function ExamEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameter context jika dibuka dari paket tertentu
  const cardIdParam = searchParams.get("cardId") || "default-exam-card";
  const packageTitleParam = searchParams.get("packageTitle") || "Paket 1: SKB Formasi";
  const positionParam = searchParams.get("position") || "Petugas Pengelola Barang Bukti";
  const agencyParam = searchParams.get("agency") || "Kejaksaan Republik Indonesia";

  // Key unik autosave per paket ujian di localStorage
  const sessionKey = `skb_exam_session_${cardIdParam}`;

  // Data Peserta
  const [userName, setUserName] = useState("Peserta Simulasi CAT");
  const [userEmail, setUserEmail] = useState("peserta@sikilat.id");

  // State Soal & Navigasi
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const questions: ExamQuestion[] = DUMMY_EXAM_QUESTIONS;
  const currentQuestion: ExamQuestion = questions[currentIndex] || questions[0];

  // State Jawaban Peserta: { [questionId: number]: 'A' | 'B' | 'C' | 'D' | 'E' }
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D" | "E">>({});

  // State Soal Ragu-ragu: { [questionId: number]: boolean }
  const [doubtfulQuestions, setDoubtfulQuestions] = useState<Record<number, boolean>>({});

  // State Countdown Timer (90 Menit)
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_EXAM_SECONDS);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  // State Resume & Autosave
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
  const [hasResumed, setHasResumed] = useState<boolean>(false);
  const [lastSavedTimeStr, setLastSavedTimeStr] = useState<string>("");

  // Mobile Grid Drawer State
  const [showMobileGrid, setShowMobileGrid] = useState<boolean>(false);

  // Ambil profil login pengguna dari localStorage jika ada
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("skb_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // =========================================================================
  // LOGIKA 2: FITUR RESUME (Lanjutkan Ujian Saat Komponen Di-mount)
  // =========================================================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawSession = localStorage.getItem(sessionKey);
        if (rawSession) {
          const session: ExamAutosaveSession = JSON.parse(rawSession);

          // Cek apakah ada session valid yang belum selesai (> 0 detik)
          if (session && typeof session.secondsLeft === "number" && session.secondsLeft > 0) {
            setSecondsLeft(session.secondsLeft);
            if (session.answers) setAnswers(session.answers);
            if (session.doubtfulQuestions) setDoubtfulQuestions(session.doubtfulQuestions);
            if (
              typeof session.currentIndex === "number" &&
              session.currentIndex >= 0 &&
              session.currentIndex < TOTAL_QUESTIONS_COUNT
            ) {
              setCurrentIndex(session.currentIndex);
            }
            setHasResumed(true);
            setLastSavedTimeStr(session.lastSavedAt || new Date().toISOString());
          } else {
            // Jika data sesi sudah 0 detik atau rusak, bersihkan
            localStorage.removeItem(sessionKey);
          }
        }
      } catch (e) {
        console.error("Gagal membaca session autosave ujian:", e);
      } finally {
        setIsSessionLoaded(true);
      }
    }
  }, [sessionKey]);

  // =========================================================================
  // LOGIKA 1: SISTEM AUTOSAVE BERKALA (Setiap 1 Detik & Saat State Berubah)
  // =========================================================================
  // Countdown Interval 1 Detik (hanya berjalan setelah session di-load)
  useEffect(() => {
    if (!isSessionLoaded || isFinished || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionLoaded, isFinished, secondsLeft]);

  // Autosave Otomatis ke localStorage setiap detik dan setiap ada perubahan state
  useEffect(() => {
    if (!isSessionLoaded || isFinished) return;

    // Jangan simpan jika waktu sudah habis (karena pembersihan akan dilakukan oleh finish handler)
    if (secondsLeft <= 0) return;

    try {
      const sessionData: ExamAutosaveSession = {
        cardId: cardIdParam,
        secondsLeft,
        answers,
        doubtfulQuestions,
        currentIndex,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error("Gagal melakukan autosave:", e);
    }
  }, [isSessionLoaded, isFinished, secondsLeft, answers, doubtfulQuestions, currentIndex, sessionKey, cardIdParam]);

  // Format Waktu: 01:30:00 (HH:MM:SS)
  const formattedTime = useMemo(() => {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [secondsLeft]);

  // Statistik Jawaban
  const stats = useMemo(() => {
    let answeredCount = 0;
    let doubtfulCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const isDoubtful = !!doubtfulQuestions[q.id];
      const hasAnswer = !!answers[q.id];

      if (isDoubtful) {
        doubtfulCount++;
      } else if (hasAnswer) {
        answeredCount++;
      } else {
        unansweredCount++;
      }
    });

    return {
      answeredCount,
      doubtfulCount,
      unansweredCount,
      totalCount: questions.length,
    };
  }, [answers, doubtfulQuestions, questions]);

  // Handler Pilih Opsi Jawaban (A, B, C, D, E) dengan Instant Save
  const handleSelectOption = (key: "A" | "B" | "C" | "D" | "E") => {
    if (isFinished) return;
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: key,
    };
    setAnswers(updatedAnswers);

    // Instant save ke localStorage saat opsi dipilih
    try {
      const sessionData: ExamAutosaveSession = {
        cardId: cardIdParam,
        secondsLeft,
        answers: updatedAnswers,
        doubtfulQuestions,
        currentIndex,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }
  };

  // Handler Toggle Ragu-ragu (Warna Kuning) dengan Instant Save
  const handleToggleDoubtful = () => {
    if (isFinished) return;
    const updatedDoubtful = {
      ...doubtfulQuestions,
      [currentQuestion.id]: !doubtfulQuestions[currentQuestion.id],
    };
    setDoubtfulQuestions(updatedDoubtful);

    // Instant save ke localStorage saat tombol ragu diklik
    try {
      const sessionData: ExamAutosaveSession = {
        cardId: cardIdParam,
        secondsLeft,
        answers,
        doubtfulQuestions: updatedDoubtful,
        currentIndex,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }
  };

  // Handler Tombol 'Sebelumnya'
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Handler Tombol 'Simpan & Lanjut' (Warna Hijau)
  const handleSaveAndNext = () => {
    if (isFinished) return;

    // Berpindah ke soal berikutnya jika belum di soal terakhir
    if (currentIndex < TOTAL_QUESTIONS_COUNT - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Jika di soal terakhir (No. 100), tampilkan konfirmasi selesai
      setShowFinishModal(true);
    }
  };

  // Handler Lompat Soal dari Navigasi Grid
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowMobileGrid(false);
  };

  // =========================================================================
  // LOGIKA 3: CLEAR DATA & SELESAIKAN UJIAN
  // =========================================================================
  const handleConfirmFinish = () => {
    setIsFinished(true);
    setShowFinishModal(false);

    // Hitung jawaban benar, salah, dan kosong
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (!userAns) {
        unansweredCount++;
      } else if (userAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const calculatedScore = correctCount * 5; // 1 soal benar bernilai 5 poin, maksimal 500

    if (typeof window !== "undefined") {
      // 1. BERSIHKAN (CLEAR) DATA AUTOSAVE DARI LOCALSTORAGE
      // Agar retake ujian di lain waktu benar-benar mulai dari awal lagi (90 menit & kosong)
      try {
        localStorage.removeItem(sessionKey);
        localStorage.removeItem("skb_exam_session_default-exam-card");
      } catch (e) {
        console.error("Gagal menghapus autosave session:", e);
      }

      // 2. Simpan skor tertinggi akun
      let existingScores: Record<
        string,
        {
          highestScore: number;
          lastScore: number;
          attempts: number;
          status: string;
          lastCompletedAt: string;
        }
      > = {};

      const rawScores = localStorage.getItem("skb_package_scores");
      if (rawScores) {
        try {
          existingScores = JSON.parse(rawScores);
        } catch (e) {
          existingScores = {};
        }
      }

      const prevRecord = existingScores[cardIdParam];
      const previousHighest = prevRecord?.highestScore ?? 0;
      // LOGIKA SKOR TERTINGGI:
      // Jika nilai baru lebih tinggi, simpan skor baru. Jika lebih rendah, biarkan nilai tertinggi tetap tampil.
      const newHighest = Math.max(previousHighest, calculatedScore);

      existingScores[cardIdParam] = {
        highestScore: newHighest,
        lastScore: calculatedScore,
        attempts: (prevRecord?.attempts || 0) + 1,
        status: "Selesai",
        lastCompletedAt: new Date().toISOString(),
      };

      localStorage.setItem("skb_package_scores", JSON.stringify(existingScores));

      // 3. Simpan data lengkap hasil ujian terakhir untuk ditampilkan di halaman /exam/result & /pembahasan
      const lastExamResult = {
        cardId: cardIdParam,
        packageTitle: packageTitleParam,
        positionTitle: positionParam,
        agencyName: agencyParam,
        score: calculatedScore,
        highestScore: newHighest,
        previousHighest,
        maxScore: 500,
        totalQuestions: TOTAL_QUESTIONS_COUNT,
        correctCount,
        wrongCount,
        unansweredCount,
        timeSpentSeconds: TOTAL_EXAM_SECONDS - secondsLeft,
        completedAt: new Date().toISOString(),
        userAnswers: answers,
        doubtfulQuestions,
      };

      localStorage.setItem("skb_last_exam_result", JSON.stringify(lastExamResult));
    }

    // Arahkan pengguna ke halaman 'Hasil Ujian'
    router.push("/exam/result");
  };

  // Otomatis akhiri ujian jika waktu 90 menit habis (Timer = 00:00:00)
  useEffect(() => {
    if (isSessionLoaded && secondsLeft === 0 && !isFinished) {
      handleConfirmFinish();
    }
  }, [isSessionLoaded, secondsLeft, isFinished]);

  // Status Warna Kotak Navigasi
  const getNavBoxStyle = (questionId: number, index: number) => {
    const isCurrent = currentIndex === index;
    const isDoubtful = !!doubtfulQuestions[questionId];
    const hasAnswer = !!answers[questionId];

    // Aturan Warna:
    // 1. Kuning: Ditandai 'Ragu-ragu' (baik sudah ada jawaban maupun belum)
    // 2. Hijau: Sudah dijawab
    // 3. Putih/Abu-abu: Belum dijawab
    let bgStyle = "bg-white text-slate-700 border-slate-300 hover:bg-slate-100";

    if (isDoubtful) {
      bgStyle = "bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs";
    } else if (hasAnswer) {
      bgStyle = "bg-emerald-600 text-white border-emerald-700 font-black shadow-xs";
    }

    const ringStyle = isCurrent
      ? "ring-3 ring-[#042E64] scale-105 z-10 font-black shadow-md border-[#042E64]"
      : "";

    return `${bgStyle} ${ringStyle}`;
  };

  const isCurrentDoubtful = !!doubtfulQuestions[currentQuestion.id];
  const currentSelectedOption = answers[currentQuestion.id];

  if (!isSessionLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-black text-[#042E64]">Memeriksa Sesi &amp; Memuat Lembar Ujian CAT BKN...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* ========================================================================= */}
      {/* BANNER NOTIFIKASI RESUME SESI UJIAN (JIKA ADA SESI SEBELUMNYA)             */}
      {/* ========================================================================= */}
      {hasResumed && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-xs animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>
                <strong>Sesi Ujian Berhasil Dipulihkan!</strong> Melanjutkan soal No. {currentIndex + 1} dengan sisa waktu {formattedTime}. Jawaban dan status ragu-ragu Anda telah otomatis dimuat kembali.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHasResumed(false)}
              className="text-white hover:text-emerald-100 p-1 font-black cursor-pointer text-sm"
              title="Tutup pemberitahuan"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AREA HEADER (INFORMASI UJIAN CAT BKN)                                  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Judul Sistem */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" inverted />
            <div className="hidden md:block h-8 w-[1px] bg-blue-300/30" />
            <div className="hidden sm:block">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#FB6E09]">
                Sistem CAT BKN Simulasi Mandiri
              </div>
              <div className="text-xs sm:text-sm font-black text-white leading-tight truncate max-w-xs md:max-w-md">
                {packageTitleParam}
              </div>
            </div>
          </div>

          {/* Indikator Tengah: Soal No. [X] dari 100 */}
          <div className="flex items-center gap-2 bg-[#0B3E84] px-3.5 py-1.5 rounded-xl border border-blue-400/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider font-bold text-blue-200 hidden xs:inline">
              Indikator:
            </span>
            <span className="text-xs sm:text-sm font-black text-white">
              Soal No. <strong className="text-[#FB6E09] text-sm sm:text-base">{currentIndex + 1}</strong> dari {TOTAL_QUESTIONS_COUNT}
            </span>
          </div>

          {/* Sisa Waktu & Status Autosave */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Indikator Autosave Aktif */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/70 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autosave Aktif</span>
            </div>

            {/* Sisa Waktu (Countdown Timer 90 Menit) */}
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono border-2 shadow-inner transition-colors ${
                secondsLeft < 300
                  ? "bg-rose-600/90 text-white border-rose-400 animate-pulse"
                  : "bg-white text-[#042E64] border-amber-400"
              }`}
            >
              <Clock
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  secondsLeft < 300 ? "text-white" : "text-[#FB6E09]"
                }`}
              />
              <div className="text-right">
                <div className="text-[9px] uppercase font-sans font-bold tracking-wider opacity-75 hidden sm:block leading-none">
                  Sisa Waktu
                </div>
                <div className="text-sm sm:text-lg font-black tracking-wider leading-none">
                  {formattedTime}
                </div>
              </div>
            </div>

            {/* Tombol Akses Grid di Mobile */}
            <button
              type="button"
              onClick={() => setShowMobileGrid(true)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
              title="Buka Navigasi Nomor Soal"
            >
              <Layers className="w-5 h-5 text-[#FB6E09]" />
            </button>
          </div>
        </div>

        {/* Sub-Header Metadata Peserta & Formasi */}
        <div className="bg-[#03234d] px-3 sm:px-6 lg:px-8 py-1.5 text-[11px] text-blue-100/90 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>Peserta: <strong className="text-white font-semibold">{userName}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>Formasi: <strong className="text-white font-semibold">{positionParam}</strong></span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>Instansi: <strong className="text-white font-semibold">{agencyParam}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-blue-300 hidden sm:inline">Ukuran Teks:</span>
            <button
              type="button"
              onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
              className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-[10px] font-bold text-white border border-blue-700/50 flex items-center gap-1 cursor-pointer"
            >
              {fontSize === "normal" ? (
                <>
                  <Maximize2 className="w-2.5 h-2.5" />
                  <span>Perbesar Font</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-2.5 h-2.5" />
                  <span>Font Normal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* AREA UTAMA: SOAL (KIRI) & NAVIGASI GRID (KANAN)                           */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* ======================================================================= */}
        {/* 2. AREA SOAL DAN OPSI JAWABAN (KOLOM KIRI: 8 KOLOM)                      */}
        {/* ======================================================================= */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[460px]">
            <div className="space-y-5">
              {/* Header Soal: Nomor, Kategori, Status Ragu */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl font-black text-sm sm:text-base bg-[#042E64] text-white">
                    Soal No. {currentIndex + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-[#042E64] border border-blue-200">
                    {currentQuestion.category}
                  </span>
                </div>

                {isCurrentDoubtful && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ditandai Ragu-ragu</span>
                  </span>
                )}
              </div>

              {/* Teks Soal */}
              <div
                className={`text-slate-800 leading-relaxed font-medium transition-all ${
                  fontSize === "large" ? "text-base sm:text-lg" : "text-sm sm:text-base"
                }`}
              >
                {currentQuestion.questionText}
              </div>

              {/* Opsi Jawaban (A, B, C, D, E) */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Salah Satu Jawaban:
                </div>

                {currentQuestion.options.map((opt) => {
                  const isSelected = currentSelectedOption === opt.key;

                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`group p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-blue-50/80 border-[#042E64] shadow-xs text-[#042E64]"
                          : "bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800"
                      }`}
                    >
                      {/* Lingkaran Radio Opsi */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 transition-all ${
                          isSelected
                            ? "bg-[#042E64] text-white ring-2 ring-[#042E64]/30"
                            : "bg-slate-100 text-slate-700 group-hover:bg-[#FB6E09]/15 group-hover:text-[#FB6E09] border border-slate-300"
                        }`}
                      >
                        {opt.key}
                      </div>

                      {/* Teks Opsi Jawaban */}
                      <div
                        className={`flex-1 pt-0.5 leading-snug font-medium transition-all ${
                          fontSize === "large" ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                        } ${isSelected ? "font-bold text-[#042E64]" : "text-slate-700"}`}
                      >
                        {opt.text}
                      </div>

                      {/* Tanda Centang jika terpilih */}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================================== */}
            {/* 3. TOMBOL AKSI DI BAWAH SOAL (SEBELUMNYA, RAGU-RAGU, SIMPAN & LANJUT) */}
            {/* =================================================================== */}
            <div className="pt-6 mt-6 border-t-2 border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
              {/* Tombol 'Sebelumnya' */}
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm bg-white text-[#042E64] border-2 border-slate-300 hover:bg-slate-100 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Tombol 'Ragu-ragu' (Warna Kuning) */}
                <button
                  type="button"
                  onClick={handleToggleDoubtful}
                  className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-98 ${
                    isCurrentDoubtful
                      ? "bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-amber-600 ring-2 ring-amber-300"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300"
                  }`}
                  title="Tandai nomor soal ini menjadi ragu-ragu di navigasi grid"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-800" />
                  <span>{isCurrentDoubtful ? "✓ Sedang Ragu-ragu" : "Ragu-ragu"}</span>
                </button>

                {/* Tombol 'Simpan & Lanjut' (Warna Hijau) */}
                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-98 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <span>Simpan &amp; Lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 4. AREA NAVIGASI NOMOR SOAL (GRID 1 - 100) (KOLOM KANAN: 4 KOLOM)        */}
        {/* ======================================================================= */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between sticky top-24">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FB6E09]" />
                <h3 className="text-sm font-black text-[#042E64] uppercase tracking-wider">
                  Daftar Nomor Soal
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Total: 100 Soal
              </span>
            </div>

            {/* Legenda Warna Kotak Navigasi Sesuai Aturan */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-700 shrink-0" />
                <span className="text-slate-700">Dijawab ({stats.answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 shrink-0" />
                <span className="text-slate-700">Ragu ({stats.doubtfulCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300 shrink-0" />
                <span className="text-slate-700">Kosong ({stats.unansweredCount})</span>
              </div>
            </div>

            {/* Kotak-kotak Angka 1 sampai 100 */}
            <div className="max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const boxStyle = getNavBoxStyle(q.id, idx);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${boxStyle}`}
                      title={`Pindah ke Soal No. ${q.questionNumber}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Di bagian paling bawah grid: Tombol 'Selesaikan Ujian' (Warna Merah) */}
          <div className="pt-4 mt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 active:scale-98 transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Selesaikan Ujian</span>
            </button>
          </div>
        </aside>
      </main>

      {/* ========================================================================= */}
      {/* MODAL KONFIRMASI / HASIL 'SELESAIKAN UJIAN'                               */}
      {/* ========================================================================= */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#042E64]">
                    Konfirmasi Selesai Ujian
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pastikan Anda telah memeriksa kembali seluruh lembar jawaban.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ringkasan Progres Jawaban */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-bold">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Sudah Dijawab:</span>
                </span>
                <span className="font-black text-emerald-700 text-sm">
                  {stats.answeredCount} Soal
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Ragu-ragu:</span>
                </span>
                <span className="font-black text-amber-700 text-sm">
                  {stats.doubtfulCount} Soal
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span>Belum Dijawab:</span>
                </span>
                <span className="font-black text-slate-600 text-sm">
                  {stats.unansweredCount} Soal
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[#042E64]">
                <span>Sisa Waktu Ujian:</span>
                <span className="font-black font-mono text-sm text-[#FB6E09]">
                  {formattedTime}
                </span>
              </div>
            </div>

            {stats.doubtfulCount > 0 || stats.unansweredCount > 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Masih ada <strong>{stats.doubtfulCount + stats.unansweredCount}</strong> butir soal yang ragu-ragu atau belum Anda jawab.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh 100 butir soal telah berhasil Anda jawab dengan lengkap!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Lanjutkan Ujian
              </button>

              <button
                type="button"
                onClick={handleConfirmFinish}
                className="py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Ya, Akhiri Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER NAVIGASI GRID NOMOR SOAL KHUSUS MOBILE                             */}
      {/* ========================================================================= */}
      {showMobileGrid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-4 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FB6E09]" />
                  <h3 className="text-sm font-black text-[#042E64]">
                    Nomor Soal (1 - 100)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileGrid(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const boxStyle = getNavBoxStyle(q.id, idx);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg border text-xs flex items-center justify-center font-bold ${boxStyle}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowMobileGrid(false);
                  setShowFinishModal(true);
                }}
                className="w-full py-3 rounded-xl font-black text-sm text-white bg-rose-600 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Selesaikan Ujian</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
          <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-black text-[#042E64]">Memuat Lembar Ujian CAT BKN...</span>
          </div>
        </div>
      }
    >
      <ExamEngineContent />
    </Suspense>
  );
}
