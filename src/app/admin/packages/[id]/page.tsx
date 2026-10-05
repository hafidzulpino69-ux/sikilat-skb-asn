"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Building,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  ListOrdered,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LoadingState from "@/components/LoadingState";
import { BulkUploadCSV, QuestionTable, EditQuestionModal } from "@/components/admin";
import { supabase } from "@/utils/supabaseClient";
import type { QuestionRecord } from "@/types";

interface PackageDetail {
  id: string;
  slug: string;
  title: string;
  agency_name: string;
  position_title: string;
  package_number: number;
  total_questions: number;
  duration_minutes: number;
  max_score: number;
  is_active: boolean;
}

// =========================================================================
// SECURITY GUARD: Email Whitelisting untuk Panel Administrator (Prinsip KISS)
// =========================================================================
const ADMIN_EMAILS = [
  "adminsikilatskb@gmail.com",
];

export default function AdminPackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageParamId = (params?.id as string) || "";

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string>("");

  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [activeTab, setActiveTab] = useState<"table" | "upload">("table");

  // State untuk modal edit/tambah manual
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionRecord | null>(null);

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

        // Verifikasi apakah user.email cocok dengan salah satu email di ADMIN_EMAILS
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

  // 2. Mengambil Data Paket & Butir Soal dari Supabase
  const fetchData = useCallback(async () => {
    if (!packageParamId) return;
    setIsLoadingData(true);

    try {
      // Ambil metadata paket berdasarkan ID atau slug
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          packageParamId
        );

      let query = supabase.from("packages").select("*");
      if (isUuid) {
        query = query.eq("id", packageParamId);
      } else {
        query = query.eq("slug", packageParamId);
      }

      const { data: pkg } = await query.maybeSingle();

      if (pkg) {
        setPackageData(pkg);

        // Ambil daftar butir soal untuk paket ini
        const { data: qData } = await supabase
          .from("questions")
          .select("*")
          .eq("package_id", pkg.id)
          .order("question_number", { ascending: true });

        if (qData) {
          setQuestions(qData);
        }
      }
    } catch {
      // Tangani kesalahan jaringan dengan aman
    } finally {
      setIsLoadingData(false);
    }
  }, [packageParamId]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, fetchData]);

  // Handler buka modal edit
  const handleOpenEdit = (q: QuestionRecord) => {
    setSelectedQuestion(q);
    setIsEditModalOpen(true);
  };

  // Handler buka modal tambah baru
  const handleOpenAddNew = () => {
    setSelectedQuestion(null);
    setIsEditModalOpen(true);
  };

  // Callback setelah upload CSV sukses
  const handleUploadSuccess = () => {
    fetchData();
    setActiveTab("table");
  };

  // State loading otentikasi
  if (isLoadingAuth) {
    return <LoadingState fullScreen message="Memverifikasi hak akses Admin..." />;
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
            Halaman ini khusus untuk Administrator Bank Soal SIKILAT SKB ASN.
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
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-30 bg-[#042E64] text-white border-b-4 border-[#FB6E09] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" inverted />
              <div className="h-7 w-[1px] bg-blue-300/30 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FB6E09] bg-[#FB6E09]/20 px-2 py-0.5 rounded-full border border-[#FB6E09]/30">
                  Panel Administrator
                </span>
                <div className="text-xs font-bold text-blue-200 mt-0.5">
                  Manajemen Bank Soal CAT
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B3E84] text-xs font-bold text-blue-200 border border-blue-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Admin: <strong>{adminUser?.name}</strong></span>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 text-[#FB6E09]" />
                <span>Ke Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Admin */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Info Paket yang Dikelola */}
        <div className="bg-white rounded-3xl border-3 border-[#F0DCBE] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Katalog Soal Ujian SKB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
                {packageData?.title || `Paket Soal (${packageParamId})`}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#FB6E09]" />
                  <span>{packageData?.agency_name || "Instansi Pemerintah"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#FB6E09]" />
                  <span>{packageData?.position_title || "Jabatan Fungsional"}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Refresh */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#042E64] bg-[#FCF4E7] hover:bg-[#F4E3CB] border border-[#F0DCBE] transition-colors cursor-pointer"
                title="Muat Ulang Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FB6E09] ${isLoadingData ? "animate-spin" : ""}`} />
                <span>Segarkan Data</span>
              </button>
            </div>
          </div>

          {/* Stats Bar Kuota Soal (0 - 100) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0DCBE]">
            <div className="p-3.5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE]">
              <span className="text-[11px] font-bold text-slate-500 block">Jumlah Soal Tersimpan</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#042E64]">{questions.length}</span>
                <span className="text-xs font-bold text-slate-500">/ 100 Soal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE]">
              <span className="text-[11px] font-bold text-slate-500 block">Status Kelengkapan</span>
              <div className="mt-1">
                {questions.length >= 100 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lengkap (Siap Ujian)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kurang {100 - questions.length} Butir Soal</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE]">
              <span className="text-[11px] font-bold text-slate-500 block">Format Soal CAT</span>
              <div className="text-xs font-bold text-[#042E64] mt-1">
                5 Opsi (A - E) • Bobot Benar: 5 Poin
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Mode Tampilan */}
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#F0DCBE] pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("table")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "table"
                  ? "bg-[#042E64] text-white shadow-md shadow-[#042E64]/20"
                  : "bg-white text-slate-600 hover:bg-[#FCF4E7] border border-[#F0DCBE]"
              }`}
            >
              <ListOrdered className="w-4 h-4 text-[#FB6E09]" />
              <span>Daftar Butir Soal ({questions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-[#042E64] text-white shadow-md shadow-[#042E64]/20"
                  : "bg-white text-slate-600 hover:bg-[#FCF4E7] border border-[#F0DCBE]"
              }`}
            >
              <UploadCloud className="w-4 h-4 text-[#FB6E09]" />
              <span>Upload Massal CSV</span>
            </button>
          </div>

          {activeTab === "table" && (
            <button
              type="button"
              onClick={handleOpenAddNew}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-[#FB6E09] hover:bg-[#E45E00] active:scale-98 transition-all shadow-md shadow-[#FB6E09]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Soal Manual</span>
            </button>
          )}
        </div>

        {/* Notifikasi jika paket tidak ditemukan */}
        {!packageData && !isLoadingData && (
          <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#042E64]">Paket Belum Terdaftar di Database</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Paket dengan ID / slug &quot;<strong>{packageParamId}</strong>&quot; belum ditemukan di tabel <code>packages</code> Supabase. Silakan pastikan paket sudah didaftarkan melalui pembelian atau input master paket.
            </p>
          </div>
        )}

        {/* Tab Konten: Upload Massal CSV */}
        {activeTab === "upload" && packageData && (
          <BulkUploadCSV
            packageId={packageData.id}
            currentQuestionCount={questions.length}
            onUploadSuccess={handleUploadSuccess}
          />
        )}

        {/* Tab Konten: Tabel Daftar Soal */}
        {activeTab === "table" && packageData && (
          <QuestionTable
            packageId={packageData.id}
            questions={questions}
            isLoading={isLoadingData}
            onRefresh={fetchData}
            onEditQuestion={handleOpenEdit}
            onAddNewQuestion={handleOpenAddNew}
          />
        )}
      </main>

      {/* Modal Edit / Tambah Soal Manual */}
      {isEditModalOpen && packageData && (
        <EditQuestionModal
          packageId={packageData.id}
          questionToEdit={selectedQuestion}
          nextQuestionNumber={questions.length + 1}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={() => {
            fetchData();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
