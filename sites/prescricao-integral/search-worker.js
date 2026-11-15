// Bounded-memory full-text scan. Documents are fetched in small batches, not retained as a second full corpus in memory.
let urls=[],generation=0,controller;
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
onmessage=async e=>{
 if(e.data.type==='init'){urls=e.data.urls;return;}
 if(e.data.type!=='search')return;
 const current=++generation,query=String(e.data.query||''),seq=e.data.seq,terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 controller?.abort();controller=new AbortController();const signal=controller.signal;let hits=[],count=0,loaded=0;
 if(!terms.length)return;
 try{
  for(let i=0;i<urls.length;i+=2){
   const parts=await Promise.all(urls.slice(i,i+2).map(async url=>{const r=await fetch(url,{signal,cache:'force-cache'});if(!r.ok)throw Error('Falha ao carregar parte do acervo.');let bytes=await r.arrayBuffer();if(new Uint8Array(bytes)[0]===31&&new Uint8Array(bytes)[1]===139){if(!globalThis.DecompressionStream)throw Error('Atualize o navegador para pesquisar o acervo compactado.');bytes=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();}return JSON.parse(new TextDecoder().decode(bytes));}));
   if(current!==generation)return;
   for(const list of parts){for(const d of list){const n=normalize(d.t);if(terms.every(t=>n.includes(t))){count++;if(hits.length<200){const at=n.indexOf(terms[0]);hits.push({s:d.s,p:d.p,o:d.o,text:d.t.slice(Math.max(0,at-95),at+400)});}}}loaded++;}
   postMessage({type:'results',query,seq,hits,count,loaded,total:urls.length,ready:loaded===urls.length});
  }
 }catch(err){if(err.name!=='AbortError'&&current===generation)postMessage({type:'error',message:err.message,loaded,total:urls.length});}
};
