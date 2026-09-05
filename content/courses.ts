/**
 * Static seed content for the `courses` table (see scripts/seed.ts). The admin
 * panel (`/admin/courses`) is the source of truth after the seed runs — edits
 * made there are NOT reflected back here. Mirrors the shape of content/countries.ts.
 *
 * Deliberately framework-and-hedged, not hard claims: study levels, admission
 * detail and career outcomes move by institution, country and profession. Each
 * section describes what drives the answer and defers specifics to counselling.
 */

export type CourseCategoryKey =
  | "healthcare"
  | "technology"
  | "engineering"
  | "business"
  | "hospitality"
  | "education"
  | "science";

export const COURSE_CATEGORIES: {
  key: CourseCategoryKey;
  label: string;
  blurb: string;
  exploreLabel: string;
}[] = [
  {
    key: "healthcare",
    label: "Healthcare & Medical",
    blurb: "Nursing, medicine, pharmacy and allied health study options.",
    exploreLabel: "Explore Healthcare Courses",
  },
  {
    key: "technology",
    label: "Technology & Computing",
    blurb: "Computing, AI, data and cyber security across leading destinations.",
    exploreLabel: "Explore Technology Courses",
  },
  {
    key: "engineering",
    label: "Engineering",
    blurb: "International engineering programmes across multiple disciplines.",
    exploreLabel: "Explore Engineering Courses",
  },
  {
    key: "business",
    label: "Business & Management",
    blurb: "Management, finance, marketing and operations-focused programmes.",
    exploreLabel: "Explore Business Courses",
  },
  {
    key: "hospitality",
    label: "Hospitality & Tourism",
    blurb: "Hotel operations, culinary arts and the wider service industry.",
    exploreLabel: "Explore Hospitality Courses",
  },
  {
    key: "education",
    label: "Education & Social Sciences",
    blurb: "Early learning, psychology and community-focused study options.",
    exploreLabel: "Explore Education & Social Science Courses",
  },
  {
    key: "science",
    label: "Science & Agriculture",
    blurb: "Agriculture, food production and applied biological sciences.",
    exploreLabel: "Explore Science Courses",
  },
];

export type CourseCard = {
  slug: string;
  name: string;
  category: CourseCategoryKey;
  summary: string;
};

export const COURSES: CourseCard[] = [
  // Healthcare & Medical
  { slug: "nursing", name: "Nursing", category: "healthcare", summary: "Build knowledge and practical skills for a career in nursing and healthcare." },
  { slug: "medicine", name: "Medicine", category: "healthcare", summary: "Explore medical education opportunities in selected international study destinations." },
  { slug: "pharmacy", name: "Pharmacy", category: "healthcare", summary: "Study pharmaceutical science, medicines, healthcare and related professional fields." },
  { slug: "health-care-assistant", name: "Health Care Assistant", category: "healthcare", summary: "Develop practical skills for supporting patients and healthcare professionals in care environments." },
  { slug: "public-health", name: "Public Health", category: "healthcare", summary: "Explore healthcare from a broader perspective, including community health, prevention and health management." },

  // Technology & Computing
  { slug: "information-technology", name: "Information Technology (IT)", category: "technology", summary: "Develop skills across computing, software, systems, networks and modern digital technologies." },
  { slug: "artificial-intelligence", name: "Artificial Intelligence (AI)", category: "technology", summary: "Explore intelligent systems, machine learning, automation and emerging AI technologies." },
  { slug: "data-science", name: "Data Science", category: "technology", summary: "Learn how data can be collected, analysed and transformed into meaningful insights." },
  { slug: "cyber-security", name: "Cyber Security", category: "technology", summary: "Develop knowledge in digital security, network protection, information security and cyber risk." },

  // Engineering
  { slug: "engineering", name: "Engineering", category: "engineering", summary: "Explore international engineering programmes across a variety of disciplines and specialisations." },

  // Business & Management
  { slug: "business-administration", name: "Business Administration (BBA)", category: "business", summary: "Build a foundation in business, management, marketing, finance and organisational operations." },
  { slug: "mba", name: "MBA", category: "business", summary: "Advance your business and leadership knowledge through postgraduate management education." },
  { slug: "accounting-finance", name: "Accounting & Finance", category: "business", summary: "Explore financial management, accounting, reporting, investment and related business disciplines." },
  { slug: "digital-marketing", name: "Digital Marketing", category: "business", summary: "Study modern marketing across digital platforms, content, advertising, analytics and consumer behaviour." },
  { slug: "project-management", name: "Project Management", category: "business", summary: "Develop skills in planning, managing and delivering projects across different industries." },
  { slug: "supply-chain-logistics", name: "Supply Chain & Logistics", category: "business", summary: "Explore procurement, logistics, operations, transportation and global supply-chain management." },

  // Hospitality & Tourism
  { slug: "hospitality-tourism", name: "Hospitality & Tourism", category: "hospitality", summary: "Build skills for careers within the international hospitality, tourism and service industries." },
  { slug: "hotel-management", name: "Hotel Management", category: "hospitality", summary: "Explore hotel operations, guest services, hospitality management and related business functions." },
  { slug: "culinary-arts", name: "Culinary Arts", category: "hospitality", summary: "Develop professional knowledge and practical skills related to food preparation and the culinary industry." },

  // Education & Social Sciences
  { slug: "early-childhood-education", name: "Early Childhood Education", category: "education", summary: "Study child development, early learning and educational approaches for working with young children." },
  { slug: "psychology", name: "Psychology", category: "education", summary: "Explore human behaviour, cognition, development and different areas of psychological study." },
  { slug: "social-work", name: "Social Work", category: "education", summary: "Develop knowledge and skills related to supporting individuals, families and communities." },

  // Science & Agriculture
  { slug: "agriculture", name: "Agriculture", category: "science", summary: "Explore modern agriculture, food production, sustainability and related scientific fields." },
  { slug: "biotechnology", name: "Biotechnology", category: "science", summary: "Study the application of biological sciences and technology across healthcare, agriculture, research and industry." },
];

export type CourseContent = {
  headline: string;
  lede: string;
  intro: string;
  about: string[];
  whatYouStudy: string[];
  levels: string[];
  whoFor: string[];
  careers: string[];
  careersNote: string;
  admissionsNote?: string;
  feesNote?: string;
  whyNote?: string;
};

/** Shown on every course page, above any course-specific admissions note. */
export const COURSE_ADMISSION_FRAMEWORK = [
  "Academic qualifications and transcripts for your highest completed level of study, meeting the programme's grade requirement.",
  "Relevant prior subjects, where the programme sets a specific academic background.",
  "Evidence of English language proficiency at the level the programme requires, or grounds for a waiver.",
  "Supporting documents such as a statement of purpose and references, and — for some programmes — a portfolio or interview.",
  "Any programme-specific requirements set by the institution or, for regulated professions, a registration or licensing body.",
];

/** Shown on every course page, above any course-specific fees note. */
export const COURSE_FEES_TEXT =
  "Tuition fees and living expenses vary according to the destination, university, programme and duration. Study Abroad Pro can help you compare suitable options based on your study budget.";

/** The "How Study Abroad Pro Helps" arrow chain, shared across every course. */
export const COURSE_JOURNEY_STEPS = [
  "Course Selection",
  "Country Selection",
  "University Shortlisting",
  "Application Support",
  "SOP & LOR Guidance",
  "Scholarship Assistance",
  "Education Loan Assistance",
  "Visa Guidance",
  "Pre-Departure Support",
  "Post-Arrival Support",
];

/** The "Not Sure What to Study?" course-finder factors on /courses. */
export const COURSE_FINDER_FACTORS = [
  "Academic background",
  "Interests",
  "Career goals",
  "Preferred destination",
  "Budget",
  "Preferred study level",
];

export const COURSE_CONTENT: Record<string, CourseContent> = {
  /* ---------------------------------------------------------- healthcare */
  nursing: {
    headline: "Study Nursing Abroad",
    lede: "Build your future in healthcare by exploring nursing programmes across international study destinations.",
    intro:
      "Whether you're beginning your higher education journey or looking to advance your existing healthcare qualifications, Study Abroad Pro can help you explore suitable nursing programmes based on your profile and career goals.",
    about: [
      "Nursing focuses on patient care, health promotion and supporting individuals across different healthcare settings.",
      "Programmes can combine theoretical learning with practical and clinical education, depending on the course, institution and country.",
    ],
    whatYouStudy: [
      "Fundamentals of Nursing",
      "Anatomy & Physiology",
      "Patient Care",
      "Clinical Nursing",
      "Community Health",
      "Mental Health",
      "Health Assessment",
      "Medical & Surgical Nursing",
      "Healthcare Ethics",
      "Nursing Research",
    ],
    levels: ["Diploma", "Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Healthcare",
      "Patient care",
      "Clinical environments",
      "Community health",
      "Working with people",
      "Building a healthcare-focused career",
    ],
    careers: [
      "Nursing",
      "Community Healthcare",
      "Aged Care",
      "Clinical Support",
      "Healthcare Management",
      "Public Health",
      "Nursing Research",
    ],
    careersNote: "Professional registration and licensing requirements vary by country and profession.",
  },

  medicine: {
    headline: "Study Medicine Abroad",
    lede: "Explore medical education opportunities in selected international study destinations.",
    intro:
      "Medical study is one of the longest and most closely regulated academic paths, and the realistic route depends heavily on your prior academic record, the destination and its registration requirements. Study Abroad Pro can help you explore suitable options based on your profile.",
    about: [
      "Medicine focuses on the diagnosis, treatment and prevention of illness, combining foundational science with extensive clinical training.",
      "Programmes are typically long, structured and regulated by the destination's medical education and registration authorities, with entry often more competitive than other fields.",
    ],
    whatYouStudy: [
      "Anatomy & Physiology",
      "Biochemistry",
      "Pathology & Pharmacology",
      "Clinical Medicine",
      "Surgery",
      "Community & Preventive Medicine",
      "Medical Ethics",
      "Clinical Rotations & Internship",
    ],
    levels: ["Bachelor's (MBBS-equivalent)", "Postgraduate", "Doctoral"],
    whoFor: [
      "The sciences and patient care",
      "Long, structured academic and clinical training",
      "Diagnosing and treating illness",
      "Working under close professional regulation",
      "A long-term commitment to a medical career",
    ],
    careers: [
      "General & Specialist Medicine",
      "Clinical Practice",
      "Medical Research",
      "Public Health Medicine",
      "Hospital Administration",
    ],
    careersNote:
      "Practising as a doctor requires meeting the destination's (and often your home country's) medical registration and licensing requirements, which vary significantly and can involve further exams after graduation.",
    admissionsNote:
      "Medical programmes are typically the most competitive and score-sensitive of any field, and many destinations set additional entrance tests, interviews or quota conditions for international applicants.",
  },

  pharmacy: {
    headline: "Study Pharmacy Abroad",
    lede: "Study pharmaceutical science, medicines, healthcare and related professional fields.",
    intro:
      "Whether you're drawn to community pharmacy, hospital practice or pharmaceutical science, Study Abroad Pro can help you explore suitable pharmacy programmes based on your profile and career goals.",
    about: [
      "Pharmacy focuses on medicines — how they're developed, how they work, and how they're dispensed and used safely.",
      "Programmes combine chemistry and biological science with practical training in dispensing, patient counselling and, in some countries, clinical placements.",
    ],
    whatYouStudy: [
      "Pharmaceutical Chemistry",
      "Pharmacology",
      "Pharmaceutics",
      "Dispensing & Patient Care",
      "Pharmacy Practice",
      "Clinical Pharmacy",
      "Pharmaceutical Regulation",
      "Research Methods",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Chemistry and biological science",
      "Medicines and patient safety",
      "Precise, detail-driven work",
      "Community or hospital healthcare settings",
      "Building a licensed healthcare career",
    ],
    careers: [
      "Community Pharmacy",
      "Hospital Pharmacy",
      "Pharmaceutical Industry",
      "Regulatory Affairs",
      "Pharmaceutical Research",
    ],
    careersNote: "Practising as a pharmacist requires professional registration, which is set by each country's pharmacy regulatory body.",
  },

  "health-care-assistant": {
    headline: "Study as a Health Care Assistant Abroad",
    lede: "Develop practical skills for supporting patients and healthcare professionals in care environments.",
    intro:
      "If you want a practical, faster route into a healthcare-focused role, Study Abroad Pro can help you explore health care assistant programmes suited to your background and goals.",
    about: [
      "Health Care Assistant programmes prepare students to support nurses and other healthcare professionals with day-to-day patient care.",
      "Courses are typically shorter and more practically focused than nursing degrees, often including supervised placement hours in a care setting.",
    ],
    whatYouStudy: [
      "Personal Care & Hygiene",
      "Basic Health Monitoring",
      "Supporting Daily Living Activities",
      "Communication in Care Settings",
      "Safety & Infection Control",
      "Working with Older Adults & Vulnerable Groups",
      "Supervised Clinical Placement",
    ],
    levels: ["Certificate", "Diploma"],
    whoFor: [
      "Patient and personal care",
      "Aged care and community settings",
      "Hands-on, practical work",
      "A quicker entry into healthcare",
      "Supporting nurses and clinical teams",
    ],
    careers: [
      "Health Care Assistant",
      "Personal Support Worker",
      "Aged Care Support",
      "Community Care",
      "A pathway into further nursing study",
    ],
    careersNote: "Some destinations require a certification or registration step even at this level — your counsellor confirms what applies.",
  },

  "public-health": {
    headline: "Study Public Health Abroad",
    lede: "Explore healthcare from a broader perspective, including community health, prevention and health management.",
    intro:
      "If you're more drawn to population-level health than individual clinical care, Study Abroad Pro can help you explore public health programmes that match your background and goals.",
    about: [
      "Public Health looks at health from a community and population perspective — prevention, health promotion, and how health systems are organised and managed.",
      "Programmes often suit students moving from a clinical, science or social-science background who want a broader, policy- and prevention-focused angle on healthcare.",
    ],
    whatYouStudy: [
      "Epidemiology",
      "Health Promotion",
      "Biostatistics",
      "Health Policy & Management",
      "Environmental & Community Health",
      "Global Health",
      "Research Methods",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Community and population health",
      "Prevention and health promotion",
      "Health systems and policy",
      "Data and research",
      "A broader view of healthcare",
    ],
    careers: [
      "Public Health",
      "Community Healthcare",
      "Health Policy",
      "Health Program Management",
      "Research & Epidemiology",
    ],
    careersNote: "Some roles sit within government or public-sector health systems, where local eligibility rules can apply.",
  },

  /* --------------------------------------------------------- technology */
  "information-technology": {
    headline: "Study Information Technology Abroad",
    lede: "Develop skills across computing, software, systems, networks and modern digital technologies.",
    intro:
      "Whether you're starting out in computing or building on existing technical experience, Study Abroad Pro can help you explore IT programmes that match your profile and career goals.",
    about: [
      "Information Technology covers the design, development and management of the computing systems that businesses and organisations rely on.",
      "Programmes typically combine programming and systems fundamentals with the chance to specialise into networks, software, cloud or infrastructure as you progress.",
    ],
    whatYouStudy: [
      "Programming Fundamentals",
      "Database Systems",
      "Computer Networks",
      "Web & Software Development",
      "Systems Analysis & Design",
      "Cloud Computing",
      "IT Project Management",
      "Emerging Technologies",
    ],
    levels: ["Diploma", "Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Computing and problem-solving",
      "Building and maintaining systems",
      "Working with software and technology",
      "A fast-moving, in-demand field",
      "Practical, project-based learning",
    ],
    careers: [
      "Software Development",
      "Systems & Network Administration",
      "IT Support & Infrastructure",
      "Cloud Computing",
      "IT Project Management",
    ],
    careersNote: "IT is a broad field — the specific role you're suited to often becomes clearer once you specialise within the programme.",
  },

  "artificial-intelligence": {
    headline: "Study Artificial Intelligence Abroad",
    lede: "Explore intelligent systems, machine learning, automation and emerging AI technologies.",
    intro:
      "AI is one of the fastest-growing and most competitive fields in technology education. Study Abroad Pro can help you explore programmes that realistically match your academic background and goals.",
    about: [
      "Artificial Intelligence focuses on building systems that can learn from data, recognise patterns and automate tasks that previously needed human judgement.",
      "Programmes usually build on a strong foundation in mathematics and programming before moving into machine learning, neural networks and applied AI.",
    ],
    whatYouStudy: [
      "Mathematics for AI (Linear Algebra, Statistics)",
      "Machine Learning",
      "Neural Networks & Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Data Structures & Algorithms",
      "AI Ethics & Governance",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Mathematics, logic and programming",
      "Data-driven problem solving",
      "Emerging technology",
      "Research or applied engineering roles",
      "A strong academic foundation in computing",
    ],
    careers: [
      "Machine Learning Engineering",
      "AI Research",
      "Data Science",
      "Automation & Robotics",
      "AI Product Development",
    ],
    careersNote: "Many postgraduate AI programmes expect a prior background in computing, mathematics or engineering — your counsellor checks the fit before you apply.",
  },

  "data-science": {
    headline: "Study Data Science Abroad",
    lede: "Learn how data can be collected, analysed and transformed into meaningful insights.",
    intro:
      "If you enjoy working with numbers, patterns and problem-solving, Study Abroad Pro can help you explore data science programmes suited to your academic background and goals.",
    about: [
      "Data Science combines statistics, programming and domain knowledge to turn raw data into insights that support decisions.",
      "Programmes typically blend mathematical and statistical foundations with hands-on work using real datasets and modern analytics tools.",
    ],
    whatYouStudy: [
      "Statistics & Probability",
      "Programming for Data (Python/R)",
      "Data Mining & Visualisation",
      "Machine Learning",
      "Big Data Technologies",
      "Database Management",
      "Business Analytics",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Numbers, statistics and analysis",
      "Programming and technical problem-solving",
      "Turning data into decisions",
      "Business, science or technology backgrounds",
      "Detail-oriented, analytical work",
    ],
    careers: [
      "Data Analysis",
      "Data Science & Engineering",
      "Business Intelligence",
      "Machine Learning",
      "Analytics Consulting",
    ],
    careersNote: "Employers increasingly value a portfolio of real project work alongside the qualification itself.",
  },

  "cyber-security": {
    headline: "Study Cyber Security Abroad",
    lede: "Develop knowledge in digital security, network protection, information security and cyber risk.",
    intro:
      "As organisations depend more on digital systems, cyber security has become one of the most in-demand technology fields. Study Abroad Pro can help you explore programmes that match your background and goals.",
    about: [
      "Cyber Security focuses on protecting systems, networks and data from unauthorised access, attack or damage.",
      "Programmes combine technical foundations in networks and systems with specialised training in threat detection, risk management and security operations.",
    ],
    whatYouStudy: [
      "Network Security",
      "Ethical Hacking & Penetration Testing",
      "Cryptography",
      "Risk Management & Compliance",
      "Digital Forensics",
      "Security Operations",
      "Cloud & Application Security",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Technology and systems",
      "Problem-solving under pressure",
      "Protecting data and infrastructure",
      "A fast-growing, in-demand field",
      "Detail-oriented, methodical work",
    ],
    careers: [
      "Security Analysis",
      "Penetration Testing",
      "Security Operations Centre (SOC) roles",
      "Risk & Compliance",
      "Digital Forensics",
    ],
    careersNote: "Some employers and roles expect professional certifications alongside the academic qualification — your counsellor can explain how these usually fit together.",
  },

  /* -------------------------------------------------------- engineering */
  engineering: {
    headline: "Study Engineering Abroad",
    lede: "Explore international engineering programmes across a variety of disciplines and specialisations.",
    intro:
      "Whether you're drawn to mechanical systems, electronics, construction or software, Study Abroad Pro can help you explore engineering programmes and specialisations that match your academic background and goals.",
    about: [
      "Engineering applies mathematics and science to design, build and improve the systems, machines and infrastructure we rely on.",
      "Programmes usually share a common first year or two of core engineering fundamentals before you specialise into a discipline.",
    ],
    whatYouStudy: [
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Electronics Engineering",
      "Computer Engineering",
      "Automotive Engineering",
    ],
    levels: ["Diploma", "Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Mathematics and applied science",
      "Designing and building systems",
      "Practical, hands-on problem-solving",
      "Manufacturing, construction or technology industries",
      "Specialising into a specific engineering discipline",
    ],
    careers: [
      "Mechanical & Manufacturing Engineering",
      "Civil & Structural Engineering",
      "Electrical & Electronics Engineering",
      "Automotive Engineering",
      "Engineering Project Management",
    ],
    careersNote: "Some engineering disciplines require professional accreditation to practise or use a protected title — this varies by country and specialisation.",
  },

  /* ---------------------------------------------------------- business */
  "business-administration": {
    headline: "Study Business Administration (BBA) Abroad",
    lede: "Build a foundation in business, management, marketing, finance and organisational operations.",
    intro:
      "If you're looking for a broad, versatile foundation in business, Study Abroad Pro can help you explore BBA programmes that match your goals and preferred destination.",
    about: [
      "Business Administration gives students a broad grounding across the core functions of a business — management, marketing, finance and operations.",
      "Programmes are typically flexible, letting you specialise in a business area of interest in your later years while keeping options open.",
    ],
    whatYouStudy: [
      "Principles of Management",
      "Marketing",
      "Financial Accounting",
      "Business Economics",
      "Organisational Behaviour",
      "Business Law",
      "Operations Management",
    ],
    levels: ["Bachelor's"],
    whoFor: [
      "A broad foundation in business",
      "Management and organisational roles",
      "Keeping career options open",
      "Working across teams and functions",
      "Progressing towards an MBA later",
    ],
    careers: [
      "Business Management",
      "Marketing & Sales",
      "Operations",
      "Human Resources",
      "Further postgraduate business study (e.g. MBA)",
    ],
    careersNote: "A BBA is often chosen as groundwork for a specialised master's or MBA later in your career.",
  },

  mba: {
    headline: "Study for an MBA Abroad",
    lede: "Advance your business and leadership knowledge through postgraduate management education.",
    intro:
      "If you're looking to move into leadership or change direction in your career, Study Abroad Pro can help you explore MBA programmes that match your professional background and goals.",
    about: [
      "An MBA is a postgraduate management qualification aimed at developing leadership, strategy and decision-making skills.",
      "Programmes are typically built around case studies and practical projects, and often expect some prior work experience.",
    ],
    whatYouStudy: [
      "Strategic Management",
      "Leadership & Organisational Behaviour",
      "Corporate Finance",
      "Marketing Management",
      "Operations & Supply Chain",
      "Business Analytics",
      "Capstone Project / Consulting Project",
    ],
    levels: ["Postgraduate", "MBA"],
    whoFor: [
      "Working professionals seeking career advancement",
      "Future leadership and management roles",
      "Changing industry or specialisation",
      "Strategic, decision-focused thinking",
      "Building a professional network",
    ],
    careers: [
      "Management & Leadership",
      "Consulting",
      "Corporate Strategy",
      "Finance & Investment",
      "Entrepreneurship",
    ],
    careersNote: "Most MBA programmes expect a minimum period of prior work experience — requirements vary by institution and country.",
    admissionsNote: "MBA programmes commonly also ask for a resume, professional references and, for some, a GMAT or GRE score alongside academic transcripts.",
  },

  "accounting-finance": {
    headline: "Study Accounting & Finance Abroad",
    lede: "Explore financial management, accounting, reporting, investment and related business disciplines.",
    intro:
      "If you're detail-oriented and interested in how money, reporting and investment decisions work, Study Abroad Pro can help you explore accounting and finance programmes suited to your goals.",
    about: [
      "Accounting & Finance covers how organisations record, report and manage money — from day-to-day bookkeeping to investment and financial strategy.",
      "Programmes combine core accounting principles with finance theory, and some pathway towards professional accounting body qualifications.",
    ],
    whatYouStudy: [
      "Financial Accounting",
      "Management Accounting",
      "Corporate Finance",
      "Auditing",
      "Taxation",
      "Investment & Portfolio Management",
      "Financial Reporting Standards",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Numbers and detail-focused work",
      "Financial analysis and reporting",
      "Investment and financial strategy",
      "Working towards a professional accounting qualification",
      "Corporate or advisory environments",
    ],
    careers: [
      "Accounting",
      "Financial Analysis",
      "Auditing",
      "Investment & Banking",
      "Corporate Finance",
    ],
    careersNote: "Working as a licensed accountant usually requires a further professional qualification (such as ACCA, CPA or a local equivalent) on top of the degree.",
  },

  "digital-marketing": {
    headline: "Study Digital Marketing Abroad",
    lede: "Study modern marketing across digital platforms, content, advertising, analytics and consumer behaviour.",
    intro:
      "If you're interested in brands, content and how businesses reach customers online, Study Abroad Pro can help you explore digital marketing programmes that fit your goals.",
    about: [
      "Digital Marketing covers how businesses plan, run and measure marketing across online channels — search, social, content and advertising.",
      "Programmes combine marketing fundamentals with hands-on work in analytics platforms, campaign planning and content strategy.",
    ],
    whatYouStudy: [
      "Marketing Principles",
      "Search Engine Optimisation (SEO)",
      "Social Media Marketing",
      "Content Strategy",
      "Digital Advertising",
      "Marketing Analytics",
      "Consumer Behaviour",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Creativity and communication",
      "Brands, content and consumer behaviour",
      "Analytics and campaign performance",
      "Fast-moving digital platforms",
      "Marketing or business-focused careers",
    ],
    careers: [
      "Digital Marketing",
      "Social Media & Content Management",
      "SEO & Search Marketing",
      "Marketing Analytics",
      "Brand Management",
    ],
    careersNote: "Digital marketing platforms and tools change quickly — most programmes emphasise practical, current tools alongside the underlying theory.",
  },

  "project-management": {
    headline: "Study Project Management Abroad",
    lede: "Develop skills in planning, managing and delivering projects across different industries.",
    intro:
      "If you're organised and enjoy coordinating people, timelines and resources, Study Abroad Pro can help you explore project management programmes suited to your background.",
    about: [
      "Project Management focuses on planning, running and delivering projects on time, on budget and to specification, across industries from construction to IT.",
      "Programmes combine project methodologies and tools with practical case studies, and often suit students with some prior work or business background.",
    ],
    whatYouStudy: [
      "Project Planning & Scheduling",
      "Risk Management",
      "Budgeting & Cost Control",
      "Agile & Traditional Methodologies",
      "Stakeholder Management",
      "Quality Management",
      "Project Management Software Tools",
    ],
    levels: ["Postgraduate", "Master's"],
    whoFor: [
      "Organisation and coordination",
      "Managing timelines, budgets and teams",
      "Working across different industries",
      "Structured, methodical thinking",
      "Progressing into leadership roles",
    ],
    careers: [
      "Project Management",
      "Programme & Portfolio Management",
      "Operations Management",
      "Construction & IT Project Coordination",
      "Business Analysis",
    ],
    careersNote: "Professional certifications (such as PMP) are common alongside the academic qualification in this field, and some employers expect them.",
  },

  "supply-chain-logistics": {
    headline: "Study Supply Chain & Logistics Abroad",
    lede: "Explore procurement, logistics, operations, transportation and global supply-chain management.",
    intro:
      "If you're interested in how goods move around the world and how businesses keep operations running efficiently, Study Abroad Pro can help you explore supply chain and logistics programmes that fit your goals.",
    about: [
      "Supply Chain & Logistics covers how goods and services move from source to customer — procurement, warehousing, transportation and distribution.",
      "Programmes combine operations and logistics theory with practical planning tools, often with a strong link to global trade and manufacturing.",
    ],
    whatYouStudy: [
      "Procurement & Sourcing",
      "Logistics & Transportation",
      "Warehouse & Inventory Management",
      "Operations Management",
      "Global Trade & Customs",
      "Supply Chain Analytics",
      "Sustainability in Supply Chains",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Operations and process improvement",
      "Global trade and logistics",
      "Planning and coordination",
      "Manufacturing, retail or e-commerce industries",
      "Analytical, systems-based thinking",
    ],
    careers: [
      "Supply Chain Management",
      "Logistics & Distribution",
      "Procurement",
      "Operations Management",
      "Import/Export & Trade Compliance",
    ],
    careersNote: "Global supply-chain roles increasingly value data and analytics skills alongside operational knowledge.",
  },

  /* ----------------------------------------------------- hospitality */
  "hospitality-tourism": {
    headline: "Study Hospitality & Tourism Abroad",
    lede: "Build skills for careers within the international hospitality, tourism and service industries.",
    intro:
      "If you enjoy working with people and want a career in a genuinely global industry, Study Abroad Pro can help you explore hospitality and tourism programmes suited to your goals.",
    about: [
      "Hospitality & Tourism covers the businesses and services that support travel, accommodation and guest experiences worldwide.",
      "Programmes typically combine business fundamentals with practical training in service standards, often including industry placements.",
    ],
    whatYouStudy: [
      "Hospitality Operations",
      "Tourism Management",
      "Guest Services & Experience",
      "Event Management",
      "Hospitality Marketing",
      "Sustainable Tourism",
      "Industry Placement / Internship",
    ],
    levels: ["Diploma", "Bachelor's", "Master's"],
    whoFor: [
      "Working with people and guests",
      "A global, service-driven industry",
      "Travel, events and experiences",
      "Practical, placement-based learning",
      "Fast-paced, customer-facing environments",
    ],
    careers: [
      "Hotel & Resort Operations",
      "Tourism & Travel Management",
      "Event Management",
      "Guest Relations",
      "Hospitality Marketing",
    ],
    careersNote: "Many programmes include a paid or supervised industry placement, which is often where the first job offer comes from.",
  },

  "hotel-management": {
    headline: "Study Hotel Management Abroad",
    lede: "Explore hotel operations, guest services, hospitality management and related business functions.",
    intro:
      "If you're drawn specifically to how hotels are run, Study Abroad Pro can help you explore hotel management programmes suited to your goals and preferred destination.",
    about: [
      "Hotel Management focuses on the day-to-day operations of hotels and resorts — front office, housekeeping, food and beverage, and guest services.",
      "Programmes typically combine hospitality business theory with hands-on operational training, often through on-campus facilities or industry placements.",
    ],
    whatYouStudy: [
      "Front Office Operations",
      "Housekeeping Management",
      "Food & Beverage Service",
      "Hotel Revenue Management",
      "Guest Relations",
      "Hospitality Finance",
      "Industry Placement / Internship",
    ],
    levels: ["Diploma", "Bachelor's"],
    whoFor: [
      "Running hotel and guest operations",
      "Customer service and guest experience",
      "Hands-on, operational work",
      "A global hospitality career",
      "Structured, service-focused environments",
    ],
    careers: [
      "Hotel Operations Management",
      "Front Office & Guest Services",
      "Food & Beverage Management",
      "Revenue Management",
      "Resort & Property Management",
    ],
    careersNote: "Entry-level roles are common straight after graduation, with progression into management as experience builds.",
  },

  "culinary-arts": {
    headline: "Study Culinary Arts Abroad",
    lede: "Develop professional knowledge and practical skills related to food preparation and the culinary industry.",
    intro:
      "If you want a hands-on, kitchen-based route into the food industry, Study Abroad Pro can help you explore culinary arts programmes that fit your goals.",
    about: [
      "Culinary Arts focuses on the professional preparation of food — technique, kitchen management and, in many programmes, a specific cuisine focus.",
      "Programmes are typically hands-on from the start, taught in working kitchens, and often include an industry placement.",
    ],
    whatYouStudy: [
      "Culinary Techniques & Theory",
      "Food Safety & Hygiene",
      "Pastry & Baking",
      "Kitchen Management",
      "Menu Planning & Costing",
      "International Cuisine",
      "Industry Placement",
    ],
    levels: ["Certificate", "Diploma"],
    whoFor: [
      "Hands-on, kitchen-based work",
      "Creativity with food",
      "Fast-paced, practical environments",
      "A career in restaurants or hotels",
      "Building towards running your own kitchen",
    ],
    careers: [
      "Professional Chef",
      "Pastry & Baking",
      "Kitchen & Restaurant Management",
      "Hotel Food & Beverage",
      "Catering & Events",
    ],
    careersNote: "Career progression in this field is often built through kitchen experience as much as the qualification itself.",
  },

  /* ------------------------------------------------------------ education */
  "early-childhood-education": {
    headline: "Study Early Childhood Education Abroad",
    lede: "Study child development, early learning and educational approaches for working with young children.",
    intro:
      "If you're drawn to working with young children and shaping their early learning, Study Abroad Pro can help you explore early childhood education programmes suited to your goals.",
    about: [
      "Early Childhood Education focuses on how young children learn and develop, and how to design safe, engaging learning environments for them.",
      "Programmes combine child-development theory with practical teaching methods, usually including supervised placement in an early-learning setting.",
    ],
    whatYouStudy: [
      "Child Development",
      "Early Learning Curriculum Design",
      "Play-Based Learning",
      "Child Health & Safety",
      "Family & Community Engagement",
      "Inclusive Education",
      "Supervised Teaching Placement",
    ],
    levels: ["Diploma", "Bachelor's"],
    whoFor: [
      "Working with young children",
      "Early learning and development",
      "Patient, nurturing environments",
      "Structured but creative teaching",
      "Community and family engagement",
    ],
    careers: [
      "Early Childhood Educator",
      "Childcare Centre Management",
      "Preschool Teaching",
      "Family Support Services",
      "Curriculum Development",
    ],
    careersNote: "Working directly with children usually requires a background check and, in some countries, a teaching registration step.",
  },

  psychology: {
    headline: "Study Psychology Abroad",
    lede: "Explore human behaviour, cognition, development and different areas of psychological study.",
    intro:
      "If you're curious about how people think, feel and behave, Study Abroad Pro can help you explore psychology programmes suited to your academic background and goals.",
    about: [
      "Psychology is the scientific study of the mind and behaviour, spanning areas from cognition and development to mental health and social behaviour.",
      "Undergraduate programmes are usually broad, with the chance to specialise (clinical, organisational, educational and more) at postgraduate level.",
    ],
    whatYouStudy: [
      "Introduction to Psychology",
      "Developmental Psychology",
      "Cognitive Psychology",
      "Social Psychology",
      "Abnormal & Clinical Psychology",
      "Research Methods & Statistics",
      "Counselling Skills",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Human behaviour and the mind",
      "Research and evidence-based thinking",
      "Counselling or clinical interests",
      "Organisational or educational psychology",
      "Working with individuals or communities",
    ],
    careers: [
      "Counselling & Mental Health Support",
      "Human Resources",
      "Research",
      "Educational Support",
      "Further clinical training (e.g. Clinical Psychology, Therapy)",
    ],
    careersNote: "Practising as a registered/clinical psychologist requires further specialised study and registration beyond a bachelor's degree, and rules vary by country.",
  },

  "social-work": {
    headline: "Study Social Work Abroad",
    lede: "Develop knowledge and skills related to supporting individuals, families and communities.",
    intro:
      "If you want a career built around supporting people through difficult circumstances, Study Abroad Pro can help you explore social work programmes suited to your goals.",
    about: [
      "Social Work focuses on supporting individuals, families and communities facing social, emotional or economic challenges.",
      "Programmes combine social policy and human-behaviour theory with practical fieldwork placements in community or care settings.",
    ],
    whatYouStudy: [
      "Human Behaviour & Social Environment",
      "Social Policy",
      "Casework & Counselling Skills",
      "Community Development",
      "Child & Family Welfare",
      "Ethics in Social Work",
      "Supervised Fieldwork Placement",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Supporting individuals and communities",
      "Working within social services",
      "Empathy-driven, people-focused careers",
      "Advocacy and community development",
      "Structured fieldwork and casework",
    ],
    careers: [
      "Social Work",
      "Community Services",
      "Child & Family Welfare",
      "Mental Health Support Services",
      "Non-Profit & NGO Work",
    ],
    careersNote: "Practising as a registered social worker requires professional registration in most countries, which usually follows successful completion of an accredited programme and placement hours.",
  },

  /* ------------------------------------------------------- science & agriculture */
  agriculture: {
    headline: "Study Agriculture Abroad",
    lede: "Explore modern agriculture, food production, sustainability and related scientific fields.",
    intro:
      "If you're interested in food systems, land management or sustainable production, Study Abroad Pro can help you explore agriculture programmes suited to your goals.",
    about: [
      "Agriculture covers the science and business of producing food and other products from plants and animals, including how that's done sustainably at scale.",
      "Programmes combine biological and environmental science with practical and, in many cases, farm- or field-based training.",
    ],
    whatYouStudy: [
      "Soil Science",
      "Crop & Livestock Production",
      "Agricultural Economics",
      "Sustainable Farming Practices",
      "Agribusiness Management",
      "Environmental Science",
      "Farm Technology & Machinery",
    ],
    levels: ["Diploma", "Bachelor's", "Master's"],
    whoFor: [
      "Land, food and environmental systems",
      "Outdoor and practical, field-based work",
      "Sustainability and food production",
      "Agribusiness and rural industries",
      "Applied science with real-world outcomes",
    ],
    careers: [
      "Farm & Agribusiness Management",
      "Agricultural Science & Research",
      "Sustainability & Environmental Management",
      "Agricultural Technology",
      "Food Production & Supply",
    ],
    careersNote: "Some destinations link agriculture study to regional or rural work and settlement pathways — your counsellor confirms what applies.",
  },

  biotechnology: {
    headline: "Study Biotechnology Abroad",
    lede: "Study the application of biological sciences and technology across healthcare, agriculture, research and industry.",
    intro:
      "If you're interested in how biology and technology combine to solve real-world problems, Study Abroad Pro can help you explore biotechnology programmes suited to your academic background.",
    about: [
      "Biotechnology applies biological science, chemistry and technology to develop products and processes across healthcare, agriculture, food and industry.",
      "Programmes are typically lab-based and research-oriented, building on a foundation in the biological sciences.",
    ],
    whatYouStudy: [
      "Molecular Biology",
      "Genetics",
      "Microbiology",
      "Bioprocessing",
      "Genetic Engineering",
      "Bioinformatics",
      "Laboratory Research Methods",
    ],
    levels: ["Bachelor's", "Postgraduate", "Master's"],
    whoFor: [
      "Biological and laboratory science",
      "Research-driven, technical work",
      "Healthcare, agriculture or industrial applications",
      "Precision and analytical thinking",
      "Working towards further research (e.g. PhD)",
    ],
    careers: [
      "Biotechnology Research",
      "Pharmaceutical & Healthcare Industry",
      "Agricultural Biotechnology",
      "Quality Control & Regulatory Affairs",
      "Further Research (PhD pathway)",
    ],
    careersNote: "Many biotechnology careers, particularly in research, benefit from postgraduate specialisation beyond a bachelor's degree.",
  },
};
