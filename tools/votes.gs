/**
 * Collecte des votes 👍 / 👎 de l'app 5minutes2mathsparjour (Google Apps Script, lié à une feuille Google).
 * Reçoit uniquement : code de la question, vote (up / down), date, identifiant aléatoire d'appareil (pour compter les testeurs). Aucune donnée sur l'élève.
 * Feuille « visites » : une ligne par ouverture (1 par jour et par appareil) ou par séance terminée.
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
function visits_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("visites");
  if (!sh) { sh = ss.insertSheet("visites"); sh.appendRow(["reçu le", "événement", "appareil", "date élève"]); sh.setFrozenRows(1); }
  return sh;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const dev = String(d.dev || "").slice(0, 20);
    if (d.ev === "open" || d.ev === "session") {
      visits_().appendRow([new Date(), d.ev, dev, String(d.date || "").slice(0, 10)]);
      return out_({ ok: true });
    }
    const code = String(d.code || "").slice(0, 40);
    const vote = d.vote === "up" ? "up" : d.vote === "down" ? "down" : "";
    if (!code || !vote) return out_({ ok: false });
    const [notion, diff] = code.split(/[·-]/);
    sheet_().appendRow([new Date(), code, notion || "", diff || "", vote, String(d.date || "").slice(0, 10), dev]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false });
  }
}

// Bilan : ouvrir l'URL …/exec dans le navigateur. ?testeurs=1 : nombre de testeurs ; sinon bilan par notion.
function doGet(e) {
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
    agg[k] = agg[k] || { up: 0, down: 0 };
    agg[k][r[4]]++;
  });
  return out_(agg);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj, null, 1)).setMimeType(ContentService.MimeType.JSON);
}
