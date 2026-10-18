// =====================================================================
// stseen.js – 3D-MAAILM: TAUST, KAAMERA, VALGUS, PÕRAND
// ---------------------------------------------------------------------
// Vastutaja: KUNSTNIK
// Siin luuakse kõik, mis on "lava": taust, udu, kaamera, valgus,
// põrand ja ruudustik. Mängu objektid (tops, robot) on objektid.js failis.
// =====================================================================


// Leht, kuhu 3D-pilt joonistatakse (vt index.html: <div id="stage">).
const stage = $("stage");


// ---------- Stseen ----------
// Stseen on 3D-maailm, kuhu kõik objektid lisatakse (scene.add(...)).
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEDF1EE); // taustavärv (helehall-roheline)
scene.fog = new THREE.Fog(0xEDF1EE, 13, 30);  // udu: algab 13 m kaugusel, 30 m pealt on kõik udu sees


// ---------- Kaamera ----------
// Kaamera on "silm", mille kaudu mängija maailma näeb.
// 50 = vaatenurk kraadides, 0.1 ja 80 = kui lähedal ja kui kaugel asju veel näidatakse.
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 80);
camera.position.set(0, 2.15, 2.5);   // kaamera asukoht: mängija taga ja veidi kõrgemal
camera.lookAt(0, 0.45, -4.6);        // kaamera vaatab topsi suunas


// ---------- Joonistaja (renderer) ----------
// Renderer joonistab stseeni kaamera vaatest ekraanile.
const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias = siledamad servad
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));         // teravus (max 2x, et telefon ei aeglustuks)
renderer.setSize(innerWidth, innerHeight);                     // pilt üle terve ekraani
renderer.shadowMap.enabled = true;                             // varjud sisse
renderer.shadowMap.type = THREE.PCFSoftShadowMap;              // pehmed varjud
stage.appendChild(renderer.domElement);                        // pane pilt lehele


// ---------- Valgus ----------
// Taevavalgus: valgustab kõike ühtlaselt, ülevalt valge ja alt rohekas.
scene.add(new THREE.HemisphereLight(0xffffff, 0xC3D2CB, 0.85));

// Päike: tuleb ühest suunast ja teeb varje.
const sun = new THREE.DirectionalLight(0xffffff, 0.72);
sun.position.set(4, 8, 4);          // päike on paremal, üleval ja mängija taga
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); // varjude teravus
// ala, kuhu päike varje teeb (vasak, parem, üles, alla)
sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
sun.shadow.camera.top = 10;  sun.shadow.camera.bottom = -10;
scene.add(sun);


// ---------- Põrand ----------
// 40 x 40 m suurune tasapind, mis on pööratud pikali (muidu seisaks püsti nagu sein).
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshLambertMaterial({ color: 0xE3EAE6 }));
floor.rotation.x = -Math.PI / 2;   // pööra 90° pikali
floor.receiveShadow = true;        // põrandale tekivad varjud
scene.add(floor);

// Ruudustik põrandal (1 ruut = 1 meeter). Aitab kaugust hinnata.
const grid = new THREE.GridHelper(40, 40, 0xB3C6BE, 0xCBD8D2);
grid.position.y = 0.002;           // natuke põrandast kõrgemal, et ei vilguks
scene.add(grid);


// ---------- Ekraani suuruse muutus ----------
// Kui brauseri akent muudetakse või telefon keeratakse,
// kohandatakse kaamera ja pilt uue suurusega.
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
