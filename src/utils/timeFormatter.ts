// src/utils/timeFormatter.ts

/**
 * Format detik menjadi format HH:MM:SS (01:30:00).
 * Digunakan di header countdown timer ujian CAT.
 */
export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Format detik menjadi teks deskriptif "X Menit Y Detik".
 * Digunakan di halaman hasil ujian.
 */
export function formatSpentTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins} Menit ${secs} Detik`;
}

/**
 * Kalkulasi sisa waktu (Hari, Jam, Menit, Detik) dari timestamp kadaluarsa.
 * Digunakan oleh countdown masa aktif paket.
 */
export function calculateTimeLeft(expiresAtStr: string, currentTime: number): {
  diffMs: number;
  isExpired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const expiresMs = new Date(expiresAtStr).getTime();
  const diffMs = Math.max(0, expiresMs - currentTime);
  const isExpired = diffMs <= 0;

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { diffMs, isExpired, days, hours, minutes, seconds };
}
