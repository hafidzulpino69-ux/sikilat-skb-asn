export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
}

export interface ExamQuestion {
  id: number;
  questionNumber: number;
  category: string;
  questionText: string;
  options: QuestionOption[];
}

// 15 Template Soal Riil Berdasarkan Kisi-kisi Resmi SKB & CAT BKN
const BASE_QUESTIONS = [
  {
    category: "Regulasi & Kebijakan ASN",
    questionText:
      "Berdasarkan Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara, transformasi manajemen ASN berfokus pada penguatan budaya kerja dan pemenuhan ekspektasi kinerja organisasi. Manakah dari prinsip berikut yang menjadi pilar utama dalam sistem merit pengelolaan karier ASN modern?",
    options: [
      { key: "A" as const, text: "Penetapan jenjang jabatan berdasarkan masa kerja dan senioritas mutlak pegawai." },
      { key: "B" as const, text: "Kualifikasi, kompetensi, dan kinerja secara adil serta wajar tanpa diskriminasi." },
      { key: "C" as const, text: "Prioritas promosi bagi lulusan sekolah kedinasan internal kementerian." },
      { key: "D" as const, text: "Penilaian kecakapan subjektif berdasarkan rekomendasi langsung pimpinan satuan kerja." },
      { key: "E" as const, text: "Sistem rotasi periodik seragam tanpa mempertimbangkan kebutuhan peta jabatan instansi." },
    ],
  },
  {
    category: "Teknis Jabatan & Tata Kelola",
    questionText:
      "Dalam administrasi barang rampasan dan sitaan negara, petugas pengelola berkewajiban melakukan pencatatan buku register serta verifikasi fisik secara teliti. Apabila ditemukan ketidaksesuaian jumlah fisik dengan surat tanda penerimaan saat pelimpahan berkas, langkah prosedural standar yang harus segera dilakukan adalah:",
    options: [
      { key: "A" as const, text: "Langsung menandatangani berita acara serah terima demi kelancaran proses persidangan." },
      { key: "B" as const, text: "Mengubah angka register sepihak untuk menyesuaikan kondisi fisik yang diterima di gudang." },
      { key: "C" as const, text: "Membuat Berita Acara Perbedaan/Pemeriksaan dan meminta konfirmasi tertulis kepada penyidik." },
      { key: "D" as const, text: "Menitipkan barang yang selisih kepada pihak ketiga tanpa izin pengadilan." },
      { key: "E" as const, text: "Menolak seluruh berkas perkara dan membatalkan status sitaan tanpa koordinasi pimpinan." },
    ],
  },
  {
    category: "Integritas & Kode Etik ASN",
    questionText:
      "Seorang ASN menerima bingkisan berharga dalam rangka perayaan hari raya keagamaan dari mitra vendor pengadaan yang sedang mengikuti tender lelang proyek di kantornya. Berdasarkan pedoman pengendalian gratifikasi KPK dan Peraturan Kemenpan-RB, tindakan yang paling tepat adalah:",
    options: [
      { key: "A" as const, text: "Menerima bingkisan tersebut dan menyimpannya di rumah agar tidak memicu kecurigaan rekan kerja." },
      { key: "B" as const, text: "Membagi-bagikan isi bingkisan kepada seluruh staf divisi agar dianggap bukan untuk kepentingan pribadi." },
      { key: "C" as const, text: "Menolak secara sopan atau segera melaporkan ke Unit Pengendalian Gratifikasi (UPG) dalam batas waktu maksimal 30 hari kerja." },
      { key: "D" as const, text: "Menerimanya namun mendiskualifikasi vendor tersebut dari proses tender lelang secara diam-diam." },
      { key: "E" as const, text: "Meminta vendor mengubah nilai barang menjadi voucher belanja tunai tanpa tanda terima." },
    ],
  },
  {
    category: "Pelayanan Publik & Digitalisasi",
    questionText:
      "Asas pelayanan publik sebagaimana diatur dalam UU No. 25 Tahun 2009 menuntut terselenggaranya keterbukaan informasi dan akuntabilitas. Penerapan platform Sistem Informasi Berbasis Elektronik (SPBE) dalam pelayanan publik bertujuan utama untuk:",
    options: [
      { key: "A" as const, text: "Menghapuskan interaksi tatap muka bagi seluruh lapisan masyarakat tanpa alternatif layanan asistensi." },
      { key: "B" as const, text: "Mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan terpadu secara nasional." },
      { key: "C" as const, text: "Mengalihkan tanggung jawab operasional pelayanan publik sepenuhnya kepada vendor IT swasta." },
      { key: "D" as const, text: "Mempermudah pembatasan kuota pengaduan masyarakat atas ketidakpuasan layanan birokrasi." },
      { key: "E" as const, text: "Menambah pos biaya administrasi digital yang dibebankan kepada penerima manfaat layanan." },
    ],
  },
  {
    category: "Kompensasi & Disiplin Pegawai",
    questionText:
      "Sesuai ketentuan Peraturan Pemerintah tentang Disiplin Pegawai Negeri Sipil, pelanggaran terhadap kewajiban masuk kerja dan menaati ketentuan jam kerja yang dilakukan secara kumulatif selama 28 hari kerja atau lebih tanpa alasan sah dapat dijatuhi hukuman disiplin berat berupa:",
    options: [
      { key: "A" as const, text: "Teguran lisan dari atasan langsung dan pemotongan uang makan satu pekan." },
      { key: "B" as const, text: "Pemberhentian dengan hormat tidak atas permintaan sendiri sebagai PNS." },
      { key: "C" as const, text: "Penundaan kenaikan pangkat reguler selama 6 bulan berturut-turut." },
      { key: "D" as const, text: "Penugasan kerja sosial di lingkungan kantor tanpa pengurangan hak cuti tahunan." },
      { key: "E" as const, text: "Pemberian surat peringatan pertama yang berlaku mengikat selama 2 tahun." },
    ],
  },
  {
    category: "Manajemen Kinerja ASN",
    questionText:
      "Dalam siklus pengelolaan Sasaran Kinerja Pegawai (SKP) sesuai Permenpan-RB No. 6 Tahun 2022, dialog kinerja antara pimpinan dan pegawai dirancang untuk terlaksana secara berkala. Fokus utama dialog kinerja tersebut adalah:",
    options: [
      { key: "A" as const, text: "Mencari kesalahan administratif pegawai demi penetapan persentase pemotongan tunjangan kinerja." },
      { key: "B" as const, text: "Menyamakan persepsi ekspektasi hasil, memantau progres, dan memberikan umpan balik berkelanjutan." },
      { key: "C" as const, text: "Menentukan kuota pemenang promosi jabatan sebelum pelaksanaan asesmen kompetensi resmi." },
      { key: "D" as const, text: "Mengganti seluruh indikator kinerja utama unit kerja setiap kali terjadi pergantian menteri." },
      { key: "E" as const, text: "Memastikan pegawai menyelesaikan tugas pribadi pimpinan di luar jam operasional kedinasan." },
    ],
  },
  {
    category: "Teknis Pengelolaan Arsip & Bukti",
    questionText:
      "Standar operasional pengamanan barang bukti digital (seperti laptop, smartphone, atau flashdisk) pada saat penyitaan di tempat kejadian perkara (TKP) mensyaratkan penggunaan metode pelindungan 'Chain of Custody'. Mengapa metode ini sangat esensial?",
    options: [
      { key: "A" as const, text: "Agar barang bukti tidak terkena debu dan dapat dijual lelang sebelum putusan berkekuatan hukum tetap." },
      { key: "B" as const, text: "Untuk menjamin integritas, keaslian, dan keterlacakan riwayat penanganan bukti agar sah di pengadilan." },
      { key: "C" as const, text: "Supaya penyidik tidak perlu membuat berita acara serah terima kepada panitera peradilan." },
      { key: "D" as const, text: "Untuk menyamarkan identitas kepemilikan perangkat dari publikasi media massa." },
      { key: "E" as const, text: "Agar barang bukti digital dapat digunakan oleh petugas kepolisian untuk kepentingan pribadi." },
    ],
  },
  {
    category: "BerAKHLAK & Core Values",
    questionText:
      "Nilai dasar 'Akuntabel' dalam panduan perilaku Core Values ASN BerAKHLAK tercermin secara konkret melalui tindakan:",
    options: [
      { key: "A" as const, text: "Membantu rekan kerja menyelesaikan tugas lembur tanpa menghiraukan standar mutu pekerjaan." },
      { key: "B" as const, text: "Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi." },
      { key: "C" as const, text: "Mengikuti segala perintah atasan meskipun bertentangan dengan peraturan perundang-undangan." },
      { key: "D" as const, text: "Memanfaatkan kendaraan dinas inventaris kantor untuk keperluan wisata keluarga di akhir pekan." },
      { key: "E" as const, text: "Menunda pelaporan penggunaan anggaran belanja dinas hingga akhir tahun anggaran." },
    ],
  },
  {
    category: "Hukum Administrasi Negara",
    questionText:
      "Unsur 'Asas-Asas Umum Pemerintahan yang Baik' (AUPB) yang mewajibkan badan atau pejabat pemerintahan untuk mempertimbangkan secara cermat semua aspek yang relevan sebelum mengeluarkan suatu Keputusan Tata Usaha Negara (KTUN) adalah:",
    options: [
      { key: "A" as const, text: "Asas Kecermatan." },
      { key: "B" as const, text: "Asas Penyalahgunaan Wewenang." },
      { key: "C" as const, text: "Asas Diskresi Tak Terbatas." },
      { key: "D" as const, text: "Asas Kemanfaatan Sepihak." },
      { key: "E" as const, text: "Asas Keterbukaan Terbatas." },
    ],
  },
  {
    category: "Tata Naskah Dinas",
    questionText:
      "Dalam pedoman tata naskah dinas instansi pemerintah, naskah dinas yang bersifat penetapan dan memuat kebijakan yang bersifat mengikat umum atau individu ASN di lingkungan instansi adalah:",
    options: [
      { key: "A" as const, text: "Nota Dinas Internal." },
      { key: "B" as const, text: "Surat Keputusan (SK)." },
      { key: "C" as const, text: "Surat Edaran Non-Yuridis." },
      { key: "D" as const, text: "Lembar Disposisi Atasan." },
      { key: "E" as const, text: "Surat Tanda Bukti Tamu." },
    ],
  },
];

// Generate exactly 110 questions with unique variations for full CAT BKN simulation
export const DUMMY_EXAM_QUESTIONS: ExamQuestion[] = Array.from({ length: 110 }, (_, index) => {
  const questionNumber = index + 1;
  const baseIndex = index % BASE_QUESTIONS.length;
  const base = BASE_QUESTIONS[baseIndex];

  // Variations to make each question distinctive while maintaining professional technical quality
  const iteration = Math.floor(index / BASE_QUESTIONS.length) + 1;
  const titlePrefix = iteration > 1 ? `[Sesi Lanjutan ${iteration}] ` : "";

  return {
    id: questionNumber,
    questionNumber,
    category: base.category,
    questionText: `${titlePrefix}${base.questionText} (Simulasi Uji Kompetensi Soal Nomor ${questionNumber})`,
    options: base.options.map((opt) => ({
      key: opt.key,
      text: opt.text,
    })),
  };
});
