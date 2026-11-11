/* Shared by all inner pages: header, theme, counters, gallery filters, FAQ search, contact form */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
window.__rvDone=false;
addEventListener('scroll',()=>{const h=document.documentElement;$('#bar').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';$('#hd').classList.toggle('s',scrollY>40)},{passive:true});
$('#bg').onclick=()=>$('#pl').classList.toggle('o');
$$('#pl a').forEach(a=>a.addEventListener('click',()=>$('#pl').classList.remove('o')));
$('#th').onclick=()=>document.documentElement.classList.toggle('dk');

// gallery filters
$$('#fl button').forEach(b=>b.onclick=()=>{
 $$('#fl button').forEach(x=>x.classList.toggle('on',x===b));
 const f=b.dataset.f;
 $$('#ms .gt').forEach((t,i)=>{const show=f==='all'||t.dataset.cat===f;t.classList.remove('pop');t.hidden=!show;if(show){t.classList.add('in');void t.offsetWidth;t.style.setProperty('--d',(i%4)*.06+'s');t.classList.add('pop')}});
 justify();
});

// equal-height justified gallery: every row fills the width, so top and bottom edges line up
function justify(){
 const box=$('#ms');if(!box)return;
 const items=$$('#ms .gt').filter(t=>!t.hidden);if(!items.length)return;
 const W=box.clientWidth;if(!W)return;
 const gap=W<600?10:16,tH=W<600?190:W<1000?240:300;
 const ar=items.map(t=>+t.dataset.ar||1),tot=ar.reduce((a,b)=>a+b,0),N=items.length;
 const pre=[0];ar.forEach(a=>pre.push(pre[pre.length-1]+a));
 const part=n=>{ // split into n rows with the most even total width
  const T=tot/n,INF=1e12,dp=Array.from({length:n+1},()=>Array(N+1).fill(INF)),cut=Array.from({length:n+1},()=>Array(N+1).fill(0));
  dp[0][0]=0;
  for(let k=1;k<=n;k++)for(let j=k;j<=N;j++)for(let i=k-1;i<j;i++){const c=dp[k-1][i]+Math.pow(pre[j]-pre[i]-T,2);if(c<dp[k][j]){dp[k][j]=c;cut[k][j]=i}}
  const rows=[];let j=N;for(let k=n;k>=1;k--){const i=cut[k][j];rows.unshift([i,j]);j=i}return rows};
 let n=Math.max(1,Math.min(N,Math.round(tot*tH/W))),rows,H;
 for(;;){rows=part(n);H=rows.reduce((s,[i,j])=>s+(W-gap*(j-i-1))/(pre[j]-pre[i]),0)/rows.length;if(H<=tH*1.3||n>=N)break;n++}
 box.classList.add('jf');
 rows.forEach(([i,j])=>{
  const sum=pre[j]-pre[i],avail=W-gap*(j-i-1);let used=0;
  for(let k=i;k<j;k++){const w=k===j-1?avail-used:Math.floor(avail*ar[k]/sum);used+=w;items[k].style.width=w+'px';items[k].style.height=Math.round(H)+'px'}
 });
}
justify();addEventListener('resize',()=>{clearTimeout(justify.t);justify.t=setTimeout(justify,120)});
addEventListener('load',justify);

// stat counters
const cn=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;cn.unobserve(x.target);const b=x.target,n=+b.dataset.n,d=+b.dataset.d,sx=b.dataset.s,t=performance.now();(function f(now){const k=Math.min(1,(now-t)/1800);b.textContent=(n*(1-Math.pow(1-k,3))).toFixed(d)+sx;if(k<1)requestAnimationFrame(f)})(t)}),{threshold:.5});
$$('[data-n]').forEach(b=>cn.observe(b));

// FAQ search + category filter
const fq=$('#fq');
if(fq){let cat='all';
 const run=()=>{const q=fq.value.trim().toLowerCase();let n=0;$$('#fl2 details').forEach(d=>{const ok=(cat==='all'||d.dataset.cat===cat)&&(!q||d.textContent.toLowerCase().includes(q));d.hidden=!ok;d.classList.add('in');if(ok)n++});$('#nores').hidden=n>0};
 fq.addEventListener('input',run);
 $$('#fcat button').forEach(b=>b.onclick=()=>{cat=b.dataset.f;$$('#fcat button').forEach(x=>x.classList.toggle('on',x===b));run()});
}

// contact form -> WhatsApp / email
const cf=$('#cf');
if(cf){
 const text=()=>{const f=new FormData(cf);return `Hi Work2Share, I'm ${f.get('n')||''} (${f.get('p')||''}). I'm interested in: ${f.get('t')}.${f.get('m')?' '+f.get('m'):''}`};
 const ok=()=>{const f=new FormData(cf);if(!f.get('n').trim()||!f.get('p').trim()){$('#fmsg').textContent='Please add your name and phone number.';(f.get('n').trim()?cf.p:cf.n).focus();return false}$('#fmsg').textContent='';return true};
 cf.addEventListener('submit',e=>{e.preventDefault();if(ok()){open('https://wa.me/918383963820?text='+encodeURIComponent(text()),'_blank','noopener');$('#fmsg').textContent='Opening WhatsApp with your message.'}});
 $('#cmail').onclick=()=>{if(ok())location.href='mailto:sales@work2share.in?subject='+encodeURIComponent('Enquiry from website')+'&body='+encodeURIComponent(text())};
}
})();
