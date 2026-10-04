"use client";

import { ShieldAlert, CheckCircle2, AlertTriangle, X } from "lucide-react";
import type { ExamStats } from "@/types";

interface FinishModalProps {
  stats: ExamStats;
  formattedTime: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function FinishModal({
  stats,
  formattedTime,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: FinishModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#042E64]">
                Konfirmasi Selesai Ujian
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pastikan Anda telah memeriksa kembali seluruh lembar jawaban.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringkasan Progres Jawaban */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-bold">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>Sudah Dijawab:</span>
            </span>
            <span className="font-black text-emerald-700 text-sm">
              {stats.answeredCount} Soal
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Ragu-ragu:</span>
            </span>
            <span className="font-black text-amber-700 text-sm">
              {stats.doubtfulCount} Soal
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span>Belum Dijawab:</span>
            </span>
            <span className="font-black text-slate-600 text-sm">
              {stats.unansweredCount} Soal
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[#042E64]">
            <span>Sisa Waktu Ujian:</span>
            <span className="font-black font-mono text-sm text-[#FB6E09]">
              {formattedTime}
            </span>
          </div>
        </div>

        {stats.doubtfulCount > 0 || stats.unansweredCount > 0 ? (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Masih ada <strong>{stats.doubtfulCount + stats.unansweredCount}</strong> butir soal yang ragu-ragu atau belum Anda jawab.
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Seluruh 100 butir soal telah berhasil Anda jawab dengan lengkap!</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lanjutkan Ujian
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan hasil ujian...</span>
              </>
            ) : (
              <span>Ya, Akhiri Ujian</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
