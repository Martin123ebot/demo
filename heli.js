// =====================================================================
// heli.js – HELID
// ---------------------------------------------------------------------
// Vastutaja: LIIDESE TEGIJA
// Helid kutsutakse välja menuu.js failist, kui vise läheb sisse või mööda.
//
// NB! Brauser ei lase heli mängida enne, kui mängija on lehel
// esimest korda klõpsanud või puudutanud.
// =====================================================================


// Mängib heli, kui vise läks sisse (näiteks võidupasun).
const hitSound = new Audio("sisse_fanfaar.wav");

function playHitSound() {
  hitSound.currentTime = 0;
  hitSound.play();
}


// Mängib heli, kui vise läks mööda.
const missSound = new Audio("mooda_trompet.wav");

function playMissSound() {
  missSound.currentTime = 0;
  missSound.play();
}
