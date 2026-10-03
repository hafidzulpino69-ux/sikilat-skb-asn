// src/hooks/useExamTimer.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { formatCountdown } from "@/utils";

interface UseExamTimerProps {
  initialSeconds: number;
  isFinished: boolean;
  isReady: boolean; // Hanya mulai timer jika session sudah loaded
  onTimeUp: () => void;
}

interface UseExamTimerReturn {
  secondsLeft: number;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  formattedTime: string;
  isWarning: boolean;
}

/**
 * Hook yang mengelola countdown timer ujian CAT BKN.
 * Menghitung mundur dari initialSeconds, trigger callback saat waktu habis.
 */
export function useExamTimer({
  initialSeconds,
  isFinished,
  isReady,
  onTimeUp,
}: UseExamTimerProps): UseExamTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  // Countdown interval 1 detik
  useEffect(() => {
    if (!isReady || isFinished || secondsLeft <= 0) return;

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
  }, [isReady, isFinished, secondsLeft]);

  // Trigger callback saat waktu habis
  useEffect(() => {
    if (isReady && secondsLeft === 0 && !isFinished) {
      onTimeUp();
    }
  }, [isReady, secondsLeft, isFinished, onTimeUp]);

  const formattedTime = useMemo(() => formatCountdown(secondsLeft), [secondsLeft]);
  const isWarning = secondsLeft < 300; // < 5 menit

  return { secondsLeft, setSecondsLeft, formattedTime, isWarning };
}
