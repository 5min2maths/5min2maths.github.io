/* Pages de test par THÈME (28.11, /entretien tests, « la machinerie est devenue lourde » : 180 pages → moins de 100).
   Une page de thème réunit plusieurs SECTIONS ; chaque section est une ancienne page de test, recopiée telle quelle
   (son code, ses commentaires datés). Le code de l'app n'est chargé qu'une fois pour toute la page : c'est ce qui fait
   gagner du temps.

   Dans la page :
     <script src="lot.js"></script>              (après les fichiers de src/ et les aides de tests/)
     <script>
     Lot.section("act_ch11b", { html: '<main id="app"></main><pre id="log" hidden></pre>', body: "width:400px" }, function () {
       … code de l'ancienne page tests/act_ch11b.html …
     });
     …
     Lot.lance();
     </script>

   Pour chaque section, dans l'ordre de la page :
     - localStorage vidé, #app vidé (le même élément : app.js le garde en mémoire), le reste du corps retiré, puis le
       gabarit « html » de l'ancienne page remis (ses <pre>, ses <div id="f">…) et le style du <body> ;
     - la fonction est appelée ; si elle rend une promesse, on l'attend ; puis on attend (au plus « attente » ms, 8000
       par défaut, temps virtuel) que les minuteries de la section aient sonné et que le dernier <pre> ne soit plus vide ni
       « en cours » et ne change plus pendant 1 s ;
     - son résultat = texte du dernier <pre> (règle de tools/run_tests.sh), recopié dans le résultat de la page sous
       « == nom ». Même règle d'échec que run_tests.sh : « ÉCHEC », « FAIL », « EXC », ou résultat resté « en cours ».
       Une exception qui sort de la fonction = « EXC » (les erreurs dans les gestionnaires d'événements ou les minuteries
       restent, comme avant la fusion, sans effet direct : seul compte le résultat écrit). Section d'aperçu ({ apercu: true }, page de capture sans contrôle) : résultat
       vide permis, erreur JS notée sans faire échouer la page (comme avant la fusion, où rien n'était lu).
   Résultat de la page (dernier <pre>, id « lot ») : 1re ligne « ok N sections » ou « ÉCHEC k/N sections : noms »,
   puis le détail de chaque section.

   À la main : page.html#section=act_ch11b,act_9a (seulement ces sections) ; l'écran de la dernière section lancée reste
   affiché (aperçus : page.html#section=vue&id=pyth, paramètre lu par Lot.param("id")). */
(function () {
  const SECTIONS = [];
  const MAUVAIS = (t) => /ÉCHEC|FAIL|EXC/.test(t) || /^(en cours|chargement)/i.test(t);
  /* minuteries posées par la section (setTimeout) : on attend qu'elles aient toutes sonné avant de lire le résultat et
     de passer à la suivante (sinon elles sonneraient pendant la section suivante, sur un écran qui n'est plus le leur) */
  const ST = window.setTimeout.bind(window), CT = window.clearTimeout.bind(window), enAttente = new Set();
  window.setTimeout = function (f, ms, ...a) {
    const id = ST(function () { enAttente.delete(id); if (typeof f === "function") f.apply(this, a); }, ms);
    if ((+ms || 0) <= 30000) enAttente.add(id);   // les très longues (rappels, mise à jour) ne retiennent pas la section
    return id;
  };
  window.clearTimeout = function (id) { enAttente.delete(id); return CT(id); };
  const attendre = (ms) => new Promise((r) => ST(r, ms));
  const filtre = (() => { const m = location.hash.match(/section=([\w,-]+)/); return m ? m[1].split(",") : null; })();
  let pre0 = null;

  let APP = null;   // le <main id="app"> du chargement (app.js le garde dans sa constante « app »)
  function prepare(s) {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    const app = APP;
    if (!pre0.isConnected) document.body.appendChild(pre0);   // une section a remplacé tout le corps (body.innerHTML = …)
    for (const n of [...document.body.childNodes]) if (n !== app && n !== pre0 && n.nodeName !== "SCRIPT") n.remove();
    if (app) { app.innerHTML = ""; for (const a of [...app.attributes]) if (a.name !== "id") app.removeAttribute(a.name); }
    document.body.setAttribute("style", s.o.body || "");
    document.body.className = "";
    document.documentElement.className = "";
    if (s.o.avant) s.o.avant();   // code d'avant le chargement de l'ancienne page (hasard fixé, réglage enregistré)
    const t = document.createElement("template"); t.innerHTML = s.o.html || "";
    const g = t.content.querySelector("#app");
    if (g && app) { for (const a of [...g.attributes]) app.setAttribute(a.name, a.value); g.replaceWith(app); } else if (app && !app.isConnected) document.body.prepend(app);
    document.body.insertBefore(t.content, pre0);
    /* app.js chargé : on refait son démarrage (élève neuf, écran d'accueil dans #app), comme au chargement de l'ancienne
       page ; sinon une section hériterait de l'élève et de l'écran laissés par la précédente */
    if (typeof bootState === "function" && typeof Store !== "undefined" && typeof screenWelcome === "function") {
      state = bootState(Store.load());
      if (state && state.placed) screenHome(); else { state = null; screenWelcome(); }
    }
  }
  function resultat() {
    const p = [...document.body.querySelectorAll("pre")].filter((x) => x !== pre0);
    return p.length ? p[p.length - 1].textContent.trim() : "";
  }

  window.Lot = {
    /* paramètre d'adresse d'une section lancée à la main : page.html#section=act_vue&id=pyth → Lot.param("id") = "pyth" */
    param(k) { return new URLSearchParams(location.hash.slice(1)).get(k); },
    section(nom, o, fn) { SECTIONS.push({ nom, o: o || {}, fn }); },
    async lance() {
      APP = document.getElementById("app");
      pre0 = document.createElement("pre"); pre0.id = "lot"; pre0.textContent = "en cours";
      document.body.appendChild(pre0);
      const lignes = [], mauvais = [];
      const liste = SECTIONS.filter((s) => !filtre || filtre.includes(s.nom));
      for (const s of liste) {
        let exc = null; enAttente.clear();
        try { prepare(s); } catch (e) { exc = "préparation de la section : " + (e.stack || e); }
        if (!exc) try { const r = s.fn(); if (r && typeof r.then === "function") await r; } catch (e) { exc = e.stack || String(e); }
        /* résultat écrit plus tard (minuteries, promesses) : on attend qu'il soit là et qu'il ne bouge plus pendant 1 s
           (temps virtuel de Chromium : presque rien en vrai), au plus « attente » ms */
        const max = s.o.attente == null ? 8000 : s.o.attente;
        for (let t = 0, avant = null, stable = 0; t < max && !exc; t += 100) {
          const x = resultat(); stable = x === avant ? stable + 100 : 0; avant = x;
          if (!enAttente.size && (x || s.o.apercu) && !/^(en cours|chargement)/i.test(x) && stable >= 1000) break;
          await attendre(100);
        }
        let t = resultat();
        if (exc && s.o.apercu) t = "(aperçu : erreur JS, sans effet sur le résultat de la page) " + String(exc).split("\n")[0].replace(/ÉCHEC|FAIL|EXC/g, "x") + (t ? "\n" + t.replace(/ÉCHEC|FAIL|EXC/g, "x") : "");
        else if (exc) t = "EXC " + String(exc).split("\n").slice(0, 3).join(" | ") + (t ? "\n" + t : "");
        else if (!t && !s.o.apercu) t = "ÉCHEC résultat vide";
        if (MAUVAIS(t)) mauvais.push(s.nom);
        lignes.push("== " + s.nom + "\n" + (t || "(aperçu, sans résultat écrit)"));
      }
      if (!document.body) document.documentElement.appendChild(document.createElement("body"));
      document.body.appendChild(pre0);   // toujours le dernier <pre> de la page (règle de run_tests.sh)
      pre0.textContent = (mauvais.length ? "ÉCHEC " + mauvais.length + "/" + liste.length + " sections : " + mauvais.join(", ")
        : "ok " + liste.length + " sections (" + liste.map((s) => s.nom).join(", ") + ")") + "\n" + lignes.join("\n");
    },
  };
})();
