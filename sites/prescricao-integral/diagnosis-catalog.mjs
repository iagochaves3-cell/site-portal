// Consultation catalogue only. Imported identities must never be fed to the
// prescribing, guidance-autofill, regimen or patient-diagnosis registries.
export const PPS_IMPORT_SCOPE='Conteúdo diagnóstico importado para consulta. Esta integração não importa esquemas farmacológicos estruturados nem habilita cálculo ou prescrição. A faixa etária e a aplicabilidade clínica precisam ser conferidas em cada registro.';
export function diagnosisCatalogKey(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[≥≤≠<>+=]/g,operator=>' '+({'≥':'greater equal','≤':'less equal','≠':'not equal','>':'greater','<':'less','+':'plus','=':'equal'}[operator])+' ').replace(/[^a-z0-9]+/g,' ').trim();}
export function buildDiagnosisCatalog(nativeRecords,importedRecords){
 const groups=new Map(),values=new Set();
 const rowFor=name=>{const key=diagnosisCatalogKey(name);if(!key)throw Error('Diagnóstico sem nome.');if(!groups.has(key))groups.set(key,{id:'diagnosis:'+key,name,aliases:[],nativeRecords:[],importedRecords:[]});return groups.get(key);};
 // Only complete name equality (case, accents and punctuation normalized) is
 // reconciled. Synonyms and partial matches never merge clinical indications.
 for(const record of nativeRecords)rowFor(record.name).nativeRecords.push(record);
 for(const record of importedRecords){
  if(!['primary','other'].includes(record.source)||record.value!==`${record.source}:${record.id}`||values.has(record.value))throw Error('Identidade PPS inválida ou duplicada.');
  values.add(record.value);rowFor(record.name).importedRecords.push(record);
 }
 return [...groups.values()].map(row=>{
  const records=[...row.nativeRecords,...row.importedRecords];
  row.aliases=[...new Set(records.flatMap(record=>[record.name,...(record.aliases||[])]))].filter(name=>name!==row.name);
  row.searchText=diagnosisCatalogKey([row.name,...row.aliases,...row.importedRecords.flatMap(record=>[record.value,record.baseName,record.category,record.origin,record.populationLabel])].filter(Boolean).join(' '));
  return row;
 }).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'})||a.id.localeCompare(b.id));
}
export function filterDiagnosisCatalog(records,query=''){
 const terms=diagnosisCatalogKey(query).split(' ').filter(Boolean);
 return records.filter(record=>terms.every(term=>record.searchText.includes(term)));
}
export function diagnosisCatalogStats(records){return {total:records.length,native:records.reduce((n,r)=>n+r.nativeRecords.length,0),imported:records.reduce((n,r)=>n+r.importedRecords.length,0),reconciled:records.reduce((n,r)=>n+(r.nativeRecords.length?r.importedRecords.length:0),0),newRows:records.filter(r=>!r.nativeRecords.length).length};}
export const ppsDiagnosticFields=[['criteria','CRITÉRIOS E ESCOPO'],['orientations','ORIENTAÇÕES DO DIAGNÓSTICO'],['avoid','CONDUTAS A EVITAR'],['redFlags','SINAIS DE ALARME'],['returnInstructions','RETORNO / REAVALIAÇÃO']];
