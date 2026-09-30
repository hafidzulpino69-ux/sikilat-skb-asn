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
  Zap,
  Building2,
  Briefcase,
  ChevronRight,
  Search,
  Check,
  Sparkles,
  Layers,
  HeartPulse,
  Wallet,
  GraduationCap,
  Scale,
  Shield,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  AGENCIES_DATA,
  AgencyItem,
  getPositionPackages,
  PositionPackage,
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

  // Flow State: Step 1 (Instansi) -> Step 2 (Jabatan) -> Step 3 (4 Kotak Paket)
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("kemenkes");
  const [selectedPositionId, setSelectedPositionId] = useState<string>("kemenkes-epidemiolog");
  const [selectedPackageKey, setSelectedPackageKey] = useState<"paket-1" | "paket-2" | "paket-3" | "bundling">("bundling");

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

      // Restore saved selections
      const savedAgency = localStorage.getItem("skb_selected_agency");
      const savedPos = localStorage.getItem("skb_selected_position");
      const savedPkg = localStorage.getItem("skb_selected_package_key") as any;

      if (savedAgency) setSelectedAgencyId(savedAgency);
      if (savedPos) setSelectedPositionId(savedPos);
      if (savedPkg && ["paket-1", "paket-2", "paket-3", "bundling"].includes(savedPkg)) {
        setSelectedPackageKey(savedPkg);
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

  // 4 Standard Packages for current position
  const packageBoxes: PositionPackage[] = useMemo(() => {
    return getPositionPackages(currentPosition?.title || "Jabatan SKB");
  }, [currentPosition]);

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

  // Handlers for selection
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

  const handleSelectPackageBox = (key: "paket-1" | "paket-2" | "paket-3" | "bundling") => {
    setSelectedPackageKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("skb_selected_package_key", key);
    }
  };

  // Navigasi ke Halaman Pembayaran saat tombol "Lanjutkan" diklik
  const handleProceedToPayment = () => {
    if (!currentPosition || !currentAgency) return;

    const chosenPackage = packageBoxes.find((p) => p.packageKey === selectedPackageKey);
    if (!chosenPackage) return;

    // Simpan order preview ke localStorage
    const pendingOrder = {
      agencyId: currentAgency.id,
      agencyName: currentAgency.name,
      agencyShortName: currentAgency.shortName,
      positionId: currentPosition.id,
      positionTitle: currentPosition.title,
      positionCode: currentPosition.code,
      packageKey: chosenPackage.packageKey,
      packageName: chosenPackage.name,
      packageLabel: chosenPackage.label,
      price: chosenPackage.price,
      originalPrice: chosenPackage.originalPrice,
      examNumbers: chosenPackage.examNumbers,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("skb_pending_order", JSON.stringify(pendingOrder));
    }

    // Arahkan ke Halaman Simulasi Pembayaran
    router.push("/payment");
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

            {/* Quick Links & Profile */}
            <div className="flex items-center gap-3">
              <Link
                href="/my-packages"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-[#042E64] bg-white hover:bg-[#F4E3CB] border-2 border-[#F0DCBE] rounded-xl transition-all shadow-xs"
              >
                <PackageOpen className="w-4 h-4 text-[#FB6E09]" />
                <span>Daftar Paket Anda</span>
              </Link>

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
        {/* Welcome Banner */}
        <div className="bg-[#042E64] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#042E64]/20 border-3 border-[#FB6E09] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/20 text-[#FB6E09] border border-[#FB6E09]/40 text-xs font-black">
              <Zap className="w-3.5 h-3.5 fill-[#FB6E09]" />
              <span>Katalog &amp; Pembelian Paket Tryout SKB 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang, {user.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Tentukan <strong>Instansi</strong> dan <strong>Jabatan Formasi</strong>, lalu pilih paket soal yang Anda butuhkan (Paket 1, Paket 2, Paket 3, atau Paket Bundling).
            </p>
          </div>

          {/* Quick link button to My Packages */}
          <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0 w-full md:w-auto">
            <div className="font-black text-[#FB6E09] uppercase tracking-wider text-[11px]">
              Menu Cepat
            </div>
            <div className="text-sm font-black text-white">
              Sudah Pernah Membeli Paket?
            </div>
            <Link
              href="/my-packages"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FB6E09] hover:bg-[#E45E00] text-white text-xs font-black transition-all shadow-md"
            >
              <PackageOpen className="w-4 h-4" />
              <span>Buka Daftar Paket Anda →</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEPPER ALUR: 1. PILIH INSTANSI -> 2. PILIH JABATAN -> 3. PILIH PAKET    */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          {/* Progress Header */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#F0DCBE] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5 fill-[#FB6E09]" />
                  Alur Pemilihan Paket Tryout
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#042E64]">
                  Pilih Instansi, Jabatan, &amp; 4 Pilihan Paket Ujian
                </h2>
                <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium mt-1">
                  Pilih salah satu dari 4 kotak paket (Paket 1, Paket 2, Paket 3, atau Paket Bundling), kemudian klik tombol &quot;Lanjutkan&quot; untuk simulasi pembayaran.
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
                  3. 4 Opsi Paket
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
                      <span className="flex items-center gap-1">
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
                  Pilih jabatan yang Anda lamar di {currentAgency.name} untuk menampilkan 4 kotak paket soal.
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
                          <Award className="w-3.5 h-3.5" /> Passing Grade: {pos.passingScore}
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
                        <Clock className="w-3.5 h-3.5 text-[#FB6E09]" /> 100 Menit (110 Soal)
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
          {/* LANGKAH 3: 4 KOTAK SEJAJAR / BERURUTAN & TOMBOL "LANJUTKAN"           */}
          {/* --------------------------------------------------------------------- */}
          {currentPosition && (
            <div className="space-y-6 pt-4 border-t-2 border-[#F0DCBE]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#042E64] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#FB6E09] text-white flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    Pilih Paket Soal untuk {currentPosition.title}
                  </h3>
                  <p className="text-xs text-[#042E64]/70 font-medium">
                    Silakan pilih salah satu dari 4 opsi paket berikut untuk instansi {currentAgency.name}.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#F0DCBE] text-xs font-bold text-[#042E64] shrink-0">
                  <Briefcase className="w-4 h-4 text-[#FB6E09]" />
                  <span>{currentAgency.shortName}</span>
                  <span>•</span>
                  <span className="text-[#FB6E09] font-black">{currentPosition.code}</span>
                </div>
              </div>

              {/* 4 KOTAK SEJAJAR / BERURUTAN (GRID 4 KOLOM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                {packageBoxes.map((pkg) => {
                  const isSelected = selectedPackageKey === pkg.packageKey;
                  const isBundling = pkg.packageKey === "bundling";

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackageBox(pkg.packageKey)}
                      className={`rounded-3xl p-5 sm:p-6 border-3 transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? isBundling
                            ? "bg-[#042E64] text-white border-[#FB6E09] ring-4 ring-[#FB6E09]/40 shadow-xl shadow-[#042E64]/20 scale-[1.02]"
                            : "bg-white text-[#042E64] border-[#FB6E09] ring-4 ring-[#FB6E09]/30 shadow-lg scale-[1.02]"
                          : isBundling
                          ? "bg-[#042E64]/90 text-white border-[#0B3E84] hover:border-[#FB6E09]/80 shadow-md"
                          : "bg-white text-[#042E64] border-[#F0DCBE] hover:border-[#FB6E09]/50 shadow-xs"
                      }`}
                    >
                      {/* Top Selection or Discount Badge */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        {isBundling ? (
                          <span className="bg-[#FB6E09] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3 fill-white" /> Hemat Rp25.000
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-[#FB6E09]/15 text-[#FB6E09]"
                                : "bg-[#FCF4E7] text-[#042E64]/70"
                            }`}
                          >
                            {pkg.label}
                          </span>
                        )}

                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#FB6E09] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Header Box */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-[#FB6E09]">
                            {isBundling ? "Paket Bundling" : pkg.label}
                          </span>
                        </div>

                        {/* Isi / Sub-Judul: SKB Formasi (Ganti 'Paket 1', 'Paket 2', dll. menjadi ini) */}
                        <div
                          className={`text-lg font-black leading-tight ${
                            isBundling ? "text-white" : "text-[#042E64]"
                          }`}
                        >
                          {isBundling ? "Paket Bundling (Paket 1, 2, dan 3)" : "SKB Formasi"}
                        </div>

                        {isBundling && (
                          <div className="text-xs font-bold text-[#FB6E09]">
                            Mendapatkan Paket 1, 2, dan 3
                          </div>
                        )}

                        {/* Keterangan kecil (Deskripsi) */}
                        <p
                          className={`text-xs leading-relaxed font-medium ${
                            isBundling ? "text-blue-100" : "text-[#042E64]/70"
                          }`}
                        >
                          {pkg.description}
                        </p>

                        {/* Harga: Efek harga coret, lalu tampilkan harga promo */}
                        <div
                          className={`py-3.5 my-2 border-y ${
                            isBundling ? "border-blue-900/80 bg-white/5 rounded-2xl px-3.5" : "border-[#F0DCBE] bg-[#FCF4E7]/40 rounded-2xl px-3.5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs line-through font-semibold ${
                                isBundling ? "text-blue-200" : "text-[#042E64]/40"
                              }`}
                            >
                              Rp{pkg.originalPrice.toLocaleString("id-ID")}
                            </span>
                            <span className="bg-[#FB6E09]/20 text-[#FB6E09] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#FB6E09]/30">
                              Promo Hemat
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span
                              className={`text-2xl sm:text-3xl font-black ${
                                isBundling ? "text-white" : "text-[#042E64]"
                              }`}
                            >
                              Rp{pkg.price.toLocaleString("id-ID")}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                isBundling ? "text-blue-200" : "text-[#042E64]/60"
                              }`}
                            >
                              {isBundling ? "/ 3 Paket" : "/ Paket"}
                            </span>
                          </div>
                        </div>

                        {/* Fasilitas / Kriteria di bawah harga (3 Poin Centang Sesuai Permintaan) */}
                        <div className="space-y-2 pt-1">
                          <div
                            className={`text-[11px] font-black uppercase tracking-wider ${
                              isBundling ? "text-blue-200" : "text-[#042E64]/60"
                            }`}
                          >
                            Fasilitas Paket:
                          </div>
                          <ul
                            className={`space-y-2 text-xs ${
                              isBundling ? "text-blue-100" : "text-[#042E64]/85"
                            }`}
                          >
                            {pkg.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#FB6E09] text-white flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                                <span className="font-semibold leading-tight">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Select Indicator */}
                      <div className="mt-5 pt-3">
                        <div
                          className={`w-full py-2.5 px-3 rounded-xl font-black text-xs text-center transition-colors ${
                            isSelected
                              ? "bg-[#FB6E09] text-white shadow-md shadow-[#FB6E09]/30"
                              : isBundling
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-[#FCF4E7] text-[#042E64] hover:bg-[#F4E3CB]"
                          }`}
                        >
                          {isSelected ? "✓ Paket Dipilih" : "Klik untuk Memilih"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DI BAWAH KEEMPAT KOTAK: SATU TOMBOL "LANJUTKAN" */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#F0DCBE] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs text-[#042E64]/60 font-bold uppercase tracking-wider">
                    Ringkasan Pilihan Anda
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#042E64]">
                    {packageBoxes.find((p) => p.packageKey === selectedPackageKey)?.name}
                  </div>
                  <div className="text-xs text-[#042E64]/75 font-medium">
                    Formasi: <strong>{currentPosition.title}</strong> ({currentAgency.shortName}) • Total Tagihan:{" "}
                    <span className="text-[#FB6E09] font-black text-sm">
                      Rp{packageBoxes.find((p) => p.packageKey === selectedPackageKey)?.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Tombol Lanjutkan */}
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm sm:text-base text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] transition-all shadow-lg shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-[1.02]"
                >
                  <span>Lanjutkan ke Pembayaran</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
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
            <strong className="font-black text-[#042E64] text-sm">Tips Pemilihan Paket SIKILAT:</strong>
            <p className="text-[#042E64]/80 leading-relaxed font-medium">
              Pilih <strong>Paket Bundling</strong> jika Anda ingin menguasai seluruh materi (Paket 1, Paket 2, dan Paket 3) secara komprehensif dengan harga promo hemat 25%. Setelah menekan tombol <strong>&quot;Lanjutkan&quot;</strong>, Anda akan diarahkan ke halaman simulasi struk pembayaran resmi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
