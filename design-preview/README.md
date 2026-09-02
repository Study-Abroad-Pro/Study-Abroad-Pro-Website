# Design preview

`hero-animation-preview.html` is the complete hero → globe → destinations
sequence rebuilt as one self-contained file: raw WebGL, vanilla JS, no build
step and no dependencies. Double-click it.

It shares the globe shader, the camera maths, the anchor values and the
longitude→rotation formula with the React build in `components/three/`, so it is
a faithful reference rather than a mockup. What differs: it uses fixed layers
instead of ScrollTrigger pinning, and it has no snap points on the three turns.

Append `?s=<number>` to jump straight to a frame of the sequence:

| `s` | Frame |
|---|---|
| `0` | Hero at rest |
| `0`–`2` | Three turns, hero copy leaving |
| `2`–`3` | Handoff — globe travels to centre and shrinks |
| `3`–`9` | The six destinations, one per unit |
| `9`–`10` | Tail — globe lifts away and fades |

The readout in the corner shows the phase, scroll position, cumulative turns
and which country is currently facing the camera. Good sanity checks: `?s=6.05`
should put Europe and Africa dead centre, `?s=3.5` the Americas.

`globe-vs-reference.png` is the approved reference beside the shader output at
`?s=6.05`, which is how the ramp, relief depth and graticule weight were tuned.


---

## homepage-sections-preview.html

A static preview of everything **below** the globe sequence — why-us, courses,
services, process, stories, about, FAQ, the counselling form and the closing
CTA. Hand-written CSS approximating the Tailwind classes, so the layout and
copy can be reviewed without an npm install.

The React components in `components/sections/` are the source of truth. If the
two ever disagree, the React one is right.
