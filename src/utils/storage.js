/*
  PENYIMPANAN LOKAL (localStorage)
  ----------------------------------
  Dipakai supaya nama pemain & progres bintang tetap ada walau
  browser ditutup lalu dibuka lagi. Ini beda dari sessionStorage:
  localStorage TIDAK hilang saat tab ditutup.

  Catatan: ini disimpan per-browser di perangkat siswa, bukan di server.
  Kalau siswa buka dari HP lain atau mode incognito, progresnya nggak ikut.
*/

const NAME_KEY = "pb_player_name";
const PROGRESS_KEY = "pb_progress";
const START_TIME_KEY = "pb_start_time";
const SUBMITTED_KEY = "pb_leaderboard_submitted";
const NARRATION_KEY = "pb_narration_seen";

export function getSavedName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function saveName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* localStorage tidak tersedia (mis. private browsing ketat) — abaikan */
  }
}

export function getSavedProgress(totalLevels) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return Array(totalLevels).fill(0);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === totalLevels) return parsed;
    return Array(totalLevels).fill(0);
  } catch {
    return Array(totalLevels).fill(0);
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* abaikan kalau gagal simpan */
  }
}

export function clearSavedData() {
  try {
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(START_TIME_KEY);
    localStorage.removeItem(SUBMITTED_KEY);
    localStorage.removeItem(NARRATION_KEY);
  } catch {
    /* abaikan */
  }
}

// Dipanggil sekali di awal permainan (saat isi nama / klik Mulai pertama
// kali). Kalau sudah pernah di-set sebelumnya, nilai lama dipakai lagi
// (jadi timer TIDAK reset kalau siswa cuma nutup-buka tab).
export function getOrSetStartTime() {
  try {
    let t = localStorage.getItem(START_TIME_KEY);
    if (!t) {
      t = String(Date.now());
      localStorage.setItem(START_TIME_KEY, t);
    }
    return Number(t);
  } catch {
    return Date.now();
  }
}

export function hasSubmittedLeaderboard() {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

// Narasi di peta: tampil sampai pemain menutupnya sekali, setelah itu tidak muncul lagi
export function hasSeenNarration() {
  try {
    return localStorage.getItem(NARRATION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNarrationSeen() {
  try {
    localStorage.setItem(NARRATION_KEY, "1");
  } catch {
    /* abaikan */
  }
}

export function markLeaderboardSubmitted() {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
  } catch {
    /* abaikan */
  }
}