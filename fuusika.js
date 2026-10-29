// =====================================================================
// fuusika.js – KUIDAS ASJAD LIIGUVAD
// ---------------------------------------------------------------------
// Vastutaja: FÜÜSIK
// Siin on: lend, gravitatsioon, põrkamine, topsi tabamine,
// topsi liikumine, alustassi ilmumine ja sihtimise trajektoori arvutus.
//
// Põhiidee: igal kaadril (umbes 60 korda sekundis) arvutatakse,
// kui palju keha väikese ajavahemiku dt jooksul liigub.
//   kiirus   = kiirus + kiirendus * dt
//   asukoht  = asukoht + kiirus * dt
// =====================================================================


// ---------- Lennu olek ----------
// state ütleb, mis mängus parasjagu toimub:
//   "aim"  = mängija sihib (keha ootab)
//   "fly"  = keha lendab
//   "land" = vise on lõppenud, keha veereb/rahuneb ja varsti algab uus vise
let state = "aim";
let vel = new THREE.Vector3();  // keha kiirus (x, y, z) m/s
let spin = new THREE.Vector3(); // keha pöörlemiskiirus ümber x, y, z telje
let settle = 0;                 // mitu sekundit on vise juba lõppenud olnud
let selectedPlanet = "earth";
let bounceIntoCupAttempted = false;
let windFrom = new THREE.Vector3(0, 0, -1);
let windSpeed = 0;
const windVelocity = new THREE.Vector3();
const windAcceleration = new THREE.Vector3();


// Tagastab valitud planeedi pinnagravitatsiooni.
function getGravity() {
  const planet = PLANETS.find(item => item.id === selectedPlanet);
  if (!planet) throw new Error("Valitud planeedi gravitatsiooni ei leitud.");
  return planet.gravity;
}


// Valib gravitatsiooniks planeedi.
function selectGravityPlanet(planetId) {
  if (!PLANETS.some(planet => planet.id === planetId)) {
    throw new Error("Tundmatu planeet: " + planetId);
  }
  selectedPlanet = planetId;
}


// Valib uue tuule suuna ja tugevuse järgmiseks viskeks.
function resetWind() {
  if (environmentSelect.value !== "earth") {
    windSpeed = 0;
    windVelocity.set(0, 0, 0);
    windAcceleration.set(0, 0, 0);
    updateWindIndicator(windVelocity, windSpeed);
    return;
  }

  const angle = Math.random() * Math.PI * 2;
  windFrom.set(Math.sin(angle), 0, -Math.cos(angle));
  windSpeed = WIND.minSpeed + Math.random() * (WIND.maxSpeed - WIND.minSpeed);
  windVelocity.copy(windFrom).negate().multiplyScalar(windSpeed);
  windAcceleration.copy(windFrom).multiplyScalar(-windSpeed * WIND.accelerationPerSpeed);
  updateWindIndicator(windVelocity, windSpeed);
}

environmentSelect.addEventListener("change", resetWind);


// Tagastab valitud eseme viske- ja õhuomadused.
function getObjectPhysics() {
  if (tok === throwables.rock) return OBJECT_PHYSICS.rock;
  if (tok === throwables.paperPlane) return OBJECT_PHYSICS.paperPlane;
  return OBJECT_PHYSICS.robot;
}


// Arvutab tuule, õhutakistuse ja paberlennuki tõstejõu koosmõju.
function getAirAcceleration(velocity) {
  const physics = getObjectPhysics();
  const acceleration = windAcceleration.clone().multiplyScalar(physics.windResponse);
  if (physics.drag === 0 && physics.lift === 0) return acceleration;

  const relativeVelocity = new THREE.Vector3(
    velocity.x - windVelocity.x,
    velocity.y,
    velocity.z - windVelocity.z);
  const airSpeed = relativeVelocity.length();
  const horizontalSpeed = Math.hypot(relativeVelocity.x, relativeVelocity.z);
  acceleration.addScaledVector(relativeVelocity, -physics.drag * airSpeed);
  acceleration.y += Math.min(12, physics.lift * horizontalSpeed * horizontalSpeed);
  return acceleration;
}


// ---------- Topsi liikumise olek ----------
let cupAmp = 0;        // kui kaugele küljele tops liigub (0 = seisab paigal)
let cupPhase = 0;      // kus kohas liikumisel tops parasjagu on
let coasterOn = false; // kas alustass on praegu topsi peal
let coasterT = 0;      // mitu sekundit alustass on juba topsi peal olnud


// Paneb keha tagasi algasendisse ja valmistab ette uue viske.
function resetToken() {
  tok.position.copy(REL);   // tagasi algkohta (seaded.js: REL)
  if (tok === throwables.paperPlane) tok.rotation.set(Math.PI / 2, 0, 0);
  else tok.rotation.set(0, 0, 0);
  vel.set(0, 0, 0);
  bounceIntoCupAttempted = false;
  resetWind();
  state = "aim";
  setHint("Hoia vasakut hiirenuppu või sõrme all, tõmba üles ja lase lahti"); // menuu.js
}


// Alustab viske uuesti algusest, säilitades punktid ja seeria.
function restartThrow() {
  settle = 0;
  resetToken();
  clearThrowTrail();
}


// Arvutab viske algkiiruse sõrme tõmbe järgi.
// dx = tõmme küljele (pikslites), dy = tõmme üles (pikslites).
// Tagastab kiiruse vektori või null, kui tõmme oli liiga lühike.
function calcThrowVelocity(dx, dy) {
  if (dy < THROW.minDrag) return null;       // liiga väike tõmme -> viset ei ole
  const len = Math.hypot(dx, dy);            // tõmbe pikkus

  // Jõud 0..1: mida pikem tõmme, seda tugevam vise.
  const power = Math.max(THROW.minPower, Math.min(1, len / THROW.fullDrag));
  const v0 = THROW.minSpeed + power * THROW.extraSpeed;  // algkiirus m/s

  // Viskenurk: mida otsem tõmme üles, seda kõrgem kaar.
  const vert = Math.max(0, Math.min(1, dy / len));
  const elev = (THROW.minAngle + THROW.extraAngle * vert) *
    getObjectPhysics().launchAngleScale * Math.PI / 180; // kraadid -> radiaanid

  // Külgsuund: tõmme paremale -> vise paremale.
  const azim = Math.max(-THROW.maxSide, Math.min(THROW.maxSide, dx * THROW.sideFactor));

  // Jaga kiirus kolmeks osaks: küljele (x), üles (y), edasi (z).
  return new THREE.Vector3(
    Math.sin(azim) * v0 * Math.cos(elev) * getObjectPhysics().throwSpeed,
    Math.sin(elev) * v0 * getObjectPhysics().throwSpeed,
    -Math.cos(azim) * v0 * Math.cos(elev) * getObjectPhysics().throwSpeed);
}


// Arvutab trajektoori esimese poole punktid sihtimise punktiiri jaoks.
function calcAimTrajectory(dx, dy, pointCount) {
  const v = calcThrowVelocity(dx, dy);
  if (!v) return null;

  const gravity = getGravity();
  if (tok === throwables.paperPlane) {
    const position = REL.clone();
    const velocity = v.clone();
    const positions = [position.clone()];
    const dt = 0.016;
    for (let i = 0; i < 1200; i++) {
      velocity.y -= gravity * dt;
      velocity.addScaledVector(getAirAcceleration(velocity), dt);
      position.addScaledVector(velocity, dt);
      if (position.y <= 0.06) {
        position.y = 0.06;
        positions.push(position.clone());
        break;
      }
      positions.push(position.clone());
    }

    return Array.from({ length: pointCount }, (_, i) => {
      const sample = Math.max(1, Math.floor((positions.length - 1) * 0.5 * (i + 1) / pointCount));
      return positions[sample].clone();
    });
  }

  const gravityMagnitude = Math.abs(gravity);
  const flightTime = (v.y + Math.sqrt(v.y * v.y + 2 * gravityMagnitude * (REL.y - 0.06))) / gravityMagnitude;
  const previewTime = flightTime * 0.5;
  const airAcceleration = getAirAcceleration(v);

  return Array.from({ length: pointCount }, (_, i) => {
    const t = previewTime * (i + 1) / pointCount;
    return new THREE.Vector3(
      REL.x + v.x * t + 0.5 * airAcceleration.x * t * t,
      REL.y + v.y * t - 0.5 * gravity * t * t,
      REL.z + v.z * t + 0.5 * airAcceleration.z * t * t);
  });
}


// Alustab viset: annab kehale algkiiruse ja pöörlemise.
function startThrow(v) {
  vel.copy(v);
  bounceIntoCupAttempted = false;
  clearThrowTrail();
  recordThrowTrailPoint(tok.position);
  if (tok === throwables.paperPlane) {
    spin.set(0, 0, 0.35);
  } else {
    spin.set(8 + Math.random() * 5, 2.5, 2); // juhuslik pöörlemine, et näeks elavam välja
  }
  state = "fly";
  setHint(""); // peida vihje lennu ajaks
}


// Liigutab keha ühe väikese ajasammu dt võrra edasi.
// Kontrollib ka, kas keha tabas topsi, alustassi või maad.
function stepFlight(dt) {
  const prevY = tok.position.y;   // kõrgus enne sammu (et teada, kas keha kukkus üle topsi ääre)

  // 1) Gravitatsioon: kiirus alla kasvab iga sammuga.
  vel.y -= getGravity() * dt;
  vel.addScaledVector(getAirAcceleration(vel), dt);

  // 2) Liigu kiiruse järgi edasi.
  tok.position.addScaledVector(vel, dt);
  tok.position.y = Math.max(tok.position.y, 0.06);

  // 3) Pöörle.
  if (tok === throwables.paperPlane) {
    tok.rotation.x = Math.PI / 2 + Math.atan2(vel.y, Math.hypot(vel.x, vel.z));
    tok.rotation.z += spin.z * dt;
  } else {
    tok.rotation.x += spin.x * dt;
    tok.rotation.y += spin.y * dt;
    tok.rotation.z += spin.z * dt;
  }

  // Kui kaugel on keha topsi keskelt (ülevalt vaadates).
  const dx = tok.position.x - cup.position.x;
  const dz = tok.position.z - cup.position.z;
  const hd = Math.hypot(dx, dz);

  // 4) Kas keha kukkus just topsi ääre kõrgusele, topsi lähedal?
  if (prevY > CUP_H && tok.position.y <= CUP_H && vel.y < 0 && hd < CUP_R * 1.9) {

    // 4a) Alustass on peal -> keha põrkab tagasi.
    if (coasterOn && hd < CUP_R * 1.5) {
      vel.y = Math.abs(vel.y) * COASTER.bounce;
      vel.x += dx * COASTER.push;
      vel.z += dz * COASTER.push;
      state = "land"; settle = 0;
      tally(false, true); // menuu.js: "Alustass!"
      return;
    }

    // 4b) Keha on topsi suu kohal -> SISSE!
    if (hd < CUP_R * 0.94) {
      state = "land"; settle = 0;
      tok.position.set(cup.position.x, CUP_H * 0.42, cup.position.z); // pane keha topsi sisse
      vel.set(0, 0, 0);
      tally(true, false); // menuu.js: "Sisse!"
      return;
    }

    // 4c) Keha tabas topsi äärt -> põrkab üles ja küljele.
    vel.y = Math.abs(vel.y) * BOUNCE.rim;
    vel.x += (dx / hd) * BOUNCE.rimPush;
    vel.z += (dz / hd) * BOUNCE.rimPush;
  }

  // 5) Kas keha jõudis maapinnale?
  if (tok.position.y <= 0.06) {
    tok.position.y = 0.06; // ära lase maa sisse vajuda

    if (surfaceSelect.value === "mud" || surfaceSelect.value === "sand") {
      vel.set(0, 0, 0);
      spin.set(0, 0, 0);
      if (state === "fly") { state = "land"; settle = 0; tally(false, false); }
      return;
    }

    if (surfaceSelect.value === "rubber") {
      if (Math.abs(vel.y) < BOUNCE.stopSpeed) {
        vel.set(0, 0, 0);
        spin.set(0, 0, 0);
        if (state === "fly") { state = "land"; settle = 0; tally(false, false); }
      } else {
        vel.y = Math.abs(vel.y) * SURFACE.rubberBounce;
        vel.x *= BOUNCE.groundFriction;
        vel.z *= BOUNCE.groundFriction;
        spin.multiplyScalar(BOUNCE.spinLoss);
      }
      return;
    }

    if (Math.abs(vel.y) < BOUNCE.stopSpeed) {
      // Kukub aeglaselt -> jääb peaaegu seisma.
      vel.multiplyScalar(0.4);
      if (state === "fly") { state = "land"; settle = 0; tally(false, false); } // "Mööda"
    } else {
      // Kukub kiiresti -> põrkab üles, kiirus väheneb.
      vel.y = -vel.y * BOUNCE.ground;
      vel.x *= BOUNCE.groundFriction;
      vel.z *= BOUNCE.groundFriction;
      if (!bounceIntoCupAttempted) {
        bounceIntoCupAttempted = true;
        const timeToCup = (cup.position.z - tok.position.z) / vel.z;
        const predictedX = tok.position.x + vel.x * timeToCup;
        const gravity = getGravity();
        const heightToCup = CUP_H - tok.position.y;
        if (timeToCup > Math.sqrt(2 * heightToCup / gravity) &&
            Math.abs(predictedX - cup.position.x) < CUP_R * 0.94 &&
            Math.random() < BOUNCE.groundCupChance) {
          vel.y = heightToCup / timeToCup + 0.5 * gravity * timeToCup;
        }
      }
    }
    spin.multiplyScalar(BOUNCE.spinLoss); // pöörlemine aeglustub
  }

  if (state === "fly") recordThrowTrailPoint(tok.position);
}


// Muudab raskust seeria järgi: mida pikem seeria, seda rohkem tops liigub.
// Kutsutakse välja menuu.js failist pärast igat viset.
function updateDifficulty(streak) {
  cupAmp = Math.min(CUP_MOVE.maxAmp, streak * CUP_MOVE.perStreak);
}


// Liigutab topsi küljelt küljele ja paneb vahel alustassi peale.
// Kutsutakse välja igal kaadril (mang.js).
function updateCup(dt) {
  // Tops kõigub siinuse järgi: vasakule-paremale-vasakule...
  cupPhase += dt * (CUP_MOVE.baseSpeed + streak * CUP_MOVE.speedPerStreak);
  cup.position.x = Math.sin(cupPhase) * cupAmp;

  // Alustass: alates teatud seeriast ilmub vahel juhuslikult.
  if (streak >= COASTER.fromStreak && !coasterOn && Math.random() < dt * COASTER.chance) {
    coasterOn = true;
    coasterT = 0;
  }
  if (coasterOn) {
    coasterT += dt;
    coaster.visible = true;
    coaster.position.set(cup.position.x, CUP_H + 0.04, cup.position.z); // alustass liigub koos topsiga
    if (coasterT > COASTER.duration) {  // aeg täis -> alustass kaob
      coasterOn = false;
      coaster.visible = false;
    }
  }
}
