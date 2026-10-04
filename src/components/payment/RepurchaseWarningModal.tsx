"use client";

import { AlertTriangle, RotateCcw, X, ShieldAlert, Loader2 } from "lucide-react";

interface RepurchaseWarningModalProps {
  packageName?: string;
  isProcessing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RepurchaseWarningModal({
  packageName,
  isProcessing = false,
  onCancel,
  onConfirm,
}: RepurchaseWarningModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-amber-300 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                Peringatan Pembelian Ulang
              </div>
              <h3 className="text-lg font-black text-[#042E64] leading-tight">
                Paket Sudah Dimiliki
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pesan Utama Sesuai Spesifikasi */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
          {packageName && (
            <div className="text-xs font-black text-[#042E64] uppercase tracking-wide pb-1 border-b border-amber-200/80">
              {packageName}
            </div>
          )}
          <p className="text-xs sm:text-sm font-bold leading-relaxed">
            Paket ini sudah ada di daftar paket Anda. Apakah Anda yakin ingin membelinya lagi dan mereset seluruh progres ujian pada paket ini?
          </p>
        </div>

        {/* Catatan Konsekuensi */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-medium">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <RotateCcw className="w-3.5 h-3.5 text-[#FB6E09]" />
            <span>Konsekuensi Beli Ulang:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] pl-1 text-slate-700">
            <li>Seluruh skor dan riwayat ujian paket ini akan dihapus/direset dari awal.</li>
            <li>Masa aktif paket akan diperpanjang secara penuh sejak hari ini.</li>
          </ul>
        </div>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Ya, Beli &amp; Reset</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
