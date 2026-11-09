// Scroll timing check: how much word-lighting text is lit at reading height, and where fade-ins appear. Usage: node lp-timing.cjs <url>
const {launch}=require('./pw.cjs');
if(!process.argv[2]){console.error('usage: node lp-timing.cjs <url>');process.exit(1)}
(async()=>{const b=await launch();
for(const [w,h] of [[390,844],[1440,900]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto(process.argv[2],{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);
 const hero=await p.evaluate(()=>Math.round((document.querySelector('#s-hero,.hero,section')||document.body).getBoundingClientRect().height));
 console.log(`\n== ${w}x${h} hero=${hero} ${hero>=h?'FULL':'SHORT'}`);
 // sfade: lit fraction when block centre is at 55% of the viewport
 const n=await p.evaluate(()=>document.querySelectorAll('[data-sfade]').length);
 for(let i=0;i<n;i++){
  await p.evaluate(([i,h])=>{const el=document.querySelectorAll('[data-sfade]')[i];const r=el.getBoundingClientRect();scrollTo(0,scrollY+r.top+r.height/2-h*.55);},[i,h]);
  await p.waitForTimeout(450);
  const r=await p.evaluate(i=>{const el=document.querySelectorAll('[data-sfade]')[i];const ws=el.querySelectorAll('.w');const lit=el.querySelectorAll('.w.lit').length;return {sec:el.closest('section').id,lit,total:ws.length}},i);
  console.log(`sfade ${r.sec}: ${r.lit}/${r.total} lit at reading position (${Math.round(100*r.lit/r.total)}%)`);
 }
 // reveal: scroll slowly, record viewport position (% from top) of each element's top when it gets .in
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
 await p.evaluate(()=>{window.__rec=[];const els=[...document.querySelectorAll('.reveal,.fly-r,.fly-l')];
  new MutationObserver(ms=>ms.forEach(m=>{const t=m.target;if(t.classList.contains('in')&&!t.__done){t.__done=1;__rec.push({pos:Math.round(100*t.getBoundingClientRect().top/innerHeight),sec:(t.closest("section")||{}).id,what:t.tagName+"."+String(t.className).split(" ").slice(0,2).join(".")+" "+(t.innerText||"").trim().slice(0,25)})}})).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});});
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 for(let y=0;y<H;y+=60){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(25);}
 const rec=await p.evaluate(()=>__rec);
 const below=rec.filter(r=>r.pos>=0);const late=below.filter(r=>r.pos<60);
 const avg=below.length?Math.round(below.reduce((a,r)=>a+r.pos,0)/below.length):0;
 console.log(`reveal: ${rec.length} elements, avg appear at ${avg}% of screen; ${late.length} late (top above 60%):`);
 late.forEach(r=>console.log(`   ${r.pos}% ${r.sec} ${r.what}`));
 await p.close();}
await b.close();})();
