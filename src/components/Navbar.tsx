"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Zap, Trophy } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FCF4E7]/90 backdrop-blur-md border-b border-[#F0DCBE] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand with Book/Lightning and Dual-Tone Typography */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/20">
              CAT BKN 2026
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#042E64]/80">
            <Link
              href="/"
              className="text-[#FB6E09] font-bold border-b-2 border-[#FB6E09] pb-0.5 transition-colors"
            >
              Beranda
            </Link>
            <a
              href="#promo-section"
              className="hover:text-[#FB6E09] transition-colors flex items-center gap-1.5"
            >
              <span>Paket Promo</span>
              <span className="bg-[#FB6E09] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-2xs">
                HEMAT 25%
              </span>
            </a>
            <a
              href="#leaderboard-section"
              className="hover:text-[#FB6E09] transition-colors flex items-center gap-1"
            >
              <span>Peringkat</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </a>
            <a
              href="#keunggulan"
              className="hover:text-[#FB6E09] transition-colors"
            >
              Fitur CAT
            </a>
            <a
              href="#faq"
              className="hover:text-[#FB6E09] transition-colors"
            >
              Bantuan
            </a>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-[#042E64] hover:text-[#FB6E09] hover:bg-[#F4E3CB] rounded-xl transition-all duration-150"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] rounded-xl shadow-md shadow-[#FB6E09]/25 transition-all duration-150 group"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-[#042E64] bg-[#F4E3CB] hover:bg-[#EAD4BA] rounded-lg transition-colors"
            >
              Masuk
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#042E64] hover:text-[#FB6E09] hover:bg-[#F4E3CB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB6E09]"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCF4E7] border-b border-[#F0DCBE] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 font-bold text-[#042E64]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-[#FB6E09]/15 text-[#FB6E09] font-extrabold flex items-center justify-between"
            >
              <span>Beranda</span>
              <span className="w-2 h-2 rounded-full bg-[#FB6E09]" />
            </Link>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F4E3CB]"
            >
              Fitur CAT BKN
            </a>
            <a
              href="#promo-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F4E3CB] flex items-center justify-between"
            >
              <span>Paket Promo SKB</span>
              <span className="bg-[#FB6E09] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Hemat 25%
              </span>
            </a>
            <a
              href="#leaderboard-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F4E3CB] flex items-center justify-between"
            >
              <span>Papan Peringkat (Top 5)</span>
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F4E3CB]"
            >
              Fitur CAT BKN
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#F4E3CB]"
            >
              Bantuan & FAQ
            </a>
          </div>

          <div className="pt-3 border-t border-[#F0DCBE] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl font-bold text-[#042E64] bg-[#F4E3CB] hover:bg-[#EAD4BA] transition-colors text-sm"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-white bg-[#FB6E09] hover:bg-[#E45E00] transition-colors text-sm shadow-md shadow-[#FB6E09]/20"
            >
              <span>Daftar Akun Baru</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
