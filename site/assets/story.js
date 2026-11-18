/* Home 4 "The Journey": a hero that dissolves like a cloud, then one thought
   followed through five scenes. Everything is driven by scroll position, so it
   plays forwards and backwards. Only runs when <html> has the "live" class
   (set in the page head when reduced motion is not requested). */
(function(){
var root=document.documentElement;if(!root.classList.contains('live'))return;
var q=function(s,r){return (r||document).querySelector(s)};
var qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
var lerp=function(a,b,t){return a+(b-a)*t};

/* ---------- cloud dissolve from the hero into the story ---------- */
var wrap=q('.h4-wrap'),heroEl=q('.h4-hero'),inner=q('.h4-inner'),cue=q('.scroll-cue'),cv=q('canvas.dissolve');
var ctx=cv&&cv.getContext('2d'),W=2,H=2,blobs=[],lastD=-1;
function seeded(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
function sizeDissolve(){
  if(!ctx)return;var r=cv.getBoundingClientRect(),k=.5;
  W=cv.width=Math.max(2,Math.round(r.width*k));H=cv.height=Math.max(2,Math.round(r.height*k));
  var R=seeded(11),cols=12,rows=8;blobs=[];
  for(var i=0;i<cols;i++)for(var j=0;j<rows;j++){
    var parts=[],n=4+Math.floor(R()*3);
    for(var c=0;c<n;c++){var a=R()*6.283,dd=R()*.6;parts.push({ox:Math.cos(a)*dd,oy:Math.sin(a)*dd,s:.45+R()*.4})}
    blobs.push({x:(i+.5+(R()-.5)*.9)/cols*W,y:(j+.5+(R()-.5)*.9)/rows*H,d:R()*.55,s:.6+R()*.8,parts:parts});
  }
  lastD=-1;
}
function drawDissolve(d){
  if(!ctx||d===lastD)return;lastD=d;ctx.clearRect(0,0,W,H);if(d<=0)return;
  var m=Math.max(W,H)*.13;
  blobs.forEach(function(b){var k=clamp((d-b.d)/(1-b.d),0,1);if(!k)return;var R0=m*b.s*Math.pow(k,1.1)*1.7+1;
    b.parts.forEach(function(pt){var x=b.x+pt.ox*R0,y=b.y+pt.oy*R0,r=R0*pt.s+1;
      var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(246,244,239,1)');g.addColorStop(.62,'rgba(246,244,239,.96)');g.addColorStop(1,'rgba(246,244,239,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()})});
  if(d>.9){ctx.fillStyle='rgba(246,244,239,'+((d-.9)/.1)+')';ctx.fillRect(0,0,W,H)}
}
function heroProgress(){if(!wrap)return 0;var r=wrap.getBoundingClientRect();return clamp(-r.top/innerHeight,0,1)}
function renderHero(d){
  drawDissolve(d);
  if(inner){inner.style.opacity=clamp(1-d*1.6,0,1);inner.style.transform='translateY('+(-d*40)+'px)'}
  if(cue)cue.style.opacity=clamp(1-d*3,0,1);
  if(heroEl)heroEl.style.visibility=d>=.999?'hidden':'visible';
}

/* ---------- the story ---------- */
var story=q('.story'),stage=q('.story-stage');if(!story||!stage)return;
var capN=q('.sc-n'),capT=q('.sc-t'),cap=q('.story-caption'),dot=q('.story-dot'),core=q('.core',dot),rings=qa('.ring',dot);
var sent=q('.story-sentence'),laneEls=qa('.lane'),outs=qa('.out'),ok=q('.ok'),end=q('.story-end');
var CAPS=[['01','It starts with a press.'],['02','You say what is on your mind.'],['03','It sorts the mess.'],['04','It handles the small stuff, and asks before anything leaves your hands.'],['05','Then it gets out of the way.']];
var S=[0,.12,.38,.58,.82,1];

// split the sentence into words so it can be "spoken" as you scroll
var words=[];
qa('.seg',sent).forEach(function(seg){seg.innerHTML=seg.textContent.split(' ').map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');words=words.concat(qa('.w',seg))});
// one flying copy per segment: it travels from the sentence into its lane
var fly=qa('.seg',sent).map(function(seg){
  var slot=q('.slot[data-k="'+seg.getAttribute('data-k')+'"] .slot-text');
  var f=document.createElement('p');f.className='flyer';f.setAttribute('aria-hidden','true');f.textContent=slot.textContent;stage.appendChild(f);
  return {seg:seg,slot:slot,el:f,a:null,b:null};
});
var dotY=0;
function measure(){
  var st=stage.getBoundingClientRect(),sfs=parseFloat(getComputedStyle(sent).fontSize),sr=sent.getBoundingClientRect(),narrow=innerWidth<761;
  var dr=dot.getBoundingClientRect();dotY=(sr.top-st.top)-(dr.top-st.top)-36;
  fly.forEach(function(o){
    var r=o.seg.getClientRects()[0]||o.seg.getBoundingClientRect(),t=o.slot.getBoundingClientRect();
    o.a={x:r.left-st.left,y:r.top-st.top,w:Math.max(r.width,120),fs:sfs};
    o.b={x:t.left-st.left,y:t.top-st.top,w:t.width,fs:parseFloat(getComputedStyle(o.slot).fontSize)};
    if(narrow)o.a={x:o.b.x,y:o.b.y+28,w:o.b.w,fs:o.b.fs};
  });
}
var lastScene=-1;
function setCaption(i){if(i===lastScene)return;lastScene=i;capN.textContent=CAPS[i][0];capT.textContent=CAPS[i][1]}
function render(p){
  var i=0;while(i<4&&p>=S[i+1])i++;
  var l=clamp((p-S[i])/(S[i+1]-S[i]),0,1);
  setCaption(i);
  // the press: dot grows, ripples spread
  var coreScale=1,coreY=0,coreOp=1,ringOn=0,rl=0;
  if(i===0){coreScale=.35+.65*ease(l);ringOn=Math.min(1,l*4);rl=l}
  else if(i===1){var e=ease(clamp(l/.3,0,1));coreScale=lerp(1,.32,e);coreY=lerp(0,dotY,e);ringOn=1-e;rl=1+l}
  else{coreScale=.32;coreY=dotY;coreOp=i===2?1-clamp(l/.3,0,1):0}
  core.style.transform='translateY('+coreY+'px) scale('+coreScale+')';core.style.opacity=coreOp;
  rings.forEach(function(r,k){var ph=(rl*2+k/3)%1;r.style.transform='translateY('+coreY+'px) scale('+(1+ph*3.5)+')';r.style.opacity=((1-ph)*.35*ringOn).toFixed(3)});
  // speaking: the sentence appears word by word
  var shown=i===0?0:i===1?Math.ceil(clamp((l-.22)*1.45,0,1)*words.length):words.length;
  words.forEach(function(w,k){w.style.opacity=k<shown?1:0});
  sent.style.opacity=i<=1?1:i===2?1-clamp(l/.12,0,1):0;
  // sorting: each phrase flies into its lane
  var fo=i<2?0:i===2?clamp(l/.12,0,1):i===3?1:1-clamp(l/.35,0,1);
  fly.forEach(function(o,k){if(!o.a)return;
    var fl=i<2?0:i===2?ease(clamp((l-.04-k*.2)/.26,0,1)):1;
    var x=lerp(o.a.x,o.b.x,fl),y=lerp(o.a.y,o.b.y,fl);
    o.el.style.width=o.b.w+'px';o.el.style.whiteSpace=fl<1?'nowrap':'normal';o.el.style.fontSize=lerp(o.a.fs,o.b.fs,fl)+'px';
    o.el.style.transform='translate('+x+'px,'+(y-(i===4?24*clamp(l/.35,0,1):0))+'px)';o.el.style.opacity=fo;
  });
  laneEls.forEach(function(le){le.classList.toggle('on',(i===2&&l>.35)||i===3);le.style.opacity=i===4?1-clamp(l/.35,0,1):1});
  // acting: outcomes arrive one by one, and the message waits for a tap
  outs.forEach(function(o,k){o.classList.toggle('on',i===3&&l>.08+k*.16)});
  if(ok)ok.classList.toggle('done',i===3&&l>.8);
  // quiet: everything settles, you look up
  var eo=i===4?clamp((l-.3)/.35,0,1):0;end.style.opacity=eo;end.style.transform='translateY(calc(-50% + '+(1-eo)*24+'px))';
}

/* ---------- loop with gentle smoothing (does not hijack scrolling) ---------- */
function storyProgress(){var r=story.getBoundingClientRect(),tot=r.height-innerHeight;return tot>0?clamp(-r.top/tot,0,1):0}
var target=0,cur=0,raf=0;
function tick(){
  cur+=(target-cur)*.16;if(Math.abs(target-cur)<.0005)cur=target;
  render(cur);renderHero(heroProgress());
  raf=cur!==target?requestAnimationFrame(tick):0;
}
function onScroll(){target=storyProgress();if(!raf)raf=requestAnimationFrame(tick)}
function relayout(){sizeDissolve();measure();cur=target=storyProgress();render(cur);renderHero(heroProgress())}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',relayout);
relayout();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(relayout);
})();
