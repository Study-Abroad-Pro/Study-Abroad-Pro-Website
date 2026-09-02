/**
 * Per-country page content. Kept out of the DESTINATIONS array (which drives
 * the globe and needs to stay lean) and out of Supabase for now.
 *
 * Deliberately framework-and-ranges, not hard figures: tuition, scholarship
 * names, English scores and visa rules move by institution, programme and year.
 * Every section describes what drives the number and defers the current figure
 * to counselling — the same voice as the rest of the site.
 */

import type { CountryCode } from "@/content/site";

export type CountryContent = {
  /** One or two sentences under the hero title. */
  lede: string;
  /** Three quick, defensible facts for the hero. */
  stats: { value: string; label: string }[];

  highlights: { title: string; body: string }[];
  why: { title: string; body: string }[];
  levels: { level: string; note: string }[];
  courses: { group: string; items: string[] }[];
  admissions: string[];
  /** Country-specific note layered on the shared English-requirements framework. */
  englishNote: string;
  budget: { label: string; detail: string }[];
  budgetNote: string;
  scholarships: string[];
  life: string[];
  faqs: { q: string; a: string }[];
};

/** Shared across every country page. */
export const COUNTRY_APPLICATION_JOURNEY = [
  {
    title: "Free counselling & profile review",
    body: "We map your qualifications, budget and goal against what is realistic here.",
  },
  {
    title: "Shortlist universities & courses",
    body: "A shortlist built around your profile and the intake you are aiming for.",
  },
  {
    title: "Prepare & submit applications",
    body: "Documents, statement of purpose and references prepared to each institution's spec.",
  },
  {
    title: "Offers & acceptance",
    body: "We compare the offers you receive and confirm your place.",
  },
  {
    title: "English test & financial documents",
    body: "Meet the English requirement and arrange proof of funds for the visa.",
  },
  {
    title: "Visa application",
    body: "The full document set, checked against current rules, and interview prep where needed.",
  },
  {
    title: "Pre-departure & arrival",
    body: "Accommodation, travel, a pre-departure briefing and support once you land.",
  },
] as const;

/** Shown on every country page above the country-specific note. */
export const ENGLISH_FRAMEWORK = [
  "Most institutions accept IELTS Academic, PTE Academic or TOEFL iBT. A growing number also accept the Duolingo English Test or prior study in English — others do not.",
  "The score you need depends on the course and the level. Postgraduate programmes and regulated fields such as nursing, teaching and law usually ask for more than undergraduate or diploma entry.",
  "Some students qualify for a waiver based on their medium of instruction. Your counsellor confirms the exact requirement for each option on your shortlist.",
];

export const COUNTRY_CONTENT: Record<CountryCode, CountryContent> = {
  ca: {
    lede: "Build your academic and professional future in one of the world's leading destinations for international students, with study options from diploma through to MBA.",
    stats: [
      { value: "Sep · Jan · May", label: "Common intakes" },
      { value: "English & French", label: "Languages of instruction" },
      { value: "Diploma to MBA", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "Study levels for every profile",
        body: "Public colleges and universities offer diplomas, advanced diplomas, bachelor's and master's degrees, PG diplomas and MBAs — so there is usually an entry route that fits.",
      },
      {
        title: "College co-op and work components",
        body: "Many college programmes build in a paid co-op or internship term, so you graduate with Canadian work experience as well as a qualification.",
      },
      {
        title: "Post-study work pathways",
        body: "Canada has established routes for eligible graduates to work after studying. Eligibility depends on the institution, programme length and level — we walk you through what applies to your plan.",
      },
      {
        title: "A genuinely multicultural system",
        body: "International students are a large, normal part of campus life, with support services built around them from orientation onwards.",
      },
    ],
    why: [
      {
        title: "One of the widest ranges of programmes",
        body: "From one-year PG diplomas to research master's degrees, the spread of levels means students with very different academic backgrounds can find a realistic route.",
      },
      {
        title: "Education that travels",
        body: "Canadian qualifications are recognised internationally, which matters if you may not stay in Canada for your whole career.",
      },
      {
        title: "Strength across several fields",
        body: "Business, IT, engineering, nursing and healthcare all have deep programme options and clear links to the job market.",
      },
      {
        title: "Cities and communities to choose from",
        body: "Studying in a large city and studying in a smaller community are very different experiences on cost and lifestyle. We help you weigh that against your budget.",
      },
    ],
    levels: [
      {
        level: "Diploma & Advanced Diploma",
        note: "One to three years at a public college, career-focused, often with a co-op term. A common route for students moving from vocational or general education.",
      },
      {
        level: "Bachelor's Degree",
        note: "Three to four years at a university. Direct entry usually needs completed senior secondary education with competitive grades.",
      },
      {
        level: "PG Diploma",
        note: "One to two years, taken after a bachelor's degree to specialise or to build local experience before working.",
      },
      {
        level: "Master's & MBA",
        note: "One to two years. Entry depends on your bachelor's discipline and grades; some programmes ask for work experience or GMAT/GRE.",
      },
    ],
    courses: [
      { group: "Business & management", items: ["Business Administration", "MBA", "Project Management", "Supply Chain & Logistics", "Digital Marketing"] },
      { group: "Technology", items: ["Information Technology", "Data Science", "Artificial Intelligence", "Cyber Security"] },
      { group: "Healthcare", items: ["Nursing", "Health Care Assistant", "Public Health", "Psychology"] },
      { group: "Engineering & applied", items: ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Hospitality Management"] },
    ],
    admissions: [
      "Completed academic transcripts for your highest qualification, with grades that meet the programme's minimum.",
      "Evidence of English (see below), or grounds for a waiver.",
      "A statement of purpose, and letters of recommendation where the programme asks for them.",
      "A valid passport, and proof of funds covering tuition and living costs for the study permit.",
      "For some master's and MBA programmes: relevant work experience, GMAT or GRE, and a résumé.",
    ],
    englishNote:
      "Colleges and universities set their own minimums, and some pathway or foundation options exist for students who are close but not yet at the required score.",
    budget: [
      { label: "Tuition", detail: "Varies most by level and institution — college diplomas are generally lower than university degrees, and professional master's programmes higher again." },
      { label: "Living costs", detail: "Driven by the city. A large metro costs noticeably more for rent than a smaller college town." },
      { label: "Health cover", detail: "Provincial or private health cover is usually required and differs by province." },
      { label: "Upfront", detail: "Expect a first-term or first-year tuition deposit plus documented proof of funds for the study-permit application." },
    ],
    budgetNote:
      "Figures move every year and by institution. We give you a current, itemised estimate for your actual shortlist during counselling, not a generic number.",
    scholarships: [
      "Entry or merit awards from individual colleges and universities, usually applied automatically or with the admission application.",
      "Programme- or faculty-specific awards for strong applicants in a given field.",
      "External awards from foundations and organisations, most with early deadlines.",
      "We identify which you are eligible for and make sure the applications go in on time.",
    ],
    life: [
      "Orientation programmes, international student offices and peer mentoring are standard at most institutions.",
      "Part-time work is possible for many students during study, within the conditions attached to your permit.",
      "Winters are real — budgeting for warm clothing in your first months is sensible.",
      "Public transport is good in the larger cities; smaller towns often expect you to plan around bus timetables.",
    ],
    faqs: [
      {
        q: "Can I work while studying in Canada?",
        a: "Many students can work part-time during their studies, subject to the conditions on their study permit and the institution's rules. Your counsellor explains what applies to your programme.",
      },
      {
        q: "Do I need IELTS for Canada?",
        a: "Most institutions require evidence of English, but the accepted tests, the scores and the possibility of a waiver all depend on the institution and programme.",
      },
      {
        q: "Is a diploma or a degree better for me?",
        a: "It depends on your prior education, your budget and your career goal. A college diploma with a co-op term suits some students better than a longer degree — that is the conversation the first session is for.",
      },
      {
        q: "How early should I start?",
        a: "For a September intake, starting eight to twelve months ahead gives comfortable time for applications, the English test, financial documents and the study permit.",
      },
    ],
  },

  gb: {
    lede: "A globally recognised education system with focused undergraduate and postgraduate options, including the one-year master's the UK is known for.",
    stats: [
      { value: "Sep · Jan", label: "Common intakes" },
      { value: "English", label: "Language of instruction" },
      { value: "Foundation to Master's", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "One-year master's degrees",
        body: "A taught master's in the UK is typically completed in twelve months, which shortens both the time and the total cost compared with a two-year programme elsewhere.",
      },
      {
        title: "Globally recognised universities",
        body: "UK degrees carry weight internationally, which matters for graduates who may work in several countries over a career.",
      },
      {
        title: "A graduate route to stay and work",
        body: "Eligible graduates can apply to stay and work for a period after finishing. Eligibility depends on your institution and course — we confirm what applies to your plan.",
      },
      {
        title: "Foundation routes for a step up",
        body: "Foundation and pre-master's programmes give students who don't yet meet direct entry a structured year to get there.",
      },
    ],
    why: [
      {
        title: "Focused, specialised study",
        body: "Undergraduate and postgraduate courses tend to specialise early, so you spend more of your time on the subject you came to study.",
      },
      {
        title: "Strong across business, healthcare and finance",
        body: "These fields have deep course options and clear links to employers and professional bodies.",
      },
      {
        title: "A long academic tradition",
        body: "Teaching quality, library and research resources, and assessment standards are consistently high across the sector.",
      },
      {
        title: "An international student body",
        body: "Most UK universities have large international communities and support services built around them.",
      },
    ],
    levels: [
      {
        level: "Foundation",
        note: "One year, for students who need to bridge to undergraduate entry — used where school qualifications don't yet match direct-entry requirements.",
      },
      {
        level: "Bachelor's",
        note: "Usually three years in England, Wales and Northern Ireland. Entry is based on your senior secondary results and subject requirements.",
      },
      {
        level: "Master's",
        note: "Typically one year taught. Entry depends on your bachelor's discipline and classification; some fields ask for relevant experience.",
      },
      {
        level: "MBA",
        note: "One to two years. Most programmes expect several years of work experience and may ask for GMAT or GRE.",
      },
    ],
    courses: [
      { group: "Business & finance", items: ["Business Management", "MBA", "Accounting & Finance", "International Business", "Marketing"] },
      { group: "Healthcare", items: ["Nursing", "Public Health", "Psychology", "Health Management"] },
      { group: "Technology", items: ["Computer Science", "Data Science", "Artificial Intelligence", "Cyber Security"] },
      { group: "Management & law", items: ["Project Management", "Supply Chain Management", "Law (LLM)", "Human Resource Management"] },
    ],
    admissions: [
      "Academic transcripts and certificates for your highest qualification, meeting the course's subject and grade requirements.",
      "Evidence of English at the level the course sets, or grounds for a waiver.",
      "A personal statement, and references where the course requires them.",
      "A valid passport and evidence of funds for tuition and living costs for the student visa.",
      "For some master's courses: a relevant bachelor's classification, a portfolio, or work experience.",
    ],
    englishNote:
      "UKVI-approved testing applies to some visa routes and pre-sessional English courses are widely available for students who are slightly below the required score.",
    budget: [
      { label: "Tuition", detail: "Varies by university and course; classroom-based programmes are generally lower than lab-heavy or clinical ones, and MBAs higher again." },
      { label: "Living costs", detail: "London is in its own bracket; most other cities are noticeably lower for rent and day-to-day costs." },
      { label: "Immigration health surcharge", detail: "Paid as part of the visa application and scales with the length of your course." },
      { label: "Upfront", detail: "A tuition deposit to secure the place, plus maintenance funds held for a set period before the visa application." },
    ],
    budgetNote:
      "Tuition and the maintenance requirement are set by the university and the Home Office and change each year. We prepare a current estimate for your shortlist during counselling.",
    scholarships: [
      "University scholarships and fee discounts for international students, often merit-based and applied for alongside admission.",
      "Department or subject awards for strong applicants in a specific field.",
      "Government and organisation scholarships, most with early and competitive deadlines.",
      "We match you to the ones you're eligible for and manage the deadlines.",
    ],
    life: [
      "Students' unions run societies, sports and events, and international student offices handle practical questions.",
      "Part-time work is possible for most student-visa holders within a weekly limit during term.",
      "Cities are compact and walkable, and inter-city rail makes travel around the country straightforward.",
      "Autumn and winter are dark and wet — planning for that in your first term helps.",
    ],
    faqs: [
      {
        q: "Is a one-year master's respected?",
        a: "Yes. The one-year taught master's is a standard UK format and is recognised internationally. It covers the same academic ground in a more concentrated year.",
      },
      {
        q: "Can I stay and work after my course?",
        a: "There is a route for eligible graduates to stay and work for a period after finishing. Eligibility depends on your institution and course, and the rules can change, so confirm current terms with your counsellor.",
      },
      {
        q: "Do I need to study in London?",
        a: "No. London has more universities but also the highest living costs. Many strong universities are in cities where your budget goes considerably further.",
      },
      {
        q: "What English score do I need?",
        a: "It depends on the course and level. Postgraduate and regulated fields ask for more. Pre-sessional English courses are an option if you're slightly below.",
      },
    ],
  },

  au: {
    lede: "High-quality education in a country known for vibrant student cities and career-focused programmes across healthcare, engineering, technology and business.",
    stats: [
      { value: "Feb · Jul", label: "Common intakes" },
      { value: "English", label: "Language of instruction" },
      { value: "Diploma to Master's", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "Career-focused programmes",
        body: "Vocational (VET) diplomas and university degrees both emphasise practical, work-ready skills, with placements common in nursing, engineering and IT.",
      },
      {
        title: "Work rights while studying",
        body: "Student-visa holders can usually work a capped number of hours during study. The current limit and conditions are set by the government and change — we confirm what applies.",
      },
      {
        title: "Post-study work options",
        body: "Eligible graduates may be able to work after finishing, with the length depending on the qualification and location. Your counsellor explains the current rules for your plan.",
      },
      {
        title: "Cities built around students",
        body: "Melbourne, Sydney, Brisbane, Adelaide and Perth all have large student populations and services designed around them.",
      },
    ],
    why: [
      {
        title: "Strong demand in several fields",
        body: "Nursing, engineering and IT graduates are actively sought, and programmes are designed with that demand in mind.",
      },
      {
        title: "A well-regulated sector",
        body: "International education is tightly regulated, with protections for students around fees, course changes and provider standards.",
      },
      {
        title: "Multicultural and welcoming",
        body: "International students are a large part of campus and city life, with established communities in every major city.",
      },
      {
        title: "Two main intakes",
        body: "February and July starts give you two realistic entry points a year, which helps if a deadline is tight.",
      },
    ],
    levels: [
      {
        level: "Diploma (VET)",
        note: "One to two years, practical and often a pathway into the second year of a related bachelor's degree.",
      },
      {
        level: "Bachelor's",
        note: "Three to four years. Entry is based on senior secondary results; some programmes have prerequisites or interviews.",
      },
      {
        level: "Master's",
        note: "One to two years. Coursework master's are common; entry depends on your bachelor's field and grades.",
      },
      {
        level: "Nursing & regulated fields",
        note: "Registration requirements apply on top of academic entry — English scores are higher and placements are built in.",
      },
    ],
    courses: [
      { group: "Healthcare", items: ["Nursing", "Public Health", "Health Services Management", "Psychology"] },
      { group: "Engineering", items: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Mining Engineering"] },
      { group: "Technology", items: ["Information Technology", "Data Science", "Cyber Security", "Artificial Intelligence"] },
      { group: "Business & hospitality", items: ["Business Administration", "Accounting", "Project Management", "Hospitality & Tourism Management"] },
    ],
    admissions: [
      "Academic transcripts meeting the programme's entry level, and any subject prerequisites.",
      "Evidence of English — usually higher for nursing, teaching and other regulated fields.",
      "A statement of purpose, and a genuine-student explanation of your plans for the visa.",
      "A valid passport and evidence of funds for tuition, travel and living costs.",
      "For some master's programmes: a relevant bachelor's degree and, occasionally, work experience.",
    ],
    englishNote:
      "Regulated professions (nursing, teaching) set their own English minimums through their registration bodies, and these are higher than general university entry.",
    budget: [
      { label: "Tuition", detail: "Set by each institution and course. Clinical and lab-based programmes generally cost more than classroom-based ones." },
      { label: "Living costs", detail: "Sydney and Melbourne are the most expensive; Adelaide, Brisbane and Perth are typically lower for rent." },
      { label: "Overseas health cover", detail: "Health cover for the length of your visa is a mandatory cost, arranged before you travel." },
      { label: "Upfront", detail: "A tuition deposit to receive your enrolment confirmation, plus documented funds for the visa." },
    ],
    budgetNote:
      "Tuition, health cover and the funds requirement change each year and by state. We build a current, city-specific estimate for your shortlist in counselling.",
    scholarships: [
      "University international scholarships and partial fee reductions, usually merit-based.",
      "Faculty or course awards for strong applicants in a particular discipline.",
      "Regional or state incentives that some institutions offer to attract students outside the largest cities.",
      "We check your eligibility and handle the application timing.",
    ],
    life: [
      "Student services cover orientation, accommodation help, counselling and academic support.",
      "Part-time work is common; the hours you can work during study are capped and set by the government.",
      "Distances are large — plan travel and, if you're outside a major city, factor in transport.",
      "The academic year runs opposite to the northern hemisphere, so a February start follows a southern summer.",
    ],
    faqs: [
      {
        q: "How many hours can I work while studying?",
        a: "There is a cap on the hours a student-visa holder can work during study periods. The exact limit is set by the government and has changed in recent years, so confirm the current figure with your counsellor.",
      },
      {
        q: "Is nursing a realistic option for me?",
        a: "Nursing has strong demand but also higher English requirements and registration steps. Whether it's realistic depends on your background — we assess that honestly in the first session.",
      },
      {
        q: "Which city should I choose?",
        a: "It's a trade-off between cost, job opportunities and lifestyle. Sydney and Melbourne have more of everything, including higher rent; other cities can suit a tighter budget.",
      },
      {
        q: "When should I apply?",
        a: "For a February intake, begin around the middle of the previous year to leave room for the English test, health cover and the visa.",
      },
    ],
  },

  de: {
    lede: "Take your education to Europe with programmes in engineering, technology and science — and, at public universities, comparatively low tuition costs.",
    stats: [
      { value: "Winter · Summer", label: "Common intakes" },
      { value: "English & German", label: "Languages of instruction" },
      { value: "Bachelor's to Master's", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "Low or no tuition at public universities",
        body: "Most public universities charge little or no tuition fee — a semester contribution still applies, and some states and programmes are exceptions. Private institutions do charge tuition.",
      },
      {
        title: "English-taught programmes",
        body: "There is a wide and growing range of bachelor's and master's programmes taught entirely in English, especially in engineering, IT and data science.",
      },
      {
        title: "Deep industry links",
        body: "Universities of applied sciences in particular build in industry projects and internships, and Germany's engineering and automotive sectors are closely connected to the universities.",
      },
      {
        title: "A strong research environment",
        body: "Research funding and infrastructure are significant, which matters for students considering a research master's or PhD.",
      },
    ],
    why: [
      {
        title: "Value for money",
        body: "The combination of low public tuition and strong programmes makes Germany one of the more affordable routes into a European degree — living costs still apply.",
      },
      {
        title: "STEM depth",
        body: "Engineering, automotive, data science and the physical sciences have some of the deepest programme options in Europe.",
      },
      {
        title: "A European base",
        body: "A degree in Germany places you inside the European academic and professional network, with travel across the region straightforward.",
      },
      {
        title: "Applied and academic tracks",
        body: "Universities of applied sciences (Fachhochschulen) and research universities offer genuinely different experiences — we help you pick the right one.",
      },
    ],
    levels: [
      {
        level: "Bachelor's",
        note: "Usually three to four years. Direct entry often requires a recognised secondary qualification; some students need a foundation year (Studienkolleg) first.",
      },
      {
        level: "Master's",
        note: "One to two years. Entry depends on your bachelor's subject match and grades; English-taught master's are widely available in STEM.",
      },
      {
        level: "Engineering & automotive",
        note: "Programme structures often include a mandatory internship or industry semester.",
      },
      {
        level: "Data science & AI",
        note: "A fast-growing set of English-taught master's programmes, competitive on entry, with links to Germany's technology sector.",
      },
    ],
    courses: [
      { group: "Engineering", items: ["Mechanical Engineering", "Electrical Engineering", "Automotive Engineering", "Mechatronics", "Industrial Engineering"] },
      { group: "Technology & data", items: ["Computer Science", "Data Science", "Artificial Intelligence", "Renewable Energy"] },
      { group: "Sciences", items: ["Physics", "Chemistry", "Biotechnology", "Environmental Science"] },
      { group: "Business & management", items: ["International Management", "Supply Chain Management", "Finance"] },
    ],
    admissions: [
      "A recognised secondary or bachelor's qualification; some applicants need a Studienkolleg (foundation) year before bachelor's entry.",
      "Evidence of English for English-taught programmes; German proficiency for German-taught ones.",
      "A motivation letter and CV, and subject-specific documents for technical programmes.",
      "A blocked account or other proof of funds for the student visa, plus a valid passport.",
      "For master's: a close subject match between your bachelor's and the programme is often decisive.",
    ],
    englishNote:
      "For German-taught programmes you'll need to evidence German (commonly TestDaF or DSH). English-taught programmes still require an English test unless you qualify for a waiver.",
    budget: [
      { label: "Tuition", detail: "Public universities: little or no fee, plus a semester contribution. Private institutions and a few states or programmes charge tuition." },
      { label: "Semester contribution", detail: "A modest fee each semester that usually includes a regional public-transport pass." },
      { label: "Living costs", detail: "Munich and Frankfurt are higher; many university cities are more affordable for rent." },
      { label: "Upfront", detail: "Proof of funds — often via a blocked account holding a set amount — is required for the visa before you arrive." },
    ],
    budgetNote:
      "The blocked-account amount and semester contributions are set by the authorities and universities and change. We confirm current figures for your situation in counselling.",
    scholarships: [
      "DAAD and other public scholarships — competitive, with early deadlines and specific eligibility.",
      "University and faculty awards, some aimed at students from particular regions or fields.",
      "Foundation scholarships tied to academic merit or subject area.",
      "We identify what you can realistically apply for and manage the timeline.",
    ],
    life: [
      "Student unions (Studierendenwerk) manage affordable halls, canteens and support services.",
      "The semester contribution usually covers regional public transport, which keeps travel costs low.",
      "Learning some German helps day to day, even on an English-taught programme.",
      "Registration formalities after arrival (residence registration, bank account, insurance) take some organising — we brief you before you travel.",
    ],
    faqs: [
      {
        q: "Is public university really free?",
        a: "Most public universities charge little or no tuition, but a semester contribution applies, and there are exceptions by state and programme. Living costs are a real expense regardless.",
      },
      {
        q: "Do I need to speak German?",
        a: "For an English-taught programme you can study without German, though everyday life is easier with some. German-taught programmes require you to evidence German proficiency.",
      },
      {
        q: "What is a blocked account?",
        a: "It's a bank account holding a set amount that you can draw down monthly, used to prove you can support yourself for the visa. The required amount is set by the authorities.",
      },
      {
        q: "Will my bachelor's subject match a master's here?",
        a: "German master's admissions weigh the subject match between your bachelor's and the programme heavily. We check this before you apply so you don't waste an application.",
      },
    ],
  },

  ie: {
    lede: "Study in an English-speaking European destination with strong options across technology, business, finance and the pharmaceutical sciences.",
    stats: [
      { value: "Sep · Jan", label: "Common intakes" },
      { value: "English", label: "Language of instruction" },
      { value: "Bachelor's to Master's", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "English-speaking, inside the EU",
        body: "Ireland combines an English-language education system with a European base, which suits students who want Europe without a language barrier.",
      },
      {
        title: "A real technology ecosystem",
        body: "Many large technology and pharmaceutical companies have significant operations in Ireland, and universities have built programmes and links around that.",
      },
      {
        title: "A stay-back option for graduates",
        body: "Eligible graduates can apply to remain and look for work for a period after finishing. Eligibility depends on the award and level — your counsellor confirms the current terms.",
      },
      {
        title: "Focused postgraduate study",
        body: "One-year taught master's programmes are common, particularly in business, computing and AI.",
      },
    ],
    why: [
      {
        title: "Technology and business strength",
        body: "Computing, data, AI, finance and business have deep programme options and clear connections to employers based in Ireland.",
      },
      {
        title: "No language barrier",
        body: "Studying and living in English removes a common source of stress and lets you focus on the course from day one.",
      },
      {
        title: "European exposure",
        body: "A degree in Ireland places you within the EU academic and professional network, with the rest of Europe close by.",
      },
      {
        title: "A manageable scale",
        body: "The sector is smaller and more navigable than some larger countries, and campuses tend to be close-knit.",
      },
    ],
    levels: [
      {
        level: "Bachelor's",
        note: "Three to four years. Entry is based on your senior secondary results and any subject requirements.",
      },
      {
        level: "Master's",
        note: "One to two years, mostly taught. Entry depends on your bachelor's discipline and grades.",
      },
      {
        level: "Business & IT conversion",
        note: "Conversion master's let graduates from other fields move into computing or business — a common route for career changers.",
      },
      {
        level: "Pharmaceutical & life sciences",
        note: "Specialised master's programmes linked to Ireland's pharmaceutical sector, often with lab or project components.",
      },
    ],
    courses: [
      { group: "Technology", items: ["Computer Science", "Artificial Intelligence", "Data Analytics", "Software Engineering", "Cyber Security"] },
      { group: "Business & finance", items: ["Business Analytics", "Finance", "International Business", "Marketing", "Management"] },
      { group: "Pharmaceutical & science", items: ["Pharmaceutical Sciences", "Biopharmaceutical Engineering", "Regulatory Affairs"] },
      { group: "Other in demand", items: ["Supply Chain Management", "Project Management", "Digital Marketing"] },
    ],
    admissions: [
      "Academic transcripts meeting the programme's grade and subject requirements.",
      "Evidence of English at the required level, or grounds for a waiver.",
      "A statement of purpose, and references where the course asks for them.",
      "A valid passport and evidence of funds for tuition and living costs for the immigration permission.",
      "For conversion or specialist master's: a clear explanation of why you're moving into the field.",
    ],
    englishNote:
      "Requirements are set by each institution and are generally higher for postgraduate study. Waivers based on prior study in English are accepted by some universities.",
    budget: [
      { label: "Tuition", detail: "Set by each institution and programme; computing and business master's vary widely, and lab-based science programmes tend to cost more." },
      { label: "Living costs", detail: "Dublin is the most expensive by some margin; Cork, Galway, Limerick and smaller cities are lower for rent." },
      { label: "Immigration registration", detail: "A registration fee applies after arrival to formalise your permission to stay." },
      { label: "Upfront", detail: "A tuition deposit to secure your place, and documented funds for the visa or preclearance." },
    ],
    budgetNote:
      "Tuition and the funds requirement change each year. Accommodation in Dublin is the single biggest variable — we build a realistic estimate for your shortlist in counselling.",
    scholarships: [
      "University scholarships and fee reductions for international students, usually merit-based.",
      "Department awards in computing, business and science for strong applicants.",
      "Government of Ireland scholarships — highly competitive, with early deadlines.",
      "We match you to what you're eligible for and manage the deadlines.",
    ],
    life: [
      "International offices handle orientation, accommodation guidance and practical questions.",
      "Part-time work is possible for eligible students within a weekly limit during term.",
      "Cities are compact; Dublin has the most going on but also the tightest housing market.",
      "The weather is mild and wet year-round — nothing extreme, but rarely dry for long.",
    ],
    faqs: [
      {
        q: "Can I stay and work after graduating in Ireland?",
        a: "Eligible graduates can apply to stay and look for work for a period after finishing. Eligibility depends on the award and level, and the rules can change, so confirm the current terms with your counsellor.",
      },
      {
        q: "Is Dublin the only option?",
        a: "No. Dublin has the most universities and jobs but also the highest costs, especially rent. Cork, Galway and Limerick are strong alternatives on a tighter budget.",
      },
      {
        q: "Can I switch into tech from a non-technical background?",
        a: "Conversion master's in computing and business exist for exactly this. Whether it's realistic depends on your maths background and grades — we assess that honestly.",
      },
      {
        q: "How competitive are the courses?",
        a: "Computing, data and AI programmes at the well-known universities can be competitive on entry. We shortlist a realistic mix rather than only reach options.",
      },
    ],
  },

  nz: {
    lede: "Quality education in a welcoming, naturally beautiful country, with practical programmes across hospitality, agriculture, business and more.",
    stats: [
      { value: "Feb · Jul", label: "Common intakes" },
      { value: "English", label: "Language of instruction" },
      { value: "Diploma to Master's", label: "Study levels available" },
    ],
    highlights: [
      {
        title: "Practical, applied qualifications",
        body: "Institutes of technology and universities both emphasise hands-on learning, with placements common in hospitality, agriculture and trades-adjacent fields.",
      },
      {
        title: "A straightforward post-study work option",
        body: "Eligible graduates can apply for a post-study work visa, with the length tied to the qualification and level. Your counsellor confirms what applies to your plan.",
      },
      {
        title: "Smaller class sizes",
        body: "The scale of the system means more contact with teaching staff and a less anonymous experience than a very large university.",
      },
      {
        title: "A balanced lifestyle",
        body: "Cities are small and close to the outdoors, which suits students who want study to sit alongside a life rather than consume it.",
      },
    ],
    why: [
      {
        title: "High-quality, well-regulated education",
        body: "All eight universities are publicly funded and internationally ranked, and international education is regulated with student protections in place.",
      },
      {
        title: "Supportive environment",
        body: "Institutions are used to international students and build support around them; the pace of life makes settling in easier.",
      },
      {
        title: "Strength in applied fields",
        body: "Hospitality, agriculture, viticulture, environmental science and business have practical, industry-connected programmes.",
      },
      {
        title: "Two intakes a year",
        body: "February and July starts give two realistic entry points, useful if a deadline is close.",
      },
    ],
    levels: [
      {
        level: "Diploma",
        note: "One to two years at an institute of technology, practical, and often a pathway into a related degree.",
      },
      {
        level: "Bachelor's",
        note: "Three years for most subjects. Entry is based on senior secondary results and subject requirements.",
      },
      {
        level: "Master's",
        note: "One to two years. Both taught and research master's are available; entry depends on your bachelor's field and grades.",
      },
      {
        level: "Graduate diploma",
        note: "One year, used to convert into a new field or to top up before a master's.",
      },
    ],
    courses: [
      { group: "Hospitality & tourism", items: ["Hotel Management", "Tourism Management", "Culinary Arts", "Event Management"] },
      { group: "Agriculture & environment", items: ["Agribusiness", "Viticulture & Oenology", "Environmental Science", "Agricultural Science"] },
      { group: "Business", items: ["Business Administration", "Accounting", "Project Management", "Marketing"] },
      { group: "Also popular", items: ["Information Technology", "Construction Management", "Nursing"] },
    ],
    admissions: [
      "Academic transcripts meeting the programme's entry level and any subject requirements.",
      "Evidence of English at the required level, or grounds for a waiver.",
      "A statement of purpose and a genuine-student account of your study plans for the visa.",
      "A valid passport and evidence of funds for tuition, travel and living costs.",
      "For master's programmes: a relevant bachelor's degree and grades meeting the threshold.",
    ],
    englishNote:
      "Requirements are set by each institution. Regulated fields such as nursing and teaching set higher minimums through their professional bodies.",
    budget: [
      { label: "Tuition", detail: "Set by each institution and programme. Diplomas at institutes of technology are generally lower than university degrees." },
      { label: "Living costs", detail: "Auckland is the most expensive; Wellington, Christchurch, Hamilton and Dunedin are lower for rent." },
      { label: "Health & travel insurance", detail: "Appropriate insurance for the length of your study is required and arranged before travel." },
      { label: "Upfront", detail: "A tuition deposit to receive your offer of place, and documented funds for the visa." },
    ],
    budgetNote:
      "Tuition, insurance and the funds requirement change each year. We prepare a current, city-specific estimate for your shortlist during counselling.",
    scholarships: [
      "University and institute scholarships for international students, usually merit-based.",
      "Faculty or subject awards for strong applicants in a particular field.",
      "Government-supported scholarships — limited and competitive, with early deadlines.",
      "We check your eligibility and handle the application timing.",
    ],
    life: [
      "Student support covers orientation, accommodation guidance, health and academic help.",
      "Part-time work is possible for many students within a weekly limit during study.",
      "Cities are small and close to the outdoors; a car is useful outside the main centres.",
      "The academic year follows the southern calendar, so a February start comes after a southern summer.",
    ],
    faqs: [
      {
        q: "Can I work after I graduate in New Zealand?",
        a: "Eligible graduates can apply for a post-study work visa, with the length depending on the qualification and level. Confirm the current rules with your counsellor, as they can change.",
      },
      {
        q: "Is a diploma worthwhile, or should I do a degree?",
        a: "A diploma at an institute of technology is practical and can pathway into a degree later. Which route fits depends on your prior study, budget and goal.",
      },
      {
        q: "Which city should I choose?",
        a: "Auckland has the most options and the highest costs. Wellington, Christchurch and smaller cities can suit a tighter budget and a quieter pace.",
      },
      {
        q: "When should I start applying?",
        a: "For a February intake, begin around the middle of the previous year to leave time for the English test, insurance and the visa.",
      },
    ],
  },
};
