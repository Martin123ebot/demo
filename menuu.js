// =====================================================================
// menuu.js – EKRAANI TEKSTID JA PUNKTID
// ---------------------------------------------------------------------
// Vastutaja: LIIDESE TEGIJA
// Siin on: punktid, seeria, rekord, teated keset ekraani ("Sisse!"),
// vihje ekraani all. Hiljem tuleb siia ka menüü.
// =====================================================================


// Abifunktsioon: leiab HTML-ist elemendi id järgi.
// Näiteks $("hScore") on see koht, kus punkte näidatakse.
const $ = id => document.getElementById(id);


// ---------- Mängija tulemused ----------
let score = 0;   // punktid kokku
let streak = 0;  // mitu korda järjest on sisse visatud (seeria)
let best = 0;    // parim tulemus (rekord)


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


// Muudab ekraani all olevat vihjeteksti. Tühi tekst = vihje kaob.
function setHint(text) {
  $("hint").textContent = text;
}


// Kutsutakse välja, kui vise on lõppenud.
// hit = kas läks sisse; blocked = kas alustass põrgatas tagasi.
function tally(hit, blocked) {
  if (hit) {
    streak++;
    score += SCORE.hit + Math.min(SCORE.maxBonus, (streak - 1) * SCORE.streakBonus);
    best = Math.max(best, score);
    flash(streak > 2 ? "Seeria " + streak + "!" : "Sisse!", "#1D6E56");
    playHitSound();
  } else {
    streak = 0;
    flash(blocked ? "Alustass!" : "Mööda", "#4A6357");
    playMissSound();
  }
  updateDifficulty(streak); // fuusika.js: tops hakkab seeria järgi rohkem liikuma
  updateHud();
}
