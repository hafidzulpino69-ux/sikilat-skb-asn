// src/utils/storageHelper.ts
import type {
  ExamAutosaveSession,
  LastExamResult,
  PackageScoresMap,
  PackageScoreRecord,
} from "@/types";
import {
  STORAGE_KEY_EXAM_SESSION_PREFIX,
  STORAGE_KEY_LAST_EXAM_RESULT,
  STORAGE_KEY_PACKAGE_SCORES,
  STORAGE_KEY_USER_PROFILE,
} from "@/constants";

// ─── Autosave Session ────────────────────────────────────────────────────

/** Menghasilkan key localStorage untuk sesi autosave paket tertentu */
export function getSessionKey(cardId: string): string {
  return `${STORAGE_KEY_EXAM_SESSION_PREFIX}${cardId}`;
}

/** Membaca sesi autosave dari localStorage */
export function loadAutosaveSession(cardId: string): ExamAutosaveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getSessionKey(cardId));
    if (!raw) return null;
    return JSON.parse(raw) as ExamAutosaveSession;
  } catch {
    return null;
  }
}

/** Menyimpan sesi autosave ke localStorage */
export function saveAutosaveSession(
  cardId: string,
  data: Omit<ExamAutosaveSession, "cardId" | "lastSavedAt">
): void {
  if (typeof window === "undefined") return;
  try {
    const session: ExamAutosaveSession = {
      ...data,
      cardId,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(getSessionKey(cardId), JSON.stringify(session));
  } catch (e) {
    console.error("Gagal melakukan autosave:", e);
  }
}

/** Menghapus sesi autosave dari localStorage (dipanggil saat ujian selesai) */
export function clearAutosaveSession(cardId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getSessionKey(cardId));
  } catch (e) {
    console.error("Gagal menghapus autosave session:", e);
  }
}

// ─── Exam Result ─────────────────────────────────────────────────────────

/** Menyimpan hasil ujian terakhir */
export function saveLastExamResult(result: LastExamResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_LAST_EXAM_RESULT, JSON.stringify(result));
}

/** Membaca hasil ujian terakhir */
export function loadLastExamResult(): LastExamResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_EXAM_RESULT);
    if (!raw) return null;
    return JSON.parse(raw) as LastExamResult;
  } catch {
    return null;
  }
}

// ─── Package Scores ──────────────────────────────────────────────────────

/** Membaca seluruh skor paket dari localStorage */
export function loadPackageScores(): PackageScoresMap {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_PACKAGE_SCORES) ||
      localStorage.getItem("user_scores");
    if (!raw) return {};
    return JSON.parse(raw) as PackageScoresMap;
  } catch {
    return {};
  }
}

/** Menyimpan/update skor paket */
export function savePackageScores(scores: PackageScoresMap): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(scores);
    localStorage.setItem(STORAGE_KEY_PACKAGE_SCORES, serialized);
    localStorage.setItem("user_scores", serialized);
  } catch (e) {
    console.error("Gagal menyimpan package scores:", e);
  }
}

/**
 * Update skor HANYA untuk satu ID paket spesifik (misal: "paket-1", "paket-2", "paket-3").
 * Format penyimpanan localStorage berupa Object/Dictionary:
 * {
 *   "paket-1": { highestScore: 100, attemptsCount: 1, ... },
 *   "paket-2": { highestScore: 0, attemptsCount: 0, ... }
 * }
 */
export function updatePackageScore(
  packageId: string,
  newScore: number,
  cardId?: string
): { highestScore: number; previousHighest: number; attemptsCount: number } {
  const scores = loadPackageScores();

  // Bersihkan key global lama 'default-exam-card' jika ada agar tidak mencemari paket lain
  if ("default-exam-card" in scores) {
    delete scores["default-exam-card"];
  }

  // Ambil record yang sudah ada HANYA untuk packageId ini (atau cardId ini)
  const prev = scores[packageId] || (cardId ? scores[cardId] : undefined);
  const previousHighest = prev?.highestScore ?? 0;
  const newHighest = Math.max(previousHighest, newScore);
  const prevAttempts = prev?.attemptsCount ?? prev?.attempts ?? 0;
  const newAttempts = prevAttempts + 1;

  const record: PackageScoreRecord = {
    highestScore: newHighest,
    lastScore: newScore,
    attemptsCount: newAttempts,
    attempts: newAttempts,
    status: "Selesai",
    lastCompletedAt: new Date().toISOString(),
  };

  // Simpan secara independen HANYA untuk packageId ini
  scores[packageId] = record;
  if (cardId && cardId !== packageId) {
    scores[cardId] = record;
  }

  savePackageScores(scores);
  return { highestScore: newHighest, previousHighest, attemptsCount: newAttempts };
}

// ─── Purchased Packages ──────────────────────────────────────────────────
// Dipindahkan ke Supabase (tabel user_packages + RPC purchase_packages).

// ─── User Profile ────────────────────────────────────────────────────────

/** Membaca profil pengguna */
export function loadUserProfile(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
