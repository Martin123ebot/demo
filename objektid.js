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


// ---------- Alustass ----------
// Sinine ketas, mis ilmub vahel topsi peale ja põrgatab keha tagasi.
// Alguses on see peidetud (visible = false).
const coaster = new THREE.Mesh(
  new THREE.CylinderGeometry(CUP_R * 1.5, CUP_R * 1.5, 0.03, 28),
  new THREE.MeshLambertMaterial({ color: 0x3E5C9A }));
coaster.castShadow = true;
coaster.visible = false;
scene.add(coaster);


// ---------- Visatav keha (robot) ----------
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

// tok = visatav keha. Kui tahta teist keha (pall, pinal jne),
// tuleb teha uus funktsioon nagu robot() ja kasutada seda siin.
const tok = robot();
scene.add(tok);
