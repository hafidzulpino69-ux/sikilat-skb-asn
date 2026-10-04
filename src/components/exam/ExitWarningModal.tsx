"use client";

import { AlertOctagon, X, ArrowLeft, ShieldAlert } from "lucide-react";
import type { ExamStats } from "@/types";

interface ExitWarningModalProps {
  stats?: ExamStats;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ExitWarningModal({
  stats,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: ExitWarningModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-rose-300 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-rose-600">
                Peringatan Navigasi CAT
              </div>
              <h3 className="text-lg font-black text-[#042E64] leading-tight">
                Keluar dari Sesi Ujian?
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pesan Tegas Sesuai Spesifikasi */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
          <p className="text-xs sm:text-sm font-bold leading-relaxed">
            Apakah Anda yakin ingin keluar dan <strong>MENYELESAIKAN</strong> ujian ini? Ujian yang sudah diselesaikan akan langsung dinilai dan tidak dapat diubah kembali.
          </p>
        </div>

        {/* Ringkasan Progres Singkat Jika Ada */}
        {stats && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span>Progres Jawaban:</span>
              <span className="text-emerald-700 font-black">
                {stats.answeredCount} dari {stats.totalCount} Soal Terjawab
              </span>
            </div>
            {stats.unansweredCount + stats.doubtfulCount > 0 && (
              <div className="flex items-center justify-between text-amber-800 text-[11px]">
                <span>Belum Yakin / Kosong:</span>
                <span className="font-black">
                  {stats.unansweredCount + stats.doubtfulCount} Soal
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-slate-500 font-medium">
          Jika Anda menekan tombol merah di bawah, lembar jawaban Anda saat ini akan segera difinalisasi ke sistem dan Anda akan dialihkan kembali ke halaman <strong>Daftar Paket</strong>.
        </p>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 active:scale-98 transition-all shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Ya, Selesaikan Ujian</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
