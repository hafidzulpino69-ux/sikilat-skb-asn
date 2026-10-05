"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DUMMY_EXAM_QUESTIONS } from "@/data/dummyExamQuestions";
import { EXAM_DURATION_SECONDS, TOTAL_QUESTIONS } from "@/constants";
import { useExamTimer, useExamState, useAutosave } from "@/hooks";
import {
  calculateScore,
  loadUserProfile,
  saveLastExamResult,
} from "@/utils";
import { supabase } from "@/utils/supabaseClient";
import type { FontSizePreference } from "@/types";

import {
  ExamHeader,
  QuestionDisplay,
  ActionButtons,
  NavigationGrid,
  FinishModal,
  MobileGridDrawer,
  ResumeBanner,
  ExitWarningModal,
} from "@/components/exam";
import LoadingState from "@/components/LoadingState";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ExamEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameter context
  const cardIdParam = searchParams.get("cardId") || "";
  const packageIdParam = searchParams.get("packageId") || "";
  const packageTitleParam = searchParams.get("packageTitle") || "Paket 1: SKB Formasi";
  const positionParam = searchParams.get("position") || "Petugas Pengelola Barang Bukti";
  const agencyParam = searchParams.get("agency") || "Kejaksaan Republik Indonesia";

  const effectiveCardId = cardIdParam || packageIdParam || "default-exam-card";

  // Supabase package UUID state & Active Ongoing Exam Result ID
  const [resolvedPackageUuid, setResolvedPackageUuid] = useState<string>(
    UUID_REGEX.test(packageIdParam)
      ? packageIdParam
      : UUID_REGEX.test(cardIdParam)
      ? cardIdParam
      : ""
  );
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [isSupabaseSessionReady, setIsSupabaseSessionReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Data Peserta
  const [userName, setUserName] = useState("Peserta Simulasi CAT");

  // UI State
  const [isFinished, setIsFinished] = useState(false);
  const isFinishedRef = useRef(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);
  const [showMobileGrid, setShowMobileGrid] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizePreference>("normal");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questions = DUMMY_EXAM_QUESTIONS;

  // =========================================================================
  // Resolve UUID paket dari Supabase jika belum berbentuk UUID
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    async function resolvePackageUuid() {
      if (UUID_REGEX.test(packageIdParam)) {
        setResolvedPackageUuid(packageIdParam);
        return;
      }
      if (UUID_REGEX.test(cardIdParam)) {
        setResolvedPackageUuid(cardIdParam);
        return;
      }

      try {
        const targetNumber =
          cardIdParam.includes("2") || packageTitleParam.includes("Paket 2")
            ? 2
            : cardIdParam.includes("3") || packageTitleParam.includes("Paket 3")
            ? 3
            : 1;

        const { data } = await supabase
          .from("packages")
          .select("id")
          .eq("package_number", targetNumber)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (isMounted && data?.id) {
          setResolvedPackageUuid(data.id);
        }
      } catch {
        // Abaikan error resolving jika terjadi kegagalan jaringan
      }
    }

    resolvePackageUuid();
    return () => {
      isMounted = false;
    };
  }, [cardIdParam, packageIdParam, packageTitleParam]);

  // =========================================================================
  // HOOK 1: Autosave & Resume (localStorage fallback)
  // =========================================================================
  const {
    isSessionLoaded,
    hasResumed,
    setHasResumed,
    restoredSession,
    saveSession,
    clearSession,
  } = useAutosave({ cardId: effectiveCardId });

  // =========================================================================
  // HOOK 2: Exam State (Jawaban, Navigasi, Statistik)
  // =========================================================================
  const {
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswers,
    doubtfulQuestions,
    setDoubtfulQuestions,
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
  // HOOK 3: Timer Countdown
  // =========================================================================
  const onTimeUpRef = useRef<() => void>(() => {});

  const { secondsLeft, setSecondsLeft, formattedTime, isWarning } = useExamTimer({
    initialSeconds: restoredSession?.secondsLeft ?? EXAM_DURATION_SECONDS,
    isFinished,
    isReady: isSessionLoaded && isSupabaseSessionReady,
    onTimeUp: () => onTimeUpRef.current(),
  });

  // =========================================================================
  // INISIALISASI SESI UJIAN SUPABASE & RESTORE SAAT F5/REFRESH (Bug 3)
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    async function initOrRestoreSupabaseSession() {
      if (!resolvedPackageUuid) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Jika tidak login, alihkan
          router.push(`/login?redirect=/exam?packageId=${resolvedPackageUuid}`);
          return;
        }

        // VALIDASI KEPEMILIKAN PAKET (Security Guard: Cegah manipulasi URL)
        // User wajib memiliki paket aktif di user_packages (kecuali admin)
        const isAdmin =
          user.email === "adminsikilatskb@gmail.com" ||
          user.user_metadata?.role === "admin";

        if (!isAdmin) {
          const { data: userPkg } = await supabase
            .from("user_packages")
            .select("id, expires_at")
            .eq("user_id", user.id)
            .eq("package_id", resolvedPackageUuid)
            .maybeSingle();

          if (!userPkg) {
            router.push("/my-packages");
            return;
          }

          const isExpired = userPkg.expires_at
            ? new Date(userPkg.expires_at).getTime() <= Date.now()
            : false;
          if (isExpired) {
            router.push("/my-packages");
            return;
          }
        }

        // Cari sesi ujian aktif yang belum selesai (is_finished = false) di Supabase
        const { data: ongoingSession } = await supabase
          .from("exam_results")
          .select("*")
          .eq("package_id", resolvedPackageUuid)
          .eq("user_id", user.id)
          .eq("is_finished", false)
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (ongoingSession && isMounted) {
          // RESTORE DATA DARI SUPABASE (F5 / Refresh Handled)
          setActiveResultId(ongoingSession.id);

          if (ongoingSession.user_answers && Object.keys(ongoingSession.user_answers).length > 0) {
            setAnswers(ongoingSession.user_answers);
          }
          if (ongoingSession.doubtful_answers && Object.keys(ongoingSession.doubtful_answers).length > 0) {
            setDoubtfulQuestions(ongoingSession.doubtful_answers);
          }
          if (typeof ongoingSession.current_index === "number") {
            setCurrentIndex(ongoingSession.current_index);
          }
          if (typeof ongoingSession.seconds_left === "number" && ongoingSession.seconds_left > 0) {
            setSecondsLeft(ongoingSession.seconds_left);
          }

          setHasResumed(true);
        } else if (isMounted) {
          // BUAT SESI BARU DI SUPABASE DENGAN is_finished = false
          const { data: newSession } = await supabase
            .from("exam_results")
            .insert([
              {
                package_id: resolvedPackageUuid,
                user_id: user.id,
                score: 0,
                correct_count: 0,
                wrong_count: 0,
                unanswered_count: TOTAL_QUESTIONS,
                time_spent_seconds: 0,
                seconds_left: EXAM_DURATION_SECONDS,
                current_index: 0,
                user_answers: {},
                doubtful_answers: {},
                is_finished: false,
                completed_at: new Date().toISOString(),
              },
            ])
            .select("id")
            .single();

          if (newSession) {
            setActiveResultId(newSession.id);
          }
        }
      } catch {
        // Fallback hening untuk keamanan produksi
      } finally {
        if (isMounted) setIsSupabaseSessionReady(true);
      }
    }

    initOrRestoreSupabaseSession();

    return () => {
      isMounted = false;
    };
  }, [resolvedPackageUuid, router, setAnswers, setCurrentIndex, setDoubtfulQuestions, setHasResumed, setSecondsLeft]);

  // =========================================================================
  // REAL-TIME DEBOUNCED AUTOSAVE KE SUPABASE (UPDATE SETIAP PERUBAHAN JAWABAN)
  // =========================================================================
  useEffect(() => {
    if (!activeResultId || !isSupabaseSessionReady || isFinished || secondsLeft <= 0) return;

    // Simpan juga ke localStorage sebagai cache offline
    saveSession({ secondsLeft, answers, doubtfulQuestions, currentIndex });

    // Debounce 1000ms untuk update ke Supabase agar hemat request tapi tetap real-time
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await supabase
          .from("exam_results")
          .update({
            user_answers: answers,
            doubtful_answers: doubtfulQuestions,
            current_index: currentIndex,
            seconds_left: secondsLeft,
            time_spent_seconds: Math.max(0, EXAM_DURATION_SECONDS - secondsLeft),
            completed_at: new Date().toISOString(),
          })
          .eq("id", activeResultId);
      } catch {
        // Fallback hening untuk autosave background
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    activeResultId,
    isSupabaseSessionReady,
    isFinished,
    secondsLeft,
    answers,
    doubtfulQuestions,
    currentIndex,
    saveSession,
  ]);

  // =========================================================================
  // HANDLER: Selesaikan Ujian (Finalisasi status is_finished = true di Supabase)
  // =========================================================================
  const handleConfirmFinish = useCallback(
    async (redirectTo: string = "/exam/result") => {
      try {
        setIsSubmitting(true);

        const scoreResult = calculateScore(questions, answers);
        const timeSpentSeconds = Math.max(0, EXAM_DURATION_SECONDS - secondsLeft);
        const targetUuid = resolvedPackageUuid;

        let highestScore = scoreResult.score;
        let previousHighest = 0;

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (targetUuid && currentUser) {
          // 1. Ambil rekap skor paket sebelumnya dari view package_score_summary
          const { data: prevSummary } = await supabase
            .from("package_score_summary")
            .select("highest_score")
            .eq("package_id", targetUuid)
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (prevSummary) {
            previousHighest = Number(prevSummary.highest_score) || 0;
          }

          // 2. Finalisasi baris sesi ujian aktif di tabel exam_results Supabase
          if (activeResultId) {
            const { error: updateError } = await supabase
              .from("exam_results")
              .update({
                score: scoreResult.score,
                correct_count: scoreResult.correctCount,
                wrong_count: scoreResult.wrongCount,
                unanswered_count: scoreResult.unansweredCount,
                time_spent_seconds: timeSpentSeconds,
                seconds_left: 0,
                user_answers: answers,
                doubtful_answers: doubtfulQuestions,
                is_finished: true,
                completed_at: new Date().toISOString(),
              })
              .eq("id", activeResultId);
          } else {
            // Fallback jika activeResultId tidak ada
            await supabase.from("exam_results").insert([
              {
                package_id: targetUuid,
                user_id: currentUser.id,
                score: scoreResult.score,
                correct_count: scoreResult.correctCount,
                wrong_count: scoreResult.wrongCount,
                unanswered_count: scoreResult.unansweredCount,
                time_spent_seconds: timeSpentSeconds,
                seconds_left: 0,
                user_answers: answers,
                doubtful_answers: doubtfulQuestions,
                is_finished: true,
                completed_at: new Date().toISOString(),
              },
            ]);
          }

          // 3. Ambil ringkasan nilai tertinggi terbaru yang teragregasi di view
          const { data: updatedSummary } = await supabase
            .from("package_score_summary")
            .select("highest_score")
            .eq("package_id", targetUuid)
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (updatedSummary) {
            highestScore = Number(updatedSummary.highest_score) || scoreResult.score;
          }
        }

        // Hapus autosave session lokal paket ini
        clearSession();

        // Simpan rekap ujian untuk halaman /exam/result & /pembahasan
        saveLastExamResult({
          cardId: targetUuid || effectiveCardId,
          packageId: targetUuid || effectiveCardId,
          packageTitle: packageTitleParam,
          positionTitle: positionParam,
          agencyName: agencyParam,
          score: scoreResult.score,
          highestScore: Math.max(highestScore, scoreResult.score),
          previousHighest,
          maxScore: scoreResult.maxScore,
          totalQuestions: TOTAL_QUESTIONS,
          correctCount: scoreResult.correctCount,
          wrongCount: scoreResult.wrongCount,
          unansweredCount: scoreResult.unansweredCount,
          timeSpentSeconds,
          completedAt: new Date().toISOString(),
          userAnswers: answers,
          doubtfulQuestions,
        });

        setIsFinished(true);
        isFinishedRef.current = true;
        setShowFinishModal(false);
        setShowExitWarningModal(false);
        router.push(redirectTo);
      } catch {
        setIsFinished(true);
        isFinishedRef.current = true;
        setShowFinishModal(false);
        setShowExitWarningModal(false);
        router.push(redirectTo);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      questions,
      answers,
      doubtfulQuestions,
      resolvedPackageUuid,
      effectiveCardId,
      packageTitleParam,
      positionParam,
      agencyParam,
      activeResultId,
      clearSession,
      router,
      secondsLeft,
    ]
  );

  // Handler keluar dari pop-up peringatan navigasi (redirect ke /my-packages)
  const handleConfirmExit = useCallback(() => {
    void handleConfirmFinish("/my-packages");
  }, [handleConfirmFinish]);

  // Sinkronisasi status selesai ke ref agar selalu segar di event listener
  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  // =========================================================================
  // NAVIGATION GUARD: Cegah Tombol Back Browser & Buka ExitWarningModal
  // =========================================================================
  useEffect(() => {
    // 1. Kunci tumpukan riwayat (history stack) dengan kombinasi replaceState lalu pushState
    // Menjamin halaman saat ini menjadi jebakan yang valid bahkan setelah browser di-refresh/reload
    window.history.replaceState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // 2. Jika !isFinished, selalu pasang ulang jebakan dengan pushState lagi sebelum menampilkan modal
      if (!isFinishedRef.current) {
        window.history.pushState(null, "", window.location.href);
        setShowExitWarningModal(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // =========================================================================
  // BEFOREUNLOAD GUARD: Peringatan browser saat user ingin menutup tab/window
  // =========================================================================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFinishedRef.current) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Hubungkan onTimeUpRef ke handleConfirmFinish
  useEffect(() => {
    onTimeUpRef.current = () => void handleConfirmFinish("/exam/result");
  }, [handleConfirmFinish]);

  // Profil pengguna
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile?.name) setUserName(profile.name);
  }, []);

  // Wrapped handlers
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

  // Loading State
  if (!isSessionLoaded || !isSupabaseSessionReady) {
    return (
      <LoadingState
        fullScreen
        backgroundClassName="bg-[#F4F6F9]"
        message="Menyiapkan lembar ujian CAT..."
      />
    );
  }

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

      {/* 1. STICKY TOP HEADER */}
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
        onToggleFontSize={() =>
          setFontSize((prev) => (prev === "normal" ? "large" : "normal"))
        }
        onOpenMobileGrid={() => setShowMobileGrid(true)}
      />

      {/* 2. MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Soal, Opsi Jawaban, Tombol Aksi */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-7 min-h-[520px] flex flex-col justify-between">
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

        {/* Kolom Kanan: Grid Navigasi 1-100 */}
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

      {/* MODAL KONFIRMASI AKHIRI UJIAN */}
      {showFinishModal && (
        <FinishModal
          stats={stats}
          formattedTime={formattedTime}
          isSubmitting={isSubmitting}
          onCancel={() => setShowFinishModal(false)}
          onConfirm={() => void handleConfirmFinish("/exam/result")}
        />
      )}

      {/* MODAL PERINGATAN KELUAR & SELESAIKAN UJIAN (NAVIGATION GUARD) */}
      {showExitWarningModal && (
        <ExitWarningModal
          stats={stats}
          isSubmitting={isSubmitting}
          onCancel={() => setShowExitWarningModal(false)}
          onConfirm={handleConfirmExit}
        />
      )}

      {/* DRAWER NAVIGASI GRID UNTUK MOBILE */}
      {showMobileGrid && (
        <MobileGridDrawer
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          doubtfulQuestions={doubtfulQuestions}
          onJumpToQuestion={handleJumpMobile}
          onClose={() => setShowMobileGrid(false)}
          onShowFinishModal={() => {
            setShowMobileGrid(false);
            setShowFinishModal(true);
          }}
        />
      )}
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <LoadingState
          fullScreen
          backgroundClassName="bg-[#F4F6F9]"
          message="Menyiapkan lembar ujian CAT..."
        />
      }
    >
      <ExamEngineContent />
    </Suspense>
  );
}
