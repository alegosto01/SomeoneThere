# HouseCheck Detailed DAFO Analysis

**Version:** v0.2  
**Date:** 2026-07-12  
**Project:** HouseCheck  
**Scope:** Madrid-first remote apartment viewing service  

---

## 1. Purpose of this document

This document presents a detailed DAFO analysis for HouseCheck.

DAFO is the Spanish version of SWOT:

- **Debilidades** = Weaknesses
- **Amenazas** = Threats
- **Fortalezas** = Strengths
- **Oportunidades** = Opportunities

The purpose of this DAFO is not only to describe the project, but to help decide what HouseCheck should test next.

For HouseCheck, the DAFO should answer four practical questions:

1. **Why could this product work?**
2. **Why could this product fail?**
3. **Which market opportunities are worth testing first?**
4. **What actions should be taken before building software or scaling?**

This document should be treated as a living strategy document. It should be updated after surveys, interviews, dry runs, and pilot visits.

---

## 2. Product definition

HouseCheck is a Madrid-first remote apartment viewing service.

The core product is simple:

> A trusted local verifier attends a rental property viewing in Madrid on behalf of a remote client, starts a live video call, shows the apartment, and helps the client compare the real property with the online listing.

The main use case is a person who finds a room or apartment online but cannot visit it in person before deciding whether to continue, pay a deposit, or travel to Madrid.

HouseCheck is especially relevant for:

- Erasmus students
- international students
- young professionals
- expats
- remote workers
- parents helping their child move abroad
- people moving to Madrid from another city or country

HouseCheck should be positioned as:

> “Your trusted local eyes in Madrid before you pay a deposit.”

HouseCheck is **not**:

- a real estate agency
- a legal advisor
- a contract review service
- a property inspection certification company
- a guarantee against scams
- an escrow or deposit-holding service
- a platform that promises every rental is safe

The service reduces uncertainty, but it cannot remove all risk.

---

## 3. Research status

| Source | Status | Notes |
|---|---|---|
| Competitor research | Completed v1 | Existing adjacent models include remote property tours, verified listings, local task marketplaces, and relocation services |
| Google Form survey | In progress / To launch | Should measure fear, perceived usefulness, willingness to pay, and contact interest |
| User interviews | Not started / In progress | Target: 10–20 interviews with students, expats, parents, and recent movers |
| Dry runs | Not started | Target: 3 test visits before paid pilots |
| Paid pilots | Not started | Target: 3–5 first pilot visits |
| Legal/privacy review | Not started | Needed before scaling, storing visit reports, recording video, or taking payments at scale |

---

## 4. DAFO summary table

| Fortalezas / Strengths | Debilidades / Weaknesses |
|---|---|
| F1. Simple value proposition | D1. Operational complexity |
| F2. Strong emotional pain | D2. Verifier trust must be earned |
| F3. Manual MVP is possible | D3. Verifier safety risk |
| F4. Madrid-first focus | D4. Privacy and consent issues |
| F5. Bring-your-own-listing model | D5. Low scalability at the start |
| F6. More neutral than landlord-provided video call | D6. Dependence on landlord/agent cooperation |
| F7. Clear initial target users | D7. Video quality may vary |
| F8. Can create strong post-visit evidence | D8. Service quality depends on the verifier |

| Oportunidades / Opportunities | Amenazas / Threats |
|---|---|
| O1. International students and Erasmus | A1. Users may ask friends for free |
| O2. Expats and remote workers | A2. Landlords or agents may refuse video calls |
| O3. Parents may pay for peace of mind | A3. Low willingness to pay |
| O4. Rental scam fear is emotionally powerful | A4. Existing platforms or agencies could copy the idea |
| O5. Gap between DIY and relocation agency | A5. Legal, privacy, and liability issues |
| O6. Future expansion to other cities | A6. Trust barrier for a new brand |
| O7. Partnerships with student and relocation communities | A7. Operational failures can damage reputation |
| O8. Potential to become a trusted rental decision layer | A8. Seasonality and demand concentration |

---

# 5. Fortalezas / Strengths

Strengths are internal advantages of HouseCheck. These are things the project can use to compete, validate faster, or create value for users.

---

## F1. Simple value proposition

### Description

HouseCheck is easy to understand because the service can be explained in one sentence:

> “Someone in Madrid visits the apartment for you while you join by video call.”

The user does not need to understand a complicated technology, legal process, or marketplace. The service solves a clear problem: the user cannot be physically present, so HouseCheck provides trusted local presence.

### Why it matters

A simple value proposition is very important for an early-stage product. If people understand the service quickly, it is easier to:

- explain it in a survey
- explain it in a landing page
- share it in WhatsApp groups
- pitch it to students and expats
- test willingness to pay
- avoid confusion about what the product does

For HouseCheck, this is a major strength because the product is concrete. The user immediately understands what they are paying for: someone physically goes to the property.

### Example user interpretation

A potential user might think:

> “I cannot be in Madrid, but someone can go there for me and show me the place live.”

That is much easier to understand than:

> “We analyze scam signals using a digital rental verification process.”

### Evidence available now

At this stage, this strength is mainly based on the clarity of the product concept and comparison with more complex alternatives.

### Evidence still needed

HouseCheck should validate this strength by asking users:

- Can you explain the idea back to me in one sentence?
- Is it immediately clear what the service does?
- What part of the idea is confusing?
- Would you know when to use this service?

### Risks connected to this strength

The idea is simple, but it can become confusing if HouseCheck tries to add too many services too early, such as:

- digital scam reports
- contract reviews
- landlord verification
- payments
- legal advice
- relocation support

Adding these too early could make the product harder to explain.

### Action for HouseCheck

Keep the MVP message simple:

> “Visit a Madrid rental remotely before sending a deposit.”

Avoid adding too many features before proving that people want the core remote viewing service.

### Confidence

**Medium-high.** The value proposition appears strong, but it must be tested with real target users.

---

## F2. Strong emotional pain

### Description

Remote renting is emotionally stressful. People may be asked to pay a deposit or make a decision before seeing the property in person. This creates fear of scams, misleading photos, bad rooms, hidden problems, or losing money.

The pain is not only financial. It is also emotional:

- fear of being scammed
- fear of arriving in Madrid with no real place to stay
- fear of disappointing parents or family
- fear of losing several hundred euros
- pressure to decide quickly
- stress from moving to a new country or city

### Why it matters

Products are easier to sell when they solve urgent and emotional problems. Housing is one of the most stressful parts of relocation. A user may not pay for a “nice-to-have” service, but they may pay to avoid a high-stress mistake.

If the perceived risk is high, users may see HouseCheck as insurance-like reassurance, even if HouseCheck is not legally an insurance product.

### Example user interpretation

A student moving to Madrid might think:

> “Paying €50 to avoid losing €700 seems reasonable if I am about to send a deposit.”

A parent might think:

> “I would rather pay someone to check the apartment than have my child arrive in a bad or fake place.”

### Evidence available now

The emotional pain is logically strong because rental deposits and relocation decisions involve meaningful money and personal safety.

### Evidence still needed

HouseCheck should validate this with survey and interviews:

- How worried are people about paying before seeing a property?
- Have they heard about rental scams?
- Have they or their friends had suspicious experiences?
- How much money do they think they could lose?
- Would this fear make them pay for a verification visit?

### Risks connected to this strength

The communication must not feel manipulative. If HouseCheck exaggerates the scam risk too much, users may feel the company is trying to scare them.

The tone should be:

- clear
- realistic
- calm
- protective
- not alarmist

### Action for HouseCheck

Use neutral risk framing in the survey and landing page.

Good wording:

> “How worried would you be about paying a deposit without seeing the property in person?”

Avoid exaggerated wording:

> “Would you be terrified of being scammed and losing everything?”

### Confidence

**Medium.** The pain is plausible and strong, but willingness to pay must be validated.

---

## F3. Manual MVP is possible

### Description

HouseCheck can be tested manually without building a full app.

The first version can use:

- Google Forms for requests
- WhatsApp for communication
- Google Meet or WhatsApp video for calls
- Google Calendar for scheduling
- Google Sheets for tracking
- manual payment links later
- a simple checklist document
- a trusted local verifier

This makes the first test cheap and fast.

### Why it matters

Many founders make the mistake of building software before proving demand. HouseCheck does not need software to test the core assumption.

The most important assumption is not technical. It is behavioral:

> Will people pay for someone to visit a rental property for them by video call?

That can be tested manually.

### Example MVP workflow

1. User submits a listing and contact details.
2. HouseCheck confirms the viewing time.
3. Verifier attends the viewing.
4. Verifier starts a live video call.
5. Client asks questions during the visit.
6. Verifier follows a checklist.
7. Client receives a short summary.

No app is required for this first version.

### Evidence available now

The workflow is simple enough to run manually.

### Evidence still needed

Dry runs should test:

- how long coordination takes
- whether landlords accept third-party visits
- whether the video call is useful
- whether the checklist works
- whether the client feels more confident afterward
- whether the visit can be completed safely

### Risks connected to this strength

Manual MVPs can become chaotic if there is no structure. HouseCheck still needs basic operational documents:

- remote viewing checklist
- verifier safety SOP
- consent/privacy rules
- visit summary template
- client request form

### Action for HouseCheck

Do not build the app yet. First create the operational documents and run 3 dry runs.

### Confidence

**High.** The service can clearly be tested manually.

---

## F4. Madrid-first focus

### Description

HouseCheck is focused on Madrid first, instead of trying to launch in multiple cities.

This is a strength because the service is operationally local. A local focus makes it easier to understand neighborhoods, logistics, demand, and local rental behavior.

### Why it matters

A city-specific service can feel more trustworthy than a generic global platform.

A Madrid-first focus helps with:

- local SEO later
- local community distribution
- student groups
- expat groups
- verifier recruitment
- operational control
- neighborhood knowledge
- faster learning

### Example positioning

Instead of saying:

> “We verify apartments anywhere.”

HouseCheck can say:

> “We help people moving to Madrid visit apartments remotely before paying a deposit.”

This is more specific and credible.

### Evidence available now

The product is currently designed around Madrid and the founder is focused on this city.

### Evidence still needed

HouseCheck should test whether Madrid has enough demand from:

- Erasmus students
- international students
- expats
- young professionals
- parents
- remote workers

### Risks connected to this strength

The Madrid focus becomes a weakness if the market is too small or if people in Madrid already have enough alternatives.

### Action for HouseCheck

Keep all early messaging Madrid-specific. Do not talk about Barcelona, Lisbon, Milan, or other cities until Madrid is validated.

### Confidence

**High.** A local focus is strategically appropriate for the MVP.

---

## F5. Bring-your-own-listing model

### Description

HouseCheck lets users submit a listing they found anywhere, such as Idealista, Facebook, WhatsApp groups, agency websites, or other platforms.

This is different from platforms that only verify or manage their own listings.

### Why it matters

Many people already search on popular platforms. They may not want to switch to a new housing marketplace. HouseCheck can fit into their existing behavior.

Instead of asking users to search only inside HouseCheck, the service supports the user’s current process:

> “Found a listing? Send it to us and we help you check it remotely.”

This can make adoption easier.

### Example use case

A student finds a room on Idealista but is still in Italy. The landlord wants a deposit soon. The student sends the listing to HouseCheck and asks for a remote visit before deciding.

### Evidence available now

Competitor comparison suggests that many verified housing platforms focus on their own inventory, while local task platforms are generic and unstructured.

### Evidence still needed

HouseCheck should ask users:

- Where do you usually search for rooms or apartments?
- Would you prefer using a verified platform only, or checking a listing you found yourself?
- Would you pay to check a listing from Idealista or Facebook?

### Risks connected to this strength

Bring-your-own-listing can create operational complexity because every listing is different. Some listings may be fake, unavailable, or impossible to visit.

### Action for HouseCheck

Create a clear request form asking for:

- listing URL
- contact person
- viewing time
- address/neighborhood
- deposit amount
- main claims to check
- client concerns

### Confidence

**Medium.** The model is attractive, but operational feasibility must be validated.

---

## F6. More neutral than landlord-provided video call

### Description

A landlord or agent can provide a video call, but they control what is shown. HouseCheck offers a more independent perspective because the verifier attends on behalf of the client.

The verifier is not there to sell the apartment. The verifier is there to show the property and help the client compare it with the listing.

### Why it matters

Neutrality can be one of HouseCheck’s strongest trust advantages.

A landlord video call may still be useful, but the client may wonder:

- Are they hiding something?
- Are they showing only the best angles?
- Is this really the same property?
- Are they avoiding certain rooms or details?

A verifier physically present for the client can reduce some of this uncertainty.

### Example user interpretation

A user might think:

> “I trust the video call more if someone independent is there for me, not just the person trying to rent the room.”

### Evidence available now

This is a logical trust advantage, but it needs validation.

### Evidence still needed

Survey/interview questions:

- Would you trust a video call from the landlord?
- Would you trust a video call from a neutral local verifier more?
- What would make the verifier feel trustworthy?

### Risks connected to this strength

HouseCheck must avoid overclaiming neutrality. The verifier is not a certified inspector or legal authority. The correct wording is “independent local verifier,” not “officially certified inspector” unless certification exists.

### Action for HouseCheck

Use positioning like:

> “A local verifier attends on your behalf and shows you the property live.”

Avoid saying:

> “We certify that the apartment is safe.”

### Confidence

**Medium.** Strong conceptually, but user trust must be tested.

---

## F7. Clear initial target users

### Description

HouseCheck has identifiable early target users:

- Erasmus students
- international students
- young professionals
- expats
- remote workers
- parents helping children move

These people are likely to experience the problem because they may need to choose housing before arriving in Madrid.

### Why it matters

A clear target audience makes market validation easier. HouseCheck can distribute surveys and run interviews in specific communities instead of speaking to everyone.

### Example acquisition channels

Potential channels include:

- Erasmus WhatsApp groups
- university international offices
- Facebook groups for Madrid housing
- expat communities
- Reddit communities
- LinkedIn posts targeting relocation
- student associations
- Italian/European students moving to Madrid

### Evidence available now

The target groups are logical based on the problem.

### Evidence still needed

The survey should identify which segment has:

- highest fear
- highest usefulness rating
- highest willingness to pay
- highest contact interest

### Risks connected to this strength

Different segments may have different budgets. Students may need the service but pay less. Parents and professionals may pay more but be harder to reach.

### Action for HouseCheck

Segment all survey answers by profile. Do not analyze all responses as one group only.

### Confidence

**Medium.** The segments are clear, but the best first segment is not validated yet.

---

## F8. Can create strong post-visit evidence

### Description

After a remote visit, HouseCheck can provide the client with a structured summary of what was seen.

This may include:

- visit date and time
- property address or neighborhood confirmation
- rooms seen
- photos or screenshots if legally allowed
- differences from listing
- obvious red flags
- questions asked
- answers from landlord/agent
- final neutral summary

### Why it matters

A structured post-visit summary makes the service feel more professional and valuable. It also differentiates HouseCheck from simply asking a random friend.

### Example value

A friend might say:

> “Looks okay.”

HouseCheck can say:

> “The room matches the listing photos, but the kitchen is smaller than expected, the bathroom is shared with three people, and the landlord did not clearly answer whether bills are included.”

### Evidence available now

The service model naturally supports a report or summary.

### Evidence still needed

Pilots should test whether users value a written summary or only the live video call.

### Risks connected to this strength

Reports can create liability if they sound like legal guarantees or official inspections.

### Action for HouseCheck

Create a neutral summary template with disclaimers. Use words like “observed,” “appeared,” and “reported by the landlord/agent.” Avoid definitive legal conclusions.

### Confidence

**Medium.** Likely valuable, but format and liability must be refined.

---

# 6. Debilidades / Weaknesses

Weaknesses are internal limitations or risks that HouseCheck must control. They do not mean the idea is bad, but they must be managed before launch.

---

## D1. Operational complexity

### Description

HouseCheck is not only a website or form. It is a physical service. A person must travel to the property, arrive on time, meet the person showing the apartment, start a video call, follow a checklist, communicate with the client, and complete the visit safely.

### Why it matters

Operational services are harder than purely digital products. A single failed visit can damage trust.

Possible operational problems include:

- verifier arrives late
- landlord cancels
- wrong address
- no internet connection
- client is unavailable for the call
- viewing is too crowded
- landlord refuses video
- visit is shorter than expected
- verifier misses important details

### Example failure scenario

A client pays for a visit, but the verifier arrives late and the landlord leaves. The client loses trust and may ask for a refund.

### Evidence available now

This weakness is expected from the service model.

### Evidence still needed

Dry runs should measure:

- travel time
- waiting time
- call quality
- checklist completion time
- landlord/agent cooperation
- client satisfaction

### Mitigation actions

HouseCheck should create:

- pre-visit confirmation process
- backup contact
- checklist
- cancellation policy
- minimum notice period
- visit status tracking
- standard messages for landlords and clients

### Priority

**Very high.** This must be handled before paid pilots.

### Confidence

**High.** Operational complexity is definitely present.

---

## D2. Verifier trust must be earned

### Description

Users must trust the person who visits the apartment for them. This is challenging because the service is designed for people who are already afraid of scams.

A user may ask:

- Who is this verifier?
- Can I trust them?
- Are they really in Madrid?
- Are they independent?
- Are they connected to the landlord?
- What if they lie?
- What if they do a poor job?

### Why it matters

Trust is central to the product. If users do not trust the verifier, they will not pay.

This is especially important because HouseCheck asks users to rely on someone they do not know for a housing decision.

### Example trust problem

A user may prefer asking a friend, even if the friend is less professional, because they personally trust the friend.

### Evidence available now

This is a logical concern for any trust-based service.

### Evidence still needed

Survey and interviews should ask:

- Would you trust a paid local verifier?
- What would make you trust them?
- Would a profile photo help?
- Would reviews help?
- Would a pre-call help?
- Would ID verification help?
- Would university/student association partnerships help?

### Mitigation actions

At the beginning, HouseCheck should:

- use only trusted verifiers
- show the verifier name and profile
- offer a short intro before the visit
- use clear procedures
- provide a structured checklist
- collect testimonials from pilots
- avoid anonymous marketplace behavior

### Priority

**Very high.** Trust is one of the biggest adoption barriers.

### Confidence

**High.** Trust is definitely a core issue.

---

## D3. Verifier safety risk

### Description

The verifier physically attends viewings in unknown places and may meet unknown landlords, agents, tenants, or scammers.

This creates personal safety risk.

### Why it matters

HouseCheck cannot operate responsibly without basic safety procedures. Even if the probability of a dangerous situation is low, the impact could be high.

### Possible safety risks

- unsafe neighborhood or building
- aggressive landlord or agent
- pressure to enter uncomfortable spaces
- request to stop filming or hide something
- being alone inside a property
- theft or intimidation
- confrontation if the verifier notices red flags

### Evidence available now

The risk is inherent in sending people to unknown properties.

### Evidence still needed

Dry runs can identify practical safety issues, but safety procedures should exist before testing.

### Mitigation actions

Create a verifier safety SOP including:

- check-in before the visit
- live location sharing
- check-out after leaving
- backup contact available
- no confrontation rule
- right to leave immediately
- no entering if uncomfortable
- no visits at unsafe times
- no carrying cash
- no signing or paying anything

### Priority

**Critical.** Safety must be addressed before real visits.

### Confidence

**High.** This is a definite weakness and risk.

---

## D4. Privacy and consent issues

### Description

The service involves live video inside private spaces. The video may show personal belongings, current tenants, private documents, faces, or other sensitive information.

### Why it matters

Privacy mistakes could create legal, reputational, and ethical problems.

Even if the client wants to see everything, HouseCheck must respect people living in or showing the property.

### Example privacy issue

During the video call, the verifier accidentally shows a tenant’s personal documents, family photos, or face without permission.

### Evidence available now

This risk is inherent in the service design.

### Evidence still needed

HouseCheck needs legal/privacy review before storing photos, recording videos, or scaling operations.

### Mitigation actions

HouseCheck should:

- ask permission before video calling inside the property
- avoid recording by default
- avoid filming people directly
- avoid filming private documents
- use live video as default, not stored video
- have a simple consent explanation
- add privacy rules to verifier training

### Priority

**Very high.** This should be handled before pilots.

### Confidence

**High.** Privacy and consent issues are clearly relevant.

---

## D5. Low scalability at the start

### Description

The service depends on humans physically going to viewings. This makes the first version slower and harder to scale than a pure software product.

### Why it matters

If demand grows, HouseCheck will need more verifiers, scheduling systems, quality control, safety procedures, and possibly insurance or legal support.

### Example scaling problem

If five users request viewings at the same time in different neighborhoods, one founder and one helper cannot handle all of them.

### Evidence available now

This is clear from the physical nature of the service.

### Evidence still needed

Pilot visits should measure:

- average time per visit
- travel time
- admin time
- cancellation frequency
- price needed to make the service viable

### Mitigation actions

Do not scale too early. Start with:

- one city
- one or two trusted verifiers
- limited availability
- scheduled visits only
- manual quality control

### Priority

**High**, but not a blocker for validation.

### Confidence

**High.** Scalability is limited at the beginning.

---

## D6. Dependence on landlord/agent cooperation

### Description

HouseCheck can only work if the landlord, agent, or person showing the property allows a third-party visit and live video call.

### Why it matters

If many landlords refuse, the service may be difficult to deliver.

### Possible refusal reasons

Landlords or agents may say:

- they do not allow video calls
- only the tenant can attend
- they do not want a third party
- they are too busy
- the viewing is group-only
- they do not want filming inside the property
- they think the service is suspicious

### Evidence available now

This is a likely operational dependency, but the actual refusal rate is unknown.

### Evidence still needed

Dry runs and pilots should track:

- how many landlords accept
- how many refuse
- why they refuse
- whether agencies behave differently from private landlords
- whether a clear explanation message improves acceptance

### Mitigation actions

Prepare a short message for the landlord/agent:

> “The prospective tenant is currently outside Madrid and cannot attend in person. I will attend on their behalf and show them the property through a live video call. I will not record the visit unless permission is given.”

### Priority

**High.** This must be tested early.

### Confidence

**Medium-high.** The dependency is clear; refusal rate is unknown.

---

## D7. Video quality may vary

### Description

The value of the service depends on the client being able to see and hear the property clearly during the live call.

Poor connection, bad lighting, noise, or crowded spaces can reduce the usefulness of the visit.

### Why it matters

If the client cannot clearly see the property, the service loses value.

### Example problem

The verifier enters an apartment with poor phone signal. The video freezes and the client cannot inspect the room properly.

### Evidence available now

This is a known practical risk for live video services.

### Evidence still needed

Dry runs should compare tools such as:

- WhatsApp video
- Google Meet
- Zoom
- FaceTime, when possible

### Mitigation actions

The verifier should:

- charge phone before visit
- carry power bank
- test connection before entering
- use headphones if needed
- move slowly while filming
- repeat important details verbally
- take notes if the video is poor

### Priority

**Medium-high.** Important for user experience.

### Confidence

**Medium.** The issue is likely but manageable.

---

## D8. Service quality depends on the verifier

### Description

Different verifiers may notice different things, communicate differently, or follow the checklist with different levels of care.

### Why it matters

The user experience must be consistent. If one verifier is excellent and another is careless, HouseCheck’s reputation suffers.

### Example quality issue

One verifier carefully shows the bathroom, kitchen, windows, furniture, and neighborhood. Another verifier only walks quickly through the room and misses important details.

### Evidence available now

This is common in human-delivered services.

### Evidence still needed

Dry runs and pilots should evaluate verifier performance.

### Mitigation actions

HouseCheck should create:

- checklist
- training guide
- sample visit script
- standard camera movement instructions
- required questions
- post-visit summary template
- quality review after each pilot

### Priority

**High** before adding more verifiers.

### Confidence

**High.** Service quality variation is very likely.

---

# 7. Oportunidades / Opportunities

Opportunities are external market conditions that HouseCheck can use to grow or validate demand.

---

## O1. International students and Erasmus

### Description

International students and Erasmus students often need to find accommodation before arriving in Madrid. Many are unfamiliar with local neighborhoods, rental norms, and scam risks.

### Why it matters

This is likely one of the strongest early segments because:

- they often search remotely
- they may not speak Spanish well
- they may not know anyone in Madrid
- they may be under time pressure
- they may rely on Facebook groups or online listings
- their parents may be involved in payment decisions

### Example use case

An Italian Erasmus student finds a room in Madrid but is still in Italy. The landlord asks for a deposit. The student wants someone in Madrid to visit the room before paying.

### Evidence available now

The segment logically matches the problem.

### Evidence still needed

Survey and interviews should test:

- how many students are worried
- how many lack someone in Madrid
- how much they would pay
- whether they want to be contacted
- which channels they use to search

### How to test

Distribute the survey in:

- Erasmus groups
- university WhatsApp groups
- international student Facebook groups
- student housing groups
- Italian/European student communities in Madrid

### Strategic value

If this segment responds strongly, HouseCheck can start with a very focused niche:

> “Remote apartment visits for Erasmus and international students moving to Madrid.”

### Confidence

**Medium.** Strong hypothesis, needs evidence.

---

## O2. Expats and remote workers

### Description

Expats, remote workers, and young professionals relocating to Madrid may need to secure housing before arriving.

### Why it matters

This segment may have higher purchasing power than students. They may value convenience and time savings more.

### Example use case

A remote worker moving from Germany to Madrid finds an apartment online but cannot fly to Madrid for every viewing. Paying for one remote visit may be cheaper than a flight or hotel.

### Evidence available now

The problem is plausible for relocation.

### Evidence still needed

HouseCheck should test:

- whether professionals are willing to pay more
- whether they prefer relocation agencies
- whether they need a faster or more premium service
- whether companies might pay for employee relocation support

### How to test

Interview:

- recent expats in Madrid
- remote workers
- people relocating for work
- members of expat communities

### Strategic value

This segment may support higher pricing than students.

### Confidence

**Medium.** Attractive segment, but acquisition may be harder.

---

## O3. Parents may pay for peace of mind

### Description

Parents helping children move abroad may be willing to pay for extra reassurance before a deposit is sent.

### Why it matters

Parents may care strongly about safety, legitimacy, and housing conditions. They may also have more ability to pay than students.

### Example use case

A parent in Italy helps their child move to Madrid for Erasmus. They are uncomfortable sending a deposit for a room nobody has seen. They pay HouseCheck to attend the viewing and show the room live.

### Evidence available now

This is a strong hypothesis based on the emotional nature of the problem.

### Evidence still needed

Survey should include:

- “Parent or family member of someone looking for housing” as a profile option
- willingness to pay by profile
- contact interest by profile

### How to test

Ask students whether their parents would pay. Also interview parents directly if possible.

### Strategic value

Parent-funded users may make the service more economically viable.

### Confidence

**Medium.** Promising, but must be validated.

---

## O4. Rental scam fear is emotionally powerful

### Description

Fear of rental scams and bad housing surprises can create strong motivation to act.

Even people who have never been scammed may know someone who had a bad experience or may fear losing money themselves.

### Why it matters

A product that reduces a high-cost fear can be valuable even if used only once.

HouseCheck does not need daily usage. It can be a one-time service at a critical moment.

### Example use case

A user is about to send a €700 deposit. Paying €50 for a remote visit may feel reasonable compared to the possible loss.

### Evidence available now

The risk framing is plausible.

### Evidence still needed

Survey should measure:

- awareness of scams
- suspicious experiences
- worry level
- perceived financial risk
- willingness to pay after risk framing

### How to test

Ask a neutral anchoring question before the pricing question:

> “If a room booked remotely turned out to be fake, unavailable, or very different from the listing, how much do you think you could lose between deposit, first rent, and other costs?”

### Strategic value

This opportunity can improve conversion if communicated ethically and clearly.

### Confidence

**Medium.** The emotion is strong, but price sensitivity must be tested.

---

## O5. Gap between DIY and relocation agency

### Description

Current alternatives are imperfect.

Users can:

- ask a friend
- trust the landlord’s video call
- use only verified platforms
- hire a relocation agency
- travel to Madrid
- take the risk

HouseCheck can sit between informal help and expensive relocation services.

### Why it matters

This gap creates a possible market position:

> More structured than asking a friend, but cheaper and lighter than a relocation agency.

### Example user interpretation

A user might think:

> “I do not need a full relocation agency. I only need someone to see this apartment for me.”

### Evidence available now

Competitor research suggests adjacent solutions exist, but not all solve the exact bring-your-own-listing remote viewing use case in Madrid.

### Evidence still needed

User interviews should ask:

- What would you do today instead?
- Why would or wouldn’t you ask a friend?
- Would you pay for a structured service?
- Would you use a relocation agency?

### How to test

Include alternatives in the survey:

- ask a friend
- ask landlord for video
- use known platforms only
- take the risk
- pay for a local verifier

### Strategic value

This positioning can help HouseCheck avoid competing directly with full-service relocation agencies.

### Confidence

**Medium-high.** The gap appears real, but demand size is unknown.

---

## O6. Future expansion to other cities

### Description

If the Madrid model works, HouseCheck could eventually expand to other cities with similar remote renting problems.

Possible future cities include:

- Barcelona
- Valencia
- Lisbon
- Milan
- Amsterdam
- Paris
- Berlin

### Why it matters

A successful Madrid pilot could become a repeatable city-by-city model.

### Example future model

HouseCheck could eventually become a network of trusted local verifiers for international renters moving to major European cities.

### Evidence available now

The expansion opportunity is conceptual only.

### Evidence still needed

No expansion research is needed now. Madrid must be validated first.

### Risks

Thinking about expansion too early can distract from the MVP.

### Action

Do not build for multiple cities yet. Only keep expansion as a long-term possibility.

### Confidence

**Low.** Potentially interesting, but not relevant until Madrid works.

---

## O7. Partnerships with student and relocation communities

### Description

HouseCheck could reach users through organizations and communities that already support people moving to Madrid.

Potential partners include:

- student associations
- Erasmus groups
- university international offices
- relocation consultants
- expat communities
- language schools
- Facebook group admins
- housing content creators

### Why it matters

Trust and distribution are hard for new services. Partnerships can help with both.

If a student association recommends HouseCheck, users may trust the service faster.

### Evidence available now

Partnerships are a logical channel, but none are validated yet.

### Evidence still needed

HouseCheck should test whether community admins or student groups are willing to share the survey or pilot.

### How to test

Start by asking for survey distribution, not formal partnerships.

Example message:

> “I am validating a service to help students moving to Madrid check rooms remotely before paying a deposit. Could I share a 2-minute survey in your group?”

### Strategic value

Partnerships could lower acquisition cost and increase trust.

### Confidence

**Medium-low.** Promising, but requires outreach.

---

## O8. Potential to become a trusted rental decision layer

### Description

In the long term, HouseCheck could become more than a one-off viewing service. It could become a trusted layer that helps remote renters make safer housing decisions.

Future services could include:

- remote viewing
- structured visit reports
- listing comparison
- neighborhood observations
- red flag checklist
- verified verifier network
- optional contract review through partners
- relocation support partnerships

### Why it matters

If users trust HouseCheck at the decision point before paying a deposit, the product may expand into adjacent services.

### Evidence available now

This is a future strategic possibility, not an MVP requirement.

### Evidence still needed

HouseCheck must first validate the core behavior:

> Will users pay for a remote viewing visit?

### Risks

Expanding the scope too early can make the product unclear and increase legal/operational risk.

### Action

Keep this as a long-term vision. Do not include all these features in the MVP.

### Confidence

**Low-medium.** Interesting future direction, but too early to prioritize.

---

# 8. Amenazas / Threats

Threats are external risks that could reduce demand, block delivery, or make the business difficult to sustain.

---

## A1. Users may ask friends for free

### Description

The biggest competitor may not be another startup. It may be a friend, classmate, family member, or acquaintance already living in Madrid.

### Why it matters

If a user already knows someone in Madrid, they may ask that person to visit for free instead of paying HouseCheck.

This can reduce the size of the paying market.

### Example user behavior

A student may say:

> “I like the idea, but I would just ask a friend who already lives there.”

### Evidence available now

This is a clear substitute.

### Evidence still needed

Survey should ask:

> “Do you already have someone you trust in Madrid who could visit a property for you?”

Then analyze willingness to pay separately for users who answer “No.”

### Mitigation actions

HouseCheck should not only position itself as “someone local.” It should position itself as:

- neutral
- structured
- reliable
- available
- trained with a checklist
- less awkward than asking a friend
- able to provide a summary

### Strategic response

HouseCheck should focus especially on people who:

- do not know anyone in Madrid
- do not want to bother friends
- do not fully trust acquaintances
- need a structured check

### Confidence

**High.** This is one of the main threats.

---

## A2. Landlords or agents may refuse video calls

### Description

Some landlords or agents may not allow a third party to attend the viewing or may not allow live video inside the property.

### Why it matters

This could directly block service delivery.

If refusal is common, HouseCheck may have to reposition or modify the workflow.

### Example refusal

A landlord may say:

> “No video calls are allowed during the visit.”

Or:

> “Only the person who wants to rent can attend.”

### Evidence available now

This is likely but unmeasured.

### Evidence still needed

Dry runs and pilots should record:

- accepted visits
- refused visits
- refusal reasons
- whether agencies differ from private landlords
- whether a polite explanation message improves acceptance

### Mitigation actions

Create a standard message explaining the service:

> “The prospective tenant is currently outside Madrid and cannot attend in person. I would attend on their behalf and show them the property through a live video call. I will not record the visit unless permission is given.”

Also offer a no-recording policy by default.

### Strategic response

If refusal is high, HouseCheck may need to:

- focus on listings where video attendance is allowed
- have clients ask permission before booking HouseCheck
- create landlord-friendly explanation pages
- avoid recording entirely

### Confidence

**Medium-high.** The threat is likely, but refusal rate is unknown.

---

## A3. Low willingness to pay

### Description

Users may like the idea but not be willing to pay enough to cover the cost of delivering the service.

### Why it matters

A physical visit requires time and money:

- travel time
- transport cost
- waiting time
- visit time
- communication
- admin coordination
- safety overhead
- cancellations

If users only want to pay €10–20, the model may not be viable.

### Example problem

A user says the service is very useful but enters €15 as the maximum price they would pay.

### Evidence available now

This is a major uncertainty.

### Evidence still needed

HouseCheck should collect exact willingness-to-pay answers:

> “Considering that a deposit can be several hundred euros, how much would you pay to have the property visited by a trusted person before making a decision?”

The answer should be a number in euros.

### Mitigation actions

Test different price points:

- €29 pilot price
- €39 accessible price
- €49–€59 realistic visit price
- €79+ premium/urgent visit

Analyze willingness to pay by segment:

- students
- expats
- parents
- young professionals

### Strategic response

If students cannot pay enough, HouseCheck may need to target parents or professionals first.

### Confidence

**Medium-high.** This is one of the biggest business-model risks.

---

## A4. Existing platforms or agencies could copy the idea

### Description

Rental platforms, relocation agencies, or property service companies could add similar remote viewing services.

### Why it matters

Large platforms may already have users, trust, listings, and resources.

### Possible competitors

Adjacent competitors include:

- verified listing platforms
- relocation agencies
- property viewing networks
- local task marketplaces
- real estate agencies

### Evidence available now

Similar models exist in other markets or adjacent categories.

### Evidence still needed

HouseCheck should continue monitoring competitors, especially in Spain and Madrid.

### Mitigation actions

HouseCheck should compete through:

- local focus
- speed
- clear niche
- user trust
- structured process
- excellent manual service
- community distribution

### Strategic response

Do not try to beat big platforms with broad features. Win with a narrow, highly specific use case:

> “I found a Madrid listing and need someone to visit it for me before I pay.”

### Confidence

**Medium.** Copying is possible, but early-stage execution matters more for now.

---

## A5. Legal, privacy, and liability issues

### Description

HouseCheck may face legal and liability questions related to privacy, filming, advice, property access, and user decisions.

### Why it matters

If a user pays a deposit after a HouseCheck visit and something goes wrong, they may blame HouseCheck even if the service did not guarantee safety.

### Example issue

A verifier says the apartment “looks fine,” but later the client discovers a contract problem. The user may feel misled.

### Evidence available now

The risk is inherent in the business model.

### Evidence still needed

A legal review is needed before scaling, storing detailed reports, recording videos, or taking payments at scale.

### Mitigation actions

HouseCheck should:

- use clear disclaimers
- avoid legal advice
- avoid guarantees
- avoid recording without consent
- avoid handling deposits
- avoid signing or negotiating
- describe observations, not conclusions
- recommend legal review for contracts

### Strategic response

Position the service as:

> “A remote viewing and listing comparison service.”

Not as:

> “A guarantee that the rental is safe.”

### Confidence

**High.** This is a serious threat and must be handled carefully.

---

## A6. Trust barrier for a new brand

### Description

HouseCheck is new. People may not trust a new service with something as important as housing.

### Why it matters

The brand must overcome skepticism quickly.

Potential users may ask:

- Is HouseCheck legitimate?
- Who is behind it?
- Is this another scam?
- Why should I trust this verifier?
- What happens if the visit goes wrong?

### Evidence available now

This is common for new trust-based services.

### Evidence still needed

Interviews should ask what would make users trust HouseCheck.

### Mitigation actions

HouseCheck can build trust with:

- founder story
- transparent process
- verifier profiles
- pilot testimonials
- clear pricing
- clear refund/cancellation rules
- professional landing page
- clear privacy policy
- no exaggerated claims

### Strategic response

The first users may come from warm communities and referrals rather than cold ads.

### Confidence

**High.** Trust is a core challenge.

---

## A7. Operational failures can damage reputation

### Description

Because HouseCheck is a service business, execution quality directly affects reputation.

### Why it matters

Early users are extremely important. A bad pilot can hurt word-of-mouth and confidence.

### Possible failures

- verifier late
- verifier cancels
- poor communication
- poor video quality
- missed details
- no clear summary
- unclear refund policy
- unsafe visit
- bad expectation management

### Evidence available now

This is likely for any manual service.

### Evidence still needed

Dry runs should reveal common operational problems before paid users experience them.

### Mitigation actions

Before paid pilots, create:

- checklist
- visit script
- safety SOP
- client confirmation message
- landlord explanation message
- cancellation policy
- visit summary template
- post-visit feedback form

### Strategic response

The first goal is not scale. The first goal is consistent delivery.

### Confidence

**High.** Operational failures are a real risk.

---

## A8. Seasonality and demand concentration

### Description

Demand for remote rental visits may be seasonal. For example, student demand may be higher before university semesters and lower during other months.

### Why it matters

Seasonality can make revenue inconsistent.

### Example pattern

Demand may spike before:

- Erasmus semester starts
- university intake periods
- September/October moves
- January/February semester starts
- summer relocation periods

### Evidence available now

This is a reasonable hypothesis, especially for student segments.

### Evidence still needed

Track when survey respondents are moving and when they need housing.

### Mitigation actions

HouseCheck can reduce seasonality by serving multiple segments:

- students
- professionals
- expats
- parents
- remote workers

### Strategic response

Start with students if they are easy to reach, but check whether professionals provide steadier demand.

### Confidence

**Medium.** Likely relevant, but not yet measured.

---

# 9. Evidence table

This table should be updated as research progresses.

| DAFO item | Evidence source | Evidence found | Confidence | Next action |
|---|---|---|---|---|
| F1. Simple value proposition | Interviews | TBD | Medium-high | Ask users to explain the idea back in one sentence |
| F2. Strong emotional pain | Survey | TBD | Medium | Ask about worry, financial risk, and past suspicious experiences |
| F3. Manual MVP possible | Operational planning | Workflow can be run manually | High | Create checklist and run dry runs |
| F4. Madrid-first focus | Product scope | MVP is Madrid-only | High | Keep all messaging Madrid-specific |
| F5. Bring-your-own-listing | Competitor comparison | Many alternatives focus on their own inventory or generic tasks | Medium | Ask users where they find listings |
| F6. Neutral verifier | Interviews | TBD | Medium | Compare trust in landlord video vs verifier visit |
| F7. Clear target users | Survey segmentation | TBD | Medium | Segment answers by profile |
| F8. Post-visit evidence | Pilot feedback | TBD | Medium | Test whether users value a written summary |
| D1. Operational complexity | Dry runs | TBD | High | Run 3 dry runs |
| D2. Verifier trust | Survey/interviews | TBD | High | Ask what builds trust |
| D3. Verifier safety | Internal review | Risk exists due to field visits | High | Create safety SOP |
| D4. Privacy/consent | Legal review | TBD | High | Avoid recording by default |
| D5. Low scalability | Operational model | Service is manual | High | Limit early availability |
| D6. Landlord cooperation | Dry runs/pilots | TBD | Medium-high | Track refusal rate |
| D7. Video quality | Dry runs | TBD | Medium | Test different video tools |
| D8. Verifier quality | Dry runs/pilots | TBD | High | Create training and checklist |
| O1. Students/Erasmus | Survey | TBD | Medium | Share survey in student groups |
| O2. Expats/workers | Survey/interviews | TBD | Medium | Interview recent relocators |
| O3. Parents | Survey | TBD | Medium | Include parent profile option |
| O4. Scam fear | Survey | TBD | Medium | Use neutral anchoring question |
| O5. DIY vs relocation gap | Interviews | TBD | Medium-high | Ask what users would do today |
| O6. Expansion | Future research | Not relevant yet | Low | Ignore until Madrid works |
| O7. Partnerships | Outreach | TBD | Medium-low | Ask communities to share survey |
| O8. Rental decision layer | Future pilots | TBD | Low-medium | Do not prioritize yet |
| A1. Friend substitute | Survey | TBD | High | Ask if users know someone in Madrid |
| A2. Landlord refusal | Dry runs/pilots | TBD | Medium-high | Track refusal reasons |
| A3. Low willingness to pay | Survey/paid pilots | TBD | Medium-high | Ask exact euro amount |
| A4. Platforms copy idea | Competitor monitoring | Adjacent services exist | Medium | Stay narrow and local |
| A5. Legal/privacy | Legal review | TBD | High | Get review before scaling |
| A6. New brand trust barrier | Interviews | TBD | High | Test trust signals |
| A7. Operational failure | Dry runs | TBD | High | Use SOPs and templates |
| A8. Seasonality | Survey | TBD | Medium | Ask when users are moving |

---

# 10. Strategic conclusions

Based on this DAFO, HouseCheck should continue with a very focused and manual validation strategy.

## Main conclusion 1: The product should stay simple

The strongest version of HouseCheck is not a broad anti-scam platform. It is:

> A trusted local verifier visits the property while the client joins by video call.

This message is simple, concrete, and easy to test.

## Main conclusion 2: The biggest competitor is probably “asking a friend”

HouseCheck should not only compare itself to platforms and agencies. The real substitute for many users may be a friend or acquaintance in Madrid.

HouseCheck must therefore communicate why it is better or more convenient than asking a friend:

- structured checklist
- neutral perspective
- no awkward favor
- reliable scheduling
- post-visit summary
- experience with rental red flags

## Main conclusion 3: Trust is the central challenge

Users must trust:

- the brand
- the verifier
- the process
- the video call
- the summary

Without trust, the product will not work.

## Main conclusion 4: Willingness to pay is the key business-model test

People may like the idea but still not pay enough. The survey and pilots must test exact willingness to pay.

The most important question is:

> Can HouseCheck charge enough to cover travel, time, coordination, risk, and still feel affordable?

## Main conclusion 5: Legal, privacy, and safety must be handled early

Even for pilots, HouseCheck should have clear rules:

- no entering without permission
- no secret recording
- no legal advice
- no payment/deposit handling
- no confrontation
- no guarantees
- clear consent for video calls

## Main conclusion 6: Do not build software yet

The current best next step is not an app. It is manual validation:

1. survey
2. interviews
3. dry runs
4. pilot visits
5. then software decisions

---

# 11. Decisions based on the DAFO

| Decision | Based on | Status |
|---|---|---|
| Focus MVP on Remote Viewing Visit | F1, F3, F4, O1, O2 | Accepted |
| Do not start with digital scam reports | F1, D4, A5 | Accepted |
| Start Madrid-only | F4, D1, D5 | Accepted |
| Use trusted verifiers only at first | D2, D3, A6 | Accepted |
| Run 3 dry runs before paid pilots | D1, D6, D7, A7 | Pending |
| Use Google Forms for first survey | F3 | Accepted |
| Ask willingness to pay as exact euro amount | A3 | Accepted |
| Get legal review before scaling | D4, A5 | Pending |
| Avoid recordings by default | D4, A5 | Recommended |
| Create verifier safety SOP | D3, A7 | Pending |
| Create remote viewing checklist | D1, D8, A7 | Pending |

---

# 12. Open questions

These questions should guide the next phase of validation.

1. Will users pay enough to cover verifier time, travel, waiting time, coordination, and risk?

2. Which target segment has the strongest willingness to pay: students, parents, expats, or young professionals?

3. Will landlords and agents allow third-party live video calls?

4. What trust signals matter most to users?

5. Is a live video call enough, or do users also expect a written summary?

6. What price is realistic for the first pilot: €29, €39, €49, €59, €79, or more?

7. How often would visits fail because of cancellations, refusals, or bad video quality?

8. Should HouseCheck focus on urgent viewings or scheduled visits with 24–48 hours notice?

9. Is the strongest message “avoid scams,” “avoid bad surprises,” or “visit remotely before paying”?

10. What legal/privacy requirements must be addressed before paid pilots?

---

# 13. Next validation steps

## Step 1: Launch the Google Form survey

Goal: collect at least 30–50 responses.

Measure:

- user profile
- scam awareness
- worry level
- previous suspicious experiences
- whether they know someone in Madrid
- perceived usefulness
- exact willingness to pay
- interest in being contacted

## Step 2: Interview 10 target users

Interview:

- 3–5 students
- 3–5 young professionals/expats
- 2–3 parents or family members if possible

Ask about:

- remote renting experience
- fear of scams
- current alternatives
- trust requirements
- willingness to pay
- reaction to HouseCheck

## Step 3: Create operational documents

Create:

- `docs/remote-viewing-checklist.md`
- `docs/operations/verifier-safety-sop.md`
- `docs/visit-summary-template.md`
- `docs/client-request-form.md`
- `docs/landlord-explanation-message.md`

## Step 4: Run 3 dry runs

Test without charging.

Measure:

- timing
- video quality
- checklist usefulness
- awkward moments
- landlord/agent reaction
- client feedback

## Step 5: Update DAFO to v0.3

Add evidence from:

- survey
- interviews
- dry runs

## Step 6: Run 3–5 paid pilots

Only after dry runs.

Test whether people actually pay.

Track:

- price paid
- user satisfaction
- delivery problems
- refund requests
- referrals
- repeated interest

---

# 14. When DAFO v1 is complete

DAFO v1 can be considered complete when:

- [ ] Product definition is clear
- [ ] Competitor research is summarized
- [ ] Strengths are explained in detail
- [ ] Weaknesses are explained with mitigation actions
- [ ] Opportunities are connected to target users
- [ ] Threats are connected to real alternatives
- [ ] Evidence table is started
- [ ] Strategic conclusions are written
- [ ] Decisions are linked to the decision log
- [ ] Next validation steps are defined

After surveys, interviews, and dry runs, create DAFO v2.

---

# 15. Update history

| Date | Version | Update |
|---|---|---|
| 2026-07-12 | v0.1 | Initial DAFO draft based on desk research and project discussion |
| 2026-07-12 | v0.2 | Expanded detailed explanations for each strength, weakness, opportunity, and threat |
| TBD | v0.3 | Update after Google Form responses |
| TBD | v0.4 | Update after interviews |
| TBD | v1.0 | Update after first dry runs |

---

# 16. Final practical takeaway

The current DAFO suggests that HouseCheck is worth testing, but not yet worth building as full software.

The strongest reason to continue is:

> People moving to Madrid remotely may strongly value having trusted local eyes on a property before paying a deposit.

The biggest reason it could fail is:

> Users may like the idea but either ask friends for free, not trust a new verifier, or not pay enough to cover the operational cost.

The next experiment is:

> Launch the survey, interview target users, and run 3 dry remote viewing tests before building software.
