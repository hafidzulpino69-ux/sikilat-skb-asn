// src/utils/agencyHelper.ts

/**
 * Mengembalikan nama singkat/ringkas untuk instansi pemerintah.
 * Digunakan sebagai label singkat pada judul kartu paket.
 */
export function getAgencyShortName(agencyName: string, agencyShortName?: string): string {
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
