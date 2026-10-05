// src/utils/scoreCalculator.ts
import type { ExamQuestion, UserAnswersMap } from "@/types";
import { POINTS_PER_CORRECT, POINTS_PER_WRONG, MAX_SCORE } from "@/constants";

export interface ScoreResult {
  score: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}

/**
 * Menghitung skor ujian berdasarkan jawaban peserta.
 * 1 soal benar = 5 poin, salah/kosong = 0 poin. Maks 500.
 */
export function calculateScore(
  questions: ExamQuestion[],
  userAnswers: UserAnswersMap
): ScoreResult {
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const userAns = userAnswers[q.id];
    if (!userAns) {
      unansweredCount++;
    } else if (userAns === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const computedMax = questions.length > 0 ? questions.length * POINTS_PER_CORRECT : MAX_SCORE;

  return {
    score: correctCount * POINTS_PER_CORRECT,
    maxScore: computedMax,
    correctCount,
    wrongCount,
    unansweredCount,
  };
}

/**
 * Menentukan skor tertinggi antara skor lama dan skor baru.
 */
export function resolveHighestScore(previousHighest: number, newScore: number): number {
  return Math.max(previousHighest, newScore);
}

/**
 * Memeriksa apakah skor memenuhi passing grade.
 */
export function isPassingGrade(score: number, threshold: number = 350): boolean {
  return score >= threshold;
}
