/* Footer: a dot-matrix wordmark that assembles with a ripple, parts around the
   pointer and ripples on press; a live Bengaluru clock; copy-email; back to top. */
(function(){
var q=function(s,r){return (r||document).querySelector(s)};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- live clock ---------- */
var clock=q('[data-clock]');
if(clock){
  var fmt;try{fmt=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Kolkata'})}catch(e){}
  var tickClock=function(){if(fmt)clock.textContent=fmt.format(new Date())+' IST'};
  tickClock();if(fmt)setInterval(tickClock,1000);
}

/* ---------- copy email ---------- */
var copyBtn=q('.f-copy-btn'),addr=q('.f-addr'),said=q('.f-copied');
if(copyBtn&&addr){
  copyBtn.addEventListener('click',function(){
    var text=addr.textContent.trim(),done=function(msg){said.textContent=msg;copyBtn.textContent=msg==='Copied'?'Copied':'Copy';setTimeout(function(){said.textContent='';copyBtn.textContent='Copy'},2200)};
    var select=function(){var r=document.createRange();r.selectNodeContents(addr);var s=getSelection();s.removeAllRanges();s.addRange(r);done('Selected, press copy')};
    try{navigator.clipboard.writeText(text).then(function(){done('Copied')},select)}catch(e){select()}
  });
}

/* ---------- back to top ---------- */
var top=q('.f-top');
if(top)top.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:reduce?'auto':'smooth'});var h=q('.brand');if(h)h.focus({preventScroll:true})});

/* ---------- dot-matrix wordmark ---------- */
var cv=q('canvas.f-dots');if(!cv)return;
var ctx=cv.getContext('2d');if(!ctx)return;
var INK=[26,25,23],FAINT='rgba(26,25,23,.09)';
var dots=[],grid=[],W=0,H=0,dpr=1,step=7,ptr={x:-1e4,y:-1e4,in:false},ripples=[],raf=0,intro=null,ready=false;
function build(){
  var cw=cv.clientWidth;if(!cw)return;
  step=cw>900?7:cw>600?6:4;
  H=Math.round(cw*.27);W=cw;cv.style.height=H+'px';
  dpr=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  // draw the word offscreen, then sample it on a grid
  var off=document.createElement('canvas');off.width=W;off.height=H;var o=off.getContext('2d');
  var word='Unobvious',fam='"Instrument Serif", Georgia, serif';
  o.font='400 100px '+fam;var m=o.measureText(word),fs=100*(W*.96)/m.width;
  o.font='400 '+fs+'px '+fam;var mm=o.measureText(word);
  var asc=mm.actualBoundingBoxAscent||fs*.7,desc=mm.actualBoundingBoxDescent||fs*.2;
  var y=(H-(asc+desc))/2+asc;o.fillStyle='#000';o.textBaseline='alphabetic';o.fillText(word,(W-mm.width)/2,y);
  var data=o.getImageData(0,0,W,H).data;
  dots=[];grid=[];
  for(var gy=step/2;gy<H;gy+=step)for(var gx=step/2;gx<W;gx+=step){
    var a=data[(Math.floor(gy)*W+Math.floor(gx))*4+3];
    if(a>110)dots.push({x:gx,y:gy,ox:0,oy:0,s:1,seen:0});else grid.push(gx,gy);
  }
  ready=true;
}
function draw(now){
  ctx.clearRect(0,0,W,H);
  // faint grid for texture
  ctx.fillStyle=FAINT;for(var i=0;i<grid.length;i+=2){ctx.fillRect(grid[i]-.6,grid[i+1]-.6,1.2,1.2)}
  var R=Math.max(60,W*.06),active=false,r0=step*(W<600?.44:.34);
  ripples=ripples.filter(function(rp){return (now-rp.t)*.7<Math.max(W,H)*1.2});
  var introR=intro?(now-intro.t)*1.1:Infinity;
  for(var k=0;k<dots.length;k++){
    var d=dots[k],tx=0,ty=0,ts=1;
    // reveal: dots appear as the intro ripple passes them
    if(intro&&!d.seen){var di=Math.hypot(d.x-intro.x,d.y-intro.y);if(di<introR)d.seen=1}else if(!intro)d.seen=1;
    if(!d.seen)continue;
    // part around the pointer
    if(ptr.in){var dx=d.x-ptr.x,dy=d.y-ptr.y,dd=Math.hypot(dx,dy);if(dd<R&&dd>.01){var f=Math.pow(1-dd/R,2);tx+=dx/dd*f*16;ty+=dy/dd*f*16;ts+=f*.9}}
    // press ripples travel outward
    for(var j=0;j<ripples.length;j++){var rp=ripples[j],rr=(now-rp.t)*.7,ex=d.x-rp.x,ey=d.y-rp.y,de=Math.hypot(ex,ey),band=22,g=1-Math.abs(de-rr)/band;
      if(g>0&&de>.01){var fade=1-rr/(Math.max(W,H)*1.2);tx+=ex/de*g*9*fade;ty+=ey/de*g*9*fade;ts+=g*1.1*fade}}
    d.ox+=(tx-d.ox)*.2;d.oy+=(ty-d.oy)*.2;d.s+=(ts-d.s)*.2;
    if(Math.abs(tx-d.ox)>.05||Math.abs(ty-d.oy)>.05||Math.abs(ts-d.s)>.01)active=true;
    var alpha=Math.min(1,.82+(d.s-1)*.3);
    ctx.fillStyle='rgba('+INK[0]+','+INK[1]+','+INK[2]+','+alpha+')';
    ctx.beginPath();ctx.arc(d.x+d.ox,d.y+d.oy,r0*d.s,0,6.2832);ctx.fill();
  }
  if(intro&&introR>Math.hypot(W,H))intro=null;
  return active||ripples.length>0||!!intro||ptr.in;
}
function loop(now){raf=0;if(draw(now))raf=requestAnimationFrame(loop)}
function kick(){if(!raf&&ready)raf=requestAnimationFrame(loop)}
function local(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
function setup(){
  build();
  if(reduce){draw(0);return}
  cv.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var p=local(e);ptr.x=p.x;ptr.y=p.y;ptr.in=true;kick()});
  cv.addEventListener('pointerleave',function(){ptr.in=false;kick()});
  cv.addEventListener('pointerdown',function(e){var p=local(e);ripples.push({x:p.x,y:p.y,t:performance.now()});if(ripples.length>4)ripples.shift();kick()});
  // assemble with a ripple the first time the footer comes into view
  var drawn=false;
  if('IntersectionObserver' in window){new IntersectionObserver(function(es,obs){if(es[0].isIntersecting&&!drawn){drawn=true;obs.disconnect();intro={x:W/2,y:H/2,t:performance.now()};kick()}},{threshold:.35}).observe(cv)}
  else{draw(0)}
  // draw the faint grid straight away so the area is never blank
  ctx.clearRect(0,0,W,H);ctx.fillStyle=FAINT;for(var i=0;i<grid.length;i+=2)ctx.fillRect(grid[i]-.6,grid[i+1]-.6,1.2,1.2);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){build();dots.forEach(function(d){d.seen=1});draw(performance.now())},150)});
}
var fontReady=document.fonts&&document.fonts.load?document.fonts.load('400 100px "Instrument Serif"'):Promise.resolve();
fontReady.then(setup,setup);
})();
