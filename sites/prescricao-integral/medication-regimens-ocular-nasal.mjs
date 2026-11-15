const S={
 brazil:'https://www.scielo.br/j/abo/a/jHhLFVxpMYHFH8D8QyTJzJD/?lang=en',
 moorfields:'https://www.moorfields.nhs.uk/for-health-professionals/childrens-eye-conditions-management/allergic-eye-disease',
 redEye:'https://www.rch.org.au/clinicalguide/guideline_index/Acute_red_eye/',
 epinastine:'https://www.abbvie.com.br/content/dam/abbvie-com2/br/documents/Relestat.pdf',
 cromolerg:'https://www.abbvie.com.br/content/dam/abbvie-com2/br/documents/Cromolerg.pdf',
 cromolergPro:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Cromolerg-Profissional-Consulta-Remedios.pdf',
 crom2:'https://www.medicines.org.uk/emc/product/15407/smpc',
 crom4:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=18892411-465f-4d8d-9550-7dafa6c6a0a3',
 tears:'https://www.abbvie.com.br/content/dam/abbvie-com2/br/documents/Instru%C3%A7%C3%A3o-de-uso-Fresh-Tears-aprovado-em-12_09_22.pdf',
 gel:'https://www.abbvie.com.br/content/dam/abbvie-com2/br/documents/Instru%C3%A7%C3%A3o-de-uso-Fresh-Tears-Liquigel-aprovado-em-12_09_22.pdf',
 neo:'https://www.neoquimica.com.br/nossas-marcas/bula/neo-fresh',
 carmellose:'https://www.nhs.uk/medicines/carmellose-sodium/how-and-when-to-use-carmellose-sodium-eye-drops/',
 nasal:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/rino_lastin_bula_profissional_de_saude.pdf'
};
const B={catalogNew:true,reviewedAt:'2026-09-27',status:'source-reviewed',exactDiagnosis:true,nonSevereOnly:true,delivery:'instruction',route:'OFTÁLMICO',group:'symptomatic',renalAdjustment:false,hepaticAdjustment:false};
const redFlags=['dor ocular','fotofobia','perda visual','reducao da visao','lesao de cornea','ulcera de cornea','trauma ocular','olho vermelho com lente de contato'];
const eyeSafety='Alergia aos componentes. Dor, fotofobia, perda visual, trauma ou córnea comprometida exigem avaliação oftalmológica imediata. Não tratar esses achados como simples alergia/ressecamento.';
const eyeTechnique='Lavar as mãos; pingar no saco conjuntival inferior sem encostar o bico. Fechar suavemente o olho e pressionar o canto interno por um minuto. Não compartilhar o frasco. Evitar lentes enquanto houver olho vermelho.';
const allergyDx=['conjuntivite alergica','conjuntivite alergica sazonal','conjuntivite alergica perene'];
const crom={...B,medicationId:'med-144',name:'Cromoglicato dissódico oftálmico',ingredient:'cromoglicato',family:'ocular-antihistamine',minMonths:48,diagnoses:allergyDx,
 duration:'uso regular por 4 semanas, com reavaliação do controle; antecipar se piorar ou não tolerar',
 conditions:'Conjuntivite alérgica examinada, sem sinais de gravidade ou lesão corneana. Alternativa aos agentes de ação mais rápida; a apresentação é selecionada expressamente.',
 instructions:eyeTechnique+' Retirar lentes e aguardar pelo menos 15 minutos para recolocar quando o olho já estiver sem vermelhidão. Separar outros colírios por pelo menos 5 minutos. Conservar a 15–30 °C, protegido da luz; descartar 60 dias após abrir. Usar regularmente: o benefício pode levar dias ou semanas, sem aumentar a frequência por conta própria.',
 contraindications:eyeSafety+' Gestação/lactação exigem plano próprio. Não somar automaticamente outro antialérgico ocular.',
 allergyTerms:['cromoglicato','cromoglic','benzalconio'],avoidTerms:[...redFlags,'gestante','gestacao','amamentacao'],
 sources:[S.cromolerg,S.cromolergPro,S.brazil,S.moorfields,S.carmellose,S.redEye]
};
const carmellose={...B,medicationId:'med-88',name:'Carmelose sódica',ingredient:'carmelose',family:'ocular-lubricant',group:'support',minMonths:24,diagnoses:['olho seco','ressecamento ocular',...allergyDx],
 directions:'Instilar 1 gota em cada olho afetado quando houver ressecamento ou desconforto, até 4 vezes ao dia; no máximo 8 gotas/dia somando os dois olhos neste plano',
 duration:'enquanto houver necessidade; reavaliar se os sintomas persistirem, piorarem ou exigirem mais de 4 aplicações diárias',
 conditions:'Ressecamento ocular examinado ou suporte na alergia ocular, sem infecção, trauma ou lesão corneana. Uso pediátrico fundamentado no NHS/Moorfields; o fabricante brasileiro não estabeleceu segurança e eficácia pediátricas.',
 contraindications:eyeSafety+' Suspender se houver piora, inchaço das pálpebras ou irritação persistente. Rever conservantes quando houver uso frequente.',
 allergyTerms:['carmelose','carboximetilcelulose'],avoidTerms:redFlags,
 offLabel:'Uso pediátrico fora da população com eficácia/segurança estabelecidas no documento brasileiro, apoiado pelo NHS e protocolo pediátrico Moorfields. Limite operacional de idade: 2 anos; não é uma idade aprovada pelo fabricante. Uma gota até quatro vezes ao dia é uma seleção dentro da dose conforme necessidade; não representa máximo toxicológico. Não converter colírio em dose por kg.',
 sources:[S.carmellose,S.moorfields,S.brazil,S.redEye]
};
const nasal={...B,medicationId:'med-47',name:'Azelastina nasal',ingredient:'azelastina',family:'nasal-antihistamine',route:'NASAL',minMonths:60,diagnoses:['rinite alergica','rinite alergica em pediatria'],
 presentations:[{label:'Rino-Lastin 1 mg/mL de cloridrato de azelastina — 0,14 mL/jato = 0,14 mg/jato; frasco 10 mL'}],
 duration:'até controle dos sintomas, com reavaliação em 2–4 semanas; não ultrapassar 6 meses ininterruptos',
 conditions:'Rinite alérgica identificada. Não usar este spray nos olhos nem intercambiar com azelastina + fluticasona.',
 instructions:'Preparar a válvula até spray uniforme na primeira utilização; agitar e higienizar o nariz. Manter cabeça ereta, sem aspirar com força após aplicar. Limpar o bico e tampar. Pode causar gosto amargo, tontura ou sonolência: evitar álcool e atividades que exijam atenção. Conservar a 15–30 °C, protegido da luz; descartar 6 meses após abrir.',
 contraindications:'Alergia à azelastina/excipientes. Não associar cimetidina. Gestação, lactação e sedativos exigem plano específico.',
 allergyTerms:['azelastina','benzalconio'],avoidTerms:['cimetidina','gestante','gestacao','amamentacao','sedativo','diazepam','clonazepam'],
 offLabel:'A idade de 5 anos segue a seção posológica, que diz 5 anos ou mais, apesar do cabeçalho “acima de 5”. A frase isolada de máximo de três aplicações é ambígua; os ramos reproduzem apenas os dois horários e totais em mg/dia explicitamente descritos na própria bula, sem liberar terceira administração. Retorno em 2–4 semanas é a organização deste plano.',
 sources:[S.nasal]
};
export const ocularNasalRegimens=[
 {...B,id:'epinastine-ocular-allergy',medicationId:'med-179',name:'Epinastina oftálmica',ingredient:'epinastina',family:'ocular-antihistamine',minMonths:36,minExclusive:true,title:'Conjuntivite alérgica sazonal · epinastina 0,05%',diagnoses:['conjuntivite alergica','conjuntivite alergica sazonal'],presentations:[{label:'Relestat 0,05% — cloridrato de epinastina 0,5 mg/mL; frasco 5 ou 10 mL'}],
  directions:'Instilar 1 gota em cada olho afetado pela manhã e à noite; máximo deste esquema: 4 gotas/dia somando os dois olhos',
  duration:'até cessarem sintomas/exposição alérgica; revisar em 4 semanas e antes de ultrapassar 8 semanas',
  conditions:'Conjuntivite alérgica sazonal examinada, acima de 3 anos, sem lesão corneana. Uso regular durante a exposição indicada.',
  instructions:eyeTechnique+' Separar outros colírios por 10 minutos. Retirar lentes antes e esperar 15 minutos para recolocar se o olho não estiver vermelho. Conservar a 15–30 °C; descartar 30 dias após abrir.',
  contraindications:eyeSafety+' Alergia ao conservante benzalcônio; gestação/lactação exigem plano próprio.',
  allergyTerms:['epinastina','benzalconio'],avoidTerms:[...redFlags,'gestante','gestacao','amamentacao'],
  offLabel:'Bula brasileira: dose em gotas, duas vezes ao dia. Não estudado por mais de oito semanas; revisão não equivale a autorização de prolongamento. Não há recomendação especial renal/hepática na bula, embora essas populações não tenham sido estudadas. Não se calcula massa por gota: a equivalência declarada não coincide exatamente com concentração dividida pelo fator de gotas.',sources:[S.epinastine,S.brazil,S.carmellose,S.redEye]},
 ...[2,4].flatMap(percent=>[1,2].map(drops=>({...crom,id:`cromoglicate-${percent}pct-${drops}drop`,title:`Conjuntivite alérgica · Cromolerg ${percent}% · ${drops} gota(s)`,
  presentations:[{label:`Cromolerg ${percent}% — ${percent*10} mg/mL; ${percent===2?26:28} gotas/mL; frasco 5 mL`}],
  directions:`Instilar ${drops} gota(s) em cada olho afetado 4 vezes ao dia, em horários regulares; máximo deste esquema: ${drops*4} gotas por olho/dia (${drops*8} gotas/dia se ambos os olhos forem tratados)`,
  conditions:crom.conditions+(drops===2?' Dose de duas gotas como alternativa selecionada, sem somar ao ramo de uma gota.':''),
  offLabel:'A bula brasileira não fixa a posologia. Frequência e gotas foram completadas com diretriz pediátrica brasileira e documento regulatório da mesma concentração; não são apresentados como dose expressa na bula Cromolerg. Faixa operacional a partir de 4 anos, baseada no limite de evidência pediátrica do colírio 4%; não é contraindicação brasileira para menores. A referência americana de 4% trata doença vernal, enquanto a indicação alérgica ampla vem da bula brasileira. Gotejadores e prazo após abertura permanecem os brasileiros.',
  sources:[...crom.sources,percent===2?S.crom2:S.crom4]
 }))),
 ...[
  {id:'carmellose-fresh-05',title:'Ressecamento / suporte ocular · Fresh Tears 0,5%',label:'Fresh Tears 0,5% — carboximetilcelulose sódica 5 mg/mL; frasco 3, 10 ou 15 mL',source:S.tears,care:'Conservar até 30 °C; descartar 90 dias após abrir. Este produto permite lubrificar lentes, mas olho vermelho ou doloroso com lente exige retirá-la e ser avaliado.'},
  {id:'carmellose-fresh-1',title:'Ressecamento ocular · Fresh Tears Liquigel 1%',label:'Fresh Tears Liquigel 1% — carboximetilcelulose sódica 10 mg/mL; frasco 15 mL',source:S.gel,care:'Conservar até 30 °C; descartar 90 dias após abrir. Retirar lentes antes; aguardar 15 minutos para recolocar. Pode embaçar temporariamente mais do que a solução menos viscosa.'},
  {id:'carmellose-neo-05',title:'Ressecamento / suporte ocular · Neo Fresh 0,5%',label:'Neo Fresh 0,5% — carmelose sódica 5 mg/mL; 22 gotas/mL; frasco 15 mL',source:S.neo,care:'Conservar a 15–30 °C, protegido de luz e umidade; descartar 28 dias após abrir. Retirar lentes antes; aguardar 15 minutos para recolocar.'}
 ].map(o=>({...carmellose,id:o.id,title:o.title,presentations:[{label:o.label}],instructions:eyeTechnique+' Aguardar pelo menos 5 minutos entre colírios (10 minutos se junto de Relestat); pomadas por último. Não usar frasco turvo ou danificado. Aguardar a visão clarear antes de atividades de risco. '+o.care,sources:[o.source,...carmellose.sources]})),
 {...nasal,id:'azelastine-nasal-standard',title:'Rinite alérgica · azelastina nasal, dose inicial',directions:'Aplicar 1 jato em cada narina pela manhã e à noite; total de 4 jatos/dia = 0,56 mg de cloridrato de azelastina/dia'},
 {...nasal,id:'azelastine-nasal-teen-stepup',title:'Rinite alérgica · azelastina nasal, dose aumentada ≥12 anos',minMonths:144,conditions:nasal.conditions+' A partir de 12 anos, somente quando o caso justificar aumento após avaliação do controle e da técnica.',directions:'Aplicar 2 jatos em cada narina pela manhã e à noite; total de 8 jatos/dia = 1,12 mg de cloridrato de azelastina/dia'}
];
