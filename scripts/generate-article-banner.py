#!/usr/bin/env python3
"""Generator banner artikel panduan LocaGo Creative — template GELAP (1200x630).

Template baku (dipilih Fahmi 2026-11-20, dicatat di MEMORY.md):
  - Ukuran 1200x630 (hero artikel + cover daftar artikel + og:image).
  - Latar charcoal gelap + aksen hijau emerald (#10B981, warna situs).
  - Label "PANDUAN" (pill emerald) di atas, nama repo besar putih (1 baris,
    ukuran menyesuaikan otomatis), garis emerald pendek, domain di kiri bawah,
    logo LocaGo asli (public/logo.png) dalam chip putih kecil di kanan bawah.
  - Visual utama = SATU screenshot asli repo (bukan gambar AI/sintetis).
  - JANGAN tulis judul panjang di dalam gambar — judul tetap di HTML.
  - Varian "icon": bila repo tidak punya screenshot bagus (mis. superpowers),
    pakai logo resmi repo di dalam kartu gelap, tanpa mengarang screenshot.

Cara pakai:
  # Semua panduan di manifest (unduh aset resmi + generate + simpan):
  python3 scripts/generate-article-banner.py --all

  # Satu panduan dari manifest:
  python3 scripts/generate-article-banner.py --slug panduan-diagram-design

  # Manual (panduan baru — isi URL aset ASLI dari README repo):
  python3 scripts/generate-article-banner.py --name "NamaRepo" --image <url-gambar-asli> \\
      --variant landscape|portrait|icon --out public/banners/articles/guide-<slug>.webp

  Setelah generate: update kolom `cover` artikel di Supabase ke path hasil
  (mis. /banners/articles/guide-diagram-design.webp), lalu deploy.

  Opsi: --repo <path-repo> (default: direktori repo tempat script ini berada,
  dicari ke atas dari file script), --logo <path-logo.png>.
"""
import argparse
import io
import os
import subprocess
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
EMERALD = (16, 185, 129)
EMERALD_LIGHT = (52, 211, 153)
CHARCOAL_TOP = (21, 24, 31)
CHARCOAL_BOTTOM = (11, 13, 17)
WHITE = (255, 255, 255)
MUTED = (154, 163, 178)
CARD = (27, 32, 41)

FONT_DIR = "/usr/share/fonts/truetype/noto"
FONT_XBOLD = os.path.join(FONT_DIR, "NotoSans-ExtraBold.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "NotoSans-Bold.ttf")
FONT_REG = os.path.join(FONT_DIR, "NotoSans-Regular.ttf")

# Manifest panduan: nama tampil, URL aset ASLI repo, varian.
# Sumber aset sudah diverifikasi dari isi artikel (README resmi masing-masing repo).
GUIDES = {
    "panduan-spaceship-ide": {
        "name": "Spaceship IDE",
        # Video demo resmi (repo). Frame ke-5 detik dipakai sebagai visual —
        # frame 0/poster lama hitam pekat. Poster artikel ikut dibuat ulang
        # dari frame yang sama (poster_out).
        "image": "public/assets/articles/spaceship-screencast.mp4",
        "frame_at": 5.0,
        "poster_out": "public/assets/articles/spaceship-screencast-poster.jpg",
        "variant": "landscape",
        "out": "public/banners/articles/guide-spaceship-ide.webp",
    },
    "panduan-diagram-design": {
        "name": "diagram-design",
        "image": "https://raw.githubusercontent.com/cathrynlavery/diagram-design/main/docs/hero/hero-light.webp",
        "variant": "landscape",
        "out": "public/banners/articles/guide-diagram-design.webp",
    },
    "panduan-superpowers": {
        "name": "superpowers",
        "image": "https://raw.githubusercontent.com/obra/superpowers/main/assets/app-icon.png",
        "variant": "icon",
        "out": "public/banners/articles/guide-superpowers.webp",
    },
    "panduan-affine": {
        "name": "AFFiNE",
        "image": "https://cdn.affine.pro/Github_hero_image2.png",
        "variant": "landscape",
        "out": "public/banners/articles/guide-affine.webp",
    },
    "panduan-autoclip": {
        "name": "AutoClip",
        "image": "https://raw.githubusercontent.com/zhouxiaoka/autoclip/main/docs/images/demos/gates-ezra-01.jpg",
        "variant": "portrait",
        "out": "public/banners/articles/guide-autoclip.webp",
    },
    "panduan-scrapling": {
        "name": "Scrapling",
        "image": "https://raw.githubusercontent.com/D4Vinci/Scrapling/main/docs/assets/main_cover.png",
        "variant": "landscape",
        "out": "public/banners/articles/guide-scrapling.webp",
    },
    "panduan-nuclei": {
        "name": "Nuclei",
        "image": "https://raw.githubusercontent.com/projectdiscovery/nuclei/dev/static/nuclei-cover.png",
        "variant": "landscape",
        "out": "public/banners/articles/guide-nuclei.webp",
    },
    "panduan-zaproxy": {
        "name": "ZAP",
        # Screenshot UI desktop resmi dari Getting Started Guide ZAP.
        "image": "https://www.zaproxy.org/getting-started/images/zap-full-screen.png",
        "variant": "landscape",
        "out": "public/banners/articles/guide-zaproxy.webp",
    },
    "panduan-openvino": {
        "name": "openvino",
        # Logo resmi Intel OpenVINO (avatar org GitHub openvinotoolkit,
        # disimpan lokal — README repo tidak punya screenshot/demo).
        "image": "public/assets/articles/openvino-logo.png",
        "variant": "icon",
        "out": "public/banners/articles/guide-openvino.webp",
    },
}

# Frame visual (x, y, w, h) per varian — kanan canvas.
# Landscape 560x300 (rasio 1,87): cukup lebar sehingga screenshot repo 2:1
# (mis. hero diagram-design) hampir utuh, tanpa teks terpotong di tengah huruf.
FRAMES = {
    "landscape": (576, 165, 560, 300),
    "portrait": (836, 80, 300, 470),
    "icon": (576, 165, 560, 300),
}


def find_repo_root(start):
    d = os.path.abspath(start)
    while True:
        if os.path.exists(os.path.join(d, "package.json")) and os.path.isdir(os.path.join(d, "components")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            return os.path.abspath(start)
        d = parent


def load_logo(repo_root, logo_arg):
    """Logo LocaGo asli (public/logo.png). Ambil dari disk, bila tidak ada
    (sparse checkout) ambil dari git HEAD."""
    if logo_arg and os.path.exists(logo_arg):
        return Image.open(logo_arg)
    disk = os.path.join(repo_root, "public", "logo.png")
    if os.path.exists(disk):
        return Image.open(disk)
    out = subprocess.run(["git", "-C", repo_root, "show", "HEAD:public/logo.png"],
                         capture_output=True, check=True)
    return Image.open(io.BytesIO(out.stdout))


def extract_video_frame(video_path, seconds):
    """Ambil 1 frame dari video (ffmpeg) — untuk video demo resmi repo yang
    frame awalnya hitam/kosong. Kembalikan Image RGB."""
    import tempfile
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    tmp.close()
    subprocess.run(["ffmpeg", "-v", "error", "-ss", str(seconds), "-i", video_path,
                    "-frames:v", "1", "-q:v", "3", "-y", tmp.name], check=True)
    img = Image.open(tmp.name)
    img.load()
    return img, tmp.name


def download_image(url, repo_root=None):
    """Ambil gambar: path lokal (relatif ke repo, via disk atau git HEAD bila
    sparse checkout), URL http(s), atau video .mp4 (frame di tengah video —
    butuh kunci 'frame_at' di manifest; lihat main())."""
    if not url.startswith("http"):
        if repo_root and os.path.exists(os.path.join(repo_root, url)):
            return Image.open(os.path.join(repo_root, url))
        if os.path.exists(url):
            return Image.open(url)
        if repo_root:
            out = subprocess.run(["git", "-C", repo_root, "show", f"HEAD:{url}"],
                                 capture_output=True, check=True)
            return Image.open(io.BytesIO(out.stdout))
    req = urllib.request.Request(url, headers={"User-Agent": "LocaGo-BannerGen/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if len(data) < 1000:
        raise ValueError(f"unduhan terlalu kecil ({len(data)} byte): {url}")
    return Image.open(io.BytesIO(data))


def cover_crop(img, fw, fh):
    """Potong tengah agar memenuhi frame (tanpa distorsi)."""
    if img.mode == "RGBA":
        bg = Image.new("RGBA", img.size, (16, 18, 22, 255))
        img = Image.alpha_composite(bg, img).convert("RGB")
    else:
        img = img.convert("RGB")
    iw, ih = img.size
    scale = max(fw / iw, fh / ih)
    nw, nh = int(iw * scale + 0.5), int(ih * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    x = (nw - fw) // 2
    y = (nh - fh) // 2
    return img.crop((x, y, x + fw, y + fh))


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def font(path, size):
    return ImageFont.truetype(path, size)


def draw_tracked(draw, xy, text, fnt, fill, tracking=5):
    """Tulis teks dengan letter-spacing (PIL tidak punya tracking bawaan)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def fit_font(text, max_w, start=88, minimum=44):
    size = start
    while size > minimum:
        f = font(FONT_XBOLD, size)
        if ImageDraw.Draw(Image.new("RGB", (10, 10))).textlength(text, font=f) <= max_w:
            return f, size
        size -= 2
    return font(FONT_XBOLD, minimum), minimum


def build(name, img, variant, logo):
    canvas = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(canvas)
    # Latar: gradasi vertikal charcoal.
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(
            int(CHARCOAL_TOP[i] + (CHARCOAL_BOTTOM[i] - CHARCOAL_TOP[i]) * t) for i in range(3)))
    # Glow emerald lembut di belakang area visual kanan.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([560, -140, 1300, 420], fill=EMERALD + (30,))
    gd.ellipse([860, 300, 1240, 700], fill=EMERALD + (18,))
    canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(90))).convert("RGB"), (0, 0))

    d = ImageDraw.Draw(canvas)
    fx, fy, fw, fh = FRAMES[variant]
    text_max_w = fx - 64 - 48  # kolom kiri: margin 64 + jarak 48 ke frame

    # Label PANDUAN (pill emerald).
    pill_font = font(FONT_BOLD, 26)
    label = "PANDUAN"
    tw = d.textlength(label, font=pill_font)
    tracking = 5
    pill_w = int(tw + tracking * len(label) + 36)
    pill_h = 46
    pill_x, pill_y = 64, 76
    d.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=23, fill=EMERALD)
    draw_tracked(d, (pill_x + 18, pill_y + 9), label, pill_font, (11, 15, 14), tracking)

    # Nama repo besar putih, 1 baris, ukuran menyesuaikan.
    name_font, _ = fit_font(name, text_max_w)
    ascent, descent = name_font.getmetrics()
    name_h = ascent + descent
    name_top = 300 - name_h // 2
    d.text((64, name_top), name, font=name_font, fill=WHITE)
    name_bottom = name_top + name_h

    # Garis emerald pendek di bawah nama.
    d.rounded_rectangle([64, name_bottom + 30, 64 + 72, name_bottom + 36], radius=3, fill=EMERALD)

    # Domain kiri bawah.
    d.text((64, 566), "locagocreative.my.id", font=font(FONT_REG, 24), fill=MUTED)

    # Chip logo LocaGo (putih, rounded) kanan bawah.
    chip = 58
    chip_x, chip_y = W - 64 - chip, 556
    d.rounded_rectangle([chip_x, chip_y, chip_x + chip, chip_y + chip], radius=14, fill=WHITE)
    logo_img = logo.convert("RGB").resize((chip - 12, chip - 12), Image.LANCZOS)
    canvas.paste(logo_img, (chip_x + 6, chip_y + 6))

    # Visual utama kanan.
    if variant == "icon":
        # Kartu TERANG + logo repo di tengah. (Ikon repo umumnya gelap di
        # atas transparan — di kartu gelap ia tidak terlihat.)
        card = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([0, 0, fw - 1, fh - 1], radius=22, fill=(255, 255, 255, 255))
        cd.rounded_rectangle([0, 0, fw - 1, fh - 1], radius=22, outline=EMERALD + (160,), width=2)
        canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), _place(card, fx, fy)).convert("RGB"), (0, 0))
        icon = img.convert("RGBA")
        icon.thumbnail((240, 240), Image.LANCZOS)
        ix = fx + (fw - icon.width) // 2
        iy = fy + (fh - icon.height) // 2
        canvas.paste(icon, (ix, iy), icon)
    else:
        # Frame screenshot: bayangan + border emerald + sudut membulat.
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sd.rounded_rectangle([fx + 4, fy + 8, fx + fw + 4, fy + fh + 8], radius=22, fill=(0, 0, 0, 110))
        canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), shadow.filter(ImageFilter.GaussianBlur(10))).convert("RGB"), (0, 0))
        shot = cover_crop(img, fw, fh)
        mask = rounded_mask((fw, fh), 22)
        canvas.paste(shot, (fx, fy), mask)
        d = ImageDraw.Draw(canvas)
        d.rounded_rectangle([fx, fy, fx + fw - 1, fy + fh - 1], radius=22,
                            outline=EMERALD + (140,), width=2)
    return canvas


def _place(layer, x, y):
    full = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    full.paste(layer, (x, y))
    return full


def main():
    ap = argparse.ArgumentParser(description="Generator banner artikel panduan (template gelap 1200x630)")
    ap.add_argument("--all", action="store_true", help="generate semua panduan di manifest")
    ap.add_argument("--slug", help="slug panduan dari manifest (mis. panduan-diagram-design)")
    ap.add_argument("--name", help="nama repo tampil (mode manual)")
    ap.add_argument("--image", help="URL gambar asli repo (mode manual)")
    ap.add_argument("--variant", choices=["landscape", "portrait", "icon"], default="landscape")
    ap.add_argument("--out", help="path output webp (mode manual)")
    ap.add_argument("--repo", default=None, help="path root repo (default: dicari dari lokasi script)")
    ap.add_argument("--logo", default=None, help="path logo.png LocaGo (default: public/logo.png repo / git HEAD)")
    args = ap.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = args.repo or find_repo_root(script_dir)

    jobs = []
    if args.all:
        jobs = [(slug, g) for slug, g in GUIDES.items()]
    elif args.slug:
        if args.slug not in GUIDES:
            print(f"slug tidak ada di manifest: {args.slug}", file=sys.stderr)
            print("slug tersedia:", ", ".join(GUIDES), file=sys.stderr)
            return 1
        jobs = [(args.slug, GUIDES[args.slug])]
    elif args.name and args.image and args.out:
        jobs = [("manual", {"name": args.name, "image": args.image,
                             "variant": args.variant, "out": args.out})]
    else:
        ap.print_help()
        return 1

    logo = load_logo(repo_root, args.logo)
    for slug, g in jobs:
        src = g["image"]
        if src.lower().endswith(".mp4"):
            # Video demo resmi: ambil frame tengah (frame awal biasanya hitam).
            video_path = src
            if not os.path.exists(video_path):
                local = os.path.join(repo_root, src)
                if os.path.exists(local):
                    video_path = local
                else:
                    out = subprocess.run(["git", "-C", repo_root, "show", f"HEAD:{src}"],
                                         capture_output=True, check=True)
                    import tempfile
                    tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
                    tmp.write(out.stdout)
                    tmp.close()
                    video_path = tmp.name
            img, frame_file = extract_video_frame(video_path, g.get("frame_at", 5.0))
            if g.get("poster_out"):
                # Bonus: poster artikel ikut dibuat ulang dari frame berisi
                # (poster lama hitam pekat) — path sama, artikel otomatis pakai.
                poster_path = os.path.join(repo_root, g["poster_out"])
                os.makedirs(os.path.dirname(poster_path), exist_ok=True)
                img.convert("RGB").save(poster_path, "JPEG", quality=85)
                print(f"{slug}: poster baru {g['poster_out']} — "
                      f"{os.path.getsize(poster_path)} byte")
        else:
            img = download_image(src, repo_root)
        banner = build(g["name"], img, g["variant"], logo)
        out_path = os.path.join(repo_root, g["out"])
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        banner.save(out_path, "WEBP", quality=88, method=6)
        size = os.path.getsize(out_path)
        print(f"{slug}: {g['out']} — {banner.size[0]}x{banner.size[1]} — {size} byte — "
              f"varian {g['variant']} — sumber {g['image'][:80]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
