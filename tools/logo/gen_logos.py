#!/usr/bin/env python3
"""Logos Pépite² (27.11, agent pepite) : 3 propositions en SVG, planche de comparaison, icônes de l'app.
Usage : python3 tools/logo/gen_logos.py [A|B|C]   (variante appliquée à l'app ; défaut : A)
Sorties :
  tools/logo/logo_A_pepite.svg, logo_B_carre.svg, logo_C_typo.svg (icônes 512) + logo_C_wordmark.svg ;
  tools/logo/planche.html → planche.png (Chromium sans interface) ;
  src/pwa/icon-192.png, icon-512.png (any), icon-maskable-192.png, icon-maskable-512.png (zone sûre), apple-touch-icon.png
  (180), favicon-32.png, favicon.svg, et les lignes const LOGO_MARK (icône miniature de l'en-tête) et LOGO_NUGGET (pépite seule) de src/curriculum.js.
Le « 2 » de l'exposant est un tracé (pas une police) : même rendu partout, favicon compris."""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
BLUE, GOLD, GOLD_D = "#2457d6", "#F2B705", "#E0A100"

# Pépite (27.11, 2e version après le retour de l'enseignant : « A ressemble à un diamant ») : bloc d'or organique,
# contour irrégulier en courbes (bosses et creux), dégradé or chaud, reflets doux, grains, ombre portée.
# Maths cachées (demande de l'enseignant) :
#  - la pépite s'inscrit EXACTEMENT dans un rectangle d'or : 160·φ × 160 (258,885 × 160), coin (142 ; 190) dans le cadre
#    512 ; le contour est normalisé sur ce rectangle (boîte englobante mesurée sur les courbes de Bézier) ;
#  - son reflet principal est une spirale d'or (quarts de cercle dans des carrés retirés d'un rectangle d'or, 8 carrés),
#    tracée dans un petit rectangle d'or 120 × 120/φ posé sur le haut de la pépite.
import math
PHI = (1 + 5 ** 0.5) / 2
RX, RY, RH = 142.0, 190.0, 160.0
RW = RH * PHI
# Points du contour (sens horaire) et direction de la tangente ; poignées = 0,36 × la corde.
# 4e version (27.11, « pomme de terre » à deux lobes refusée) : un seul bloc ramassé, roche martelée, arêtes et creux nets (poignées
# courtes = angles) ; troisième valeur = longueur des poignées (fraction de la corde).
_K = [((142, 300), (0.1, -1), .25), ((156, 240), (0.6, -1), .12), ((204, 200), (1, -0.4), .25), ((250, 190), (1, 0), .2),
      ((300, 194), (1, 0.15), .12), ((352, 200), (1, 0.4), .25), ((392, 232), (0.4, 1), .12), ((401, 276), (0, 1), .25),
      ((386, 318), (-0.5, 1), .12), ((352, 346), (-1, 0.3), .25), ((300, 350), (-1, 0), .2), ((270, 345), (-1, -0.2), .1),
      ((228, 350), (-1, 0.05), .25), ((176, 336), (-1, -0.6), .15), ((150, 322), (-0.5, -1), .12)]


def _bez():
    segs = []
    for i in range(len(_K)):
        (p0, t0, k0), (p3, t3, k3) = _K[i], _K[(i + 1) % len(_K)]
        dd = math.dist(p0, p3)
        n0, n3 = math.hypot(*t0), math.hypot(*t3)
        p1 = (p0[0] + t0[0] / n0 * dd * k0, p0[1] + t0[1] / n0 * dd * k0)
        p2 = (p3[0] - t3[0] / n3 * dd * k3, p3[1] - t3[1] / n3 * dd * k3)
        segs.append((p0, p1, p2, p3))
    pts_ = [tuple((1 - t) ** 3 * a[k] + 3 * (1 - t) ** 2 * t * b[k] + 3 * (1 - t) * t * t * c[k] + t ** 3 * e[k] for k in (0, 1))
            for a, b, c, e in segs for t in [i / 400 for i in range(401)]]
    x0, x1 = min(p[0] for p in pts_), max(p[0] for p in pts_)
    y0, y1 = min(p[1] for p in pts_), max(p[1] for p in pts_)
    f = lambda p: (RX + (p[0] - x0) / (x1 - x0) * RW, RY + (p[1] - y0) / (y1 - y0) * RH)  # normalisation sur le rectangle d'or
    d = "M%.2f %.2f" % f(segs[0][0])
    for a, b, c, e in segs:
        d += " C%.2f %.2f %.2f %.2f %.2f %.2f" % (*f(b), *f(c), *f(e))
    return d + "Z"


NUG = _bez()


def spiral(x, y, w, n=8):
    """Spirale d'or (quarts de cercle) dans le rectangle d'or (x, y, w, w/φ) : carré retiré à gauche, en haut, à droite, en bas…"""
    h = w / PHI
    d, sq, arcs = f"M{x:.2f} {y + h:.2f}", [], []
    for k in range(n):
        if k % 4 == 0:
            s_ = h; sq.append((x, y, s_)); d += f" A{s_:.2f} {s_:.2f} 0 0 1 {x + s_:.2f} {y:.2f}"; x, w = x + s_, w - s_
        elif k % 4 == 1:
            s_ = w; sq.append((x, y, s_)); d += f" A{s_:.2f} {s_:.2f} 0 0 1 {x + s_:.2f} {y + s_:.2f}"; y, h = y + s_, h - s_
        elif k % 4 == 2:
            s_ = h; sq.append((x + w - s_, y, s_)); d += f" A{s_:.2f} {s_:.2f} 0 0 1 {x + w - s_:.2f} {y + s_:.2f}"; w = w - s_
        else:
            s_ = w; sq.append((x, y + h - s_, s_)); d += f" A{s_:.2f} {s_:.2f} 0 0 1 {x:.2f} {y + h - s_:.2f}"; h = h - s_
    return d, sq


def spiral_arcs(d):
    """Arcs séparés (pour une opacité qui varie le long de la spirale) : [« M x y A … », …]."""
    head, *parts = d.split(" A")
    cur, out = head[1:], []
    for a in parts:
        out.append(f"M{cur} A{a}")
        cur = " ".join(a.split()[-2:])
    return out


SPX, SPY, SPW = 186.0, 208.0, 118.0  # petit rectangle d'or du reflet : 118 × 72,93
SPIRAL, SQUARES = spiral(SPX, SPY, SPW)
DEFS = ('<defs>'
        # or poli (3e version) : bandes claires et sombres francches, lumière en haut à gauche
        '<linearGradient id="pgOr" x1="0" y1="0" x2=".75" y2="1">'
        '<stop offset="0" stop-color="#FFF1A8"/><stop offset=".14" stop-color="#FFD23F"/><stop offset=".3" stop-color="#C98E00"/>'
        '<stop offset=".42" stop-color="#FFE071"/><stop offset=".55" stop-color="#E8A800"/><stop offset=".68" stop-color="#9A6400"/>'
        '<stop offset=".8" stop-color="#E9AE12"/><stop offset=".92" stop-color="#8A5600"/><stop offset="1" stop-color="#5E3A00"/></linearGradient>'
        '<filter id="pgFlou" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="8"/></filter>'
        '<filter id="pgFlou3" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="6"/></filter></defs>')

# Plans (facettes) sombres et clairs, arêtes, creux nets, éclats : dans le cadre 512 (coupés au contour de la pépite).
_DARK = [((300, 352), (334, 300), (404, 296), (404, 360)), ((140, 302), (196, 326), (244, 354), (140, 354)),
         ((262, 334), (298, 302), (334, 300), (300, 352)), ((370, 312), (404, 262), (404, 296), (334, 300))]
_LIGHT = [((156, 240), (222, 204), (262, 238), (198, 272)), ((298, 208), (372, 206), (352, 248), (312, 240)),
          ((198, 272), (262, 238), (298, 302), (238, 300))]
_RIDGES = [((198, 272), (262, 238)), ((262, 238), (312, 240)), ((298, 302), (334, 300)), ((334, 300), (370, 312))]
_DENTS = [((314, 264), (338, 257), (328, 273)), ((224, 314), (246, 307), (236, 320)), ((372, 248), (386, 242), (379, 259)),
          ((282, 222), (298, 226), (288, 232))]
_P = lambda P: " ".join(f"{x},{y}" for x, y in P)


# Silhouettes cassées (27.11, « fait patate encore ») : polygones irréguliers, segments très inégaux, 3–4 pointes émoussées
# (trait épais à joints ronds), 2–3 encoches concaves nettes, asymétriques ; silhouette visible ≈ 1,25 × plus large que
# haute ; φ n'est plus la boîte de la pépite mais le rectangle d'or exact du reflet (spirale, 118 × 72,93), commun aux 3.
SHAPES = {
    "A1": [(150, 262), (172, 226), (214, 196), (240, 178), (288, 186), (334, 170), (374, 158), (384, 196), (398, 240), (372, 266),
           (394, 300), (372, 338), (322, 352), (296, 324), (266, 354), (248, 380), (214, 352), (176, 336), (160, 300)],
    "A2": [(160, 250), (184, 204), (230, 186), (262, 168), (300, 182), (352, 176), (390, 206), (380, 236), (396, 268), (384, 318),
           (350, 350), (318, 356), (300, 338), (276, 366), (232, 358), (196, 340), (156, 316), (170, 288)],
    "A3": [(140, 276), (166, 236), (200, 214), (222, 184), (266, 190), (298, 166), (346, 180), (384, 172), (380, 214), (400, 252),
           (386, 290), (398, 326), (356, 344), (326, 334), (300, 362), (258, 350), (226, 372), (196, 346), (164, 330), (176, 304)],
}
# Pépite « réaliste » (27.11, photo de référence de l'enseignant) : filtres SVG. Bruit fractal → déplacement du contour
# (petites bosses) ; second bruit = carte de relief → éclairage diffus et spéculaire (lumière en haut à gauche) sur le
# dégradé or ; crevasses = bruit seuillé, brun sombre ; ombre portée. Deux niveaux de détail : complet (≥ 128 px) et
# simplifié (48 px, favicon : contour bosselé + 3 zones de lumière, sans bruit fin).
REAL_BLOB = "M150 268 C150 214 196 178 262 174 C330 170 390 204 394 262 C398 322 350 366 276 368 C200 370 150 330 150 268Z"
REAL_DEFS = (
    '<defs><radialGradient id="pgOrR" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#FFE98F"/><stop offset=".3" stop-color="#F4C232"/>'
    '<stop offset=".62" stop-color="#C98E10"/><stop offset=".85" stop-color="#8A5800"/><stop offset="1" stop-color="#5A3600"/></radialGradient>'
    '<filter id="pgReel" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n1"/>'
    '<feDisplacementMap in="SourceGraphic" in2="n1" scale="24" xChannelSelector="R" yChannelSelector="G" result="forme"/>'
    '<feTurbulence type="fractalNoise" baseFrequency="0.024" numOctaves="3" seed="4" result="n2"/>'
    '<feColorMatrix in="n2" type="luminanceToAlpha" result="relief"/>'
    '<feDiffuseLighting in="relief" surfaceScale="14" diffuseConstant="1.3" lighting-color="#fff" result="diff"><feDistantLight azimuth="225" elevation="48"/></feDiffuseLighting>'
    '<feSpecularLighting in="relief" surfaceScale="14" specularConstant="0.95" specularExponent="24" lighting-color="#FFE9A8" result="spec"><feDistantLight azimuth="225" elevation="52"/></feSpecularLighting>'
    '<feBlend in="forme" in2="diff" mode="multiply" result="lit"/><feComposite in="lit" in2="forme" operator="in" result="litIn"/>'
    '<feColorMatrix in="n2" type="matrix" values="0 0 0 0 .24  0 0 0 0 .13  0 0 0 0 0  -9 0 0 0 3.6" result="crev"/>'
    '<feComposite in="crev" in2="forme" operator="in" result="crevIn"/>'
    '<feComposite in="spec" in2="forme" operator="in" result="specIn"/>'
    '<feMerge><feMergeNode in="litIn"/><feMergeNode in="crevIn"/><feMergeNode in="specIn"/></feMerge></filter>'
    '<filter id="pgReelS" x="-20%" y="-20%" width="140%" height="140%">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n1"/>'
    '<feDisplacementMap in="SourceGraphic" in2="n1" scale="24" xChannelSelector="R" yChannelSelector="G"/></filter>'
    '<radialGradient id="pgOmbreR" cx=".32" cy=".25" r=".95"><stop offset=".35" stop-color="#3A2000" stop-opacity="0"/>'
    '<stop offset=".8" stop-color="#3A2000" stop-opacity=".45"/><stop offset="1" stop-color="#2A1600" stop-opacity=".7"/></radialGradient>'
    '<filter id="pgFlouR" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="9"/></filter></defs>')


def nugget_real(tr="", detail=True, explain=False):
    s = f'<g transform="{tr}">' + REAL_DEFS
    s += '<ellipse cx="288" cy="372" rx="120" ry="16" fill="#061237" opacity=".55" filter="url(#pgFlouR)"/>'
    s += f'<path d="{REAL_BLOB}" fill="url(#pgOrR)" filter="url(#{"pgReel" if detail else "pgReelS"})"/>'
    if detail:  # volume (ombre vers le bas à droite, même contour), grand reflet doux, spirale d'or discrète dedans
        s += f'<path d="{REAL_BLOB}" fill="url(#pgOmbreR)" filter="url(#pgReelS)"/>'
        s += f'<ellipse cx="{SPX + SPW * .45:.1f}" cy="{SPY + SPW / PHI * .5:.1f}" rx="{SPW * .48:.1f}" ry="{SPW / PHI * .4:.1f}" fill="#FFF6D6" opacity=".35" filter="url(#pgFlouR)"/>'
        A = spiral_arcs(SPIRAL)
        op = [.1, .3, .5, .6, .5, .35, .2, .1]
        s += "".join(f'<path d="{a}" fill="none" stroke="#FFF8D8" stroke-width="1.8" stroke-linecap="round" opacity="{op[k]}"/>' for k, a in enumerate(A))
    else:  # 3 zones de lumière, pas de bruit fin
        s += ('<ellipse cx="232" cy="230" rx="40" ry="22" fill="#FFF6D0" opacity=".75" filter="url(#pgFlouR)"/>'
              '<ellipse cx="330" cy="236" rx="22" ry="12" fill="#FFF6D0" opacity=".6"/><ellipse cx="300" cy="318" rx="28" ry="10" fill="#7A4E00" opacity=".35"/>')
    if explain:
        s += (f'<rect x="{SPX}" y="{SPY}" width="{SPW}" height="{SPW / PHI:.3f}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>'
              f'<path d="{SPIRAL}" fill="none" stroke="#fff" stroke-width="2.5"/>')
    return s + "</g>"


# A-mix (27.11, « fais le mélange ») : matière d'A-réaliste (contour bosselé, relief) + éclat d'A3. Le relief éclairé
# (gris) est recoloré par une table : brun-ambre #7A4E00 (creux) → ambre #C88A04 → or #F2B705 → jaune chaud #FFD84D
# (crêtes) ; aucun gris. Reflets spéculaires nets #FFF7D6 sur les crêtes, contraste renforcé ; creux profonds ambre.
MIX_DEFS = (
    '<defs><radialGradient id="pgOrM" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#FFE580"/><stop offset=".45" stop-color="#F7C21C"/>'
    '<stop offset="1" stop-color="#C88A04"/></radialGradient>'
    '<radialGradient id="pgOmbreM" cx=".32" cy=".25" r=".95"><stop offset=".4" stop-color="#7A4E00" stop-opacity="0"/>'
    '<stop offset=".85" stop-color="#7A4E00" stop-opacity=".45"/><stop offset="1" stop-color="#7A4E00" stop-opacity=".7"/></radialGradient>'
    '<filter id="pgMix" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n1"/>'
    '<feDisplacementMap in="SourceGraphic" in2="n1" scale="24" xChannelSelector="R" yChannelSelector="G" result="forme"/>'
    '<feTurbulence type="fractalNoise" baseFrequency="0.024" numOctaves="3" seed="4" result="n2"/>'
    '<feColorMatrix in="n2" type="luminanceToAlpha" result="relief"/>'
    '<feDiffuseLighting in="relief" surfaceScale="14" diffuseConstant=".95" lighting-color="#fff" result="diff"><feDistantLight azimuth="225" elevation="38"/></feDiffuseLighting>'
    '<feComponentTransfer in="diff" result="or"><feFuncR type="table" tableValues=".478 .784 .949 1 1"/>'
    '<feFuncG type="table" tableValues=".306 .541 .718 .847 .86"/><feFuncB type="table" tableValues="0 .016 .02 .1 .3"/></feComponentTransfer>'
    '<feComposite in="or" in2="forme" operator="in" result="orIn"/>'
    '<feSpecularLighting in="relief" surfaceScale="14" specularConstant="1.15" specularExponent="40" lighting-color="#FFF7D6" result="spec"><feDistantLight azimuth="225" elevation="55"/></feSpecularLighting>'
    '<feComponentTransfer in="spec" result="specN"><feFuncA type="linear" slope="1.6" intercept="-.4"/></feComponentTransfer>'
    '<feComposite in="specN" in2="forme" operator="in" result="specIn"/>'
    '<feColorMatrix in="n2" type="matrix" values="0 0 0 0 .478  0 0 0 0 .306  0 0 0 0 0  -10 0 0 0 3.9" result="creux"/>'
    '<feComposite in="creux" in2="forme" operator="in" result="creuxIn"/>'
    '<feMerge><feMergeNode in="orIn"/><feMergeNode in="creuxIn"/><feMergeNode in="specIn"/></feMerge></filter>'
    '<filter id="pgMixS" x="-20%" y="-20%" width="140%" height="140%">'
    '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" result="n1"/>'
    '<feDisplacementMap in="SourceGraphic" in2="n1" scale="24" xChannelSelector="R" yChannelSelector="G"/></filter>'
    '<filter id="pgFlouM" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="9"/></filter></defs>')


def nugget_mix(tr="", detail=True, explain=False):
    s = f'<g transform="{tr}">' + MIX_DEFS
    s += '<ellipse cx="290" cy="372" rx="120" ry="16" fill="#061237" opacity=".5" filter="url(#pgFlouM)"/>'
    if detail:
        s += f'<path d="{REAL_BLOB}" fill="url(#pgOrM)" filter="url(#pgMix)"/>'
        s += f'<path d="{REAL_BLOB}" fill="url(#pgOmbreM)" filter="url(#pgMixS)"/>'  # volume : ambre vers le bas à droite
        s += f'<ellipse cx="{SPX + SPW * .45:.1f}" cy="{SPY + SPW / PHI * .5:.1f}" rx="{SPW * .5:.1f}" ry="{SPW / PHI * .42:.1f}" fill="#FFF7D6" opacity=".28" filter="url(#pgFlouM)"/>'
        A = spiral_arcs(SPIRAL)
        op = [.12, .35, .6, .7, .6, .4, .22, .1]
        s += "".join(f'<path d="{a}" fill="none" stroke="#FFF7D6" stroke-width="1.8" stroke-linecap="round" opacity="{op[k]}"/>' for k, a in enumerate(A))
        for x, y, r in ((220, 214, 8), (352, 226, 6), (300, 300, 5)):  # éclats étoilés discrets
            s += f'<path d="M{x} {y - r} L{x + r * .22} {y - r * .22} {x + r} {y} {x + r * .22} {y + r * .22} {x} {y + r} {x - r * .22} {y + r * .22} {x - r} {y} {x - r * .22} {y - r * .22}Z" fill="#fff" opacity=".95"/>'
    else:  # 48 px et favicon : silhouette bosselée jaune vif + 3 reflets
        s += f'<path d="{REAL_BLOB}" fill="url(#pgOrM)" filter="url(#pgMixS)"/>'
        s += f'<path d="{REAL_BLOB}" fill="url(#pgOmbreM)" filter="url(#pgMixS)"/>'
        s += ('<ellipse cx="228" cy="226" rx="44" ry="24" fill="#FFF7D6" opacity=".85" filter="url(#pgFlouM)"/>'
              '<ellipse cx="336" cy="234" rx="20" ry="10" fill="#FFF7D6" opacity=".8"/><ellipse cx="262" cy="322" rx="24" ry="8" fill="#FFF7D6" opacity=".5"/>')
    if explain:
        s += (f'<rect x="{SPX}" y="{SPY}" width="{SPW}" height="{SPW / PHI:.3f}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>'
              f'<path d="{SPIRAL}" fill="none" stroke="#fff" stroke-width="2.5"/>')
    return s + "</g>"


_D = lambda P: "M" + " L".join(f"{x} {y}" for x, y in P) + "Z"


def nugget(tr="", sparkle=True, outline="#5A3A00", explain=False, shape=None):
    NUG = _D(SHAPES[shape]) if shape else globals()["NUG"]
    cid = "pgClip" + (shape or "")
    s = f'<g transform="{tr}">' + DEFS + f'<defs><clipPath id="{cid}"><path d="{NUG}"/></clipPath></defs>'
    if shape:  # pointes émoussées : contour épais à joints ronds, puis le métal
        s += f'<path d="{NUG}" fill="none" stroke="{outline}" stroke-width="16" stroke-linejoin="round"/>'
        s += f'<path d="{NUG}" fill="url(#pgOr)" stroke="url(#pgOr)" stroke-width="8" stroke-linejoin="round"/>'
        s += f'<g clip-path="url(#{cid})">'
        for q in (((160, 300), (214, 352), (250, 300)), ((372, 266), (394, 300), (340, 300)), ((296, 324), (322, 352), (300, 300))):
            s += f'<polygon points="{_P(q)}" fill="#3E2400" opacity=".35"/>'  # creux martelés le long des encoches
        for x, y, r in ((262, 316, 3), (318, 230, 2.5), (356, 300, 3), (214, 286, 2.5), (290, 344, 2)):
            s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#3E2400" opacity=".6"/>'  # piqûres
        s += "</g>"
    s += '<ellipse cx="292" cy="364" rx="124" ry="16" fill="#061237" opacity=".5" filter="url(#pgFlou)"/>'  # ombre portée en bas à droite
    if not shape:
        s += f'<path d="{NUG}" fill="url(#pgOr)"/>'
    s += f'<g clip-path="url(#{cid})">'
    s += "".join(f'<polygon points="{_P(q)}" fill="#4A2C00" opacity=".38"/>' for q in _DARK)
    s += "".join(f'<polygon points="{_P(q)}" fill="#FFF3B8" opacity=".32"/>' for q in _LIGHT)
    s += "".join(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/>' for a, b in _RIDGES)
    for q in _DENTS:
        s += f'<polygon points="{_P(q)}" fill="#3E2400" opacity=".6"/><line x1="{q[-1][0]}" y1="{q[-1][1]}" x2="{q[-2][0]}" y2="{q[-2][1]}" stroke="#FFE68A" stroke-width="2" opacity=".8"/>'
    s += f'<path d="{NUG}" transform="translate(-4 -6)" fill="none" stroke="#FFE08A" stroke-width="3.5" opacity=".6"/>'  # contre-jour, bord bas
    # reflet spéculaire principal (tache claire floue) où se fond la spirale d'or
    s += f'<ellipse cx="{SPX + SPW * .45:.1f}" cy="{SPY + SPW / PHI * .5:.1f}" rx="{SPW * .5:.1f}" ry="{SPW / PHI * .42:.1f}" fill="#FFFBE6" opacity=".55" filter="url(#pgFlou3)"/>'
    s += "</g>"
    if not shape:
        s += f'<path d="{NUG}" fill="none" stroke="{outline}" stroke-width="5" stroke-linejoin="round"/>'
    # spirale d'or : fine, opacité qui monte puis redescend le long du tracé (on la devine dans le reflet)
    A = spiral_arcs(SPIRAL)
    op = [.12, .4, .7, .85, .75, .55, .35, .15]
    s += "".join(f'<path d="{a}" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="{op[k % len(op)]}"/>' for k, a in enumerate(A))
    if sparkle:  # éclats : petits, presque blancs, nets
        for x, y, r in ((214, 222, 7), (350, 220, 6), (236, 300, 4), (388, 276, 4)):
            s += f'<path d="M{x} {y - r} L{x + r * .25} {y - r * .25} {x + r} {y} {x + r * .25} {y + r * .25} {x} {y + r} {x - r * .25} {y + r * .25} {x - r} {y} {x - r * .25} {y - r * .25}Z" fill="#fff" opacity=".95"/>'
    if explain and shape:  # φ : le rectangle d'or du reflet
        s += (f'<rect x="{SPX}" y="{SPY}" width="{SPW}" height="{SPW / PHI:.3f}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>'
              + f'<path d="{SPIRAL}" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9"/>'
              + "".join(f'<rect x="{a:.2f}" y="{b:.2f}" width="{c:.2f}" height="{c:.2f}" fill="none" stroke="#1d2b4f" stroke-width="1.2" stroke-dasharray="4 3" opacity=".7"/>' for a, b, c in SQUARES[:5]))
    elif explain:
        s += (f'<rect x="{RX}" y="{RY}" width="{RW:.3f}" height="{RH}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="9 7"/>'
              + f'<path d="{SPIRAL}" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9"/>'
              + "".join(f'<rect x="{a:.2f}" y="{b:.2f}" width="{c:.2f}" height="{c:.2f}" fill="none" stroke="#1d2b4f" stroke-width="1.2" stroke-dasharray="4 3" opacity=".7"/>' for a, b, c in SQUARES[:5]))
    return s + "</g>"


def two(x, y, h, color, w=None):
    """« 2 » tracé, coin supérieur gauche (x, y), hauteur h."""
    k = h / 90
    w = w or 16 * k * 1.15
    return (f'<path transform="translate({x} {y}) scale({k})" d="M6 24 C6 4 54 4 54 26 C54 44 22 58 5 86 L58 86" '
            f'fill="none" stroke="{color}" stroke-width="{w / k}" stroke-linecap="round" stroke-linejoin="round"/>')


def grid(color="#fff", op=".12", step=42.67):
    return (f'<defs><pattern id="pgGrille" width="{step}" height="{step}" patternUnits="userSpaceOnUse"><path d="M{step} 0H0V{step}" '
            f'fill="none" stroke="{color}" stroke-opacity="{op}" stroke-width="2"/></pattern></defs>')


def svg(inner, bg=True, rx=0):
    b = (f'{grid()}<rect width="512" height="512" rx="{rx}" fill="{BLUE}"/><rect width="512" height="512" rx="{rx}" fill="url(#pgGrille)"/>'
         if bg else "")
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">{b}{inner}</svg>'


# Contenu de chaque variante (sans fond), dans le cadre 512, centré pour tenir dans la zone sûre une fois réduit.
def tile(cx, cy, size, rot=8, grid=True):
    """² sur un bout de papier quadrillé (idée de l'enseignant, 27.11) : la pépite = le côté brillant, le ² = le côté
    scolaire. Carré arrondi crème, petits carreaux bleu clair, marge rouge discrète, ² à l'encre bleue de l'app."""
    x, y, c = cx - size / 2, cy - size / 2, size / 6
    g = "".join(f'<line x1="{x + i * c:.1f}" y1="{y:.1f}" x2="{x + i * c:.1f}" y2="{y + size:.1f}"/>' for i in range(1, 6))
    g += "".join(f'<line x1="{x:.1f}" y1="{y + i * c:.1f}" x2="{x + size:.1f}" y2="{y + i * c:.1f}"/>' for i in range(1, 6))
    return (f'<g transform="rotate({rot} {cx} {cy})"><rect x="{x + 4:.1f}" y="{y + 7:.1f}" width="{size}" height="{size}" rx="{size * .16:.1f}" fill="#061237" opacity=".3"/>'
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{size}" height="{size}" rx="{size * .16:.1f}" fill="#FFFDF5"/>'
            + (f'<g stroke="#B5C9F3" stroke-width="1.6">{g}</g>' if grid else "")
            + (f'<line x1="{x + c * 1.1:.1f}" y1="{y:.1f}" x2="{x + c * 1.1:.1f}" y2="{y + size:.1f}" stroke="#E0565B" stroke-width="2" opacity=".7"/>' if grid else "")
            + two(cx - size * .21, cy - size * .34, size * .64, BLUE, w=size * .16) + "</g>")


def content_A():
    return nugget("translate(232 314) scale(1.5) translate(-271 -270)") + tile(376, 128, 116)


def content_A_fav():
    """Favicon (16–32 px) : carré blanc sans quadrillage, plus grand, ² bien lisible."""
    return nugget("translate(222 318) scale(1.3) translate(-271 -270)", sparkle=False) + tile(372, 138, 170, rot=6, grid=False)


def content_B():
    card = ('<g transform="rotate(-6 256 268)"><rect x="106" y="118" width="300" height="300" rx="56" fill="#fff"/>'
            '<g stroke="#2457d6" stroke-opacity=".16" stroke-width="3">'
            + "".join(f'<line x1="{x}" y1="130" x2="{x}" y2="406"/>' for x in (166, 226, 286, 346))
            + "".join(f'<line x1="118" y1="{y}" x2="394" y2="{y}"/>' for y in (178, 238, 298, 358)) + "</g>"
            + nugget("translate(256 268) scale(.78) translate(-271 -270)") + "</g>")
    return card + two(396, 70, 86, GOLD)


def content_C():
    return ('<text x="96" y="410" font-family="Bricolage Grotesque" font-weight="800" font-size="380" fill="#fff">P</text>'
            + nugget("translate(372 158) scale(.5) translate(-271 -270)", sparkle=False, outline="#6b4a00")
            + two(352, 124, 62, "#3a2a00", w=13))


VARIANTS = {"A": ("logo_A_pepite", content_A, "Pépite d'or + ² en exposant"),
            "B": ("logo_B_carre", content_B, "Pépite dans un carré arrondi (« au carré »)"),
            "C": ("logo_C_typo", content_C, "Typographique : P + ² en pépite")}

WORDMARK_C = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160" width="560" height="160">'
              '<text x="8" y="128" font-family="Bricolage Grotesque" font-weight="800" font-size="128" fill="#2457d6">Pépite</text>'
              + nugget("translate(486 52) scale(.3) translate(-271 -270)", sparkle=False, outline="#6b4a00")
              + two(474, 34, 34, "#3a2a00", w=7) + "</svg>")


def icon_any(c):
    return svg(c(), rx=112)


def icon_mask(c):
    return svg(f'<g transform="translate(256 256) scale(.8) translate(-256 -256)">{c()}</g>')


FONT = (ROOT / "docs/vendor/fonts/bricolage-var.woff2").as_uri()
CSS = f"@font-face{{font-family:'Bricolage Grotesque';font-weight:700 800;src:url({FONT}) format('woff2')}}"


def shot(html, w, h, out):
    d = HERE / "_tmp"; d.mkdir(exist_ok=True)  # Chromium (snap) ne voit pas /tmp
    if True:
        p = d / "p.html"
        p.write_text(f'<!doctype html><meta charset="utf-8"><style>{CSS}html,body{{margin:0;background:transparent}}svg{{display:block}}</style>{html}')
        subprocess.run(["nice", "timeout", "-k", "5", "60", "chromium", "--headless", "--disable-gpu", "--no-sandbox",
                        "--allow-file-access-from-files", "--hide-scrollbars", "--default-background-color=00000000",
                        "--virtual-time-budget=3000", f"--window-size={max(w, 500)},{h}", f"--screenshot={out}", p.as_uri()],
                       check=True, capture_output=True)
    if w < 500:
        Image.open(out).crop((0, 0, w, h)).save(out)


def render(svgtext, sizes, prefix):
    """SVG rendu à 1024 px puis réduit (antialiasing propre aux petites tailles)."""
    big = HERE / "_tmp" / "big.png"; big.parent.mkdir(exist_ok=True)
    shot(svgtext.replace('width="512" height="512"', 'width="1024" height="1024"'), 1024, 1024, big)
    im = Image.open(big).convert("RGBA")
    for s, out in sizes:
        im.resize((s, s), Image.LANCZOS).save(out)


SIL_DEFAUT = "A3"


def main():
    choice = (sys.argv[1] if len(sys.argv) > 1 else "A").upper()
    for k, (name, c, _) in VARIANTS.items():
        (HERE / f"{name}.svg").write_text(icon_any(c) + "\n")
        (HERE / f"{name}_maskable.svg").write_text(icon_mask(c) + "\n")
    (HERE / "logo_C_wordmark.svg").write_text(WORDMARK_C + "\n")
    # Planche : en grand, en icônes 48 px sur un faux écran d'accueil (masque rond d'Android), en-tête de l'app à 360 px.
    big = "".join(f'<figure><div class="big">{icon_any(c)}</div><figcaption><b>{k}</b> · {t}</figcaption></figure>'
                  for k, (n, c, t) in VARIANTS.items())
    apps = ['<i style="background:#e0565b"></i>', '<i style="background:#34a853"></i>', '<i style="background:#fbbc04"></i>',
            '<i style="background:#7e57c2"></i>', '<i style="background:#00897b"></i>']
    phones = ""
    for k, (n, c, t) in VARIANTS.items():
        ico = f'<span class="ic">{icon_mask(c)}</span>'
        cells = [f'<div class="app">{a}<small>App</small></div>' for a in apps[:3]]
        cells.insert(1, f'<div class="app">{ico}<small>Pépite²</small></div>')
        cells += [f'<div class="app">{a}<small>App</small></div>' for a in apps[3:]]
        phones += f'<div class="phone"><div class="wall">{"".join(cells)}</div><p>{k} · 48 px</p><div class="tiny"><span>{icon_any(content_A_fav if k == "A" else c)}</span><span>{icon_any(content_A_fav if k == "A" else c)}</span> favicon 32 / 16 px</div></div>'
    heads = ""
    for k, (n, c, t) in VARIANTS.items():
        mark = (f'<span class="mk mkA">{icon_any(content_A_fav)}</span>' if k == "A" else f'<span class="mk">{svg(nugget(), bg=False).replace('viewBox="0 0 512 512"', 'viewBox="132 176 280 196"')}</span>' if k in "AB" else "")
        name = ("Pépite²" if k != "C" else
                f'Pépite<span class="mk2">{svg(nugget("translate(256 268) scale(1.3) translate(-271 -270)", sparkle=False, outline="#6b4a00") + two(214, 186, 160, "#3a2a00", w=24), bg=False)}</span>')
        heads += (f'<div><div class="head"><div class="brand">{mark}<b>{name}</b></div><span class="chip">🔥 <b>5</b> j</span>'
                  f'<span class="cl">11e</span><span>⚙️</span></div><p class="cap">{k} · en-tête à 360 px</p></div>')
    zoom = (f'<figure><div class="zoom">{icon_any(content_A)}</div><figcaption>A à 512 px : le reflet est une spirale d\'or</figcaption></figure>'
            f'<figure><div class="zoom">{svg(nugget("translate(232 314) scale(1.5) translate(-271 -270)", explain=True) + tile(376, 128, 116), rx=112)}</div>'
            f'<figcaption>Explication : rectangle d\'or {str(round(RW, 1)).replace(".", ",")} × {RH:.0f} (rapport φ ≈ 1,618) et carrés de la spirale</figcaption></figure>'
            f'<figure><div class="zoom2">{icon_any(content_C)}</div><figcaption>C : la même pépite porte le ²</figcaption></figure>')
    def cA(k, explain=False):
        return lambda: nugget("translate(236 300) scale(1.45) translate(-271 -270)", shape=k, explain=explain) + tile(378, 126, 116)
    cR = lambda: nugget_real("translate(240 300) scale(1.42) translate(-271 -270)") + tile(380, 122, 116)
    cRs = lambda: nugget_real("translate(232 318) scale(1.36) translate(-271 -270)", detail=False) + tile(372, 138, 170, rot=6, grid=False)
    cRx = lambda: nugget_real("translate(240 300) scale(1.42) translate(-271 -270)", explain=True) + tile(380, 122, 116)
    cM = lambda: nugget_mix("translate(240 300) scale(1.42) translate(-271 -270)") + tile(380, 122, 116)
    cMs = lambda: nugget_mix("translate(232 318) scale(1.36) translate(-271 -270)", detail=False) + tile(372, 138, 170, rot=6, grid=False)
    mixhead = (f'<div class="head"><div class="brand"><span class="mk mkA">{icon_any(cMs)}</span><b>Pépite²</b></div><span class="chip">🔥 <b>5</b> j</span>'
               f'<span class="cl">11e</span><span>⚙️</span></div>')
    sil = (f'<figure><div class="big">{icon_any(cM)}</div><div class="m48"><span class="s96">{icon_mask(cM)}</span>{icon_mask(cMs)}<span class="fv">{icon_any(cMs)}</span></div>'
           f'<div style="margin-top:8px">{mixhead}</div><figcaption><b>A-mix</b> : 512 · 192 (ici 96) · 48 · favicon · en-tête 360 px</figcaption></figure>'
           f'<figure><div class="big">{icon_any(cR)}</div><div class="m48">{icon_mask(cRs)}<span class="fv">{icon_any(cRs)}</span></div><figcaption><b>A-réaliste</b> (détaillé ; 48 px et favicon simplifiés)</figcaption></figure>'
           f'<figure><div class="big">{icon_any(cRx)}</div><figcaption>A-réaliste (matière)</figcaption></figure>'
           f'<figure><div class="big">{icon_any(cA(SIL_DEFAUT))}</div><div class="m48">{icon_mask(cA(SIL_DEFAUT))}</div><figcaption><b>{SIL_DEFAUT}</b> (meilleure des silhouettes cassées, pour comparer)</figcaption></figure>')
    planche = f"""<style>
body{{font-family:'Bricolage Grotesque',sans-serif;background:#fbfcfe;padding:24px;width:1452px;color:#1d2b4f}}
h1{{margin:0 0 6px;font-size:34px}} h1 small{{font-size:18px;color:#5b6687;font-weight:700}}
.row{{display:flex;gap:28px;margin:18px 0}} figure{{margin:0;text-align:center}} .big svg{{width:300px;height:300px;filter:drop-shadow(0 6px 14px #0002)}} .zoom svg{{width:460px;height:460px}} .m48 svg{{width:48px;height:48px;border-radius:50%;margin-top:8px}} .fv svg{{width:32px;height:32px;border-radius:6px;margin-left:10px}} .s96 svg{{width:96px;height:96px;margin-right:10px}} .m48{{display:flex;align-items:center}} .zoom2 svg{{width:420px;height:420px}}
figcaption{{margin-top:8px;font-size:20px}}
.phone{{width:300px;border-radius:30px;background:linear-gradient(160deg,#1b3d8f,#5b2a86);padding:26px 18px 14px;color:#fff;text-align:center}}
.wall{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 8px}} .app{{display:grid;justify-items:center;gap:4px;font:12px sans-serif}}
.app i,.ic{{display:block;width:48px;height:48px;border-radius:50%;overflow:hidden}} .ic svg{{width:48px;height:48px}}
.phone p{{margin:12px 0 6px;font-size:16px}} .tiny{{display:flex;gap:8px;align-items:center;justify-content:center;font:12px sans-serif;background:#fff;color:#333;border-radius:8px;padding:6px}}
.tiny span:first-child svg{{width:32px;height:32px}} .tiny span:nth-child(2) svg{{width:16px;height:16px}}
.heads{{display:grid;grid-template-columns:repeat(3,360px);gap:8px 28px}}
.head{{width:360px;box-sizing:border-box;display:flex;align-items:center;gap:6px;padding:10px 12px;background:#fbfcfe;border:1px solid #dde3f0;border-radius:10px;
background-image:linear-gradient(#e7ecf6 1px,transparent 1px),linear-gradient(90deg,#e7ecf6 1px,transparent 1px);background-size:22px 22px}}
.brand{{display:flex;align-items:center;gap:4px;flex:1}} .brand b{{font-size:1.25rem;color:#2457d6;font-weight:800;white-space:nowrap;display:flex;align-items:center}}
.mk svg{{width:26px;height:26px;display:block}} .mkA svg{{width:30px;height:30px}} .mk2 svg{{width:28px;height:28px;display:block;margin:-16px 0 0 0}}
.chip{{font:15px sans-serif;border:1px solid #dde3f0;border-radius:99px;padding:3px 8px;background:#fff}} .cl{{font:14px sans-serif;color:#5b6687}}
.cap{{margin:0 0 10px;font-size:14px;color:#5b6687}}
</style>
<h1>Pépite² · propositions de logo <small>(appliquée : {choice} · python3 tools/logo/gen_logos.py A|AM|AR|A1|A2|A3|B|C)</small></h1>
<div class="row">{big}</div><div class="row">{phones}</div><div class="heads">{heads}</div><h2 style="margin:26px 0 0">Direction « réaliste » (photo de référence) et comparaison</h2><div class="row">{sil}</div><div class="row">{zoom}</div>"""
    (HERE / "planche.html").write_text(f'<!doctype html><meta charset="utf-8">{planche}')
    shot(planche, 1500, 1880, HERE / "planche.png")
    # Icônes de l'app (variante choisie).
    if choice == "AR":  # A-réaliste (filtres SVG) ; favicon et 48 px simplifiés
        c, cfA = cR, cRs
    elif choice == "AM":  # A-mix : matière d'AR + éclat d'A3
        c, cfA = cM, cMs
    elif choice in SHAPES:  # A1, A2, A3 : silhouettes cassées (φ = rectangle d'or du reflet)
        c = cA(choice)
        cfA = lambda: nugget("translate(226 318) scale(1.36) translate(-271 -270)", sparkle=False, shape=choice) + tile(372, 138, 170, rot=6, grid=False)
    else:
        name, c, _ = VARIANTS[choice]
    pwa = ROOT / "src/pwa"
    cf = content_A_fav if choice == "A" else cfA if (choice in SHAPES or choice in ("AR", "AM")) else c
    render(icon_any(c), [(512, pwa / "icon-512.png"), (192, pwa / "icon-192.png")], "any")
    render(icon_any(cf), [(32, pwa / "favicon-32.png")], "fav")
    render(icon_mask(c), [(512, pwa / "icon-maskable-512.png"), (192, pwa / "icon-maskable-192.png"), (180, pwa / "apple-touch-icon.png")], "mask")
    fav = icon_any(cf)
    if choice == "C":  # pas de police dans un favicon : le P de la variante C devient un tracé simple
        fav = fav.replace('<text x="96" y="410" font-family="Bricolage Grotesque" font-weight="800" font-size="380" fill="#fff">P</text>',
                          '<path d="M140 410V130h110a85 85 0 0 1 0 170h-60" fill="none" stroke="#fff" stroke-width="62" stroke-linejoin="round"/>')
    (pwa / "favicon.svg").write_text(fav + "\n")
    # Marque de l'en-tête : pépite seule (A, B) ou pépite-exposant (C), SVG en ligne, décorative (aria-hidden).
    # 27.11 (enseignant : la pépite seule fait « croissant » en petit) : icône complète en miniature (version favicon).
    head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'
    mark = icon_any(cf).replace(head, '<svg class="logo-mark" viewBox="0 0 512 512" aria-hidden="true" focusable="false">')
    nug = svg(nugget_mix() if choice == "AM" else nugget_real() if choice == "AR" else nugget(shape=choice if choice in SHAPES else None), bg=False).replace(head, '<svg viewBox="0 0 512 512">')
    phi = ('{ x: %s, y: %s, w: %s, h: %.3f, ou: "reflet" }' % (SPX, SPY, SPW, SPW / PHI) if (choice in SHAPES or choice in ("AR", "AM"))
           else '{ x: %s, y: %s, w: %.3f, h: %s, ou: "pepite" }' % (RX, RY, RW, RH))  # pépite seule (figure de la question curieuse « logo »)
    cur = ROOT / "src/curriculum.js"
    t = cur.read_text()
    import re
    t = re.sub(r"^/\* Logo \(27\.11\).*$", "/* Logo (27.11) : icône en miniature dans l'en-tête (LOGO_MARK) et pépite seule (LOGO_NUGGET), SVG en ligne, décoratifs. Lignes générées par tools/logo/gen_logos.py (variante " + choice + "). */", t, count=1, flags=re.M)
    t, n = re.subn(r"^const LOGO_MARK = '.*';$", lambda m: "const LOGO_MARK = '" + mark + "';", t, count=1, flags=re.M)
    assert n == 1, "const LOGO_MARK introuvable dans src/curriculum.js"
    t, n = re.subn(r"^const LOGO_NUGGET = '.*';$", lambda m: "const LOGO_NUGGET = '" + nug + "';", t, count=1, flags=re.M)
    assert n == 1, "const LOGO_NUGGET introuvable dans src/curriculum.js"
    t, n = re.subn(r"^const LOGO_PHI = .*;$", lambda m: "const LOGO_PHI = " + phi + ";", t, count=1, flags=re.M)
    assert n == 1, "const LOGO_PHI introuvable dans src/curriculum.js"
    cur.write_text(t)
    print("ok logos ; appliquée :", choice)


if __name__ == "__main__":
    main()
