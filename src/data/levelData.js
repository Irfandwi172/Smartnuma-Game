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
*/

import bg1 from "../assets/bganalysis.png";
import bg2 from "../assets/bgpage2.png";
import bg3 from "../assets/bgpage3.png";
import bgmateri1 from "../assets/bgmateri.png";
import bgmateri2 from "../assets/bgmateri2.png";
import bgmateri3 from "../assets/bgmateri3.png";
import soal1 from "../assets/gambar1fix.png";
import soal2 from "../assets/gambar 2.png";
import soal3 from "../assets/gambar3.png";
import soal4 from "../assets/gambarVil3.png";
import soal5 from "../assets/soalterakhir.png";
import audio1 from "../assets/audio1.mp3";
import audio2 from "../assets/audio2.mp3";
import audio3 from "../assets/audio3.mp3";


export const Background = [bg1, bg2, bg3, bgmateri1, bgmateri2, bgmateri3];

export const MAX_STARS = 3; // 1 bintang per soal (3 soal per level)
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
    pickCount: 2, // village 1: pilih 2 dari 5 opsi
    materi: {
      text: "Selamat datang di Analysis Village! Banyak warga di kota Smartnuma membutuhkan bantuan untuk memahami informasi tentang investasi dan peminjaman. Tugasmu adalah Analisis informasi pada setiap kasus. Pilih 2 jawaban yang benar berdasarkan informasi yang tersedia. Perhatikan hubungan antara modal, bunga, periode, pembayaran, dan tujuan keuangan sebelum menentukan jawaban.",
      audio: audio1,
    },
    questions: [
      {
        question:
          "Berdasarkan tabel perkembangan investasi yang ditampilkan, pilih 2 pernyataan yang paling tepat berdasarkan hasil analisismu!",
        image: soal1,
        options: [
          "Bunga pada tahun kedua lebih besar daripada bunga pada tahun pertama karena bunga tahun kedua dihitung berdasarkan nilai investasi setelah memperoleh bunga pada tahun sebelumnya.",
          "Pertumbuhan nilai investasi menunjukkan pola yang semakin meningkat karena bunga setiap periode ditambahkan ke modal yang menjadi dasar perhitungan bunga pada periode berikutnya.",
          "Bunga pada setiap tahun tetap sebesar Rp800.000 karena suku bunga yang digunakan dalam investasi adalah 8% per tahun.",
          "Nilai investasi pada tahun ketiga lebih kecil daripada tahun kedua karena sebagian bunga digunakan kembali sebagai modal pada periode berikutnya.",
          "Untuk mengetahui perkembangan investasi dari tahun ke tahun, informasi mengenai suku bunga saja sudah cukup tanpa memerlukan informasi modal dan periode investasi.",
        ],
        correct: [0, 1],
      },
      { image: soal2,
        question: "Berdasarkan brosur tersebut, pilih 2 pernyataan yang paling tepat!",
        options: [
          "Untuk menentukan nilai akhir investasi, informasi mengenai waktu pembayaran tidak diperlukan selama besar setoran dan suku bunga telah diketahui.",
          "Nilai akhir investasi dipengaruhi oleh besar setoran setiap periode, tingkat bunga, dan jumlah periode investasi.",
          "Karena jumlah setoran setiap tahun sama, bunga yang diperoleh pada setiap periode juga pasti sama.",
          "Produk tersebut termasuk anuitas terutang karena investor melakukan pembayaran secara berkala selama lima tahun.",
          "Produk tersebut termasuk anuitas biasa karena setoran investasi dilakukan pada akhir setiap periode.",
        ],
        correct: [1, 4],
      },
      { image: soal3,
        question: "Berdasarkan diagram tersebut, pilih 2 pernyataan yang paling tepat!",
        options: [
          "Bunga pada setiap bulan tetap sebesar Rp150.000 karena tingkat bunga pinjaman tidak berubah selama masa pinjaman.",
          "Jumlah bunga tidak dipengaruhi oleh sisa pokok karena bunga ditentukan hanya berdasarkan jumlah pinjaman awal.",
          "Besarnya bunga semakin menurun karena bunga dihitung berdasarkan sisa pokok pinjaman yang semakin kecil setelah angsuran pokok dibayarkan.",
          "Angsuran pokok semakin kecil setiap bulan karena tabel menunjukkan bahwa sisa pinjaman juga semakin kecil.",
          "Hubungan antara sisa pokok dan bunga menunjukkan bahwa ketika sisa pokok berkurang, jumlah bunga pada periode berikutnya juga berkurang.",
        ],
        correct: [2, 4],
      },
    ],
  },
  {
    id: 2,
    background: Background[1],
    backgroundMateri: Background[4],
    pickCount: 1, // village 2: pilih 1 dari 4 opsi
    materi: {
      text: "Sekarang perjalananmu berlanjut ke village 2. Di sini kamu akan membantu menyelesaikan berbagai permasalahan keuangan. Namun, berhati-hatilah dalam setiap perhitunganmu!",
      audio: audio2,

    },
    questions: [
      {
        // FV = 5.000.000 x (1.10)^4 = Rp 7.320.500
        question:
          "Nadia menginvestasikan modal sebesar Rp5.000.000 pada suatu produk investasi dengan bunga majemuk 10% per tahun. Investasi dilakukan selama 4 tahun. Gunakan konsep bunga majemuk untuk menentukan nilai akhir investasi Nadia.",
        options: ["Rp 6.050.000", "Rp 6.500.000", "Rp 7.320.500", "Rp 7.500.000", "Rp 8.050.000 "],
        correct: [2],
      },
      {
        // FV anuitas biasa = 10.000.000 x [((1.08)^5 - 1)/0.08] ≈ Rp 58.666.000
        question:
          "Alya menyisihkan Rp10.000.000 setiap akhir tahun ke dalam rekening investasi dengan bunga 8% per tahun. Ia melakukan setoran selama 5 tahun. Berapakah nilai masa depan investasi Alya?",
        options: ["Rp50.000.000", "Rp52.000.000", "Rp55.600.000", "Rp58.750.000", "Rp60.800.000 "],
        correct: [3],
      },
      {
        question:
          "Budi membeli sebuah laptop seharga Rp20.000.000 melalui sistem kredit. Pinjaman dikenakan bunga 12% per tahun dan akan dilunasi dalam 24 kali pembayaran bulanan. Berapakah besar pembayaran anuitas Budi setiap bulan?",
        options: ["Rp800.000", "Rp850.000", "Rp900.000", "Rp983.469", "Rp960.000"],
        correct: [4],
      },
    ],
  },
  {
    id: 3,
    background: Background[2],
    backgroundMateri: Background[5],
    pickCount: 1, // village 3: pilih 1 dari 4 opsi
    materi: {
      text: "Luar biasa! Kamu telah berhasil melewati village 1 dan village 2. Sekarang kamu tiba di village 3, tempat para Financial Consultant membantu warga Smartnuma mengambil keputusan keuangan. Kali ini tantangannya lebih besar. Kamu akan menghadapi kasus nyata tentang pinjaman dan investasi. Gunakan informasi yang tersedia dan hasil perhitunganmu untuk membandingkan beberapa pilihan.",
      audio: audio3,

    },
    questions: [
      { image: soal4,
        question:
          "Rani memiliki dana Rp20.000.000 yang ingin diinvestasikan selama 3 tahun. Tersedia dua pilihan yang ada pada gambar berikut.",
        options: [
          "Rani sebaiknya memilih Investasi A karena bunga 8% lebih tinggi daripada 6%. Walaupun Investasi B memberikan setoran secara berkala, perbedaan tingkat bunga merupakan satu-satunya faktor yang perlu diperhatikan sehingga Investasi A pasti menghasilkan nilai akhir yang lebih besar.",
          "Rani sebaiknya memilih Investasi B karena setoran dilakukan secara berkala sehingga jumlah dana yang disetorkan selama tiga tahun lebih besar daripada modal awal Investasi A. Oleh karena itu, meskipun tingkat bunganya lebih rendah, jumlah setoran yang lebih besar secara otomatis menjadikan Investasi B pilihan terbaik.",
          "Rani sebaiknya membandingkan nilai akhir kedua investasi setelah memperhitungkan bunga dan periode. Investasi A menghasilkan nilai akhir sekitar Rp25.194.240, sedangkan Investasi B menghasilkan nilai akhir sekitar Rp22.292.000. Oleh karena itu, jika tujuan Rani adalah memperoleh dana terbesar pada akhir tahun ketiga, Investasi A lebih tepat karena hasil akhirnya lebih besar.",
          "Rani sebaiknya memilih Investasi B karena anuitas selalu lebih menguntungkan daripada bunga majemuk. Walaupun tingkat bunga dan nilai akhir investasi harus tetap diperhitungkan, sistem setoran berkala membuat Investasi B lebih aman sehingga otomatis menjadi pilihan terbaik.",
        ],
        correct: [2],
      },
      {  image: soal5,
        question:
          "Andi membutuhkan pinjaman sebesar Rp20.000.000 untuk mengembangkan usahanya. Ia memiliki dua pilihan pinjaman. Andi ingin memilih sistem yang memberikan pola pembayaran yang paling sesuai dengan kondisi keuangannya.",
        options: [
          "Andi sebaiknya memilih Pinjaman A karena angsuran pokoknya tetap. Sistem tersebut membuat bunga juga tetap setiap bulan sehingga jumlah pembayaran akan sama dari awal sampai akhir periode. Dengan demikian, Andi tidak perlu memperhatikan perubahan sisa pokok pinjaman.",
          "Andi sebaiknya memilih Pinjaman B karena pada sistem anuitas jumlah pembayaran total setiap periode dibuat sama. Hal ini dapat memudahkan Andi dalam merencanakan pengeluaran usaha karena jumlah pembayaran berkala lebih mudah diprediksi, meskipun komponen bunga dan pokok di dalam pembayaran dapat berubah.",
          "Andi sebaiknya memilih Pinjaman A karena bunga pada setiap periode selalu dihitung berdasarkan Rp20.000.000. Meskipun sebagian pokok telah dibayar, dasar perhitungan bunga tetap sama karena tingkat bunga yang digunakan adalah 6% per tahun.",
          "Andi sebaiknya memilih Pinjaman A karena bunga menurun berarti total pembayaran pasti lebih besar daripada sistem anuitas. Semakin kecil bunga pada setiap bulan, semakin besar pula jumlah pembayaran yang harus dikeluarkan Andi sehingga sistem angsuran pokok tetap tidak cocok untuk usaha.",
        ],
        correct: [1],
      },
      {
        question:
          "Pak Arif memiliki Rp30.000.000 dan ingin membuka usaha. Ia membutuhkan modal tambahan sebesar Rp20.000.000 sehingga harus mengambil pinjaman. Ia memiliki dua alternatif strategi. Strategi A: meminjam Rp20.000.000 dengan sistem anuitas, bunga 12% per tahun, 24 kali pembayaran bulanan. Strategi B: meminjam Rp20.000.000 dengan sistem angsuran pokok tetap (bunga menurun) 12% per tahun selama 24 bulan, sementara dana Rp30.000.000 ditempatkan pada investasi bunga majemuk 8% per tahun selama 2 tahun. Pak Arif ingin memilih strategi yang tidak hanya mempertimbangkan jumlah pembayaran pinjaman, tetapi juga potensi pertumbuhan dana yang dimilikinya.",
        options: [
          "Strategi A merupakan pilihan terbaik karena sistem anuitas memiliki pembayaran yang sama pada setiap periode. Dengan pembayaran yang tetap, Pak Arif tidak perlu menghitung lagi kondisi keuangannya. Tingkat bunga dan hasil investasi tidak perlu diperhatikan karena tujuan utama dari strategi keuangan adalah memiliki jumlah cicilan yang sama setiap bulan.",
          "Strategi B pasti paling menguntungkan karena bunga majemuk pada investasi selalu menghasilkan keuntungan yang lebih besar daripada bunga yang harus dibayar pada pinjaman. Oleh karena itu, Pak Arif cukup membandingkan persentase 8% dan 12% tanpa perlu menghitung nilai akhir investasi maupun total pembayaran pinjaman.",
          "Strategi B dapat dipertimbangkan karena Pak Arif memperoleh kesempatan mengembangkan sebagian dananya melalui investasi bunga majemuk, tetapi keputusan tidak dapat ditentukan hanya dari perbandingan suku bunga. Pak Arif perlu menghitung nilai akhir investasi, keuntungan yang diperoleh, serta total beban pinjaman, kemudian membandingkannya dengan Strategi A. Strategi yang memberikan keseimbangan paling baik antara pertumbuhan dana dan kemampuan membayar pinjaman menjadi pilihan yang lebih tepat.",
          "Strategi A lebih baik karena bunga anuitas selalu lebih kecil daripada bunga majemuk. Oleh karena itu, Pak Arif tidak perlu mempertimbangkan jenis investasi yang digunakan. Selama cicilan dibayar secara rutin, strategi A pasti menghasilkan keuntungan lebih besar daripada strategi B.",
        ],
        correct: [2],
      },
    ],
  },
];

// Ganti URL ini sesuai kebutuhan link Genially kamu
export const GENIALLY_URL = "https://view.genially.com/6a881c18fa2dd78b41d19fa5";
export const GENIALLY_MAP_URL = "https://view.genially.com/6a881c18fa2dd78b41d19fa5";
export const GENIALLY_HOME = "https://view.genially.com/6a73f94f54076ea3a8962983";