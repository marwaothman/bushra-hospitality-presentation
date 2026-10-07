from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/media/hajj1448/algeria-meeting-cover-approved-source.png"
ALGERIA = ROOT / "public/media/hajj1448/algeria-emblem.png"
PORTRAIT = ROOT / "public/media/hajj1448/yasser-bawyan-portrait.jpg"
BUSHRA = ROOT / "public/media/hajj1448/bushra-logo-dark.png"
OUT = ROOT / "public/media/hajj1448/algeria-meeting-cover.png"
PROFILE_OUT = ROOT / "public/media/hajj1448/yasser-bawyan-profile.png"

W, H = 1920, 1080
BLUE = (24, 70, 111)
GOLD = (190, 151, 87)
WHITE = (255, 255, 255)
IVORY = (247, 243, 235)
FONT_REGULAR = ROOT / "public/fonts/LamaSans-Regular.ttf"
FONT_BOLD = ROOT / "public/fonts/LamaSans-Bold.ttf"


def f(path, size):
    return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)


# Preserve the approved visual exactly, scaling it to presentation resolution.
base = Image.open(SOURCE).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
draw = ImageDraw.Draw(base)

# Exact meeting title, placed directly on the clean navy field without a panel.
title_font = f(FONT_BOLD, 38)
draw.text(
    (1780, 455),
    "اللقاء التنسيقي الأول بين شركة بشرى الضيافة",
    font=title_font,
    fill=WHITE,
    anchor="ra",
    direction="rtl",
    language="ar",
)
draw.text(
    (1780, 522),
    "والديوان الوطني للحج والعمرة",
    font=title_font,
    fill=WHITE,
    anchor="ra",
    direction="rtl",
    language="ar",
)
draw.text(
    (1780, 635),
    "موسم حج 1448هـ / 2027م",
    font=f(FONT_REGULAR, 35),
    fill=WHITE,
    anchor="ra",
    direction="rtl",
    language="ar",
)

# Use the approved Algeria identity directly on the navy field. The supplied
# artwork includes its own white wordmark, so no document-style plaque is needed.
alg = Image.open(ALGERIA).convert("RGBA")
alg = alg.crop(alg.getchannel("A").getbbox())
alg.thumbnail((470, 150), Image.Resampling.LANCZOS)
base.paste(alg, (72, 65 + (150 - alg.height) // 2), alg)

base.save(OUT, quality=96)
print(OUT)


# Slide 02 — restrained executive profile, intentionally free of card panels.
profile = Image.new("RGB", (W, H), BLUE)
pdraw = ImageDraw.Draw(profile)
pdraw.rectangle((1, 1, W - 2, H - 2), outline=(208, 168, 108), width=2)

# Brand marks retain the same visual anchors as the cover.
bushra = Image.open(BUSHRA).convert("RGBA")
bushra.thumbnail((455, 155), Image.Resampling.LANCZOS)
profile.paste(bushra, (W - bushra.width - 72, 60), bushra)
profile.paste(alg, (72, 65 + (150 - alg.height) // 2), alg)

# Portrait is held inside a single Bushra-inspired architectural frame.
outer = [(45, H), (45, 435), (430, 215), (815, 435), (815, H)]
inner = [(82, H), (82, 457), (430, 258), (778, 457), (778, H)]
pdraw.polygon(outer, fill=GOLD)
pdraw.polygon(inner, fill=IVORY)
portrait = Image.open(PORTRAIT).convert("RGB")
portrait = portrait.crop((0, 95, portrait.width, 1910))
portrait.thumbnail((690, 850), Image.Resampling.LANCZOS)
portrait_layer = Image.new("RGB", (W, H), IVORY)
portrait_layer.paste(portrait, (430 - portrait.width // 2, H - portrait.height))
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).polygon(inner, fill=255)
profile.paste(portrait_layer, (0, 0), mask)

# Executive hierarchy: name, role, and one temporary positioning statement.
right = 1778
pdraw.text((right, 336), "القيادة والاستشارة التنفيذية", font=f(FONT_REGULAR, 26), fill=GOLD, anchor="ra", direction="rtl", language="ar")
pdraw.text((right, 400), "ياسر باويان", font=f(FONT_BOLD, 72), fill=WHITE, anchor="ra", direction="rtl", language="ar")
pdraw.text((right, 505), "مستشار الرئيس التنفيذي", font=f(FONT_BOLD, 38), fill=GOLD, anchor="ra", direction="rtl", language="ar")
pdraw.line((1125, 585, right, 585), fill=(208, 168, 108), width=2)
body_font = f(FONT_REGULAR, 31)
body_lines = [
    "يسهم في دعم التوجهات الاستراتيجية للشركة،",
    "وتعزيز التنسيق المؤسسي، ومتابعة المبادرات المرتبطة",
    "بتطوير منظومة الخدمات والارتقاء بتجربة ضيوف الرحمن.",
]
for index, line in enumerate(body_lines):
    pdraw.text((right, 650 + index * 58), line, font=body_font, fill=WHITE, anchor="ra", direction="rtl", language="ar")

pdraw.text((right, 1010), "02", font=f(FONT_REGULAR, 18), fill=GOLD, anchor="ra")
profile.save(PROFILE_OUT, quality=96)
print(PROFILE_OUT)
