const source=(title,url)=>({title,url,accessed:'2026-09-27'});
const brazil='https://www.scielo.br/j/abo/a/jHhLFVxpMYHFH8D8QyTJzJD/?lang=en';
export const ocularGuidanceSupplements={
 'Conjuntivite alérgica':{
  expected:'Os antialérgicos de ação rápida podem aliviar cedo; estabilizadores de mastócitos, como cromoglicato, precisam de uso regular e podem levar dias a semanas para controle. A exposição ao alérgeno pode causar recorrência. Dor importante ou perda da visão não são evolução esperada.',
  return:'Programar reavaliação em 4 semanas nos quadros leves ou moderados. Antecipar diante de piora ou intolerância. Sem controle, procurar oftalmologia para rever diagnóstico e tratamento; formas vernais/atópicas já conhecidas sem melhora em 2 semanas precisam de avaliação mais precoce. Não iniciar ou prolongar corticoide ocular por conta própria.',
  urls:[brazil,'https://www.moorfields.nhs.uk/for-health-professionals/childrens-eye-conditions-management/allergic-eye-disease']
 }
};
export const ocularGuidanceRecords=[{
 name:'Olho seco',aliases:['Ressecamento ocular','Secura ocular'],status:'source-reviewed',setting:'home',revisedAt:'2026-09-27',reviewNotes:'Ressecamento diagnosticado após exame, sem trauma, infecção ou córnea comprometida. Retorno inicial em 2–4 semanas é a organização deste plano; não se deve esperar esse prazo quando houver dor, alteração visual ou piora.',
 general:'Usar o lubrificante na frequência prescrita. Lavar as mãos, não encostar o bico nos olhos e não compartilhar o frasco. Anotar a data de abertura e respeitar a validade específica do produto.',
 diagnosis:'Fazer pausas nas telas e piscar regularmente. Evitar vento direto, fumaça e ar muito seco; preferir óculos enquanto houver desconforto com lentes. Manter higiene suave das pálpebras se orientada. Não suspender medicamentos de uso contínuo por conta própria.',
 expected:'A lágrima artificial pode aliviar rapidamente, mas o efeito pode ser temporário e a necessidade variar com a causa e o ambiente. Uma breve turvação após a gota deve desaparecer. Irritação persistente, dor ou piora visual exigem reavaliação.',
 alarm:'Observar vermelhidão crescente, secreção, inchaço, dor, sensibilidade à luz ou visão que continua embaçada. Olho vermelho durante uso de lente de contato merece atenção imediata pelo risco de infecção.',
 immediate:'Procurar atendimento imediato se houver perda ou alteração persistente da visão, fotofobia, dor intensa, trauma ou corpo estranho. Olho vermelho doloroso, sobretudo com lente de contato, exige avaliação no mesmo dia. Não tentar resolver esses sinais aumentando colírios.',
 return:'Se os sintomas persistirem, revisar em 2–4 semanas para investigar a causa. Antecipar se piorarem ou se forem necessárias mais de 4 aplicações diárias; pode ser preciso trocar conservante, formulação ou abordagem. O lubrificante alivia a superfície ocular, mas não substitui o tratamento da causa.',
 sources:[source('NHS — olho seco','https://www.nhs.uk/symptoms/dry-eyes/'),source('NHS — uso de carmelose em adultos e crianças','https://www.nhs.uk/medicines/carmellose-sodium/how-and-when-to-use-carmellose-sodium-eye-drops/'),source('Moorfields — doença alérgica ocular pediátrica','https://www.moorfields.nhs.uk/for-health-professionals/childrens-eye-conditions-management/allergic-eye-disease'),source('RCH — olho vermelho agudo','https://www.rch.org.au/clinicalguide/guideline_index/Acute_red_eye/')]
}];
