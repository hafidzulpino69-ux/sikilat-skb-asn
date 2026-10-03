"use client";

import { AlertTriangle, Check } from "lucide-react";
import type { ExamQuestion, AnswerKey, FontSizePreference } from "@/types";

interface QuestionDisplayProps {
  question: ExamQuestion;
  currentIndex: number;
  selectedOption?: AnswerKey;
  isDoubtful: boolean;
  fontSize: FontSizePreference;
  onSelectOption: (key: AnswerKey) => void;
}

export default function QuestionDisplay({
  question,
  currentIndex,
  selectedOption,
  isDoubtful,
  fontSize,
  onSelectOption,
}: QuestionDisplayProps) {
  return (
    <div className="space-y-5">
      {/* Header Soal: Nomor, Kategori, Status Ragu */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl font-black text-sm sm:text-base bg-[#042E64] text-white">
            Soal No. {currentIndex + 1}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-[#042E64] border border-blue-200">
            {question.category}
          </span>
        </div>

        {isDoubtful && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Ditandai Ragu-ragu</span>
          </span>
        )}
      </div>

      {/* Teks Soal */}
      <div
        className={`text-slate-800 leading-relaxed font-medium transition-all ${
          fontSize === "large" ? "text-base sm:text-lg" : "text-sm sm:text-base"
        }`}
      >
        {question.questionText}
      </div>

      {/* Opsi Jawaban (A, B, C, D, E) */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pilih Salah Satu Jawaban:
        </div>

        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;

          return (
            <div
              key={opt.key}
              onClick={() => onSelectOption(opt.key)}
              className={`group p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? "bg-blue-50/80 border-[#042E64] shadow-xs text-[#042E64]"
                  : "bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800"
              }`}
            >
              {/* Lingkaran Radio Opsi */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#042E64] text-white ring-2 ring-[#042E64]/30"
                    : "bg-slate-100 text-slate-700 group-hover:bg-[#FB6E09]/15 group-hover:text-[#FB6E09] border border-slate-300"
                }`}
              >
                {opt.key}
              </div>

              {/* Teks Opsi Jawaban */}
              <div
                className={`flex-1 pt-0.5 leading-snug font-medium transition-all ${
                  fontSize === "large" ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                } ${isSelected ? "font-bold text-[#042E64]" : "text-slate-700"}`}
              >
                {opt.text}
              </div>

              {/* Tanda Centang jika terpilih */}
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
