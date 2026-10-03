import type { QuestionOption, ExamQuestion, AnswerKey } from "@/types";

// 10 Kategori Materi Pokok SKB Resmi dengan Pembahasan Berbobot
const BASE_QUESTIONS: Omit<ExamQuestion, "id" | "questionNumber">[] = [
  {
    category: "Regulasi UU ASN No. 20/2023",
    questionText:
      "Berdasarkan Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara, transformasi manajemen ASN berfokus pada penguatan budaya kerja dan pemenuhan ekspektasi kinerja organisasi. Manakah dari prinsip berikut yang menjadi pilar utama dalam sistem merit pengelolaan karier ASN modern?",
    options: [
      { key: "A" as AnswerKey, text: "Penetapan jenjang jabatan berdasarkan masa kerja dan senioritas mutlak pegawai." },
      { key: "B" as AnswerKey, text: "Kualifikasi, kompetensi, dan kinerja secara adil serta wajar tanpa diskriminasi." },
      { key: "C" as AnswerKey, text: "Prioritas promosi bagi lulusan sekolah kedinasan internal kementerian terkait." },
      { key: "D" as AnswerKey, text: "Penilaian kecakapan subjektif berdasarkan rekomendasi langsung pimpinan satuan kerja." },
      { key: "E" as AnswerKey, text: "Sistem rotasi periodik seragam tanpa mempertimbangkan peta kebutuhan jabatan instansi." },
    ],
    correctAnswer: "B" as AnswerKey,
    explanation:
      "Pasal 1 angka 22 UU No. 20 Tahun 2023 menegaskan bahwa Sistem Merit adalah kebijakan dan manajemen ASN yang berdasarkan pada kualifikasi, kompetensi, dan kinerja, yang diberlakukan secara adil dan wajar dengan tanpa diskriminasi. Faktor senioritas atau pertimbangan subjektif tidak lagi menjadi dasar penentu jenjang karier.",
  },
  {
    category: "Teknis Jabatan Pengelola Barang Bukti",
    questionText:
      "Dalam administrasi barang rampasan dan sitaan negara, petugas pengelola berkewajiban melakukan pencatatan buku register serta verifikasi fisik secara teliti. Apabila ditemukan ketidaksesuaian jumlah fisik dengan surat tanda penerimaan saat pelimpahan berkas perkara, langkah prosedural standar yang harus segera dilakukan adalah:",
    options: [
      { key: "A" as AnswerKey, text: "Langsung menandatangani berita acara serah terima demi kelancaran proses persidangan." },
      { key: "B" as AnswerKey, text: "Mengubah angka register sepihak untuk menyesuaikan kondisi fisik yang diterima di gudang." },
      { key: "C" as AnswerKey, text: "Membuat Berita Acara Perbedaan/Pemeriksaan dan meminta konfirmasi tertulis kepada penyidik pelimpah." },
      { key: "D" as AnswerKey, text: "Menitipkan barang yang selisih kepada pihak ketiga tanpa izin ketua pengadilan negeri." },
      { key: "E" as AnswerKey, text: "Menolak seluruh berkas perkara dan membatalkan status sitaan tanpa koordinasi pimpinan." },
    ],
    correctAnswer: "C" as AnswerKey,
    explanation:
      "Sesuai SOP Administrasi Perkara dan Pengelolaan Benda Sitaan/Barang Rampasan, setiap ketidaksesuaian wajib dituangkan dalam Berita Acara Perbedaan/Ketidaksesuaian Pemeriksaan Fisik yang ditandatangani bersama dan meminta klarifikasi resmi kepada instansi/penyidik yang melimpahkan guna menjaga keabsahan alat bukti.",
  },
  {
    category: "Integritas & Anti-Gratifikasi",
    questionText:
      "Seorang ASN menerima bingkisan berharga dalam rangka perayaan hari raya keagamaan dari mitra vendor pengadaan yang sedang mengikuti tender lelang proyek di kantornya. Berdasarkan pedoman pengendalian gratifikasi KPK dan Peraturan Kemenpan-RB, tindakan yang paling tepat adalah:",
    options: [
      { key: "A" as AnswerKey, text: "Menerima bingkisan tersebut dan menyimpannya di rumah agar tidak memicu kecurigaan rekan kerja." },
      { key: "B" as AnswerKey, text: "Membagi-bagikan isi bingkisan kepada seluruh staf divisi agar dianggap bukan untuk kepentingan pribadi." },
      { key: "C" as AnswerKey, text: "Menolak secara sopan atau segera melaporkan ke Unit Pengendalian Gratifikasi (UPG) dalam batas waktu maksimal 30 hari kerja." },
      { key: "D" as AnswerKey, text: "Menerimanya namun mendiskualifikasi vendor tersebut dari proses tender lelang secara diam-diam." },
      { key: "E" as AnswerKey, text: "Meminta vendor mengubah nilai barang menjadi voucher belanja tunai tanpa tanda terima." },
    ],
    correctAnswer: "C" as AnswerKey,
    explanation:
      "Sesuai Pasal 12B UU Tipikor dan regulasi KPK, gratifikasi yang berhubungan dengan jabatan dan berlawanan dengan kewajiban/tugas wajib ditolak, atau jika dalam kondisi tertentu tidak dapat ditolak, wajib dilaporkan kepada KPK/UPG instansi selambat-lambatnya 30 hari kerja sejak tanggal penerimaan.",
  },
  {
    category: "Pelayanan Publik & Digitalisasi SPBE",
    questionText:
      "Asas pelayanan publik sebagaimana diatur dalam UU No. 25 Tahun 2009 menuntut terselenggaranya keterbukaan informasi dan akuntabilitas. Penerapan platform Sistem Informasi Pemerintahan Berbasis Elektronik (SPBE) dalam pelayanan publik bertujuan utama untuk:",
    options: [
      { key: "A" as AnswerKey, text: "Menghapuskan interaksi tatap muka bagi seluruh lapisan masyarakat tanpa alternatif layanan asistensi." },
      { key: "B" as AnswerKey, text: "Mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan terpadu secara nasional." },
      { key: "C" as AnswerKey, text: "Mengalihkan tanggung jawab operasional pelayanan publik sepenuhnya kepada vendor IT swasta." },
      { key: "D" as AnswerKey, text: "Mempermudah pembatasan kuota pengaduan masyarakat atas ketidakpuasan layanan birokrasi." },
      { key: "E" as AnswerKey, text: "Menambah pos biaya administrasi digital yang dibebankan kepada penerima manfaat layanan." },
    ],
    correctAnswer: "B" as AnswerKey,
    explanation:
      "Tujuan utama SPBE (Perpres No. 95/2018) adalah mewujudkan tata kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel serta pelayanan publik yang berkualitas dan terpercaya melalui integrasi sistem informasi nasional.",
  },
  {
    category: "Disiplin PNS (PP No. 94/2021)",
    questionText:
      "Berdasarkan Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil, pelanggaran disiplin dikategorikan menjadi ringan, sedang, dan berat. Seorang PNS yang tanpa alasan sah tidak masuk kerja selama 6 (enam) hari kerja secara kumulatif dalam satu bulan akan dikenakan hukuman disiplin tingkat:",
    options: [
      { key: "A" as AnswerKey, text: "Ringan berupa teguran lisan dari atasan langsung." },
      { key: "B" as AnswerKey, text: "Sedang berupa pemotongan tunjangan kinerja 25% selama 6 bulan." },
      { key: "C" as AnswerKey, text: "Berat berupa pemberhentian dengan hormat tidak atas permintaan sendiri." },
      { key: "D" as AnswerKey, text: "Sedang berupa penundaan kenaikan pangkat selama 1 tahun." },
      { key: "E" as AnswerKey, text: "Ringan berupa pernyataan tidak puas secara tertulis." },
    ],
    correctAnswer: "B" as AnswerKey,
    explanation:
      "Pasal 11 PP 94/2021 mengatur bahwa ketidakhadiran tanpa alasan sah 6-10 hari kerja kumulatif per bulan termasuk pelanggaran disiplin tingkat sedang dengan konsekuensi pemotongan tunjangan kinerja sebesar 25% selama 6 bulan.",
  },
  {
    category: "Keprotokolan & Etika Birokrasi",
    questionText:
      "Dalam acara resmi kenegaraan, tata tempat (precendence) pejabat negara harus mengikuti ketentuan UU No. 9 Tahun 2010 tentang Keprotokolan. Prinsip utama penyusunan tata tempat pejabat negara pada acara resmi adalah berdasarkan:",
    options: [
      { key: "A" as AnswerKey, text: "Senioritas usia biologis masing-masing pejabat yang hadir." },
      { key: "B" as AnswerKey, text: "Kedekatan personal pejabat dengan penyelenggara acara." },
      { key: "C" as AnswerKey, text: "Hierarki jabatan sesuai ketentuan perundang-undangan yang berlaku." },
      { key: "D" as AnswerKey, text: "Urutan konfirmasi kehadiran (first come, first seated)." },
      { key: "E" as AnswerKey, text: "Rekomendasi dari tim pengamanan kepresidenan (Paspampres)." },
    ],
    correctAnswer: "C" as AnswerKey,
    explanation:
      "UU No. 9 Tahun 2010 Pasal 5 menyatakan tata tempat pejabat negara dalam acara resmi disusun berdasarkan hierarki jabatan sesuai ketentuan peraturan perundang-undangan. Faktor senioritas usia atau kedekatan personal tidak relevan dalam penentuan tata tempat protokoler.",
  },
  {
    category: "Manajemen Keuangan Negara",
    questionText:
      "Dalam siklus pengelolaan Anggaran Pendapatan dan Belanja Negara (APBN), setiap Kuasa Pengguna Anggaran (KPA) bertanggung jawab atas pelaksanaan program. Apabila terdapat sisa anggaran belanja yang tidak terserap pada akhir tahun anggaran, mekanisme yang sesuai regulasi adalah:",
    options: [
      { key: "A" as AnswerKey, text: "Menyetorkan kembali sisa dana ke kas negara melalui mekanisme Sisa Lebih Pembiayaan Anggaran (SiLPA)." },
      { key: "B" as AnswerKey, text: "Memindahbukukan sisa anggaran ke rekening pribadi bendahara pengeluaran untuk disimpan sementara." },
      { key: "C" as AnswerKey, text: "Menggunakan sisa anggaran untuk belanja tambahan di luar Rencana Kerja dan Anggaran (RKA)." },
      { key: "D" as AnswerKey, text: "Mendistribusikan sisa anggaran secara merata kepada seluruh pegawai satuan kerja." },
      { key: "E" as AnswerKey, text: "Mengalihkan sisa anggaran langsung ke tahun anggaran berikutnya tanpa persetujuan DPR." },
    ],
    correctAnswer: "A" as AnswerKey,
    explanation:
      "Sesuai UU No. 17 Tahun 2003 tentang Keuangan Negara dan PMK terkait, sisa anggaran belanja yang tidak terserap pada akhir tahun anggaran wajib disetor kembali ke kas negara dan tercatat sebagai SiLPA yang pengelolaannya diatur dalam mekanisme pertanggungjawaban APBN.",
  },
  {
    category: "Wawasan Kebangsaan & Pancasila",
    questionText:
      "Pancasila sebagai dasar negara memiliki kedudukan sebagai sumber dari segala sumber hukum. Implementasi sila ke-4 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan' dalam konteks pengambilan keputusan di instansi pemerintah berarti:",
    options: [
      { key: "A" as AnswerKey, text: "Pimpinan instansi memiliki hak prerogatif mutlak dalam setiap pengambilan keputusan strategis." },
      { key: "B" as AnswerKey, text: "Keputusan diambil melalui voting mayoritas sederhana tanpa mempertimbangkan kepentingan minoritas." },
      { key: "C" as AnswerKey, text: "Mengutamakan musyawarah mufakat dengan mengedepankan kepentingan bersama secara bijaksana." },
      { key: "D" as AnswerKey, text: "Setiap kebijakan harus mendapat persetujuan seluruh pegawai tanpa kecuali sebelum diterapkan." },
      { key: "E" as AnswerKey, text: "Delegasi pengambilan keputusan kepada konsultan eksternal untuk menjaga objektivitas." },
    ],
    correctAnswer: "C" as AnswerKey,
    explanation:
      "Sila ke-4 Pancasila menekankan prinsip musyawarah mufakat dalam pengambilan keputusan. Dalam konteks birokrasi, ini berarti keputusan strategis sebaiknya diambil melalui mekanisme deliberasi yang mengedepankan kebijaksanaan dan kepentingan bersama, bukan otoritarianisme atau unanimitas mutlak.",
  },
  {
    category: "Bahasa Indonesia Kedinasan",
    questionText:
      "Dalam penyusunan naskah dinas resmi menurut Permenpan-RB tentang Tata Naskah Dinas, penggunaan bahasa Indonesia yang baik dan benar merupakan syarat mutlak. Penulisan surat dinas yang benar sesuai PUEBI (Pedoman Umum Ejaan Bahasa Indonesia) adalah:",
    options: [
      { key: "A" as AnswerKey, text: "Sehubungan dengan hal tersebut di atas, dengan ini kami mohon bantuan Bapak/Ibu." },
      { key: "B" as AnswerKey, text: "Bersama ini kami sampaikan bahwa berdasarkan hasil rapat koordinasi tanggal 15 Januari 2024 ..." },
      { key: "C" as AnswerKey, text: "Dengan hormat, Bersama surat ini dikirimkan dokumen2 yg di perlukan utk proses selanjutnya." },
      { key: "D" as AnswerKey, text: "Kpd Yth. Bpk/Ibu Pimpinan, mohon di berikan ijin cuti selama 3 (tiga) hr kerja." },
      { key: "E" as AnswerKey, text: "Menindak lanjuti pembicaraan kita kemarin, saya kirimkan data data yang di minta." },
    ],
    correctAnswer: "B" as AnswerKey,
    explanation:
      "Opsi B menggunakan ragam bahasa resmi yang sesuai PUEBI: huruf kapital tepat, ejaan lengkap tanpa singkatan tidak baku, preposisi 'berdasarkan' ditulis benar, dan struktur kalimat efektif. Opsi lain mengandung kesalahan ejaan ('di atas' seharusnya 'diatas' dalam konteks tertentu, singkatan 'yg', 'utk', spasi pada prefiks 'di-').",
  },
  {
    category: "Teknis Pemeliharaan Barang Sitaan",
    questionText:
      "Dalam pengelolaan barang sitaan berupa kendaraan bermotor, diperlukan prosedur pemeliharaan khusus agar kondisi fisik dan fungsi kendaraan tetap terjaga selama masa penyimpanan di Rumah Penyimpanan Benda Sitaan Negara (Rupbasan). Langkah standar yang tepat adalah:",
    options: [
      { key: "A" as AnswerKey, text: "Menggunakan kendaraan sitaan untuk keperluan operasional kantor sehari-hari." },
      { key: "B" as AnswerKey, text: "Memarkirkan kendaraan di area terbuka tanpa perlindungan khusus dari cuaca." },
      { key: "C" as AnswerKey, text: "Menempatkan di area beratap, memutus kutub aki, mencatat odometer, dan memanaskan mesin berkala." },
      { key: "D" as AnswerKey, text: "Menjual suku cadang kendaraan untuk menutupi biaya perawatan gudang." },
      { key: "E" as AnswerKey, text: "Menguras oli mesin dan membuang bahan bakar tanpa pencatatan berita acara teknis." },
    ],
    correctAnswer: "C" as AnswerKey,
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
