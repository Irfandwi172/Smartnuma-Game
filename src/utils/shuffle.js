// Fisher-Yates shuffle (tidak mengubah array aslinya)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleQuestions(questions) {
  return questions.map((q) => {
    const order = shuffleArray(q.options.map((_, i) => i)); // urutan index baru
    return {
      ...q,
      options: order.map((oldIdx) => q.options[oldIdx]),
      correct: q.correct.map((oldIdx) => order.indexOf(oldIdx)),
    };
  });
}