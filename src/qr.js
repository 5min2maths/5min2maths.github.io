// QR code (mode octet, correction L), écrit pour l'app : sert au code de sauvegarde. Rendu en SVG.
// Tables : norme ISO/IEC 18004 (blocs de correction, niveau L). Vérifié par décodage OpenCV (tests/qr.html).
const QR_L = [null, [1, 26, 19], [1, 44, 34], [1, 70, 55], [1, 100, 80], [1, 134, 108], [2, 86, 68], [2, 98, 78], [2, 121, 97], [2, 146, 116],
  [2, 86, 68, 2, 87, 69], [4, 101, 81], [2, 116, 92, 2, 117, 93], [4, 133, 107], [3, 145, 115, 1, 146, 116], [5, 109, 87, 1, 110, 88],
  [5, 122, 98, 1, 123, 99], [1, 135, 107, 5, 136, 108], [5, 150, 120, 1, 151, 121], [3, 141, 113, 4, 142, 114], [3, 135, 107, 5, 136, 108],
  [4, 144, 116, 4, 145, 117], [2, 139, 111, 7, 140, 112], [4, 151, 121, 5, 152, 122], [6, 147, 117, 4, 148, 118], [8, 132, 106, 4, 133, 107],
  [10, 142, 114, 2, 143, 115], [8, 152, 122, 4, 153, 123], [3, 147, 117, 10, 148, 118], [7, 146, 116, 7, 147, 117], [5, 145, 115, 10, 146, 116],
  [13, 145, 115, 3, 146, 116], [17, 145, 115], [17, 145, 115, 1, 146, 116], [13, 145, 115, 6, 146, 116], [12, 151, 121, 7, 152, 122],
  [6, 151, 121, 14, 152, 122], [17, 152, 122, 4, 153, 123], [4, 152, 122, 18, 153, 123], [20, 147, 117, 4, 148, 118], [19, 148, 118, 6, 149, 119]];

const QR = {
  blocks(v) { const t = QR_L[v], out = []; for (let i = 0; i < t.length; i += 3) for (let k = 0; k < t[i]; k++) out.push([t[i + 1], t[i + 2]]); return out; },
  dataLen(v) { return this.blocks(v).reduce((a, b) => a + b[1], 0); },
  rawModules(v) {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  },
  mul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; } return z; },
  ecc(data, deg) {
    const div = new Array(deg).fill(0); div[deg - 1] = 1;
    let root = 1;
    for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { div[j] = this.mul(div[j], root); if (j + 1 < deg) div[j] ^= div[j + 1]; } root = this.mul(root, 2); }
    const res = new Array(deg).fill(0);
    for (const b of data) { const f = b ^ res.shift(); res.push(0); for (let i = 0; i < deg; i++) res[i] ^= this.mul(div[i], f); }
    return res;
  },
  align(v) {
    if (v === 1) return [];
    const n = Math.floor(v / 7) + 2, size = v * 4 + 17, step = Math.floor((v * 8 + n * 3 + 5) / (n * 4 - 4)) * 2, r = [6];
    for (let p = size - 7; r.length < n; p -= step) r.splice(1, 0, p);
    return r;
  },
  // Matrice de modules (true = noir) pour une liste d'octets ; null si trop long (> 2953 octets).
  encode(bytes) {
    let v = 1;
    for (; v <= 40; v++) if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= this.dataLen(v) * 8) break;
    if (v > 40) return null;
    const cap = this.dataLen(v) * 8, bits = [];
    const put = (x, n) => { for (let i = n - 1; i >= 0; i--) bits.push((x >>> i) & 1); };
    put(4, 4); put(bytes.length, v < 10 ? 8 : 16); for (const b of bytes) put(b, 8);
    put(0, Math.min(4, cap - bits.length)); put(0, (8 - (bits.length % 8)) % 8);
    for (let p = 0xec; bits.length < cap; p ^= 0xec ^ 0x11) put(p, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
    // Blocs, correction, entrelacement.
    const bl = this.blocks(v), deg = bl[0][0] - bl[0][1], parts = [];
    let k = 0;
    for (const [, d] of bl) { const dat = data.slice(k, k + d); k += d; parts.push([dat, this.ecc(dat, deg)]); }
    const seq = [], maxD = Math.max(...bl.map((b) => b[1]));
    for (let i = 0; i < maxD; i++) for (const [d] of parts) if (i < d.length) seq.push(d[i]);
    for (let i = 0; i < deg; i++) for (const [, e] of parts) seq.push(e[i]);
    // Motifs fixes.
    const size = v * 4 + 17, m = [...Array(size)].map(() => Array(size).fill(false)), fn = [...Array(size)].map(() => Array(size).fill(false));
    const set = (x, y, on) => { m[y][x] = on; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4); } };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    const al = this.align(v), na = al.length;
    for (let i = 0; i < na; i++) for (let j = 0; j < na; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    const format = (mask) => {
      const d = (1 << 3) | mask; let r = d; // niveau L = 01
      for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = ((d << 10) | r) ^ 0x5412, bit = (i) => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
      set(8, size - 8, true);
    };
    format(0);
    if (v >= 7) {
      let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
      const b = (v << 12) | r;
      for (let i = 0; i < 18; i++) { const on = ((b >>> i) & 1) === 1, a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, on); set(c, a, on); }
    }
    // Données en zigzag.
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && i < seq.length * 8) { m[y][x] = ((seq[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
      }
    }
    // Masque : le moins pénalisé.
    const MASKS = [(x, y) => (x + y) % 2, (x, y) => y % 2, (x) => x % 3, (x, y) => (x + y) % 3, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2,
      (x, y) => ((x * y) % 2) + ((x * y) % 3), (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2];
    const apply = (k) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[k](x, y) === 0) m[y][x] = !m[y][x]; };
    let best = null;
    for (let k = 0; k < 8; k++) {
      apply(k); format(k);
      const p = this.penalty(m);
      if (!best || p < best.p) best = { k, p };
      apply(k);
    }
    apply(best.k); format(best.k);
    return m;
  },
  penalty(m) {
    const n = m.length; let p = 0, dark = 0;
    const lines = (get) => {
      for (let a = 0; a < n; a++) {
        let run = 1;
        for (let b = 1; b <= n; b++) {
          if (b < n && get(a, b) === get(a, b - 1)) run++;
          else { if (run >= 5) p += run - 2; run = 1; }
        }
        for (let b = 0; b + 7 <= n; b++) { // motif 1:1:3:1:1 bordé de clair
          const s = [0, 1, 2, 3, 4, 5, 6].map((k) => get(a, b + k));
          if (s.join() === "true,false,true,true,true,false,true") {
            const before = b >= 4 && [1, 2, 3, 4].every((k) => !get(a, b - k)), after = b + 11 <= n && [7, 8, 9, 10].every((k) => !get(a, b + k));
            if (before || after) p += 40;
          }
        }
      }
    };
    lines((a, b) => m[a][b]); lines((a, b) => m[b][a]);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (m[y][x]) dark++;
      if (x < n - 1 && y < n - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3;
    }
    return p + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
  },
  // SVG noir sur blanc (même en mode sombre : les lecteurs le préfèrent), marge de 4 modules.
  svg(text, px = 260) {
    const m = this.encode([...new TextEncoder().encode(text)]);
    if (!m) return "";
    const n = m.length, q = 4;
    let d = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x + q} ${y + q}h1v1h-1z`;
    return `<svg class="qr" viewBox="0 0 ${n + 2 * q} ${n + 2 * q}" width="${px}" height="${px}" role="img" aria-label="QR code de sauvegarde" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  },
};
