import React, { useState } from "react";
import "./UploadGate.css";

/*
  Syarat upload sebelum lanjut: siswa membuka Google Form (tab baru) untuk
  mengupload jawaban perhitungannya, lalu mencentang "Saya sudah upload".
  Tombol Lanjut diatur oleh komponen induk lewat `confirmed`.

  PENTING: Google Form tidak bisa mengabari aplikasi ini kalau upload benar-benar
  terjadi, jadi ini berbasis pengakuan siswa. Pemeriksaannya lewat tab
  "Tanggapan" di Google Form-mu.

  Dirender sebagai fragment supaya ikut tata letak wadah induk (.v2-actions).
  Beri key={qIndex} agar status "sudah dibuka" ter-reset di tiap soal.
*/
export default function UploadGate({ formUrl, confirmed, onConfirmChange }) {
  const [opened, setOpened] = useState(false); // checkbox baru aktif setelah link dibuka

  return (
    <>
      <p className="gh-body upload-note">Upload jawaban perhitunganmu di Google Form dulu supaya bisa lanjut.</p>

      <a
        className="gh-btn gh-body btn-secondary upload-link"
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpened(true)}
      >
        📤 Upload di Google Form
      </a>

      <label
        className={`gh-body upload-check ${opened ? "" : "upload-check--disabled"}`}
        title={opened ? "" : "Buka Google Form dulu"}
      >
        <input
          type="checkbox"
          checked={confirmed}
          disabled={!opened}
          onChange={(e) => onConfirmChange(e.target.checked)}
        />
        Saya sudah upload
      </label>
    </>
  );
}