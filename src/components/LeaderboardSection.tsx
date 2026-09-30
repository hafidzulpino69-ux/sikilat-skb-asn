"use client";

import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Flame,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  maxScore: number;
  position: string;
  agency: string;
  agencyShort: string;
  accuracy: string;
  timeSpent: string;
  verified: boolean;
}

const TOP_FIVE_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Budi S*******",
    score: 465,
    maxScore: 500,
    position: "Analis Kebijakan Ahli Pertama",
    agency: "Kementerian Keuangan RI",
    agencyShort: "Kemenkeu",
    accuracy: "96.4%",
    timeSpent: "74 Menit",
    verified: true,
  },
  {
    rank: 2,
    name: "Rina W*********",
    score: 452,
    maxScore: 500,
    position: "Petugas Pengelola Barang Bukti",
    agency: "Kejaksaan Republik Indonesia",
    agencyShort: "Kejaksaan RI",
    accuracy: "94.0%",
    timeSpent: "78 Menit",
    verified: true,
  },
  {
    rank: 3,
    name: "Muhammad A********",
    score: 445,
    maxScore: 500,
    position: "Epidemiolog Kesehatan Ahli Pertama",
    agency: "Kementerian Kesehatan RI",
    agencyShort: "Kemenkes",
    accuracy: "92.5%",
    timeSpent: "81 Menit",
    verified: true,
  },
  {
    rank: 4,
    name: "Siti N**********",
    score: 438,
    maxScore: 500,
    position: "Pranata Komputer Ahli Pertama",
    agency: "Badan Kepegawaian Negara",
    agencyShort: "BKN RI",
    accuracy: "90.8%",
    timeSpent: "84 Menit",
    verified: true,
  },
  {
    rank: 5,
    name: "Fajar P********",
    score: 430,
    maxScore: 500,
    position: "Ahli Pertama Jaksa",
    agency: "Kejaksaan Republik Indonesia",
    agencyShort: "Kejaksaan RI",
    accuracy: "89.2%",
    timeSpent: "86 Menit",
    verified: true,
  },
];

export default function LeaderboardSection() {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-md shadow-amber-400/30 shrink-0">
            <Trophy className="w-5 h-5 fill-white text-amber-200" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 flex items-center justify-center shadow-md shadow-slate-300/30 shrink-0">
            <Medal className="w-5 h-5 fill-slate-100 text-slate-700" />
          </div>
        );
      case 3:
        return (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100 flex items-center justify-center shadow-md shadow-amber-700/20 shrink-0">
            <Medal className="w-5 h-5 fill-amber-200 text-amber-900" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#FCF4E7] border-2 border-[#F0DCBE] text-[#042E64] font-black text-sm flex items-center justify-center shrink-0">
            #{rank}
          </div>
        );
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
            <Crown className="w-3 h-3 text-amber-600 fill-amber-500" /> Peringkat 1 Nasional
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-wider">
            <Medal className="w-3 h-3 text-slate-500" /> Peringkat 2 Nasional
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider">
            <Medal className="w-3 h-3 text-amber-700" /> Peringkat 3 Nasional
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF4E7] text-[#042E64]/70 border border-[#F0DCBE] uppercase tracking-wider">
            Top 5 Nasional
          </span>
        );
    }
  };

  return (
    <section id="leaderboard-section" className="py-16 sm:py-24 bg-[#FCF4E7] border-t-2 border-[#F0DCBE] relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FB6E09]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#042E64]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Papan Peringkat Nasional (Top 5 Leaderboard)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Live update" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#042E64] tracking-tight">
            Peserta Simulasi CAT Terbaik Se-Indonesia
          </h2>

          <p className="text-xs sm:text-base text-[#042E64]/75 font-medium leading-relaxed">
            Pantau perolehan skor tertinggi dari pejuang NIP ASN di seluruh formasi instansi. Bandingkan performamu dan persiapkan diri menjadi peringkat teratas!
          </p>
        </div>

        {/* TOP 3 PODIUM CARDS (VISUAL HIGHLIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
          {/* Rank 2 (Perak) */}
          <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 flex items-center justify-center font-black text-lg shadow-sm">
                  <Medal className="w-6 h-6 text-slate-700 fill-slate-100" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  Podium 2
                </span>
              </div>

              <div>
                <div className="text-base font-black text-[#042E64]">
                  {TOP_FIVE_LEADERBOARD[1].name}
                </div>
                <div className="text-xs text-[#042E64]/70 font-semibold flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3 h-3 text-[#FB6E09]" />
                  <span className="truncate">{TOP_FIVE_LEADERBOARD[1].position}</span>
                </div>
                <div className="text-xs text-[#042E64]/60 font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-[#042E64]/50" />
                  <span>{TOP_FIVE_LEADERBOARD[1].agency}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#042E64]/60 block">
                    Skor Akhir CAT
                  </span>
                  <span className="text-2xl font-black text-[#042E64]">
                    {TOP_FIVE_LEADERBOARD[1].score}
                    <span className="text-xs text-[#042E64]/40 font-bold"> / 500</span>
                  </span>
                </div>
                <div className="text-right text-[11px] font-bold text-[#042E64]/70">
                  <div>Akurasi {TOP_FIVE_LEADERBOARD[1].accuracy}</div>
                  <div className="text-[10px] text-[#042E64]/50">{TOP_FIVE_LEADERBOARD[1].timeSpent}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 1 (Emas - Podium Utama / Paling Menonjol) */}
          <div className="order-1 md:order-2 bg-[#042E64] text-white rounded-3xl p-7 border-3 border-[#FB6E09] shadow-2xl shadow-[#042E64]/30 transform md:-translate-y-4 relative flex flex-col justify-between">
            {/* Top Crown Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
              <Crown className="w-3.5 h-3.5 fill-slate-900" />
              <span>Peringkat 1 Nasional</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center font-black text-xl shadow-md shadow-amber-400/30">
                  <Trophy className="w-7 h-7 fill-slate-900 text-amber-200" />
                </div>
                <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-[#FB6E09] text-white shadow-xs">
                  ★ Skor Tertinggi
                </span>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-black text-white">
                  {TOP_FIVE_LEADERBOARD[0].name}
                </div>
                <div className="text-xs sm:text-sm text-blue-200 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
                  <span>{TOP_FIVE_LEADERBOARD[0].position}</span>
                </div>
                <div className="text-xs text-blue-300/80 font-medium flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>{TOP_FIVE_LEADERBOARD[0].agency}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-blue-200 block">
                    Perolehan Nilai
                  </span>
                  <span className="text-3xl font-black text-[#FB6E09]">
                    {TOP_FIVE_LEADERBOARD[0].score}
                    <span className="text-xs text-blue-200 font-bold"> / 500</span>
                  </span>
                </div>
                <div className="text-right text-xs font-bold text-blue-100">
                  <div className="text-emerald-400">Akurasi {TOP_FIVE_LEADERBOARD[0].accuracy}</div>
                  <div className="text-[11px] text-blue-200">{TOP_FIVE_LEADERBOARD[0].timeSpent}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 3 (Perunggu) */}
          <div className="order-3 bg-white rounded-3xl p-6 border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100 flex items-center justify-center font-black text-lg shadow-sm">
                  <Medal className="w-6 h-6 text-amber-900 fill-amber-200" />
                </div>
                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Podium 3
                </span>
              </div>

              <div>
                <div className="text-base font-black text-[#042E64]">
                  {TOP_FIVE_LEADERBOARD[2].name}
                </div>
                <div className="text-xs text-[#042E64]/70 font-semibold flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3 h-3 text-[#FB6E09]" />
                  <span className="truncate">{TOP_FIVE_LEADERBOARD[2].position}</span>
                </div>
                <div className="text-xs text-[#042E64]/60 font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-[#042E64]/50" />
                  <span>{TOP_FIVE_LEADERBOARD[2].agency}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#042E64]/60 block">
                    Skor Akhir CAT
                  </span>
                  <span className="text-2xl font-black text-[#042E64]">
                    {TOP_FIVE_LEADERBOARD[2].score}
                    <span className="text-xs text-[#042E64]/40 font-bold"> / 500</span>
                  </span>
                </div>
                <div className="text-right text-[11px] font-bold text-[#042E64]/70">
                  <div>Akurasi {TOP_FIVE_LEADERBOARD[2].accuracy}</div>
                  <div className="text-[10px] text-[#042E64]/50">{TOP_FIVE_LEADERBOARD[2].timeSpent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETE TOP 5 LIST TABLE (CLEAN, MODERN, RESPONSIVE) */}
        <div className="bg-white rounded-3xl border-2 border-[#F0DCBE] shadow-xl overflow-hidden mb-8">
          <div className="p-4 sm:p-5 bg-[#042E64] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#FB6E09]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#FB6E09]" />
              <h3 className="font-black text-sm sm:text-base">
                Klasemen Resmi 5 Peserta Teratas Simulasi SKB CAT BKN
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sistem Verifikasi Otomatis Terhubung</span>
            </div>
          </div>

          <div className="divide-y divide-[#F0DCBE]">
            {TOP_FIVE_LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FCF4E7]/50 transition-colors"
              >
                {/* Left: Rank & User Info */}
                <div className="flex items-center gap-3.5">
                  {getRankBadge(user.rank)}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-[#042E64]">
                        {user.name}
                      </span>
                      {getRankLabel(user.rank)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#042E64]/70 font-semibold">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
                        {user.position}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#042E64]/80">
                        <Building2 className="w-3.5 h-3.5 text-[#042E64]/60" />
                        {user.agency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Metrics */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pl-13 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0DCBE]/60">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-black tracking-wider text-[#042E64]/60">
                      Waktu Ujian
                    </div>
                    <div className="text-xs font-bold text-[#042E64] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FB6E09]" />
                      {user.timeSpent}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-black tracking-wider text-[#042E64]/60">
                      Tingkat Akurasi
                    </div>
                    <div className="text-xs font-black text-emerald-600">
                      {user.accuracy}
                    </div>
                  </div>

                  <div className="text-right min-w-[90px] bg-[#FCF4E7] sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-xl border sm:border-0 border-[#F0DCBE]">
                    <div className="text-[10px] uppercase font-black tracking-wider text-[#042E64]/60">
                      Skor Total
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#FB6E09] leading-tight">
                      {user.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM MOTIVATION & CALL TO ACTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#FB6E09]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-[#FB6E09]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#042E64]">
                Siap Bersaing dan Masuk Jajaran Top 5 Nasional?
              </h4>
              <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium">
                Pilih paket formasi instansimu sekarang, kerjakan simulasi 100 butir soal CAT BKN, dan buktikan kemampuanmu di papan peringkat.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] transition-all shadow-md shadow-[#FB6E09]/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02]"
          >
            <span>Mulai Ujian Simulasi CAT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
