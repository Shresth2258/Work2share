/* Desk Rush v2: catch what helps you work, dodge distractions, grab power-ups, survive Rush Hour */
(function(){
const cv=document.getElementById('gcv');if(!cv)return;
const ctx=cv.getContext('2d'),box=document.getElementById('gbox'),ov=document.getElementById('gov');
const W=360,H=520,DUR=40,RUSH=10,EMO='system-ui,"Apple Color Emoji","Segoe UI Emoji",sans-serif';
const dpr=Math.min(window.devicePixelRatio||1,2);
cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
const el={s:document.getElementById('gScore'),t:document.getElementById('gTime'),b:document.getElementById('gBest'),c:document.getElementById('gCombo')};
const GOOD=[['💡',10],['☕',10],['💻',15],['📶',10]],BAD=['📱','🔔','😴'],POW=[['🧲','mag'],['🛡️','shd'],['⏰','tim']];
const RANKS=[[180,'Intern','☕'],[350,'Freelancer','💻'],[550,'Startup Founder','🚀'],[1e9,'CEO of Focus','👑']];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const R=window.W2SRef;
let best=0;try{best=+localStorage.getItem('w2sDeskBest')||0}catch(e){}
el.b.textContent=best;

/* colours follow the site theme */
let col={ink:'#111',teal:'#0a8e80'};
function readCol(){const s=getComputedStyle(document.documentElement);col.ink=s.getPropertyValue('--ink').trim()||'#111';col.teal=s.getPropertyValue('--teal2').trim()||'#0a8e80'}
readCol();new MutationObserver(readCol).observe(document.documentElement,{attributes:true,attributeFilter:['class']});

/* sound (WebAudio, no files) */
let AC=null,muted=false;try{muted=localStorage.getItem('w2sDeskMute')==='1'}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type,v,f2,delay){if(muted)return;const a=ac();if(!a)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();
 o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(v||.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.03)}
const sfx={
 good:c=>tone(520+Math.min(c,20)*26,.12,'triangle',.09),
 star:()=>{[784,988,1319].forEach((f,i)=>tone(f,.14,'triangle',.08,0,i*.05))},
 bad:()=>tone(170,.3,'sawtooth',.08,70),
 pow:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.12,'square',.045,0,i*.06))},
 block:()=>tone(300,.2,'square',.06,600),
 tick:()=>tone(660,.09,'sine',.06),
 go:()=>tone(990,.28,'triangle',.09),
 rush:()=>{[440,554,659,880].forEach((f,i)=>tone(f,.16,'sawtooth',.045,0,i*.07))},
 end:w=>{(w?[523,659,784,1046]:[392,330,262]).forEach((f,i)=>tone(f,.2,'triangle',.08,0,i*.11))}
};
const mb=document.getElementById('gMute');
function paintMute(){if(mb){mb.textContent=muted?'🔇':'🔊';mb.setAttribute('aria-pressed',String(muted));mb.setAttribute('aria-label',muted?'Turn sound on':'Turn sound off')}}
if(mb)mb.onclick=()=>{muted=!muted;try{localStorage.setItem('w2sDeskMute',muted?'1':'0')}catch(e){}paintMute();if(!muted){ac();sfx.tick()}};
paintMute();

/* state */
let mode='idle',score=0,left=DUR,combo=0,maxCombo=0,caught=0,items=[],pops=[],parts=[],spawn=0,shake=0,last=0,raf=0,visible=true;
let cd=3,rush=false,rushed=false,magT=0,shield=false,flash={c:'',l:0},bn={t:'',l:0,m:1,c:'#fff'},bgx=0,usedPow=0;
const P={x:W/2,w:88,h:16,y:H-52,tx:W/2},keys={l:false,r:false};
const act=()=>mode==='play'||mode==='count';
const mult=()=>(1+Math.min(3,Math.floor(combo/5)))*(rush?2:1);

/* decor: skyline buildings generated once */
const bld=[];{let x=0;while(x<W*2){const w=26+Math.random()*34,h=60+Math.random()*110;bld.push([x,w,h]);x+=w+4}}

/* input */
function setX(cx){const r=cv.getBoundingClientRect();P.tx=Math.max(P.w/2,Math.min(W-P.w/2,(cx-r.left)/r.width*W))}
cv.addEventListener('pointermove',e=>{if(act())setX(e.clientX)});
cv.addEventListener('pointerdown',e=>{if(act()){setX(e.clientX);try{cv.setPointerCapture(e.pointerId)}catch(x){}}});
addEventListener('keydown',e=>{if(!act())return;const k=e.key;
 if(k==='ArrowLeft'||k==='a'||k==='A'){keys.l=true;e.preventDefault()}
 if(k==='ArrowRight'||k==='d'||k==='D'){keys.r=true;e.preventDefault()}});
addEventListener('keyup',e=>{const k=e.key;
 if(k==='ArrowLeft'||k==='a'||k==='A')keys.l=false;
 if(k==='ArrowRight'||k==='d'||k==='D')keys.r=false});

function hud(){el.s.textContent=score;el.t.textContent=Math.ceil(left);el.c.textContent='x'+mult()}
function pop(x,y,t,c){pops.push({x,y,t,c,l:.9})}
function say(t,l,c){bn.t=t;bn.l=bn.m=l||1.2;bn.c=c||'#fff'}
function burst(x,y,c,n){if(reduce)return;for(let i=0;i<(n||9);i++){const a=Math.random()*6.28,v=40+Math.random()*100;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,l:.5,c})}}

function fitView(){const r=box.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight-8)box.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'})}
function start(){
 ac();
 score=0;left=DUR;combo=0;maxCombo=0;caught=0;items=[];pops=[];parts=[];spawn=.4;shake=0;cd=3;rush=rushed=false;magT=0;shield=false;usedPow=0;flash.l=0;bn.l=0;
 fitView();
 P.x=P.tx=W/2;mode='count';box.classList.add('playing');ov.classList.add('h');hud();sfx.tick();
 last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function end(){
 mode='over';box.classList.remove('playing');keys.l=keys.r=false;
 const isBest=score>best;if(isBest&&score>0){best=score;try{localStorage.setItem('w2sDeskBest',best)}catch(e){}}
 el.b.textContent=best;
 const rk=RANKS.find(r=>score<r[0]);sfx.end(score>=180);
 const link=R?R.link():location.href.split('#')[0]+'#game',pct=R?R.pct:7,code=R?R.code():'';
 const msg='I scored '+score+' on Desk Rush at Work2Share and became a '+rk[1]+'! Beat my score, and get '+pct+'% off your first booking with my link: '+link;
 const share=R?R.wa(msg):'https://wa.me/?text='+encodeURIComponent(msg);
 const tour=(R?R.wt:t=>'https://wa.me/918383963820?text='+encodeURIComponent(t))('Hi Work2Share, I scored '+score+' on Desk Rush and would like to book a tour');
 ov.innerHTML='<div class="ge">'+rk[2]+'</div><h3>'+rk[1]+'</h3><div class="gs">'+score+'</div>'
  +'<p>'+(isBest&&score>0?'New personal best! ':'')+'Best combo x'+(1+Math.min(3,Math.floor(maxCombo/5)))+' · '+caught+' caught · '+usedPow+' power-ups</p>'
  +'<div class="gb"><button class="btn" id="gAgain" type="button"><span>Play again</span></button>'
  +'<a class="btn wa-b" target="_blank" rel="noopener" href="'+share+'"><span>Refer &amp; get '+pct+'% off</span></a>'
  +'<a class="btn gh" target="_blank" rel="noopener" href="'+tour+'"><span>Book a tour</span></a></div>'
  +(code?'<p class="gcode">Your referral code: <b>'+code+'</b></p>':'');
 ov.classList.remove('h');document.getElementById('gAgain').onclick=start;
}

function move(dt){
 const dir=(keys.r?1:0)-(keys.l?1:0);if(dir)P.tx=Math.max(P.w/2,Math.min(W-P.w/2,P.tx+dir*440*dt));
 P.x+=(P.tx-P.x)*Math.min(1,dt*18);bgx=(bgx+dt*9)%(W);
 if(bn.l>0)bn.l-=dt;if(flash.l>0)flash.l-=dt;if(shake>0)shake-=dt;
 for(let i=pops.length-1;i>=0;i--){const p=pops[i];p.y-=44*dt;p.l-=dt;if(p.l<=0)pops.splice(i,1)}
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=260*dt;p.l-=dt;if(p.l<=0)parts.splice(i,1)}
}
function count(dt){
 move(dt);const n0=Math.ceil(cd);cd-=dt;
 if(cd<=0){mode='play';sfx.go();say('GO!',.8,col.teal)}else if(Math.ceil(cd)!==n0)sfx.tick();
}
function catchIt(it){
 const x=it.x;
 if(it.kind==='bad'){
  if(shield){shield=false;pop(x,P.y-10,'Blocked!',col.teal);burst(x,P.y,col.teal,12);sfx.block();flash={c:'#0a8e80',l:.18};return}
  combo=0;score=Math.max(0,score-15);if(!reduce)shake=.3;flash={c:'#d64545',l:.25};
  pop(x,P.y-10,'-15','#d64545');burst(x,P.y,'#d64545');sfx.bad();try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}
 }else if(it.kind==='pow'){
  usedPow++;sfx.pow();burst(x,P.y,'#e6b422',14);
  if(it.pw==='mag'){magT=6;pop(x,P.y-10,'Magnet!','#e6b422')}
  else if(it.pw==='shd'){shield=true;pop(x,P.y-10,'Shield!','#e6b422')}
  else{left=Math.min(DUR+10,left+4);pop(x,P.y-10,'+4s','#e6b422')}
 }else{
  const m0=mult();combo++;caught++;maxCombo=Math.max(maxCombo,combo);
  const m=mult(),g=it.pts*m;score+=g;
  pop(x,P.y-10,'+'+g,it.kind==='star'?'#e6b422':col.teal);burst(x,P.y,it.kind==='star'?'#e6b422':col.teal,it.kind==='star'?16:9);
  it.kind==='star'?sfx.star():sfx.good(combo);
  if(m>m0&&!rush)say('COMBO x'+m+'!',.9,'#e6b422');
 }
 hud();
}
function update(dt){
 left-=dt;if(left<=0){left=0;hud();end();return}
 const el_=DUR-left;
 rush=left<=RUSH;if(rush&&!rushed){rushed=true;say('RUSH HOUR · x2 POINTS',1.7,'#ff7a1a');sfx.rush()}
 move(dt);
 spawn-=dt;
 if(spawn<=0){
  spawn=Math.max(.28,.78-el_*.011)*(rush?.8:1);
  let it;const vy=130+el_*3.2+Math.random()*60+(rush?30:0),x=24+Math.random()*(W-48),base={x,y:-24,vy,r:Math.random()*2-1,a:0};
  const roll=Math.random();
  if(el_>4&&roll<.05){const p=POW[Math.random()*POW.length|0];it=Object.assign(base,{ch:p[0],pw:p[1],kind:'pow'})}
  else if(roll<Math.min(.4,.26+el_*.004)+.05){it=Object.assign(base,{ch:BAD[Math.random()*BAD.length|0],kind:'bad'})}
  else if(Math.random()<.07){it=Object.assign(base,{ch:'🌟',pts:30,kind:'star'})}
  else{const g=GOOD[Math.random()*GOOD.length|0];it=Object.assign(base,{ch:g[0],pts:g[1],kind:'good'})}
  items.push(it);
 }
 if(magT>0)magT-=dt;
 for(let i=items.length-1;i>=0;i--){
  const it=items[i];it.y+=it.vy*dt;it.a+=it.r*dt;
  if(magT>0&&(it.kind==='good'||it.kind==='star')&&it.y>30)it.x+=(P.x-it.x)*Math.min(1,dt*2.8);
  if(it.y>P.y-12&&it.y<P.y+P.h&&Math.abs(it.x-P.x)<P.w/2+12){items.splice(i,1);catchIt(it)}
  else if(it.y>H+30)items.splice(i,1);
 }
 hud();
}

function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h)}
function drawBG(now){
 ctx.save();ctx.fillStyle=col.ink;
 /* skyline, slow parallax */
 ctx.globalAlpha=.06;
 for(const b of bld){let x=b[0]-bgx;if(x<-b[1])x+=W*2;ctx.fillRect(x,H*.64-b[2],b[1],b[2]+H)}
 /* window frames */
 ctx.globalAlpha=.07;ctx.lineWidth=3;ctx.strokeStyle=col.ink;
 for(let i=0;i<3;i++){rr(22+i*114,26,100,150,10);ctx.stroke()}
 ctx.globalAlpha=1;ctx.restore();
 /* floor glow */
 const g=ctx.createLinearGradient(0,H-110,0,H);g.addColorStop(0,'rgba(10,142,128,0)');g.addColorStop(1,'rgba(10,142,128,.2)');
 ctx.fillStyle=g;ctx.fillRect(0,H-110,W,110);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='30px '+EMO;ctx.fillText('🪴',26,H-24);ctx.fillText('🪴',W-26,H-24);
 /* rush hour vignette */
 if(rush&&mode==='play'){const a=.1+.05*Math.sin(now*8),v=ctx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);v.addColorStop(0,'rgba(255,122,26,0)');v.addColorStop(1,'rgba(255,122,26,'+a+')');ctx.fillStyle=v;ctx.fillRect(0,0,W,H)}
}
function draw(now){
 ctx.clearRect(0,0,W,H);ctx.save();
 if(shake>0)ctx.translate((Math.random()-.5)*8,(Math.random()-.5)*8);
 drawBG(now);
 ctx.textAlign='center';ctx.textBaseline='middle';
 for(const it of items){ctx.save();ctx.translate(it.x,it.y);ctx.rotate(it.a);ctx.font=(it.kind==='star'?34:30)+'px '+EMO;
  if(it.kind==='bad'){ctx.shadowColor='rgba(214,69,69,.6)';ctx.shadowBlur=12}
  else if(it.kind==='star'||it.kind==='pow'){ctx.shadowColor='rgba(230,180,34,.95)';ctx.shadowBlur=18}
  else{ctx.shadowColor='rgba(10,142,128,.35)';ctx.shadowBlur=8}
  ctx.fillText(it.ch,0,0);ctx.restore()}
 /* magnet field */
 if(magT>0){ctx.save();ctx.globalAlpha=.25+.1*Math.sin(now*10);ctx.strokeStyle='#e6b422';ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.arc(P.x,P.y-8,64,0,6.28);ctx.stroke();ctx.restore()}
 /* shield bubble */
 if(shield){ctx.save();ctx.globalAlpha=.5+.2*Math.sin(now*6);ctx.strokeStyle=col.teal;ctx.fillStyle='rgba(10,142,128,.12)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(P.x,P.y-12,50,0,6.28);ctx.fill();ctx.stroke();ctx.restore()}
 /* player */
 ctx.font='34px '+EMO;ctx.fillText('🧑‍💻',P.x,P.y-16);
 if(combo>=10&&act()){ctx.font='20px '+EMO;ctx.fillText('🔥',P.x+32,P.y-34+Math.sin(now*12)*2)}
 ctx.fillStyle=col.teal;rr(P.x-P.w/2,P.y,P.w,P.h,8);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(P.x-P.w/2+8,P.y+4,P.w-16,3);
 for(const p of parts){ctx.globalAlpha=Math.max(0,p.l*2);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,4,4)}
 ctx.globalAlpha=1;
 ctx.font='800 17px Montserrat,system-ui,sans-serif';
 for(const p of pops){ctx.globalAlpha=Math.min(1,p.l*2);ctx.fillStyle=p.c;ctx.fillText(p.t,p.x,p.y)}
 ctx.globalAlpha=1;ctx.restore();
 /* screen flash */
 if(flash.l>0){ctx.globalAlpha=Math.min(.28,flash.l);ctx.fillStyle=flash.c;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 /* time bar + status */
 if(mode==='play'||mode==='count'){
  ctx.fillStyle='rgba(120,120,120,.18)';ctx.fillRect(0,0,W,5);
  ctx.fillStyle=rush?'#ff7a1a':col.teal;ctx.fillRect(0,0,W*Math.max(0,left/DUR),5);
  ctx.textAlign='left';ctx.font='700 13px Montserrat,system-ui,sans-serif';ctx.fillStyle=col.ink;ctx.globalAlpha=.85;
  let sy=22;if(magT>0){ctx.fillText('🧲 '+Math.ceil(magT)+'s',10,sy);sy+=20}if(shield)ctx.fillText('🛡️ ready',10,sy);
  ctx.globalAlpha=1;ctx.textAlign='center';
 }
 /* countdown + banners */
 if(mode==='count'){ctx.font='800 96px Montserrat,system-ui,sans-serif';ctx.fillStyle=col.teal;ctx.globalAlpha=.9;ctx.fillText(Math.ceil(cd),W/2,H/2-20);ctx.globalAlpha=1}
 if(bn.l>0){const k=1-bn.l/bn.m,sc=1+Math.max(0,.25-k)*2;ctx.save();ctx.translate(W/2,H*.3);ctx.scale(sc,sc);ctx.globalAlpha=Math.min(1,bn.l*2.5);
  ctx.font='800 26px Montserrat,system-ui,sans-serif';ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.strokeText(bn.t,0,0);ctx.fillStyle=bn.c;ctx.fillText(bn.t,0,0);ctx.restore()}
}

function loop(now){
 if(!act())return;
 const dt=Math.min(.05,(now-last)/1000);last=now;
 if(visible&&!document.hidden){mode==='count'?count(dt):update(dt)}
 draw(now/1000);
 if(act())raf=requestAnimationFrame(loop);
}

new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(act())last=performance.now()},{threshold:.15}).observe(box);
document.addEventListener('visibilitychange',()=>{last=performance.now()});
document.getElementById('gStart').onclick=start;
draw(0);

/* floating button: appears after the hero, hides while the game is on screen */
const fab=document.getElementById('gfab');
if(fab){let near=false,past=false;const upd=()=>fab.classList.toggle('on',past&&!near);
 addEventListener('scroll',()=>{past=scrollY>innerHeight*.6;upd()},{passive:true});
 new IntersectionObserver(e=>{near=e[0].isIntersecting;upd()},{threshold:.05}).observe(document.getElementById('game'))}
})();
