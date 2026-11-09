// Image weight check: what downloads before the first scroll, per-image weight after a full scroll, and images much larger than their display size.
// Targets: <= 250KB of images before the first scroll; no single image over 200KB; natural width <= 1.6x the shown width on a 3x phone.
// Usage: node lp-weight.cjs <url>
const {find,launch}=require('./pw.cjs');
const {devices}=find();
const target=process.argv[2];
if(!target){console.error('usage: node lp-weight.cjs <url>');process.exit(1)}
const origin=new URL(target).origin;
(async()=>{const b=await launch();
for(const [name,ctx] of [['mobile',{...devices['iPhone 13']}],['desktop',{viewport:{width:1440,height:900}}]]){
 const c=await b.newContext(ctx);const p=await c.newPage();const bytes={};
 p.on('response',async r=>{try{const u=r.url();if(!u.startsWith(origin)&&!/fonts/.test(u))return;const l=+(r.headers()['content-length']||0)||(await r.body()).length;bytes[u]=l}catch{}});
 await p.goto(target,{waitUntil:'load'});await p.waitForTimeout(2500);
 const first=Object.entries(bytes);const sum=(arr,re)=>arr.filter(([u])=>re.test(u)).reduce((a,[,l])=>a+l,0);
 console.log(`\n== ${name}: first screen loads ${first.length} files, images ${(sum(first,/\.(webp|png|jpe?g|svg)/)/1024).toFixed(0)}KB, video ${(sum(first,/\.mp4/)/1024).toFixed(0)}KB, total ${(sum(first,/./)/1024).toFixed(0)}KB`);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120)}await p.waitForTimeout(2000);
 const dpr=await p.evaluate(()=>devicePixelRatio);
 const over=await p.evaluate(dpr=>[...document.images].filter(i=>i.naturalWidth&&i.getBoundingClientRect().width>0).map(i=>({s:i.currentSrc.split('/').pop(),nat:i.naturalWidth,shown:Math.round(i.getBoundingClientRect().width*dpr),lazy:i.loading})).filter(x=>x.nat>x.shown*1.6&&x.nat>500),dpr);
 const all=Object.entries(bytes);
 console.log(`after full scroll: images ${(sum(all,/\.(webp|png|jpe?g|svg)/)/1024).toFixed(0)}KB, video ${(sum(all,/\.mp4/)/1024).toFixed(0)}KB`);
 console.log('oversized (natural > 1.6x shown at dpr '+dpr+'):');over.sort((a,b)=>b.nat/b.shown-a.nat/a.shown).slice(0,12).forEach(x=>console.log('  ',x.s,x.nat+'px for',x.shown+'px',x.lazy));
 if(name==='mobile'){const eager=await p.evaluate(()=>[...document.images].filter(i=>i.loading!=='lazy').map(i=>(i.getAttribute('src')||'').split('/').pop()));console.log('not lazy:',eager.join(', '))}
 await c.close();}
await b.close();})();
