(function(){
var q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,mo=root.classList.contains('mo');
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};

/* nav: current page, phone menu */
var here=location.pathname.split('/').pop()||'index.html';
qa('.nav ul a').forEach(function(a){if(a.getAttribute('href')===here)a.setAttribute('aria-current','page')});
var nav=q('.nav'),burger=q('.burger');
if(burger)burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Close':'Menu'});

/* back to top */
qa('.top').forEach(function(t){t.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:mo?'smooth':'auto'})})});

/* live contrast on day tiles (text colour against the surface it sits on) */
function hex(n){var h=getComputedStyle(root).getPropertyValue(n).trim().replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
function lum(c){return c.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce(function(a,v,i){return a+v*[.2126,.7152,.0722][i]},0)}
var PAIRS={'t-morning':['--night',['--moon']],'t-midday':['--night',['--fog','--moon']],'t-evening':['--moon',['--deep']],'t-fog':['--moon',['--night']]};
qa('.tile').forEach(function(t){var k=Object.keys(PAIRS).find(function(c){return t.classList.contains(c)});if(!k)return;
  var fg=lum(hex(PAIRS[k][0])),w=Math.min.apply(null,PAIRS[k][1].map(function(b){var bg=lum(hex(b));return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)}));
  var c=q('[data-cr]',t);if(c)c.textContent='◐ '+w.toFixed(2)+':1'});

/* FAQ: one open at a time; arrow keys move between questions */
var faq=q('.faq-list');
if(faq){var items=qa('.faq-item',faq),btns=items.map(function(it){return q('button',it)});
  function setOpen(it,o){it.classList.toggle('is-open',o);q('button',it).setAttribute('aria-expanded',o?'true':'false')}
  btns.forEach(function(b,i){b.addEventListener('click',function(){var it=items[i],o=it.classList.contains('is-open');items.forEach(function(x){setOpen(x,false)});if(!o)setOpen(it,true)});
    b.addEventListener('keydown',function(e){var n=-1;if(e.key==='ArrowDown')n=(i+1)%btns.length;else if(e.key==='ArrowUp')n=(i-1+btns.length)%btns.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=btns.length-1;if(n>-1){e.preventDefault();btns[n].focus()}})});
  setOpen(items[0],true)}

/* OS page: the messy-note demo */
var demo=q('.demo');
if(demo){
  var NOTES=[
   {label:'Walk brain dump',say:[['Okay so, um, ','f'],['that guy from the maker thing, Rohan? Send him the after-school proposal. '],['Oh wait, ','f'],['cat clothing, like useful ones? Just save it. And that fellowship, don’t let me miss it.']],
    out:[['Messages · waits for you','After-school proposal for Rohan','Drafted from your alternative-education notes',1],['Ideas · saved','Functional cat clothing','For research later. Nothing else happens'],['Planner','Fellowship deadline','On your calendar, with two writing blocks']],
    ask:'“That guy from the maker thing” — Rohan from yesterday’s meetup?'},
   {label:'Running on empty',say:[['Ugh. ','f'],['I’m running on empty. Move my three o’clock to Thursday '],['and, uh, ','f'],['find me something good to listen to on my walk.']],
    out:[['Planner','The afternoon becomes recovery time','Non-urgent things move to tomorrow'],['Messages · waits for you','Reschedule note for the three o’clock','A polite note to move it to Thursday',1],['Reading','One essay for your walk','Queued, not a feed']]},
   {label:'Shower thought',say:[['Wait, ','f'],['what if the reel is just my messy notes, like, on screen? '],['Hmm. ','f'],['Remind me Sunday. Not now.']],
    out:[['Ideas · saved','Reel: messy notes on screen','Saved with your exact words'],['Planner · a nudge','Film the reel','A gentle prompt on Sunday morning']]}
  ];
  var chips=q('.chips',demo),ramble=q('.ramble',demo),res=q('.results',demo),run=0;
  NOTES.forEach(function(n,i){var b=document.createElement('button');b.className='chip';b.type='button';b.textContent=n.label;b.setAttribute('aria-pressed','false');b.onclick=function(){play(i)};chips.appendChild(b)});
  function html(parts,n){var o='',left=n;parts.forEach(function(p){if(left<=0)return;var s=p[0].slice(0,left);left-=s.length;o+=p[1]?'<span class="f">'+s+'</span>':s});return o}
  function play(i){var id=++run,n=NOTES[i],len=n.say.reduce(function(a,p){return a+p[0].length},0),k=0;
    qa('.chip',chips).forEach(function(c,j){c.setAttribute('aria-pressed',j===i?'true':'false')});res.innerHTML='';
    (function step(){if(id!==run)return;ramble.innerHTML=html(n.say,k)+(k<len?'<span class="cur"></span>':'');
      if(k<len){k+=mo?2:len;setTimeout(step,22)}else sort(n,id)})()}
  function sort(n,id){var delay=0;
    if(n.ask){var a=document.createElement('div');a.className='ask';a.innerHTML='<p>'+n.ask+'</p><button class="pill pill-sm pill-line" type="button">Yes, him</button>';res.appendChild(a);
      setTimeout(function(){if(id===run)a.classList.add('in')},200);q('button',a).onclick=function(){this.textContent='Yes, him ✓'};delay=500}
    n.out.forEach(function(o,j){setTimeout(function(){if(id!==run)return;var d=document.createElement('div');d.className='res'+(o[3]?' gate':'');d.style.setProperty('--r',((j%2?1:-1)*3)+'deg');
      d.innerHTML='<p class="m k">'+o[0]+'</p><h4>'+o[1]+'</h4><p>'+o[2]+'</p>'+(o[3]?'<button class="pill pill-sm pill-hot send" type="button">Send it</button>':'');res.appendChild(d);
      requestAnimationFrame(function(){d.classList.add('in')});var s=q('.send',d);if(s)s.onclick=function(){d.classList.add('sent');s.textContent='Sent ✓';q('.k',d).textContent='Sent · after your tap'}},mo?delay+300+j*450:0)})}
  if(mo&&'IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();play(0)}},{threshold:.3});o.observe(demo)}else play(0);
}

/* About: the manifesto assembles from scattered notes as you read */
var man=q('.manif');var ws=[];
if(man){var R=(function(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})(5);
  qa('p',man).forEach(function(p){var key=p.classList.contains('key');p.innerHTML=p.textContent.trim().split(/\s+/).map(function(w){return '<span class="w'+(key?' key':'')+'" style="--x:'+((R()-.5)*90).toFixed(0)+'px;--y:'+((R()-.5)*60).toFixed(0)+'px;--r:'+((R()-.5)*24).toFixed(0)+'deg">'+w+'</span>'}).join(' ')});
  ws=qa('.w',man)}
function words(){if(!ws.length)return;var vh=innerHeight;ws.forEach(function(w){w.classList.toggle('on',!mo||w.getBoundingClientRect().top<vh*.72)})}
addEventListener('scroll',words,{passive:true});words();

/* 404: a little mess */
var lost=q('.lost-frags');
if(lost){var T=['where was it','um','that page?','wait—','404?','I swear it was here','reel idea','cat clothes??','Sunday?','the link','hmm'],R2=(function(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})(3);
  T.forEach(function(t){var s=document.createElement('span');s.textContent=t;s.style.left=(R2()*80+5)+'%';s.style.top=(R2()*80+8)+'%';s.style.setProperty('--s',(14+R2()*26)+'px');s.style.setProperty('--b',(R2()*4).toFixed(1)+'px');s.style.setProperty('--r',((R2()-.5)*24).toFixed(0)+'deg');lost.appendChild(s)})}

/* OS hero: focus frame follows the pointer */
var lens=q('.lens');
if(lens&&mo&&matchMedia('(hover:hover)').matches){var hero=lens.closest('section'),cur={x:.13,y:.38},tgt={x:.13,y:.38},raf=0,fw=.36,fh=.36;
  function t(){cur.x+=(tgt.x-cur.x)*.12;cur.y+=(tgt.y-cur.y)*.12;lens.style.setProperty('--fx',cur.x.toFixed(4));lens.style.setProperty('--fy',cur.y.toFixed(4));raf=(Math.abs(tgt.x-cur.x)+Math.abs(tgt.y-cur.y)>.0005)?requestAnimationFrame(t):0}
  hero.addEventListener('pointermove',function(e){var r=lens.getBoundingClientRect();tgt.x=clamp((e.clientX-r.left)/r.width-fw/2,-.05,1.05-fw);tgt.y=clamp((e.clientY-r.top)/r.height-fh/2,0,1-fh);if(!raf)raf=requestAnimationFrame(t)});
  hero.addEventListener('pointerleave',function(){tgt.x=.13;tgt.y=.38;if(!raf)raf=requestAnimationFrame(t)})}

/* reveals: blur in, or settle from chaos into place */
if(!mo){qa('.rev,.settle,.close,footer').forEach(function(n){n.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.08});
qa('.rev,.settle,.close,footer').forEach(function(n){io.observe(n)});
})();
