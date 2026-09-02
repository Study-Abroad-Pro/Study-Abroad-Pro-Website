import GlobeStage from "@/components/three/GlobeStage";
import ScrollReveals from "@/components/motion/ScrollReveals";
import Hero from "@/components/sections/Hero";
import HeroTraveller from "@/components/sections/HeroTraveller";
import Destinations from "@/components/sections/Destinations";
import WhyUs from "@/components/sections/WhyUs";
import PopularCourses from "@/components/sections/PopularCourses";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import StudentStories from "@/components/sections/StudentStories";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Counselling from "@/components/sections/Counselling";
import FinalCta from "@/components/sections/FinalCta";
import { FAQS, SITE } from "@/content/site";
import { getSiteContact, getHomepageCopy } from "@/lib/data/settings";
import { getDestinationCards } from "@/lib/data/countries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// The FAQ accordion and this markup read from the same source, so they can
// never drift — a mismatch between the two is a manual-action risk in Search.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function Home() {
  const [contact, homepage, destinations] = await Promise.all([
    getSiteContact(),
    getHomepageCopy(),
    getDestinationCards(),
  ]);

  const organisationLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    url: siteUrl,
    description: homepage.description,
    email: contact.email,
    telephone: contact.phone,
    areaServed: destinations.map((d) => d.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <GlobeStage />
      <HeroTraveller />
      <ScrollReveals />

      {/* Dream → Explore → Understand → Compare → Trust → Act */}
      {/* Hero and Destinations are pinned by ScrollTrigger, which wraps the
          pinned node in a `.pin-spacer` div at runtime. These wrapper divs
          absorb that DOM mutation so it never happens directly among <main>'s
          React-managed children — without them, React's next reconciliation of
          a sibling (the WebGL canvas, a form below) throws
          "insertBefore ... not a child of this node". */}
      <div className="pin-boundary">
        <Hero />
      </div>
      <div className="pin-boundary">
        <Destinations />
      </div>
      <WhyUs />
      <PopularCourses />
      <Services />
      <HowItWorks />
      <StudentStories />
      <About />
      <Faq />
      <Counselling />
      <FinalCta />
    </>
  );
}
