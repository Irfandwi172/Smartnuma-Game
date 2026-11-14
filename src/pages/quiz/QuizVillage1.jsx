import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BackButton from "../../components/BackButton";
import QuizProgress from "./QuizProgress";
import { LETTERS, getQuizView } from "./quizView";
import bg from "../../assets/kuis1fix.png";
import imageCorrect from "../../assets/SesuaiBadges.png";
import imageWrong from "../../assets/TidakSesuaiBadges.png";
import "./QuizVillage1.css";

/*
  VILLAGE 1 — drag & drop: seret pernyataan ke kotak SESUAI atau TIDAK SESUAI.

  Cara kerjanya dengan logika kuis yang sudah ada (App.jsx tidak diubah):
    - Isi kotak SESUAI  = selectedOptions (jawaban yang dipilih siswa).
      Memasukkan / mengeluarkan pernyataan memanggil onToggleOption.
    - Isi kotak TIDAK SESUAI = state lokal di komponen ini (hanya tampilan;
      penilaian tetap hanya melihat isi kotak SESUAI).
    - Tombol Jawab aktif kalau kotak SESUAI berisi pickCount pernyataan.

  Cara memakai:
    - Mouse: seret kartu pernyataan, atau seret lingkaran huruf di kartu.
    - Layar sentuh: seret lingkaran huruf (bagian lain kartu tetap bisa di-scroll).
    - Tanpa drag (HP / keyboard): ketuk kartu untuk "mengangkat", lalu ketuk kotak tujuan.
    - Mengembalikan: seret lingkaran huruf keluar dari kotak, atau ketuk lingkaran itu.

  Yang JANGAN diubah: pemanggilan getQuizView dan handler props
  (onToggleOption, onSubmit, onNext, onBack).
*/

const DRAG_THRESHOLD = 6; // px: gerakan lebih kecil dari ini dianggap ketukan

export default function QuizVillage1(props) {
  const { level, qIndex, starCount, selectedOptions, answered, onToggleOption, onSubmit, onNext, onBack } = props;
  const { q, total, isCorrect, optionState, canSubmit, isLastQuestion } = getQuizView({
    level,
    qIndex,
    selectedOptions,
    answered,
  });
  const pickCount = level.pickCount;

  // Isi kotak TIDAK SESUAI (otomatis kosong lagi saat pindah soal)
  const [wrongState, setWrongState] = useState({ q: qIndex, list: [] });
  const wrongIdx = wrongState.q === qIndex ? wrongState.list : [];

  const [held, setHeld] = useState(null); // pernyataan yang "diangkat" lewat ketukan
  const [drag, setDrag] = useState(null); // { idx, x, y, over } selama drag
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  const justDragged = useRef(false);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  useEffect(() => setHeld(null), [qIndex, answered]);

  function zoneOf(idx) {
    if (selectedOptions.includes(idx)) return "correct";
    if (wrongIdx.includes(idx)) return "wrong";
    return "pool";
  }

  function flash(text) {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2200);
  }

  function setWrong(idx, on) {
    setWrongState((prev) => {
      const base = prev.q === qIndex ? prev.list : [];
      const without = base.filter((v) => v !== idx);
      return { q: qIndex, list: on ? [...without, idx] : without };
    });
  }

  // Pindahkan pernyataan ke "correct" | "wrong" | "pool"
  function place(idx, target) {
    if (answered) return;
    const isSelected = selectedOptions.includes(idx);
    if (target === "correct") {
      if (isSelected) return;
      if (selectedOptions.length >= pickCount) {
        flash(`Kotak SESUAI hanya muat ${pickCount} pernyataan. Pindahkan salah satu dulu.`);
        return;
      }
      setWrong(idx, false);
      onToggleOption(idx); // masuk ke jawaban terpilih
    } else {
      if (isSelected) onToggleOption(idx); // keluar dari jawaban terpilih
      setWrong(idx, target === "wrong");
    }
  }

  // Selalu pakai versi terbaru di handler window (yang dibuat saat pointerdown)
  const latest = useRef(null);
  latest.current = { place };

  function startDrag(e, idx, from) {
    if (answered) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Sentuh: hanya lingkaran huruf yang bisa menyeret, supaya teks panjang tetap bisa di-scroll
    if (e.pointerType !== "mouse" && !e.target.closest("[data-handle]")) return;

    const startX = e.clientX;
    const startY = e.clientY;
    let dragging = false;
    const zoneAt = (x, y) => document.elementFromPoint(x, y)?.closest("[data-zone]")?.dataset.zone ?? null;

    const onMove = (ev) => {
      if (!dragging) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        dragging = true;
      }
      setDrag({ idx, x: ev.clientX, y: ev.clientY, over: zoneAt(ev.clientX, ev.clientY) });
    };

    const finish = (ev, cancelled) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      if (!dragging) return; // cuma ketukan: biarkan onClick yang menangani
      setDrag(null);
      justDragged.current = true; // cegah onClick ikut jalan setelah drag
      setTimeout(() => {
        justDragged.current = false;
      }, 0);
      if (cancelled) return;
      const target = zoneAt(ev.clientX, ev.clientY);
      if (target) latest.current.place(idx, target);
      else if (from !== "pool") latest.current.place(idx, "pool"); // lepas di luar kotak = kembali
      setHeld(null);
    };
    const onUp = (ev) => finish(ev, false);
    const onCancel = (ev) => finish(ev, true);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  }

  function onCardClick(idx) {
    if (justDragged.current || answered) return;
    setHeld((h) => (h === idx ? null : idx));
  }

  function onZoneClick(e, zone) {
    if (e.target.closest("[data-chip]")) return;
    if (held === null || answered) return;
    place(held, zone);
    setHeld(null);
  }

  function onChipClick(idx) {
    if (justDragged.current || answered) return;
    place(idx, "pool");
    setHeld(null);
  }

  const remaining = pickCount - selectedOptions.length;
  const hint =
    remaining > 0
      ? `Geser ${remaining} pernyataan yang sesuai ke kotak yang disediakan`
      : `Kotak SESUAI sudah berisi ${pickCount} pernyataan. Tekan Jawab!`;

  function renderZone(zone, label, badgeSrc) {
    const chips = q.options.map((_, idx) => idx).filter((idx) => zoneOf(idx) === zone);
    const classes = [
      "v1-zone",
      `v1-zone--${zone}`,
      drag?.over === zone ? "v1-zone--hover" : "",
      held !== null && !answered ? "v1-zone--target" : "",
    ].join(" ");
    return (
      <div className={classes} data-zone={zone} role="group" aria-label={`Kotak ${label}`} onClick={(e) => onZoneClick(e, zone)}>
        <img src={badgeSrc} alt={label} className={`v1-zone-badge v1-zone-badge--${zone}`} />
        <div className="v1-zone-chips">
          {chips.map((idx) => (
            <button
              key={idx}
              type="button"
              data-chip
              data-handle
              className={`v1-chip v1-chip--${optionState(idx)} ${drag?.idx === idx ? "v1-chip--dragging" : ""}`}
              aria-label={`Pernyataan ${LETTERS[idx]}, ketuk untuk mengembalikan`}
              onPointerDown={(e) => startDrag(e, idx, zone)}
              onClick={() => onChipClick(idx)}
              disabled={answered}
            >
              {LETTERS[idx]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="scene v1-scene">
      <div className="v1-board" style={{ backgroundImage: `url(${bg})` }}>
        <div className="v1-back">
          <BackButton onClick={onBack} />
        </div>

        <QuizProgress className="v1-progress" qIndex={qIndex} total={total} starCount={starCount} />

        {/* Petunjuk / peringatan / hasil jawaban */}
        <div className="v1-status">
          {notice && <div className="gh-body v1-notice">{notice}</div>}
          {!notice && !answered && <div className="gh-body v1-hint">{hint}</div>}
          {!notice && answered && (
            <div className={`gh-body v1-feedback ${isCorrect ? "v1-feedback--correct" : "v1-feedback--wrong"}`}>
              {isCorrect ? "Benar! ✓" : "Kurang tepat ✗"}
            </div>
          )}
        </div>

        {/* Kotak SOAL (kiri) */}
        <div className="v1-content">
          <h3 className="gh-title v1-question">{q.questionT}</h3>
          {q.image && <img src={q.image} alt="Ilustrasi soal" className="v1-question-image" />}
          <h3 className="gh-title v1-question">{q.question}</h3>
        </div>

        {/* Kartu PERNYATAAN (sumber drag) */}
        <div className="v1-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={[
                "gh-btn gh-body v1-option",
                `v1-option--${optionState(idx)}`,
                `v1-option--in-${zoneOf(idx)}`,
                held === idx ? "v1-option--held" : "",
                drag?.idx === idx ? "v1-option--dragging" : "",
              ].join(" ")}
              aria-pressed={held === idx}
              onPointerDown={(e) => startDrag(e, idx, "pool")}
              onClick={() => onCardClick(idx)}
              disabled={answered}
            >
              <span className="v1-option-letter" data-handle>
                {LETTERS[idx]}
              </span>
              <span className="v1-option-text">{opt}</span>
            </button>
          ))}
        </div>

        {/* Kotak SESUAI / TIDAK SESUAI (target drop) */}
        <div className="v1-zones">
          {renderZone("correct", "Sesuai", imageCorrect)}
          {renderZone("wrong", "Tidak sesuai", imageWrong)}
        </div>

        {/* Tombol Jawab / Lanjut */}
        <div className="v1-actions">
          {!answered ? (
            <button className="gh-btn gh-body btn-primary" onClick={onSubmit} disabled={!canSubmit}>
              Jawab
            </button>
          ) : (
            <button className="gh-btn gh-body btn-primary" onClick={onNext}>
              {isLastQuestion ? "Lihat Hasil" : "Lanjut"}
            </button>
          )}
        </div>
      </div>

      {/* Bayangan yang mengikuti pointer. Lewat portal karena .v1-board memakai
          container-type, yang membuat position: fixed relatif ke papan, bukan layar. */}
      {drag &&
        createPortal(
          <div className="v1-ghost" style={{ left: drag.x, top: drag.y }}>
            {LETTERS[drag.idx]}
          </div>,
          document.body
        )}
    </div>
  );
}