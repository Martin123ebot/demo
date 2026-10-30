# Viskemäng

Mängija valib eseme, hoiab hiire vasakut nuppu või sõrme all, tõmbab üles ja viskab lahtilaskmisel eseme topsi. Valida saab roboti, palli, kivi, paberlennuki, pastaka, pinali, pliiatsi või padja. Mäng on tehtud three.js 3D-teegiga (versioon **r128**).

Ülaosas saab valida keskkonna: Maal on sinine üleminekuga taevas, kauguse udu, muru, puud ja pilved; Kuul on must tähistaevas, Maa, hall pind ja kraatrid; klassiruumis on tahvel, aknad, uks, kell ja koolilauad. Klassiruumis muutub sihtmärk prügiämbriks. Keskkonnad joonistatakse kujunditest, eraldi pildifaile pole vaja.

Gravitatsiooninupu menüüst saab valida Päikesesüsteemi planeedi; valik määrab viske gravitatsiooni tugevuse. „Alusta viset uuesti” paneb eseme algasendisse, kuid jätab punktid ja seeria alles.

„Pind” valikust saab valida tavalise põranda, kummipõranda, mudapõranda või liivapõranda. Kummipõrand põrgatab visatava eseme suure hooga; muda ja liiv peatavad selle kohe põrandale maandudes. Valik muudab kogu põranda pinda.

Tavalisel põrandal võib topsi poole sihitud vise 35% tõenäosusega õnnestuda ka pärast põrget.

Topsi külge põrkab ese tagasi, mitte ei lenda sellest läbi; see kehtib ka madala viske puhul.

Maal valitakse iga uue viske eel juhuslik tuule suund ja kiirus. Ekraani nurgas olev nool näitab, kuhu tuul puhub, ja kõrval kuvatakse tuule kiirus; tuul mõjutab eseme lendu ja sihtimise punktiiri. Kuul ja klassiruumis tuult ei ole.

Kivi saab sama tõmbega väiksema algkiiruse kui robot ning tuul mõjutab seda vähem. Paberlennuk saab madalama viskenurga, tuule mõju, õhutakistuse ja kiirusest sõltuva tõstejõu, nii et see liugleb nagu paberlennuk; lennuki asend järgib lennusuunda ning sihtimise punktiir arvestab sama lennumudelit.

Lennu ajal pöörleb paberlennuk; lendaval esemel on maapinnavari ning viimase viske lennujoon jääb järgmise sihtimise ajaks poolläbipaistvana nähtavale.

Iga tabamus annab alguses 10 punkti ning järjestikused tabamused kahekordistavad viske punktid (10, 20, 40 jne). Möödalask punktisummat ei vähenda, kuid katkestab seeria ja järgmine tabamus annab taas 10 punkti.

Mängi: https://martin123ebot.github.io/demo/

---

## Failid ja kes neid muudab

| Fail | Mis seal on | Vastutaja |
|---|---|---|
| `index.html` | ekraani tekstid ja nende välimus (CSS), eseme-, koha- ja pinnavalik, gravitatsiooni- ja restartnupp | Liides |
| `seaded.js` | **kõik numbrid**: planeetide gravitatsioon, tuul, esemete viske- ja õhuomadused, põrandapõrge, punktid | **ÜHINE** |
| `menuu.js` | punktid, seeria, rekord, teated ("Sisse!"), hiljem menüü | Liides |
| `heli.js` | helid (praegu tühi) | Liides |
| `stseen.js` | Maa/Kuu/klassiruumi taustad, valitud põrandapinna välimus, udu, kaamera, valgus ja maastik | Kunstnik |
| `objektid.js` | tops/prügikast, alustass, viskeesemed, vari ja viske jälg | Kunstnik |
| `fuusika.js` | lend, esemete õhufüüsika ja gravitatsioon, põrandapindade põrked, topsi tabamine ja liikumine | Füüsik |
| `juhtimine.js` | hiir ja sõrm, võimsusriba, trajektoori punktiir, planeedi valik ja restartnupp | Liides |
| `mang.js` | põhitsükkel, mis paneb kõik tööle | **ÜHINE** |

**Reegel nr 1: igaüks muudab ainult oma faile.** Siis ei kirjuta keegi teise tööd üle.

`seaded.js` ja `mang.js` muudetakse ainult siis, kui kõik on kokku leppinud. Ühe muudatuse teeb üks inimene.

---

## Kuidas üks element valmib

1. **Koos (15 min):** lepitakse kokku, mis uued numbrid lähevad `seaded.js` faili ja mis nimega. Üks inimene kirjutab need sinna ja teeb commiti.
2. **Igaüks eraldi:** teeb oma osa AI-ga, ainult oma failis. Sinu osa peab töötama ka siis, kui teised pole veel valmis.
3. **Koos:** mängitakse läbi ja parandatakse vead.

---

## Kuidas oma arvutis töötada (GitHub Desktop)

Nii proovid muudatuse enne oma arvutis läbi ja GitHubi läheb ainult töötav versioon.

### Üks kord alguses

1. Paigalda **GitHub Desktop** (https://desktop.github.com) ja logi sisse oma GitHubi kontoga.
2. Paigalda koodi muutmiseks **VS Code** (https://code.visualstudio.com). Notepad töötab ka, aga VS Code näitab koodi värviliselt ja vigu on lihtsam leida.
3. GitHub Desktopis vali **File → Clone repository** ja vali nimekirjast `martin123ebot/demo`. Kui seda nimekirjas pole, vali vaheleht **URL** ja kleebi `https://github.com/martin123ebot/demo`. Vajuta **Clone**.
   Nüüd on sinu arvutis kaust, kus on kõik mängu failid.

### Iga kord, kui tööd teed

1. **Võta teiste muudatused:** GitHub Desktopis vajuta ülal **Fetch origin**. Kui nupp muutub **Pull origin**-iks, vajuta seda ka.
   *Tee seda alati enne töö alustamist!*
2. **Ava oma fail** (nt `fuusika.js`) VS Code'is. Kopeeri kogu sisu ja kopeeri ka `seaded.js` sisu.
3. **Anna AI-le** alloleva juhendi tekst, mõlemad failid ja oma soov.
4. **Kleebi AI vastus** oma faili ja salvesta (Ctrl+S).
5. **Proovi mängu:** ava kaustas `index.html` topeltklõpsuga, siis avaneb see brauseris. Pärast iga uut muudatust vajuta brauseris **F5**, et leht uueneks.
6. **Kui kõik töötab**, mine GitHub Desktopi:
   - all vasakul kirjuta lühidalt, mida muutsid (nt "Tuul lükkab palli");
   - vajuta **Commit to main**;
   - vajuta ülal **Push origin**.
   Umbes minuti pärast töötab muudatus ka mängu lingil.

### Kui midagi läks katki

- **Mäng ei käivitu või on must ekraan:** vajuta brauseris **F12** ja vali **Console**. Punased read on vead. Kopeeri need AI-le ja küsi, mis valesti on.
- **Tahad tagasi viimase töötava versiooni:** GitHub Desktopis tee faili nimel paremklõps ja vali **Discard changes**. Fail läheb tagasi seisu, mis oli viimase commit'i ajal.
- **Ära kunagi tee commit'i ja push'i, kui mäng ei tööta.** Siis läheb mäng katki ka teistel.

### Kui GitHub Desktopi ei saa paigaldada (nt kooli arvutis)

1. GitHubis vajuta **Code → Download ZIP** ja paki see lahti.
2. Muuda oma faili ja proovi `index.html` topeltklõpsuga nagu ülal.
3. Kui töötab, mine GitHubi veebis repo lehele, vajuta **Add file → Upload files**, lohista oma muudetud fail sinna ja vajuta **Commit changes**.

Selle viisiga tuleb enne iga töökorda uus ZIP alla laadida, muidu ei ole sul teiste viimaseid muudatusi.

---

## Juhend, mis iga kord AI-le kaasa anda

```
Me teeme mängu three.js versiooniga r128 (lisatud <script> sildiga, globaalne THREE, ilma import'ideta).
Mäng on jagatud failideks: seaded.js, menuu.js, heli.js, stseen.js, objektid.js, fuusika.js, juhtimine.js, mang.js.
Kõik failid kasutavad samu muutujaid (näiteks scene, cup, tok, state, vel).
Muuda AINULT seda faili, mille ma annan, ja ainult seda osa, mida palun. Ära nimeta olemasolevaid muutujaid ega funktsioone ümber.
Kui on vaja uut numbrit, mida võiks hiljem muuta, ütle mulle, mis rida seaded.js faili lisada – ära pane seda ise koodi sisse.
Kirjuta iga uue funktsiooni ette eestikeelne kommentaar: mida see teeb mängus.
Anna mulle tagasi KOGU fail, mitte ainult muudetud osa.
Selgita lõpuks 3–5 lausega lihtsas eesti keeles, mida muutsid.
```

---

## Olulised teadmised

- **Ära uuenda three.js versiooni.** Uuemates versioonides ei tööta see faili lisamise viis ja ka valgused muutuvad.
- **Failide järjekord `index.html`-is on tähtis.** `seaded.js` peab olema esimene ja `mang.js` viimane.
- **Arvutis proovimiseks on vaja internetiühendust**, sest three.js laaditakse netist.
- **Kui mängu lisatakse pildifaile** (nt taeva või pinna pilt), siis topeltklõpsuga avamine enam ei tööta: brauser ei luba arvutist avatud lehel pilte 3D-pinnale panna. Siis paigalda VS Code'i lisa **Live Server** (vasakul Extensions → otsi "Live Server" → Install). Pärast seda vajuta VS Code'i all paremas nurgas **Go Live** ja mäng avaneb brauseris. Seni, kuni kõik on koodiga joonistatud (värvid ja kujundid), pole seda vaja.
