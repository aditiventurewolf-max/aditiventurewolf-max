# Unobvious OS · Showcase concept

A research-backed plan for the hero and the 3D flow through the site. This is the thinking; it's written so someone else can build it. It does not replace `DESIGN.md`; it extends it. Research date: 19 November 2026.

---

## 0. The shift, in one line

> **The wearable is the doorway. The system is the product.**

The current Home 7 hero shows a device. That's why it feels boring: a device on its own is a gadget, and every 3D showcase of a gadget looks the same. The founder's brief is that the point is the **ecosystem that runs everything**. The person does the thinking; the execution is handled for them.

So the 3D object should not be admired. It should be **followed**. One press sends one thought out of the wrist, through the system, into the world and back, and the person never looks at a screen. That journey is the showcase.

### The second shift: the mess is the point

A builder's head is not a tidy to-do list. It's half-sentences, "that guy from that thing", an idea for cat clothes, a reel you'll never film, and a deadline you half-remember, all while walking. Writing it down on the go is nearly impossible, so most of it is lost.

**Unobvious doesn't ask you to be organised. It takes the mess as it comes and makes it clear.** That makes the chaos a feature, not a problem to hide.

> **Chaos in. Clarity out.**

This becomes a design principle for the whole site (section 5), not just the demo.

---

## 1. What the market tells us

### Where the category stands (late 2026)

| Group | Players | What they do | Where they stop |
|---|---|---|---|
| **Fallen "AI gadgets"** | Humane AI Pin (servers shut Feb 2025, assets to HP, fewer than 10k units reported); Rabbit R1 (still sold, $199; the company itself says the hardware "was never the real product") | Replace the phone with a new device | The phone already did the job. Unclear daily use. The device was the hero |
| **Recorders and memory** | Plaud NotePin ($159–179 + subscription), Amazon Bee (new devices Oct 2026), Omi (open source), Limitless (bought by Meta, off sale) | Capture conversations into notes, summaries and memory | They **remember**, but don't **do**. Several are always-listening, and reviewers flag privacy |
| **Glasses** | Ray-Ban Meta (the mainstream pull), Google and Samsung eyewear (Nov 2026) | Camera and AI on your face | Attention moves to your face. A screen still sits in front of you |
| **The big entrant** | OpenAI and Jony Ive: reported screen-free home speaker with a camera, "built to feel alive"; shipping not before end of Feb 2027 | An ambient companion at home | Anthropomorphic companion framing. Home, not your day |
| **Ambient agents** | Alexa+ (proactive, Feb 2026), OpenAI agents on calendar and email; the LangChain "ambient agents" pattern (notify, question, review) | Agents that act in the background | Live in apps and speakers. Users tolerate only a few unsolicited nudges a day |

### What we learn from it

1. **Never make the device the hero.** Humane and Rabbit did, and both are the cautionary tales every reviewer cites.
2. **Capture is solved. Execution is the gap.** The recorders turn talk into notes and stop there. Nobody owns *thought → done*.
3. **Privacy is the trust question.** Press-to-speak (like Plaud) beats always-on (Bee, the OpenAI speaker) in every review.
4. **Consent beats autonomy.** The working pattern in agents is "AI drafts, a person approves before anything goes out". Unobvious already has it: *it asks before it acts*.
5. **Fewer interruptions is a feature.** Proactive assistants annoy fast. "Then it goes quiet" is a differentiator, not a tagline.

### Positioning

> **For** people whose days are run by a screen, **Unobvious OS** is the **quiet system behind one button**: you say what's on your mind, it sorts it and gets it done, and it asks before anything leaves your hands, **because** it was built for the moment after the press, not for the device.

| Dimension | Unobvious | Recorders | Glasses | AI gadget (Rabbit) | OpenAI speaker |
|---|---|---|---|---|---|
| Hero | The person, then the system | Your memory | The view | The device | The companion |
| Job | Thought → done | Talk → notes | See → answer | Ask → app action | Talk → company |
| Listening | Only when pressed | Often always-on | On demand | On demand | Reportedly ambient |
| Ends with | You looking up | A transcript | A screen on your face | A screen in your hand | A conversation |
| Consent | Built-in gate before anything goes out | n/a | n/a | Varies | Unknown |

**The angle nobody has claimed:** the story ends with the person **not** using the product. Every competitor's demo ends with someone engaging more. Ours ends with someone looking up.

**The villain:** not phones, and not other brands. It is **the loop**: unlock, open, find, edit, write, send, repeat, about five hours a day (EY's estimate for average Indian mobile screen time, 2024 data).

---

## 2. The showcase: "One press, the whole system"

A scroll-driven story in six acts. The camera **follows one thought**, the way United Carriers follows one container and Worldline pushes into one screen. The 3D device appears at the start and the end. In between, the system is the subject.

### The example: a real brain dump

The old example (move a meeting, order rice) was too tidy. Real speech is messy, so the demo should be too: fun, specific, half-formed, and recognisably a founder's. Spoken on a walk, about 25 seconds, filler and all:

> "Okay so, um, that guy from yesterday, the maker thing, Rohan? Send him the proposal. The after-school one, the alternative education thing we talked about. Use the background from my notes. Oh, and wait. Cat clothing. Like clothes for cats, but actually useful? Cooling, maybe? Don't do anything, just put it somewhere, I want to research it later. There's also a reel in this somewhere, about how messy my head is. Make me actually film it. Aaand that fellowship, the deadline's soon, right? Don't let me miss it."

*(Rohan, the meetup and the fellowship are fictional placeholders for the demo.)*

**What the system makes of it.** Four very different kinds of thing, from one breath:

| Fragment | Kind | Station | What happens | Asks first? |
|---|---|---|---|---|
| "That guy from yesterday, the maker thing… send him the proposal" | Decision | Messages + Memory | Works out who "that guy" is from yesterday's calendar and notes. Drafts the after-school proposal from the alternative-education notes | **Yes.** The draft waits at the gate |
| "Cat clothing… just put it somewhere" | Idea | Memory → Ideas | A new row in the Ideas database: *Functional cat clothing (cooling?)*, tagged "research later", with three open questions. Nothing else happens | No, it's only saved |
| "A reel… make me actually film it" | Idea + nudge | Memory + Planner | Saved with your own line ("how messy my head is") as the hook. A gentle prompt on Sunday morning: *"Want to film the reel? Your hook's ready."* | No, it's a nudge, not an action |
| "That fellowship… don't let me miss it" | Decision | Planner | Finds the deadline in your email, adds it to the calendar with two writing blocks, and reminds you five days before | No, it only touches your own calendar |

**One clarifying question.** The system checks a single ambiguity rather than guessing: *"Rohan from yesterday's maker meetup, or Rohan from the investor email? I think the meetup."* One tap answers it. This shows it's careful without being needy.

**Why this example wins:**
- **It's fun and true.** The cat clothing line gets a smile, and every founder recognises the rest.
- **It shows range.** In one breath: a message to a person, a database entry, a future nudge, and a deadline.
- **It shows the brain work.** "That guy from that thing" being resolved is the moment people will remember.
- **It shows the gate.** Only the proposal, the one thing that reaches another person, waits for a tap.

### Act 0 · The mess (two kinds of noise)

- **Scene:** a figure walking, made of thought fragments. This is your "Thoughts are not real, but they are loud" reference.
  - **The fragments:** "Rohan?", "the after-school thing", "cat clothes??", "reel idea", "fellowship deadline??", "background from my notes", "wait—".
  - **The look:** different sizes, half-typed, crossed out, rotated, overlapping, drifting.
  - **The phone:** glows in one hand, adding outer noise (notifications) to the inner noise.
- **Scroll does:** the mess gets louder and faster. The person tries to type it into the phone; the text field fills with typos and gives up. Then the phone **turns face down**.
- **Caption:** *Your head is busy. Writing it down shouldn't be another job.*
- **Why first:** every visitor sees their own head. The problem lands as recognition, before any product appears.

### Act 1 · The press

- **Scene:** a wrist in soft focus with one warm light (a photo plate, not a 3D human). The device sits on it, sharp inside the focus frame.
- **Interaction:** **the visitor presses**. Press and hold the device, or the space bar. The amber status light comes on and a ripple leaves the button. If they only scroll, it plays on its own.
- **Caption:** *So don't write it down. Say it.*

### Act 2 · The thought leaves the wrist

- **Scene:** the voice becomes a **filament of warm light** leaving the button. The camera follows it out:
  - **The face-down phone:** the filament passes through it as a quiet relay, labelled "BLE burst, phone stays face down".
  - **The system:** the filament rises into open dark space.
- **Caption:** *Say it messy. Your phone stays face down.*
- **Detail:** the spoken monologue plays as live captions, filler words and all ("um", "wait", "aaand"). Don't clean it up. The mess is the point.
- **Signature beat:** the phone appears in the system and is used, but is **never looked at**.

### Act 3 · The system

- **Scene:** the reveal. A calm **constellation** with the person at the centre, not the device. Around them, stations sit in orbit, each a small light with a mono label:

  | Station | What it does | Lab experiment it is |
  |---|---|---|
  | Planner | Calendar and rest | — |
  | Messages | WhatsApp and email | — |
  | Errands | Orders and refills | Zero-Scroll Commerce |
  | Reading | Curiosity, one good piece | Agora |
  | Learning | Deep dives | Socratic Foundry |
  | Care | Pets | Kibble and Kindred |
  | Memory | What it keeps | — |

- **Scroll does:** **chaos to clarity, made literal.**
  - **Sorting:** the drifting fragments from Act 0 are pulled out of the noise one by one. Each one straightens, sharpens and lines up, and flies to its station (see the table in section 2), which wakes up.
  - **Resolving:** "that guy from that thing" visibly resolves into a name card ("Rohan · maker meetup · yesterday").
  - **Saving:** "cat clothes??" lands as a neat database row.
  - **Discarding:** the filler ("um", "wait", "aaand") falls away and blurs out. It's the only thing the system throws away.
- **Caption:** *It keeps the mess. It gives you back the meaning.*
- **Why this matters:** this is the "ecosystem that runs everything". It also solves the lab-vs-product question on the home page. **The lab's other experiments are stations in the same system.** The lab and the OS become one picture, and new experiments can light up later as new stations.

### Act 4 · The gate

- **Scene:** the clarifying question appears first: *"Rohan from the meetup? I think so."* The visitor taps yes. Then **only the proposal** travels to the gate, a thin amber line. The cat idea, the reel and the deadline are already quietly done; they never needed permission.
- **Interaction:** the visitor approves with a tap ("Send it"). A haptic tick shows on the wrist, and the proposal passes through, out into the world.
- **Caption:** *Nothing leaves your hands without you.*
- **Proof:** this is the trust story, shown rather than claimed, and the clearest line between Unobvious and always-on companions.

### Act 5 · Quiet

- **Scene:** the stations dim one by one. The constellation folds back into the device's status light, which fades. The camera pulls back and up: the wrist, the person, a window, the horizon plate.
- **Caption:** *Then it goes quiet. And you look up.*
- **Coda (small, after the end card):** a single phone-style notification fades in, days later in story time: *"Sunday · Want to film the reel? Your hook's ready: 'how messy my head is.'"* This closes the loop: it remembered so you didn't have to.
- **End card:** early access, plus *Private alpha · small on purpose*.

### After the story (the rest of the home page)

Keep it short:
1. **"It asks before it acts"** list (already built).
2. **The day tiles** (already built).
3. **The lab:** the constellation reused as a static map. Each station that is a lab experiment links to its own page when ready, and the rest stay "coming to the lab".
4. **Close.**

---

## 3. Copy

Voice from `DESIGN.md`: calm, plain, on your side.

### Hero line options (pick one)

1. **You think. It handles the rest.** *(recommended: it is the founder's own sentence, and it names the split between person and system)*
2. One press. A whole system behind it.
3. Say it once. Then look up.
4. Everything else can blur. *(current; keep it as the brand line, not the product hero)*

**Sub-line:** *Unobvious OS is a quiet system behind one button. Say what's on your mind, and it sorts it, gets it done, and asks before anything leaves your hands.*

### Captions by act

| Act | Caption |
|---|---|
| 0 | Your head is busy. Writing it down shouldn't be another job. |
| 1 | So don't write it down. Say it. |
| 2 | Say it messy. Your phone stays face down. |
| 3 | It keeps the mess. It gives you back the meaning. |
| 4 | Nothing leaves your hands without you. |
| 5 | Then it goes quiet. And you look up. |

### Buttons

- Primary: *Ask for early access*
- In the story: *Press to speak* (Act 1), *Send it* (Act 4)
- Secondary: *See the whole system*

### Meta

- **Alternative hero (if the mess story leads):** *Chaos in. Clarity out.*
- **Meta title:** Unobvious OS: you think, it handles the rest
- **Meta description:** A quiet system behind one button. Say it once; it sorts, acts, and asks before anything leaves your hands. Private alpha, Bengaluru.

### Must not claim

- "Always listening" (it isn't).
- Battery, chip or hardware specs (private).
- User numbers, testimonials or reviews (none exist).
- That integrations are live. Label the story "How it works" and the demo "A simulated example".

---

## 4. Handoff spec for the builder

### Assets

| Asset | Status | Notes |
|---|---|---|
| Device 3D model | Stand-in exists (`render/device.html`, three.js primitives) | Replace with the real device CAD as glTF (under 2 MB, Draco) when it exists. Keep the button centre as a named node; the camera targets it |
| Wrist / person / window | **Needed** | Real grainy, soft-focus photography to the `DESIGN.md` imagery rules. No 3D humans |
| Phone (face up / face down) | Needed | Simple glTF or a two-frame image; must read in silhouette |
| Constellation and filament | Build in code | Particles and lines in three.js. Light only, no models |
| Light plates | Exist (`assets/media/bg/`) | Act 0: window. Act 3: deep night. Act 5: horizon |
| Noise words | Exist (Home 7) | Move to Act 0 |

### Tech (from what 2026 hardware launches use)

- **Stack:** three.js scene + GSAP ScrollTrigger (pinning and timelines) + Lenis (smooth scroll).
- **One timeline:** one WebGL canvas, pinned, with one master timeline mapped to scroll progress. Each act is a labelled segment.
- **Phones:** use pre-rendered image sequences or video per act, not live WebGL. A 2.5D fallback without WebGL is acceptable.
- **Performance:**
  - Under 3 MB before first interaction, and the hero is readable before WebGL loads.
  - Cap device pixel ratio at 1.5.
  - Pause rendering when the canvas is off screen.
- **Accessibility:**
  - **Reduced motion:** six still frames, one per act, with captions. The story must make sense with no motion.
  - Every interactive beat (press, approve) also works by keyboard and auto-advances on scroll.
  - Captions are real text, not text drawn into the canvas.
- **Honesty:** a small mono label, "Simulated example", stays visible during Acts 2 to 4.

### Acceptance checks

- A first-time visitor can say what Unobvious OS does within the first two acts.
- The person, not the device, is at the centre of Act 3.
- The phone is never shown face up after Act 0.
- Everything above runs without errors at 360 px wide and with reduced motion.

---

## 5. Design principle for the whole site: chaos in, clarity out

The mess isn't only the demo's subject. It's a visual grammar the whole site can share, so every section shows the product's job without explaining it.

### Two states, one transition

| | Chaos | Clarity |
|---|---|---|
| Layout | Scattered, overlapping, rotated, off-grid | On the grid, aligned, hairline-ruled |
| Type | Mixed sizes, half-words, strike-throughs, filler ("um", "wait") | One scale, full sentences, mono labels |
| Focus | Blurred, drifting, grainy | Sharp, inside the focus frame |
| Colour | Many dim tones, notification-ish | Night and moonlight, one amber point |
| Motion | Jittery, layered, fast | Slow, settled, still |

**The transition is the brand.** On scroll, chaos resolves into clarity. That's the same move as the focus frame and the "Everything else can blur" line, extended into layout and type.

### Where to use it

- **Home hero (Act 0 → 3):** the full story above.
- **Unobvious OS page:** the day tiles start as a scrawled, messy list and settle into the four clean tiles.
- **About:** the manifesto can begin as scattered notes and assemble into the paragraph, a nod to how the company itself began.
- **Lab page:** experiments start as sticky-note fragments ("cat clothes??") and become stations. Honest about being early: *some of these are still just notes.*
- **404 page:** "This page got lost in the mess." It shows the fragments, with one clear way home.

### Rules so it doesn't become noise

- **Chaos never sits still.** Every chaotic moment resolves within the same screen or scroll step. The visitor always ends in clarity.
- **Chaos is decorative; clarity is the content.** Anything a visitor must read lives in the clear state.
- **Reduced motion shows the after, with a small before.** Show the clear state, with a muted thumbnail of the mess beside it.
- **Use the founder's real kind of mess.** Ideas, people, deadlines and half-plans, not generic notification spam. That's what makes it human and specific to Unobvious.

---

## 6. The reel (same story, 25 seconds)

The showcase doubles as a launch reel for Instagram and LinkedIn. Vertical, handheld, grainy, one warm light.

| Time | Shot | On-screen text / audio |
|---|---|---|
| 0–3s | A founder walking, phone in hand, fragments of text swirl around their head | "your brain on a walk:" |
| 3–9s | Fast cuts: thumbs typing a note, typos, giving up; overlapping thought text ("Rohan??", "cat clothes", "fellowship deadline") | Real voice, mid-ramble: "that guy from the maker thing… cat clothing, like, useful?…" |
| 9–12s | The phone goes face down in a pocket. A finger presses the wrist device. Amber light | Silence, then a soft tick |
| 12–20s | Clean screen: four fragments snap into four neat cards (Proposal · drafted, Cat clothing · saved, Reel · Sunday, Fellowship · on calendar) | "It keeps the mess. It gives you back the meaning." |
| 20–23s | One card: "Send proposal to Rohan?" A thumb taps *Send it* | "It asks before anything leaves your hands." |
| 23–25s | The founder looks up at the sky. End card with the Focus mark | "Unobvious. You think. It handles the rest." |

**The meta-joke:** the reel inside the demo note is this reel. "There's a reel in this somewhere, about how messy my head is." Lean into it in the caption: *"I told it to make me film this. It did."* Only use that caption if it's true by the time it's posted.

---

## 7. Risks

- **Over-promising:** the story shows a working system; today it's a private alpha. The "Simulated example" label and "How it works" framing are mandatory.
- **Looking like Humane:** if the device dominates the frame for more than Acts 1 and 5, the story drifts back to gadget-worship.
- **Weight:** an overbuilt 3D page punishes slow phones in India. Mobile gets image sequences.
- **Competition:** OpenAI's device could reset the conversation in 2027. Our defence is the stance (consent, quiet, press-only, built for the day not the home), not features.

---

## Sources

- AI wearables in 2026: [The Gadgeteer](https://the-gadgeteer.com/2026/05/08/best-ai-wearables-2026-2/), [Omi](https://www.omi.me/pages/learn-best-ai-wearable-2026), [Legend Memory](https://legendmemory.ai/blogs/the-archive/best-ai-wearables-2026-ranked-by-what-you-are-actually-trying-to-solve)
- OpenAI and Jony Ive device: [TheNextWeb](https://thenextweb.com/news/openai-jony-ive-smart-speaker-io-hardware), [MacRumors](https://www.macrumors.com/2026/02/10/openais-jony-ive-designed-device-delayed-to-2027/), [9to5Mac](https://9to5mac.com/2026/02/10/jony-ives-ai-hardware-is-delayed-to-2027-and-wont-be-called-io/), [Axios](https://axios.com/2026/01/19/openai-device-2026-lehane-jony-ive)
- Humane and Rabbit: [IEEE Spectrum](https://spectrum.ieee.org/ai-gadgets-2024), [Engadget](https://www.engadget.com/ai/the-humane-ai-pin-debacle-is-a-reminder-that-ai-alone-doesnt-make-a-compelling-product-190119112.html), [Digital Applied](https://www.digitalapplied.com/blog/ai-product-failures-2026-sora-humane-rabbit-lessons), [Medium (Bossa Research)](https://medium.com/@bossaresearch/anatomy-of-a-failure-the-humane-ai-pin-and-the-misfit-future-of-wearable-ai-04feedd82903), [TechRadar](https://www.techradar.com/computing/artificial-intelligence/from-the-ai-pin-to-microsoft-tay-5-ai-products-that-ended-in-disaster-and-why-they-failed)
- Recorders, pricing and privacy: [andrew.ooo](https://andrew.ooo/answers/bee-frontier-vs-bee-eclipse-vs-plaud-ai-recorders-2026/), [Omi on Plaud pricing](https://www.omi.me/blogs/ai-note-takers/plaud-pricing), [tl;dv](https://tldv.io/blog/plaud-notepin-review/)
- Ambient agents and approvals: [LangChain](https://blog.langchain.com/introducing-ambient-agents), [Nylas](https://www.nylas.com/blog/ai-assisted-vs-autonomous-email-workflows/), [Zylos](https://zylos.ai/research/2026-07-16-desktop-agent-uis-ambient-computing), [Fast Company](https://fastcompany.com/91620082/openai-dots-agent-review)
- Screen time in India: [Bloomberg on EY](https://www.bloomberg.com/news/articles/2025-03-27/indians-spent-1-1-trillion-hours-on-smartphones-in-2024-ey-says)
- 3D product storytelling: [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026), [Svilenkovic](https://www.svilenkovic.com/3d/product-launch-3d-website)

Note: several wearable roundups are vendor or affiliate blogs; prices are indicative. OpenAI device details rest on anonymous-source reporting.
