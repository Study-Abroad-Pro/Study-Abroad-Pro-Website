/**
 * Blog posts. Static for now — the eventual source is the Supabase `posts`
 * table (slug / title / excerpt / category / body_md / published_at), rendered
 * through the same markdown pipeline, so these demo posts are the real
 * template rather than throwaway placeholder.
 *
 * Evergreen guides only, and written in the site's hedged voice: no invented
 * figures, named scholarships or specific visa rules that would go stale.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  /** ISO date (published). */
  date: string;
  /** Markdown. */
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-a-study-destination",
    title: "How to choose the right study destination",
    excerpt:
      "Most students start with a country already in mind. Here's how to pressure-test that choice before you build a whole plan around it.",
    category: "Guide",
    author: "Study Abroad Pro",
    date: "2026-07-14",
    body: `Most students start with a country already in mind — usually one a relative studied in, or the one that comes up most in conversation. That's a fine starting point, but it's worth pressure-testing before you build a whole plan around it.

Here is the order we work through it in a counselling session.

## Start with the course, not the country

If you know what you want to study, that narrows the field fast. Engineering and automotive research point strongly toward Germany. One-year taught master's degrees are a UK speciality. Nursing and other regulated healthcare fields have deep, placement-heavy programmes in Australia. Technology and pharmaceutical study clusters in Ireland.

If you *don't* know the course yet, that is the first conversation to have — because choosing a country before a course often means committing to a system that doesn't play to your strengths.

## Weigh six things, honestly

- **Your academic profile.** Your qualification and grades set the realistic range of institutions before anything else does.
- **Your budget.** Not just tuition — living costs vary more by *city* than by country, and the upfront proof-of-funds requirement for the visa is a real number you need available early.
- **Graduate outcomes.** Where do people who finish this programme actually end up working, and do the post-study work rules support that?
- **Language.** An English-taught programme in a non-English-speaking country is very doable, but everyday life is easier with some of the local language.
- **Intake timing.** If a deadline is tight, a country with two intakes a year gives you a second realistic entry point.
- **Lifestyle.** Climate, city size and pace of life sound like soft factors until you are living with them for two years.

## Don't over-index on rankings

A university's overall ranking tells you very little about the programme you would actually be on, or about how employable its graduates are in your field. A well-regarded department at a mid-ranked university often beats a weak department at a famous one.

> The right destination is the one where your profile, your budget and your goal line up — not the one with the best brochure.

## Shortlist three, not one

Pick two or three countries worth a proper look, then compare specific programmes across them side by side. Committing to a single country before you have done that comparison is how students end up with an expensive plan that only half fits.

When you are ready to do that comparison properly, [book a free counselling session](/#counselling) — that is exactly what the first one is for.`,
  },
  {
    slug: "english-test-requirements-explained",
    title: "IELTS, PTE or TOEFL: which English test, and what score?",
    excerpt:
      "The two questions every student asks about English tests — which one to take, and what score you actually need — answered.",
    category: "English tests",
    author: "Study Abroad Pro",
    date: "2026-08-05",
    body: `Almost every student we work with has the same two questions about English tests: which one to take, and what score they actually need. Here is how it works.

## The tests are mostly interchangeable for admissions

Most universities accept **IELTS Academic**, **PTE Academic** and **TOEFL iBT**, and they publish equivalent score requirements for each. A growing number also accept the **Duolingo English Test**, and some accept prior study in English as evidence instead of a test. Others do not accept either — it varies by institution.

So the choice between IELTS, PTE and TOEFL is usually about *you*, not the university:

- **PTE** is computer-based with automated scoring, and results come back within a couple of days. It suits students who want a fast turnaround.
- **IELTS** has a face-to-face speaking section and is the most widely recognised, including for some visa routes.
- **TOEFL** is computer-based and strong on academic-style reading and listening.

If you are weak in one area — say, speaking — it is worth doing a practice test in two formats to see which plays to your strengths.

## The score depends on the course and the level

There is no single "score for Canada" or "score for the UK". The requirement is set by:

- **The level.** Postgraduate programmes almost always ask for more than undergraduate or diploma entry.
- **The field.** Regulated professions — nursing, teaching, law, medicine — set higher minimums, often through their registration bodies rather than the university, and sometimes with a minimum in *every* section rather than just overall.
- **The institution.** Two universities offering the same course can set different minimums.

## Visa routes can add their own rules

Some student-visa routes require the test to be taken at an approved centre, or set their own minimum that sits alongside the university's. This is worth checking early, because booking the wrong test type can cost you weeks.

> Don't book a test until you know the exact requirement for the programmes on your shortlist. It's a common, avoidable mistake.

## If you are close but not there

Pathway and pre-sessional English courses exist at most institutions for students who are a band or two below the direct-entry requirement. They add time and cost, but they are a legitimate route rather than a dead end.

Not sure which test or what score applies to your plan? [Ask a counsellor](/#counselling) — we confirm the requirement for each option on your shortlist so you only sit the test once.`,
  },
  {
    slug: "study-abroad-budget-explained",
    title: "What actually goes into a study-abroad budget",
    excerpt:
      "A single cost figure is almost always misleading. What's useful is understanding what the number is made of.",
    category: "Money",
    author: "Study Abroad Pro",
    date: "2026-08-22",
    body: `"How much does it cost to study abroad?" is the question we get most, and the honest answer is that a single number is almost always misleading. What is useful is understanding what the number is *made of*, so you can build a realistic estimate for your own shortlist.

## Tuition is the headline, not the whole story

Tuition varies most by **level** and **institution**, and within that by **field**:

- Diploma and college programmes are generally lower than university degrees.
- Classroom-based subjects cost less than lab-heavy or clinical ones.
- Professional master's and MBA programmes sit at the top.
- Public universities in Germany charge little or no tuition — though a semester contribution and full living costs still apply.

## Living costs depend on the city, not the country

This is the part students underestimate. Rent in a large capital can be double what it is in a mid-sized university city in the same country. When you compare destinations, compare *cities* — not national averages.

## The upfront number matters more than the total

For the visa, most countries require you to show **proof of funds** — documented money covering tuition and a set period of living costs — held for a defined time before you apply. This is often the first real financial hurdle, and it comes months before you would actually spend most of it.

Budget for:

- A **tuition deposit** to secure your place, typically a term or a year.
- **Proof of funds** for the visa, sometimes in a specific account type.
- **Health cover**, which is mandatory in several countries and priced by visa length.
- **One-off costs**: flights, initial accommodation, setup.

## Where the budget can flex

- **Scholarships and fee reductions** — most are merit-based and applied for alongside admission. They rarely cover everything, but a partial award changes the maths.
- **Part-time work** during study is possible in most destinations within a weekly cap. Treat it as a buffer, not core funding — you cannot rely on finding work immediately.
- **City choice** is the single biggest lever you control.

> Build the estimate around your actual shortlist, not a generic figure. The difference between two programmes — or two cities — can be larger than any scholarship.

We put together an itemised, current estimate for your shortlist during counselling. [Start there](/#counselling).`,
  },
];

/** Rough reading time from the markdown body. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
