"use client";

import { Layers, ShieldAlert } from "lucide-react";
import type { ExamQuestion, UserAnswersMap, DoubtfulQuestionsMap, ExamStats } from "@/types";

interface NavigationGridProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: UserAnswersMap;
  doubtfulQuestions: DoubtfulQuestionsMap;
  stats: ExamStats;
  onJumpToQuestion: (index: number) => void;
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

export default function NavigationGrid({
  questions,
  currentIndex,
  answers,
  doubtfulQuestions,
  stats,
  onJumpToQuestion,
  onShowFinishModal,
}: NavigationGridProps) {
  return (
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

        {/* Legenda Warna Kotak Navigasi */}
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
              const boxStyle = getNavBoxStyle(q.id, idx, currentIndex, answers, doubtfulQuestions);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onJumpToQuestion(idx)}
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

      {/* Tombol 'Selesaikan Ujian' (Warna Merah) */}
      <div className="pt-4 mt-4 border-t-2 border-slate-200">
        <button
          type="button"
          onClick={onShowFinishModal}
          className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 active:scale-98 transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Selesaikan Ujian</span>
        </button>
      </div>
    </aside>
  );
}
