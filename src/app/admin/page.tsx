"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  PlusCircle,
  Search,
  Building,
  Briefcase,
  Layers,
  Edit3,
  Trash2,
  UploadCloud,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LoadingState from "@/components/LoadingState";
import { PackageModal } from "@/components/admin";
import { supabase } from "@/utils/supabaseClient";
import type { PackageRecord } from "@/types/admin.types";

// =========================================================================
// SECURITY GUARD: Email Whitelisting untuk Panel Administrator (Prinsip KISS)
// =========================================================================
const ADMIN_EMAILS = [
  "adminsikilatskb@gmail.com",
];

export default function AdminMasterDashboardPage() {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string>("");

  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // State untuk modal tambah / edit paket
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<PackageRecord | null>(null);

  // State untuk konfirmasi hapus paket
  const [packageToDelete, setPackageToDelete] = useState<PackageRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State notifikasi
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Verifikasi Keamanan Hak Akses Admin via Email Whitelisting
  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user || !user.email) {
          setIsAdmin(false);
          setCurrentEmail("");
          setIsLoadingAuth(false);
          return;
        }

        const email = user.email.trim().toLowerCase();
        setCurrentEmail(user.email);
        const name =
          user.user_metadata?.full_name ||
          user.email.split("@")[0] ||
          "Administrator";

        const isAuthorized = ADMIN_EMAILS.some(
          (adminEmail) => adminEmail.trim().toLowerCase() === email
        );

        if (isAuthorized) {
          setIsAdmin(true);
          setAdminUser({ email: user.email, name });
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    checkAdminAuth();
  }, []);

  // 2. Fetch seluruh paket dan agregasi jumlah soal dari Supabase secara real-time
  const fetchPackages = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Ambil seluruh data paket beserta hitungan jumlah butir soal riil via questions(count)
      const { data: pkgs, error: pkgErr } = await supabase
        .from("packages")
        .select("*, questions(count)")
        .order("created_at", { ascending: false });

      if (pkgErr) throw pkgErr;

      const formattedPackages: PackageRecord[] = (pkgs || []).map((p: any) => {
        let questionCount = 0;
        if (Array.isArray(p.questions) && p.questions.length > 0) {
          questionCount = Number(p.questions[0].count) || 0;
        } else if (p.questions && typeof p.questions === "object" && "count" in p.questions) {
          questionCount = Number((p.questions as { count?: unknown }).count) || 0;
        }

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          agency_name: p.agency_name,
          position_title: p.position_title,
          package_number: p.package_number,
          total_questions: p.total_questions || 100,
          duration_minutes: p.duration_minutes || 90,
          max_score: p.max_score || 500,
          is_active: p.is_active ?? true,
          created_at: p.created_at,
          question_count: questionCount,
        };
      });

      setPackages(formattedPackages);
    } catch {
      setFeedbackMsg({
        type: "error",
        text: "Gagal memuat daftar paket dari database.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchPackages();
    }
  }, [isAdmin, fetchPackages]);

  // Handler Hapus Paket
  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;

    setIsDeleting(true);
    setFeedbackMsg(null);

    try {
      const { error } = await supabase
        .from("packages")
        .delete()
        .eq("id", packageToDelete.id);

      if (error) throw error;

      setFeedbackMsg({
        type: "success",
        text: `Paket "${packageToDelete.title}" beserta seluruh soalnya berhasil dihapus.`,
      });
      setPackageToDelete(null);
      fetchPackages();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Gagal menghapus paket.";
      setFeedbackMsg({
        type: "error",
        text: `Error saat menghapus paket: ${msg}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search daftar paket
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        pkg.title.toLowerCase().includes(query) ||
        pkg.agency_name.toLowerCase().includes(query) ||
        pkg.position_title.toLowerCase().includes(query) ||
        pkg.slug.toLowerCase().includes(query);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && pkg.is_active) ||
        (statusFilter === "inactive" && !pkg.is_active);

      return matchQuery && matchStatus;
    });
  }, [packages, searchQuery, statusFilter]);

  // Metrik ringkasan
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.is_active).length;
    const agencies = new Set(packages.map((p) => p.agency_name)).size;
    const totalQuestions = packages.reduce((acc, curr) => acc + (curr.question_count || 0), 0);
    return { total, active, agencies, totalQuestions };
  }, [packages]);

  // State loading otentikasi
  if (isLoadingAuth) {
    return <LoadingState fullScreen message="Memverifikasi hak akses Master Administrator..." />;
  }

  // Tampilan jika bukan admin terotorisasi
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FCF4E7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-rose-300 max-w-md w-full text-center space-y-4 shadow-xl animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#042E64]">Akses Ditolak (Khusus Admin)</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Halaman ini khusus untuk Master Administrator SIKILAT SKB ASN.
            {currentEmail ? (
              <>
                <br />
                Akun (<strong className="text-rose-600">{currentEmail}</strong>) tidak terdaftar di daftar email administrator resmi.
              </>
            ) : (
              " Silakan login terlebih dahulu menggunakan akun administrator."
            )}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl font-black text-xs text-white bg-[#042E64] hover:bg-[#0B3E84] transition-colors"
            >
              Kembali ke Dashboard Utama
            </Link>
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Login Ulang dengan Akun Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col font-sans">
      {/* Top Navbar Master Admin */}
      <header className="sticky top-0 z-30 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" inverted />
              <div className="h-7 w-[1px] bg-blue-300/30 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FB6E09] bg-[#FB6E09]/20 px-2 py-0.5 rounded-full border border-[#FB6E09]/30">
                  Master Administrator
                </span>
                <div className="text-xs font-bold text-blue-200 mt-0.5">
                  Manajemen Katalog &amp; Paket Ujian
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/50 border border-blue-400/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-blue-100 font-medium">Admin:</span>
                <span className="font-black text-white">{adminUser?.email}</span>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-blue-900/70 hover:bg-blue-800 border border-blue-400/30 transition-all"
              >
                <span>Lihat Dashboard User</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FB6E09]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Feedback / Pesan Sukses */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-200 border-2 ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-rose-50 border-rose-300 text-rose-950"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              {feedbackMsg.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-xs font-black px-2 py-1 rounded-lg hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section Header: Title & CTA Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalog Paket Tryout SKB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
              Master Manajemen Paket Soal
            </h1>
            <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium">
              Buat, edit, dan kelola paket tryout SKB beserta pengalihan ke upload bank soal secara massal.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchPackages}
              disabled={isLoadingData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#F0DCBE] text-xs font-bold text-[#042E64] hover:bg-[#F4E3CB] transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-[#FB6E09] ${isLoadingData ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPackageToEdit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm text-white bg-[#FB6E09] hover:bg-[#E45E00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Paket Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Statistik Ringkasan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#F0DCBE] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Paket
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">
              {stats.total}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Paket terdaftar di database</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#F0DCBE] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Paket Aktif
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.active}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Bisa diakses peserta</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#F0DCBE] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#FB6E09] uppercase tracking-wider">
              Instansi Terdaftar
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#FB6E09]">
              {stats.agencies}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Kementerian &amp; Lembaga</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#F0DCBE] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Total Butir Soal
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-900">
              {stats.totalQuestions}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Tersimpan di Bank Soal</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#F0DCBE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Input Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, instansi, jabatan, atau slug..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FB6E09]/30 focus:border-[#FB6E09]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>

            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#042E64] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({packages.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Aktif ({packages.filter((p) => p.is_active).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-slate-700 text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Nonaktif ({packages.filter((p) => !p.is_active).length})
            </button>
          </div>
        </div>

        {/* Tabel / Daftar Paket */}
        {isLoadingData ? (
          <div className="bg-white rounded-3xl p-12 border-2 border-[#F0DCBE] text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 border-3 border-[#FB6E09] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#042E64]">Memuat daftar paket dari database...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border-2 border-[#F0DCBE] max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#042E64]">
              {searchQuery ? "Tidak Ada Paket yang Cocok" : "Belum Ada Paket Ujian"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {searchQuery
                ? `Tidak ditemukan paket dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`
                : "Belum ada paket ujian yang dibuat di sistem. Mulai dengan membuat paket pertama."}
            </p>
            <div>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#042E64] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Reset Pencarian
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPackageToEdit(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-black text-xs text-white bg-[#FB6E09] hover:bg-[#E45E00] shadow-md shadow-[#FB6E09]/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Paket Sekarang</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-[#F0DCBE] shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#042E64] text-white border-b-2 border-[#FB6E09]">
                    <th className="py-3.5 px-4 font-black uppercase text-[11px] tracking-wider">
                      Paket &amp; Instansi
                    </th>
                    <th className="py-3.5 px-4 font-black uppercase text-[11px] tracking-wider hidden md:table-cell">
                      Formasi / Jabatan
                    </th>
                    <th className="py-3.5 px-4 font-black uppercase text-[11px] tracking-wider text-center">
                      Butir Soal
                    </th>
                    <th className="py-3.5 px-4 font-black uppercase text-[11px] tracking-wider text-center">
                      Status
                    </th>
                    <th className="py-3.5 px-4 font-black uppercase text-[11px] tracking-wider text-right">
                      Aksi Pengelolaan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPackages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Kolom Paket & Instansi */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FB6E09]/15 text-[#FB6E09]">
                              Paket {pkg.package_number}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">
                              {pkg.slug}
                            </span>
                          </div>
                          <div className="font-black text-[#042E64] text-sm leading-snug">
                            {pkg.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{pkg.agency_name}</span>
                          </div>
                          {/* Tampilan formasi di layar mobile */}
                          <div className="md:hidden flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-0.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{pkg.position_title}</span>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Formasi (Tablet & Desktop) */}
                      <td className="py-4 px-4 align-top hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#042E64] text-xs sm:text-sm">
                            <Briefcase className="w-3.5 h-3.5 text-[#FB6E09] shrink-0" />
                            <span>{pkg.position_title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Durasi: {pkg.duration_minutes} Menit • Target: {pkg.total_questions} Soal
                          </div>
                        </div>
                      </td>

                      {/* Kolom Butir Soal */}
                      <td className="py-4 px-4 align-top text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-black border ${
                              (pkg.question_count || 0) > 0
                                ? "bg-blue-50 text-[#042E64] border-blue-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}
                          >
                            {pkg.question_count || 0} Soal
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">
                            Target {pkg.total_questions}
                          </span>
                        </div>
                      </td>

                      {/* Kolom Status */}
                      <td className="py-4 px-4 align-top text-center">
                        {pkg.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>

                      {/* Kolom Aksi */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Tombol Kelola Soal (Link ke /admin/packages/[id]) */}
                          <Link
                            href={`/admin/packages/${pkg.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs text-white bg-[#042E64] hover:bg-[#0B3E84] shadow-xs transition-colors cursor-pointer"
                            title="Buka Halaman Bank Soal & Upload CSV"
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-[#FB6E09]" />
                            <span>Kelola Soal</span>
                          </Link>

                          {/* Tombol Edit */}
                          <button
                            type="button"
                            onClick={() => {
                              setPackageToEdit(pkg);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-xl text-slate-600 hover:text-[#042E64] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                            title="Edit Metadata Paket"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => setPackageToDelete(pkg)}
                            className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Paket Ujian"
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

            {/* Footer Tabel Info */}
            <div className="px-4 py-3 bg-[#FCF4E7]/60 border-t border-[#F0DCBE] flex flex-wrap items-center justify-between text-xs text-[#042E64]/80 font-medium gap-2">
              <div>
                Menampilkan <strong>{filteredPackages.length}</strong> dari <strong>{packages.length}</strong> total paket.
              </div>
              <div className="text-[11px] text-slate-500">
                Klik <strong>&quot;Kelola Soal&quot;</strong> pada baris paket untuk upload CSV atau manajemen butir soal CAT.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Tambah / Edit Paket */}
      <PackageModal
        isOpen={isModalOpen}
        packageToEdit={packageToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setPackageToEdit(null);
        }}
        onSaved={() => {
          fetchPackages();
          setFeedbackMsg({
            type: "success",
            text: packageToEdit
              ? "Perubahan paket ujian berhasil disimpan."
              : "Paket ujian baru berhasil dibuat dan disimpan ke Supabase.",
          });
        }}
      />

      {/* Modal Konfirmasi Hapus Paket */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-2 border-rose-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#042E64]">
                  Hapus Paket Ujian?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs">
              <div className="font-bold text-rose-950">
                Paket yang akan dihapus:
              </div>
              <div className="font-black text-[#042E64] text-sm">
                {packageToDelete.title}
              </div>
              <div className="text-rose-800 leading-relaxed font-medium">
                Peringatan: Seluruh <strong>{packageToDelete.question_count || 0} butir soal</strong> di dalam paket ini juga akan otomatis terhapus dari bank soal (Cascade Delete).
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Paket"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
