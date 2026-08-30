const MEDIA_BASE="https://bushra-hospitality-packages.marwaothman999.chatgpt.site";
"use client";

import { useEffect, useRef, useState } from "react";

type Lang="ar"|"en"; type Level=1|2|3; type Modal="video"|"gallery"|"details"|"showcase"|"hospitality"|null; type Section="home"|"packages"|"testimonials"|"videos"|"team"|"hospitality";
const packs={
  1:{ar:"المستوى الأول",en:"Level One",no:"01",tone:"#b08e57"},
  2:{ar:"المستوى الثاني",en:"Level Two",no:"02",tone:"#70a3c2"},
  3:{ar:"المستوى الثالث",en:"Level Three",no:"03",tone:"#d0a86c"},
} as const;
const leadership=[
  {image:`${MEDIA_BASE}/media/team/ali-bandaqji.webp`,ar:{name:"علي بن حسين بندقجي",role:"الرئيس التنفيذي"},en:{name:"Ali bin Hussein Bandaqji",role:"Chief Executive Officer"}},
  {image:`${MEDIA_BASE}/media/team/mohammed-maimani.webp`,ar:{name:"محمد بن محمود ميمني",role:"نائب الرئيس التنفيذي"},en:{name:"Mohammed bin Mahmoud Maimani",role:"Deputy Chief Executive Officer"}},
  {image:`${MEDIA_BASE}/media/team/yasser-bukhari.webp`,ar:{name:"ياسر بن فؤاد بخاري",role:"المدير التنفيذي للخدمات اللوجستية"},en:{name:"Yasser bin Fouad Bukhari",role:"Executive Director of Logistics Services"}},
  {image:`${MEDIA_BASE}/media/team/essam-qattan.webp`,ar:{name:"عصام بن سليمان قطان",role:"المدير التنفيذي للخدمات المساندة"},en:{name:"Essam bin Suleiman Qattan",role:"Executive Director of Support Services"}},
] as const;
const showcaseVideos=[
  {title:"استقبال حجاج ليبيا",src:`${MEDIA_BASE}/media/showcase/01.mp4`,poster:`${MEDIA_BASE}/media/showcase/01.jpg`},
] as const;
const hospitalityStages=[
  {ar:"المسار الإلكتروني وبطائق نسك",en:"Digital Journey & Nusuk Cards",kind:"video"},
  {ar:"إسكان مكة",en:"Makkah Accommodation",kind:"gallery"},
  {ar:"الاستقبال",en:"Reception",kind:"video"},
  {ar:"النقل",en:"Transportation",kind:"video"},
  {ar:"إسكان المشاعر",en:"Holy Sites Accommodation",kind:"gallery"},
  {ar:"التغذية",en:"Catering",kind:"gallery"},
  {ar:"القوى العاملة",en:"Workforce",kind:"video"},
  {ar:"الشؤون العامة",en:"General Affairs",kind:"gallery"},
  {ar:"المراقبة والمتابعة",en:"Monitoring & Follow-up",kind:"video"},
  {ar:"الرصد والتحكم",en:"Control & Observation",kind:"video"},
  {ar:"فريق السعادة ورضا الضيف",en:"Guest Happiness Team",kind:"gallery"},
] as const;
const words={
  ar:{kicker:"بُشرى لكل ضيف",hero:"رحلة تليق\nبقدسية المكان",lead:"ثلاث تجارب استثنائية، صُممت لتمنح ضيوف الرحمن رعاية تنبض بالسكينة والكرم.",careTitle:"مستويات العناية\nبضيوفنا",careLead:"ليست باقات فقط... بل مستويات مختلفة من العناية.",choose:"مرّر لاكتشاف الباقات",enter:"ادخل التجربة",back:"الباقات",services:"خدمات بشرى\nفي المشاعر",journey:"رحلة\nالحاج",details:"تفاصيل\nالباقة",detailsAction:"استعرض التفاصيل",watch:"شاهد التجربة",explore:"استعرض الرحلة",video:"هنا تبدأ تجربة الفيديو السينمائية",videoNote:"سيتم استبدال هذا المشهد بفيديو الباقة النهائي",image:"محطة من الرحلة",of:"من",close:"إغلاق",homeTitle:"اختر تجربتك",homeLead:"استكشف باقات بشرى وقصص ضيوفها ومكتبة الأفلام.",packages:"الباقات",testimonials:"شهادات من التجربة",videos:"بشرى في مشاهد",team:"فريقنا",teamTitle:"قيادات بشرى الضيافة",hospitality:"تجربة الضيافة",hospitalityTitle:"تجربة الضيافة",hospitalityLead:"من المسار الإلكتروني حتى رضا الضيف — منظومة عناية متكاملة.",videoMedia:"فيديو",galleryMedia:"صور",soon:"سيتم إضافة المحتوى قريباً",home:"الرئيسية"},
  en:{kicker:"BUSHRA FOR EVERY GUEST",hero:"A journey worthy\nof this sacred place",lead:"Three exceptional experiences, designed to surround every pilgrim with serenity, care and generosity.",careTitle:"Levels of Care\nfor Bushra Hospitality Guests",careLead:"Not just packages... but distinct levels of care.",choose:"Move to discover packages",enter:"Enter experience",back:"Packages",services:"Bushra Services\nat the Holy Sites",journey:"The Pilgrim\nJourney",details:"Package\nDetails",detailsAction:"View details",watch:"Watch experience",explore:"Explore journey",video:"The cinematic story begins here",videoNote:"This scene will be replaced by the final package video",image:"A moment from the journey",of:"of",close:"Close",homeTitle:"Choose your experience",homeLead:"Explore Bushra packages, guest stories and the film collection.",packages:"Packages",testimonials:"Stories from the Experience",videos:"Bushra in Scenes",team:"Our Team",teamTitle:"Executive Leadership",hospitality:"Hospitality Experience",hospitalityTitle:"Hospitality Experience",hospitalityLead:"From the digital journey to guest satisfaction — one integrated care system.",videoMedia:"Video",galleryMedia:"Images",soon:"Content will be added soon",home:"Home"},
};

function Logo({className=""}:{className?:string}){return <img className={className} src={`${MEDIA_BASE}/company-logo.svg`} alt="بشرى الضيافة"/>}
function DrawLogo(){return <svg className="draw-logo" viewBox="0 0 1560 2000" role="img" aria-label="بشرى الضيافة"><path className="draw-path draw-gold" pathLength="1" d="M261.061 1360.423V723.093c0-51.12 27.275-98.36 71.541-123.913L780 340.872l447.399 258.308c44.28 25.553 71.541 72.793 71.541 123.913v637.329l194.737-78.417V610.654c0-51.12-27.261-98.36-71.541-123.913L780 116 137.864 486.741c-44.272 25.553-71.541 72.793-71.541 123.913v671.352l194.738 78.417Z"/><path className="draw-path draw-blue" pathLength="1" d="M1297.977 1430.148v221.738H262.03v-221.738L65.99 1351.731v507.241h571.855L780 1716.803l142.162 142.169h571.848v-507.241l-196.033 78.417Z"/><path className="draw-path draw-diamond" pathLength="1" d="m780 1768.69 91.606 91.606L780 1951.902l-91.606-91.606L780 1768.69Z"/></svg>}
function Arrow(){return <svg viewBox="0 0 32 16" aria-hidden="true"><path d="M1 8h28M22 1l7 7-7 7"/></svg>}
function Play(){return <svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="23"/><path d="m21 17 13 8-13 8Z"/></svg>}
function Frames(){return <svg viewBox="0 0 50 50" aria-hidden="true"><rect x="7" y="10" width="31" height="31" rx="3"/><path d="m12 34 8-9 6 6 5-5 7 8"/><circle cx="18" cy="19" r="3"/><path d="M15 6h28v29"/></svg>}
function DetailsIcon(){return <svg viewBox="0 0 50 50" aria-hidden="true"><path d="M11 5h21l8 8v32H11Z"/><path d="M32 5v9h8M17 22h17M17 29h17M17 36h11"/><circle cx="17" cy="14" r="2"/></svg>}
function PackagesIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="13" width="20" height="38" rx="2"/><rect x="37" y="13" width="20" height="38" rx="2"/><path d="M17 8v48M47 8v48M12 43h10M42 43h10"/></svg>}
function QuoteIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 34c0-13 7-21 19-24v9c-6 2-9 6-9 11h10v22H10V34Zm30 0c0-13 7-21 19-24v9c-6 2-9 6-9 11h10v22H40V34Z"/></svg>}
function FilmsIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="12" width="50" height="40" rx="3"/><path d="M7 22h50M18 12v10M32 12v10M46 12v10M27 31l14 8-14 8Z"/></svg>}
function TeamIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="20" r="9"/><circle cx="14" cy="28" r="6"/><circle cx="50" cy="28" r="6"/><path d="M17 55c0-11 6-18 15-18s15 7 15 18M3 53c0-8 4-13 11-13 4 0 7 2 9 5M61 53c0-8-4-13-11-13-4 0-7 2-9 5"/></svg>}
function HospitalityIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 45c8-1 13 1 19 7h6c6-6 11-8 19-7M14 39V22l18-12 18 12v17"/><path d="M23 39V27h18v12M32 10v29"/><circle cx="32" cy="48" r="4"/></svg>}\nfunction HomeIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9h-6v-6H9v6H3Z"/></svg>}
function FullscreenIcon({active=false}:{active?:boolean}){return active?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"/></svg>}
function CareLevelIcon({level}:{level:Level}){
  if(level===1)return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M18 67 13 30l22 17 13-28 13 28 22-17-5 37Z"/><path d="M18 67h60v11H18Z"/><circle cx="13" cy="25" r="3"/><circle cx="48" cy="14" r="3"/><circle cx="83" cy="25" r="3"/></svg>;
  if(level===2)return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M48 78S19 61 19 35c0-11 8-18 18-18 6 0 10 3 11 8 2-5 6-8 12-8 10 0 17 7 17 18 0 26-29 43-29 43Z"/><path d="M14 72c8-9 17-14 28-15M82 72c-8-9-17-14-28-15"/></svg>;
  return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M14 60c10-2 19 1 28 10l6 7 6-7c9-9 18-12 28-10"/><path d="M20 51V31M10 41h20M66 39l7-7 7 7-7 7Z"/><circle cx="48" cy="35" r="12"/><path d="M48 23v24M36 35h24"/></svg>;
}

function ParticleField(){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
    let raf=0,w=0,h=0;const pointer={x:.5,y:.5};
    const nodes=Array.from({length:55},(_,i)=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.25,s:(Math.random()-.5)*.00012*(i%3+1)}));
    const resize=()=>{const d=Math.min(devicePixelRatio,2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)};
    const move=(e:PointerEvent)=>{pointer.x=e.clientX/innerWidth;pointer.y=e.clientY/innerHeight};
    const draw=()=>{ctx.clearRect(0,0,w,h);for(const n of nodes){n.y+=n.s;if(n.y<0)n.y=1;if(n.y>1)n.y=0;const dx=(pointer.x-.5)*14,dy=(pointer.y-.5)*14;const x=n.x*w+dx*(n.r),y=n.y*h+dy*(n.r);ctx.beginPath();ctx.arc(x,y,n.r,0,Math.PI*2);ctx.fillStyle=`rgba(208,168,108,${.14+n.r*.12})`;ctx.fill()}raf=requestAnimationFrame(draw)};
    resize();addEventListener("resize",resize);addEventListener("pointermove",move);draw();
    return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",move)};
  },[]);
  return <canvas className="particles" ref={ref}/>;
}

export default function Home(){
  const [lang,setLang]=useState<Lang>("ar"),[loading,setLoading]=useState(true),[section,setSection]=useState<Section>("home"),[selected,setSelected]=useState<Level|null>(null),[focus,setFocus]=useState<Level>(1),[modal,setModal]=useState<Modal>(null),[slide,setSlide]=useState(0),[activeShowcase,setActiveShowcase]=useState(0),[activeHospitality,setActiveHospitality]=useState(0),[isFullscreen,setIsFullscreen]=useState(false);
  const t=words[lang],rtl=lang==="ar";
  const hasLevelOneArabic=selected===1&&lang==="ar";
  const galleryTotal=hasLevelOneArabic?50:60;
  const touchStart=useRef(0);
  useEffect(()=>{const id=setTimeout(()=>setLoading(false),1900);return()=>clearTimeout(id)},[]);
  useEffect(()=>{const sync=()=>setIsFullscreen(Boolean(document.fullscreenElement));document.addEventListener("fullscreenchange",sync);return()=>document.removeEventListener("fullscreenchange",sync)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setModal(null);if(modal==="gallery"&&e.key==="ArrowRight")setSlide(s=>(s+1)%galleryTotal);if(modal==="gallery"&&e.key==="ArrowLeft")setSlide(s=>(s+galleryTotal-1)%galleryTotal)};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[modal,galleryTotal]);
  const transition=(action:()=>void)=>{const doc=document as Document&{startViewTransition?:(cb:()=>void)=>void};doc.startViewTransition?doc.startViewTransition(action):action()};
  const pick=(n:Level)=>{setModal(null);setSlide(0);setFocus(n);setSelected(n)};
  const goHome=()=>transition(()=>{setModal(null);setSelected(null);setSection("home")});
  const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{/* Fullscreen can be blocked by the browser or an embedded frame. */}};
  const atFirstPage=section==="home"&&!selected;
  const atLastPage=section==="hospitality"&&!selected;
  const previousPage=()=>transition(()=>{
    setModal(null);
    if(selected){if(selected>1)pick((selected-1) as Level);else setSelected(null);return}
    if(section==="hospitality")setSection("team");\n    else if(section==="team")setSection("videos");
    else if(section==="videos")setSection("testimonials");
    else if(section==="testimonials")setSection("packages");
    else if(section==="packages")setSection("home");
  });
  const nextPage=()=>transition(()=>{
    setModal(null);
    if(selected){if(selected<3)pick((selected+1) as Level);else{setSelected(null);setSection("testimonials")}return}
    if(section==="home")setSection("packages");
    else if(section==="packages")pick(focus);
    else if(section==="testimonials")setSection("videos");
    else if(section==="videos")setSection("team");\n    else if(section==="team")setSection("hospitality");
  });
  return <main className={`experience theme-${focus}`} dir={rtl?"rtl":"ltr"} onPointerMove={e=>{const el=e.currentTarget;el.style.setProperty("--mx",`${e.clientX}px`);el.style.setProperty("--my",`${e.clientY}px`)}}>
    <div className="brand-film" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} autoPlay muted loop playsInline preload="auto"/><div className="film-grade"/><div className="film-vignette"/><div className="film-grain"/></div>
    <div className="aurora"/><div className="cursor-light"/><div className="edge-noise"/>
    <header className="nav">
      <button className="brand-lockup" onClick={()=>transition(()=>{setSelected(null);setSection("home")})} aria-label="Bushra Hospitality home"><img className="anniversary-logo" src={`${MEDIA_BASE}/anniversary-logo.svg`} alt="11th anniversary"/><i/><img className="company-wordmark" src={`${MEDIA_BASE}/company-logo-horizontal.svg`} alt="Bushra Hospitality"/></button>
      <div className="lang-switch" role="group" aria-label="Language selection">
        <button className={lang==="ar"?"is-active":""} onClick={()=>setLang("ar")} aria-label="العربية" aria-pressed={lang==="ar"}><span>عربي</span></button>
        <button className={lang==="en"?"is-active":""} onClick={()=>setLang("en")} aria-label="English" aria-pressed={lang==="en"}><span>English</span></button>
      </div>
    </header>

    <section className={`hub-scene ${section==="home"?"is-here":""}`}>
      <div className="hub-heading"><h1 className="hub-slogan">{t.kicker}</h1></div>
      <div className="hub-options">
        <button onClick={()=>transition(()=>setSection("packages"))}><span><PackagesIcon/></span><strong>{t.packages}</strong></button>
        <button onClick={()=>transition(()=>setSection("testimonials"))}><span><QuoteIcon/></span><strong>{t.testimonials}</strong></button>
        <button onClick={()=>transition(()=>setSection("videos"))}><span><FilmsIcon/></span><strong>{t.videos}</strong></button>
        <button onClick={()=>transition(()=>setSection("team"))}><span><TeamIcon/></span><strong>{t.team}</strong></button>\n        <button onClick={()=>transition(()=>setSection("hospitality"))}><span><HospitalityIcon/></span><strong>{t.hospitality}</strong></button>
      </div>
    </section>

    <section className={`home-scene ${section!=="packages"||selected?"is-away":""}`}>
      <div className="hero-copy care-copy">
        <h1>{t.careTitle.split("\n").map(x=><span key={x}>{x}</span>)}</h1>
        <p>{t.careLead}</p>
      </div>
      <div className="portal-stage">
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        {([1,2,3] as Level[]).map(level=><button type="button" key={level} onPointerEnter={()=>setFocus(level)} onPointerDown={()=>setFocus(level)} onFocus={()=>setFocus(level)} onClick={()=>pick(level)} className={`portal portal-${level} ${focus===level?"is-focused":""}`} aria-label={packs[level][lang]}>
          <span className="portal-halo"/><span className="portal-glass"><span className={`portal-care-symbol portal-care-symbol-${level}`}><CareLevelIcon level={level}/></span><span className="portal-title">{packs[level][lang]}</span><span className="portal-enter">{t.enter}<Arrow/></span></span>
        </button>)}
      </div>
    </section>

    <section className={`content-scene ${section==="testimonials"?"is-here":""}`}>
      {section==="testimonials"&&<><div className="content-icon"><QuoteIcon/></div><span className="content-index">02</span><h2>{t.testimonials}</h2><p>{t.soon}</p></>}
    </section>

    <section className={`showcase-scene ${section==="videos"?"is-here":""}`} aria-labelledby="showcase-title">
      <header className="showcase-heading"><span>03 / FILMS</span><h2 id="showcase-title">{t.videos}</h2><i/></header>
      <div className="showcase-grid">
        {showcaseVideos.map((video,index)=><button type="button" className="showcase-card" key={video.src} onClick={()=>{setActiveShowcase(index);setModal("showcase")}} style={{"--showcase-index":index} as React.CSSProperties}>
          <span className="showcase-poster"><img src={video.poster} alt=""/><i/><b><Play/></b></span>
          <strong>{video.title}</strong><small>{String(index+1).padStart(2,"0")}</small>
        </button>)}
      </div>
    </section>

    <section className={`team-scene ${section==="team"?"is-here":""}`} aria-labelledby="leadership-title">
      <header className="leadership-heading"><h2 id="leadership-title">{t.teamTitle}</h2><i/></header>
      <div className="leadership-grid">
        {leadership.map((leader,index)=><article className={`leader-card ${index===0?"leader-card--primary":""}`} key={leader.en.name} style={{"--leader-index":index} as React.CSSProperties}>
          <div className="leader-portrait"><span/><img src={leader.image} alt={leader[lang].name}/></div>
          <div className="leader-copy"><h3>{leader[lang].name}</h3><p>{leader[lang].role}</p></div>
        </article>)}
      </div>
    </section>

    <section className={`hospitality-scene ${section==="hospitality"?"is-here":""}`} aria-labelledby="hospitality-title">
      <header className="hospitality-heading"><h2 id="hospitality-title">{t.hospitalityTitle}</h2><p>{t.hospitalityLead}</p></header>
      <div className="journey-map" role="list">
        {hospitalityStages.map((stage,index)=><button type="button" role="listitem" className="journey-stage" key={stage.ar} style={{"--stage-index":index} as React.CSSProperties} onClick={()=>{setActiveHospitality(index);setModal("hospitality")}}>
          <span className="journey-number">{String(index+1).padStart(2,"0")}</span><span className="journey-node">{stage.kind==="video"?<Play/>:<Frames/>}</span><strong>{stage[lang]}</strong><small>{stage.kind==="video"?t.videoMedia:t.galleryMedia}</small>
        </button>)}
      </div>
    </section>

    <section className={`package-scene ${selected?"is-here":""}`}>
      {selected&&<><div className="giant-index">{packs[selected].no}</div><button className="back-button" onClick={()=>transition(()=>setSelected(null))}><Arrow/><span>{t.back}</span></button>
        <div className="package-title"><span>0{selected} / 03</span><h2>{packs[selected][lang]}</h2><i/></div>
        <div className="experience-picks">
          <button type="button" className="experience-pick video-pick" onClick={()=>setModal("video")}><span className="pick-media"><i className="liquid"/><Play/></span><span className="pick-copy"><strong>{t.services.split("\n").map(x=><span key={x}>{x}</span>)}</strong></span></button>
          <button type="button" className="experience-pick gallery-pick" onClick={()=>{setSlide(0);setModal("gallery")}}><span className="pick-media"><i className="liquid"/><Frames/></span><span className="pick-copy"><strong>{t.journey.split("\n").map(x=><span key={x}>{x}</span>)}</strong></span></button>
          <button type="button" className="experience-pick details-pick" onClick={()=>setModal("details")}><span className="pick-media"><i className="liquid"/><DetailsIcon/></span><span className="pick-copy"><strong>{t.details.split("\n").map(x=><span key={x}>{x}</span>)}</strong></span></button>
        </div>
        <div className="package-orbit"><span/><span/><span/></div>
      </>}
    </section>

    {modal==="video"&&<div className={`cinema modal-layer ${selected?"cinema--video":""}`} role="dialog" aria-modal="true"><button className="x" onClick={()=>setModal(null)}>×<small>{t.close}</small></button>{selected?<><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background.mp4`} autoPlay muted loop playsInline/><div className="cinema-video-overlay"/><span className="cinema-video-light cinema-video-light-a"/><span className="cinema-video-light cinema-video-light-b"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video key={`services-${selected}`} className="services-video" src={`${MEDIA_BASE}/media/level-${selected}/services.mp4`} poster={`${MEDIA_BASE}/media/level-${selected}/services-poster.jpg`} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><span className="video-screen-shadow"/></div></>:<><div className="cinema-rings"><i/><i/><i/></div><div className="cinema-copy"><span>PLAY FILM — 0{selected}</span><h3>{t.video}</h3><p>{t.videoNote}</p><button><Play/></button></div><div className="cinema-time">00:00 <i/> 02:45</div></>}</div>}
    {modal==="gallery"&&<div className={`gallery modal-layer ${hasLevelOneArabic?"gallery--real":""} ${rtl?"gallery--rtl":"gallery--ltr"}`} role="dialog" aria-modal="true" onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setSlide(s=>(s+(delta<0?1:galleryTotal-1))%galleryTotal)}}>
      {hasLevelOneArabic&&<div className="gallery-video-bg" aria-hidden="true"><video className="video-panorama" src={`${MEDIA_BASE}/media/brand/background.mp4`} autoPlay muted loop playsInline/><div className="video-overlay"/><span className="video-light video-light-a"/><span className="video-light video-light-b"/></div>}
      <button className="x" onClick={()=>setModal(null)}>×<small>{t.close}</small></button>
      <div className="gallery-number">{String(slide+1).padStart(2,"0")}</div>
      <div className="screen-stage"><div className="gallery-frame"><div className="gallery-art">{hasLevelOneArabic?<img key={slide} className="journey-slide" src={`${MEDIA_BASE}/media/level-1/ar/${String(slide+1).padStart(2,"0")}.webp`} alt={`رحلة حجاج بشرى الضيافة - صفحة ${slide+1}`} draggable={false}/>:<><Logo/><span>{packs[selected??1][lang]}</span></>}</div><div className="gallery-caption"><small>{String(slide+1).padStart(2,"0")} {t.of} {galleryTotal}</small><h3>{hasLevelOneArabic?"رحلة حجاج بشرى الضيافة":t.image}</h3></div></div><span className="screen-shadow"/></div>
      <div className="gallery-nav"><button onClick={()=>setSlide(s=>(s+galleryTotal-1)%galleryTotal)}><Arrow/></button><i><em style={{width:`${((slide+1)/galleryTotal)*100}%`}}/></i><b>{String(slide+1).padStart(2,"0")} / {galleryTotal}</b><button onClick={()=>setSlide(s=>(s+1)%galleryTotal)}><Arrow/></button></div>
    </div>}

    {modal==="details"&&<div className="cinema details-modal modal-layer" role="dialog" aria-modal="true"><button className="x" onClick={()=>setModal(null)}>×<small>{t.close}</small></button><div className="cinema-rings"><i/><i/><i/></div><div className="cinema-copy details-copy"><span>0{selected} / 03</span><DetailsIcon/><h3>{t.details.replace("\n"," ")}</h3><p>{t.soon}</p></div></div>}
    {modal==="showcase"&&<div className="cinema cinema--video showcase-modal modal-layer" role="dialog" aria-modal="true" aria-label={showcaseVideos[activeShowcase].title}><button className="x" onClick={()=>setModal(null)}>×<small>{t.close}</small></button><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background.mp4`} autoPlay muted loop playsInline/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video key={showcaseVideos[activeShowcase].src} className="services-video" src={showcaseVideos[activeShowcase].src} poster={showcaseVideos[activeShowcase].poster} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><h3 className="showcase-video-title">{showcaseVideos[activeShowcase].title}</h3><span className="video-screen-shadow"/></div></div>}

    {modal==="hospitality"&&<div className="cinema hospitality-modal modal-layer" role="dialog" aria-modal="true" aria-label={hospitalityStages[activeHospitality][lang]}><button className="x" onClick={()=>setModal(null)}>×<small>{t.close}</small></button><div className="cinema-rings"><i/><i/><i/></div><div className="hospitality-modal-copy"><span>{String(activeHospitality+1).padStart(2,"0")} / {hospitalityStages.length}</span><div className="hospitality-modal-icon">{hospitalityStages[activeHospitality].kind==="video"?<Play/>:<Frames/>}</div><h3>{hospitalityStages[activeHospitality][lang]}</h3><p>{hospitalityStages[activeHospitality].kind==="video"?t.videoMedia:t.galleryMedia} · {t.soon}</p></div></div>}

    <nav className={`page-step-nav global-step-nav ${modal?"is-obscured":""}`} aria-label={rtl?"التنقل بين الصفحات":"Page navigation"}>
      <div className="step-row"><button type="button" className="page-step page-step-prev" onClick={previousPage} disabled={atFirstPage} aria-label={rtl?"الصفحة السابقة":"Previous page"}><Arrow/></button><span className="page-step-line"><i/></span><button type="button" className="page-step page-step-next" onClick={nextPage} disabled={atLastPage} aria-label={rtl?"الصفحة التالية":"Next page"}><Arrow/></button></div>
      <div className="utility-row"><button type="button" className="utility-step" onClick={goHome} aria-label={rtl?"العودة إلى الصفحة الرئيسية":"Go to homepage"}><HomeIcon/></button><button type="button" className="utility-step" onClick={toggleFullscreen} aria-label={isFullscreen?(rtl?"الخروج من ملء الشاشة":"Exit full screen"):(rtl?"عرض بملء الشاشة":"Enter full screen")}><FullscreenIcon active={isFullscreen}/></button></div>
    </nav>

    <div className={`loader ${loading?"show":""}`}><div className="loader-stage"><div className="logo-draw-wrap"><span className="logo-aura"/><DrawLogo/></div></div></div>
  </main>
}
