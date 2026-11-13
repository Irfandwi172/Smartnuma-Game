import React, { useEffect, useRef } from "react";
import { NARRATION } from "../data/Narration";
import "./NarrationModal.css";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5L15 15M15 5L5 15" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Kotak narasi di tengah peta. Dirender di dalam .map-area (yang position: relative),
// jadi "tengah" artinya tengah gambar peta. Ditutup lewat ikon X di kanan atas
// kotak, atau tombol Esc.
export default function NarrationModal({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="narration-overlay">
      <div className="parchment-card narration-card" role="dialog" aria-modal="true" aria-labelledby="narration-title">
        <button ref={closeRef} type="button" className="narration-close" onClick={onClose} aria-label="Tutup narasi">
          <CloseIcon />
        </button>

        <h2 id="narration-title" className="gh-title card-title">
          {NARRATION.title}
        </h2>
        <div className="narration-body">
          {NARRATION.paragraphs.map((text, i) => (
            <p key={i} className="gh-body card-text narration-text">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}