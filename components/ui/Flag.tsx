/**
 * Six flags as inline SVG rather than emoji: Windows ships no flag glyphs, so
 * emoji flags degrade to bare letter pairs on the majority of desktop traffic.
 * Geometry is simplified for legibility at 40px.
 *
 * `code` is a plain string: countries are editable in the admin panel, so a
 * code with no artwork here just renders an empty field rather than failing.
 */

const STAR =
  "M0,-1 L0.2245,-0.309 L0.9511,-0.309 L0.3633,0.118 L0.5878,0.809 L0,0.382 " +
  "L-0.5878,0.809 L-0.3633,0.118 L-0.9511,-0.309 L-0.2245,-0.309 Z";

function Star({ x, y, r, fill = "#fff" }: { x: number; y: number; r: number; fill?: string }) {
  return <path d={STAR} fill={fill} transform={`translate(${x} ${y}) scale(${r})`} />;
}

/** Union flag, used whole for the UK and as the canton for AU and NZ. */
function UnionJack({ w = 60, h = 40 }: { w?: number; h?: number }) {
  // The saltire strokes run past the field, so the whole thing is clipped to
  // the flag rectangle. Duplicate ids across flags are harmless: every
  // definition is the same rect, resolved in each referencing element's own
  // coordinate space.
  const k = w / 60;
  return (
    <g transform={`scale(${k} ${h / 40})`}>
      <defs>
        <clipPath id="uj-field">
          <rect width="60" height="40" />
        </clipPath>
      </defs>
      <g clipPath="url(#uj-field)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0 V40 M0 20 H60" stroke="#c8102e" strokeWidth="7" />
      </g>
    </g>
  );
}

const MAPLE =
  "M30 9.4 L31.6 14.6 L35.7 13.7 L34.7 16.7 L39.2 19.5 L36.6 20.7 L37.5 23.6 " +
  "L33.2 22.9 L32.8 24.4 L31 22.4 L31.7 28.6 L30 27.3 L28.3 28.6 L29 22.4 " +
  "L27.2 24.4 L26.8 22.9 L22.5 23.6 L23.4 20.7 L20.8 19.5 L25.3 16.7 " +
  "L24.3 13.7 L28.4 14.6 Z";

function Artwork({ code }: { code: string }) {
  switch (code) {
    case "ca":
      return (
        <>
          <rect width="60" height="40" fill="#fff" />
          <rect width="15" height="40" fill="#d52b1e" />
          <rect x="45" width="15" height="40" fill="#d52b1e" />
          <path d={MAPLE} fill="#d52b1e" />
        </>
      );
    case "gb":
      return <UnionJack />;
    case "de":
      return (
        <>
          <rect width="60" height="13.34" fill="#000" />
          <rect y="13.34" width="60" height="13.33" fill="#dd0000" />
          <rect y="26.67" width="60" height="13.33" fill="#ffce00" />
        </>
      );
    case "ie":
      return (
        <>
          <rect width="20" height="40" fill="#169b62" />
          <rect x="20" width="20" height="40" fill="#fff" />
          <rect x="40" width="20" height="40" fill="#ff883e" />
        </>
      );
    case "au":
      return (
        <>
          <rect width="60" height="40" fill="#012169" />
          <UnionJack w={30} h={20} />
          <Star x={15} y={30} r={4.4} />
          <Star x={49} y={9} r={2.4} />
          <Star x={43} y={19} r={2.2} />
          <Star x={49} y={29} r={2.4} />
          <Star x={55} y={22} r={2} />
          <Star x={47} y={23} r={1.2} />
        </>
      );
    case "nz":
      return (
        <>
          <rect width="60" height="40" fill="#012169" />
          <UnionJack w={30} h={20} />
          <Star x={49} y={10} r={2.8} fill="#fff" />
          <Star x={49} y={10} r={1.9} fill="#c8102e" />
          <Star x={42} y={20} r={2.6} fill="#fff" />
          <Star x={42} y={20} r={1.7} fill="#c8102e" />
          <Star x={52} y={22} r={2.6} fill="#fff" />
          <Star x={52} y={22} r={1.7} fill="#c8102e" />
          <Star x={46} y={31} r={2.9} fill="#fff" />
          <Star x={46} y={31} r={2} fill="#c8102e" />
        </>
      );
    default:
      return <rect width="60" height="40" fill="#e6e8ec" />;
  }
}

export default function Flag({
  code,
  src,
  className = "",
  title,
}: {
  code: string;
  /** An uploaded flag image (from the admin panel). Overrides the built-in art. */
  src?: string | null;
  className?: string;
  title?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={title ?? ""}
        className={className}
        style={{ objectFit: "cover" }}
        aria-hidden={title ? undefined : true}
        loading="lazy"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <Artwork code={code} />
    </svg>
  );
}
