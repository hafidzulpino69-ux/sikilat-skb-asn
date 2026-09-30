export interface PositionPackage {
  id: string;
  packageKey: "paket-1" | "paket-2" | "paket-3" | "bundling";
  label: string;
  subTitle: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice: number;
  examNumbers: number[];
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface PositionItem {
  id: string;
  title: string;
  code: string;
  level: "Ahli Pertama" | "Terampil" | "Pelaksana";
  passingScore: number;
  totalQuestions: number;
  durationMinutes: number;
  description: string;
}

export interface AgencyItem {
  id: string;
  name: string;
  shortName: string;
  code: string;
  iconType: "health" | "finance" | "education" | "justice" | "admin" | "law";
  badge: string;
  description: string;
  popularPositionsCount: number;
  positions: PositionItem[];
}

// Helper to generate the 4 standard package boxes for any position based on exact user specification
export function getPositionPackages(positionTitle: string): PositionPackage[] {
  const commonDescription = `Materi Uji Pokok Teknis Jabatan ${positionTitle} sesuai kisi-kisi resmi Kemenpan-RB.`;
  const commonFeatures = [
    "100 butir soal CAT BKN",
    "Waktu ujian selama 90 menit",
    "Kunci jawaban dan pembahasan detail",
  ];

  return [
    {
      id: "paket-1",
      packageKey: "paket-1",
      label: "Paket 1",
      subTitle: "SKB Formasi",
      name: "Paket 1",
      price: 30000,
      originalPrice: 35000,
      examNumbers: [1],
      description: commonDescription,
      features: commonFeatures,
    },
    {
      id: "paket-2",
      packageKey: "paket-2",
      label: "Paket 2",
      subTitle: "SKB Formasi",
      name: "Paket 2",
      price: 30000,
      originalPrice: 35000,
      examNumbers: [2],
      description: commonDescription,
      features: commonFeatures,
    },
    {
      id: "paket-3",
      packageKey: "paket-3",
      label: "Paket 3",
      subTitle: "SKB Formasi",
      name: "Paket 3",
      price: 30000,
      originalPrice: 35000,
      examNumbers: [3],
      description: commonDescription,
      features: commonFeatures,
    },
    {
      id: "bundling",
      packageKey: "bundling",
      label: "Paket Bundling (Berisi Paket 1, 2, dan 3)",
      subTitle: "SKB Formasi",
      name: "Paket Bundling (Berisi Paket 1, 2, dan 3)",
      badge: "Paling Hemat • 3 Paket",
      price: 30000,
      originalPrice: 35000,
      examNumbers: [1, 2, 3],
      isPopular: true,
      description: commonDescription,
      features: commonFeatures,
    },
  ];
}

export const AGENCIES_DATA: AgencyItem[] = [
  {
    id: "kemenkes",
    name: "Kementerian Kesehatan RI",
    shortName: "Kemenkes",
    code: "KMK-01",
    iconType: "health",
    badge: "Prioritas Tenaga Kesehatan",
    description: "Formasi Tenaga Medis, Rumah Sakit Vertikal, Balai Laboratorium Kesehatan, dan Dinkes se-Indonesia.",
    popularPositionsCount: 4,
    positions: [
      {
        id: "kemenkes-epidemiolog",
        title: "Epidemiolog Kesehatan Ahli Pertama",
        code: "KMK-EPD-01",
        level: "Ahli Pertama",
        passingScore: 350,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Surveilans penyakit menular & tidak menular, investigasi wabah/KLB, dan manajemen data kesehatan masyarakat.",
      },
      {
        id: "kemenkes-pranata-lab",
        title: "Pranata Laboratorium Kesehatan Ahli Pertama",
        code: "KMK-PLK-02",
        level: "Ahli Pertama",
        passingScore: 345,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Pengujian spesimen klinis, validasi instrumen laboratorium medik, biosafety, dan penjaminan mutu analitik.",
      },
      {
        id: "kemenkes-nutrisionis",
        title: "Nutrisionis Ahli Pertama",
        code: "KMK-NUT-03",
        level: "Ahli Pertama",
        passingScore: 340,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Asuhan gizi klinik, manajemen penyelenggaraan makanan RS, serta program intervensi gizi masyarakat (Stunting).",
      },
      {
        id: "kemenkes-administrator-kes",
        title: "Administrator Kesehatan Ahli Pertama",
        code: "KMK-ADM-04",
        level: "Ahli Pertama",
        passingScore: 350,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Penyusunan kebijakan program kesehatan, akreditasi fasyankes, perizinan nakes, dan audit operasional kesehatan.",
      },
    ],
  },
  {
    id: "kemenkeu",
    name: "Kementerian Keuangan RI",
    shortName: "Kemenkeu",
    code: "KMK-02",
    iconType: "finance",
    badge: "Pengelola Keuangan Negara",
    description: "Direktorat Jenderal Pajak, Bea & Cukai, Perbendaharaan, Anggaran, dan Kekayaan Negara.",
    popularPositionsCount: 3,
    positions: [
      {
        id: "kemenkeu-analis-kebijakan",
        title: "Analis Kebijakan Ahli Pertama",
        code: "KMK-AKB-01",
        level: "Ahli Pertama",
        passingScore: 360,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Formulasi, implementasi, dan evaluasi kebijakan fiskal serta penganggaran belanja negara.",
      },
      {
        id: "kemenkeu-pemeriksa-pajak",
        title: "Pemeriksa Pajak Ahli Pertama",
        code: "KMK-PPJ-02",
        level: "Ahli Pertama",
        passingScore: 365,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Pemeriksaan kepatuhan perpajakan Wajib Pajak, regulasi UU HPP, PPh, PPN, dan KUP.",
      },
      {
        id: "kemenkeu-analis-anggaran",
        title: "Analis Anggaran Ahli Pertama",
        code: "KMK-ANG-03",
        level: "Ahli Pertama",
        passingScore: 355,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Penganggaran belanja K/L, penyusunan APBN, manajemen utang negara, dan evaluasi output belanja.",
      },
    ],
  },
  {
    id: "kejaksaan",
    name: "Kejaksaan Republik Indonesia",
    shortName: "Kejaksaan RI",
    code: "KJK-03",
    iconType: "justice",
    badge: "Penegak Hukum Nasional",
    description: "Kejaksaan Agung, Kejaksaan Tinggi, dan Kejaksaan Negeri di seluruh wilayah hukum Indonesia.",
    popularPositionsCount: 3,
    positions: [
      {
        id: "kejaksaan-petugas-barang-bukti",
        title: "Petugas Pengelola Barang Bukti",
        code: "KJK-PBB-01",
        level: "Terampil",
        passingScore: 340,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Inventarisasi, penyimpanan, pemeliharaan, serta proses lelang/pemusnahan barang rampasan negara.",
      },
      {
        id: "kejaksaan-ahli-pertama-jaksa",
        title: "Ahli Pertama Jaksa",
        code: "KJK-JKS-02",
        level: "Ahli Pertama",
        passingScore: 365,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Hukum Pidana Materiil & Formil (KUHP/KUHAP), Tindak Pidana Khusus (Tipikor/TPPU), Perdata & Tata Usaha Negara.",
      },
      {
        id: "kejaksaan-pranata-peradilan",
        title: "Pranata Peradilan",
        code: "KJK-PRD-03",
        level: "Terampil",
        passingScore: 345,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Pengelolaan berkas perkara pidana/perdata, administrasi persidangan, dan sistem informasi perkara.",
      },
    ],
  },
  {
    id: "kemendikbud",
    name: "Kementerian Pendidikan, Kebudayaan, Riset & Teknologi",
    shortName: "Kemendikbudristek",
    code: "KMD-04",
    iconType: "education",
    badge: "Pendidikan & Kebudayaan",
    description: "Formasi Pengembang Kurikulum, Pamong Budaya, Widyaprada, dan Pengembang Teknologi Pembelajaran.",
    popularPositionsCount: 2,
    positions: [
      {
        id: "kemendikbud-ptp",
        title: "Pengembang Teknologi Pembelajaran Ahli Pertama",
        code: "KMD-PTP-01",
        level: "Ahli Pertama",
        passingScore: 350,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Desain instruksional digital, LMS, media e-learning, evaluasi teknologi pembelajaran nasional.",
      },
      {
        id: "kemendikbud-pamong-budaya",
        title: "Pamong Budaya Ahli Pertama",
        code: "KMD-PMB-02",
        level: "Ahli Pertama",
        passingScore: 340,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Pelestarian cagar budaya, diplomasi budaya, inventarisasi warisan budaya takbenda (WBTB), permuseuman.",
      },
    ],
  },
  {
    id: "bkn",
    name: "Badan Kepegawaian Negara",
    shortName: "BKN RI",
    code: "BKN-05",
    iconType: "admin",
    badge: "Instansi Pembina ASN",
    description: "Pusat Pengelolaan Manajemen Talenta ASN Nasional, Regulasi Manajemen PPPK/PNS, dan Sistem Seleksi CAT.",
    popularPositionsCount: 2,
    positions: [
      {
        id: "bkn-analis-sdma",
        title: "Analis Sumber Daya Manusia Aparatur Ahli Pertama",
        code: "BKN-SDM-01",
        level: "Ahli Pertama",
        passingScore: 355,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Manajemen ASN, sistem merit, penilaian kinerja, disiplin PNS, dan pengembangan kompetensi aparatur.",
      },
      {
        id: "bkn-pranata-komputer",
        title: "Pranata Komputer Ahli Pertama",
        code: "BKN-PK-02",
        level: "Ahli Pertama",
        passingScore: 360,
        totalQuestions: 100,
        durationMinutes: 90,
        description: "Rekayasa perangkat lunak pemerintah, database kepegawaian nasional, keamanan siber, arsitektur SPBE.",
      },
    ],
  },
];
