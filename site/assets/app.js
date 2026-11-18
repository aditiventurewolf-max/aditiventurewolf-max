(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const safe=f=>{try{return f()}catch(e){return null}};

/* palette (prototype only) */
const root=document.documentElement;
const pal=safe(()=>localStorage.getItem('pal'));if(pal==='b')root.dataset.pal='b';
if(document.body.hasAttribute('data-proto')){
 const w=document.createElement('div');w.className='palswitch';w.innerHTML='<span>Palette</span><button type="button" data-p="a">Mist</button><button type="button" data-p="b">Paper</button>';document.body.appendChild(w);
 const set=p=>{if(p==='b')root.dataset.pal='b';else delete root.dataset.pal;$$('button',w).forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===p));safe(()=>localStorage.setItem('pal',p))};
 $$('button',w).forEach(b=>b.onclick=()=>set(b.dataset.p));set(root.dataset.pal==='b'?'b':'a');
}

/* header */
const hdr=$('.hdr'),nav=$('.nav'),burger=$('.burger');
const onScroll=()=>{hdr.classList.toggle('scrolled',scrollY>8);words()};addEventListener('scroll',onScroll,{passive:true});
if(burger)burger.onclick=()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const here=location.pathname.split('/').pop()||'index.html';
$$('.nav a[data-page]').forEach(a=>{if(a.dataset.page===here)a.classList.add('active')});

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

/* teaser cards: tap to reveal on touch */
$$('.xcard:not(.live)').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('open')));

/* typing helper */
function typeInto(el,text,id,get,done){let n=0;const step=()=>{if(id!==get())return;el.innerHTML=text.slice(0,n).replace(/</g,'&lt;')+'<span class="cursor"></span>';
 if(n<text.length){n+=reduce?text.length:2;setTimeout(step,24)}else{el.textContent=text;if(done)done()}};step()}
function chip(box,o,delay,id,get){setTimeout(()=>{if(id!==get())return;const c=document.createElement('span');c.className='rchip '+o[0];c.innerHTML=`<b>${o[1]}</b>${o[2]}`;box.appendChild(c);requestAnimationFrame(()=>c.classList.add('in'))},reduce?0:delay)}

/* mini demo on home (loops) */
const mini=$('.mini');
if(mini){const note=mini.dataset.note,outs=JSON.parse(mini.dataset.outs),tx=$('.tx',mini),box=$('.rchips',mini);let run=0;const get=()=>run;
 const cycle=()=>{const id=++run;box.innerHTML='';typeInto(tx,note,id,get,()=>{outs.forEach((o,k)=>chip(box,o,300+k*420,id,get));if(!reduce)setTimeout(()=>{if(id===run)cycle()},9000)})};
 const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();cycle()}},{threshold:.4});o.observe(mini)}

/* device on OS page */
const dev=$('#device');
if(dev){
 const PARTS={
  1:['Brain','A low-power chip with Bluetooth. It compresses your voice on the device and sends short bursts to your phone, so there is no cellular or Wi-Fi modem on your wrist.'],
  2:['Microphone','Picks up a quiet voice from your wrist. Built for press-to-speak, not always-on listening.'],
  3:['Button','One orange button. Press to speak, press again to stop.'],
  4:['Haptics and light','Gentle taps and one small light confirm things. You feel the answer instead of reading it.']};
 const info=$('#partinfo');let run=0;const get=()=>run;
 const showPart=i=>{$$('.badge',dev).forEach(b=>b.classList.toggle('on',b.dataset.i==i));$$('.part',dev).forEach(p=>p.classList.toggle('on',p.dataset.i==i));
  info.innerHTML=i?`<strong>${PARTS[i][0]}.</strong> ${PARTS[i][1]}`:'Hover a number to inspect the parts, or press the orange button.'};
 $$('.badge',dev).forEach(b=>{const i=b.dataset.i;['mouseenter','focus','click'].forEach(ev=>b.addEventListener(ev,()=>showPart(i)));['mouseleave','blur'].forEach(ev=>b.addEventListener(ev,()=>showPart(0)));
  b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPart(i)}})});
 const trig=$('#trig'),tx=$('#tx'),chips=$('#rchips'),led=$('#led');
 const NOTE="Brain fog is heavy today. Push the vendor call to Thursday, order the ESP32-S3 board for the prototype, and queue something philosophical for my evening walk.";
 const OUT=[['state','THOUGHT','Afternoon turned into recovery'],['firm','DECISION','Vendor call moved to Thursday'],['firm','DECISION','Board order waiting for your tap'],['','IDEA','Mumford essay queued for your walk'],['state','SCREEN TIME','0.0 seconds']];
 const play=()=>{const id=++run;chips.innerHTML='';trig.classList.add('listening');trig.setAttribute('aria-pressed','true');if(led)led.style.opacity=1;
  typeInto(tx,NOTE,id,get,()=>{trig.classList.remove('listening');trig.setAttribute('aria-pressed','false');OUT.forEach((o,k)=>chip(chips,o,300+k*380,id,get))})};
 const toggle=()=>{if(trig.classList.contains('listening')){run++;trig.classList.remove('listening');trig.setAttribute('aria-pressed','false');tx.textContent='Stopped. Press again to speak.'}else play()};
 trig.addEventListener('click',toggle);trig.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
 tx.textContent='Press the orange button.';showPart(0);
 const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();setTimeout(()=>{if(!run&&!reduce)play()},800)}},{threshold:.5});o.observe(dev);
}

/* manifesto word reveal (about) */
const mt=$('.mtext');let ws=[];
if(mt){$$('p',mt).forEach(p=>{const sig=p.hasAttribute('data-sig');p.innerHTML=p.textContent.trim().split(/\s+/).map(w=>`<span class="w${sig?' sig':''}">${w}</span>`).join(' ')});ws=$$('.w',mt)}
function words(){if(!ws.length)return;const vh=innerHeight;ws.forEach(w=>{w.classList.toggle('on',reduce||w.getBoundingClientRect().top<vh*.7)})}
onScroll();
})();
