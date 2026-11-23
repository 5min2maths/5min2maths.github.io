/**
 * Collecte des votes 👍 / 👎 de l'app 5minutes2mathsparjour (Google Apps Script, lié à une feuille Google).
 * Reçoit uniquement : code de la question, vote (up / down / facile), date, identifiant aléatoire d'appareil (pour compter les testeurs). Aucune donnée sur l'élève.
 * Feuille « visites » : une ligne par ouverture (1 par jour et par appareil), par séance commencée ou terminée
 * (classe, format ; à la fin : questions, score, minutes). Activité par jour : …/exec?activite=CLÉ.
 * Feuille « questions » (signaux muets, 20.11) : une ligne anonyme par question jouée ou leçon vue (issue, essais,
 * réponses illisibles, durée, aide, 1re réponse fausse — un mot y est remplacé par « [texte] » dans l'app).
 * Lecture : …/exec?questions=CLÉ&jours=60 (analyse : tools/signaux.py).
 * Feuille « erreurs » (23.11) : erreurs JavaScript non rattrapées chez les testeurs (message, fichier court, ligne,
 * pile réduite, écran, version, classe, appareil). Lecture : …/exec?erreurs=CLÉ&jours=7 (analyse : tools/erreurs.py).
 * Feuille « visites » brute (23.11, rétention) : …/exec?visites=CLÉ&jours=120 → [appareil, jour] des ouvertures.
 * Feuille « commentaires » : commentaires libres des testeurs (question ou application), avec la classe déclarée.
 * Lecture des commentaires par l'URL …/exec?commentaires=CLÉ : la clé n'est PAS dans ce fichier (dépôt public) ;
 * la définir dans Apps Script > Paramètres du projet > Propriétés du script : CLE_LECTURE = (une suite de lettres au hasard).
 *
 * Installation (une seule fois) :
 *  1. Créer une feuille Google « 5min2maths – votes ».
 *  2. Menu Extensions > Apps Script ; remplacer le contenu par ce fichier ; Enregistrer.
 *  3. Déployer > Nouveau déploiement > type « Application Web » ;
 *     Exécuter en tant que : Moi ; Qui a accès : Tout le monde ; Déployer ; autoriser l'accès.
 *  4. Copier l'URL de l'application Web (…/exec) et la donner à Claude (constante VOTE_ENDPOINT de src/app.js).
 */
const SHEET = "votes";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(["reçu le", "code question", "notion", "difficulté", "vote", "date élève", "appareil"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Reçoit un vote : corps JSON {code, vote, date}.
const VISITES = ["reçu le", "événement", "appareil", "date élève", "classe", "format", "questions", "score", "minutes"];
function visits_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("visites");
  if (!sh) { sh = ss.insertSheet("visites"); sh.appendRow(VISITES); sh.setFrozenRows(1); }
  else if (sh.getLastColumn() < VISITES.length) sh.getRange(1, 1, 1, VISITES.length).setValues([VISITES]);
  return sh;
}
const num_ = (x) => (typeof x === "number" && isFinite(x) ? Math.round(x * 100) / 100 : "");
const jour_ = (r) => (r[3] instanceof Date ? Utilities.formatDate(r[3], "Europe/Zurich", "yyyy-MM-dd") : String(r[3] || "").slice(0, 10)) || Utilities.formatDate(new Date(r[0]), "Europe/Zurich", "yyyy-MM-dd");

function comments_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("commentaires");
  if (!sh) { sh = ss.insertSheet("commentaires"); sh.appendRow(["reçu le", "code question", "notion", "classe", "commentaire", "appareil"]); sh.setFrozenRows(1); }
  return sh;
}

const QUESTIONS = ["reçu le", "type", "uid", "appareil", "date élève", "classe", "format", "code", "notion", "niveau", "genre",
  "issue", "essais", "illisibles", "secondes", "aide", "1re réponse fausse", "erreur typique", "refaite"];
function questions_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("questions");
  if (!sh) { sh = ss.insertSheet("questions"); sh.appendRow(QUESTIONS); sh.setFrozenRows(1); }
  return sh;
}

const ERREURS = ["reçu le", "appareil", "date élève", "classe", "version", "écran", "message", "fichier", "ligne", "colonne", "pile"];
function erreurs_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("erreurs");
  if (!sh) { sh = ss.insertSheet("erreurs"); sh.appendRow(ERREURS); sh.setFrozenRows(1); }
  return sh;
}
// Texte libre venu de l'app : jamais interprété comme une formule dans la feuille.
const texte_ = (x, n) => { const t = String(x == null ? "" : x).slice(0, n).replace(/[\r\n]+/g, " "); return /^[=+\-@]/.test(t) ? "'" + t : t; };

function chapters_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("chapitres");
  if (!sh) { sh = ss.insertSheet("chapitres"); sh.appendRow(["reçu le", "classe", "mois", "notions"]); sh.setFrozenRows(1); }
  return sh;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const dev = String(d.dev || "").slice(0, 20);
    if (d.ev === "comment") {
      let txt = String(d.text || "").slice(0, 500).replace(/[\r\n]+/g, " ");
      if (/^[=+\-@]/.test(txt)) txt = "'" + txt; // pas de formule dans la feuille
      const code = String(d.code || "").slice(0, 40);
      if (!txt) return out_({ ok: false });
      comments_().appendRow([new Date(), code, code.split(/[·-]/)[0], String(d.niveau || "").slice(0, 30), txt, dev]);
      return out_({ ok: true });
    }
    if (d.ev === "q" || d.ev === "lecon") { // signaux muets (20.11)
      const s = (x, n) => String(x == null ? "" : x).slice(0, n);
      let rep = s(d.rep1, 30);
      if (/^[=+\-@]/.test(rep)) rep = "'" + rep; // pas de formule dans la feuille
      const code = s(d.code, 40).replace(/[^a-z0-9:-]/gi, "");
      if (!code) return out_({ ok: false });
      questions_().appendRow([new Date(), d.ev, s(d.uid, 12), dev, s(d.date, 10), s(d.niveau, 30), s(d.fmt, 16), code,
        code.replace(/^lecon-/, "").split("-")[0], num_(d.d), s(d.kind, 12), s(d.issue, 10), num_(d.essais), num_(d.illis),
        num_(Math.min(+d.sec || 0, 3600)), s(d.aide, 30), rep, num_(d.diag), num_(d.redo)]);
      return out_({ ok: true });
    }
    if (d.ev === "err") { // erreurs JavaScript (23.11) ; anti-déluge côté app (1 fois par message et par jour, 5 par jour)
      const msg = texte_(d.msg, 200);
      if (!msg) return out_({ ok: false });
      erreurs_().appendRow([new Date(), dev, texte_(d.date, 10), texte_(d.niveau, 30), texte_(d.version, 12), texte_(d.ecran, 40), msg,
        texte_(d.src, 40), num_(d.ligne), num_(d.col), texte_(d.pile, 400)]);
      return out_({ ok: true });
    }
    if (d.ev === "now") { // chapitre du moment : anonyme (pas d'identifiant d'appareil)
      const ids = String(d.ids || "").slice(0, 80).replace(/[^a-z0-9,]/gi, "");
      if (!ids) return out_({ ok: false });
      chapters_().appendRow([new Date(), String(d.niveau || "").slice(0, 30), String(d.mois || "").slice(0, 7), ids]);
      return out_({ ok: true });
    }
    if (d.ev === "open" || d.ev === "session" || d.ev === "start") {
      const s = (x, n) => String(x || "").slice(0, n);
      visits_().appendRow(d.ev === "open" ? [new Date(), d.ev, dev, s(d.date, 10)]
        : [new Date(), d.ev, dev, s(d.date, 10), s(d.niveau, 30), s(d.fmt, 12), num_(d.n), num_(d.score), num_(d.min)]);
      return out_({ ok: true });
    }
    const code = String(d.code || "").slice(0, 40);
    const vote = ["up", "down", "facile"].includes(d.vote) ? d.vote : "";
    if (!code || !vote) return out_({ ok: false });
    const [notion, diff] = code.split(/[·-]/);
    sheet_().appendRow([new Date(), code, notion || "", diff || "", vote, String(d.date || "").slice(0, 10), dev]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false });
  }
}

// Bilan : ouvrir l'URL …/exec dans le navigateur. ?testeurs=1 : nombre de testeurs ; sinon bilan par notion.
// Grades « collector » (22.11) : …/exec?grade=Penseur&app=<identifiant d'appareil> renvoie {grade, n} : n = rang de cet
// appareil parmi ceux qui ont atteint ce grade (le même appareil garde toujours le même numéro). Feuille « grades ».
const GRADE_NAMES = ["Pousse", "Apprenti", "Arpenteur", "Calculateur", "Bâtisseur", "Explorateur", "Enquêteur", "Chercheur", "Stratège", "Penseur",
  "Expert", "Érudit", "Savant", "Maître", "Inventeur", "Virtuose", "Astronome", "Génie", "Prodige", "Visionnaire", "Légende"];
function grades_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("grades");
  if (!sh) { sh = ss.insertSheet("grades"); sh.appendRow(["reçu le", "grade", "appareil"]); sh.setFrozenRows(1); }
  return sh;
}
function gradeNo_(g, app) {
  if (GRADE_NAMES.indexOf(g) < 0 || !/^[a-z0-9]{4,20}$/.test(app)) return { erreur: "grade ou appareil invalide" };
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = grades_(), rows = sh.getDataRange().getValues().slice(1).filter((r) => r[1] === g);
    const i = rows.findIndex((r) => r[2] === app);
    if (i >= 0) return { grade: g, n: i + 1 };
    sh.appendRow([new Date(), g, app]);
    return { grade: g, n: rows.length + 1 };
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.grade) return out_(gradeNo_(String(e.parameter.grade), String(e.parameter.app || "")));
  // 22.11 : nombre d'appareils qui ont atteint chaque grade (…/exec?gradescomptes=CLÉ), pour l'écran Statistiques de l'auteur.
  if (e && e.parameter && e.parameter.gradescomptes) {
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.gradescomptes !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const n = {};
    grades_().getDataRange().getValues().slice(1).forEach((r) => { if (r[1]) n[r[1]] = (n[r[1]] || 0) + 1; });
    return out_({ grades: GRADE_NAMES.map((g) => [g, n[g] || 0]) });
  }
  if (e && e.parameter && e.parameter.commentaires) {
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.commentaires !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const rows = comments_().getDataRange().getValues().slice(1).slice(-300);
    return out_(rows.map((r) => ({ recu: r[0], code: r[1], notion: r[2], classe: r[3], commentaire: r[4] })));
  }
  if (e && e.parameter && e.parameter.questions) {
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.questions !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const lim = new Date(Date.now() - (+e.parameter.jours || 60) * 864e5);
    const rows = questions_().getDataRange().getValues().slice(1).filter((r) => new Date(r[0]) >= lim);
    return ContentService.createTextOutput(JSON.stringify({ colonnes: QUESTIONS, lignes: rows })).setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.erreurs) { // 23.11 : même clé que ?questions=
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.erreurs !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const lim = new Date(Date.now() - (+e.parameter.jours || 7) * 864e5);
    const rows = erreurs_().getDataRange().getValues().slice(1).filter((r) => new Date(r[0]) >= lim);
    return ContentService.createTextOutput(JSON.stringify({ colonnes: ERREURS, lignes: rows })).setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.visites) { // 23.11 : ouvertures brutes [appareil, jour] pour la rétention (tools/erreurs.py)
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.visites !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const lim = new Date(Date.now() - (+e.parameter.jours || 120) * 864e5);
    const rows = visits_().getDataRange().getValues().slice(1).filter((r) => r[1] === "open" && r[2] && new Date(r[0]) >= lim).map((r) => [r[2], jour_(r)]);
    return ContentService.createTextOutput(JSON.stringify({ colonnes: ["appareil", "jour"], lignes: rows })).setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.chapitres) {
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.chapitres !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    return out_(chapters_().getDataRange().getValues().slice(1).map((r) => ({ recu: r[0], classe: r[1], mois: r[2], notions: r[3] })));
  }
  // Activité par jour et rétention : …/exec?activite=CLÉ
  if (e && e.parameter && e.parameter.activite) {
    const cle = PropertiesService.getScriptProperties().getProperty("CLE_LECTURE");
    if (!cle || e.parameter.activite !== cle) return out_({ erreur: "clé absente ou incorrecte" });
    const jours = {}, parApp = {};
    visits_().getDataRange().getValues().slice(1).forEach((r) => {
      if (!r[2]) return;
      const j = jour_(r), x = (jours[j] = jours[j] || { app: {}, debut: 0, fin: 0, min: [], reussite: [], classes: {} });
      x.app[r[2]] = 1;
      (parApp[r[2]] = parApp[r[2]] || {})[j] = 1;
      if (r[1] === "start") x.debut++;
      if (r[1] === "session") {
        x.fin++;
        if (typeof r[8] === "number") x.min.push(r[8]);
        if (typeof r[6] === "number" && r[6] > 0 && typeof r[7] === "number") x.reussite.push(r[7] / r[6]);
        if (r[4]) x.classes[r[4]] = (x.classes[r[4]] || 0) + 1;
      }
    });
    const moy = (a) => (a.length ? Math.round((a.reduce((p, q) => p + q, 0) / a.length) * 100) / 100 : null);
    const nb = Object.values(parApp).map((o) => Object.keys(o).length), n = nb.length || 1;
    return out_({
      retention: { testeurs: nb.length, "2_jours_ou_plus": Math.round((100 * nb.filter((k) => k >= 2).length) / n) + " %", "5_jours_ou_plus": Math.round((100 * nb.filter((k) => k >= 5).length) / n) + " %" },
      jours: Object.keys(jours).sort().map((j) => { const x = jours[j]; return { jour: j, appareils: Object.keys(x.app).length, seances_commencees: x.debut, seances_terminees: x.fin, minutes_moy: moy(x.min), reussite_moy: moy(x.reussite), classes: x.classes }; }),
      trop_facile: sheet_().getDataRange().getValues().slice(1).filter((r) => r[4] === "facile").length,
    });
  }
  if (e && e.parameter && e.parameter.testeurs) {
    const all = new Set(), w = new Set(), today = new Set(), seances = {};
    const lim = new Date(Date.now() - 7 * 864e5), j = Utilities.formatDate(new Date(), "Europe/Zurich", "yyyy-MM-dd");
    visits_().getDataRange().getValues().slice(1).forEach((r) => {
      if (!r[2]) return;
      all.add(r[2]);
      if (new Date(r[0]) >= lim) w.add(r[2]);
      if (String(r[3]) === j || (r[3] instanceof Date && Utilities.formatDate(r[3], "Europe/Zurich", "yyyy-MM-dd") === j)) today.add(r[2]);
      if (r[1] === "session") seances[r[2]] = (seances[r[2]] || 0) + 1;
    });
    return out_({ testeurs_total: all.size, actifs_7_jours: w.size, actifs_aujourdhui: today.size, seances_terminees: Object.values(seances).reduce((a, b) => a + b, 0) });
  }
  const rows = sheet_().getDataRange().getValues().slice(1);
  const agg = {};
  rows.forEach((r) => {
    const k = r[2] + " · niveau " + r[3];
    agg[k] = agg[k] || { up: 0, down: 0, facile: 0 };
    agg[k][r[4]]++;
  });
  return out_(agg);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj, null, 1)).setMimeType(ContentService.MimeType.JSON);
}
