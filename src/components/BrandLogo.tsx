import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  inverted?: boolean; // For dark navy backgrounds (e.g. footer)
  href?: string;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  inverted = false,
  href = "/",
}: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg sm:text-xl tracking-tight",
    lg: "text-2xl sm:text-3xl tracking-tight",
  }[size];

  const content = (
    <div className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none select-none">
      {/* Exact Vector Replica of the Book + Lightning Bolt Logo */}
      <div className={`relative ${iconDimensions} shrink-0 transition-transform group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Book Spine / Cover Outline (Orange) */}
          <path
            d="M20 18C20 13.5817 23.5817 10 28 10H75C78.3137 10 81 12.6863 81 16V22H32C28.6863 22 26 24.6863 26 28V84C22.6863 84 20 81.3137 20 78V18Z"
            fill="#FB6E09"
          />
          {/* Main Book Body Outline */}
          <rect
            x="24"
            y="20"
            width="58"
            height="70"
            rx="10"
            stroke="#FB6E09"
            strokeWidth="10"
            fill={inverted ? "transparent" : "#FCF4E7"}
          />
          {/* Lightning Bolt Icon Inside (Orange) */}
          <path
            d="M56 34L38 54H52L46 76L68 50H52L56 34Z"
            fill="#FB6E09"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black uppercase text-[#FB6E09] tracking-wider ${titleSizes}`}>
            SIKILAT
          </span>
          <span
            className={`font-black uppercase tracking-wider ${
              inverted ? "text-white" : "text-[#042E64]"
            } ${titleSizes}`}
          >
            SKB ASN
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
