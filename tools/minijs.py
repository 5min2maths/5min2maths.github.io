#!/usr/bin/env python3
"""Minification simple et sûre du JavaScript publié (27.11, agent poids ; tools/poids.md).

Retire les commentaires (// et /* */) et l'indentation / les espaces de fin de ligne, SANS toucher aux chaînes, aux
gabarits `…${…}…` ni aux expressions régulières littérales. Les sauts de ligne sont TOUS gardés (une ligne vide reste
une ligne vide) : les numéros de ligne des erreurs JavaScript (« app.js:1234 », tools/erreurs.py) restent ceux de la
version non minifiée, et l'insertion automatique des points-virgules ne change pas. Rien n'est renommé.
Usage : python3 tools/minijs.py fichier.js  → écrit la version minifiée sur la sortie standard.
"""
import sys

# Après ces mots, un « / » commence une expression régulière (et non une division).
_KW_RE = {"return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "instanceof", "yield", "await"}
_ID = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$")


def minify(s: str) -> str:
    out = []          # morceaux de sortie
    n = len(s)
    i = 0
    last = ""         # dernier élément significatif : "id" (identifiant / nombre / mot), ")" "]" "}" ou autre ponctuation
    last_word = ""
    stack = []        # pile des gabarits : profondeur d'accolades dans chaque ${ … }
    line_start = True  # en début de ligne (pour retirer l'indentation)

    def emit(t):
        nonlocal line_start
        out.append(t)
        line_start = False

    while i < n:
        c = s[i]
        # fin de ligne : on retire les espaces de fin, on garde le saut de ligne
        if c == "\n":
            while out and out[-1] in (" ", "\t"):
                out.pop()
            out.append("\n"); line_start = True; i += 1
            continue
        if c in " \t\r":
            j = i
            while j < n and s[j] in " \t\r":
                j += 1
            if not line_start and j < n and s[j] != "\n":
                out.append(" ")
            i = j
            continue
        # commentaires
        if c == "/" and i + 1 < n and s[i + 1] == "/":
            j = s.find("\n", i)
            i = n if j < 0 else j
            continue
        if c == "/" and i + 1 < n and s[i + 1] == "*":
            j = s.find("*/", i + 2)
            if j < 0:
                raise ValueError("commentaire /* non fermé")
            body = s[i:j + 2]
            k = body.count("\n")
            if k:
                while out and out[-1] in (" ", "\t"):
                    out.pop()
                out.append("\n" * k); line_start = True
            elif not line_start and (not out or out[-1] != " "):
                out.append(" ")
            i = j + 2
            continue
        # chaînes
        if c in "'\"":
            j = i + 1
            while j < n and s[j] != c:
                if s[j] == "\\":
                    j += 1
                elif s[j] == "\n":
                    raise ValueError("chaîne non fermée ligne %d" % (s.count("\n", 0, i) + 1))
                j += 1
            emit(s[i:j + 1]); i = j + 1; last = "id"; last_word = ""
            continue
        # gabarit : lire jusqu'au ` ou au ${
        if c == "`" or (c == "}" and stack and stack[-1] == 0):
            if c == "}":
                stack.pop()
            j = i + 1
            while j < n:
                if s[j] == "\\":
                    j += 2; continue
                if s[j] == "`":
                    break
                if s[j] == "$" and j + 1 < n and s[j + 1] == "{":
                    break
                j += 1
            if j >= n:
                raise ValueError("gabarit non fermé")
            if s[j] == "`":
                emit(s[i:j + 1]); i = j + 1; last = "id"; last_word = ""
            else:
                emit(s[i:j + 2]); i = j + 2; stack.append(0); last = "("; last_word = ""
            continue
        # expression régulière littérale
        if c == "/" and (last not in ("id", ")", "]", "}") or last_word in _KW_RE):
            j = i + 1; cls = False
            while j < n:
                d = s[j]
                if d == "\\":
                    j += 2; continue
                if d == "\n":
                    raise ValueError("expression régulière non fermée ligne %d" % (s.count("\n", 0, i) + 1))
                if cls:
                    if d == "]":
                        cls = False
                elif d == "[":
                    cls = True
                elif d == "/":
                    break
                j += 1
            j += 1
            while j < n and s[j] in _ID:
                j += 1
            emit(s[i:j]); i = j; last = "id"; last_word = ""
            continue
        if c in _ID or ord(c) > 127:
            j = i
            while j < n and (s[j] in _ID or ord(s[j]) > 127):
                j += 1
            # nombres du type 1.5e-3 : le point et l'exposant
            w = s[i:j]
            emit(w); i = j; last = "id"; last_word = w
            continue
        if c == "{" and stack:
            stack[-1] += 1
        elif c == "}" and stack:
            stack[-1] -= 1
        emit(c); i += 1
        last = c if c in ")]}" else c
        last_word = ""
    if stack:
        raise ValueError("gabarit ${ non fermé")
    return "".join(out)


if __name__ == "__main__":
    sys.stdout.write(minify(open(sys.argv[1]).read()))
