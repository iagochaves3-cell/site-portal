// A new request is created only by an explicit form submission. Polling reads
// the same job; edits/cancellation cannot replace a newer patient's result.
export function createResearchClient({onStatus,onComplete,onBusy,onError,fetcher=fetch,interval=2200}){
  let generation=0,job=null,timer=null,busy=false;
  const setBusy=value=>{busy=value;onBusy(value);};
  const request=async body=>{
    const response=await fetcher('/api/research',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(45000)});
    const payload=await response.json();
    if(!response.ok||payload.error)throw Object.assign(new Error(payload.message||'Não foi possível concluir a pesquisa.'),payload);
    return payload;
  };
  const cancelRemote=id=>request({action:'cancel',job_id:id}).catch(()=>{});
  async function cancel(){generation++;clearTimeout(timer);const old=job;job=null;setBusy(false);if(old)await cancelRemote(old);}
  async function start(args){
    if(busy)return;
    const current=++generation;setBusy(true);job=null;
    onStatus('Pesquisando diretrizes e fontes atuais…');
    try{
      let response=await request({action:'start',nonce:crypto.randomUUID(),args});
      if(current!==generation){if(response.job_id)await cancelRemote(response.job_id);return;}
      job=response.job_id;
      const poll=async()=>{
        if(current!==generation)return;
        try{
          response=await request({action:'poll',job_id:job,args});
          if(current!==generation)return;
          if(response.state==='completed'){
            job=null;setBusy(false);onComplete(response.protocol,response);return;
          }
          if(response.state==='cancelled'){job=null;setBusy(false);onStatus('Pesquisa cancelada.');return;}
          onStatus(/review/.test(response.state)?'Conferindo fontes, condutas, apresentações e cálculos…':'Pesquisando diretrizes e fontes atuais…');
          timer=setTimeout(poll,interval);
        }catch(error){if(current===generation){setBusy(false);onError(error);}}
      };
      timer=setTimeout(poll,interval);
    }catch(error){if(current===generation){setBusy(false);onError(error);}}
  }
  return {start,cancel,isBusy:()=>busy};
}
