/* Refer a friend: both get 7% off. Codes live in the browser; the team matches them on WhatsApp. */
(function(){
const PCT=7,NUM='918383963820',KEY='w2sRefCode',FROM='w2sRefFrom',TOAST='w2sRefToast';
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}},s=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
function myCode(){let c=g(KEY);if(!/^W2S-[A-Z0-9]{5}$/.test(c||'')){const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';c='W2S-';for(let i=0;i<5;i++)c+=a[Math.random()*a.length|0];s(KEY,c)}return c}
function link(){const u=new URL(location.href);u.search='';u.hash='';u.searchParams.set('ref',myCode());return u.toString()+'#game'}
const wa=t=>'https://wa.me/?text='+encodeURIComponent(t);
const wt=t=>'https://wa.me/'+NUM+'?text='+encodeURIComponent(t);
const q=new URLSearchParams(location.search).get('ref');
if(q&&/^W2S-[A-Z0-9]{5}$/.test(q)&&q!==myCode())s(FROM,q);
let from=g(FROM);if(from===myCode())from=null;
window.W2SRef={pct:PCT,code:myCode,link,wa,wt};

const $=id=>document.getElementById(id);
const code=$('refCode');if(code){
 code.textContent=myCode();
 $('refWa').href=wa('Hey! Work2Share (coworking in Gurugram) is giving us both '+PCT+'% off your first booking. Use my link: '+link());
 $('refClaim').href=wt('Hi Work2Share, my referral code is '+myCode()+'. My friend has booked, please apply my '+PCT+'% off.');
 const b=$('refCopy'),bt=b.querySelector('span')||b;b.onclick=()=>{const l=link(),done=()=>{bt.textContent='Copied ✓';setTimeout(()=>bt.textContent='Copy link',1800)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(l).then(done,()=>fb(l,done));else fb(l,done)};
 function fb(t,done){const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();try{document.execCommand('copy');done()}catch(e){}x.remove()}
 if(from){const gm=wt('Hi Work2Share, I was referred by code '+from+' and would like to claim my '+PCT+'% off.');
  $('refIn').hidden=false;$('refFrom').textContent=from;$('refGet').href=gm;
  let seen=null;try{seen=sessionStorage.getItem(TOAST)}catch(e){}
  if(!seen){const t=document.createElement('div');t.className='gtoast';t.setAttribute('role','status');
   t.innerHTML='<span>🎁 A friend invited you. Get <b>'+PCT+'% off</b> your first booking.</span><a class="btn" target="_blank" rel="noopener" href="'+gm+'"><span>Claim</span></a><button type="button" aria-label="Close">✕</button>';
   document.body.appendChild(t);setTimeout(()=>t.classList.add('on'),1200);
   t.querySelector('button').onclick=()=>{t.classList.remove('on');try{sessionStorage.setItem(TOAST,'1')}catch(e){}};}}
}
})();
