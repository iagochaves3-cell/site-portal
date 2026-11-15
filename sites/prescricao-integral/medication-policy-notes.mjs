// Editorial policy notes stay separate from medication data and corrections.
const nirsevimabPNI2026=Object.freeze({
 id:'nirse-pni-postseason-2026',
 evidenceClass:'B',
 reviewedAt:'2026-10-15T11:20:00+00:00',
 source:Object.freeze({
  entity:'Ministério da Saúde — CGICI/DPNI/SVSA/MS',
  title:'Nota Técnica nº 89/2026-CGICI/DPNI/SVSA/MS',
  url:'https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-89.pdf',
  documentDate:'2026-08-06',
  documentDateBasis:'Última assinatura eletrônica em 06/08/2026 às 14:53, horário de Brasília. A data de publicação não está exposta no PDF.',
  sha256:'c376191d6753cca68271782a77010d7f55789599b80b7e826aa25b43b6d1258d',
  locator:'Página 1: §§ 2.1–2.2, 3.1.1–3.1.3 e 4.2; página 2: assinaturas.'
 }),
 copyReadyBlock:`NIRSEVIMABE — ESTRATÉGIA 2026 (PNI)

Prematuros elegíveis, com idade gestacional ao nascimento de até 36 semanas e 6 dias e idade cronológica inferior a 6 meses no momento da administração: garantir a administração oportuna do nirsevimabe durante todo o ano, preferencialmente ainda na maternidade e antes da alta hospitalar.

Crianças com idade inferior a 24 meses, com comorbidades elegíveis cuja indicação tenha sido confirmada clinicamente pela RIE e nascidas entre setembro e janeiro: administrar o nirsevimabe no início da sazonalidade do vírus sincicial respiratório (VSR) do ano seguinte, na Rede de Imunobiológicos para Pessoas com Situações Especiais (RIE).

A sazonalidade do VSR considerada nesta estratégia compreende fevereiro a agosto. Após o encerramento da sazonalidade de 2026, em agosto, não realizar novas ações de resgate com nirsevimabe para crianças com comorbidades elegíveis que não o receberam no período oportuno. A estratégia para prematuros elegíveis permanece durante todo o ano.`,
 eligibilitySource:Object.freeze({
   "entity": "Ministério da Saúde — SVSA/DPNI",
   "title": "Estratégia de imunização contra o VSR para crianças prematuras e com comorbidades — 1ª edição revisada, 2026",
   "versionOrDate": "1ª edição revisada,2026",
   "sha256": "33a29647c7885196219f5d0a11d1a9e595a086d7a9c2f48eec673fd2c22ca221",
   "locator": "PDF físico p.9 §2.1; p.18 Quadro3; p.23 §4.8RIE (páginas impressas8,17,22).",
   "evidenceClass": "B",
   "reviewedAt": "2026-10-05T12:36:52.968445+00:00",
   "url": "https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2026/guia-de-estrategia-contra-virus-sincicial-para-criancas-prematuras.pdf"
 }),
 prematurityChronologicalAgeCondition:Object.freeze({operator:"<",months:6}),
 comorbidityClinicalIndicationMustBeValidatedByRIE:true,
 regulatoryAndSafetyDelta:Object.freeze({
  evidenceClasses:Object.freeze(['A','B']),
  presentations:'50 mg/0,5 mL e 100 mg/1 mL, ambas 100 mg/mL, em seringas preenchidas de uso único',
  dose:'Primeira temporada: peso <5 kg, 50 mg = 0,5 mL IM; peso ≥5 kg, 100 mg = 1 mL IM. Segunda temporada, alto risco e até 24 meses: 200 mg = 2 mL, em duas injeções IM de 100 mg em locais diferentes.',
  dimensionalCheck:'50 mg ÷ 100 mg/mL = 0,5 mL; 0,5 mL × 100 mg/mL = 50 mg. 100 mg ÷ 100 mg/mL = 1 mL; 1 mL × 100 mg/mL = 100 mg. 2 × 100 mg = 200 mg; 2 × 1 mL = 2 mL.',
  safety:'Conferir embalagem e rótulo da seringa; preferir a face anterolateral da coxa e evitar a região glútea rotineiramente. Contraindicado em hipersensibilidade grave; observar por 15–30 minutos. Conservar entre 2–8 °C, sem congelar, agitar ou aquecer.',
  regulatorySource:Object.freeze({title:'Anvisa/Sanofi — comunicado aos profissionais de saúde',url:'https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/cartas-aos-profissionais-de-saude/2026/comunicado-aos-profissionais-de-saude_beyfortus.pdf/@@display-file/file'}),
  protocolSource:Object.freeze({title:'Ministério da Saúde — Protocolo de Uso do Nirsevimabe',url:'https://www.gov.br/saude/pt-br/assuntos/pcdt/n/protocolo-de-uso-do-nirsevimabe.pdf'})
 }),
 technicalLimits:Object.freeze([
  'A nota pressupõe elegibilidade vigente; não fornece nesta publicação lista integral de comorbidades ou contrato clínico por paciente.',
  'Idade inferior a 24 meses é a condição explícita desta nota; não admitir idade exatamente 24 meses nem resolver a divergência de outro protocolo por inferência.',
  'Dose, concentração e volume foram adicionados apenas para os esquemas A/B sustentados; reposição pós-circulação extracorpórea e transição entre anticorpos permanecem fora desta nota contextual.'
 ])
});

export const ropivacaineUpdate20261018=Object.freeze({
 id:'ropivacaina-2026-10-18',medicationId:'med-482',sourceId:'fonte-014',reviewedAt:'2026-10-18',classifications:Object.freeze(['A','C','D']),
 ecard:Object.freeze({src:'/ecards/ropivacaina-2026-10-18.svg',alt:'Ropivacaína pediátrica — doses, limites e alertas revisados em 18 de outubro de 2026'}),
 brazilian:Object.freeze({
  evidenceClass:'A',presentation:'Solução injetável 2 mg/mL; frasco-ampola de 20 mL. As concentrações 7,5 mg/mL e 10 mg/mL não têm uso pediátrico documentado na bula brasileira.',
  caudal:'0–12 anos e até 25 kg: 2 mg/kg = 1 mL/kg; máximo 25 mL.',epiduralBolus:'0–<6 meses e 6–<12 meses: 1–2 mg/kg = 0,5–1 mL/kg; 1–12 anos: 2 mg/kg = 1 mL/kg; máximo 25 mL.',
  epiduralInfusion:'Até 72 h: <6 meses, 0,2 mg/kg/h = 0,1 mL/kg/h; 6 meses–12 anos, 0,4 mg/kg/h = 0,2 mL/kg/h.'
 }),
 international:Object.freeze({evidenceClass:'C',peripheralBlock:'1–12 anos: 2,5–3 mg/kg; infusão 0,2–0,6 mg/kg/h por até 72 h. Sem confirmação regulatória brasileira equivalente.'}),
 unresolved:Object.freeze({evidenceClass:'D',items:Object.freeze(['prematuros','compatibilidade em Y','estoque/comercialização regional em tempo real'])}),
 safety:'Nunca administrar por via intravenosa. Soluções alcalinas com pH >6 podem precipitar. Uso único, sem conservantes; descartar sobra. Medicamento de alta vigilância: dupla checagem humana de peso, unidade, concentração, via e bomba.',
 dimensionalCheck:'10 kg: 2 mg/kg = 20 mg; 20 mg ÷ 2 mg/mL = 10 mL; 10 mL × 2 mg/mL ÷ 10 kg = 2 mg/kg.',
 sources:Object.freeze([Object.freeze({evidenceClass:'A',title:'Cristália — Ropi, bula profissional aprovada pela Anvisa em 22/05/2025',url:'https://www.cristalia.com.br/produto/153/bula-profissional'}),Object.freeze({evidenceClass:'C',title:'eMC — Ropivacaine 2 mg/mL, SmPC',url:'https://www.medicines.org.uk/emc/product/100394/smpc'})])
});

function scheduleRopivacaineUpdateCard(medication){
 if(typeof document==='undefined'||typeof queueMicrotask!=='function')return;
 queueMicrotask(()=>{
  const content=document.querySelector('#dialog-content'),title=document.querySelector('#dialog-title'),eyebrow=document.querySelector('#dialog-eyebrow');
  if(!content||title?.textContent!==medication.name||eyebrow?.textContent!=='MEDICAMENTO · FONTES INTEGRADAS'||content.querySelector('[data-update="ropivacaina-2026-10-18"]'))return;
  const figure=document.createElement('figure');figure.dataset.update=ropivacaineUpdate20261018.id;figure.style.margin='0 0 18px';
  figure.innerHTML=`<img src="${ropivacaineUpdate20261018.ecard.src}" alt="${ropivacaineUpdate20261018.ecard.alt}" style="display:block;width:min(100%,680px);height:auto;margin:0 auto;border-radius:12px" loading="eager" decoding="async"><figcaption class="small-text" style="margin-top:8px">Ropivacaína pediátrica · atualização de 18/10/2026.</figcaption>`;
  content.insertBefore(figure,content.firstElementChild);
  const details=document.createElement('section');details.className='source-notice';details.setAttribute('aria-label','Detalhes técnicos da atualização de ropivacaína');
  details.innerHTML=`<strong>Atualização validada — classes A, C e D</strong><p><strong>Brasil (A):</strong> ${ropivacaineUpdate20261018.brazilian.presentation} ${ropivacaineUpdate20261018.brazilian.caudal} ${ropivacaineUpdate20261018.brazilian.epiduralBolus} ${ropivacaineUpdate20261018.brazilian.epiduralInfusion}</p><p><strong>Evidência internacional (C):</strong> ${ropivacaineUpdate20261018.international.peripheralBlock}</p><p><strong>Atenção:</strong> ${ropivacaineUpdate20261018.safety}</p><p class="small-text"><strong>Checagem dimensional:</strong> ${ropivacaineUpdate20261018.dimensionalCheck}</p><p class="small-text"><strong>Lacunas D:</strong> ${ropivacaineUpdate20261018.unresolved.items.join('; ')}.</p><p class="small-text"><a href="${ropivacaineUpdate20261018.sources[0].url}" target="_blank" rel="noopener noreferrer">Bula profissional brasileira ↗</a> · <a href="${ropivacaineUpdate20261018.sources[1].url}" target="_blank" rel="noopener noreferrer">SmPC internacional ↗</a></p>`;
  const introduction=figure.nextElementSibling;introduction?.insertAdjacentElement('afterend',details);
 });
}

export function medicationPolicyNoteFor(medication){
 if(medication?.id===ropivacaineUpdate20261018.medicationId&&medication.source===ropivacaineUpdate20261018.sourceId){scheduleRopivacaineUpdateCard(medication);return null;}
 return medication?.id==='med-474'&&medication.source==='fonte-014'?nirsevimabPNI2026:null;
}
