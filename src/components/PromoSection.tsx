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

        {/* Promo Grid (2 Kolom: Paket Satuan dan Paket Bundling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Card 1: Paket Starter (Satuan) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F0DCBE] flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="text-xs font-black text-[#FB6E09] uppercase tracking-wider mb-1">
                Latihan Mandiri
              </div>
              <h3 className="text-2xl font-black text-[#042E64]">SKB Formasi</h3>
              <p className="text-xs text-[#042E64]/70 mt-1 mb-4 font-medium">
                Materi Uji Pokok Teknis Jabatan formasi pilihan sesuai kisi-kisi resmi Kemenpan-RB.
              </p>

              {/* Price */}
              <div className="py-4 border-y border-[#F0DCBE]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#042E64]/40 line-through font-semibold">Rp35.000</span>
                  <span className="bg-[#FB6E09]/20 text-[#FB6E09] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#FB6E09]/30">
                    Promo Hemat
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-[#042E64]">Rp30.000</span>
                  <span className="text-xs text-[#042E64]/70 font-semibold">/ 1 Paket</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="py-5 space-y-3 text-xs sm:text-sm text-[#042E64]/85">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>100 butir soal CAT BKN</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Waktu ujian selama 90 menit</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FB6E09] shrink-0" />
                  <span>Kunci jawaban dan pembahasan detail</span>
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
              <span>Paling Populer &amp; Hemat</span>
            </div>

            <div>
              <div className="text-xs font-black text-[#FB6E09] uppercase tracking-wider mb-1 mt-2">
                Pilihan Terbaik Pejuang ASN
              </div>
              <h3 className="text-2xl font-black text-white">Paket Bundling (Paket 1, 2, dan 3)</h3>
              <p className="text-xs text-blue-200 mt-1 mb-5">
                Materi Uji Pokok Teknis Jabatan lengkap 3 sesi simulasi CAT terpadu sesuai kisi-kisi resmi Kemenpan-RB.
              </p>

              {/* Price Box */}
              <div className="py-4 border-y border-[#0B3E84] bg-white/5 rounded-2xl px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 line-through font-semibold">Rp105.000</span>
                  <span className="bg-[#FB6E09]/30 text-[#FB6E09] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#FB6E09]/40">
                    Hemat Rp25.000
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">Rp80.000</span>
                  <span className="text-xs text-blue-200 font-semibold">/ 3 Paket Ujian</span>
                </div>
                <div className="text-[11px] text-amber-300 mt-1 font-bold">
                  ✓ Mendapatkan Paket 1, 2, dan 3 secara terpadu
                </div>
              </div>

              {/* Features Breakdown */}
              <ul className="py-6 space-y-3.5 text-xs sm:text-sm text-slate-100">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>100 butir soal CAT BKN</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Waktu ujian selama 90 menit</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Kunci jawaban dan pembahasan detail</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-amber-300 font-bold">
                    Akses ke Grup Diskusi Telegram Eksklusif
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
