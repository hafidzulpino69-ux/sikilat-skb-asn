// src/types/exam.types.ts

/** Kunci opsi jawaban CAT BKN */
export type AnswerKey = "A" | "B" | "C" | "D" | "E";

/** Opsi jawaban individual */
export interface QuestionOption {
  key: AnswerKey;
  text: string;
}

/** Butir soal ujian CAT */
export interface ExamQuestion {
  id: number;
  questionNumber: number;
  category: string;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: AnswerKey;
  explanation: string;
}

/** Map jawaban peserta: questionId -> kunci yang dipilih */
export type UserAnswersMap = Record<number, AnswerKey>;

/** Map soal ragu-ragu: questionId -> boolean */
export type DoubtfulQuestionsMap = Record<number, boolean>;

/** Statistik jawaban real-time saat ujian berlangsung */
export interface ExamStats {
  answeredCount: number;
  doubtfulCount: number;
  unansweredCount: number;
  totalCount: number;
}

/** Data sesi autosave yang disimpan ke localStorage */
export interface ExamAutosaveSession {
  cardId: string;
  secondsLeft: number;
  answers: UserAnswersMap;
  doubtfulQuestions: DoubtfulQuestionsMap;
  currentIndex: number;
  lastSavedAt: string;
}

/** Hasil ujian terakhir (disimpan ke localStorage untuk /exam/result & /pembahasan) */
export interface LastExamResult {
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
  userAnswers: UserAnswersMap;
  doubtfulQuestions?: DoubtfulQuestionsMap;
}

/** Rekaman skor per kartu paket (skor tertinggi, riwayat) */
export interface PackageScoreRecord {
  highestScore: number;
  lastScore: number;
  attempts: number;
  status: string;
  lastCompletedAt: string;
}

/** Map skor seluruh paket */
export type PackageScoresMap = Record<string, PackageScoreRecord>;

/** Filter jenis soal di halaman pembahasan */
export type QuestionFilterType = "all" | "wrong" | "correct" | "unanswered";

/** Ukuran font teks soal */
export type FontSizePreference = "normal" | "large";
