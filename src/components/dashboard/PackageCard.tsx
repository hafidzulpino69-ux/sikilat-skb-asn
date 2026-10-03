"use client";

import { ReactNode } from "react";

// =========================================================================
// Komponen Common/Shared: PackageCard
// Digunakan di halaman Daftar Paket Anda (my-packages)
// =========================================================================

import {
  Award,
  PlayCircle,
  Sparkles,
  Clock,
  ShieldAlert,
} from "lucide-react";
import type { ExamCardItem, TimeLeftResult } from "@/types";

interface PackageCardProps {
  card: ExamCardItem;
  timeLeft: TimeLeftResult;
  onStartExam: (card: ExamCardItem) => void;
}

export default function PackageCard({ card, timeLeft, onStartExam }: PackageCardProps) {
  const isExpired = timeLeft.isExpired;

  return (
    <div
      className={`bg-white rounded-3xl border-3 transition-all flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-xl ${
        isExpired
          ? "border-slate-300 opacity-85"
          : "border-[#F0DCBE] hover:border-[#FB6E09]/70"
      }`}
    >
      {/* Top Banner Tag */}
      <div
        className={`px-5 py-3 flex items-center justify-between border-b-2 ${
          isExpired
            ? "bg-slate-700 text-slate-200 border-slate-500"
            : "bg-[#042E64] text-white border-[#FB6E09]"
        }`}
      >
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-[#FB6E09]">
          <Sparkles className="w-3.5 h-3.5 fill-[#FB6E09]" />
          Paket {card.examNumber}
        </span>
        <span className="text-[11px] font-bold text-blue-200">
          {card.totalQuestions} Soal • {card.durationMinutes} Menit
        </span>
      </div>

      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#042E64] leading-snug tracking-tight">
              {card.packageTitle}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#042E64]/70 font-medium mt-1">
              Formasi: <span className="text-[#042E64] font-semibold">{card.positionTitle}</span>
            </p>
          </div>

          {/* Hitung Mundur (Masa Berlaku) */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isExpired
                ? "bg-rose-50/80 border-rose-200 text-rose-900"
                : "bg-[#FCF4E7]/70 border-amber-300/70 text-[#042E64]"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold mb-2">
              <span className="flex items-center gap-1.5 text-[#042E64]">
                <Clock
                  className={`w-3.5 h-3.5 ${
                    isExpired ? "text-rose-600" : "text-[#FB6E09] animate-pulse"
                  }`}
                />
                <span>Masa Berlaku:</span>
              </span>

              {isExpired ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-800 uppercase tracking-wider">
                  Waktu Habis
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                  Aktif ({card.validityDays} Hari)
                </span>
              )}
            </div>

            {/* Grid Countdown: Hari, Jam, Menit, Detik */}
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono font-black">
              {[
                { value: timeLeft.days, label: "Hari", isSeconds: false },
                { value: timeLeft.hours, label: "Jam", isSeconds: false },
                { value: timeLeft.minutes, label: "Menit", isSeconds: false },
                { value: timeLeft.seconds, label: "Detik", isSeconds: true },
              ].map((slot) => (
                <div
                  key={slot.label}
                  className={`py-1.5 px-1 rounded-xl border ${
                    isExpired
                      ? "bg-white text-rose-800 border-rose-200"
                      : slot.isSeconds
                      ? "bg-white text-[#FB6E09] border-[#FB6E09]/40"
                      : "bg-white text-[#042E64] border-[#F0DCBE]"
                  }`}
                >
                  <div className="text-sm font-black leading-none">
                    {String(slot.value).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] font-sans font-semibold text-[#042E64]/60 mt-0.5">
                    {slot.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skor & Status */}
        <ScoreDisplay card={card} isExpired={isExpired} />
      </div>

      {/* Tombol Aksi */}
      <div className="p-4 bg-[#FCF4E7]/60 border-t-2 border-[#F0DCBE]">
        {isExpired ? (
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-xl font-black text-sm text-slate-400 bg-slate-200 border-2 border-slate-300 flex items-center justify-center gap-2 cursor-not-allowed select-none shadow-none"
            title="Paket sudah tidak dapat dikerjakan karena masa aktif telah habis"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Paket Hangus</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStartExam(card)}
            className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{card.status === "Selesai" ? "Kerjakan Ujian Lagi" : "Kerjakan Ujian"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// Sub-Komponen: ScoreDisplay (Tampilan Skor & Status)
// =========================================================================
interface ScoreDisplayProps {
  card: ExamCardItem;
  isExpired: boolean;
}

export function ScoreDisplay({ card, isExpired }: ScoreDisplayProps) {
  return (
    <div className="pt-3 border-t border-[#F0DCBE] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-[#FB6E09]" />
        <span className="text-xs font-bold text-[#042E64]/70">Nilai:</span>
        <span className="text-base font-black text-[#FB6E09]">{card.score}</span>
        {card.score > 0 && (
          <span className="text-[10px] text-slate-400 font-bold">/ 500</span>
        )}
      </div>

      {isExpired ? (
        <span className="text-[11px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
          ● Paket Hangus
        </span>
      ) : (
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            card.status === "Selesai"
              ? "text-emerald-700 bg-emerald-100 border-emerald-300"
              : "text-amber-700 bg-amber-100 border-amber-300"
          }`}
        >
          ● {card.status}
        </span>
      )}
    </div>
  );
}
