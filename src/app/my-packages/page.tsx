"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PackageOpen,
  PlayCircle,
  Award,
  CheckCircle,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface PurchasedItem {
  id: string;
  invoiceNumber?: string;
  agencyName: string;
  agencyShortName: string;
  positionTitle: string;
  positionCode: string;
  packageKey: "paket-1" | "paket-2" | "paket-3" | "bundling";
  packageName: string;
  price: number;
  examNumbers: number[];
  purchasedAt: string;
}

// Representasi kartu paket yang dipecah untuk dikerjakan
interface ExamCardItem {
  cardId: string;
  examNumber: number;
  packageTitle: string;
  positionTitle: string;
  agencyName: string;
  score: number;
  status: "Belum Dikerjakan" | "Selesai";
  totalQuestions: number;
  durationMinutes: number;
}

export default function MyPackagesPage() {
  const [examCards, setExamCards] = useState<ExamCardItem[]>([]);
  const [justPurchased, setJustPurchased] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("skb_user_purchased_packages");
      let list: PurchasedItem[] = [];

      if (raw) {
        try {
          list = JSON.parse(raw);
          if (list.length > 0) {
            setJustPurchased(true);
          }
        } catch (e) {
          list = [];
        }
      }

      if (list.length > 0) {
        // =========================================================================
        // LOGIKA PENGERJAAN & TAMPILAN PAKET:
        // Gunakan transaksi paket terbaru (list[0]) agar jika membeli Paket 1,
        // HANYA Paket 1 yang muncul di halaman "Daftar Paket Anda".
        // Jika membeli Paket Bundling, barulah muncul ketiga kotak (Paket 1, 2, 3).
        // =========================================================================
        const currentPurchase = list[0];
        const cards: ExamCardItem[] = [];
        const isBundling =
          currentPurchase.packageKey === "bundling" || currentPurchase.examNumbers.length > 1;

        if (isBundling) {
          // Pecah menjadi 3 kotak terpisah: Paket 1, Paket 2, Paket 3
          [1, 2, 3].forEach((num) => {
            cards.push({
              cardId: `${currentPurchase.id}-exam-${num}`,
              examNumber: num,
              packageTitle: `Paket ${num}: SKB Formasi`,
              positionTitle: currentPurchase.positionTitle,
              agencyName: currentPurchase.agencyName,
              score: 0, // Nilai default 0 sesuai instruksi
              status: "Belum Dikerjakan",
              totalQuestions: 100,
              durationMinutes: 90,
            });
          });
        } else {
          // Paket Satuan (HANYA 1 kotak yang dibeli)
          const num =
            currentPurchase.packageKey === "paket-2"
              ? 2
              : currentPurchase.packageKey === "paket-3"
              ? 3
              : currentPurchase.examNumbers[0] || 1;

          cards.push({
            cardId: `${currentPurchase.id}-exam-${num}`,
            examNumber: num,
            packageTitle: `Paket ${num}: SKB Formasi`,
            positionTitle: currentPurchase.positionTitle,
            agencyName: currentPurchase.agencyName,
            score: 0, // Nilai: 0
            status: "Belum Dikerjakan",
            totalQuestions: 100,
            durationMinutes: 90,
          });
        }

        setExamCards(cards);
      } else {
        setExamCards([]);
      }
      setIsLoaded(true);
    }
  }, []);

  const handleStartExam = (card: ExamCardItem) => {
    alert(
      `[SIKILAT CAT Engine]\n\nKerjakan paket soal ${card.examNumber} dengan jabatan ${card.positionTitle} Instansi ${card.agencyName}\n\nNilai: ${card.score} (Belum dikerjakan)\nJumlah Soal: ${card.totalQuestions} • Waktu: ${card.durationMinutes} Menit.\n\n(Alur Pembelian Paket Selesai. Siap lanjut ke Poin 2!)`
    );
  };

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FCF4E7]/90 backdrop-blur-md border-b-2 border-[#F0DCBE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" />

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#042E64] hover:bg-[#0B3E84] rounded-xl transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#FB6E09]" />
                <span>Beli Formasi / Paket Lain</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Sukses Pembayaran jika baru saja checkout */}
        {justPurchased && (
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-emerald-950">
                  Pembayaran Berhasil Dikonfirmasi!
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Paket soal Anda telah aktif dan siap dikerjakan di bawah ini.
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-black text-emerald-900 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100 self-start sm:self-auto transition-colors"
            >
              + Beli Paket Formasi Lain
            </Link>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider">
              <PackageOpen className="w-3.5 h-3.5" />
              <span>Daftar Paket Anda</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
              Paket Soal Ujian yang Anda Miliki
            </h1>
            <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium">
              Berikut adalah daftar kotak paket soal yang siap Anda kerjakan dengan sistem CAT BKN.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-[#F0DCBE] text-xs font-black text-[#042E64] hover:bg-[#F4E3CB] transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-[#FB6E09]" />
            <span>Kembali ke Pemilihan Formasi</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* GRID KOTAK PAKET (HASIL LOGIKA PEMECAHAN PAKET BUNDLING ATAU SATUAN)     */}
        {/* ========================================================================= */}
        {isLoaded && examCards.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-[#F0DCBE] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#042E64]">Belum Ada Paket Soal Aktif</h3>
            <p className="text-xs sm:text-sm text-[#042E64]/70 max-w-md mx-auto font-medium">
              Anda belum memiliki paket soal aktif. Silakan pilih instansi, jabatan, dan paket latihan mandiri atau paket bundling di dashboard.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-md shadow-[#FB6E09]/30 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pilih &amp; Beli Paket Sekarang</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examCards.map((card) => (
              <div
                key={card.cardId}
                className="bg-white rounded-3xl border-3 border-[#F0DCBE] hover:border-[#FB6E09]/70 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Banner Tag */}
                <div className="bg-[#042E64] text-white px-5 py-3 flex items-center justify-between border-b-2 border-[#FB6E09]">
                  <span className="text-xs font-black text-[#FB6E09] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-[#FB6E09]" />
                    Paket {card.examNumber}
                  </span>
                  <span className="text-[11px] font-bold text-blue-200">
                    {card.totalQuestions} Soal • {card.durationMinutes} Menit
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-black text-[#042E64] leading-snug">
                      {card.packageTitle}
                    </h3>

                    {/* TEKS INSTRUKSI SPESIFIK SESUAI PERMINTAAN USER: */}
                    {/* 'Kerjakan paket soal [Nomor] dengan jabatan [Nama Jabatan] Instansi [Nama Instansi]' */}
                    <div className="p-3.5 rounded-2xl bg-[#FCF4E7] border border-[#F0DCBE] text-xs text-[#042E64] leading-relaxed font-semibold">
                      Kerjakan paket soal <strong>{card.examNumber}</strong> dengan jabatan{" "}
                      <strong className="text-[#FB6E09]">{card.positionTitle}</strong> Instansi{" "}
                      <strong>{card.agencyName}</strong>.
                    </div>
                  </div>

                  {/* KETERANGAN NILAI: 0 (KARENA BELUM DIKERJAKAN) */}
                  <div className="pt-3 border-t border-[#F0DCBE] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#FB6E09]" />
                      <div>
                        <div className="text-[10px] text-[#042E64]/60 uppercase font-black tracking-wider">
                          Perolehan Skor
                        </div>
                        <div className="text-lg font-black text-[#042E64]">
                          Nilai: <span className="text-[#FB6E09]">{card.score}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                      ● {card.status}
                    </span>
                  </div>
                </div>

                {/* TOMBOL 'KERJAKAN UJIAN' */}
                <div className="p-5 bg-[#FCF4E7]/60 border-t-2 border-[#F0DCBE]">
                  <button
                    type="button"
                    onClick={() => handleStartExam(card)}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Kerjakan Ujian</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informasi Bantuan */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#F0DCBE] text-[#042E64] flex items-start gap-3.5 text-xs sm:text-sm shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FB6E09]" />
          </div>
          <div className="space-y-1">
            <strong className="font-black text-[#042E64] text-sm">Ketentuan Pengerjaan Paket:</strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Paket soal yang telah dibeli akan tersimpan permanen di akun Anda. Pada tahap selanjutnya (Poin 2), tombol <strong>&quot;Kerjakan Ujian&quot;</strong> akan menghubungkan Anda ke Mesin Ujian CAT BKN interaktif dengan 110 butir soal dan timer 100 menit.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
