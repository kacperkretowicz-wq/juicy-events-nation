import { useCompactReels, prepareHomepageMedia, playReelFromBeginning } from "./homepage-media-538e7560.js";
import{l as O,g as d,S as A,s as R,p as I,i as F,w as $,a as W,b as D,c as U,d as G,e as N,f as V,h as X,j as Y,k as J,m as K,n as Q,o as Z,q as ee,r as te}from"./float-cta-8a977faa.js";import{i as ne,a as oe}from"./project-slideshow-Bn57oUxR.js";
const introPaths = Array.from({length: 17}, (_, index) =>
  `/media/intro/${String(index + 1).padStart(2, "0")}.webp`
);
const re = 160, ie = .42, ae = 6, ce = 3;

function shuffledIntroPaths() {
  const paths = [...introPaths];
  for (let index = paths.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [paths[index], paths[swap]] = [paths[swap], paths[index]];
  }
  return paths;
}

function fe(){const e=document.querySelector("[data-hero-intro]");if(!e)return;const t=e.querySelector("[data-hero-intro-img]"),n=e.querySelector("[data-hero-intro-logo]"),c=e.querySelector("[data-hero-intro-j]"),f=e.querySelector("[data-hero-intro-e]"),p=document.querySelector("[data-agency-video]");if(new URLSearchParams(window.location.search).has("reduced")||!t||!n||!c||!f){e.remove(),document.dispatchEvent(new CustomEvent("jen:intro-done"));return}document.body.style.overflow="hidden",O.stop();const g=shuffledIntroPaths();g.forEach(y=>{const l=new Image;l.src=y});let s=null,r=!1,o=null,shotsStarted=!1,shotFallback=null;const i=()=>{r||(r=!0,clearTimeout(s),clearTimeout(shotFallback),o==null||o.kill(),window.removeEventListener("keydown",i),e.classList.add("is-done"),document.body.style.overflow="",O.start(),p==null||p.dispatchEvent(new CustomEvent("jen:intro-done")),document.dispatchEvent(new CustomEvent("jen:intro-done")),e.addEventListener("transitionend",()=>e.remove(),{once:!0}),setTimeout(()=>e.remove(),350))},S=()=>{d.to(n,{opacity:0,duration:.1,ease:"power1.out"})};let E=0;const L=()=>{if(!r){if(E>=g.length){i();return}t.src=g[E],E+=1,E===ce&&S(),s=setTimeout(L,re)}},w=()=>{if(r||shotsStarted)return;shotsStarted=!0,clearTimeout(shotFallback),d.set(t,{opacity:1}),L()},h=()=>{if(shotsStarted)return;d.set(t,{opacity:0}),d.set(n,{opacity:1}),d.set([c,f],{opacity:1}),(o=d.timeline({defaults:{ease:"none"}})).to({},{duration:ie}).to([c,f],{opacity:0,duration:.055,repeat:ae,yoyo:!0,ease:"steps(1)"}).set([c,f],{opacity:1}).call(w)};let m=!1;const v=()=>{m||r||(m=!0,h())},x=new Image;x.onload=v,x.onerror=v,x.src=g[0],setTimeout(v,700),shotFallback=setTimeout(w,1400),e.addEventListener("click",i),window.addEventListener("keydown",i,{once:!0})}const H=.48,pe=d.parseEase("power2.inOut"),z=d.parseEase("power1.out");function he(){const e=document.querySelector("[data-agency]");if(!e)return;const t=e.querySelector("[data-agency-act]"),n=e.querySelector("[data-agency-stage]"),c=e.querySelector("[data-agency-media]"),f=e.querySelector("[data-agency-media-inner]"),u=e.querySelector("[data-agency-logo]"),g=e.querySelector("[data-agency-intro]"),s=e.querySelector("[data-agency-headline]"),r=e.querySelector("[data-agency-layer='dark']"),o=e.querySelector("[data-agency-edge]"),i=document.querySelector(".site-header__logo img");if(R||!t){u&&(u.style.display="none"),g&&(g.style.display="none"),d.set([s,i].filter(Boolean),{autoAlpha:1});return}d.set(s,{autoAlpha:0,yPercent:12}),d.to(f,{yPercent:8,ease:"none",scrollTrigger:{trigger:t,start:"top top",end:"bottom bottom",scrub:!0}});let S={x:0,y:0,scale:1};const E=()=>{if(!u||!i||!n)return;const h={x:d.getProperty(u,"x"),y:d.getProperty(u,"y"),scale:d.getProperty(u,"scale")};d.set(u,{x:0,y:0,scale:1});const m=u.getBoundingClientRect(),v=n.getBoundingClientRect(),x=i.getBoundingClientRect();S={x:x.left-(m.left-v.left),y:x.top-(m.top-v.top),scale:x.width/m.width},d.set(u,h)};E(),window.addEventListener("resize",E),A.addEventListener("refresh",E);let L=0;const w=()=>{if(!r||!n)return;let h=0;for(let m=r;m&&m!==n;m=m.offsetParent)h+=m.offsetTop;L=h};w(),A.addEventListener("refresh",w),u&&d.set(u,{transformOrigin:"left top"}),i&&d.set(i,{autoAlpha:0}),c&&(c.style.clipPath="inset(0 0 0% 0)"),o&&(o.style.top="100%"),A.create({trigger:t,start:"top top",end:"bottom bottom",scrub:!0,invalidateOnRefresh:!0,onUpdate:({progress:h})=>{const m=d.utils.clamp(0,1,h/H),v=pe(m),x=z(d.utils.clamp(0,1,(m-.7)/.3));u&&d.set(u,{x:S.x*v,y:S.y*v,scale:1+(S.scale-1)*v,autoAlpha:1-x}),i&&d.set(i,{autoAlpha:x}),g&&d.set(g,{autoAlpha:1-z(m)}),d.set(s,{autoAlpha:m,yPercent:12*(1-v)});const l=(1-d.utils.clamp(0,1,(h-H)/(1-H)))*100;if(c.style.clipPath=`inset(0 0 ${100-l}% 0)`,c.dataset.toneVisible=String(l/100*n.clientHeight),o&&(o.style.top=`${l}%`),r){const a=l/100*n.clientHeight,q=Math.max(0,a-L);r.style.clipPath=`inset(${q}px 0 0 0)`}}})}let T=null;function j(e){T&&T!==e&&(T.muted=!0,T.dispatchEvent(new CustomEvent("jen:audio-released"))),T=e}function B(e){T===e&&(T=null)}function me(restorePreview) {
  const media = document.querySelector('[data-agency-media]');
  const video = media?.querySelector('[data-agency-video]');
  if (!video || !restorePreview) return;

  const n = media.querySelector('[data-agency-reel-cta]');
  const idle = n?.querySelector('.agency__reel-cta-idle');
  const exit = n?.querySelector('.agency__reel-cta-exit');
  const keyButton = document.querySelector('[data-agency-reel-key]');
  const title = document.querySelector('[data-agency-intro] .agency__intro-title');
  const source = useCompactReels ? video.dataset.mobileFilmSrc : video.dataset.filmSrc;
  const poster = video.getAttribute('poster');
  let playAttempt = null;

  function showTitle(show) {
    if (!title) return;
    d.to(title, {
      autoAlpha: show ? 1 : 0,
      duration: R ? .01 : show ? .8 : 1.8,
      ease: show ? 'power2.out' : 'power1.out',
      overwrite: true,
    });
  }

  function closeFilm() {
    if (!playAttempt) return;
    playAttempt = null;
    n?.classList.remove('is-playing');
    exit?.setAttribute('hidden', '');
    idle?.removeAttribute('hidden');
    keyButton?.setAttribute('aria-label', 'Odtwórz showreel');
    B(video);
    if (poster) video.setAttribute('poster', poster);
    restorePreview();
    showTitle(true);
  }

  function toggleFilm() {
    if (n) {
      n.classList.add('is-flash');
      window.setTimeout(() => n.classList.remove('is-flash'), 260);
    }

    if (playAttempt) {
      closeFilm();
      return;
    }
    if (!source) return;

    j(video);
    const attempt = playReelFromBeginning(video, source);
    playAttempt = attempt;
    attempt.catch(() => {
      if (playAttempt === attempt) closeFilm();
    });
    n?.classList.add('is-playing');
    idle?.setAttribute('hidden', '');
    exit?.removeAttribute('hidden');
    keyButton?.setAttribute('aria-label', 'Zamknij showreel');
    showTitle(false);
  }

  media.addEventListener('click', toggleFilm);
  keyButton?.addEventListener('click', toggleFilm);
  video.addEventListener('jen:audio-released', closeFilm);
  video.addEventListener('ended', closeFilm);
  const e = media;
  if (!n || R || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  let m=0,v=0,x=0,y=0,l=null;const a=()=>{x+=(m-x)*.22,y+=(v-y)*.22,n.style.transform=`translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,l=requestAnimationFrame(a)},q=k=>{const P=e.getBoundingClientRect();m=x=k.clientX-P.left,v=y=k.clientY-P.top,e.classList.add("is-cursor-active"),l||(l=requestAnimationFrame(a))},b=()=>{e.classList.remove("is-cursor-active"),l&&cancelAnimationFrame(l),l=null};e.addEventListener("mouseenter",q),e.addEventListener("mousemove",k=>{const P=e.getBoundingClientRect();m=k.clientX-P.left,v=k.clientY-P.top}),e.addEventListener("mouseleave",b)}function ye({section:e,items:t,dwell:n=.72,onChange:c}){if(!e||t.length<2)return;const f=t.map(y=>y.querySelector("[data-pinned-select]")),p=t.map(y=>y.querySelector("[data-pinned-body]")),u=window.matchMedia("(max-width: 980px)");let g=-1,s=null,r=null,o=[];const i=y=>{y!==g&&(g=y,t.forEach((l,a)=>l.classList.toggle("is-active",a===y)),f.forEach((l,a)=>l==null?void 0:l.setAttribute("aria-expanded",String(a===y))),y>=0&&(c==null||c(y)))},S=()=>p.forEach((y,l)=>{y&&t[l].style.setProperty("--panel-h",`${y.scrollHeight}px`)}),E=t.map((y,l)=>()=>{const a=f[l];if(y.classList.contains("is-active")){y.classList.remove("is-active"),a==null||a.setAttribute("aria-expanded","false");return}t.forEach((b,k)=>{var P;b.classList.toggle("is-active",k===l),(P=f[k])==null||P.setAttribute("aria-expanded",String(k===l))}),S(),c==null||c(l)}),L=()=>{e.classList.add("is-accordion"),g=-1,t.forEach((y,l)=>{var a,q;y.classList.remove("is-active"),(a=f[l])==null||a.setAttribute("aria-expanded","false"),(q=f[l])==null||q.addEventListener("click",E[l])}),S(),window.addEventListener("resize",S)},w=()=>{e.classList.remove("is-accordion"),window.removeEventListener("resize",S),t.forEach((y,l)=>{var a;(a=f[l])==null||a.removeEventListener("click",E[l])})},h=()=>{i(0),r=A.create({trigger:e,start:"top top",end:()=>`+=${Math.round(window.innerHeight*n*t.length)}`,pin:!0,anticipatePin:1,scrub:!0,invalidateOnRefresh:!0,onUpdate:({progress:l})=>{const a=Math.min(t.length-1,Math.floor(l*t.length));i(a)}});const y=l=>{if(!r)return;const a=r.end-r.start,q=r.start+a*(l+.5)/t.length;O.scrollTo(q,{duration:.9})};o=t.map((l,a)=>()=>y(a)),f.forEach((l,a)=>l==null?void 0:l.addEventListener("click",o[a]))},m=()=>{o.forEach((y,l)=>{var a;(a=f[l])==null||a.removeEventListener("click",y)}),o=[],r==null||r.kill(),r=null},v=()=>{const y=R||u.matches?"accordion":"pin";y!==s&&(s==="accordion"&&w(),s==="pin"&&m(),s=y,y==="accordion"?L():h(),A.refresh())},x=()=>{u.removeEventListener("change",v),s==="accordion"&&w(),s==="pin"&&m(),s=null};return v(),u.addEventListener("change",v),{destroy:x}}function ge(e,t,n){const c=[],f=[];let p=-1;const u=()=>window.matchMedia("(max-width: 980px)").matches,g=s=>{s!==p&&(p=s,t.forEach((r,o)=>{var S;const i=o===s;if(r.classList.toggle("is-active",i),(S=r.querySelector("[data-pinned-select]"))==null||S.setAttribute("aria-expanded",i?"true":"false"),i){const E=r.querySelector(".expertise-item__head h3");I(E)}}),n(s))};return e.classList.add("is-scroll"),t.forEach((s,r)=>{c.push(A.create({trigger:s,start:u()?"top 62%":"top 58%",end:u()?"bottom 38%":"bottom 42%",onEnter:()=>g(r),onEnterBack:()=>g(r)}));const o=s.querySelector("[data-pinned-select]"),i=S=>{S.preventDefault(),g(r);const E=u()?-window.innerHeight*.3:-window.innerHeight*.34;O.scrollTo(s,{offset:E,duration:.85})};o==null||o.addEventListener("click",i),f.push({head:o,onClick:i})}),g(0),()=>{e.classList.remove("is-scroll"),c.forEach(s=>s.kill()),f.forEach(({head:s,onClick:r})=>s==null?void 0:s.removeEventListener("click",r))}}function we(){const e=document.querySelector("[data-expertise]");if(!e)return;const t=[...e.querySelectorAll("[data-expertise-item]")],n=e.querySelector("[data-expertise-current]"),c=o=>{n&&(n.textContent=String(o+1).padStart(2,"0"))};let f=null,p=null;const u=window.matchMedia("(max-width: 980px)"),g=()=>{if(f==null||f(),f=null,p==null||p.destroy(),p=null,R){p=ye({section:e,items:t,onChange:c}),A.refresh();return}f=ge(e,t,c),A.refresh()};let s=null;const r=()=>{clearTimeout(s),s=setTimeout(()=>A.refresh(),200)};g(),window.addEventListener("resize",r),u.addEventListener("change",g)}const C=16/9;function ve(restorePreview) {
  const group = document.querySelector('[data-work-video-group]');
  const video = group?.querySelector('[data-work-video]');
  const card = group?.querySelector('.work__card');
  const buttons = group?.querySelectorAll('[data-work-video-trigger]');
  if (!video || !card || !buttons.length || !restorePreview) return;

  const source = video.dataset.workFilm;
  const poster = video.getAttribute('poster');
  const floatingLink = document.querySelector('[data-float-cta]');
  const returnEvents = ['wheel', 'touchmove', 'keydown'];
  let playAttempt = null;
  let resizeAnimation = null;

  function removeReturnListeners() {
    returnEvents.forEach(event => window.removeEventListener(event, showFloatingLink));
  }

  function showFloatingLink() {
    floatingLink?.classList.remove('is-away');
    removeReturnListeners();
  }

  function expandedSize() {
    const width = Math.min(group.clientWidth, window.innerHeight * .8 / C);
    return { width, height: width * C };
  }

  function animateSize(from, to, onComplete) {
    resizeAnimation?.kill();
    d.set(card, from);
    resizeAnimation = d.fromTo(card, from, {
      ...to,
      duration: R ? .01 : .9,
      ease: 'expo.inOut',
      onComplete: () => { A.refresh(); onComplete?.(); },
    });
  }

  function setExpanded(expanded) {
    group.classList.toggle('is-expanded', expanded);
    buttons.forEach(button => button.setAttribute('aria-expanded', String(expanded)));
  }

  function openFilm() {
    if (!source) return;
    removeReturnListeners();
    floatingLink?.classList.add('is-away');
    j(video);
    const attempt = playReelFromBeginning(video, source);
    playAttempt = attempt;
    attempt.catch(() => {
      if (playAttempt === attempt) video.controls = true;
    });
    const from = { width: card.offsetWidth, height: card.offsetHeight };
    setExpanded(true);
    animateSize(from, expandedSize());
  }

  function closeFilm() {
    if (!playAttempt) return;
    playAttempt = null;
    B(video);
    video.controls = false;
    resizeAnimation?.kill();
    const from = { width: card.offsetWidth, height: card.offsetHeight };
    setExpanded(false);
    d.set(card, { clearProps: 'width,height' });
    const width = card.offsetWidth;
    d.set(card, from);
    if (poster) video.setAttribute('poster', poster);
    restorePreview();
    animateSize(from, { width, height: width * (4 / 3) }, () => {
      d.set(card, { clearProps: 'width,height' });
      returnEvents.forEach(event => window.addEventListener(event, showFloatingLink, { passive: true }));
    });
  }

  buttons.forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    if (video.controls && event.target === video) return;
    if (playAttempt) closeFilm();
    else openFilm();
  }));
  video.addEventListener('ended', closeFilm);
  video.addEventListener('jen:audio-released', closeFilm);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeFilm();
  });
  window.addEventListener('resize', () => {
    if (playAttempt && !resizeAnimation?.isActive()) d.set(card, expandedSize());
  });
}
const M=0,_=100;function Se(){const e=document.querySelector("[data-mission]"),t=[...e==null?void 0:e.querySelectorAll("[data-mission-word]")],n=e==null?void 0:e.querySelector("[data-mission-rotator]"),c=e==null?void 0:e.querySelector("[data-mission-note]");if(!e||t.length<3||!n)return;let f={active:0,t:0};const p=window.matchMedia("(max-width: 620px)"),u=()=>p.matches?{left:"50%",xPercent:-50,transformOrigin:"center bottom"}:{left:0,xPercent:0,transformOrigin:"left bottom"},g=(o,i)=>{f={active:o,t:i};const S=u();t.forEach((E,L)=>{let w=0,h=M;L<o?(w=-_*(o-L+i),h=M):L===o?o===t.length-1?(w=0,h=1):(w=-_*i,h=1-(1-M)*i):L===o+1?(w=_*(1-i),h=M+(1-M)*i):(w=_*(L-o-i),h=M),d.set(E,{...S,yPercent:w,opacity:h})})},s=()=>{const o=n.closest(".mission__line"),i=o==null?void 0:o.querySelector(".mission__lead");n.style.width="",o&&(o.style.fontSize=""),d.set(t,{position:"relative",yPercent:0,opacity:1});const S=(o==null?void 0:o.getBoundingClientRect().width)??0,E=parseFloat(getComputedStyle(o).columnGap)||0,L=()=>Math.max(...t.map(m=>m.getBoundingClientRect().width));let w=parseFloat(getComputedStyle(o).fontSize),h=L();if(p.matches){let v=Math.max(120,S);for(;h>v&&w>32;)w*=.97,o&&(o.style.fontSize=`${w}px`),h=L(),v=Math.max(120,(o==null?void 0:o.getBoundingClientRect().width)??S);n.style.width=`${Math.ceil(h)}px`}else{let m=(i==null?void 0:i.getBoundingClientRect().width)??0,v=Math.max(80,S-m-E);for(;h>v&&w>28;)w*=.97,o&&(o.style.fontSize=`${w}px`),h=L(),m=(i==null?void 0:i.getBoundingClientRect().width)??0,v=Math.max(80,S-m-E)}d.set(t,{position:"absolute"}),g(f.active,f.t)};if(R){s(),t.forEach((o,i)=>{d.set(o,{position:"absolute",yPercent:0,opacity:i===0?1:M})}),c&&d.set(c,{opacity:1,yPercent:0});return}s(),window.addEventListener("resize",s),g(0,0),c&&d.set(c,{opacity:0,yPercent:12});const r=1/(t.length-1);A.create({trigger:e,start:"top top",end:"bottom bottom",scrub:!0,invalidateOnRefresh:!0,onUpdate:({progress:o})=>{const i=Math.min(t.length-1,Math.floor(o/r)),S=i===t.length-1?0:d.utils.clamp(0,1,(o-i*r)/r),E=d.utils.clamp(0,1,(S-.3)/.4),L=E*E*(3-2*E);if(g(i,L),c){const w=d.utils.clamp(0,1,(o-.82)/.18);d.set(c,{opacity:w,yPercent:12*(1-w)})}}})}function Ee(){const e=document.querySelector("[data-showreel-toggle]");e==null||e.querySelector("[data-showreel-toggle-video]")}async function Le(){const e=document.querySelector("[data-marquee]"),t=e==null?void 0:e.querySelector("[data-marquee-track]");if(!e||!t)return;let n=[];try{const c=await fetch("/media/clients/clients.json",{cache:"no-store"});c.ok&&(n=await c.json())}catch{n=[]}!Array.isArray(n)||!n.length||(t.innerHTML="",n.forEach(({name:c,file:f})=>{if(!f)return;const p=document.createElement("li");p.className="clients__item";const u=document.createElement("img");u.src=`/media/clients/${f}`,u.alt=c||"",u.width=240,u.height=120,u.loading="lazy",u.decoding="async",p.append(u),t.append(p)}))}const {restoreHeroPreview,restoreWorkPreview}=prepareHomepageMedia();F();fe();me(restoreHeroPreview);ve(restoreWorkPreview);$().then(()=>{W(),D(),U(),G(),he(),Le().finally(N),we(),V(),X(),ne(),oe(),Se(),Y(),J(),K(),Ee(),Q(),document.documentElement.classList.add("is-loaded"),Z(),ee({refresh:!1}),te()});
