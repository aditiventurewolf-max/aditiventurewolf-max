// Simulated preview: canned examples, no network calls, no API keys.
(function(){
  const EX=[
   {label:'Brain fog + vendor',text:"Brain fog is heavy today. Push the vendor call to Thursday, order the ESP32-S3 board for the prototype, and queue something philosophical for my evening walk.",
    out:[
     {k:'THOUGHT',c:'state',t:'Brain fog is heavy today.',r:'→ LIFE_PLANNER · afternoon deep-work block converted to recovery'},
     {k:'DECISION',c:'firm',t:'Push the vendor call to Thursday.',r:'→ COMMS · Thursday slot negotiated automatically'},
     {k:'DECISION',c:'firm',t:'Order the ESP32-S3 board.',r:'→ PROCUREMENT_OPS · DevKit matched across verified suppliers · 1-tap approval queued'},
     {k:'IDEA',c:'',t:'Something philosophical for the evening walk.',r:'→ INTEL_CURATOR · long-form essay on Lewis Mumford and tool-making queued for audio'},
     {k:'SCREEN_TIME',c:'state',t:'Required for this note: 0.0 seconds.',r:''}]},
   {label:'Evening wind-down',text:"Done for today. The pitch deck is mostly there, park the pricing slide for tomorrow. Remind me to call Amma on Sunday.",
    out:[
     {k:'THOUGHT',c:'state',t:'End of the work day.',r:'→ LIFE_PLANNER · silences non-urgent notifications'},
     {k:'IDEA',c:'',t:'Pricing slide: parked for tomorrow.',r:'→ Idea incubator · not added to your to-do list'},
     {k:'DECISION',c:'firm',t:'Call Amma on Sunday.',r:'→ LIFE_PLANNER · personal calendar block, no approval needed'}]},
   {label:'Reading curiosity',text:"I keep thinking about why slow institutions outlast fast startups. Is there something good on that?",
    out:[
     {k:'THOUGHT',c:'state',t:'A recurring curiosity.',r:'→ Journal · interest map updated'},
     {k:'DECISION',c:'firm',t:'One essay for tomorrow\u2019s morning brief.',r:'→ INTEL_CURATOR · 1 high-signal piece, not a feed'}]}
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
      d.innerHTML=`<span class="tag ${o.c}">${o.k}</span><p>${o.t}</p>${o.r?`<div class="route">${o.r}</div>`:''}`;
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
