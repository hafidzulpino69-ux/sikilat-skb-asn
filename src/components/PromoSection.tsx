"use client";

import { useRouter } from "next/navigation";
import {
  Check,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

export default function PromoSection() {
  const router = useRouter();

  const handleBuy = (packageName: string) => {
    // Interaksi Tombol: Jika tombol "Beli" diklik, user langsung di-redirect ke halaman Login
    router.push(`/login?package=${encodeURIComponent(packageName)}`);
  };

  return (
    <section id="promo-section" className="py-16 sm:py-24 bg-[#FCF4E7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navy Headings & Orange Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/25 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-[#FB6E09]" />
            <span>Katalog Promo SIKILAT SKB ASN 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#042E64] tracking-tight">
            Pilihan Paket Tryout Kilat & Terpadu
          </h2>
          <p className="text-[#042E64]/80 text-sm sm:text-base font-medium">
            Tingkatkan peluang kelulusanmu dengan latihan intensif berstandar CAT BKN. Investasi terbaik untuk mengamankan kursi NIP ASN impianmu.
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Paket Starter (Satuan) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#F0DCBE] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="text-xs font-black text-[#FB6E09] uppercase tracking-wider mb-1">
                Latihan Mandiri
              </div>
              <h3 className="text-xl font-black text-[#042E64]">Paket Satuan SKB</h3>
              <p className="text-xs text-[#042E64]/70 mt-1 mb-4 font-medium">
                Cocok untuk evaluasi kilat 1 paket formasi teknis pilihan.
              </p>

              {/* Price */}
              <div className="py-4 border-y border-[#F0DCBE]">
                <div className="text-xs text-[#042E64]/40 line-through font-semibold">Rp30.000</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#042E64]">Rp20.000</span>
                  <span className="text-xs text-[#042E64]/70 font-semibold">/ 1 Paket</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="py-5 space-y-3 text-xs sm:text-sm text-[#042E64]/85">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>1x Simulasi Ujian CAT BKN (100 Soal)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Kunci Jawaban & Pembahasan Singkat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Masa Aktif 30 Hari</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleBuy("paket-satuan")}
              className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-sm text-[#042E64] bg-[#FCF4E7] hover:bg-[#F4E3CB] border border-[#F0DCBE] transition-colors cursor-pointer"
            >
              Beli Paket Satuan
            </button>
          </div>

          {/* Card 2: PAKET BUNDLING SKB (MAIN HIGHLIGHTED PRODUCT - NAVY BACKGROUND & ORANGE ACCENTS) */}
          <div className="relative bg-[#042E64] text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#042E64]/25 border-3 border-[#FB6E09] flex flex-col justify-between transform md:-translate-y-2">
            {/* Top Highlight Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FB6E09] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Paling Populer & Hemat 25%</span>
            </div>

            <div>
              <div className="text-xs font-black text-[#FB6E09] uppercase tracking-wider mb-1 mt-2">
                Pilihan Terbaik Pejuang ASN
              </div>
              <h3 className="text-2xl font-black text-white">Paket Bundling SKB</h3>
              <p className="text-xs text-blue-200 mt-1 mb-5">
                3 Paket Ujian Terpadu mencakup aspek teknis jabatan, manajerial & sosio-kultural, serta simulasi penuh CAT BKN.
              </p>

              {/* Price Box */}
              <div className="py-4 border-y border-[#0B3E84] bg-white/5 rounded-2xl px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 line-through font-semibold">Rp60.000</span>
                  <span className="bg-[#FB6E09]/30 text-[#FB6E09] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#FB6E09]/40">
                    Hemat Rp15.000
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">Rp45.000</span>
                  <span className="text-xs text-blue-200 font-semibold">/ 3 Paket Ujian</span>
                </div>
                <div className="text-[11px] text-amber-300 mt-1 font-bold">
                  ✓ Termasuk seluruh update materi Permenpan-RB 2026
                </div>
              </div>

              {/* Features Breakdown */}
              <ul className="py-6 space-y-3.5 text-xs sm:text-sm text-slate-100">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    <strong className="text-white">3 Paket Ujian Lengkap:</strong> SKB Teknis, SKB Manajerial/Sosio-Kultural, Simulasi CAT BKN
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    <strong className="text-white">300 Soal CAT BKN:</strong> Disesuaikan kisi-kisi resmi dan FR terbaru
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    <strong className="text-white">Pembahasan Lengkap:</strong> Disertai trik pengerjaan kilat 30 detik
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    <strong className="text-white">Ranking Nasional Real-Time:</strong> Pantau posisimu di antara pesaing instansi
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    <strong className="text-white">Masa Aktif Selamanya:</strong> Ulangi pengerjaan kapan pun dibutuhkan
                  </span>
                </li>
              </ul>
            </div>

            {/* Tombol Beli yang Mengarahkan Langsung ke Halaman Login (Primary Orange) */}
            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={() => handleBuy("bundling-skb")}
                className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-lg shadow-[#FB6E09]/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Beli Paket Bundling Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-blue-200 mt-2">
                Akses langsung aktif seketika setelah login di SIKILAT SKB ASN
              </p>
            </div>
          </div>

          {/* Card 3: Paket VIP Mentoring */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#F0DCBE] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="text-xs font-black text-[#FB6E09] uppercase tracking-wider mb-1">
                Bimbingan Intensif
              </div>
              <h3 className="text-xl font-black text-[#042E64]">Paket VIP + Mentoring</h3>
              <p className="text-xs text-[#042E64]/70 mt-1 mb-4 font-medium">
                Tryout lengkap disertai sesi webinar bedah soal bersama mentor ASN.
              </p>

              {/* Price */}
              <div className="py-4 border-y border-[#F0DCBE]">
                <div className="text-xs text-[#042E64]/40 line-through font-semibold">Rp150.000</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#042E64]">Rp99.000</span>
                  <span className="text-xs text-[#042E64]/70 font-semibold">/ All-in</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="py-5 space-y-3 text-xs sm:text-sm text-[#042E64]/85">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Semua fitur Paket Bundling SKB</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>3x Rekaman Live Webinar Bedah FR SKB</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Grup Diskusi Telegram Eksklusif</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleBuy("paket-vip")}
              className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-sm text-[#042E64] bg-[#FCF4E7] hover:bg-[#F4E3CB] border border-[#F0DCBE] transition-colors cursor-pointer"
            >
              Beli Paket VIP
            </button>
          </div>
        </div>

        {/* Security & Guarantee Trust Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#F0DCBE] max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FB6E09] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-[#042E64]">Garansi Akses Kilat & Aman</div>
              <div className="text-xs text-[#042E64]/70 font-medium">
                Server berkecepatan tinggi tanpa kendala down saat jam sibuk tryout nasional.
              </div>
            </div>
          </div>
          <div className="text-xs font-extrabold text-[#FB6E09] whitespace-nowrap bg-[#FB6E09]/10 px-3.5 py-1.5 rounded-lg border border-[#FB6E09]/20">
            100% Berstandar BKN
          </div>
        </div>
      </div>
    </section>
  );
}
