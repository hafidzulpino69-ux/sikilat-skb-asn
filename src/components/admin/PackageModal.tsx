"use client";

import { useState, useEffect } from "react";
import { X, Package, PlusCircle, Edit3, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import type { PackageRecord, PackageFormData } from "@/types/admin.types";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  packageToEdit: PackageRecord | null;
}

export default function PackageModal({
  isOpen,
  onClose,
  onSaved,
  packageToEdit,
}: PackageModalProps) {
  const isEditing = !!packageToEdit;

  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    slug: "",
    agency_name: "",
    position_title: "",
    package_number: 1,
    total_questions: 100,
    duration_minutes: 90,
    max_score: 500,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper untuk generate slug otomatis
  const generateSlug = (agency: string, position: string, pkgNum: number) => {
    const raw = `${agency} ${position} paket ${pkgNum}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return raw || `paket-${pkgNum}`;
  };

  useEffect(() => {
    if (packageToEdit) {
      setFormData({
        title: packageToEdit.title,
        slug: packageToEdit.slug,
        agency_name: packageToEdit.agency_name,
        position_title: packageToEdit.position_title,
        package_number: packageToEdit.package_number,
        total_questions: packageToEdit.total_questions || 100,
        duration_minutes: packageToEdit.duration_minutes || 90,
        max_score: packageToEdit.max_score || 500,
        is_active: packageToEdit.is_active,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        agency_name: "",
        position_title: "",
        package_number: 1,
        total_questions: 100,
        duration_minutes: 90,
        max_score: 500,
        is_active: true,
      });
    }
    setErrorMsg(null);
  }, [packageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validasi
    if (!formData.title.trim()) {
      setErrorMsg("Judul paket wajib diisi.");
      return;
    }
    if (!formData.agency_name.trim()) {
      setErrorMsg("Nama instansi wajib diisi.");
      return;
    }
    if (!formData.position_title.trim()) {
      setErrorMsg("Jabatan/Formasi wajib diisi.");
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMsg("Slug URL wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        agency_name: formData.agency_name.trim(),
        position_title: formData.position_title.trim(),
        package_number: Number(formData.package_number) || 1,
        total_questions: Number(formData.total_questions) || 100,
        duration_minutes: Number(formData.duration_minutes) || 90,
        max_score: (Number(formData.total_questions) || 100) * 5,
        is_active: formData.is_active,
      };

      if (isEditing && packageToEdit) {
        const { error } = await supabase
          .from("packages")
          .update(payload)
          .eq("id", packageToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("packages").insert([payload]);
        if (error) throw error;
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan saat menyimpan paket ujian.";
      if (err && typeof err === "object") {
        const e = err as Record<string, unknown>;
        if (typeof e.message === "string" && e.message.includes("packages_slug_key")) {
          msg = "Slug URL tersebut sudah digunakan oleh paket lain. Silakan ubah slug.";
        } else if (typeof e.message === "string") {
          msg = e.message;
        }
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border-2 border-[#F0DCBE] shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0DCBE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#042E64]">
                {isEditing ? "Edit Metadata Paket Ujian" : "Tambah Paket Ujian Baru"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Perbarui informasi judul, instansi, dan status paket ujian."
                  : "Buat paket latihan SKB baru yang akan tampil di katalog dan halaman admin."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Paket */}
          <div>
            <label className="block text-xs font-bold text-[#042E64] mb-1">
              Judul Paket <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title: val,
                  slug: prev.slug || generateSlug(prev.agency_name, prev.position_title, prev.package_number),
                }));
              }}
              placeholder="Contoh: Paket 1: SKB Kejaksaan RI (Ahli Pertama)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Instansi */}
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Nama Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.agency_name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    agency_name: val,
                    slug: generateSlug(val, prev.position_title, prev.package_number),
                  }));
                }}
                placeholder="Contoh: Kejaksaan Republik Indonesia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
                required
              />
            </div>

            {/* Jabatan / Formasi */}
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Jabatan / Formasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position_title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    position_title: val,
                    slug: generateSlug(prev.agency_name, val, prev.package_number),
                  }));
                }}
                placeholder="Contoh: Petugas Pengelola Barang Bukti"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Nomor Paket */}
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Nomor Paket (1 - 3) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.package_number}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  setFormData((prev) => ({
                    ...prev,
                    package_number: val,
                    slug: generateSlug(prev.agency_name, prev.position_title, val),
                  }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
              >
                <option value={1}>Paket 1</option>
                <option value={2}>Paket 2</option>
                <option value={3}>Paket 3</option>
              </select>
            </div>

            {/* Durasi Ujian */}
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Durasi Ujian (Menit)
              </label>
              <input
                type="number"
                min={1}
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration_minutes: Number(e.target.value) || 90,
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
              />
            </div>

            {/* Target Total Soal */}
            <div>
              <label className="block text-xs font-bold text-[#042E64] mb-1">
                Target Soal (CAT)
              </label>
              <input
                type="number"
                min={1}
                value={formData.total_questions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    total_questions: Number(e.target.value) || 100,
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
              />
            </div>
          </div>

          {/* Slug URL */}
          <div>
            <label className="block text-xs font-bold text-[#042E64] mb-1">
              Slug URL (Unik) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                }))
              }
              placeholder="Contoh: skb-kejaksaan-pengelola-barang-bukti-paket-1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Digunakan sebagai identifier URL paket (huruf kecil, angka, tanda strip).
            </span>
          </div>

          {/* Status Aktif */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#FB6E09] focus:ring-[#FB6E09] border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-[#042E64]">
                Paket Aktif &amp; Terbuka untuk Peserta (Tampil di Katalog)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#F0DCBE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : isEditing ? "Perbarui Paket" : "Simpan Paket"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
