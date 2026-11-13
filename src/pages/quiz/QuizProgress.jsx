import React from "react";
import { MAX_STARS } from "../../data/levelData";
import "./QuizProgress.css";

// Pil progres "Soal 1/3 ⭐⭐⭐" yang dipakai semua village.
// Posisinya diatur dari CSS village lewat prop className.
export default function QuizProgress({ qIndex, total, starCount, className = "" }) {
  return (
    <div className={`quiz-progress-pill gh-body ${className}`}>
      <span>
        Soal {qIndex + 1}/{total}
      </span>
      <span className="quiz-progress-stars">
        {Array.from({ length: MAX_STARS }, (_, s) => (
          <span key={s} style={{ opacity: s < starCount ? 1 : 0.35 }}>
            ⭐
          </span>
        ))}
      </span>
    </div>
  );
}