// Bibliothèque de manipulation tactile (23.11, « la manipulation est un point faible ») : voir tools/manipulation.md.
// Principes : on agit DIRECTEMENT sur l'objet (point, pièce, bord d'une figure), l'objet réagit en continu pendant le
// geste, l'objectif n'est vérifié qu'au lâcher (pas de victoire en balayant), retour immédiat sous la figure, et
// toujours une alternative sans glisser : toucher (sélection puis cible) et clavier (Tab, flèches, Entrée).
// Téléphone d'abord : zones de saisie d'au moins 44 px, pas de défilement de la page quand le doigt part d'un objet
// (touch-action + touchstart non passif), mais la page défile si on touche le fond de la figure.
// Chargé avant active.js ; utilisé par act_manip2.js. Pas de TeX dans ce qui est redessiné.
const MANIP = (() => {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const snap = (v, s, lo = -Infinity, hi = Infinity) => clamp(+(Math.round(v / s) * s).toFixed(6), lo, hi);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const nb = (v) => String(+(+v).toFixed(4)).replace(".", ",").replace("-", "−");
  // Point de l'écran → point du dessin (coordonnées du viewBox).
  const toSvg = (svg, e) => { const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(m.inverse()); return { x: q.x, y: q.y }; };

  // Geste de glisser sur un élément SVG : h = { ok(), start(p), move(p), end(p), tap(p), cancel() }.
  // Seuil de 4 px (6 au doigt) avant de parler de glisser ; sinon c'est un toucher (tap).
  const bindDrag = (el, svg, h) => {
    let down = null, moved = false, pid = null;
    el.style.touchAction = "none";
    el.addEventListener("touchstart", (e) => { if (!h.ok || h.ok()) e.preventDefault(); }, { passive: false });
    el.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || (h.ok && !h.ok())) return;
      down = { x: e.clientX, y: e.clientY, touch: e.pointerType === "touch" }; moved = false; pid = e.pointerId;
      try { el.setPointerCapture(pid); } catch (_) {}
      if (h.start) h.start(toSvg(svg, e)); e.preventDefault();
    });
    el.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== pid) return;
      if (!moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > (down.touch ? 6 : 4)) moved = true;
      if (moved && h.move) h.move(toSvg(svg, e));
    });
    el.addEventListener("pointerup", (e) => { if (!down || e.pointerId !== pid) return; down = null; const p = toSvg(svg, e); if (moved) { if (h.end) h.end(p); } else if (h.tap) h.tap(p); });
    el.addEventListener("pointercancel", () => { if (!down) return; down = null; if (h.cancel) h.cancel(); });
  };

  // Contraintes : elles reçoivent un point {x, y} et renvoient le point autorisé (avec des informations en plus).
  const C = {
    // grille de pas (sx, sy) dans un cadre
    grid: (sx, sy, x0, x1, y0, y1) => (p) => ({ x: snap(p.x, sx, x0, x1), y: snap(p.y, sy, y0, y1) }),
    // sur le segment [AB], t ∈ [0 ; 1] aimanté à 1/n si n est donné
    segment: (A, B, n) => (p) => { const dx = B.x - A.x, dy = B.y - A.y, L = dx * dx + dy * dy || 1; let t = clamp(((p.x - A.x) * dx + (p.y - A.y) * dy) / L, 0, 1); if (n) t = Math.round(t * n) / n; return { x: A.x + t * dx, y: A.y + t * dy, t }; },
    // sur le cercle de centre O et de rayon r ; angle (en degrés, sens direct, y vers le haut) aimanté à pas degrés, borné
    circle: (O, r, pas, a0 = -Infinity, a1 = Infinity) => (p) => { let a = (Math.atan2(O.y - p.y, p.x - O.x) * 180) / Math.PI; if (pas) a = Math.round(a / pas) * pas; a = clamp(a, a0, a1); const t = (a * Math.PI) / 180; return { x: O.x + r * Math.cos(t), y: O.y - r * Math.sin(t), a }; },
    // valeur la plus proche dans une liste
    values: (vals) => (v) => vals.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b), vals[0]),
  };
  // Zone (rectangle {x, y, w, h}) qui contient le point p, avec une marge (le doigt est imprécis).
  const zoneAt = (zones, p, m = 8) => zones.findIndex((z) => z && p.x >= z.x - m && p.x <= z.x + z.w + m && p.y >= z.y - m && p.y <= z.y + z.h + m);
  // Nombre tapé : virgule, signe −, fraction a/b.
  const parse = (s) => { const t = String(s).replace(/,/g, ".").replace(/−/g, "-").replace(/\s|'/g, ""); const m = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/); return t === "" ? NaN : m ? +m[1] / +m[2] : Number(t); };

  // Pour les tests (tests/manip.html) : vrai geste (pointerdown / pointermove / pointerup) sur la poignée k, jusqu'au point (sx, sy) du dessin.
  const sim = (box, k, sx, sy) => {
    const svg = box.querySelector("svg.manip2"), g = svg.querySelector('.mh[data-k="' + k + '"]'); if (!g) throw new Error("poignée " + k + " absente");
    const m = svg.getScreenCTM(), P = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
    const t = g.transform.baseVal.consolidate(), hx = t ? t.matrix.e : 0, hy = t ? t.matrix.f : 0, [x0, y0] = P(hx, hy), [x1, y1] = P(sx, sy);
    const ev = (type, x, y) => g.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: "mouse" }));
    ev("pointerdown", x0, y0); for (let i = 1; i <= 4; i++) ev("pointermove", x0 + ((x1 - x0) * i) / 4, y0 + ((y1 - y0) * i) / 4); ev("pointerup", x1, y1);
  };
  const simTap = (box, k) => { const g = box.querySelector('svg.manip2 .mh[data-k="' + k + '"]'); const r = g.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const ev = (type) => g.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, pointerType: "mouse" })); ev("pointerdown"); ev("pointerup"); };
  const simKey = (box, k, key) => box.querySelector('svg.manip2 .mh[data-k="' + k + '"]').dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

  return { clamp, snap, esc, nb, toSvg, bindDrag, C, zoneAt, parse, sim, simTap, simKey };
})();

// Leçon manipulable (le moteur des défis de act_manip2.js). o :
//   W, H (nombre ou fonction de l'étape), note (consigne sous la figure, ou fonction (st, step)),
//   init(step, ancien état) → état ; draw(st, step) → SVG de la figure (sous les poignées) ;
//   handles(st, step) → [{ x, y, label, svg (dessin centré sur 0,0), hit: {x, y, w, h} ou R (rayon de saisie, 24 par défaut),
//                          text, color, off (caché), role }] ;
//   move(st, k, p, step) pendant le geste (p = point visé, décalage de prise compensé) ; drop(st, k, p, step) au lâcher ;
//   tap(st, k, step) (toucher sans glisser, Entrée ou Espace) ; nudge(st, k, dx, dy, step) (flèches, haut = +1) ;
//   click(st, p, step) (toucher le fond de la figure) ; buttons(st, step) → HTML de boutons [data-b] ; button(st, nom, step) ;
//   out(st, step) → texte sous la figure ; goal[step](st) → message de réussite ou "" ; hint(st, step) → aide au lâcher ;
//   ask[step] : { q, ans, ok, no } question « à toi, sans la figure » après le défi (facultatif).
function manipLesson(o) {
  const M = MANIP, dim = (v, s) => (typeof v === "function" ? v(s) : v);
  return (box, onWin) => {
    let step = 0, st = o.init(0, null), asking = false, drag = null, hs = [], gs = [], focusK = -1;
    box.innerHTML = `<svg class="fig manip2" style="touch-action:pan-y;user-select:none;-webkit-user-select:none" role="group" aria-label="${M.esc(o.aria || "figure à manipuler")}"><g class="m-dyn"></g><g class="m-hdl"></g></svg>
      <div class="manip-hint small" aria-live="polite"></div><div class="act-out manip-out" aria-live="polite"></div><div class="manip-btns"></div><div class="manip-ask"></div><div class="small muted manip-note"></div>`;
    const svg = box.querySelector("svg"), dyn = svg.querySelector(".m-dyn"), hdl = svg.querySelector(".m-hdl"), out = box.querySelector(".manip-out"),
      hintEl = box.querySelector(".manip-hint"), btns = box.querySelector(".manip-btns"), askBox = box.querySelector(".manip-ask"), noteEl = box.querySelector(".manip-note");
    const setHint = (t) => { hintEl.textContent = t || ""; };
    const inner = (h) => (h.svg != null ? h.svg : `<circle r="${h.r || 9}" fill="${h.color || "var(--blue)"}" stroke="var(--paper)" stroke-width="2.5"/>${h.text ? `<text y="-15" text-anchor="middle" class="f-txt" font-size="13" font-weight="700">${M.esc(h.text)}</text>` : ""}`);
    const hit = (h) => (h.hit ? `<rect class="mh-hit" x="${h.hit.x}" y="${h.hit.y}" width="${h.hit.w}" height="${h.hit.h}" rx="6" fill="transparent"/>` : `<circle class="mh-hit" r="${h.R || 24}" fill="transparent"/>`);
    const build = () => {
      hs = o.handles(st, step);
      hdl.innerHTML = hs.map((h, k) => `<g class="mh${h.sel ? " mh-sel" : ""}" data-k="${k}" tabindex="0" role="${h.role || "button"}" aria-label="${M.esc(h.label || "objet à déplacer")}" transform="translate(${h.x} ${h.y})"${h.off ? ' style="display:none"' : ""}>${hit(h)}<g class="mh-c">${inner(h)}</g></g>`).join("");
      gs = [...hdl.querySelectorAll(".mh")];
      gs.forEach((g, k) => {
        g.__c = inner(hs[k]);
        M.bindDrag(g, svg, {
          ok: () => !asking,
          start: (p) => { const h = hs[k]; drag = { k, dx: p.x - h.x, dy: p.y - h.y, last: { x: h.x, y: h.y } }; g.classList.add("mh-on"); if (o.grab) o.grab(st, k, step); refresh(); },
          move: (p) => { if (!drag) return; const q = { x: p.x - drag.dx, y: p.y - drag.dy }; drag.last = q; if (o.move) o.move(st, k, q, step); refresh(); },
          end: (p) => { if (!drag) return; const q = { x: p.x - drag.dx, y: p.y - drag.dy }; drag = null; g.classList.remove("mh-on"); if (o.drop) o.drop(st, k, q, step); after(k); },
          tap: () => { drag = null; g.classList.remove("mh-on"); if (o.tap) o.tap(st, k, step); after(k); },
          cancel: () => { if (!drag) return; const q = drag.last; drag = null; g.classList.remove("mh-on"); if (o.drop) o.drop(st, k, q, step); after(k); },
        });
        g.addEventListener("keydown", (e) => {
          if (asking) return;
          const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
          if (d && o.nudge) { o.nudge(st, k, d[0], d[1], step); e.preventDefault(); after(k); }
          else if ((e.key === "Enter" || e.key === " ") && o.tap) { o.tap(st, k, step); e.preventDefault(); after(k); }
        });
        g.addEventListener("focus", () => (focusK = k));
      });
    };
    // Après un geste : on redessine (en recréant les poignées si leur nombre a changé), puis on vérifie le défi.
    const after = (k) => { focusK = k; refresh(true); check(); };
    const refresh = (rebuild) => {
      dyn.innerHTML = o.draw(st, step);
      out.innerHTML = o.out ? o.out(st, step) : "";
      const n = o.handles(st, step);
      if (rebuild && !drag && (n.length !== hs.length || n.some((h, k) => !!h.sel !== !!hs[k].sel))) { const f = document.activeElement && document.activeElement.closest && document.activeElement.closest(".mh"); build(); if (f && gs[focusK]) gs[focusK].focus(); }
      else {
        n.forEach((h, k) => { const g = gs[k]; if (!g) return; g.setAttribute("transform", `translate(${h.x} ${h.y})`); const c = inner(h); if (c !== g.__c) { g.querySelector(".mh-c").innerHTML = c; g.__c = c; } g.style.display = h.off ? "none" : ""; if (h.label) g.setAttribute("aria-label", h.label); });
        hs = n;
      }
      if (o.buttons) { const b = o.buttons(st, step); if (b !== btns.__b) { btns.innerHTML = b; btns.__b = b; btns.querySelectorAll("[data-b]").forEach((el) => (el.onclick = () => { if (asking) return; o.button(st, el.dataset.b, step); refresh(true); check(); })); } }
      const nt = typeof o.note === "function" ? o.note(st, step) : o.note; if (nt !== noteEl.__t) { noteEl.innerHTML = nt || ""; noteEl.__t = nt; }
    };
    const setup = () => { svg.setAttribute("viewBox", `0 0 ${dim(o.W, step)} ${dim(o.H, step)}`); build(); refresh(); setHint(""); };
    const win = (m) => { onWin(step, m); step++; asking = false; askBox.innerHTML = ""; if (step < o.goal.length) { st = o.init(step, st); setup(); } else svg.classList.add("manip-fin"); };
    const check = () => {
      if (asking || step >= o.goal.length) return;
      const m = o.goal[step](st);
      if (!m) { setHint(o.hint ? o.hint(st, step) : ""); return; }
      setHint("");
      const A = o.ask && o.ask[step];
      if (!A) { win(m); return; }
      asking = true;
      askBox.innerHTML = `<div class="act-out manip-ok"><b>✓ ${m}</b></div><div class="small" style="margin:6px 0"><b>À toi, sans la figure :</b> ${A.q}</div>${actAnswerHtml("")}`;
      const inp = askBox.querySelector("input"), go = () => { const v = M.parse(inp.value);
        if (!isFinite(v)) { setHint("Tape un nombre."); return; }
        if (Math.abs(v - A.ans) < 1e-9) win(A.ok); else setHint(A.no || "Pas encore : reprends le raisonnement de la figure."); };
      actAnswerBind(askBox, go);
      setTimeout(() => askBox.scrollIntoView && askBox.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    };
    // Toucher le fond de la figure (pas une poignée) : par exemple poser la pièce choisie dans une case.
    svg.addEventListener("click", (e) => { if (asking || !o.click || (e.target.closest && e.target.closest(".mh"))) return; o.click(st, M.toSvg(svg, e), step); refresh(true); check(); });
    setup();
    // Point d'entrée pour les tests automatiques (tests/manip.html)
    box.__manip = { get st() { return st; }, get step() { return step; }, get asking() { return asking; }, handles: () => hs, set(fn) { fn(st, step); refresh(true); check(); } };
  };
}
