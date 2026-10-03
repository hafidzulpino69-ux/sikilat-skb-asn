"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DUMMY_EXAM_QUESTIONS } from "@/data/dummyExamQuestions";
import { EXAM_DURATION_SECONDS, TOTAL_QUESTIONS } from "@/constants";
import { useExamTimer, useExamState, useAutosave } from "@/hooks";
import { calculateScore, loadUserProfile, updatePackageScore, saveLastExamResult } from "@/utils";
import type { FontSizePreference } from "@/types";

import {
  ExamHeader,
  QuestionDisplay,
  ActionButtons,
  NavigationGrid,
  FinishModal,
  MobileGridDrawer,
  ResumeBanner,
} from "@/components/exam";

function ExamEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameter context
  const cardIdParam = searchParams.get("cardId") || "default-exam-card";
  const packageTitleParam = searchParams.get("packageTitle") || "Paket 1: SKB Formasi";
  const positionParam = searchParams.get("position") || "Petugas Pengelola Barang Bukti";
  const agencyParam = searchParams.get("agency") || "Kejaksaan Republik Indonesia";

  // Data Peserta
  const [userName, setUserName] = useState("Peserta Simulasi CAT");

  // UI State
  const [isFinished, setIsFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showMobileGrid, setShowMobileGrid] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizePreference>("normal");

  const questions = DUMMY_EXAM_QUESTIONS;

  // =========================================================================
  // HOOK 1: Autosave & Resume
  // =========================================================================
  const {
    isSessionLoaded,
    hasResumed,
    setHasResumed,
    restoredSession,
    saveSession,
    clearSession,
  } = useAutosave({ cardId: cardIdParam });

  // =========================================================================
  // HOOK 2: Exam State (Jawaban, Navigasi, Statistik)
  // =========================================================================
  const {
    currentIndex,
    setCurrentIndex,
    answers,
    doubtfulQuestions,
    stats,
    currentQuestion,
    currentSelectedOption,
    isCurrentDoubtful,
    handleSelectOption: rawSelectOption,
    handleToggleDoubtful: rawToggleDoubtful,
    handlePrevQuestion,
    handleSaveAndNext: rawSaveAndNext,
    handleJumpToQuestion,
  } = useExamState({
    questions,
    initialAnswers: restoredSession?.answers,
    initialDoubtful: restoredSession?.doubtfulQuestions,
    initialIndex: restoredSession?.currentIndex,
    isFinished,
    totalQuestions: TOTAL_QUESTIONS,
  });

  // =========================================================================
  // HANDLER: Selesaikan Ujian (kalkulasi, simpan skor, clear autosave)
  // =========================================================================
  const handleConfirmFinish = useCallback(() => {
    setIsFinished(true);
    setShowFinishModal(false);

    const scoreResult = calculateScore(questions, answers);
    const { highestScore, previousHighest } = updatePackageScore(cardIdParam, scoreResult.score);

    // Hapus autosave session
    clearSession();

    // Simpan hasil ujian untuk /exam/result & /pembahasan
    saveLastExamResult({
      cardId: cardIdParam,
      packageTitle: packageTitleParam,
      positionTitle: positionParam,
      agencyName: agencyParam,
      score: scoreResult.score,
      highestScore,
      previousHighest,
      maxScore: scoreResult.maxScore,
      totalQuestions: TOTAL_QUESTIONS,
      correctCount: scoreResult.correctCount,
      wrongCount: scoreResult.wrongCount,
      unansweredCount: scoreResult.unansweredCount,
      timeSpentSeconds: EXAM_DURATION_SECONDS - secondsLeft,
      completedAt: new Date().toISOString(),
      userAnswers: answers,
      doubtfulQuestions,
    });

    router.push("/exam/result");
  }, [questions, answers, doubtfulQuestions, cardIdParam, packageTitleParam, positionParam, agencyParam, clearSession, router]);

  // =========================================================================
  // HOOK 3: Timer Countdown
  // =========================================================================
  const { secondsLeft, setSecondsLeft, formattedTime, isWarning } = useExamTimer({
    initialSeconds: restoredSession?.secondsLeft ?? EXAM_DURATION_SECONDS,
    isFinished,
    isReady: isSessionLoaded,
    onTimeUp: handleConfirmFinish,
  });

  // =========================================================================
  // Profil pengguna
  // =========================================================================
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile?.name) setUserName(profile.name);
  }, []);

  // =========================================================================
  // Autosave berkala (setiap detik & setiap state berubah)
  // =========================================================================
  useEffect(() => {
    if (!isSessionLoaded || isFinished || secondsLeft <= 0) return;
    saveSession({ secondsLeft, answers, doubtfulQuestions, currentIndex });
  }, [isSessionLoaded, isFinished, secondsLeft, answers, doubtfulQuestions, currentIndex, saveSession]);

  // =========================================================================
  // Wrapped handlers dengan instant-save
  // =========================================================================
  const handleSelectOption = useCallback(
    (key: "A" | "B" | "C" | "D" | "E") => {
      rawSelectOption(key);
    },
    [rawSelectOption]
  );

  const handleToggleDoubtful = useCallback(() => {
    rawToggleDoubtful();
  }, [rawToggleDoubtful]);

  const handleSaveAndNext = useCallback(() => {
    const isLast = rawSaveAndNext();
    if (isLast) setShowFinishModal(true);
  }, [rawSaveAndNext]);

  const handleJumpMobile = useCallback(
    (index: number) => {
      handleJumpToQuestion(index);
      setShowMobileGrid(false);
    },
    [handleJumpToQuestion]
  );

  // =========================================================================
  // Loading State
  // =========================================================================
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

  // =========================================================================
  // RENDER: Thin Container — hanya memanggil hooks + merender components
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans select-none">
      {/* Banner Resume Sesi */}
      {hasResumed && (
        <ResumeBanner
          currentIndex={currentIndex}
          formattedTime={formattedTime}
          onDismiss={() => setHasResumed(false)}
        />
      )}

      {/* Header CAT */}
      <ExamHeader
        packageTitle={packageTitleParam}
        positionTitle={positionParam}
        agencyName={agencyParam}
        userName={userName}
        currentIndex={currentIndex}
        totalQuestions={TOTAL_QUESTIONS}
        formattedTime={formattedTime}
        isWarning={isWarning}
        fontSize={fontSize}
        onToggleFontSize={() => setFontSize((f) => (f === "normal" ? "large" : "normal"))}
        onOpenMobileGrid={() => setShowMobileGrid(true)}
      />

      {/* Area Utama: Soal (Kiri) & Grid (Kanan) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Kolom Kiri: Soal & Aksi */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[460px]">
            <QuestionDisplay
              question={currentQuestion}
              currentIndex={currentIndex}
              selectedOption={currentSelectedOption}
              isDoubtful={isCurrentDoubtful}
              fontSize={fontSize}
              onSelectOption={handleSelectOption}
            />

            <ActionButtons
              currentIndex={currentIndex}
              isCurrentDoubtful={isCurrentDoubtful}
              onPrev={handlePrevQuestion}
              onToggleDoubtful={handleToggleDoubtful}
              onSaveAndNext={handleSaveAndNext}
            />
          </div>
        </section>

        {/* Kolom Kanan: Navigation Grid */}
        <NavigationGrid
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          doubtfulQuestions={doubtfulQuestions}
          stats={stats}
          onJumpToQuestion={handleJumpToQuestion}
          onShowFinishModal={() => setShowFinishModal(true)}
        />
      </main>

      {/* Modal Konfirmasi Selesai */}
      {showFinishModal && (
        <FinishModal
          stats={stats}
          formattedTime={formattedTime}
          onCancel={() => setShowFinishModal(false)}
          onConfirm={handleConfirmFinish}
        />
      )}

      {/* Drawer Mobile Grid */}
      {showMobileGrid && (
        <MobileGridDrawer
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          doubtfulQuestions={doubtfulQuestions}
          onJumpToQuestion={handleJumpMobile}
          onClose={() => setShowMobileGrid(false)}
          onShowFinishModal={() => setShowFinishModal(true)}
        />
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
