// =====================================================================
// objektid.js – MÄNGU ASJAD: TOPS, ALUSTASS, VISATAV KEHA
// ---------------------------------------------------------------------
// Vastutaja: KUNSTNIK
// Siin on kirjas, kuidas asjad VÄLJA NÄEVAD. Kuidas nad LIIGUVAD,
// on fuusika.js failis.
//
// Kõik kujundid on tehtud lihtsatest 3D-kujunditest:
//   CylinderGeometry = silinder, TorusGeometry = rõngas, BoxGeometry = kast
// MeshLambertMaterial = matt pind, mis reageerib valgusele.
// =====================================================================


// ---------- Tops (sihtmärk) ----------
// Tops on "grupp" ehk mitu osa koos: sein, põhi, äär ja sang.
// Kui grupp liigub, liiguvad kõik osad koos.
const cup = new THREE.Group();

// Topsi sein: silinder, mis on alt kitsam (0.8) ja seest õõnes (true).
const wall = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R, CUP_R * 0.8, CUP_H, 32, 1, true),
  new THREE.MeshLambertMaterial({ color: 0x1D6E56, side: THREE.DoubleSide })); // DoubleSide = näha ka seest
wall.position.y = CUP_H / 2;
wall.castShadow = true;

// Topsi põhi: õhuke tume silinder.
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R * 0.8, CUP_R * 0.8, 0.025, 32),
  new THREE.MeshLambertMaterial({ color: 0x14503F }));
base.position.y = 0.012;

// Topsi äär: rõngas ülaservas.
const rim = new THREE.Mesh(
  new THREE.TorusGeometry(CUP_R, 0.018, 10, 32),
  new THREE.MeshLambertMaterial({ color: 0x0E3B2E }));
rim.rotation.x = Math.PI / 2;   // pööra pikali, et oleks topsi suu ümber
rim.position.y = CUP_H;

// Topsi sang: poolik rõngas topsi küljel.
const handle = new THREE.Mesh(
  new THREE.TorusGeometry(0.105, 0.024, 10, 22, Math.PI * 1.15),
  new THREE.MeshLambertMaterial({ color: 0x1D6E56 }));
handle.position.set(CUP_R + 0.05, CUP_H * 0.56, 0);
handle.rotation.z = -Math.PI / 2.6;
handle.castShadow = true;

// Pane osad kokku ja tops õigesse kohta.
cup.add(wall, base, rim, handle);
cup.position.set(0, 0, CUP_Z);
scene.add(cup);

// Kuu väike kraater kasutab topsi sama ava suurust ja tabamiskõrgust.
const moonCrater = new THREE.Group();
const craterFootprint = new THREE.Mesh(
  new THREE.CircleGeometry(CUP_R * 1.16, 32),
  new THREE.MeshLambertMaterial({ color: 0x53575B }));
craterFootprint.rotation.x = -Math.PI / 2;
craterFootprint.position.y = 0.01;

const craterBowl = new THREE.Mesh(
  new THREE.LatheGeometry([
    new THREE.Vector2(CUP_R * 0.94, 0.03),
    new THREE.Vector2(CUP_R * 0.98, 0.045),
    new THREE.Vector2(CUP_R * 1.02, 0.16),
    new THREE.Vector2(CUP_R * 1.04, CUP_H),
    new THREE.Vector2(CUP_R * 1.1, CUP_H * 0.85),
    new THREE.Vector2(CUP_R * 1.16, 0.02)
  ], 32),
  new THREE.MeshLambertMaterial({ color: 0x686D70, side: THREE.DoubleSide }));
craterBowl.castShadow = true;
craterBowl.receiveShadow = true;

const craterPit = new THREE.Mesh(
  new THREE.CircleGeometry(CUP_R * 0.94, 32),
  new THREE.MeshLambertMaterial({ color: 0x303437 }));
craterPit.rotation.x = -Math.PI / 2;
craterPit.position.y = 0.031;

const craterInnerRim = new THREE.Mesh(
  new THREE.TorusGeometry(CUP_R * 0.94 + 0.012, 0.012, 8, 24),
  new THREE.MeshLambertMaterial({ color: 0x898D91 }));
craterInnerRim.rotation.x = Math.PI / 2;
craterInnerRim.position.y = CUP_H;

moonCrater.add(craterFootprint, craterBowl, craterPit, craterInnerRim);
moonCrater.position.set(0, 0, CUP_Z);
moonCrater.visible = false;
moonCrater.traverse(part => {
  if (part.isMesh) {
    part.castShadow = true;
    part.receiveShadow = true;
  }
});
scene.add(moonCrater);

// Prügiämber kasutab mängus sama sihtmärgi asukohta ja tabamisala mis tops.
const trashBin = new THREE.Group();
const binWall = new THREE.Mesh(
  new THREE.CylinderGeometry(BIN_R, BIN_R * 0.82, BIN_H, 32, 1, true),
  new THREE.MeshLambertMaterial({ color: 0x48565B, side: THREE.DoubleSide }));
binWall.position.y = BIN_H / 2;
binWall.castShadow = true;
const binBottom = new THREE.Mesh(
  new THREE.CylinderGeometry(BIN_R * 0.82, BIN_R * 0.82, 0.025, 32),
  new THREE.MeshLambertMaterial({ color: 0x283237 }));
binBottom.position.y = 0.025;
const binOpening = new THREE.Mesh(
  new THREE.TorusGeometry(BIN_INNER_R, 0.012, 8, 32),
  new THREE.MeshLambertMaterial({ color: 0x20272A }));
binOpening.rotation.x = Math.PI / 2;
binOpening.position.y = BIN_H;
const binRim = new THREE.Mesh(
  new THREE.TorusGeometry(BIN_R * 0.94, 0.022, 8, 32),
  new THREE.MeshLambertMaterial({ color: 0x273236 }));
binRim.rotation.x = Math.PI / 2;
binRim.position.y = BIN_H;

const binBaseRing = new THREE.Mesh(
  new THREE.TorusGeometry(BIN_R * 0.79, 0.025, 8, 32),
  new THREE.MeshLambertMaterial({ color: 0x303B3F }));
binBaseRing.rotation.x = Math.PI / 2;
binBaseRing.position.y = 0.07;

const binRibs = [];
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const rib = new THREE.Mesh(
    new THREE.BoxGeometry(0.018, BIN_H * 0.66, 0.014),
    new THREE.MeshLambertMaterial({ color: 0x657579 }));
  const radius = BIN_R * 0.96;
  rib.position.set(Math.sin(angle) * radius, BIN_H * 0.51, Math.cos(angle) * radius);
  rib.rotation.y = angle;
  binRibs.push(rib);
}

trashBin.add(binWall, binBottom, binOpening, binRim, binBaseRing, ...binRibs);
trashBin.position.set(0, 0, CUP_Z);
trashBin.visible = false;
trashBin.traverse(part => {
  if (part.isMesh) part.castShadow = true;
});
scene.add(trashBin);

function updateTargetAppearance() {
  const isClassroom = environmentSelect.value === "classroom";
  const isMoon = environmentSelect.value === "moon";
  cup.visible = !isClassroom && !isMoon;
  trashBin.visible = isClassroom;
  moonCrater.visible = isMoon;
}

function getTarget() {
  if (environmentSelect.value === "classroom") return trashBin;
  return environmentSelect.value === "moon" ? moonCrater : cup;
}

environmentSelect.addEventListener("change", updateTargetAppearance);
updateTargetAppearance();

const targetFlashMaterials = [];
[cup, trashBin, moonCrater].forEach(target => target.traverse(part => {
  if (part.isMesh && part.material && part.material.emissive) {
    targetFlashMaterials.push({
      material: part.material,
      emissive: part.material.emissive.clone(),
      intensity: part.material.emissiveIntensity
    });
  }
}));
const targetFlashDuration = 0.42;
const targetFlashColor = new THREE.Color(0xFFF1A8);
let targetFlashTime = 0;
const visualEffects = [];
const dustParticleGeometry = new THREE.SphereGeometry(1, 8, 6);

function flashTarget() {
  targetFlashTime = targetFlashDuration;
}

function addCollisionFlash(position) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xFFE58A, transparent: true, depthWrite: false }));
  mesh.position.copy(position);
  scene.add(mesh);
  visualEffects.push({ mesh, velocity: new THREE.Vector3(), duration: 0.2, age: 0, type: "flash" });
}

function addMoonDust(position) {
  if (environmentSelect.value !== "moon") return;

  for (let i = 0; i < 12; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: i % 2 ? 0xA7A9A8 : 0xD0D0CC,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(dustParticleGeometry, material);
    mesh.scale.setScalar(0.035 + Math.random() * 0.045);
    mesh.position.copy(position);
    mesh.position.x += (Math.random() - 0.5) * 0.16;
    mesh.position.y += Math.random() * 0.035;
    mesh.position.z += (Math.random() - 0.5) * 0.16;
    scene.add(mesh);
    visualEffects.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.65,
        0.25 + Math.random() * 0.55,
        (Math.random() - 0.5) * 0.65),
      duration: 0.65 + Math.random() * 0.35,
      age: 0,
      type: "dust"
    });
  }
}

function updateVisualEffects(dt) {
  targetFlashTime = Math.max(0, targetFlashTime - dt);
  const flashProgress = 1 - targetFlashTime / targetFlashDuration;
  const flashStrength = targetFlashTime > 0
    ? Math.pow(Math.max(0, Math.sin(flashProgress * Math.PI * 6)), 2)
    : 0;
  targetFlashMaterials.forEach(({ material, emissive, intensity }) => {
    material.emissive.copy(emissive).lerp(targetFlashColor, flashStrength);
    material.emissiveIntensity = intensity + flashStrength * 1.8;
  });

  for (let i = visualEffects.length - 1; i >= 0; i--) {
    const effect = visualEffects[i];
    effect.age += dt;
    const progress = Math.min(1, effect.age / effect.duration);
    effect.mesh.position.addScaledVector(effect.velocity, dt);

    if (effect.type === "flash") {
      effect.mesh.scale.setScalar(0.35 + progress * 2.4);
      effect.mesh.material.opacity = 1 - progress;
    } else {
      effect.velocity.y -= dt * 0.18;
      effect.velocity.multiplyScalar(Math.max(0, 1 - dt * 1.3));
      effect.mesh.scale.multiplyScalar(1 + dt * 1.5);
      effect.mesh.material.opacity = 0.55 * (1 - progress);
    }

    if (progress >= 1) {
      scene.remove(effect.mesh);
      effect.mesh.material.dispose();
      if (effect.type === "flash") effect.mesh.geometry.dispose();
      visualEffects.splice(i, 1);
    }
  }
}


// ---------- Alustass ----------
// Sinine ketas, mis ilmub vahel topsi peale ja põrgatab keha tagasi.
// Alguses on see peidetud (visible = false).
const coaster = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R * 1.5, CUP_R * 1.5, 0.03, 28),
  new THREE.MeshLambertMaterial({ color: 0x3E5C9A }));
coaster.castShadow = true;
coaster.visible = false;
scene.add(coaster);


// ---------- Visatavad esemed ----------
// Teeb väikese roboti kastidest: keha, käed, silmad ja neli jalga.
// u = ühe "klotsi" suurus meetrites. Kõik mõõdud korrutatakse sellega.
function robot() {
  const u = 0.019;
  const g = new THREE.Group();
  const clay = new THREE.MeshLambertMaterial({ color: 0xD97757 }); // oranž
  const wht = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });  // valge (silmad)

  // Abifunktsioon: teeb ühe kasti laiusega w, kõrgusega h, sügavusega d
  // kohta x, y, z ja lisab selle robotile.
  const box = (w, h, d, x, y, z, m) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w * u, h * u, d * u), m);
    b.position.set(x * u, y * u, z * u);
    b.castShadow = true;
    g.add(b);
    return b;
  };

  box(12, 8, 6, 0, 0, 0, clay);        // keha
  box(16, 2, 5.2, 0, -1.1, 0, clay);   // käed (lai riba keha all)
  box(1.1, 2.1, 0.6, -2.6, 1.7, 3.05, wht); // vasak silm
  box(1.1, 2.1, 0.6, 2.6, 1.7, 3.05, wht);  // parem silm
  box(0.9, 2, 4, -4.1, -5, 0, clay);   // jalg 1
  box(0.9, 2, 4, -1.6, -5, 0, clay);   // jalg 2
  box(0.9, 2, 4, 1.6, -5, 0, clay);    // jalg 3
  box(0.9, 2, 4, 4.1, -5, 0, clay);    // jalg 4
  return g;
}

function ball() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 20, 14),
    new THREE.MeshLambertMaterial({ color: 0x4D8BC9 }));
  mesh.castShadow = true;
  return mesh;
}

function rock() {
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.12, 0),
    new THREE.MeshLambertMaterial({ color: 0x777B73 }));
  mesh.scale.set(1.15, 0.85, 1);
  mesh.castShadow = true;
  return mesh;
}

function paperPlane() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.2);
  shape.lineTo(-0.16, 0.08);
  shape.lineTo(-0.025, 0.025);
  shape.lineTo(0, 0.12);
  shape.lineTo(0.025, 0.025);
  shape.lineTo(0.16, 0.08);
  shape.closePath();

  const plane = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshLambertMaterial({ color: 0x3478D4, side: THREE.DoubleSide }));
  plane.rotation.x = Math.PI / 2;
  plane.castShadow = true;
  return plane;
}

function pencilCase() {
  const g = new THREE.Group();
  const caseShape = new THREE.Shape();
  caseShape.moveTo(-0.155, -0.075);
  caseShape.quadraticCurveTo(-0.155, -0.065, -0.155, 0.075);
  caseShape.quadraticCurveTo(-0.155, 0.075, -0.12, 0.075);
  caseShape.lineTo(0.12, 0.075);
  caseShape.quadraticCurveTo(0.155, 0.075, 0.155, 0.04);
  caseShape.lineTo(0.155, -0.04);
  caseShape.quadraticCurveTo(0.155, -0.075, 0.12, -0.075);
  caseShape.closePath();

  const caseGeometry = new THREE.ExtrudeGeometry(caseShape, {
    depth: 0.13,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.018,
    bevelThickness: 0.012,
    curveSegments: 8
  });
  caseGeometry.translate(0, 0, -0.065);
  const body = new THREE.Mesh(
    caseGeometry,
    new THREE.MeshLambertMaterial({ color: 0xD97757 }));
  body.castShadow = true;
  g.add(body);

  // Pinali selge lukuserv ja tasku võimaldab seda viskel paremini eristada.
  const zipper = new THREE.Mesh(
    new THREE.BoxGeometry(0.27, 0.012, 0.008),
    new THREE.MeshLambertMaterial({ color: 0xE8C86A }));
  zipper.position.set(0, 0.087, 0.015);
  g.add(zipper);

  const zipperPull = new THREE.Mesh(
    new THREE.TorusGeometry(0.018, 0.006, 8, 16),
    new THREE.MeshLambertMaterial({ color: 0x8A6D34 }));
  zipperPull.position.set(0.12, 0.10, 0.015);
  zipperPull.scale.y = 1.35;
  g.add(zipperPull);

  const label = new THREE.Mesh(
    new THREE.BoxGeometry(0.105, 0.026, 0.008),
    new THREE.MeshLambertMaterial({ color: 0xF2D2A2 }));
  label.position.set(-0.055, 0.018, 0.077);
  g.add(label);

  const labelLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.068, 0.006, 0.009),
    new THREE.MeshLambertMaterial({ color: 0xA95C43 }));
  labelLine.position.set(-0.055, 0.018, 0.082);
  g.add(labelLine);
  return g;
}

function pen() {
  const g = new THREE.Group();
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.022, 0.23, 16),
    new THREE.MeshLambertMaterial({ color: 0x347A66 }));
  barrel.rotation.z = Math.PI / 2;
  barrel.castShadow = true;
  g.add(barrel);

  // Pastaka otsal on metallist tipp, lindid ja klamber ning klamber annab kujule rohkem detaile.
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.024, 0.075, 16),
    new THREE.MeshLambertMaterial({ color: 0x24594A }));
  cap.rotation.z = Math.PI / 2;
  cap.position.x = -0.152;
  cap.castShadow = true;
  g.add(cap);

  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.023, 0.017, 0.065, 16),
    new THREE.MeshLambertMaterial({ color: 0x173F35 }));
  grip.rotation.z = Math.PI / 2;
  grip.position.x = 0.145;
  g.add(grip);

  const gripBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.023, 0.004, 8, 16),
    new THREE.MeshLambertMaterial({ color: 0xE8C86A }));
  gripBand.rotation.y = Math.PI / 2;
  gripBand.position.x = 0.118;
  g.add(gripBand);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.017, 0.055, 12),
    new THREE.MeshLambertMaterial({ color: 0xBFC5C3 }));
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 0.207;
  g.add(tip);

  const ink = new THREE.Mesh(
    new THREE.SphereGeometry(0.006, 8, 6),
    new THREE.MeshLambertMaterial({ color: 0x1B1F22 }));
  ink.position.x = 0.237;
  g.add(ink);

  const clip = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.012, 0.008),
    new THREE.MeshLambertMaterial({ color: 0xE8C86A }));
  clip.position.set(-0.07, 0.032, 0);
  clip.rotation.z = -0.12;
  g.add(clip);
  return g;
}

function pencil() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.29, 6),
    new THREE.MeshLambertMaterial({ color: 0xE5B94F }));
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  g.add(body);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.022, 0.06, 6),
    new THREE.MeshLambertMaterial({ color: 0xD8B78A }));
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 0.175;
  g.add(tip);
  return g;
}

function pillow() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.12, -0.14);
  shape.bezierCurveTo(-0.16, -0.14, -0.19, -0.12, -0.19, -0.08);
  shape.lineTo(-0.19, 0.08);
  shape.bezierCurveTo(-0.19, 0.12, -0.16, 0.14, -0.12, 0.14);
  shape.bezierCurveTo(-0.07, 0.14, -0.03, 0.13, 0, 0.135);
  shape.bezierCurveTo(0.03, 0.13, 0.07, 0.14, 0.12, 0.14);
  shape.bezierCurveTo(0.16, 0.14, 0.19, 0.12, 0.19, 0.08);
  shape.lineTo(0.19, -0.08);
  shape.bezierCurveTo(0.19, -0.12, 0.16, -0.14, 0.12, -0.14);
  shape.bezierCurveTo(0.07, -0.14, 0.03, -0.13, 0, -0.135);
  shape.bezierCurveTo(-0.03, -0.13, -0.07, -0.14, -0.12, -0.14);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.04,
    curveSegments: 10
  });
  geometry.translate(0, 0, -0.1);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial({ color: 0xE8E1D2 }));
  mesh.castShadow = true;
  return mesh;
}

const throwables = {
  robot: robot(),
  ball: ball(),
  rock: rock(),
  paperPlane: paperPlane(),
  pen: pen(),
  pencilCase: pencilCase(),
  pencil: pencil(),
  pillow: pillow()
};

// Tok on valitud visatav ese; teised jäävad stseenis peidetuks.
let tok = throwables.robot;
Object.values(throwables).forEach(item => {
  item.visible = item === tok;
  scene.add(item);
});

// Näitab lennu all maapinnale pehmet varju.
const tokenShadow = new THREE.Mesh(
  new THREE.CircleGeometry(1, 32),
  new THREE.MeshBasicMaterial({ color: 0x26352D, transparent: true, opacity: 0.22, depthWrite: false }));
tokenShadow.rotation.x = -Math.PI / 2;
tokenShadow.position.y = 0.006;
tokenShadow.visible = false;
scene.add(tokenShadow);

// Jätab viimase viske lennujoone mänguväljale.
const trailCapacity = 1200;
const trailGeometry = new THREE.BufferGeometry();
const trailPositions = new Float32Array(trailCapacity * 3);
trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
trailGeometry.setDrawRange(0, 0);
const throwTrail = new THREE.Line(
  trailGeometry,
  new THREE.LineBasicMaterial({ color: 0xD97757, transparent: true, opacity: 0.38, depthWrite: false }));
throwTrail.visible = false;
throwTrail.frustumCulled = false;
scene.add(throwTrail);
let trailCount = 0;

function clearThrowTrail() {
  trailCount = 0;
  trailGeometry.setDrawRange(0, 0);
  throwTrail.visible = false;
}

function recordThrowTrailPoint(position) {
  if (trailCount >= trailCapacity) return;
  trailGeometry.attributes.position.setXYZ(trailCount, position.x, position.y, position.z);
  trailCount++;
  trailGeometry.setDrawRange(0, trailCount);
  trailGeometry.attributes.position.needsUpdate = true;
  throwTrail.visible = trailCount > 1;
}

function updateTokenShadow() {
  const height = Math.max(0, tok.position.y - 0.06);
  tokenShadow.visible = true;
  tokenShadow.position.set(tok.position.x, 0.006, tok.position.z);
  tokenShadow.scale.set(0.16 + height * 0.06, 0.09 + height * 0.035, 1);
  tokenShadow.material.opacity = Math.max(0.06, 0.22 - height * 0.025);
}

// Vahetab visatava eseme välja ainult uue viske sihtimise ajal.
const objectSelect = $("objectSelect");
objectSelect.addEventListener("change", () => {
  if (state !== "aim") {
    objectSelect.value = Object.keys(throwables).find(key => throwables[key] === tok);
    return;
  }

  tok.visible = false;
  tok = throwables[objectSelect.value];
  tok.visible = true;
  resetToken();
});
