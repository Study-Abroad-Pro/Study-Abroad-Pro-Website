"""Derive the web globe textures from the source Blender asset.

Source: Assests/59-earth/textures/ (21600px bump, 10800px land mask).
Those are far too heavy to ship, so this reduces them to power-of-two WebP.

Two textures only — there is no colour map. The globe's colour comes entirely
from a ramp in the shader, which is what keeps it inside the brand palette.

Power-of-two matters: WebGL1 needs it for REPEAT wrapping and mipmaps, and the
standalone preview in design-preview/ runs on WebGL1.

    python scripts/build-earth-textures.py "D:/Study Abroad Pro/Assests/59-earth/textures"
"""
import sys, os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

src = sys.argv[1] if len(sys.argv) > 1 else "."
out = os.path.join(os.path.dirname(__file__), "..", "public", "textures")
os.makedirs(out, exist_ok=True)

# Elevation is linear and most of the world sits near sea level, so 8-bit
# precision is wasted on the low end. A gamma lift spreads lowland detail into
# the usable range, which is what the relief-shading gradients need.
bump = Image.open(os.path.join(src, "earth bump.jpg")).convert("L").resize((4096, 2048), Image.LANCZOS)
lifted = np.power(np.asarray(bump).astype(np.float32) / 255.0, 0.42)
Image.fromarray((lifted * 255).astype(np.uint8), "L").save(
    os.path.join(out, "earth-bump.webp"), "WEBP", quality=88, method=6
)

Image.open(os.path.join(src, "earth land ocean mask.png")).convert("L").resize(
    (2048, 1024), Image.LANCZOS
).save(os.path.join(out, "earth-mask.webp"), "WEBP", quality=76, method=6)

for f in ("earth-bump.webp", "earth-mask.webp"):
    print(f"{f:20} {os.path.getsize(os.path.join(out, f)) // 1024} KB")
