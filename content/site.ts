/**
 * Static site content. Deliberately NOT in Supabase: navigation, services,
 * process steps and FAQs change roughly once a year, and keeping them out of
 * Postgres removes rows from every build and every revalidation.
 *
 * Country and course *pages* are database-driven (see supabase/schema.sql).
 * The six entries below are the homepage globe sequence, which needs its
 * coordinates available at build time with zero network calls.
 */

export const SITE = {
  name: "Study Abroad Pro",
  tagline: "Dream. Explore. Achieve.",
  description:
    "Study Abroad Pro helps students find the right country, course and university, and guides them through the complete journey — from course selection and applications to visas and settling into a new destination.",

  // ---------------------------------------------------------------------
  // PLACEHOLDERS — replace all four before launch. They are deliberately
  // obvious so they cannot ship unnoticed; every contact point on the site
  // reads from here, so this is the only place to change them.
  // ---------------------------------------------------------------------
  phone: "+91 00000 00000",
  whatsapp: "+910000000000",
  email: "hello@studyabroadpro.example",
  address: "Office address — to be confirmed",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Study Destinations", href: "/destinations" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export type CountryCode = "ca" | "ie" | "gb" | "de" | "au" | "nz";

export type Destination = {
  code: CountryCode;
  slug: string;
  name: string;
  short: string;
  headline: string;
  blurb: string;
  programmes: string[];
  /** Longer description for the destinations page. */
  intro: string;
  /** "Why explore" bullets for the destinations page. */
  why: string[];
  /** Comparison-table columns for the destinations page. */
  studyAreas: string;
  levels: string;
  /** Degrees. Drives both the marker position and the scroll rotation target. */
  lat: number;
  lon: number;
};

/**
 * Featured order on the destinations page (and the hero flight arc): west to
 * east by convention, Canada first. The DESTINATIONS array below stays in
 * longitude order for the globe; use this to render in reading order.
 */
export const DESTINATION_ORDER: CountryCode[] = ["ca", "gb", "au", "de", "ie", "nz"];

/**
 * Ordered by longitude, west to east. That gives the globe one continuous
 * sweep across the scroll instead of jumping back and forth.
 */
export const DESTINATIONS: Destination[] = [
  {
    code: "ca",
    slug: "study-in-canada",
    name: "Canada",
    short: "CA",
    headline: "Study. Work. Build Your Future.",
    blurb:
      "Post-study work rights, a clear path from college to career, and one of the most welcoming systems for international students.",
    programmes: ["Diploma", "Advanced Diploma", "Bachelor's", "Master's", "PG Diploma", "MBA"],
    intro:
      "Build your academic and professional future in one of the world's leading international education destinations. Canada offers a broad range of study options, from diploma and advanced diploma programs to bachelor's, master's, PG diploma and MBA programs.",
    why: [
      "Wide range of programs",
      "Globally recognised education",
      "Multicultural student environment",
      "Strong options across multiple career fields",
      "Diverse cities and communities",
    ],
    studyAreas: "Business, IT, Nursing, Engineering, Healthcare",
    levels: "Diploma to Master's",
    lat: 56.1,
    lon: -100.3,
  },
  {
    code: "ie",
    slug: "study-in-ireland",
    name: "Ireland",
    short: "IE",
    headline: "A Global Destination for Innovation & Careers",
    blurb:
      "Europe's technology and pharmaceutical hub, with English-taught degrees and a two-year stay-back option for graduates.",
    programmes: ["Business", "IT", "Artificial Intelligence", "Finance", "Pharmaceutical Sciences"],
    intro:
      "Study in an English-speaking European destination with opportunities across technology, business, finance and healthcare-related fields. Ireland has become an important European destination for international students, particularly for technology and business-related study.",
    why: [
      "English-speaking education environment",
      "European career exposure",
      "Strong technology ecosystem",
      "Growing opportunities in business and technology",
      "Wide range of specialised programs",
    ],
    studyAreas: "IT, AI, Business, Finance, Pharmaceutical Sciences",
    levels: "Bachelor's to Master's",
    lat: 53.4,
    lon: -8.2,
  },
  {
    code: "gb",
    slug: "study-in-uk",
    name: "United Kingdom",
    short: "UK",
    headline: "World-Class Education With Global Opportunities",
    blurb:
      "One-year master's degrees, globally recognised universities, and a graduate route that lets you stay and work after you finish.",
    programmes: ["Foundation", "Bachelor's", "Master's", "MBA", "Healthcare Courses"],
    intro:
      "Experience a globally recognised education system with a wide range of academic and professional programs. The UK is particularly attractive for students looking for focused undergraduate and postgraduate study options, including one-year master's programs.",
    why: [
      "Globally recognised universities",
      "Diverse course options",
      "Strong academic tradition",
      "International student environment",
      "Excellent opportunities for specialised study",
    ],
    studyAreas: "Business, Healthcare, Finance, Management",
    levels: "Foundation to Master's",
    lat: 54.0,
    lon: -2.0,
  },
  {
    code: "de",
    slug: "study-in-germany",
    name: "Germany",
    short: "DE",
    headline: "Study in One of Europe's Leading Education Destinations",
    blurb:
      "Public universities with little or no tuition fee, deep industry links, and engineering programmes taught in English.",
    programmes: ["Bachelor's", "Master's", "Engineering", "Automotive", "Data Science"],
    intro:
      "Take your education to Europe with programs in some of the world's most respected academic and technical fields. Germany is particularly well known for engineering, technology and science-oriented education, while public institutions can offer comparatively low tuition costs depending on the institution and state.",
    why: [
      "Strong engineering and technical education",
      "Excellent opportunities in STEM fields",
      "European study experience",
      "Strong research environment",
      "Attractive options for students seeking value",
    ],
    studyAreas: "Engineering, Automotive, Data Science",
    levels: "Bachelor's to Master's",
    lat: 51.2,
    lon: 10.5,
  },
  {
    code: "au",
    slug: "study-in-australia",
    name: "Australia",
    short: "AU",
    headline: "Build Your Future in Australia",
    blurb:
      "Strong demand for nursing, engineering and IT graduates, generous work rights while studying, and a high quality of life.",
    programmes: ["Diploma", "Bachelor's", "Master's", "Nursing", "Engineering", "IT"],
    intro:
      "Discover high-quality education in a country known for its vibrant student cities, diverse communities and broad range of academic programs.",
    why: [
      "Wide range of career-focused programs",
      "Strong education sector",
      "Multicultural environment",
      "Popular destination for international students",
      "Opportunities across technology, healthcare, engineering and business",
    ],
    studyAreas: "Nursing, Engineering, IT, Business",
    levels: "Diploma to Master's",
    lat: -25.3,
    lon: 133.8,
  },
  {
    code: "nz",
    slug: "study-in-new-zealand",
    name: "New Zealand",
    short: "NZ",
    headline: "Learn, Experience & Grow",
    blurb:
      "Smaller class sizes, practical qualifications, and a straightforward post-study work visa for eligible graduates.",
    programmes: ["Diploma", "Bachelor's", "Master's", "Hospitality", "Agriculture"],
    intro:
      "Experience quality education in a welcoming and naturally beautiful destination, with programs across hospitality, agriculture, business and more.",
    why: [
      "High-quality education",
      "Supportive student environment",
      "Strong lifestyle appeal",
      "Opportunities across diverse fields",
      "Excellent destination for students seeking a balanced study experience",
    ],
    studyAreas: "Hospitality, Agriculture, Business",
    levels: "Diploma to Master's",
    lat: -41.5,
    lon: 174.0,
  },
];

export const HERO_STATS = [
  { value: "6+", label: "Top Countries" },
  { value: "500+", label: "Universities" },
  { value: "10K+", label: "Students Guided" },
] as const;

export const TRUST_LINE = [
  "Expert Guidance",
  "University Admissions",
  "Visa Support",
  "Pre & Post Arrival Assistance",
] as const;


/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

export type CourseGroup = { category: string; note: string; courses: string[] };

export const COURSE_GROUPS: CourseGroup[] = [
  {
    category: "Healthcare",
    note: "Regulated professions with strong graduate demand across all six destinations.",
    courses: [
      "Nursing",
      "Medicine",
      "Pharmacy",
      "Health Care Assistant",
      "Public Health",
      "Psychology",
      "Social Work",
    ],
  },
  {
    category: "Technology & Engineering",
    note: "The fastest-moving field, and the one where course choice dates quickest.",
    courses: [
      "Information Technology",
      "Artificial Intelligence",
      "Data Science",
      "Cyber Security",
      "Engineering",
      "Biotechnology",
    ],
  },
  {
    category: "Business & Finance",
    note: "Broad entry requirements, but the university's employer links matter more here than the title.",
    courses: [
      "Business Administration",
      "MBA",
      "Accounting & Finance",
      "Digital Marketing",
      "Project Management",
      "Supply Chain & Logistics",
    ],
  },
  {
    category: "Hospitality & Applied",
    note: "Practical, placement-heavy programmes with clear routes into work.",
    courses: [
      "Hospitality & Tourism",
      "Hotel Management",
      "Culinary Arts",
      "Early Childhood Education",
      "Agriculture",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

/** The journey splits into three stages; the services page groups by these. */
export const SERVICE_PHASES = {
  apply: "Choosing & applying",
  depart: "Getting ready to go",
  arrive: "Landing & settling in",
} as const;

export type ServicePhase = keyof typeof SERVICE_PHASES;

export type Service = {
  title: string;
  /** One line — used on the homepage grid and as the services-page lead. */
  body: string;
  /** What the service actually involves — services page only. */
  detail: string;
  /** In-page anchor; the footer deep-links to several of these. */
  anchor: string;
  phase: ServicePhase;
};

export const SERVICES: Service[] = [
  {
    title: "University Admission",
    body: "Complete guidance through every university application, deadline and document.",
    detail:
      "We track each deadline, prepare every application to the university's exact specification, and stay on the admissions office until you have a decision in writing.",
    anchor: "admission",
    phase: "apply",
  },
  {
    title: "Course Selection",
    body: "The right course for your academic background and where you want to end up working.",
    detail:
      "We compare programme structures, entry requirements and graduate destinations side by side, so the choice is made on evidence rather than on a name.",
    anchor: "course-selection",
    phase: "apply",
  },
  {
    title: "Career Counselling",
    body: "Decisions made against real graduate outcomes, not a brochure.",
    detail:
      "One session maps your qualifications and goals onto what specific job markets are actually hiring for, and where a degree opens the most doors.",
    anchor: "counselling",
    phase: "apply",
  },
  {
    title: "SOP & LOR Guidance",
    body: "Statements and references that answer what admissions teams actually ask.",
    detail:
      "We work through drafts with you until the statement reads as yours and speaks to the question the admissions committee is really asking.",
    anchor: "sop-lor",
    phase: "apply",
  },
  {
    title: "Scholarship Assistance",
    body: "Which scholarships you are eligible for, and when to apply for them.",
    detail:
      "We shortlist the awards you genuinely qualify for, explain each one's criteria, and make sure the application goes in before its deadline.",
    anchor: "scholarships",
    phase: "apply",
  },
  {
    title: "Education Loan Assistance",
    body: "Guidance on making overseas study financially manageable.",
    detail:
      "We explain how education loans work for each destination, what lenders look for, and how to arrange funds so the visa's financial requirement is met cleanly.",
    anchor: "loans",
    phase: "apply",
  },
  {
    title: "Visa Processing",
    body: "End-to-end visa guidance, with documentation prepared properly the first time.",
    detail:
      "We assemble the full document set, check every form against the current rules for your destination, and prepare you for the interview where one is required.",
    anchor: "visa",
    phase: "depart",
  },
  {
    title: "IELTS / PTE Guidance",
    body: "Preparation for the English requirement your chosen course sets.",
    detail:
      "We set a target from your course's actual requirement and point you to the preparation that closes the gap in the least time.",
    anchor: "english",
    phase: "depart",
  },
  {
    title: "Accommodation Assistance",
    body: "Somewhere to live confirmed before you get on the plane.",
    detail:
      "We help you secure verified student accommodation — university-managed or private — with the contract signed before you travel.",
    anchor: "accommodation",
    phase: "arrive",
  },
  {
    title: "Airport Pickup",
    body: "Arrival support at your destination, arranged in advance.",
    detail:
      "Where it is offered, a pickup is booked for your arrival so the first journey in an unfamiliar country is not one you make alone.",
    anchor: "airport-pickup",
    phase: "arrive",
  },
  {
    title: "Pre-Departure Briefing",
    body: "What the first month abroad actually involves, before you leave.",
    detail:
      "A structured briefing covers money and banking, transport, SIM cards, weather and the paperwork you will need in your first week.",
    anchor: "pre-departure",
    phase: "arrive",
  },
  {
    title: "Post-Arrival Support",
    body: "Our relationship does not end when you land.",
    detail:
      "We stay reachable after you arrive — for the bank account, the tax number, part-time work rules and whatever else the first months bring up.",
    anchor: "post-arrival",
    phase: "arrive",
  },
];

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export const STEPS = [
  { title: "Free Counselling", body: "Tell us about your education, your interests and where you want this to lead." },
  { title: "Profile Assessment", body: "We evaluate your academic profile honestly and tell you what is realistic." },
  { title: "Course & Country Selection", body: "A shortlist built around your profile, your budget and your career goal." },
  { title: "University Application", body: "We guide every application through to decision." },
  { title: "Visa & Pre-Departure", body: "Documentation, the visa process, and getting you ready to travel." },
  { title: "Fly & Start Your Journey", body: "You arrive with support already in place — and it continues after you land." },
] as const;

/* ------------------------------------------------------------------ */
/* FAQs — also emitted as FAQPage JSON-LD on the homepage              */
/* ------------------------------------------------------------------ */

export const FAQS = [
  {
    q: "Which countries do you provide study abroad services for?",
    a: "We currently specialise in Canada, the United Kingdom, Australia, Germany, Ireland and New Zealand, with additional destinations being introduced over time.",
  },
  {
    q: "Can I study abroad without IELTS?",
    a: "It depends on the university, the course and the country. Some institutions accept alternative evidence of English, others do not. Our counsellors can tell you which options are genuinely open to you based on your profile rather than a general rule.",
  },
  {
    q: "Which course should I choose?",
    a: "Course selection depends on your academic background, your interests, your career goal, your budget and your destination preferences. That is the conversation the first counselling session is for.",
  },
  {
    q: "Do you help with scholarships?",
    a: "Yes. We identify the scholarships you are eligible for, explain what each one requires, and make sure you apply within the deadline.",
  },
  {
    q: "Do you provide visa assistance?",
    a: "Yes. We guide students through documentation and the visa application process for each destination we work with.",
  },
  {
    q: "Do you help with accommodation?",
    a: "Yes. Accommodation assistance is part of our pre-departure support, so you have somewhere confirmed before you travel.",
  },
  {
    q: "Do you provide airport pickup?",
    a: "Airport pickup can be arranged for students travelling to selected destinations. Confirm it with your counsellor as part of pre-departure planning.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Student stories                                                     */
/* ------------------------------------------------------------------ */

/**
 * SAMPLE DATA. The brief is explicit that student names, universities and
 * outcomes must not be invented, so these exist only to show the section at
 * realistic text lengths during design review. While this flag is true every
 * card renders a visible "Sample" marker and the section carries a notice, so
 * none of it can be mistaken for a real student.
 *
 * When real, consented quotes arrive: replace TESTIMONIALS and set this to
 * false. The `consent` column on the testimonials table exists for the same
 * reason — never publish a quote without it.
 */
export const TESTIMONIALS_ARE_SAMPLES = true;

export const TESTIMONIALS = [
  {
    quote:
      "I had no idea which country made sense for me. We went through my marks, my budget and what I actually wanted to do afterwards, and the shortlist made sense by the end of the first session.",
    name: "Student name",
    course: "Course name",
    university: "University name",
    countryCode: "ca" as CountryCode,
  },
  {
    quote:
      "The part I was dreading was the visa paperwork. Having someone check every document before it went in took the anxiety out of it completely.",
    name: "Student name",
    course: "Course name",
    university: "University name",
    countryCode: "gb" as CountryCode,
  },
  {
    quote:
      "They were still answering my questions after I landed — about the bank account, the travel card, all of it. That is not what I expected from a consultancy.",
    name: "Student name",
    course: "Course name",
    university: "University name",
    countryCode: "au" as CountryCode,
  },
];

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  eyebrow: "About us",
  title: "Guidance you can hold us to.",
  standfirst:
    "Study Abroad Pro helps students choose a country, a course and a university with real information behind every decision — and stays with them from the first counselling session to the week after they land.",

  story: [
    {
      h: "Why we exist",
      p: [
        "Most students start the same way: a country in mind, a stack of conflicting advice, and a deadline somewhere in the background. The decisions that follow — where to go, what to study, which university, which intake — are expensive to get wrong and difficult to reverse once an application is in.",
        "We built Study Abroad Pro to make that process legible. Not to push a destination, but to work through the trade-offs with a student until the shortlist genuinely makes sense to them.",
      ],
    },
    {
      h: "How we work",
      p: [
        "Every recommendation starts from your academic record, your budget and where you want to be working in five years. Sometimes that means telling a student the country they had set their heart on is the wrong fit — that conversation is the job, not a failure of it.",
        "We specialise in six destinations rather than claiming fifty. Real depth in a small number of education systems is worth more to a student than a brochure for every country on the map.",
      ],
    },
  ],

  principles: [
    {
      title: "Honest counselling first",
      body: "We start with your goals and your profile, not a list of universities we need to fill. If a plan is unrealistic, you hear it from us early rather than after a rejection.",
    },
    {
      title: "Decisions against real outcomes",
      body: "Course and country choices are weighed against graduate work rights, living costs and actual hiring — not the tone of a prospectus.",
    },
    {
      title: "Six destinations, done properly",
      body: "Canada, the United Kingdom, Australia, Germany, Ireland and New Zealand. We know these systems in detail instead of a little about everywhere.",
    },
    {
      title: "The relationship continues after you land",
      body: "Accommodation, the bank account, the first month in a new country. Our support does not end when the visa is approved.",
    },
  ],

  /** Kept deliberately conservative — every figure here is verifiable from the
   *  rest of the site, per the launch risk note about defensible trust signals. */
  facts: [
    { value: "6", label: "Destinations we specialise in" },
    { value: "12", label: "Services, counselling to post-arrival" },
    { value: "1:1", label: "Every counselling session" },
    { value: "Free", label: "Initial counselling, always" },
  ],
} as const;

/**
 * SAMPLE STRUCTURE. Real names, photos and credentials are not invented — the
 * same rule the brief sets for testimonials. While this flag is true the team
 * section shows the roles that own each stage of the journey, with a visible
 * note, so the layout is finished and reviewed before real bios exist. Replace
 * TEAM with real people and set this to false; the markers then disappear with
 * no other change.
 */
export const TEAM_ARE_PLACEHOLDERS = true;

export const TEAM = [
  {
    role: "Lead Counsellor",
    focus: "Profile assessment, country and course shortlisting, and the first session.",
  },
  {
    role: "Admissions Specialist",
    focus: "University applications, deadlines, statements of purpose and supporting documents.",
  },
  {
    role: "Visa & Compliance",
    focus: "Documentation and the visa process for each destination we work in.",
  },
  {
    role: "Scholarships & Finance",
    focus: "The scholarships you are eligible for, and education loan guidance.",
  },
  {
    role: "Pre-Departure & Arrival",
    focus: "Accommodation, travel, the pre-departure briefing and post-arrival support.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Destinations page                                                   */
/* ------------------------------------------------------------------ */

/** "Which country is right for you?" — the factors that decide it. */
export const DESTINATION_FACTORS = [
  {
    key: "profile",
    title: "Your academic profile",
    body: "Your qualification, grades and previous education.",
  },
  {
    key: "career",
    title: "Your career goals",
    body: "The industry and the career you want to build.",
  },
  {
    key: "budget",
    title: "Your budget",
    body: "Tuition fees, living expenses and available funding.",
  },
  {
    key: "course",
    title: "Your course",
    body: "Different countries offer different strengths in your chosen field.",
  },
  {
    key: "lifestyle",
    title: "Your lifestyle preferences",
    body: "Climate, culture, location and student environment.",
  },
  {
    key: "future",
    title: "Your future plans",
    body: "Your plans after graduation, and the immigration and work rules that apply to your situation.",
  },
] as const;

/** From choosing a country to boarding the flight. */
export const DESTINATION_JOURNEY = [
  { title: "Profile Assessment", body: "We understand your academic background, interests and goals." },
  {
    title: "Destination Selection",
    body: "We help you shortlist suitable countries based on your profile.",
  },
  { title: "Course Selection", body: "Choose programmes aligned with your career plans." },
  { title: "University Applications", body: "Support throughout the application process." },
  {
    title: "Visa Preparation",
    body: "Prepare your documentation and visa application with guidance from our team.",
  },
  {
    title: "Pre-Departure Support",
    body: "Get ready for your new academic and international experience.",
  },
  {
    title: "Arrive With Confidence",
    body: "Accommodation, airport pickup and post-arrival support ease the transition.",
  },
] as const;

/** Not live yet — a designed waiting list, matching the About page's note. */
export const UPCOMING_DESTINATIONS = [
  "France",
  "Sweden",
  "Netherlands",
  "UAE — Dubai",
  "Singapore",
] as const;

export const DESTINATION_FAQS = [
  {
    q: "Which countries can I study in through Study Abroad Pro?",
    a: "We currently focus on Canada, the United Kingdom, Australia, Germany, Ireland and New Zealand, with additional destinations planned.",
  },
  {
    q: "How do I choose the right country?",
    a: "The right destination depends on your academic profile, preferred course, budget, career goals and personal preferences. Our counsellors help you compare the options that genuinely fit.",
  },
  {
    q: "Can I choose my course before choosing a country?",
    a: "Yes. We can start from either your preferred course or your preferred destination and identify suitable options from there.",
  },
  {
    q: "Do you help with university applications?",
    a: "Yes. University admission and application guidance is part of what we do.",
  },
  {
    q: "Do you provide visa assistance?",
    a: "Yes. Visa processing support is one of our services.",
  },
  {
    q: "Can I get scholarship assistance?",
    a: "Yes. We guide eligible students on the scholarship opportunities available for their profile and destination.",
  },
  {
    q: "Do you help with accommodation and airport pickup?",
    a: "Yes. Accommodation assistance and, where offered, airport pickup are part of our support.",
  },
  {
    q: "Which country is best for me?",
    a: "There isn't one answer for everyone. A personalised profile assessment identifies the destinations that suit your academic and career goals.",
  },
] as const;
