"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Scale,
  UserCheck,
  Zap,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function TermsPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [userName, setUserName] = useState<string>("Peserta SIKILAT");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    // Membaca data user profil jika tersimpan
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skb_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
        } catch {
          // Abaikan kesalahan parsing
        }
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolledToBottom(true);
    }
  };

  const handleProceed = () => {
    if (!agreed) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("skb_terms_accepted", "true");
    }

    // Navigasi ke halaman Dashboard setelah persetujuan
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCF4E7] via-[#F8EDDC] to-[#FCF4E7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl shadow-[#042E64]/10 border-2 border-[#F0DCBE] overflow-hidden flex flex-col">
        {/* Header Flow Banner in Navy Blue */}
        <div className="bg-[#042E64] text-white p-6 sm:p-7 border-b-4 border-[#FB6E09]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FB6E09] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FB6E09]/30">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FB6E09]/20 text-[#FB6E09] border border-[#FB6E09]/40 mb-1">
                  Langkah Terakhir Pasca-Login
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Syarat, Ketentuan & Kebijakan Privasi
                </h1>
              </div>
            </div>
            <div className="text-xs text-blue-100 bg-[#021C3F] px-3.5 py-1.5 rounded-xl border border-blue-900 self-start sm:self-auto font-medium">
              Akun: <strong className="text-[#FB6E09]">{userName}</strong>
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            Demi kenyamanan, kejujuran simulasi, dan keamanan data Anda, silakan pelajari tata tertib pengerjaan Tryout di platform <strong>SIKILAT SKB ASN</strong> di bawah ini sebelum melanjutkan ke Dashboard Ujian.
          </p>
        </div>

        {/* Scrollable Terms Content Area */}
        <div className="p-5 sm:p-7 flex-1 bg-white">
          <div className="flex items-center justify-between mb-3 text-xs text-[#042E64]/70 font-semibold">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#FB6E09]" />
              <span>Dokumen Regulasi Pelaksanaan Simulasi CAT SIKILAT (2026)</span>
            </div>
            <span className="hidden xs:inline text-[11px] bg-[#FCF4E7] border border-[#F0DCBE] px-2.5 py-1 rounded-lg text-[#042E64] font-bold">
              {hasScrolledToBottom ? "✓ Selesai Dibaca" : "Gulir ke bawah untuk membaca"}
            </span>
          </div>

          <div
            onScroll={handleScroll}
            className="custom-scrollbar h-64 sm:h-80 md:h-96 overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#FCF4E7]/50 border-2 border-[#F0DCBE] text-[#042E64] text-xs sm:text-sm leading-relaxed space-y-5 focus:outline-none focus:ring-2 focus:ring-[#FB6E09]"
            tabIndex={0}
            aria-label="Area teks syarat dan ketentuan scrollable"
          >
            {/* Pasal 1 */}
            <section className="space-y-1.5">
              <h3 className="font-black text-[#042E64] text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black shrink-0">
                  1
                </span>
                Pasal 1: Ketentuan Umum & Kepemilikan Akun
              </h3>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                1.1 Setiap akun terdaftar pada platform <strong>SIKILAT SKB ASN</strong> bersifat personal dan tidak dapat dipindahtangankan, disewakan, atau diperjualbelikan kepada pihak lain tanpa persetujuan tertulis dari pengelola platform.
              </p>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                1.2 Pengguna bertanggung jawab penuh atas kerahasiaan informasi akun, termasuk kata sandi (password) dan seluruh aktivitas yang terjadi dalam akun tersebut.
              </p>
            </section>

            {/* Pasal 2 */}
            <section className="space-y-1.5">
              <h3 className="font-black text-[#042E64] text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black shrink-0">
                  2
                </span>
                Pasal 2: Integritas Ujian & Kode Etik Simulasi CAT BKN
              </h3>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                2.1 Simulasi CAT SIKILAT dirancang untuk mengukur kompetensi teknis, sosio-kultural, dan manajerial peserta secara objektif sesuai standar Badan Kepegawaian Negara (BKN).
              </p>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                2.2 Peserta dilarang keras menggunakan perangkat lunak otomatisasi (bot), script eksploitasi peramban, maupun kecurangan pihak ketiga dalam pengerjaan soal tryout. Pelanggaran terhadap poin ini berakibat pada diskualifikasi skor dari papan peringkat nasional (leaderboard).
              </p>
            </section>

            {/* Pasal 3 */}
            <section className="space-y-1.5">
              <h3 className="font-black text-[#042E64] text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black shrink-0">
                  3
                </span>
                Pasal 3: Hak Kekayaan Intelektual (HAKI) & Kerahasiaan Soal
              </h3>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                3.1 Seluruh materi, butir soal, diagram, pembahasan, dan trik pengerjaan yang disajikan merupakan hak cipta eksklusif <strong>SIKILAT SKB ASN</strong> yang dilindungi Undang-Undang Hak Cipta Republik Indonesia.
              </p>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                3.2 Dilarang menduplikasi, menyalin, memotret, membagikan, atau memperjualbelikan naskah soal dan pembahasan dalam bentuk apa pun tanpa izin resmi.
              </p>
            </section>

            {/* Pasal 4 */}
            <section className="space-y-1.5">
              <h3 className="font-black text-[#042E64] text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black shrink-0">
                  4
                </span>
                Pasal 4: Kebijakan Privasi & Perlindungan Data Peserta
              </h3>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                4.1 Kami berkomitmen melindungi data pribadi pengguna (Nama, Email, Pilihan Formasi Instansi) sesuai prinsip Undang-Undang Perlindungan Data Pribadi (UU PDP).
              </p>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                4.2 Data riwayat nilai ujian hanya digunakan untuk keperluan kalkulasi pemeringkatan kompetensi nasional dan perbaikan rekomendasi materi belajar personal Anda.
              </p>
            </section>

            {/* Pasal 5 */}
            <section className="space-y-1.5">
              <h3 className="font-black text-[#042E64] text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black shrink-0">
                  5
                </span>
                Pasal 5: Garansi Akses & Pembaruan Bank Soal
              </h3>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                5.1 Peserta yang memiliki paket aktif (termasuk Paket Bundling SKB) berhak menikmati pembaruan kisi-kisi soal dan kunci pembahasan selama masa berlaku paket tanpa biaya tambahan.
              </p>
              <p className="text-[#042E64]/80 pl-8 font-medium">
                5.2 Gangguan teknis server yang menyebabkan terhentinya sesi simulasi akan dikompensasi dengan pemulihan kuota sesi tanpa mengurangi kesempatan peserta.
              </p>
            </section>

            <div className="p-3.5 bg-[#FB6E09]/10 border-2 border-[#FB6E09]/30 rounded-xl text-[#042E64] text-xs font-semibold">
              <strong className="text-[#FB6E09]">Pernyataan Akhir:</strong> Dengan mencentang kotak persetujuan di bawah ini, Anda menyatakan telah membaca, memahami, dan tunduk pada seluruh syarat dan ketentuan di atas secara sukarela.
            </div>
          </div>

          {/* Interactive Checkbox & Action Area */}
          <div className="mt-6 pt-4 border-t-2 border-[#F0DCBE] space-y-4">
            {/* Checkbox "Saya menyetujui Syarat dan Ketentuan yang berlaku" */}
            <label className="flex items-start gap-3 p-4 rounded-2xl hover:bg-[#FCF4E7]/70 transition-colors cursor-pointer border-2 border-[#F0DCBE] bg-[#FCF4E7]/30 select-none">
              <div className="mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-[#FB6E09] rounded border-[#F0DCBE] focus:ring-[#FB6E09] cursor-pointer"
                />
              </div>
              <div className="text-xs sm:text-sm text-[#042E64] leading-snug">
                <span className="font-black text-[#042E64] block">
                  Saya menyetujui Syarat dan Ketentuan yang berlaku
                </span>
                <span className="text-xs text-[#042E64]/70 mt-0.5 block font-medium">
                  Saya berkomitmen menjunjung integritas ujian CAT dan mematuhi seluruh tata tertib platform SIKILAT SKB ASN.
                </span>
              </div>
            </label>

            {/* Validation Notice when Disabled */}
            {!agreed && (
              <div className="flex items-center gap-2 text-xs text-[#FB6E09] bg-[#FB6E09]/10 px-4 py-2.5 rounded-xl border border-[#FB6E09]/30 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FB6E09]" />
                <span>
                  Centang kotak persetujuan di atas untuk mengaktifkan tombol <strong>&quot;Lanjut ke Dashboard&quot;</strong>.
                </span>
              </div>
            )}

            {/* Tombol "Lanjut" (Wajib disabled jika belum centang, aktif oranye jika sudah centang) */}
            <button
              type="button"
              id="btn-lanjut"
              disabled={!agreed}
              onClick={handleProceed}
              className={`w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                agreed
                  ? "bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] text-white shadow-[#FB6E09]/30 cursor-pointer hover:scale-[1.005]"
                  : "bg-[#F0DCBE]/70 text-[#042E64]/30 border border-[#F0DCBE] cursor-not-allowed shadow-none"
              }`}
            >
              <span>Lanjut ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#042E64]/60 pt-1 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Sistem Terenkripsi SSL 256-Bit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#FB6E09]" />
                Verifikasi Otentikasi Peserta SIKILAT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
