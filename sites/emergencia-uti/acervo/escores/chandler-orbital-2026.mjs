// Descriptive anatomical classification; no numerical score or diagnostic inference.
const stages = [
  {
    value:'I', name:'Edema inflamatório / celulite pré-septal',
    description:'Inflamação anterior ao septo orbitário; sem acometimento orbital demonstrado.',
    interpretation:'Categoria pré-septal, não celulite orbitária pós-septal.',
    alarm:'Dor ao mover os olhos, restrição ocular, proptose ou alteração visual contradizem um quadro pré-septal simples: reavaliar imediatamente.',
    action:'Caso leve, criança em bom estado e seguimento garantido: considerar antibiótico oral conforme protocolo local e reavaliação em 24–48 h. Quadro moderado/grave, vacinação Hib incompleta, exame inconclusivo ou piora: avaliação hospitalar e escalonamento conforme protocolo. Não aguardar o prazo diante de alarmes.'
  },
  {
    value:'II', name:'Celulite orbitária',
    description:'Infecção pós-septal dos tecidos orbitários, sem abscesso organizado.',
    interpretation:'Emergência com risco à visão e de extensão intracraniana.',
    alarm:'Dor/restrição dos movimentos oculares, proptose, diplopia, redução visual ou defeito pupilar aferente relativo exigem resposta urgente.',
    action:'Internação, antibiótico intravenoso imediato e avaliação urgente por oftalmologia e otorrinolaringologia. Definir imagem contrastada de órbitas/seios e, conforme suspeita, encéfalo; não atrasar tratamento.'
  },
  {
    value:'III', name:'Abscesso subperiosteal',
    description:'Coleção entre a parede óssea orbitária e a periórbita.',
    interpretation:'Infecção orbitária complicada; drenagem não é automática para toda coleção.',
    alarm:'Déficit visual, comprometimento do nervo óptico, progressão, sepse ou suspeita intracraniana exigem escalonamento imediato.',
    action:'Internação, antibiótico IV e avaliação cirúrgica urgente conjunta. Individualizar drenagem por visão, localização/extensão da coleção e evolução. Observação clínica somente sob equipe especializada, com exames seriados; ausência de melhora exige revisão do plano.'
  },
  {
    value:'IV', name:'Abscesso orbitário',
    description:'Coleção purulenta dentro dos tecidos da órbita.',
    interpretation:'Ameaça importante à visão e maior risco de complicações.',
    alarm:'Perda visual, oftalmoplegia, proptose progressiva ou sinais neurológicos são críticos.',
    action:'Antibiótico IV, internação e avaliação cirúrgica imediata para drenagem e controle do foco. Não aguardar 24–48 h diante de comprometimento visual ou deterioração.'
  },
  {
    value:'V', name:'Trombose do seio cavernoso',
    description:'Trombose séptica do seio cavernoso; complicação intracraniana.',
    interpretation:'Emergência potencialmente fatal, não apenas uma forma de edema palpebral.',
    alarm:'Cefaleia intensa, oftalmoplegia, alteração visual, envolvimento bilateral, alteração da consciência, convulsões ou sepse.',
    action:'Atendimento hospitalar imediato, antibiótico IV e imagem urgente orientada à complicação. Acionar oftalmologia, otorrinolaringologia, infectologia e neurologia/neurocirurgia; UTI conforme gravidade. Controle do foco e anticoagulação exigem decisão especializada, não automática pela classificação.'
  }
];
const commonAlarm='Sinais de alarme em qualquer estágio: alteração visual, dor/limitação ocular, proptose, cefaleia intensa, vômitos, alteração da consciência, convulsões ou sepse. Avaliação urgente; não esperar 24–48 h.';
function selected(values){
  try {
    if(!values || typeof values!=='object' || Array.isArray(values)) return;
    const d=Object.getOwnPropertyDescriptor(values,'stage');
    return d && Object.hasOwn(d,'value') ? stages.find(s=>s.value===d.value) : undefined;
  } catch { return; }
}
function evaluate(values){
  const s=selected(values);
  if(!s) return {complete:false,total:null,errors:['stage'],level:'high',alerts:[commonAlarm]};
  return {complete:true,total:null,displayValue:s.value,label:s.name,level:s.value==='I'?'medium':'high',
    action:'Descrição: '+s.description+' Interpretação: '+s.interpretation+' Conduta: '+s.action,
    alerts:[s.alarm,commonAlarm],breakdown:[{label:'Estágio anatômico registrado',points:s.value,detail:s.value+' — '+s.name}],
    audit:'Chandler '+s.value+' registrado pelo profissional; sem soma de pontos, probabilidade ou diagnóstico automatizado.',errors:[]};
}
export const chandlerScore={
  id:'chandler-orbital',name:'Chandler · celulite orbitária',subtitle:'Classificação anatômica I–V · conduta contextual 2026',
  specialty:'Oftalmologia',specialties:['Oftalmologia','Pediatria','Infectologia','Emergência'],
  aliases:['Classificação de Chandler','Chandler I–V','celulite orbital','abscesso subperiosteal','trombose do seio cavernoso'],
  population:'Infecções periorbitárias/orbitárias · condutas pediátricas',populationGroups:['pediatria','adultos'],
  range:'I–V',max:5,unit:'estágio',categorical:true,resultScale:false,reviewDate:'27/10/2026',
  scope:'Registro do estágio anatômico estabelecido pela avaliação clínica e, quando indicada, imagem. Não classificar pela intensidade do edema isoladamente. Chandler não é escore numérico nem sequência obrigatória de progressão. As condutas resumidas de 2026 são pediátricas; adultos, neonatos, imunossuprimidos e infecção fúngica requerem protocolo específico. Suspeita orbitária exige avaliação urgente, mesmo sem estágio definido.',
  fields:[{id:'stage',label:'Estágio anatômico estabelecido',type:'select',noPoints:true,
    options:stages.map(s=>({value:s.value,label:s.value+' — '+s.name})),
    hint:'Selecione apenas após avaliação profissional. Dúvida diagnóstica não equivale a estágio I. A ficha registra a categoria; não interpreta imagens nem exclui doença.'}],
  formula:stages.map(s=>s.value+' — '+s.name+': '+s.description).join(' ')+' Sem soma ou conversão em risco percentual.',
  limits:'I corresponde aqui ao uso contemporâneo pré-septal; o termo original “edema inflamatório” tem ambiguidade histórica. A anatomia e os achados de imagem prevalecem sobre o rótulo. '+commonAlarm+' Antibiótico, cobertura e duração dependem do foco, gravidade, imunização e epidemiologia local. Não prescreve doses, alta, cirurgia ou anticoagulação automaticamente. Fontes e condutas consultadas em 27/10/2026.',
  sources:[
    {title:'Canadian Paediatric Society · 03/03/2026 · Chandler, população pediátrica e condutas',url:'https://cps.ca/en/documents/position/preseptal-orbital-cellulitis'},
    {title:'Royal Children’s Hospital · atualização julho/2026 · alarmes e manejo',url:'https://www.rch.org.au/clinicalguide/guideline_index/Periorbital_and_orbital_cellulitis/'},
    {title:'Children’s Hospital of Philadelphia · revisão fevereiro/2026 · internação e escalonamento',url:'https://www.chop.edu/clinical-pathway/preseptal-or-orbital-cellulitis-clinical-pathway'},
    {title:'Anselmo-Lima et al. · BJORL 2023 · anatomia e limitações históricas de Chandler',url:'https://www.scielo.br/j/bjorl/a/dY7kczpbgQYHfD6wstsbwGJ/?lang=en'},
    {title:'MedlinePlus · revisão 29/01/2026 · trombose do seio cavernoso',url:'https://medlineplus.gov/ency/article/001628.htm'}
  ],
  safeCalculate:evaluate,safeValidate:v=>selected(v)?[]:['stage'],
  assessPartial:v=>({level:selected(v)?.value==='I'?'medium':'high',alert:selected(v)?.alarm||commonAlarm})
};
