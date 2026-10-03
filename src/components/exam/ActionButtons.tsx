"use client";

import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface ActionButtonsProps {
  currentIndex: number;
  isCurrentDoubtful: boolean;
  onPrev: () => void;
  onToggleDoubtful: () => void;
  onSaveAndNext: () => void;
}

export default function ActionButtons({
  currentIndex,
  isCurrentDoubtful,
  onPrev,
  onToggleDoubtful,
  onSaveAndNext,
}: ActionButtonsProps) {
  return (
    <div className="pt-6 mt-6 border-t-2 border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
      {/* Tombol 'Sebelumnya' */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm bg-white text-[#042E64] border-2 border-slate-300 hover:bg-slate-100 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Sebelumnya</span>
      </button>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Tombol 'Ragu-ragu' (Warna Kuning) */}
        <button
          type="button"
          onClick={onToggleDoubtful}
          className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-98 ${
            isCurrentDoubtful
              ? "bg-amber-400 hover:bg-amber-500 text-amber-950 border-2 border-amber-600 ring-2 ring-amber-300"
              : "bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300"
          }`}
          title="Tandai nomor soal ini menjadi ragu-ragu di navigasi grid"
        >
          <AlertTriangle className="w-4 h-4 text-amber-800" />
          <span>{isCurrentDoubtful ? "✓ Sedang Ragu-ragu" : "Ragu-ragu"}</span>
        </button>

        {/* Tombol 'Simpan & Lanjut' (Warna Hijau) */}
        <button
          type="button"
          onClick={onSaveAndNext}
          className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-98 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <span>Simpan &amp; Lanjut</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
