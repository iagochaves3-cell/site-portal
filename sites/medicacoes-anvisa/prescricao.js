(()=>{
'use strict';
const q=s=>document.querySelector(s),PAGE=50;
let catalog=[],catalogMap={},catalogRecord=null,medicationRequest=0;
let model=null,manifest=null,currentSheet=0,rowOffset=0,chunkCache=new Map(),opened=false,sheetRequest=0;

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const option=(value,text)=>{const o=document.createElement('option');o.value=value;o.textContent=text;return o};
const parseNumber=value=>{
  const text=String(value??'').trim();
  if(!text)return null;
  if(!/^\d+(?:[.,]\d+)?$/.test(text))return NaN;
  return Number(text.replace(',','.'));
};
const number=value=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:6}).format(value);
const ageYears=()=>{const v=parseNumber(q('#patientAge').value),u=q('#patientAgeUnit').value;if(!Number.isFinite(v)||v<0||!u)return null;return u==='anos'?v:u==='meses'?v/12:v/365};
const normalizedAge=years=>years===null?'—':`${number(years)} anos normalizados`;

function context(){
  const weight=parseNumber(q('#patientWeight').value),age=ageYears(),diagnosis=q('#patientDiagnosis').value.trim();
  const validDiagnosis=model&&model.diagnoses.includes(diagnosis);
  const confirmations=['#confirmIndication','#confirmProduct','#confirmContext'].every(id=>q(id).checked);
  q('#patientWeight').setAttribute('aria-invalid',String(!(Number.isFinite(weight)&&weight>0)));
  q('#patientAge').setAttribute('aria-invalid',String(age===null));
  q('#patientDiagnosis').setAttribute('aria-invalid',String(!validDiagnosis));
  let status='Entradas pendentes';
  if(q('#patientWeight').value&&!(Number.isFinite(weight)&&weight>0))status='Peso inválido';
  else if(q('#patientAge').value&&age===null)status='Idade inválida';
  else if(diagnosis&&!validDiagnosis)status='Diagnóstico fora da lista do Excel';
  else if(Number.isFinite(weight)&&weight>0&&age!==null&&validDiagnosis&&!confirmations)status='Confirmações pendentes';
  else if(Number.isFinite(weight)&&weight>0&&age!==null&&validDiagnosis&&confirmations)status='Contexto preenchido';
  const hs=q('#hydrationReference');
  if(hs){
    if(!(Number.isFinite(weight)&&weight>0)||age===null)hs.textContent='Peso e idade pendentes';
    else if(age<=28/365||age>16)hs.textContent='Faixa neonatal/adulta: plano próprio';
    else {const day=100*Math.min(weight,10)+50*Math.min(Math.max(weight-10,0),10)+20*Math.max(weight-20,0),hour=day/24,factor=parseNumber(q('#dropFactor').value);hs.textContent=`${number(day)} mL/dia · ${number(hour)} mL/h`+(Number.isFinite(factor)&&factor>0?` · ${number(hour*factor/60)} gotas/min`:' · informar fator para gotas')+(day>2000?' · revisar volume elevado':'');}
  }
  q('#contextStatus').textContent=status;
  q('#ageClass').textContent=normalizedAge(age)+(age===null?'':' · faixa automática ausente no XLSX');
  return {weight,age,diagnosis,validDiagnosis,confirmations,complete:Number.isFinite(weight)&&weight>0&&age!==null&&validDiagnosis&&confirmations};
}

function resetSelect(select,label='Selecionar'){
  select.replaceChildren(option('',label));select.disabled=true;
}

function populateMedication(){
  const select=q('#calcMedication');
  catalog=catalog.filter(item=>model.catalogue_entry_ids.includes(item.id));
  const group=document.createElement('optgroup');group.label='Catálogo vigente e documental (inativos excluídos)';
  for(const item of catalog)group.append(option('catalog:'+item.id,item.nome));select.append(group);
  const canonical=document.createElement('optgroup');canonical.label='Regimes específicos do Excel';
  for(const row of model.main_rows)canonical.append(option(String(row.row),`${row.values[0]} · ${row.values[1]}`));select.append(canonical);
}

function selectedMainRow(){const value=q('#calcMedication').value;const id=value.startsWith('catalog:')?catalogMap[value.slice(8)]:value;return model?.main_rows.find(row=>String(row.row)===String(id))}

async function medicationChanged(){
  const token=++medicationRequest,value=q('#calcMedication').value,row=selectedMainRow(),product=q('#calcProduct'),regimen=q('#calcRegimen');
  catalogRecord=null;resetSelect(product);resetSelect(regimen);
  if(row){for(const v of row.product_options)product.append(option(v,v));for(const v of row.regimen_options)regimen.append(option(v,v));product.disabled=!row.product_options.length;regimen.disabled=!row.regimen_options.length}
  if(value.startsWith('catalog:')){
    q('#calculationResult').textContent='Carregando apresentações do catálogo…';
    try{const response=await fetch(`data/${value.slice(8)}.json`);if(!response.ok)throw Error();const data=await response.json();if(token!==medicationRequest)return;catalogRecord=data;
      data.apresentacoes.forEach((v,i)=>{if(v[5]==='Inativo')return;product.append(option('documentary:'+i,`${v[0]} · ${v[1]} · registro ${v[2]} · ${v[5]}`));});
      product.disabled=product.options.length<=1;
    }catch{if(token!==medicationRequest)return;q('#calculationResult').textContent='Falha ao carregar apresentações. Selecione novamente.';return}
  }
  renderCalculation();
}

function renderCalculation(){
  if(!model)return;
  const out=q('#calculationResult'),ctx=context(),row=selectedMainRow(),product=q('#calcProduct').value,regimenLabel=q('#calcRegimen').value;
  if(q('#calcMedication').value.startsWith('catalog:')&&catalogRecord&&(!row||product.startsWith('documentary:')||!row.regimen_options.length)){
    const d=catalogRecord,v=product.startsWith('documentary:')?d.apresentacoes[Number(product.split(':')[1])]:null;
    out.innerHTML=`<h4>${escapeHtml(d.principio)}</h4><p>${number(d.produtos.length)} registros regulatórios · ${number(d.apresentacoes.length)} apresentações CMED conciliadas.</p>${v?`<p><strong>${escapeHtml(v[0])}</strong> · ${escapeHtml(v[1])}</p><p>Registro: ${escapeHtml(v[2])} · ${escapeHtml(v[3])} · situação do produto: ${escapeHtml(v[5])}</p>`:''}<p class="warning">${row?'Esta apresentação documental não está vinculada a um regime específico do Excel. Selecione um produto do contrato para usar o respectivo cálculo.':'Não há regime posológico específico conciliado para esta denominação. A medicação está disponível para seleção e consulta; dose, volume e infusão exigem validação por indicação, população, via e produto.'}</p>${!d.apresentacoes.length?'<p>Sem apresentação CMED conciliada nesta extração; isso não comprova inexistência de apresentação registrada.</p>':''}<p><a href="data/${escapeHtml(q('#calcMedication').value.slice(8))}.json" target="_blank" rel="noopener">Consultar registros e apresentações completos</a> · <a href="https://consultas.anvisa.gov.br/#/medicamentos/" target="_blank" rel="noopener">Consulta oficial Anvisa</a></p>`;return;
  }
  if(!ctx.complete){out.innerHTML='<p>Contexto bloqueado: informe peso e idade válidos, escolha um diagnóstico exatamente da lista do Excel e conclua as três confirmações.</p>';return}
  if(!row||!product||!regimenLabel){out.innerHTML='<p>Contexto preenchido. Selecione medicamento, apresentação e regime.</p>';return}
  if(!row.product_options.includes(product)||!row.regimen_options.includes(regimenLabel)){out.innerHTML='<p class="warning">Seleção fora da validação do Excel. O cálculo foi bloqueado.</p>';return}
  const rule=model.regimes.find(x=>x.label_exact===regimenLabel&&x.provenance.evbic_row_trace_only===Number(row.contract_row));
  if(!rule){out.innerHTML='<p class="warning">Regime sem contrato canônico correspondente. O cálculo permanece pendente.</p>';return}
  const result=AnvisaContractEngine.calculate(rule,{weight:ctx.weight,age:ctx.age,product,regimen:regimenLabel,complete:ctx.complete});
  const blocked=/^(PENDENTE|ENTRADAS PENDENTES)/.test(result.G);
  out.innerHTML=`<div class="eyebrow">${escapeHtml(rule.regime_id)} · ${escapeHtml(rule.status)}</div><h4>${escapeHtml(rule.ingredient)}</h4><p>${escapeHtml(rule.indication||'Indicação não informada')}</p>${blocked?`<p class="warning">${escapeHtml(result.G)}</p>`:`<div class="result-grid"><div class="result-card"><span>DOSE DO CONTRATO</span><strong>${escapeHtml(result.G)}</strong></div><div class="result-card"><span>VOLUME DO CONTRATO</span><strong>${escapeHtml(result.H)}</strong></div><div class="result-card"><span>INFUSÃO BIC</span><strong>${escapeHtml(result.M)}</strong></div></div><p><strong>Via:</strong> ${escapeHtml(result.I)}</p><p><strong>Preparo:</strong> ${escapeHtml(result.J)}</p><p><strong>Administração:</strong> ${escapeHtml(result.K)}</p><p><strong>Limites de infusão:</strong> ${escapeHtml(result.L)}</p>`}<p class="note">Fórmulas específicas do Excel, com suas restrições por produto, indicação, idade, peso e limites. Gotejamento de medicamentos não habilitado. Conferir novamente o contexto a cada mudança de paciente ou seleção.</p>`;
}

async function decompressJson(url){
  if(chunkCache.has(url))return chunkCache.get(url);
  const promise=(async()=>{const response=await fetch(url);if(!response.ok)throw Error(`HTTP ${response.status}`);if(!('DecompressionStream' in window))throw Error('Navegador sem suporte a gzip local');const stream=response.body.pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(stream).text())})();
  chunkCache.set(url,promise);return promise;
}

function columnName(n){let s='';while(n){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)}return s}

async function renderSheet(){
  if(!manifest)return;const token=++sheetRequest,sheet=manifest.sheets[currentSheet],maxOffset=Math.max(0,Math.floor((sheet.rows-1)/PAGE)*PAGE);rowOffset=Math.max(0,Math.min(rowOffset,maxOffset));
  const chunkIndex=Math.floor(rowOffset/manifest.chunk_size),filename=sheet.chunks[chunkIndex],wrap=q('#sheetTableWrap');wrap.innerHTML='<div class="sheet-loading">Carregando planilha…</div>';
  q('#workbookStatus').textContent=`${sheet.rows.toLocaleString('pt-BR')} linhas × ${sheet.columns.toLocaleString('pt-BR')} colunas${sheet.state==='hidden'?' · oculta no Excel':''}`;
  try{
    const data=await decompressJson(`workbook/sheets/${filename}`),inChunk=rowOffset-(data.start-1),rows=data.rows.slice(inChunk,inChunk+PAGE),needle=q('#sheetSearch').value.trim().toLocaleLowerCase('pt-BR');
    const table=document.createElement('table');table.className='sheet-data';const thead=document.createElement('thead'),hr=document.createElement('tr'),corner=document.createElement('th');corner.className='row-number';corner.textContent='#';hr.append(corner);
    for(let c=1;c<=sheet.columns;c++){const th=document.createElement('th');th.textContent=columnName(c);hr.append(th)}thead.append(hr);table.append(thead);const body=document.createElement('tbody');
    rows.forEach((values,idx)=>{const globalRow=rowOffset+idx+1;if(needle&&!values.some(v=>String(v??'').toLocaleLowerCase('pt-BR').includes(needle)))return;const tr=document.createElement('tr'),rn=document.createElement('td');rn.className='row-number';rn.textContent=globalRow;tr.append(rn);const localIndex=String(inChunk+idx),formulaEntries=new Map((data.formulas[localIndex]||[]).map(([c,f])=>[c,f]));
      for(let c=1;c<=sheet.columns;c++){const td=document.createElement('td'),value=values[c-1],formula=formulaEntries.get(c);if(value!==null&&value!==undefined){if(typeof value==='string'&&/^https?:\/\//i.test(value)){const a=document.createElement('a');a.href=value;a.target='_blank';a.rel='noopener';a.textContent=value;td.append(a)}else td.textContent=String(value)}else if(formula)td.textContent='(resultado não armazenado)';if(formula){td.classList.add('has-formula');td.title=`${columnName(c)}${globalRow}`;td.onclick=()=>{q('#formulaText').textContent=`${sheet.name}!${columnName(c)}${globalRow}  ${formula}`}}tr.append(td)}body.append(tr)});
    if(token!==sheetRequest)return;table.append(body);wrap.replaceChildren(table);q('#sheetPage').textContent=`linhas ${rowOffset+1}–${Math.min(rowOffset+PAGE,sheet.rows)} de ${sheet.rows.toLocaleString('pt-BR')}`;q('#sheetPrev').disabled=rowOffset===0;q('#sheetNext').disabled=rowOffset+PAGE>=sheet.rows;
  }catch(error){if(token===sheetRequest)wrap.innerHTML=`<div class="sheet-loading">Não foi possível abrir esta folha (${escapeHtml(error.message)}). O XLSX integral permanece disponível para download.</div>`}
}

async function init(){
  if(opened)return;opened=true;
  try{
    [model,manifest,catalog,catalogMap]=await Promise.all([fetch('workbook/calculator-model.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch('workbook/workbook-manifest.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch('index.json').then(r=>{if(!r.ok)throw Error();return r.json()}),fetch('workbook/catalog-calculator-map.json').then(r=>{if(!r.ok)throw Error();return r.json()})]);
    const list=q('#diagnosisOptions');for(const value of model.diagnoses)list.append(option(value,value));populateMedication();
    const select=q('#sheetSelect');manifest.sheets.forEach((sheet,index)=>select.append(option(String(index),`${sheet.name}${sheet.state==='hidden'?' (oculta no Excel)':''}`)));renderSheet();
  }catch(error){q('#calculationResult').innerHTML='<p class="warning">Falha ao carregar o modelo importado. Use o XLSX original para consulta.</p>';q('#workbookStatus').textContent='Falha ao carregar índice'}
}

for(const id of ['#patientName','#patientWeight','#patientAge','#patientAgeUnit','#patientDiagnosis','#calcMedication','#calcProduct','#calcRegimen'])for(const event of ['input','change'])q(id).addEventListener(event,()=>{for(const check of ['#confirmIndication','#confirmProduct','#confirmContext'])q(check).checked=false});
for(const id of ['#patientName','#patientWeight','#patientAge','#patientAgeUnit','#patientDiagnosis','#patientAgeText','#dropFactor','#confirmIndication','#confirmProduct','#confirmContext']){q(id).addEventListener('input',renderCalculation);q(id).addEventListener('change',renderCalculation)}
q('#calcMedication').addEventListener('change',medicationChanged);q('#calcProduct').addEventListener('change',renderCalculation);q('#calcRegimen').addEventListener('change',renderCalculation);
q('#resetCalculator').onclick=()=>{for(const id of ['#patientName','#patientWeight','#patientAge','#patientDiagnosis','#patientAgeText','#dropFactor'])q(id).value='';q('#patientAgeUnit').value='';for(const id of ['#confirmIndication','#confirmProduct','#confirmContext'])q(id).checked=false;q('#calcMedication').value='';medicationChanged();context()};
q('#sheetSelect').onchange=()=>{currentSheet=Number(q('#sheetSelect').value);rowOffset=0;q('#sheetSearch').value='';renderSheet()};q('#sheetPrev').onclick=()=>{rowOffset-=PAGE;renderSheet()};q('#sheetNext').onclick=()=>{rowOffset+=PAGE;renderSheet()};q('#sheetSearch').oninput=renderSheet;const jumpToRow=()=>{const sheet=manifest?.sheets[currentSheet],row=Math.floor(parseNumber(q('#rowJump').value));if(sheet&&Number.isFinite(row)){rowOffset=Math.max(0,Math.min(sheet.rows-1,row-1));rowOffset=Math.floor(rowOffset/PAGE)*PAGE;renderSheet()}};q('#rowJump').addEventListener('change',jumpToRow);q('#rowJump').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();jumpToRow()}});
window.addEventListener('prescription-open',init);
if(location.hash==='#planilha-completa'){q('#showWorkbook').click()}else if(location.hash==='#calculadora-prescricao'){q('#showPrescription').click()}else context();
})();
