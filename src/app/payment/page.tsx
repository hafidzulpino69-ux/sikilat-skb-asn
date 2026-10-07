"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Mail,
  Briefcase,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import LoadingState from "@/components/LoadingState";
import { RepurchaseWarningModal } from "@/components/payment";
import { supabase } from "@/utils/supabaseClient";

interface PendingOrder {
  agencyId: string;
  agencyName: string;
  agencyShortName: string;
  positionId: string;
  positionTitle: string;
  positionCode: string;
  packageId?: string;
  packageIds?: string[];
  packageKey: "paket-1" | "paket-2" | "paket-3" | "bundling";
  packageName: string;
  packageLabel: string;
  price: number;
  originalPrice: number;
  examNumbers: number[];
  createdAt: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "va" | "ewallet">("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Peserta SIKILAT");
  const [userEmail, setUserEmail] = useState("peserta@example.com");
  const [showRepurchaseModal, setShowRepurchaseModal] = useState(false);
  const [repurchasePackageIds, setRepurchasePackageIds] = useState<string[]>([]);

  const [invoiceNumber] = useState(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `INV/SIKILAT/2026/09/${randomCode}`;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Verifikasi autentikasi user
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error || !user) {
          router.push("/login?redirect=/payment");
          return;
        }

        const userMeta = user.user_metadata || {};
        const name = userMeta.full_name || user.email?.split("@")[0] || "Peserta SIKILAT";
        setUserName(name);
        if (user.email) setUserEmail(user.email);
      });

      // 2. Ambil data pending order dari dashboard (tanpa fallback hardcode dummy)
      const storedOrder = localStorage.getItem("skb_pending_order");
      if (storedOrder) {
        try {
          const parsed = JSON.parse(storedOrder);
          if (parsed && parsed.price) {
            // Sinkronkan packageId dari URL search params jika ada
            const urlParams = new URLSearchParams(window.location.search);
            const urlPackageId = urlParams.get("packageId");
            if (urlPackageId) {
              parsed.packageId = urlPackageId;
              if (parsed.packageKey !== "bundling") {
                parsed.packageIds = [urlPackageId];
              }
            }
            setOrder(parsed);
          } else {
            router.push("/dashboard");
          }
        } catch {
          router.push("/dashboard");
        }
      } else {
        // Jika tidak ada pesanan aktif, arahkan kembali ke pemilihan formasi
        router.push("/dashboard");
      }
    }
  }, [router]);

  // Helper standarisasi penanganan error pembayaran yang aman (tanpa leak database)
  const handlePaymentError = (err: unknown) => {
    const rawMsg = err instanceof Error ? err.message : "";

    let userFriendlyMessage =
      "Gagal memproses pembayaran paket. Silakan periksa koneksi atau coba beberapa saat lagi.";
    if (rawMsg.includes("Sesi login") || rawMsg.includes("login kembali")) {
      userFriendlyMessage = rawMsg;
    } else if (
      rawMsg.toLowerCase().includes("network") ||
      rawMsg.toLowerCase().includes("koneksi") ||
      rawMsg.toLowerCase().includes("fetch")
    ) {
      userFriendlyMessage =
        "Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.";
    }
    setPaymentError(userFriendlyMessage);
    setIsProcessing(false);
  };

  // ─── MESIN PEMBAYARAN UTAMA (UPSERT KE DB) ──────────────────────────────
  const executePaymentUpsert = async (user: { id: string }) => {
    if (!order) return;

    const examNums =
      order.examNumbers && order.examNumbers.length > 0
        ? order.examNumbers
        : [1];

    const positionSlug = (order.positionId || order.positionTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const agencyShort =
      order.agencyShortName || order.agencyName || "Instansi";

    // 2. Tentukan masa aktif berdasarkan jenis paket (WAJIB NOT NULL di DB)
    const validityDays = order.packageKey === "bundling" ? 150 : 90;
    const expiresAt = new Date(
      Date.now() + validityDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // 3. Untuk setiap nomor paket, pastikan master di packages ada & simpan akses di user_packages
    for (const num of examNums) {
      let targetPackageId: string | null = null;

      // Prioritas 1: Mode Satuan (Paket 1, 2, atau 3) dengan packageId unik langsung
      if (order.packageKey !== "bundling" && order.packageId) {
        targetPackageId = order.packageId;
      }

      // Prioritas 2: Mode Bundling dengan list packageIds yang dikirim dari dashboard
      if (!targetPackageId && order.packageIds && order.packageIds.length > 0) {
        const { data: matchedById } = await supabase
          .from("packages")
          .select("id")
          .in("id", order.packageIds)
          .eq("package_number", num)
          .maybeSingle();

        if (matchedById) {
          targetPackageId = matchedById.id;
        }
      }

      // Prioritas 3: Cari di packages berdasarkan agency, formasi, dan nomor paket eksak
      if (!targetPackageId) {
        const { data: existingPkg } = await supabase
          .from("packages")
          .select("id")
          .eq("agency_name", order.agencyName)
          .eq("position_title", order.positionTitle)
          .eq("package_number", num)
          .maybeSingle();

        if (existingPkg) {
          targetPackageId = existingPkg.id;
        }
      }

      // Prioritas 4: Cari berdasarkan slug spesifik per nomor paket
      const masterSlug = `${positionSlug}-paket-${num}`;
      if (!targetPackageId) {
        const { data: slugPkg } = await supabase
          .from("packages")
          .select("id")
          .eq("slug", masterSlug)
          .maybeSingle();

        if (slugPkg) {
          targetPackageId = slugPkg.id;
        }
      }

      // Prioritas 5: Jika belum ada sama sekali di database, buat master baru
      if (!targetPackageId) {
        const { data: pkgData, error: pkgError } = await supabase
          .from("packages")
          .upsert(
            {
              slug: masterSlug,
              title: `Paket ${num}: SKB ${agencyShort}`,
              agency_name: order.agencyName,
              position_title: order.positionTitle,
              package_number: num,
              total_questions: 100,
              duration_minutes: 90,
              max_score: 500,
              is_active: true,
            },
            { onConflict: "slug" }
          )
          .select("id")
          .single();

        if (pkgError || !pkgData) {
          throw pkgError || new Error("Gagal mendaftarkan master paket.");
        }
        targetPackageId = pkgData.id;
      }

      // Catat hak akses pembelian ke tabel user_packages menggunakan UPSERT dengan package_id SPESIFIK
      const { error: userPkgError } = await supabase
        .from("user_packages")
        .upsert(
          {
            user_id: user.id,
            package_id: targetPackageId,
            expires_at: expiresAt,
            purchased_at: new Date().toISOString(),
          },
          { onConflict: "user_id, package_id" }
        );

      if (userPkgError) {
        throw userPkgError;
      }
    }

    // Bersihkan pending order setelah berhasil
    if (typeof window !== "undefined") {
      localStorage.removeItem("skb_pending_order");
    }

    // Arahkan ke halaman Daftar Paket Anda dengan flag sukses
    router.push("/my-packages?purchased=1");
  };

  // ─── PENCEGAT: Validasi Kepemilikan Paket Sebelum Membayar ────────────────
  const handlePayNow = async () => {
    if (!order || isProcessing) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Ambil session user saat ini dari Supabase Auth
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Sesi login Anda tidak ditemukan atau telah berakhir. Silakan login kembali untuk menyelesaikan transaksi."
        );
      }

      const examNums =
        order.examNumbers && order.examNumbers.length > 0
          ? order.examNumbers
          : [1];

      // 2. Kumpulkan ID kandidat paket secara spesifik murni sesuai paket yang dipilih
      let candidatePkgIds: string[] = [];

      if (order.packageKey !== "bundling" && order.packageId) {
        // Mode Satuan: HANYA periksa packageId unik yang dipilih!
        candidatePkgIds = [order.packageId];
      } else if (order.packageIds && order.packageIds.length > 0) {
        // Mode Bundling: periksa list packageIds yang dikirim
        candidatePkgIds = order.packageIds;
      } else {
        // Fallback: Cari di database HANYA untuk nomor paket terkait (examNums), JANGAN campur nomor paket lain!
        const { data: foundPkgs } = await supabase
          .from("packages")
          .select("id")
          .eq("agency_name", order.agencyName)
          .eq("position_title", order.positionTitle)
          .in("package_number", examNums);

        if (foundPkgs && foundPkgs.length > 0) {
          candidatePkgIds = foundPkgs.map((p) => p.id);
        } else {
          const positionSlug = (order.positionId || order.positionTitle)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          const targetSlugs = examNums.map((num) => `${positionSlug}-paket-${num}`);
          const { data: matchedPkgs } = await supabase
            .from("packages")
            .select("id")
            .in("slug", targetSlugs);

          if (matchedPkgs) {
            candidatePkgIds = matchedPkgs.map((p) => p.id);
          }
        }
      }

      // 3. Validasi kepemilikan paket HANYA untuk candidatePkgIds yang bersangkutan
      if (candidatePkgIds.length > 0) {
        const { data: ownedList } = await supabase
          .from("user_packages")
          .select("package_id")
          .eq("user_id", user.id)
          .in("package_id", candidatePkgIds);

        if (ownedList && ownedList.length > 0) {
          // Hanya tampilkan modal jika user BENAR-BENAR sudah memiliki paket SPESIFIK ini
          setRepurchasePackageIds(ownedList.map((item) => item.package_id));
          setShowRepurchaseModal(true);
          setIsProcessing(false);
          return;
        }
      }

      // JIKA PAKET BELUM DIMILIKI: Langsung eksekusi fungsi pembayaran (Upsert) seperti biasa
      await executePaymentUpsert(user);
    } catch (err: unknown) {
      handlePaymentError(err);
    }
  };

  // ─── KONFIRMASI BELI ULANG: Reset Progres Ujian Lalu Lanjutkan Pembayaran ─
  const handleConfirmRepurchase = async () => {
    if (!order || isProcessing) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Sesi login Anda tidak ditemukan atau telah berakhir. Silakan login kembali untuk menyelesaikan transaksi."
        );
      }

      // RESET PROGRES: Lakukan fungsi DELETE pada tabel exam_results
      if (repurchasePackageIds.length > 0) {
        await supabase
          .from("exam_results")
          .delete()
          .eq("user_id", user.id)
          .in("package_id", repurchasePackageIds);

        // Hapus cache autosave lokal jika ada
        if (typeof window !== "undefined") {
          repurchasePackageIds.forEach((pkgId) => {
            localStorage.removeItem(`skb_exam_session_${pkgId}`);
          });
        }
      }

      // LALU lanjutkan ke fungsi pembayaran (Upsert)
      await executePaymentUpsert(user);
      setShowRepurchaseModal(false);
    } catch (err: unknown) {
      handlePaymentError(err);
    }
  };

  if (!order) {
    return <LoadingState fullScreen message="Menyiapkan rincian pesanan..." />;
  }

  return (
    <div className="min-h-screen bg-[#FCF4E7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FCF4E7]/90 backdrop-blur-md border-b-2 border-[#F0DCBE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <BrandLogo size="md" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#042E64] hover:text-[#FB6E09] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] text-xs font-black uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simulasi Pembayaran Resmi SIKILAT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
            Struk Pembayaran Paket Tryout
          </h1>
          <p className="text-xs sm:text-sm text-[#042E64]/70 font-medium">
            Periksa rincian pesanan paket soal Anda sebelum menekan tombol Bayar Sekarang.
          </p>
        </div>

        {/* STRUK PEMBAYARAN (INVOICE CARD) */}
        <div className="bg-white rounded-3xl border-3 border-[#F0DCBE] shadow-xl overflow-hidden">
          {/* Top Invoice Header */}
          <div className="bg-[#042E64] text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-[#FB6E09]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FB6E09] bg-[#FB6E09]/20 px-2.5 py-0.5 rounded-full border border-[#FB6E09]/30">
                Invoice Tagihan Resmi
              </span>
              <div className="text-base sm:text-lg font-mono font-black mt-1">
                {invoiceNumber}
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-blue-200">
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#FB6E09]" />
                <span>
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="font-semibold text-white mt-0.5">Status: Menunggu Pembayaran</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Data Pembeli */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FCF4E7]/60 border border-[#F0DCBE] text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#F0DCBE] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#FB6E09]" />
                </div>
                <div>
                  <div className="text-[#042E64]/60 font-semibold">Nama Peserta</div>
                  <div className="text-sm font-black text-[#042E64]">{userName}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#F0DCBE] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#FB6E09]" />
                </div>
                <div>
                  <div className="text-[#042E64]/60 font-semibold">Email Terdaftar</div>
                  <div className="text-sm font-black text-[#042E64]">{userEmail}</div>
                </div>
              </div>
            </div>

            {/* Rincian Produk / Paket yang Dibeli */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase text-[#042E64] tracking-wider">
                Rincian Formasi &amp; Paket Soal
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#F0DCBE] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0DCBE]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#FB6E09]">
                        {order.agencyName} ({order.agencyShortName})
                      </div>
                      <div className="text-sm sm:text-base font-black text-[#042E64]">
                        {order.positionTitle}
                      </div>
                      <div className="text-xs text-[#042E64]/60 font-medium">
                        Kode Formasi: {order.positionCode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <div>
                    <span className="font-black text-[#042E64] block">{order.packageName}</span>
                    <span className="text-xs text-[#042E64]/70">
                      {order.packageKey === "bundling"
                        ? "3 Sesi Ujian (Paket 1 + Paket 2 + Paket 3)"
                        : `1 Sesi Ujian (${order.packageLabel})`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#042E64]">
                      Rp{order.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Tagihan & Total */}
            <div className="space-y-2 pt-2 border-t-2 border-[#F0DCBE]">
              <div className="flex items-center justify-between text-xs text-[#042E64]/70">
                <span>Harga Normal</span>
                <span className="line-through">Rp{order.originalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                <span>Diskon Promo SIKILAT</span>
                <span>-Rp{(order.originalPrice - order.price).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#042E64]/70">
                <span>Biaya Layanan &amp; Verifikasi</span>
                <span className="text-emerald-600 font-bold">Gratis (Rp0)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#042E64]/70">
                <span>Masa Aktif Paket</span>
                <span className="text-[#042E64] font-bold">
                  {order.packageKey === "bundling" || order.examNumbers.length > 1
                    ? "150 Hari"
                    : "90 Hari"}
                </span>
              </div>
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-[#042E64] pt-3 border-t-2 border-[#F0DCBE]">
                <span>Total Pembayaran</span>
                <span className="text-[#FB6E09] text-xl sm:text-2xl font-black">
                  Rp{order.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Simulasi Metode Pembayaran */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-[#042E64] tracking-wider">
                Pilih Metode Pembayaran (Simulasi Instan)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === "qris"
                      ? "border-[#FB6E09] bg-[#FB6E09]/10 text-[#042E64] ring-2 ring-[#FB6E09]"
                      : "border-[#F0DCBE] bg-white text-[#042E64]/70 hover:bg-[#FCF4E7]"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#FB6E09]" />
                  <span>QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("va")}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === "va"
                      ? "border-[#FB6E09] bg-[#FB6E09]/10 text-[#042E64] ring-2 ring-[#FB6E09]"
                      : "border-[#F0DCBE] bg-white text-[#042E64]/70 hover:bg-[#FCF4E7]"
                  }`}
                >
                  <Building className="w-5 h-5 text-[#FB6E09]" />
                  <span>Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ewallet")}
                  className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === "ewallet"
                      ? "border-[#FB6E09] bg-[#FB6E09]/10 text-[#042E64] ring-2 ring-[#FB6E09]"
                      : "border-[#F0DCBE] bg-white text-[#042E64]/70 hover:bg-[#FCF4E7]"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#FB6E09]" />
                  <span>E-Wallet</span>
                </button>
              </div>
            </div>

            {/* TOMBOL BAYAR SEKARANG */}
            <div className="pt-4 space-y-3">
              {paymentError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold">
                  {paymentError}
                </div>
              )}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-lg shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sedang memproses pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Bayar Sekarang (Rp{order.price.toLocaleString("id-ID")})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#042E64]/60 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Transaksi Aman &amp; Terverifikasi Otomatis</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL PERINGATAN BELI ULANG (REPURCHASE & RESET) */}
      {showRepurchaseModal && (
        <RepurchaseWarningModal
          packageName={order?.packageName}
          isProcessing={isProcessing}
          onCancel={() => {
            setShowRepurchaseModal(false);
            setIsProcessing(false);
          }}
          onConfirm={handleConfirmRepurchase}
        />
      )}
    </div>
  );
}
