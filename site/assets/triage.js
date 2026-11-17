// Simulated preview: canned examples, no network calls, no API keys.
(function(){
  const EX=[
   {label:'Walking, 15s note',text:"Move tomorrow's vendor call, my head's foggy today. Order two more ESP32-S3 boards. Oh — and someone should write about why we stopped reading long essays.",
    out:[
     {k:'STATE_SIGNAL',c:'state',t:'Low energy flagged.',r:'→ Life Planner · protects rest, proposes shifting deep work'},
     {k:'FIRM_DECISION',c:'firm',t:'Reschedule tomorrow’s vendor call.',r:'→ Comms · drafts polite note · needs your 1-tap'},
     {k:'FIRM_DECISION',c:'firm',t:'Order 2 × ESP32-S3 boards.',r:'→ Ops · finds supplier · needs your 1-tap before any payment'},
     {k:'LOOSE_IDEA',c:'',t:'Essay: why we stopped reading long essays.',r:'→ Idea vault · not added to your to-do list'}]},
   {label:'Evening wind-down',text:"Done for today. The pitch deck is mostly there, park the pricing slide for tomorrow. Remind me to call Amma on Sunday.",
    out:[
     {k:'STATE_SIGNAL',c:'state',t:'End of work window.',r:'→ Life Planner · silences non-urgent notifications'},
     {k:'LOOSE_IDEA',c:'',t:'Pricing slide: parked for tomorrow.',r:'→ Tomorrow’s first block, nothing else added'},
     {k:'FIRM_DECISION',c:'firm',t:'Call Amma — Sunday.',r:'→ Calendar · personal event, no approval needed'}]},
   {label:'Reading curiosity',text:"I keep thinking about why slow institutions outlast fast startups. Is there something good on that?",
    out:[
     {k:'LOOSE_IDEA',c:'',t:'Curiosity: durability of slow institutions.',r:'→ Interest graph · updated'},
     {k:'FIRM_DECISION',c:'firm',t:'One essay for tomorrow’s morning brief.',r:'→ Curator · 1 high-signal piece, not a feed'}]}
  ];
  const $=s=>document.querySelector(s);
  const chips=$('#chips'),tx=$('#transcript'),out=$('#tri-out'),ap=$('#approve');
  if(!chips)return;
  let timer,run=0;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  EX.forEach((e,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=e.label;b.setAttribute('aria-pressed','false');b.onclick=()=>play(i);chips.appendChild(b)});
  function play(i){
    const id=++run;clearTimeout(timer);
    [...chips.children].forEach((c,j)=>c.setAttribute('aria-pressed',j===i));
    const e=EX[i];out.innerHTML='';ap.className='approve';ap.querySelector('button').textContent='Approve';
    ap.querySelector('p.q').textContent='';
    let n=0;
    const type=()=>{ if(id!==run)return;
      tx.innerHTML=e.text.slice(0,n).replace(/</g,'&lt;')+'<span class="cursor"></span>';
      if(n<e.text.length){n+=reduce?e.text.length:2;timer=setTimeout(type,18)}
      else{tx.textContent=e.text;timer=setTimeout(()=>reveal(e,id),350)}};
    type();
  }
  function reveal(e,id){
    e.out.forEach((o,k)=>setTimeout(()=>{ if(id!==run)return;
      const d=document.createElement('div');d.className='item';
      d.innerHTML=`<span class="tag ${o.c}">${o.k}</span><p>${o.t}</p><div class="route">${o.r}</div>`;
      out.appendChild(d);requestAnimationFrame(()=>d.classList.add('in'));
      if(k===e.out.length-1)setTimeout(()=>{ if(id!==run)return;
        const ext=e.out.filter(x=>/1-tap/.test(x.r)).length;
        ap.querySelector('p.q').textContent=ext?`${ext} external action${ext>1?'s':''} waiting for you. Nothing is sent until you say so.`:'Nothing needs approval. Internal updates done silently.';
        ap.querySelector('button').style.display=ext?'':'none';
        ap.classList.add('in')},400)},reduce?0:k*450));
  }
  ap.querySelector('button').onclick=function(){ap.classList.add('done');this.textContent='Approved ✓ (simulated)'};
  play(0);
})();
