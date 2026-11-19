/* Home story: chaos in, clarity out. Runs only when <html> has "live" (motion allowed, JS on).
   Acts: 0 the mess · 1 the press · 2 the thought leaves · 3 the system · 4 the gate · 5 quiet */
(function(){
var root=document.documentElement;if(!root.classList.contains('live'))return;
var q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))},lerp=function(a,b,t){return a+(b-a)*t};
var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},out=function(t){return 1-Math.pow(1-t,3)};
var span=function(v,a,b){return clamp((v-a)/(b-a),0,1)};

var story=q('.story'),stage=q('.stage');if(!story||!stage)return;
var hero=q('.hero-copy',stage),fragBox=q('.frags',stage),phone=q('.phone',stage),ptxt=q('.phone .txt',stage),sil=q('.sil',stage);
var device=q('.device',stage),hint=q('.press-hint',stage),say=q('.say',stage),fil=q('.fil path',stage);
var map=q('.map',stage),links=q('.map .links',stage),you=q('.you',stage),stations=qa('.st',stage),cards={};
qa('.card',stage).forEach(function(c){cards[c.dataset.k]=c});
var askq=q('.askq',stage),gate=q('.gate',stage),end=q('.end',stage),coda=q('.coda',stage);
var cap=q('.cap',stage),capN=q('.cap .n',stage),capT=q('.cap .t',stage),sim=q('.sim',stage),cue=q('.scrollcue',stage);
var pW=q('.p-window',stage),pD=q('.p-deep',stage),pH=q('.p-horizon',stage);
var S=[0,.13,.25,.42,.66,.83,1];
var CAPS=['Your head is busy. Writing it down shouldn’t be another job.','So don’t write it down. Say it.','Say it messy. Your phone stays face down.','It keeps the mess. It gives you back the meaning.','Nothing leaves your hands without you.','Then it goes quiet.'];

/* ---------- the mess: fragments of a founder's head ---------- */
var F=[
 ['that guy from the maker thing?','key','who'],['send him the proposal','key','proposal'],['cat clothes?? actually useful??','key','cat'],['reel idea — film it??','key','reel'],['fellowship deadline??','key','fellowship'],
 ['the after-school thing'],['alt-ed'],['background from my notes'],['Rohan?'],['cooling, maybe?'],['research later'],['Sunday?'],['what was the deadline'],['where did I write that'],['deck v3??','strike'],['that one thing'],['remind me'],['groceries','strike'],['the walk'],['how messy my head is'],
 ['um','filler'],['wait—','filler'],['aaand','filler'],['uh','filler'],['okay so','filler'],['ugh','filler'],
 ['12 unread','notif'],['Reply?','notif'],['Sale ends tonight','notif'],['3 new messages','notif'],['Low battery','notif'],['Seen 4m ago','notif']
];
var R=(function(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})(19);
var frags=F.map(function(d,i){
  var el=document.createElement('span');el.className='frag'+(d[1]?' '+d[1]:'');var inner=document.createElement('span');inner.textContent=d[0];el.appendChild(inner);
  inner.style.setProperty('--wd',(4+R()*5).toFixed(1)+'s');inner.style.setProperty('--wl',(-R()*5).toFixed(1)+'s');
  inner.style.setProperty('--wx',((R()-.5)*16).toFixed(1)+'px');inner.style.setProperty('--wy',((R()-.5)*14).toFixed(1)+'px');inner.style.setProperty('--wr',((R()-.5)*5).toFixed(1)+'deg');
  fragBox.appendChild(el);
  return {el:el,kind:d[1]||'noise',key:d[2]||null,u:R(),v:R(),rot:(R()-.5)*26,size:d[1]==='key'?22+R()*10:d[1]==='filler'?16+R()*14:14+R()*20,appear:d[1]==='key'?R()*.25:(R()<.4?-1:R()*.7),a:null,b:null};
});

/* ---------- layout (measured, so it works at any size) ---------- */
var W=0,H=0,narrow=false,phoneA={},phoneB={};
function measure(){
  var sr=stage.getBoundingClientRect();W=sr.width;H=sr.height;narrow=W<861;
  // chaos lives around the silhouette (desktop: right half; phone: lower half)
  var cx=narrow?W*.5:W*.7,cy=narrow?H*.74:H*.5,rx=narrow?W*.44:W*.25,ry=narrow?H*.2:H*.38;
  frags.forEach(function(f){var ang=f.u*6.283,rr=Math.sqrt(f.v);f.a={x:cx+Math.cos(ang)*rx*rr-60,y:cy+Math.sin(ang)*ry*rr,fs:narrow?f.size*.72:f.size};
    f.el.style.fontSize=f.a.fs+'px'});
  phoneA={x:narrow?W*.72:W*.6,y:narrow?H*.62:H*.56};phoneB={x:narrow?W*.82:W*.8,y:narrow?H*.5:H*.66};
  // where each key fragment lands: its card's title
  frags.forEach(function(f){if(!f.key)return;var t=q('.t',cards[f.key]);if(!t)return;var r=t.getBoundingClientRect(),m=map.getBoundingClientRect();
    var mapOff=parseFloat(getComputedStyle(map).opacity)<.01?0:0;f.b={x:r.left-sr.left,y:r.top-sr.top+r.height/2,fs:parseFloat(getComputedStyle(t).fontSize)}});
  // dashed links from you to each station
  links.innerHTML='';if(!narrow){var yr=you.getBoundingClientRect(),yx=yr.left-sr.left+yr.width/2,yy=yr.top-sr.top+9;
    stations.forEach(function(s){var r=s.getBoundingClientRect(),x=r.left-sr.left+(r.left-sr.left<W/2?r.width*.9:r.width*.1),y=r.top-sr.top+10;
      var l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',yx);l.setAttribute('y1',yy);l.setAttribute('x2',x);l.setAttribute('y2',y);links.appendChild(l)})}
}

/* ---------- user moments (they can also just scroll) ---------- */
var did={press:false,yes:false,send:false};
qa('[data-act]',stage).forEach(function(b){b.addEventListener('click',function(){did[b.dataset.act]=true;onScroll(true)})});

var NOTE=[['Okay so, ','f'],['um, ','f'],['that guy from yesterday, the maker thing, Rohan? Send him the proposal. The after-school one. '],['Oh, and wait. ','f'],['Cat clothing. Like, actually useful? Cooling, maybe? Just put it somewhere. '],['There’s a reel in this somewhere, about how messy my head is. Make me film it. '],['Aaand ','f'],['that fellowship. Don’t let me miss it.']];
var NOTE_LEN=NOTE.reduce(function(a,p){return a+p[0].length},0);
function noteUpTo(n){var html='',left=n;NOTE.forEach(function(p){if(left<=0)return;var s=p[0].slice(0,left);left-=s.length;s=s.replace(/</g,'&lt;');html+=p[1]?'<span class="f">'+s+'</span>':s});return html}
var TYPO='rohan proposl aftersch cat clth?? reel fellwshp dedline wait whre was';

function render(p){
  var i=0;while(i<5&&p>=S[i+1])i++;var l=span(p,S[i],S[i+1]);
  /* plates */
  pW.style.opacity=1-span(p,S[2],S[3]);pD.style.opacity=.6*span(p,S[2],S[3])*(1-span(p,S[5],S[5]+.06));pH.style.opacity=span(p,S[5],S[5]+.08);
  /* hero copy (act 0 only) */
  var h0=i===0?1-span(l,.3,.75):0;hero.style.opacity=h0;hero.style.visibility=h0<.01?'hidden':'visible';hero.style.filter='blur('+((1-h0)*8).toFixed(1)+'px)';
  if(cue)cue.style.opacity=i===0?1-span(l,.05,.25):0;
  sil.style.opacity=(i===0?.75:i===1?.75*(1-l):0).toFixed(3);
  /* fragments */
  frags.forEach(function(f,k){
    var x=f.a.x,y=f.a.y,rot=f.rot,sc=1,op=0,bl=0;
    if(i===0){var loud=f.appear<0?.5+.5*span(l,.2,.5):span(l,f.appear,f.appear+.15);op=loud*(f.kind==='key'?1:.75);bl=f.kind==='notif'?0:(1-loud)*6;sc=1+span(l,.4,1)*.06}
    else if(i<=2){op=f.kind==='key'?.55:.2;bl=f.kind==='key'?1.5:4;if(i===1){var t=out(l);op=lerp(f.kind==='key'?1:.75,op,t);bl=lerp(0,bl,t)}}
    else if(i===3){
      if(f.key&&f.b){var ks=['who','proposal','fellowship','reel','cat'].indexOf(f.key),t2=ease(span(l,.12+ks*.1,.32+ks*.1));
        x=lerp(f.a.x,f.b.x,t2);y=lerp(f.a.y,f.b.y,t2);rot=lerp(f.rot,0,t2);sc=lerp(1,f.b.fs/f.a.fs,t2);op=t2<1?lerp(.55,1,span(t2,0,.3)):0;bl=lerp(1.5,0,t2);
        if(cards[f.key])cards[f.key].classList.toggle('in',t2>=1)}
      else{var g=span(l,.05,.5);op=.2*(1-g);bl=4+g*14;y+=g*40}}
    else{op=0;if(f.key&&cards[f.key])cards[f.key].classList.add('in')}
    if(i<3&&f.key&&cards[f.key])cards[f.key].classList.remove('in');
    f.el.style.opacity=op.toFixed(3);f.el.style.filter=bl>.05?'blur('+bl.toFixed(1)+'px)':'none';
    f.el.style.transform='translate('+x.toFixed(1)+'px,'+(y-f.a.fs/2).toFixed(1)+'px) rotate('+rot.toFixed(1)+'deg) scale('+sc.toFixed(3)+')';
  });
  /* the phone: typed into, then turned face down, then a quiet relay */
  var pd=i===0?span(l,.72,.95):1,px=phoneA.x,py=phoneA.y,pop=i===0?span(l,.1,.25):i<=2?1:i===3?1-span(l,0,.3):0,psc=1;
  if(i===2){var m2=out(span(l,0,.35));px=lerp(phoneA.x,phoneB.x,m2);py=lerp(phoneA.y,phoneB.y,m2);psc=lerp(1,.7,m2)}else if(i>2){px=phoneB.x;py=phoneB.y;psc=.7}
  phone.style.opacity=pop.toFixed(3);
  phone.style.transform='translate('+(px-50).toFixed(1)+'px,'+(py-100).toFixed(1)+'px) perspective(700px) rotateX('+(pd*180).toFixed(1)+'deg) scale('+psc+')';
  var face=pd<.5;phone.style.background=face?'':'#0B0F12';phone.style.boxShadow=face?'':'0 10px 30px rgba(0,0,0,.6)';ptxt.style.opacity=face?1:0;
  if(i===0)ptxt.textContent=TYPO.slice(0,Math.round(span(l,.25,.7)*TYPO.length));
  /* the device */
  var dop=0,dsc=1,dx=0,dy=0;
  if(i===1){dop=out(span(l,0,.45));dsc=lerp(.9,1,dop)}
  else if(i===2){var m=out(span(l,0,.4));dop=1;dsc=lerp(1,narrow?.5:.42,m);dx=lerp(0,narrow?-W*.22:-W*.3,m);dy=lerp(0,narrow?H*.2:H*.18,m)}
  else if(i===3){dop=lerp(1,.25,span(l,0,.3));dsc=narrow?.5:.42;dx=narrow?-W*.22:-W*.3;dy=narrow?H*.2:H*.18}
  else if(i===4){dop=.25;dsc=narrow?.5:.42;dx=narrow?-W*.22:-W*.3;dy=narrow?H*.2:H*.18}
  else if(i===5){var m5=out(span(l,0,.5));dop=lerp(.25,narrow?0:.55,m5)*(1-span(l,.75,1));dsc=lerp(narrow?.5:.42,.3,m5);dx=lerp(narrow?-W*.22:-W*.3,0,m5);dy=lerp(narrow?H*.2:H*.18,H*.24,m5)}
  device.style.opacity=dop.toFixed(3);device.style.transform='translate(calc(-50% + '+dx.toFixed(1)+'px),calc(-50% + '+dy.toFixed(1)+'px)) scale('+dsc.toFixed(3)+')';
  var pressed=did.press||p>S[1]+(S[2]-S[1])*.62;device.classList.toggle('pressed',pressed&&i>=1&&i<5||(i===5&&l<.6));
  var hv=i===1?span(l,.25,.4)*(1-span(l,.85,1)):0;hint.style.opacity=hv;hint.style.pointerEvents=hv>.5?'auto':'none';
  q('.pill',hint).textContent=pressed?'Listening…':'Press to speak';
  /* act 2: the spoken note, and the light leaving the wrist */
  var sop=i===2?span(l,.02,.12)*(1-span(l,.85,1)):0;say.style.opacity=sop;
  if(i===2)say.innerHTML=noteUpTo(Math.round(span(l,.05,.72)*NOTE_LEN));
  var fl=i===2?span(l,.35,.9):i===3?1-span(l,.4,.7):0;
  if(fl>0){var sr=stage.getBoundingClientRect(),dr=device.getBoundingClientRect(),bx=dr.left-sr.left+dr.width*.146,by=dr.top-sr.top+dr.height*.561,
      prr=phone.getBoundingClientRect(),qx=prr.left-sr.left+prr.width/2,qy=prr.top-sr.top+prr.height/2,yr=you.getBoundingClientRect(),
      ex=narrow?W*.5:yr.left-sr.left+yr.width/2,ey=narrow?H*.14:yr.top-sr.top+9;
    fil.setAttribute('d','M'+bx+' '+by+' C'+(bx+W*.15)+' '+(by+H*.12)+' '+(qx-W*.12)+' '+(qy+H*.1)+' '+qx+' '+qy+' S'+(ex+W*.1)+' '+(ey+H*.2)+' '+ex+' '+ey);
    var len=fil.getTotalLength();fil.style.strokeDasharray=len;fil.style.strokeDashoffset=(len*(1-fl)).toFixed(1);fil.style.opacity=1}else fil.style.opacity=0;
  /* act 3–4: the system */
  var mop=i===3?span(l,0,.15):i===4?1:i===5?1-span(l,0,.35):0;map.style.opacity=mop.toFixed(3);
  map.style.transform=i===5?'scale('+lerp(1,.96,span(l,0,.35))+')':'none';
  stations.forEach(function(s){s.classList.toggle('on',!!q('.card.in',s));if(s.classList.contains('st-quiet'))s.style.opacity=i>=4?0:1});
  /* act 4: one question, one gate */
  var yes=did.yes||(i===4&&l>.4)||i===5,send=did.send||(i===4&&l>.9)||i===5;
  var aop=i===4?span(l,0,.08)*(1-span(l,.55,.65)):0;askq.style.opacity=aop;askq.style.pointerEvents=aop>.5?'auto':'none';
  askq.classList.toggle('done',yes);q('.pill',askq).textContent=yes?'Yes, him ✓':'Yes, him';
  var gop=i===4?span(l,.5,.6):0;gate.style.opacity=gop;gate.style.pointerEvents=gop>.5?'auto':'none';
  gate.classList.toggle('done',send&&i>=4);q('.pill',gate).textContent=send?'Sent ✓':'Send it';
  var prop=cards.proposal;if(prop){q('.k',prop).textContent=send?'Sent · after your tap':'Drafted · waits for you';prop.classList.toggle('wait',!send)}
  Object.keys(cards).forEach(function(k){cards[k].style.opacity=cards[k].classList.contains('in')?(i===4&&gop>.3&&k!=='proposal'?.45:1):0});
  /* act 5: quiet */
  var eo=i===5?span(l,.3,.55):0;end.style.opacity=eo;end.style.transform='translateY(calc(-50% + '+((1-eo)*24).toFixed(1)+'px))';
  var co=i===5?span(l,.62,.8):0;coda.style.opacity=co;coda.style.transform='translateY('+((1-co)*12).toFixed(1)+'px)';
  /* chrome */
  capN.textContent='0'+i;if(capT.textContent!==CAPS[i])capT.textContent=CAPS[i];
  cap.style.opacity=(i===0?span(l,.65,.85):i===5?1-span(l,.2,.35):1).toFixed(3);
  sim.style.opacity=(i>=2&&i<=4?1:0);
}

/* ---------- loop: gentle smoothing, never hijacks the scroll ---------- */
function prog(){var r=story.getBoundingClientRect(),t=r.height-innerHeight;return t>0?clamp(-r.top/t,0,1):0}
var target=0,cur=0,raf=0;
function tick(){cur+=(target-cur)*.18;if(Math.abs(target-cur)<.0004)cur=target;render(cur);raf=cur!==target?requestAnimationFrame(tick):0}
function onScroll(force){target=prog();if(force===true){render(cur)}if(!raf)raf=requestAnimationFrame(tick)}
addEventListener('scroll',onScroll,{passive:true});
var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){measure();render(cur)},120)});
measure();cur=target=prog();render(cur);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();render(cur)});
})();
