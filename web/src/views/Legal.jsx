import privacyRaw from '../../../site/src/privacy.html?raw'
import termsRaw from '../../../site/src/terms.html?raw'
import { Atmos, Words, Reveal } from '../components/ui'
import { EMAIL } from '../lib/content'

// Reuse the legal text from the static site so there is one source of truth.
function extract(raw) {
  const title = (raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || ''
  const updated = (raw.match(/<p class="m"[^>]*>(Last updated[^<]*)<\/p>/) || [])[1] || ''
  const body = (raw.match(/<div class="legalpage">([\s\S]*?)<\/div>\s*<\/section>/) || [])[1] || ''
  return { title, updated, body: body.replace(/\{\{SITE\}\}/g, 'https://www.unobvious.in').replace(/\{\{EMAIL(:\w+)?\}\}/g, EMAIL) }
}
const DOCS = { privacy: extract(privacyRaw), terms: extract(termsRaw) }

export default function Legal({ which }) {
  const d = DOCS[which]
  return (
    <main id="main">
      <section className="dark" style={{ padding: '150px var(--gut) 24px' }} aria-labelledby="legal-h">
        <Atmos />
        <div className="wrap" style={{ maxWidth: 740 }}>
          <Reveal as="p" className="m">Legal</Reveal>
          <h1 id="legal-h" className="display" style={{ marginTop: 16, fontSize: 'clamp(44px,6vw,84px)' }}><Words text={d.title} /></h1>
          <Reveal as="p" className="m" style={{ marginTop: 18 }} delay={.3}>{d.updated}</Reveal>
        </div>
      </section>
      <Reveal className="legalpage" delay={.2}><div dangerouslySetInnerHTML={{ __html: d.body }} /></Reveal>
    </main>
  )
}
