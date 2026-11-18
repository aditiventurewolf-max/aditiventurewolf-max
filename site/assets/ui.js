(function(){
var q=function(s,r){return (r||document).querySelector(s)};
var qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var onScrollFns=[];

/* header: hairline once scrolled, mobile menu */
var hdr=q('.hdr'),burger=q('.burger');
function headerState(){if(hdr)hdr.classList.toggle('scrolled',scrollY>8)}
onScrollFns.push(headerState);
if(burger){burger.addEventListener('click',function(){var o=hdr.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Close':'Menu'})}
qa('.nav a').forEach(function(a){a.addEventListener('click',function(){if(hdr)hdr.classList.remove('open')})});
var here=location.pathname.split('/').pop()||'index.html';
qa('.nav a[data-page]').forEach(function(a){if(a.getAttribute('data-page')===here)a.setAttribute('aria-current','page')});
addEventListener('scroll',function(){onScrollFns.forEach(function(f){f()})},{passive:true});

/* generated field: slow drifting light with a decaying ripple. Original, no assets. */
function field(cv,o){
  o=o||{};var ctx=cv.getContext('2d');if(!ctx)return;
  var W=2,H=2,vis=true,raf=0,last=0,t0=performance.now();
  var C={paper:'#F6F4EF',sky:[220,226,232],haze:[239,232,222],glow:[241,199,163]};
  function size(){var r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,1.5)*0.5;W=cv.width=Math.max(2,Math.round(r.width*d));H=cv.height=Math.max(2,Math.round(r.height*d))}
  function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
  function blob(x,y,r,c,a){var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  function draw(ms,ripples){
    var s=ms/1000,m=Math.max(W,H),k=Math.PI*2;
    ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);
    blob(W*(.30+.08*Math.sin(s*k/62)),H*(.35+.08*Math.cos(s*k/47)),m*.62,C.sky,.95);
    blob(W*(.72+.08*Math.cos(s*k/55)),H*(.45+.08*Math.sin(s*k/70)),m*.56,C.haze,.95);
    blob(W*(.5+.08*Math.sin(s*k/45+1)),H*(.98+.04*Math.cos(s*k/58)),m*.72,C.glow,.78);
    if(ripples){
      var per=7000,p=(ms%per)/6000;
      if(p<1){var rx=W*(.06+.5*p),a=.07*(1-p);ctx.strokeStyle='rgba(26,25,23,'+a+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(W/2,H*(o.ry||.6),rx,rx*.42,0,0,k);ctx.stroke()}
    }
  }
  function frame(ts){
    raf=requestAnimationFrame(frame);
    if(ts-last<33)return;last=ts;draw(ts-t0+12000,true);
  }
  function start(){if(!raf&&!reduce&&vis&&!document.hidden){raf=requestAnimationFrame(frame)}}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0}}
  size();draw(12000,false);
  addEventListener('resize',function(){size();draw(12000,false)});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;vis?start():stop()},{threshold:0}).observe(cv)}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
  start();
}
qa('canvas.field').forEach(function(cv){field(cv,{ry:cv.getAttribute('data-ry')?parseFloat(cv.getAttribute('data-ry')):.6})});

/* typed voice sentences in a panel */
var panel=q('[data-say]');
if(panel){
  var pairs=[];try{pairs=JSON.parse(panel.getAttribute('data-say'))}catch(e){}
  var say=q('.say',panel),reply=q('.reply',panel),run=0;
  function typeLine(el,text,id,speed,done){var n=0;(function step(){if(id!==run)return;el.innerHTML=text.slice(0,n).replace(/</g,'&lt;')+(n<text.length?'<span class="cursor"></span>':'');if(n<text.length){n++;setTimeout(step,speed)}else if(done)done()})()}
  function cycle(i){
    if(!pairs.length)return;var id=++run,p=pairs[i%pairs.length];
    reply.style.opacity=0;reply.textContent='';
    typeLine(say,p[0],id,38,function(){setTimeout(function(){if(id!==run)return;reply.textContent=p[1];reply.style.opacity=1;setTimeout(function(){if(id===run)cycle(i+1)},4200)},500)});
  }
  if(reduce||!pairs.length){if(pairs.length){say.textContent=pairs[0][0];reply.textContent=pairs[0][1]}}
  else if('IntersectionObserver' in window){var po=new IntersectionObserver(function(es){if(es[0].isIntersecting){po.disconnect();cycle(0)}},{threshold:.3});po.observe(panel)}else{cycle(0)}
}

/* the button page: press, hear a sentence, get an answer */
var orb=q('.orb');
if(orb){
  var sayEl=q('.say-wrap .say'),replyEl=q('.say-wrap .reply'),after=q('.after'),busy=0,timers=[];
  var LINE="Move my three o’clock to Thursday.",ANS="Done. I’ll ask before telling anyone.";
  function clear(){timers.forEach(clearTimeout);timers=[]}
  function words(el,text,gap,done){el.innerHTML='';var parts=text.split(' ');parts.forEach(function(w,i){var s=document.createElement('span');s.className='w';s.textContent=w+(i<parts.length-1?' ':'');el.appendChild(s);timers.push(setTimeout(function(){s.classList.add('on')},reduce?0:i*gap))});timers.push(setTimeout(done,reduce?0:parts.length*gap+200))}
  function press(){
    if(busy){clear();busy=0;orb.setAttribute('aria-pressed','false');sayEl.textContent='';replyEl.textContent='';after.classList.remove('on');return}
    busy=1;orb.setAttribute('aria-pressed','true');replyEl.textContent='';after.classList.remove('on');
    words(sayEl,LINE,260,function(){orb.setAttribute('aria-pressed','false');timers.push(setTimeout(function(){replyEl.style.opacity=0;replyEl.textContent=ANS;requestAnimationFrame(function(){replyEl.style.opacity=1});after.classList.add('on');busy=0},400))})
  }
  orb.addEventListener('click',press);
  sayEl.textContent='';
}

/* manifesto: words come into focus as you read */
var mf=q('.manif');var ws=[];
if(mf){qa('p',mf).forEach(function(p){p.innerHTML=p.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ')});ws=qa('.w',mf);
  var lit=function(){var vh=innerHeight;ws.forEach(function(w){w.classList.toggle('on',reduce||w.getBoundingClientRect().top<vh*.72)})};onScrollFns.push(lit);lit()}

/* live local time for the index page */
var tm=q('[data-time]');
if(tm){try{tm.textContent=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Kolkata'}).format(new Date())+' IST'}catch(e){tm.textContent=''}}
/* FAQ accordion: one open at a time, arrow keys move between questions */
var faq=q('.faq-list');
if(faq){
  var items=qa('.faq-item',faq),btns=items.map(function(it){return q('button',it)});
  function setOpen(item,open){item.classList.toggle('is-open',open);q('button',item).setAttribute('aria-expanded',open?'true':'false')}
  function openOnly(item){items.forEach(function(it){setOpen(it,it===item)})}
  btns.forEach(function(b,i){
    b.addEventListener('click',function(){var it=items[i];if(it.classList.contains('is-open')){setOpen(it,false)}else{openOnly(it)}});
    b.addEventListener('keydown',function(e){
      var k=e.key,n=-1;
      if(k==='ArrowDown')n=(i+1)%btns.length;else if(k==='ArrowUp')n=(i-1+btns.length)%btns.length;else if(k==='Home')n=0;else if(k==='End')n=btns.length-1;
      if(n>-1){e.preventDefault();btns[n].focus()}
    });
  });
  openOnly(items[0]);
}
headerState();
})();
