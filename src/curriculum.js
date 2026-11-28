/* Nom de l'app (26.11, centralisé ; 27.11 : décision de l'enseignant, « Pépite² », dit « Pépite au carré », tools/nom_app.md).
   Seul endroit où il est écrit : en-tête (brand), présentations, textes qui le citent ; build.py le reporte dans le titre de
   la page et le manifeste (docs/). Contrôle : tools/test_nom.py (lancé par tools/run_tests.sh). APP_SHORT : nom sous l'icône
   du téléphone. APP_TITLE : titre de l'onglet. L'ADRESSE de l'app ne change pas (mêmes clés de stockage m2m-*). */
const APP_NAME = "Pépite²";
const APP_SPOKEN = "Pépite au carré"; /* 27.11 : nom dit (lecteurs d'écran, écran d'entrée, Réglages « À propos ») */
const APP_TAGLINE = "Deviens une pépite en maths";
/* 28.11 (enseignant) : variante « carrément » (clin d'œil au carré de Pépite²) seulement là où l'élève arrive : écran
   d'ouverture et écran d'entrée ; APP_TAGLINE reste le slogan officiel (réglages, parents, présentations, PDF). */
const APP_TAGLINE_FUN = "Deviens carrément une pépite en maths";
const APP_SHORT = "Pépite²";
const APP_TITLE = "Pépite² · Deviens une pépite en maths";
/* Slogan pour un titre : le mot « pépite » surligné (accueil, présentation). */
const APP_TAGLINE_HTML = APP_TAGLINE.replace("pépite", '<span class="mark">pépite</span>');
const APP_TAGLINE_FUN_HTML = APP_TAGLINE_FUN.replace("pépite", '<span class="mark">pépite</span>');
/* Logo (27.11) : icône en miniature dans l'en-tête (LOGO_MARK) et pépite seule (LOGO_NUGGET), SVG en ligne, décoratifs. Lignes générées par tools/logo/gen_logos.py (variante G1). */
const LOGO_MARK = '<svg class="logo-mark logo-nug" viewBox="132 180 282 186" aria-hidden="true" focusable="false"><g transform=""><defs><linearGradient id="pgOr" x1="0" y1="0" x2=".75" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset=".14" stop-color="#FFD23F"/><stop offset=".3" stop-color="#C98E00"/><stop offset=".42" stop-color="#FFE071"/><stop offset=".55" stop-color="#E8A800"/><stop offset=".68" stop-color="#9A6400"/><stop offset=".8" stop-color="#E9AE12"/><stop offset=".92" stop-color="#8A5600"/><stop offset="1" stop-color="#5E3A00"/></linearGradient><filter id="pgFlou" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="8"/></filter><filter id="pgFlou3" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="6"/></filter></defs><defs><clipPath id="pgClipG1"><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z"/></clipPath></defs><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" fill="none" stroke="#5A3A00" stroke-width="16" stroke-linejoin="round"/><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" fill="url(#pgOr)" stroke="url(#pgOr)" stroke-width="8" stroke-linejoin="round"/><g clip-path="url(#pgClipG1)"><polygon points="160,300 214,352 250,300" fill="#3E2400" opacity=".35"/><polygon points="372,266 394,300 340,300" fill="#3E2400" opacity=".35"/><polygon points="296,324 322,352 300,300" fill="#3E2400" opacity=".35"/><circle cx="262" cy="316" r="3" fill="#3E2400" opacity=".6"/><circle cx="318" cy="230" r="2.5" fill="#3E2400" opacity=".6"/><circle cx="356" cy="300" r="3" fill="#3E2400" opacity=".6"/><circle cx="214" cy="286" r="2.5" fill="#3E2400" opacity=".6"/><circle cx="290" cy="344" r="2" fill="#3E2400" opacity=".6"/></g><ellipse cx="292" cy="364" rx="124" ry="16" fill="#061237" opacity=".5" filter="url(#pgFlou)"/><g clip-path="url(#pgClipG1)"><polygon points="300,352 334,300 404,296 404,360" fill="#4A2C00" opacity=".38"/><polygon points="140,302 196,326 244,354 140,354" fill="#4A2C00" opacity=".38"/><polygon points="262,334 298,302 334,300 300,352" fill="#4A2C00" opacity=".38"/><polygon points="370,312 404,262 404,296 334,300" fill="#4A2C00" opacity=".38"/><polygon points="156,240 222,204 262,238 198,272" fill="#FFF3B8" opacity=".32"/><polygon points="298,208 372,206 352,248 312,240" fill="#FFF3B8" opacity=".32"/><polygon points="198,272 262,238 298,302 238,300" fill="#FFF3B8" opacity=".32"/><line x1="198" y1="272" x2="262" y2="238" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="262" y1="238" x2="312" y2="240" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="298" y1="302" x2="334" y2="300" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="334" y1="300" x2="370" y2="312" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><polygon points="314,264 338,257 328,273" fill="#3E2400" opacity=".6"/><line x1="328" y1="273" x2="338" y2="257" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="224,314 246,307 236,320" fill="#3E2400" opacity=".6"/><line x1="236" y1="320" x2="246" y2="307" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="372,248 386,242 379,259" fill="#3E2400" opacity=".6"/><line x1="379" y1="259" x2="386" y2="242" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="282,222 298,226 288,232" fill="#3E2400" opacity=".6"/><line x1="288" y1="232" x2="298" y2="226" stroke="#FFE68A" stroke-width="2" opacity=".8"/><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" transform="translate(-4 -6)" fill="none" stroke="#FFE08A" stroke-width="3.5" opacity=".6"/><ellipse cx="239.1" cy="244.5" rx="59.0" ry="30.6" fill="#FFFBE6" opacity=".55" filter="url(#pgFlou3)"/></g><path d="M186.00 280.93 A72.93 72.93 0 0 1 258.93 208.00" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.12"/><path d="M258.93 208.00 A45.07 45.07 0 0 1 304.00 253.07" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.4"/><path d="M304.00 253.07 A27.86 27.86 0 0 1 276.14 280.93" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.7"/><path d="M276.14 280.93 A17.22 17.22 0 0 1 258.93 263.71" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.85"/><path d="M258.93 263.71 A10.64 10.64 0 0 1 269.57 253.07" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.75"/><path d="M269.57 253.07 A6.58 6.58 0 0 1 276.14 259.65" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.55"/><path d="M276.14 259.65 A4.06 4.06 0 0 1 272.08 263.71" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.35"/><path d="M272.08 263.71 A2.51 2.51 0 0 1 269.57 261.20" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.15"/></g></svg>';
const LOGO_NUGGET = '<svg viewBox="0 0 512 512"><g transform=""><defs><linearGradient id="pgOr" x1="0" y1="0" x2=".75" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset=".14" stop-color="#FFD23F"/><stop offset=".3" stop-color="#C98E00"/><stop offset=".42" stop-color="#FFE071"/><stop offset=".55" stop-color="#E8A800"/><stop offset=".68" stop-color="#9A6400"/><stop offset=".8" stop-color="#E9AE12"/><stop offset=".92" stop-color="#8A5600"/><stop offset="1" stop-color="#5E3A00"/></linearGradient><filter id="pgFlou" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="8"/></filter><filter id="pgFlou3" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="6"/></filter></defs><defs><clipPath id="pgClipG1"><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z"/></clipPath></defs><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" fill="none" stroke="#5A3A00" stroke-width="16" stroke-linejoin="round"/><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" fill="url(#pgOr)" stroke="url(#pgOr)" stroke-width="8" stroke-linejoin="round"/><g clip-path="url(#pgClipG1)"><polygon points="160,300 214,352 250,300" fill="#3E2400" opacity=".35"/><polygon points="372,266 394,300 340,300" fill="#3E2400" opacity=".35"/><polygon points="296,324 322,352 300,300" fill="#3E2400" opacity=".35"/><circle cx="262" cy="316" r="3" fill="#3E2400" opacity=".6"/><circle cx="318" cy="230" r="2.5" fill="#3E2400" opacity=".6"/><circle cx="356" cy="300" r="3" fill="#3E2400" opacity=".6"/><circle cx="214" cy="286" r="2.5" fill="#3E2400" opacity=".6"/><circle cx="290" cy="344" r="2" fill="#3E2400" opacity=".6"/></g><ellipse cx="292" cy="364" rx="124" ry="16" fill="#061237" opacity=".5" filter="url(#pgFlou)"/><g clip-path="url(#pgClipG1)"><polygon points="300,352 334,300 404,296 404,360" fill="#4A2C00" opacity=".38"/><polygon points="140,302 196,326 244,354 140,354" fill="#4A2C00" opacity=".38"/><polygon points="262,334 298,302 334,300 300,352" fill="#4A2C00" opacity=".38"/><polygon points="370,312 404,262 404,296 334,300" fill="#4A2C00" opacity=".38"/><polygon points="156,240 222,204 262,238 198,272" fill="#FFF3B8" opacity=".32"/><polygon points="298,208 372,206 352,248 312,240" fill="#FFF3B8" opacity=".32"/><polygon points="198,272 262,238 298,302 238,300" fill="#FFF3B8" opacity=".32"/><line x1="198" y1="272" x2="262" y2="238" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="262" y1="238" x2="312" y2="240" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="298" y1="302" x2="334" y2="300" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><line x1="334" y1="300" x2="370" y2="312" stroke="#FFF6CC" stroke-width="2.2" opacity=".75"/><polygon points="314,264 338,257 328,273" fill="#3E2400" opacity=".6"/><line x1="328" y1="273" x2="338" y2="257" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="224,314 246,307 236,320" fill="#3E2400" opacity=".6"/><line x1="236" y1="320" x2="246" y2="307" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="372,248 386,242 379,259" fill="#3E2400" opacity=".6"/><line x1="379" y1="259" x2="386" y2="242" stroke="#FFE68A" stroke-width="2" opacity=".8"/><polygon points="282,222 298,226 288,232" fill="#3E2400" opacity=".6"/><line x1="288" y1="232" x2="298" y2="226" stroke="#FFE68A" stroke-width="2" opacity=".8"/><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" transform="translate(-4 -6)" fill="none" stroke="#FFE08A" stroke-width="3.5" opacity=".6"/><ellipse cx="239.1" cy="244.5" rx="59.0" ry="30.6" fill="#FFFBE6" opacity=".55" filter="url(#pgFlou3)"/></g><path d="M186.00 280.93 A72.93 72.93 0 0 1 258.93 208.00" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.12"/><path d="M258.93 208.00 A45.07 45.07 0 0 1 304.00 253.07" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.4"/><path d="M304.00 253.07 A27.86 27.86 0 0 1 276.14 280.93" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.7"/><path d="M276.14 280.93 A17.22 17.22 0 0 1 258.93 263.71" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.85"/><path d="M258.93 263.71 A10.64 10.64 0 0 1 269.57 253.07" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.75"/><path d="M269.57 253.07 A6.58 6.58 0 0 1 276.14 259.65" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.55"/><path d="M276.14 259.65 A4.06 4.06 0 0 1 272.08 263.71" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.35"/><path d="M272.08 263.71 A2.51 2.51 0 0 1 269.57 261.20" fill="none" stroke="#FFF8D8" stroke-width="1.9" stroke-linecap="round" opacity="0.15"/><path d="M214 215 L215.75 220.25 221 222 215.75 223.75 214 229 212.25 223.75 207 222 212.25 220.25Z" fill="#fff" opacity=".95"/><path d="M350 214 L351.5 218.5 356 220 351.5 221.5 350 226 348.5 221.5 344 220 348.5 218.5Z" fill="#fff" opacity=".95"/><path d="M236 296 L237.0 299.0 240 300 237.0 301.0 236 304 235.0 301.0 232 300 235.0 299.0Z" fill="#fff" opacity=".95"/><path d="M388 272 L389.0 275.0 392 276 389.0 277.0 388 280 387.0 277.0 384 276 387.0 275.0Z" fill="#fff" opacity=".95"/></g></svg>';
/* 28.11 (demande de l'enseignant) : icône « pépite » de la taille du texte, à la place de l'emoji 🟡 (bilan, Mes grades,
   en-tête, reprise de sauvegarde, parents, présentation) et pour la pépite qui s'envole. Forme du logo (LOGO_NUGGET), simplifiée
   pour 16 px : sans <defs> ni id (répétable dans une page), aplat doré, contour brun, deux facettes claires, une sombre ;
   décorative (aria-hidden) ; style : .nug-ic (src/style.css). */
const NUG_IC = '<svg class="nug-ic" viewBox="128 178 288 186" aria-hidden="true" focusable="false"><path d="M142.92 279.15 C149.15 255.96 146.28 228.79 172.33 215.23 C194.68 203.60 219.10 190.00 242.48 190.00 C260.76 190.00 291.22 203.32 299.06 206.82 C304.21 209.12 325.55 199.30 337.52 198.41 C358.74 196.83 386.95 212.66 394.10 230.37 C399.07 242.68 382.89 263.34 380.52 265.69 C378.14 268.05 400.89 286.42 400.89 299.33 C400.89 318.64 379.75 335.89 355.63 343.06 C326.07 351.85 292.40 349.79 265.11 349.79 C239.41 349.79 185.49 337.25 181.39 336.33 C179.61 335.94 154.63 326.12 151.97 319.51 C148.01 309.71 139.14 293.19 142.92 279.15Z" fill="#f2b705" stroke="#6b4500" stroke-width="14" stroke-linejoin="round"/><polygon points="160,300 214,348 252,300" fill="#9a6400" opacity=".45"/><polygon points="300,348 334,300 396,298 384,334" fill="#9a6400" opacity=".4"/><polygon points="160,246 222,206 262,238 198,272" fill="#fff3b8" opacity=".75"/><polygon points="298,210 370,208 352,248 312,240" fill="#fff3b8" opacity=".6"/><path d="M216 214 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" fill="#fff"/></svg>';
/* Rectangle d'or du logo (cadre 512) : la boîte de la pépite (ou : pepite) ou le rectangle de la spirale du reflet (ou : reflet). */
const LOGO_PHI = { x: 142.0, y: 190.0, w: 258.885, h: 160.0, ou: "pepite" };
// Catalogue des notions (recalibré le 12.11 sur les référentiels : PER / CO, programme du Collège de Genève 2021,
// PEE de la maturité professionnelle ; correspondance notion → compétences dans tools/referentiels.py).
// CH : [année] (9-11 = CO, 12-13 = 1re-2e du Collège). Pas de mois : l'ordre des chapitres varie d'une école à l'autre.
// again : années suivantes où le référentiel reprend la notion (elle reste proposée dans « Mes notions » ces années-là).
// MP : [année, semestre du PEE] ; absent = comme au CO (notion antérieure) ; null = hors programme MP.
// FR : conservé pour plus tard (France masquée pendant la bêta genevoise).
const THEMES = {
  no: "Nombres et opérations",
  gm: "Grandeurs et mesures",
  fa: "Fonctions et algèbre",
  es: "Espace",
};

const NOTIONS = [
  { id: "prio", theme: "no", label: "Priorités des opérations", ex: "3 + 4 \\cdot 2 = 11", CH: [9], again: [10,11], FR: [6, 1] },
  { id: "rel", theme: "no", label: "Nombres relatifs", ex: "(-3) - 5 \\cdot (-2) = 7", CH: [9], again: [10,11,12], MP: [12, "S1"], FR: [7, 2] },
  { id: "arith", theme: "no", label: "Diviseurs, PGDC et PPMC", ex: "\\text{PGDC}(24 ; 36) = 12", CH: [9], again: [10,12], MP: [12, "S1"], FR: null },
  { id: "fracadd", theme: "no", label: "Fractions : simplifier, additionner", ex: "\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}", CH: [9], again: [10,11], MP: [12, "S1"], FR: [7, 4] },
  { id: "diagr", theme: "no", label: "Diagrammes et moyennes", ex: "\\bar{x} = \\frac{\\text{somme}}{\\text{effectif}}", CH: [9], again: [10], FR: null },
  { id: "vol", theme: "gm", label: "Volumes : pavé, prisme, cylindre", ex: "V = A_{\\text{base}} \\cdot h", CH: [9], again: [10,11], FR: [8, 8] },
  { id: "prop", theme: "fa", label: "Proportionnalité, règle de trois", ex: "3 \\text{ kg} \\to 7{,}50 \\text{ CHF}, \\; 5 \\text{ kg} \\to ?", CH: [9], again: [10], FR: [6, 3] },
  { id: "valnum", theme: "fa", label: "Expressions littérales", ex: "3x^2 \\text{ pour } x = -2 \\text{ vaut } 12", CH: [9], again: [10,11], FR: [7, 5] },
  { id: "angtri", theme: "es", label: "Angles des triangles et quadrilatères", ex: "\\alpha + \\beta + \\gamma = 180°", CH: [9], FR: null },
  { id: "fracmul", theme: "no", label: "Fractions : multiplier, diviser", ex: "\\frac{2}{3} \\cdot \\frac{9}{4} = \\frac{3}{2}", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 2] },
  { id: "pct", theme: "no", label: "Pourcentages", ex: "15\\,\\% \\text{ de } 80 = 12", CH: [10], /* 24.11 : plus reprise en 1re (tools/niveau_1c.md) */ FR: [6, 6] },
  { id: "puiss", theme: "no", label: "Puissances", ex: "2^3 \\cdot 2^4 = 2^7", CH: [10], again: [11,12], MP: [12, "S1"], FR: [8, 3] },
  { id: "sci", theme: "no", label: "Notation scientifique", ex: "0{,}0042 = 4{,}2 \\cdot 10^{-3}", CH: [10], again: [11,12], FR: [8, 4] },
  { id: "rac", theme: "no", label: "Racines carrées", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [10], again: [11], /* 24.11 : 1re = racprop, ratden */ MP: [12, "S1"], FR: [9, 2] },
  { id: "racprop", theme: "no", label: "Racines : propriétés (carrées et cubiques)", ex: "\\sqrt{72} = 6\\sqrt{2}", CH: [11], again: [12] }, // 22.11 : propriétés en 11e seulement
  { id: "disque", theme: "gm", label: "Cercle et disque", ex: "A = \\pi r^2", CH: [10], FR: null },
  { id: "vitesse", theme: "gm", label: "Vitesse, distance, durée", ex: "150 \\text{ km en } 2 \\text{ h} \\to 75 \\text{ km/h}", CH: [10], again: [11], FR: [8, 7] },
  { id: "pyth", theme: "gm", label: "Théorème de Pythagore", ex: "a^2 + b^2 = c^2", CH: [10], again: [11], MP: [12, "S2"], FR: [8, 3] },
  { id: "reduire", theme: "fa", label: "Réduire une expression", ex: "3x + 5 - x + 2 = 2x + 7", CH: [10], again: [11], MP: [12, "S1"], FR: [7, 6] },
  { id: "distrib", theme: "fa", label: "Développer", ex: "(x + 2)(x - 3) = x^2 - x - 6", CH: [10], again: [11], MP: [12, "S1"], FR: [8, 5] },
  { id: "eq1", theme: "fa", label: "Équations du 1er degré", ex: "3x - 5 = 7 \\iff x = 4", CH: [10], again: [11,12], MP: [12, "S1"], FR: [8, 6] },
  { id: "probeq", theme: "fa", label: "Mettre un problème en équation", ex: "n + (n+1) + (n+2) = 48", CH: [10], again: [11], MP: [12, "S1"], FR: null },
  { id: "echelle", theme: "fa", label: "Échelles et pentes", ex: "1\\,:\\,200 : \\; 3 \\text{ cm} \\to 6 \\text{ m}", CH: [10], FR: [9, 6] },
  { id: "affine", theme: "fa", label: "Fonctions affines", ex: "f(x) = ax + b", CH: [10], again: [11,12], MP: [13, "S1"], FR: [9, 7] },
  { id: "polyreg", theme: "es", label: "Polygones réguliers", ex: "\\text{angle au centre} = \\frac{360°}{n}", CH: [10], FR: null },
  { id: "proba", theme: "no", label: "Probabilités", ex: "P = \\frac{\\text{cas favorables}}{\\text{cas possibles}}", CH: [11], FR: null },
  { id: "volcone", theme: "gm", label: "Volumes : pyramide, cône, boule", ex: "V = \\frac{1}{3} A_{\\text{base}} \\cdot h", CH: [11], FR: null },
  { id: "gquot", theme: "gm", label: "Grandeurs quotients (vitesse, masse volumique, débit)", ex: "\\rho = \\frac{m}{V}", CH: [11], FR: null },
  { id: "thales", theme: "gm", label: "Théorème de Thalès", ex: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}", CH: [11], MP: [12, "S2"], FR: [9, 2] },
  { id: "idrem", theme: "fa", label: "Identités remarquables", ex: "(x + 3)^2 = x^2 + 6x + 9", CH: [11], again: [12], MP: [12, "S1"], FR: [9, 3] },
  { id: "factor", theme: "fa", label: "Factoriser", ex: "x^2 - 9 = (x - 3)(x + 3)", CH: [11], again: [12], MP: [12, "S1"], FR: [9, 4] },
  { id: "formule", theme: "fa", label: "Transformer une formule", ex: "v = \\frac{d}{t} \\iff t = \\frac{d}{v}", CH: [11], MP: [12, "S1"], FR: null },
  { id: "eq2", theme: "fa", label: "Équations produit nul", ex: "(x - 2)(x + 5) = 0", CH: [11], MP: [12, "S1"], FR: [9, 5] },
  { id: "eq2disc", theme: "fa", label: "Équations du 2e degré (formule)", ex: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}", CH: [11], again: [12], MP: [12, "S1"], FR: [11, 0] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "sys2", theme: "fa", label: "Systèmes de deux équations", ex: "\\begin{cases} x + y = 7 \\\\ x - y = 1 \\end{cases}", CH: [11], again: [12], MP: [12, "S2"], FR: [10, 4] },
  { id: "angles", theme: "es", label: "Angles : parallèles, cercle", ex: "\\widehat{AOB} = 2\\,\\widehat{ACB}", CH: [11], again: [12], MP: [12, "S2"], FR: null },
  { id: "simil", theme: "es", label: "Homothéties et similitudes", ex: "\\text{aires} \\times k^2", CH: [11], again: [12], FR: null },
  { id: "polyop", theme: "fa", label: "Polynômes : développer et réduire", ex: "(2x - 1)^2 - (x + 3)(x - 3)", CH: [12], MP: [12, "S1"], FR: null },
  { id: "factor2", theme: "fa", label: "Factoriser au maximum", ex: "x^3 + 2x^2 - 9x - 18", CH: [12], MP: [12, "S1"], FR: null },
  { id: "eq3", theme: "fa", label: "Équations de degré 3 par factorisation", ex: "x^3 - 4x = 0", CH: [12], MP: null, FR: [10, 3] },
  { id: "sys3", theme: "fa", label: "Systèmes de trois équations", ex: "\\begin{cases} x + y + z = 6 \\\\ \\dots \\end{cases}", CH: [12], MP: [12, "S2"], FR: null },
  { id: "domaine", theme: "fa", label: "Domaine de définition", ex: "f(x) = \\frac{\\sqrt{x - 1}}{x - 3}", CH: [12], MP: [12, "S2"], FR: null },
  { id: "fimg", theme: "fa", label: "Images et préimages", ex: "f(x) = x^2 - 3 : \\; f(2) = 1", CH: [12], MP: [12, "S2"], FR: [10, 2] },
  { id: "f2", theme: "fa", label: "Parabole : zéros et sommet", ex: "f(x) = (x - 1)^2 - 4", CH: [12], MP: [13, "S1"], FR: [10, 6] },
  { id: "f2expr", theme: "fa", label: "Parabole : retrouver l'expression", ex: "f(x) = a(x - x_1)(x - x_2)", CH: [12], MP: [13, "S1"], FR: null },
  { id: "inter", theme: "fa", label: "Intersection de deux graphes", ex: "x^2 = x + 2", CH: [12], MP: [12, "S2"], FR: [10, 7] },
  { id: "ineq2", theme: "fa", label: "Inéquations du 2e degré", ex: "f(x) \\le g(x)", CH: [12], MP: null, FR: [11, 1] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "racinv", theme: "fa", label: "Fonctions racine carrée et inverse", ex: "\\sqrt{x} = x - 2", CH: [12], MP: null, FR: null },
  { id: "euclide", theme: "es", label: "Théorèmes d'Euclide et de la hauteur", ex: "h^2 = p \\cdot q", CH: [12], MP: [12, "S2"], FR: null },
  { id: "droitesrem", theme: "es", label: "Droites remarquables du triangle", ex: "CG = \\frac{2}{3}\\,CM", CH: [12], MP: [12, "S2"], FR: null }, /* 26.11 (agent trousmp) : MP 1re, S2.GE.02 (Chap04 Géométrie) ; formes hors du cours MP : HORS_MP (src/engine.js) */
  { id: "trigo", theme: "es", label: "Trigonométrie du triangle rectangle", ex: "\\sin \\alpha = \\frac{\\text{opposé}}{\\text{hypoténuse}}", CH: [12], MP: [12, "S2"], FR: [9, 7] },
  { id: "polydiv", theme: "fa", label: "Division de polynômes", ex: "P(a) = \\text{reste de } P : (x - a)", CH: [13], MP: null, FR: null },
  { id: "polyfact", theme: "fa", label: "Factoriser un polynôme, racine évidente", ex: "x^3 - 7x + 6 = 0", CH: [13], MP: null, FR: null },
  { id: "fracrat", theme: "fa", label: "Fractions rationnelles", ex: "\\frac{1}{x-2} + \\frac{1}{x+2}", CH: [13], MP: [12, "S1"], FR: null },
  { id: "eqrat", theme: "fa", label: "Équations rationnelles", ex: "\\frac{3}{x - 1} = \\frac{2}{x + 4}", CH: [13], MP: null, FR: null },
  { id: "ineq", theme: "fa", label: "Inéquations du 1er degré", ex: "-2x + 5 \\le 11", CH: [12], MP: null, FR: [10, 7] },
  { id: "recip", theme: "fa", label: "Composition et réciproque", ex: "(f \\circ g)(x) = f(g(x))", CH: [13], MP: null, FR: [11, 3] },
  { id: "absval", theme: "fa", label: "Valeur absolue", ex: "|x - 3| = 5", CH: [12], MP: null, FR: [10, 6] },
  { id: "homog", theme: "fa", label: "Fonctions homographiques", ex: "f(x) = \\frac{2x + 1}{x - 3}", CH: [13], MP: null, FR: null },
  { id: "trigfn", theme: "fa", label: "Fonctions trigonométriques", ex: "f(x) = 3\\sin(2x)", CH: [13], MP: null, FR: [12, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "expo", theme: "fa", label: "Exponentielles", ex: "2^x = 32 \\iff x = 5", CH: [13], MP: null, FR: [11, 4] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "log", theme: "fa", label: "Logarithmes", ex: "\\log_2 8 = 3", CH: [13], MP: null, FR: [12, 3] },
  { id: "trigcercle", theme: "es", label: "Cercle trigonométrique, radians", ex: "180° = \\pi \\text{ rad}", CH: [13], MP: [13, "S2"], FR: [11, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "trigeq", theme: "es", label: "Équations trigonométriques", ex: "\\sin x = \\frac{1}{2}", CH: [13], MP: [13, "S2"], FR: [12, 5] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "sinlaw", theme: "es", label: "Triangle quelconque (sinus, cosinus)", ex: "c^2 = a^2 + b^2 - 2ab\\cos\\gamma", CH: [13], MP: [13, "S2"], FR: [11, 3] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "cart", theme: "es", label: "Distance et milieu", ex: "d(A,B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}", CH: [13], MP: null, FR: [10, 5] },
  { id: "droites", theme: "es", label: "Équations de droites", ex: "y = mx + h", CH: [13], MP: null, FR: null },
  { id: "cercle", theme: "es", label: "Équations de cercles", ex: "(x - a)^2 + (y - b)^2 = r^2", CH: [13], MP: null, FR: [11, 8] }, // 22.11 : FR 1re/Tle (tools/premiere_terminale_fr.md)
  { id: "stats", theme: "no", label: "Statistiques (moyenne, médiane, écart-type)", ex: "\\bar{x}, \\text{ médiane}, \\sigma", CH: null /* 24.11 : ouverte à la 4e du Collège ; 25.11 (audit niveau) : retirée, niveau CO (moyenne de 5 nombres) : la 4e a « statdesc » (src/ch4c_ana.js) */, MP: [13, "S2"], FR: [10, 8] },
];

function placeOf(n, profile) {
  if (profile.system === "CH" && profile.track === "mp" && profile.grade >= 12 && n.MP !== undefined) return n.MP;
  return n[profile.system];
}

// Niveaux proposés à l'élève : clé interne (système + année) et libellé.
const SYSTEMS = {
  CH: { label: "Suisse romande", grades: [[9, "9e"], [10, "10e"], [11, "11e"], [12, "1re (sec. II)"], [13, "2e (sec. II)"], [14, "3e (sec. II)"], [15, "4e (sec. II)"]] },
  // 22.11 : 3e et 4e du Collège (grade 14, 15). Programme : tools/programme_3e_4e_college.md.
  // 24.11 : aussi MP 3e et 4e (grade 14, 15, track « mp » : src/ch_mp3.js, src/ch_mp4.js) ; le moteur distingue par la filière (placeOf).
  // FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"]] }, // masqué (bêta genevoise)
};
// 22.11 : systèmes définis mais pas proposés dans l'interface (France : collège rendu jouable, ouverture à décider).
// Sert au moteur (Mathélo, libellés de classe) et aux tests avec des profils { system: "FR", grade: 6…9 }.
// 25.11 (audit France, tools/france.md) : terminale ajoutée (notions de src/fr_lycee.js placées en 12).
const SYSTEMS_HIDDEN = { FR: { label: "France", grades: [[6, "6e"], [7, "5e"], [8, "4e"], [9, "3e"], [10, "2nde"], [11, "1re"], [12, "Tle"]] } };

// Usages français (25.11, audit France : tools/france.md § 4). Appliqué aux textes d'un profil FR seulement (Engine.finalize,
// rendu de l'app) ; jamais pour un profil suisse. Idempotent. Sans décision de l'enseignant : seulement ce qui est un défaut
// certain pour un élève français (monnaie, séparateur des milliers, sigles PGDC / PPMC, « préimage », « mise en évidence »).
// Genève → Lyon : énoncés seulement (FR_QWORDS, frLocalQ) ; un seul énoncé au catalogue français le 25.11 : une cycliste « part de Genève »). Les énoncés propres à la
// Suisse (change EUR ↔ CHF, TVA suisse) sont écartés du tirage par horsCO (src/engine.js), pas traduits.
// Produit : × en France (décision du 25.11, frTimes) ; laissé pour décision : « cercle de Thalès ».
const FR_WORDS = [
  [/\ben (CHF|francs)\b/g, "en euros"], [/\bCHF\b/g, "€"], [/au franc près/g, "à l'euro près"], [/(\d|\\\)) francs\b/g, "$1 euros"], [/\bde francs\b/g, "d'euros"],
  [/produit \(·\), quotient \(:\)/g, "produit (×), quotient (÷)"], /* 26.11 (revue p4, n° 10 : rappel de tradexpr, 5e FR) */
  [/\bapprentis\b/g, "élèves"], /* 26.11 soir (revue des élèves joués, n° 13 : « Sondage auprès de 40 apprentis » en 4e FR, école professionnelle suisse) */
  /* 25.11 (couverture France) : équation réduite y = mx + p ; « côtés de l'angle droit » (cathètes : usage suisse) ;
     « ensemble de définition » (domaine de définition : usage suisse ; « l'aire du domaine » inchangé). */
  [/\bmx \+ h\b/g, "mx + p"], [/\b([Ll])es cathètes\b/g, "$1es côtés de l'angle droit"], [/\bcathètes\b/g, "côtés de l'angle droit"], [/\b([Ll])a cathète(?![a-zà-ÿ])/g, "$1e côté de l'angle droit"], [/\bcathète(?![a-zà-ÿ])/g, "côté de l'angle droit"],
  [/\b([Ll])e domaine de définition\b/g, "$1'ensemble de définition"], [/\bdu domaine de définition\b/g, "de l'ensemble de définition"], [/\bdomaine de définition\b/g, "ensemble de définition"], [/\bdu domaine de (?=\\\()/g, "de l'ensemble de définition de "],
  [/PGDC/g, "PGCD"], [/PPMC/g, "PPCM"],
  /* 26.11 soir (vraisemblance, profils séparés) : « arrondie au franc supérieur (€) », « pas des francs », « Sur 50 apprentis
     interrogés » (apprenti = filière professionnelle suisse ; en France, élèves de collège et de lycée). */
  [/\bau franc (supérieur|inférieur)\b/g, "à l'euro $1"], [/\bdes francs\b/g, "des euros"], [/\b([Cc]haque|[Uu]n|[Pp]ar) franc\b/g, "$1 euro"],
  [/\b([Aa])pprenti(e?)(s?)\b/g, (m, a, e, p) => (a === "A" ? "É" : "é") + "lève" + p],
  [/\b([Ll])a préimage\b/g, (m, a) => a + "'antécédent"], [/\b([Uu])ne seule préimage\b/g, (m, a) => a + "n seul antécédent"],
  [/\b([Uu])ne préimage\b/g, (m, a) => a + "n antécédent"], [/\b([Ss])a préimage\b/g, (m, a) => a + "on antécédent"], [/\b([Pp]lus) (grande|petite) préimage\b/g, (m, a, b) => a + " " + b.slice(0, -1) + " antécédent"],
  [/\bpréimages\b/g, "antécédents"], [/\bPréimages\b/g, "Antécédents"], [/\bpréimage\b/g, "antécédent"], [/\bPréimage\b/g, "Antécédent"],
  [/\b([Ff])actorise \(mise en évidence\)/g, "$1actorise (facteur commun)"],
  [/\b([Mm])ise en évidence d(?:e |')/g, (m, a) => (a === "M" ? "F" : "f") + "actorisation par "],
  [/\b([Mm])ise en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "acteur commun"], [/\b([Mm])ets en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "actorise"],
  [/\b([Aa])près ((?:(?!en évidence)[^.;!?]){1,40}?) en évidence\b/g, "$1près factorisation par $2"], [/\b([Mm])ettre en évidence\b/g, (m, a) => (a === "M" ? "F" : "f") + "actoriser"], [/\b([Mm])et(s|tre|) ((?:(?!en évidence)[^.;!?]){1,40}?) en évidence\b/g, (m, a, t, x) => (a === "M" ? "F" : "f") + "actorise" + (t === "tre" ? "r" : "") + " par " + x] /* 26.11 soir : aussi « on met (x + 4) en évidence » */, [/\bmettant en évidence\b/g, "factorisant"], [/\bmis en évidence\b/g, "mis en facteur"],
  /* 26.11 (audit lycée, tools/archive/audit_fr_lycee_26-11.md) : « graphe » → courbe (représentative), « axe horizontal / vertical »
     → axe des abscisses / des ordonnées, « composantes » d'un vecteur → coordonnées, « zéro(s) » d'une fonction → racine(s)
     (au lycée seulement : FR_ZERO ci-dessous). */
  [/\b([Ll])e graphe\b/g, "$1a courbe"], [/\bau graphe\b/g, "à la courbe"], [/\bdu graphe\b/g, "de la courbe"], [/\b([Ll])es graphes\b/g, "$1es courbes"],
  [/\bdes graphes\b/g, "des courbes"], [/\b([Ss])on graphe\b/g, "$1a courbe"], [/\bun graphe\b/g, "une courbe"],
  [/\bdeux graphes\b/g, "deux courbes"], [/(?<!d')\baxe horizontal\b(?! de symétrie)/g, "axe des abscisses"], [/(?<!d')\baxe vertical\b(?! de symétrie)/g, "axe des ordonnées"],
  [/\\\)\s+en évidence\b/g, "\\) en facteur"], [/\b([Ll])e domaine de (?=[a-z] ∘)/g, "$1'ensemble de définition de "],
  [/\b([Cc])omposante(s?)\b/g, "$1oordonnée$2"],
];
/* 26.11 (audit lycée) : « zéro(s) » d'une fonction → racine(s), au lycée seulement (au collège, « racine » évoque la racine
   carrée) ; le nombre zéro et les zéros d'un nombre écrit (« complète par des zéros », « compte les zéros ») restent.
   Lu par frIdTxt (questions, Engine.finalize) et frDom (leçons, src/app.js) pour une classe française ≥ 2nde. */
const FR_ZERO = [
  [/\b(?:le |les |des )?zéro(s?) du (numérateur|dénominateur)\b/g, (m, p, w) => (p ? "les valeurs qui annulent" : "la valeur qui annule") + " le " + w],
  [/\b([Ll])e plus (petit|grand) zéro\b/g, "$1a plus $2e racine"], [/\b([Ss])on plus (petit|grand) zéro\b/g, "$1a plus $2e racine"], [/\b([Uu])n seul zéro\b/g, "$1ne seule racine"],
  [/\b([Pp]lus) (petit|grand) zéro\b/g, "$1 $2e racine"], [/\bzéro évident\b/g, "racine évidente"],
  [/\bzéro (positif|négatif|entier)\b/g, (m, a) => "racine " + { positif: "positive", "négatif": "négative", entier: "entière" }[a]],
  [/\b([Ll])e zéro\b/g, "$1a racine"], [/\b([Uu])n zéro\b/g, "$1ne racine"], [/\b([Ss])on zéro\b/g, "$1a racine"], [/\bdu zéro\b/g, "de la racine"], [/\bau zéro\b/g, "à la racine"],
  [/\bchaque zéro\b/g, "chaque racine"], [/\bZéro(?= \?| de )/g, "Racine"],
  [/\b([Tt])ous les zéros de\b/g, "$1outes les racines de"], [/(?<!(?:avec|par|ajouter|ajoute|ompte|omplète|tous|Tous) )\b(les|Les|des|ses|Ses|aux|deux|ces) zéros\b(?! après| <b>après| : le 1)/g, "$1 racines"], [/\bde zéros (?=\\\(|[-\d−])/g, "de racines "],
  [/\bzéros (?=\\\()/g, "racines "], [/\bzéro (?=\\\()/g, "racine "], [/\bracines sont (in|ex)clus\b/g, "racines sont $1cluses"], [/\bracines sont compris\b/g, "racines sont comprises"], [/\bQuels sont (les|ses|leurs) racines/g, "Quelles sont $1 racines"], [/(racines de [^,;.]{1,12}, pas) ceux\b/g, "$1 celles"], [/\bQuel est (sa|la) plus (petite|grande) racine/g, "Quelle est $1 plus $2 racine"],
];
const frZero = (t) => FR_ZERO.reduce((a, [re, by]) => a.replace(re, by), t);
/* 27.11 (décision de l'enseignant, n° 18) : en 4e et en 3e françaises, le « zéro » d'une fonction se dit « antécédent de 0 »
   (le collège ne parle ni de zéro ni de racine d'une fonction). Formes du sens « fonction » seulement (lectgraph, fimg,
   affine, leçons) ; le nombre zéro (« loin de zéro », « complète par des zéros », « autant que de zéros ») reste. Lycée :
   « racine » (FR_ZERO) ; Suisse : inchangé. Lu par frIdTxt (questions) et frDom (leçons, écrans, src/app.js). */
const FR_ZERO_COL = [
  [/\bCombien de zéros (\\\(.*?\\\)) a-t-elle\s*\?/g, "Combien 0 a-t-il d'antécédents par $1 ?"],
  [/\b([Ss]on|[Ll]e) plus (petit|grand) zéro\b/g, "$1 plus $2 antécédent de 0"], [/\b([Pp]lus) (petit|grand) zéro\b/g, "$1 $2 antécédent de 0"],
  [/\bzéro (positif|négatif|entier)\b/g, "antécédent de 0 $1"], [/\(le zéro\)/g, "(l'antécédent de 0)"],
  [/\b([Ll])e zéro d(?:e |')(?=\\\(|[a-z]\b|la fonction|une fonction)/g, "$1'antécédent de 0 par "],
  [/\b([Ll]es|[Dd]es|[Ss]es) zéros d(?:e |')(?=\\\(|[a-z]\b|la fonction|une fonction|la parabole)/g, "$1 antécédents de 0 par "],
  [/\b([Uu]n) zéro\b(?= \(| se lit)/g, "$1 antécédent de 0"],
  [/\b([Ll]es|[Dd]es|[Ss]es) zéros\b(?= \\\(| \(f| sont (?:exclus|inclus|solutions|symétriques|les|\d|\\\()| sur (?:un|le) graphique| [-−\d])/g, "$1 antécédents de 0"],
  [/\bZéros :/g, "Antécédents de 0 :"], [/\bzéros (?=\\\()/g, "antécédents de 0 "],
];
const frZeroCol = (t) => FR_ZERO_COL.reduce((a, [re, by]) => a.replace(re, by), t);
function frThouPart(t, tex) {
  return tex ? frTimes(t.replace(/\\text\{['’]\}/g, "\\,").replace(/(\d)['’](?=\d{3}(?!\d))/g, "$1\\,"))
    : t.replace(/\\text\{['’]\}/g, "\u202f").replace(/(\d)['’](?=\d{3}(?!\d))/g, "$1\u202f").replace(/(\d|\)|\?)\s·\s(?=[\d(?]|[a-zA-Z](?![A-Za-zÀ-ÿ]))/g, "$1 × ").replace(/(^|[^A-Za-zÀ-ÿ0-9])([a-zA-Z])\s·\s(?=[\d(]|[a-zA-Z](?![A-Za-zÀ-ÿ]))/g, "$1$2 × "); /* 25.11 soir : produit seulement (nombres, lettres isolées, parenthèses), pas les séparateurs de l'interface (« Mathélo · provisoire ») */
}
/* 25.11 (décision de l'enseignant) : en France, le produit s'écrit × et non avec le point médian. Le produit scalaire
   (formule avec \vec ou \overrightarrow) garde son point. */
function frTimes(t) { return /\\vec|\\overrightarrow/.test(t) ? t : t.replace(/\\cdot(?![a-zA-Z])/g, "\\times"); }
const frWords = (t) => FR_WORDS.reduce((a, [re, by]) => a.replace(re, by), t);
/* formule seule (préfiltre MathJax) */
function frLocalPart(t, tex) { return frWords(frThouPart(t, tex)); }
/* texte avec formules \( … \) : milliers selon le mode, puis les mots sur tout le texte (« mets \(t\) en évidence ») */
function frLocal(s) {
  if (typeof s !== "string" || !s) return s;
  return frWords(s.split(/(\\\([\s\S]*?\\\))/).map((t, i) => frThouPart(t, i % 2 === 1)).join(""));
}
/* Énoncés de questions seulement (25.11 soir : « Collège de Genève » devenait « Collège de Lyon » dans la présentation
   aux enseignants) : les lieux suisses d'un énoncé deviennent français ; l'interface et les pages genevoises, jamais. */
const FR_QWORDS = [[/\bGenève–Berne\b/g, "Lyon–Grenoble"] /* 26.11 soir : « trajet Lyon–Berne » */, [/\bGenève\b/g, "Lyon"], [/\bLa Brévine\b/g, "Mouthe"] /* 26.11 soir : village du Jura suisse ; Mouthe (Doubs), son équivalent français */];
/* 26.11 (audit lycée) : textes d'une question française selon la notion (Engine.finalize) : ordonnée à l'origine p (et non h)
   dans les équations de droites ; produit écrit × (et non ·) hors du produit scalaire de deux vecteurs (AB · AC, u · v). */
const FR_ORD_P = new Set(["droites", "droitesinter"]);
function frIdTxt(id, s, grade) {
  if (typeof s !== "string" || !s) return s;
  if (grade >= 10) s = frZero(s); else if (grade >= 8) s = frZeroCol(s); /* 27.11, n° 18 : 4e–3e, « antécédent de 0 » */
  if (FR_ORD_P.has(id)) s = s.replace(/(^|[^\\\w\/'’])h(?![\w'’])/g, "$1p");
  return s.replace(/(\S)[  ]?·[  ]?(?=\S)/g, (m, a, i, all) => {
    const L = all.slice(Math.max(0, i - 2), i + 1), R = all.slice(i + m.length, i + m.length + 3);
    return /(?:[A-Z]{2}|(?:^|[^A-Za-z'’])[uvwn])$/.test(L) && /^(?:[A-Z]{2}|[uvwn])(?![A-Za-z'’])/.test(R) ? m : a + " × ";
  });
}
function frLocalQ(s) { const r = frLocal(s); return typeof r === "string" ? FR_QWORDS.reduce((a, [re, by]) => a.replace(re, by), r) : r; }

// Difficulté maximale (1 = bases, 3 = approfondi) : on ne demande pas la section à l'élève ;
// c'est le Mathélo qui situe son niveau. Seules les petites classes (6e, 5e) plafonnent à 2.
function difficultyCap(profile) {
  return profile.system === "FR" && profile.grade <= 7 ? 2 : 3;
}

// Mois de l'année scolaire (0 = septembre ; août compte comme septembre).
function schoolMonth(date) {
  const mo = date.getMonth(); // 0 = janvier
  if (mo >= 7) return Math.max(0, mo - 8);
  return mo + 4; // janvier = 4 … juin = 9, juillet = 10
}
