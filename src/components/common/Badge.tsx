import { ReactNode } from "react";

// =========================================================================
// Komponen Common: Badge
// Label/tag kecil yang konsisten di seluruh aplikasi
// =========================================================================

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "orange";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-300",
  success: "bg-emerald-100 text-emerald-800 border-emerald-300",
  warning: "bg-amber-100 text-amber-800 border-amber-300",
  danger: "bg-rose-100 text-rose-800 border-rose-300",
  info: "bg-blue-50 text-[#042E64] border-blue-200",
  orange: "bg-[#FB6E09]/10 text-[#FB6E09] border-[#FB6E09]/30",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
