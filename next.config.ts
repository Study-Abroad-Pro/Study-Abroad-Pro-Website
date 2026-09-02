import type { NextConfig } from "next";

/**
 * Supabase Storage is served through the Next.js image optimizer so the
 * optimized output is cached at the edge. Each source image is then fetched
 * from Supabase roughly once per region per month instead of once per visitor,
 * which is what keeps the free plan's 5 GB egress allowance intact.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
