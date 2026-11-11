(()=>{
const sk=document.getElementById('sk');if(!sk)return;
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const $=id=>document.getElementById(id),svg=sk.querySelector('svg');
const R=$('skR'),T=$('skT'),P=$('skP'),H=$('skH'),B=$('skB'),txt=sk.querySelector('.sk-txt');
const g1=$('skg1'),g2=$('skg2'),sun=svg.querySelector('.sk-sun'),moon=svg.querySelector('.sk-moon'),stars=svg.querySelector('.sk-stars');
const NS='http://www.w3.org/2000/svg',mkE=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
/* windows: two rows either side of the door */
/* stars */
let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
for(let i=0;i<46;i++){const c=mkE('circle',{cx:rnd()*760,cy:rnd()*300,r:.8+rnd()*1.4});if(i%3==0){c.setAttribute('class','tw');c.style.animationDelay=(rnd()*3)+'s'}stars.appendChild(c)}
/* sky colours through the day */
const KF=[[0,'#0b1530','#1c2c52'],[5,'#26305e','#8a5a7a'],[6.5,'#6a8fd0','#ffb88a'],[9,'#4aa0e0','#cdeaff'],[13,'#3b96e0','#bfe6ff'],[17,'#4a86c9','#ffc58a'],[19,'#3b3a7c','#ff7a59'],[21,'#141c40','#2d3d70'],[24,'#0b1530','#1c2c52']];
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const lerp=(a,b,k)=>{const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')'};
function sky(t){let i=0;while(i<KF.length-2&&t>KF[i+1][0])i++;const a=KF[i],b=KF[i+1],k=(t-a[0])/(b[0]-a[0]);return[lerp(a[1],b[1],k),lerp(a[2],b[2],k)]}
const pos=a=>`translate(${380-330*Math.cos(a)} ${440-360*Math.sin(a)})`;
const TX={e:['First one in','Beat the traffic, pick your desk and get a head start before the city wakes up.'],
          d:['Full swing','Fast Wi-Fi, meeting rooms by the hour and a friendly floor full of people building things.'],
          n:['Still open','Round-the-clock access and power backup mean a late deadline is never a problem.']};
const chips=[...sk.querySelectorAll('.sk-chips button')];let grp='',cur=13;
function setT(t){
  t=((t%24)+24)%24;cur=t;R.value=t;
  const[c1,c2]=sky(t);g1.setAttribute('stop-color',c1);g2.setAttribute('stop-color',c2);
  if(t>=6&&t<=18){sun.setAttribute('transform',pos((t-6)/12*Math.PI));sun.style.opacity=1}else sun.style.opacity=0;
  if(t>=18||t<=6){moon.setAttribute('transform',pos((t>=18?t-18:t+6)/12*Math.PI));moon.style.opacity=1}else moon.style.opacity=0;
  stars.style.opacity=t<5?1:t<7?1-(t-5)/2:t<19?0:t<21?(t-19)/2:1;
  sk.classList.toggle('night',t<5.8||t>18.6);
  const hh=Math.floor(t),mm=Math.floor((t-hh)*60);T.textContent=String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
  P.textContent=t<5?'Late night':t<10?'Early start':t<17?'Midday':t<21?'Evening':'Late night';
  const g=t>=5&&t<10?'e':t>=10&&t<17?'d':'n';
  if(g!==grp){const first=!grp;grp=g;const put=()=>{H.textContent=TX[g][0];B.textContent=TX[g][1];txt.classList.remove('sw')};
    if(first)put();else{txt.classList.add('sw');setTimeout(put,280)}
    chips.forEach(c=>c.classList.toggle('on',(g==='e'&&c.dataset.h==7)||(g==='d'&&c.dataset.h==13)||(g==='n'&&c.dataset.h==22)))}
}
/* auto-play until the visitor takes over */
let auto=false,raf=0,last=0,tween=0;
const stop=()=>{auto=false;cancelAnimationFrame(raf);cancelAnimationFrame(tween)};
function tick(now){if(!auto)return;setT(cur+Math.min(.05,(now-last)/1000)*1.1);last=now;raf=requestAnimationFrame(tick)}
function go(to){stop();const from=cur,t0=performance.now(),d=Math.abs(to-from)*70+300;
  if(rm){setT(to);return}
  (function f(now){const k=Math.min(1,(now-t0)/d),e=1-Math.pow(1-k,3);setT(from+(to-from)*e);if(k<1)tween=requestAnimationFrame(f)})(t0)}
R.addEventListener('input',()=>{stop();setT(+R.value)});
chips.forEach(c=>c.addEventListener('click',()=>go(+c.dataset.h)));
setT(rm?13:5.5);
if(!rm)new IntersectionObserver(en=>en.forEach(x=>{
  if(x.isIntersecting&&!tween&&!stop.done){auto=true;last=performance.now();raf=requestAnimationFrame(tick)}else if(!x.isIntersecting){auto=false;cancelAnimationFrame(raf)}
}),{threshold:.4}).observe(sk);
['pointerdown','keydown'].forEach(ev=>sk.querySelector('.sk-ctl').addEventListener(ev,()=>{stop.done=true;stop()}));
})();
