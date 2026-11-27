"""生成 PWA 应用图标（可从项目根目录重新运行）"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "icons")
os.makedirs(OUT, exist_ok=True)


def font(size):
    for path in [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make(size, name, maskable=False):
    img = Image.new("RGB", (size, size), "#6C5CE7")
    d = ImageDraw.Draw(img)
    # 渐变背景
    for y in range(size):
        t = y / size
        r = int(108 + (162 - 108) * t)
        g = int(92 + (155 - 92) * t)
        b = int(231 + (254 - 231) * t)
        d.line([(0, y), (size, y)], fill=(r, g, b))
    # 装饰光斑
    pad = int(size * (0.16 if maskable else 0.08))
    d.ellipse([size * .62, -size * .12, size * 1.12, size * .38], fill=(255, 255, 255, 26))
    # 圆角白色底
    bg = [pad, pad, size - pad, size - pad]
    d.rounded_rectangle(bg, radius=int(size * .22), fill=(255, 255, 255), outline=(235, 232, 255), width=max(2, size // 180))
    # 字母 EQ
    f = font(int(size * (0.30 if maskable else 0.34)))
    label = "EQ"
    box = d.textbbox((0, 0), label, font=f)
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1] - size * .02
    d.text((x, y), label, font=f, fill=(108, 92, 231))
    # 小火箭点缀
    s = size * .075
    cx, cy = size * .76, size * .27
    d.ellipse([cx - s, cy - s, cx + s, cy + s], fill="#FF9F43")
    d.polygon([(cx, cy - s * 1.5), (cx - s * .7, cy + s), (cx + s * .7, cy + s)], fill="#FFBE76")
    img.save(os.path.join(OUT, name), "PNG")
    print("saved", name)


make(192, "icon-192.png")
make(512, "icon-512.png")
make(512, "icon-maskable.png", maskable=True)
