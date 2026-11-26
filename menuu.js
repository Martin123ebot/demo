// =====================================================================
// menuu.js – EKRAANI TEKSTID JA PUNKTID
// ---------------------------------------------------------------------
// Vastutaja: LIIDESE TEGIJA
// Siin on: punktid, seeria, rekord, teated keset ekraani ("Sisse!"),
// juhendimenüü vihje.
// =====================================================================


// Abifunktsioon: leiab HTML-ist elemendi id järgi.
// Näiteks $("hScore") on see koht, kus punkte näidatakse.
const $ = id => document.getElementById(id);


// ---------- Mängija tulemused ----------
let score = 0;   // punktid kokku
let streak = 0;  // mitu korda järjest on sisse visatud (seeria)
const BEST_STREAK_KEY = "viskemang.bestStreak";
let storageWarningShown = false;

function warnStorageUnavailable(error) {
  if (storageWarningShown) return;
  storageWarningShown = true;
  console.warn("Rekordi salvestamine pole saadaval; mäng jätkab sessioonipõhise rekordiga.", error);
}

function loadBestStreak() {
  try {
    const saved = window.localStorage.getItem(BEST_STREAK_KEY);
    const value = Number(saved);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  } catch (error) {
    warnStorageUnavailable(error);
    return 0;
  }
}

function saveBestStreak() {
  try {
    window.localStorage.setItem(BEST_STREAK_KEY, String(best));
  } catch (error) {
    warnStorageUnavailable(error);
  }
}

let best = loadBestStreak();


// Näitab hetkeks suurt teksti keset ekraani, näiteks "Sisse!" või "Mööda".
function flash(text, color) {
  const m = $("msg");
  m.textContent = text;
  m.style.color = color;
  m.classList.add("on");                          // teeb teksti nähtavaks
  setTimeout(() => m.classList.remove("on"), 750); // 0,75 s pärast peidab ära
}


// Kirjutab punktid, seeria ja rekordi ekraani ülaossa.
function updateHud() {
  $("hScore").textContent = score;
  $("hStreak").textContent = streak;
  $("hBest").textContent = best;
}


// Hoia mängujuhendi juhis alles ka lennu ajal.
function setHint(text) {
  $("hint").textContent = text || "Hoia vasakut hiirenuppu või sõrme all, tõmba üles ja lase lahti";
}


// Kutsutakse välja, kui vise on lõppenud.
// hit = kas läks sisse; blocked = kas alustass põrgatas tagasi.
function tally(hit, blocked) {
  if (hit) {
    streak++;
    const points = SCORE.hit * 2 ** (streak - 1);
    score += points;
    if (streak > best) {
      best = streak;
      saveBestStreak();
    }
    flash((streak > 2 ? "Seeria " + streak + "! " : "Sisse! ") + "+" + points, "#1D6E56");
    playHitSound();
  } else {
    streak = 0;
    flash(blocked ? "Alustass!" : "Mööda", "#4A6357");
    playMissSound();
  }
  updateDifficulty(streak); // fuusika.js: tops hakkab seeria järgi rohkem liikuma
  updateHud();
}
