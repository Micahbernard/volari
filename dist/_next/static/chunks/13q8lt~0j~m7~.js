(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,21675,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(74080);let i="volari-theme";function n(){let e=document.documentElement;e.style.removeProperty("--flip-ox"),e.style.removeProperty("--flip-oy")}let a=null,s=null,l=(0,r.createContext)(null);e.s(["FLIP_DURATION_MS",0,1500,"default",0,function({children:e}){let[c,u]=(0,r.useState)("void"),[d,p]=(0,r.useState)(!1),f=(0,r.useRef)(!1),m=(0,r.useRef)(null);(0,r.useEffect)(()=>{let e=document.documentElement.getAttribute("data-theme");if("day"===e||"void"===e)u(e);else{let e="day"===sessionStorage.getItem(i)?"day":"void";document.documentElement.setAttribute("data-theme",e),u(e)}},[]);let h=(0,r.useCallback)(e=>{if(f.current)return;f.current=!0;let t="void"===c?"day":"void",r=e=>{document.documentElement.setAttribute("data-theme",t),s?.(t,e),(0,o.flushSync)(()=>{u(t)});try{sessionStorage.setItem(i,t)}catch{}};p(!0);let l=document.documentElement;if(e){let t=e.getBoundingClientRect(),r=t.left+t.width/2,o=t.top+t.height/2;l.style.setProperty("--flip-ox",`${r}px`),l.style.setProperty("--flip-oy",`${o}px`)}else l.style.setProperty("--flip-ox",`${window.innerWidth/2}px`),l.style.setProperty("--flip-oy",`${Math.min(96,.12*window.innerHeight)}px`);if("void"===t){document.documentElement.setAttribute("data-flip-direction","set");let l=e?e.getBoundingClientRect().left+e.getBoundingClientRect().width/2:window.innerWidth/2,c=e?e.getBoundingClientRect().top+e.getBoundingClientRect().height/2:Math.min(96,.12*window.innerHeight),d=a;if(!d){r(!1),document.documentElement.removeAttribute("data-flip-direction"),n(),p(!1),f.current=!1;return}let{peak:m,finished:h}=d(l,c);s?.(t,!1),m.then(()=>{document.documentElement.setAttribute("data-theme",t),(0,o.flushSync)(()=>{u(t)});try{sessionStorage.setItem(i,t)}catch{}}),h.then(()=>{document.documentElement.removeAttribute("data-flip-direction"),n(),p(!1),f.current=!1});return}let d=function(){if("u"<typeof document)return null;let e=document.startViewTransition;return"function"==typeof e?e.bind(document):null}();if(d){document.documentElement.setAttribute("data-flip-direction","rise");let e=d(()=>r(!0)),t=()=>{n(),document.documentElement.removeAttribute("data-flip-direction"),p(!1),f.current=!1};e.finished.then(t,t)}else document.documentElement.setAttribute("data-flip-direction","rise"),document.body.classList.add("theme-flipping"),r(!1),m.current&&clearTimeout(m.current),m.current=setTimeout(()=>{document.body.classList.remove("theme-flipping"),document.documentElement.removeAttribute("data-flip-direction"),n(),p(!1),f.current=!1},1500)},[c]);return(0,r.useEffect)(()=>()=>{m.current&&clearTimeout(m.current)},[]),(0,t.jsx)(l.Provider,{value:{theme:c,toggleTheme:h,isFlipping:d},children:e})},"registerShaderFlip",0,function(e){return s=e,()=>{s===e&&(s=null)}},"registerShadowConsume",0,function(e){return a=e,()=>{a===e&&(a=null)}},"useTheme",0,function(){let e=(0,r.useContext)(l);if(!e)throw Error("useTheme must be used within <ThemeProvider>");return e}])},62438,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(89970);e.s(["default",0,function(){let e=(0,r.useRef)(null),i=(0,r.useRef)(null),n=(0,r.useRef)(null),a=(0,r.useRef)(null),s=(0,r.useRef)(null),l=(0,r.useRef)(null),c=(0,r.useRef)(!1),u=(0,r.useCallback)(()=>{let t=e.current,r=i.current,c=n.current,u=a.current,d=s.current,p=l.current;if(!t||!r||!c||!u||!d||!p)return;let f=(e,t)=>({x:o.gsap.quickTo(e,"x",{duration:t,ease:"power3.out"}),y:o.gsap.quickTo(e,"y",{duration:t,ease:"power3.out"})}),m=f(d,.12),h=f(t,.2),v=f(r,.32),x=f(c,.48),g=f(u,.22),y=f(p,.6),b=0,w=0,j=performance.now(),k=!1,C=0,R=0,M=!1,T=()=>({sx:1,sy:1,rot:0,tsx:1,tsy:1,trot:0}),P=T(),E=T(),S=T(),L=e=>{let t=performance.now();if(k){let r=Math.max(1,t-j),o=e.clientX-b,i=e.clientY-w;C=.75*C+o/r*.25,R=.75*R+i/r*.25}else k=!0;b=e.clientX,w=e.clientY,j=t,m.x(e.clientX),m.y(e.clientY),h.x(e.clientX),h.y(e.clientY),v.x(e.clientX),v.y(e.clientY),x.x(e.clientX),x.y(e.clientY),g.x(e.clientX),g.y(e.clientY),y.x(e.clientX),y.y(e.clientY)},_=0,z=()=>{C*=.9,R*=.9;let e=Math.hypot(C,R),i=180*Math.atan2(R,C)/Math.PI,n=Math.min(1,e/2.5);for(let e of(M?(P.tsx=.55,P.tsy=.55,P.trot=0,E.tsx=.7,E.tsy=.7,E.trot=0,S.tsx=.85,S.tsy=.85,S.trot=0):(P.tsx=1+1.2*n,P.tsy=1-.2*n,P.trot=i,E.tsx=1+1.8*n,E.tsy=1-.3*n,E.trot=i,S.tsx=1+2.6*n,S.tsy=1-.4*n,S.trot=i),[P,E,S])){e.sx+=(e.tsx-e.sx)*.16,e.sy+=(e.tsy-e.sy)*.16;let t=e.trot-e.rot;for(;t>180;)t-=360;for(;t<-180;)t+=360;e.rot+=.16*t}o.gsap.set(t,{scaleX:P.sx,scaleY:P.sy,rotation:P.rot}),o.gsap.set(r,{scaleX:E.sx,scaleY:E.sy,rotation:E.rot}),o.gsap.set(c,{scaleX:S.sx,scaleY:S.sy,rotation:S.rot}),_=requestAnimationFrame(z)};_=requestAnimationFrame(z);let N=e=>{let i=e.currentTarget.getAttribute("data-cursor-label");M=!0,o.gsap.to(t,{opacity:.5,duration:.35,ease:"power3.out"}),o.gsap.to(r,{opacity:.35,duration:.35,ease:"power3.out"}),o.gsap.to(c,{opacity:.2,duration:.35,ease:"power3.out"}),o.gsap.to(u,{opacity:1,scale:1,duration:.4,ease:"power3.out"}),o.gsap.to(d,{scale:.2,opacity:1,duration:.4,ease:"power3.out"}),i&&(p.textContent=i,o.gsap.to(p,{opacity:1,scale:1,duration:.35,ease:"power2.out"}))},F=()=>{M=!1,o.gsap.to(t,{opacity:.75,duration:.45,ease:"power3.out"}),o.gsap.to(r,{opacity:.5,duration:.45,ease:"power3.out"}),o.gsap.to(c,{opacity:.3,duration:.45,ease:"power3.out"}),o.gsap.to(u,{opacity:0,scale:.7,duration:.35,ease:"power2.in"}),o.gsap.to(d,{scale:.5,opacity:.72,duration:.4,ease:"power3.out"}),o.gsap.to(p,{opacity:0,scale:.8,duration:.25,ease:"power2.in"})},O=e=>{let t=e.currentTarget,r=t.getBoundingClientRect(),i=r.left+r.width/2,n=r.top+r.height/2,a=e.clientX-i,s=e.clientY-n;o.gsap.to(t,{x:.3*a,y:.3*s,duration:.4,ease:"power2.out"})},A=e=>{o.gsap.to(e.currentTarget,{x:0,y:0,duration:.6,ease:"elastic.out(1, 0.4)"})},$="a, button, [data-cursor-hover], [data-cursor-label]",B="[data-cursor-magnetic]",D=()=>{document.querySelectorAll($).forEach(e=>{e.addEventListener("mouseenter",N),e.addEventListener("mouseleave",F)}),document.querySelectorAll(B).forEach(e=>{e.addEventListener("mousemove",O),e.addEventListener("mouseleave",A)})},I=()=>{document.querySelectorAll($).forEach(e=>{e.removeEventListener("mouseenter",N),e.removeEventListener("mouseleave",F)}),document.querySelectorAll(B).forEach(e=>{e.removeEventListener("mousemove",O),e.removeEventListener("mouseleave",A)})};window.addEventListener("mousemove",L,{passive:!0}),D();let q=new MutationObserver(()=>{I(),D()});return q.observe(document.body,{childList:!0,subtree:!0}),()=>{cancelAnimationFrame(_),window.removeEventListener("mousemove",L),I(),q.disconnect()}},[]);(0,r.useEffect)(()=>{if(!window.matchMedia("(pointer: fine)").matches)return;c.current=!0,[e,i,n,s].map(e=>e.current).forEach(e=>e&&o.gsap.set(e,{opacity:0})),s.current&&o.gsap.set(s.current,{scale:.5}),a.current&&o.gsap.set(a.current,{opacity:0,scale:.7});let t=()=>{o.gsap.to(e.current,{opacity:.75,duration:.5}),o.gsap.to(i.current,{opacity:.5,duration:.6}),o.gsap.to(n.current,{opacity:.3,duration:.8}),o.gsap.to(s.current,{opacity:.72,duration:.4}),window.removeEventListener("mousemove",t)};window.addEventListener("mousemove",t,{once:!0});let r=u();return()=>{window.removeEventListener("mousemove",t),r?.()}},[u]);let d=e=>`radial-gradient(closest-side, color-mix(in srgb, var(--cursor-veil-core) ${100*e}%, transparent) 0%, color-mix(in srgb, var(--cursor-veil-mid) ${50*e}%, transparent) 38%, var(--cursor-veil-edge) 72%)`;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{ref:n,className:"cursor-veil pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block",style:{width:80,height:80,marginLeft:-40,marginTop:-40,borderRadius:"50%",background:d(.22),filter:"blur(6px)",willChange:"transform, opacity",opacity:0},"aria-hidden":"true"}),(0,t.jsx)("div",{ref:i,className:"cursor-veil pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block",style:{width:56,height:56,marginLeft:-28,marginTop:-28,borderRadius:"50%",background:d(.32),filter:"blur(3px)",willChange:"transform, opacity",opacity:0},"aria-hidden":"true"}),(0,t.jsx)("div",{ref:e,className:"cursor-veil pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block",style:{width:36,height:36,marginLeft:-18,marginTop:-18,borderRadius:"50%",background:d(.5),filter:"blur(1.5px)",willChange:"transform, opacity",opacity:0},"aria-hidden":"true"}),(0,t.jsx)("div",{ref:a,className:"pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block",style:{width:44,height:44,marginLeft:-22,marginTop:-22,borderRadius:"50%",border:"1px solid var(--cursor-ring-line)",boxShadow:"0 0 14px var(--cursor-ring-shadow)",willChange:"transform, opacity",opacity:0},"aria-hidden":"true"}),(0,t.jsx)("span",{ref:l,className:"pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block font-[family-name:var(--font-geist-mono)] text-[8px] uppercase tracking-[0.25em] text-v-chalk opacity-0",style:{marginLeft:20,marginTop:-24,willChange:"transform",transform:"scale(0.8)"},"aria-hidden":"true",children:""}),(0,t.jsx)("div",{ref:s,className:"pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block",style:{width:12,height:12,marginLeft:-6,marginTop:-6,borderRadius:"50%",backgroundColor:"var(--v-accent)",willChange:"transform",transform:"scale(0.5)"},"aria-hidden":"true"})]})}])},95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let n=e.r(90809)._(e.r(98183)),a=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,o=e.protocol||"",i=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let u=e.search||l&&`?${l}`||"";return o&&!o.endsWith(":")&&(o+=":"),e.slashes||(!o||a.test(o))&&!1!==c?(c="//"+(c||""),i&&"/"!==i[0]&&(i="/"+i)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),u&&"?"!==u[0]&&(u="?"+u),i=i.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${o}${c}${i}${u}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let o=e.r(71645);function i(e,t){let r=(0,o.useRef)(null),i=(0,o.useRef)(null);return(0,o.useCallback)(o=>{if(null===o){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=n(e,o)),t&&(i.current=n(t,o))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return n}});let o=e.r(18967),i=e.r(52817);function n(e){if(!(0,o.isAbsoluteUrl)(e))return!0;try{let t=(0,o.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return o}});let o=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={default:function(){return x},useLinkStatus:function(){return y}};for(var i in o)Object.defineProperty(r,i,{enumerable:!0,get:o[i]});let n=e.r(90809),a=e.r(43476),s=n._(e.r(71645)),l=e.r(95057),c=e.r(8372),u=e.r(18581),d=e.r(18967),p=e.r(5550);e.r(33525);let f=e.r(88540),m=e.r(91949),h=e.r(73668),v=e.r(9396);function x(t){var r,o;let i,n,x,[y,b]=(0,s.useOptimistic)(m.IDLE_LINK_STATUS),w=(0,s.useRef)(null),{href:j,as:k,children:C,prefetch:R=null,passHref:M,replace:T,shallow:P,scroll:E,onClick:S,onMouseEnter:L,onTouchStart:_,legacyBehavior:z=!1,onNavigate:N,transitionTypes:F,ref:O,unstable_dynamicOnHover:A,...$}=t;i=C,z&&("string"==typeof i||"number"==typeof i)&&(i=(0,a.jsx)("a",{children:i}));let B=s.default.useContext(c.AppRouterContext),D=!1!==R,I=!1!==R?null===(o=R)||"auto"===o?v.FetchStrategy.PPR:v.FetchStrategy.Full:v.FetchStrategy.PPR,q="string"==typeof(r=k||j)?r:(0,l.formatUrl)(r);if(z){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=s.default.Children.only(i)}let U=z?n&&"object"==typeof n&&n.ref:O,W=s.default.useCallback(e=>(null!==B&&(w.current=(0,m.mountLinkInstance)(e,q,B,I,D,b)),()=>{w.current&&((0,m.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,m.unmountPrefetchableInstance)(e)}),[D,q,B,I,b]),X={ref:(0,u.useMergedRef)(W,U),onClick(t){z||"function"!=typeof S||S(t),z&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!B||t.defaultPrevented||function(t,r,o,i,n,a,l){if("u">typeof window){let c,{nodeName:u}=t.currentTarget;if("A"===u.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),a){let e=!1;if(a({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);s.default.startTransition(()=>{d(r,i?"replace":"push",!1===n?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,o.current,l)})}}(t,q,w,T,E,N,F)},onMouseEnter(e){z||"function"!=typeof L||L(e),z&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),B&&D&&(0,m.onNavigationIntent)(e.currentTarget,!0===A)},onTouchStart:function(e){z||"function"!=typeof _||_(e),z&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),B&&D&&(0,m.onNavigationIntent)(e.currentTarget,!0===A)}};return(0,d.isAbsoluteUrl)(q)?X.href=q:z&&!M&&("a"!==n.type||"href"in n.props)||(X.href=(0,p.addBasePath)(q)),x=z?s.default.cloneElement(n,X):(0,a.jsx)("a",{...$,...X,children:i}),(0,a.jsx)(g.Provider,{value:y,children:x})}e.r(84508);let g=(0,s.createContext)(m.IDLE_LINK_STATUS),y=()=>(0,s.useContext)(g);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},45678,e=>{"use strict";var t=e.i(43476),r=e.i(22016),o=e.i(71645),i=e.i(89970),n=e.i(83495),a=e.i(69316),s=e.i(21675);let l=[{n:"01",label:"About",href:"#about",cursorLabel:"Read"},{n:"02",label:"Services",href:"#services",cursorLabel:"Explore"},{n:"03",label:"Studio",href:"#studio",cursorLabel:"Method"},{n:"04",label:"Contact",href:"#contact",cursorLabel:"Connect"}];function c({onClose:e}){let r=(0,o.useRef)(null),n=(0,o.useRef)(null),a=(0,o.useRef)(null),s=(0,o.useRef)(null),u=(0,o.useRef)(null),d=(0,o.useRef)([]),p=(0,o.useRef)(null);(0,o.useEffect)(()=>{let t=u.current;t?.focus();let r=t=>{"Escape"===t.key&&e()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[e]),(0,o.useEffect)(()=>{let e=n.current,t=a.current,r=s.current,o=d.current.filter(Boolean),l=p.current,c=i.gsap.timeline({defaults:{ease:"power3.out"}});return e&&c.fromTo(e,{opacity:0},{opacity:1,duration:.45},0),t&&c.fromTo(t,{scaleX:0,transformOrigin:"center center"},{scaleX:1,duration:.95,ease:"expo.out"},.08),o.length&&c.fromTo(o,{y:40,opacity:0},{y:0,opacity:1,duration:.55,stagger:.065,ease:"power3.out"},.12),l&&c.fromTo(l,{opacity:0,y:12},{opacity:1,y:0,duration:.5},.35),r&&c.fromTo(r,{scaleX:0,transformOrigin:"center center"},{scaleX:1,duration:.85,ease:"expo.out"},.25),()=>{c.kill()}},[]);let f=e=>t=>{d.current[e]=t};return(0,t.jsxs)("div",{ref:r,id:"site-menu",role:"dialog","aria-modal":"true","aria-labelledby":"site-menu-title",className:"fixed inset-0 z-[55] flex flex-col","data-lenis-prevent":!0,children:[(0,t.jsx)("div",{ref:n,className:"absolute inset-0 bg-v-black/86 backdrop-blur-md opacity-0","aria-hidden":!0}),(0,t.jsxs)("div",{className:"relative z-10 flex min-h-0 flex-1 flex-col px-6 pt-8 pb-10 sm:px-10 md:px-16",children:[(0,t.jsx)("div",{className:"flex items-start justify-end",children:(0,t.jsxs)("button",{ref:u,type:"button","data-close":!0,onClick:e,className:"group flex items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.35em] text-v-silver transition-colors hover:text-v-chalk focus-visible:text-v-chalk focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-v-accent/60",children:[(0,t.jsx)("span",{className:"h-px w-8 bg-v-smoke transition-colors group-hover:bg-v-chalk"}),"Close"]})}),(0,t.jsx)("div",{className:"mt-10 flex justify-center px-2",children:(0,t.jsx)("div",{ref:a,className:"h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-v-smoke/55 to-transparent",style:{transform:"scaleX(0)"}})}),(0,t.jsxs)("nav",{className:"flex flex-1 flex-col justify-center py-12","aria-label":"Primary",children:[(0,t.jsx)("h2",{id:"site-menu-title",className:"sr-only",children:"Site navigation"}),(0,t.jsxs)("ul",{className:"mx-auto flex w-full max-w-2xl flex-col gap-2 sm:gap-3 md:gap-4",children:[l.map((r,o)=>(0,t.jsx)("li",{children:(0,t.jsxs)("a",{ref:f(o),href:r.href,onClick:e,"data-cursor-magnetic":!0,"data-cursor-label":r.cursorLabel,className:"group flex items-baseline gap-6 border-b border-v-smoke/15 py-4 opacity-0 transition-colors hover:border-v-accent/30 md:gap-10 md:py-5",children:[(0,t.jsx)("span",{className:"font-[family-name:var(--font-geist-mono)] text-[10px] tabular-nums tracking-[0.25em] text-v-smoke/70",children:r.n}),(0,t.jsx)("span",{className:"font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,3rem)] font-normal tracking-[-0.03em] text-v-chalk transition-colors group-hover:text-v-white",children:r.label})]})},r.href)),(0,t.jsx)("li",{children:(0,t.jsxs)("a",{ref:f(l.length),href:"#contact",onClick:e,"data-cursor-magnetic":!0,"data-cursor-label":"Let's talk",className:"group flex items-baseline gap-6 border-b border-v-accent/25 py-4 opacity-0 transition-colors hover:border-v-accent md:gap-10 md:py-5",children:[(0,t.jsx)("span",{className:"font-[family-name:var(--font-geist-mono)] text-[10px] tabular-nums tracking-[0.25em] text-v-accent/80",children:"—"}),(0,t.jsx)("span",{className:"font-[family-name:var(--font-playfair)] text-[clamp(1.75rem,6vw,3rem)] font-normal italic tracking-[-0.03em] text-v-accent transition-colors group-hover:text-v-chalk",children:"Inquire"})]})})]})]}),(0,t.jsxs)("div",{ref:p,className:"mt-auto flex flex-col items-center gap-4 border-t border-v-smoke/20 pt-8 opacity-0 sm:flex-row sm:justify-between",children:[(0,t.jsx)("span",{className:"font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.45em] text-v-smoke",children:"Est. 2024"}),(0,t.jsx)("a",{href:"mailto:hello@volari.studio",className:"font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.12em] text-v-silver transition-colors hover:text-v-chalk",children:"hello@volari.studio"})]}),(0,t.jsx)("div",{className:"mt-8 flex justify-center",children:(0,t.jsx)("div",{ref:s,className:"h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-v-smoke/40 to-transparent",style:{transform:"scaleX(0)"}})})]})]})}function u({ref:e,isOpen:r=!1,onToggle:i,className:n="",onPointerEnter:a,onPointerLeave:s,onPointerMove:l,onFocus:c,onBlur:d,...p}){let[f,m]=(0,o.useState)(!1),[h,v]=(0,o.useState)("rest"),x=(0,o.useRef)(0),g=(0,o.useRef)(0),y=(0,o.useRef)(0),b=(0,o.useRef)(0),w=(0,o.useRef)(0),j=(0,o.useRef)(0),[k,C]=(0,o.useState)(0),[R,M]=(0,o.useState)(0),[T,P]=(0,o.useState)(0),[E,S]=(0,o.useState)(!1),L=(0,o.useRef)(null),_=(0,o.useRef)(null),z=(0,o.useRef)(null),N=(0,o.useCallback)(()=>{[L,_,z].forEach(e=>{e.current&&(clearTimeout(e.current),e.current=null)})},[]);(0,o.useEffect)(()=>()=>N(),[N]);let F=(0,o.useCallback)(()=>{N(),v("enter"),g.current=1,L.current=setTimeout(()=>{v("active"),L.current=null},500)},[N]),O=(0,o.useCallback)(()=>{N(),g.current=0,_.current=setTimeout(()=>{v("exit"),_.current=null,z.current=setTimeout(()=>{v("rest"),z.current=null},420)},280)},[N]),A=(0,o.useCallback)(()=>{[_,z].forEach(e=>{e.current&&(clearTimeout(e.current),e.current=null)})},[]),$=(0,o.useCallback)(e=>{m(!0),"rest"===h?F():(A(),"exit"===h&&v("active")),a?.(e)},[h,F,A,a]),B=(0,o.useCallback)(e=>{m(!1),("active"===h||"enter"===h)&&O(),s?.(e)},[h,O,s]),D=(0,o.useCallback)(e=>{m(!0),"rest"===h||"exit"===h?F():A(),c?.(e)},[h,F,A,c]),I=(0,o.useCallback)(e=>{m(!1),("active"===h||"enter"===h)&&O(),d?.(e)},[h,O,d]),q=(0,o.useCallback)(()=>{i?.(!r)},[r,i]),U="rest"!==h,W=(0,o.useCallback)(()=>{let e=g.current-x.current;y.current+=.0018*e,y.current*=.92,y.current=Math.max(-.0045,Math.min(.0045,y.current)),x.current+=y.current,Math.abs(y.current)>1e-4&&(x.current+=8e-5*Math.sin(2.2*b.current)*Math.sign(y.current)),x.current=Math.max(0,Math.min(1,x.current));let t=Math.abs(y.current)>5e-5||Math.abs(e)>.001;S(t),!t&&.001>Math.abs(e)&&(x.current=g.current,y.current=0),b.current+=.009,C(x.current),M(b.current),k>.02&&(w.current+=.0018,w.current>1.15&&(w.current=-.15),P(w.current)),j.current=requestAnimationFrame(W)},[k]);function X(e){let t=e-24;if(Math.abs(t)>22)return{left:24,right:24};let r=Math.sqrt(484-t*t);return{left:24-r,right:24+r}}(0,o.useEffect)(()=>(j.current=requestAnimationFrame(W),()=>cancelAnimationFrame(j.current)),[W]);let G=(()=>{if(k<.005)return"";let e=46-44*k,t=E?2+1.5*k:.8+.5*k,r="M 24 46 ";for(let t=0;t<=60;t++){let o=46-t/60*(46-e),i=X(o);r+=`L ${i.left.toFixed(1)} ${o.toFixed(1)} `}let o=X(e),i=[];for(let r=0;r<=80;r++){let n=r/80,a=o.left+n*(o.right-o.left),s=e+(Math.sin(n*Math.PI*4+1.2*R)*t+Math.sin(n*Math.PI*7+1.9*R+1.2)*t*.35+Math.sin(n*Math.PI*2+.7*R+2.5)*t*.2)*Math.sin(n*Math.PI);i.push([a,s])}r+=`L ${i[0][0].toFixed(1)} ${i[0][1].toFixed(1)} `;for(let e=1;e<i.length-1;e++){let t=i[e][0],o=i[e][1],n=(i[e][0]+i[e+1][0])/2,a=(i[e][1]+i[e+1][1])/2;r+=`Q ${t.toFixed(1)} ${o.toFixed(1)} ${n.toFixed(1)} ${a.toFixed(1)} `}let n=i[i.length-1];r+=`L ${n[0].toFixed(1)} ${n[1].toFixed(1)} `;for(let t=60;t>=0;t--){let o=46-t/60*(46-e),i=X(o);r+=`L ${i.right.toFixed(1)} ${o.toFixed(1)} `}return r+"Z"})(),Y=(()=>{if(k<.01)return"";let e=46-44*k,t=X(e);if(t.right-t.left<4)return"";let r=E?1.6:.6,o="";for(let i=0;i<=50;i++){let n=i/50,a=t.left+n*(t.right-t.left),s=e+Math.sin(n*Math.PI*4+1.2*R+.5)*r*Math.sin(n*Math.PI);o+=(0===i?"M":"L")+` ${a.toFixed(1)} ${s.toFixed(1)} `}return o})(),V=(()=>{if(k<.08)return[];let e=46-44*k,t=[],r=Math.floor(6*k)+1;for(let o=0;o<r;o++){let r=97.3*o+13,i=.5*Math.sin(r)+.5,n=X(e+3),a=n.left+i*(n.right-n.left),s=e+2+2*Math.sin(R*(.6+.2*o)+r);t.push({cx:a+1.5*Math.sin(.4*R+r),cy:s,r:1.2+.5*Math.sin(3.1*r),opacity:(.4+.2*Math.sin(.8*R+r))*k})}return t})(),H=(()=>{if(k<.03)return null;let e=46-44*k,t=46-T*(46-e);if(t<e-5||t>51)return null;X(t);let r=t-6,o=t+6,i=X(r),n=X(o);return{d:`M ${n.left.toFixed(1)} ${o.toFixed(1)} L ${i.left.toFixed(1)} ${r.toFixed(1)} L ${i.right.toFixed(1)} ${r.toFixed(1)} L ${n.right.toFixed(1)} ${o.toFixed(1)} Z`,centerY:t}})(),K=18+14*Math.sin(.4*R),Z=34-22*k*.5;return(0,t.jsxs)("button",{...p,ref:e,"data-state":r?"open":U?"hover":"rest","data-phase":h,type:"button","aria-label":p["aria-label"]??(r?"Close menu":"Open menu"),"aria-expanded":r,onClick:q,onPointerEnter:$,onPointerLeave:B,onFocus:D,onBlur:I,className:["lens-button group/lens relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full outline-none cursor-pointer select-none touch-manipulation bg-[var(--v-void)] border border-[rgba(55,55,62,0.28)] transition-colors duration-500 hover:border-[rgba(100,100,110,0.45)] overflow-visible",n].join(" "),children:[!U&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{"aria-hidden":"true",className:"pointer-events-none absolute inset-0 rounded-full motion-reduce:hidden",style:{animation:"silver-heartbeat 3.2s ease-out infinite",border:"1.5px solid rgba(185,185,200,0.40)"}}),(0,t.jsx)("span",{"aria-hidden":"true",className:"pointer-events-none absolute inset-0 rounded-full motion-reduce:hidden",style:{animation:"silver-heartbeat 3.2s ease-out 1.06s infinite",border:"1px solid rgba(165,165,182,0.22)"}})]}),U&&(0,t.jsx)("span",{"aria-hidden":"true",className:"pointer-events-none absolute inset-[-2px] rounded-full opacity-100",style:{boxShadow:"inset 0 0 18px rgba(200,200,212,0.30), 0 0 24px 4px rgba(200,200,212,0.22)"}}),U&&(0,t.jsx)("span",{"aria-hidden":"true",className:"pointer-events-none absolute inset-[-3px] rounded-full opacity-50",style:{boxShadow:"0 0 28px 8px var(--accent-glow-soft)"}}),(0,t.jsxs)("svg",{viewBox:"0 0 48 48",className:"absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden rounded-full",preserveAspectRatio:"xMidYMid slice","aria-hidden":"true",children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"mBody",x1:"20%",y1:"100%",x2:"80%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#3a3a48"}),(0,t.jsx)("stop",{offset:"15%",stopColor:"#5a5a6e"}),(0,t.jsx)("stop",{offset:"30%",stopColor:"#8a8aa0"}),(0,t.jsx)("stop",{offset:"45%",stopColor:"#b8b8cc"}),(0,t.jsx)("stop",{offset:"60%",stopColor:"#d8d8e8"}),(0,t.jsx)("stop",{offset:"75%",stopColor:"#c0c0d4"}),(0,t.jsx)("stop",{offset:"90%",stopColor:"#e4e4f0"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#f0f0fa"})]}),(0,t.jsxs)("linearGradient",{id:"mDeep",x1:"0%",y1:"100%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#1a1a2e"}),(0,t.jsx)("stop",{offset:"20%",stopColor:"#2e2e44"}),(0,t.jsx)("stop",{offset:"40%",stopColor:"#4a4a66"}),(0,t.jsx)("stop",{offset:"60%",stopColor:"#7a7a98"}),(0,t.jsx)("stop",{offset:"80%",stopColor:"#a8a8c4"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#d0d0e4"})]}),(0,t.jsxs)("radialGradient",{id:"mSpec",cx:"50%",cy:"50%",r:"50%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#ffffff",stopOpacity:"0.95"}),(0,t.jsx)("stop",{offset:"30%",stopColor:"#e8e8f8",stopOpacity:"0.6"}),(0,t.jsx)("stop",{offset:"60%",stopColor:"#b0b0cc",stopOpacity:"0.2"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#686880",stopOpacity:"0"})]}),(0,t.jsxs)("radialGradient",{id:"mSpecCool",cx:"50%",cy:"50%",r:"50%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#c8c8e8",stopOpacity:"0.5"}),(0,t.jsx)("stop",{offset:"40%",stopColor:"#9090b0",stopOpacity:"0.2"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#50506a",stopOpacity:"0"})]}),(0,t.jsxs)("linearGradient",{id:"mSurface",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#a0a0b8"}),(0,t.jsx)("stop",{offset:"15%",stopColor:"#d0d0e4"}),(0,t.jsx)("stop",{offset:"30%",stopColor:"#f0f0ff"}),(0,t.jsx)("stop",{offset:"50%",stopColor:"#ffffff"}),(0,t.jsx)("stop",{offset:"70%",stopColor:"#f0f0ff"}),(0,t.jsx)("stop",{offset:"85%",stopColor:"#d0d0e4"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#a0a0b8"})]}),(0,t.jsxs)("radialGradient",{id:"mDrop",cx:"35%",cy:"30%",r:"65%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#ffffff",stopOpacity:"0.9"}),(0,t.jsx)("stop",{offset:"25%",stopColor:"#d8d8ec",stopOpacity:"0.7"}),(0,t.jsx)("stop",{offset:"60%",stopColor:"#8888a4",stopOpacity:"0.5"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#3a3a50",stopOpacity:"0.3"})]}),(0,t.jsxs)("linearGradient",{id:"shimmerGrad",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#e0e0f0",stopOpacity:"0"}),(0,t.jsx)("stop",{offset:"25%",stopColor:"#e8e8f8",stopOpacity:"0.6"}),(0,t.jsx)("stop",{offset:"50%",stopColor:"#f4f4ff",stopOpacity:"0.9"}),(0,t.jsx)("stop",{offset:"75%",stopColor:"#e8e8f8",stopOpacity:"0.6"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#e0e0f0",stopOpacity:"0"})]}),(0,t.jsxs)("filter",{id:"mGlow",x:"-15%",y:"-15%",width:"130%",height:"130%",children:[(0,t.jsx)("feGaussianBlur",{in:"SourceAlpha",stdDeviation:"4",result:"b"}),(0,t.jsx)("feFlood",{floodColor:"#b0b0d0",floodOpacity:.4*(k>.1),result:"c"}),(0,t.jsx)("feComposite",{in:"c",in2:"b",operator:"in",result:"g"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"g"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]}),(0,t.jsxs)("filter",{id:"specBloom",x:"-50%",y:"-50%",width:"200%",height:"200%",children:[(0,t.jsx)("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"6",result:"b"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"b"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]}),(0,t.jsx)("filter",{id:"softBlur",children:(0,t.jsx)("feGaussianBlur",{stdDeviation:"0.3"})}),(0,t.jsxs)("filter",{id:"shimmerBlur",x:"-20%",y:"-10%",width:"140%",height:"120%",children:[(0,t.jsx)("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"2",result:"b"}),(0,t.jsxs)("feMerge",{children:[(0,t.jsx)("feMergeNode",{in:"b"}),(0,t.jsx)("feMergeNode",{in:"SourceGraphic"})]})]}),(0,t.jsx)("clipPath",{id:"circleClip",children:(0,t.jsx)("circle",{cx:"24",cy:"24",r:"22"})})]}),"rest"===h&&(0,t.jsx)("g",{className:"lens-ghost",children:(0,t.jsx)("circle",{cx:"24",cy:"24",r:"19",fill:"var(--v-smoke)",fillOpacity:"0.10"})}),(0,t.jsxs)("g",{clipPath:"url(#circleClip)",children:[G&&(0,t.jsxs)("g",{filter:k>.08?"url(#mGlow)":"none",children:[(0,t.jsx)("path",{d:G,fill:"url(#mDeep)",opacity:.325}),(0,t.jsx)("path",{d:G,fill:"url(#mBody)",opacity:.5}),k>.12&&(0,t.jsx)("ellipse",{cx:K,cy:Z,rx:25+15*k,ry:18+10*k,fill:"url(#mSpec)",opacity:.55,filter:"url(#specBloom)"}),k>.2&&(0,t.jsx)("ellipse",{cx:K+6,cy:Z-3,rx:18,ry:12,fill:"url(#mSpecCool)",opacity:.3}),H&&k>.03&&(0,t.jsx)("path",{d:H.d,fill:"url(#shimmerGrad)",opacity:.35,filter:"url(#shimmerBlur)"})]}),Y&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("path",{d:Y,fill:"none",stroke:"#d8d8f0",strokeWidth:"6",strokeLinecap:"round",opacity:.15*k}),(0,t.jsx)("path",{d:Y,fill:"none",stroke:"url(#mSurface)",strokeWidth:"2.5",strokeLinecap:"round",opacity:.9*k}),(0,t.jsx)("path",{d:Y,fill:"none",stroke:"#ffffff",strokeWidth:"0.8",strokeLinecap:"round",opacity:.5*k})]}),V.map((e,r)=>(0,t.jsx)("circle",{cx:e.cx,cy:e.cy,r:e.r,fill:"url(#mDrop)",opacity:e.opacity},`drop-${r}`)),k>.05&&(0,t.jsxs)("g",{clipPath:"url(#circleClip)",children:[(0,t.jsxs)("circle",{r:"2",fill:"none",stroke:"#c0c0d8",strokeWidth:"0.5",filter:"url(#softBlur)",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"3.5s",repeatCount:"indefinite",path:"M 24 46 L 24 24 L 24 4"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.7;0.7;0",dur:"3.5s",repeatCount:"indefinite"}),(0,t.jsx)("animate",{attributeName:"r",values:"2;1.5;2.4;2",dur:"3.5s",repeatCount:"indefinite"})]}),(0,t.jsxs)("circle",{r:"1.5",fill:"none",stroke:"#d0d0e4",strokeWidth:"0.4",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"4s",repeatCount:"indefinite",begin:"0.6s",path:"M 24 46 L 12 30 L 8 8"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.6;0.6;0",dur:"4s",repeatCount:"indefinite",begin:"0.6s"})]}),(0,t.jsxs)("circle",{r:"1.2",fill:"none",stroke:"#b0b0c8",strokeWidth:"0.35",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"3s",repeatCount:"indefinite",begin:"1.2s",path:"M 24 46 L 36 30 L 40 8"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.55;0.55;0",dur:"3s",repeatCount:"indefinite",begin:"1.2s"})]}),(0,t.jsxs)("circle",{r:"0.8",fill:"#d8d8ec",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"2.6s",repeatCount:"indefinite",begin:"1.8s",path:"M 22 44 L 18 22 L 16 6"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.45;0.45;0",dur:"2.6s",repeatCount:"indefinite",begin:"1.8s"})]}),(0,t.jsxs)("circle",{r:"2.8",fill:"#a0a0bc",filter:"url(#softBlur)",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"4.5s",repeatCount:"indefinite",path:"M 24 46 L 24 28 L 24 10"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.6;0.5;0",dur:"4.5s",repeatCount:"indefinite"})]}),(0,t.jsxs)("circle",{r:"0.7",fill:"#c8c8e0",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"2.2s",repeatCount:"indefinite",path:"M 20 42 L 10 26 L 6 10"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.4;0.4;0",dur:"2.2s",repeatCount:"indefinite"})]}),(0,t.jsxs)("circle",{r:"0.7",fill:"#c8c8e0",opacity:"0",children:[(0,t.jsx)("animateMotion",{dur:"2.2s",repeatCount:"indefinite",begin:"0.4s",path:"M 28 42 L 38 26 L 42 10"}),(0,t.jsx)("animate",{attributeName:"opacity",values:"0;0.4;0.4;0",dur:"2.2s",repeatCount:"indefinite",begin:"0.4s"})]})]})]}),(0,t.jsx)("circle",{cx:"24",cy:"24",r:"21",fill:"none",stroke:"var(--v-smoke)",strokeWidth:"0.5",strokeOpacity:"0.22"})]}),(0,t.jsx)("svg",{viewBox:"0 0 48 48",className:"relative h-full w-full","aria-hidden":"true",style:{zIndex:10},children:(0,t.jsxs)("g",{style:{transformOrigin:"24px 24px",transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1)"},transform:r?"rotate(45)":"rotate(0)",children:[(0,t.jsx)("circle",{cx:"24",cy:"24",r:r?11:3.5,fill:"none",stroke:"var(--v-chalk)",strokeWidth:"1.2",strokeLinecap:"round",style:{transition:"r 0.5s cubic-bezier(0.22,1,0.36,1)"}}),(0,t.jsx)("line",{x1:"18",y1:"18",x2:"30",y2:"30",stroke:"var(--v-chalk)",strokeWidth:"1.2",strokeLinecap:"round",style:{opacity:+!!r,transition:"opacity 0.4s ease-out"}}),(0,t.jsx)("line",{x1:"30",y1:"18",x2:"18",y2:"30",stroke:"var(--v-chalk)",strokeWidth:"1.2",strokeLinecap:"round",style:{opacity:+!!r,transition:"opacity 0.4s ease-out"}})]})})]})}i.gsap.registerPlugin(n.ScrollTrigger),e.s(["default",0,function(){let e=(0,a.useLenis)(),{theme:l,toggleTheme:d}=(0,s.useTheme)(),[p,f]=(0,o.useState)(!1),m=(0,o.useRef)(null),h=(0,o.useRef)(null),v=(0,o.useRef)(null),x=(0,o.useRef)(null),g=(0,o.useRef)(p);return(0,o.useEffect)(()=>{g.current=p},[p]),(0,o.useEffect)(()=>{e&&(p?e.stop():e.start())},[e,p]),(0,o.useEffect)(()=>{let e=m.current;if(!e)return;let t=i.gsap.context(()=>{let t=i.gsap.timeline({defaults:{ease:"power4.out"},delay:2});h.current&&t.fromTo(h.current,{clipPath:"inset(0 100% 0 0)",opacity:0},{clipPath:"inset(0 0% 0 0)",opacity:1,duration:1},0),v.current&&t.fromTo(v.current,{y:-18,opacity:0},{y:0,opacity:1,duration:.85,ease:"power3.out"},.2),x.current&&t.fromTo(x.current,{scaleX:0,transformOrigin:"left center"},{scaleX:1,duration:1.2,ease:"expo.out"},.1);let r=-1;n.ScrollTrigger.create({start:"top -80",end:"max",onUpdate:t=>{let o=t.direction;g.current||o!==r&&(r=o,1===o?i.gsap.to(e,{y:"-100%",duration:.5,ease:"power3.inOut"}):i.gsap.to(e,{y:"0%",duration:.4,ease:"power3.out"}))}}),n.ScrollTrigger.create({start:"top -100",onEnter:()=>e.classList.add("nav-scrolled"),onLeaveBack:()=>e.classList.remove("nav-scrolled")})});return()=>t.revert()},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("nav",{ref:m,className:"nav-viewport-inset fixed top-0 right-0 left-0 z-50 box-border transition-[backdrop-filter,background-color] duration-500",style:{willChange:"transform"},children:[(0,t.jsxs)("div",{className:"mx-auto flex h-[var(--header-height)] w-full max-w-[90rem] items-center justify-between",children:[(0,t.jsxs)("div",{ref:h,className:"relative inline-flex min-w-0 shrink-0 items-center gap-3 opacity-0 sm:gap-3.5",children:[(0,t.jsxs)("button",{type:"button",onClick:e=>d(e.currentTarget),"data-cursor-magnetic":!0,"data-cursor-label":"void"===l?"Daybreak":"Nightfall","aria-label":"void"===l?"Switch to daybreak theme":"Switch to void theme",className:"group/crest relative block h-9 w-9 shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-v-accent/50 sm:h-10 sm:w-10",children:[(0,t.jsxs)("svg",{viewBox:"0 0 40 40",className:"absolute inset-0 h-full w-full overflow-visible",fill:"none","aria-hidden":!0,children:[(0,t.jsx)("polygon",{points:"20,2 36,11 36,29 20,38 4,29 4,11",stroke:"currentColor",strokeWidth:"1",className:"text-v-smoke/45 transition-[color,filter] duration-500 group-hover/crest:text-v-accent group-hover/crest:[filter:drop-shadow(0_0_6px_var(--accent-glow-strong))]"}),(0,t.jsx)("polygon",{points:"20,7 31,13.5 31,26.5 20,33 9,26.5 9,13.5",stroke:"currentColor",strokeWidth:"0.5",className:"text-v-smoke/0 transition-[color] duration-500 group-hover/crest:text-v-accent/40"})]}),(0,t.jsx)("span",{"aria-hidden":!0,className:"absolute inset-0 flex items-center justify-center pb-[1px] font-[family-name:var(--font-playfair)] text-[1.35rem] leading-none tracking-[-0.02em] text-v-silver/85 sm:text-[1.5rem]",children:"V"}),(0,t.jsx)("span",{"aria-hidden":!0,className:"absolute inset-0 flex items-center justify-center pb-[1px] font-[family-name:var(--font-playfair)] text-[1.35rem] leading-none tracking-[-0.02em] text-v-accent transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover/crest:[clip-path:inset(0%_0_0_0)] sm:text-[1.5rem]",style:{textShadow:"0 0 8px var(--accent-glow-strong)"},children:"V"})]}),(0,t.jsxs)(r.default,{href:"/","data-cursor-magnetic":!0,"data-cursor-label":"Home",className:"group/logo flex min-w-0 flex-col items-start gap-[0.4rem]",children:[(0,t.jsx)("span",{className:"-ml-[2px] block font-[family-name:var(--font-playfair)] text-[1.75rem] leading-[0.95] tracking-[-0.035em] text-v-chalk sm:text-[2rem] md:text-[2.125rem]",children:"Volari"}),(0,t.jsxs)("span",{className:"flex items-center gap-2.5",children:[(0,t.jsx)("span",{className:"font-[family-name:var(--font-geist-mono)] text-[9px] uppercase leading-none tracking-[0.42em] text-v-silver/85 transition-[color] duration-500 group-hover/logo:text-v-chalk sm:text-[10px] sm:tracking-[0.48em]",children:"Studio"}),(0,t.jsx)("span",{"aria-hidden":!0,className:"h-[3px] w-[3px] rounded-full bg-v-smoke/50 transition-[background-color] duration-500 group-hover/logo:bg-v-accent"}),(0,t.jsxs)("span",{className:"relative inline-block font-[family-name:var(--font-geist-mono)] text-[8px] uppercase leading-none tracking-[0.35em] sm:text-[9px]",children:[(0,t.jsx)("span",{"aria-hidden":"void"!==l,className:`block text-v-silver/55 transition-[color] duration-500 group-hover/logo:text-v-silver/90 ${"void"===l?"opacity-100":"opacity-0"}`,children:"N°01"}),(0,t.jsx)("span",{"aria-hidden":"day"!==l,className:`absolute top-0 left-0 block text-v-accent/75 transition-[color] duration-500 group-hover/logo:text-v-accent ${"day"===l?"opacity-100":"opacity-0"}`,children:"N°02"})]})]})]})]}),(0,t.jsx)(u,{ref:v,isOpen:p,onToggle:()=>f(!0),"aria-controls":"site-menu","data-cursor-label":"Menu",className:"opacity-0"})]}),(0,t.jsx)("div",{ref:x,className:"h-px w-full bg-gradient-to-r from-transparent via-v-smoke/50 to-transparent",style:{transform:"scaleX(0)"}})]}),p?(0,t.jsx)(c,{onClose:()=>f(!1)}):null]})}],45678)},64177,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(75056),i=e.i(80931),n=e.i(39014),a=e.i(90072);let s=`
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  // Ripples — vec4(originX, originY[0..1, y-up], startTime, strength[0|1]).
  // 6 slots in a ring buffer; inactive slots carry strength=0.
  uniform vec4  uRipples[6];
  varying vec2  vUv;
  varying float vElevation;
  varying float vRipple;

  // ── Ripple field — concentric damped wave, stone-in-lake ──
  // age     : seconds since click
  // front   : expanding ring radius in aspect-corrected uv
  // env     : gaussian envelope around the ring front (wider → multi-crest visible)
  // phase   : sin oscillation inside envelope, frequency tuned so ~3 rings sit in band
  // decay   : time decay + lifetime falloff
  float rippleField(vec2 uvPos, float aspect, float time){
    float total = 0.0;
    for(int i=0; i<6; i++){
      vec4 r = uRipples[i];
      if(r.w < 0.5) continue;
      float age = time - r.z;
      if(age < 0.0 || age > 3.6) continue;
      vec2 ro = vec2((r.x - 0.5) * aspect, r.y - 0.5);
      vec2 pr = vec2((uvPos.x - 0.5) * aspect, uvPos.y - 0.5);
      float d = length(pr - ro);
      float front = age * 0.40;
      float env = exp(-pow((d - front) / 0.22, 2.0));
      float phase = d * 42.0 - age * 11.0;
      float decay = exp(-age * 0.75) * (1.0 - smoothstep(2.6, 3.6, age));
      total += cos(phase) * env * decay;
    }
    return total;
  }

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vUv=uv;
    float scroll=uScrollProgress;
    float tBase=uTime*0.036;
    float tRipple=uTime*0.054;
    vec3 pos=position;
    float n1=snoise(vec3(pos.xy*0.5,tBase+scroll*0.45))*0.16;
    float n2=snoise(vec3(pos.xy*1.6,tRipple*1.25+scroll*0.28))*0.05;
    vec2 mouse=(uMouse-0.5)*2.0;
    float mouseDist=length(pos.xy-mouse);
    float mousePush=smoothstep(1.4,0.0,mouseDist)*0.10;

    float aspect=uResolution.x/max(uResolution.y,1.0);
    float rip=rippleField(uv,aspect,uTime);
    vRipple=rip;

    float elevation=n1+n2+mousePush;

    // ── Edge pin ──
    // Plane vertices live on a perspective-projected mesh. Pushing Z
    // on edge vertices makes them recede visually in screen space,
    // tearing a wavy gap along the viewport border that exposes the
    // WebGL clear color behind the plane (reads as black in void, as
    // a torn-paper frame in day). Fix at the source: attenuate
    // elevation toward 0 in a thin band at each edge so border
    // vertices stay flush at Z=0. 0.06 uv units ≈ 6% inset — small
    // enough to be invisible, wide enough to hide per-vertex noise.
    float edgeDist=min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y));
    float edgePin=smoothstep(0.0,0.06,edgeDist);
    elevation*=edgePin;

    pos.z+=elevation;
    vElevation=elevation;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
  }
`,l=`
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScrollProgress;
  uniform vec2  uResolution;
  uniform vec4  uRipples[6];
  // Theme crossfade scalar: 0.0 = void (cool dark silver), 1.0 = day (warm cream).
  // Lerped toward its target by WebGLBackground each frame when the crest toggles.
  uniform float uFlip;
  // Theme flip “transition pass”: bell-shaped 0→1→0 over ~1.5s (see uTransitionDir).
  // Peaks mid-flip so distortion/noise reads as a handoff, not a permanent look.
  uniform float uTransitionWarp;
  // +1 = void→day (rise / dawn), −1 = day→void (set / nightfall).
  uniform float uTransitionDir;
  // Crest centre in UV space (bottom-up Y, same as uMouse) — radial warp + burst from here.
  uniform vec2  uTransitionOrigin;
  varying vec2  vUv;
  varying float vElevation;
  varying float vRipple;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p){
    float val=0.0;
    float amp=0.5;
    float frq=1.0;
    mat2 rot=mat2(cos(1.618),sin(1.618),-sin(1.618),cos(1.618));
    for(int i=0;i<6;i++){
      val+=amp*snoise(p*frq);
      p.xy*=rot;
      p.yz*=rot;
      frq*=2.0;
      amp*=0.5;
    }
    return val;
  }

  void main(){
    float aspect=uResolution.x/uResolution.y;
    float tw=uTransitionWarp;
    float td=uTransitionDir;
    vec2 uvw=vUv;
    vec2 wobble=vec2(
      snoise(vec3(vUv*6.0,uTime*0.2)),
      snoise(vec3(vUv*6.0+vec2(2.0),uTime*0.2))
    )*0.016*tw;
    // Radial warp from crest (matches CSS clip-path circle at --flip-ox/--flip-oy).
    vec2 uvRel=vUv-uTransitionOrigin;
    float rUV=length(uvRel)+1e-5;
    vec2 radial=uvRel/rUV;
    float ringPhase=rUV*28.0-uTime*2.4;
    vec2 radialWarp=radial*(
      sin(ringPhase)*0.012+sin(ringPhase*1.7+vUv.x*9.0)*0.006
    )*tw;
    vec2 voidPull=-radial*0.022*tw*max(-td,0.0);
    vec2 sunPush=radial*0.011*tw*max(td,0.0);
    uvw+=wobble+radialWarp+voidPull+sunPush;
    vec2 p=(uvw-0.5)*vec2(aspect,1.0);
    float scroll=uScrollProgress;

    float tSlow=uTime*0.032;
    float tRipple=uTime*0.048;

    vec2 scrollDrift=vec2(scroll*0.95,-scroll*0.62);
    vec2 ps=p+scrollDrift;

    float flowAngle=(uTime*0.011+scroll*0.35);
    mat2 rotFlow=mat2(cos(flowAngle),sin(flowAngle),-sin(flowAngle),cos(flowAngle));
    vec2 psr=rotFlow*ps;

    vec2 mouse=(uMouse-0.5)*vec2(aspect,1.0);
    float mouseProximity=1.0-smoothstep(0.0,0.32,length(p-mouse));

    float scScroll=scroll;
    vec2 q=vec2(
      fbm(vec3(psr*0.28,tSlow+scScroll*0.32)),
      fbm(vec3(psr*0.28+vec2(5.2,1.3),tSlow+scScroll*0.24))
    );
    vec2 r=vec2(
      fbm(vec3(psr*0.28+2.8*q+vec2(1.7,9.2),tSlow*0.7+scScroll*1.55)),
      fbm(vec3(psr*0.28+2.8*q+vec2(8.3,2.8),tRipple*0.88+scScroll*1.25))
    );
    float f=fbm(vec3(psr*0.28+2.0*r+vec2(mouseProximity*0.12),tRipple*0.42+scScroll*0.62));

    float burst=snoise(vec3(psr*8.0,uTime*0.55+td*0.6))
      *0.22*tw;
    f+=burst;

    // ── Theme palette ──
    // v_* = void (cool dark silver, features brighter than base)
    // d_* = day (warm cream, features darker/warmer than base — ink on paper semantics)
    // Each stop is lerped per-fragment via uFlip so the crossfade is smooth.
    vec3 v_l0=vec3(0.032, 0.033, 0.037);
    vec3 v_l1=vec3(0.068, 0.070, 0.079);
    vec3 v_l2=vec3(0.112, 0.117, 0.134);
    vec3 v_l3=vec3(0.150, 0.159, 0.187);
    vec3 v_l4=vec3(0.185, 0.197, 0.232);

    vec3 d_l0=vec3(0.949, 0.925, 0.882);
    vec3 d_l1=vec3(0.910, 0.870, 0.792);
    vec3 d_l2=vec3(0.855, 0.790, 0.670);
    vec3 d_l3=vec3(0.780, 0.675, 0.498);
    vec3 d_l4=vec3(0.680, 0.545, 0.340);

    vec3 l0=mix(v_l0,d_l0,uFlip);
    vec3 l1=mix(v_l1,d_l1,uFlip);
    vec3 l2=mix(v_l2,d_l2,uFlip);
    vec3 l3=mix(v_l3,d_l3,uFlip);
    vec3 l4=mix(v_l4,d_l4,uFlip);

    vec3 col=l0;
    col=mix(col,l1,smoothstep(-0.45,0.55,f)*0.92);
    col=mix(col,l2,smoothstep(-0.1,0.72,f)*0.78);

    float crest=smoothstep(0.05,0.85,f)*smoothstep(0.10,0.75,length(q));
    float peak=smoothstep(0.40,0.95,f*length(r));

    float breatheCrest=0.94+0.06*sin(uTime*0.15);
    float breathePeak=0.96+0.04*sin(uTime*0.11+1.7);

    col=mix(col,l3,crest*0.55*breatheCrest);
    col=mix(col,l4,peak*0.35*breathePeak);

    col+=l2*smoothstep(0.04,0.18,vElevation)*0.30;
    col+=l3*smoothstep(0.10,0.22,vElevation)*0.15;
    float wake=mouseProximity*mouseProximity*mouseProximity;
    col+=l2*wake*0.35;
    col+=l3*wake*0.20;
    col+=l4*wake*0.08;

    // ── Ripple tint — crests carry cool silver moonlight, troughs deepen shadow.
    // Impact core adds soft dim glow at click point that fades fastest.
    // Sits atop existing shadow palette — dim, not washy. Luxury restraint.
    float crestRip=max(vRipple,0.0);
    float troughRip=max(-vRipple,0.0);
    // Ripple crest tint: cool silver moonlight (void) → warm champagne (day).
    vec3 v_moon=vec3(0.62,0.70,0.86);
    vec3 d_moon=vec3(0.95,0.88,0.70);
    vec3 moonTint=mix(v_moon,d_moon,uFlip);
    col+=moonTint*crestRip*0.32;
    col+=l4*crestRip*0.10;
    col-=l1*troughRip*0.14;

    // Soft inner glow at every active impact point.
    float coreGlow=0.0;
    for(int i=0;i<6;i++){
      vec4 rr=uRipples[i];
      if(rr.w<0.5) continue;
      float age=uTime-rr.z;
      if(age<0.0||age>3.6) continue;
      vec2 ro=vec2((rr.x-0.5)*aspect,rr.y-0.5);
      float d=length(p-ro);
      coreGlow+=exp(-pow(d/0.11,2.0))*exp(-age*1.8);
    }
    col+=moonTint*coreGlow*0.16;

    float vig=1.0-smoothstep(0.06,0.98,length(p*0.78));
    // Vignette belongs to the void. It frames the black-silver fluid like
    // a gravure print border — edges receding into shadow. On cream it reads
    // as soot no matter how gentle the falloff, so we retreat it entirely:
    //   uFlip = 0  →  multiplier = pow(vig, 1.24)  (firm dark edges)
    //   uFlip = 1  →  multiplier = 1.0             (flat, no edge darkening)
    // Lerping the final scalar (not the power) means the vignette truly
    // vanishes in day rather than lingering as a pale halo at the corners.
    float vigVoid = pow(vig, 1.24);
    col *= mix(vigVoid, 1.0, uFlip);
    // Final brightness: 0.74 base keeps void moody; 0.88 in day keeps cream
    // bright so features stay as subtle washes rather than muddy tan.
    col*=mix(0.74, 0.88, uFlip) + mix(0.19, 0.11, uFlip) * (f*0.6+0.4*length(q));
    float lum=dot(col,vec3(0.2126,0.7152,0.0722));
    col=mix(vec3(lum),col,0.90);
    col=max(col,vec3(0.0));

    gl_FragColor=vec4(col,1.0);
  }
`;var c=e.i(21675);let u=[1,1.5];function d(e,t,r,o){let i=e.trim(),n=i.match(/^([-\d.]+)px$/);if(n)return parseFloat(n[1]);let a=i.match(/^([-\d.]+)vw$/);if(a)return parseFloat(a[1])/100*t;let s=i.match(/^([-\d.]+)vh$/);if(s)return parseFloat(s[1])/100*r;let l=i.match(/^([-\d.]+)rem$/);if(l)return parseFloat(l[1])*o;let c=parseFloat(i);return Number.isFinite(c)?c:0}function p(){return"u"<typeof document?0:+("day"===document.documentElement.getAttribute("data-theme"))}function f(){let e=(0,r.useRef)(null),o=(0,r.useRef)(null),{viewport:u}=(0,n.useThree)(),f=(0,r.useRef)({x:.5,y:.5}),m=(0,r.useRef)({x:.5,y:.5}),h=(0,r.useRef)(0),v=(0,r.useRef)(1),x=(0,r.useRef)(0),g=(0,r.useRef)(0),y=(0,r.useRef)(p()),b=(0,r.useRef)({startMs:null,dir:1}),w=(0,r.useRef)(!1),j=(0,r.useMemo)(()=>{let e=Array.from({length:6},()=>new a.Vector4(0,0,-1e3,0)),t=p();return{uTime:{value:0},uMouse:{value:new a.Vector2(.5,.5)},uScrollProgress:{value:0},uResolution:{value:new a.Vector2(window.innerWidth,window.innerHeight)},uRipples:{value:e},uFlip:{value:t},uTransitionWarp:{value:0},uTransitionDir:{value:1},uTransitionOrigin:{value:new a.Vector2(.5,.88)}}},[]),k=(0,r.useCallback)(e=>{f.current.x=e.clientX/window.innerWidth,f.current.y=1-e.clientY/window.innerHeight},[]),C=(0,r.useCallback)(()=>{let e=document.documentElement.scrollHeight-window.innerHeight;h.current=e>0?window.scrollY/e:0},[]),R=(0,r.useCallback)(()=>{j.uResolution.value.set(window.innerWidth,window.innerHeight)},[j]),M=(0,r.useCallback)(e=>{if(0!==e.button)return;let t=g.current;j.uRipples.value[t].set(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight,x.current,1),g.current=(t+1)%6},[j]);return(0,r.useEffect)(()=>(window.addEventListener("pointermove",k,{passive:!0}),window.addEventListener("scroll",C,{passive:!0}),window.addEventListener("resize",R,{passive:!0}),window.addEventListener("pointerdown",M,{passive:!0}),R(),C(),()=>{window.removeEventListener("pointermove",k),window.removeEventListener("scroll",C),window.removeEventListener("resize",R),window.removeEventListener("pointerdown",M)}),[k,C,R,M]),(0,r.useEffect)(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)"),t=()=>{let t=e.matches;w.current=t,v.current=t?.1:1};return t(),e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]),(0,r.useEffect)(()=>(0,c.registerShaderFlip)((t,r)=>{var o;let i,n,a,s,l,c,u,p,f=+("day"===t);y.current=f,b.current={startMs:performance.now(),dir:"day"===t?1:-1},e.current&&(o=e.current.uniforms.uTransitionOrigin.value,n=(i=getComputedStyle(document.documentElement)).getPropertyValue("--flip-ox").trim(),a=i.getPropertyValue("--flip-oy").trim(),s=Math.max(window.innerWidth,1),l=Math.max(window.innerHeight,1),u=d(n||"50vw",s,l,c=parseFloat(i.fontSize)||16),p=d(a||"5.5rem",s,l,c),o.set(u/s,1-p/l)),r&&e.current&&(e.current.uniforms.uFlip.value=f)}),[]),(0,i.useFrame)(({clock:t})=>{let r=e.current;if(!r)return;let o=t.getElapsedTime()*v.current;x.current=o,r.uniforms.uTime.value=o,r.uniforms.uScrollProgress.value=h.current,m.current.x+=(f.current.x-m.current.x)*.04,m.current.y+=(f.current.y-m.current.y)*.04,r.uniforms.uMouse.value.set(m.current.x,m.current.y);let i=r.uniforms.uFlip.value,n=i+(y.current-i)*.035;r.uniforms.uFlip.value=.001>Math.abs(y.current-n)?y.current:n;let a=0,s=b.current;if(null!==s.startMs&&!w.current){let e=performance.now()-s.startMs;e>=c.FLIP_DURATION_MS?s.startMs=null:a=Math.sin(e/c.FLIP_DURATION_MS*Math.PI)}r.uniforms.uTransitionWarp.value=a,r.uniforms.uTransitionDir.value=null!==s.startMs?s.dir:1;let l=r.uniforms.uRipples.value;for(let e=0;e<l.length;e++){let t=l[e];t.w>.5&&o-t.z>3.6&&(t.w=0)}}),(0,t.jsxs)("mesh",{ref:o,children:[(0,t.jsx)("planeGeometry",{args:[u.width,u.height,160,160]}),(0,t.jsx)("shaderMaterial",{ref:e,vertexShader:s,fragmentShader:l,uniforms:j,depthWrite:!1,depthTest:!1})]})}e.s(["default",0,function(){return(0,t.jsx)("div",{className:"pointer-events-none fixed inset-0 -z-1","aria-hidden":"true",children:(0,t.jsx)(o.Canvas,{camera:{position:[0,0,1],near:.1,far:10,fov:75},dpr:u,gl:{antialias:!1,alpha:!1,stencil:!1,depth:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1},frameloop:"always",flat:!0,style:{background:"var(--v-black)"},children:(0,t.jsx)(f,{})})})}],64177)},38764,e=>{"use strict";var t=e.i(43476),r=e.i(75056),o=e.i(80931),i=e.i(39014),n=e.i(71645),a=e.i(90072),s=e.i(21675);let l=`
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,c=`
  precision highp float;

  uniform vec2  uResolution;
  uniform vec2  uOrigin;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPeak;
  uniform float uActive;
  uniform float uAspectBias;

  // ───── Hash & value noise ─────
  // Single-float hash (Dave Hoskins-style) — cheap, decorrelated
  // enough for visual noise without needing sine-based collapses.
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Hermite smoothing — cheaper than quintic and visually adequate
    // for stacked fBm where high-frequency artefacts wash out.
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Rotated-octave fBm. The rotation matrix breaks axis-aligned
  // artefacts that stacked noise otherwise produces.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 6; i++) {
      v += a * vnoise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  // ───── Turbulent ink ─────
  // Two-level domain warp: offset position by fbm, then offset by
  // fbm of that warped position. The iterated warp is what gives
  // Destiny-style darkness its convecting, self-folding look —
  // flat noise reads as static, double-warp reads as fluid.
  float turbulentInk(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + 0.08 * t),
      fbm(p + vec2(3.1, 1.7) + 0.07 * t)
    );
    vec2 r = vec2(
      fbm(p + 3.2 * q + vec2(1.7, 9.2) - 0.11 * t),
      fbm(p + 3.2 * q + vec2(8.3, 2.8) + 0.09 * t)
    );
    return fbm(p + 4.0 * r);
  }

  // ───── Tendrils ─────
  // Sample noise in (angle, radius) polar space so patterns elongate
  // radially. Sharpen with smoothstep to turn blurry clouds into
  // thin filaments. Time shears the radial coordinate so tendrils
  // crawl outward (not just shimmer in place).
  float tendrils(vec2 p, float t, vec2 origin) {
    vec2 d = p - origin;
    float ang = atan(d.y, d.x);
    float rad = length(d);
    vec2 polar = vec2(ang * 2.2, rad * 4.5 - t * 1.05);
    float n = turbulentInk(polar, t * 0.55);
    // Sharpen — the difference between 0.44 and 0.78 gives thin
    // crest-to-trough streaks instead of soft fog. Slight contrast
    // boost via pow so the streaks feel inky rather than gauzy.
    float s = smoothstep(0.44, 0.78, n);
    return pow(s, 1.4);
  }

  void main() {
    // Screen UV in 0..1, with Y flipped so uOrigin (browser pixels,
    // top-left origin) maps correctly — gl_FragCoord's Y is
    // bottom-up by default.
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.y = 1.0 - uv.y;

    float aspect = uResolution.x / uResolution.y;
    vec2 origin = uOrigin / uResolution.xy;

    // Aspect-correct so radial math reads as circles on any shape
    // of viewport. Multiply by (aspect, 1 + bias) so vertical range
    // is slightly stretched — makes the shadow feel taller than
    // wide, closer to "a curtain falling" than "a bubble growing".
    vec2 p = vec2(uv.x * aspect, uv.y * (1.0 + uAspectBias));
    vec2 o = vec2(origin.x * aspect, origin.y * (1.0 + uAspectBias));

    vec2 d = p - o;
    float dist = length(d);

    // ── Main ink body ──
    // Sample position is pulled toward the origin by a distance-
    // modulated offset, so the pattern appears to be getting sucked
    // inward. The scalar 2.2 controls ink frequency — higher =
    // finer detail, lower = broader cloud shapes.
    vec2 inkP = p * 2.4 + 0.55 * d / max(dist, 0.06);
    float ink = turbulentInk(inkP, uTime);
    ink = smoothstep(0.28, 0.88, ink);

    // ── Tendrils ──
    float tend = tendrils(p * 1.15, uTime, o);

    // ── Radial consume front ──
    // Scale the front to cover the full diagonal at progress = 1.
    // maxDim is the aspect-corrected diagonal length (so the front
    // reaches every corner for any viewport shape).
    float maxDim = sqrt(aspect * aspect + pow(1.0 + uAspectBias, 2.0));
    float frontRadius = uProgress * maxDim * 1.15;
    // Breathing feather — subtle sine modulation (~14% amplitude)
    // so the dissolve edge never reads as a crisp ring.
    float feather = 0.22 + 0.08 * sin(uTime * 2.6 + dist * 3.0);

    // smoothstep(high, low, ...) gives 1 inside the front and 0
    // outside, with the feather as the dissolve band.
    float frontMask = smoothstep(frontRadius + feather, frontRadius - feather, dist);

    // Tendrils reach slightly past the main front — that's the
    // "alive" signal: the silhouette isn't a clean disc, it has
    // filaments probing outward hunting for the light.
    float tendrilReach = smoothstep(frontRadius + 0.55, frontRadius - 0.05, dist);

    // ── Composite ──
    // Mix ink with 1.0 so the inside of the front is solid-ish, not
    // patchy. Pull it toward solid as the effect progresses.
    float interior = mix(0.58, 0.92, uProgress);
    float shadow = frontMask * mix(ink, 1.0, interior);

    // Tendrils lay on top with high opacity — they should read as
    // black, not gauze.
    shadow = max(shadow, tend * tendrilReach * 0.95);

    // Contrast shaping — early frames are gauzier, late frames are
    // opaque. pow exponent lerps from 1.5 (toothy) to 0.7 (solid).
    shadow = pow(shadow, mix(1.5, 0.7, uProgress));

    // ── Peak blackout ──
    // uPeak crossfades the entire shadow toward solid black, which
    // is the moment the theme swaps underneath. By the time uPeak
    // reaches 1, the fragment is pitch — the swap is invisible.
    shadow = mix(shadow, 1.0, uPeak);

    // Master visibility for clean mount/unmount edges.
    shadow *= uActive;

    // ── Colour ──
    // Deep matte black at the edges; a cool violet-tinged near-black
    // at the core. The shift is 1–2 bits off pure black — the viewer
    // registers "dark", not "tinted". Destiny's Darkness leans cool
    // rather than warm, so we bias blue over red.
    vec3 edgeBlack = vec3(0.008, 0.006, 0.012);
    vec3 coreBlack = vec3(0.024, 0.018, 0.036);
    float coreBlend = smoothstep(0.9, 0.0, dist / maxDim) * (1.0 - uPeak);
    vec3 tint = mix(edgeBlack, coreBlack, coreBlend);

    gl_FragColor = vec4(tint, shadow);
  }
`;function u(e){return e<0?0:e>1?1:e}function d({activeRef:e}){let{size:r,setSize:s}=(0,i.useThree)();(0,n.useLayoutEffect)(()=>{let e=window.innerWidth,t=window.innerHeight;e>0&&t>0&&(r.width!==e||r.height!==t)&&s(e,t)},[]);let p=(0,n.useMemo)(()=>({uResolution:{value:new a.Vector2(r.width,r.height)},uOrigin:{value:new a.Vector2(r.width/2,.12*r.height)},uTime:{value:0},uProgress:{value:0},uPeak:{value:0},uActive:{value:0},uAspectBias:{value:.25}}),[]);return(0,n.useEffect)(()=>{p.uResolution.value.set(r.width,r.height)},[r.width,r.height,p]),(0,o.useFrame)(({clock:t})=>{let r,o=e.current;if(!o){p.uActive.value=0,p.uProgress.value=0,p.uPeak.value=0;return}let i=performance.now(),n=(i-o.startMs)/1880,a=u(n/.63);p.uProgress.value=1-(r=1-a)*r*r;let s=u((n-.63)/.13);p.uPeak.value=s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2;let l=u((i-o.startMs)/80),c=n>.92?u((1-n)/.07999999999999996):1;p.uActive.value=Math.min(l,c),p.uTime.value=t.getElapsedTime(),o.peakResolved||p.uOrigin.value.set(o.originX,o.originY),p.uPeak.value>=.999&&!o.peakResolved&&(o.peakResolved=!0,o.resolvePeak()),n>=1&&!o.finishedResolved&&(o.finishedResolved=!0,o.resolveFinished())}),(0,t.jsxs)("mesh",{frustumCulled:!1,children:[(0,t.jsx)("planeGeometry",{args:[2,2]}),(0,t.jsx)("shaderMaterial",{uniforms:p,vertexShader:l,fragmentShader:c,transparent:!0,depthTest:!1,depthWrite:!1})]})}e.s(["default",0,function(){let e=(0,n.useRef)(null);return(0,n.useLayoutEffect)(()=>{window.dispatchEvent(new Event("resize"));let e=setTimeout(()=>{window.dispatchEvent(new Event("resize"))},0);return()=>clearTimeout(e)},[]),(0,n.useEffect)(()=>(0,s.registerShadowConsume)((t,r)=>{let o,i,n=new Promise(e=>{o=e}),a=new Promise(e=>{i=e});return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?Promise.resolve().then(()=>{o(),i()}):(e.current={startMs:performance.now(),originX:t,originY:r,resolvePeak:o,resolveFinished:i,peakResolved:!1,finishedResolved:!1},a.then(()=>{e.current&&e.current.finishedResolved&&(e.current=null)})),{peak:n,finished:a}}),[]),(0,t.jsx)("div",{className:"pointer-events-none fixed inset-0 z-[9998] [&_canvas]:pointer-events-none","aria-hidden":"true",children:(0,t.jsx)(r.Canvas,{style:{pointerEvents:"none"},gl:{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance",premultipliedAlpha:!0},dpr:[1,2],frameloop:"always",children:(0,t.jsx)(d,{activeRef:e})})})}],38764)},61833,e=>{"use strict";var t=e.i(43476);e.i(47167);var r=e.i(71645),o=e.i(31178),i=e.i(47414),n=e.i(74008),a=e.i(21476),s=e.i(72846),l=r,c=e.i(37806);function u(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class d extends l.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if((0,s.isHTMLElement)(t)&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,r=(0,s.isHTMLElement)(e)&&e.offsetWidth||0,o=(0,s.isHTMLElement)(e)&&e.offsetHeight||0,i=getComputedStyle(t),n=this.props.sizeRef.current;n.height=parseFloat(i.height),n.width=parseFloat(i.width),n.top=t.offsetTop,n.left=t.offsetLeft,n.right=r-n.width-n.left,n.bottom=o-n.height-n.top}return null}componentDidUpdate(){}render(){return this.props.children}}function p({children:e,isPresent:o,anchorX:i,anchorY:n,root:a,pop:s}){let f=(0,l.useId)(),m=(0,l.useRef)(null),h=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:v}=(0,l.useContext)(c.MotionConfigContext),x=function(...e){return r.useCallback(function(...e){return t=>{let r=!1,o=e.map(e=>{let o=u(e,t);return r||"function"!=typeof o||(r=!0),o});if(r)return()=>{for(let t=0;t<o.length;t++){let r=o[t];"function"==typeof r?r():u(e[t],null)}}}}(...e),e)}(m,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:t,top:r,left:l,right:c,bottom:u}=h.current;if(o||!1===s||!m.current||!e||!t)return;let d="left"===i?`left: ${l}`:`right: ${c}`,p="bottom"===n?`bottom: ${u}`:`top: ${r}`;m.current.dataset.motionPopId=f;let x=document.createElement("style");v&&(x.nonce=v);let g=a??document.head;return g.appendChild(x),x.sheet&&x.sheet.insertRule(`
          [data-motion-pop-id="${f}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${d}px !important;
            ${p}px !important;
          }
        `),()=>{m.current?.removeAttribute("data-motion-pop-id"),g.contains(x)&&g.removeChild(x)}},[o]),(0,t.jsx)(d,{isPresent:o,childRef:m,sizeRef:h,pop:s,children:!1===s?e:l.cloneElement(e,{ref:x})})}let f=({children:e,initial:o,isPresent:n,onExitComplete:s,custom:l,presenceAffectsLayout:c,mode:u,anchorX:d,anchorY:f,root:h})=>{let v=(0,i.useConstant)(m),x=(0,r.useId)(),g=!0,y=(0,r.useMemo)(()=>(g=!1,{id:x,initial:o,isPresent:n,custom:l,onExitComplete:e=>{for(let t of(v.set(e,!0),v.values()))if(!t)return;s&&s()},register:e=>(v.set(e,!1),()=>v.delete(e))}),[n,v,s]);return c&&g&&(y={...y}),(0,r.useMemo)(()=>{v.forEach((e,t)=>v.set(t,!1))},[n]),r.useEffect(()=>{n||v.size||!s||s()},[n]),e=(0,t.jsx)(p,{pop:"popLayout"===u,isPresent:n,anchorX:d,anchorY:f,root:h,children:e}),(0,t.jsx)(a.PresenceContext.Provider,{value:y,children:e})};function m(){return new Map}var h=e.i(64978);let v=e=>e.key||"";function x(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}let g=({children:e,custom:a,initial:s=!0,onExitComplete:l,presenceAffectsLayout:c=!0,mode:u="sync",propagate:d=!1,anchorX:p="left",anchorY:m="top",root:g})=>{let[y,b]=(0,h.usePresence)(d),w=(0,r.useMemo)(()=>x(e),[e]),j=d&&!y?[]:w.map(v),k=(0,r.useRef)(!0),C=(0,r.useRef)(w),R=(0,i.useConstant)(()=>new Map),M=(0,r.useRef)(new Set),[T,P]=(0,r.useState)(w),[E,S]=(0,r.useState)(w);(0,n.useIsomorphicLayoutEffect)(()=>{k.current=!1,C.current=w;for(let e=0;e<E.length;e++){let t=v(E[e]);j.includes(t)?(R.delete(t),M.current.delete(t)):!0!==R.get(t)&&R.set(t,!1)}},[E,j.length,j.join("-")]);let L=[];if(w!==T){let e=[...w];for(let t=0;t<E.length;t++){let r=E[t],o=v(r);j.includes(o)||(e.splice(t,0,r),L.push(r))}return"wait"===u&&L.length&&(e=L),S(x(e)),P(w),null}let{forceRender:_}=(0,r.useContext)(o.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:E.map(e=>{let r=v(e),o=(!d||!!y)&&(w===E||j.includes(r));return(0,t.jsx)(f,{isPresent:o,initial:(!k.current||!!s)&&void 0,custom:a,presenceAffectsLayout:c,mode:u,root:g,onExitComplete:o?void 0:()=>{if(M.current.has(r)||!R.has(r))return;M.current.add(r),R.set(r,!0);let e=!0;R.forEach(t=>{t||(e=!1)}),e&&(_?.(),S(C.current),d&&b?.(),l&&l())},anchorX:p,anchorY:m,children:e},r)})})};e.s(["default",0,function({children:e}){return(0,t.jsx)(g,{mode:"wait",children:e})}],61833)}]);