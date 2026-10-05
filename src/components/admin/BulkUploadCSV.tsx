"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import type { QuestionRecord, CSVQuestionRow, CSVParseValidation } from "@/types";

interface BulkUploadCSVProps {
  packageId: string;
  currentQuestionCount: number;
  onUploadSuccess: () => void;
}

// Template CSV contoh yang dapat diunduh
const SAMPLE_CSV_CONTENT = `soal,opsi_a,opsi_b,opsi_c,opsi_d,opsi_e,kunci_jawaban,pembahasan,kategori
"Berdasarkan UU ASN No. 20 Tahun 2023, batas usia pensiun bagi Pejabat Pimpinan Tinggi Utama dan Madya adalah...","56 tahun","58 tahun","60 tahun","62 tahun","65 tahun","C","Sesuai UU No. 20 Tahun 2023, batas usia pensiun Jabatan Pimpinan Tinggi (JPT) Utama dan Madya adalah 60 tahun.","Manajemen ASN"
"Asas penyelenggaraan kebijakan dan Manajemen ASN yang mengutamakan keahlian berlandaskan kode etik adalah asas...","Profesionalitas","Proporsionalitas","Akuntabilitas","Efisiensi","Netralitas","A","Asas Profesionalitas mengutamakan keahlian yang berlandaskan kode etik dan ketentuan peraturan perundang-undangan.","Kebijakan Publik"
"Tahapan investigasi wabah yang bertujuan memverifikasi apakah peningkatan kasus benar-benar terjadi adalah...","Membuat kurva epidemi","Memastikan diagnosis dan menetapkan adanya KLB","Menerapkan tindakan penanggulangan","Mengembangkan hipotesis","Menulis laporan akhir","B","Langkah awal dalam investigasi wabah adalah konfirmasi diagnosis dan verifikasi apakah peningkatan kasus melebihi batas endemis (KLB).","Epidemiologi"`;

export default function BulkUploadCSV({
  packageId,
  currentQuestionCount,
  onUploadSuccess,
}: BulkUploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseValidation | null>(null);
  const [replaceExisting, setReplaceExisting] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fungsi unduh template CSV
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_bank_soal_skb.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper normalisasi nama kolom
  const getField = (row: CSVQuestionRow, keys: string[]): string => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        return String(row[key]).trim();
      }
      // Coba versi lowercase
      const foundKey = Object.keys(row).find((k) => k.trim().toLowerCase() === key.toLowerCase());
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
        return String(row[foundKey]).trim();
      }
    }
    return "";
  };

  // Parsing file CSV dengan PapaParse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatusMessage(null);

    Papa.parse<CSVQuestionRow>(selectedFile, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        const rawRows = results.data;
        const validRows: Omit<QuestionRecord, "id">[] = [];
        const invalidRows: { rowNumber: number; reason: string }[] = [];

        rawRows.forEach((row, idx) => {
          const rowNumber = idx + 2; // +1 header, +1 1-indexed

          const soal = getField(row, ["soal", "question", "pertanyaan", "question_text"]);
          const opsi_a = getField(row, ["opsi_a", "option_a", "a", "pilihan_a"]);
          const opsi_b = getField(row, ["opsi_b", "option_b", "b", "pilihan_b"]);
          const opsi_c = getField(row, ["opsi_c", "option_c", "c", "pilihan_c"]);
          const opsi_d = getField(row, ["opsi_d", "option_d", "d", "pilihan_d"]);
          const opsi_e = getField(row, ["opsi_e", "option_e", "e", "pilihan_e"]);
          const kunciRaw = getField(row, ["kunci_jawaban", "kunci", "jawaban", "correct_answer", "answer"]).toUpperCase();
          const pembahasan = getField(row, ["pembahasan", "explanation", "penjelasan"]);
          const kategori = getField(row, ["kategori", "category"]) || "SKB Khusus";

          // Validasi butir
          if (!soal) {
            invalidRows.push({ rowNumber, reason: "Kolom soal kosong" });
            return;
          }
          if (!opsi_a || !opsi_b || !opsi_c || !opsi_d || !opsi_e) {
            invalidRows.push({ rowNumber, reason: "Pilihan opsi A, B, C, D, atau E belum lengkap" });
            return;
          }
          if (!["A", "B", "C", "D", "E"].includes(kunciRaw)) {
            invalidRows.push({
              rowNumber,
              reason: `Kunci jawaban '${kunciRaw}' tidak valid (wajib A, B, C, D, atau E)`,
            });
            return;
          }

          const startingNum = replaceExisting ? 1 : currentQuestionCount + 1;

          validRows.push({
            package_id: packageId,
            question_number: startingNum + validRows.length,
            category: kategori,
            soal,
            opsi_a,
            opsi_b,
            opsi_c,
            opsi_d,
            opsi_e,
            kunci_jawaban: kunciRaw as "A" | "B" | "C" | "D" | "E",
            pembahasan: pembahasan || "Tidak ada pembahasan khusus.",
          });
        });

        setParseResult({
          totalRows: rawRows.length,
          validRows,
          invalidRows,
        });
      },
      error: (error) => {
        setStatusMessage({
          type: "error",
          text: `Gagal membaca file CSV: ${error.message}`,
        });
      },
    });
  };

  // Eksekusi Bulk Insert ke Supabase
  const handleExecuteImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;
    setIsUploading(true);
    setStatusMessage(null);

    try {
      // 1. Jika opsi ganti semua dipilih: hapus soal lama di paket ini terlebih dahulu
      if (replaceExisting) {
        const { error: deleteError } = await supabase
          .from("questions")
          .delete()
          .eq("package_id", packageId);

        if (deleteError) {
          throw deleteError;
        }
      }

      // 2. Siapkan data dengan nomor soal berurutan
      const baseNumber = replaceExisting ? 1 : currentQuestionCount + 1;
      const payloadToInsert = parseResult.validRows.map((q, idx) => ({
        package_id: packageId,
        question_number: baseNumber + idx,
        category: q.category || "SKB Khusus",
        soal: q.soal,
        opsi_a: q.opsi_a,
        opsi_b: q.opsi_b,
        opsi_c: q.opsi_c,
        opsi_d: q.opsi_d,
        opsi_e: q.opsi_e,
        kunci_jawaban: q.kunci_jawaban,
        pembahasan: q.pembahasan || "",
      }));

      // 3. Bulk Insert (kirim dalam batch jika sangat besar, atau langsung 100 soal sekaligus)
      const batchSize = 100;
      for (let i = 0; i < payloadToInsert.length; i += batchSize) {
        const batch = payloadToInsert.slice(i, i + batchSize);
        const { error: insertError } = await supabase.from("questions").insert(batch);

        if (insertError) {
          throw insertError;
        }
      }

      setStatusMessage({
        type: "success",
        text: `Berhasil mengimpor ${payloadToInsert.length} butir soal ke dalam paket ujian!`,
      });

      // Reset file input
      setFile(null);
      setParseResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Trigger callback agar tabel soal ter-refresh
      onUploadSuccess();
    } catch (err: unknown) {
      let msg = "Terjadi kendala saat menyimpan butir soal ke database.";
      if (err && typeof err === "object") {
        const e = err as Record<string, unknown>;
        msg =
          (e.message as string) ||
          (e.details as string) ||
          (e.hint as string) ||
          "Gagal memproses data soal.";
      } else if (err instanceof Error) {
        msg = err.message;
      }

      setStatusMessage({
        type: "error",
        text: `Gagal mengunggah soal ke database: ${msg}. Pastikan Anda login sebagai Admin yang sah.`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetFile = () => {
    setFile(null);
    setParseResult(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#F0DCBE] p-6 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0DCBE]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider mb-1">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Bank Soal Massal</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#042E64]">
            Unggah Soal via Format CSV
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Unggah puluhan hingga 100+ butir soal sekaligus dalam hitungan detik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#042E64] bg-[#FCF4E7] hover:bg-[#F4E3CB] border border-[#F0DCBE] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#FB6E09]" />
          <span>Unduh Template CSV</span>
        </button>
      </div>

      {/* Area Drop / Input File */}
      <div className="space-y-4">
        <label
          htmlFor="csv-upload-input"
          className="border-2 border-dashed border-slate-300 hover:border-[#FB6E09] bg-slate-50/70 hover:bg-[#FCF4E7]/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#042E64]/10 group-hover:bg-[#FB6E09]/15 text-[#042E64] group-hover:text-[#FB6E09] flex items-center justify-center mb-3 transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-sm font-black text-[#042E64] group-hover:text-[#FB6E09] transition-colors">
            {file ? file.name : "Pilih atau Seret File CSV ke Sini"}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-medium">
            Mendukung file .csv (Format UTF-8 dengan pemisah koma)
          </span>

          <input
            ref={fileInputRef}
            id="csv-upload-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Informasi Format Kolom */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs font-medium">
          <HelpCircle className="w-4 h-4 text-[#FB6E09] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Format Kolom Wajib:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">soal</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">opsi_a</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">opsi_b</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">opsi_c</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">opsi_d</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">opsi_e</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">kunci_jawaban</code>,{" "}
            <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">pembahasan</code>.
          </div>
        </div>
      </div>

      {/* Preview Hasil Parsing */}
      {parseResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF4E7]/70 border border-[#F0DCBE] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-black text-[#042E64]">
              Ringkasan File: {file?.name}
            </h3>
            <button
              type="button"
              onClick={handleResetFile}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Ganti File</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-white border border-[#F0DCBE]">
              <span className="text-slate-500 block text-[11px]">Total Baris Data</span>
              <span className="text-base font-black text-[#042E64]">{parseResult.totalRows}</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-300">
              <span className="text-emerald-700 block text-[11px]">Siap Diimpor</span>
              <span className="text-base font-black text-emerald-700">{parseResult.validRows.length} Soal</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-rose-300 col-span-2 sm:col-span-1">
              <span className="text-rose-700 block text-[11px]">Baris Tidak Valid</span>
              <span className="text-base font-black text-rose-700">{parseResult.invalidRows.length}</span>
            </div>
          </div>

          {/* Rincian Baris Tidak Valid jika ada */}
          {parseResult.invalidRows.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1.5 max-h-36 overflow-y-auto">
              <div className="font-black text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Peringatan Baris Tidak Valid (akan diabaikan):</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {parseResult.invalidRows.map((inv, i) => (
                  <li key={i}>
                    Baris ke-{inv.rowNumber}: <strong>{inv.reason}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opsi Timpa vs Tambah */}
          <div className="pt-2 border-t border-[#F0DCBE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#042E64]">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="w-4 h-4 rounded text-[#FB6E09] focus:ring-[#FB6E09]"
              />
              <span>
                Ganti seluruh soal lama di paket ini (Hapus {currentQuestionCount} soal lama dan masukkan {parseResult.validRows.length} soal baru)
              </span>
            </label>

            <button
              type="button"
              disabled={isUploading || parseResult.validRows.length === 0}
              onClick={handleExecuteImport}
              className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengimpor ke Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mulai Import ({parseResult.validRows.length} Soal)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Notifikasi */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-950 border border-emerald-300"
              : "bg-rose-50 text-rose-950 border border-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
