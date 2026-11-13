// Figures dynamiques (13.11, demande d'un testeur) : un curseur fait varier la figure en direct.
// LESSON_FIGS[id]() renvoie le HTML initial (SVG + curseur) ; bindDyn(racine) branche les curseurs après l'affichage.
const DYN = {
  // Rectangle de périmètre 20 : largeur x, longueur 10 − x, aire A(x) = x(10 − x), maximale pour le carré 5 × 5.
  optim: {
    min: 0.5, max: 9.5, step: 0.5, start: 2,
    label: (x) => "largeur " + decTxt(x) + " cm · longueur " + decTxt(10 - x) + " cm · périmètre 20 cm",
    render(x) {
      const L = 10 - x, A = x * L, s = 11, ox = 12, oy = 14;
      const W = 330, H = 172, gx = (t) => 168 + t * 13.5, gy = (a) => 152 - a * 4.8;
      let g = '<rect x="' + ox + '" y="' + oy + '" width="' + (x * s).toFixed(1) + '" height="' + (L * s).toFixed(1) + '" class="f-shape"/>';
      g += '<text x="' + (ox + (x * s) / 2).toFixed(1) + '" y="' + (oy + L * s + 14).toFixed(1) + '" class="f-txt" text-anchor="middle" font-size="12">' + decTxt(x) + "</text>";
      g += '<text x="' + (ox + x * s + 5).toFixed(1) + '" y="' + (oy + (L * s) / 2 + 4).toFixed(1) + '" class="f-txt" font-size="12">' + decTxt(L) + "</text>";
      // graphe de l'aire
      let d = "";
      for (let t = 0; t <= 10.001; t += 0.25) d += (d ? " L" : "M") + gx(t).toFixed(1) + "," + gy(t * (10 - t)).toFixed(1);
      g += '<line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(10.6) + '" y2="' + gy(0) + '" class="f-line"/><line x1="' + gx(0) + '" y1="' + gy(0) + '" x2="' + gx(0) + '" y2="' + gy(27) + '" class="f-line"/>';
      g += '<text x="' + gx(10.6) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="end" font-size="11">largeur</text><text x="' + (gx(0) + 4) + '" y="' + gy(26.5) + '" class="f-txt" font-size="11">aire</text>';
      g += '<path d="' + d + '" class="f-line" fill="none" stroke-dasharray="4 3"/>';
      g += '<line x1="' + gx(5) + '" y1="' + gy(0) + '" x2="' + gx(5) + '" y2="' + gy(25) + '" class="f-grid"/><text x="' + gx(5) + '" y="' + (gy(0) + 14) + '" class="f-txt" text-anchor="middle" font-size="11">5</text>';
      g += '<line x1="' + gx(x) + '" y1="' + gy(0) + '" x2="' + gx(x) + '" y2="' + gy(A) + '" class="f-accent" stroke-width="1.5"/>';
      g += '<circle cx="' + gx(x) + '" cy="' + gy(A) + '" r="5" class="f-dot"/>';
      const anc = x > 6 ? "end" : x >= 4 ? "middle" : "start", dx = x > 6 ? -8 : x >= 4 ? 0 : 8;
      g += '<text x="' + (gx(x) + dx) + '" y="' + (gy(A) - 9) + '" class="f-accent f-txt" text-anchor="' + anc + '" font-size="13">aire ' + decTxt(A) + (x === 5 ? " (max)" : "") + "</text>";
      return '<svg class="fig" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="rectangle de périmètre 20 et son aire">' + g + "</svg>";
    },
  },
};
function dynHtml(id) {
  const D = DYN[id];
  return `<div class="dyn" data-dyn="${id}"><div class="dyn-fig">${D.render(D.start)}</div>
  <label class="dyn-ctl"><input type="range" min="${D.min}" max="${D.max}" step="${D.step}" value="${D.start}" aria-label="faire varier la figure"><span class="small muted">${D.label(D.start)} · fais glisser</span></label></div>`;
}
function bindDyn(root) {
  root.querySelectorAll(".dyn[data-dyn]").forEach((box) => {
    const D = DYN[box.dataset.dyn], inp = box.querySelector("input"), fig = box.querySelector(".dyn-fig"), lab = box.querySelector(".dyn-ctl span");
    if (!D || !inp || inp.dataset.bound) return;
    inp.dataset.bound = 1;
    inp.oninput = () => { const x = +inp.value; fig.innerHTML = D.render(x); lab.textContent = D.label(x) + (x === 5 && box.dataset.dyn === "optim" ? " · c'est le carré !" : ""); };
  });
}
if (typeof LESSON_FIGS !== "undefined") LESSON_FIGS.optim = () => dynHtml("optim");
