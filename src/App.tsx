const MEDIA_BASE="https://bushra-hospitality-packages.marwaothman999.chatgpt.site";
"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { motion, useReducedMotion } from "motion/react";

type Lang="ar"|"en"; type Level=1|2|3; type Modal="video"|"gallery"|"details"|"showcase"|"hospitality"|"trust"|"trustVideo"|"testimonial"|"testimonialVideo"|"comprehensive"|"meeting"|"qr"|null; type Section="home"|"hajj1448"|"hajj1448Algeria"|"packages"|"testimonials"|"videos"|"team"|"hospitality"; type ComprehensivePhase="idle"|"activating"|"panel";
type PresentationView={lang:Lang;section:Section;selected:Level|null;focus:Level;modal:Modal;slide:number;activeShowcase:number;activeHospitality:number;activeHospitalityPhase:number;activeReception:number;activeControlObservation:number;activeTestimonial:number;activeTrust:number};
const VIEW_STORAGE_KEY="bushra-presentation-view-v1";
function readPresentationView():PresentationView|null{try{const saved=sessionStorage.getItem(VIEW_STORAGE_KEY);return saved?JSON.parse(saved) as PresentationView:null}catch{return null}}
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
  {ar:"استقبال حجاج ليبيا",en:"Welcoming Libyan Pilgrims",src:`${MEDIA_BASE}/media/showcase/01.mp4`,poster:`${MEDIA_BASE}/media/showcase/01.jpg`},
  {ar:"استقبال حجاج مصر",en:"Welcoming Egyptian Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/egypt.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/egypt.jpg`},
  {ar:"استقبال حجاج إندونيسيا",en:"Welcoming Indonesian Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/indonesia.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/indonesia.jpg`},
  {ar:"استقبال حجاج بنغلاديش",en:"Welcoming Bangladeshi Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/bangladesh.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/bangladesh.jpg`},
  {ar:"بطاقة نسك لرحلة أيسر",en:"Nusuk Card for an Easier Journey",src:`${MEDIA_BASE}/media/hospitality/nusuk-card.mp4`,poster:`${MEDIA_BASE}/media/hospitality/nusuk-card-poster.jpg`},
  {ar:"تجربة إسكان مكة",en:"Makkah Accommodation Experience",src:`${MEDIA_BASE}/media/hospitality/makkah-accommodation-v2.mp4`,poster:`${MEDIA_BASE}/media/hospitality/makkah-accommodation-v2-poster.jpg`},
  {ar:"النقل بين محطات الرحلة",en:"Transportation Across the Journey",src:`${MEDIA_BASE}/media/hospitality/transportation.mp4`,poster:`${MEDIA_BASE}/media/hospitality/transportation-poster.jpg`},
  {ar:"شهادة من تجربة الضيف",en:"A Story from the Guest Experience",src:`${MEDIA_BASE}/media/testimonials/ibrahim-al-saghir.mp4`,poster:`${MEDIA_BASE}/media/testimonials/ibrahim-al-saghir-poster.jpg`},
] as const;
const receptionVideos=[
  {ar:"استقبال حجاج ليبيا",en:"Welcoming Libyan Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/libya.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/libya.jpg`},
  {ar:"استقبال حجاج مصر",en:"Welcoming Egyptian Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/egypt.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/egypt.jpg`},
  {ar:"استقبال حجاج إندونيسيا",en:"Welcoming Indonesian Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/indonesia.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/indonesia.jpg`},
  {ar:"استقبال حجاج بنغلاديش",en:"Welcoming Bangladeshi Pilgrims",src:`${MEDIA_BASE}/media/hospitality/reception/bangladesh.mp4`,poster:`${MEDIA_BASE}/media/hospitality/reception/bangladesh.jpg`},
] as const;
const comprehensiveServices=[
  {icon:"flight",ar:{title:"الطيران",description:"إدارة بداية الرحلة عبر تنسيق متكامل يربط مواعيد الوصول ببقية خدمات الباقة.",value:"بداية منضبطة تمنح الرحلة إيقاعاً تشغيلياً واحداً.",points:["تنسيق الرحلات","متابعة الوصول","ربط الخدمات التالية"]},en:{title:"Aviation",description:"An integrated start to the journey, connecting flight schedules with every service that follows.",value:"A coordinated beginning that establishes one operational rhythm.",points:["Flight coordination","Arrival monitoring","Connected onward services"]}},
  {icon:"transport",ar:{title:"النقل",description:"حركة منظمة وآمنة تربط المطار والفنادق والمشاعر ضمن خطة تشغيل موحدة.",value:"تنقّل آمن وانسيابي عبر جميع محطات الرحلة.",points:["إدارة الحافلات","تخطيط المسارات","متابعة الحركة"]},en:{title:"Transportation",description:"Safe, coordinated movement connecting airports, hotels and the holy sites.",value:"Safe, seamless mobility across every stage of the journey.",points:["Fleet management","Route planning","Live movement tracking"]}},
  {icon:"hotel",ar:{title:"الفنادق",description:"إقامة مدارة بعناية تضمن جاهزية الغرف وسهولة الوصول واستمرارية الخدمة.",value:"جاهزية متكاملة تمنح الضيف إقامة أكثر راحة وطمأنينة.",points:["إدارة التسكين","جاهزية المرافق","خدمة الضيوف"]},en:{title:"Hotels",description:"Carefully managed accommodation supporting readiness, access and continuity of service.",value:"Integrated readiness for a more comfortable and reassuring stay.",points:["Room allocation","Facility readiness","Guest services"]}},
  {icon:"mashair",ar:{title:"المشاعر",description:"تجربة متكاملة في المشاعر تجمع الإقامة والخدمة والدعم الميداني.",value:"استمرارية في الرعاية داخل أكثر محطات الرحلة حساسية.",points:["تهيئة المواقع","الدعم الميداني","استمرارية الخدمة"]},en:{title:"Holy Sites",description:"An integrated holy-sites experience combining accommodation, service and field support.",value:"Continuous care throughout the journey’s most critical stages.",points:["Site readiness","Field support","Service continuity"]}},
  {icon:"catering",ar:{title:"التغذية",description:"منظومة غذائية تراعي الجودة والسلامة والتوقيت في جميع محطات الرحلة.",value:"جودة موثوقة تصل إلى الضيف في الوقت المناسب.",points:["جودة الوجبات","سلامة الغذاء","دقة التوزيع"]},en:{title:"Catering",description:"A food-service system built around quality, safety and precise delivery.",value:"Trusted quality delivered to every guest at the right time.",points:["Meal quality","Food safety","Timely distribution"]}},
  {icon:"dispatch",ar:{title:"التفويج",description:"إدارة انسيابية حركة الضيوف وفق توقيتات ومسارات مدروسة حتى اكتمال الرحلة.",value:"انسيابية تشغيلية من الوصول حتى اكتمال الرحلة.",points:["جدولة المجموعات","تنظيم الحركة","المتابعة اللحظية"]},en:{title:"Dispatch",description:"Orchestrated guest movement through carefully planned schedules and routes.",value:"Operational flow from arrival through journey completion.",points:["Group scheduling","Flow management","Real-time follow-up"]}},
] as const;
const comprehensivePanelPositions=[
  {left:"50%",top:"22%"},
  {left:"68%",top:"26%"},
  {left:"68%",top:"43%"},
  {left:"57%",top:"42%"},
  {left:"29%",top:"42%"},
  {left:"34%",top:"25%"},
] as const;
const trustSlideCount=6;
const controlObservationSlideCount=5;
const testimonials=[
  {name:"Mero Queen",quote:"لكم مني خالص الشكر والتقدير على مجهوداتكم وخدماتكم اللامحدودة، جزاكم الله عنا خير الجزاء ودمتم في تألق وإبداع دائم. بشرى الضيافة اسم سيظل في ذاكرتي.",image:`${MEDIA_BASE}/media/testimonials/facebook-01.png`},
  {name:"نوران أحمد",quote:"جزاكم الله كل الخير، نعم الشركة، ربنا يبارك فيكم.",image:`${MEDIA_BASE}/media/testimonials/facebook-02.png`},
  {name:"أم بركة عمر يحيى",quote:"بارك الله فيكم، كانت استضافة مميزة وخدمات ما شاء الله. ربي يعاونكم، موفقين دائماً.",image:`${MEDIA_BASE}/media/testimonials/facebook-03.png`},
] as const;
const testimonialVideo={ar:"كلمة أ.د إبراهيم مفتاح الصغير",en:"Prof. Ibrahim Muftah Al-Saghir",src:`${MEDIA_BASE}/media/testimonials/ibrahim-al-saghir.mp4`,poster:`${MEDIA_BASE}/media/testimonials/ibrahim-al-saghir-poster.jpg`} as const;
const facebookPost="https://www.facebook.com/share/p/1CEexKbd63/";
const hospitalityStages=[
  {ar:"المسار الإلكتروني وبطائق نسك",en:"Digital Journey & Nusuk Cards",kind:"video"},
  {ar:"إسكان مكة",en:"Makkah Accommodation",kind:"video"},
  {ar:"الاستقبال",en:"Reception",kind:"video"},
  {ar:"النقل",en:"Transportation",kind:"video"},
  {ar:"إسكان المشاعر",en:"Holy Sites Accommodation",kind:"gallery"},
  {ar:"التغذية",en:"Catering",kind:"gallery"},
  {ar:"القوى العاملة",en:"Workforce",kind:"video"},
  {ar:"الشؤون العامة",en:"General Affairs",kind:"gallery"},
  {ar:"المراقبة والمتابعة",en:"Monitoring & Follow-up",kind:"video"},
  {ar:"الرصد والتحكم",en:"Control & Observation",kind:"gallery"},
  {ar:"فريق السعادة ورضا الضيف",en:"Guest Happiness Team",kind:"gallery"},
] as const;
const hospitalityValue=[
  {ar:"رحلة رقمية موثوقة تبدأ قبل الوصول",en:"A trusted digital journey before arrival"},
  {ar:"إقامة جاهزة ومترابطة في مكة",en:"Ready, connected accommodation in Makkah"},
  {ar:"استقبال منظم يليق بضيوف الرحمن",en:"A coordinated welcome worthy of every guest"},
  {ar:"حركة آمنة بانسيابية تشغيلية",en:"Safe movement through operational precision"},
  {ar:"جاهزية متكاملة في المشاعر المقدسة",en:"Integrated readiness across the holy sites"},
  {ar:"جودة وسلامة في كل وجبة",en:"Quality and safety in every meal"},
  {ar:"فرق مؤهلة حيث تدعو الحاجة",en:"Qualified teams wherever service is needed"},
  {ar:"استمرارية الخدمة ودعم الميدان",en:"Service continuity and field support"},
  {ar:"متابعة لحظية ترفع كفاءة التنفيذ",en:"Live oversight that strengthens execution"},
  {ar:"قرارات أسرع برؤية تشغيلية موحدة",en:"Faster decisions through one operational view"},
  {ar:"صوت الضيف يتحول إلى تحسين مستمر",en:"The guest voice driving continuous improvement"},
] as const;
const hajj1448Countries=[
  {id:"libya",ar:"ليبيا",en:"Libya"},
  {id:"algeria",ar:"الجزائر",en:"Algeria"},
  {id:"tunisia",ar:"تونس",en:"Tunisia"},
] as const;
const meetingSlides=[
  {kind:"image",src:"/media/hajj1448/algeria-meeting-cover.png",altAr:"غلاف اللقاء التنسيقي الأول بين شركة بشرى الضيافة والديوان الوطني للحج والعمرة",altEn:"Cover of the first coordination meeting between Bushra Hospitality and the National Office for Hajj and Umrah"},
  {kind:"image",src:"/media/hajj1448/yasser-bawyan-profile.png",altAr:"ياسر باويان، مستشار الرئيس التنفيذي",altEn:"Yasser Bawyan, Advisor to the Chief Executive Officer"},
  {kind:"readiness",altAr:"موقف الجاهزية التنفيذي لموسم حج 1448هـ",altEn:"Executive readiness status for Hajj 1448 AH"},
] as const;
const ministryTimeline=[
  {status:"done",dateAr:"12 ذو الحجة 1447هـ · 29 مايو 2026م",dateEn:"29 May 2026",ar:"إطلاق البرنامج الزمني والتواصل",en:"Timeline launch and engagement",detailsAr:["الإعلان عن البرنامج الزمني لأعمال موسم حج 1448هـ.","بدء التواصل مع مكاتب شؤون الحج بشأن خدمات الموسم."],detailsEn:["Publish the Hajj 1448 operational timeline.","Begin engagement with Hajj affairs offices."],actualAr:"مكتمل",actualEn:"Completed",ownerAr:"وزارة الحج والعمرة",ownerEn:"Ministry of Hajj and Umrah"},
  {status:"done",dateAr:"15 محرم 1448هـ · 30 يونيو 2026م",dateEn:"30 Jun 2026",ar:"تفضيلات السكن وإتاحة المخيمات",en:"Accommodation preferences and camps",detailsAr:["استقبال تفضيلات السكن في مكة والمدينة.","إتاحة بيانات المخيمات عبر منصة نسك مسار."],detailsEn:["Collect accommodation preferences in Makkah and Madinah.","Publish camp data through Nusuk Masar."],actualAr:"مكتمل",actualEn:"Completed",ownerAr:"الديوان الوطني",ownerEn:"National Office"},
  {status:"active",dateAr:"1 صفر 1448هـ · 15 يوليو 2026م",dateEn:"15 Jul 2026",ar:"قادة المراكز وتأهيل العاملين",en:"Centre leaders and workforce training",detailsAr:["إدخال بيانات تسعة قادة لكل مركز ضيافة حتى 8 يناير 2027م.","تدريب وتأهيل العاملين حتى 28 يناير 2027م."],detailsEn:["Register nine leaders per hospitality centre by 8 Jan 2027.","Train and qualify operational staff by 28 Jan 2027."],actualAr:"جاري التنفيذ وفق المدة المعتمدة",actualEn:"In progress within the approved window",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"done",dateAr:"15–29 صفر 1448هـ · 29 يوليو–12 أغسطس",dateEn:"29 Jul–12 Aug 2026",ar:"تأكيد المخيمات والباقة الشاملة",en:"Camp retention and package confirmation",detailsAr:["تأكيد الاحتفاظ بمخيمات موسم 1447هـ من خلال التعاقد المبكر.","استكمال تفضيلات السكن في مكة والمدينة."],detailsEn:["Confirm retention of Hajj 1447 camps through early contracting.","Complete Makkah and Madinah accommodation preferences."],actualAr:"حجز المواقع مكتمل · 5 أكتوبر",actualEn:"Locations reserved · 5 Oct",ownerAr:"الديوان الوطني",ownerEn:"National Office"},
  {status:"active",dateAr:"1 ربيع الأول 1448هـ · 14 أغسطس 2026م",dateEn:"14 Aug 2026",ar:"الاجتماعات والتعاقد والتفويج",en:"Meetings, contracting and dispatch",detailsAr:["الاجتماعات التحضيرية لشركات تقديم الخدمة.","التعاقد على الباقة الشاملة حتى 23 يناير 2027م.","تسجيل رغبات تفويج الحجاج حتى 8 نوفمبر 2026م."],detailsEn:["Preparatory meetings for service companies.","Comprehensive-package contracting through 23 Jan 2027.","Record dispatch preferences through 8 Nov 2026."],actualAr:"الباقة أُنشئت · تعاقدات المزوّدين جارية",actualEn:"Package created · provider contracting in progress",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"active",dateAr:"15 ربيع الثاني 1448هـ · 26 سبتمبر 2026م",dateEn:"26 Sep 2026",ar:"بيانات الحجاج والمجموعات",en:"Pilgrim data and groups",detailsAr:["مراجعة بيانات الحجاج والمجموعات على نسك مسار حتى 27 فبراير 2027م.","إغلاق الاجتماعات التحضيرية لشركات تقديم الخدمة."],detailsEn:["Review pilgrim and group data in Nusuk Masar through 27 Feb 2027.","Close preparatory meetings with service companies."],actualAr:"إدخال البيانات جارٍ تمهيدًا للتأشيرات",actualEn:"Data entry in progress for visa issuance",ownerAr:"الديوان الوطني",ownerEn:"National Office"},
  {status:"ahead",dateAr:"1 جمادى الأولى 1448هـ · 12 أكتوبر 2026م",dateEn:"12 Oct 2026",ar:"تخصيص مواقع المشاعر",en:"Holy-site allocation",detailsAr:["بدء تخصيص مواقع الخيام والمباني في المشاعر المقدسة."],detailsEn:["Begin allocating tents and buildings across the holy sites."],actualAr:"حجز المواقع مكتمل · 5 أكتوبر",actualEn:"Locations reserved · 5 Oct",ownerAr:"الديوان الوطني",ownerEn:"National Office"},
  {status:"next",dateAr:"28 جمادى الأولى 1448هـ · 8 نوفمبر 2026م",dateEn:"8 Nov 2026",ar:"معرض الحج وإغلاق رغبات التفويج",en:"Hajj Expo and dispatch closure",detailsAr:["مؤتمر ومعرض الحج 2026م.","انتهاء تسجيل رغبات تفويج الحجاج."],detailsEn:["Hajj Conference and Exhibition 2026.","Close pilgrim dispatch preferences."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"next",dateAr:"1 رجب 1448هـ · 10 ديسمبر 2026م",dateEn:"10 Dec 2026",ar:"القوى العاملة والاشتراطات التشغيلية",en:"Workforce and operational requirements",detailsAr:["بدء التوظيف واللقاحات والحراسات والتسجيل الحكومي.","تعيين ضابطي اتصال لبطاقات وقارئات نسك.","بدء الكشف على جاهزية المساكن."],detailsEn:["Start recruitment, vaccination, security and government registration.","Appoint liaison officers for Nusuk cards and readers.","Begin accommodation-readiness inspections."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"30 رجب 1448هـ · 8 يناير 2027م",dateEn:"8 Jan 2027",ar:"خطط بطاقات وقارئات نسك",en:"Nusuk card and reader plans",detailsAr:["الانتهاء من إدخال بيانات مراكز الضيافة.","تقديم خطتي أعمال بطاقات وقارئات نسك."],detailsEn:["Complete hospitality-centre data.","Submit operating plans for Nusuk cards and readers."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"15 شعبان 1448هـ · 23 يناير 2027م",dateEn:"23 Jan 2027",ar:"إغلاق التعاقد وفرضيات النقل",en:"Contract closure and transport drills",detailsAr:["الانتهاء من التعاقد على الباقة الشاملة.","بدء فرضيات النقل وتهيئة المخيمات لتركيب قارئات نسك."],detailsEn:["Complete comprehensive-package contracting.","Begin transport drills and prepare camps for Nusuk readers."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"20 شعبان 1448هـ · 28 يناير 2027م",dateEn:"28 Jan 2027",ar:"بدء التأشيرات وإتمام التدريب",en:"Visa launch and training completion",detailsAr:["بدء إصدار التأشيرات.","انتهاء تدريب وتأهيل العاملين بمراكز الضيافة."],detailsEn:["Begin visa issuance.","Complete hospitality-centre workforce training."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"next",dateAr:"20 رمضان 1448هـ · 27 فبراير 2027م",dateEn:"27 Feb 2027",ar:"اعتماد البيانات وتكوين مجموعات الطباعة",en:"Data approval and print groups",detailsAr:["اعتماد بيانات الحجاج والمجموعات على نسك مسار.","بدء تكوين مجموعات طباعة بطاقات نسك."],detailsEn:["Approve pilgrim and group data in Nusuk Masar.","Begin forming Nusuk card print groups."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"1 شوال 1448هـ · 9 مارس 2027م",dateEn:"9 Mar 2027",ar:"الجاهزية والامتثال",en:"Readiness and compliance",detailsAr:["إغلاق إصدار التأشيرات ومراجعة الاستعداد المسبق.","فرضيات المياه وانطلاق نسك امتثال.","استكمال اللقاحات والتسجيل عبر أجير."],detailsEn:["Close visa issuance and review pre-readiness data.","Run water drills and launch Nusuk compliance.","Complete vaccinations and Ajeer registration."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"next",dateAr:"15 شوال 1448هـ · 23 مارس 2027م",dateEn:"23 Mar 2027",ar:"الطباعة والشحن والجاهزية الأمنية",en:"Printing, shipping and security readiness",detailsAr:["تسجيل العاملين وطباعة وشحن بطاقات نسك.","إغلاق تعاقدات الحراسات وكشف جاهزية المساكن."],detailsEn:["Register staff, print and ship Nusuk cards.","Close security contracts and accommodation inspections."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"1 ذو القعدة 1448هـ · 8 أبريل 2027م",dateEn:"8 Apr 2027",ar:"جاهزية منى وبداية الوصول",en:"Mina readiness and arrivals",detailsAr:["استكمال جاهزية مخيمات منى وتسليمها لمتعهدي الإعاشة.","استلام قارئات نسك وبداية وصول الحجاج."],detailsEn:["Complete Mina readiness and hand sites to caterers.","Receive Nusuk readers and begin pilgrim arrivals."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"15 ذو القعدة 1448هـ · 22 أبريل 2027م",dateEn:"22 Apr 2027",ar:"جاهزية عرفات",en:"Arafat readiness",detailsAr:["استكمال جاهزية مخيمات عرفة وإصدار رخصة الجاهزية.","تسليم المواقع لمتعهدي الإعاشة وتجهيز المطابخ."],detailsEn:["Complete Arafat readiness and issue readiness licence.","Hand sites to caterers and prepare kitchens."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"20–29 ذو القعدة · 27 أبريل–6 مايو 2027م",dateEn:"27 Apr–6 May 2027",ar:"معاينة المخيمات",en:"Camp inspection",detailsAr:["معاينة ممثلي مكاتب شؤون الحج للمخيمات مع شركة تقديم الخدمة."],detailsEn:["Joint camp inspection by Hajj affairs representatives and the service company."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"الطرفان",ownerEn:"Joint"},
  {status:"next",dateAr:"24–29 ذو القعدة · 1 و6 مايو 2027م",dateEn:"1 & 6 May 2027",ar:"اختبارات الطاقة والقارئات",en:"Power and reader testing",detailsAr:["فرضيات الطاقة الكهربائية للمخيمات.","فرضية اختبار قارئات نسك في المشاعر."],detailsEn:["Run camp electrical-power drills.","Test Nusuk readers across the holy sites."],actualAr:"مرحلة قادمة",actualEn:"Upcoming",ownerAr:"بشرى الضيافة",ownerEn:"Bushra Hospitality"},
  {status:"next",dateAr:"1–20 محرم 1449هـ · 6–25 يونيو 2027م",dateEn:"6–25 Jun 2027",ar:"شهادة الإنجاز",en:"Completion certificate",detailsAr:["تسليم شهادة الإنجاز بين مكاتب شؤون الحج وشركات تقديم الخدمة."],detailsEn:["Issue the completion certificate between Hajj affairs offices and service companies."],actualAr:"مرحلة ختامية",actualEn:"Final stage",ownerAr:"الطرفان",ownerEn:"Joint"},
] as const;

type CmsPayload={
  settings?:{homepageTitleAr?:string;homepageTitleEn?:string}|null;
  packages?:Array<{level:number;titleAr?:string;titleEn?:string;active?:boolean}>;
  leaders?:Array<{order:number;nameAr?:string;nameEn?:string;roleAr?:string;roleEn?:string;featured?:boolean}>;
  stages?:Array<{order:number;titleAr?:string;titleEn?:string;mediaType?:"video"|"images";active?:boolean}>;
};
const SANITY_QUERY=`{"settings":*[_type=="siteSettings"][0]{homepageTitleAr,homepageTitleEn},"packages":*[_type=="package"&&active!=false]|order(order asc){level,titleAr,titleEn,active},"leaders":*[_type=="leader"]|order(order asc){order,nameAr,nameEn,roleAr,roleEn,featured},"stages":*[_type=="hospitalityStage"&&active!=false]|order(order asc){order,titleAr,titleEn,mediaType,active}}`;
const SANITY_URL=`https://l526cvef.api.sanity.io/v2026-09-06/data/query/production?query=${encodeURIComponent(SANITY_QUERY)}`;
const words={
  ar:{kicker:"بُشرى لكل ضيف",hero:"رحلة تليق\nبقدسية المكان",lead:"ثلاث تجارب استثنائية، صُممت لتمنح ضيوف الرحمن رعاية تنبض بالسكينة والكرم.",careTitle:"مستويات العناية\nبضيوفنا",careLead:"ليست باقات فقط... بل مستويات مختلفة من العناية.",choose:"مرّر لاكتشاف الباقات",enter:"ادخل التجربة",back:"الباقات",services:"خدمات بشرى\nفي المشاعر",journey:"رحلة\nالحاج",details:"تفاصيل\nالباقة",detailsAction:"استعرض التفاصيل",watch:"شاهد التجربة",explore:"استعرض الرحلة",video:"هنا تبدأ تجربة الفيديو السينمائية",videoNote:"سيتم استبدال هذا المشهد بفيديو الباقة النهائي",image:"محطة من الرحلة",of:"من",close:"إغلاق",homeTitle:"اختر تجربتك",homeLead:"استكشف باقات بشرى وقصص ضيوفها ومكتبة الأفلام.",trust:"شواهد الثقة",trustTitle:"شواهد الثقة",packages:"الباقات",testimonials:"شهادات من التجربة",videos:"بشرى في مشاهد",team:"فريقنا القيادي",teamTitle:"قيادات بشرى الضيافة",hospitality:"قطاعاتنا",hospitalityTitle:"قطاعاتنا",hospitalityLead:"من المسار الإلكتروني حتى رضا الضيف — منظومة عناية متكاملة.",videoMedia:"فيديو",galleryMedia:"صور",soon:"سيتم إضافة المحتوى قريباً",home:"الرئيسية"},
  en:{kicker:"BUSHRA FOR EVERY GUEST",hero:"A journey worthy\nof this sacred place",lead:"Three exceptional experiences, designed to surround every pilgrim with serenity, care and generosity.",careTitle:"Levels of Care\nfor Bushra Hospitality Guests",careLead:"Not just packages... but distinct levels of care.",choose:"Move to discover packages",enter:"Enter experience",back:"Packages",services:"Bushra Services\nat the Holy Sites",journey:"The Pilgrim\nJourney",details:"Package\nDetails",detailsAction:"View details",watch:"Watch experience",explore:"Explore journey",video:"The cinematic story begins here",videoNote:"This scene will be replaced by the final package video",image:"A moment from the journey",of:"of",close:"Close",homeTitle:"Choose your experience",homeLead:"Explore Bushra packages, guest stories and the film collection.",trust:"Trust Evidence",trustTitle:"Evidence of Trust",packages:"Packages",testimonials:"Stories from the Experience",videos:"Bushra in Scenes",team:"Leadership Team",teamTitle:"Executive Leadership",hospitality:"Our Sectors",hospitalityTitle:"Our Sectors",hospitalityLead:"From the digital journey to guest satisfaction — one integrated care system.",videoMedia:"Video",galleryMedia:"Images",soon:"Content will be added soon",home:"Home"},
};

function Logo({className=""}:{className?:string}){return <img className={className} src={`${MEDIA_BASE}/company-logo.svg`} alt="بشرى الضيافة"/>}
function DrawLogo(){return <svg className="draw-logo" viewBox="0 0 1560 2000" role="img" aria-label="بشرى الضيافة"><path className="draw-path draw-gold" pathLength="1" d="M261.061 1360.423V723.093c0-51.12 27.275-98.36 71.541-123.913L780 340.872l447.399 258.308c44.28 25.553 71.541 72.793 71.541 123.913v637.329l194.737-78.417V610.654c0-51.12-27.261-98.36-71.541-123.913L780 116 137.864 486.741c-44.272 25.553-71.541 72.793-71.541 123.913v671.352l194.738 78.417Z"/><path className="draw-path draw-blue" pathLength="1" d="M1297.977 1430.148v221.738H262.03v-221.738L65.99 1351.731v507.241h571.855L780 1716.803l142.162 142.169h571.848v-507.241l-196.033 78.417Z"/><path className="draw-path draw-diamond" pathLength="1" d="m780 1768.69 91.606 91.606L780 1951.902l-91.606-91.606L780 1768.69Z"/></svg>}
function Arrow(){return <svg viewBox="0 0 32 16" aria-hidden="true"><path d="M1 8h28M22 1l7 7-7 7"/></svg>}
function Chevron(){return <svg viewBox="0 0 24 40" aria-hidden="true"><path d="M3 3l17 17L3 37"/></svg>}
function Play(){return <svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="23"/><path d="m21 17 13 8-13 8Z"/></svg>}
function Frames(){return <svg viewBox="0 0 50 50" aria-hidden="true"><rect x="7" y="10" width="31" height="31" rx="3"/><path d="m12 34 8-9 6 6 5-5 7 8"/><circle cx="18" cy="19" r="3"/><path d="M15 6h28v29"/></svg>}
function DetailsIcon(){return <svg viewBox="0 0 50 50" aria-hidden="true"><path d="M11 5h21l8 8v32H11Z"/><path d="M32 5v9h8M17 22h17M17 29h17M17 36h11"/><circle cx="17" cy="14" r="2"/></svg>}
function PackagesIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="13" width="20" height="38" rx="2"/><rect x="37" y="13" width="20" height="38" rx="2"/><path d="M17 8v48M47 8v48M12 43h10M42 43h10"/></svg>}
function QuoteIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 34c0-13 7-21 19-24v9c-6 2-9 6-9 11h10v22H10V34Zm30 0c0-13 7-21 19-24v9c-6 2-9 6-9 11h10v22H40V34Z"/></svg>}
function FilmsIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="12" width="50" height="40" rx="3"/><path d="M7 22h50M18 12v10M32 12v10M46 12v10M27 31l14 8-14 8Z"/></svg>}
function TeamIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="20" r="9"/><circle cx="14" cy="28" r="6"/><circle cx="50" cy="28" r="6"/><path d="M17 55c0-11 6-18 15-18s15 7 15 18M3 53c0-8 4-13 11-13 4 0 7 2 9 5M61 53c0-8-4-13-11-13-4 0-7 2-9 5"/></svg>}
function HospitalityIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 45c8-1 13 1 19 7h6c6-6 11-8 19-7M14 39V22l18-12 18 12v17"/><path d="M23 39V27h18v12M32 10v29"/><circle cx="32" cy="48" r="4"/></svg>}
function TrustIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 51 14v16c0 13-8 23-19 28C21 53 13 43 13 30V14Z"/><path d="m22 31 7 7 14-16"/><circle cx="32" cy="19" r="3"/></svg>}
function Hajj1448Icon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 50h38M18 50V26h28v24M23 26l9-12 9 12M25 35h14M25 41h14"/><path d="M9 19c7-7 15-10 23-10M55 19C48 12 40 9 32 9"/><circle cx="9" cy="19" r="2"/><circle cx="55" cy="19" r="2"/></svg>}
function MeetingIcon(){return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 49V24h44v25M6 53h52M20 24v-7h24v7"/><circle cx="23" cy="35" r="4"/><circle cx="41" cy="35" r="4"/><path d="M16 47c1-6 4-9 7-9s6 3 7 9M34 47c1-6 4-9 7-9s6 3 7 9"/></svg>}
function CountryFlag({country}:{country:(typeof hajj1448Countries)[number]["id"]}){
  if(country==="libya")return <svg viewBox="0 0 90 60" role="img" aria-label="علم ليبيا"><path fill="#e70013" d="M0 0h90v15H0z"/><path fill="#000" d="M0 15h90v30H0z"/><path fill="#239e46" d="M0 45h90v15H0z"/><path fill="#fff" d="M50 23a9 9 0 1 0 0 14 8 8 0 1 1 0-14Z"/><path fill="#fff" d="m54 26 1.2 3.5h3.7l-3 2.2 1.1 3.5-3-2.1-3 2.1 1.1-3.5-3-2.2h3.7Z"/></svg>;
  if(country==="algeria")return <svg viewBox="0 0 90 60" role="img" aria-label="علم الجزائر"><path fill="#fff" d="M0 0h90v60H0z"/><path fill="#006233" d="M0 0h45v60H0z"/><path fill="#d21034" d="M54 20a13 13 0 1 0 0 20 11 11 0 1 1 0-20Z"/><path fill="#d21034" d="m57 24 2 6h6.3l-5.1 3.7 1.9 6-5.1-3.6-5.1 3.6 1.9-6-5.1-3.7H55Z"/></svg>;
  return <svg viewBox="0 0 90 60" role="img" aria-label="علم تونس"><path fill="#e70013" d="M0 0h90v60H0z"/><circle fill="#fff" cx="45" cy="30" r="16"/><path fill="#e70013" d="M49 21a11 11 0 1 0 0 18 9 9 0 1 1 0-18Z"/><path fill="#e70013" d="m51 24 1.8 5.3h5.6l-4.5 3.3 1.7 5.3-4.6-3.3-4.5 3.3 1.7-5.3-4.6-3.3h5.7Z"/></svg>;
}
function HomeIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9h-6v-6H9v6H3Z"/></svg>}
function BackIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7"/><path d="M8 12h10"/></svg>}
function FullscreenIcon({active=false}:{active?:boolean}){return active?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"/></svg>}
function RefreshIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></svg>}
function QrIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h3v3h-3ZM18 18h3v3h-3ZM18 14h3M14 19v2"/></svg>}
function ComprehensiveServiceIcon({kind}:{kind:string}){if(kind==="flight")return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m5 27 16-4L31 6l5 2-4 16 10 6-2 4-12-2-6 10-4-1 2-11-13 2Z"/></svg>;if(kind==="transport")return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="29" rx="5"/><path d="M12 26h24M15 37v5M33 37v5M14 14h20"/><circle cx="15" cy="31" r="2"/><circle cx="33" cy="31" r="2"/></svg>;if(kind==="hotel")return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V18l17-11 17 11v23M15 41V25h18v16M24 7v34"/></svg>;if(kind==="mashair")return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 40 24 9l17 31M13 40h22M17 31h14M24 9v31"/></svg>;if(kind==="catering")return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 28h32M12 28a12 12 0 0 1 24 0M24 13V8M8 34h32"/><circle cx="24" cy="8" r="2"/></svg>;return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="17" cy="17" r="6"/><circle cx="33" cy="19" r="5"/><path d="M6 40c0-10 5-16 11-16s11 6 11 16M27 40c0-8 3-13 8-13s8 5 8 13M21 32h17M34 27l5 5-5 5"/></svg>}
function CareLevelIcon({level}:{level:Level}){
  if(level===1)return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M18 67 13 30l22 17 13-28 13 28 22-17-5 37Z"/><path d="M18 67h60v11H18Z"/><circle cx="13" cy="25" r="3"/><circle cx="48" cy="14" r="3"/><circle cx="83" cy="25" r="3"/></svg>;
  if(level===2)return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M48 78S19 61 19 35c0-11 8-18 18-18 6 0 10 3 11 8 2-5 6-8 12-8 10 0 17 7 17 18 0 26-29 43-29 43Z"/><path d="M14 72c8-9 17-14 28-15M82 72c-8-9-17-14-28-15"/></svg>;
  return <svg className="care-level-icon" viewBox="0 0 96 96" aria-hidden="true"><path d="M14 60c10-2 19 1 28 10l6 7 6-7c9-9 18-12 28-10"/><path d="M20 51V31M10 41h20M66 39l7-7 7 7-7 7Z"/><circle cx="48" cy="35" r="12"/><path d="M48 23v24M36 35h24"/></svg>;
}

function MeetingReadinessSlide({lang}:{lang:Lang}){
  const ar=lang==="ar";
  const [selected,setSelected]=useState(0);
  const current=ministryTimeline[selected];
  const windowStart=Math.min(Math.max(selected-2,0),ministryTimeline.length-5);
  const visible=Array.from({length:5},(_,position)=>{
    const index=windowStart+position;
    return {...ministryTimeline[index],index,offset:index-selected};
  });
  const statusLabel=current.status==="done"?(ar?"مكتمل":"Completed"):current.status==="ahead"?(ar?"متقدم على الخطة":"Ahead of plan"):current.status==="active"?(ar?"قيد التنفيذ":"In progress"):(ar?"مرحلة قادمة":"Upcoming");
  const nextAction=current.status==="done"||current.status==="ahead"
    ?(ar?"الانتقال إلى المتطلب التالي مع توثيق الإقفال.":"Document closure and proceed to the next requirement.")
    :current.status==="active"
      ?(ar?"استكمال المتطلبات المفتوحة ورفع تحديث الجاهزية.":"Close outstanding requirements and issue a readiness update.")
      :(ar?"بدء التنفيذ في التاريخ المعتمد بعد اكتمال المتطلبات السابقة.":"Begin on the approved date once preceding requirements are complete.");
  const move=(direction:-1|1)=>setSelected(index=>Math.min(Math.max(index+direction,0),ministryTimeline.length-1));
  return <article className="readiness-slide ministry-roadmap" dir={ar?"rtl":"ltr"} aria-label={ar?"البرنامج الزمني لموسم حج 1448هـ":"Hajj 1448 AH Ministry timeline"}>
    <header className="readiness-header">
      <div><small>{ar?"وزارة الحج والعمرة · موسم حج 1448هـ":"MINISTRY OF HAJJ AND UMRAH · HAJJ 1448 AH"}</small><h2>{ar?"خارطة الجاهزية التشغيلية":"Operational readiness roadmap"}</h2><p>{ar?"20 محطة زمنية من إطلاق البرنامج حتى شهادة الإنجاز":"20 milestones from programme launch to completion certification"}</p></div>
      <aside className="readiness-summary" aria-label={ar?"ملخص التقدم":"Progress summary"}>
        <span><b>4</b><em>{ar?"مكتملة":"Completed"}</em></span><span><b>3</b><em>{ar?"قيد التنفيذ":"In progress"}</em></span><span><b>13</b><em>{ar?"قادمة":"Upcoming"}</em></span>
      </aside>
    </header>
    <nav className="roadmap-overview" aria-label={ar?"جميع المحطات الزمنية":"All timeline milestones"}>
      {ministryTimeline.map((stage,index)=><button type="button" key={index} className={`is-${stage.status} ${selected===index?"is-selected":""}`} onClick={()=>setSelected(index)} aria-label={`${index+1}. ${ar?stage.ar:stage.en}`} aria-current={selected===index?"step":undefined}><i/><span>{String(index+1).padStart(2,"0")}</span></button>)}
    </nav>
    <div className="roadmap-strip-wrap">
      <button type="button" className="roadmap-scroll roadmap-scroll--start" onClick={()=>move(-1)} disabled={selected===0} aria-label={ar?"المحطة السابقة":"Previous milestone"}><Chevron/></button>
      <div className="roadmap-strip" role="list">
        <i className="roadmap-line" aria-hidden="true"/>
        {visible.map(stage=><button type="button" key={stage.index} role="listitem" className={`roadmap-point is-${stage.status} is-offset-${Math.abs(stage.offset)} ${selected===stage.index?"is-selected":""}`} onClick={()=>setSelected(stage.index)} aria-pressed={selected===stage.index}><time>{ar?stage.dateAr:stage.dateEn}</time><i><span>{stage.status==="done"||stage.status==="ahead"?"✓":stage.status==="active"?"◐":"◆"}</span></i><strong>{ar?stage.ar:stage.en}</strong></button>)}
      </div>
      <button type="button" className="roadmap-scroll roadmap-scroll--end" onClick={()=>move(1)} disabled={selected===ministryTimeline.length-1} aria-label={ar?"المحطة التالية":"Next milestone"}><Chevron/></button>
    </div>
    <section className={`roadmap-detail is-${current.status}`} key={selected} aria-live="polite">
      <header className="roadmap-detail-title"><div><span>{String(selected+1).padStart(2,"0")}</span><i/><b>{statusLabel}</b></div><small>{ar?current.dateAr:current.dateEn}</small><h3>{ar?current.ar:current.en}</h3><p>{ar?current.ownerAr:current.ownerEn}</p></header>
      <div className="roadmap-detail-column"><small>{ar?"متطلب الوزارة":"MINISTRY REQUIREMENT"}</small><ul>{(ar?current.detailsAr:current.detailsEn).map(detail=><li key={detail}>{detail}</li>)}</ul></div>
      <div className="roadmap-detail-column roadmap-detail-progress"><small>{ar?"التقدم الفعلي":"ACTUAL PROGRESS"}</small><strong>{ar?current.actualAr:current.actualEn}</strong></div>
      <div className="roadmap-detail-column roadmap-detail-next"><small>{ar?"الإجراء التالي":"NEXT ACTION"}</small><strong>{nextAction}</strong></div>
    </section>
  </article>
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
  const reduceMotion=useReducedMotion();
  const initialView=useRef(readPresentationView()).current;
  const [lang,setLang]=useState<Lang>(initialView?.lang??"ar"),[loading,setLoading]=useState(!initialView),[transitioning,setTransitioning]=useState(false),[section,setSection]=useState<Section>(initialView?.section??"home"),[selected,setSelected]=useState<Level|null>(initialView?.selected??null),[focus,setFocus]=useState<Level>(initialView?.focus??1),[modal,setModal]=useState<Modal>(initialView?.modal??null),[slide,setSlide]=useState(initialView?.slide??0),[activeShowcase,setActiveShowcase]=useState(initialView?.activeShowcase??0),[activeHospitality,setActiveHospitality]=useState(initialView?.activeHospitality??0),[activeHospitalityPhase,setActiveHospitalityPhase]=useState(initialView?.activeHospitalityPhase??0),[activeReception,setActiveReception]=useState(initialView?.activeReception??0),[activeControlObservation,setActiveControlObservation]=useState(initialView?.activeControlObservation??0),[activeTestimonial,setActiveTestimonial]=useState(initialView?.activeTestimonial??0),[activeTrust,setActiveTrust]=useState(initialView?.activeTrust??0),[trustTurn,setTrustTurn]=useState<"next"|"prev">("next"),[compactBook,setCompactBook]=useState(false),[activeComprehensive,setActiveComprehensive]=useState<number|null>(null),[comprehensivePhase,setComprehensivePhase]=useState<ComprehensivePhase>("idle"),[isFullscreen,setIsFullscreen]=useState(false),[activeHub,setActiveHub]=useState<number|null>(null),[qrUrl,setQrUrl]=useState("");
  const [cms,setCms]=useState<CmsPayload|null>(null);
  const [testimonialFocus,setTestimonialFocus]=useState(0);
  const [testimonialFilter,setTestimonialFilter]=useState<"all"|"video"|"comments">("all");
  const [meetingSlide,setMeetingSlide]=useState(0);
  const managedPacks=([1,2,3] as Level[]).reduce((all,level)=>{const item=cms?.packages?.find(entry=>entry.level===level);all[level]={...packs[level],ar:item?.titleAr||packs[level].ar,en:item?.titleEn||packs[level].en};return all},{} as Record<Level,{ar:string;en:string;no:string;tone:string}>);
  const managedLeadership=leadership.map((leader,index)=>{const item=cms?.leaders?.find(entry=>entry.order===index+1);return {...leader,ar:{name:item?.nameAr||leader.ar.name,role:item?.roleAr||leader.ar.role},en:{name:item?.nameEn||leader.en.name,role:item?.roleEn||leader.en.role}}});
  const managedStages=(cms?.stages?.length?cms.stages:hospitalityStages).map((stage,index)=>{const fallback=hospitalityStages[Math.min(index,hospitalityStages.length-1)];return {ar:("titleAr" in stage&&stage.titleAr)||fallback.ar,en:("titleEn" in stage&&stage.titleEn)||fallback.en,kind:("mediaType" in stage&&stage.mediaType==="images"?"gallery":"video") as "gallery"|"video"}});
  const hospitalityPhases=[
    {ar:"قبل الوصول",en:"Before Arrival",indices:[0]},
    {ar:"الوصول والإقامة",en:"Arrival & Accommodation",indices:[2,3,1]},
    {ar:"تشغيل المشاعر",en:"Holy Sites Operations",indices:[4,5,6]},
    {ar:"التحكم وتجربة الضيف",en:"Control & Guest Experience",indices:[7,8,9,10]},
  ];
  const t={...words[lang],kicker:(lang==="ar"?cms?.settings?.homepageTitleAr:cms?.settings?.homepageTitleEn)||words[lang].kicker},rtl=lang==="ar";
  const hubDetails=[
    {title:lang==="ar"?"الباقة الشاملة":"Comprehensive Package",brief:lang==="ar"?"رحلة واحدة تجمع الطيران والنقل والفنادق والمشاعر والتغذية والتفويج ضمن تجربة متكاملة 360°.":"One journey connecting aviation, transportation, hotels, holy sites, catering and dispatch in a complete 360° experience."},
    {title:t.trust,brief:lang==="ar"?"إنجازات موثقة وشهادات تعكس أثر بشرى وجودة خدماتها لضيوف الرحمن.":"Verified achievements and credentials reflecting Bushra's impact and service quality."},
    {title:t.team,brief:lang==="ar"?"خبرات قيادية تقود منظومة الضيافة برؤية واضحة ومسؤولية راسخة.":"Experienced leaders guiding the hospitality system with vision and responsibility."},
    {title:t.hospitality,brief:lang==="ar"?"قطاعات مترابطة تصنع رحلة تشغيل متكاملة من الوصول حتى رضا الضيف.":"Connected sectors creating an integrated journey from arrival to guest satisfaction."},
    {title:t.packages,brief:lang==="ar"?"مستويات عناية صُممت لتلائم احتياجات ضيوف الرحمن في كل محطة.":"Care levels designed around pilgrims' needs at every stage of their journey."},
    {title:t.testimonials,brief:lang==="ar"?"أصوات ضيوفنا وشركائنا تحكي تجربة بشرى كما عاشوها.":"Guests and partners share the Bushra experience in their own words."},
    {title:t.videos,brief:lang==="ar"?"مشاهد مختارة توثق حضور بشرى وخدماتها في الميدان.":"Selected moments documenting Bushra's services and presence in the field."},
    {title:lang==="ar"?"تجهيزات حج 1448هـ":"Hajj 1448 Preparations",brief:lang==="ar"?"استعدادات مخصصة لبعثات الدول التي تخدمها بشرى في موسم حج 1448هـ.":"Dedicated preparations for the country missions served by Bushra during Hajj 1448 AH."},
  ];
  const hasLevelOneArabic=selected===1&&lang==="ar";
  const galleryTotal=hasLevelOneArabic?50:60;
  const touchStart=useRef(0);
  const hubOptionsRef=useRef<HTMLDivElement>(null);
  const showcaseStripRef=useRef<HTMLDivElement>(null);
  const backgroundVideoRef=useRef<HTMLVideoElement>(null);
  const transitionTimers=useRef<number[]>([]);
  const comprehensiveTimer=useRef<number|undefined>(undefined);
  const historyReady=useRef(false);
  const restoringHistory=useRef(false);
  const [historyDepth,setHistoryDepth]=useState(0);
  useEffect(()=>{if(!loading)return;const id=setTimeout(()=>setLoading(false),700);return()=>clearTimeout(id)},[loading]);
  useEffect(()=>{try{sessionStorage.setItem(VIEW_STORAGE_KEY,JSON.stringify({lang,section,selected,focus,modal,slide,activeShowcase,activeHospitality,activeHospitalityPhase,activeReception,activeControlObservation,activeTestimonial,activeTrust} satisfies PresentationView))}catch{/* State persistence is optional in restricted browser contexts. */}},[lang,section,selected,focus,modal,slide,activeShowcase,activeHospitality,activeHospitalityPhase,activeReception,activeControlObservation,activeTestimonial,activeTrust]);
  useEffect(()=>{
    const restore=(event:PopStateEvent)=>{
      const entry=event.state as {bushraView?:PresentationView;bushraDepth?:number}|null;
      if(!entry?.bushraView)return;
      restoringHistory.current=true;
      setHistoryDepth(entry.bushraDepth??0);
      const view=entry.bushraView;
      setLang(view.lang);setSection(view.section);setSelected(view.selected);setFocus(view.focus);setModal(view.modal);setSlide(view.slide);setActiveShowcase(view.activeShowcase);setActiveHospitality(view.activeHospitality);setActiveHospitalityPhase(view.activeHospitalityPhase);setActiveReception(view.activeReception);setActiveControlObservation(view.activeControlObservation);setActiveTestimonial(view.activeTestimonial);setActiveTrust(view.activeTrust);
    };
    addEventListener("popstate",restore);
    return()=>removeEventListener("popstate",restore);
  },[]);
  useEffect(()=>{
    const view={lang,section,selected,focus,modal,slide,activeShowcase,activeHospitality,activeHospitalityPhase,activeReception,activeControlObservation,activeTestimonial,activeTrust} satisfies PresentationView;
    const destination=modal??(selected?`level-${selected}`:section);
    const hash=destination==="home"?"":`#${destination}`;
    const url=`${location.pathname}${location.search}${hash}`;
    if(!historyReady.current){
      const existingDepth=Number((history.state as {bushraDepth?:number}|null)?.bushraDepth??0);
      history.replaceState({bushraView:view,bushraDepth:existingDepth},"",url);
      historyReady.current=true;setHistoryDepth(existingDepth);return;
    }
    if(restoringHistory.current){restoringHistory.current=false;return}
    const nextDepth=historyDepth+1;
    history.pushState({bushraView:view,bushraDepth:nextDepth},"",url);
    setHistoryDepth(nextDepth);
  },[section,selected,modal]);
  useEffect(()=>{const video=backgroundVideoRef.current;if(!video)return;video.playbackRate=.72;if(modal)video.pause();else video.play().catch(()=>{})},[modal]);
  useEffect(()=>{QRCode.toDataURL(location.href,{width:360,margin:2,color:{dark:"#133c67",light:"#ffffff"}}).then(setQrUrl).catch(()=>setQrUrl(""))},[]);
  useEffect(()=>{const controller=new AbortController();fetch(SANITY_URL,{signal:controller.signal}).then(response=>response.ok?response.json():Promise.reject()).then(data=>setCms(data.result as CmsPayload)).catch(()=>{/* Keep the complete built-in presentation when the CMS is unavailable. */});return()=>controller.abort()},[]);
  useEffect(()=>{if(section!=="videos")return;const track=showcaseStripRef.current;const card=track?.querySelector<HTMLElement>(`.showcase-strip-card:nth-child(${activeShowcase+1})`);if(!track||!card)return;const trackBox=track.getBoundingClientRect();const cardBox=card.getBoundingClientRect();track.scrollBy({left:cardBox.left+cardBox.width/2-(trackBox.left+trackBox.width/2),behavior:"smooth"})},[activeShowcase,section]);
  const selectComprehensiveService=(index:number)=>{if(activeComprehensive===index&&comprehensivePhase==="panel"){closeComprehensiveService();return}if(comprehensiveTimer.current)clearTimeout(comprehensiveTimer.current);setActiveComprehensive(index);setComprehensivePhase("activating");comprehensiveTimer.current=window.setTimeout(()=>setComprehensivePhase("panel"),180)};
  const closeComprehensiveService=()=>{if(comprehensiveTimer.current)clearTimeout(comprehensiveTimer.current);setComprehensivePhase("idle");setActiveComprehensive(null)};
  const turnTrust=(direction:"next"|"prev")=>{setTrustTurn(direction);setActiveTrust(current=>compactBook?(current+(direction==="next"?1:trustSlideCount-1))%trustSlideCount:direction==="next"?(current===0?1:current===1?3:current===3?5:0):(current===0?5:current===5?3:current===3?1:0))};
  const scrollHub=(direction:-1|1)=>{const track=hubOptionsRef.current;if(!track)return;const card=track.querySelector<HTMLElement>("button");const gap=Number.parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||0;track.scrollBy({left:direction*((card?.getBoundingClientRect().width||track.clientWidth*.32)+gap),behavior:"smooth"})};
  useEffect(()=>{if(modal!=="comprehensive")return;const navigate=(event:KeyboardEvent)=>{if(event.key==="ArrowLeft"||event.key==="PageDown")selectComprehensiveService(((activeComprehensive??-1)+1)%comprehensiveServices.length);if(event.key==="ArrowRight"||event.key==="PageUp")selectComprehensiveService(((activeComprehensive??0)+comprehensiveServices.length-1)%comprehensiveServices.length)};addEventListener("keydown",navigate);return()=>removeEventListener("keydown",navigate)},[modal,activeComprehensive]);
  useEffect(()=>{if(modal!=="comprehensive"||activeComprehensive===null)return;const dismiss=(event:PointerEvent)=>{const target=event.target;if(target instanceof Element&&target.closest(".comprehensive-orbit button"))return;closeComprehensiveService()};document.addEventListener("pointerdown",dismiss);return()=>document.removeEventListener("pointerdown",dismiss)},[modal,activeComprehensive]);
  useEffect(()=>{const sync=()=>setIsFullscreen(Boolean(document.fullscreenElement));document.addEventListener("fullscreenchange",sync);return()=>document.removeEventListener("fullscreenchange",sync)},[]);
  useEffect(()=>{const media=matchMedia("(max-width: 620px)");const sync=()=>setCompactBook(media.matches);sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync)},[]);
  useEffect(()=>()=>{transitionTimers.current.forEach(clearTimeout);if(comprehensiveTimer.current)clearTimeout(comprehensiveTimer.current)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){if(modal==="comprehensive"&&activeComprehensive!==null)closeComprehensiveService();else if(modal==="trustVideo")setModal("trust");else setModal(null)}if(modal==="gallery"&&e.key==="ArrowRight")setSlide(s=>(s+1)%galleryTotal);if(modal==="gallery"&&e.key==="ArrowLeft")setSlide(s=>(s+galleryTotal-1)%galleryTotal);if(modal==="hospitality"&&activeHospitality===2&&e.key==="ArrowRight")setActiveReception(i=>(i+1)%receptionVideos.length);if(modal==="hospitality"&&activeHospitality===2&&e.key==="ArrowLeft")setActiveReception(i=>(i+receptionVideos.length-1)%receptionVideos.length);if(modal==="hospitality"&&activeHospitality===9&&e.key==="ArrowRight")setActiveControlObservation(i=>(i+1)%controlObservationSlideCount);if(modal==="hospitality"&&activeHospitality===9&&e.key==="ArrowLeft")setActiveControlObservation(i=>(i+controlObservationSlideCount-1)%controlObservationSlideCount);if(modal==="trust"&&e.key==="ArrowLeft")turnTrust("next");if(modal==="trust"&&e.key==="ArrowRight")turnTrust("prev");if(modal==="testimonial"&&e.key==="ArrowRight")setActiveTestimonial(i=>(i+1)%testimonials.length);if(modal==="testimonial"&&e.key==="ArrowLeft")setActiveTestimonial(i=>(i+testimonials.length-1)%testimonials.length)};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[modal,galleryTotal,activeHospitality,activeComprehensive]);
  const transition=(action:()=>void)=>{
    transitionTimers.current.forEach(clearTimeout);setTransitioning(true);
    transitionTimers.current=[window.setTimeout(()=>{const doc=document as Document&{startViewTransition?:(cb:()=>void)=>void};doc.startViewTransition?doc.startViewTransition(action):action()},380),window.setTimeout(()=>setTransitioning(false),1150)];
  };
  const pick=(n:Level)=>{setModal(null);setSlide(0);setFocus(n);setSelected(n)};
  const goHome=()=>transition(()=>{setModal(null);setSelected(null);setSection("home")});
  const canNavigateBack=historyDepth>0||modal!==null||selected!==null||section!=="home";
  const navigateBack=()=>{
    if(historyDepth>0){history.back();return}
    if(modal==="trustVideo"){setModal("trust");return}
    if(modal){setModal(null);return}
    if(selected){setSelected(null);return}
    if(section!=="home")goHome();
  };
  const isAlgeriaContext=section==="hajj1448Algeria"||modal==="meeting";
  const openSection=(next:Section)=>{transitionTimers.current.forEach(clearTimeout);setTransitioning(false);setActiveHub(null);setModal(null);setSelected(null);setSection(next)};
  const refreshPresentation=()=>{try{sessionStorage.setItem(VIEW_STORAGE_KEY,JSON.stringify({lang,section,selected,focus,modal,slide,activeShowcase,activeHospitality,activeHospitalityPhase,activeReception,activeControlObservation,activeTestimonial,activeTrust} satisfies PresentationView))}finally{location.reload()}};
  const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{/* Fullscreen can be blocked by the browser or an embedded frame. */}};
  const atFirstPage=section==="home"&&!selected;
  const atLastPage=section==="videos"&&!selected;
  const previousPage=()=>transition(()=>{
    setModal(null);
    if(selected){if(selected>1)pick((selected-1) as Level);else setSelected(null);return}
    if(section==="videos")setSection("testimonials");
    else if(section==="testimonials")setSection("packages");
    else if(section==="packages")setSection("hospitality");
    else if(section==="hospitality")setSection("team");
    else if(section==="hajj1448Algeria")setSection("hajj1448");
    else if(section==="hajj1448")setSection("home");
    else if(section==="team")setSection("home");
  });
  const nextPage=()=>transition(()=>{
    setModal(null);
    if(selected){if(selected<3)pick((selected+1) as Level);else{setSelected(null);setSection("testimonials")}return}
    if(section==="home")setSection("team");
    else if(section==="hajj1448"||section==="hajj1448Algeria")setSection("team");
    else if(section==="team")setSection("hospitality");
    else if(section==="hospitality")setSection("packages");
    else if(section==="packages")pick(focus);
    else if(section==="testimonials")setSection("videos");
  });
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(modal)return;if(e.key==="PageDown"||e.key===" "){e.preventDefault();nextPage();return}if(e.key==="PageUp"){e.preventDefault();previousPage();return}if(section==="home"&&e.key==="ArrowRight"){hubOptionsRef.current?.scrollBy({left:hubOptionsRef.current.clientWidth*.72,behavior:"smooth"});return}if(section==="home"&&e.key==="ArrowLeft"){hubOptionsRef.current?.scrollBy({left:-hubOptionsRef.current.clientWidth*.72,behavior:"smooth"});return}if(e.key==="ArrowRight")nextPage();if(e.key==="ArrowLeft")previousPage()};addEventListener("keydown",key);return()=>removeEventListener("keydown",key)},[modal,section]);
  useEffect(()=>{if(section==="home")requestAnimationFrame(()=>hubOptionsRef.current?.scrollTo({left:0,behavior:"auto"}))},[section,lang]);
  return <main className={`experience theme-${focus}`} dir={rtl?"rtl":"ltr"} onPointerMove={e=>{const el=e.currentTarget;el.style.setProperty("--mx",`${e.clientX}px`);el.style.setProperty("--my",`${e.clientY}px`)}}>
    <div className="brand-film" aria-hidden="true"><video ref={backgroundVideoRef} src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} onLoadedMetadata={e=>{e.currentTarget.playbackRate=.72}} autoPlay muted loop playsInline preload="auto"/><div className="film-grade"/><div className="film-vignette"/><div className="film-grain"/></div>
    <div className="aurora"/><div className="cursor-light"/><div className="edge-noise"/>
    <header className={`nav ${isAlgeriaContext?"nav--algeria":""}`}>
      {isAlgeriaContext&&<div className="partner-lockup" aria-label={lang==="ar"?"مكتب شؤون حجاج الجزائر":"The Algerian Office of Pilgrims Affairs"}>
        <img src="/media/hajj1448/algeria-pilgrims-office-logo-transparent.png" alt={lang==="ar"?"مكتب شؤون حجاج الجزائر":"The Algerian Office of Pilgrims Affairs"}/>
      </div>}
      <button className="brand-lockup" onClick={()=>transition(()=>{setSelected(null);setSection("home")})} aria-label="Bushra Hospitality home"><img className="anniversary-logo" src={`${MEDIA_BASE}/anniversary-logo.svg`} alt="11th anniversary"/><i/><img className="company-wordmark" src={activeHub!==null?"/media/brand/company-logo-dark.svg":`${MEDIA_BASE}/company-logo-horizontal.svg`} alt="Bushra Hospitality"/></button>
    </header>

    <section className={`hub-scene ${section==="home"?"is-here":""} ${activeHub!==null?"has-card-focus":""}`}>
      {activeHub!==null&&<div className="hub-focus-backdrop" aria-hidden="true"/>}
      <div className={`hub-heading ${activeHub!==null?"is-detail":""}`}><h1 className="hub-slogan">{activeHub===null?t.kicker:hubDetails[activeHub].title}</h1>{activeHub!==null&&<p>{hubDetails[activeHub].brief}</p>}</div>
      <div className="hub-carousel">
        <div className={`hub-options ${activeHub!==null?"has-active":""}`} ref={hubOptionsRef} onPointerLeave={()=>setActiveHub(null)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setActiveHub(null)}} onWheel={event=>{if(Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();event.currentTarget.scrollBy({left:event.deltaY,behavior:"auto"})}}}>
          <button className={`hub-comprehensive-card ${activeHub===0?"is-active":""}`} onPointerEnter={()=>setActiveHub(0)} onFocus={()=>setActiveHub(0)} onClick={()=>{setActiveComprehensive(null);setModal("comprehensive")}}><img src="/media/brand/comprehensive-package-cover.webp" alt=""/><strong>{lang==="ar"?"الباقة الشاملة":"Comprehensive Package"}</strong><small>360°</small></button>
          <button className={activeHub===1?"is-active":""} onPointerEnter={()=>setActiveHub(1)} onFocus={()=>setActiveHub(1)} onClick={()=>{setActiveTrust(0);setModal("trust")}}><img src={`${MEDIA_BASE}/media/trust/trust-slide-2.jpg`} alt=""/><span><TrustIcon/></span><strong>{t.trust}</strong></button>
          <button className={activeHub===2?"is-active":""} onPointerEnter={()=>setActiveHub(2)} onFocus={()=>setActiveHub(2)} onClick={()=>openSection("team")}><img src="/media/brand/leadership-cover-v2.jpg" alt=""/><span><TeamIcon/></span><strong>{t.team}</strong></button>
          <button className={activeHub===3?"is-active":""} onPointerEnter={()=>setActiveHub(3)} onFocus={()=>setActiveHub(3)} onClick={()=>openSection("hospitality")}><img src={`${MEDIA_BASE}/media/hospitality/makkah-accommodation-poster.jpg`} alt=""/><span><HospitalityIcon/></span><strong>{t.hospitality}</strong></button>
          <button className={activeHub===4?"is-active":""} onPointerEnter={()=>setActiveHub(4)} onFocus={()=>setActiveHub(4)} onClick={()=>openSection("packages")}><img src={`${MEDIA_BASE}/media/level-1/services-poster.jpg`} alt=""/><span><PackagesIcon/></span><strong>{t.packages}</strong></button>
          <button className={activeHub===5?"is-active":""} onPointerEnter={()=>setActiveHub(5)} onFocus={()=>setActiveHub(5)} onClick={()=>openSection("testimonials")}><img src={`${MEDIA_BASE}/media/testimonials/ibrahim-al-saghir-poster.jpg`} alt=""/><span><QuoteIcon/></span><strong>{t.testimonials}</strong></button>
          <button className={activeHub===6?"is-active":""} onPointerEnter={()=>setActiveHub(6)} onFocus={()=>setActiveHub(6)} onClick={()=>openSection("videos")}><img src={`${MEDIA_BASE}/media/showcase/01.jpg`} alt=""/><span><FilmsIcon/></span><strong>{t.videos}</strong></button>
          <button className={`hub-hajj1448-card ${activeHub===7?"is-active":""}`} onPointerEnter={()=>setActiveHub(7)} onFocus={()=>setActiveHub(7)} onClick={()=>openSection("hajj1448")}><span><Hajj1448Icon/></span><strong>{lang==="ar"?"تجهيزات حج 1448هـ":"Hajj 1448 Preparations"}</strong></button>
        </div>
        <button className="hub-side-arrow hub-side-arrow--left" type="button" onClick={()=>scrollHub(-1)} aria-label={lang==="ar"?"البطاقات السابقة":"Previous cards"}><Chevron/></button>
        <button className="hub-side-arrow hub-side-arrow--right" type="button" onClick={()=>scrollHub(1)} aria-label={lang==="ar"?"البطاقات التالية":"Next cards"}><Chevron/></button>
      </div>
    </section>

    <section className={`hajj1448-scene ${section==="hajj1448"?"is-here":""}`} aria-labelledby="hajj1448-title">
      <header className="hajj1448-heading">
        <small>{lang==="ar"?"الاستعداد للموسم":"SEASON READINESS"}</small>
        <h2 id="hajj1448-title">{lang==="ar"?"تجهيزات حج 1448هـ":"Hajj 1448 Preparations"}</h2>
        <p>{lang==="ar"?"استعدادات متكاملة، مصممة وفق احتياجات بعثات الدول التي تخدمها بشرى.":"Integrated preparations tailored to the needs of every country mission served by Bushra."}</p>
      </header>
      <div className="hajj1448-country-stage" role="list" aria-label={lang==="ar"?"الدول المخدومة في موسم حج 1448هـ":"Countries served during Hajj 1448 AH"}>
        <span className="hajj1448-route" aria-hidden="true"/>
        {hajj1448Countries.map((country,index)=><motion.button type="button" role="listitem" className="hajj1448-country" key={country.id} onClick={()=>country.id==="algeria"&&setSection("hajj1448Algeria")} aria-label={country.id==="algeria"?(lang==="ar"?"فتح لقاءات الجزائر":"Open Algeria meetings"):country[lang]} initial={reduceMotion?false:{opacity:0,y:24}} animate={section==="hajj1448"?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:reduceMotion?.01:.62,delay:reduceMotion?0:index*.09,ease:[.16,1,.3,1]}}>
          <span className="country-flag"><CountryFlag country={country.id}/></span>
          <span className="country-copy"><small>{lang==="ar"?"بعثة حجاج":"PILGRIM MISSION"}</small><strong>{country[lang]}</strong></span>
          <span className="country-arrow"><Arrow/></span>
        </motion.button>)}
      </div>
    </section>

    <section className={`hajj1448-scene hajj1448-meetings-scene ${section==="hajj1448Algeria"?"is-here":""}`} aria-labelledby="algeria-meetings-title">
      <header className="hajj1448-heading hajj1448-meetings-heading">
        <small>{lang==="ar"?"الجزائر · موسم حج 1448هـ":"ALGERIA · HAJJ 1448 AH"}</small>
        <h2 id="algeria-meetings-title">{lang==="ar"?"اللقاءات التنسيقية":"Coordination Meetings"}</h2>
        <p>{lang==="ar"?"مساحة توثق مراحل التنسيق والاستعداد المشترك لخدمة حجاج الجزائر.":"Documenting the stages of joint coordination and readiness in service of Algerian pilgrims."}</p>
      </header>
      <div className="hajj1448-meetings-stage">
        <button type="button" className="hajj1448-meeting-card" onClick={()=>{setMeetingSlide(0);setModal("meeting")}} aria-label={lang==="ar"?"فتح عرض اللقاء التنسيقي الأول":"Open the first coordination meeting presentation"}>
          <span className="meeting-emblem"><MeetingIcon/></span>
          <span className="meeting-copy">
            <small>{lang==="ar"?"اللقاء التنسيقي الأول":"FIRST COORDINATION MEETING"}</small>
            <strong>{lang==="ar"?"اللقاء التنسيقي الأول بين شركة بشرى الضيافة والديوان الوطني للحج والعمرة":"The First Coordination Meeting between Bushra Hospitality and the National Office for Hajj and Umrah"}</strong>
            <em>{lang==="ar"?"موسم حج 1448هـ / 2027م":"Hajj Season 1448 AH / 2027"}</em>
          </span>
          <span className="meeting-arrow"><Arrow/></span>
        </button>
      </div>
    </section>

    <section className={`home-scene packages-overview ${section!=="packages"||selected?"is-away":""}`}>
      <div className="hero-copy care-copy">
        <h1>{t.careTitle.split("\n").map(x=><span key={x}>{x}</span>)}</h1>
        <p>{t.careLead}</p>
      </div>
      <div className="portal-stage">
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        {([1,2,3] as Level[]).map((level,index)=><motion.div className="portal-motion-shell" key={level} initial={false} animate={section==="packages"&&!selected?{opacity:1,y:0,scale:1}:{opacity:0,y:reduceMotion?0:18,scale:reduceMotion?1:.985}} transition={{duration:reduceMotion?.01:.55,delay:section==="packages"&&!selected&&!reduceMotion?index*.07:0,ease:[.16,1,.3,1]}}><button type="button" onPointerEnter={()=>setFocus(level)} onPointerDown={()=>setFocus(level)} onFocus={()=>setFocus(level)} onClick={()=>pick(level)} className={`portal portal-${level} ${focus===level?"is-focused":""}`} aria-label={managedPacks[level][lang]}>
          <span className="portal-halo"/><span className="portal-glass"><span className="portal-level">{lang==="ar"?`المستوى ${level===1?"الأول":level===2?"الثاني":"الثالث"}`:`LEVEL ${String(level).padStart(2,"0")}`}</span><span className={`portal-care-symbol portal-care-symbol-${level}`}><CareLevelIcon level={level}/></span><span className="portal-title">{managedPacks[level][lang]}</span><span className="portal-positioning">{lang==="ar"?(level===1?"عناية استثنائية":level===2?"راحة متقدمة":"خدمة موثوقة"):(level===1?"Exceptional care":level===2?"Elevated comfort":"Trusted service")}</span><span className="portal-enter">{lang==="ar"?"استكشف المستوى":"Explore level"}<Arrow/></span></span>
        </button></motion.div>)}
      </div>
    </section>

    <section className={`testimonial-scene testimonial-library-scene ${section==="testimonials"?"is-here":""}`} dir={rtl?"rtl":"ltr"}>
      {section==="testimonials"&&<div className="testimonial-stage">
        <header className="testimonial-heading"><span><QuoteIcon/></span><div><h2>{t.testimonials}</h2></div></header>
        <nav className="testimonial-filters" aria-label={lang==="ar"?"تصفية الشهادات":"Filter testimonials"}>
          {(["all","video","comments"] as const).map(filter=><button type="button" key={filter} className={testimonialFilter===filter?"is-active":""} onClick={()=>{setTestimonialFilter(filter);setTestimonialFocus(filter==="comments"?1:0)}}>{filter==="all"?(lang==="ar"?"الكل":"All"):filter==="video"?(lang==="ar"?"قصص مرئية":"Video Stories"):(lang==="ar"?"آراء الضيوف":"Guest Comments")}</button>)}
        </nav>
        <div className="testimonial-evidence-stage-main">
          {testimonialFocus===0?<>
            <button type="button" className="testimonial-feature-media" onClick={()=>setModal("testimonialVideo")} aria-label={`${lang==="ar"?"تشغيل":"Play"} ${testimonialVideo[lang]}`}><img src={testimonialVideo.poster} alt=""/><i/><b><Play/></b></button>
            <article className="testimonial-feature-copy"><h3>{testimonialVideo[lang]}</h3></article>
          </>:<>
            <button type="button" className="testimonial-feature-proof" onClick={()=>{setActiveTestimonial(testimonialFocus-1);setModal("testimonial")}} aria-label={lang==="ar"?"عرض الشهادة الأصلية":"View original testimonial"}><img src={testimonials[testimonialFocus-1].image} alt=""/><span>{lang==="ar"?"عرض الدليل الأصلي":"View original evidence"}</span></button>
            <article className="testimonial-feature-copy testimonial-feature-quote"><blockquote>«{testimonials[testimonialFocus-1].quote}»</blockquote><strong>{testimonials[testimonialFocus-1].name}</strong></article>
          </>}
        </div>
        <nav className="testimonial-evidence-rail" aria-label={lang==="ar"?"مكتبة الشهادات":"Testimonial library"}>
          {(testimonialFilter!=="comments")&&<button type="button" className={testimonialFocus===0?"is-active":""} onClick={()=>setTestimonialFocus(0)}><span><img src={testimonialVideo.poster} alt=""/><i><Play/></i></span><b>{testimonialVideo[lang]}</b></button>}
          {(testimonialFilter!=="video")&&testimonials.map((item,index)=><button type="button" className={testimonialFocus===index+1?"is-active":""} key={item.name} onClick={()=>setTestimonialFocus(index+1)}><span><img src={item.image} alt=""/><i>“</i></span><b>{item.name}</b></button>)}
        </nav>
      </div>}
    </section>

    <section className={`showcase-scene ${section==="videos"?"is-here":""}`} aria-labelledby="showcase-title">
      <header className="showcase-heading"><h2 id="showcase-title">{t.videos}</h2></header>
      <div className="showcase-library" onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setActiveShowcase(i=>(i+(delta<0?1:showcaseVideos.length-1))%showcaseVideos.length)}}>
        <button type="button" className="showcase-feature" onClick={()=>setModal("showcase")} aria-label={`${lang==="ar"?"تشغيل":"Play"} ${showcaseVideos[activeShowcase][lang]}`}>
          <img key={showcaseVideos[activeShowcase].poster} src={showcaseVideos[activeShowcase].poster} alt=""/>
          <span className="showcase-feature-shade"/>
          <span className="showcase-feature-play"><Play/></span>
          <span className="showcase-feature-copy"><strong>{showcaseVideos[activeShowcase][lang]}</strong></span>
        </button>
        <nav className="showcase-filmstrip" aria-label={lang==="ar"?"اختيار الفيلم":"Select a film"}>
          <button type="button" className="showcase-strip-arrow showcase-strip-prev" onClick={()=>setActiveShowcase(i=>(i+showcaseVideos.length-1)%showcaseVideos.length)} aria-label={lang==="ar"?"الفيلم السابق":"Previous film"}><Chevron/></button>
          <div className="showcase-strip-track" ref={showcaseStripRef}>
            {showcaseVideos.map((video,index)=><button type="button" className={`showcase-strip-card ${index===activeShowcase?"is-active":""}`} key={video.src} onClick={()=>setActiveShowcase(index)} aria-pressed={index===activeShowcase} style={{"--showcase-index":index} as React.CSSProperties}>
              <span><img src={video.poster} alt=""/><i/></span><strong>{video[lang]}</strong>
            </button>)}
          </div>
          <button type="button" className="showcase-strip-arrow showcase-strip-next" onClick={()=>setActiveShowcase(i=>(i+1)%showcaseVideos.length)} aria-label={lang==="ar"?"الفيلم التالي":"Next film"}><Chevron/></button>
        </nav>
      </div>
    </section>

    <section className={`team-scene ${section==="team"?"is-here":""}`} aria-labelledby="leadership-title">
      <header className="leadership-heading"><h2 id="leadership-title">{t.teamTitle}</h2><p>{lang==="ar"?"خبرات قيادية تقود منظومة الضيافة برؤية واضحة ومسؤولية راسخة.":"Experienced leaders guiding the hospitality system with clarity, accountability and purpose."}</p><i/></header>
      <div className="leadership-grid">
        {managedLeadership.map((leader,index)=><article tabIndex={0} className={`leader-card ${index===0?"leader-card--primary":""}`} key={leader.en.name} style={{"--leader-index":index} as React.CSSProperties}>
          <div className="leader-portrait"><span/><img src={leader.image} alt={leader[lang].name}/></div>
          <div className="leader-copy"><h3>{leader[lang].name}</h3><p>{leader[lang].role}</p></div>
        </article>)}
      </div>
    </section>

    <section className={`hospitality-scene ${section==="hospitality"?"is-here":""}`} aria-labelledby="hospitality-title">
      <header className="hospitality-heading"><small>{lang==="ar"?"منظومة الضيافة المتكاملة":"INTEGRATED HOSPITALITY SYSTEM"}</small><h2 id="hospitality-title">{t.hospitalityTitle}</h2><p>{lang==="ar"?"أربع مراحل تشغيلية، وأحد عشر قطاعًا متكاملًا، وتجربة ضيف واحدة مترابطة.":"Four operational stages. Eleven integrated sectors. One seamless guest experience."}</p></header>
      <div className="hospitality-phase-rail" role="tablist" aria-label={lang==="ar"?"مراحل رحلة الضيافة":"Hospitality journey phases"}>
        {hospitalityPhases.map((phase,index)=><button type="button" role="tab" aria-selected={activeHospitalityPhase===index} className={activeHospitalityPhase===index?"is-active":""} key={phase.en} onClick={()=>setActiveHospitalityPhase(index)}><span>{phase[lang]}</span></button>)}
      </div>
      <div className="journey-map" role="list" aria-live="polite">
        {hospitalityPhases[activeHospitalityPhase].indices.map((stageIndex,position)=>{const stage=managedStages[stageIndex];return <button type="button" role="listitem" className="journey-stage" key={stage.ar} style={{"--stage-index":position} as React.CSSProperties} onClick={()=>{setActiveHospitality(stageIndex);if(stageIndex===2)setActiveReception(0);if(stageIndex===9)setActiveControlObservation(0);setModal("hospitality")}}>
          <span className="journey-node"><Arrow/></span><strong>{stage[lang]}</strong><p>{hospitalityValue[stageIndex][lang]}</p>
        </button>})}
      </div>
    </section>

    <section className={`package-scene ${selected?"is-here":""}`}>
      {selected&&<motion.div className={`package-dashboard package-dashboard--${selected}`} initial={reduceMotion?false:{opacity:0,x:selected===1?64:selected===3?-64:0,scale:.975}} animate={{opacity:1,x:0,scale:1}} transition={{duration:reduceMotion?.01:.72,ease:[.16,1,.3,1]}}><div className="giant-index">{managedPacks[selected].no}</div><button className="back-button" onClick={()=>transition(()=>setSelected(null))}><Arrow/><span>{t.back}</span></button>
        <div className="package-title"><span dir="ltr">0{selected} / 03</span><h2>{managedPacks[selected][lang]}</h2><p>{lang==="ar"?(selected===1?"عناية استثنائية في كل محطة":selected===2?"راحة متقدمة طوال الرحلة":"خدمة موثوقة تلبي الاحتياج"):(selected===1?"Exceptional care at every stage":selected===2?"Elevated comfort throughout the journey":"Trusted service designed around every need")}</p><i/></div>
        <div className="experience-picks">
          <motion.div className="pick-motion-shell" initial={false} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?.01:.58,delay:reduceMotion?0:.04,ease:[.16,1,.3,1]}}><button type="button" className="experience-pick video-pick" onClick={()=>setModal("video")}><motion.span layoutId={`package-video-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="pick-media"><img src={`${MEDIA_BASE}/media/level-${selected}/services-poster.jpg`} alt=""/><i className="liquid"/><Play/></motion.span><span className="pick-copy"><strong>{t.services.split("\n").map(x=><span key={x}>{x}</span>)}</strong><em>{lang==="ar"?"استكشف التجربة":"Explore experience"}<Arrow/></em></span></button></motion.div>
          <motion.div className="pick-motion-shell" initial={reduceMotion?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?.01:.58,delay:reduceMotion?0:.11,ease:[.16,1,.3,1]}}><button type="button" className="experience-pick gallery-pick" onClick={()=>{setSlide(0);setModal("gallery")}}><motion.span layoutId={`package-gallery-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="pick-media"><img src={`${MEDIA_BASE}/media/brand/background-poster.jpg`} alt=""/><i className="liquid"/><Frames/></motion.span><span className="pick-copy"><strong>{t.journey.split("\n").map(x=><span key={x}>{x}</span>)}</strong><em>{lang==="ar"?"استعرض الرحلة":"View journey"}<Arrow/></em></span></button></motion.div>
          <motion.div className="pick-motion-shell" initial={reduceMotion?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?.01:.58,delay:reduceMotion?0:.18,ease:[.16,1,.3,1]}}><button type="button" className="experience-pick details-pick" onClick={()=>setModal("details")}><motion.span layoutId={`package-details-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="pick-media"><img src={`${MEDIA_BASE}/media/level-${selected}/services-poster.jpg`} alt=""/><i className="liquid"/><DetailsIcon/></motion.span><span className="pick-copy"><strong>{t.details.split("\n").map(x=><span key={x}>{x}</span>)}</strong><em>{lang==="ar"?"اعرف المزيد":"Learn more"}<Arrow/></em></span></button></motion.div>
        </div>
        <div className="package-orbit"><span/><span/><span/></div>
      </motion.div>}
    </section>

    {modal==="video"&&<div className={`cinema modal-layer ${selected?"cinema--video":""}`} role="dialog" aria-modal="true">{selected?<><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/><span className="cinema-video-light cinema-video-light-a"/><span className="cinema-video-light cinema-video-light-b"/></div><div className="video-screen-stage"><motion.div layoutId={`package-video-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="video-screen-frame"><video key={`services-${selected}`} className="services-video" src={`${MEDIA_BASE}/media/level-${selected}/services.mp4`} poster={`${MEDIA_BASE}/media/level-${selected}/services-poster.jpg`} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></motion.div><span className="video-screen-shadow"/></div></>:<><div className="cinema-rings"><i/><i/><i/></div><div className="cinema-copy"><span>PLAY FILM — 0{selected}</span><h3>{t.video}</h3><p>{t.videoNote}</p><button><Play/></button></div><div className="cinema-time">00:00 <i/> 02:45</div></>}</div>}
    {modal==="testimonial"&&<div className="testimonial-evidence-modal modal-layer" role="dialog" aria-modal="true" aria-label="الشهادة الأصلية" dir="rtl" onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setActiveTestimonial(i=>(i+(delta<0?1:testimonials.length-1))%testimonials.length)}}><div className="testimonial-evidence-stage"><div className="testimonial-evidence-copy"><span>شهادة موثقة</span><blockquote>«{testimonials[activeTestimonial].quote}»</blockquote><strong>{testimonials[activeTestimonial].name}</strong><a href={facebookPost} target="_blank" rel="noreferrer">عرض المنشور الأصلي <Arrow/></a></div><figure><img src={testimonials[activeTestimonial].image} alt={`تعليق ${testimonials[activeTestimonial].name} على فيسبوك`}/></figure></div><nav className="testimonial-evidence-nav"><button type="button" onClick={()=>setActiveTestimonial(i=>(i+testimonials.length-1)%testimonials.length)} aria-label="الشهادة السابقة"><Arrow/></button><b>{String(activeTestimonial+1).padStart(2,"0")} / {String(testimonials.length).padStart(2,"0")}</b><button type="button" onClick={()=>setActiveTestimonial(i=>(i+1)%testimonials.length)} aria-label="الشهادة التالية"><Arrow/></button></nav></div>}
    {modal==="testimonialVideo"&&<div className="cinema cinema--video showcase-modal modal-layer" role="dialog" aria-modal="true" aria-label={testimonialVideo[lang]}><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video className="services-video" src={testimonialVideo.src} poster={testimonialVideo.poster} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><h3 className="showcase-video-title">{testimonialVideo[lang]}</h3><span className="video-screen-shadow"/></div></div>}\n    {modal==="gallery"&&<div className={`gallery modal-layer ${hasLevelOneArabic?"gallery--real":""} ${rtl?"gallery--rtl":"gallery--ltr"}`} role="dialog" aria-modal="true" onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setSlide(s=>(s+(delta<0?1:galleryTotal-1))%galleryTotal)}}>
      {hasLevelOneArabic&&<div className="gallery-video-bg" aria-hidden="true"><video className="video-panorama" src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="video-overlay"/><span className="video-light video-light-a"/><span className="video-light video-light-b"/></div>}
      
      <div className="gallery-number">{String(slide+1).padStart(2,"0")}</div>
      <div className="screen-stage"><motion.div layoutId={`package-gallery-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="gallery-frame"><div className="gallery-art">{hasLevelOneArabic?<img key={slide} className="journey-slide" src={`${MEDIA_BASE}/media/level-1/ar/${String(slide+1).padStart(2,"0")}.webp`} alt={`رحلة حجاج بشرى الضيافة - صفحة ${slide+1}`} draggable={false}/>:<><Logo/><span>{managedPacks[selected??1][lang]}</span></>}</div><div className="gallery-caption"><small>{String(slide+1).padStart(2,"0")} {t.of} {galleryTotal}</small><h3>{hasLevelOneArabic?"رحلة حجاج بشرى الضيافة":t.image}</h3></div></motion.div><span className="screen-shadow"/></div>
      <div className="gallery-nav"><button onClick={()=>setSlide(s=>(s+galleryTotal-1)%galleryTotal)}><Arrow/></button><i><em style={{width:`${((slide+1)/galleryTotal)*100}%`}}/></i><b>{String(slide+1).padStart(2,"0")} / {galleryTotal}</b><button onClick={()=>setSlide(s=>(s+1)%galleryTotal)}><Arrow/></button></div>
    </div>}

    {modal==="details"&&<div className="cinema details-modal modal-layer" role="dialog" aria-modal="true"><div className="cinema-rings"><i/><i/><i/></div><motion.div layoutId={`package-details-${selected}`} transition={{layout:{duration:reduceMotion?.01:.68,ease:[.16,1,.3,1]}}} className="cinema-copy details-copy"><span>0{selected} / 03</span><DetailsIcon/><h3>{t.details.replace("\n"," ")}</h3><p>{t.soon}</p></motion.div></div>}
    {modal==="showcase"&&<div className="cinema cinema--video showcase-modal modal-layer" role="dialog" aria-modal="true" aria-label={showcaseVideos[activeShowcase][lang]}><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video key={showcaseVideos[activeShowcase].src} className="services-video" src={showcaseVideos[activeShowcase].src} poster={showcaseVideos[activeShowcase].poster} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><h3 className="showcase-video-title">{showcaseVideos[activeShowcase][lang]}</h3><span className="video-screen-shadow"/></div></div>}

    {modal==="comprehensive"&&<div className="comprehensive-modal modal-layer" role="dialog" aria-modal="true" aria-label={lang==="ar"?"الباقة الشاملة":"Comprehensive Package"} data-phase={comprehensivePhase} data-selected={activeComprehensive??"none"}>
      <img className="comprehensive-backdrop" src="/media/brand/comprehensive-package-cover.webp" alt=""/>
      <div className="comprehensive-shade"/>
      <div className="comprehensive-living-globe" aria-hidden="true"><i className="comprehensive-globe-grid"/><i className="comprehensive-globe-orbit comprehensive-globe-orbit--one"/><i className="comprehensive-globe-orbit comprehensive-globe-orbit--two"/><b/><b/><b/></div>
      <div className="comprehensive-ambient" aria-hidden="true"><i/><i/><i/></div>
      <header className="comprehensive-heading">
        <h2>{lang==="ar"?"الباقة الشاملة":"COMPREHENSIVE PACKAGE"}</h2>
        <small>{lang==="ar"?"رحلة ضيافة متكاملة":"AN INTEGRATED HOSPITALITY JOURNEY"}</small>
        <div className="comprehensive-intro"><p>{lang==="ar"?"من الوصول حتى اكتمال الرحلة — منظومة واحدة ترافق ضيف الرحمن في كل محطة.":"From arrival to journey completion — one connected system accompanying every pilgrim at every stage."}</p><span>{lang==="ar"?"اختر إحدى محطات الرحلة لاستكشافها":"Select a journey stage to explore"}</span></div>
      </header>
      <div className="comprehensive-orbit" role="list" aria-label={lang==="ar"?"خدمات الباقة الشاملة":"Comprehensive package services"}>
        {comprehensiveServices.map((service,index)=><button type="button" role="listitem" key={service.icon} className={activeComprehensive===index?"is-active":""} style={{"--service-index":index} as React.CSSProperties} onClick={()=>selectComprehensiveService(index)} aria-pressed={activeComprehensive===index} aria-label={service[lang].title}><i className="comprehensive-service-aura"/><i className="comprehensive-service-glyph"><ComprehensiveServiceIcon kind={service.icon}/></i><span>{service[lang].title}</span></button>)}
      </div>
      {activeComprehensive!==null&&<aside className={`comprehensive-service-reveal ${comprehensivePhase==="panel"?"is-visible":""}`} style={{"--panel-left":comprehensivePanelPositions[activeComprehensive].left,"--panel-top":comprehensivePanelPositions[activeComprehensive].top} as React.CSSProperties} dir={lang==="ar"?"rtl":"ltr"} aria-live="polite"><i className="comprehensive-reveal-icon"><ComprehensiveServiceIcon kind={comprehensiveServices[activeComprehensive].icon}/></i><small>{lang==="ar"?"محطة من الرحلة المتكاملة":"INTEGRATED JOURNEY STAGE"}</small><b>{comprehensiveServices[activeComprehensive][lang].title}</b><p>{comprehensiveServices[activeComprehensive][lang].description}</p><em>{comprehensiveServices[activeComprehensive][lang].value}</em></aside>}
      <p className="comprehensive-status" aria-live="polite">{comprehensivePhase==="activating"?(lang==="ar"?"جاري تفعيل الخدمة المختارة":"Activating selected service"):""}</p>
    </div>}

    {modal==="trust"&&<div className="trust-book-modal modal-layer" role="dialog" aria-modal="true" aria-label="شواهد الثقة" dir="rtl" data-turn={trustTurn} onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)turnTrust(delta<0?"prev":"next")}}>
      <div className="gallery-video-bg" aria-hidden="true"><video className="video-panorama" src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="video-overlay"/><span className="video-light video-light-a"/><span className="video-light video-light-b"/></div>
      <header className="trust-book-heading"><small>{lang==="ar"?"سجل الإنجاز والاعتماد":"ACHIEVEMENT & CREDENTIALS"}</small><h2>{t.trustTitle}</h2></header>
      <div className={`trust-book-stage ${activeTrust===0||activeTrust===trustSlideCount-1?"is-cover":"is-spread"}`} key={`${activeTrust}-${trustTurn}`}>
        <div className="trust-book" aria-live="polite">
          {!compactBook&&activeTrust>0&&activeTrust<trustSlideCount-1&&<figure className="trust-book-page trust-book-page--left"><img src={`${MEDIA_BASE}/media/trust/trust-slide-${activeTrust+2}.jpg`} alt={`شواهد الثقة - الصفحة ${activeTrust+2}`} draggable={false}/><span>{String(activeTrust+2).padStart(2,"0")}</span></figure>}
          <figure className="trust-book-page trust-book-page--right"><img src={`${MEDIA_BASE}/media/trust/trust-slide-${activeTrust+1}.jpg`} alt={`شواهد الثقة - الصفحة ${activeTrust+1}`} draggable={false}/><span>{String(activeTrust+1).padStart(2,"0")}</span></figure>
          {activeTrust===0&&<button type="button" className="trust-book-video" onClick={()=>setModal("trustVideo")} aria-label={lang==="ar"?"تشغيل فيديو نتائج تقييم وزارة الحج والعمرة":"Play Ministry of Hajj and Umrah evaluation results"}><span><img src="/media/trust/ministry-evaluation-results-poster.webp" alt=""/><i><Play/></i></span><strong>{lang==="ar"?"نتائج تقييم وزارة الحج والعمرة":"Ministry Evaluation Results"}</strong><em>{lang==="ar"?"شاهد الدليل المرئي":"WATCH EVIDENCE"}</em></button>}
          <i className="trust-book-spine" aria-hidden="true"/>
        </div>
        <span className="trust-book-shadow" aria-hidden="true"/>
      </div>
      <div className="trust-book-nav"><button onClick={()=>turnTrust("prev")} aria-label={lang==="ar"?"الصفحات السابقة":"Previous pages"}><Chevron/></button><i><em style={{width:`${((activeTrust+1)/trustSlideCount)*100}%`}}/></i><b>{!compactBook&&activeTrust>0&&activeTrust<trustSlideCount-1?`${String(activeTrust+1).padStart(2,"0")}–${String(activeTrust+2).padStart(2,"0")}`:String(activeTrust+1).padStart(2,"0")} / {String(trustSlideCount).padStart(2,"0")}</b><button onClick={()=>turnTrust("next")} aria-label={lang==="ar"?"الصفحات التالية":"Next pages"}><Chevron/></button></div>
    </div>}

    {modal==="trustVideo"&&<div className="cinema cinema--video showcase-modal trust-video-modal modal-layer" role="dialog" aria-modal="true" aria-label={lang==="ar"?"نتائج تقييم وزارة الحج والعمرة":"Ministry of Hajj and Umrah evaluation results"}><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video className="services-video" src="/media/trust/ministry-evaluation-results.mp4" poster="/media/trust/ministry-evaluation-results-poster.webp" controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><h3 className="showcase-video-title">{lang==="ar"?"نتائج تقييم وزارة الحج والعمرة":"Ministry of Hajj and Umrah Evaluation Results"}</h3><span className="video-screen-shadow"/></div></div>}

    {modal==="meeting"&&<div className="meeting-presentation-modal modal-layer" role="dialog" aria-modal="true" aria-label={lang==="ar"?"عرض اللقاء التنسيقي الأول":"First coordination meeting presentation"} onClick={()=>setModal(null)} onTouchStart={event=>touchStart.current=event.changedTouches[0].clientX} onTouchEnd={event=>{const delta=event.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setMeetingSlide(index=>(index+(delta<0?1:meetingSlides.length-1))%meetingSlides.length)}}><div className="meeting-cover-stage" onClick={event=>event.stopPropagation()}>{meetingSlides[meetingSlide].kind==="readiness"?<MeetingReadinessSlide key={`readiness-${lang}`} lang={lang}/>:<img key={meetingSlides[meetingSlide].src} className="meeting-slide-image" src={meetingSlides[meetingSlide].src} alt={lang==="ar"?meetingSlides[meetingSlide].altAr:meetingSlides[meetingSlide].altEn}/>}<button type="button" className="meeting-slide-arrow meeting-slide-arrow--next" onClick={()=>setMeetingSlide(index=>(index+1)%meetingSlides.length)} aria-label={lang==="ar"?"الشريحة التالية":"Next slide"}><Chevron/></button><button type="button" className="meeting-slide-arrow meeting-slide-arrow--previous" onClick={()=>setMeetingSlide(index=>(index+meetingSlides.length-1)%meetingSlides.length)} aria-label={lang==="ar"?"الشريحة السابقة":"Previous slide"}><Chevron/></button><span className="meeting-slide-count">{String(meetingSlide+1).padStart(2,"0")} / {String(meetingSlides.length).padStart(2,"0")}</span><span className="meeting-cover-shadow"/></div></div>}

    {modal==="hospitality"&&managedStages[activeHospitality]&&(activeHospitality===9?<div className="gallery gallery--real control-observation-gallery modal-layer" role="dialog" aria-modal="true" aria-label={managedStages[activeHospitality][lang]} dir={rtl?"rtl":"ltr"} onTouchStart={e=>touchStart.current=e.changedTouches[0].clientX} onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(delta)>45)setActiveControlObservation(i=>(i+(delta<0?1:controlObservationSlideCount-1))%controlObservationSlideCount)}}><div className="gallery-video-bg" aria-hidden="true"><video className="video-panorama" src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="video-overlay"/><span className="video-light video-light-a"/><span className="video-light video-light-b"/></div><div className="gallery-number">{String(activeControlObservation+1).padStart(2,"0")}</div><div className="screen-stage"><div className="gallery-frame"><div className="gallery-art"><img key={activeControlObservation} className="journey-slide control-observation-slide" src={`/media/hospitality/control-observation/${String(activeControlObservation+1).padStart(2,"0")}.webp`} alt={`${managedStages[activeHospitality][lang]} - ${lang==="ar"?"صورة":"image"} ${activeControlObservation+1}`} draggable={false}/></div><div className="gallery-caption"><small>{String(activeControlObservation+1).padStart(2,"0")} {t.of} {controlObservationSlideCount}</small><h3>{managedStages[activeHospitality][lang]}</h3></div></div><span className="screen-shadow"/></div><div className="gallery-nav"><button onClick={()=>setActiveControlObservation(i=>(i+controlObservationSlideCount-1)%controlObservationSlideCount)} aria-label={lang==="ar"?"الصورة السابقة":"Previous image"}><Arrow/></button><i><em style={{width:`${((activeControlObservation+1)/controlObservationSlideCount)*100}%`}}/></i><b>{String(activeControlObservation+1).padStart(2,"0")} / {String(controlObservationSlideCount).padStart(2,"0")}</b><button onClick={()=>setActiveControlObservation(i=>(i+1)%controlObservationSlideCount)} aria-label={lang==="ar"?"الصورة التالية":"Next image"}><Arrow/></button></div></div>:activeHospitality===2?<div className="cinema cinema--video hospitality-modal hospitality-modal--reception modal-layer" role="dialog" aria-modal="true" aria-label={managedStages[activeHospitality][lang]}><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video key={receptionVideos[activeReception].src} className="services-video" src={receptionVideos[activeReception].src} poster={receptionVideos[activeReception].poster} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/><span className="reception-video-count">{String(activeReception+1).padStart(2,"0")} / {String(receptionVideos.length).padStart(2,"0")}</span><button type="button" className="reception-video-arrow reception-video-prev" onClick={()=>setActiveReception(i=>(i+receptionVideos.length-1)%receptionVideos.length)} aria-label={lang==="ar"?"الفيديو السابق":"Previous video"}><Arrow/></button><button type="button" className="reception-video-arrow reception-video-next" onClick={()=>setActiveReception(i=>(i+1)%receptionVideos.length)} aria-label={lang==="ar"?"الفيديو التالي":"Next video"}><Arrow/></button></div><h3 className="showcase-video-title">{receptionVideos[activeReception][lang]}</h3><span className="video-screen-shadow"/></div></div>:(activeHospitality<=1||activeHospitality===3)?<div className="cinema cinema--video hospitality-modal modal-layer" role="dialog" aria-modal="true" aria-label={activeHospitality===0?"بطاقة نسك لرحلة أيسر":managedStages[activeHospitality][lang]}><div className="cinema-video-bg" aria-hidden="true"><video src={`${MEDIA_BASE}/media/brand/background-video2.mp4`} poster={`${MEDIA_BASE}/media/brand/background-poster.jpg`} muted playsInline preload="metadata"/><div className="cinema-video-overlay"/></div><div className="video-screen-stage"><div className="video-screen-frame"><video key={`hospitality-${activeHospitality}`} className="services-video" src={[`${MEDIA_BASE}/media/hospitality/nusuk-card.mp4`,`${MEDIA_BASE}/media/hospitality/makkah-accommodation-v2.mp4`,"",`${MEDIA_BASE}/media/hospitality/transportation.mp4`][activeHospitality]} poster={[`${MEDIA_BASE}/media/hospitality/nusuk-card-poster.jpg`,`${MEDIA_BASE}/media/hospitality/makkah-accommodation-v2-poster.jpg`,"",`${MEDIA_BASE}/media/hospitality/transportation-poster.jpg`][activeHospitality]} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video><div className="video-vignette"/></div><h3 className="showcase-video-title">{activeHospitality===0?"بطاقة نسك لرحلة أيسر":managedStages[activeHospitality][lang]}</h3><span className="video-screen-shadow"/></div></div>:<div className="cinema hospitality-modal modal-layer" role="dialog" aria-modal="true" aria-label={managedStages[activeHospitality][lang]}><div className="cinema-rings"><i/><i/><i/></div><div className="hospitality-modal-copy"><span>{String(activeHospitality+1).padStart(2,"0")} / {managedStages.length}</span><div className="hospitality-modal-icon">{managedStages[activeHospitality].kind==="video"?<Play/>:<Frames/>}</div><h3>{managedStages[activeHospitality][lang]}</h3><p>{managedStages[activeHospitality].kind==="video"?t.videoMedia:t.galleryMedia} · {t.soon}</p></div></div>)}

    {modal==="qr"&&<div className="qr-modal modal-layer" role="dialog" aria-modal="true" aria-label={lang==="ar"?"رمز رابط العرض":"Presentation QR code"}><div className="qr-card"><small>{lang==="ar"?"افتح العرض على جهاز آخر":"OPEN ON ANOTHER DEVICE"}</small><h3>{lang==="ar"?"امسح الرمز للمتابعة":"Scan to continue"}</h3>{qrUrl&&<img src={qrUrl} alt={lang==="ar"?"رمز رابط العرض":"Presentation link QR code"}/>}<p dir="ltr">{location.href}</p></div></div>}

    <nav className="page-step-nav global-step-nav" aria-label={rtl?"التنقل بين الصفحات":"Page navigation"}>
      <div className="utility-row" dir={rtl?"rtl":"ltr"}><button type="button" className="utility-step utility-step--back" onClick={navigateBack} disabled={!canNavigateBack} aria-label={rtl?"العودة إلى الشاشة السابقة":"Back to previous screen"}><BackIcon/></button><button type="button" className="utility-step" onClick={goHome} aria-label={rtl?"العودة إلى الصفحة الرئيسية":"Go to homepage"}><HomeIcon/></button><button type="button" className="utility-step utility-step--language" onClick={()=>setLang(current=>current==="ar"?"en":"ar")} aria-label={lang==="ar"?"Switch to English":"التبديل إلى العربية"}><span>{lang==="ar"?"EN":"ع"}</span></button><button type="button" className="utility-step" onClick={toggleFullscreen} aria-label={isFullscreen?(rtl?"الخروج من ملء الشاشة":"Exit full screen"):(rtl?"عرض بملء الشاشة":"Enter full screen")}><FullscreenIcon active={isFullscreen}/></button><button type="button" className="utility-step" onClick={refreshPresentation} aria-label={rtl?"تحديث العرض":"Refresh presentation"}><RefreshIcon/></button><button type="button" className="utility-step" onClick={()=>setModal("qr")} aria-label={lang==="ar"?"عرض رمز الاستجابة السريعة":"Show QR code"}><QrIcon/></button><button type="button" className="utility-step utility-step--close" onClick={()=>modal==="trustVideo"?setModal("trust"):modal?setModal(null):goHome()} aria-label={modal==="trustVideo"?(lang==="ar"?"العودة إلى شواهد الثقة":"Return to Evidence of Trust"):modal?t.close:(rtl?"العودة للرئيسية":"Return home")}>×</button></div>
    </nav>

    <div className={`page-transition-logo ${transitioning?"is-visible":""}`} aria-hidden="true"><div><span/><DrawLogo/></div></div>
    <div className={`loader ${loading?"show":""}`}><div className="loader-stage"><div className="logo-draw-wrap"><span className="logo-aura"/><DrawLogo/></div></div></div>
  </main>
}
