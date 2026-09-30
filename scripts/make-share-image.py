#!/usr/bin/env python3
"""Генерира share изображение 1200x630 (Open Graph) в стила на сайта.

Пример:
  python3 scripts/make-share-image.py \
    --art public/assets/books/tobi/illustrations/tobi-happy-hp-promo.png \
    --kicker "Очаквайте скоро" \
    --title "Тоби и силата на миялната" \
    --subtitle "Нова детска книга от Kodex Publishing" \
    --out public/assets/books/tobi/tobi-share.jpg

Шрифтовете (TTF) се теглят веднъж в scripts/.fonts/ от Google Fonts.
"""
import argparse
import os
import urllib.request

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
NAVY_A, NAVY_B = (12, 28, 39), (36, 83, 107)
CREAM, GOLD = (255, 250, 240), (215, 169, 61)
FONT_DIR = os.path.join(os.path.dirname(__file__), ".fonts")
FONTS = {
    "display": ("Alegreya", 800),
    "sans": ("Alegreya+Sans", 500),
    "sans-bold": ("Alegreya+Sans", 800),
}


def font(kind: str, size: int) -> ImageFont.FreeTypeFont:
    family, weight = FONTS[kind]
    path = os.path.join(FONT_DIR, f"{family}-{weight}.ttf")
    if not os.path.exists(path):
        os.makedirs(FONT_DIR, exist_ok=True)
        css_url = f"https://fonts.googleapis.com/css2?family={family}:wght@{weight}"
        req = urllib.request.Request(css_url, headers={"User-Agent": "Mozilla/4.0"})
        css = urllib.request.urlopen(req).read().decode()
        ttf_url = css.split("url(")[1].split(")")[0]
        urllib.request.urlretrieve(ttf_url, path)
    return ImageFont.truetype(path, size)


def wrap(draw, text, fnt, max_w):
    lines, line = [], ""
    for word in text.split():
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=fnt) <= max_w:
            line = test
        else:
            lines.append(line)
            line = word
    lines.append(line)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--art", required=True, help="PNG с прозрачност (герой) или корица")
    ap.add_argument("--kicker", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--subtitle", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    img = Image.new("RGB", (W, H))
    px = img.load()
    for x in range(W):
        t = x / (W - 1)
        col = tuple(int(NAVY_A[i] + (NAVY_B[i] - NAVY_A[i]) * t) for i in range(3))
        for y in range(H):
            px[x, y] = col
    d = ImageDraw.Draw(img)
    for sx, sy, r in [(90, 80, 3), (520, 60, 2), (640, 540, 3), (1120, 90, 2), (1010, 560, 3), (360, 575, 2)]:
        d.ellipse((sx - r, sy - r, sx + r, sy + r), fill=GOLD)

    art = Image.open(a.art).convert("RGBA")
    art.thumbnail((440, 520), Image.LANCZOS)
    shadow = Image.new("RGBA", art.size, (0, 0, 0, 0))
    shadow.putalpha(art.split()[3].point(lambda v: int(v * 0.35)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    ax, ay = W - art.width - 70, (H - art.height) // 2 + 10
    img.paste((0, 0, 0), (ax + 10, ay + 18), shadow)
    img.paste(art, (ax, ay), art)

    x, max_w = 80, W - art.width - 200
    d.text((x, 150), a.kicker.upper(), font=font("sans-bold", 26), fill=GOLD)
    title_font = font("display", 76)
    y = 196
    for line in wrap(d, a.title, title_font, max_w):
        d.text((x, y), line, font=title_font, fill=CREAM)
        y += 84
    d.text((x, y + 18), a.subtitle, font=font("sans", 32), fill=(214, 224, 226))
    d.text((x, H - 80), "kodexbg.com", font=font("sans-bold", 26), fill=GOLD)

    img.save(a.out, "JPEG", quality=86, optimize=True)
    print(a.out, os.path.getsize(a.out) // 1024, "KB")


if __name__ == "__main__":
    main()
