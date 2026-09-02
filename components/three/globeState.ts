/**
 * A single mutable object shared between GSAP and the render loop.
 *
 * GSAP tweens these numbers directly; `useFrame` reads them every tick and
 * writes them onto the Three.js objects. Nothing here ever touches React
 * state, so scrolling never triggers a re-render — which is the whole reason
 * the sequence can hold 60fps while six sections animate around it.
 */
export type GlobeState = {
  /** Absolute rotation about the polar axis, in radians. Always decreasing. */
  spin: number;
  /** Centre of the globe in normalised device coords: -1..1, y up. */
  cx: number;
  cy: number;
  /** Radius as a fraction of the smaller visible world dimension. */
  radius: number;
  /** 1 for the whole sequence; only the tail fades the canvas out. */
  opacity: number;
  /** Index of the destination currently facing the camera, or -1. */
  active: number;
  /** Set false to park the render loop entirely. */
  running: boolean;
};

export const globe: GlobeState = {
  spin: 0,
  cx: 0.42,
  cy: -1.8,
  radius: 0.88,
  opacity: 1,
  active: -1,
  running: true,
};

/** Where the globe sits inside the hero: large, low, right of centre. */
export const HERO_ANCHOR = { cx: 0.42, cy: -1.8, radius: 0.88 };

/** Where it settles for the destinations sequence: a full globe, centred. */
export const STAGE_ANCHOR = { cx: 0, cy: -0.62, radius: 0.3 };

/** Three full turns during the pinned hero — the "three scrolls". */
export const HERO_TURNS = 3;
export const SPIN_BASE = -HERO_TURNS * Math.PI * 2;

/** Axial tilt, so the globe reads as a planet rather than a spinning ball. */
export const AXIAL_TILT = -0.41;

/**
 * Rotation that brings a given longitude to face the camera.
 *
 * THREE.SphereGeometry maps u = 0.25 to the +Z axis, and u = (lon + 180) / 360,
 * so the longitude facing the camera at rotation 0 is -90°. Solving for the
 * rotation that puts longitude L there gives the expression below.
 */
export function spinForLongitude(lon: number): number {
  return -Math.PI / 2 - (lon * Math.PI) / 180;
}

/** Unit-sphere position for a lat/lon, matching SphereGeometry's own mapping. */
export function latLonToVec3(lat: number, lon: number, r = 1): [number, number, number] {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return [
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function resetGlobe() {
  globe.spin = 0;
  globe.cx = HERO_ANCHOR.cx;
  globe.cy = HERO_ANCHOR.cy;
  globe.radius = HERO_ANCHOR.radius;
  globe.opacity = 1;
  globe.active = -1;
  globe.running = true;
}
