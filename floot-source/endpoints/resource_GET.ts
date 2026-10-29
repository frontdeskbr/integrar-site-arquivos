import {ARCHIVE_BASE,archiveJson} from "../helpers/SourceArchive";
export async function handle(request:Request){
 try{
 const value=new URL(request.url).searchParams.get("path")||"";
 let path:string;try{path=decodeURIComponent(value.split("?")[0]);}catch{return new Response("Endereço inválido",{status:400});}
 if(!/^\/wp-(content|includes)\//.test(path)||path.includes("..")||path.includes("\\"))return new Response("Arquivo não encontrado",{status:404});
 const map=await archiveJson<Record<string,string>>("resource-map.json");
 const stem=(p:string)=>p.normalize("NFC").replace(/(?:-\d+x\d+|-scaled)+(?=\.[^.]+$)/,"");
 const target=map[path]||Object.entries(map).find(([key])=>stem(key)===stem(path))?.[1];
 if(!target||!target.startsWith(ARCHIVE_BASE))return new Response("Arquivo não encontrado",{status:404});
 return new Response(null,{status:302,headers:{Location:target,"Cache-Control":"public, max-age=86400"}});
 }catch{return new Response("Arquivo indisponível",{status:502});}
}
