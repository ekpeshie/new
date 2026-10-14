// Case study content. Rendered into the drawer by main.js.
const IMG = (id) => "https://framerusercontent.com/images/" + id + ".png";

const PROJECTS = [
  {
    id: "fino", name: "Fino", tagline: "Tax, without the dread", year: "2025",
    role: "Product Designer", scope: "Research, IA, interaction, visual system", platform: "Mobile",
    hero: IMG("TaWfBrXKWakQZEtTZp015q8nRqY"),
    summary: "Germany has over four million freelancers, and most run their tax admin across Word, Excel and a folder of receipts handed to an advisor once a year. I led Fino’s design end to end: a mobile product that absorbs the rules of the German tax system and surfaces only the decision in front of you.",
    context: [
      "Invoices must meet strict legal requirements. VAT (Umsatzsteuer) is declared quarterly through ELSTER. Expenses have to be categorised the way the Finanzamt expects, and the Kleinunternehmerregelung splits freelancers into two tiers with different obligations.",
      "The market leaves a gap. DATEV is built for accountants; Lexoffice and Fastbill stop at invoicing. Nothing handled the full freelance stack on mobile."
    ],
    challenge: "Carry the full weight of German freelance tax in the background — and only ever show the freelancer what they need right now.",
    researchIntro: "Before opening Figma I interviewed eight freelancers across disciplines, audited the market, mapped year-end task flows and worked through the ELSTER filing process myself.",
    research: [
      { m: "Interviews · 8 freelancers", f: "Fear of invoicing incorrectly was universal. “Just tell me it’s right” came up in five of eight sessions.", d: "Legal guardrails inside invoice creation: auto-formatting, required-field warnings, VAT logic driven by registration status." },
      { m: "Competitive audit", f: "No product covered invoices, expenses, tax and filing together on mobile.", d: "Full-stack scope in one app, including direct ELSTER integration." },
      { m: "Task-flow analysis", f: "Freelancers reconciled income and expenses by hand at year end because nothing offered a live view.", d: "A real-time tax view with quarterly estimates that update as income and expenses are logged." },
      { m: "ELSTER research", f: "Certificate files and passwords pushed most people to delegate even routine filings.", d: "In-app certificate upload and validation, reducing reliance on an advisor for routine filings." }
    ],
    insight: "Freelancers didn’t want flexibility. They wanted guardrails.",
    northstar: "Confidence through structure",
    principles: [
      { t: "Legal correctness is a feature.", d: "Every invoice field exists because the law requires it. The product explains that rather than hiding it." },
      { t: "One screen, one tax job.", d: "Income tax, VAT, deductions and filing each get a focused view. No dashboards that mix contexts." },
      { t: "Default to the number that matters now.", d: "Quarterly estimates over annual totals; week-on-week trends over lifetime figures." },
      { t: "Make the intimidating feel familiar.", d: "Certificate uploads, Vorauszahlung deadlines and Kleinunternehmer toggles behave like ordinary product interactions, not government forms." },
      { t: "Empty states that teach.", d: "Every empty screen explains what the feature does and offers one direct action." }
    ],
    sections: [
      { title: "Invoices", body: ["A four-step flow — client, invoice details, services, payment — with a persistent tab strip so progress is never ambiguous. The empty state gets out of the way: one line of copy, one action, no tour."],
        decisions: [
          { d: "Germany pre-selected on phone input", w: "Optimises for the primary user without locking out international clients." },
          { d: "Euro as the default currency", w: "The right default for the audience, with a dropdown for international work." },
          { d: "“Save as draft” always visible", w: "Invoices get built across sessions. Drafts remove the fear of losing work." },
          { d: "Line items with a live total", w: "Mirrors how German invoices are legally structured." }
        ],
        images: [IMG("aYsunRTIgs7Yp16zkI65abvP2X8")] },
      { title: "Expenses", body: [
          "A weekly chart for pattern recognition sits above a chronological ledger. Entry opens straight onto the amount field with the keyboard up; the title is optional and suggested.",
          "Bank sync replaces manual entry for most users. German banks come first, then PayPal and Wise, and a bottom sheet states the security model before anything connects. Categories map directly to the structure the Finanzamt recognises, so exports arrive advisor-ready."
        ], decisions: [],
        images: [IMG("IJcOcBs8uciwFtE9Rt2DJ1bbhk"), IMG("DTUmR3V8ku3jbkDbyVERuyUiLA"), IMG("aZGBvYfUdsgam2HNgAvxBt5s")] },
      { title: "Taxes & ELSTER", body: [
          "This is where Fino differentiates. A quarterly overview breaks down income tax, VAT and deductions, each one tap from detail. Income tax shows progress against the Freibetrag and a projected year-end position; VAT nets what was collected against what was paid, automatically.",
          "ELSTER was the hardest flow in the product. Certificate upload, password and validation had to feel routine despite sitting on top of a government security system. Every state is unmistakable, and success leads straight to the tax forms."
        ], decisions: [],
        images: [IMG("9HB8pt2MqDVwrij6WVmpDGz1Fs"), IMG("4O1u8EFcIp5ueSImUAlbumWnng")] }
    ],
    reflection: [
      "The most consequential work happened outside Figma. Days spent in German tax law, Finanzamt guidance and forum threads reshaped the information architecture — and killed a combined income/expense dashboard once it was clear VAT-registered and Kleinunternehmer freelancers hold fundamentally different mental models of their money.",
      "In high-stakes financial products, removing options is worth more than adding them. Every field cut from the invoice form reduced error and increased completion. The product got simpler as my understanding deepened."
    ]
  },
  {
    id: "platehack", name: "Platehack", tagline: "Healthy eating, fewer decisions", year: "2024",
    role: "Product Designer", scope: "IA, visual direction, design system", platform: "Web & mobile",
    hero: IMG("bFQiD0Yc0xcUq8sqtexlfqddNtI"),
    summary: "Platehack (formerly LazyFit) matches people to doctor-backed meal plans and delivers chef-prepared meals to their door. V1 worked, but felt like a generic SaaS dashboard. I led a ground-up V2: a new visual direction, restructured information architecture and a rebuilt component system across desktop and mobile.",
    context: [
      "Healthy eating has a conversion problem: the gap between intention and action is wide. Delivery services optimise for convenience; nutrition apps bury people in manual input. Platehack sat between the two — and V1 looked like it.",
      "Subscriber feedback converged on three problems: first login felt overwhelming, logging a meal took too many steps, and accurate nutrition data read as clinical rather than motivating."
    ],
    challenge: "Make a data-heavy health product feel personal, not clinical — and get people from “I want this” to “logged” with fewer decisions.",
    researchIntro: "A competitive audit of six products, a review of subscriber feedback, usability walkthroughs with existing subscribers and a full content audit.",
    research: [
      { m: "Competitive audit · 6 products", f: "Noom, Lifesum and HelloFresh hide complexity behind a sense of progress and celebrate small wins.", d: "Motivation first: progress indicators, macro donuts and calorie charts communicate wins before numbers." },
      { m: "Subscriber feedback", f: "Meal swap was the most-used feature — and the most confusing.", d: "Swap rebuilt as a dedicated page with filters and a confirmation step." },
      { m: "Usability walkthroughs", f: "A daily view alone didn’t give enough context; people wanted their whole week.", d: "Daily, weekly and monthly views, plus a full calendar for planning." },
      { m: "Content audit", f: "Macros were buried two taps deep, right where people make dietary decisions.", d: "Macros on every meal card; full nutrition facts one tap from detail." }
    ],
    insight: "Users didn’t want more features. They wanted fewer decisions.",
    northstar: "The product does the thinking; the user confirms",
    principles: [
      { t: "Fewer decisions, not more features.", d: "The AI recommends, the user confirms. Every screen should remove choices, not add them." },
      { t: "Progress at a glance.", d: "Macros, calories and weekly coverage readable in under five seconds, without a tap." },
      { t: "One screen, one job.", d: "Browse, detail, nutrition, swap and subscription each get a focused view." },
      { t: "Delight where it counts.", d: "Personality lives in confirmation, empty and success states. Everything else stays calm." },
      { t: "Context shapes hierarchy.", d: "Mobile users decide what to eat now; desktop users plan the week. The hierarchy shifts accordingly." }
    ],
    sections: [
      { title: "Meals browser", body: ["A date-stamped view of today’s plan with persistent Daily, Weekly and Monthly toggles. Each card carries a full-bleed photo, macros and dietary tags, with Log and Swap always visible. On mobile the week collapses into an accordion, and empty days show a quiet empty state instead of a blank row."],
        decisions: [
          { d: "Macros on every card", w: "Removes a detail-view round trip at the moment of decision." },
          { d: "Log and Swap always visible", w: "The two most common actions never require hunting." },
          { d: "Dietary tags as coloured pills", w: "Meal type and diet scan instantly across a whole plan." },
          { d: "Date stamp as the header", w: "Grounds returning users in “today” immediately." }
        ],
        images: [IMG("xBxBlAyeP6C8Ym0ptYfNngUaFQ")] },
      { title: "Meal detail & nutrition", body: ["Detail pairs large food photography with macros, tags and the same two actions. Full nutrition opens in the standard FDA/EU label format — a deliberate choice over a custom visualisation, because people can read a familiar label instantly."], decisions: [],
        images: [IMG("uDfeWnn039tDB9jBRUj9N1MjECk"), IMG("xjKkSeO9elCVAOEO5mTebmwE")] },
      { title: "Swap meals", body: ["V1’s most complained-about feature became its own page — Find Your Perfect Swap — filterable by meal type, cuisine and diet. A two-step confirmation prevents accidental swaps without slowing intentional ones."], decisions: [],
        images: [IMG("b2RtMbPJHaMDq1mVgM1Ip8A8Bk"), IMG("RNlOtBEMUAFEi88Na7YHIDZ9EA")] }
    ],
    reflection: [
      "The biggest shift from V1 to V2 was structural, not visual. V1 tried to surface everything; V2 asked what the user needs to do right now, and made that the only obvious option.",
      "The meal calendar nearly got cut as “too complex for an MVP”. It became one of the most appreciated additions in testing — planning ahead feels different from reacting day to day.",
      "And a dedicated page is often the right answer to a broken modal. When a feature is used often enough to matter, it deserves a full screen."
    ]
  },
  {
    id: "mypiitch", name: "MyPiitch", tagline: "Less friction between data and decision", year: "2022",
    role: "UX/UI Designer", scope: "Discovery, IA, interaction, UI", platform: "Web",
    hero: IMG("JIrTRs5PIj1iTUEOTWXiYhddo"),
    summary: "Job boards are too light; enterprise ATSs like Greenhouse and Lever take months to configure. Growing teams sit in the gap. I designed MyPiitch, a recruiter platform that gives small hiring teams one fast, structured surface to post roles, run their pipeline and talk to candidates.",
    context: [
      "Hiring is broken on both sides. Recruiters drown in applications that don’t fit; candidates spend hours tailoring pitches for systems that bury them. MyPiitch tackles the recruiter’s side first."
    ],
    challenge: "Powerful enough to manage hundreds of applications across many roles — simple enough for a two-person team to run without onboarding.",
    researchIntro: "Discovery sessions with four recruiters and two hiring managers at early-stage companies, plus a shadowing session during a live hiring sprint.",
    research: [
      { m: "Recruiter interviews", f: "Every recruiter kept a personal shortlist outside the ATS. The tool was for logging, not thinking.", d: "The jobs table and pipeline became the primary working surface, not a record system." },
      { m: "Hiring manager interviews", f: "Managers wanted visibility without being pulled into every decision.", d: "A stage-based pipeline with status — Active, Expired, Draft, Paused — readable at the job level." },
      { m: "Shadowing session", f: "LinkedIn, an ATS, Gmail and a Google Sheet open at once. Context switching was the single biggest time drain.", d: "Dashboard, messaging, pipeline and jobs unified under one navigation." }
    ],
    insight: "Recruiters don’t need more data. They need less friction between data and decision.",
    northstar: "Make the private spreadsheet redundant",
    principles: [
      { t: "The table is the product.", d: "Recruiters live in lists. The jobs table and pipeline are the primary surfaces; everything else supports them." },
      { t: "Status at a glance.", d: "Every job, candidate and thread communicates its state without being opened." },
      { t: "Actions in context.", d: "Message, move a stage or boost a post from whatever view you’re already in." },
      { t: "Two audiences, one flow.", d: "Job creation produces a structured record for the recruiter and a polished listing for candidates." },
      { t: "Personality without noise.", d: "A single hot-pink accent, reserved for primary actions, active states and key badges." }
    ],
    sections: [
      { title: "Dashboard", body: ["Answers the two questions a recruiter asks every morning: how are my roles performing, and what needs attention today? Headline views and applicants sit up top, with a pitch alert, expiring roles and recent messages below."],
        decisions: [
          { d: "Two headline numbers", w: "The metrics recruiters check first, without a trip to the jobs page." },
          { d: "A distinct pitch card", w: "Reinforces the product’s core concept on every login." },
          { d: "Expiring soon", w: "Stops strong candidates going cold because a post quietly closed." },
          { d: "Setup checklist", w: "Guides new users without gating experienced ones." }
        ],
        images: [IMG("26qqFfCAssrFdO0IQzAktuzBo8U")] },
      { title: "Jobs", body: [
          "Managing and posting roles feel like one product. The table handles hundreds of entries across five tabs, with colour-coded status and an inline Boost action that keeps advertising decisions in context.",
          "Creating a job is four focused steps in a persistent sidebar. Responsibilities and requirements use an additive list rather than a text field — matching how hiring managers actually think — and the flow ends on a full public preview before anything goes live."
        ], decisions: [],
        images: [IMG("EL5MCN29VTeJPdpWeXkQWkXv7o"), IMG("bbXHZZTa0iXykbqIK3PxtUEHee8"), IMG("npcNOR5qtOB4xl5BtfCl0MqIM")] },
      { title: "Pipeline & candidate profiles", body: ["Candidates move through No Stage, Screen, Interview, Hired and Recycled, with colour-coded role tags that show which openings are heavy at which stage. Opening a candidate flips board to profile without losing context; a dedicated Pitch tab lets candidates present themselves beyond the resume, and messaging and stage controls stay pinned at the top."], decisions: [],
        images: [IMG("muOV5yZTnItBuahmBSilR0OGKU"), IMG("WgEk95HoUw3lHdljCvgh1I0Mgo")] }
    ],
    reflection: [
      "One hour of shadowing was worth more than every interview. The unofficial workaround is always the real brief — the Google Sheet existed because the ATS couldn’t support how she thought. MyPiitch was designed to make it redundant.",
      "B2B tools can carry personality and density at once. The pink accent and playful “pitches” framing made a data-heavy product something recruiters wanted to open, not just had to."
    ]
  }
].map((p, i) => ({
  ...p,
  n: String(i + 1).padStart(2, "0"),
  principles: p.principles.map((x, j) => ({ ...x, n: String(j + 1).padStart(2, "0") })),
  sections: p.sections.map(s => ({ ...s, hasDecisions: s.decisions.length > 0 }))
}));
