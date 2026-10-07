"use client";

import {
  Check,
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from "lucide-react";
import type { ExamQuestion, AnswerKey, UserAnswersMap } from "@/types";

// =========================================================================
// DiscussionItem: Kartu soal pembahasan individual
// Digunakan di halaman /pembahasan
// =========================================================================

interface DiscussionItemProps {
  question: ExamQuestion;
  userAnswer?: AnswerKey;
}

/**
 * Smart Preprocessor (Regex) untuk merapikan teks pembahasan CAT.
 * Otomatis menyisipkan newline (\n) jika huruf A, B, C, D, atau E kapital
 * muncul setelah tanda titik (baik berdempetan '.A ' maupun dengan spasi/titik '. A ' / '.A. ').
 */
function formatExplanation(rawText?: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  // Sisipkan newline (\n) sebelum opsi A-E setelah titik
  const preprocessed = rawText.replace(/\.\s*([A-E])(?=[\s.:\-)])/g, ".\n$1");

  return preprocessed
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function DiscussionItem({ question, userAnswer }: DiscussionItemProps) {
  const isCorrect = userAnswer === question.correctAnswer;
  const isUnanswered = !userAnswer;
  const explanationLines = formatExplanation(question.explanation);

  return (
    <div className="space-y-5">
      {/* Header Soal */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl font-black text-sm bg-[#042E64] text-white">
            Soal No. {question.questionNumber}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-[#042E64] border border-blue-200">
            {question.category}
          </span>
        </div>

        <div>
          {isCorrect ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
              <span>Jawaban Anda Benar (+5 Poin)</span>
            </span>
          ) : isUnanswered ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Tidak Dijawab (0 Poin)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
              <X className="w-3.5 h-3.5 stroke-[3] text-rose-600" />
              <span>Jawaban Anda Salah (0 Poin)</span>
            </span>
          )}
        </div>
      </div>

      {/* Teks Soal */}
      <div className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
        {question.questionText}
      </div>

      {/* 5 Opsi Jawaban dengan Indikator Visual */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pilihan Jawaban &amp; Kunci Resmi:
        </div>

        {question.options.map((opt) => {
          const isUserChoice = userAnswer === opt.key;
          const isCorrectKey = question.correctAnswer === opt.key;

          let borderBg = "bg-white border-slate-200 text-slate-700";
          let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

          if (isCorrectKey) {
            borderBg = "bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
            badgeStyle = "bg-emerald-600 text-white font-black border-emerald-700";
          } else if (isUserChoice && !isCorrectKey) {
            borderBg = "bg-rose-50/80 border-rose-400 text-rose-950 font-semibold ring-2 ring-rose-300";
            badgeStyle = "bg-rose-600 text-white font-black border-rose-700";
          }

          return (
            <div
              key={opt.key}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${borderBg}`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border ${badgeStyle}`}
              >
                {opt.key}
              </div>

              <div className="flex-1 text-xs sm:text-sm leading-snug pt-0.5 font-medium">
                {opt.text}
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs font-black">
                {isUserChoice && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] shadow-2xs ${
                      isCorrectKey
                        ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                        : "bg-rose-200 text-rose-900 border border-rose-400"
                    }`}
                  >
                    {isCorrectKey ? "✓ Jawaban Anda (Benar)" : "✕ Jawaban Anda (Salah)"}
                  </span>
                )}

                {isCorrectKey && !isUserChoice && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                    ★ Kunci Jawaban Benar
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* KOTAK PENJELASAN PEMBAHASAN */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 text-blue-950 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#042E64]">
          <Lightbulb className="w-4 h-4 text-[#FB6E09]" />
          <span>Kunci Jawaban: {question.correctAnswer} • Penjelasan Pembahasan:</span>
        </div>
        {explanationLines.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 italic">
            Belum ada pembahasan detail untuk butir soal ini.
          </p>
        ) : explanationLines.length > 1 ? (
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
            {explanationLines.map((line, idx) => (
              <li key={idx} className="pl-1">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
            {explanationLines[0]}
          </p>
        )}
      </div>
    </div>
  );
}
