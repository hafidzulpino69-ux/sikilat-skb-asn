// src/types/admin.types.ts

export interface QuestionRecord {
  id: string;
  package_id: string;
  question_number: number;
  category: string;
  soal: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  kunci_jawaban: "A" | "B" | "C" | "D" | "E";
  pembahasan: string;
  created_at?: string;
}

export interface CSVQuestionRow {
  soal?: string;
  opsi_a?: string;
  opsi_b?: string;
  opsi_c?: string;
  opsi_d?: string;
  opsi_e?: string;
  kunci_jawaban?: string;
  pembahasan?: string;
  kategori?: string;
  nomor?: string | number;
  [key: string]: unknown;
}

export interface CSVParseValidation {
  totalRows: number;
  validRows: Omit<QuestionRecord, "id">[];
  invalidRows: { rowNumber: number; reason: string }[];
}
