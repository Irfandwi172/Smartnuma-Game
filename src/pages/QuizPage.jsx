import React from "react";
import QuizVillage1 from "./quiz/QuizVillage1";
import QuizVillage2 from "./quiz/QuizVillage2";
import QuizVillage3 from "./quiz/QuizVillage3";

// Pemetaan id level -> komponen tampilan kuisnya.
// Mau tambah village baru? Buat QuizVillage4.jsx lalu daftarkan di sini.
const VILLAGE_QUIZ = {
  1: QuizVillage1,
  2: QuizVillage2,
  3: QuizVillage3,
};

// Halaman ini hanya "pemilih". Semua props dari App.jsx diteruskan apa adanya,
// jadi App.jsx tidak perlu diubah.
export default function QuizPage(props) {
  const Village = VILLAGE_QUIZ[props.level.id];
  if (!Village) {
    console.warn(`Belum ada tampilan kuis untuk level id=${props.level.id}`);
    return null;
  }
  return <Village {...props} />;
}