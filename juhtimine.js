// =====================================================================
// juhtimine.js – SIHTIMINE HIIRE JA SÕRMEGA
// ---------------------------------------------------------------------
// Vastutaja: LIIDESE TEGIJA
// Siin on: hiire/sõrme vajutus, tõmbamine ja lahtilaskmine,
// võimsusriba ja poolik viske trajektoori punktiir.
//
// Kuidas vise käib:
//   1) vajuta hiir alla / pane sõrm ekraanile  -> down()
//   2) tõmba üles                                -> move()
//   3) lase lahti                                -> up() -> vise algab
// =====================================================================


let dragging = false; // kas mängija parasjagu tõmbab
let sx = 0, sy = 0;   // kus tõmme algas (ekraani pikslites)
let cx = 0, cy = 0;   // kus sõrm/hiir praegu on
const aimDots = Array.from({ length: 12 }, () => {
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xD97757 }));
  dot.visible = false;
  scene.add(dot);
  return dot;
});


// Näitab viske esimest poolt, et mängija ei näeks, kas vise tabab topsi.
function updateAimDots(dx, dy) {
  const v = calcThrowVelocity(dx, dy);
  if (!v) {
    aimDots.forEach(dot => { dot.visible = false; });
    return;
  }

  const flightTime = (v.y + Math.sqrt(v.y * v.y + 2 * G * (REL.y - 0.06))) / G;
  const previewTime = flightTime * 0.5;

  aimDots.forEach((dot, i) => {
    const t = previewTime * (i + 1) / aimDots.length;
    dot.position.set(
      REL.x + v.x * t,
      REL.y + v.y * t - 0.5 * G * t * t,
      REL.z + v.z * t);
    dot.visible = true;
  });
}


// Peidab viske trajektoori punktiiri.
function hideAimDots() {
  aimDots.forEach(dot => { dot.visible = false; });
}


// Hiir alla või sõrm ekraanile: tõmme algab.
function down(e) {
  if (state !== "aim") return;             // lennu ajal ei saa uuesti visata
  const p = e.touches ? e.touches[0] : e;  // telefonis on sõrm, arvutis hiir
  dragging = true;
  sx = cx = p.clientX;
  sy = cy = p.clientY;
  $("power").classList.add("on");          // näita võimsusriba
}


// Hiir või sõrm liigub: uuenda võimsusriba.
function move(e) {
  if (!dragging) return;
  const p = e.touches ? e.touches[0] : e;
  cx = p.clientX;
  cy = p.clientY;
  // Riba pikkus sõltub tõmbe pikkusest (alla tõmmet ei arvestata).
  const len = Math.hypot(cx - sx, Math.max(sy - cy, 0));
  $("powerFill").style.width = Math.min(100, len / 2.9) + "%";
  updateAimDots(cx - sx, sy - cy);
  e.preventDefault(); // ära lase telefonil lehte kerida
}


// Hiir või sõrm lahti: vise lendu.
function up() {
  if (!dragging) return;
  dragging = false;
  $("power").classList.remove("on");       // peida võimsusriba
  $("powerFill").style.width = "0%";
  hideAimDots();

  // Kui palju tõmmati üles (dy) ja küljele (dx).
  const dy = sy - cy, dx = cx - sx;
  const v = calcThrowVelocity(dx, dy);     // fuusika.js arvutab kiiruse
  if (!v) return;                          // liiga väike tõmme -> ei viska
  startThrow(v);                           // fuusika.js alustab lendu
}


// ---------- Ühenda funktsioonid hiire ja sõrmega ----------
// Arvuti (hiir):
stage.addEventListener("mousedown", down);
stage.addEventListener("mousemove", move);
window.addEventListener("mouseup", up);    // window: lahtilaskmine töötab ka siis, kui hiir on ekraani servast väljas
// Telefon (sõrm). passive:false lubab move() sees lehe kerimise ära keelata.
stage.addEventListener("touchstart", down, { passive: false });
stage.addEventListener("touchmove", move, { passive: false });
stage.addEventListener("touchend", up);
