"use client";

import { Layers, ShieldAlert, X } from "lucide-react";
import type { ExamQuestion, UserAnswersMap, DoubtfulQuestionsMap } from "@/types";

interface MobileGridDrawerProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: UserAnswersMap;
  doubtfulQuestions: DoubtfulQuestionsMap;
  onJumpToQuestion: (index: number) => void;
  onClose: () => void;
  onShowFinishModal: () => void;
}

function getNavBoxStyle(
  questionId: number,
  index: number,
  currentIndex: number,
  answers: UserAnswersMap,
  doubtfulQuestions: DoubtfulQuestionsMap
): string {
  const isCurrent = currentIndex === index;
  const isDoubtful = !!doubtfulQuestions[questionId];
  const hasAnswer = !!answers[questionId];

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
}

export default function MobileGridDrawer({
  questions,
  currentIndex,
  answers,
  doubtfulQuestions,
  onJumpToQuestion,
  onClose,
  onShowFinishModal,
}: MobileGridDrawerProps) {
  return (
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
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const boxStyle = getNavBoxStyle(q.id, idx, currentIndex, answers, doubtfulQuestions);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onJumpToQuestion(idx);
                    onClose();
                  }}
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
              onClose();
              onShowFinishModal();
            }}
            className="w-full py-3 rounded-xl font-black text-sm text-white bg-rose-600 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Selesaikan Ujian</span>
          </button>
        </div>
      </div>
    </div>
  );
}
