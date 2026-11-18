(function(){
var q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,mo=root.classList.contains('mo');
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))},ease=function(t){return 1-Math.pow(1-t,3)};

/* ---------- palette switch (prototype) ---------- */
function rgb(name){return getComputedStyle(root).getPropertyValue(name).trim().split(',').map(Number)}
var pals=qa('.fx-pal button');
function setPal(p){if(p==='cinema')root.dataset.pal='cinema';else delete root.dataset.pal;pals.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pal===p?'true':'false')});try{localStorage.setItem('fxpal',p)}catch(e){}measureTiles();auraColours()}
pals.forEach(function(b){b.addEventListener('click',function(){setPal(b.dataset.pal)})});

/* ---------- live contrast on each tile ---------- */
function lum(c){var f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])}
function parse(s){var m=s.match(/[\d.]+/g);return m?m.slice(0,3).map(Number):[0,0,0]}
function hex(name){var h=getComputedStyle(root).getPropertyValue(name).trim().replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
function measureTiles(){
  // worst case: the text colour against the lightest/darkest stop it sits on (the lower half of the tile)
  var pairs={'t-morning':['--night',['--moon']],'t-midday':['--night',['--fog','--moon']],'t-evening':['--moon',['--deep']],'t-fog':['--moon',['--night']]};
  qa('.fx-tile').forEach(function(t){var k=Object.keys(pairs).find(function(c){return t.classList.contains(c)});if(!k)return;
    var fg=lum(hex(pairs[k][0]));var worst=Math.min.apply(null,pairs[k][1].map(function(b){var bg=lum(hex(b)),hi=Math.max(fg,bg),lo=Math.min(fg,bg);return (hi+.05)/(lo+.05)}));
    q('[data-cr]',t).textContent='◐ '+worst.toFixed(2)+':1'});
}

/* ---------- aura: slow drifting hot light on night (canvas, low-res, CSS-blurred) ---------- */
var auras=qa('canvas.fx-aura'),A=[];
function auraColours(){var c1=rgb('--a1'),c2=rgb('--a2'),c3=rgb('--a3');A.forEach(function(a){a.cols=[c1,c2,c3];a.draw(performance.now())})}
auras.forEach(function(cv,idx){
  var ctx=cv.getContext('2d');if(!ctx)return;var W=2,H=2,vis=true,raf=0,last=0;
  var seeds=[[.78,.42,.55,0],[.62,.86,.6,1],[.92,.12,.45,2],[.3,.95,.4,0]];
  var a={cols:[[255,191,101],[253,137,115],[0,58,108]]};
  function size(){var r=cv.getBoundingClientRect();W=cv.width=Math.max(2,Math.round(r.width/8));H=cv.height=Math.max(2,Math.round(r.height/8))}
  a.draw=function(ms){var s=ms/1000,m=Math.max(W,H);ctx.clearRect(0,0,W,H);
    seeds.forEach(function(sd,i){var x=W*(sd[0]+.07*Math.sin(s/(9+i*3)+i+idx)),y=H*(sd[1]+.07*Math.cos(s/(11+i*2)+i)),r=m*sd[2],c=a.cols[sd[3]];
      var g=ctx.createRadialGradient(x,y,0,x,y,r);var al=sd[3]===2?.9:.75;g.addColorStop(0,'rgba('+c+','+al+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)})};
  function loop(t){raf=requestAnimationFrame(loop);if(t-last<50)return;last=t;a.draw(t)}
  size();A.push(a);
  addEventListener('resize',function(){size();a.draw(performance.now())});
  if(mo&&'IntersectionObserver' in window){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop);if(!vis&&raf){cancelAnimationFrame(raf);raf=0}}).observe(cv)}
});
try{var saved=localStorage.getItem('fxpal');if(saved==='cinema')setPal('cinema')}catch(e){}
auraColours();measureTiles();

/* ---------- noise field words ---------- */
var field=q('.fx-field');
if(field){var W0=['12 unread','Reply?','Sale ends tonight','Your order shipped','Reminder','3 new messages','Did you see this?','Meeting moved','Low battery','Trending now','Can you call?','Invoice due','Story added','You were mentioned','Update available','Quick question','New follower','Don’t miss out','Weekly report','Ping','Draft saved','Breaking','Join the call','Seen 4m ago'];
  var R=(function(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})(7);
  W0.forEach(function(w){var s=document.createElement('span');s.textContent=w;var sz=14+R()*34;s.style.fontSize=sz+'px';s.style.left=(R()*86+2)+'%';s.style.top=(R()*62+20)+'%';s.dataset.d=(R()*2-1).toFixed(2);field.appendChild(s)})}

/* ---------- back to top ---------- */
var top=q('.fx-top');if(top)top.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:mo?'smooth':'auto'})});

if(!mo){qa('.fx-rev').forEach(function(n){n.classList.add('in')});return}

/* ---------- hero: frame locks on, then follows the pointer ---------- */
var hero=q('.fx-hero'),lens=q('.fx-lens');
requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('in')})});
var home={x:.13,y:.38},cur={x:.13,y:.38},tgt={x:.13,y:.38},fw=.36,fh=.36,hraf=0;
function lensTick(){cur.x+=(tgt.x-cur.x)*.12;cur.y+=(tgt.y-cur.y)*.12;lens.style.setProperty('--fx',cur.x.toFixed(4));lens.style.setProperty('--fy',cur.y.toFixed(4));
  hraf=(Math.abs(tgt.x-cur.x)+Math.abs(tgt.y-cur.y)>.0005)?requestAnimationFrame(lensTick):0}
if(lens&&matchMedia('(hover:hover)').matches){
  hero.addEventListener('pointermove',function(e){var r=lens.getBoundingClientRect();tgt.x=clamp((e.clientX-r.left)/r.width-fw/2,-.05,1.05-fw);tgt.y=clamp((e.clientY-r.top)/r.height-fh/2,0,1-fh);if(!hraf)hraf=requestAnimationFrame(lensTick)});
  hero.addEventListener('pointerleave',function(){tgt.x=home.x;tgt.y=home.y;if(!hraf)hraf=requestAnimationFrame(lensTick)});
}

/* ---------- reveals ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:.08});
qa('.fx-rev,.fx-close').forEach(function(n){io.observe(n)});

/* ---------- scroll: push-in and noise ---------- */
var push=q('.fx-push'),dev=q('.fx-push-dev'),c1=q('.fx-push-cap .c1'),c2=q('.fx-push-cap .c2'),dist=q('.fx-dist');
var noise=q('.fx-noise'),words=field?qa('span',field):[],keep=qa('.fx-keep li'),n2=q('.fx-noise .n2');
function prog(sec){var r=sec.getBoundingClientRect(),t=r.height-innerHeight;return t>0?clamp(-r.top/t,0,1):0}
var ticking=false;
function onScroll(){ticking=false;
  if(push){var p=prog(push),z=1+Math.pow(ease(clamp(p/.85,0,1)),2.2)*15;dev.style.setProperty('--z',z.toFixed(3));var mv=ease(clamp(p/.7,0,1));dev.style.setProperty('--tx',(dev.offsetWidth*(.5-.146)*mv).toFixed(1)+'px');dev.style.setProperty('--ty',(dev.offsetHeight*(.5-.561)*mv).toFixed(1)+'px');
    dev.style.setProperty('--db',(p>.8?(p-.8)*30:0).toFixed(2)+'px');dev.style.opacity=(1-clamp((p-.86)/.14,0,1)).toFixed(3);
    var s=clamp((p-.32)/.16,0,1);c1.style.opacity=1-s;c1.style.filter='blur('+(s*8)+'px)';c2.style.opacity=s;c2.style.filter='blur('+((1-s)*8)+'px)';
    dist.textContent=Math.max(0,Math.round(60*(1-ease(clamp(p/.9,0,1)))))+' cm'}
  if(noise){var n=prog(noise),b=1.5+ease(clamp(n/.6,0,1))*12,o=.6-clamp(n/.7,0,1)*.42;
    words.forEach(function(w){w.style.setProperty('--nb',b.toFixed(2)+'px');w.style.setProperty('--no',o.toFixed(3));w.style.transform='translateY('+(parseFloat(w.dataset.d)*n*60).toFixed(1)+'px)'});
    if(n2)n2.style.setProperty('--k2',clamp((n-.15)/.2,0,1).toFixed(3));
    keep.forEach(function(li,i){var k=clamp((n-.3-i*.1)/.18,0,1);li.style.setProperty('--ko',k.toFixed(3));li.style.setProperty('--ky',((1-k)*30).toFixed(1)+'px');li.style.setProperty('--kb',((1-k)*10).toFixed(1)+'px')})}
}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',onScroll);onScroll();
})();
