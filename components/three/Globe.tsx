"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DESTINATIONS } from "@/content/site";
import { AXIAL_TILT, globe, latLonToVec3 } from "./globeState";

const CAMERA_Z = 6;
const FOV = 30;
const BUMP_SIZE = 4096;

/**
 * A single-hue relief globe rather than a photographic one: elevation drives
 * the shading, a graticule sits over the top, and every colour comes from one
 * warm bronze ramp so the globe belongs to the brand palette instead of
 * fighting it.
 *
 * There is no colour texture at all. The surface is built from an elevation
 * map and a land/ocean mask — 165 KB together, against 522 KB for the
 * photographic set it replaces.
 *
 * Colour management is deliberately switched off: textures are sampled raw,
 * the maths happens in sRGB space and the result is written straight out with
 * no tone mapping, so the output does not shift when three.js changes its
 * lighting or tone-mapping defaults.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vT;
  varying vec3 vB;
  varying vec3 vView;

  void main() {
    vUv = uv;

    // Object-space frame for the equirectangular parameterisation: T points
    // east (increasing longitude), B points north. Needed to tilt the normal
    // by the elevation gradient in the fragment stage.
    vec3 P = normalize(position);
    vec3 up = abs(P.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
    vec3 T = normalize(cross(up, P));
    vec3 B = cross(P, T);

    vN = normalize(normalMatrix * P);
    vT = normalize(normalMatrix * T);
    vB = normalize(normalMatrix * B);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uBump;    // elevation, gamma-lifted
  uniform sampler2D uMask;    // white = land, black = ocean
  uniform vec3 uSun;
  uniform float uTexel;
  uniform float uRelief;

  // One warm bronze ramp, darkest to brightest. Every colour on the globe is
  // a lookup into this, which is what keeps it inside the brand palette.
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  uniform vec3 uRim;

  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vT;
  varying vec3 vB;
  varying vec3 vView;

  vec3 ramp(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.34) return mix(uC0, uC1, t / 0.34);
    if (t < 0.70) return mix(uC1, uC2, (t - 0.34) / 0.36);
    return mix(uC2, uC3, (t - 0.70) / 0.30);
  }

  // 1 on a graticule line, 0 between them.
  float graticule(float coord, float count, float w) {
    float f = abs(fract(coord * count) - 0.5);
    return smoothstep(0.5 - w, 0.5, f);
  }

  void main() {
    vec3 Ng = normalize(vN);
    vec3 V = normalize(-vView);
    vec3 L = normalize(uSun);

    float land = smoothstep(0.35, 0.62, texture2D(uMask, vUv).r);
    float h = texture2D(uBump, vUv).r;

    // Central-difference elevation gradient, converted into a normal tilt.
    // Damped over water so the oceans stay glassy, as in the reference.
    float e = uTexel;
    float hx = texture2D(uBump, vUv + vec2(e, 0.0)).r - texture2D(uBump, vUv - vec2(e, 0.0)).r;
    float hy = texture2D(uBump, vUv + vec2(0.0, e)).r - texture2D(uBump, vUv - vec2(0.0, e)).r;
    vec3 N = normalize(Ng - uRelief * mix(0.15, 1.0, land) * (hx * normalize(vT) + hy * normalize(vB)));

    float ndl = max(dot(N, L), 0.0);
    float day = smoothstep(-0.25, 0.35, dot(Ng, L));

    // Land sits well above water on the ramp, and altitude lifts it further.
    // That lightness gap is what makes coastlines and ranges read at a glance.
    float lit = 0.08 + 0.66 * ndl;
    float tone = lit + land * 0.17 - (1.0 - land) * 0.09 + (h - 0.28) * land * 0.45;

    // Oceans catch a broad sheen; land does not.
    vec3 H = normalize(L + V);
    tone += pow(max(dot(N, H), 0.0), 26.0) * (1.0 - land) * 0.26 * day;

    vec3 col = ramp(tone);

    // Graticule: meridians every 15 degrees, parallels every 15 degrees.
    // Thin, and mostly hidden under land — the reference reads as a grid
    // engraved on the water with the continents sitting proud of it.
    float g = max(graticule(vUv.x, 24.0, 0.020), graticule(vUv.y, 12.0, 0.020));
    col *= mix(1.0, 0.80, g * (1.0 - 0.72 * land) * (0.35 + 0.65 * day));

    // Bright limb, strongest where the sun catches the edge.
    float fres = pow(1.0 - abs(dot(Ng, V)), 4.5);
    col = mix(col, uRim, clamp(fres * (0.30 + 0.90 * day), 0.0, 1.0) * 0.92);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Globe() {
  const group = useRef<THREE.Group>(null);
  const earth = useRef<THREE.Mesh>(null);
  const markers = useRef<Array<THREE.Mesh | null>>([]);
  const size = useThree((s) => s.size);

  const [bump, mask] = useLoader(THREE.TextureLoader, [
    "/textures/earth-bump.webp",
    "/textures/earth-mask.webp",
  ]);

  const uniforms = useMemo(() => {
    for (const t of [bump, mask]) {
      // Raw sampling: the shader writes final sRGB values itself.
      t.colorSpace = THREE.NoColorSpace;
      t.anisotropy = 8;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
    }
    return {
      uBump: { value: bump },
      uMask: { value: mask },
      uSun: { value: new THREE.Vector3(0.30, 0.40, 0.86) },
      uTexel: { value: 1.0 / BUMP_SIZE },
      uRelief: { value: 46.0 },
      uC0: { value: new THREE.Color("#7a5030") },
      uC1: { value: new THREE.Color("#b07a51") },
      uC2: { value: new THREE.Color("#e6ae7c") },
      uC3: { value: new THREE.Color("#fdf1e0") },
      uRim: { value: new THREE.Color("#fff7ec") },
    };
  }, [bump, mask]);

  const markerPositions = useMemo(
    () => DESTINATIONS.map((d) => latLonToVec3(d.lat, d.lon, 1.004)),
    [],
  );

  useFrame((_, delta) => {
    if (!group.current || !earth.current) return;

    // Visible world extents at z = 0, recomputed each frame so a resize or a
    // mobile browser-chrome change never leaves the globe mis-anchored.
    const worldH = 2 * Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
    const worldW = worldH * (size.width / Math.max(size.height, 1));
    const base = Math.min(worldW, worldH);

    group.current.position.x = globe.cx * (worldW / 2);
    group.current.position.y = globe.cy * (worldH / 2);
    group.current.scale.setScalar(globe.radius * base);

    earth.current.rotation.y = globe.spin;

    // Pins ease rather than snap, so a fast scroll still reads as destinations
    // lighting up in sequence.
    markers.current.forEach((m, i) => {
      if (!m) return;
      const on = globe.active === i;
      m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, on ? 1 : 0.3, 8, delta));
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, on ? 1 : 0.35, 8, delta);
    });
  });

  return (
    <group ref={group} rotation={[0, 0, AXIAL_TILT]}>
      <mesh ref={earth}>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />

        {/* Destination pins ride on the earth mesh, so they rotate with it. */}
        {markerPositions.map((p, i) => (
          <mesh
            key={DESTINATIONS[i].code}
            ref={(el) => {
              markers.current[i] = el;
            }}
            position={p}
            scale={0.3}
          >
            <sphereGeometry args={[0.026, 16, 16]} />
            <meshBasicMaterial color="#ff320d" transparent opacity={0.35} toneMapped={false} />
          </mesh>
        ))}
      </mesh>
    </group>
  );
}

export { CAMERA_Z, FOV };
