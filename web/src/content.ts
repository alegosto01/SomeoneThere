/**
 * All landing page copy lives here so wording can be reviewed against the repository docs
 * (docs/mvp-scope.md, docs/remote-viewing-checklist.md, docs/product/landing-page-outline.md)
 * without reading through layout code.
 */

export const nav = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#what-we-check', label: 'What we check' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const hero = {
  headline: 'Visit a Madrid rental remotely before sending a deposit.',
  body: 'A trusted local verifier attends the viewing while you join by live video call. See the real property, compare it with the listing, and receive a short verification summary.',
  trustLine: 'Independent local support. No recording by default. Madrid only.',
};

export const problem = {
  title: 'Deciding on a flat you have never stood in',
  intro:
    'Most people moving to Madrid have to choose a place before they arrive. That is normal, and it usually works out — but it means making a decision on limited information.',
  points: [
    {
      title: 'You are far away',
      body: 'Flying in for a single viewing is expensive, and viewing slots rarely line up with travel plans.',
    },
    {
      title: 'Listings move quickly',
      body: 'Good listings are often taken within days, so there is little time to arrange a visit yourself.',
    },
    {
      title: 'Photos leave gaps',
      body: 'Photos can be old, partial, or flattering. They rarely show noise, light at the wrong hour, or the state of the building entrance.',
    },
    {
      title: 'Deposits come first',
      body: 'You are often asked to transfer a deposit to hold the flat, before anyone you trust has seen it.',
    },
    {
      title: 'No one on the ground',
      body: 'Not everyone has a friend in Madrid who is free at the right time and comfortable asking direct questions.',
    },
  ],
};

export const howItWorks = [
  {
    title: 'Send the listing',
    body: 'You share the listing, the viewing details, and the things you most want to know about the flat.',
  },
  {
    title: 'Join the visit remotely',
    body: 'A verifier attends the viewing with permission and shows you the property through a live video call on WhatsApp, Google Meet, or Zoom.',
  },
  {
    title: 'Receive the summary',
    body: 'After the visit you get structured observations, differences from the listing, and the questions that stayed unresolved.',
  },
];

export const checklist = [
  'Layout and room size',
  'Natural light and views',
  'Noise and smells',
  'Visible humidity, stains, or damage',
  'Water pressure and drainage',
  'Furniture and appliances',
  'Heating or air conditioning where visible',
  'Building entrance and common areas',
  'Differences from the online listing',
  'Answers provided by the landlord or agent',
  'Questions that remain unresolved',
];

export const checklistNote =
  'The verifier reports what was visible during the viewing. This is not a professional property inspection, and no part of the building is opened, tested, or measured beyond what a normal visitor can see.';

export const independentPerspective = {
  title: 'Why not just ask the landlord?',
  body: 'A landlord or agent can show the property, but they control the visit. A SomeoneThere verifier attends on your behalf, follows your questions, and helps compare what is shown with the listing.',
  note: 'Most landlords and agents in Madrid are straightforward to deal with. The point is not suspicion — it is having someone in the room whose only job is to look at the flat for you.',
};

export const safetyBoundaries = [
  'Enters only with permission',
  'Does not secretly record',
  'Does not record by default',
  'Avoids filming people and private documents',
  'Does not negotiate rent',
  'Does not sign documents',
  'Does not exchange money',
  'Does not collect keys',
  'Does not provide legal advice',
  'Does not guarantee that a property or rental is safe',
  'Does not tell you whether you should rent the property',
];

export const safetyNote =
  'A visit reflects only what was visible and communicated at the time. Conditions, availability, and the people involved can change afterwards.';

export const pilot = {
  title: 'Looking for a rental in Madrid?',
  body: 'SomeoneThere is currently preparing a limited number of pilot remote visits in Madrid. Share the listing and viewing details to see whether we can help.',
  note: 'Pricing, availability, and scheduling are still being worked out during the pilot. We will tell you honestly if we cannot help with your listing.',
};

export const faq = [
  {
    question: 'Does SomeoneThere guarantee that a rental is legitimate?',
    answer:
      'No. SomeoneThere reports observations from a property visit and notes what could not be checked. It does not verify ownership, confirm that a landlord or agent is who they say they are, or guarantee that a rental is safe, legal, or free of fraud.',
  },
  {
    question: 'Does the landlord or agent need to approve the visit?',
    answer:
      'Yes. The verifier attends a viewing that you or we have arranged, and enters only with permission. The verifier also asks before filming or showing interior areas on the call, and stops if anyone asks.',
  },
  {
    question: 'Is the video call recorded?',
    answer:
      'Not by default. The visit is a live call so you can see the flat and ask questions as it happens. If a recording or photos would help you, it has to be agreed with the people present first.',
  },
  {
    question: 'What happens if the landlord or agent does not appear?',
    answer:
      'Viewings do fall through. If nobody shows up or access is refused, the verifier reports that and does not attempt to enter. How that is handled during the pilot is agreed with you in advance.',
  },
  {
    question: 'Can the verifier negotiate with the landlord?',
    answer:
      'No. The verifier asks factual questions on your behalf — what is included, who signs, what is requested upfront, when the flat is free — but does not negotiate rent or terms, sign anything, or hand over money.',
  },
  {
    question: 'Does SomeoneThere review the rental contract?',
    answer:
      'No. SomeoneThere does not review contracts and does not give legal advice. For contract or legal questions, speak to a qualified lawyer.',
  },
  {
    question: 'Which areas are covered?',
    answer:
      'Madrid only. SomeoneThere is starting in one city so visits stay practical and the verifier knows the area.',
  },
  {
    question: 'What happens after the visit?',
    answer:
      'You receive a short written summary: what was observed, how the property compared with the listing, what the landlord or agent said, what could not be checked, and which questions remain open. The decision about whether to rent stays entirely with you.',
  },
];

export const footer = {
  tagline: 'Madrid-first remote rental viewing service.',
  disclaimer:
    'SomeoneThere provides observational information from a property visit. It is not a real estate agency, legal service, certified inspection, or guarantee against fraud.',
};
