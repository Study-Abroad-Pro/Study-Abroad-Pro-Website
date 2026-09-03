import Image from "next/image";

/**
 * The hero traveller, lifted out of <Hero> into its own fixed layer so it
 * renders *in front of* the WebGL globe.
 *
 * Why it can't live inside <Hero>: on the desktop pinned choreography
 * ScrollTrigger sets `#hero` to `position: fixed`, which makes it a stacking
 * context. The globe canvas is a separate `position: fixed; z-index: 10` layer,
 * so every child of the pinned hero — whatever its own z-index — paints behind
 * the globe, and the in-flow student ends up knee-deep in the planet. This
 * layer sits at the globe's own level (z-index: 11) instead.
 *
 * `.hero-traveller-layer` (globals.css) is `position: fixed` only under the same
 * media query that turns the pin on; in every lighter mode it stays `absolute`
 * at the top of the page and scrolls away with the hero exactly as before. GSAP
 * still drives the image through the shared `.hero-student` class, so the
 * choreography is untouched.
 */
export default function HeroTraveller() {
  return (
    <div className="hero-traveller-layer" aria-hidden="true">
      <Image
        src="/hero/student.webp"
        alt=""
        width={480}
        height={1048}
        priority
        className="hero-student pointer-events-none absolute bottom-0 left-1/2 h-[clamp(175px,28svh,250px)] w-auto -translate-x-1/2 select-none sm:h-[42svh] sm:-translate-x-[58%] lg:h-[58svh] lg:-translate-x-[24%] xl:-translate-x-[10%]"
      />
    </div>
  );
}
