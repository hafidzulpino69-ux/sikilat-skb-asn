"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import type { QuestionRecord } from "@/types";

interface QuestionTableProps {
  packageId: string;
  questions: QuestionRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onEditQuestion: (q: QuestionRecord) => void;
  onAddNewQuestion: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function QuestionTable({
  packageId,
  questions,
  isLoading,
  onRefresh,
  onEditQuestion,
  onAddNewQuestion,
}: QuestionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Filter soal berdasarkan teks pencarian
  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return questions;
    const term = searchTerm.toLowerCase();

    return questions.filter((q) => {
      return (
        q.soal.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.opsi_a.toLowerCase().includes(term) ||
        q.opsi_b.toLowerCase().includes(term) ||
        q.opsi_c.toLowerCase().includes(term) ||
        q.opsi_d.toLowerCase().includes(term) ||
        q.opsi_e.toLowerCase().includes(term) ||
        q.pembahasan.toLowerCase().includes(term) ||
        String(q.question_number).includes(term)
      );
    });
  }, [questions, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  // Hapus satu butir soal
  const handleDeleteOne = async (id: string, num: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus Soal No. ${num}?`)) return;
    setDeletingId(id);

    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
      onRefresh();
    } catch {
      alert("Gagal menghapus butir soal. Silakan coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  // Hapus seluruh soal di paket ini
  const handleDeleteAll = async () => {
    if (questions.length === 0) return;
    if (
      !confirm(
        `PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SELURUH ${questions.length} butir soal di paket ini? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setIsDeletingAll(true);
    try {
      const { error } = await supabase.from("questions").delete().eq("package_id", packageId);
      if (error) throw error;
      onRefresh();
    } catch {
      alert("Gagal menghapus seluruh soal. Silakan coba lagi.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#F0DCBE] p-5 sm:p-7 shadow-sm space-y-5">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0DCBE]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-[#042E64]">Daftar Butir Soal</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FB6E09]/15 text-[#FB6E09]">
              {questions.length} / 100 Soal
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Kelola, edit, atau hapus butir soal yang tersimpan di dalam database paket ini.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onAddNewQuestion}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#042E64] hover:bg-[#0B3E84] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#FB6E09]" />
            <span>Tambah Manual</span>
          </button>

          {questions.length > 0 && (
            <button
              type="button"
              disabled={isDeletingAll}
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari berdasarkan teks soal, kategori, atau opsi jawaban..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FB6E09] bg-slate-50/50"
        />
      </div>

      {/* Tabel Soal */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
          <div className="w-7 h-7 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold">Memuat daftar soal...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-[#042E64]">Belum Ada Soal di Paket Ini</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Paket ini masih kosong. Silakan gunakan fitur <strong>Upload Massal CSV</strong> di atas atau tekan tombol <strong>Tambah Manual</strong>.
          </p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs font-medium">
          Tidak ditemukan butir soal dengan kata kunci &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#042E64] text-white">
                  <th className="py-3 px-3.5 font-black w-14 text-center">No</th>
                  <th className="py-3 px-4 font-black">Pertanyaan &amp; Pilihan Jawaban</th>
                  <th className="py-3 px-3 font-black w-24 text-center">Kunci</th>
                  <th className="py-3 px-4 font-black hidden md:table-cell">Pembahasan</th>
                  <th className="py-3 px-3.5 font-black w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nomor Soal */}
                    <td className="py-3 px-3.5 font-black text-center text-[#042E64]">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 inline-flex items-center justify-center border border-slate-200">
                        {q.question_number}
                      </span>
                    </td>

                    {/* Teks Soal & Opsi */}
                    <td className="py-3 px-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#042E64] border border-blue-200">
                          {q.category}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-900 leading-snug">
                        {q.soal}
                      </div>

                      {/* Opsi A - E */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px] text-slate-600">
                        <div className={q.kunci_jawaban === "A" ? "font-bold text-emerald-700" : ""}>
                          <strong>A.</strong> {q.opsi_a}
                        </div>
                        <div className={q.kunci_jawaban === "B" ? "font-bold text-emerald-700" : ""}>
                          <strong>B.</strong> {q.opsi_b}
                        </div>
                        <div className={q.kunci_jawaban === "C" ? "font-bold text-emerald-700" : ""}>
                          <strong>C.</strong> {q.opsi_c}
                        </div>
                        <div className={q.kunci_jawaban === "D" ? "font-bold text-emerald-700" : ""}>
                          <strong>D.</strong> {q.opsi_d}
                        </div>
                        <div className={q.kunci_jawaban === "E" ? "font-bold text-emerald-700" : ""}>
                          <strong>E.</strong> {q.opsi_e}
                        </div>
                      </div>
                    </td>

                    {/* Kunci Jawaban */}
                    <td className="py-3 px-3 text-center align-top pt-4">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center justify-center font-black text-sm shadow-2xs">
                        {q.kunci_jawaban}
                      </span>
                    </td>

                    {/* Pembahasan */}
                    <td className="py-3 px-4 hidden md:table-cell align-top pt-4 text-[11px] text-slate-600 font-medium leading-relaxed max-w-xs">
                      {q.pembahasan || <span className="text-slate-400 italic">Tidak ada pembahasan</span>}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3.5 text-center align-top pt-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditQuestion(q)}
                          className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit Butir Soal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === q.id}
                          onClick={() => handleDeleteOne(q.id, q.question_number)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Butir Soal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kontrol Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total {filteredQuestions.length} Soal)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
