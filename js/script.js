const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// progress + header
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';$('#hd').classList.toggle('s',scrollY>40);
 const wd=$$('.w'),r=$('#words').getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(innerHeight*.6)));wd.forEach((w,i)=>w.classList.toggle('on',i/wd.length<p));
 const g=$('#gs');if(g)g.style.translate='0 '+Math.min(scrollY*.08,60)+'px';},{passive:true});
$('#bg').onclick=()=>$('#pl').classList.toggle('o');$$('#pl a').forEach(a=>a.onclick=()=>$('#pl').classList.remove('o'));
$('#th').onclick=()=>document.documentElement.classList.toggle('dk');
// word reveal
(function(){const h=$('#words');const o=[];h.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent.split(/\s+/).filter(Boolean).forEach(t=>{const s=document.createElement('span');s.className='w';s.textContent=t;o.push(s)});else{const s=document.createElement('span');s.className='w';s.append(n.cloneNode(true));o.push(s)}});h.textContent='';o.forEach(s=>h.append(s,' '))})();
// reveals
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.2});
$$('.rv,.dicebar,.half').forEach(e=>io.observe(e));window.__rvDone=true;
// counters
new IntersectionObserver((e,o)=>e.forEach(x=>{if(!x.isIntersecting)return;o.unobserve(x.target);$$('[data-n]').forEach(b=>{const n=+b.dataset.n,d=+b.dataset.d,sx=b.dataset.s,t=performance.now();(function f(now){const k=Math.min(1,(now-t)/1800);b.textContent=(n*(1-Math.pow(1-k,3))).toFixed(d)+sx;if(k<1)requestAnimationFrame(f)})(t)})}),{threshold:.3}).observe($('#sg'));
// birds
for(let i=0;i<7;i++){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 26 12');s.classList.add('bird');s.innerHTML='<path class="flap" d="M0 8Q6 0 13 8Q20 0 26 8Q20 5 13 12Q6 5 0 8z"/>';s.style.cssText=`top:${12+i*9}%;animation-duration:${14+i*3}s;animation-delay:${-i*4}s;width:${18+i*3}px;position:absolute;z-index:1;pointer-events:none;opacity:.7`;$('.hero').append(s)}
// hero rotating headline
let hi=0;
const dts=$$('#hd2 b');function setH(i){hi=i;dts.forEach((d,k)=>d.classList.toggle('a',k===i));$$('.sl,.art').forEach(e=>{const k=+e.dataset.i;e.classList.toggle('on',k===i);e.classList.toggle('out',k===(i+2)%3)});initBirds(i)}setTimeout(()=>setH(0),100);
dts.forEach((d,i)=>d.onclick=()=>setH(i));setInterval(()=>setH((hi+1)%3),5500);
// mouse parallax on hero
$('#stage').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('#win').style.transform=`translate(${500+x*30}px,${40+y*30}px)`;e.currentTarget.querySelector('.disc').style.translate=`${x*-20}px ${y*-20}px`});
// office tour
(function(){
 const slides=$$('.ts'),th=$$('.tour-thumbs button'),nm=slides.map(x=>x.dataset.name),bar=$('#tbar'),arch=$('#arch');let si=0,tm;
 function room(i){si=(i+slides.length)%slides.length;slides.forEach((c,k)=>c.classList.toggle('on',k===si));th.forEach((c,k)=>{c.classList.toggle('on',k===si);c.setAttribute('aria-pressed',k===si)});
  $('#rn').textContent=nm[si];
  bar.classList.remove('go');void bar.offsetWidth;bar.classList.add('go');clearTimeout(tm);tm=setTimeout(()=>room(si+1),5500)}
 arch.onclick=()=>room(si+1);arch.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();room(si+1)}};
 th.forEach((b,k)=>b.onclick=()=>room(k));
 room(0);
 const aw=$('#aw');aw.addEventListener('pointermove',e=>{const r=aw.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;arch.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*7}deg)`});
 aw.addEventListener('pointerleave',()=>arch.style.transform='');
})();
// testimonials
const T=[['Northwind Media','We started with a single hot desk and moved to a private cabin within months. The community made growing feel easy.','Asha Verma','Founder'],['Helio Energy','The virtual office gave us a professional address from day one, and mail handling just works. No rent, no fuss.','Nikhil Rao','Director'],['Futura Capital','We use the meeting rooms for every client pitch. They are well equipped and always ready when we walk in.','Rohan Mehta','Partner'],['Aqualume','Fast Wi-Fi, power backup and a calm space. My remote team finally has a place it enjoys coming to.','Elena Costa','Team Lead'],['Brightpath Labs','Flexible plans meant we paid only for what we needed while small, and scaled up when we were ready.','Dev Malhotra','Co-Founder'],['Orbit Legal','Our clients see a proper business address and a smooth reception. It lifted how we look to them.','Priya Nair','Managing Partner'],['Kinfolk Studio','I met my best collaborators over coffee in the pantry. The community is the real perk.','Sam Dsouza','Designer'],['Tessera Health','Housekeeping, security and a helpful front desk are all handled, so we just walk in and work.','Dr. Kavya Iyer','Consultant']];
const bw=$('#bars');for(let k=0;k<14;k++)bw.insertAdjacentHTML('beforeend','<i style="--k:'+k+'"></i>');const dk=$('#deck'),dd=$('#dd'),br=$$('.bars i');let ti=0;const LC=['#c8102e','#0a3d62','#e3262e','#2a7de1','#6b3fa0','#222','#d98a00','#0a8e80'],HB=[96,94,90,88,92,96,99];T.forEach((t,i)=>{dk.insertAdjacentHTML('beforeend',`<div class="tc"><div><div class="lg" style="background:${LC[i]}">${t[0]}</div><q>${t[1]}</q></div><div><strong>${t[2]}</strong><small>${t[3]}</small></div></div>`);dd.insertAdjacentHTML('beforeend','<b></b>')});
const cs=$$('.tc'),ds=$$('#dd b');
function show(i){ti=(i+T.length)%T.length;cs.forEach((c,k)=>{c.style.transform=`translateX(${(ti-k)*106}%)`;c.style.opacity=(k===ti||k===ti-1)?1:0});ds.forEach((x,k)=>x.classList.toggle('a',k===ti));br.forEach((b,k)=>b.style.height=(86+k*.9-((ti+k)%3))+'%');bw.classList.remove('fl');void bw.offsetWidth;bw.classList.add('fl')}
$('#pv').onclick=()=>show(ti-1);$('#nx').onclick=()=>show(ti+1);ds.forEach((d,i)=>d.onclick=()=>show(i));show(0);setInterval(()=>show(ti+1),6000);

// meeting rooms arch
(function(){
 const a=document.getElementById('mra');if(!a)return;
 const s=[...a.querySelectorAll('.ms')],n=document.getElementById('mrn'),b=document.getElementById('mrbar');let i=0,t;
 function go(k){i=(k+s.length)%s.length;s.forEach((x,j)=>x.classList.toggle('on',j===i));n.textContent=s[i].dataset.name;
  b.classList.remove('go');void b.offsetWidth;b.classList.add('go');clearTimeout(t);t=setTimeout(()=>go(i+1),5500)}
 a.onclick=()=>go(i+1);a.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(i+1)}};
 go(0);
 const m=document.getElementById('mrm');
 m.addEventListener('pointermove',e=>{const r=m.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;a.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*7}deg)`});
 m.addEventListener('pointerleave',()=>a.style.transform='');
})();


// rooms cards: tilt + spotlight
(function(){
 document.querySelectorAll('.rooms .rm').forEach(c=>{
  c.addEventListener('pointermove',e=>{if(!c.classList.contains('in'))return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
   c.classList.add('tilt');c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.transform=`rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*6}deg) translateY(-4px)`});
  c.addEventListener('pointerleave',()=>{c.style.transform='';setTimeout(()=>c.classList.remove('tilt'),200)});
 });
})();

// gate-opening sound (synthesised with Web Audio, no file needed)
(function(){
 const aw=document.getElementById('aw'),btn=document.getElementById('gsnd');if(!aw)return;
 let ctx=null,on=true,done=false;
 try{on=sessionStorage.getItem('w2sGate')!=='off'}catch(e){}
 function sync(){if(!btn)return;btn.setAttribute('aria-pressed',on);btn.setAttribute('aria-label',on?'Gate sound on':'Gate sound off')}
 sync();
 // browsers only allow sound after the visitor has clicked, tapped or pressed a key
 function unlock(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!ctx)ctx=new C();if(ctx.state==='suspended')ctx.resume()}
 ['pointerdown','touchend','keydown'].forEach(ev=>addEventListener(ev,unlock,{passive:true}));
 if(btn)btn.addEventListener('click',e=>{e.stopPropagation();on=!on;try{sessionStorage.setItem('w2sGate',on?'on':'off')}catch(x){}sync()});
 function noise(c,dur){const b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
 function out(c,m,pan){if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;p.connect(m);return p}return m}
 function ir(c,dur,dec){const n=Math.ceil(c.sampleRate*dur),b=c.createBuffer(2,n,c.sampleRate);for(let k=0;k<2;k++){const d=b.getChannelData(k);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec)}return b}
 // sharp metallic clank: inharmonic partials + a bright click
 function clank(c,m,t,vol,base){
  [1,2.76,5.4,8.93].forEach((r,i)=>{const o=c.createOscillator();o.type=i?'sine':'triangle';o.frequency.value=base*r;
   const g=c.createGain();g.gain.setValueAtTime(vol/(i+1),t);g.gain.exponentialRampToValueAtTime(.0005,t+.55-i*.1);o.connect(g);g.connect(m);o.start(t);o.stop(t+.6)});
  const n=c.createBufferSource();n.buffer=noise(c,.06);const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=3200;
  const ng=c.createGain();ng.gain.setValueAtTime(vol*1.3,t);ng.gain.exponentialRampToValueAtTime(.001,t+.05);n.connect(hp);hp.connect(ng);ng.connect(m);n.start(t);n.stop(t+.07);
 }
 // deep sub boom with a punchy body
 function boom(c,m,t,vol,len){
  const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(30,t+len);
  const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+len);o.connect(g);g.connect(m);o.start(t);o.stop(t+len+.05);
  const n=c.createBufferSource();n.buffer=noise(c,.18);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=700;
  const ng=c.createGain();ng.gain.setValueAtTime(vol*.9,t);ng.gain.exponentialRampToValueAtTime(.001,t+.16);n.connect(f);f.connect(ng);ng.connect(m);n.start(t);n.stop(t+.19);
 }
 // rising air sweep as each door swings
 function whoosh(c,m,t,dur,pan,f0,f1){
  const n=c.createBufferSource();n.buffer=noise(c,dur);const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;
  bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.38,t+dur*.55);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  n.connect(bp);bp.connect(g);g.connect(out(c,m,pan));n.start(t);n.stop(t+dur+.05);
 }
 // heavy stone-and-iron grind
 function grind(c,m,t,dur,pan){
  const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(48,t);o.frequency.linearRampToValueAtTime(64,t+dur*.6);o.frequency.linearRampToValueAtTime(44,t+dur);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=240;
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.4,t+dur*.25);g.gain.linearRampToValueAtTime(.3,t+dur*.75);g.gain.linearRampToValueAtTime(.0001,t+dur);
  o.connect(lp);lp.connect(g);g.connect(out(c,m,pan));
  const n=c.createBufferSource();n.buffer=noise(c,dur);const nf=c.createBiquadFilter();nf.type='lowpass';nf.frequency.value=520;
  const ng=c.createGain();ng.gain.setValueAtTime(.0001,t);ng.gain.linearRampToValueAtTime(.35,t+dur*.4);ng.gain.linearRampToValueAtTime(.0001,t+dur);
  n.connect(nf);nf.connect(ng);ng.connect(out(c,m,pan));
  o.start(t);n.start(t);o.stop(t+dur+.05);n.stop(t+dur+.05);
 }
 function play(){
  if(done||!on)return;if(!ctx||ctx.state!=='running')return; // no click yet: browser keeps it silent
  done=true;const c=ctx;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;comp.attack.value=.003;comp.release.value=.2;comp.connect(c.destination);
  const m=c.createGain();m.gain.value=.85;m.connect(comp);
  const rv=c.createConvolver();rv.buffer=ir(c,1.8,2.6);const rg=c.createGain();rg.gain.value=.3;m.connect(rv);rv.connect(rg);rg.connect(comp);
  const t=c.currentTime+.35; // same moment the CSS doors start moving
  clank(c,m,t,.55,640);boom(c,m,t+.02,.8,.6);       // latch slams open
  clank(c,m,t+.15,.35,430);                          // bolt slides back
  whoosh(c,m,t+.1,1.5,-.6,250,2600);whoosh(c,m,t+.16,1.5,.6,300,3000); // doors sweep
  grind(c,m,t+.1,1.55,-.5);grind(c,m,t+.16,1.5,.5);
  boom(c,m,t+1.7,1,1);clank(c,m,t+1.7,.5,300);       // doors hit the stops
  [880,1320,1760].forEach((f,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=f;const g=c.createGain();
   g.gain.setValueAtTime(.001,t+1.72);g.gain.linearRampToValueAtTime(.07/(i+1),t+1.76);g.gain.exponentialRampToValueAtTime(.0005,t+3.2);o.connect(g);g.connect(m);o.start(t+1.72);o.stop(t+3.3)}); // shimmer
 }
 new MutationObserver(()=>{if(aw.classList.contains('in'))play()}).observe(aw,{attributes:true,attributeFilter:['class']});
 if(aw.classList.contains('in'))play();
})();

/* wire birds: random, independent landings and take-offs */
const BR=(a,b)=>a+Math.random()*(b-a);
const bslots={};
function bgroup(i){return bslots[i]||(bslots[i]=[...$$('.art')[i].querySelectorAll('.bslot')].map(el=>({el,fx:el.querySelector('.fx'),fly:el.querySelector('.fly'),ps:el.querySelector('.ps'),fs:el.querySelector('.fs'),on:false,busy:false,face:1,since:0,anim:null})))}
function bshow(b,perched){b.fly.style.opacity=1;b.ps.style.opacity=perched?1:0;b.fs.style.opacity=perched?0:1}
function bhide(b){b.fly.style.opacity=0;b.ps.style.opacity=0;b.fs.style.opacity=0}
function bfaceOK(g,k,f){const L=g[k-1],R=g[k+1];if(f===-1&&L&&L.on&&L.face===1)return false;if(f===1&&R&&R.on&&R.face===-1)return false;return true}
function bland(g,k){const b=g[k];if(!b||b.on||b.busy)return;const fs=Math.random()<.5?[1,-1]:[-1,1];const f=fs.find(f=>bfaceOK(g,k,f));if(!f)return;
 b.busy=true;b.face=f;b.fx.setAttribute('transform','scale('+f+' 1)');bshow(b,false);
 const sx=-BR(260,380),sy=-BR(60,170);if(b.anim)b.anim.cancel();
 b.anim=b.fly.animate([{transform:`translate(${sx}px,${sy}px)`},{transform:'translate(0px,0px)'}],{duration:BR(1700,2600),easing:'cubic-bezier(.25,.6,.35,1)',fill:'forwards'});
 b.anim.onfinish=()=>{bshow(b,true);b.on=true;b.busy=false;b.since=performance.now()}}
function bleave(g,k){const b=g[k];if(!b||!b.on||b.busy)return;b.busy=true;bshow(b,false);
 const ex=BR(240,380),ey=-BR(50,190);if(b.anim)b.anim.cancel();
 b.anim=b.fly.animate([{transform:'translate(0px,0px)'},{transform:`translate(${ex}px,${ey}px)`}],{duration:BR(1400,2100),easing:'cubic-bezier(.6,0,.9,.5)',fill:'forwards'});
 b.anim.onfinish=()=>{bhide(b);b.on=false;b.busy=false}}
function initBirds(i){const g=bgroup(i);if(!g.length)return;g.forEach(b=>{if(b.anim)b.anim.cancel();b.busy=false;b.on=false;bhide(b)});
 g.forEach((b,k)=>{if(Math.random()<.55){const f=[1,-1][Math.random()<.5?0:1];if(bfaceOK(g,k,f)){b.face=f;b.fx.setAttribute('transform','scale('+f+' 1)');b.fly.style.transform='';bshow(b,true);b.on=true;b.since=performance.now()-BR(0,3000)}}})}
function bticker(){setTimeout(bticker,BR(500,1700));const i=hi;const g=bgroup(i);if(!g.length)return;const n=g.filter(b=>b.on).length,now=performance.now();
 const r=Math.random(),k=Math.floor(Math.random()*g.length);
 if(n<=1||(n<g.length&&r<.5)) bland(g,k); else if(g[k]&&g[k].on&&now-g[k].since>2200) bleave(g,k);
 }
setTimeout(()=>{initBirds(hi);bticker()},200);
