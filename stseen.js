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
// Canvasel tehtud muru-muster hoiab kogu Maa-põranda näha rohelise rohuna.
const grassCanvas = document.createElement("canvas");
grassCanvas.width = 128;
grassCanvas.height = 128;
const grassContext = grassCanvas.getContext("2d");
grassContext.fillStyle = "#4D9B55";
grassContext.fillRect(0, 0, 128, 128);

for (let i = 0; i < 260; i++) {
  const x = (i * 47 + (i % 7) * 13) % 128;
  const y = (i * 71 + (i % 5) * 17) % 128;
  const length = 3 + (i % 5);
  grassContext.strokeStyle = i % 3 === 0 ? "#397F42" : (i % 3 === 1 ? "#62A95F" : "#558F4B");
  grassContext.lineWidth = 1;
  grassContext.beginPath();
  grassContext.moveTo(x, y);
  grassContext.lineTo(x + ((i % 9) - 4) * 0.25, y - length);
  grassContext.stroke();
}

const grassTexture = new THREE.CanvasTexture(grassCanvas);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(20, 20);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160),
  new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: grassTexture }));
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
  const onEarthNormalSurface =
    surfaceSelect.value === "normal" && environmentSelect.value === "earth";
  if (onEarthNormalSurface) {
    floor.material.map = grassTexture;
    floor.material.color.set(0xFFFFFF);
  } else {
    floor.material.map = null;
    const color = surfaceColors[surfaceSelect.value] || normalColors[environmentSelect.value] || normalColors.earth;
    floor.material.color.set(color);
  }
  floor.material.needsUpdate = true;
  grid.visible = surfaceSelect.value === "normal" && environmentSelect.value === "earth";
}

surfaceSelect.addEventListener("change", updateFloorAppearance);


// ---------- Maa maastik ----------
const earthLandscape = new THREE.Group();
scene.add(earthLandscape);
const movingClouds = [];

function resetCloudPositions() {
  movingClouds.forEach(({ cloud, start }) => cloud.position.copy(start));
}

function updateClouds(dt) {
  if (!earthLandscape.visible) return;

  movingClouds.forEach(({ cloud }) => {
    cloud.position.x += windVelocity.x * dt;
    cloud.position.z += windVelocity.z * dt;

    if (cloud.position.x > 20) cloud.position.x -= 40;
    else if (cloud.position.x < -20) cloud.position.x += 40;
    if (cloud.position.z > -8) cloud.position.z -= 40;
    else if (cloud.position.z < -48) cloud.position.z += 40;
  });
}

// Lisab maastikule ühe neljast erineva kujuga puu.
function addTree(x, z, scale, style) {
  const tree = new THREE.Group();
  const trunkColors = [0x6B4A32, 0x7A5638, 0x5D4938];
  const trunkMaterial = new THREE.MeshLambertMaterial({
    color: trunkColors[Math.abs(Math.round(x + z)) % trunkColors.length]
  });
  const foliageColors = [0x245F36, 0x347D43, 0x2F6F3B, 0x487E3C];
  const foliageMaterial = new THREE.MeshLambertMaterial({
    color: foliageColors[(Math.abs(Math.round(x * 10)) + style) % foliageColors.length]
  });

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(style === 3 ? 0.08 : 0.13, style === 3 ? 0.12 : 0.22, 1.8, 9),
    trunkMaterial);
  trunk.position.y = 0.9;
  trunk.rotation.z = (style % 3 - 1) * 0.025;
  tree.add(trunk);

  if (style === 0) {
    // Kõrge okaspuu: ebatasased kihilised võrad.
    [1.05, 0.82, 0.58].forEach((radius, index) => {
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(radius, 1.35, 8),
        foliageMaterial);
      foliage.position.set(index === 1 ? 0.08 : 0, 1.55 + index * 0.72, index * 0.05);
      foliage.rotation.y = index * 0.42;
      tree.add(foliage);
    });
  } else if (style === 1) {
    // Laia krooniga tamm: oksad ja mitme tükiga rohke võra.
    [-1, 1].forEach(side => {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.07, 1.15, 7),
        trunkMaterial);
      branch.position.set(side * 0.38, 1.72, 0);
      branch.rotation.z = side * 0.72;
      tree.add(branch);
    });
    [[-0.55, 2.18, 0, 0.67], [0.52, 2.12, 0.05, 0.72],
      [-0.08, 2.58, -0.08, 0.82], [0.18, 1.78, 0.38, 0.62],
      [-0.12, 2.05, -0.42, 0.58]]
      .forEach(([cx, cy, cz, radius], index) => {
        const foliage = new THREE.Mesh(
          new THREE.IcosahedronGeometry(radius, 1),
          index % 2 === 0 ? foliageMaterial : new THREE.MeshLambertMaterial({
            color: foliageColors[(style + index) % foliageColors.length]
          }));
        foliage.position.set(cx, cy, cz);
        foliage.scale.set(1.05, 0.82, 0.92);
        tree.add(foliage);
      });
  } else if (style === 2) {
    // Ümar pärna või puju kujuga lehtpuu, mille võra on kihiline.
    [[-0.48, 1.95, 0.05, 0.58], [0.42, 2.05, -0.02, 0.64],
      [0, 2.48, 0.12, 0.75], [-0.12, 1.55, 0.22, 0.52]]
      .forEach(([cx, cy, cz, radius], index) => {
        const foliage = new THREE.Mesh(
          new THREE.IcosahedronGeometry(radius, 1),
          index === 2 ? foliageMaterial : new THREE.MeshLambertMaterial({
            color: foliageColors[(style + index) % foliageColors.length]
          }));
        foliage.position.set(cx, cy, cz);
        foliage.scale.set(1.15, 0.95, 1);
        tree.add(foliage);
      });
  } else {
    // Kaski meenutav kitsas puu, valge hallikas tüvi ja väikesed võrad.
    trunkMaterial.color.set(0xA9A18B);
    [[-0.32, 2.05, 0, 0.48], [0.38, 2.28, 0.08, 0.52],
      [0, 2.72, -0.12, 0.58], [-0.18, 1.58, 0.15, 0.42]]
      .forEach(([cx, cy, cz, radius], index) => {
        const foliage = new THREE.Mesh(
          new THREE.IcosahedronGeometry(radius, 1),
          index % 2 === 0 ? foliageMaterial : new THREE.MeshLambertMaterial({
            color: foliageColors[(style + index) % foliageColors.length]
          }));
        foliage.position.set(cx, cy, cz);
        foliage.scale.set(0.9, 1.05, 0.85);
        tree.add(foliage);
      });
    [-1, 1].forEach(side => {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.055, 0.95, 6),
        trunkMaterial);
      branch.position.set(side * 0.28, 1.68, 0);
      branch.rotation.z = side * 0.92;
      tree.add(branch);
    });
  }

  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  tree.rotation.y = (Math.abs(Math.round(x * 17 + z * 3)) % 8) * 0.12;
  tree.traverse(part => {
    if (part.isMesh) {
      part.castShadow = true;
      part.receiveShadow = true;
    }
  });
  earthLandscape.add(tree);
}

[
  [-5.5, -13, 1.2, 0],
  [5.5, -13, 1.15, 1],
  [-8.5, -19, 1.65, 2],
  [8.5, -19, 1.55, 3],
  [-4.5, -24, 1.9, 1],
  [4.5, -24, 1.75, 0],
  [-10.5, -29, 1.45, 3],
  [10.5, -32, 1.6, 2],
  [-7, -36, 1.25, 0],
  [7, -40, 1.85, 1]
].forEach(([x, z, scale, style]) => addTree(x, z, scale, style));

// Lisab maapinnale väikesed mitme kõrrega murukobarad.
function addGrassPatch(x, z, scale) {
  const grass = new THREE.Group();
  const grassMaterials = [
    new THREE.MeshLambertMaterial({ color: 0x4E934E, side: THREE.DoubleSide }),
    new THREE.MeshLambertMaterial({ color: 0x669B50, side: THREE.DoubleSide }),
    new THREE.MeshLambertMaterial({ color: 0x3D7F43, side: THREE.DoubleSide })
  ];

  for (let bladeIndex = 0; bladeIndex < 5; bladeIndex++) {
    const blade = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.32 + (bladeIndex % 3) * 0.055, 3),
      grassMaterials[bladeIndex % grassMaterials.length]);
    const angle = bladeIndex * 1.31 + (x + z) * 0.07;
    blade.position.set(
      Math.cos(angle) * (0.05 + (bladeIndex % 2) * 0.04),
      0.16,
      Math.sin(angle) * (0.05 + (bladeIndex % 2) * 0.04));
    blade.rotation.z = Math.sin(angle) * 0.16;
    blade.rotation.x = Math.cos(angle) * 0.12;
    grass.add(blade);
  }

  grass.position.set(x, 0, z);
  grass.scale.setScalar(scale);
  grass.rotation.y = (Math.abs(Math.round(x * 19 + z * 11)) % 12) * 0.45;
  earthLandscape.add(grass);
}

for (let row = 0; row < 13; row++) {
  for (let column = 0; column < 20; column++) {
    const x = -18 + column * 1.9 + ((row % 2) * 0.65);
    const z = -42 + row * 5.2;
    const patchScale = 0.75 + ((row * 7 + column * 11) % 5) * 0.12;
    addGrassPatch(x, z, patchScale);
  }
}

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
  movingClouds.push({ cloud, start: cloud.position.clone() });
}

addCloud(-7, 5.5, -19, 1.3);
addCloud(7.5, 6.5, -27, 1.7);
addCloud(-1.5, 7, -36, 1.9);
addCloud(1.5, 5.8, -14, 0.9);
addCloud(-12, 6.8, -25, 1.4);
addCloud(12.5, 5.2, -34, 1.1);
addCloud(-5, 8, -43, 1.6);
addCloud(8, 7.8, -45, 1.3);
addCloud(0, 5.4, -23, 0.85);


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
  resetCloudPositions();
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
