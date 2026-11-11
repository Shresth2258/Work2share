(()=>{
const WA='918383963820',FOCUSABLE='button,input,select,textarea,a[href]';
const root=document.createElement('div');root.className='tm-ov';root.setAttribute('aria-hidden','true');
const seats=['1','2','3','4','5','6–10','11–20','20+'].map(s=>`<option>${s}</option>`).join('');
root.innerHTML=`<div class="tm" role="dialog" aria-modal="true" aria-labelledby="tmH" tabindex="-1">
<button class="tm-x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
<aside class="tm-l"><i class="tm-o o1"></i><i class="tm-o o2"></i>
<div class="tm-lg" style="--i:0"><img src="assets/logo.webp" alt="Work2Share"></div>
<small style="--i:1">LET’S TALK</small>
<h2 id="tmH" style="--i:2">Book a Free Tour of Work2Share</h2>
<p style="--i:3">Tell us a bit about your team and we’ll set up a walkthrough of the space that fits, usually within one business day.</p></aside>
<div class="tm-r">
<form class="tm-f" novalidate>
<label class="tm-fd" style="--i:4"><span>Full Name</span><input name="name" autocomplete="name" placeholder="Your name"><em class="tm-er">Please enter your name.</em></label>
<label class="tm-fd" style="--i:5"><span>Phone Number</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. 9315131014"><em class="tm-er">Please enter a valid phone number.</em></label>
<label class="tm-fd" style="--i:6"><span>Number of Seats</span><select name="seats">${seats}</select></label>
<label class="tm-fd" style="--i:7"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="you@company.com"><em class="tm-er">That email doesn’t look right.</em></label>
<label class="tm-fd" style="--i:8"><span>What are you looking for?</span><textarea name="msg" rows="3" placeholder="Team size, preferred location, timeline…"></textarea></label>
<button class="tm-b" type="submit" style="--i:9"><span>Book My Tour</span></button>
</form>
<div class="tm-ok" role="status"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 14-16"/></svg><h3>Thank you, <span id="tmN"></span>!</h3><p>We’ve opened WhatsApp with your details. Press send and we’ll confirm your tour.</p><a id="tmW" href="#" target="_blank" rel="noopener">Open WhatsApp again</a><button class="tm-b" type="button" data-close><span>Close</span></button></div>
</div></div>`;
document.body.appendChild(root);
const tm=root.querySelector('.tm'),form=root.querySelector('form'),html=document.documentElement;
let last=null;
function open(){
  last=document.activeElement;form.reset();tm.classList.remove('done');
  root.querySelectorAll('.bad').forEach(x=>x.classList.remove('bad'));
  root.classList.add('on');root.setAttribute('aria-hidden','false');html.classList.add('tm-lock');
  setTimeout(()=>form.elements.name.focus({preventScroll:true}),450);
}
function close(){root.classList.remove('on');root.setAttribute('aria-hidden','true');html.classList.remove('tm-lock');if(last&&last.focus)last.focus({preventScroll:true})}
document.addEventListener('click',e=>{
  const t=e.target.closest('.btn.cta,[data-tour]');
  if(t){e.preventDefault();open()}
});
root.addEventListener('click',e=>{if(e.target===root||e.target.closest('.tm-x,[data-close]'))close()});
document.addEventListener('keydown',e=>{
  if(!root.classList.contains('on'))return;
  if(e.key==='Escape'){close();return}
  if(e.key==='Tab'){
    const f=[...tm.querySelectorAll(FOCUSABLE)].filter(x=>x.offsetParent!==null);if(!f.length)return;
    const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  }
});
const bad=(el,on)=>{const l=el.closest('.tm-fd');l.classList.remove('bad');if(on){void l.offsetWidth;l.classList.add('bad')}return on};
form.addEventListener('input',e=>e.target.closest('.tm-fd')?.classList.remove('bad'));
form.addEventListener('submit',e=>{
  e.preventDefault();
  const v=n=>form.elements[n].value.trim();
  const name=v('name'),phone=v('phone'),email=v('email'),msg=v('msg'),seats=form.elements.seats.value;
  const errs=[bad(form.elements.name,name.length<2),
              bad(form.elements.phone,!/^[+\d][\d\s\-()]{8,}$/.test(phone)||phone.replace(/\D/g,'').length<10),
              bad(form.elements.email,!!email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))];
  if(errs.some(Boolean)){form.querySelector('.bad input')?.focus();return}
  const text=`Hi Work2Share, I’d like to book a free tour.\nName: ${name}\nPhone: ${phone}\nSeats: ${seats}`+(email?`\nEmail: ${email}`:'')+(msg?`\nLooking for: ${msg}`:'');
  const url=`https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  root.querySelector('#tmN').textContent=name.split(/\s+/)[0];root.querySelector('#tmW').href=url;
  tm.classList.add('done');window.open(url,'_blank','noopener');
});
})();
