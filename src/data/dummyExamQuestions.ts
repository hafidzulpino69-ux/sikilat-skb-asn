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
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
}

// 10 Kategori Materi Pokok SKB Resmi dengan Pembahasan Berbobot
const BASE_QUESTIONS = [
  {
    category: "Regulasi UU ASN No. 20/2023",
    questionText:
      "Berdasarkan Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara, transformasi manajemen ASN berfokus pada penguatan budaya kerja dan pemenuhan ekspektasi kinerja organisasi. Manakah dari prinsip berikut yang menjadi pilar utama dalam sistem merit pengelolaan karier ASN modern?",
    options: [
      { key: "A" as const, text: "Penetapan jenjang jabatan berdasarkan masa kerja dan senioritas mutlak pegawai." },
      { key: "B" as const, text: "Kualifikasi, kompetensi, dan kinerja secara adil serta wajar tanpa diskriminasi." },
      { key: "C" as const, text: "Prioritas promosi bagi lulusan sekolah kedinasan internal kementerian terkait." },
      { key: "D" as const, text: "Penilaian kecakapan subjektif berdasarkan rekomendasi langsung pimpinan satuan kerja." },
      { key: "E" as const, text: "Sistem rotasi periodik seragam tanpa mempertimbangkan peta kebutuhan jabatan instansi." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Pasal 1 angka 22 UU No. 20 Tahun 2023 menegaskan bahwa Sistem Merit adalah kebijakan dan manajemen ASN yang berdasarkan pada kualifikasi, kompetensi, dan kinerja, yang diberlakukan secara adil dan wajar dengan tanpa diskriminasi. Faktor senioritas atau pertimbangan subjektif tidak lagi menjadi dasar penentu jenjang karier.",
  },
  {
    category: "Teknis Jabatan Pengelola Barang Bukti",
    questionText:
      "Dalam administrasi barang rampasan dan sitaan negara, petugas pengelola berkewajiban melakukan pencatatan buku register serta verifikasi fisik secara teliti. Apabila ditemukan ketidaksesuaian jumlah fisik dengan surat tanda penerimaan saat pelimpahan berkas perkara, langkah prosedural standar yang harus segera dilakukan adalah:",
    options: [
      { key: "A" as const, text: "Langsung menandatangani berita acara serah terima demi kelancaran proses persidangan." },
      { key: "B" as const, text: "Mengubah angka register sepihak untuk menyesuaikan kondisi fisik yang diterima di gudang." },
      { key: "C" as const, text: "Membuat Berita Acara Perbedaan/Pemeriksaan dan meminta konfirmasi tertulis kepada penyidik pelimpah." },
      { key: "D" as const, text: "Menitipkan barang yang selisih kepada pihak ketiga tanpa izin ketua pengadilan negeri." },
      { key: "E" as const, text: "Menolak seluruh berkas perkara dan membatalkan status sitaan tanpa koordinasi pimpinan." },
    ],
    correctAnswer: "C" as const,
    explanation:
      "Sesuai SOP Administrasi Perkara dan Pengelolaan Benda Sitaan/Barang Rampasan, setiap ketidaksesuaian wajib dituangkan dalam Berita Acara Perbedaan/Ketidaksesuaian Pemeriksaan Fisik yang ditandatangani bersama dan meminta klarifikasi resmi kepada instansi/penyidik yang melimpahkan guna menjaga keabsahan alat bukti.",
  },
  {
    category: "Integritas & Anti-Gratifikasi",
    questionText:
      "Seorang ASN menerima bingkisan berharga dalam rangka perayaan hari raya keagamaan dari mitra vendor pengadaan yang sedang mengikuti tender lelang proyek di kantornya. Berdasarkan pedoman pengendalian gratifikasi KPK dan Peraturan Kemenpan-RB, tindakan yang paling tepat adalah:",
    options: [
      { key: "A" as const, text: "Menerima bingkisan tersebut dan menyimpannya di rumah agar tidak memicu kecurigaan rekan kerja." },
      { key: "B" as const, text: "Membagi-bagikan isi bingkisan kepada seluruh staf divisi agar dianggap bukan untuk kepentingan pribadi." },
      { key: "C" as const, text: "Menolak secara sopan atau segera melaporkan ke Unit Pengendalian Gratifikasi (UPG) dalam batas waktu maksimal 30 hari kerja." },
      { key: "D" as const, text: "Menerimanya namun mendiskualifikasi vendor tersebut dari proses tender lelang secara diam-diam." },
      { key: "E" as const, text: "Meminta vendor mengubah nilai barang menjadi voucher belanja tunai tanpa tanda terima." },
    ],
    correctAnswer: "C" as const,
    explanation:
      "Sesuai Pasal 12B UU Tipikor dan regulasi KPK, gratifikasi yang berhubungan dengan jabatan dan berlawanan dengan kewajiban/tugas wajib ditolak, atau jika dalam kondisi tertentu tidak dapat ditolak, wajib dilaporkan kepada KPK/UPG instansi selambat-lambatnya 30 hari kerja sejak tanggal penerimaan.",
  },
  {
    category: "Pelayanan Publik & Digitalisasi SPBE",
    questionText:
      "Asas pelayanan publik sebagaimana diatur dalam UU No. 25 Tahun 2009 menuntut terselenggaranya keterbukaan informasi dan akuntabilitas. Penerapan platform Sistem Informasi Pemerintahan Berbasis Elektronik (SPBE) dalam pelayanan publik bertujuan utama untuk:",
    options: [
      { key: "A" as const, text: "Menghapuskan interaksi tatap muka bagi seluruh lapisan masyarakat tanpa alternatif layanan asistensi." },
      { key: "B" as const, text: "Mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan terpadu secara nasional." },
      { key: "C" as const, text: "Mengalihkan tanggung jawab operasional pelayanan publik sepenuhnya kepada vendor IT swasta." },
      { key: "D" as const, text: "Mempermudah pembatasan kuota pengaduan masyarakat atas ketidakpuasan layanan birokrasi." },
      { key: "E" as const, text: "Menambah pos biaya administrasi digital yang dibebankan kepada penerima manfaat layanan." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Tujuan utama SPBE (Perpres No. 95/2018) adalah mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel serta pelayanan publik yang berkualitas dan terpercaya melalui integrasi sistem informasi nasional.",
  },
  {
    category: "Disiplin PNS (PP No. 94/2021)",
    questionText:
      "Sesuai ketentuan Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil, pelanggaran terhadap kewajiban masuk kerja dan menaati ketentuan jam kerja yang dilakukan secara kumulatif selama 28 hari kerja atau lebih dalam satu tahun tanpa alasan sah dapat dijatuhi hukuman disiplin berat berupa:",
    options: [
      { key: "A" as const, text: "Teguran lisan dari atasan langsung dan pemotongan uang makan satu pekan." },
      { key: "B" as const, text: "Pemberhentian dengan hormat tidak atas permintaan sendiri sebagai PNS." },
      { key: "C" as const, text: "Penundaan kenaikan pangkat reguler selama 6 bulan berturut-turut." },
      { key: "D" as const, text: "Penugasan kerja sosial di lingkungan kantor tanpa pengurangan hak cuti tahunan." },
      { key: "E" as const, text: "Pemberian surat peringatan pertama yang berlaku mengikat selama 2 tahun." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Berdasarkan Pasal 11 ayat (2) huruf d angka 3 PP No. 94 Tahun 2021, PNS yang tidak masuk kerja tanpa alasan sah secara kumulatif selama 28 (dua puluh delapan) hari kerja atau lebih dalam 1 (satu) tahun dijatuhi hukuman disiplin berat berupa pemberhentian dengan hormat tidak atas permintaan sendiri sebagai PNS.",
  },
  {
    category: "Manajemen Kinerja ASN (Permenpan-RB 6/2022)",
    questionText:
      "Dalam siklus pengelolaan Sasaran Kinerja Pegawai (SKP) sesuai Permenpan-RB No. 6 Tahun 2022, dialog kinerja antara pimpinan dan pegawai dirancang untuk terlaksana secara berkala. Fokus utama dialog kinerja tersebut adalah:",
    options: [
      { key: "A" as const, text: "Mencari kesalahan administratif pegawai demi penetapan persentase pemotongan tunjangan kinerja." },
      { key: "B" as const, text: "Menyamakan persepsi ekspektasi hasil, memantau progres, dan memberikan umpan balik berkelanjutan." },
      { key: "C" as const, text: "Menentukan kuota pemenang promosi jabatan sebelum pelaksanaan asesmen kompetensi resmi." },
      { key: "D" as const, text: "Mengganti seluruh indikator kinerja utama unit kerja setiap kali terjadi pergantian menteri." },
      { key: "E" as const, text: "Memastikan pegawai menyelesaikan tugas pribadi pimpinan di luar jam operasional kedinasan." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Permenpan-RB No. 6/2022 menekankan bahwa pengelolaan kinerja bukan sekadar pengisian dokumen formulir, melainkan proses komunikasi interaktif (dialog kinerja) antara pimpinan dan pegawai untuk menyepakati ekspektasi kinerja, meninjau kemajuan secara berkala, dan memberikan ongoing feedback.",
  },
  {
    category: "Digital Forensik & Chain of Custody",
    questionText:
      "Standar operasional pengamanan barang bukti digital (seperti laptop, smartphone, atau flashdisk) pada saat penyitaan di tempat kejadian perkara (TKP) mensyaratkan penggunaan metode pelindungan 'Chain of Custody'. Mengapa metode ini sangat esensial?",
    options: [
      { key: "A" as const, text: "Agar barang bukti tidak terkena debu dan dapat dijual lelang sebelum putusan berkekuatan hukum tetap." },
      { key: "B" as const, text: "Untuk menjamin integritas, keaslian, dan keterlacakan riwayat penanganan bukti agar sah di pengadilan." },
      { key: "C" as const, text: "Supaya penyidik tidak perlu membuat berita acara serah terima kepada panitera peradilan." },
      { key: "D" as const, text: "Untuk menyamarkan identitas kepemilikan perangkat dari publikasi media massa." },
      { key: "E" as const, text: "Agar barang bukti digital dapat digunakan oleh petugas kepolisian untuk kepentingan pribadi." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Chain of Custody (rantai penjagaan) mendokumentasikan secara kronologis siapa yang mengumpulkan, mengamankan, menganalisis, dan memindahkan barang bukti. Rantai ini membuktikan bahwa barang bukti digital tidak mengalami perubahan (tampering) sejak disita hingga dihadirkan di meja hijau pengadilan.",
  },
  {
    category: "Core Values BerAKHLAK",
    questionText:
      "Nilai dasar 'Akuntabel' dalam panduan perilaku Core Values ASN BerAKHLAK tercermin secara konkret melalui tindakan:",
    options: [
      { key: "A" as const, text: "Membantu rekan kerja menyelesaikan tugas lembur tanpa menghiraukan standar mutu pekerjaan." },
      { key: "B" as const, text: "Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi." },
      { key: "C" as const, text: "Mengikuti segala perintah atasan meskipun bertentangan dengan peraturan perundang-undangan." },
      { key: "D" as const, text: "Memanfaatkan kendaraan dinas inventaris kantor untuk keperluan wisata keluarga di akhir pekan." },
      { key: "E" as const, text: "Menunda pelaporan penggunaan anggaran belanja dinas hingga akhir tahun anggaran." },
    ],
    correctAnswer: "B" as const,
    explanation:
      "Panduan perilaku nilai 'Akuntabel' dalam Core Values BerAKHLAK meliputi: (1) Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi; (2) Menggunakan kekayaan dan BMN secara bertanggung jawab, efektif, dan efisien; (3) Tidak menyalahgunakan kewenangan jabatan.",
  },
  {
    category: "Hukum Administrasi Negara & AUPB",
    questionText:
      "Unsur 'Asas-Asas Umum Pemerintahan yang Baik' (AUPB) yang mewajibkan badan atau pejabat pemerintahan untuk mempertimbangkan secara cermat semua aspek yang relevan sebelum mengeluarkan suatu Keputusan Tata Usaha Negara (KTUN) adalah:",
    options: [
      { key: "A" as const, text: "Asas Kecermatan." },
      { key: "B" as const, text: "Asas Kepastian Hukum Mutlak." },
      { key: "C" as const, text: "Asas Diskresi Tak Terbatas." },
      { key: "D" as const, text: "Asas Kemanfaatan Sepihak." },
      { key: "E" as const, text: "Asas Keterbukaan Terbatas." },
    ],
    correctAnswer: "A" as const,
    explanation:
      "Sesuai UU No. 30 Tahun 2014 tentang Administrasi Pemerintahan, 'Asas Kecermatan' mengandung arti bahwa suatu keputusan/tindakan administrasi pemerintahan harus didasarkan pada informasi dan dokumen pendukung yang lengkap serta diteliti secara cermat sebelum ditetapkan.",
  },
  {
    category: "Tata Kelola Gudang Benda Sitaan",
    questionText:
      "Dalam pemeliharaan barang bukti berupa kendaraan bermotor sitaan perkara pidana, tindakan pencegahan kerusakan fisik yang paling tepat dan sesuai standar pengelolaan BMN/Rupbasan adalah:",
    options: [
      { key: "A" as const, text: "Membiarkan kendaraan di lapangan terbuka terpapar sinar matahari dan hujan tanpa pelindung." },
      { key: "B" as const, text: "Menggunakan kendaraan tersebut untuk keperluan operasional harian dinas pegawai." },
      { key: "C" as const, text: "Menempatkan di area beratap, memutus kutub aki, mencatat odometer, dan memanaskan mesin berkala." },
      { key: "D" as const, text: "Menjual suku cadang kendaraan untuk menutupi biaya perawatan gudang." },
      { key: "E" as const, text: "Menguras oli mesin dan membuang bahan bakar tanpa pencatatan berita acara teknis." },
    ],
    correctAnswer: "C" as const,
    explanation:
      "Standar pemeliharaan kendaraan sitaan mewajibkan penyimpanan di gudang/shelter tertutup untuk menghindari korosi, pelepasan kutub aki agar tidak tekor, pencatatan kilometer awal, dan pemeriksaan kondisi mesin secara berkala tanpa menyalahgunakan fisik kendaraan.",
  },
];

// Generate TEPAT 100 Butir Soal SKB untuk Ujian CAT BKN Poin 3
export const DUMMY_EXAM_QUESTIONS: ExamQuestion[] = Array.from({ length: 100 }, (_, index) => {
  const questionNumber = index + 1;
  const baseIndex = index % BASE_QUESTIONS.length;
  const base = BASE_QUESTIONS[baseIndex];

  const iteration = Math.floor(index / BASE_QUESTIONS.length) + 1;
  const subTitle = iteration > 1 ? ` (Paket Soal Sesi ${iteration} - Bagian ${questionNumber})` : "";

  return {
    id: questionNumber,
    questionNumber,
    category: base.category,
    questionText: `${base.questionText}${subTitle}`,
    options: base.options.map((opt) => ({
      key: opt.key,
      text: opt.text,
    })),
    correctAnswer: base.correctAnswer,
    explanation: base.explanation,
  };
});
