import React, { useState } from "react";
import { LEVEL_DATA, MAX_STARS, PASS_THRESHOLD } from "../data/levelData";
import { getTrophy } from "../data/Trophies";
import "./ResultPage.css";
import bgResult from "../assets/bgmateri.png";
import ulangi from "../assets/retrybutton.png";
import next from "../assets/nextbutton.png";

export default function ResultPage({
  starCount,
  totalStars,
  passed,
  isLast,
  activeLevel,
  onRetry,
  onNextLevel,
  onBackToMap,
  onLeaderboard,
}) {
  const gameFullyCompleted = passed && isLast;

  // Piala & gelar sesuai total bintang dari semua village (hanya dipakai saat game tamat)
  const maxTotalStars = LEVEL_DATA.length * MAX_STARS;
  const trophy = getTrophy(totalStars);
  // Kalau gambar piala gagal dimuat (mis. link Drive belum dibagikan), tampilkan 🏆
  const [failedStars, setFailedStars] = useState(null);
  const imageFailed = failedStars === trophy.stars;

  return (
    <div
      className="scene"
      style={{
        backgroundImage: `url(${bgResult})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="center-card-wrap">
        <div className="parchment-card">
          <div className="result-stars">
            {Array.from({ length: MAX_STARS }, (_, s) => (
              <span key={s} style={{ fontSize: 40, opacity: s < starCount ? 1 : 0.25 }}>
                ⭐
              </span>
            ))}
          </div>
          <h2 className="gh-title card-title">
            {passed ? (isLast ? "Harta Ditemukan!" : "Level Selesai!") : "Coba Lagi Yuk"}
          </h2>
          <div className="gh-body card-subtitle">
            {starCount} / {MAX_STARS} bintang
          </div>
          <p className="gh-body card-text">
            {passed
              ? "Kerja bagus! Kamu berhasil mengumpulkan cukup bintang."
              : `Kumpulkan minimal ${PASS_THRESHOLD} dari ${MAX_STARS} bintang untuk membuka level berikutnya.`}
          </p>

          {gameFullyCompleted ? (
            // Game tamat: tampilkan piala + gelar sesuai total bintang
            <div className="result-trophy">
              {imageFailed ? (
                <div className="result-trophy-fallback" aria-hidden="true">
                  🏆
                </div>
              ) : (
                <img
                  key={trophy.stars}
                  className="result-trophy-img"
                  src={trophy.image}
                  alt={`Piala ${trophy.title}`}
                  onError={() => setFailedStars(trophy.stars)}
                />
              )}
              <div className="gh-title result-trophy-title">{trophy.title}</div>
              <div className="gh-body result-trophy-total">
                ⭐ {totalStars} / {maxTotalStars} bintang
              </div>
              <button className="gh-btn gh-body btn-secondary result-trophy-btn" onClick={onLeaderboard}>
                <span>🏆 LEADERBOARD</span>
              </button>
            </div>
          ) : (
            <div className="action-row">
              <button className="action-btn" onClick={onRetry}>
                <img src={ulangi} alt="" />
              </button>

              {/* Percobaan: level 1 selesai -> redirect keluar ke peta Genially */}
              {passed && activeLevel === 0 && (
                <button className="action-btn" onClick={onNextLevel}>
                  <img src={next} alt="" />
                </button>
              )}

              {passed && !isLast && activeLevel !== 0 && (
                <button className="action-btn" onClick={onNextLevel}>
                  <img src={next} alt="" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}