"""Re-cut the traveller from the hero artwork.

The first pass flood-filled the background and kept everything else, which
silently retained two things it should not have: the grey studio floor trapped
between the leg and the suitcase, and a slab of photographic floor beneath the
wheels. Neither can ever match a CSS background, so they read as a patch.

This version:
  1. crops at the contact line, so the photographed floor is never in play,
  2. mattes at 2x with a feather width driven by the source's own edge
     gradient, so soft edges stay soft and hard edges stay hard,
  3. seeds warm floor pixels as background BEFORE the flood, so the strip
     trapped between the leg and the suitcase has a channel to the border,
  4. refills small specular holes the bright test punched in the suitcase,
  5. decontaminates partial pixels, removing the light fringe,
  6. paints a synthetic contact shadow that composites over any background.

Output is 480x1048 — the same as the asset it replaces, so the hero
composition is unchanged.
"""
import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from scipy import ndimage

import sys

# The approved hero composite. Pass a path to re-run against a new version.
SRC = sys.argv[1] if len(sys.argv) > 1 else "hero-source.png"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "hero", "student.webp")

# Contact line sits at y=877 in the source: below it there are no true blacks,
# only the floor reflection.
BOX = (828, 398, 1068, 877)
S = 2                    # matte at 2x, then keep it — edge quality is the point
SHADOW_H = 45 * S        # band added below the contact line for the shadow

src = Image.open(SRC).convert("RGB")
crop = src.crop(BOX)
crop = crop.resize((crop.width * S, crop.height * S), Image.LANCZOS)
W, H = crop.size

rgb = np.asarray(crop).astype(np.float32)
lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
warm = rgb[:, :, 0] - rgb[:, :, 2]

# --- 1. background seed ------------------------------------------------------
# Near the floor, warm-tinted pixels are studio floor catching the sunset; the
# suitcase and shoes are neutral, so hue separates them where luminance cannot.
# This has to be part of the seed rather than a later subtraction, otherwise the
# pale strip between the leg and the suitcase has no channel to the border and
# survives as a slab of somebody else's floor.
floor_band = np.zeros((H, W), bool)
floor_band[H - 60 * S:, :] = True
bg_seed = (lum > 118) | (floor_band & (warm > 22) & (lum > 55))

lbl, _ = ndimage.label(bg_seed)
border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
border.discard(0)
fg = ~np.isin(lbl, list(border))

# The bright pocket between the arm and the suitcase handle is enclosed on all
# sides, so no flood can reach it. Clear it explicitly.
pocket = np.zeros_like(fg)
pocket[200 * S:320 * S, 115 * S:185 * S] = True
fg &= ~(pocket & (lum > 132))

fg = ndimage.binary_closing(fg, np.ones((3 * S, 3 * S)))

# --- 2. keep the real subject, patch its specular pinholes -------------------
lbl2, n2 = ndimage.label(fg)
sizes = ndimage.sum(fg, lbl2, range(1, n2 + 1))
fg = np.isin(lbl2, [i + 1 for i, s in enumerate(sizes) if s > 1200 * S * S])

# Highlights on the suitcase read as "bright" and got punched out. Refill any
# enclosed gap small enough to be a highlight; the arm/handle pocket is orders
# of magnitude larger and stays open.
holes = ndimage.binary_fill_holes(fg) & ~fg
hl, hn = ndimage.label(holes)
if hn:
    hsz = ndimage.sum(holes, hl, range(1, hn + 1))
    fg |= np.isin(hl, [i + 1 for i, s in enumerate(hsz) if s < 900 * S * S])

# --- 3. matte with a feather that follows the source's own edge softness ----
# The artwork is not uniformly sharp: the shoulder and hood fade over ~28px of
# luminance ramp while the suitcase edge turns in 3px. A single feather width
# either leaves the soft edges stair-stepped or dissolves the hard ones, so the
# width is derived per-pixel from the luminance gradient at the nearest
# boundary point — shallow gradient means a soft edge, so feather wide.
signed = ndimage.distance_transform_edt(fg) - ndimage.distance_transform_edt(~fg)

grad = ndimage.gaussian_gradient_magnitude(lum, sigma=1.5 * S)
boundary = fg & ~ndimage.binary_erosion(fg)
nb = ndimage.distance_transform_edt(~boundary, return_indices=True, return_distances=False)
grad_at_edge = ndimage.gaussian_filter(grad[nb[0], nb[1]], 3 * S)

feather = np.clip(45.0 / np.maximum(grad_at_edge, 1.0), 1.0 * S, 6.0 * S)
alpha = np.clip(signed / (2.0 * feather) + 0.5, 0.0, 1.0)

# --- 4. decontaminate partial pixels ----------------------------------------
# Estimate the background behind the subject by growing known background
# inward, then unmix each partial pixel: F = (I - (1-a)B) / a.
idx = ndimage.distance_transform_edt(fg, return_indices=True, return_distances=False)
bg_est = rgb[idx[0], idx[1]]
# Below about a quarter coverage the division amplifies noise into a bright
# outline, so the correction is faded in rather than applied as a step.
a3 = alpha[:, :, None]
unmixed = np.clip((rgb - (1.0 - a3) * bg_est) / np.maximum(a3, 0.25), 0, 255)
t = np.clip((alpha - 0.25) / 0.35, 0.0, 1.0) * np.clip((0.985 - alpha) / 0.2, 0.0, 1.0)
out_rgb = rgb + (unmixed - rgb) * t[:, :, None]

# --- 5. soften the contact line ---------------------------------------------
fade = np.ones(H, np.float32)
fade[H - 10:] = np.linspace(1.0, 0.5, 10)
alpha = alpha * fade[:, None]

subject = Image.fromarray(np.dstack([out_rgb, alpha * 255]).astype(np.uint8), "RGBA")

# --- 6. synthetic contact shadow --------------------------------------------
# Built from the subject's own footprint, so it pools under each shoe and wheel
# rather than being a generic blob, and tinted warm so it reads as a shadow on
# a cream floor rather than a grey cut-out.
canvas = Image.new("RGBA", (W, H + SHADOW_H), (0, 0, 0, 0))
shadow = Image.new("L", (W, H + SHADOW_H), 0)
sd = ImageDraw.Draw(shadow)

foot = alpha[H - 14 * S:H, :].max(axis=0)
cols = np.where(foot > 0.4)[0]
if len(cols):
    x0, x1 = int(cols.min()), int(cols.max())
    cx, span = (x0 + x1) / 2, (x1 - x0) / 2
    sd.ellipse([cx - span * 1.24, H - 14 * S, cx + span * 1.24, H + 26 * S], fill=70)

    runs, start = [], None
    for i, v in enumerate(foot > 0.4):
        if v and start is None:
            start = i
        elif not v and start is not None:
            runs.append((start, i - 1)); start = None
    if start is not None:
        runs.append((start, len(foot) - 1))

    for a_, b_ in runs:
        if b_ - a_ < 3 * S:
            continue
        m, w = (a_ + b_) / 2, max((b_ - a_) / 2 * 1.15, 6 * S)
        sd.ellipse([m - w, H - 10 * S, m + w, H + 12 * S], fill=165)

shadow = shadow.filter(ImageFilter.GaussianBlur(7 * S))
tint = Image.new("RGBA", shadow.size, (78, 54, 38, 0))
tint.putalpha(shadow)
canvas.alpha_composite(tint)
canvas.alpha_composite(subject, (0, 0))

canvas.save(OUT, "WEBP", quality=90, method=6)
print(f"{OUT}  {canvas.size}  {os.path.getsize(OUT)//1024} KB")
