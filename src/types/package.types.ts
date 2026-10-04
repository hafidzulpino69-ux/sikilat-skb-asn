// src/types/package.types.ts

/** Jenis kunci paket */
export type PackageKey = "paket-1" | "paket-2" | "paket-3" | "bundling";

/** Status pengerjaan paket ujian */
export type ExamCardStatus = "Belum Dikerjakan" | "Selesai" | "Hangus";

/** Item pembelian dari checkout */
export interface PurchasedItem {
  id: string;
  invoiceNumber?: string;
  agencyName: string;
  agencyShortName: string;
  positionTitle: string;
  positionCode: string;
  packageKey: PackageKey;
  packageName: string;
  price: number;
  examNumbers: number[];
  purchasedAt: string;
  expiresAt?: string;
  durationMs?: number;
}

/** Kartu paket yang ditampilkan di halaman Daftar Paket */
export interface ExamCardItem {
  cardId: string;
  packageId?: string;
  slug?: string;
  userId?: string;
  purchaseId: string;
  examNumber: number;
  packageTitle: string;
  positionTitle: string;
  agencyName: string;
  agencyShortName?: string;
  score: number;
  maxScore?: number;
  status: ExamCardStatus;
  attemptsCount?: number;
  totalQuestions: number;
  durationMinutes: number;
  purchasedAt: string;
  expiresAt: string;
  isBundling: boolean;
  validityDays: number;
}

/** Hasil kalkulasi sisa waktu aktif paket */
export interface TimeLeftResult {
  diffMs: number;
  isExpired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
