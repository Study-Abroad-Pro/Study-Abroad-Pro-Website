import Button from "@/components/ui/Button";
import Flag from "@/components/ui/Flag";
import { DESTINATIONS, HERO_STATS, SITE } from "@/content/site";

/** Positions along the flight arc, matching the approved hero composition. */
const ARC = [
  { left: "43.2%", top: "22.5%" },
  { left: "52.8%", top: "20.8%" },
  { left: "62.5%", top: "20.8%" },
  { left: "72.0%", top: "21.4%" },
  { left: "82.8%", top: "24.4%" },
  { left: "93.0%", top: "28.0%" },
];

/** Display order across the arc: Canada, UK, Australia, Germany, Ireland, NZ. */
const ARC_ORDER = ["ca", "gb", "au", "de", "ie", "nz"] as const;

function Pin() {
  return (
    <svg viewBox="0 0 12 16" className="mt-2 h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M6 0C2.7 0 0 2.7 0 6c0 4.3 6 10 6 10s6-5.7 6-10c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z"
        fill="#ff320d"
      />
    </svg>
  );
}

function StatIcon({ i }: { i: number }) {
  const paths = [
    "M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0c2.5 2.2 3.8 5.2 3.8 9s-1.3 6.8-3.8 9m0-18C7.5 3.2 6.2 6.2 6.2 10s1.3 6.8 3.8 9M1.6 7.2h16.8M1.6 12.8h16.8",
    "M2 7l8-3.6L18 7l-8 3.6L2 7zm3 4.6V15c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6v-3.4",
    "M10 10.4a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4zM3.4 17.8c0-3.2 3-5.4 6.6-5.4s6.6 2.2 6.6 5.4",
  ];
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#ff320d" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[i]} />
    </svg>
  );
}

export default function Hero() {
  const byCode = new Map(DESTINATIONS.map((d) => [d.code, d] as const));

  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-cream">
      {/* ---- sky: warm sunset gradient, fades away as the globe takes over ---- */}
      <div className="hero-sky absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_60%_80%,#ffe6c8_0%,#fff3e6_36%,#f8fafc_74%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(46%_38%_at_57%_68%,rgba(255,186,112,0.9),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-[#e9e5df] via-[#f2eee8]/60 to-transparent" />
      </div>

      {/* ---- flight path + destination flags ---- */}
      <div
        className="hero-arcline pointer-events-none absolute left-[36%] right-0 top-[30%] hidden h-[16%] lg:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0 46 Q 500 -14 1000 128" fill="none" stroke="rgba(23,23,23,0.22)" strokeWidth="2" strokeDasharray="7 9" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 24" className="absolute left-[64%] top-[-72%] h-[30px] w-[30px] -rotate-12 text-ink/45" fill="currentColor">
          <path d="M21 15.5v-2l-8-4.5V3.5a1.5 1.5 0 0 0-3 0V9l-8 4.5v2l8-2.4v4.3l-2.4 1.6v1.6L11 20l2.4.6v-1.6L11 17.4v-4.3l8 2.4z" />
        </svg>
      </div>

      <ul className="pointer-events-none absolute inset-0 hidden lg:block" aria-label="Popular study destinations">
        {ARC_ORDER.map((code, i) => {
          const d = byCode.get(code)!;
          return (
            <li
              key={code}
              className="hero-flag absolute flex flex-col items-center"
              style={{ left: ARC[i].left, top: ARC[i].top, transform: "translateX(-50%)" }}
            >
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white shadow-[0_6px_18px_-6px_rgba(23,23,23,0.45)] ring-2 ring-white">
                <Flag code={code} className="h-11 w-11 rounded-full" title={d.name} />
              </span>
              <span className="label mt-2.5 whitespace-nowrap text-ink/80">{d.name}</span>
              <Pin />
            </li>
          );
        })}
      </ul>

      {/* The traveller lives in <HeroTraveller/> at the page level, not here:
          once ScrollTrigger pins #hero it becomes `position: fixed` and thus a
          stacking context, which would trap the student behind the globe
          canvas. GSAP still animates it via the shared `.hero-student` class. */}

      {/* ---- copy ---- */}
      <div className="hero-copy relative z-40 mx-auto flex h-full w-full max-w-[86rem] flex-col justify-center px-6 sm:px-10">
        <p className="label text-ink/70">{SITE.tagline}</p>
        <span className="mt-4 block h-[3px] w-12 rounded-full bg-brand" aria-hidden="true" />
        <h1 className="mt-6 max-w-[13ch] text-[clamp(2.5rem,5.2vw,4.6rem)] font-extrabold leading-[0.95]">
          Your Future
          <br />
          <span className="text-brand">Has No Borders.</span>
        </h1>
        <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
          Choose the right country. Find the right course. Build the right future.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="/#counselling">Book Free Counselling</Button>
          <Button href="/destinations" variant="ghost">
            Explore Destinations
          </Button>
        </div>
      </div>

      {/* ---- handover heading: fades in on the third turn, sitting exactly
             where the destinations heading lands once the hero unpins ---- */}
      <div className="hero-outro pointer-events-none absolute inset-x-0 top-[11svh] z-40 hidden opacity-0 lg:block">
        <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
          <p className="label text-brand">Where do you want to study?</p>
          <h2 className="mt-2.5 max-w-[26ch] text-[clamp(1.3rem,2.1vw,1.75rem)] font-extrabold leading-[1.15]">
            Six destinations. One decision that changes everything.
          </h2>
        </div>
      </div>

      {/* ---- stat bar ---- */}
      {/* Legibility scrim: the photoreal globe runs dark behind the stats.
          Shares the .hero-stats class so it fades on the same tween. */}
      <div
        className="hero-stats pointer-events-none absolute bottom-0 left-0 z-30 h-[40%] w-full bg-[linear-gradient(to_top,rgba(255,250,244,0.98)_0%,rgba(255,250,244,0.62)_52%,transparent_100%)] [mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_86%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_46%,transparent_86%)] lg:w-[64%]"
        aria-hidden="true"
      />
      <ul className="hero-stats absolute bottom-8 left-6 z-40 flex flex-wrap items-center gap-x-9 gap-y-4 sm:left-10 lg:bottom-10">
        {HERO_STATS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-brand/35">
              <StatIcon i={i} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-extrabold tracking-tight">{s.value}</span>
              <span className="text-[0.8125rem] text-muted">{s.label}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* ---- scroll cue ---- */}
      <div className="hero-cue absolute bottom-7 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="flex h-9 w-6 items-start justify-center rounded-full ring-1 ring-ink/25 pt-1.5">
          <span className="h-1.5 w-1 rounded-full bg-ink/45" />
        </span>
        <span className="label text-ink/50">Scroll</span>
      </div>
    </section>
  );
}
