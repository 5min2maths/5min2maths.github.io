/**
 * Collecte des votes 👍 / 👎 de l'app 5minutes2mathsparjour (Google Apps Script, lié à une feuille Google).
 * Reçoit uniquement : code de la question, vote (up / down), date. Aucune donnée sur l'élève.
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
    sh.appendRow(["reçu le", "code question", "notion", "difficulté", "vote", "date élève"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Reçoit un vote : corps JSON {code, vote, date}.
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const code = String(d.code || "").slice(0, 40);
    const vote = d.vote === "up" ? "up" : d.vote === "down" ? "down" : "";
    if (!code || !vote) return out_({ ok: false });
    const [notion, diff] = code.split(/[·-]/);
    sheet_().appendRow([new Date(), code, notion || "", diff || "", vote, String(d.date || "").slice(0, 10)]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false });
  }
}

// Bilan par notion et difficulté : ouvrir l'URL …/exec dans le navigateur.
function doGet() {
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
