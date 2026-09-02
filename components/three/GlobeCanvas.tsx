"use client";

import { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Globe, { CAMERA_Z, FOV } from "./Globe";
import { globe } from "./globeState";

/**
 * Opacity is applied to the canvas element rather than to any material, so the
 * whole globe cross-fades as one object and nothing has to be made transparent
 * in the render pipeline.
 */
function OpacitySync() {
  const gl = useThree((s) => s.gl);
  useFrame(() => {
    const el = gl.domElement;
    const next = globe.opacity;
    if (el.style.opacity !== String(next)) {
      el.style.opacity = String(next);
      el.style.visibility = next < 0.005 ? "hidden" : "visible";
    }
  });
  return null;
}

export default function GlobeCanvas({ frameloop }: { frameloop: "always" | "never" }) {
  return (
    <Canvas
      className="globe-stage"
      // R3F writes position/width/height inline on its wrapper, so these have
      // to be inline too or they lose to it.
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
      }}
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // The globe shader does its own shading and writes final sRGB values.
        // Tone mapping here would darken it away from the approved look.
        toneMapping: THREE.NoToneMapping,
      }}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 100 }}
    >
      <OpacitySync />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
    </Canvas>
  );
}
