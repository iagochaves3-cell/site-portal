import {scores,calculate,validate,REVIEW_DATE} from './scores.mjs';
const PRIORITY_SPECIALTIES=['Pediatria','Dermatologia','Cirurgia geral','Clínica médica','Reumatologia','Cardiologia','Pneumologia','Infectologia'];
const app=document.getElementById('app');
const navigation=document.getElementById('specialties');
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView({block:'start'});});
const availableSpecialties=[...new Set(scores.flatMap(s=>s.specialties||[s.specialty]))];
const specialties=[...PRIORITY_SPECIALTIES.filter(s=>availableSpecialties.includes(s)),...availableSpecialties.filter(s=>!PRIORITY_SPECIALTIES.includes(s)).sort((a,b)=>a.localeCompare(b,'pt-BR'))];
const conditions=[...new Set(scores.flatMap(s=>s.conditions||[]))].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
const inCategory=(score,cat)=>cat==='Todas as especialidades'||(score.specialties||[score.specialty]).includes(cat);
const canonicalCategory=cat=>/^terapia intensiva$/i.test(cat)?'Terapia Intensiva':cat;
const populationGroups=[['neonatal','RN e neonatos','Até 28 dias de vida'],['pediatria','Pediatria geral','De 29 dias a menos de 18 anos'],['adultos','Adultos','18 anos ou mais']];
let catalogReturnHash='#';
document.querySelector('meta[name=description]')?.setAttribute('content',scores.length+' escores clínicos em '+specialties.length+' especialidades, com critérios explícitos, interpretação prática, memória de cálculo e fontes.');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[₂]/g,'2').replace(/[^a-z0-9]+/g,' ').trim();
const fmt=v=>Number(v).toLocaleString('pt-BR',{maximumFractionDigits:4});
let category='Todas as especialidades',query='',condition='',current=null,values=Object.create(null),result=null,tab='calcular',eligible=false,secondaryPreviewBlocked=false;

// Presentation-only, explicitly reviewed allowlist. Never infer clinical answers.
const PREPARATION_UI = {"is-wernovsky-1995":{"attestations":["native_units"],"fixed":{}},"vis-gaies-2010":{"attestations":["native_units"],"fixed":{}},"nsofa-neonatal":{"attestations":["snapshot_confirmed","latest_platelet_confirmed"],"fixed":{}},"phoenix8-author-113":{"attestations":["contemporaneousConfirmed"],"fixed":{"profile":"phoenix8-author-arithmetic-1.1.3-strict-completeness","preparation":"manual-contemporaneous-release113"}},"fss-pediatric-cpccrn":{"attestations":["age_appropriate_coding","same_person_confirmed","same_episode_confirmed","baseline_source_adjudicated","baseline_age_appropriate_coding"],"fixed":{"profile":"cpccrn-topicc-3.00-2011-unweighted","baseline_profile":"cpccrn-topicc-3.00-2011-unweighted"}},"pcpc-pediatric-br2023":{"attestations":["professional_adjudication","development_reviewed"],"fixed":{"profile":"pcpc-popc-br2023-factual"}},"popc-pediatric-br2023":{"attestations":["professional_adjudication","development_reviewed"],"fixed":{"profile":"pcpc-popc-br2023-factual"}},"trips-neonatal-2001":{"attestations":["clinicalMeasurementsConfirmed","responseAdjudicated"],"fixed":{"profile":"TRIPS-2001-literal-restricted-v1"}},"jadas10-esr-2021":{"attestations":["professionalAssessmentConfirmed","sameAssessmentConfirmed"],"fixed":{"profile":"jadas10-esr-cjadas10-manual-2021-v1","version":"jadas10-esr"}},"cjadas10-2021":{"attestations":["professionalAssessmentConfirmed","sameAssessmentConfirmed"],"fixed":{"profile":"jadas10-esr-cjadas10-manual-2021-v1","version":"cjadas10"}},"cisne-adult-finite2012":{"attestations":["sameEpisodeInitialDataConfirmed","professionalAdjudicationConfirmed","initialGlucoseReviewed","diabetesStatusReviewed","alternativeGlucoseCausesReviewed","finite2012PreparationConfirmed"],"fixed":{"profile":"cisne-2015-adjudicated-finite2012-v1"}},"prism-iv-prepared-2016":{"attestations":["sameAdmissionConfirmed","professionalAdjudicationConfirmed","ageBandAtAdmissionReviewed","samplingCaseReviewed","physiologicalMissingPolicyReviewed","noMissingNormalImputationConfirmed","neurologicalConfoundersReviewed","eligibleMeasurementSourcesReviewed","primarySystemReviewed"],"fixed":{"profile":"prism-iv-2016-table3-concordant-prepared-v2"}},"wpcdai-2012-literal":{"attestations":["professionalAdjudicationConfirmed","sameAssessmentConfirmed","weightReferenceIntervalReviewed","noMissingNormalImputationConfirmed"],"fixed":{"profile":"wpcdai-2012-naspghan2014-literal-point-v1"}},"risc-malawi-muac-2016":{"attestations":["samePatientEpisodeConfirmed","professionalAdjudicationConfirmed","noMissingImputationConfirmed","spo2MeasurementValidConfirmed","muacMeasurementValidConfirmed","wheezeAssessedConfirmed","unconsciousnessAdjudicatedConfirmed"],"fixed":{"profile":"risc-malawi-muac-2016-literal-v1"}},"oakland-complete-bsg2019":{"attestations":["samePatientEpisodeConfirmed","professionalReviewConfirmed","measurementsValidConfirmed","noMissingImputationConfirmed"],"fixed":{"profile":"oakland-complete-bsg2019-literal-v1"}},"prepare-pneumonia-mortality-2022":{"attestations":["samePatientEpisodeConfirmed","professionalAdjudicationConfirmed","noMissingImputationConfirmed","measurementsValidConfirmed","wazDemographicsConsistentConfirmed","clinicalSignsAdjudicatedConfirmed"],"fixed":{"profile":"prepare-pneumonia-mortality-2022-table3-literal-v1"}},"feast-pet-2015":{"attestations":["sameChildEpisodeConfirmed","professionalAdjudicationConfirmed","noMissingImputationConfirmed","measurementsValidConfirmed","consciousnessAdjudicatedConfirmed","respiratoryFindingsAdjudicatedConfirmed","pallorPulseAdjudicatedConfirmed"],"fixed":{"profile":"feast-pet-2015-clinical-v1"}},"pecarn-cervical-lee2025":{"attestations":["sameEpisodeAssessmentConfirmed","professionalAdjudicationConfirmed","knownFindingsValidConfirmed","examinationLimitationsReviewedConfirmed","noMissingImputationConfirmed"],"fixed":{"profile":"pecarn-cervical-lee2025-manual-v1"}},"edacs-clinical-2014":{"attestations":["sameEpisodeConfirmed","professionalRubricReviewConfirmed","patientReportReliableConfirmed","noMissingImputationConfirmed"],"fixed":{"profile":"edacs-clinical-2014-2016-manual-v1"}}};
let attestationReceipt=null;
const preparationRule=()=>PREPARATION_UI[current?.id]||{attestations:[],fixed:{}};
const attestationFields=()=>current.fields.filter(f=>preparationRule().attestations.includes(f.id)&&fieldActive(f));
const explicitYes=v=>v===1||v==='1';
function observationSignature(){return JSON.stringify(Object.keys(values).sort().map(k=>[k,values[k]]));}
function receiptCurrent(){return !!attestationReceipt&&attestationReceipt.id===current?.id&&attestationReceipt.signature===observationSignature();}
function presentedFields(){const rule=preparationRule();return current.fields.filter(f=>{
 if(rule.attestations.includes(f.id))return Object.hasOwn(values,f.id)&&!explicitYes(values[f.id]);
 if(Object.hasOwn(rule.fixed,f.id))return Object.hasOwn(values,f.id)&&values[f.id]!==rule.fixed[f.id];
 return true;
});}
function calculationValues(){const prepared=Object.assign(Object.create(null),values),rule=preparationRule();
 for(const f of current.fields){if(!fieldActive(f))continue;if(Object.hasOwn(rule.fixed,f.id)&&!Object.hasOwn(prepared,f.id))prepared[f.id]=rule.fixed[f.id];}
 if(eligible&&receiptCurrent())for(const f of attestationFields())if(!Object.hasOwn(prepared,f.id)||explicitYes(prepared[f.id]))prepared[f.id]=1;
 return prepared;
}
function fixedIdentityHtml(){const rule=preparationRule();const fields=current.fields.filter(f=>Object.hasOwn(rule.fixed,f.id)&&fieldActive(f));return fields.length?'<br><b>Identidade fixa do instrumento</b><br>'+fields.map(f=>esc(f.label+': '+f.options[0].label+'. '+(f.hint||''))).join('<br>'):'';}
function eligibilityText(){const original=current.eligibilityConfirmation||'Confirmei que o caso atende aos critérios de aplicação descritos acima.';const fields=attestationFields();if(!fields.length)return esc(original);return esc(original)+'<br>Ao marcar esta confirmação, declaro cumpridos TODOS os requisitos abaixo. Não marque se algum requisito estiver desconhecido ou não atendido. Isto não preenche nem presume os achados clínicos.<br>'+fields.map((f,i)=>esc((i+1)+'. '+f.label.replace(/\?$/u,'.')+' '+(f.hint||''))).join('<br>');}
function confirmPreparation(checked){attestationReceipt=null;eligible=checked;
 if(checked){const conflict=attestationFields().find(f=>Object.hasOwn(values,f.id)&&!explicitYes(values[f.id]));if(conflict){eligible=false;attestationReceipt=null;document.getElementById('eligible').checked=false;document.getElementById('errors').textContent='Há um requisito com resposta negativa ou desconhecida. Revise o campo '+conflict.label+'; a confirmação conjunta não substitui essa resposta.';return;}
 attestationReceipt={id:current.id,signature:observationSignature()};}
}

function renderNav(){navigation.innerHTML=['Todas as especialidades',...specialties].map((cat,i)=>`<button type="button" class="navbtn ${category===cat?'active':''}" data-category="${esc(cat)}" aria-pressed="${category===cat}"><span>${esc(cat)}</span><span class="navcount">${i?scores.filter(s=>inCategory(s,cat)).length:scores.length}</span></button>`).join('');navigation.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{query='';condition='';category=b.dataset.category;location.hash=category==='Todas as especialidades'?'':`especialidade/${encodeURIComponent(category)}`;if(!current)renderCatalog();}));}
function clearCatalogFilters(){query='';condition='';category='Todas as especialidades';location.hash='';renderCatalog();}
function renderCatalog(){
 current=null;values=Object.create(null);result=null;eligible=false;attestationReceipt=null;secondaryPreviewBlocked=false;document.title='Escores Clínicos';renderNav();
 app.innerHTML=`<section class="intro"><div><span class="kicker">DECISÃO CLÍNICA, COM CONTEXTO</span><h1>Encontre o escore.<br>Entenda o resultado.</h1><p>Escolha um diagnóstico, síndrome ou contexto para ver os instrumentos relacionados por finalidade.</p></div><div class="countmark">${scores.length} instrumentos · ${specialties.length} especialidades</div></section>
 <div class="condition-controls"><div><label class="condition-label" for="condition">Diagnóstico ou condição</label><select id="condition" class="condition-select" aria-describedby="condition-help"><option value="" ${condition?'':'selected'}>Todos os diagnósticos e condições</option>${conditions.map(name=>`<option value="${esc(name)}" ${condition===name?'selected':''}>${esc(name)}</option>`).join('')}</select></div><button type="button" class="secondary" id="clear-filters">Limpar filtros</button></div>
 <p class="condition-help" id="condition-help">Lista A–Z de diagnósticos, síndromes e contextos presentes neste catálogo. A seleção consulta todas as especialidades. Alguns instrumentos têm mais de uma finalidade.</p>
 <label class="sr-only" for="search">Buscar escore, condição ou especialidade</label><input class="search" id="search" type="search" placeholder="Ex.: Alvarado, apendicite, PRAM, sepse…" value="${esc(query)}" autocomplete="off" aria-describedby="search-help"><p class="condition-help" id="search-help"></p>
 <div class="listhead"><h2 id="catalog-title">Todos os instrumentos</h2><span id="found" aria-live="polite"></span></div><div id="catalog" class="grid"></div><p class="note">Cada instrumento inclui critérios de aplicação, memória de cálculo e referências. Catálogo em expansão: não corresponde a todos os escores existentes nem a uma extração integral do Whitebook.</p>`;
 document.getElementById('search').addEventListener('input',e=>{query=e.target.value;renderCards();});
 document.getElementById('condition').addEventListener('change',e=>{condition=e.target.value;query='';category='Todas as especialidades';history.replaceState(null,'',condition?'#condicao/'+encodeURIComponent(condition):'#');document.getElementById('search').value='';renderNav();renderCards();});
 document.getElementById('clear-filters').addEventListener('click',clearCatalogFilters);renderCards();
}
function scoreCardHtml(s){const heading=condition||(!normalize(query)&&category!=='Todas as especialidades')?'h4':'h3';return `<a class="score-card" href="#score/${s.id}"><div class="cardtop"><span class="cardtag">${esc((s.specialties||[s.specialty]).join(' · '))}</span><span class="cardnum">${String(scores.indexOf(s)+1).padStart(2,'0')}</span></div><${heading}>${esc(s.name)}</${heading}><ul class="clinical-keywords" aria-label="Condições e usos clínicos">${(s.keywords||[]).map(keyword=>`<li>${esc(keyword)}</li>`).join('')}</ul><p>${esc(s.subtitle)}</p><div class="cardfoot"><span>${esc(s.population)}</span><b>${esc(s.range)} ${esc(s.unit||'pontos')}</b></div></a>`;}
function renderCards(){
 catalogReturnHash=condition?'#condicao/'+encodeURIComponent(condition):category==='Todas as especialidades'?'#':'#especialidade/'+encodeURIComponent(category);
 const tokens=normalize(query).split(' ').filter(Boolean);
 const found=scores.filter(s=>{
  if(condition&&!(s.conditions||[]).includes(condition))return false;
  if(!tokens.length)return condition?true:inCategory(s,category);
  const text=normalize([s.name,s.subtitle,s.population,...(s.specialties||[s.specialty]),...(s.aliases||[]),...(s.keywords||[]),...(s.searchTerms||[]),...(s.conditions||[])].join(' '));
  const compact=text.replace(/ /g,'');
  return tokens.every(token=>text.includes(token)||compact.includes(token));
 }).sort((a,b)=>{
  const q=normalize(query),rank=s=>normalize(s.name)===q?0:normalize(s.name).startsWith(q)?1:2;
  return (tokens.length?rank(a)-rank(b):0)||a.name.localeCompare(b.name,'pt-BR');
 });
 document.getElementById('search-help').textContent=condition?`A busca refina os instrumentos de ${condition}. Trocar a condição limpa o texto de busca.`:'A busca consulta todas as especialidades.';
 document.getElementById('catalog-title').textContent=condition?condition:tokens.length?'Resultados em todas as especialidades':category==='Todas as especialidades'?'Todos os instrumentos':category;
 document.getElementById('found').textContent=`${found.length} ${found.length===1?'instrumento':'instrumentos'}${condition?' · por finalidade':''}`;
 const container=document.getElementById('catalog');container.className=found.length?(condition?'catalog-groups':'grid'):'';
 if(!found.length){container.innerHTML='<div class="empty"><h2>Nenhum instrumento encontrado</h2><p>Tente outro termo ou limpe a condição selecionada.</p><button class="secondary" id="clear-search">Limpar busca e filtros</button></div>';document.getElementById('clear-search').addEventListener('click',clearCatalogFilters);return;}
 if(!condition&&!tokens.length&&category!=='Todas as especialidades'){
  container.className='catalog-groups';
  container.innerHTML='<p class="population-help">Selecione uma população. Os limites específicos de idade e aplicação constam em cada ficha; um escore pode aparecer em mais de um grupo.</p>'+populationGroups.map(([id,title,age])=>{
   const members=found.filter(s=>s.populationGroups.includes(id));
   return `<details class="population-group" name="catalog-population" data-population="${id}"><summary><span><h3>${title}</h3><span class="population-age">${age}</span></span><span class="population-count">${members.length} ${members.length===1?'escore':'escores'}</span></summary><div class="population-content">${members.length?`<div class="grid">${members.map(scoreCardHtml).join('')}</div>`:'<p class="population-empty">Nenhum escore cadastrado para esta população nesta especialidade.</p>'}</div></details>`;
  }).join('');
  return;
 }
 if(!condition){container.innerHTML=found.map(scoreCardHtml).join('');return;}
 const purposes=[...new Set(found.flatMap(s=>s.purposes))].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
 container.innerHTML=purposes.map((purpose,i)=>`<section class="purpose-group" aria-labelledby="purpose-${i}"><h3 class="purpose-heading" id="purpose-${i}">${esc(purpose)}</h3><div class="grid">${found.filter(s=>s.purposes.includes(purpose)).map(scoreCardHtml).join('')}</div></section>`).join('');
}
function fieldActive(f){return !f.activeWhen||String(values[f.activeWhen.field]??current.fieldDefaults?.[f.activeWhen.field]??'')===String(f.activeWhen.value);}
function fieldHtml(f){const v=values[f.id]??f.defaultValue??'';const active=fieldActive(f);return `<label ${active?'':'hidden'} class="field" id="field-${f.id}" for="input-${f.id}"><span class="field-label">${esc(f.label)}</span>${f.type==='select'?`<select id="input-${f.id}" name="${f.id}" ${active?'required':'disabled'} ${f.hint?`aria-describedby="hint-${f.id}"`:''}><option value="">Selecionar…</option>${f.options.map(o=>`<option value="${esc(o.value)}" ${String(v)===String(o.value)?'selected':''}>${esc(o.label)}${o.value==='NT'||f.id==='scale'||f.noPoints?'':` · ${fmt(o.value)} pt`}</option>`).join('')}</select><small class="selected-option" id="selection-${f.id}">${esc(f.options.find(o=>String(o.value)===String(v))?.label||'')}</small>`:`<input id="input-${f.id}" name="${f.id}" type="text" inputmode="${current?.id==='pim3'&&f.type==='number'&&['sbp','fio2','pao2','be'].includes(f.id)&&f.allowND===true?'text':f.step===1?'numeric':'decimal'}" value="${esc(v)}" placeholder="${esc(f.placeholder??`${f.min} a ${f.max}`)}" ${active?'required':'disabled'} ${f.hint?`aria-describedby="hint-${f.id}"`:''}>`}${f.hint?`<small id="hint-${f.id}">${esc(f.hint)}</small>`:''}</label>`;}
function renderScore(){document.title=`${current.name} · Escores Clínicos`;renderNav();app.innerHTML=`<a class="back" href="${catalogReturnHash}">Voltar ao catálogo</a><section class="scoreheader"><span class="pill">${esc(current.specialty)}</span><span class="pill">${esc(current.population)}</span><h1>${esc(current.name)}</h1><p>${esc(current.subtitle)}</p></section><div class="workarea"><section class="formsurface"><div class="tabs" role="tablist" aria-label="Informações do escore">${[['calcular','Calculadora'],['interpretar','Aplicação clínica'],['fontes','Referências']].map(([id,label])=>`<button class="tab ${tab===id?'active':''}" id="tab-${id}" role="tab" aria-selected="${tab===id}" aria-controls="panel" tabindex="${tab===id?'0':'-1'}" data-tab="${id}">${label}</button>`).join('')}</div><div class="tabpanel" id="panel" role="tabpanel" aria-labelledby="tab-${tab}"></div></section><aside class="result" id="result" aria-label="Resultado do escore" aria-live="polite"></aside></div><p class="note">Conferência documental e testes automatizados em ${current?.reviewDate||REVIEW_DATE}. Implementação assistida por IA; sem homologação clínica independente. Não inserir identificadores de pacientes.</p>`;app.querySelectorAll('[data-tab]').forEach(b=>{b.addEventListener('click',()=>{tab=b.dataset.tab;renderScore();document.getElementById('tab-'+tab).focus();});b.addEventListener('keydown',e=>{const ids=['calcular','interpretar','fontes'];let i=ids.indexOf(tab);if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;tab=ids[i];renderScore();document.getElementById('tab-'+tab).focus();}});});renderPanel();renderResult();}
function renderPanel(){const panel=document.getElementById('panel');if(current.calculationSuspended&&tab!=='fontes'){panel.innerHTML=`<div class="reading"><h3>Cálculo suspenso</h3><p>${esc(current.calculationSuspensionReason)}</p><h3>População e contexto</h3><p>${esc(current.scope)}</p><p>Consulte a aba Referências. Esta ficha não fornece resultado calculado enquanto estiver suspensa.</p></div>`;return;}if(tab==='calcular'){let group='';panel.innerHTML=`<div class="scope"><b>Quando aplicar</b>${esc(current.scope)}${fixedIdentityHtml()}</div><form id="score-form" novalidate>${presentedFields().map(f=>{let heading='';if(fieldActive(f)&&f.group&&group!==f.group){group=f.group;heading=`<h2 class="group-title">${esc(group)}</h2>`;}return heading+fieldHtml(f);}).join('')}<label class="gate"><input id="eligible" type="checkbox" ${eligible?'checked':''}><span>${eligibilityText()}</span></label><div id="errors" class="error" role="alert"></div><div class="actions"><button type="submit" class="primary">Calcular escore</button><button type="button" class="secondary" id="reset">Limpar dados</button></div></form>`;for(const f of presentedFields()){document.getElementById('input-'+f.id).addEventListener(f.type==='select'?'change':'input',e=>{values[f.id]=f.type==='number'?e.target.value.trim().replace(',','.'):e.target.value;if(preparationRule().attestations.length){eligible=false;document.getElementById('eligible').checked=false;}attestationReceipt=null;result=null;secondaryPreviewBlocked=false;if(f.type==='select')document.getElementById('selection-'+f.id).textContent=f.options.find(o=>String(o.value)===String(e.target.value))?.label||'';document.getElementById('field-'+f.id).classList.remove('invalid');document.getElementById('input-'+f.id).removeAttribute('aria-invalid');document.getElementById('errors').textContent='';if(f.refreshFields){renderPanel();document.getElementById('input-'+f.id).focus();}renderResult();});}document.getElementById('eligible').addEventListener('change',e=>{document.getElementById('errors').textContent='';confirmPreparation(e.target.checked);result=null;secondaryPreviewBlocked=false;renderResult();});document.getElementById('score-form').addEventListener('submit',e=>{e.preventDefault();runCalculation();});document.getElementById('reset').addEventListener('click',()=>{values=Object.assign(Object.create(null),current.fieldDefaults||{});eligible=false;attestationReceipt=null;result=null;secondaryPreviewBlocked=false;renderScore();});}else if(tab==='interpretar'){panel.innerHTML=`<div class="reading"><h3>População e contexto</h3><p>${esc(current.scope)}${fixedIdentityHtml()}</p><h3>Como calcular</h3><div class="formula">${esc(current.formula)}</div>${current.bands?`<h3>Faixas de interpretação</h3><ul>${current.bands.map((b,i)=>`<li><strong>${esc(b[1])}</strong> · ${i===0?'até ': 'acima de '+fmt(current.bands[i-1][0])+' até '}${fmt(b[0])} pontos. ${esc(b[3])}</li>`).join('')}</ul>`:''}<h3>Limites e cuidados</h3><p>${esc(current.limits)}</p></div>`;}else{panel.innerHTML=`<div class="reading"><h3>Referências do instrumento</h3><ul class="references">${current.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ul><p>Conferência: ${current?.reviewDate||REVIEW_DATE}. Consulte a versão identificada antes de comparar resultados obtidos por outro sistema.</p><p>Os textos de interpretação são sínteses. As páginas externas pertencem aos respectivos autores e instituições.</p></div>`;}}
function runCalculation(){if(current.calculationSuspended){result=null;renderResult();return;}const prepared=calculationValues(),errors=validate(current,prepared);if(errors.length||!eligible){result=null;renderResult();const visibleErrors=errors.filter(id=>document.getElementById('input-'+id));document.getElementById('errors').textContent=visibleErrors.length?'Preencha ou corrija: '+visibleErrors.map(id=>current.fields.find(f=>f.id===id).label).join('; ')+'.':'Confirme os critérios e requisitos de aplicação descritos nesta ficha.';visibleErrors.forEach(id=>{document.getElementById('field-'+id).classList.add('invalid');document.getElementById('input-'+id).setAttribute('aria-invalid','true');});if(visibleErrors.length)document.getElementById('input-'+visibleErrors[0]).focus();else document.getElementById('eligible').focus();return;}result=calculate(current.id,prepared);renderResult();if(matchMedia('(max-width:950px)').matches)document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});}

function copiedFieldValue(field){
 if(Array.isArray(result?.notApplicable)&&result.notApplicable.includes(field.id))return 'Não se aplica ao contexto/ramo';
 const value=calculationValues()[field.id];
 if(Object.hasOwn(preparationRule().fixed,field.id))return 'Identidade fixa do instrumento: '+field.options[0].label;
 if(preparationRule().attestations.includes(field.id)&&eligible&&receiptCurrent())return 'Requisito atestado explicitamente em conjunto';
 if(value===undefined||value===null||value==='')return 'Não informado; verificar aplicabilidade na ficha';
 return field.type==='select'?(field.options.find(option=>String(option.value)===String(value))?.label??'Valor não reconhecido'):String(value);
}
function resultText(){return `${current.name}: ${result.total===null?((current.categorical||current.categoricalOnIneligible)?(result.displayValue??'total não calculável'):'total não calculável'):(result.displayValue??fmt(result.total))+' '+(current.unit||'pontos')}\n${result.label}\n${result.action}${(result.alerts||[]).map(a=>'\nAlerta: '+a).join('')}\nMemória de cálculo: ${result.audit}\nDados: ${current.fields.filter(fieldActive).map(f=>f.label+': '+copiedFieldValue(f)).join('; ')}\nLimites: ${current.limits}\nReferências: ${current.sources.map(s=>s.url).join(' | ')}\nConferência documental: ${current?.reviewDate||REVIEW_DATE}.`;}
function renderResult(){const box=document.getElementById('result');if(!box)return;if(current.calculationSuspended){box.className='result';box.innerHTML=`<p class="eyebrow">RESULTADO</p><div class="result-placeholder" aria-hidden="true">—</div><h2>Cálculo indisponível</h2><p>${esc(current.calculationSuspensionReason)}</p>`;return;}box.className='result'+(result?' '+result.level:'');if(!result||result.webRequestIncomplete===true){const invalid=validate(current,calculationValues());const count=presentedFields().filter(fieldActive).filter(field=>Object.hasOwn(values,field.id)&&values[field.id]!==undefined&&values[field.id]!==null&&values[field.id]!==''&&!invalid.includes(field.id)).length;const partial=current.assessPartial?.(calculationValues());const pendingAlerts=[...new Set([partial?.alert,...(result?.alerts||[])].filter(Boolean))];const pendingLevel=partial?.level==='high'||result?.level==='high'?'high':partial?.level||result?.level;if(pendingLevel)box.className='result '+pendingLevel;box.innerHTML=`<p class="eyebrow">RESULTADO</p><div class="result-placeholder" aria-hidden="true">—</div><h2>Aguardando dados</h2>${pendingAlerts.map(alert=>`<p class="critical-alert" role="alert">${esc(alert)}</p>`).join('')}${(eligible&&!secondaryPreviewBlocked?(partial?.secondary||[]):[]).map(item=>`<section class="secondary-observation"><h3>${esc(item.label)}</h3><p>${esc(item.text)}</p></section>`).join('')}<p class="pending">${count} de ${presentedFields().filter(fieldActive).length} campos preenchidos. Complete os critérios e selecione “Calcular escore”.</p><div class="audit">As respostas não são presumidas. Qualquer alteração invalida o resultado anterior.</div>`;return;}box.innerHTML=`<p class="eyebrow">${esc(current.name.toUpperCase())}</p><div class="result-number${result.displayValue!==undefined?' categorical':''}">${result.total===null?((current.categorical||current.categoricalOnIneligible)?esc(result.displayValue??'NT'):'NT'):esc(result.displayValue??fmt(result.total))}${result.total===null?'':current.resultScale===false?`<small> ${esc(current.unit||'pontos')}</small>`:`<small> / ${fmt(current.max)}</small>`}</div><span class="risk-tag">${esc(result.label)}</span>${(result.alerts||[]).map(a=>`<p class="critical-alert">${esc(a)}</p>`).join('')}<h2>Significado prático</h2><p>${esc(result.action)}</p><div class="audit"><b>Memória de cálculo</b><br>${esc(result.audit)}<br>${result.breakdown.map(b=>`${esc(b.label)}: ${esc(b.detail??(b.points==='NT'?'NT':fmt(b.points)))}`).join(' · ')}</div><button type="button" class="secondary" id="copy">Copiar resultado</button><p id="copy-state" role="status"></p>`;document.getElementById('copy').addEventListener('click',async()=>{const capturedResult=result;const snapshot=resultText();try{await navigator.clipboard.writeText(snapshot);if(!box.isConnected||result!==capturedResult)return;document.getElementById('copy-state').textContent='Resultado copiado.';}catch{if(!box.isConnected||result!==capturedResult)return;const t=document.createElement('textarea');t.value=snapshot;t.setAttribute('aria-label','Resultado para copiar manualmente');t.style.cssText='width:100%;height:180px;margin-top:15px';box.append(t);t.select();document.getElementById('copy-state').textContent='Selecione e copie o texto abaixo.';}});}
function route(){
 let hash;
 try{hash=decodeURIComponent(location.hash.slice(1));}
 catch{query='';condition='';category='Todas as especialidades';history.replaceState(null,'','#');renderCatalog();window.scrollTo(0,0);return;}
 if(hash.startsWith('score/')){
  const chosen=scores.find(s=>s.id===hash.slice(6));
  if(!chosen){query='';condition='';category='Todas as especialidades';history.replaceState(null,'','#');renderCatalog();window.scrollTo(0,0);return;}
  current=chosen;category=chosen.specialty;values=Object.assign(Object.create(null),chosen.fieldDefaults||{});result=null;eligible=false;attestationReceipt=null;secondaryPreviewBlocked=false;tab='calcular';renderScore();
 }else{
  if(hash.startsWith('condicao/')){
   const nextCondition=conditions.includes(hash.slice(9))?hash.slice(9):'';
   if(!nextCondition||nextCondition!==condition)query='';
   condition=nextCondition;category='Todas as especialidades';
   if(!condition)history.replaceState(null,'','#');
  }else if(hash.startsWith('especialidade/')){
   condition='';query='';const requestedCategory=canonicalCategory(hash.slice(14));category=specialties.includes(requestedCategory)?requestedCategory:'Todas as especialidades';
   if(category!=='Todas as especialidades'&&requestedCategory!==hash.slice(14))history.replaceState(null,'','#especialidade/'+encodeURIComponent(category));
   if(category==='Todas as especialidades')history.replaceState(null,'','#');
  }else{
   if(condition||hash)query='';
   condition='';category='Todas as especialidades';
   if(hash)history.replaceState(null,'','#');
  }
  renderCatalog();
 }
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);route();

// Snapshot only own data properties. Never evaluate input getters or coerce objects.
// Proxy reflection can run traps; exceptions are contained, not sandboxed.
function ownDataSnapshot(input){
 if(input===null||typeof input!=='object')return null;
 try{if(Array.isArray(input))return null;}catch{return null;}
 const data=Object.create(null),invalid=[];let keys;
 try{const prototype=Object.getPrototypeOf(input);if(prototype!==Object.prototype&&prototype!==null)invalid.push('[[Prototype]]');}catch{invalid.push('[[Prototype]]');}
 try{keys=Reflect.ownKeys(input);}catch{return null;}
 for(const key of keys){
  if(typeof key!=='string'){invalid.push(key);continue;}
  try{const descriptor=Object.getOwnPropertyDescriptor(input,key);if(!descriptor||!Object.hasOwn(descriptor,'value')){invalid.push(key);continue;}data[key]=descriptor.value;}catch{invalid.push(key);}
 }
 return {data,keys,invalid};
}
function rejectWebCalculation(message,calculated){
 const partial=current.assessPartial?.(calculationValues());
 const alerts=[...new Set([partial?.alert,...(calculated?.alerts||[])].filter(Boolean))];
 const reason=[...alerts,message].filter(Boolean).join(' ');
 const errorBox=document.getElementById('errors');if(errorBox)errorBox.textContent=reason;
 const error=new Error(reason);if(calculated?.observations)error.details=calculated;throw error;
}
function executeWebCalculation(input){
 const envelope=ownDataSnapshot(input);
 if(!envelope||typeof envelope.data.id!=='string')throw new Error('Dados e confirmação de aplicabilidade são obrigatórios.');
 const chosen=scores.find(score=>score.id===envelope.data.id);
 if(!chosen)throw new Error('Escore desconhecido.');
 const record=ownDataSnapshot(envelope.data.valores),safeValues=Object.create(null),issues=[];
 if(envelope.keys.some(key=>!['id','valores','criterios_confirmados'].includes(key)))issues.push('Campo não reconhecido no envelope.');
 if(envelope.invalid.length||!record)issues.push('Dados e confirmação de aplicabilidade são obrigatórios.');
 if(record){
  if(record.invalid.includes('[[Prototype]]'))issues.push('Objeto de valores com protótipo inválido.');
  if(record.keys.some(key=>!chosen.fields.some(field=>field.id===key)))issues.push('Campo não reconhecido.');
  const invalidFields=[];
  for(const field of chosen.fields){
   if(record.invalid.includes(field.id)){safeValues[field.id]='';invalidFields.push(field.id);continue;}
   if(!Object.hasOwn(record.data,field.id))continue;
   const value=record.data[field.id];
   if(value===null||value===undefined||typeof value==='string'||typeof value==='boolean'||(typeof value==='number'&&Number.isFinite(value)))safeValues[field.id]=value;
   else{safeValues[field.id]='';invalidFields.push(field.id);}
  }
  if(invalidFields.length)issues.push('Campos ausentes ou inválidos: '+invalidFields.join(', '));
 }
 // A recognized request is a new observation, including when it cannot be scored.
 // Replace stale totals first so urgent partial findings reach the DOM and errors.
 attestationReceipt=null;secondaryPreviewBlocked=issues.length>0;current=chosen;category=chosen.specialty;values=safeValues;eligible=envelope.data.criterios_confirmados===true;result=null;tab='calcular';
 history.replaceState(null,'','#score/'+chosen.id);renderScore();
 if(!eligible)issues.push('Dados e confirmação de aplicabilidade são obrigatórios. Confirme os critérios de aplicação para calcular.');
 if(issues.length)rejectWebCalculation(issues.join(' '));
 const calculated=calculate(chosen.id,safeValues);result=calculated.complete?calculated:{...calculated,webRequestIncomplete:true};renderResult();
 if(!calculated.complete)rejectWebCalculation(calculated.reason||'Campos ausentes ou inválidos: '+(calculated.errors||[]).join(', '),calculated);
 return {...calculated,escore:chosen.name,limites:chosen.limits,fontes:chosen.sources,conferencia:chosen.reviewDate||REVIEW_DATE};
}

// Browser WebMCP: the same catalog and calculation used by the visible form.
const mc=document.modelContext;
if(mc?.registerTool){const controller=new AbortController();window.addEventListener('pagehide',()=>controller.abort(),{once:true});
const register=tool=>{try{Promise.resolve(mc.registerTool(tool,{signal:controller.signal})).catch(()=>{});}catch{}};
register({name:'listar_escores_clinicos',title:'Listar escores clínicos',description:'Retorna os instrumentos disponíveis, suas populações, limites e campos; não calcula nem modifica dados.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>scores.map(s=>({id:s.id,nome:s.name,especialidade:s.specialty,especialidades:s.specialties,termos_de_busca:[...(s.aliases||[]),...(s.searchTerms||[])],palavras_chave:s.keywords,finalidade:s.purpose||null,condicoes:s.conditions,finalidades:s.purposes,populacao:s.scope,campos:s.fields,limites:s.limits,calculo_disponivel:!s.calculationSuspended,motivo_suspensao:s.calculationSuspensionReason||null}))});
register({name:'calcular_escore_clinico',title:'Calcular escore clínico',description:'Calcula um instrumento, abre sua calculadora e exibe o mesmo resultado do formulário. Requer os campos aplicáveis e confirmação explícita da população. Dados incompletos não emitem total; alertas conhecidos permanecem visíveis.',inputSchema:{type:'object',properties:{id:{type:'string',enum:scores.map(s=>s.id)},valores:{type:'object'},criterios_confirmados:{type:'boolean',const:true}},required:['id','valores','criterios_confirmados'],additionalProperties:false},annotations:{readOnlyHint:false},execute:executeWebCalculation});}
