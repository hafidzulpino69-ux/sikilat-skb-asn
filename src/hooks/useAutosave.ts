// src/hooks/useAutosave.ts
import { useState, useEffect, useCallback } from "react";
import type { UserAnswersMap, DoubtfulQuestionsMap, ExamAutosaveSession } from "@/types";
import { loadAutosaveSession, saveAutosaveSession, clearAutosaveSession } from "@/utils";
import { TOTAL_QUESTIONS } from "@/constants";

interface UseAutosaveProps {
  cardId: string;
}

interface RestoredSession {
  secondsLeft: number;
  answers: UserAnswersMap;
  doubtfulQuestions: DoubtfulQuestionsMap;
  currentIndex: number;
}

interface UseAutosaveReturn {
  isSessionLoaded: boolean;
  hasResumed: boolean;
  setHasResumed: React.Dispatch<React.SetStateAction<boolean>>;
  restoredSession: RestoredSession | null;
  saveSession: (data: {
    secondsLeft: number;
    answers: UserAnswersMap;
    doubtfulQuestions: DoubtfulQuestionsMap;
    currentIndex: number;
  }) => void;
  clearSession: () => void;
}

/**
 * Hook khusus untuk sinkronisasi state ujian dengan localStorage.
 * Memeriksa sesi aktif saat mount, menyediakan fungsi simpan & hapus.
 */
export function useAutosave({ cardId }: UseAutosaveProps): UseAutosaveReturn {
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);
  const [restoredSession, setRestoredSession] = useState<RestoredSession | null>(null);

  // Cek sesi aktif saat mount
  useEffect(() => {
    const session = loadAutosaveSession(cardId);

    if (session && typeof session.secondsLeft === "number" && session.secondsLeft > 0) {
      setRestoredSession({
        secondsLeft: session.secondsLeft,
        answers: session.answers || {},
        doubtfulQuestions: session.doubtfulQuestions || {},
        currentIndex:
          typeof session.currentIndex === "number" &&
          session.currentIndex >= 0 &&
          session.currentIndex < TOTAL_QUESTIONS
            ? session.currentIndex
            : 0,
      });
      setHasResumed(true);
    } else if (session) {
      // Sesi rusak atau habis, bersihkan
      clearAutosaveSession(cardId);
    }

    setIsSessionLoaded(true);
  }, [cardId]);

  const saveSession = useCallback(
    (data: {
      secondsLeft: number;
      answers: UserAnswersMap;
      doubtfulQuestions: DoubtfulQuestionsMap;
      currentIndex: number;
    }) => {
      if (data.secondsLeft <= 0) return;
      saveAutosaveSession(cardId, data);
    },
    [cardId]
  );

  const clearSession = useCallback(() => {
    clearAutosaveSession(cardId);
    clearAutosaveSession("default-exam-card");
  }, [cardId]);

  return {
    isSessionLoaded,
    hasResumed,
    setHasResumed,
    restoredSession,
    saveSession,
    clearSession,
  };
}
