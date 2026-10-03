// src/constants/exam.constants.ts

/** Total butir soal dalam satu paket ujian CAT BKN */
export const TOTAL_QUESTIONS = 100;

/** Durasi ujian dalam detik: 90 Menit = 5400 Detik */
export const EXAM_DURATION_SECONDS = 90 * 60;

/** Durasi ujian dalam menit */
export const EXAM_DURATION_MINUTES = 90;

/** Poin per jawaban benar */
export const POINTS_PER_CORRECT = 5;

/** Poin per jawaban salah / kosong */
export const POINTS_PER_WRONG = 0;

/** Total nilai maksimal */
export const MAX_SCORE = TOTAL_QUESTIONS * POINTS_PER_CORRECT; // 500

/** Ambang batas passing grade */
export const PASSING_GRADE = 350;

/** Batas detik sebelum timer berkedip merah (5 menit) */
export const TIMER_WARNING_THRESHOLD_SECONDS = 300;
