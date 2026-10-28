import { useEffect, useRef } from "react";

const BGM_VOLUME = 0.4; // 0 (senyap) sampai 1 (maksimal)

/*
  Memutar backsound berulang (loop) selama `shouldPlay` bernilai true,
  dan menjedanya saat false. Dipanggil sekali di App.jsx, jadi musik
  tidak mulai ulang saat pindah antar-halaman yang sama-sama aktif
  (misalnya dari halaman isi nama ke peta).

  Kalau browser memblokir autoplay (biasanya di kunjungan pertama, karena
  belum ada interaksi apa pun), musik otomatis dimulai pada klik atau
  tekan tombol pertama di halaman.
*/
export default function useBackgroundMusic(src, shouldPlay) {
  const audioRef = useRef(null);

  // Buat elemen audio satu kali per sumber suara
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = BGM_VOLUME;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  // Putar atau jeda sesuai shouldPlay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    let cancelled = false;
    let removeListeners = () => {};

    audio.play().catch(() => {
      // Diblokir browser: coba lagi pada interaksi pertama pemain
      if (cancelled) return;
      const resume = () => {
        audio.play().catch(() => {});
        removeListeners();
      };
      removeListeners = () => {
        document.removeEventListener("pointerdown", resume);
        document.removeEventListener("keydown", resume);
      };
      document.addEventListener("pointerdown", resume);
      document.addEventListener("keydown", resume);
    });

    return () => {
      cancelled = true;
      removeListeners();
    };
  }, [shouldPlay, src]);
}