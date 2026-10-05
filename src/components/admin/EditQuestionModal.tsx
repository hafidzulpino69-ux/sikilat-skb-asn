"use client";

import { useState } from "react";
import { X, Check, Loader2, Edit3, PlusCircle } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import type { QuestionRecord } from "@/types";

interface EditQuestionModalProps {
  packageId: string;
  questionToEdit: QuestionRecord | null; // null jika mode tambah baru
  nextQuestionNumber: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditQuestionModal({
  packageId,
  questionToEdit,
  nextQuestionNumber,
  onClose,
  onSaved,
}: EditQuestionModalProps) {
  const isEditing = !!questionToEdit;

  const [questionNumber, setQuestionNumber] = useState<number>(
    questionToEdit?.question_number || nextQuestionNumber
  );
  const [category, setCategory] = useState<string>(
    questionToEdit?.category || "SKB Khusus"
  );
  const [soal, setSoal] = useState<string>(questionToEdit?.soal || "");
  const [opsiA, setOpsiA] = useState<string>(questionToEdit?.opsi_a || "");
  const [opsiB, setOpsiB] = useState<string>(questionToEdit?.opsi_b || "");
  const [opsiC, setOpsiC] = useState<string>(questionToEdit?.opsi_c || "");
  const [opsiD, setOpsiD] = useState<string>(questionToEdit?.opsi_d || "");
  const [opsiE, setOpsiE] = useState<string>(questionToEdit?.opsi_e || "");
  const [kunciJawaban, setKunciJawaban] = useState<"A" | "B" | "C" | "D" | "E">(
    questionToEdit?.kunci_jawaban || "A"
  );
  const [pembahasan, setPembahasan] = useState<string>(
    questionToEdit?.pembahasan || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soal.trim()) {
      setErrorMsg("Teks pertanyaan / soal tidak boleh kosong.");
      return;
    }
    if (!opsiA.trim() || !opsiB.trim() || !opsiC.trim() || !opsiD.trim() || !opsiE.trim()) {
      setErrorMsg("Seluruh pilihan opsi jawaban (A sampai E) wajib diisi lengkap.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        package_id: packageId,
        question_number: questionNumber,
        category: category.trim() || "SKB Khusus",
        soal: soal.trim(),
        opsi_a: opsiA.trim(),
        opsi_b: opsiB.trim(),
        opsi_c: opsiC.trim(),
        opsi_d: opsiD.trim(),
        opsi_e: opsiE.trim(),
        kunci_jawaban: kunciJawaban,
        pembahasan: pembahasan.trim() || "Tidak ada pembahasan khusus.",
      };

      if (isEditing && questionToEdit?.id) {
        const { error } = await supabase
          .from("questions")
          .update(payload)
          .eq("id", questionToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("questions").insert([payload]);
        if (error) throw error;
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Gagal menyimpan butir soal: ${msg}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border-2 border-[#F0DCBE] shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0DCBE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#042E64]">
                {isEditing ? `Edit Butir Soal No. ${questionNumber}` : "Tambah Butir Soal Baru"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing ? "Perbarui isi soal, opsi jawaban, atau kunci." : "Input butir soal secara manual ke paket ini."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Metadata Soal: Nomor & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Nomor Soal
              </label>
              <input
                type="number"
                min={1}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#042E64] focus:outline-none focus:border-[#FB6E09]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Kategori Soal
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: SKB Teknis / Manajemen ASN"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FB6E09]"
                required
              />
            </div>
          </div>

          {/* Teks Pertanyaan */}
          <div>
            <label className="block text-xs font-bold text-[#042E64] mb-1">
              Pertanyaan / Teks Soal
            </label>
            <textarea
              rows={3}
              value={soal}
              onChange={(e) => setSoal(e.target.value)}
              placeholder="Tuliskan teks pertanyaan soal CAT di sini..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FB6E09] leading-relaxed"
              required
            />
          </div>

          {/* Opsi Jawaban (A - E) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black uppercase text-[#042E64] tracking-wider">
              Pilihan Jawaban (A - E):
            </label>

            {[
              { key: "A", val: opsiA, set: setOpsiA },
              { key: "B", val: opsiB, set: setOpsiB },
              { key: "C", val: opsiC, set: setOpsiC },
              { key: "D", val: opsiD, set: setOpsiD },
              { key: "E", val: opsiE, set: setOpsiE },
            ].map((opt) => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#042E64] text-white flex items-center justify-center font-black text-xs shrink-0">
                  {opt.key}
                </span>
                <input
                  type="text"
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                  placeholder={`Teks pilihan jawaban opsi ${opt.key}`}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FB6E09]"
                  required
                />
              </div>
            ))}
          </div>

          {/* Kunci Jawaban Resmi */}
          <div>
            <label className="block text-xs font-bold text-[#042E64] mb-1">
              Kunci Jawaban Resmi:
            </label>
            <select
              value={kunciJawaban}
              onChange={(e) => setKunciJawaban(e.target.value as "A" | "B" | "C" | "D" | "E")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-[#042E64] bg-white focus:outline-none focus:border-[#FB6E09]"
            >
              <option value="A">Opsi A (Paling Tepat)</option>
              <option value="B">Opsi B (Paling Tepat)</option>
              <option value="C">Opsi C (Paling Tepat)</option>
              <option value="D">Opsi D (Paling Tepat)</option>
              <option value="E">Opsi E (Paling Tepat)</option>
            </select>
          </div>

          {/* Pembahasan Soal */}
          <div>
            <label className="block text-xs font-bold text-[#042E64] mb-1">
              Pembahasan &amp; Dasar Hukum (Opsional)
            </label>
            <textarea
              rows={3}
              value={pembahasan}
              onChange={(e) => setPembahasan(e.target.value)}
              placeholder="Penjelasan pembahasan dan referensi regulasi jawaban yang benar..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FB6E09] leading-relaxed"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0DCBE]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-black text-xs text-white bg-[#FB6E09] hover:bg-[#E45E00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Simpan Soal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
