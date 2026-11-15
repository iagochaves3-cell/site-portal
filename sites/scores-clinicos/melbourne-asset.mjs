import {make,ref} from './expanded-scores.mjs';
const field=(id,label,options,hint='')=>({id,label,type:'select',options:options.map(([value,label])=>({value,label})),hint});
const actions=[
 'Faixa 0–2: o protocolo Einstein permite considerar antibiótico oral, conforme avaliação clínica, tolerância e seguimento. Não define alta nem exclui complicações.',
 'Exatamente 3: individualizar a via. Considerar idade, localização, extensão, evolução, antibiótico recente, seguimento e decisão compartilhada.',
 'Faixa 4–7: limiar proposto para considerar antibiótico intravenoso. Confirmar a necessidade pelo quadro clínico; não determina internação automaticamente.'
];
const warning='Desempenho limitado na validação externa: não usar o ASSET isoladamente para escolher a via do antibiótico ou decidir alta.';
const contextAlert=v=>{
 if(!v||typeof v!=='object'||Array.isArray(v)||!['string','number'].includes(typeof v.context)||![0,1,2,3].some(n=>String(n)===String(v.context)))return null;
 const context=Number(v.context);
 return context===1?'Suspeita de celulite orbitária: avaliação hospitalar urgente com oftalmologia e investigação apropriada. Não aguardar a pontuação.':context>1?'Fora da população aplicável: a escolha da via deve seguir avaliação clínica específica, sem interpretação do ASSET.':null;
};
export const melbourneAsset=make({
 id:'melbourne-asset',name:'Melbourne ASSET',subtitle:'Celulite pediátrica · escore citado no protocolo Einstein',specialty:'Pediatria',specialties:['Infectologia','Dermatologia','Oftalmologia'],population:'6 meses a 18 anos · celulite',max:7,range:'0–7',wave11:true,reviewDate:'10/10/2026',categoricalOnIneligible:true,
 aliases:['ASSET','Albert Einstein','celulite','erisipela','celulite pré-septal','celulite periorbitária','celulite orbitária — não aplicável'],
 scope:'Crianças e adolescentes de 6 meses a 18 anos com celulite. Apoia a escolha da via do antibiótico. Não usar para celulite orbitária, imunossupressão, toxicidade clínica ou impossibilidade de tomar antibiótico oral. Acometimento pré-septal não equivale a infecção orbitária.',
 fields:[
 {...field('context','Condições de aplicação',[[0,'População aplicável, sem condições de exclusão'],[1,'Suspeita ou confirmação de celulite orbitária'],[2,'Idade abaixo de 6 meses ou acima de 18 anos'],[3,'Imunossupressão, toxicidade clínica ou impossibilidade de via oral']],'Dor ao mover o olho, proptose, limitação dos movimentos ou alteração visual exigem investigação urgente. Exame inconclusivo não exclui acometimento orbitário.'),noPoints:true},
 field('area','A · Área acometida',[[0,'Menos de 1% da superfície corporal'],[1,'1% ou mais da superfície corporal']],'A mão da própria criança, incluindo os dedos juntos, aproxima 1% da superfície corporal. Exatamente 1% recebe 1 ponto.'),
 field('systemic','S · Manifestações sistêmicas',[[0,'Ausentes'],[1,'Presentes']],'Avaliação clínica de manifestações sistêmicas da infecção. Toxicidade clínica deve ser registrada também nas condições de exclusão.'),
 field('swelling','S · Intensidade do edema',[[0,'Sem edema'],[1,'Edema leve'],[2,'Edema moderado ou intenso']]),
 field('eye','E · Envolvimento da região ocular',[[0,'Não acometida'],[1,'Acometida']],'Inclui localização periorbitária/pré-septal. Este ponto não diagnostica acometimento pós-septal nem substitui exame ocular.'),
 field('tenderness','T · Dor à palpação',[[0,'Sem dor'],[1,'Dor leve'],[2,'Dor moderada ou intensa']])
 ],
 formula:'ASSET = A + S + S + E + T. Cinco componentes: área (0–1), manifestações sistêmicas (0–1), edema (0–2), região ocular (0–1) e dor à palpação (0–2). Total 0–7; o campo de aplicação não soma pontos. Interpretação: 0–2, exatamente 3 e 4–7.',
 bands:[[2,'0–2 · considerar via oral','low',actions[0]],[3,'3 · decisão individualizada','medium',actions[1]],[7,'4–7 · considerar via intravenosa','high',actions[2]]],
 limits:'Instrumento desenvolvido em Melbourne, não pelo Einstein. O guia Einstein o utiliza como apoio. Não discrimina celulite pré-septal de orbitária e não fornece probabilidade de abscesso. Exatamente 1% pontua 1 conforme a tabela ASSET; a transcrição Einstein apresenta >1%, sem categoria para a igualdade. A validação externa de 2026 encontrou discriminação limitada, apesar de concordância global substancial entre avaliadores. Um total baixo não substitui a avaliação de gravidade. Não é prescrição nem regra automática de internação ou alta.',
 sources:[
 ref('Einstein · Celulite e erisipela em crianças e adolescentes · v.4 · seção 3','https://medicalsuite.einstein.br/pratica-medica/Pathways/Celulite%20em%20Crianc%CC%A7as%20e%20Adolescentes%20v.4.pdf'),
 ref('Ibrahim et al. · derivação e validação do Melbourne ASSET · Pediatrics 2019','https://doi.org/10.1542/peds.2018-1420'),
 ref('DGPI · Neubert et al., 2024 · tabela ASSET, página 186 · limite ≥1%','https://shop.mhp-verlag.de/media/pdf/e3/a3/f2/hm202409_183_192_Neubert_mit-Literatur.pdf'),
 ref('Thémelin et al. · validação externa · CJEM 2026','https://doi.org/10.1007/s43678-026-01245-9')],
 assessPartial:v=>{const alert=contextAlert(v);return alert?{level:'high',alert}:null;},
 compute:v=>{
  const alert=contextAlert(v);
  if(alert)return {total:null,displayValue:'Não aplicável',label:'Não interpretar como ASSET',level:'high',action:alert,breakdown:[],audit:'Condição de exclusão identificada; total não emitido',alerts:[alert]};
  const breakdown=['area','systemic','swelling','eye','tenderness'].map(id=>({label:melbourneAsset.fields.find(f=>f.id===id).label,points:v[id]}));
  const total=breakdown.reduce((sum,b)=>sum+b.points,0),index=total<3?0:total===3?1:2;
  return {total,label:melbourneAsset.bands[index][1],level:melbourneAsset.bands[index][2],action:actions[index],breakdown,audit:breakdown.map(b=>b.points).join(' + '),alerts:[warning,...(v.eye===1?['Confirmar localização pré-septal. Se houver dúvida de acometimento orbitário, não utilizar esta faixa para decidir tratamento ambulatorial.']:[])]};
 }
});
