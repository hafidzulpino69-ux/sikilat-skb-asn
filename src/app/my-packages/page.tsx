"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PackageOpen,
  CheckCircle,
  PlusCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { PackageCard } from "@/components/dashboard";
import type { PurchasedItem, ExamCardItem, ExamCardStatus } from "@/types";
import {
  SINGLE_PACKAGE_DURATION_MS,
  BUNDLING_PACKAGE_DURATION_MS,
  SINGLE_PACKAGE_DAYS,
  BUNDLING_PACKAGE_DAYS,
  TOTAL_QUESTIONS,
  EXAM_DURATION_MINUTES,
} from "@/constants";
import {
  getAgencyShortName,
  calculateTimeLeft,
  loadPurchasedPackages,
  savePurchasedPackages,
  loadPackageScores,
} from "@/utils";

export default function MyPackagesPage() {
  const router = useRouter();
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
      const list = loadPurchasedPackages();

      if (list.length > 0) {
        setJustPurchased(true);
      }

      if (list.length > 0) {
        const scoresMap = loadPackageScores();

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

          const validityDays = isBundling ? BUNDLING_PACKAGE_DAYS : SINGLE_PACKAGE_DAYS;
          const agencyLabel = getAgencyShortName(purchase.agencyName, purchase.agencyShortName);

          if (isBundling) {
            [1, 2, 3].forEach((num) => {
              const cardId = `${purchase.id}-exam-${num}`;
              const recorded = scoresMap[cardId];
              const score = recorded ? recorded.highestScore : 0;
              const status: ExamCardStatus = recorded ? "Selesai" : "Belum Dikerjakan";

              cards.push({
                cardId,
                purchaseId: purchase.id,
                examNumber: num,
                packageTitle: `Paket ${num}: SKB ${agencyLabel}`,
                positionTitle: purchase.positionTitle,
                agencyName: purchase.agencyName,
                agencyShortName: purchase.agencyShortName,
                score,
                status,
                totalQuestions: TOTAL_QUESTIONS,
                durationMinutes: EXAM_DURATION_MINUTES,
                purchasedAt: new Date(purchasedTime).toISOString(),
                expiresAt: new Date(expiresTime).toISOString(),
                isBundling: true,
                validityDays,
              });
            });
          } else {
            const num =
              purchase.packageKey === "paket-2"
                ? 2
                : purchase.packageKey === "paket-3"
                ? 3
                : purchase.examNumbers[0] || 1;

            const cardId = `${purchase.id}-exam-${num}`;
            const recorded = scoresMap[cardId];
            const score = recorded ? recorded.highestScore : 0;
            const status: ExamCardStatus = recorded ? "Selesai" : "Belum Dikerjakan";

            cards.push({
              cardId,
              purchaseId: purchase.id,
              examNumber: num,
              packageTitle: `Paket ${num}: SKB ${agencyLabel}`,
              positionTitle: purchase.positionTitle,
              agencyName: purchase.agencyName,
              agencyShortName: purchase.agencyShortName,
              score,
              status,
              totalQuestions: TOTAL_QUESTIONS,
              durationMinutes: EXAM_DURATION_MINUTES,
              purchasedAt: new Date(purchasedTime).toISOString(),
              expiresAt: new Date(expiresTime).toISOString(),
              isBundling: false,
              validityDays,
            });
          }
        });

        if (hasMigrated) {
          savePurchasedPackages(list);
        }

        setExamCards(cards);
      } else {
        setExamCards([]);
      }
      setIsLoaded(true);
    }
  }, []);

  const handleStartExam = (card: ExamCardItem) => {
    const timeLeft = calculateTimeLeft(card.expiresAt, currentTime);
    if (timeLeft.isExpired) {
      alert("Maaf, masa aktif paket ini telah habis (Paket Hangus). Silakan lakukan pembelian ulang.");
      return;
    }

    router.push(
      `/exam?packageTitle=${encodeURIComponent(card.packageTitle)}&position=${encodeURIComponent(card.positionTitle)}&agency=${encodeURIComponent(card.agencyName)}`
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
        {/* Banner Sukses Pembayaran */}
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
                  Paket soal Anda telah aktif dan siap dikerjakan sesuai masa aktif ({SINGLE_PACKAGE_DAYS} hari untuk Paket Satuan, {BUNDLING_PACKAGE_DAYS} hari untuk Paket Bundling).
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

        {/* Grid Kotak Paket */}
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
              const timeLeft = calculateTimeLeft(card.expiresAt, currentTime);

              return (
                <PackageCard
                  key={card.cardId}
                  card={card}
                  timeLeft={timeLeft}
                  onStartExam={handleStartExam}
                />
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
              Setiap paket soal memiliki masa aktif resmi: <strong>{SINGLE_PACKAGE_DAYS} Hari</strong> untuk Paket Satuan dan <strong>{BUNDLING_PACKAGE_DAYS} Hari</strong> untuk Paket Bundling sejak waktu pembelian. Apabila masa aktif habis sebelum Anda menyelesaikan ujian, tombol pengerjaan otomatis berubah menjadi <strong>&quot;Paket Hangus&quot;</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
