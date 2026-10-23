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

// Prügiämber kasutab mängus sama sihtmärgi asukohta ja tabamisala mis tops.
const trashBin = new THREE.Group();
const binWall = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R, CUP_R * 0.82, CUP_H, 24, 1, true),
  new THREE.MeshLambertMaterial({ color: 0x48565B, side: THREE.DoubleSide }));
binWall.position.y = CUP_H / 2;
binWall.castShadow = true;
const binBottom = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R * 0.82, CUP_R * 0.82, 0.025, 24),
  new THREE.MeshLambertMaterial({ color: 0x283237 }));
binBottom.position.y = 0.025;
const binOpening = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R * 0.78, CUP_R * 0.78, 0.012, 24),
  new THREE.MeshLambertMaterial({ color: 0x20272A }));
binOpening.position.y = CUP_H - 0.025;
const binRim = new THREE.Mesh(
  new THREE.TorusGeometry(CUP_R * 0.94, 0.018, 8, 24),
  new THREE.MeshLambertMaterial({ color: 0x273236 }));
binRim.rotation.x = Math.PI / 2;
binRim.position.y = CUP_H;

const labelCanvas = document.createElement("canvas");
labelCanvas.width = 256;
labelCanvas.height = 96;
const labelContext = labelCanvas.getContext("2d");
labelContext.fillStyle = "#E6D783";
labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
labelContext.fillStyle = "#263A31";
labelContext.font = "bold 46px sans-serif";
labelContext.textAlign = "center";
labelContext.textBaseline = "middle";
labelContext.fillText("PRÜGI", 128, 49);
const binLabel = new THREE.Mesh(
  new THREE.PlaneGeometry(0.22, 0.082),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(labelCanvas) }));
binLabel.position.set(0, CUP_H * 0.55, CUP_R * 0.91);
trashBin.add(binWall, binBottom, binOpening, binRim, binLabel);
trashBin.position.set(0, 0, CUP_Z);
trashBin.visible = false;
trashBin.traverse(part => {
  if (part.isMesh) part.castShadow = true;
});
scene.add(trashBin);

function updateTargetAppearance() {
  const isClassroom = environmentSelect.value === "classroom";
  cup.visible = !isClassroom;
  trashBin.visible = isClassroom;
}

environmentSelect.addEventListener("change", updateTargetAppearance);
updateTargetAppearance();


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
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.31, 0.13, 0.13),
    new THREE.MeshLambertMaterial({ color: 0xD97757 }));
  body.castShadow = true;
  g.add(body);

  const zipper = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.008, 0.012),
    new THREE.MeshLambertMaterial({ color: 0xE8C86A }));
  zipper.position.y = 0.069;
  g.add(zipper);
  return g;
}

function pen() {
  const g = new THREE.Group();
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.29, 12),
    new THREE.MeshLambertMaterial({ color: 0x347A66 }));
  barrel.rotation.z = Math.PI / 2;
  barrel.castShadow = true;
  g.add(barrel);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.022, 0.055, 12),
    new THREE.MeshLambertMaterial({ color: 0xB5B9B5 }));
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 0.17;
  g.add(tip);
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
