// =====================================================================
// stseen.js – 3D-MAAILM: TAUST, KAAMERA, VALGUS, PÕRAND
// ---------------------------------------------------------------------
// Vastutaja: KUNSTNIK
// Siin luuakse kõik, mis on "lava": taust, udu, kaamera, valgus,
// põrand ja ruudustik. Mängu objektid (tops, robot) on objektid.js failis.
// =====================================================================


// Leht, kuhu 3D-pilt joonistatakse (vt index.html: <div id="stage">).
const stage = $("stage");
const environmentSelect = $("environmentSelect");
const surfaceSelect = $("surfaceSelect");


// ---------- Stseen ----------
// Stseen on 3D-maailm, kuhu kõik objektid lisatakse (scene.add(...)).
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xA8D5F0, 13, 42);


// ---------- Taevas ----------
// Suur sisepinnaga kera katab vaate ning teeb horisondini sujuva värviülemineku.
const skyMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  uniforms: {
    topColor: { value: new THREE.Color(0x328CCB) },
    horizonColor: { value: new THREE.Color(0xC9E9F7) },
    bottomColor: { value: new THREE.Color(0xA8D5F0) }
  },
  vertexShader: `
    varying vec3 skyDirection;
    void main() {
      skyDirection = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 horizonColor;
    uniform vec3 bottomColor;
    varying vec3 skyDirection;
    void main() {
      float height = normalize(skyDirection).y;
      vec3 color = mix(horizonColor, topColor, smoothstep(-0.04, 0.72, height));
      color = mix(bottomColor, color, smoothstep(-0.55, -0.02, height));
      gl_FragColor = vec4(color, 1.0);
    }
  `
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 20), skyMaterial);
sky.renderOrder = -1;
scene.add(sky);


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
const ambientLight = new THREE.HemisphereLight(0xffffff, 0xC3D2CB, 0.85);
scene.add(ambientLight);

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
// 160 x 160 m suurune tasapind, mis on pööratud pikali (muidu seisaks püsti nagu sein).
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160),
  new THREE.MeshLambertMaterial({ color: 0x4D9B55 }));
floor.rotation.x = -Math.PI / 2;   // pööra 90° pikali
floor.receiveShadow = true;        // põrandale tekivad varjud
scene.add(floor);

// Ruudustik põrandal (1 ruut = 1 meeter). Aitab kaugust hinnata.
const grid = new THREE.GridHelper(40, 40, 0x397B42, 0x43874A);
grid.position.y = 0.002;           // natuke põrandast kõrgemal, et ei vilguks
grid.material.transparent = true;
grid.material.opacity = 0.16;
scene.add(grid);

function updateFloorAppearance() {
  const normalColors = {
    earth: 0x4D9B55,
    moon: 0x92969A,
    classroom: 0xB58A5B
  };
  const surfaceColors = {
    rubber: 0x343B3A,
    mud: 0x59412C,
    sand: 0xD6BF83
  };
  const color = surfaceColors[surfaceSelect.value] || normalColors[environmentSelect.value] || normalColors.earth;
  floor.material.color.set(color);
  grid.visible = surfaceSelect.value === "normal" && environmentSelect.value === "earth";
}

surfaceSelect.addEventListener("change", updateFloorAppearance);


// ---------- Maa maastik ----------
const earthLandscape = new THREE.Group();
scene.add(earthLandscape);

function addTree(x, z, scale) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.17, 1.2, 7),
    new THREE.MeshLambertMaterial({ color: 0x755139 }));
  trunk.position.y = 0.6;
  tree.add(trunk);

  const foliage = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 2.3, 8),
    new THREE.MeshLambertMaterial({ color: 0x267344 }));
  foliage.position.y = 2.15;
  tree.add(foliage);
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  tree.traverse(part => {
    if (part.isMesh) {
      part.castShadow = true;
      part.receiveShadow = true;
    }
  });
  earthLandscape.add(tree);
}

[-1, 1].forEach(side => {
  addTree(side * 5.5, -13, 1.2);
  addTree(side * 8.5, -19, 1.65);
  addTree(side * 4.5, -24, 1.9);
});

function addCloud(x, y, z, scale) {
  const cloud = new THREE.Group();
  const material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  [[0, 0, 0, 0.75], [0.65, 0.08, 0, 0.55], [-0.62, 0.02, 0, 0.5], [0.15, 0.3, 0, 0.48]]
    .forEach(([cx, cy, cz, radius]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 8), material);
      puff.position.set(cx, cy, cz);
      cloud.add(puff);
    });
  cloud.position.set(x, y, z);
  cloud.scale.setScalar(scale);
  earthLandscape.add(cloud);
}

addCloud(-7, 5.5, -19, 1.3);
addCloud(7.5, 6.5, -27, 1.7);
addCloud(-1.5, 7, -36, 1.9);


// ---------- Kuu taevas ----------
const moonSky = new THREE.Group();
scene.add(moonSky);

const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
for (let i = 0; i < 90; i++) {
  const angle = i * 2.399;
  const x = Math.cos(angle) * (5 + (i % 9) * 1.5);
  const y = 3 + (i % 11) * 1.15;
  const z = -24 - (i % 7) * 5;
  const star = new THREE.Mesh(new THREE.SphereGeometry(i % 8 === 0 ? 0.055 : 0.028, 6, 5), starMaterial);
  star.position.set(x, y, z);
  moonSky.add(star);
}

const earth = new THREE.Group();
const earthGlobe = new THREE.Mesh(
  new THREE.SphereGeometry(1.25, 24, 16),
  new THREE.MeshBasicMaterial({ color: 0x287BB8 }));
earth.add(earthGlobe);
const continentMaterial = new THREE.MeshBasicMaterial({ color: 0x55A66A });
[[0.28, 0.42, 0.9], [-0.38, -0.1, 0.82], [0.55, -0.4, 0.7], [-0.05, -0.62, 0.68]]
  .forEach(([x, y, size]) => {
    const continent = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 8), continentMaterial);
    continent.position.set(x, y, 0.72);
    continent.scale.set(1, 0.72, 0.18);
    earth.add(continent);
  });
earth.position.set(0, 4.7, -25);
moonSky.add(earth);


// ---------- Kuu pind ----------
const moonSurface = new THREE.Group();
scene.add(moonSurface);
const craterMaterial = new THREE.MeshLambertMaterial({ color: 0x53575B });
const craterRimMaterial = new THREE.MeshLambertMaterial({ color: 0x898D91 });
[
  [-2.7, -4.5, 0.8], [2.9, -8.2, 1.05], [-4.2, -10.5, 1.2],
  [0.8, -13.5, 0.72], [5.4, -16, 1.4], [-1.4, -18, 1.05],
  [3.6, -22, 1.15], [-5.8, -25, 1.5], [0.2, -29, 1.25],
  [-3.2, -34, 1.7], [6.5, -38, 1.65]
].forEach(([x, z, radius]) => {
  const crater = new THREE.Mesh(new THREE.CircleGeometry(radius, 20), craterMaterial);
  crater.rotation.x = -Math.PI / 2;
  crater.position.set(x, 0.012, z);
  moonSurface.add(crater);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.88, 0.05, 6, 24),
    craterRimMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(x, 0.035, z);
  moonSurface.add(rim);
});

// ---------- Klassiruum ----------
const classroom = new THREE.Group();
scene.add(classroom);

const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xE7E1D2 });
const trimMaterial = new THREE.MeshLambertMaterial({ color: 0xB6A98F });
const boardMaterial = new THREE.MeshLambertMaterial({ color: 0x285B49 });
const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xA97848 });

const backWall = new THREE.Mesh(new THREE.BoxGeometry(50, 24, 0.35), wallMaterial);
backWall.position.set(0, 9, -31);
classroom.add(backWall);

[-1, 1].forEach(side => {
  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 24, 34), wallMaterial);
  sideWall.position.set(side * 14, 9, -17);
  classroom.add(sideWall);

  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(5.1, 4.1, 0.18), trimMaterial);
  windowFrame.position.set(side * 10.5, 7.5, -30.72);
  classroom.add(windowFrame);
  const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(4.65, 3.65, 0.1),
    new THREE.MeshLambertMaterial({ color: 0x91CBE0, emissive: 0x233B44 }));
  windowGlass.position.set(side * 10.5, 7.5, -30.59);
  classroom.add(windowGlass);
  const windowBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.65, 0.12), trimMaterial);
  windowBar.position.set(side * 10.5, 7.5, -30.5);
  classroom.add(windowBar);
});

const chalkboard = new THREE.Mesh(
  new THREE.BoxGeometry(13, 4.8, 0.22),
  new THREE.MeshLambertMaterial({ color: 0x235440 }));
chalkboard.position.set(0, 5.8, -30.72);
classroom.add(chalkboard);
const boardFrame = new THREE.Mesh(
  new THREE.BoxGeometry(13.4, 5.2, 0.14),
  new THREE.MeshLambertMaterial({ color: 0x755139 }));
boardFrame.position.set(0, 5.8, -30.88);
classroom.add(boardFrame);

const door = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 6.5, 0.18),
  new THREE.MeshLambertMaterial({ color: 0x8B6848 }));
door.position.set(-10, 3.4, -30.65);
classroom.add(door);
const doorKnob = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 8, 6),
  new THREE.MeshLambertMaterial({ color: 0xD6B35F }));
doorKnob.position.set(-9.1, 3.4, -30.48);
classroom.add(doorKnob);

const clock = new THREE.Mesh(
  new THREE.CylinderGeometry(0.85, 0.85, 0.16, 24),
  new THREE.MeshLambertMaterial({ color: 0xF4F0E6 }));
clock.rotation.x = Math.PI / 2;
clock.position.set(10, 9.5, -30.65);
classroom.add(clock);

function addDesk(x, z) {
  const desk = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 1.2), woodMaterial);
  top.position.y = 0.82;
  desk.add(top);
  const legMaterial = new THREE.MeshLambertMaterial({ color: 0x59636A });
  [-1, 1].forEach(sideX => [-1, 1].forEach(sideZ => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.78, 0.09), legMaterial);
    leg.position.set(sideX * 1.08, 0.39, sideZ * 0.48);
    desk.add(leg);
  }));
  const chair = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.8), boardMaterial);
  seat.position.y = 0.48;
  chair.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.8, 0.12), boardMaterial);
  back.position.set(0, 0.88, -0.34);
  chair.add(back);
  [-1, 1].forEach(sideX => [-1, 1].forEach(sideZ => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.46, 0.07), legMaterial);
    leg.position.set(sideX * 0.34, 0.23, sideZ * 0.3);
    chair.add(leg);
  }));
  chair.position.set(0, 0, 1.1);
  desk.add(chair);
  desk.position.set(x, 0, z);
  desk.traverse(part => {
    if (part.isMesh) {
      part.castShadow = true;
      part.receiveShadow = true;
    }
  });
  classroom.add(desk);
}

[-3.7, 3.7].forEach(x => [-9, -15, -21].forEach(z => addDesk(x, z)));

function setEnvironment(environment) {
  const onMoon = environment === "moon";
  const inClassroom = environment === "classroom";
  if (onMoon) {
    skyMaterial.uniforms.topColor.value.set(0x020307);
    skyMaterial.uniforms.horizonColor.value.set(0x05070C);
    skyMaterial.uniforms.bottomColor.value.set(0x05070C);
    scene.fog.color.set(0x777A7E);
    scene.fog.near = 18;
    scene.fog.far = 55;
    ambientLight.color.set(0xDCE5F2);
    ambientLight.groundColor.set(0x575B60);
    ambientLight.intensity = 0.48;
    sun.intensity = 1.15;
  } else if (inClassroom) {
    skyMaterial.uniforms.topColor.value.set(0xD8E4EA);
    skyMaterial.uniforms.horizonColor.value.set(0xD8E4EA);
    skyMaterial.uniforms.bottomColor.value.set(0xD8E4EA);
    scene.fog.color.set(0xE7E1D2);
    scene.fog.near = 28;
    scene.fog.far = 75;
    ambientLight.color.set(0xFFF2D8);
    ambientLight.groundColor.set(0x82735F);
    ambientLight.intensity = 0.8;
    sun.intensity = 0.48;
  } else {
    skyMaterial.uniforms.topColor.value.set(0x328CCB);
    skyMaterial.uniforms.horizonColor.value.set(0xC9E9F7);
    skyMaterial.uniforms.bottomColor.value.set(0xA8D5F0);
    scene.fog.color.set(0xA8D5F0);
    scene.fog.near = 13;
    scene.fog.far = 42;
    ambientLight.color.set(0xFFFFFF);
    ambientLight.groundColor.set(0xC3D2CB);
    ambientLight.intensity = 0.85;
    sun.intensity = 0.72;
  }
  earthLandscape.visible = !onMoon && !inClassroom;
  moonSky.visible = onMoon;
  moonSurface.visible = onMoon;
  classroom.visible = inClassroom;
  updateFloorAppearance();
}

environmentSelect.addEventListener("change", () => setEnvironment(environmentSelect.value));
setEnvironment(environmentSelect.value);


// ---------- Ekraani suuruse muutus ----------
// Kui brauseri akent muudetakse või telefon keeratakse,
// kohandatakse kaamera ja pilt uue suurusega.
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
