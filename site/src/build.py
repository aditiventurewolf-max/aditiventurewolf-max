import pathlib,re
S=pathlib.Path(__file__).parent;OUT=S.parent
# Set DOMAIN before launch. One alias serves general contact, privacy and grievance mail: create it.
DOMAIN="unobvious.in"
CONTACT_LOCAL="contact"
PROTOTYPE=True  # shows the palette switcher; set False for launch
PAGES=[('index.html','Lab'),('os.html','Unobvious OS'),('about.html','About')]
WARN=set()
rd=lambda n:(S/n).read_text()
def todo(t):
    WARN.add(t);return f'<mark class="todo">{t}</mark>'
def email(local=None):
    return f"{CONTACT_LOCAL}@{DOMAIN}" if DOMAIN else todo(f"{CONTACT_LOCAL}@your-domain")
def join_href():
    return f"mailto:{CONTACT_LOCAL}@{DOMAIN}?subject=Private%20alpha" if DOMAIN else "about.html"
def head(title,desc):
    nav=''.join(f'<a data-page="{h}" href="{h}">{l}</a>' for h,l in PAGES)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#F3F5F2">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css"></head><body{' data-proto' if PROTOTYPE else ''}>
<header class="hdr"><div class="wrap"><a class="brand" href="index.html"><i></i>Unobvious</a>
<button class="burger" aria-expanded="false" aria-controls="nav">Menu</button>
<nav class="nav" id="nav">{nav}<a class="pill" href="{join_href()}">Join the alpha</a></nav></div></header>'''
def foot():
    links=''.join(f'<a href="{h}">{l}</a>' for h,l in PAGES)
    return f'''<footer><div class="wrap"><div class="row"><div><a class="brand" href="index.html"><i></i>Unobvious</a>
<p>An independent lab in Bengaluru, working on technology that gives people their attention back.<br>© Avaia Innovations (OPC) Private Limited</p></div>
<div class="links">{links}<a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div></div></div></footer>
<script src="assets/triage.js"></script><script src="assets/app.js"></script></body></html>'''
def build(src,title,desc):
    body=rd(src)
    for k in('device','triage','cta'):
        body=body.replace('{{'+k+'}}',rd(k+'.part'))
    body=body.replace('{{JOIN}}',join_href()).replace('{{SITE}}',f"https://www.{DOMAIN}" if DOMAIN else todo("your-domain"))
    body=re.sub(r'\{\{EMAIL(?::\w+)?\}\}',lambda m:email(),body)
    body=re.sub(r'\{\{todo:([^}]+)\}\}',lambda m:todo(m.group(1)),body)
    (OUT/src).write_text(head(title,desc)+body+foot())
build('index.html','Unobvious · A lab for making everyday life simpler','Unobvious is an independent lab in Bengaluru building quiet technology that gives people their attention back. Start with Unobvious OS.')
build('os.html','Unobvious OS · An assistant you never look at','Unobvious OS: press a button, say what is on your mind, and put your phone away. It sorts, handles what it can, and asks before it acts.')
build('about.html','About · Unobvious','Unobvious is an independent lab in Bengaluru, run by Aditi, building technology that gives people their attention back.')
build('privacy.html','Privacy Policy · Unobvious','How Unobvious collects, uses and protects personal data.')
build('terms.html','Terms of Service · Unobvious','Terms for using Unobvious services.')
if WARN:print('TODO before launch:',', '.join(sorted(WARN)))
