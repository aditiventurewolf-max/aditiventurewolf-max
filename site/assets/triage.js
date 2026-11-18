// Simulated preview: canned examples, no network calls, no API keys.
(function(){
  const EX=[
   {label:'A foggy morning',text:"I'm running on empty today. Move my three o'clock to Thursday, remind me to book the dentist, and find me something good to listen to on my walk.",
    out:[
     {k:'THOUGHT',c:'state',t:'Running on empty.',r:'→ The afternoon becomes recovery time'},
     {k:'DECISION',c:'firm',t:'Move the three o\u2019clock to Thursday.',r:'→ A polite note is drafted · needs your OK'},
     {k:'DECISION',c:'firm',t:'Book the dentist.',r:'→ Added to tomorrow morning, nothing sent'},
     {k:'IDEA',c:'',t:'Something good to listen to.',r:'→ An essay is queued for your walk'}]},
   {label:'End of the day',text:"That's enough for today. The slides are nearly done, leave the pricing slide for tomorrow. Remind me to call Mum on Sunday.",
    out:[
     {k:'THOUGHT',c:'state',t:'End of the work day.',r:'→ Non-urgent notifications go quiet'},
     {k:'IDEA',c:'',t:'Pricing slide: for tomorrow.',r:'→ Saved, not added to your to-do list'},
     {k:'DECISION',c:'firm',t:'Call Mum on Sunday.',r:'→ Added to your calendar'}]},
   {label:'A curious evening',text:"I keep wondering why old institutions outlast new companies. Is there something good to read on that?",
    out:[
     {k:'THOUGHT',c:'state',t:'A recurring curiosity.',r:'→ Remembered, so your reading gets better'},
     {k:'DECISION',c:'firm',t:'One essay for tomorrow\u2019s morning brief.',r:'→ One good piece, not a feed'}]}
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
        const ext=e.out.filter(x=>/your OK/.test(x.r)).length;
        ap.querySelector('p.q').textContent=ext?`${ext} external action${ext>1?'s':''} waiting for you. Nothing is sent until you say so.`:'Nothing needs approval. Internal updates done silently.';
        ap.querySelector('button').style.display=ext?'':'none';
        ap.classList.add('in')},400)},reduce?0:k*450));
  }
  ap.querySelector('button').onclick=function(){ap.classList.add('done');this.textContent='Approved ✓ (simulated)'};
  play(0);
})();
