import React from "react";
import BackButton from "../components/BackButton";
import { LEVEL_DATA, MAX_STARS } from "../data/levelData";
import "./MapPage.css";
import bgMap from "../assets/bg_map.png";
import villageBadge1 from "../assets/Village1.png";
import villageBadge2 from "../assets/Village2.png";
import villageBadge3 from "../assets/Village3.png";


// Pemetaan id level -> gambar badge-nya. Ganti path import di atas
// sesuai nama file icon kamu kalau berbeda.
const BADGES = {
  1: villageBadge1,
  2: villageBadge2,
  3: villageBadge3,
};

export default function MapPage({ playerName, progress, isUnlocked, onOpenLevel, onHome, onLeaderboard }) {
  const totalStars = progress.reduce((a, b) => a + b, 0);

  return (
    <div className="scene map-scene">
      <div className="map-header">
        <BackButton onClick={onHome} />
        <button className="gh-btn gh-body btn-secondary" onClick={onLeaderboard}>
            <span>🏆 LEADERBOARD</span>
          </button>
        <div className="gh-body map-header-text">
          <div className="map-title">
            Peta Petualangan{playerName ? ` — ${playerName}` : ""}
          </div>
          <div className="map-subtitle">
            ⭐ {totalStars} / {LEVEL_DATA.length * MAX_STARS}
          </div>
        </div>
      </div>

      <div className="map-area" style={{ backgroundImage: `url(${bgMap})` }}>
        {LEVEL_DATA.map((lvl, i) => {
          const unlocked = isUnlocked(i);
          const stars = progress[i];
          return (
            <button
              key={lvl.id}
              className={`gh-btn map-node map-node-${lvl.id} ${unlocked ? "map-node-unlocked" : "map-node-locked"}`}
              onClick={() => onOpenLevel(i)}
              disabled={!unlocked}
              aria-label={lvl.title}
            >
              <img src={BADGES[lvl.id]} alt={lvl.title} className="node-badge" />
              {!unlocked && <span className="node-lock">🔒</span>}
              <div className="node-stars">
                {Array.from({ length: MAX_STARS }, (_, s) => (
                  <span key={s} style={{ opacity: s < stars ? 1 : 0.35 }}>
                    ⭐
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}