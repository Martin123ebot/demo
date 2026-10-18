// =====================================================================
// mang.js – MÄNGU PÕHITSÜKKEL
// ---------------------------------------------------------------------
// Vastutaja: ÜHINE (muudetakse harva ja koos kokku leppides)
// See fail paneb kõik osad tööle. Igal kaadril (umbes 60 korda
// sekundis) liigutatakse tops, keha ja joonistatakse pilt uuesti.
// See fail peab index.html-is olema VIIMANE.
// =====================================================================


// Mäng algab: keha algasendisse ja punktid ekraanile.
resetToken();   // fuusika.js
updateHud();    // menuu.js

let last = performance.now(); // eelmise kaadri aeg (millisekundites)


// Üks kaader. Brauser kutsub selle ise välja enne iga ekraani uuendust.
function loop(now) {
  // dt = mitu sekundit möödus eelmisest kaadrist.
  // Max 0.033 s, et aeglases arvutis ei hüppaks keha läbi topsi.
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  updateCup(dt); // fuusika.js: tops liigub, alustass ilmub/kaob

  // Kui keha lendab või maandub, liiguta seda.
  if (state === "fly" || state === "land") {
    stepFlight(dt); // fuusika.js
    if (state === "land") {
      settle += dt;
      if (settle > SETTLE_TIME) resetToken(); // oota natuke, siis uus vise
    }
  }

  renderer.render(scene, camera); // stseen.js: joonista pilt
  requestAnimationFrame(loop);    // palu järgmine kaader
}

requestAnimationFrame(loop); // käivita mäng
