export const ARCHIVE_BASE = "https://frontdeskbr.github.io/integrar-site-arquivos/";
export async function archiveJson<T>(filename:string):Promise<T>{
 if(!/^[a-zA-Z0-9._-]+$/.test(filename))throw new Error("Arquivo inválido.");
 const response=await fetch(ARCHIVE_BASE+filename,{signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error("Arquivo indisponível.");
 return response.json() as Promise<T>;
}
export function archiveFilename(url:string):string{
 if(!url.startsWith(ARCHIVE_BASE))throw new Error("Destino inválido.");
 return url.slice(ARCHIVE_BASE.length);
}
