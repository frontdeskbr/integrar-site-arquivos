import {schema} from "./document_GET.schema";
import {archiveJson,archiveFilename} from "../helpers/SourceArchive";
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
export async function handle(request:Request){
 try{
 const u=new URL(request.url);
 const parsed=schema.safeParse({path:u.searchParams.get("path")||"/",q:u.searchParams.get("q")||""});
 if(!parsed.success)return Response.json({error:"Endereço inválido."},{status:400});
 let {path,q}=parsed.data;
 try{path=decodeURIComponent(path);}catch{return Response.json({error:"Endereço inválido."},{status:400});}
 if(!path.startsWith("/")||path.startsWith("//")||path.includes("\\")||path.includes("..")||/^\/(wp-|xmlrpc)/i.test(path))return Response.json({error:"Página não encontrada."},{status:404});
 const routes=await archiveJson<Record<string,string>>("routes.json");
 const target=routes[path]||routes[path.endsWith("/")?path.slice(0,-1):path+"/"];
 if(!target)return Response.json({error:"Página não encontrada."},{status:404});
 const document=await archiveJson<{html:string}>(archiveFilename(target));
 if(q.trim()){
 const rows=await archiveJson<Array<{title:string;url:string;excerpt:string}>>("search.json");
 const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const terms=normalize(q.trim()).split(/\s+/);
 const matches=rows.filter(row=>terms.every(term=>normalize(row.title+" "+row.excerpt).includes(term)));
 const rawPage=Number(u.searchParams.get("page")||1);
 const page=Number.isFinite(rawPage)?Math.max(1,Math.floor(rawPage)):1;
 const totalPages=Math.max(1,Math.ceil(matches.length/20));
 const cards=matches.slice((page-1)*20,page*20).map(row=>'<article><h2><a href="'+escape(row.url)+'">'+escape(row.title)+'</a></h2><p>'+escape(row.excerpt)+'</p></article>').join("");
 const nav=Array.from({length:totalPages},(_,i)=>'<a style="margin-right:12px" href="/?s='+encodeURIComponent(q)+'&paged='+(i+1)+'">'+(i+1)+'</a>').join("");
 const content='<div class="row"><div class="large-12 col"><h1>Resultados da busca: '+escape(q)+'</h1><p>'+matches.length+' resultados</p>'+(cards||'<p>Nenhum resultado encontrado.</p>')+'<nav aria-label="Paginação">'+nav+'</nav></div></div>';
 document.html=document.html.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/i,(_all,a,b)=>a+content+b).replace(/<title>[\s\S]*?<\/title>/i,'<title>Busca: '+escape(q)+'</title>');
 }
 return Response.json(document,{headers:{"Cache-Control":"public, max-age=300"}});
 }catch{return Response.json({error:"Página temporariamente indisponível."},{status:502});}
}
