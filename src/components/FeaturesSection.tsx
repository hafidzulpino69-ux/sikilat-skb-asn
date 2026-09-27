import {
  Monitor,
  Target,
  BarChart3,
  BookOpen,
  Smartphone,
  CheckCircle,
  Zap,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Monitor className="w-6 h-6 text-[#FB6E09]" />,
      title: "Antarmuka 100% Persis CAT BKN",
      desc: "Navigasi nomor soal, ragu-ragu, timer countdown, dan tata letak tombol dibuat identik dengan aplikasi tes resmi BKN.",
    },
    {
      icon: <Target className="w-6 h-6 text-[#042E64]" />,
      title: "Bank Soal Sesuai FR & Regulasi Terbaru",
      desc: "Soal dikurasi langsung oleh praktisi ASN dan master trainer dengan acuan Permenpan-RB dan evaluasi Field Report ujian terkini.",
    },
    {
      icon: <Zap className="w-6 h-6 text-[#FB6E09]" />,
      title: "Kecepatan Akses Kilat & Real-Time",
      desc: "Infrastruktur server cepat memastikan tidak ada hambatan loading antar-soal saat pengerjaan simulasi CAT.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#042E64]" />,
      title: "Analisis Evaluasi & Peringkat Nasional",
      desc: "Laporan performa mendalam untuk mengetahui sub-materi yang masih lemah dan posisimu di antara seluruh peserta se-Indonesia.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#FB6E09]" />,
      title: "Pembahasan Komprehensif & Rasional",
      desc: "Setiap soal dilengkapi ulasan dasar hukum, cara eliminasi opsi salah, serta rumus ringkas agar hemat waktu ujian.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#042E64]" />,
      title: "Responsif di Smartphone, Tablet & Laptop",
      desc: "Dapat diakses fleksibel di mana pun tanpa repot instalasi software tambahan, lancar di browser hp maupun desktop.",
    },
  ];

  return (
    <section id="keunggulan" className="py-16 sm:py-20 bg-[#FCF4E7] border-t border-[#F0DCBE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FB6E09]/10 text-[#FB6E09] border border-[#FB6E09]/20 text-xs font-black uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 fill-[#FB6E09]" />
            <span>Keunggulan SIKILAT SKB ASN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#042E64] tracking-tight">
            Mengapa Ribuan Calon PNS Memilih Berlatih Di Sini?
          </h2>
          <p className="text-[#042E64]/80 text-sm mt-3 font-medium">
            Kombinasi teknologi simulasi kilat modern dan materi berkualitas tinggi untuk menjamin kesiapan mental dan akademismu menghadapi hari-H ujian SKB.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border-2 border-[#F0DCBE] shadow-xs hover:shadow-md hover:border-[#FB6E09]/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FCF4E7] border border-[#F0DCBE] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#042E64] mb-2">
                {item.title}
              </h3>
              <p className="text-[#042E64]/75 text-xs sm:text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
