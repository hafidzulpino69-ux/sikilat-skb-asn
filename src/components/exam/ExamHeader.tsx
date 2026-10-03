"use client";

import { Clock, Layers, User, Briefcase, Building, Maximize2, Minimize2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import type { FontSizePreference } from "@/types";

interface ExamHeaderProps {
  packageTitle: string;
  positionTitle: string;
  agencyName: string;
  userName: string;
  currentIndex: number;
  totalQuestions: number;
  formattedTime: string;
  isWarning: boolean;
  fontSize: FontSizePreference;
  onToggleFontSize: () => void;
  onOpenMobileGrid: () => void;
}

export default function ExamHeader({
  packageTitle,
  positionTitle,
  agencyName,
  userName,
  currentIndex,
  totalQuestions,
  formattedTime,
  isWarning,
  fontSize,
  onToggleFontSize,
  onOpenMobileGrid,
}: ExamHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Logo & Judul Sistem */}
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" inverted />
          <div className="hidden md:block h-8 w-[1px] bg-blue-300/30" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#FB6E09]">
              Sistem CAT BKN Simulasi Mandiri
            </div>
            <div className="text-xs sm:text-sm font-black text-white leading-tight truncate max-w-xs md:max-w-md">
              {packageTitle}
            </div>
          </div>
        </div>

        {/* Indikator Tengah: Soal No. [X] dari 100 */}
        <div className="flex items-center gap-2 bg-[#0B3E84] px-3.5 py-1.5 rounded-xl border border-blue-400/30 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-blue-200 hidden xs:inline">
            Indikator:
          </span>
          <span className="text-xs sm:text-sm font-black text-white">
            Soal No. <strong className="text-[#FB6E09] text-sm sm:text-base">{currentIndex + 1}</strong> dari {totalQuestions}
          </span>
        </div>

        {/* Sisa Waktu & Status Autosave */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indikator Autosave Aktif */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/70 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autosave Aktif</span>
          </div>

          {/* Sisa Waktu (Countdown Timer) */}
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono border-2 shadow-inner transition-colors ${
              isWarning
                ? "bg-rose-600/90 text-white border-rose-400 animate-pulse"
                : "bg-white text-[#042E64] border-amber-400"
            }`}
          >
            <Clock
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isWarning ? "text-white" : "text-[#FB6E09]"
              }`}
            />
            <div className="text-right">
              <div className="text-[9px] uppercase font-sans font-bold tracking-wider opacity-75 hidden sm:block leading-none">
                Sisa Waktu
              </div>
              <div className="text-sm sm:text-lg font-black tracking-wider leading-none">
                {formattedTime}
              </div>
            </div>
          </div>

          {/* Tombol Akses Grid di Mobile */}
          <button
            type="button"
            onClick={onOpenMobileGrid}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
            title="Buka Navigasi Nomor Soal"
          >
            <Layers className="w-5 h-5 text-[#FB6E09]" />
          </button>
        </div>
      </div>

      {/* Sub-Header Metadata Peserta & Formasi */}
      <div className="bg-[#03234d] px-3 sm:px-6 lg:px-8 py-1.5 text-[11px] text-blue-100/90 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FB6E09]" />
            <span>Peserta: <strong className="text-white font-semibold">{userName}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
            <span>Formasi: <strong className="text-white font-semibold">{positionTitle}</strong></span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#FB6E09]" />
            <span>Instansi: <strong className="text-white font-semibold">{agencyName}</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-blue-300 hidden sm:inline">Ukuran Teks:</span>
          <button
            type="button"
            onClick={onToggleFontSize}
            className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-[10px] font-bold text-white border border-blue-700/50 flex items-center gap-1 cursor-pointer"
          >
            {fontSize === "normal" ? (
              <>
                <Maximize2 className="w-2.5 h-2.5" />
                <span>Perbesar Font</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-2.5 h-2.5" />
                <span>Font Normal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
