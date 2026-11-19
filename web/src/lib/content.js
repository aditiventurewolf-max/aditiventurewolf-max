// All copy lives here. Voice: DESIGN.md §8. Story: SHOWCASE.md. Names in the demo are fictional placeholders.
export const EMAIL = 'contact@unobvious.in'
export const JOIN = `mailto:${EMAIL}?subject=Early%20access`

export const CAPTIONS = [
  'Your head is busy. Writing it down shouldn’t be another job.',
  'So don’t write it down. Say it.',
  'Say it messy. Your phone stays face down.',
  'It keeps the mess. It gives you back the meaning.',
  'Nothing leaves your hands without you.',
  'Then it goes quiet.',
]

// [text, kind, key]. kind: key | noise | filler | notif | strike
export const FRAGMENTS = [
  ['that guy from the maker thing?', 'key', 'who'], ['send him the proposal', 'key', 'proposal'],
  ['cat clothes?? actually useful??', 'key', 'cat'], ['reel idea — film it??', 'key', 'reel'], ['fellowship deadline??', 'key', 'fellowship'],
  ['the after-school thing'], ['alt-ed'], ['background from my notes'], ['Rohan?'], ['cooling, maybe?'], ['research later'],
  ['Sunday?'], ['what was the deadline'], ['where did I write that'], ['deck v3??', 'strike'], ['that one thing'], ['remind me'],
  ['groceries', 'strike'], ['the walk'], ['how messy my head is'],
  ['um', 'filler'], ['wait—', 'filler'], ['aaand', 'filler'], ['uh', 'filler'], ['okay so', 'filler'], ['ugh', 'filler'],
  ['12 unread', 'notif'], ['Reply?', 'notif'], ['Sale ends tonight', 'notif'], ['3 new messages', 'notif'], ['Low battery', 'notif'], ['Seen 4m ago', 'notif'],
]

export const NOTE = [
  ['Okay so, ', 'f'], ['um, ', 'f'], ['that guy from yesterday, the maker thing, Rohan? Send him the proposal. The after-school one. '],
  ['Oh, and wait. ', 'f'], ['Cat clothing. Like, actually useful? Cooling, maybe? Just put it somewhere. '],
  ['There’s a reel in this somewhere, about how messy my head is. Make me film it. '], ['Aaand ', 'f'], ['that fellowship. Don’t let me miss it.'],
]

export const STATIONS = [
  { id: 'messages', label: 'Messages', cards: [
    { k: 'who', tag: 'Worked out who', t: 'Rohan · maker meetup · yesterday' },
    { k: 'proposal', tag: 'Drafted · waits for you', t: 'After-school proposal for Rohan', s: 'Built from your alternative-education notes', wait: true },
  ] },
  { id: 'planner', label: 'Planner', cards: [
    { k: 'fellowship', tag: 'On your calendar', t: 'Fellowship deadline', s: 'Two writing blocks, a reminder five days before' },
    { k: 'reel', tag: 'A nudge on Sunday', t: 'Film the reel', s: 'Your hook: “how messy my head is”' },
  ] },
  { id: 'memory', label: 'Ideas', cards: [
    { k: 'cat', tag: 'Saved · research later', t: 'Functional cat clothing (cooling?)', s: 'Three open questions, nothing else done' },
  ] },
]
export const FLY_ORDER = ['who', 'proposal', 'fellowship', 'reel', 'cat']

export const DEMO_NOTES = [
  { label: 'Walk brain dump', ask: '“That guy from the maker thing” — Rohan from yesterday’s meetup?',
    say: [['Okay so, um, ', 'f'], ['that guy from the maker thing, Rohan? Send him the after-school proposal. '], ['Oh wait, ', 'f'], ['cat clothing, like useful ones? Just save it. And that fellowship, don’t let me miss it.']],
    out: [['Messages · waits for you', 'After-school proposal for Rohan', 'Drafted from your alternative-education notes', true], ['Ideas · saved', 'Functional cat clothing', 'For research later. Nothing else happens'], ['Planner', 'Fellowship deadline', 'On your calendar, with two writing blocks']] },
  { label: 'Running on empty',
    say: [['Ugh. ', 'f'], ['I’m running on empty. Move my three o’clock to Thursday '], ['and, uh, ', 'f'], ['find me something good to listen to on my walk.']],
    out: [['Planner', 'The afternoon becomes recovery time', 'Non-urgent things move to tomorrow'], ['Messages · waits for you', 'Reschedule note for the three o’clock', 'A polite note to move it to Thursday', true], ['Reading', 'One essay for your walk', 'Queued, not a feed']] },
  { label: 'Shower thought',
    say: [['Wait, ', 'f'], ['what if the reel is just my messy notes, like, on screen? '], ['Hmm. ', 'f'], ['Remind me Sunday. Not now.']],
    out: [['Ideas · saved', 'Reel: messy notes on screen', 'Saved with your exact words'], ['Planner · a nudge', 'Film the reel', 'A gentle prompt on Sunday morning']] },
]

export const DAY = [
  { cls: 't-morning', h: 'Morning', p: 'A 60-second spoken brief. Three priorities, one thing worth reading.', fg: '#13181B', bg: ['#F0EEEB'] },
  { cls: 't-midday', h: 'Midday', p: 'Deep work stays quiet. Nothing buzzes unless it truly cannot.', fg: '#13181B', bg: ['#CCD5DA', '#F0EEEB'] },
  { cls: 't-evening', h: 'Evening', p: 'What moved forward is noted. The rest is parked for tomorrow.', fg: '#F0EEEB', bg: ['#003A6C'] },
  { cls: 't-fog', h: 'Foggy day', p: 'Say you are running on empty. Rest comes first.', fg: '#F0EEEB', bg: ['#13181B'] },
]

export const LAB = [
  { h: 'Planner & Messages', p: 'Experiment 001 · Unobvious OS', live: true },
  { h: 'Errands', p: 'Coming to the lab' }, { h: 'Reading & Learning', p: 'Coming to the lab' }, { h: 'Care', p: 'Coming to the lab' },
]

export const FAQ = [
  ['What is Unobvious OS?', ['A voice-first assistant you talk to instead of look at. You press a button, say what is on your mind, and it sorts that into thoughts, ideas and decisions, then handles what it can in the background.']],
  ['Is it always listening?', ['No. It is built around press-to-speak. It listens when you press the button, in short bursts, not all day.']],
  ['Will it send messages or spend money without asking?', ['No. Anything that reaches other people, changes a shared calendar invite, or involves a payment waits for your tap. Sorting your notes, saving ideas and protecting your rest time happen quietly.']],
  ['What can it connect to?', ['Your calendar, email and messaging apps, and only if you allow it. It asks for the narrowest access each task needs, and you can withdraw your consent at any time.']],
  ['What happens to my voice notes and data?', ['We use them to run the service for you. We never sell your data or show ads, and you can ask to see, correct or delete your data at any time.']],
  ['How do I get early access?', [`The private alpha is small on purpose. Email ${EMAIL} and tell us a little about how you would use it.`]],
  ['Who is behind Unobvious?', ['Unobvious is an independent lab in Bengaluru, run by Aditi, and part of Avaia Innovations (OPC) Private Limited.']],
]

export const MANIFESTO = [
  'Modern technology is obsessed with maximizing revenue, efficiency, and screen time. In the rush to automate everything, the biggest labs are building for enterprises, leaving behind an entire generation of young builders and thinkers who did nothing wrong except arrive at the exact moment traditional entry-level paths disappeared.',
  '*Unobvious exists for the people the giants won’t build for.',
  'We believe the true measure of AI isn’t how much profit it extracts, or how many hours it keeps you tethered to a glowing screen. The real point is maximizing human fulfillment: simplifying the noise of everyday life, sharpening your curiosity, and giving you the tools to build a meaningful, self-directed life on your own terms.',
  'We build calm, ambient intelligence designed around one simple rule: helping humans live fuller lives, not busier ones.',
]

export const NAV = [['', 'Lab'], ['os', 'Unobvious OS'], ['about', 'About']]
