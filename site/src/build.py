import pathlib
S=pathlib.Path(__file__).parent;OUT=S.parent
# Set DOMAIN (e.g. "example.com") before launch. Left blank on purpose: never publish a made-up address.
# Anything that needs it renders as a highlighted TODO until this is filled in.
DOMAIN="unobvious.in"
# One alias serves general contact, privacy and grievance mail. Create it before launch.
CONTACT_LOCAL="contact"
WARN=set()
def todo(t):
    WARN.add(t);return f'<mark class="todo">{t}</mark>'
def email(local):
    return f"{CONTACT_LOCAL}@{DOMAIN}" if DOMAIN else todo(f"{CONTACT_LOCAL}@your-domain")
rd=lambda n:(S/n).read_text()
PAGES=[('index.html','Lab'),('products.html','Products'),('architecture.html','Architecture'),('about.html','About')]
def head(title,desc):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#F6F4EF">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css"></head><body>
<header class="hdr"><div class="wrap"><a class="brand" href="index.html"><i></i>Unobvious</a>
<button class="burger" aria-expanded="false" aria-controls="nav">Menu</button>
<nav class="nav" id="nav">{''.join(f'<a data-page="{h}" href="{h}">{l}</a>' for h,l in PAGES)}<a class="pill" href="{contact_href()}">Get in touch</a></nav></div><div class="progress"></div></header>'''
def contact_href():
    return f"mailto:{CONTACT_LOCAL}@{DOMAIN}" if DOMAIN else "about.html#contact"
def foot():
    return f'''<footer><div class="wrap"><div class="row"><div><a class="brand" href="index.html" style="color:var(--paper)"><i></i>Unobvious</a>
<p>An independent applied AI, hardware and systems design studio, working on systems, products and institutions that work for the people using them.</p></div>
<div>{''.join(f'<a href="{h}">{l}</a>' for h,l in PAGES)}</div></div>
<div class="mega" aria-hidden="true">Unobvious</div>
<div class="legal mono"><span>© Avaia Innovations (OPC) Private Limited · Bengaluru, Karnataka, India</span><span><a href="privacy.html" style="display:inline;margin:0 14px 0 0">Privacy</a><a href="terms.html" style="display:inline;margin:0">Terms</a></span></div></div></footer>
<script src="assets/triage.js"></script><script src="assets/app.js"></script></body></html>'''
def build(src,title,desc):
    body=rd(src)
    for k in('manifesto','triage','cta'):
        body=body.replace('{{'+k+'}}',rd(k+'.part'))
    body=body.replace('{{CONTACT}}',contact_href()).replace('{{SITE}}',f"https://www.{DOMAIN}" if DOMAIN else todo("your-domain"))
    import re
    body=re.sub(r'\{\{EMAIL:(\w+)\}\}',lambda m:email(m.group(1)),body)
    (OUT/src).write_text(head(title,desc)+body+foot())
build('index.html','Unobvious · Systems that make life simpler, not busier','An independent studio in Bengaluru building products, systems and institutions around the person using them. Starting with Unobvious OS.')
build('products.html','Products · Unobvious','Everything on the Unobvious bench, with what it is, why it exists, and where it stands.')
build('architecture.html','Architecture · Unobvious OS','How Unobvious OS listens, triages, routes to scoped agents, and asks before it acts.')
build('privacy.html','Privacy Policy · Unobvious','How Unobvious collects, uses and protects personal data.')
build('terms.html','Terms of Service · Unobvious','Terms for using Unobvious services.')
build('about.html','About · Unobvious','Unobvious is a studio of Avaia Innovations (OPC) Private Limited in Bengaluru.')

if WARN:print('TODO before launch:',', '.join(sorted(WARN)))
