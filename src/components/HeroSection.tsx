"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowDown,
  MonitorCheck,
  Zap,
  Award,
  BookOpen,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FCF4E7] via-[#F8EDDC] to-[#FCF4E7]">
      {/* Decorative Glows with Brand Orange & Navy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-[#FB6E09]/15 via-[#FDE4CB]/30 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Headline & Value Proposition */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/30 text-xs sm:text-sm font-bold shadow-xs">
              <Zap className="w-4 h-4 text-[#FB6E09] fill-[#FB6E09]" />
              <span>SIKILAT SKB ASN - FR & Kisi-Kisi Resmi Permenpan-RB 2026</span>
            </div>

            {/* Main Headline with Navy Headings & Orange Accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl/tight font-black tracking-tight text-[#042E64]">
              Raih NIP Impianmu Lebih Cepat dengan{" "}
              <span className="text-[#FB6E09] underline decoration-[#FB6E09]/40 underline-offset-4">
                SIKILAT SKB ASN
              </span>{" "}
              Berstandar CAT BKN
            </h1>

            {/* Sub-headline / Copy */}
            <p className="text-base sm:text-lg text-[#042E64]/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Persiapkan Seleksi Kompetensi Bidang (SKB) bersama sistem simulasi ujian CAT kilat, akurat, dan terstruktur. Nikmati bank soal terupdate, analisis kelemahan per materi, dan ranking nasional se-Indonesia secara real-time.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-[#F0DCBE] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#042E64]">Sistem CAT BKN</div>
                  <div className="text-[11px] text-[#042E64]/65">100% Persis Aslinya</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-[#F0DCBE] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#042E64]/10 text-[#042E64] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#042E64]">Timer Kilat</div>
                  <div className="text-[11px] text-[#042E64]/65">Skor & Nilai Instan</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-[#F0DCBE] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#042E64]">Ranking Nasional</div>
                  <div className="text-[11px] text-[#042E64]/65">Ukur Pesaing Formasi</div>
                </div>
              </div>
            </div>

            {/* CTAs with Primary Orange */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#promo-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-extrabold text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 rounded-xl shadow-lg shadow-[#FB6E09]/30 transition-all cursor-pointer"
              >
                <span>Lihat Paket Promo SKB</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-[#042E64] bg-white hover:bg-[#F4E3CB] border-2 border-[#042E64]/20 rounded-xl transition-all shadow-xs"
              >
                <span>Coba Demo Gratis</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-[#042E64]/75">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#FB6E09] text-white flex items-center justify-center text-[10px] font-black border-2 border-[#FCF4E7]">
                  SKB
                </div>
                <div className="w-8 h-8 rounded-full bg-[#042E64] text-white flex items-center justify-center text-[10px] font-black border-2 border-[#FCF4E7]">
                  ASN
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E45E00] text-white flex items-center justify-center text-[10px] font-black border-2 border-[#FCF4E7]">
                  PNS
                </div>
              </div>
              <div>
                <strong className="text-[#042E64]">50.000+ Calon ASN</strong> mempercayakan tryout di SIKILAT SKB ASN
              </div>
            </div>
          </div>

          {/* Right Column: Interactive CAT BKN Simulation Mockup Card (Deep Navy Frame) */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative mx-auto bg-[#042E64] rounded-3xl p-3 sm:p-5 shadow-2xl shadow-[#042E64]/30 border-2 border-[#0B3E84]">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#0B3E84] text-slate-300 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="hidden sm:inline font-mono text-[11px] text-blue-200">
                    SIKILAT SKB ASN - Simulasi CAT BKN
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FB6E09]/20 text-[#FB6E09] font-mono font-black text-xs border border-[#FB6E09]/40">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sisa: 01:28:45</span>
                </div>
              </div>

              {/* Simulation Screen Body */}
              <div className="bg-[#021C3F] rounded-2xl p-4 sm:p-5 border border-[#0B3E84] text-left space-y-4">
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-blue-900/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FB6E09] text-white font-black text-xs">
                      Soal No. 17 / 100
                    </span>
                    <span className="text-blue-200 text-xs hidden xs:inline">SKB Teknis Formasi ASN</span>
                  </div>
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Server BKN Terhubung
                  </span>
                </div>

                {/* Question Body */}
                <div className="text-white text-sm sm:text-base leading-relaxed font-semibold">
                  Berdasarkan UU Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara (ASN), pergeseran konsep manajemen talenta nasional bertujuan utama untuk:
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                  {[
                    { key: "A", text: "Menyeragamkan seluruh tunjangan kinerja daerah tanpa indikator capaian.", active: false },
                    { key: "B", text: "Mewujudkan sistem meritokrasi terintegrasi berbasis kualifikasi, kompetensi, dan kinerja.", active: true },
                    { key: "C", text: "Menghapuskan skema jenjang karier struktural bagi seluruh pejabat fungsional.", active: false },
                    { key: "D", text: "Membatasi mobilitas talenta ASN hanya pada instansi pembina masing-masing.", active: false },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        option.active
                          ? "bg-[#FB6E09]/20 border-[#FB6E09] text-white font-bold"
                          : "bg-[#042E64]/60 border-[#0B3E84] text-blue-100 hover:bg-[#042E64]"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          option.active
                            ? "bg-[#FB6E09] text-white"
                            : "bg-[#0B3E84] text-blue-200"
                        }`}
                      >
                        {option.key}
                      </span>
                      <span className="leading-snug">{option.text}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Mock Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-blue-900/80 text-xs">
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-[#0B3E84] text-blue-200 font-semibold">
                      Sebelumnya
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                      Ragu-ragu
                    </span>
                  </div>
                  <span className="px-4 py-1.5 rounded-lg bg-[#FB6E09] text-white font-black shadow-md shadow-[#FB6E09]/30">
                    Simpan & Lanjut
                  </span>
                </div>
              </div>

              {/* Floating Badge on Card */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#FCF4E7] text-[#042E64] px-4 py-2.5 rounded-2xl shadow-xl border-2 border-[#F0DCBE] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FB6E09] text-white flex items-center justify-center font-bold shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#042E64]">SIKILAT CAT Engine</div>
                  <div className="text-[11px] text-[#FB6E09] font-bold">100% Format Ujian Resmi BKN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
