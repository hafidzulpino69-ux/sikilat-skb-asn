// src/hooks/useExamState.ts
import { useState, useMemo, useCallback } from "react";
import type { AnswerKey, UserAnswersMap, DoubtfulQuestionsMap, ExamStats, ExamQuestion } from "@/types";

interface UseExamStateProps {
  questions: ExamQuestion[];
  initialAnswers?: UserAnswersMap;
  initialDoubtful?: DoubtfulQuestionsMap;
  initialIndex?: number;
  isFinished: boolean;
  totalQuestions: number;
}

interface UseExamStateReturn {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  answers: UserAnswersMap;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswersMap>>;
  doubtfulQuestions: DoubtfulQuestionsMap;
  setDoubtfulQuestions: React.Dispatch<React.SetStateAction<DoubtfulQuestionsMap>>;
  stats: ExamStats;
  currentQuestion: ExamQuestion;
  currentSelectedOption: AnswerKey | undefined;
  isCurrentDoubtful: boolean;
  handleSelectOption: (key: AnswerKey) => void;
  handleToggleDoubtful: () => void;
  handlePrevQuestion: () => void;
  handleSaveAndNext: () => boolean; // returns true if on last question
  handleJumpToQuestion: (index: number) => void;
}

/**
 * Hook yang mengelola seluruh state jawaban, navigasi, dan statistik ujian.
 */
export function useExamState({
  questions,
  initialAnswers = {},
  initialDoubtful = {},
  initialIndex = 0,
  isFinished,
  totalQuestions,
}: UseExamStateProps): UseExamStateReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [answers, setAnswers] = useState<UserAnswersMap>(initialAnswers);
  const [doubtfulQuestions, setDoubtfulQuestions] = useState<DoubtfulQuestionsMap>(initialDoubtful);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentSelectedOption = answers[currentQuestion.id];
  const isCurrentDoubtful = !!doubtfulQuestions[currentQuestion.id];

  // Statistik jawaban real-time
  const stats = useMemo<ExamStats>(() => {
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

    return { answeredCount, doubtfulCount, unansweredCount, totalCount: questions.length };
  }, [answers, doubtfulQuestions, questions]);

  const handleSelectOption = useCallback((key: AnswerKey) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }));
  }, [isFinished, currentQuestion.id]);

  const handleToggleDoubtful = useCallback(() => {
    if (isFinished) return;
    setDoubtfulQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  }, [isFinished, currentQuestion.id]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleSaveAndNext = useCallback((): boolean => {
    if (isFinished) return false;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      return false;
    }
    return true; // at last question, caller should show finish modal
  }, [isFinished, currentIndex, totalQuestions]);

  const handleJumpToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
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
    handleSelectOption,
    handleToggleDoubtful,
    handlePrevQuestion,
    handleSaveAndNext,
    handleJumpToQuestion,
  };
}
