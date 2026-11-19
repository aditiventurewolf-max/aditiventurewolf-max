"""Builds the Unobvious site from src/ into the site root. Run: python3 src/build.py
Every page shares one head, nav and footer. See DESIGN.md and SHOWCASE.md."""
import pathlib,re
S=pathlib.Path(__file__).parent;OUT=S.parent
DOMAIN="unobvious.in"
CONTACT_LOCAL="contact"          # one alias: create contact@unobvious.in before launch
rd=lambda n:(S/n).read_text()
def email():return f"{CONTACT_LOCAL}@{DOMAIN}"
def join_href():return f"mailto:{CONTACT_LOCAL}@{DOMAIN}?subject=Early%20access"
NAV=[('index.html','Lab'),('os.html','Unobvious OS'),('about.html','About')]
MARK='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square"><path d="M8 22V8h14M42 8h14v14M56 42v14H42M22 56H8V42"/></g><circle cx="32" cy="32" r="9" fill="#FFBF65"/></svg>'

def head(title,desc,css,live):
    links=''.join(f'<li><a href="{h}">{l}</a></li>' for h,l in NAV)
    styles=''.join(f'<link rel="stylesheet" href="assets/{c}">' for c in ['site.css']+css)
    flag='document.documentElement.classList.add("js");if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("mo")'+(';document.documentElement.classList.add("live")' if live else '')+'}'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#13181B">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
{styles}<script>{flag}</script></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav"><a class="brand" href="index.html" aria-label="Unobvious, home">{MARK}Unobvious</a>
<nav aria-label="Main"><ul id="menu">{links}</ul></nav>
<a class="pill pill-hot pill-sm" href="{join_href()}">Early access</a>
<button class="burger" type="button" aria-expanded="false" aria-controls="menu">Menu</button></header>'''

def foot(js):
    items=NAV+[('privacy.html','Privacy'),('terms.html','Terms'),(join_href(),'Contact')]
    links=''.join(f'<li><a href="{h}">{l}</a></li>' for h,l in items)
    scripts=''.join(f'<script src="assets/{j}"></script>' for j in js+['site.js'])
    return f'''<footer class="dark" style="padding:0 var(--gut)"><div class="wrap">
<div class="foot"><div><a class="brand" href="index.html">{MARK}Unobvious</a><p>An independent lab in Bengaluru. Quiet technology that takes the mess in your head and gives you back the meaning.</p></div>
<nav aria-label="Footer"><ul>{links}</ul></nav></div>
<div class="strip m"><span>© 2026 Avaia Innovations (OPC) Private Limited</span><span>Bengaluru · 12.97° N 77.59° E</span><a class="top" href="#">Back to top ↑</a></div>
</div><p class="bigword" aria-hidden="true">Unobvious</p></footer>
{scripts}</body></html>'''

def build(src,out,title,desc,css=(),js=(),live=False):
    body=rd(src).replace('{{close}}',rd('close.part'))
    body=body.replace('{{JOIN}}',join_href()).replace('{{SITE}}',f"https://www.{DOMAIN}")
    body=re.sub(r'\{\{EMAIL(?::\w+)?\}\}',lambda m:email(),body)
    page=head(title,desc,list(css),live)+body+foot(list(js))
    page=page.replace('class="close dark"','class="close dark"')
    (OUT/out).write_text(page)

build('home.html','index.html','Unobvious · You think. It handles the rest.',
      'Unobvious is a lab in Bengaluru. Its first experiment, Unobvious OS, is a quiet system behind one button: say it messy, and it sorts it, gets it done, and asks first.',
      css=['showcase.css'],js=['showcase.js'],live=True)
build('os.html','os.html','Unobvious OS · An assistant you talk to, not look at',
      'Press once, say what is on your mind, however messy, and put your phone away. Unobvious OS sorts it and asks before anything leaves your hands.')
build('about.html','about.html','About · Unobvious','Unobvious is an independent lab in Bengaluru, run by Aditi, building quiet technology for the people the giants won’t build for.')
build('privacy.html','privacy.html','Privacy Policy · Unobvious','How Unobvious collects, uses and protects personal data.')
build('terms.html','terms.html','Terms of Service · Unobvious','Terms for using Unobvious services.')
build('404.html','404.html','Lost in the mess · Unobvious','This page could not be found.')
(OUT/'brand.html').write_text(rd('brand.html'))
print('built: index, os, about, privacy, terms, 404, brand')
