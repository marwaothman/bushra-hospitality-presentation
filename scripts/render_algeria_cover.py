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


# Slide 02 — light editorial content system for the meeting's main slides.
PAPER = (248, 246, 241)
profile = Image.new("RGB", (W, H), PAPER)
pdraw = ImageDraw.Draw(profile)
pdraw.rectangle((0, 0, 18, H), fill=BLUE)
pdraw.rectangle((18, 0, 24, H), fill=GOLD)
pdraw.line((72, 190, W - 72, 190), fill=(216, 207, 191), width=2)

# The website header now carries the co-branding. Internal slides use a quiet
# editorial folio instead of repeating both institutional marks.
pdraw.text((W - 84, 78), "اللقاء التنسيقي الأول", font=f(FONT_BOLD, 27), fill=BLUE, anchor="ra", direction="rtl", language="ar")
pdraw.text((W - 84, 124), "موسم حج 1448هـ / 2027م", font=f(FONT_REGULAR, 21), fill=GOLD, anchor="ra", direction="rtl", language="ar")
pdraw.text((84, 102), "02", font=f(FONT_BOLD, 22), fill=GOLD, anchor="la")

# The portrait becomes an editorial image with one thin architectural accent.
photo_box = (88, 250, 760, H)
pdraw.rectangle(photo_box, fill=(241, 237, 229), outline=GOLD, width=3)
pdraw.rectangle((88, 250, 102, H), fill=BLUE)
portrait = Image.open(PORTRAIT).convert("RGB").crop((0, 70, 1365, 1900))
portrait.thumbnail((610, 825), Image.Resampling.LANCZOS)
profile.paste(portrait, (118 + (622 - portrait.width) // 2, H - portrait.height))

# Executive hierarchy: name, role, and one temporary positioning statement.
right = 1770
pdraw.text((right, 325), "القيادة والاستشارة التنفيذية", font=f(FONT_REGULAR, 25), fill=GOLD, anchor="ra", direction="rtl", language="ar")
pdraw.text((right, 390), "ياسر باويان", font=f(FONT_BOLD, 74), fill=BLUE, anchor="ra", direction="rtl", language="ar")
pdraw.text((right, 500), "مستشار الرئيس التنفيذي", font=f(FONT_BOLD, 38), fill=GOLD, anchor="ra", direction="rtl", language="ar")
pdraw.line((1085, 582, right, 582), fill=GOLD, width=2)
body_font = f(FONT_REGULAR, 31)
body_lines = [
    "يسهم في دعم التوجهات الاستراتيجية للشركة،",
    "وتعزيز التنسيق المؤسسي، ومتابعة المبادرات المرتبطة",
    "بتطوير منظومة الخدمات والارتقاء بتجربة ضيوف الرحمن.",
]
for index, line in enumerate(body_lines):
    pdraw.text((right, 650 + index * 58), line, font=body_font, fill=BLUE, anchor="ra", direction="rtl", language="ar")

profile.save(PROFILE_OUT, quality=96)
print(PROFILE_OUT)
