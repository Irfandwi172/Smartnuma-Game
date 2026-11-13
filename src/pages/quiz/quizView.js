// Logika tampilan kuis yang dipakai bersama oleh semua village.
// Fungsi biasa (bukan React hook), jadi aman dipanggil di komponen mana pun.

export const LETTERS = ["A", "B", "C", "D", "E"];

export function getQuizView({ level, qIndex, selectedOptions, answered }) {
  const q = level.questions[qIndex];
  const total = level.questions.length;
  const pickCount = level.pickCount;

  const isCorrect =
    answered &&
    [...selectedOptions].sort().join(",") === [...q.correct].sort().join(",");

  const sisaPilih = pickCount - selectedOptions.length;
  const hintText =
    pickCount === 1
      ? "Pilih 1 jawaban yang paling tepat."
      : `Pilih ${sisaPilih > 0 ? `${sisaPilih} lagi` : `${pickCount} jawaban`} dari opsi A–${LETTERS[q.options.length - 1]}.`;

  // Status tiap opsi: "idle" | "selected" | "correct" | "wrong"
  function optionState(idx) {
    const isSelected = selectedOptions.includes(idx);
    if (answered) {
      if (q.correct.includes(idx)) return "correct";
      if (isSelected) return "wrong";
      return "idle";
    }
    return isSelected ? "selected" : "idle";
  }

  return {
    q,
    total,
    isCorrect,
    hintText,
    optionState,
    canSubmit: selectedOptions.length === pickCount,
    isLastQuestion: qIndex + 1 >= total,
  };
}