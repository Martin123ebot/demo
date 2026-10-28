// =====================================================================
// seaded.js – KÕIK NUMBRID, MIDA MÄNGUS SAAB MUUTA
// ---------------------------------------------------------------------
// See on ÜHINE fail. Siin hoitakse väärtusi, mida kasutavad kõik teised
// failid. Seda faili muudetakse AINULT koos kokku leppides ja ainult
// üks inimene korraga teeb muudatuse + commit'i.
//
// Ühikud: pikkus meetrites (m), aeg sekundites (s), kiirus m/s.
// =====================================================================


// ---------- Planeetide gravitatsioon ----------
// Pinnagravitatsioon meetrites sekundis ruudus.
const PLANETS = [
  { id: "mercury", name: "Merkuur", gravity: 3.70 },
  { id: "venus", name: "Veenus", gravity: 8.87 },
  { id: "moon", name: "Kuu", gravity: 1.62 },
  { id: "earth", name: "Maa", gravity: 9.81 },
  { id: "mars", name: "Marss", gravity: 3.71 },
  { id: "jupiter", name: "Jupiter", gravity: 24.79 },
  { id: "saturn", name: "Saturn", gravity: 10.44 },
  { id: "uranus", name: "Uraan", gravity: 8.69 },
  { id: "neptune", name: "Neptuun", gravity: 11.15 },
  { id: "sun", name: "Päike", gravity: 274.0 }
];


// ---------- Sihtmärk (tops) ----------
const CUP_R = 0.17;   // topsi raadius (m)
const CUP_H = 0.36;   // topsi kõrgus (m)
const CUP_Z = -6.0;   // kui kaugel mängijast tops on (miinus = ekraani sisse)


// ---------- Visatava keha algasukoht ----------
// x = vasak/parem, y = kõrgus, z = edasi/tagasi
const REL = new THREE.Vector3(0, 1.15, -0.2);


// ---------- Viske tugevus ja suund ----------
// Kui palju sõrme tõmme mõjutab viset.
const THROW = {
  minDrag: 28,          // nii palju pikslit peab vähemalt üles tõmbama, muidu viset ei toimu
  fullDrag: 290,        // nii pika tõmbega (pikslites) on vise täie jõuga
  minPower: 0.30,       // nõrgim võimalik vise (0..1)
  minSpeed: 5.0,        // algkiirus nõrgima viske korral (m/s)
  extraSpeed: 5.3,      // nii palju lisandub täie jõuga viskel (m/s) -> max 10.3 m/s
  minAngle: 28,         // väikseim viskenurk (kraadides)
  extraAngle: 24,       // otse üles tõmmates lisandub nurgale see (kraadides) -> max 52°
  sideFactor: 0.00135,  // kui palju külgsuunaline tõmme pöörab viset
  maxSide: 0.24         // suurim külgsuunaline pööre (radiaanides)
};


// ---------- Põrkamine ----------
// Põrkeväärtus 0..1: 1 = põrkab sama kiirusega tagasi, 0 = jääb kohe seisma.
const BOUNCE = {
  ground: 0.42,         // maast põrkamine
  groundFriction: 0.72, // kui palju kiirusest jääb alles pärast maapõrget
  groundCupChance: 0.35,// õnneliku põrke võimalus, kui vise suundub topsi poole
  stopSpeed: 1.1,       // kui kukkumiskiirus on väiksem kui see, jääb keha maha
  rim: 0.35,            // topsi äärest põrkamine
  rimPush: 1.9,         // kui tugevalt topsi äär keha külje peale lükkab
  spinLoss: 0.55        // kui palju pöörlemisest jääb alles pärast maapõrget
};


// ---------- Põranda pinnad ----------
const SURFACE = {
  rubberBounce: 0.92
};


// ---------- Topsi liikumine (raskusaste) ----------
const CUP_MOVE = {
  perStreak: 0.24,      // iga tabamus seerias lisab nii palju liikumise ulatust (m)
  maxAmp: 1.7,          // suurim liikumise ulatus küljele (m)
  baseSpeed: 0.65,      // liikumise kiirus alguses
  speedPerStreak: 0.09  // iga tabamus seerias teeb liikumise nii palju kiiremaks
};


// ---------- Alustass (takistus topsi peal) ----------
const COASTER = {
  fromStreak: 3,        // alates mitmendast järjestikusest tabamusest alustass ilmub
  chance: 0.35,         // kui tihti ilmub (suurem = tihemini)
  duration: 3.4,        // mitu sekundit alustass topsi peal on
  bounce: 0.42,         // kui tugevalt alustass keha tagasi põrgatab
  push: 2.4             // kui tugevalt alustass keha külje peale lükkab
};


// ---------- Punktid ----------
const SCORE = {
  hit: 10               // algpunktid esimese tabamuse eest; järjestikused tabamused kahekordistavad neid
};


// ---------- Aeg ----------
const SETTLE_TIME = 1.15; // mitu sekundit pärast maandumist uus vise algab
