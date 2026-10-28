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
let activePointerId = null;
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
  const trajectory = calcAimTrajectory(dx, dy, aimDots.length);
  if (!trajectory) {
    aimDots.forEach(dot => { dot.visible = false; });
    return;
  }

  aimDots.forEach((dot, i) => {
    dot.position.copy(trajectory[i]);
    dot.visible = true;
  });
}


// Peidab viske trajektoori punktiiri.
function hideAimDots() {
  aimDots.forEach(dot => { dot.visible = false; });
}


// Hiirenupp alla või sõrm ekraanile: tõmme algab.
function down(e) {
  if (objectSelect.parentElement.contains(e.target) ||
      environmentSelect.parentElement.contains(e.target) ||
      e.target.closest(".game-actions")) return;
  if (state !== "aim" || dragging || !e.isPrimary) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;

  dragging = true;
  activePointerId = e.pointerId;
  sx = cx = e.clientX;
  sy = cy = e.clientY;
  stage.setPointerCapture(e.pointerId);
  $("power").classList.add("on");          // näita võimsusriba
}


// Hiir või sõrm liigub: uuenda võimsusriba.
function move(e) {
  if (!dragging || e.pointerId !== activePointerId) return;
  cx = e.clientX;
  cy = e.clientY;
  // Riba pikkus sõltub tõmbe pikkusest (alla tõmmet ei arvestata).
  const len = Math.hypot(cx - sx, Math.max(sy - cy, 0));
  $("powerFill").style.width = Math.min(100, len / 2.9) + "%";
  updateAimDots(cx - sx, sy - cy);
  e.preventDefault(); // ära lase telefonil lehte kerida
}


// Hiirenupp või sõrm lahti: vise lendu.
function up(e) {
  if (!dragging || e.pointerId !== activePointerId) return;
  cx = e.clientX;
  cy = e.clientY;
  dragging = false;
  activePointerId = null;
  $("power").classList.remove("on");       // peida võimsusriba
  $("powerFill").style.width = "0%";
  hideAimDots();

  // Kui palju tõmmati üles (dy) ja küljele (dx).
  const dy = sy - cy, dx = cx - sx;
  const v = calcThrowVelocity(dx, dy);     // fuusika.js arvutab kiiruse
  if (!v) return;                          // liiga väike tõmme -> ei viska
  startThrow(v);                           // fuusika.js alustab lendu
}


// Tühistatud puute korral lõpeta tõmme viset tegemata.
function cancel(e) {
  if (!dragging || e.pointerId !== activePointerId) return;
  dragging = false;
  activePointerId = null;
  $("power").classList.remove("on");
  $("powerFill").style.width = "0%";
  hideAimDots();
}


// ---------- Hiire ja puuteekraani ühine juhtimine ----------
stage.addEventListener("pointerdown", down);
stage.addEventListener("pointermove", move);
stage.addEventListener("pointerup", up);
stage.addEventListener("pointercancel", cancel);
stage.addEventListener("lostpointercapture", cancel);

const gravityButton = $("gravityButton");
const gravityMenu = $("gravityMenu");

PLANETS.forEach(planet => {
  const option = document.createElement("button");
  option.type = "button";
  option.dataset.planet = planet.id;
  option.textContent = planet.name + " — " + planet.gravity.toFixed(2) + " m/s²";
  gravityMenu.appendChild(option);
});

function updateGravityButton() {
  const planet = PLANETS.find(item => item.id === selectedPlanet);
  gravityButton.textContent = "Gravitatsioon: " + planet.name + " (" + planet.gravity.toFixed(2) + " m/s²)";
}

gravityButton.addEventListener("click", () => {
  const isExpanded = gravityButton.getAttribute("aria-expanded") === "true";
  gravityButton.setAttribute("aria-expanded", String(!isExpanded));
  gravityMenu.hidden = isExpanded;
});

gravityMenu.addEventListener("click", e => {
  const option = e.target.closest("button[data-planet]");
  if (!option) return;
  selectGravityPlanet(option.dataset.planet);
  updateGravityButton();
  gravityMenu.hidden = true;
  gravityButton.setAttribute("aria-expanded", "false");
});

$("restartButton").addEventListener("click", () => {
  dragging = false;
  activePointerId = null;
  $("power").classList.remove("on");
  $("powerFill").style.width = "0%";
  hideAimDots();
  $("msg").classList.remove("on");
  restartThrow();
});

updateGravityButton();
