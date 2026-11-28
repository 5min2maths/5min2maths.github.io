#!/usr/bin/env python3
"""28.11 (/app animations) : GIF des 5 animations, images figées par tests/_probe_anim.html (document.getAnimations()).
Usage : ~/.venvs/cfpt/bin/python tests/_gif_animations.py [nom…]  →  tests/_shots/app/animations/*.gif
Une image = un Chromium sans interface (nice) ; aucune autre suite de tests ne doit tourner en même temps."""
import os, subprocess, sys
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(R, "_shots/app/animations"); FR = os.path.join(OUT, "frames")
os.makedirs(FR, exist_ok=True)
# nom : (scénario, sombre, fin en ms, recadrage (x0, y0, x1, y1) ou None, agrandissement)
GIFS = {
    "1_pepite_envol": ("nug", 0, 520, None, 1),
    "1_pepite_envol_sombre": ("nug", 1, 520, None, 1),
    "2_bilan_defilement": ("count", 0, 680, None, 1),
    "2_bilan_defilement_sombre": ("count", 1, 680, None, 1),
    "3_pepite_polie": ("shine", 0, 640, (0, 400, 360, 640), 2),
    "4_filon_bilan": ("flame", 0, 680, (0, 40, 360, 260), 2),
    "4_filon_entete": ("chip", 0, 680, (0, 0, 360, 90), 2),
    "5_barre_seance": ("bar", 0, 520, (0, 90, 360, 170), 2),
}
def shot(a, dark, t):
    p = os.path.join(FR, f"{a}_{dark}_{t:04d}.png")
    url = f"file://{R}/_probe_anim.html#a={a}&t={t}&dark={dark}"
    subprocess.run(["nice", "timeout", "60", "chromium", "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                    "--window-size=360,640", "--virtual-time-budget=2500", f"--screenshot={p}", url],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return p
for name in sys.argv[1:] or GIFS:
    a, dark, end, crop, k = GIFS[name]
    ts = [0] + list(range(40, end + 1, 40))
    ims = []
    for t in ts:
        im = Image.open(shot(a, dark, t)).convert("RGB")
        if crop: im = im.crop(crop)
        if k != 1: im = im.resize((im.width * k, im.height * k), Image.LANCZOS)
        ims.append(im)
    # avant (0,5 s), animation à vitesse réelle (40 ms par image), après (1,2 s) ; en boucle
    dur = [500] + [40] * (len(ims) - 2) + [1200]
    ims[0].save(os.path.join(OUT, name + ".gif"), save_all=True, append_images=ims[1:], duration=dur, loop=0, optimize=True)
    print(name, len(ims), "images")
