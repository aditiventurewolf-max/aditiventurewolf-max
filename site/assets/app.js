(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* header: shadow, progress, mobile menu, active link */
const hdr=$('.hdr'),bar=$('.progress'),nav=$('.nav'),burger=$('.burger');
function onScroll(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hdr.classList.toggle('scrolled',y>8);if(bar)bar.style.width=(h>0?y/h*100:0)+'%';manifesto()}
addEventListener('scroll',onScroll,{passive:true});
if(burger)burger.onclick=()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const here=location.pathname.split('/').pop()||'index.html';
$$('.nav a[data-page]').forEach(a=>{if(a.dataset.page===here)a.classList.add('active')});

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.reveal,.thesis .st,.flow div').forEach(el=>io.observe(el));

/* rotating word */
const rot=$('.rot');
if(rot&&!reduce){const w=JSON.parse(rot.dataset.words);let i=0;setInterval(()=>{i=(i+1)%w.length;rot.style.transition='opacity .25s';rot.style.opacity=0;setTimeout(()=>{rot.textContent=w[i];rot.style.opacity=1},260)},2600)}

/* counters */
$$('[data-count]').forEach(el=>{const t=+el.dataset.count;const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();if(reduce){el.textContent=String(t).padStart(2,'0');return}let n=0;const s=setInterval(()=>{n++;el.textContent=String(n).padStart(2,'0');if(n>=t)clearInterval(s)},110)}});o.observe(el)});

/* manifesto word reveal */
const mt=$('.mtext');let words=[];
if(mt){$$('p',mt).forEach(p=>{const sig=p.hasAttribute('data-sig');p.innerHTML=p.textContent.trim().split(/\s+/).map(w=>`<span class="w${sig?' sig':''}">${w}</span>`).join(' ')});words=$$('.w',mt)}
function manifesto(){if(!words.length)return;const vh=innerHeight;words.forEach(w=>{const r=w.getBoundingClientRect();w.classList.toggle('on',reduce||r.top<vh*.62)})}

/* hero device */
const dev=$('#device');
if(dev){
 const PARTS={
  1:['ESP32-S3 or nRF5340','A low-power chip with Bluetooth LE. It compresses voice on the device and sends short bursts to your phone, so there is no cellular or Wi-Fi modem on your wrist.'],
  2:['Omnidirectional MEMS mic','Picks up a quiet voice from the wrist. Built for short press-to-speak bursts, not always-on listening.'],
  3:['Tactile button','One orange button. Press to speak, press again to stop.'],
  4:['Haptic actuator + status light','A linear haptic actuator gives gentle taps, and one orange light shows state. Confirmation you feel, not read.']};
 const info=$('#partinfo');let timer,run=0;
 function showPart(i){$$('.badge',dev).forEach(b=>b.classList.toggle('on',b.dataset.i==i));$$('.part',dev).forEach(p=>p.classList.toggle('on',p.dataset.i==i));
  info.innerHTML=i?`<strong>${i} · ${PARTS[i][0]}.</strong> ${PARTS[i][1]}`:'Hover a number to inspect the parts, or press the orange button.'}
 $$('.badge',dev).forEach(b=>{const i=b.dataset.i;b.addEventListener('mouseenter',()=>showPart(i));b.addEventListener('focus',()=>showPart(i));b.addEventListener('click',()=>showPart(i));b.addEventListener('mouseleave',()=>showPart(0));b.addEventListener('blur',()=>showPart(0));
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPart(i)}})});
 const trig=$('#trig'),tx=$('#tx'),chips=$('#rchips');
 const NOTE="Brain fog is heavy today. Push the vendor call to Thursday, order the ESP32-S3 board for the prototype, and queue something philosophical for my evening walk.";
 const OUT=[['state','THOUGHT','Afternoon turned into recovery'],['firm','DECISION','Vendor call → Thursday'],['firm','DECISION','ESP32-S3 order · awaiting your 1-tap'],['','IDEA','Mumford essay · queued for your walk'],['state','SCREEN TIME','0.0 seconds']];
 const led=$('#led');
 function play(){const id=++run;clearTimeout(timer);chips.innerHTML='';trig.classList.add('listening');trig.setAttribute('aria-pressed','true');if(led)led.style.opacity=1;
  let n=0;const step=()=>{if(id!==run)return;tx.innerHTML=NOTE.slice(0,n).replace(/</g,'&lt;')+'<span class="cursor"></span>';
   if(n<NOTE.length){n+=reduce?NOTE.length:2;timer=setTimeout(step,24)}else{tx.textContent=NOTE;trig.classList.remove('listening');trig.setAttribute('aria-pressed','false');
    OUT.forEach((o,k)=>setTimeout(()=>{if(id!==run)return;const c=document.createElement('span');c.className='rchip '+o[0];c.innerHTML=`<b>${o[1]}</b>${o[2]}`;chips.appendChild(c);requestAnimationFrame(()=>c.classList.add('in'))},reduce?0:300+k*380))}};step()}
 function toggle(){if(trig.classList.contains('listening')){run++;clearTimeout(timer);trig.classList.remove('listening');trig.setAttribute('aria-pressed','false');tx.textContent='Stopped. Press again to speak.'}else play()}
 trig.addEventListener('click',toggle);trig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
 tx.textContent='Press the orange button.';showPart(0);
 setTimeout(()=>{if(!run&&!reduce)play()},1400);
}

/* projects: filter + dialog */
const PROJ={
 os:{n:'001',t:'Unobvious OS',tag:'A chief of staff you talk to, not one you look at.',st:'Private alpha · Gen-1 hardware prototyping',what:'A voice-first, screenless life planner and chief of staff for audio and wrist wearables. It captures fleeting thoughts, separates loose ideas from firm decisions, protects your rest, and handles email, messages and calendars in the background.',why:'AI should live quietly in your environment and take friction away, not turn people into factory robots typing into chatbots all day.',next:'Gen-1 hardware, tighter approval loop, wider private alpha.'},
 agora:{n:'002',t:'Agora',tag:'Reading that isn’t a feed.',st:'Private alpha · Curation engine live',what:'A non-social reading and intellectual growth platform. It maps your curiosities and delivers timeless essays, primary texts and contrarian ideas at a human pace.',why:'Outrage-driven feeds optimise for attention. We want a trajectory of thought, not a scroll.',next:'Grow the interest graph and widen the alpha.'},
 socratic:{n:'003',t:'Socratic Foundry',tag:'Curiosity, turned into a 15-minute deep dive.',st:'Working MVP · Beta testing',what:'A distraction-free learning companion that turns daily curiosity and voice reflections into structured, 15-minute interactive audio and text deep dives, shaped to how you think.',why:'First principles beat rote memorisation and pre-packaged templates.',next:'Widen the beta and tighten the learning loop.'},
 zero:{n:'004',t:'Zero-Scroll Commerce',tag:'One good answer instead of ten thousand listings.',st:'Working prototype · Internal testing',what:'An anti-clutter purchasing and replenishment engine. It filters noisy marketplace listings down to one high-trust, ingredient-verified food or household match, queued for one-tap approval.',why:'Choice overload is a cost. Decision intelligence should remove it.',next:'Move from internal testing to a small beta.'},
 kibble:{n:'005',t:'Kibble & Kindred',tag:'Daily care for pets, made simple.',st:'Working MVP · Beta cohort',what:'An AI-guided nutrition, routine and preventive-care companion for pets. It turns breed biometrics and dietary sensitivities into personalised feeding plans and automated replenishment.',why:'Good pet care is mostly consistency, and consistency is a systems problem.',next:'Grow the beta cohort and close the replenishment loop.'},
 foundry:{n:'006',t:'Foundry',tag:'The capability graph for Indian builders, from unit one to scale.',st:'Concept · Bengaluru vendor mapping',what:'A zero-middleman accountability rail connecting solopreneurs and early-stage startups with verified Indian manufacturers, printers and finishers. Plain-language ideas become factory-ready RFQs, orders are locked into one source of truth, and money moves on milestone photo proof, with GST invoices generated automatically.',why:'Making a physical thing in India shouldn\u2019t run on WhatsApp, excuses and who you happen to know.',next:'Map and verify makers in Bengaluru, starting with industrial clusters.'},
 youth:{n:'007',t:'Youth Design Labs',tag:'School designed around the learner.',st:'In planning · Bengaluru',what:'An after-school design program for ages 10\u201315: first-principles thinking, applied making and systems design, and calm self-directed exploration, in 10-week cycles that end with a public demo and exhibition day.',why:'Learners should redesign the systems around them from scratch, not memorise templates.',next:'Confirm host spaces and run the first proof workshop.'}};
const dlg=$('#pdlg');
function open(id){const p=PROJ[id];if(!p||!dlg)return;$('.dn',dlg).textContent=p.n+' · Lab index';$('#dtitle',dlg).textContent=p.t;$('.tl',dlg).textContent=p.tag;
 $('dl',dlg).innerHTML=`<dt>Status</dt><dd>${p.st}</dd><dt>What</dt><dd>${p.what}</dd><dt>Why</dt><dd>${p.why}</dd><dt>Next</dt><dd>${p.next}</dd>`;dlg.showModal()}
$$('.card').forEach(c=>c.addEventListener('click',()=>open(c.dataset.id)));
if(dlg){dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});$('.xbtn',dlg).onclick=()=>dlg.close()}
$$('.fbtn').forEach(b=>b.addEventListener('click',()=>{$$('.fbtn').forEach(x=>x.setAttribute('aria-pressed',x===b));const f=b.dataset.f;$$('.card').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.s!==f));const n=$$('.card:not(.hide)').length;const cnt=$('#fcount');if(cnt)cnt.textContent=n+(n===1?' project':' projects')}));

/* stepper (Foundry) */
const STEPS=[
 ['Describe it','Tell Foundry what you want to make in plain language, or drop in a rough sketch. No spec sheet, no jargon.','<b>You:</b> "Recycled-cotton tote bags, one-colour screen print, 200 units, in three weeks."'],
 ['Spec Translator','Your idea becomes a factory-ready request for quote that any maker can read and price the same way.','<b>RFQ</b><br>Item: tote bag · Qty: 200<br>Material: recycled cotton · Print: 1 colour<br>Lead time: 21 days'],
 ['Capability Graph','Matched on the machines a maker actually owns, their certifications and real minimum order quantities, from 1 to 50,000. Not directory listings or resellers.','<b>3 verified makers</b> fit this job<br>Machine, MOQ and track record checked'],
 ['Locked Order Card','One source of truth for the visual spec, price and hard delivery dates. A mutual NDA and sample agreement are generated for you, and any timeline slip is logged on the maker\u2019s profile.','<b>Order card locked</b><br>Spec · Price · Delivery date<br>Slips are logged, not forgotten'],
 ['Milestone proof','Money unlocks only on timestamped photo or video proof at each stage. If a maker stalls, one click re-routes the locked card to a verified backup.','<b>Raw material ready</b> ✓ → <b>Sample done</b> ✓ → Packed &amp; dispatched<br>Photo proof attached at each step'],
 ['GST invoice','Invoices are generated automatically on delivery confirmation, and the maker\u2019s reliability score updates: on-time dispatch, sample-to-bulk accuracy and response discipline.','<b>Invoice generated</b> · GST included<br>Reliability score updated']];
const sb=$('.steps');
if(sb){STEPS.forEach((s,i)=>{const b=document.createElement('button');b.className='step';b.setAttribute('role','tab');b.innerHTML=`<span class="n">0${i+1}</span>${s[0]}`;b.onclick=()=>pick(i);sb.appendChild(b)});
 function pick(i){$$('.step',sb).forEach((b,j)=>b.setAttribute('aria-selected',i===j));$('#sh3').textContent=STEPS[i][0];$('#sp').textContent=STEPS[i][1];$('#smock').innerHTML=STEPS[i][2]}pick(0)}

/* agents */
const AG=[
 ['Cognitive Triage','Entry layer','Reads every raw voice note and splits it before anything else happens.','Sorts it into THOUGHT (reflections, moods, energy: pacing signals), IDEA (kept in an incubator, never your to-do list) and DECISION (becomes an action and updates your priorities).'],
 ['Life Planner','Energy guardian','Protects rest boundaries, manages your calendar and paces your workload.','Reads energy signals, shifts non-urgent meetings, and enforces hard stop-work windows.'],
 ['Comms','Relationships','Handles outreach, scheduling and follow-ups.','Drafts messages in your tone and queues anything external for your one-tap approval.'],
 ['Ops & Procurement','Physical world','Manages hardware sourcing and vendor accountability.','Tracks components, generates standard RFQs, logs vendor milestones and flags delays.'],
 ['Intel Curator','Reading & replenishment','Runs quiet background curation.','Matches your curiosity to one or two high-signal essays a day and surfaces single-match reorders.']];
const ag=$('.agents');
if(ag){AG.forEach((a,i)=>{const b=document.createElement('button');b.className='agent';b.setAttribute('role','tab');b.innerHTML=`<span class="mono">0${i+1} · ${a[1]}</span><b>${a[0]}</b>`;b.onclick=()=>pk(i);ag.appendChild(b)});
 function pk(i){$$('.agent',ag).forEach((b,j)=>b.setAttribute('aria-selected',i===j));$('#ad1').textContent=AG[i][2];$('#ad2').textContent=AG[i][3]}pk(0)}
onScroll();
})();
