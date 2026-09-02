import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown body renderer for blog posts. Every element is mapped to a
 * site-styled version so an article reads as part of the design system rather
 * than as a default prose block.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ node, ...p }) => (
          <h2
            className="mt-14 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-[1.7rem]"
            {...p}
          />
        ),
        h3: ({ node, ...p }) => (
          <h3 className="mt-10 font-display text-xl font-bold leading-snug" {...p} />
        ),
        p: ({ node, ...p }) => (
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft" {...p} />
        ),
        ul: ({ node, ...p }) => (
          <ul
            className="mt-5 list-disc space-y-2.5 pl-5 text-[1.0625rem] leading-relaxed text-ink-soft marker:text-brand/60"
            {...p}
          />
        ),
        ol: ({ node, ...p }) => (
          <ol
            className="mt-5 list-decimal space-y-2.5 pl-5 text-[1.0625rem] leading-relaxed text-ink-soft marker:font-semibold marker:text-brand/70"
            {...p}
          />
        ),
        li: ({ node, ...p }) => <li className="pl-1.5" {...p} />,
        strong: ({ node, ...p }) => <strong className="font-semibold text-ink" {...p} />,
        em: ({ node, ...p }) => <em className="italic" {...p} />,
        blockquote: ({ node, ...p }) => (
          <blockquote
            className="mt-9 border-l-2 border-brand pl-5 font-display text-lg font-medium leading-snug text-ink"
            {...p}
          />
        ),
        hr: () => <hr className="mt-12 border-line" />,
        img: ({ node, src = "", alt = "" }) => (
          <span className="mt-9 block overflow-hidden rounded-xl ring-1 ring-ink/8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt}
              className="block w-full"
              loading="lazy"
            />
            {alt ? (
              <span className="block bg-paper px-4 py-2 text-[0.8125rem] text-muted">
                {alt}
              </span>
            ) : null}
          </span>
        ),
        a: ({ node, href = "", ...p }) => {
          const internal = href.startsWith("/") || href.startsWith("#");
          return internal ? (
            <Link
              href={href}
              className="font-semibold text-brand underline-offset-4 hover:underline"
              {...p}
            />
          ) : (
            <a
              href={href}
              className="font-semibold text-brand underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
