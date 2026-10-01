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
  Clock,
  ShieldAlert,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

// =========================================================================
// PENGATURAN DURASI MASA AKTIF PAKET RESMI:
// 1. Paket Satuan (Paket 1, 2, 3): 90 Hari (90 * 24 * 60 * 60 * 1000 ms)
// 2. Paket Bundling (Paket 1, 2, 3): 150 Hari (150 * 24 * 60 * 60 * 1000 ms)
// =========================================================================
export const SINGLE_PACKAGE_DURATION_MS = 90 * 24 * 60 * 60 * 1000; // 90 Hari
export const BUNDLING_PACKAGE_DURATION_MS = 150 * 24 * 60 * 60 * 1000; // 150 Hari

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
  expiresAt?: string;
  durationMs?: number;
}

// Representasi kartu paket yang dipecah untuk dikerjakan
interface ExamCardItem {
  cardId: string;
  purchaseId: string;
  examNumber: number;
  packageTitle: string;
  positionTitle: string;
  agencyName: string;
  agencyShortName?: string;
  score: number;
  status: "Belum Dikerjakan" | "Selesai" | "Hangus";
  totalQuestions: number;
  durationMinutes: number;
  purchasedAt: string;
  expiresAt: string;
  isBundling: boolean;
  validityDays: number;
}

// Helper untuk format nama instansi yang ringkas dan profesional
function getAgencyShortName(agencyName: string, agencyShortName?: string): string {
  if (agencyShortName && agencyShortName.trim()) return agencyShortName;
  if (!agencyName) return "Instansi";
  const lower = agencyName.toLowerCase();
  if (lower.includes("pendidikan") || lower.includes("kemdikbud") || lower.includes("kemendikbud")) return "Kemdikbud";
  if (lower.includes("kesehatan") || lower.includes("kemenkes")) return "Kemenkes";
  if (lower.includes("keuangan") || lower.includes("kemenkeu")) return "Kemenkeu";
  if (lower.includes("kejaksaan")) return "Kejaksaan";
  if (lower.includes("hukum") || lower.includes("kemenkumham")) return "Kemenkumham";
  if (lower.includes("agama") || lower.includes("kemenag")) return "Kemenag";
  return agencyName;
}

export default function MyPackagesPage() {
  const [examCards, setExamCards] = useState<ExamCardItem[]>([]);
  const [justPurchased, setJustPurchased] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Interval real-time countdown setiap detik (1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("skb_user_purchased_packages");
      let list: PurchasedItem[] = [];

      if (raw) {
        try {
          list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) {
            setJustPurchased(true);
          }
        } catch (e) {
          list = [];
        }
      }

      if (Array.isArray(list) && list.length > 0) {
        // =========================================================================
        // LOGIKA PENGERJAAN & TAMPILAN PAKET (APPEND MODE):
        // Setiap transaksi baru DITAMBAHKAN (append) ke dalam daftar, bukan menimpa yang lama.
        // - Paket Satuan (Paket 1, 2, atau 3): menghasilkan 1 kotak paket yang dibeli (90 Hari).
        // - Paket Bundling: menghasilkan 3 kotak terpisah (Paket 1, Paket 2, Paket 3) (150 Hari).
        // =========================================================================
        let hasMigrated = false;
        const cards: ExamCardItem[] = [];

        list.forEach((purchase) => {
          const purchasedTime = purchase.purchasedAt
            ? new Date(purchase.purchasedAt).getTime()
            : Date.now();

          const isBundling =
            purchase.packageKey === "bundling" || purchase.examNumbers.length > 1;
          const standardDurationMs = isBundling
            ? BUNDLING_PACKAGE_DURATION_MS
            : SINGLE_PACKAGE_DURATION_MS;

          // Periksa apakah data tersimpan berasal dari mode testing 1 menit (<= 24 jam)
          // Jika iya atau jika belum ada expiresAt, upgrade otomatis ke masa aktif aslinya
          let expiresTime = purchase.expiresAt
            ? new Date(purchase.expiresAt).getTime()
            : purchasedTime + standardDurationMs;

          if (
            !purchase.expiresAt ||
            expiresTime - purchasedTime <= 24 * 60 * 60 * 1000
          ) {
            expiresTime = purchasedTime + standardDurationMs;
            purchase.expiresAt = new Date(expiresTime).toISOString();
            purchase.durationMs = standardDurationMs;
            hasMigrated = true;
          }

          const validityDays = isBundling ? 150 : 90;
          const agencyLabel = getAgencyShortName(purchase.agencyName, purchase.agencyShortName);

          if (isBundling) {
            // Pecah menjadi 3 kotak terpisah: Paket 1, Paket 2, Paket 3
            [1, 2, 3].forEach((num) => {
              cards.push({
                cardId: `${purchase.id}-exam-${num}`,
                purchaseId: purchase.id,
                examNumber: num,
                packageTitle: `Paket ${num}: SKB ${agencyLabel}`,
                positionTitle: purchase.positionTitle,
                agencyName: purchase.agencyName,
                agencyShortName: purchase.agencyShortName,
                score: 0, // Nilai default 0 sesuai instruksi
                status: "Belum Dikerjakan",
                totalQuestions: 100,
                durationMinutes: 90,
                purchasedAt: new Date(purchasedTime).toISOString(),
                expiresAt: new Date(expiresTime).toISOString(),
                isBundling: true,
                validityDays: 150,
              });
            });
          } else {
            // Paket Satuan (HANYA 1 kotak yang dibeli per transaksi)
            const num =
              purchase.packageKey === "paket-2"
                ? 2
                : purchase.packageKey === "paket-3"
                ? 3
                : purchase.examNumbers[0] || 1;

            cards.push({
              cardId: `${purchase.id}-exam-${num}`,
              purchaseId: purchase.id,
              examNumber: num,
              packageTitle: `Paket ${num}: SKB ${agencyLabel}`,
              positionTitle: purchase.positionTitle,
              agencyName: purchase.agencyName,
              agencyShortName: purchase.agencyShortName,
              score: 0, // Nilai: 0
              status: "Belum Dikerjakan",
              totalQuestions: 100,
              durationMinutes: 90,
              purchasedAt: new Date(purchasedTime).toISOString(),
              expiresAt: new Date(expiresTime).toISOString(),
              isBundling: false,
              validityDays: 90,
            });
          }
        });

        // Simpan kembali jika ada data pengujian yang di-upgrade ke masa berlaku resmi
        if (hasMigrated) {
          localStorage.setItem("skb_user_purchased_packages", JSON.stringify(list));
        }

        setExamCards(cards);
      } else {
        setExamCards([]);
      }
      setIsLoaded(true);
    }
  }, []);

  // Helper kalkulasi sisa waktu (Hari, Jam, Menit, Detik)
  const calculateTimeLeft = (expiresAtStr: string) => {
    const expiresMs = new Date(expiresAtStr).getTime();
    const diffMs = Math.max(0, expiresMs - currentTime);
    const isExpired = diffMs <= 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      diffMs,
      isExpired,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const handleStartExam = (card: ExamCardItem) => {
    const timeLeft = calculateTimeLeft(card.expiresAt);
    if (timeLeft.isExpired) {
      alert("Maaf, masa aktif paket ini telah habis (Paket Hangus). Silakan lakukan pembelian ulang.");
      return;
    }

    alert(
      `[SIKILAT CAT Engine]\n\n${card.packageTitle}\nFormasi: ${card.positionTitle}\n\nNilai: ${card.score} (${card.status})\nJumlah Soal: ${card.totalQuestions} • Waktu: ${card.durationMinutes} Menit.\n\n(Alur Pembelian Paket Selesai. Siap lanjut ke Poin 2!)`
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
                  Paket Berhasil Ditambahkan ke Akun Anda!
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Paket soal Anda telah aktif dan siap dikerjakan sesuai masa aktif (90 hari untuk Paket Satuan, 150 hari untuk Paket Bundling).
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
              Daftar seluruh paket soal yang Anda miliki. Setiap pembelian baru akan otomatis ditambahkan ke daftar ini.
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
        {/* GRID KOTAK PAKET (APPEND MODE & REAL-TIME COUNTDOWN TIMER)               */}
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
            {examCards.map((card) => {
              const timeLeft = calculateTimeLeft(card.expiresAt);
              const isExpired = timeLeft.isExpired;

              return (
                <div
                  key={card.cardId}
                  className={`bg-white rounded-3xl border-3 transition-all flex flex-col justify-between overflow-hidden relative shadow-md hover:shadow-xl ${
                    isExpired
                      ? "border-slate-300 opacity-85"
                      : "border-[#F0DCBE] hover:border-[#FB6E09]/70"
                  }`}
                >
                  {/* Top Banner Tag */}
                  <div
                    className={`px-5 py-3 flex items-center justify-between border-b-2 ${
                      isExpired
                        ? "bg-slate-700 text-slate-200 border-slate-500"
                        : "bg-[#042E64] text-white border-[#FB6E09]"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-[#FB6E09]">
                      <Sparkles className="w-3.5 h-3.5 fill-[#FB6E09]" />
                      Paket {card.examNumber}
                    </span>
                    <span className="text-[11px] font-bold text-blue-200">
                      {card.totalQuestions} Soal • {card.durationMinutes} Menit
                    </span>
                  </div>

                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* 1. Judul Utama & 2. Sub-Judul Formasi */}
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-[#042E64] leading-snug tracking-tight">
                          {card.packageTitle}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#042E64]/70 font-medium mt-1">
                          Formasi: <span className="text-[#042E64] font-semibold">{card.positionTitle}</span>
                        </p>
                      </div>

                      {/* 4. Komponen Hitung Mundur (Masa Berlaku) */}
                      <div
                        className={`p-3 rounded-2xl border transition-all ${
                          isExpired
                            ? "bg-rose-50/80 border-rose-200 text-rose-900"
                            : "bg-[#FCF4E7]/70 border-amber-300/70 text-[#042E64]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                          <span className="flex items-center gap-1.5 text-[#042E64]">
                            <Clock
                              className={`w-3.5 h-3.5 ${
                                isExpired ? "text-rose-600" : "text-[#FB6E09] animate-pulse"
                              }`}
                            />
                            <span>Masa Berlaku:</span>
                          </span>

                          {isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-800 uppercase tracking-wider">
                              Waktu Habis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                              Aktif ({card.validityDays} Hari)
                            </span>
                          )}
                        </div>

                        {/* Grid Countdown: Hari, Jam, Menit, Detik */}
                        <div className="grid grid-cols-4 gap-1.5 text-center font-mono font-black">
                          <div
                            className={`py-1.5 px-1 rounded-xl border ${
                              isExpired
                                ? "bg-white text-rose-800 border-rose-200"
                                : "bg-white text-[#042E64] border-[#F0DCBE]"
                            }`}
                          >
                            <div className="text-sm font-black leading-none">
                              {String(timeLeft.days).padStart(2, "0")}
                            </div>
                            <div className="text-[9px] font-sans font-semibold text-[#042E64]/60 mt-0.5">
                              Hari
                            </div>
                          </div>

                          <div
                            className={`py-1.5 px-1 rounded-xl border ${
                              isExpired
                                ? "bg-white text-rose-800 border-rose-200"
                                : "bg-white text-[#042E64] border-[#F0DCBE]"
                            }`}
                          >
                            <div className="text-sm font-black leading-none">
                              {String(timeLeft.hours).padStart(2, "0")}
                            </div>
                            <div className="text-[9px] font-sans font-semibold text-[#042E64]/60 mt-0.5">
                              Jam
                            </div>
                          </div>

                          <div
                            className={`py-1.5 px-1 rounded-xl border ${
                              isExpired
                                ? "bg-white text-rose-800 border-rose-200"
                                : "bg-white text-[#042E64] border-[#F0DCBE]"
                            }`}
                          >
                            <div className="text-sm font-black leading-none">
                              {String(timeLeft.minutes).padStart(2, "0")}
                            </div>
                            <div className="text-[9px] font-sans font-semibold text-[#042E64]/60 mt-0.5">
                              Menit
                            </div>
                          </div>

                          <div
                            className={`py-1.5 px-1 rounded-xl border ${
                              isExpired
                                ? "bg-white text-rose-800 border-rose-200"
                                : "bg-white text-[#FB6E09] border-[#FB6E09]/40"
                            }`}
                          >
                            <div className="text-sm font-black leading-none">
                              {String(timeLeft.seconds).padStart(2, "0")}
                            </div>
                            <div className="text-[9px] font-sans font-semibold text-[#042E64]/60 mt-0.5">
                              Detik
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Komponen Perolehan Skor (Nilai) & Status */}
                    <div className="pt-3 border-t border-[#F0DCBE] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#FB6E09]" />
                        <span className="text-xs font-bold text-[#042E64]/70">Nilai:</span>
                        <span className="text-base font-black text-[#FB6E09]">{card.score}</span>
                      </div>

                      {isExpired ? (
                        <span className="text-[11px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                          ● Paket Hangus
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          ● {card.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* TOMBOL AKSI: 'KERJAKAN UJIAN' ATAU 'PAKET HANGUS' (DISABLED)      */}
                  {/* ================================================================= */}
                  <div className="p-4 bg-[#FCF4E7]/60 border-t-2 border-[#F0DCBE]">
                    {isExpired ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 px-4 rounded-xl font-black text-sm text-slate-400 bg-slate-200 border-2 border-slate-300 flex items-center justify-center gap-2 cursor-not-allowed select-none shadow-none"
                        title="Paket sudah tidak dapat dikerjakan karena masa aktif telah habis"
                      >
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                        <span>Paket Hangus</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartExam(card)}
                        className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Kerjakan Ujian</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Informasi Bantuan & Ketentuan */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#F0DCBE] text-[#042E64] flex items-start gap-3.5 text-xs sm:text-sm shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FB6E09]" />
          </div>
          <div className="space-y-1">
            <strong className="font-black text-[#042E64] text-sm">Ketentuan Masa Berlaku Paket:</strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Setiap paket soal memiliki masa aktif resmi: <strong>90 Hari</strong> untuk Paket Satuan dan <strong>150 Hari</strong> untuk Paket Bundling sejak waktu pembelian. Apabila masa aktif habis sebelum Anda menyelesaikan ujian, tombol pengerjaan otomatis berubah menjadi <strong>&quot;Paket Hangus&quot;</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
