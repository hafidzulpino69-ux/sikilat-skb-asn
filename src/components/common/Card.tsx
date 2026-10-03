import { ReactNode } from "react";

// =========================================================================
// Komponen Common: Card
// Wrapper card yang konsisten di seluruh halaman
// =========================================================================

type CardVariant = "default" | "navy" | "cream" | "outlined";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default: "bg-white border-2 border-slate-200/90 shadow-sm",
  navy: "bg-[#042E64] border-2 border-blue-400/20 text-white",
  cream: "bg-[#FCF4E7] border-2 border-[#F0DCBE]",
  outlined: "bg-white border-2 border-[#F0DCBE]",
};

const PADDING_STYLES: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export default function Card({
  children,
  variant = "default",
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div className={`rounded-3xl ${VARIANT_STYLES[variant]} ${PADDING_STYLES[padding]} ${className}`}>
      {children}
    </div>
  );
}
