import Button from "@/components/ui/Button";

const PILLARS = [
  {
    title: "Personalised Counselling",
    body: "We start with your goals, academic profile and career interests — not with a list of universities we want to fill.",
  },
  {
    title: "Course & University Selection",
    body: "Programmes matched to your profile, your budget and where you actually want to end up working.",
  },
  {
    title: "Application Support",
    body: "Professional guidance through every university application, deadline and document.",
  },
  {
    title: "Visa Assistance",
    body: "Documentation prepared properly the first time, with expert support through the visa process.",
  },
  {
    title: "Pre-Departure Guidance",
    body: "Travel, accommodation and what life abroad will actually be like, before you get on the plane.",
  },
  {
    title: "Post-Arrival Support",
    body: "Our support continues after you land. The relationship does not end at the airport.",
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="relative z-20 bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[86rem] px-6 sm:px-10">
        <p className="label text-brand" data-reveal>Why Study Abroad Pro</p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.02]" data-reveal>
            More than admission. We guide your entire journey.
          </h2>
          <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft" data-reveal>
            Choosing to study abroad is a life-changing decision. The right course, university and
            country shape your future — so we help you make each of those choices with real
            information rather than guesswork.
          </p>
        </div>

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <li key={p.title} className="border-t border-line pt-6" data-reveal>
              <span className="label text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-bold leading-snug">{p.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16" data-reveal>
          <Button href="#counselling">Book Free Counselling</Button>
        </div>
      </div>
    </section>
  );
}
