import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { FAQS } from "@/content/site";

export default function Faq() {
  return (
    <section id="faq" className="relative z-20 bg-paper py-24 sm:py-28">
      <div className="mx-auto grid w-full max-w-[86rem] gap-12 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="label text-brand" data-reveal>
            Questions
          </p>
          <h2
            className="mt-4 max-w-[14ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]"
            data-reveal
          >
            The ones students actually ask.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            If yours is not here, ask it in the counselling session — there is no such thing as
            a question that is too basic.
          </p>
          <div className="mt-8 hidden lg:block" data-reveal>
            <Button href="#counselling" variant="outline">
              Ask Us Directly
            </Button>
          </div>
        </div>

        <Accordion items={FAQS} />
      </div>
    </section>
  );
}
