import {calculateDose,number,norm,fmt,convert} from './core.mjs';
import {assertFinalClinicalText} from './copy-ready.mjs';
import {validateGuidance,guidanceText,clinicalDiagnosisMatches} from './guidance.mjs';
import {regimens,prepareRegimen,THERAPY_VERSION,coughTypes} from './therapeutics.mjs';
export const ENGINE_VERSION='PI-2026.10.05.6';
export const SESSION_TTL=15*60*1000;
const dxAliases=[['otite média aguda',/\boma\b|otite(?: media)?(?: aguda)?/],['pneumonia',/\bpneumonia\b/],['amigdalite',/\bamigdalite\b|faringoamigdalite/],['sinusite',/\bsinusite\b|rinossinusite/]];
export function withClinicalDefaults(input={}){
 const data={...input},assumed=new Set(input.assumedFields||[]);
 const context=norm([data.comorbidities,data.notes].filter(Boolean).join('. '));
 for(const key of ['renal','hepatic'])if(data[key]===undefined||data[key]===null||String(data[key]).trim()===''){
  const value=organFunctionFromText(context,key);if(value!==undefined){data[key]=value;assumed.delete(key);}
 }
 for(const [key,legacyValue] of Object.entries({allergies:'nenhuma',comorbidities:'nenhuma',renal:'normal',hepatic:'normal'}))if(assumed.has(key)&&data[key]===legacyValue)data[key]='não informado';
 for(const [key,value] of Object.entries({allergies:'não informado',comorbidities:'não informado',renal:'não informado',hepatic:'não informado',notes:'',basis:'real'})){
  if(data[key]===undefined||data[key]===null||String(data[key]).trim()===''){data[key]=value;assumed.add(key);}
  else if(data[key]!==value)assumed.delete(key);
 }
 return {...data,assumedFields:[...assumed]};
}
function historyUnconfirmed(data,key){const value=data?.[key];return typeof value!=='string'||!value.trim()||data.assumedFields?.includes(key)||!/\p{L}/u.test(value)||/desconhec|nao inform|nao esclarec|nao sei|nao (?:avaliad|investigad|pesquisad|verificad)|nao (?:ha|tem|possui) inform|sem inform|ignorada?|unknown|^pendentes?$|^a (?:avaliar|investigar|esclarecer)$|^n\s*[/.-]\s*i$|^n\/?a$|^a confirmar$/.test(norm(value).trim());}
export function assertConfirmedHistory(input){const data=withClinicalDefaults(input);for(const key of ['allergies','comorbidities'])if(historyUnconfirmed(data,key))throw Error('Informe explicitamente alergias e comorbidades; dados ausentes ou desconhecidos não liberam prescrição.');return data;}
export function historyLabel(data,key){if(['allergies','comorbidities','renal','hepatic'].includes(key)&&(data.assumedFields?.includes(key)||data[key]===undefined||data[key]===null||String(data[key]).trim()===''))return 'não informado — confirmar';const value=String(data[key]??'não informado');return data.assumedFields?.includes(key)?(key==='notes'?'não informadas':value)+' (padrão por omissão)':value;}
function organFunctionFromText(t,key){
 const word=key==='renal'?'renal':'hepatica';
 const abnormal=key==='renal'?'(?:insuficiencia|doenca|disfuncao)\\s+renal|nefropatia|dialise':'(?:insuficiencia|doenca|disfuncao)\\s+hepatica|hepatopatia|cirrose';
 const separator='\\s*(?::|=)?\\s*',joint='renal\\s*(?:e|/)\\s*hepatica';
 const mentions=[...t.matchAll(new RegExp(abnormal+'|(?:'+word+'|'+joint+')'+separator+'(?:alterad[ao]s?|comprometidas?|anormal|reduzida)','g'))];
 if(mentions.some(m=>!/(?:sem|nega|nao (?:tem|possui))\s*$/.test(t.slice(0,m.index))))return 'alterada';
 if(new RegExp('(?:'+word+'|'+joint+')'+separator+'(?:desconhecid[ao]s?|nao (?:informad[ao]s?|esclarecidas?|avaliadas?)|nao sei|a avaliar|a confirmar)|(?:nao sei|desconheco)\\s+(?:a\\s+)?(?:funcao\\s+)?'+word).test(t))return 'desconhecida';
 if(new RegExp('(?:'+word+'|'+joint+')'+separator+'(?:normal|normais|preservadas?)').test(t))return 'normal';
 if(new RegExp('\\bfuncao\\s+'+word+'\\b|'+word+'\\s*[:=]').test(t))return 'não esclarecida';
 return undefined;
}
function mergeClinical(previous,incoming){
 const assumedFields=(previous.assumedFields||[]).filter(key=>!Object.hasOwn(incoming,key));
 return withClinicalDefaults({...previous,...incoming,assumedFields});
}
function historyFromText(t,kind,warnings){
 const term=kind==='allergies'?'alergias?':'comorbidades?';
 const negative=new RegExp('(?:sem|nega|nao (?:tem|possui))\\s+(?:'+term+')\\b').test(t);
 const structured=new RegExp('\\b'+term+'\\s*[:=]\\s*([^.;\\n]+)').exec(t);
 const positive=kind==='allergies'?/\b(?:alergi(?:a|as|co|ca))\s+(?:a|ao|aos|as)\s+([^.;\n]+)/.exec(t):/\bcomorbidades?\s+(?!ausentes\b|negadas\b|desconhecidas\b)([^.;\n]+)/.exec(t);
 let value=(structured?.[1]||positive?.[1]||'').split(/,\s*(?:peso|idade|funcao|sem |comorbidade|alergia)/)[0].trim();
 if(/^(?:nenhuma|nenhum|nao|sem|ausentes?|negadas?)$/.test(value))value='nenhuma';
 if(negative&&value&&value!=='nenhuma')warnings.push('História contraditória de '+(kind==='allergies'?'alergias':'comorbidades')+'. Confirme a informação.');
 if(value)return value;
 if(negative)return 'nenhuma';
 if(new RegExp('\\b'+term+'\\b|'+(kind==='allergies'?'\\balergic[oa]\\b':'\\bcomorbido\\b')).test(t))return 'não esclarecida';
 return undefined;
}
export function extractClinical(message){
 const t=norm(message),data={},warnings=[];
 if(/[-−]\s*\d+(?:[.,]\d+)?\s*(?:kg|g|anos?|meses|dias?)\b/.test(t))warnings.push('Valores negativos não são aceitos. Reenvie peso e idade.');
 if(/\d+[.,]\d+\s*(?:anos?|meses|dias?)\b/.test(t))warnings.push('Informe a idade em anos, meses e dias inteiros, sem casas decimais.');
 const weights=[...t.matchAll(/(?:\bpeso\s*[:=]?\s*)?(\d+(?:[.,]\d+)?)\s*(kg|quilos?|gramas?|g)\b/g)];
 const bare=/\bpeso\s*[:=]?\s*(\d+(?:[.,]\d+)?)(?=\s*[,;]|\s+idade|$)/.exec(t);
 if(weights.length>1)warnings.push('Há mais de um peso na mensagem. Informe apenas o peso atual.');
 if(weights.length===1){data.weight=Number(weights[0][1].replace(',','.'))/(weights[0][2].startsWith('g')?1000:1);}
 else if(bare){data.weight=Number(bare[1].replace(',','.'));warnings.push('Peso recebido sem unidade; confirme que está em kg.');}
 const ages=[...t.matchAll(/(\d+)\s*(anos?|mes(?:es)?|dias?)\b/g)].filter(m=>!/(?:ha|durante|por)\s*$/.test(t.slice(0,m.index)));
 if(ages.length){data.age={years:0,months:0,days:0};const seen=new Set();for(const a of ages){const k=a[2].startsWith('a')?'years':a[2].startsWith('m')?'months':'days';if(seen.has(k))warnings.push('Há idades conflitantes. Informe uma única idade.');seen.add(k);data.age[k]=Number(a[1]);}}
 if(/sem tosse|nega tosse/.test(t))data.coughType='none';else if(/tosse seca|tosse irritativa/.test(t))data.coughType='dry';else if(/tosse produtiva|tosse com (?:catarro|secrecao)/.test(t))data.coughType='wet';else if(/tosse.*(?:latido|ladrante|estridor)/.test(t))data.coughType='barking';else if(/tosse.*chiado/.test(t))data.coughType='wheeze';else if(/tosse.*(?:guincho|crises)/.test(t))data.coughType='paroxysmal';else if(/tosse/.test(t))data.coughType='unknown';
 const coughDays=/tosse[^.;\n]{0,50}?(?:ha|durante|por)\s*(\d+)\s*dias?/.exec(t);if(coughDays)data.coughDays=Number(coughDays[1]);
 if(/sem sinais (?:respiratorios )?de alarme/.test(t))data.respiratoryAlarm='no';else if(/com sinais (?:respiratorios )?de alarme|dispneia|cianose/.test(t))data.respiratoryAlarm='yes';
 if(/sem dor|nega dor/.test(t))data.pain=false;else if(/\bdor\b|febre com desconforto/.test(t))data.pain=true;
 if(/sem vomitos|nega vomitos/.test(t))data.vomiting=false;else if(/vomitos/.test(t))data.vomiting=true;
 if(/contexto:\s*(?:unidade|observacao|pronto atendimento)/.test(t))data.careSetting='observed';else if(/contexto:\s*(?:hospital|internacao)/.test(t))data.careSetting='hospital';
 const justification=/justificativa\s*:\s*([^\n]+)/.exec(message);if(justification)data.rationale=justification[1].trim();
 const explicit=/diagnostico\s*[:=]?\s*([^.;\n]+)/.exec(t)?.[1]?.split(/,\s*(?:alerg|sem|funcao|peso|idade)/)[0].trim();
 const diagnosticText=explicit||t;
 const known=clinicalDiagnosisMatches(diagnosticText);
 const legacy=dxAliases.filter(([,r])=>r.test(diagnosticText)).map(([name])=>name);
 if(known.length===1){const canonical=known[0];data.diagnosis=dxAliases.find(([name])=>norm(name)===norm(canonical))?.[0]||canonical;}
 else if(known.length>1)warnings.push('Há mais de um diagnóstico reconhecido. Informe uma indicação por vez.');
 else if(explicit)data.diagnosis=dxAliases.find(([,rx])=>rx.exec(explicit)?.[0]===explicit)?.[0]||explicit;
 else if(legacy.length===1)data.diagnosis=legacy[0];else if(legacy.length>1)warnings.push('Há mais de um diagnóstico. Confirme uma indicação por vez.');
 if(/\b(?:grave|complicada|complicado|refrataria|refratario)\b/.test(diagnosticText))data.severe=true;
 for(const key of ['allergies','comorbidities']){const v=historyFromText(t,key,warnings);if(v!==undefined)data[key]=v;}
 {const known=[...t.matchAll(/\b(?:asma|diabetes|cardiopatia|epilepsia|imunossupressao|imunodeficiencia|doenca renal|doenca hepatica)\b/g)].filter(m=>!/(?:sem|nega)\s*$/.test(t.slice(Math.max(0,m.index-10),m.index))&&!norm(data.diagnosis||'').includes(m[0]));if(known.length){if(data.comorbidities==='nenhuma')warnings.push('Comorbidades contraditórias. Confirme a informação.');else if(data.comorbidities===undefined)data.comorbidities=[...new Set(known.map(m=>m[0]))].join(', ');}}
 for(const field of ['renal','hepatic']){const value=organFunctionFromText(t,field);if(value!==undefined)data[field]=value;}
 const notes=/\bobserva(?:ções|coes|ção|cao)\s*[:=]\s*([^\n]+)/i.exec(message);if(notes)data.notes=notes[1].trim();
 if(/\bpeso\s+ideal\b|\bbase\s+(?:do\s+)?peso\s*[:=]?\s*ideal\b/.test(t))data.basis='ideal informado';else if(/\bpeso\s+real\b|\bbase\s+(?:do\s+)?peso\s*[:=]?\s*real\b/.test(t))data.basis='real';
 if(data.weight!==undefined&&(data.weight<=0||data.weight>300))warnings.push('Peso fora da faixa operacional. Confirme a medida em kg.');
 if(data.weight!==undefined&&data.weight<3)warnings.push('Peso abaixo de 3 kg: confirme a medida; protocolos neonatais exigem avaliação específica.');
 return {data,warnings};
}
export function ageMonths(age){if(!age)throw Error('Informe a idade.');const y=number(age.years??0,{inclusive:true}),m=number(age.months??0,{inclusive:true}),d=number(age.days??0,{inclusive:true});if(![y,m,d].every(Number.isInteger)||y>120||m>120||d>366)throw Error('Revise a idade informada.');return y*12+m+d/30.4375;}
export function validateProtocol(p){
 if(!p?.regimenId)throw Error('Protocolo manual em quarentena: falta vínculo canônico de medicamento e apresentação documental. Texto livre, concentração declarada e referência não habilitam volume operacional.');
 for(const k of ['diagnosis','medicationId','name','presentation','reference','duration','instructions','contraindications','conditions'])if(typeof p[k]!=='string'||!p[k].trim()||p[k].length>3000)throw Error('Preencha '+k+'.');
 validateGuidance(p.guidance);
 if(p.regimenId){const r=regimens.find(r=>r.id===p.regimenId);if(!r)throw Error('Esquema estruturado inexistente.');if(p.therapyVersion!==THERAPY_VERSION)throw Error('A biblioteca terapêutica mudou. Revise novamente o protocolo.');if(Number(p.minMonths)<r.minMonths||Number(p.maxMonths)>r.maxMonths)throw Error('Faixa etária ultrapassa o esquema pesquisado.');if(p.medicationId!==r.medicationId)throw Error('Medicamento divergente do esquema estruturado.');const v=r.presentations[p.regimenPresentation||0];if(!v||p.presentation!==v.label)throw Error('Apresentação divergente do esquema estruturado.');for(const [k,value] of Object.entries({amount:v.amount,volume:v.volume,unit:r.unit,concentrationUnit:r.unit,interval:r.interval,single:!!r.single,dropFactor:v.dropFactor||''}))if(String(p.form?.[k]??'')!==String(value))throw Error('Parâmetro divergente do esquema estruturado: '+k+'.');if(v.dropFactor&&Math.abs(Number(p.form.step)-v.step)>1e-10)throw Error('A apresentação exige arredondamento para gotas inteiras.');if(r.durationOptions&&!r.durationOptions.includes(p.regimenDuration))throw Error('Duração fora da faixa pesquisada.');}
 if(!p.reviewClinical||!p.reviewPharmacy)throw Error('Registre as duas revisões profissionais.');
 if(p.route!=='ORAL')throw Error('Protocolos conversacionais nesta versão são restritos à via oral.');
 const min=number(p.minMonths,{inclusive:true}),max=number(p.maxMonths);if(min>=max||max>216)throw Error('Revise a faixa etária pediátrica.');
 if(!p.form?.maxDose&&!p.form?.maxDay)throw Error('O protocolo exige um teto absoluto por dose ou diário.');
 calculateDose({...p.form,weight:10});
 return {...p,diagnosis:norm(p.diagnosis).trim(),minMonths:min,maxMonths:max};
}
export function runProtocol(patient,p){
 patient=assertConfirmedHistory(patient);p=validateProtocol(p);const age=ageMonths(patient.age);const weight=number(patient.weight);
 if(weight>300||age<p.minMonths||age>p.maxMonths)throw Error('Idade ou peso fora do escopo do protocolo.');
 if(patient.allergies!=='nenhuma'||patient.comorbidities!=='nenhuma'||patient.renal!=='normal'||patient.hepatic!=='normal')throw Error('Este esquema exige revisão individual de alergias, comorbidades e função renal/hepática; a automação foi bloqueada.');
 if(norm(patient.diagnosis)!==p.diagnosis)throw Error('O diagnóstico não coincide com a indicação revisada.');
 if(p.regimenId){const regimen=regimens.find(r=>r.id===p.regimenId);if(regimen.requiresReason&&String(patient.rationale||'').length<20)throw Error('Informe justificativa individual: benefício esperado e plano de reavaliação.');const prepared=prepareRegimen(p.regimenId,{...patient,severe:patient.severe===true},p.regimenPresentation||0,p.regimenDuration||'');p={...p,name:prepared.name,form:prepared.form,duration:prepared.duration,presentation:prepared.presentation,reference:prepared.reference,contraindications:p.contraindications===prepared.contraindications?prepared.contraindications:prepared.contraindications+' '+p.contraindications,instructions:p.instructions===prepared.instructions?prepared.instructions:prepared.instructions+' '+p.instructions};}
 const r=calculateDose({...p.form,weight});
 // Independent path: compare administered source quantity in source units to the capped dose.
 const sourceQuantity=r.practicalVolume/number(p.form.volume)*number(p.form.amount);
 const reversed=convert(sourceQuantity,p.form.concentrationUnit,p.form.unit);
 if(!Number.isFinite(reversed)||Math.abs(reversed-r.administered)>1e-7||Math.abs((reversed-r.capped)/r.capped)>0.05000001)throw Error('Inconsistência na conferência reversa.');
 if(r.cap!==null&&reversed>r.cap+1e-7)throw Error('A dose ultrapassa o máximo.');
 const finalBlock=`RECEITUÁRIO\nDiagnóstico informado: ${patient.diagnosis}\nPeso ${patient.basis}: ${fmt(weight)} kg · idade: ${patient.age.years||0} a, ${patient.age.months||0} m, ${patient.age.days||0} d\nAlergias: ${historyLabel(patient,'allergies')}\nComorbidades: ${historyLabel(patient,'comorbidities')}\n\n${p.name} — ${p.presentation}\nUSO ${p.route}\nAdministrar ${fmt(r.practicalVolume,4)} mL${r.single?' em dose única':' a cada '+fmt(r.interval)+' horas'}, ${p.duration}.\n${p.instructions}\nRestrições: ${p.contraindications}\n\n${guidanceText(p.guidance)}`;assertFinalClinicalText(finalBlock);
 return {result:r,protocolVersion:p.version,engineVersion:ENGINE_VERSION,finalBlock,text:`RASCUNHO PARA REVISÃO MÉDICA\n\nDiagnóstico informado: ${patient.diagnosis}\nPeso ${patient.basis}: ${fmt(weight)} kg · idade: ${patient.age.years||0} a, ${patient.age.months||0} m, ${patient.age.days||0} d\nAlergias: ${historyLabel(patient,'allergies')}\nComorbidades: ${historyLabel(patient,'comorbidities')}\n\n${p.name}\n${p.presentation} · uso ${p.route.toLowerCase()}\nReferência: ${p.form.dose} ${p.form.unit}/${p.form.basis==='kg-day'?'kg/dia':p.form.basis==='kg-dose'?'kg/dose':'dose'}\nDose calculada: ${fmt(r.administered,4)} ${r.unit}\nVolume: ${fmt(r.practicalVolume,4)} mL por dose\n${r.single?'Dose única':'Intervalo: '+fmt(r.interval)+' horas'}\nDuração: ${p.duration}\nMáximo por dose: ${p.form.maxDose||'não informado'} ${r.unit}; diário: ${p.form.maxDay||'não informado'} ${r.unit}\nReversa: ${fmt(reversed,4)} ${r.unit} = ${fmt(reversed/weight,4)} ${r.unit}/kg/dose\n\nOrientações: ${p.instructions}\nRestrições: ${p.contraindications}\n\nFonte: ${p.reference}\nProtocolo: ${p.version} · motor ${ENGINE_VERSION}\nRevisar e assinar antes do uso. Não há assinatura digital.\n\n${finalBlock}`};
}
const help='PRESCRIÇÃO INTEGRAL\n/nova — iniciar paciente\n/prescricao — informar dados\n/dose — cálculo pelo protocolo revisado\n/diagnosticos — indicações com esquema aprovado\n/cancelar — apagar contexto\n\nEx.: peso 18 kg, idade 4 anos, diagnóstico otite média aguda.\nAlergias, comorbidades e funções renal/hepática omitidas permanecem não informadas. Registre ausência apenas quando conhecida e explicitamente informada. Dados ausentes ou desconhecidos não habilitam prescrição automática. Não envie nome ou documento do paciente.\nToda interpretação precisa de confirmação. A sessão expira em 15 minutos.';
export function respond(message,previous,protocols=[],now=Date.now()){
 const command=norm(message).trim();let session=previous&&now-previous.updated<SESSION_TTL?structuredClone(previous):null;
 if(session?.data)session.data=withClinicalDefaults(session.data);
 const fresh=()=>({id:crypto.randomUUID(),data:{},updated:now,phase:'collect'});
 if(['/nova','/cancelar'].includes(command))return {session:fresh(),code:'reset',text:command==='/nova'?'Novo paciente. O contexto anterior foi apagado. Informe peso, idade e diagnóstico.':'Atendimento cancelado. Dados clínicos anteriores apagados.'};
 if(command==='/ajuda')return {session,code:'help',text:help};
 if(command==='/diagnosticos')return {session,code:'list',text:protocols.length?'Indicações com protocolo revisado:\n'+[...new Set(protocols.map(p=>p.diagnosis))].join('\n'):'Ainda não há protocolos aprovados para prescrição automática. Os capítulos documentais estão disponíveis no site.'};
 if(/^(gerar pdf|pdf|\/pdf)$/.test(command))return {session,code:'pdf_unavailable',text:'PDF pelo WhatsApp ainda não está habilitado. Use Imprimir → Salvar como PDF no site.'};
 if(!session)session=fresh();
 if(command==='confirmar peso'&&session.phase==='weight-confirm'){session.weightConfirmed=true;session.phase='collect';return respond('',session,protocols,now);}
 if(command==='confirmar'||command==='confirmo'){
  if(session.phase==='confirm'){
   const missing=required(session.data);if(missing.length)return {session,code:'missing',text:'Informe: '+missing.join('; ')+'.'};
   const matches=protocols.filter(p=>norm(p.diagnosis)===norm(session.data.diagnosis));
   if(matches.length!==1)return {session:{...session,phase:'collect',updated:now},code:'no_protocol',text:matches.length?'Há mais de um esquema revisado para essa indicação. Selecione o esquema no site.':'Dados confirmados. Ainda não existe um esquema clínico aprovado para essa indicação no motor central. Nenhuma dose foi calculada. Consulte as fontes e revise o protocolo no site.'};
   const p=matches[0];session.phase='clinical';session.protocolId=p.id;session.protocolVersion=p.version;session.updated=now;
   return {session,code:'clinical_confirmation',text:`Antes do cálculo, confirme a aplicabilidade deste esquema:\n${p.conditions}\n\nContraindicações/restrições: ${p.contraindications}\nFonte: ${p.reference}\n\n${guidanceText(p.guidance,{draft:true})}\n\nSe verificou indicação, contraindicações, interações, apresentação e todas as orientações de alta, responda CONFERIDO. Caso contrário, use /cancelar.`};
  }
  return {session,code:'confirmation_needed',text:'Informe ou revise os dados do paciente antes de confirmar.'};
 }
 if(command==='conferido'&&session.phase==='clinical'){
  const p=protocols.find(p=>p.id===session.protocolId&&p.version===session.protocolVersion);
  if(!p)return {session:fresh(),code:'version_changed',text:'O protocolo foi atualizado. Inicie novamente para conferir a versão atual.'};
  try{const out=runProtocol(session.data,p);return {session:{...fresh(),phase:'complete'},code:'prescription',text:out.text,protocolVersion:p.version};}catch(e){return {session:{...session,phase:'collect',updated:now},code:'blocked',text:'Cálculo bloqueado: '+e.message};}
 }
 const extracted=extractClinical(message);
 // A completed case never contributes data to another patient. A fresh full case also clears the previous context.
 if(session.phase==='complete'||(extracted.data.weight!==undefined&&extracted.data.age&&extracted.data.diagnosis))session=fresh();
 if(extracted.data.weight!==undefined&&extracted.data.weight!==session.data.weight)session.weightConfirmed=false;
 session.data=mergeClinical(session.data,extracted.data);session.updated=now;session.phase='collect';
 const criticalWarnings=extracted.warnings.filter(w=>!w.startsWith('Peso abaixo de 3 kg'));
 if(criticalWarnings.length)return {session:fresh(),code:'ambiguous',text:criticalWarnings.join('\n')+'\nOs parâmetros ambíguos foram descartados. Reenvie os dados completos e inequívocos, com unidades.'};
 if(session.data.weight<3&&!session.weightConfirmed){session.phase='weight-confirm';return {session,code:'weight_confirmation',text:'Você informou '+fmt(session.data.weight)+' kg. Confirme a medida digitando CONFIRMAR PESO ou reenvie o caso completo corrigido. Nenhum cálculo foi realizado.'};}
 const missing=required(session.data);if(missing.length)return {session,code:'missing',text:'Informe: '+missing.join('; ')+'.'};
 try{ageMonths(session.data.age);number(session.data.weight);}catch(e){return {session,code:'invalid',text:e.message};}
 session.phase='confirm';const d=session.data;return {session,code:'confirm',text:`Confirme os dados reconhecidos:\nPeso ${d.basis}: ${fmt(d.weight)} kg\nIdade: ${d.age.years||0} anos, ${d.age.months||0} meses, ${d.age.days||0} dias\nDiagnóstico: ${d.diagnosis}\nAlergias: ${historyLabel(d,'allergies')}\nComorbidades: ${historyLabel(d,'comorbidities')}\nFunção renal: ${historyLabel(d,'renal')}\nFunção hepática: ${historyLabel(d,'hepatic')}\nObservações: ${d.notes||'não informadas'}\n${d.coughType?'Tosse: '+coughTypes[d.coughType]+(d.coughDays?' · '+d.coughDays+' dias':''):''}\n\nResponda CONFIRMAR ou reenvie a correção. /nova inicia outro paciente.`};
}
function required(d){return [['weight','peso atual em kg'],['age','idade com unidade (anos, meses ou dias)'],['diagnosis','diagnóstico/indicação'],['allergies','alergias registradas como desconhecidas'],['comorbidities','comorbidades registradas como desconhecidas'],['renal','função renal registrada como desconhecida'],['hepatic','função hepática registrada como desconhecida']].filter(([k])=>d[k]===undefined||d[k]===''||(['allergies','comorbidities','renal','hepatic'].includes(k)&&historyUnconfirmed(d,k))).map(([,l])=>l);}
