// Servidor de arquivos estáticos dos sites: lê os arquivos do repositório no GitHub
// (REPO/REF) e os entrega com o tipo correto e cache de 5 minutos.
// Mesmas regras (tipos de arquivo, ordem de busca, cache) do programa estático que estes
// seis sites usavam até 16/11/2026 — a versão de 2.819 bytes, com xlsx/docx/gz.
const TYPES={html:"text/html; charset=utf-8",htm:"text/html; charset=utf-8",js:"text/javascript; charset=utf-8",mjs:"text/javascript; charset=utf-8",css:"text/css; charset=utf-8",json:"application/json; charset=utf-8",map:"application/json",svg:"image/svg+xml",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",avif:"image/avif",ico:"image/x-icon",pdf:"application/pdf",txt:"text/plain; charset=utf-8",md:"text/markdown; charset=utf-8",csv:"text/csv; charset=utf-8",xml:"application/xml",webmanifest:"application/manifest+json",woff:"font/woff",woff2:"font/woff2",ttf:"font/ttf",otf:"font/otf",wasm:"application/wasm",mp3:"audio/mpeg",mp4:"video/mp4",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",gz:"application/gzip",traineddata:"application/octet-stream"};
const ext=p=>{const s=p.split("/").pop();const i=s.lastIndexOf(".");return i>0?s.slice(i+1).toLowerCase():"";};

export async function servirEstatico(req, env, ctx) {
  if (req.method!=="GET"&&req.method!=="HEAD") return new Response("Method not allowed",{status:405});
  const url=new URL(req.url); let p=url.pathname;
  let dec; try{dec=decodeURIComponent(p);}catch{return new Response("Bad request",{status:400});}
  if (dec.split("/").includes("..")||dec.includes("\\")||dec.startsWith("/.git")) return new Response("Bad request",{status:400});
  if (p.endsWith("/")) p+="index.html";
  const cache=caches.default; const key=new Request(url.origin+p,{method:"GET"});
  try{const hit=await cache.match(key); if(hit) return hit;}catch{}
  const base="https://raw.githubusercontent.com/"+env.REPO+"/"+env.REF;
  let r=await fetch(base+p,{cf:{cacheTtl:300,cacheEverything:true}});
  if (r.status===404&&!ext(p)) {
    const h=await fetch(base+p+".html");
    if(h.ok){r=h;p+=".html";}
    else { const d=await fetch(base+p+"/index.html",{method:"HEAD"}); if (d.ok) return Response.redirect(url.origin+p+"/"+url.search,301); }
  }
  if (r.status===404) return new Response("Pagina nao encontrada",{status:404,headers:{"content-type":"text/plain; charset=utf-8"}});
  if (!r.ok) return new Response("Origem indisponivel ("+r.status+")",{status:502,headers:{"content-type":"text/plain; charset=utf-8"}});
  const h=new Headers();
  h.set("content-type",TYPES[ext(p)]||"application/octet-stream"); h.set("cache-control","public, max-age=300");
  h.set("x-content-type-options","nosniff"); h.set("referrer-policy","strict-origin-when-cross-origin");
  const et=r.headers.get("etag"); if(et) h.set("etag",et);
  const res=new Response(r.body,{status:200,headers:h});
  if (req.method==="GET") { try{ctx.waitUntil(cache.put(key,res.clone()));}catch{} }
  return res;
}
