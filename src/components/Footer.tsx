import Link from "next/link";
import { Heart, Zap } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#042E64] text-slate-300 text-xs border-t-4 border-[#FB6E09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <BrandLogo size="md" inverted={true} />
            <p className="text-blue-100/80 text-xs max-w-sm leading-relaxed font-medium">
              Platform simulasi kilat dan mandiri ujian Seleksi Kompetensi Bidang (SKB) Calon Pegawai Negeri Sipil berbasis sistem CAT BKN resmi di Indonesia.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#FB6E09]" />
              <span>Platform Terverifikasi & Terintegrasi Kisi-kisi BKN 2026</span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#FB6E09] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <a href="#promo-section" className="hover:text-[#FB6E09] transition-colors">
                  Paket Bundling SKB
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#FB6E09] transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#FB6E09] transition-colors">
                  Daftar Akun Baru
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">
              Kebijakan & Regulasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-[#FB6E09] transition-colors">
                  Syarat & Ketentuan Ujian
                </Link>
              </li>
              <li>
                <span className="hover:text-[#FB6E09] transition-colors cursor-pointer">
                  Kebijakan Privasi Data
                </span>
              </li>
              <li>
                <span className="hover:text-[#FB6E09] transition-colors cursor-pointer">
                  Pedoman Integritas CAT
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#0B3E84] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-blue-200/80">
            © {new Date().getFullYear()} <strong className="text-white">SIKILAT SKB ASN</strong>. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-1.5 text-blue-200">
            <span>Didesain khusus untuk pejuang NIP Indonesia</span>
            <Zap className="w-3.5 h-3.5 text-[#FB6E09] fill-[#FB6E09] inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
