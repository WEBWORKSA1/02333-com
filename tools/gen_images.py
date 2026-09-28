"""Generate PNG social/app images (run in CI; binary files are not committed by hand)."""
import glob, os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cands = [p for p in glob.glob('/usr/share/fonts/**/*.ttf', recursive=True) if 'Bold' in p and 'Oblique' not in p and 'Italic' not in p]
cands.sort(key=lambda p: (('DejaVuSans-Bold' not in p) and ('LiberationSans-Bold' not in p), p))
F = cands[0] if cands else None
f = lambda s: ImageFont.truetype(F, s) if F else ImageFont.load_default()
out = os.path.join(ROOT, 'assets', 'img'); os.makedirs(out, exist_ok=True)
im = Image.new('RGB', (1200, 630), '#d7261e'); d = ImageDraw.Draw(im)
d.text((80, 110), "02333", font=f(230), fill='#ffd65c')
d.text((86, 390), "Decode China, one number at a time.", font=f(50), fill='#ffffff')
d.text((86, 470), "Number slang - Lucky numbers - Memes - China business", font=f(32), fill='#ffe7e4')
im.save(os.path.join(out, 'og.png'))
ic = Image.new('RGB', (512, 512), '#d7261e'); d = ImageDraw.Draw(ic)
d.text((256, 256), "02", font=f(260), fill='#ffffff', anchor='mm'); ic.save(os.path.join(out, 'icon-512.png'))
print('images ok', F)
