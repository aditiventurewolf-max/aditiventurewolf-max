import pathlib,re
S=pathlib.Path(__file__).parent;OUT=S.parent
DOMAIN="unobvious.in"
CONTACT_LOCAL="contact"          # one alias: create contact@unobvious.in before launch
PROTOTYPE=True                   # shows the "Home 1 2 3" switcher; set False for launch
WARN=set()
rd=lambda n:(S/n).read_text()
def todo(t):
    WARN.add(t);return f'<mark class="todo">{t}</mark>'
def email():
    return f"{CONTACT_LOCAL}@{DOMAIN}" if DOMAIN else todo(f"{CONTACT_LOCAL}@your-domain")
def join_href():
    return f"mailto:{CONTACT_LOCAL}@{DOMAIN}?subject=Early%20access" if DOMAIN else "about.html"
NAV=[('index.html','Lab'),('os.html','Unobvious OS'),('about.html','About')]
def head(title,desc,cls,live=False):
    nav=''.join(f'<a data-page="{h}" href="{h}">{l}</a>' for h,l in NAV)
    LIVE=';if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.className+=" live"' if live else ''
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#F6F4EF">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/ui.css"><script>document.documentElement.className+=" js"{LIVE}</script></head><body class="{cls}">
<header class="hdr" id="hdr"><div class="bar"><a class="brand" href="index.html">Unobvious</a>
<nav class="nav" id="nav" aria-label="Main">{nav}<a class="only-m" href="{join_href()}">Contact</a></nav>
<div class="right"><a href="{join_href()}">Contact</a></div>
<button class="burger" type="button" aria-expanded="false" aria-controls="nav">Menu</button></div></header>'''
def variants(cur):
    if not PROTOTYPE:return ''
    items=[('index.html','1'),('home-2.html','2'),('home-3.html','3'),('home-4.html','4')]
    links=''.join(f'<a href="{h}"'+(' aria-current="page"' if h==cur else '')+f'>{n}</a>' for h,n in items)
    return f'<div class="variants" role="navigation" aria-label="Home variations"><span>Home</span>{links}</div>'
def foot(cur,show_variants,extra_js=''):
    items=NAV+[('privacy.html','Privacy'),('terms.html','Terms'),(join_href(),'Contact')]
    links=''.join(f'<li><a href="{h}"'+(' aria-current="page"' if h==cur else '')+f'>{l}</a></li>' for h,l in items)
    mark='<svg class="f-mark" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.25" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>'
    return f'''<footer class="site-foot"><div class="f-stack">
<a class="f-brand" href="index.html" aria-label="Unobvious, home">{mark}<span>Unobvious</span></a>
<p class="f-tag">An independent lab in Bengaluru, working on technology that gives people their attention back.</p>
<nav aria-label="Footer"><ul class="f-links">{links}</ul></nav>
<p class="f-copy">© 2026 Avaia Innovations (OPC) Private Limited</p>
</div></footer>
{variants(cur) if show_variants else ''}<script src="assets/triage.js"></script><script src="assets/ui.js"></script>{extra_js}</body></html>'''
def build(src,out,title,desc,cls='',show_variants=False,live=False,extra_js=''):
    body=rd(src)
    for k in('triage','cta'):
        body=body.replace('{{'+k+'}}',rd(k+'.part'))
    body=body.replace('{{JOIN}}',join_href()).replace('{{SITE}}',f"https://www.{DOMAIN}" if DOMAIN else todo("your-domain"))
    body=re.sub(r'\{\{EMAIL(?::\w+)?\}\}',lambda m:email(),body)
    (OUT/out).write_text(head(title,desc,cls,live)+body+foot(out,show_variants,extra_js))
T='Unobvious · A lab for making everyday life simpler'
D='Unobvious is an independent lab in Bengaluru building quiet technology that gives people their attention back.'
build('home1.html','index.html',T,D,'p-home',True)
build('home2.html','home-2.html',T,D,'p-home',True)
build('home3.html','home-3.html',T,D,'p-home',True)
build('home4.html','home-4.html',T,D,'p-home',True,live=True,extra_js='<script src="assets/story.js"></script>')
build('os.html','os.html','Unobvious OS · An assistant you never look at','Press a button, say what is on your mind, and put your phone away. Unobvious OS sorts it and asks before it acts.')
build('about.html','about.html','About · Unobvious','Unobvious is an independent lab in Bengaluru, run by Aditi, building technology that gives people their attention back.')
build('privacy.html','privacy.html','Privacy Policy · Unobvious','How Unobvious collects, uses and protects personal data.')
build('terms.html','terms.html','Terms of Service · Unobvious','Terms for using Unobvious services.')
if WARN:print('TODO before launch:',', '.join(sorted(WARN)))
