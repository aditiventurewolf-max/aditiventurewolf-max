(function(){
var q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,motion=root.classList.contains('js');
var NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function txt(x,y,s,attrs,parent){var t=el('text',Object.assign({x:x,y:y},attrs||{}),parent);t.textContent=s;return t}
var MONO="IBM Plex Mono, ui-monospace, monospace";

/* ---------- 02 chart: cumulative steps for one task ---------- */
var tr=q('.pz-traces');
if(tr){
  var W=560,H=360,L=48,R=40,T=24,B=44,iw=W-L-R,ih=H-T-B,maxY=9;
  var X=function(t){return L+t*iw},Y=function(v){return T+ih-(v/maxY)*ih};
  for(var v=0;v<=9;v+=3){el('line',{x1:L,x2:W-R,y1:Y(v),y2:Y(v),stroke:'rgba(239,239,238,.12)','stroke-width':1},tr);txt(L-14,Y(v)+4,String(v),{'text-anchor':'end',fill:'#A9AAB0','font-family':MONO,'font-size':11},tr)}
  txt(L,H-12,'TASK STARTS',{fill:'#A9AAB0','font-family':MONO,'font-size':10,'letter-spacing':'1.4'},tr);
  txt(W-R,H-12,'TASK DONE',{'text-anchor':'end',fill:'#A9AAB0','font-family':MONO,'font-size':10,'letter-spacing':'1.4'},tr);
  // a staircase from the step times: each step lifts the line by one
  function stairs(times){var d='M'+X(0)+' '+Y(0),c=0;times.forEach(function(t){d+=' H'+X(t).toFixed(1)+' V'+Y(++c).toFixed(1)});return d+' H'+X(1)}
  var ref=[.08,.18,.28,.38,.48,.6,.7,.82,.92];   // unlock, open calendar, find, open, edit, save, open mail, write, send
  var acc=[.1,.86];                                // say it, tap to approve
  var p1=el('path',{d:stairs(ref),fill:'none',stroke:'#6E6F76','stroke-width':1.5,class:'draw'},tr);
  var p2=el('path',{d:stairs(acc),fill:'none',stroke:'#FF8A47','stroke-width':2.5,class:'draw'},tr);
  txt(X(1)+8,Y(9)+4,'9',{fill:'#C7C8CC','font-family':MONO,'font-size':11},tr);
  txt(X(1)+8,Y(2)+4,'2',{fill:'#FF8A47','font-family':MONO,'font-size':11},tr);
  [p1,p2].forEach(function(p){p.style.setProperty('--len',p.getTotalLength())});
  tr.closest('figure').classList.add('pz-flowhost');
}

/* ---------- 03 diagram: one note, followed ---------- */
var fl=q('.pz-flow');
if(fl){
  var N={x:80,y:260},G={x:430},D={x:530},rows={thought:110,idea:260,decision:410},X2=300;
  // construction geometry: faint guides and rings around the note
  [40,64,92].forEach(function(r){el('circle',{cx:N.x,cy:N.y,r:r,fill:'none',stroke:'rgba(13,13,15,.10)','stroke-width':1},fl)});
  [X2,G.x].forEach(function(x){el('line',{x1:x,x2:x,y1:60,y2:470,stroke:'rgba(13,13,15,.10)','stroke-width':1,'stroke-dasharray':'3 5'},fl)});
  function branch(y){return 'M'+(N.x+26)+' '+N.y+' C'+(N.x+130)+' '+N.y+' '+(X2-130)+' '+y+' '+X2+' '+y}
  // thought and idea branches are light; the decision path is the heavy one that draws itself in
  el('path',{d:branch(rows.thought)+' H'+G.x,fill:'none',stroke:'#43444A','stroke-width':1.25},fl);
  el('path',{d:branch(rows.idea)+' H'+G.x,fill:'none',stroke:'#43444A','stroke-width':1.25},fl);
  var main=el('path',{d:branch(rows.decision)+' H'+D.x,fill:'none',stroke:'#0D0D0F','stroke-width':2.5,class:'draw'},fl);
  main.style.setProperty('--len',main.getTotalLength());
  // the note itself and points of interest in the accent
  el('circle',{cx:N.x,cy:N.y,r:26,fill:'#0D0D0F'},fl);el('circle',{cx:N.x,cy:N.y,r:7,fill:'#E85D04'},fl);
  [[X2,rows.thought],[X2,rows.idea],[X2,rows.decision],[D.x,rows.decision]].forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:4.5,fill:'#E85D04'},fl)});
  // the approval gate on the decision path
  el('rect',{x:G.x-9,y:rows.decision-16,width:18,height:32,fill:'#EFEFEE',stroke:'#0D0D0F','stroke-width':1.5},fl);
  el('line',{x1:G.x,x2:G.x,y1:rows.decision-9,y2:rows.decision+9,stroke:'#0D0D0F','stroke-width':1.5},fl);
  // leaders out to mono labels
  function label(x,y,lx,ly,s,anchor){el('line',{x1:x,y1:y,x2:lx,y2:ly,stroke:'rgba(13,13,15,.45)','stroke-width':.75},fl);txt(lx+(anchor==='end'?-6:6),ly+4,s,{fill:'#43444A','font-family':MONO,'font-size':10.5,'letter-spacing':'1.3','text-anchor':anchor||'start'},fl)}
  label(N.x,N.y-26,N.x,N.y-118,'ONE NOTE');
  label(X2,rows.thought,X2+40,rows.thought-36,'THOUGHT · KEPT FOR PACING');
  label(X2,rows.idea,X2+40,rows.idea-36,'IDEA · SAVED, NOT A TO-DO');
  label(X2,rows.decision,X2+20,rows.decision+56,'DECISION');
  label(G.x,rows.decision-16,G.x+22,rows.decision-56,'WAITS FOR YOUR TAP');
  label(D.x,rows.decision,D.x-10,rows.decision+56,'DONE','end');
}

/* ---------- 05 the day repaints the section ---------- */
var day=q('.pz-day');
if(day){var picks=qa('.pz-pick',day),cells={a:q('[data-k=a]',day),b:q('[data-k=b]',day),c:q('[data-k=c]',day)};
  picks.forEach(function(b){b.addEventListener('click',function(){
    picks.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    day.style.setProperty('--fg',b.dataset.ground);day.style.setProperty('--fc',b.dataset.ink);
    ['a','b','c'].forEach(function(k){var c=cells[k];c.style.opacity=0;setTimeout(function(){c.textContent=b.dataset[k];c.style.opacity=1},motion?180:0)});
  })});
}

/* ---------- back to top ---------- */
var top=q('.pz-top');if(top)top.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:motion?'smooth':'auto'})});

/* ---------- 04 turntable frames (preloaded) ---------- */
var turn=q('.pz-turn'),frames=[],FN=48;
if(turn){for(var i=0;i<FN;i++){var im=new Image();im.src='assets/media/spin/'+String(i).padStart(3,'0')+'.webp';frames.push(im)}}

if(!motion)return;   // everything above already gives a finished page

/* ---------- hero: reveal on the next frame, not on an observer ---------- */
var hero=q('.pz-hero');
requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('in');setTimeout(function(){hero.classList.add('settled')},1400)})});

/* ---------- scroll reveals ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.08});
qa('.pz-reveal').forEach(function(n){io.observe(n)});

/* ---------- one passive, rAF-throttled scroll handler ---------- */
var spin=q('.pz-spin'),mq=q('.pz-marquee'),read=q('.pz-read'),ticking=false,lastFrame=-1;
function onScroll(){
  ticking=false;var vh=innerHeight;
  // hero: word rises, product sinks, so they part as you leave
  if(hero&&hero.classList.contains('settled')){var h=Math.min(1,Math.max(0,scrollY/hero.offsetHeight));hero.style.setProperty('--pw',(h*90).toFixed(1)+'px');hero.style.setProperty('--ps',(h*70).toFixed(1)+'px')}
  // turntable: rotation and the marquee travel opposite ways from one progress value
  if(spin){var r=spin.getBoundingClientRect(),tot=r.height-vh,p=tot>0?Math.min(1,Math.max(0,-r.top/tot)):0;
    var f=Math.min(FN-1,Math.round(p*(FN-1)));if(f!==lastFrame&&frames[f]&&frames[f].complete){turn.src=frames[f].src;lastFrame=f}
    var deg=Math.round(f/FN*360);read.textContent=String(deg).padStart(3,'0')+'°';
    if(mq)mq.style.setProperty('--mx',(-p*mq.scrollWidth*.45).toFixed(1)+'px')}
}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',onScroll);onScroll();
})();
