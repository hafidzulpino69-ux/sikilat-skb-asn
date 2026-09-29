"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Award,
  LogOut,
  FileCheck,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Zap,
  Building2,
  Briefcase,
  ChevronRight,
  Search,
  ArrowLeft,
  Check,
  Sparkles,
  PlayCircle,
  HeartPulse,
  Wallet,
  GraduationCap,
  Scale,
  Shield,
  Layers,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  AGENCIES_DATA,
  AgencyItem,
  PositionItem,
  PackageItem,
} from "@/data/skbCatalog";

interface UserData {
  name: string;
  email: string;
  package?: string;
  isLoggedIn: boolean;
}

export default function DashboardPage() {
  const router = useRouter();

  // User session state
  const [user, setUser] = useState<UserData>({
    name: "Peserta SIKILAT",
    email: "peserta@example.com",
    package: "bundling-skb",
    isLoggedIn: true,
  });

  // Flow State for Poin 1:
  // Step 1: Instansi -> Step 2: Jabatan -> Step 3: Paket Ujian
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("kemenkes");
  const [selectedPositionId, setSelectedPositionId] = useState<string>("kemenkes-epidemiolog");
  const [selectedPackageType, setSelectedPackageType] = useState<"satuan" | "bundling">("bundling");
  const [isPackageConfirmed, setIsPackageConfirmed] = useState<boolean>(true);

  // Search queries
  const [searchAgency, setSearchAgency] = useState<string>("");
  const [searchPosition, setSearchPosition] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("skb_mock_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      }

      // Restore saved selections if any
      const savedAgency = localStorage.getItem("skb_selected_agency");
      const savedPos = localStorage.getItem("skb_selected_position");
      const savedPkg = localStorage.getItem("skb_selected_package");

      if (savedAgency) setSelectedAgencyId(savedAgency);
      if (savedPos) setSelectedPositionId(savedPos);
      if (savedPkg === "satuan" || savedPkg === "bundling") {
        setSelectedPackageType(savedPkg);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skb_mock_user");
      localStorage.removeItem("skb_terms_accepted");
    }
    router.push("/login");
  };

  // Resolve current active agency
  const currentAgency = useMemo(() => {
    return (
      AGENCIES_DATA.find((a) => a.id === selectedAgencyId) || AGENCIES_DATA[0]
    );
  }, [selectedAgencyId]);

  // Resolve current active position
  const currentPosition = useMemo(() => {
    if (!currentAgency) return null;
    return (
      currentAgency.positions.find((p) => p.id === selectedPositionId) ||
      currentAgency.positions[0] ||
      null
    );
  }, [currentAgency, selectedPositionId]);

  // Filtered agencies based on search
  const filteredAgencies = useMemo(() => {
    if (!searchAgency.trim()) return AGENCIES_DATA;
    const q = searchAgency.toLowerCase();
    return AGENCIES_DATA.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.shortName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [searchAgency]);

  // Filtered positions for current agency based on search
  const filteredPositions = useMemo(() => {
    if (!currentAgency) return [];
    if (!searchPosition.trim()) return currentAgency.positions;
    const q = searchPosition.toLowerCase();
    return currentAgency.positions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [currentAgency, searchPosition]);

  // Handlers for steps
  const handleSelectAgency = (agencyId: string) => {
    setSelectedAgencyId(agencyId);
    const agency = AGENCIES_DATA.find((a) => a.id === agencyId);
    if (agency && agency.positions.length > 0) {
      setSelectedPositionId(agency.positions[0].id);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("skb_selected_agency", agencyId);
      if (agency && agency.positions.length > 0) {
        localStorage.setItem("skb_selected_position", agency.positions[0].id);
      }
    }
  };

  const handleSelectPosition = (positionId: string) => {
    setSelectedPositionId(positionId);
    if (typeof window !== "undefined") {
      localStorage.setItem("skb_selected_position", positionId);
    }
  };

  const handleSelectPackage = (type: "satuan" | "bundling") => {
    setSelectedPackageType(type);
    setIsPackageConfirmed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("skb_selected_package", type);
    }
  };

  // Helper icon for agency
  const renderAgencyIcon = (type: AgencyItem["iconType"]) => {
    switch (type) {
      case "health":
        return <HeartPulse className="w-5 h-5 text-[#FB6E09]" />;
      case "finance":
        return <Wallet className="w-5 h-5 text-[#FB6E09]" />;
      case "justice":
        return <Scale className="w-5 h-5 text-[#FB6E09]" />;
      case "education":
        return <GraduationCap className="w-5 h-5 text-[#FB6E09]" />;
      case "law":
        return <Shield className="w-5 h-5 text-[#FB6E09]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#FB6E09]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col">
      {/* Top Navbar Dashboard */}
      <header className="sticky top-0 z-30 bg-[#FCF4E7]/90 backdrop-blur-md border-b-2 border-[#F0DCBE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-black text-[#042E64]">{user.name}</span>
                <span className="text-[11px] text-[#042E64]/60 font-semibold">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Package Active Banner */}
        <div className="bg-[#042E64] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#042E64]/20 border-3 border-[#FB6E09] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/20 text-[#FB6E09] border border-[#FB6E09]/40 text-xs font-black">
              <Zap className="w-3.5 h-3.5 fill-[#FB6E09]" />
              <span>Dashboard Seleksi SKB 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang, {user.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Silakan tentukan <strong>Instansi</strong> dan <strong>Jabatan Formasi</strong> yang Anda lamar untuk mengakses simulasi ujian CAT BKN spesifik dan akurat.
            </p>
          </div>

          {/* Current Selection Summary Card */}
          <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20 text-xs space-y-1.5 shrink-0 w-full md:w-auto">
            <div className="font-black text-[#FB6E09] uppercase tracking-wider text-[11px]">
              Formasi Aktif Dipilih
            </div>
            <div className="text-sm font-black text-white">
              {currentAgency.shortName} - {currentPosition?.title || "Belum dipilih"}
            </div>
            <div className="flex items-center gap-2 text-blue-200 text-[11px] font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-[#FB6E09]" />
              <span>
                Paket: {selectedPackageType === "bundling" ? "Bundling SKB (3 Ujian)" : "Satuan (1 Ujian)"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Total Instansi</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">{AGENCIES_DATA.length} Kementerian/Lembaga</div>
            <div className="text-[11px] text-[#FB6E09] font-black flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Database Terupdate BKN
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Durasi Ujian Resmi</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">100 Menit</div>
            <div className="text-[11px] text-[#FB6E09] font-black flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 110 Butir Soal CAT BKN
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Ambang Batas (Passing Grade)</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">
              {currentPosition ? currentPosition.passingScore : 350}
            </div>
            <div className="text-[11px] text-[#042E64]/50 font-semibold">Standar Kelulusan Formasi</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#F0DCBE] shadow-2xs space-y-1">
            <div className="text-xs text-[#042E64]/65 font-bold">Peringkat Nasional</div>
            <div className="text-2xl sm:text-3xl font-black text-[#042E64]">-</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Real-Time per Jabatan
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FITUR POIN 1: ALUR PEMILIHAN INSTANSI -> JABATAN -> PAKET (SATUAN/BUNDLING) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          {/* Section Title & Progress Stepper */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#F0DCBE] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5 fill-[#FB6E09]" />
                  Alur Pemilihan Tryout SKB
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#042E64]">
                  Pilih Instansi, Jabatan, &amp; Paket Soal Anda
                </h2>
                <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium mt-1">
                  Ikuti langkah terstruktur di bawah ini untuk memilih paket yang sesuai dengan formasi lamaran ASN Anda.
                </p>
              </div>

              {/* Breadcrumb Steps */}
              <div className="flex items-center gap-2 text-xs font-black self-start md:self-auto bg-[#FCF4E7] p-2 rounded-2xl border border-[#F0DCBE]">
                <span className="px-3 py-1.5 rounded-xl bg-[#042E64] text-white">
                  1. Instansi
                </span>
                <ChevronRight className="w-4 h-4 text-[#FB6E09]" />
                <span className="px-3 py-1.5 rounded-xl bg-[#042E64] text-white">
                  2. Jabatan
                </span>
                <ChevronRight className="w-4 h-4 text-[#FB6E09]" />
                <span className="px-3 py-1.5 rounded-xl bg-[#FB6E09] text-white">
                  3. Paket Soal
                </span>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* LANGKAH 1: PILIH INSTANSI                                             */}
          {/* --------------------------------------------------------------------- */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#042E64] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#042E64] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Pilih Instansi / Kementerian
                </h3>
                <p className="text-xs text-[#042E64]/70 font-medium">
                  Klik instansi target Anda untuk membuka daftar formasi jabatan yang tersedia.
                </p>
              </div>

              {/* Search Box Instansi */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#042E64]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAgency}
                  onChange={(e) => setSearchAgency(e.target.value)}
                  placeholder="Cari nama instansi..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs border-2 border-[#F0DCBE] rounded-xl bg-white text-[#042E64] placeholder-[#042E64]/40 focus:outline-none focus:ring-2 focus:ring-[#FB6E09] font-medium"
                />
              </div>
            </div>

            {/* Grid Kartu Instansi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgencies.map((agency) => {
                const isSelected = agency.id === selectedAgencyId;
                return (
                  <button
                    key={agency.id}
                    type="button"
                    onClick={() => handleSelectAgency(agency.id)}
                    className={`text-left p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#042E64] text-white border-[#FB6E09] shadow-lg shadow-[#042E64]/20 ring-2 ring-[#FB6E09]"
                        : "bg-white text-[#042E64] border-[#F0DCBE] hover:border-[#FB6E09]/60 hover:shadow-md"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 right-0 bg-[#FB6E09] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Terpilih
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-white/10 border-white/20"
                              : "bg-[#FCF4E7] border-[#F0DCBE]"
                          }`}
                        >
                          {renderAgencyIcon(agency.iconType)}
                        </div>
                        <div>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-[#FB6E09]/30 text-[#FB6E09]"
                                : "bg-[#FB6E09]/10 text-[#FB6E09]"
                            }`}
                          >
                            {agency.badge}
                          </span>
                          <h4 className="text-base font-black leading-tight mt-1">
                            {agency.shortName}
                          </h4>
                        </div>
                      </div>

                      <p
                        className={`text-xs line-clamp-2 leading-relaxed font-medium ${
                          isSelected ? "text-blue-100" : "text-[#042E64]/70"
                        }`}
                      >
                        {agency.description}
                      </p>
                    </div>

                    <div
                      className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                        isSelected ? "border-blue-900/80 text-[#FB6E09]" : "border-[#F0DCBE] text-[#042E64]"
                      }`}
                    >
                      <span>{agency.positions.length} Formasi Jabatan</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Pilih Formasi <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* LANGKAH 2: PILIH JABATAN / FORMASI                                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="space-y-4 pt-4 border-t-2 border-[#F0DCBE]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#042E64] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#042E64] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Pilih Jabatan Formasi ({currentAgency.shortName})
                </h3>
                <p className="text-xs text-[#042E64]/70 font-medium">
                  Pilih jabatan yang Anda lamar di {currentAgency.name} untuk melihat paket soal spesifik.
                </p>
              </div>

              {/* Search Box Jabatan */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#042E64]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPosition}
                  onChange={(e) => setSearchPosition(e.target.value)}
                  placeholder={`Cari jabatan di ${currentAgency.shortName}...`}
                  className="w-full pl-9 pr-3.5 py-2 text-xs border-2 border-[#F0DCBE] rounded-xl bg-white text-[#042E64] placeholder-[#042E64]/40 focus:outline-none focus:ring-2 focus:ring-[#FB6E09] font-medium"
                />
              </div>
            </div>

            {/* List Kartu Jabatan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPositions.map((pos) => {
                const isSelected = pos.id === selectedPositionId;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => handleSelectPosition(pos.id)}
                    className={`text-left p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#042E64] text-white border-[#FB6E09] shadow-md ring-2 ring-[#FB6E09]"
                        : "bg-white text-[#042E64] border-[#F0DCBE] hover:border-[#FB6E09]/60 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-[#FB6E09] text-white"
                              : "bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/30"
                          }`}
                        >
                          {pos.level} • {pos.code}
                        </span>
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isSelected ? "text-amber-300" : "text-[#FB6E09]"
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" /> Passing: {pos.passingScore}
                        </span>
                      </div>

                      <h4 className="text-base font-black leading-snug">{pos.title}</h4>
                      <p
                        className={`text-xs mt-1.5 leading-relaxed font-medium ${
                          isSelected ? "text-blue-100" : "text-[#042E64]/70"
                        }`}
                      >
                        {pos.description}
                      </p>
                    </div>

                    <div
                      className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                        isSelected ? "border-blue-900/80 text-blue-200" : "border-[#F0DCBE] text-[#042E64]/70"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#FB6E09]" /> {pos.durationMinutes} Menit ({pos.totalQuestions} Soal)
                      </span>
                      <span
                        className={`font-black flex items-center gap-1 ${
                          isSelected ? "text-[#FB6E09]" : "text-[#042E64]"
                        }`}
                      >
                        {isSelected ? "✓ Jabatan Terpilih" : "Pilih Jabatan →"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* LANGKAH 3: TAMPILKAN PILIHAN PAKET (SATUAN / BUNDLING) DI JABATAN     */}
          {/* --------------------------------------------------------------------- */}
          {currentPosition && (
            <div className="space-y-4 pt-4 border-t-2 border-[#F0DCBE]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#042E64] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    Pilihan Paket Ujian untuk {currentPosition.title}
                  </h3>
                  <p className="text-xs text-[#042E64]/70 font-medium">
                    Tersedia 2 pilihan paket (Satuan dan Bundling) khusus untuk materi ujian jabatan ini.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#F0DCBE] text-xs font-bold text-[#042E64]">
                  <Briefcase className="w-4 h-4 text-[#FB6E09]" />
                  <span>{currentAgency.shortName}</span>
                  <span>•</span>
                  <span className="text-[#FB6E09]">{currentPosition.code}</span>
                </div>
              </div>

              {/* Grid 2 Pilihan Paket: Satuan vs Bundling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch pt-2">
                {/* PAKET 1: SATUAN */}
                <div
                  className={`bg-white rounded-3xl p-6 sm:p-7 border-3 flex flex-col justify-between transition-all ${
                    selectedPackageType === "satuan"
                      ? "border-[#FB6E09] ring-2 ring-[#FB6E09]/30 shadow-lg"
                      : "border-[#F0DCBE] hover:border-[#FB6E09]/50 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#042E64]/60 uppercase tracking-wider">
                        Latihan Mandiri
                      </span>
                      {selectedPackageType === "satuan" && (
                        <span className="text-xs font-black text-[#FB6E09] bg-[#FB6E09]/10 px-2.5 py-0.5 rounded-full border border-[#FB6E09]/30">
                          ✓ Paket Terpilih
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-black text-[#042E64]">
                      {currentPosition.packages.satuan.name}
                    </h4>
                    <p className="text-xs text-[#042E64]/70 mt-1 mb-4 font-medium">
                      {currentPosition.packages.satuan.description}
                    </p>

                    {/* Price Box */}
                    <div className="py-4 border-y border-[#F0DCBE] my-4">
                      <div className="text-xs text-[#042E64]/40 line-through font-semibold">
                        Rp{currentPosition.packages.satuan.originalPrice.toLocaleString("id-ID")}
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-black text-[#042E64]">
                          Rp{currentPosition.packages.satuan.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-[#042E64]/70 font-semibold">
                          / 1 Sesi Ujian (110 Soal)
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 text-xs sm:text-sm text-[#042E64]/85 py-2">
                      {currentPosition.packages.satuan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#FB6E09] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-3">
                    <button
                      type="button"
                      onClick={() => handleSelectPackage("satuan")}
                      className={`w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        selectedPackageType === "satuan"
                          ? "bg-[#042E64] text-white hover:bg-[#0B3E84]"
                          : "bg-[#FCF4E7] text-[#042E64] hover:bg-[#F4E3CB] border-2 border-[#F0DCBE]"
                      }`}
                    >
                      {selectedPackageType === "satuan" ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Paket Satuan Terpilih</span>
                        </>
                      ) : (
                        <span>Pilih Paket Satuan (Rp20.000)</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* PAKET 2: BUNDLING (HIGHLIGHTED) */}
                <div
                  className={`relative bg-[#042E64] text-white rounded-3xl p-6 sm:p-7 border-3 flex flex-col justify-between shadow-xl transition-all ${
                    selectedPackageType === "bundling"
                      ? "border-[#FB6E09] ring-4 ring-[#FB6E09]/30 shadow-[#FB6E09]/20"
                      : "border-[#0B3E84] hover:border-[#FB6E09]/80"
                  }`}
                >
                  {/* Top Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FB6E09] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    <span>Paling Populer • Hemat 25%</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 mt-2">
                      <span className="text-xs font-black text-[#FB6E09] uppercase tracking-wider">
                        Persiapan Komprehensif
                      </span>
                      {selectedPackageType === "bundling" && (
                        <span className="text-xs font-black text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-amber-300/40">
                          ✓ Paket Terpilih
                        </span>
                      )}
                    </div>

                    <h4 className="text-xl font-black text-white">
                      {currentPosition.packages.bundling.name}
                    </h4>
                    <p className="text-xs text-blue-200 mt-1 mb-4 font-medium">
                      {currentPosition.packages.bundling.description}
                    </p>

                    {/* Price Box */}
                    <div className="py-4 border-y border-[#0B3E84] bg-white/5 rounded-2xl px-4 my-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300 line-through font-semibold">
                          Rp{currentPosition.packages.bundling.originalPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="bg-[#FB6E09]/30 text-[#FB6E09] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#FB6E09]/40">
                          Hemat Rp15.000
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          Rp{currentPosition.packages.bundling.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-blue-200 font-semibold">
                          / 3 Paket Ujian Lengkap
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-100 py-2">
                      {currentPosition.packages.bundling.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-3">
                    <button
                      type="button"
                      onClick={() => handleSelectPackage("bundling")}
                      className={`w-full py-4 px-4 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                        selectedPackageType === "bundling"
                          ? "bg-[#FB6E09] hover:bg-[#E45E00] text-white shadow-[#FB6E09]/30"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      }`}
                    >
                      {selectedPackageType === "bundling" ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Paket Bundling Terpilih (Rekomendasi)</span>
                        </>
                      ) : (
                        <span>Pilih Paket Bundling (Hemat 25%)</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Sesi Ujian Siap Dikerjakan Berdasarkan Paket Terpilih */}
              <div className="mt-8 bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#F0DCBE] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0DCBE]">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#FB6E09] tracking-wider">
                      Status Akses Paket Anda
                    </span>
                    <h4 className="text-lg font-black text-[#042E64] mt-0.5">
                      Sesi Tryout CAT BKN: {currentPosition.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ● Status: Siap Dikerjakan
                    </span>
                  </div>
                </div>

                {/* Sesi Ujian List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {selectedPackageType === "bundling" ? (
                    <>
                      <div className="p-4 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] space-y-2">
                        <span className="text-[10px] font-black text-[#FB6E09] bg-[#FB6E09]/10 px-2 py-0.5 rounded">
                          Paket 1
                        </span>
                        <div className="text-sm font-black text-[#042E64]">
                          SKB Teknis Formasi {currentPosition.title}
                        </div>
                        <div className="text-xs text-[#042E64]/70">
                          110 Soal • 100 Menit • Standar BKN
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            alert(
                              `[SIKILAT CAT Engine]\n\nMemulai Ujian: Paket 1 - SKB Teknis ${currentPosition.title}\nInstansi: ${currentAgency.name}\nJumlah: 110 Soal\nWaktu: 100 Menit.\n\n(Struktur Dashboard Poin 1 Berhasil Dirombak!)`
                            );
                          }}
                          className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#FB6E09] hover:bg-[#E45E00] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Mulai Ujian Sesi 1</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] space-y-2">
                        <span className="text-[10px] font-black text-[#FB6E09] bg-[#FB6E09]/10 px-2 py-0.5 rounded">
                          Paket 2
                        </span>
                        <div className="text-sm font-black text-[#042E64]">
                          SKB Manajerial, Sosio-Kultural &amp; Wawancara
                        </div>
                        <div className="text-xs text-[#042E64]/70">
                          110 Soal • 100 Menit • Standar BKN
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            alert(
                              `[SIKILAT CAT Engine]\n\nMemulai Ujian: Paket 2 - SKB Manajerial & Sosio-Kultural\nInstansi: ${currentAgency.name}\nJumlah: 110 Soal\nWaktu: 100 Menit.`
                            );
                          }}
                          className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#FB6E09] hover:bg-[#E45E00] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Mulai Ujian Sesi 2</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] space-y-2">
                        <span className="text-[10px] font-black text-[#FB6E09] bg-[#FB6E09]/10 px-2 py-0.5 rounded">
                          Paket 3
                        </span>
                        <div className="text-sm font-black text-[#042E64]">
                          Simulasi Terpadu CAT BKN Terstandar
                        </div>
                        <div className="text-xs text-[#042E64]/70">
                          110 Soal • 100 Menit • Prediksi Lengkap
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            alert(
                              `[SIKILAT CAT Engine]\n\nMemulai Ujian: Paket 3 - Simulasi Terpadu CAT BKN Lengkap\nInstansi: ${currentAgency.name}\nJumlah: 110 Soal\nWaktu: 100 Menit.`
                            );
                          }}
                          className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#FB6E09] hover:bg-[#E45E00] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Mulai Ujian Sesi 3</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-1 md:col-span-3 p-5 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black text-[#FB6E09] bg-[#FB6E09]/10 px-2.5 py-0.5 rounded">
                          Paket Satuan Terpilih
                        </span>
                        <div className="text-base font-black text-[#042E64] mt-1">
                          Simulasi CAT BKN Pokok: {currentPosition.title}
                        </div>
                        <div className="text-xs text-[#042E64]/70 font-medium">
                          110 Soal Materi Uji Teknis Formasi • Timer 100 Menit • Pembahasan & Skor Real-Time
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          alert(
                            `[SIKILAT CAT Engine]\n\nMemulai Ujian: Paket Satuan - ${currentPosition.title}\nInstansi: ${currentAgency.name}\nJumlah: 110 Soal\nWaktu: 100 Menit.`
                          );
                        }}
                        className="py-3 px-6 rounded-xl bg-[#FB6E09] hover:bg-[#E45E00] text-white text-sm font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Mulai Ujian CAT Sekarang</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Helpful Tips Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#FB6E09]/40 text-[#042E64] flex items-start gap-3.5 text-xs sm:text-sm shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FB6E09]" />
          </div>
          <div className="space-y-1">
            <strong className="font-black text-[#042E64] text-sm">Tips Navigasi Dashboard SIKILAT:</strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Anda dapat mengganti pilihan Instansi maupun Jabatan kapan saja dengan mengklik kartu instansi/jabatan di atas. Setiap jabatan memiliki bank soal tersendiri yang disesuaikan dengan kisi-kisi resmi Permenpan-RB 2026.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
