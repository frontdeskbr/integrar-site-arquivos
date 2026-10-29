import {useEffect,useRef,useState} from "react";
import {useLocation} from "react-router-dom";
import {createPortal} from "react-dom";
import {NewsBrowser} from "./NewsBrowser";
export const SiteDocument=()=>{
 const root=useRef<HTMLDivElement>(null);const location=useLocation();const [error,setError]=useState("");const [newsRoot,setNewsRoot]=useState<HTMLElement|null>(null);
 useEffect(()=>{let cancelled=false;const added:Element[]=[];const controller=new AbortController();setError("");setNewsRoot(null);
 async function render(){
 const query=new URLSearchParams(location.search);
 const r=await fetch("/_api/document?path="+encodeURIComponent(location.pathname)+"&q="+encodeURIComponent(query.get("s")||"")+"&page="+encodeURIComponent(query.get("paged")||"1"),{signal:controller.signal});
 if(!r.ok)throw Error(r.status===404?"Página não encontrada.":"Não foi possível carregar esta página.");
 const raw=((await r.json()).html as string).replaceAll("https://integrar-arte-e-vida.floot.app",window.location.origin);
 if(cancelled)return;
 const doc=new DOMParser().parseFromString(raw,"text/html");
 document.documentElement.lang="pt-BR";document.documentElement.className="js";document.body.className=doc.body.className;document.title=doc.title;
 for(const el of Array.from(doc.head.querySelectorAll("style,link[rel=stylesheet],link[rel=icon],link[rel=canonical],meta[name=description],meta[property^='og:']"))){const c=el.cloneNode(true) as Element;document.head.append(c);added.push(c);}
 if(!root.current||cancelled)return;root.current.innerHTML=doc.body.innerHTML;
 if(location.pathname.split("/").filter(Boolean).slice(0,2).join("/")==="categoria/noticias"){const main=root.current.querySelector<HTMLElement>("main");if(main){main.innerHTML="";const slot=document.createElement("div");main.append(slot);setNewsRoot(slot);}}
 for(const a of Array.from(root.current.querySelectorAll<HTMLAnchorElement>("a[href]"))){try{const u=new URL(a.href);if(["www.anvp.com.br","anvp.com.br","www.ane.org.br","ane.org.br","www.integrararteevida.org.br","integrararteevida.org.br",window.location.hostname].includes(u.hostname)&&!u.pathname.startsWith("/wp-"))a.href=u.pathname+u.search+u.hash;}catch{}}
 for(const f of Array.from(root.current.querySelectorAll<HTMLFormElement>('form[role="search"]'))){f.action="/";}
 for(const f of Array.from(root.current.querySelectorAll<HTMLFormElement>(".wpcf7-form"))){
 f.action="/_api/contact";f.method="post";f.addEventListener("submit",async event=>{
 event.preventDefault();const button=f.querySelector<HTMLInputElement>('[type="submit"]');if(button)button.disabled=true;
 let message=f.querySelector<HTMLElement>(".wpcf7-response-output");
 if(!message){message=document.createElement("p");f.append(message);}message.style.display="block";message.setAttribute("role","status");
 try{const data=new FormData(f);const response=await fetch("/_api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:data.get("your-name"),email:data.get("your-email"),subject:data.get("your-subject"),message:data.get("your-message")})});if(!response.ok)throw Error("Não foi possível registrar sua mensagem. Tente novamente.");message.textContent="Sua mensagem foi registrada. Obrigado pelo contato.";f.reset();}catch(e){message.textContent=e instanceof Error?e.message:"Falha ao registrar mensagem.";}finally{if(button)button.disabled=false;}
 });
 }
 const scripts=[...Array.from(doc.head.querySelectorAll("script")),...Array.from(root.current.querySelectorAll("script"))];
 for(const original of scripts){if(cancelled)break;const s=document.createElement("script");for(const a of Array.from(original.attributes))s.setAttribute(a.name,a.value);s.textContent=original.textContent;s.async=false;
 if(s.src){await new Promise<void>(resolve=>{const timer=setTimeout(resolve,12000);s.onload=()=>{clearTimeout(timer);resolve();};s.onerror=()=>{clearTimeout(timer);resolve();};document.body.append(s);added.push(s);});}else{document.body.append(s);added.push(s);} }
 document.documentElement.classList.remove("loading-site");window.dispatchEvent(new Event("resize"));
 }render().catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;controller.abort();added.forEach(e=>e.remove());};},[location.pathname,location.search]);
 return <>{error&&<p role="alert">{error} <a href="/">Voltar ao início</a></p>}<div ref={root}/>{newsRoot&&createPortal(<NewsBrowser/>,newsRoot)}</>;
};
