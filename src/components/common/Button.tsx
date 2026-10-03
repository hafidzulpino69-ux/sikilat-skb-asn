import { ReactNode, ButtonHTMLAttributes } from "react";

// =========================================================================
// Komponen Common: Button
// Tombol universal yang konsisten di seluruh aplikasi
// =========================================================================

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "orange" | "navy";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] shadow-md shadow-[#FB6E09]/30",
  secondary:
    "text-[#042E64] bg-white border-2 border-slate-300 hover:bg-slate-100 shadow-xs",
  danger:
    "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-md shadow-rose-600/30",
  ghost:
    "text-slate-700 bg-slate-100 hover:bg-slate-200",
  orange:
    "text-white bg-[#FB6E09] hover:bg-[#E45E00] active:bg-[#C84F00] shadow-md shadow-[#FB6E09]/30",
  navy:
    "text-white bg-[#042E64] hover:bg-[#0B3E84] active:bg-[#021B3D] shadow-md shadow-[#042E64]/20",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl",
  lg: "px-6 py-3.5 text-sm rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 font-black transition-all active:scale-98 cursor-pointer select-none ${
        VARIANT_STYLES[variant]
      } ${SIZE_STYLES[size]} ${fullWidth ? "w-full" : ""} ${
        rest.disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
