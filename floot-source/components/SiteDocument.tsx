import {useEffect,useRef,useState} from "react";
import {useLocation} from "react-router-dom";
import {createPortal} from "react-dom";
import {NewsBrowser} from "./NewsBrowser";
import {ContactForm} from "./ContactForm";
import {BookReader} from "./BookReader";
export const SiteDocument=()=>{
 const root=useRef<HTMLDivElement>(null);const location=useLocation();const [error,setError]=useState("");const [contactRoot,setContactRoot]=useState<HTMLElement|null>(null);const [newsRoot,setNewsRoot]=useState<HTMLElement|null>(null);const [bookIndex,setBookIndex]=useState<number|null>(null);
 useEffect(()=>{let cancelled=false;const added:Element[]=[];const controller=new AbortController();setError("");setNewsRoot(null);setContactRoot(null);
 async function render(){
 const query=new URLSearchParams(location.search);
 const r=await fetch("/_api/document?path="+encodeURIComponent(location.pathname)+"&q="+encodeURIComponent(query.get("s")||"")+"&page="+encodeURIComponent(query.get("paged")||"1"),{signal:controller.signal});
 if(!r.ok)throw Error(r.status===404?"Página não encontrada.":"Não foi possível carregar esta página.");
 const raw=((await r.json()).html as string).replaceAll("https://integrar-arte-e-vida.floot.app",window.location.origin);
 if(cancelled)return;
 const doc=new DOMParser().parseFromString(raw,"text/html");
 for(const link of Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[href]"))){try{if(["megaonion.cc","premiumghostwriter.de","hausarbeiten-schreiben-lassen.com","akadeule.de"].includes(new URL(link.href).hostname.replace(/^www\./,""))){(link.closest("li")||link).remove();}}catch{}}
 for(const menu of Array.from(doc.querySelectorAll("ul.nav-dropdown"))){if(menu.children.length===0){const parent=menu.parentElement;menu.remove();parent?.classList.remove("has-dropdown","menu-item-has-children");const link=parent?.querySelector("a");link?.removeAttribute("aria-haspopup");link?.removeAttribute("aria-expanded");link?.querySelector(".icon-angle-down")?.remove();}}
 document.documentElement.lang="pt-BR";document.documentElement.className="js";document.body.className=doc.body.className;document.title=doc.title;
 for(const el of Array.from(doc.head.querySelectorAll("style,link[rel=stylesheet],link[rel=icon],link[rel=canonical],meta[name=description],meta[property^='og:']"))){const c=el.cloneNode(true) as Element;document.head.append(c);added.push(c);}
 if(!root.current||cancelled)return;root.current.innerHTML=doc.body.innerHTML;
 if(location.pathname.split("/").filter(Boolean).slice(0,2).join("/")==="categoria/noticias"){const main=root.current.querySelector<HTMLElement>("main");if(main){main.innerHTML="";const slot=document.createElement("div");main.append(slot);setNewsRoot(slot);}}
 Array.from(root.current.querySelectorAll<HTMLAnchorElement>(".rfbwp-shelf-book")).forEach((book,index)=>{book.setAttribute("aria-label",["Ler primeira edição","Ler segunda edição","Ler terceira edição","Ler quarta edição","Ler quinta edição"][index]||"Ler gibi");book.addEventListener("click",event=>{event.preventDefault();event.stopImmediatePropagation();setBookIndex(index);},true);});
 for(const a of Array.from(root.current.querySelectorAll<HTMLAnchorElement>("a[href]"))){try{const u=new URL(a.href);if(["www.anvp.com.br","anvp.com.br","www.ane.org.br","ane.org.br","www.integrararteevida.org.br","integrararteevida.org.br",window.location.hostname].includes(u.hostname)&&!u.pathname.startsWith("/wp-"))a.href=u.pathname+u.search+u.hash;}catch{}}
 for(const f of Array.from(root.current.querySelectorAll<HTMLFormElement>('form[role="search"]'))){f.action="/";}
 if(location.pathname.replace(/\/$/,"")==="/contato"){
 const formHost=root.current.querySelector<HTMLElement>(".wpcf7")||Array.from(root.current.querySelectorAll<HTMLElement>(".col-inner")).find(el=>el.textContent?.trim().startsWith("[vc_gmaps"));
 if(formHost){formHost.innerHTML="";const slot=document.createElement("div");formHost.append(slot);setContactRoot(slot);}
 }
 const scripts=[...Array.from(doc.head.querySelectorAll("script")),...Array.from(root.current.querySelectorAll("script"))];
 const configScripts=scripts.filter(script=>!script.src&&script.id.endsWith("-js-extra"));
 const orderedScripts=[...configScripts,...scripts.filter(script=>!configScripts.includes(script)&&!["flatsome-live-search-js","contact-form-7-js","swv-js"].includes(script.id))];
 for(const original of orderedScripts){if(cancelled)break;const s=document.createElement("script");for(const a of Array.from(original.attributes))s.setAttribute(a.name,a.value);s.textContent=original.textContent;s.async=false;
 if(s.src){await new Promise<void>(resolve=>{const timer=setTimeout(resolve,12000);s.onload=()=>{clearTimeout(timer);resolve();};s.onerror=()=>{clearTimeout(timer);resolve();};document.body.append(s);added.push(s);});}else{document.body.append(s);added.push(s);} }
 document.documentElement.classList.remove("loading-site");window.dispatchEvent(new Event("resize"));
 }render().catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;controller.abort();added.forEach(e=>e.remove());};},[location.pathname,location.search]);
 return <>{error&&<p role="alert">{error} <a href="/">Voltar ao início</a></p>}<div ref={root}/>{newsRoot&&createPortal(<NewsBrowser/>,newsRoot)}{contactRoot&&createPortal(<ContactForm/>,contactRoot)}<BookReader bookIndex={bookIndex} onClose={()=>setBookIndex(null)}/></>;
};
