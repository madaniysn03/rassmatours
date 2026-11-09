#!/usr/bin/env python3
"""
Identité Rassma Tours : génère le symbole (étoile marocaine à huit branches),
les logos et la page de présentation, en SVG vectoriel pur.

Le texte est converti en tracés à partir des polices du site (public/fonts),
mis en forme par HarfBuzz (crénage compris) : les fichiers s'affichent à
l'identique sans aucune police installée.

Prérequis : pip install fonttools brotli uharfbuzz
Usage     : python3 scripts/generate-logo.py

Sorties :
  public/images/brand/rassma-*.svg   logos et symboles
  public/favicon.svg                 favicon (symbole, coupe petite taille)
  src/data/brand-symbol.ts           tracés du symbole pour le composant Wordmark
  docs/brand/concepts/*.svg          les trois pistes explorées
  docs/brand/logo-presentation.html  planche de présentation (autonome)
"""
import io
import math
import pathlib

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / 'public/fonts'
BRAND = ROOT / 'public/images/brand'
DOCS = ROOT / 'docs/brand'

MIDNIGHT = '#15243A'
DEEP = '#0D1727'
IVORY = '#F7F3EB'
PAPER = '#FFFDF9'
BRASS = '#B4955B'
BLACK = '#111111'
WHITE = '#FFFFFF'

TAGLINE = 'Enjoy Morocco, Your Way'


def num(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


# ---------------------------------------------------------------------------
# Géométrie de l'étoile
# ---------------------------------------------------------------------------
# Khatam : union de deux carrés tournés de 45°. Boîte 100 × 100, centre (50, 50).
# Rayon des pointes R, rayon des angles rentrants R·cos45°/cos22,5°.

R = 48


def star_points(r=R, cx=50, cy=50, rotation=0.0):
    ri = r * math.cos(math.pi / 4) / math.cos(math.pi / 8)
    pts = []
    for k in range(16):
        a = math.radians(-90 + rotation + k * 22.5)
        rr = r if k % 2 == 0 else ri
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts


def clip(pts, p, q, keep_left):
    """Découpe un polygone par la droite p→q (Sutherland-Hodgman) ; garde le
    côté gauche (sens écran) si keep_left, sinon le côté droit."""
    def side(pt):
        s = (q[0] - p[0]) * (pt[1] - p[1]) - (q[1] - p[1]) * (pt[0] - p[0])
        return s <= 0 if keep_left else s >= 0

    def cut(a, b):
        dx, dy = q[0] - p[0], q[1] - p[1]
        fa = dx * (a[1] - p[1]) - dy * (a[0] - p[0])
        fb = dx * (b[1] - p[1]) - dy * (b[0] - p[0])
        t = fa / (fa - fb)
        return (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))

    out = []
    for i, cur in enumerate(pts):
        prev = pts[i - 1]
        if side(cur):
            if not side(prev):
                out.append(cut(prev, cur))
            out.append(cur)
        elif side(prev):
            out.append(cut(prev, cur))
    return out


def channel_halves(pts, edge, waist):
    """Fend le polygone par un canal horizontal centré sur y = 50, large de
    `edge` aux pointes est et ouest et de `waist` au centre : les deux rives
    du détroit se rapprochent."""
    top, bottom = pts, pts
    for x0, x1 in ((0, 50), (50, 100)):
        y0 = 50 - (edge if x0 == 0 else waist) / 2
        y1 = 50 - (waist if x0 == 0 else edge) / 2
        top = clip(top, (x0, y0), (x1, y1), True)
        bottom = clip(bottom, (x0, 100 - y0), (x1, 100 - y1), False)
    return top, bottom


def poly(pts):
    return 'M' + 'L'.join(f'{num(x)} {num(y)}' for x, y in pts) + 'Z'


def circle(cx, cy, r):
    return (f'M{num(cx - r)} {num(cy)}A{num(r)} {num(r)} 0 1 0 {num(cx + r)} {num(cy)}'
            f'A{num(r)} {num(r)} 0 1 0 {num(cx - r)} {num(cy)}Z')


# Deux coupes : « std » pour 32 px et plus, « small » (canal et anneau plus
# ouverts) pour le favicon et les très petites tailles.
CUTS = {
    'std': dict(edge=6.5, waist=3.6, sun_y=30.5, hole=10, disc=6.5),
    'small': dict(edge=9.5, waist=7, sun_y=30, hole=11.5, disc=6.5),
}


def detroit_paths(cut='std'):
    """Concept retenu « Le Détroit » : l'étoile pleine, fendue de la pointe
    ouest (Atlantique) à la pointe est (Méditerranée) par un canal qui se
    resserre au centre comme le détroit, le soleil réservé en négatif
    au-dessus de l'horizon."""
    c = CUTS[cut]
    top, bottom = channel_halves(star_points(), c['edge'], c['waist'])
    star = poly(top) + circle(50, c['sun_y'], c['hole']) + poly(bottom)
    return star, (50, c['sun_y'], c['disc'])


def symbol_group(x, y, size, star_color, sun_color, cut='std'):
    star, (cx, cy, r) = detroit_paths(cut)
    s = size / 100
    return (f'<g transform="translate({num(x)} {num(y)}) scale({num(s)})">'
            f'<path fill="{star_color}" fill-rule="evenodd" d="{star}"/>'
            f'<circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}" fill="{sun_color}"/></g>')


# Pistes explorées (boîte 100 × 100) -----------------------------------------

def concept_a(ink, accent):
    """A · Horizon de zellige : l'étoile en filet, le monogramme actuel
    (soleil, horizon, reflet) inscrit dedans."""
    return (f'<path d="{poly(star_points(r=46.5))}" fill="none" stroke="{ink}" stroke-width="3" stroke-linejoin="miter"/>'
            f'<circle cx="50" cy="41" r="9" fill="none" stroke="{accent}" stroke-width="3"/>'
            f'<path d="M27 57.5H73" stroke="{ink}" stroke-width="3" stroke-linecap="round"/>'
            f'<path d="M37 65.5H63" stroke="{accent}" stroke-width="2.5" stroke-linecap="round"/>')


def concept_b(ink, accent):
    star, (cx, cy, r) = detroit_paths('std')
    return (f'<path fill="{ink}" fill-rule="evenodd" d="{star}"/>'
            f'<circle cx="{num(cx)}" cy="{num(cy)}" r="{num(r)}" fill="{accent}"/>')


def concept_c(ink, accent):
    """C · Bab : l'étoile pleine percée d'un arc outrepassé, la porte de
    Tanger, avec le soleil au cœur de l'arc."""
    door_half, arc_r, arc_cy, base = 11.5, 14, 47, 77
    dy = math.sqrt(arc_r ** 2 - door_half ** 2)
    door = (f'M{num(50 - door_half)} {base}L{num(50 - door_half)} {num(arc_cy + dy)}'
            f'A{arc_r} {arc_r} 0 1 1 {num(50 + door_half)} {num(arc_cy + dy)}'
            f'L{num(50 + door_half)} {base}Z')
    return (f'<path fill="{ink}" fill-rule="evenodd" d="{poly(star_points())}{door}"/>'
            f'<circle cx="50" cy="45" r="5.5" fill="{accent}"/>'
            f'<path d="M{num(50 - door_half)} 64H{num(50 + door_half)}" stroke="{accent}" stroke-width="2"/>')


# ---------------------------------------------------------------------------
# Texte vectorisé
# ---------------------------------------------------------------------------

class Font:
    def __init__(self, filename):
        tt = TTFont(FONTS / filename)
        tt.flavor = None
        buf = io.BytesIO()
        tt.save(buf)
        self.tt = TTFont(io.BytesIO(buf.getvalue()))
        self.hb = hb.Font(hb.Face(buf.getvalue()))
        self.glyphs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upm = self.tt['head'].unitsPerEm
        self.cap = self.tt['OS/2'].sCapHeight / self.upm

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb, buf, {'kern': True})
        return [(self.order[i.codepoint], p.x_advance, p.x_offset, p.y_offset)
                for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def width(self, text, size, track=0.0):
        """Largeur optique : sans l'interlettrage après la dernière lettre."""
        glyphs = self.shape(text)
        return sum(g[1] for g in glyphs) * size / self.upm + track * size * (len(glyphs) - 1)

    def path(self, text, x, baseline, size, fill, track=0.0):
        s = size / self.upm
        pen = SVGPathPen(self.glyphs, ntos=num)
        bounds = BoundsPen(self.glyphs)
        for name, adv, xo, yo in self.shape(text):
            m = (s, 0, 0, -s, x + xo * s, baseline - yo * s)
            self.glyphs[name].draw(TransformPen(pen, m))
            self.glyphs[name].draw(TransformPen(bounds, m))
            x += adv * s + track * size
        return f'<path fill="{fill}" d="{pen.getCommands()}"/>', bounds.bounds


DISPLAY = Font('cormorant-garamond-600-normal-latin.woff2')
ITALIC = Font('cormorant-garamond-400-italic-latin.woff2')
JOST = Font('jost-500-normal-latin.woff2')


def svg_doc(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(w)} {num(h)}" '
            f'width="{num(w)}" height="{num(h)}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


# ---------------------------------------------------------------------------
# Compositions
# ---------------------------------------------------------------------------

def primary(ink, sun, accent, tagline=True):
    """Logo principal : symbole au-dessus du nom, accroche en italique."""
    pad, sym = 16, 112
    s_name, t_name = 60, 0.16
    s_tours, t_tours = 14, 0.62
    s_tag = 21
    w_name = DISPLAY.width('RASSMA', s_name, t_name)
    w_tours = JOST.width('TOURS', s_tours, t_tours)
    w_tag = ITALIC.width(TAGLINE, s_tag)
    width = max(w_name, w_tours + 2 * 46, w_tag) + 2 * pad
    mid = width / 2

    y_name = pad + sym + 30 + DISPLAY.cap * s_name
    y_tours = y_name + 20 + JOST.cap * s_tours
    y_tag = y_tours + 36

    body = symbol_group(mid - sym / 2, pad, sym, ink, sun)
    name, _ = DISPLAY.path('RASSMA', mid - w_name / 2, y_name, s_name, ink, t_name)
    tours, _ = JOST.path('TOURS', mid - w_tours / 2, y_tours, s_tours, ink, t_tours)
    body += name + tours
    rule_y = y_tours - JOST.cap * s_tours / 2
    for x1, x2 in ((mid - w_tours / 2 - 44, mid - w_tours / 2 - 16), (mid + w_tours / 2 + 16, mid + w_tours / 2 + 44)):
        body += f'<path d="M{num(x1)} {num(rule_y)}H{num(x2)}" stroke="{accent}" stroke-width="1.25"/>'
    bottom = y_tours + pad
    if tagline:
        tag, (_, _, _, tag_bottom) = ITALIC.path(TAGLINE, mid - w_tag / 2, y_tag, s_tag, ink)
        body += tag
        bottom = tag_bottom + pad
    return width, bottom, body


def horizontal(ink, sun):
    """Logo secondaire : symbole à gauche du nom, pour les en-têtes."""
    pad, sym, gap = 8, 72, 20
    s_name, t_name = 46, 0.14
    s_tours, t_tours = 11.5, 0.62
    cap_name = DISPLAY.cap * s_name
    cap_tours = JOST.cap * s_tours
    block = cap_name + 11 + cap_tours
    top = pad + sym / 2 - block / 2
    x = pad + sym + gap
    body = symbol_group(pad, pad, sym, ink, sun)
    name, _ = DISPLAY.path('RASSMA', x, top + cap_name, s_name, ink, t_name)
    tours, _ = JOST.path('TOURS', x + 1.5, top + block, s_tours, ink, t_tours)
    body += name + tours
    width = x + max(DISPLAY.width('RASSMA', s_name, t_name), JOST.width('TOURS', s_tours, t_tours)) + pad
    return width, sym + 2 * pad, body


def symbol_file(star_color, sun_color, cut='std', pad=4):
    size = 100
    return size + 2 * pad, symbol_group(pad, pad, size, star_color, sun_color, cut)


def tile(bg, star_color, sun_color, radius, size=64, ratio=0.72):
    sym = size * ratio
    o = (size - sym) / 2
    rect = f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>'
    # Correction optique : l'étoile, plus lourde en bas (canal sous le centre), remonte d'un cheveu.
    return size, rect + symbol_group(o, o - size * 0.01, sym, star_color, sun_color, 'small')


# ---------------------------------------------------------------------------
# Écriture
# ---------------------------------------------------------------------------

def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')
    print('  ', path.relative_to(ROOT))


def main():
    files = {}

    w, h, b = primary(MIDNIGHT, BRASS, BRASS)
    files['rassma-logo.svg'] = svg_doc(w, h, b, f'Rassma Tours — {TAGLINE}')
    w, h, b = primary(IVORY, BRASS, BRASS)
    files['rassma-logo-ivory.svg'] = svg_doc(w, h, b, f'Rassma Tours — {TAGLINE}')
    w, h, b = primary(MIDNIGHT, MIDNIGHT, MIDNIGHT)
    files['rassma-logo-monochrome.svg'] = svg_doc(w, h, b, f'Rassma Tours — {TAGLINE}')

    w, h, b = horizontal(MIDNIGHT, BRASS)
    files['rassma-logo-horizontal.svg'] = svg_doc(w, h, b, 'Rassma Tours')
    w, h, b = horizontal(IVORY, BRASS)
    files['rassma-logo-horizontal-ivory.svg'] = svg_doc(w, h, b, 'Rassma Tours')

    s, b = symbol_file(MIDNIGHT, BRASS)
    files['rassma-symbol.svg'] = svg_doc(s, s, b, 'Rassma Tours')
    s, b = symbol_file(IVORY, BRASS)
    files['rassma-symbol-ivory.svg'] = svg_doc(s, s, b, 'Rassma Tours')
    s, b = symbol_file(MIDNIGHT, MIDNIGHT)
    files['rassma-symbol-monochrome.svg'] = svg_doc(s, s, b, 'Rassma Tours')
    s, b = tile(MIDNIGHT, IVORY, BRASS, radius=0, size=512, ratio=0.6)
    files['rassma-avatar.svg'] = svg_doc(s, s, b, 'Rassma Tours')

    print('Logos :')
    for name, text in files.items():
        write(BRAND / name, text)

    s, b = tile(MIDNIGHT, IVORY, BRASS, radius=14)
    write(ROOT / 'public/favicon.svg', svg_doc(s, s, b, 'Rassma Tours'))

    star, (cx, cy, r) = detroit_paths('std')
    write(ROOT / 'src/data/brand-symbol.ts',
          '// Généré par scripts/generate-logo.py : ne pas modifier à la main.\n'
          '/** Symbole Rassma Tours « Le Détroit », boîte 100 × 100 (fill-rule evenodd). */\n'
          'export const brandSymbol = {\n'
          f"  star: '{star}',\n"
          f'  sun: {{ cx: {num(cx)}, cy: {num(cy)}, r: {num(r)} }},\n'
          '} as const\n')

    concepts = {
        'a-horizon-de-zellige': concept_a,
        'b-le-detroit': concept_b,
        'c-bab': concept_c,
    }
    for slug, fn in concepts.items():
        write(DOCS / f'concepts/concept-{slug}.svg', svg_doc(100, 100, fn(MIDNIGHT, BRASS), f'Concept {slug}'))

    write(DOCS / 'logo-presentation.html', presentation(files, concepts))


# ---------------------------------------------------------------------------
# Planche de présentation
# ---------------------------------------------------------------------------

def inline(svg_text, cls=''):
    """SVG en ligne, sans dimensions fixes (la mise en page décide)."""
    import re
    svg_text = re.sub(r' width="[^"]+" height="[^"]+"', '', svg_text, count=1)
    return svg_text.replace('<svg ', f'<svg class="{cls}" ', 1).strip()


def recolor(svg_text, color):
    for c in (MIDNIGHT, BRASS, IVORY):
        svg_text = svg_text.replace(f'"{c}"', f'"{color}"')
    return svg_text


def presentation(files, concepts):
    def concept_svg(fn, ink, accent, cls=''):
        return f'<svg class="{cls}" viewBox="0 0 100 100" aria-hidden="true">{fn(ink, accent)}</svg>'

    concept_text = {
        'a-horizon-de-zellige': ('A', 'Horizon de zellige',
            "L'étoile tracée en filet encadre le monogramme actuel : soleil, horizon, reflet. "
            "Continuité maximale avec le site, mais l'étoile reste un cadre, et les filets fins disparaissent sous 24 px."),
        'b-le-detroit': ('B', 'Le Détroit',
            "Une étoile pleine, fendue de la pointe ouest (Atlantique) à la pointe est (Méditerranée) "
            "par un canal qui se resserre au centre, comme le détroit devant Tanger. Au-dessus de cet horizon, "
            "le soleil est réservé en négatif. Silhouette forte, lisible en une couleur et à 16 px."),
        'c-bab': ('C', 'Bab',
            "L'étoile percée d'un arc outrepassé, la porte de Tanger, avec le soleil au cœur de l'arc. "
            "Belle idée de passage, mais l'arc évoque vite une serrure et la composition s'alourdit en petit."),
    }
    concept_cards = ''
    for slug, fn in concepts.items():
        letter, title, text = concept_text[slug]
        chosen = slug == 'b-le-detroit'
        sizes = ''.join(concept_svg(fn, MIDNIGHT, BRASS, f'sz sz{p}') for p in (16, 24, 32))
        concept_cards += f'''
      <article class="concept{' chosen' if chosen else ''}">
        <div class="concept-art">{concept_svg(fn, MIDNIGHT, BRASS, 'big')}</div>
        <div class="concept-dark">{concept_svg(fn, IVORY, BRASS, 'mid')}</div>
        <div class="sizes">{sizes}</div>
        <p class="eyebrow">Piste {letter}{' · retenue' if chosen else ''}</p>
        <h3>{title}</h3>
        <p>{text}</p>
      </article>'''

    sizes_row = ''.join(
        f'<figure><div class="sz-box">{inline(files["rassma-symbol.svg"], "")}</div><figcaption>{p} px</figcaption></figure>'
        .replace('<svg class=""', f'<svg style="width:{p}px;height:{p}px"', 1)
        for p in (16, 24, 32, 48, 64, 96))
    fav = (ROOT / 'public/favicon.svg').read_text(encoding='utf-8')
    fav_row = ''.join(
        f'<figure><div class="sz-box">{inline(fav, "")}</div><figcaption>{p} px</figcaption></figure>'
        .replace('<svg class=""', f'<svg style="width:{p}px;height:{p}px"', 1)
        for p in (16, 32, 64))

    mono = files['rassma-logo-monochrome.svg']
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Rassma Tours · Logo</title>
<style>
  @font-face {{ font-family: "Cormorant Garamond"; font-weight: 500; src: url(/fonts/cormorant-garamond-500-normal-latin.woff2) format("woff2"), url(../../public/fonts/cormorant-garamond-500-normal-latin.woff2) format("woff2"); }}
  @font-face {{ font-family: "Cormorant Garamond"; font-weight: 400; font-style: italic; src: url(/fonts/cormorant-garamond-400-italic-latin.woff2) format("woff2"), url(../../public/fonts/cormorant-garamond-400-italic-latin.woff2) format("woff2"); }}
  @font-face {{ font-family: "Jost"; font-weight: 300 500; src: url(/fonts/jost-400-normal-latin.woff2) format("woff2"), url(../../public/fonts/jost-400-normal-latin.woff2) format("woff2"); }}
  :root {{ --ivory:{IVORY}; --paper:{PAPER}; --sand:#EEE6D6; --line:#DCCFB8; --midnight:{MIDNIGHT}; --deep:{DEEP}; --brass:{BRASS}; --ink:#1B1A17; --ink-soft:#514E47; --ink-mute:#87827A; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--ivory); color: var(--ink); font: 300 16px/1.65 Jost, system-ui, sans-serif; }}
  .wrap {{ max-width: 1180px; margin: 0 auto; padding: 0 20px; }}
  header.top {{ padding: 72px 0 40px; }}
  h1, h2, h3 {{ font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; letter-spacing: -0.01em; margin: 0; color: var(--midnight); }}
  h1 {{ font-size: clamp(2.6rem, 6vw, 4.2rem); line-height: 1; }}
  h1 em {{ font-style: italic; font-weight: 400; }}
  h2 {{ font-size: clamp(1.9rem, 4vw, 2.6rem); line-height: 1.1; margin-bottom: 12px; }}
  h3 {{ font-size: 1.6rem; margin: 4px 0 8px; }}
  .eyebrow {{ display: inline-flex; align-items: center; gap: 12px; margin: 0 0 14px; font: 500 11px/1 Jost, sans-serif; letter-spacing: .24em; text-transform: uppercase; color: var(--brass); }}
  .eyebrow::before {{ content: ""; width: 32px; height: 1px; background: var(--brass); }}
  .lead {{ max-width: 62ch; font-size: 1.12rem; color: var(--ink-soft); }}
  section {{ padding: 64px 0; border-top: 1px solid var(--line); }}
  .grid3 {{ display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin-top: 32px; }}
  .concept {{ background: var(--paper); border-radius: 16px; padding: 24px; border: 1px solid transparent; }}
  .concept.chosen {{ border-color: var(--brass); }}
  .concept p:last-child {{ color: var(--ink-soft); font-size: .95rem; margin: 0; }}
  .concept-art {{ display: grid; place-items: center; padding: 24px 0; }}
  .concept-art .big {{ width: 150px; height: 150px; }}
  .concept-dark {{ display: grid; place-items: center; background: var(--midnight); border-radius: 12px; padding: 18px; margin-bottom: 16px; }}
  .concept-dark .mid {{ width: 64px; height: 64px; }}
  .sizes {{ display: flex; gap: 18px; align-items: flex-end; margin-bottom: 20px; }}
  .sz16 {{ width: 16px; height: 16px; }} .sz24 {{ width: 24px; height: 24px; }} .sz32 {{ width: 32px; height: 32px; }}
  .panels {{ display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); margin-top: 32px; }}
  .panel {{ border-radius: 16px; display: grid; place-items: center; padding: 56px 32px; min-height: 340px; position: relative; }}
  .panel.light {{ background: var(--ivory); box-shadow: inset 0 0 0 1px var(--line); }}
  .panel.paper {{ background: var(--paper); box-shadow: inset 0 0 0 1px var(--line); }}
  .panel.dark {{ background: var(--midnight); }}
  .panel.deep {{ background: var(--deep); }}
  .panel.black {{ background: #fff; box-shadow: inset 0 0 0 1px var(--line); }}
  .panel.white {{ background: #111; }}
  .panel .tag {{ position: absolute; left: 16px; bottom: 12px; font: 500 10px/1 Jost, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-mute); }}
  .panel.dark .tag, .panel.deep .tag, .panel.white .tag {{ color: rgba(247,243,235,.55); }}
  .logo-primary {{ width: min(300px, 80%); height: auto; }}
  .logo-h {{ width: min(380px, 90%); height: auto; }}
  .symbol {{ width: 150px; height: 150px; }}
  .row {{ display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-end; margin-top: 28px; }}
  figure {{ margin: 0; text-align: center; }}
  figcaption {{ margin-top: 8px; font-size: 12px; color: var(--ink-mute); }}
  .sz-box {{ display: grid; place-items: end center; min-height: 96px; }}
  .header-demo {{ margin-top: 32px; border-radius: 16px; overflow: hidden; box-shadow: inset 0 0 0 1px var(--line); }}
  .header-demo .bar {{ display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 28px; background: var(--ivory); border-bottom: 1px solid var(--line); }}
  .header-demo .bar.dark {{ background: var(--midnight); border: 0; }}
  .header-demo nav {{ display: flex; gap: 26px; font: 500 11px/1 Jost, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); }}
  .header-demo .dark nav {{ color: rgba(247,243,235,.8); }}
  .header-demo .bar svg {{ height: 40px; width: auto; }}
  .swatches {{ display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-top: 28px; }}
  .sw {{ border-radius: 12px; padding: 72px 14px 12px; font-size: 12px; box-shadow: inset 0 0 0 1px var(--line); }}
  .sw b {{ display: block; font-weight: 500; }}
  .rules {{ display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 28px; }}
  .rules h3 {{ font-size: 1.3rem; }}
  .rules p {{ margin: 0; color: var(--ink-soft); font-size: .95rem; }}
  footer {{ padding: 40px 0 64px; font-size: 13px; color: var(--ink-mute); border-top: 1px solid var(--line); }}
  @media (max-width: 640px) {{ .header-demo nav {{ display: none; }} header.top {{ padding-top: 48px; }} section {{ padding: 48px 0; }} }}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <p class="eyebrow">Identité · octobre 2026</p>
    <h1>Rassma Tours, <em>le Détroit</em></h1>
    <p class="lead">Un symbole construit sur le khatam, l'étoile marocaine à huit branches, réinterprété avec retenue : l'étoile est fendue par le détroit de Gibraltar, entre Méditerranée et Atlantique, et le soleil se lève au-dessus de l'horizon de Tanger.</p>
  </header>

  <section>
    <p class="eyebrow">Exploration</p>
    <h2>Trois lectures de l'étoile</h2>
    <p class="lead">Chaque piste part de la même géométrie (deux carrés tournés de 45°) et est testée en grand, sur bleu nuit, puis à 16, 24 et 32 px.</p>
    <div class="grid3">{concept_cards}
    </div>
  </section>

  <section>
    <p class="eyebrow">Logo principal</p>
    <h2>Symbole, nom et signature</h2>
    <p class="lead">Le nom en Cormorant Garamond, capitales espacées ; « Tours » en Jost, encadré de deux filets laiton ; la signature en italique. Le laiton est réservé au soleil et aux filets.</p>
    <div class="panels">
      <div class="panel light">{inline(files['rassma-logo.svg'], 'logo-primary')}<span class="tag">Bleu nuit sur ivoire</span></div>
      <div class="panel dark">{inline(files['rassma-logo-ivory.svg'], 'logo-primary')}<span class="tag">Ivoire sur bleu nuit</span></div>
    </div>
  </section>

  <section>
    <p class="eyebrow">Logo secondaire</p>
    <h2>Version horizontale, pour les en-têtes</h2>
    <div class="panels">
      <div class="panel paper" style="min-height:220px">{inline(files['rassma-logo-horizontal.svg'], 'logo-h')}<span class="tag">Papier</span></div>
      <div class="panel deep" style="min-height:220px">{inline(files['rassma-logo-horizontal-ivory.svg'], 'logo-h')}<span class="tag">Bleu nuit profond</span></div>
    </div>
    <div class="header-demo">
      <div class="bar">{inline(files['rassma-logo-horizontal.svg'])}<nav><span>Tours</span><span>From Spain</span><span>Destinations</span><span>Contact</span></nav></div>
      <div class="bar dark">{inline(files['rassma-logo-horizontal-ivory.svg'])}<nav><span>Tours</span><span>From Spain</span><span>Destinations</span><span>Contact</span></nav></div>
    </div>
  </section>

  <section>
    <p class="eyebrow">Symbole seul</p>
    <h2>Favicon, avatar, photo de profil</h2>
    <div class="panels">
      <div class="panel light">{inline(files['rassma-symbol.svg'], 'symbol')}<span class="tag">Symbole</span></div>
      <div class="panel dark">{inline(files['rassma-symbol-ivory.svg'], 'symbol')}<span class="tag">Symbole inversé</span></div>
      <div class="panel paper">{inline(files['rassma-avatar.svg'], 'symbol').replace('class="symbol"', 'class="symbol" style="border-radius:50%"', 1)}<span class="tag">Avatar réseaux sociaux</span></div>
    </div>
    <div class="row">{sizes_row}</div>
    <div class="row">{fav_row}</div>
    <p class="lead" style="margin-top:20px;font-size:1rem">Le favicon utilise une coupe « petite taille » : canal et anneau du soleil plus ouverts, pour rester net à 16 px.</p>
  </section>

  <section>
    <p class="eyebrow">Monochrome</p>
    <h2>Une seule couleur, même silhouette</h2>
    <div class="panels">
      <div class="panel light">{inline(mono, 'logo-primary')}<span class="tag">Bleu nuit</span></div>
      <div class="panel black">{inline(recolor(mono, BLACK), 'logo-primary')}<span class="tag">Noir</span></div>
      <div class="panel white">{inline(recolor(mono, WHITE), 'logo-primary')}<span class="tag">Blanc</span></div>
    </div>
  </section>

  <section>
    <p class="eyebrow">Couleurs</p>
    <h2>Palette du logo</h2>
    <div class="swatches">
      <div class="sw" style="background:{MIDNIGHT};color:{IVORY}"><b>Bleu nuit</b>{MIDNIGHT}</div>
      <div class="sw" style="background:{DEEP};color:{IVORY}"><b>Bleu nuit profond</b>{DEEP}</div>
      <div class="sw" style="background:{IVORY}"><b>Ivoire</b>{IVORY}</div>
      <div class="sw" style="background:{PAPER}"><b>Papier</b>{PAPER}</div>
      <div class="sw" style="background:{BRASS};color:{DEEP}"><b>Laiton</b>{BRASS} · accent seulement</div>
    </div>
  </section>

  <section>
    <p class="eyebrow">Usage</p>
    <h2>Règles simples</h2>
    <div class="rules">
      <div><h3>Zone de protection</h3><p>Autour du logo, laisser au moins la hauteur du canal multipliée par quatre (environ un quart du symbole).</p></div>
      <div><h3>Tailles minimales</h3><p>Logo principal : 120 px de large. Logo horizontal : 120 px. Symbole : 16 px avec le favicon, 24 px sinon.</p></div>
      <div><h3>Laiton</h3><p>Uniquement pour le soleil et les filets. Jamais en fond, jamais en dégradé ni effet métallique.</p></div>
      <div><h3>À éviter</h3><p>Ombres, contours ajoutés, rotation de l'étoile, recoloration du soleil hors palette, étirement.</p></div>
    </div>
  </section>

  <footer>Fichiers : public/images/brand/ · Source : scripts/generate-logo.py · Polices : Cormorant Garamond et Jost (SIL OFL), vectorisées.</footer>
</div>
</body>
</html>
'''


if __name__ == '__main__':
    main()
