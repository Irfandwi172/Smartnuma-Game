/*
  DATA LEVEL & MATERI
  --------------------
  Tiap level punya:
    - title, subtitle       : nama pulau/level
    - background/backgroundMateri : gambar background kuis & materi
    - pickCount              : berapa jawaban yang harus dipilih siswa
                                (2 untuk village 1, 1 untuk village 2 & 3)
    - materi.text            : bacaan materi (teks)
    - questions[]            : tiap soal:
        { question, image? (opsional), options: [...], correct: [index yang benar] }
      correct SELALU array, panjangnya harus sama dengan pickCount level itu.
      Contoh pickCount:1 -> correct: [2]. pickCount:2 -> correct: [0, 1].

    formUrl (opsional, per soal): link Google Form untuk upload jawaban perhitungan.
    Kalau ada, siswa harus membuka form & mencentang "sudah upload" dulu sebelum bisa lanjut
    (dipakai di village 2).

    Soal bertahap (village 3): kalau sebuah soal punya `parts` (bukan `options`),
    soal itu berisi beberapa pertanyaan sekaligus. Jenis part:
      { type: "choice", options: [...], correct: [index] }
      { type: "number", label, answer, tolerance? }  // diketik; tolerance = selisih relatif
*/

import bg1 from "../assets/bganalysis.png";
import bg2 from "../assets/bgpage2.png";
import bg3 from "../assets/bgpage3.png";
import bgmateri1 from "../assets/bgmateri.png";
import bgmateri2 from "../assets/bgmateri2.png";
import bgmateri3 from "../assets/bgmateri3.png";
import soal1 from "../assets/SoalVill1.png";
import soal2 from "../assets/SoalVill2.png";
import soal3 from "../assets/SoalVill3.png";
import soal4 from "../assets/Soal_vilage_3.png";
import audio1 from "../assets/audio1.mp3";
import audio2 from "../assets/audio2.mp3";
import audio3 from "../assets/audio3.mp3";


export const Background = [bg1, bg2, bg3, bgmateri1, bgmateri2, bgmateri3];

export const MAX_STARS = 3; // 1 bintang per soal (village 3: 1 bintang per pertanyaan bertahap)
export const PASS_THRESHOLD = 2; // minimal bintang untuk buka level berikutnya

export const audio = [
  audio1,
  audio2,
  audio3,
 
]

export const LEVEL_DATA = [
  {
    id: 1,
    background: Background[3],
    backgroundMateri: Background[0],
    pickCount: 2, // village 1: pilih 2 dari 4 opsi
    materi: {
      text: "Selamat datang di Analysis Village! Banyak warga di kota Smartnuma membutuhkan bantuan untuk memahami informasi tentang investasi dan peminjaman. Tugasmu adalah Analisis informasi pada setiap kasus. Pilih 2 jawaban yang benar berdasarkan informasi yang tersedia. Perhatikan hubungan antara modal, bunga, periode, pembayaran, dan tujuan keuangan sebelum menentukan jawaban.",
      audio: audio1,
    },
    questions: [
      { questionT: "Perhatikan tabel perkembangan investasi berikut.",
        question:
          "Berdasarkan tabel perkembangan investasi yang ditampilkan, pilih 2 pernyataan yang sesuai dengan informasi tersebut!",
        image: soal1,
        options: [
          "Bunga pada tahun kedua lebih besar daripada bunga pada tahun pertama karena bunga tahun kedua dihitung berdasarkan nilai investasi setelah memperoleh bunga pada tahun sebelumnya.",
          "Pertumbuhan nilai investasi menunjukkan pola yang semakin meningkat karena bunga setiap periode ditambahkan ke modal yang menjadi dasar perhitungan bunga pada periode berikutnya.",
          "Bunga pada setiap tahun tetap sebesar Rp800.000 karena suku bunga yang digunakan dalam investasi adalah 8% per tahun.",
          "Nilai investasi pada tahun ketiga lebih kecil daripada tahun kedua karena sebagian bunga digunakan kembali sebagai modal pada periode berikutnya.",
        ],
        correct: [0, 1],
      },
      { questionT : "Perhatikan gambar brosur berikut.",
        image: soal2,
        question: "Berdasarkan brosur tersebut, pilih 2 pernyataan yang sesuai!",
        options: [
          "Nilai akhir investasi dipengaruhi oleh besar setoran setiap periode, tingkat bunga, dan jumlah periode investasi.",
          "Karena jumlah setoran setiap tahun sama, bunga yang diperoleh pada setiap periode juga pasti sama.",
          "Produk tersebut termasuk anuitas terutang karena investor melakukan pembayaran secara berkala selama lima tahun.",
          "Produk tersebut termasuk anuitas biasa karena setoran investasi dilakukan pada akhir setiap periode.",
        ],
        correct: [0, 3],
      },
      { image: soal3,
        question: "Berdasarkan diagram tersebut, pilih 2 pernyataan yang sesuai!",
        options: [
          "Jumlah bunga tidak dipengaruhi oleh sisa pokok karena bunga ditentukan hanya berdasarkan jumlah pinjaman awal.",
          "Besarnya bunga semakin menurun karena bunga dihitung berdasarkan sisa pokok pinjaman yang semakin kecil setelah angsuran pokok dibayarkan.",
          "Angsuran pokok semakin kecil setiap bulan karena tabel menunjukkan bahwa sisa pinjaman juga semakin kecil.",
          "Hubungan antara sisa pokok dan bunga menunjukkan bahwa ketika sisa pokok berkurang, jumlah bunga pada periode berikutnya juga berkurang.",
        ],
        correct: [1, 3],
      },
    ],
  },
  {
    id: 2,
    background: Background[1],
    backgroundMateri: Background[4],
    pickCount: 1, // village 2: pilih 1 dari 5 opsi
    materi: {
      text: "Sekarang perjalananmu berlanjut ke village 2. Di sini kamu akan membantu menyelesaikan berbagai permasalahan keuangan. Namun, berhati-hatilah dalam setiap perhitunganmu!",
      audio: audio2,

    },
    questions: [
      {
        // FV = 5.000.000 x (1.10)^4 = Rp 7.320.500
        question:
          "Nadia menginvestasikan modal sebesar Rp5.000.000 pada suatu produk investasi dengan bunga majemuk 10% per tahun. Investasi dilakukan selama 4 tahun. Gunakan konsep bunga majemuk untuk menentukan nilai akhir investasi Nadia.",
        formUrl: "https://forms.gle/m9exEb6VarZAETwL7", // upload jawaban perhitungan (wajib sebelum lanjut)
        options: ["Rp 6.050.000", "Rp 6.500.000", "Rp 7.320.500", "Rp 7.500.000", "Rp 8.050.000"],
        correct: [2],
      },
      {
        // FV anuitas biasa = 10.000.000 x [((1.08)^5 - 1)/0.08] ≈ Rp 58.666.000
        question:
          "Alya menyisihkan Rp10.000.000 setiap akhir tahun ke dalam rekening investasi dengan bunga 8% per tahun. Ia melakukan setoran selama 5 tahun. Berapakah nilai masa depan investasi Alya?",
        formUrl: "https://forms.gle/JBAKkf5TSw4sgr6D9", // upload jawaban perhitungan (wajib sebelum lanjut)
        options: ["Rp50.000.000", "Rp52.000.000", "Rp55.600.000", "Rp58.750.000", "Rp60.800.000"],
        correct: [3],
      },
      {
        question:
          "Budi membeli sebuah laptop seharga Rp20.000.000 melalui sistem kredit. Pinjaman dikenakan bunga 12% per tahun dan akan dilunasi dalam 24 kali pembayaran bulanan. Berapakah besar pembayaran anuitas Budi setiap bulan?",
        formUrl: "https://forms.gle/7Ngvcj9XJLv3ZUy59", // upload jawaban perhitungan (wajib sebelum lanjut)
        options: ["Rp800.000", "Rp850.000", "Rp900.000", "Rp983.469", "Rp960.000"],
        correct: [4],
      },
    ],
  },
  {
    id: 3,
    background: Background[2],
    backgroundMateri: Background[5],
    pickCount: 1, // tidak dipakai di village 3 (soalnya bertahap, lihat parts di bawah)
    materi: {
      text: "Luar biasa! Kamu telah berhasil melewati village 1 dan village 2. Sekarang kamu tiba di village 3, tempat para Financial Consultant membantu warga Smartnuma mengambil keputusan keuangan. Kali ini tantangannya lebih besar. Kamu akan menghadapi kasus nyata tentang pinjaman dan investasi. Gunakan informasi yang tersedia dan hasil perhitunganmu untuk membandingkan beberapa pilihan.",
      audio: audio3,

    },
    // VILLAGE 3: SATU soal berisi 3 pertanyaan bertahap (parts).
    // Tiap pertanyaan yang dijawab benar = 1 bintang (maks 3).
    questions: [
      {
        image: soal4,
        question:
          "Rani memiliki dana Rp20.000.000 yang ingin diinvestasikan selama 3 tahun. Tersedia dua pilihan yang ada pada gambar berikut.",
        parts: [
          {
            type: "choice", // pilih 1 dari 4 pernyataan
            options: [
              "Rani sebaiknya memilih Investasi A karena bunga 8% lebih tinggi daripada 6%. WalaupunInvestasi B memberikan setoran secara berkala, perbedaan tingkat bunga merupakan satu satunya faktor yang perlu diperhatikan sehingga Investasi A pasti menghasilkan nilai akhir yang lebih besar.",
              "Rani sebaiknya memilih Investasi B karena setoran dilakukan secara berkala sehingga jumlah dana yang disetorkan selama tiga tahun lebih besar daripada modal awal Investasi A. Oleh karena itu, meskipun tingkat bunganya lebih rendah, jumlah setoran yang lebih besar secara otomatis menjadikan Investasi B pilihan terbaik.",
              "Rani sebaiknya membandingkan nilai akhir kedua investasi setelah memperhitungkan bunga dan periode. Investasi A menghasilkan nilai akhir sekitar Rp25.200.000, sedangkan Investasi B menghasilkan nilai akhir sekitar Rp23.310.000. Oleh karena itu, jika tujuan Rani adalah memperoleh dana terbesar pada akhir tahun ketiga, Investasi A lebih tepat karena hasil akhirnya lebih besar.",
              "Rani sebaiknya memilih Investasi B karena anuitas selalu lebih menguntungkan daripada bunga majemuk. Walaupun tingkat bunga dan nilai akhir investasi harus tetap diperhitungkan, sistem setoran berkala membuat Investasi B lebih aman sehingga otomatis menjadi pilihan terbaik.",
            ],
            correct: [2],
          },
          {
            type: "number", // jawaban diketik
            label: "Nilai akhir investasi A",
            answer: 25200000,
            tolerance: 0.001, // selisih yang masih dianggap benar (0,1%)
          },
          {
            type: "number",
            label: "Nilai akhir investasi B",
            answer: 23310000,
            tolerance: 0.001,
          },
        ],
      },
    ],
  },
];

// Ganti URL ini sesuai kebutuhan link Genially kamu
export const GENIALLY_URL = "https://view.genially.com/6a881c18fa2dd78b41d19fa5";
export const GENIALLY_MAP_URL = "https://view.genially.com/6a881c18fa2dd78b41d19fa5";
export const GENIALLY_HOME = "https://view.genially.com/6a73f94f54076ea3a8962983";