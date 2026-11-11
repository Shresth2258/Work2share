/* Shared across every page: WhatsApp button, gallery photos, lightbox, reveals */
(function(){
const WA_NUMBER='918383963820';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];

// 1. Floating WhatsApp button (added to every page that loads this file)
const msg=encodeURIComponent('Hi Work2Share, I would like to know more about your spaces.');
const wa=document.createElement('a');
wa.className='wa-float';wa.href='https://wa.me/'+WA_NUMBER+'?text='+msg;wa.target='_blank';wa.rel='noopener';wa.setAttribute('aria-label','Chat with Work2Share on WhatsApp');
wa.innerHTML='<span class="wa-tip">Chat with us on WhatsApp</span><span class="wa-ring"></span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
document.body.append(wa);
setTimeout(()=>wa.classList.add('tip'),2500);setTimeout(()=>wa.classList.remove('tip'),9000);

// 2. Gallery photos: tries jpg, jpeg, png, webp, avif; shows a placeholder if none exist
const EX=['jpg','jpeg','png','webp','avif'];
qa('img[data-g]').forEach(img=>{let i=0;img.addEventListener('error',()=>{i++;if(i<EX.length)img.src=img.dataset.g+'.'+EX[i];else img.classList.add('miss')});img.src=img.dataset.g+'.'+EX[0]});

// 3. Reveal on scroll (gallery tiles, steps, tiles)
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
qa('.stamp,.steps,.gp-cta').forEach(e=>io.observe(e));
// tiles are clipped until revealed, so watch their container instead of each tile
const gio=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){qa('.gt',x.target).forEach(t=>t.classList.add('in'));gio.unobserve(x.target)}}),{threshold:.08});
qa('.gmos,.bento,.masonry').forEach(e=>gio.observe(e));
if(!window.__rvDone){const io2=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io2.unobserve(x.target)}}),{threshold:.2});qa('.rv').forEach(e=>io2.observe(e))}

// 4. Lightbox
const lb=document.createElement('div');lb.className='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
lb.innerHTML='<button class="lb-x" aria-label="Close">✕</button><button class="lb-p" aria-label="Previous photo">←</button><div class="lb-st"><img alt=""><video controls playsinline hidden></video><div class="lb-ph">Add your photo in<br><small></small></div></div><button class="lb-n" aria-label="Next photo">→</button><p class="lb-c"></p>';
document.body.append(lb);
let list=[],cur=0,opener=null;
const im=q('.lb-st img',lb),vd=q('.lb-st video',lb),ph=q('.lb-ph',lb);
function show(i){list=qa('.gt[data-lb]').filter(t=>t.offsetParent!==null);cur=(i+list.length)%list.length;const t=list[cur],img=q('img',t);
 vd.pause();
 if(t.dataset.video){im.hidden=true;ph.hidden=true;vd.hidden=false;vd.src=t.dataset.video;vd.poster=img?img.src:'';vd.play().catch(()=>{});q('.lb-c',lb).textContent=q('figcaption',t).textContent+'  ('+(cur+1)+'/'+list.length+')';return}
 vd.hidden=true;
 const ok=img&&!img.classList.contains('miss')&&img.naturalWidth>0;
 im.hidden=!ok;ph.hidden=ok;if(ok){im.src=img.currentSrc||img.src;im.alt=img.alt}else q('small',ph).textContent=img?img.dataset.g+'.jpg':'';
 q('.lb-c',lb).textContent=q('figcaption',t).textContent+'  ('+(cur+1)+'/'+list.length+')'}
function open(t){opener=t;list=qa('.gt[data-lb]').filter(x=>x.offsetParent!==null);lb.hidden=false;document.body.style.overflow='hidden';show(list.indexOf(t));q('.lb-x',lb).focus()}
function close(){vd.pause();lb.hidden=true;document.body.style.overflow='';opener&&opener.focus()}
document.addEventListener('click',e=>{const t=e.target.closest('.gt[data-lb]');if(t)open(t)});
qa('.gt[data-lb]').forEach(t=>{t.tabIndex=0;t.setAttribute('role','button');t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(t)}})});
q('.lb-x',lb).onclick=close;q('.lb-p',lb).onclick=()=>show(cur-1);q('.lb-n',lb).onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-st'))close()});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
})();
