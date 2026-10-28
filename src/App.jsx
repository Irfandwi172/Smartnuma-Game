import { useState, useEffect } from "react";
import "./App.css";

import NamePage from "./pages/NamePage";
import MapPage from "./pages/MapPage";
import MateriPage from "./pages/MateriPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import LeaderboardPage from "./pages/LeaderBoardpage";

import { LEVEL_DATA, MAX_STARS, PASS_THRESHOLD, GENIALLY_HOME } from "./data/levelData";
import {
  getSavedName,
  saveName,
  getSavedProgress,
  saveProgress,
  getOrSetStartTime,
  hasSubmittedLeaderboard,
  markLeaderboardSubmitted,
} from "./utils/storage";
import { submitScore } from "./utils/Leaderboardapi";
import { shuffleQuestions } from "./utils/shuffle";
import sfxCorrect from "./assets/BENAR.mp3";
import sfxWrong from "./assets/SALAH.mp3";

// Diputar ulang dari awal tiap kali dipanggil, jadi aman kalau
// pemain jawab soal berturut-turut dengan cepat.
function playSfx(src) {
  try {
    const audio = new Audio(src);
    audio.play().catch(() => {
      /* browser kadang blokir autoplay sebelum ada interaksi user - abaikan */
    });
  } catch {
    /* abaikan kalau Audio API tidak tersedia */
  }
}

// Data URI audio hening super pendek (nggak perlu file terpisah).
const SILENT_AUDIO =
  "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA" +
  "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA" +
  "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID/" +
  "/uQxAAAAAAAAAAAAAAAAAAAAAAAVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" +
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

let audioUnlocked = false;

// Sekali dipanggil (dari dalam event klik asli, misalnya submit form
// nama), ini "membuka kunci" izin autoplay audio untuk SISA sesi
// halaman ini.
function unlockAudioForSession() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  try {
    const audio = new Audio(SILENT_AUDIO);
    audio.play().catch(() => {});
  } catch {
    /* abaikan */
  }
}

export default function App() {
  // Nggak ada lagi halaman Home: begitu app dibuka, langsung diputuskan
  // mau ke "name" (belum pernah isi nama) atau "map" (sudah pernah).
  const [screen, setScreen] = useState(() => (getSavedName() ? "map" : "name"));
  const [playerName, setPlayerName] = useState(() => getSavedName());
  const [progress, setProgress] = useState(() => getSavedProgress(LEVEL_DATA.length));

  const [activeLevel, setActiveLevel] = useState(0);
  // Soal-soal level yang sedang dikerjakan, dengan urutan opsi yang sudah
  // diacak. Diisi ulang tiap kuis dimulai (termasuk saat Ulangi).
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answered, setAnswered] = useState(false);

  // simpan progres tiap kali berubah
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // pastikan timer mulai jalan begitu pemain masuk ke map (baik lewat
  // nama yang sudah tersimpan, maupun baru saja isi nama)
  useEffect(() => {
    if (playerName) getOrSetStartTime();
  }, [playerName]);

  const isUnlocked = (i) => i === 0 || progress[i - 1] >= PASS_THRESHOLD;

  function handleNameSubmit(name) {
    unlockAudioForSession();
    setPlayerName(name);
    saveName(name);
    getOrSetStartTime(); // mulai hitung waktu dari sini
    setScreen("map");
  }

  function openLevel(i) {
    if (!isUnlocked(i)) return;
    unlockAudioForSession();
    setActiveLevel(i);
    setScreen("materi");
  }

  function startQuiz() {
    // acak urutan opsi tiap soal (correct otomatis dipetakan ulang)
    setActiveQuestions(shuffleQuestions(LEVEL_DATA[activeLevel].questions));
    setQIndex(0);
    setStarCount(0);
    setSelectedOptions([]);
    setAnswered(false);
    setScreen("quiz");
  }

  function toggleOption(idx) {
    if (answered) return;
    const pickCount = LEVEL_DATA[activeLevel].pickCount;
    setSelectedOptions((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((v) => v !== idx);
      }
      if (pickCount === 1) return [idx]; // single-select: ganti pilihan langsung
      if (prev.length >= pickCount) return prev; // sudah penuh, jangan tambah lagi
      return [...prev, idx];
    });
  }

  function submitAnswer() {
    const pickCount = LEVEL_DATA[activeLevel].pickCount;
    if (answered || selectedOptions.length !== pickCount) return;
    const q = activeQuestions[qIndex];
    const chosenSorted = [...selectedOptions].sort();
    const correctSorted = [...q.correct].sort();
    const isCorrect =
      chosenSorted.length === correctSorted.length &&
      chosenSorted.every((v, i) => v === correctSorted[i]);
    setAnswered(true);
    if (isCorrect) {
      setStarCount((s) => Math.min(MAX_STARS, s + 1));
      playSfx(sfxCorrect);
    } else {
      playSfx(sfxWrong);
    }
  }

  function nextQuestion() {
    const total = activeQuestions.length;
    if (qIndex + 1 < total) {
      setQIndex(qIndex + 1);
      setSelectedOptions([]);
      setAnswered(false);
    } else {
      setProgress((p) => {
        const copy = [...p];
        copy[activeLevel] = Math.max(copy[activeLevel], starCount);
        return copy;
      });

      // kalau ini level terakhir dan lulus, kirim skor ke leaderboard
      const isLastLevel = activeLevel === LEVEL_DATA.length - 1;
      const passedThisLevel = starCount >= PASS_THRESHOLD;
      if (isLastLevel && passedThisLevel && !hasSubmittedLeaderboard()) {
        const finalProgress = [...progress];
        finalProgress[activeLevel] = Math.max(finalProgress[activeLevel], starCount);
        const totalBintang = finalProgress.reduce((a, b) => a + b, 0);
        const startTime = getOrSetStartTime();
        const waktuDetik = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        submitScore({ nama: playerName || "Tanpa Nama", bintang: totalBintang, waktu: waktuDetik });
        markLeaderboardSubmitted();
      }

      setScreen("result");
    }
  }

  function backToMap() {
    setScreen("map");
  }

  return (
    <div className="gh-app">
      {screen === "leaderboard" && <LeaderboardPage onBack={backToMap} />}

      {screen === "name" && <NamePage onSubmit={handleNameSubmit} />}

      {screen === "map" && (
        <MapPage
          playerName={playerName}
          progress={progress}
          isUnlocked={isUnlocked}
          onOpenLevel={openLevel}
          onLeaderboard={() => setScreen("leaderboard")}
          onHome={() => {
  window.location.href = GENIALLY_HOME;
}}
        />
      )}

      {screen === "materi" && (
        <MateriPage level={LEVEL_DATA[activeLevel]} onStartQuiz={startQuiz} onBack={backToMap} />
      )}

      {screen === "quiz" && (
        <QuizPage
          level={{ ...LEVEL_DATA[activeLevel], questions: activeQuestions }}
          qIndex={qIndex}
          starCount={starCount}
          selectedOptions={selectedOptions}
          answered={answered}
          onToggleOption={toggleOption}
          onSubmit={submitAnswer}
          onNext={nextQuestion}
          onBack={backToMap}
        />
      )}

      {screen === "result" && (
        <ResultPage
          starCount={starCount}
          passed={starCount >= PASS_THRESHOLD}
          isLast={activeLevel === LEVEL_DATA.length - 1}
          activeLevel={activeLevel}
          onRetry={startQuiz}
          onNextLevel={() => openLevel(activeLevel + 1)}
          onBackToMap={backToMap}
          onLeaderboard={() => setScreen("leaderboard")}
        />
      )}
    </div>
  );
}