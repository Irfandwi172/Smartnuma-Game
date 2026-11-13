import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import QuizProgress from "./QuizProgress";
import UploadGate from "../UploadGate";
import { LETTERS, getQuizView } from "./quizView";
import bg from "../../assets/kuis2.png";
import "./QuizVillage2.css";

/*
  VILLAGE 2 — pilih 1 dari 5 opsi, opsi berupa angka pendek (tanpa gambar soal).

  Yang bebas kamu desain ulang di file ini + QuizVillage2.css:
    - background (import bg di atas) dan aspect-ratio papan di CSS
    - posisi kotak soal (.v2-content), kolom opsi (.v2-options), tombol (.v2-actions)
    - markup & gaya opsi jawaban (bagian "DESAIN OPSI" di bawah)
  Yang JANGAN diubah: pemanggilan getQuizView dan handler props
  (onToggleOption, onSubmit, onNext, onBack), supaya logika kuis tetap jalan.
*/
export default function QuizVillage2(props) {
  const { level, qIndex, starCount, selectedOptions, answered, onToggleOption, onSubmit, onNext, onBack } = props;
  const { q, total, isCorrect, hintText, optionState, canSubmit, isLastQuestion } = getQuizView({
    level,
    qIndex,
    selectedOptions,
    answered,
  });

  // Syarat upload: soal yang punya formUrl (di levelData.js) baru bisa dilanjutkan
  // setelah siswa membuka Google Form dan mencentang "Saya sudah upload".
  const [uploadedQ, setUploadedQ] = useState(-1); // nomor soal yang sudah dikonfirmasi
  const needsUpload = Boolean(q.formUrl);
  const uploadDone = !needsUpload || uploadedQ === qIndex;

  return (
    <div className="scene v2-scene">
      <div className="v2-board" style={{ backgroundImage: `url(${bg})` }}>
        <div className="v2-back">
          <BackButton onClick={onBack} />
        </div>

        <QuizProgress className="v2-progress" qIndex={qIndex} total={total} starCount={starCount} />

        {/* Kotak soal */}
        <div className="v2-content">
          <h3 className="gh-title v2-question">{q.question}</h3>
          {q.image && <img src={q.image} alt="Ilustrasi soal" className="v2-question-image" />}

          {!answered && <div className="gh-body v2-hint">{hintText}</div>}
          {answered && (
            <div className={`gh-body v2-feedback ${isCorrect ? "v2-feedback--correct" : "v2-feedback--wrong"}`}>
              {isCorrect ? "Benar! ✓" : "Kurang tepat ✗"}
            </div>
          )}
        </div>

        {/* ===== DESAIN OPSI (ubah markup & class sesukamu) ===== */}
        <div className="v2-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`gh-btn gh-body v2-option v2-option--${optionState(idx)}`}
              onClick={() => onToggleOption(idx)}
              disabled={answered}
            >
              <span className="v2-option-letter">{LETTERS[idx]}</span>
              <span className="v2-option-text">{opt}</span>
            </button>
          ))}
        </div>
        {/* ===== AKHIR DESAIN OPSI ===== */}

        {/* Tombol Jawab / Lanjut */}
        <div className="v2-actions">
          {!answered ? (
            <button className="gh-btn gh-body btn-primary" onClick={onSubmit} disabled={!canSubmit}>
              Jawab
            </button>
          ) : (
            <>
              {needsUpload && (
                <UploadGate
                  key={qIndex}
                  formUrl={q.formUrl}
                  confirmed={uploadDone}
                  onConfirmChange={(ok) => setUploadedQ(ok ? qIndex : -1)}
                />
              )}
              <button
                className="gh-btn gh-body btn-primary"
                onClick={onNext}
                disabled={!uploadDone}
                title={uploadDone ? "" : "Upload jawabanmu di Google Form dulu"}
              >
                {isLastQuestion ? "Lihat Hasil" : "Lanjut"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}