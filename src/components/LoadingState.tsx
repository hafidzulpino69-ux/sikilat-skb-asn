"use client";

// =========================================================================
// Komponen Common/Shared: LoadingState
// Spinner elegan (cincin ganda berputar berlawanan arah) + teks berdenyut.
// =========================================================================

interface LoadingStateProps {
  /** Teks yang ditampilkan di bawah spinner */
  message?: string;
  /** true = memenuhi satu layar penuh; false = inline di dalam konten */
  fullScreen?: boolean;
  /** Warna latar saat fullScreen */
  backgroundClassName?: string;
}

export default function LoadingState({
  message = "Mohon tunggu sebentar...",
  fullScreen = false,
  backgroundClassName = "bg-[#FCF4E7]",
}: LoadingStateProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-5 py-14 animate-in fade-in duration-300"
    >
      <div className="relative w-14 h-14">
        {/* Track */}
        <div className="absolute inset-0 rounded-full border-4 border-[#042E64]/10" />
        {/* Cincin luar (oranye) */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FB6E09] border-r-[#FB6E09]/60 animate-spin" />
        {/* Cincin dalam (navy), berputar berlawanan arah */}
        <div className="absolute inset-2.5 rounded-full border-[3px] border-transparent border-b-[#042E64] border-l-[#042E64]/50 animate-spin [animation-direction:reverse] [animation-duration:1.4s]" />
        {/* Titik tengah */}
        <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[#FB6E09] animate-pulse" />
      </div>

      <p className="text-sm font-bold text-[#042E64] tracking-wide animate-pulse">{message}</p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundClassName}`}>
      {content}
    </div>
  );
}
