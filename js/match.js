/* Desk Match: 10 pairs in 75s, wrong match costs 2s. Player ID (name + mobile), 3 chances at the 5% offer, one offer per mobile,
   best score saved per player, challenge a friend. Data lives in this browser; the team checks the code and the sender's number on WhatsApp. */
(function(){
const PCT=5,PAIRS=10,DUR=75,PEN=2,CHANCES=3,NUM='918383963820',PK='w2sPlayer';
const ICONS=['☕','💡','📶','💻','🪴','📞','🖨️','🎧','📎','🗂️'];
const $=id=>document.getElementById(id);
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}},s=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const grid=$('mgrid'),ov=$('mov'),stage=grid.parentNode;
const clean=t=>String(t||'').replace(/[^\p{L}\p{N} ._-]/gu,'').trim().slice(0,20);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let player=null;try{const p=JSON.parse(g(PK)||'null');if(p&&/^[6-9]\d{9}$/.test(p.m)&&clean(p.n))player={n:clean(p.n),m:p.m}}catch(e){}
const bk=()=>'w2sMBest_'+player.m,tk=()=>'w2sMTries_'+player.m,wk=()=>'w2sMWon_'+player.m;
const tries=()=>player?(+g(tk())||0):0,claimed=()=>player&&!!g(wk());
const state=()=>claimed()?'claimed':tries()>=CHANCES?'over':'open';
/* the same mobile number always gives the same code, so a second offer can never be created */
function offerCode(m){let h=7;for(const c of m)h=(h*31+c.charCodeAt(0))%9973;const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';return 'W5-'+m.slice(-4)+'-'+a[h%31]+a[(h>>3)%31]}
/* friend challenge from the link: ?ch=Name&cs=Score */
const qs=new URLSearchParams(location.search);
const CH={n:clean(qs.get('ch')),s:Math.min(99999,Math.max(0,parseInt(qs.get('cs'))||0))};if(!CH.s)CH.n='';
let cards,open,moves,found,left,timer,lock,started=false,playing=false,best=player?(+g(bk())||0):0,score=0;

function paintBest(){$('mBest').textContent=best||'–'}
function paintChance(){const el=$('mChance'),st=player?state():'open',t=tries();
 el.className='mchance '+st;
 el.textContent=!player?'🎁 3 chances to win 5% off':st==='claimed'?'✅ 5% offer already claimed ('+offerCode(player.m)+'). Playing for your best score.':st==='over'?'All 3 offer chances used. Keep playing for your best score.':'🎁 Offer chance '+Math.min(CHANCES,playing?t:t+1)+' of '+CHANCES+': win to get 5% off'}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function hud(){$('mPairs').textContent=found+'/'+PAIRS;$('mTime').textContent=Math.max(0,Math.ceil(left));$('mMoves').textContent=moves}

function build(){
 grid.innerHTML='';cards=shuffle(ICONS.concat(ICONS)).map((ic,i)=>{
  const b=document.createElement('button');b.type='button';b.className='mc';b.setAttribute('aria-label','Card '+(i+1)+', face down');
  b.innerHTML='<span class="in"><span class="b">?</span><span class="f">'+ic+'</span></span>';
  b.onclick=()=>flip(i);grid.appendChild(b);return{el:b,ic,done:false}});
}
function askPlayer(){
 ov.innerHTML='<div class="ge">👤</div><h3>Create your player ID</h3><p>You get 3 chances at the 5% offer, one offer per mobile number. Your best score is saved against it.</p>'
  +'<form class="gform" id="mForm"><input id="mN" placeholder="Your name" maxlength="20" required autocomplete="name"><input id="mM" type="tel" inputmode="numeric" placeholder="10-digit mobile number" maxlength="13" required autocomplete="tel-national"><p class="gerr" id="mErr" role="alert" hidden></p><button class="btn" type="submit"><span>Save &amp; start</span></button></form>'
  +'<small class="mfine">Saved only in this browser. Nothing is sent anywhere until you tap a WhatsApp button.</small>';
 ov.classList.remove('h');
 $('mForm').onsubmit=e=>{e.preventDefault();const n=clean($('mN').value),m=$('mM').value.replace(/\D/g,'').replace(/^(91|0)(?=\d{10}$)/,''),er=$('mErr');
  if(!n){er.textContent='Please enter your name.';er.hidden=false;return}
  if(!/^[6-9]\d{9}$/.test(m)){er.textContent='Enter a valid 10-digit mobile number.';er.hidden=false;return}
  player={n,m};s(PK,JSON.stringify(player));best=+g(bk())||0;paintBest();paintChance();start()};
}
function start(){
 if(!player){askPlayer();return}
 clearInterval(timer);open=[];moves=0;found=0;left=DUR;lock=false;started=false;playing=false;
 build();hud();paintBest();paintChance();ov.classList.add('h');
}
function tick(){left-=.1;hud();if(left<=0){left=0;hud();finish(false)}}
function flip(i){
 const c=cards[i];if(lock||c.done||open.includes(i))return;
 if(!started){started=true;playing=true;timer=setInterval(tick,100);if(state()==='open'){s(tk(),tries()+1)}paintChance()}
 c.el.classList.add('on');c.el.setAttribute('aria-label','Card '+(i+1)+', '+c.ic);open.push(i);
 if(open.length<2)return;
 moves++;hud();const [a,b]=open,A=cards[a],B=cards[b];
 if(A.ic===B.ic){
  A.done=B.done=true;[A,B].forEach(x=>{x.el.classList.add('ok');x.el.disabled=true});open=[];found++;hud();
  if(found===PAIRS){lock=true;clearInterval(timer);setTimeout(()=>finish(true),600)}
 }else{
  lock=true;left-=PEN;hud();const tc=$('mTime').parentNode;tc.classList.add('pen');setTimeout(()=>tc.classList.remove('pen'),600);
  [A,B].forEach(x=>x.el.classList.add('bad'));
  if(left<=0){left=0;hud();finish(false);return}
  setTimeout(()=>{[A,B].forEach(x=>{x.el.classList.remove('on','bad');x.el.setAttribute('aria-label','Card face down')});open=[];lock=false},750);
 }
}
function confetti(){if(reduce)return;const d=document.createElement('div');d.className='mconf';
 const cl=['#0a7466','#e6b422','#1faa59','#d64545','#4a90d9'];
 for(let i=0;i<40;i++){const p=document.createElement('s');p.style.left=Math.random()*100+'%';p.style.background=cl[i%5];p.style.animationDuration=(1.6+Math.random()*1.6)+'s';p.style.animationDelay=Math.random()*.5+'s';d.appendChild(p)}
 stage.appendChild(d);setTimeout(()=>d.remove(),4200)}
function chLink(){const u=new URL(location.href);u.search='';u.hash='';u.searchParams.set('ch',player.n);u.searchParams.set('cs',best);return u.toString()}
function chBtn(){const m='⚔️ '+player.n+' scored '+best+' on Desk Match at Work2Share! Can you beat it? Win the game to get 5% off. Play here: '+chLink();
 return '<a class="btn wa-b" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(m)+'"><span>⚔️ Challenge a friend</span></a>'}
function chLine(){if(!CH.n)return'';return score>CH.s?'<p class="gbeat">🥇 You beat '+esc(CH.n)+'’s '+CH.s+'!</p>':'<p class="gbeat">⚔️ '+esc(CH.n)+' scored '+CH.s+'. You need '+(CH.s-score+1)+' more.</p>'}
const foot=()=>'<small class="mfine">Best score saved for <b>'+esc(player.n)+'</b>: '+best+' · <a href="#" id="mSwitch">Not you?</a></small>';
function wire(){
 const a=$('mAgain');if(a)a.onclick=start;
 const sw=$('mSwitch');if(sw)sw.onclick=e=>{e.preventDefault();player=null;try{localStorage.removeItem(PK)}catch(x){}best=0;paintBest();paintChance();askPlayer()};
 const cp=$('mCopy');if(cp)cp.onclick=function(){const t=this.firstChild,c=this.dataset.c,d=()=>{t.textContent='Copied ✓';setTimeout(()=>t.textContent='Copy',1600)};if(navigator.clipboard)navigator.clipboard.writeText(c).then(d,()=>{});else d()};
}
function finish(win){
 clearInterval(timer);lock=true;playing=false;
 score=found*100+(win?Math.round(left)*10:0);
 const isBest=score>best;if(isBest&&score>0){best=score;s(bk(),best)}paintBest();
 const st=state(),c=offerCode(player.m),used=tries(),leftCh=Math.max(0,CHANCES-used);
 const again='<button class="btn gh" id="mAgain" type="button"><span>'+(win?'Play again':'Try again')+'</span></button>';
 if(win&&st==='open'){
  s(wk(),Date.now());
  const msg='Hi Work2Share, I am '+player.n+' (mobile '+player.m+'). I won Desk Match and my code is '+c+'. Please apply my '+PCT+'% off on my first booking.';
  ov.innerHTML='<div class="ge">🏆</div><h3>Congratulations!</h3><div class="mwin">You got '+PCT+'% OFF</div><p>'+esc(player.n)+', cleared with '+Math.ceil(left)+'s left (score '+score+'). Your code:</p>'
   +'<div class="mcode"><code>'+c+'</code><button class="btn gh" id="mCopy" type="button" data-c="'+c+'"><span>Copy</span></button></div>'+chLine()
   +'<div class="gb"><a class="btn wa-b" target="_blank" rel="noopener" href="https://wa.me/'+NUM+'?text='+encodeURIComponent(msg)+'"><span>Claim on WhatsApp</span></a>'+chBtn()+again+'</div>'
   +'<small class="mfine">Valid on your first booking. One offer per mobile number. Cannot be combined with other offers.</small>'+foot();
  confetti();
 }else{
  const head=win?'<div class="ge">🏅</div><h3>You cleared it!</h3>':'<div class="ge">⏰</div><h3>Time’s up!</h3>';
  const note=st==='claimed'?'Offer already claimed, so this one is just for your best score.':st==='over'?'All '+CHANCES+' offer chances are used. This one is for your best score.':win?'':'You found '+found+' of '+PAIRS+' pairs. '+(leftCh?leftCh+' offer chance'+(leftCh>1?'s':'')+' left.':'No offer chances left.');
  ov.innerHTML=head+'<div class="mscore">'+score+'</div><p>'+(isBest?'New personal best! ':'')+note+'</p>'+chLine()
   +'<div class="gb">'+again+chBtn()+'</div>'+foot();
 }
 paintChance();ov.classList.remove('h');wire();
}
$('mStart').onclick=start;
if(CH.n){const p0=ov.querySelector('p');if(p0)p0.textContent='⚔️ '+CH.n+' scored '+CH.s+' on Desk Match. Can you beat it? Win to get 5% off.'}
build();left=DUR;found=0;moves=0;paintBest();paintChance();
})();
