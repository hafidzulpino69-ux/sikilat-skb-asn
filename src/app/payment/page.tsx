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
  Zap,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface PendingOrder {
  agencyId: string;
  agencyName: string;
  agencyShortName: string;
  positionId: string;
  positionTitle: string;
  positionCode: string;
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
  const [userName, setUserName] = useState("Peserta SIKILAT");
  const [userEmail, setUserEmail] = useState("peserta@example.com");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Generate invoice number
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNumber(`INV/SIKILAT/2026/09/${randomCode}`);

    if (typeof window !== "undefined") {
      // Ambil data user
      const storedUser = localStorage.getItem("skb_mock_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        } catch (e) {
          console.error(e);
        }
      }

      // Ambil data pending order dari dashboard
      const storedOrder = localStorage.getItem("skb_pending_order");
      if (storedOrder) {
        try {
          setOrder(JSON.parse(storedOrder));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback default jika diakses langsung
        setOrder({
          agencyId: "kemenkes",
          agencyName: "Kementerian Kesehatan RI",
          agencyShortName: "Kemenkes",
          positionId: "kemenkes-epidemiolog",
          positionTitle: "Epidemiolog Kesehatan Ahli Pertama",
          positionCode: "KMK-EPD-01",
          packageKey: "bundling",
          packageName: "Paket Bundling (Berisi Paket 1, 2, dan 3)",
          packageLabel: "Paket Bundling",
          price: 30000,
          originalPrice: 35000,
          examNumbers: [1, 2, 3],
          createdAt: new Date().toISOString(),
        });
      }
    }
  }, []);

  const handlePayNow = () => {
    if (!order) return;
    setIsProcessing(true);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        // Simpan ke daftar riwayat paket yang dibeli
        const existingPackagesRaw = localStorage.getItem("skb_user_purchased_packages");
        let existingPackages: any[] = [];
        if (existingPackagesRaw) {
          try {
            existingPackages = JSON.parse(existingPackagesRaw);
          } catch (e) {
            existingPackages = [];
          }
        }

        const newPurchase = {
          id: `PURCHASE-${Date.now()}`,
          invoiceNumber,
          agencyName: order.agencyName,
          agencyShortName: order.agencyShortName,
          positionTitle: order.positionTitle,
          positionCode: order.positionCode,
          packageKey: order.packageKey,
          packageName: order.packageName,
          price: order.price,
          examNumbers: order.examNumbers,
          purchasedAt: new Date().toISOString(),
        };

        // Tambahkan ke array dan simpan
        existingPackages.unshift(newPurchase);
        localStorage.setItem("skb_user_purchased_packages", JSON.stringify(existingPackages));
      }

      setIsProcessing(false);
      // Arahkan pengguna ke halaman "Daftar Paket Anda"
      router.push("/my-packages");
    }, 900);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FCF4E7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FB6E09]" />
      </div>
    );
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
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] active:scale-98 transition-all shadow-lg shadow-[#FB6E09]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses Pembayaran...</span>
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
    </div>
  );
}
