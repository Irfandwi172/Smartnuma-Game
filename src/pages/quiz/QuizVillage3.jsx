import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import QuizProgress from "./QuizProgress";
import { LETTERS } from "./quizView";
import bg from "../../assets/kuis3.png";
import "./QuizVillage3.css";

/*
  VILLAGE 3 — SATU soal berisi 3 pertanyaan bertahap (lihat `parts` di levelData.js):
    1. Pilihan ganda: pilih 1 dari 4 pernyataan, lalu tekan "Jawab".
    2. Jawaban ketik: nilai akhir investasi A, lalu tekan "Kirim".
    3. Jawaban ketik: nilai akhir investasi B, lalu tekan "Kirim".
  Tiap pertanyaan yang benar = 1 bintang. Setelah ketiganya dijawab (urutan bebas),
  muncul tombol "Lihat Hasil" yang mengirim jumlah bintang ke App lewat onFinish.

  Layout mengharapkan 1 part "choice" + 2 part "number" (sesuai desain).
  Semua state pertanyaan ada di komponen ini; yang dipakai dari App.jsx hanya
  onBack, onFinish, dan onSfx (suara benar/salah).
*/

const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);

// Mengubah ketikan siswa jadi angka. Mengerti "25.194.240", "Rp 25.194.240",
// "25194240", "25.194.240,50", dan "25,194,240". Hasil NaN kalau bukan angka.
function parseRupiah(text) {
  let s = text.toLowerCase().replace(/rp\.?/g, "").replace(/\s/g, "");
  if (!s) return NaN;
  if (s.split(",").length > 2) s = s.replace(/,/g, ""); // koma sebagai pemisah ribuan
  s = s.replace(/\./g, "").replace(",", "."); // titik = ribuan, koma = desimal
  if (!/^\d+(\.\d+)?$/.test(s)) return NaN;
  return Number(s);
}

export default function QuizVillage3({ level, qIndex, onBack, onFinish, onSfx }) {
  const q = level.questions[qIndex];
  const parts = q.parts;
  const choiceIdx = parts.findIndex((p) => p.type === "choice");
  const choicePart = parts[choiceIdx];
  const numberIdxs = parts.map((_, i) => i).filter((i) => parts[i].type === "number");

  const [choice, setChoice] = useState(null); // index pernyataan yang dipilih
  const [typed, setTyped] = useState({}); // { [partIdx]: teks ketikan }
  const [invalid, setInvalid] = useState({}); // { [partIdx]: true } kalau format salah
  const [results, setResults] = useState({}); // { [partIdx]: { correct } } setelah dijawab

  const stars = Object.values(results).filter((r) => r.correct).length;
  const doneCount = Object.keys(results).length;
  const allDone = doneCount === parts.length;

  function record(partIdx, correct) {
    setResults((r) => ({ ...r, [partIdx]: { correct } }));
    onSfx?.(correct);
  }

  function submitChoice() {
    if (choice === null || results[choiceIdx]) return;
    record(choiceIdx, choicePart.correct.includes(choice));
  }

  function submitNumber(e, partIdx) {
    e.preventDefault();
    if (results[partIdx]) return;
    const value = parseRupiah(typed[partIdx] ?? "");
    if (Number.isNaN(value)) {
      setInvalid((v) => ({ ...v, [partIdx]: true }));
      return;
    }
    const part = parts[partIdx];
    const tolerance = part.tolerance ?? 0.001;
    record(partIdx, Math.abs(value - part.answer) <= Math.abs(part.answer) * tolerance);
  }

  function choiceState(idx) {
    if (results[choiceIdx]) {
      if (choicePart.correct.includes(idx)) return "correct";
      return idx === choice ? "wrong" : "idle";
    }
    return idx === choice ? "selected" : "idle";
  }

  const choiceResult = results[choiceIdx];

  return (
    <div className="scene v3-scene">
      <div className="v3-board" style={{ backgroundImage: `url(${bg})` }}>
        <div className="v3-back">
          <BackButton onClick={onBack} />
        </div>

        <QuizProgress
          className="v3-progress"
          qIndex={Math.min(doneCount, parts.length - 1)}
          total={parts.length}
          starCount={stars}
        />

        {/* Kotak soal + gambar poster */}
        <div className="v3-content">
          <p className="gh-body v3-question">{q.question}</p>
          {q.image && <img src={q.image} alt="Poster pilihan investasi" className="v3-question-image" />}
        </div>

        {/* Pertanyaan 1: 4 pernyataan (grid 2 x 2) */}
        <div className="v3-options">
          {choicePart.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={`gh-btn gh-body v3-option v3-option--${choiceState(idx)}`}
              title={opt}
              onClick={() => setChoice(idx)}
              disabled={!!choiceResult}
            >
              <span className="v3-option-letter">{LETTERS[idx]}</span>
              <span className="v3-option-text">{opt}</span>
            </button>
          ))}
        </div>

        {/* Tombol Jawab; setelah dijawab diganti hasilnya */}
        <div className="v3-choice-action">
          {!choiceResult ? (
            <button
              type="button"
              className="gh-btn gh-body btn-primary v3-btn"
              onClick={submitChoice}
              disabled={choice === null}
            >
              Jawab
            </button>
          ) : (
            <div className={`gh-body v3-feedback ${choiceResult.correct ? "v3-feedback--correct" : "v3-feedback--wrong"}`}>
              {choiceResult.correct ? "Benar! ✓" : "Kurang tepat ✗"}
            </div>
          )}
        </div>

        {/* Pertanyaan 2 & 3: jawaban diketik */}
        {numberIdxs.map((partIdx, slot) => {
          const part = parts[partIdx];
          const result = results[partIdx];
          const value = typed[partIdx] ?? "";
          return (
            <form
              key={partIdx}
              className={`v3-num v3-num--${slot}`}
              onSubmit={(e) => submitNumber(e, partIdx)}
              noValidate
            >
              <label
                className={`gh-body v3-num-label ${invalid[partIdx] ? "v3-num-label--invalid" : ""}`}
                htmlFor={`v3-answer-${partIdx}`}
              >
                {invalid[partIdx] ? "Tulis angka saja ya!" : part.label}
              </label>

              <input
                id={`v3-answer-${partIdx}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className={[
                  "gh-body v3-input",
                  result ? (result.correct ? "v3-input--correct" : "v3-input--wrong") : "",
                  invalid[partIdx] ? "v3-input--invalid" : "",
                ].join(" ")}
                placeholder="Ketik jawaban disini"
                value={value}
                disabled={!!result}
                onChange={(e) => {
                  setTyped((t) => ({ ...t, [partIdx]: e.target.value }));
                  if (invalid[partIdx]) setInvalid((v) => ({ ...v, [partIdx]: false }));
                }}
              />

              {!result ? (
                <button
                  type="submit"
                  className="gh-btn gh-body btn-primary v3-btn v3-num-send"
                  disabled={!value.trim()}
                >
                  Kirim
                </button>
              ) : (
                <div
                  className={`gh-body v3-feedback v3-num-feedback ${
                    result.correct ? "v3-feedback--correct" : "v3-feedback--wrong"
                  }`}
                >
                  {result.correct ? (
                    "Benar! ✓"
                  ) : (
                    <>
                      Kurang tepat ✗
                      <small>Jawaban: {rupiah(part.answer)}</small>
                    </>
                  )}
                </div>
              )}
            </form>
          );
        })}

        {/* Muncul setelah ketiga pertanyaan dijawab */}
        {allDone && (
          <div className="v3-finish">
            <button type="button" className="gh-btn gh-body btn-primary v3-btn" onClick={() => onFinish(stars)}>
              Lihat Hasil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}