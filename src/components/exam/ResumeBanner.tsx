"use client";

import { RotateCcw } from "lucide-react";

interface ResumeBannerProps {
  currentIndex: number;
  formattedTime: string;
  onDismiss: () => void;
}

export default function ResumeBanner({
  currentIndex,
  formattedTime,
  onDismiss,
}: ResumeBannerProps) {
  return (
    <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-xs animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>
            <strong>Sesi Ujian Berhasil Dipulihkan!</strong> Melanjutkan soal No. {currentIndex + 1} dengan sisa waktu {formattedTime}. Jawaban dan status ragu-ragu Anda telah otomatis dimuat kembali.
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-white hover:text-emerald-100 p-1 font-black cursor-pointer text-sm"
          title="Tutup pemberitahuan"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
