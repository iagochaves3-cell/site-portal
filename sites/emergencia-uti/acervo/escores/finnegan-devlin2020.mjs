// Variante consultiva de oito itens; não altera a ficha Finnegan Queensland.
// Devlin et al., JAMA Network Open 2020, DOI 10.1001/jamanetworkopen.2020.2275.
// Adaptação PT-BR da Table 4, artigo CC-BY; não é protocolo terapêutico.
import {make,ref} from './expanded-scores.mjs';

const primaryUrl='https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2764196';
const editorialUrl='https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2764194';
const observation=(id,label,hint)=>({id,label,type:'select',group:'Oito critérios observados',noPoints:true,options:[{value:0,label:'Ausente — avaliado · 0 pt'},{value:1,label:'Presente — avaliado · 1 pt'},{value:'ND',label:'Não avaliado / desconhecido'}],hint});
const gate=(id,label,hint)=>({id,label,type:'select',group:'População do estudo',noPoints:true,options:[{value:1,label:'Sim — confirmado'},{value:0,label:'Não'},{value:'ND',label:'Desconhecido'}],hint});
export const FINNEGAN_DEVLIN2020_ITEMS=['sleep','tremors','tone','temperature','respiratory','sucking','feeding','regurgitation'];
const gates=['gestation_eligible','opioid_exposure','no_other_illness'];
const known=value=>value===0||value===1||value==='0'||value==='1';

export const finneganDevlin2020=make({
 id:'finnegan-simplificado-devlin-2020',
 name:'Finnegan simplificado · Devlin 2020',
 subtitle:'Oito itens binários · pontuação consultiva de pesquisa',
 specialty:'Neonatologia',population:'Neonatos · nascimento ≥36 semanas',max:8,range:'0–8',
 reviewDate:'07/10/2026',
 aliases:['sFNAST Devlin 2020','Finnegan 8 itens 2020'],
 scope:'Neonatos com idade gestacional ao nascer ≥36 semanas, exposição pré-natal a opioides e sem outra doença médica ou cirúrgica significativa, conforme a população estudada. Registre a avaliação dos oito sinais; desconhecido não equivale a ausente. Uso consultivo do modelo de pesquisa de 2020, sob avaliação clínica profissional.',
 eligibilityConfirmation:'Confirmei a população estudada e o uso apenas consultivo; o total não determina tratamento, observação nem alta.',
 fields:[
  gate('gestation_eligible','Idade gestacional ao nascer ≥36 semanas','A idade gestacional ao nascer deve estar documentada; não extrapolar para <36 semanas.'),
  gate('opioid_exposure','Exposição pré-natal a opioides confirmada','Sem exposição documentada ou com história desconhecida, esta variante não fornece total.'),
  gate('no_other_illness','Ausência de outra doença médica ou cirúrgica significativa confirmada','Doença concomitante ou avaliação incompleta impede o cálculo nesta população restrita. Os sinais também podem ter outras causas.'),
  observation('sleep','Dorme <3 horas após a alimentação','Menos de 3 horas: presente. Exatamente 3 horas ou mais: ausente. Não substituir pelo critério de sono do Eat, Sleep, Console.'),
  observation('tremors','Qualquer tremor, com ou sem estímulo','Os tremores com e sem estímulo foram reunidos em um único item. Marque uma vez, sem graduar intensidade nem duplicar pontos.'),
  observation('tone','Tônus muscular aumentado','Classificação clínica observada: presença vale 1, ausência confirmada vale 0.'),
  observation('temperature','Temperatura corporal ≥37,2 °C','Exatamente 37,2 °C já atende ao critério. Valores maiores continuam valendo apenas 1 ponto neste modelo.'),
  observation('respiratory','Frequência respiratória >60/min','Exatamente 60/min não atende ao critério; mais de 60/min atende. Não adicionar pontos por retrações neste modelo.'),
  observation('sucking','Sucção excessiva','Presença avaliada clinicamente; não confundir com alimentação adequada.'),
  observation('feeding','Alimentação inadequada (poor feeding)','Presença avaliada clinicamente; não importar volumes ou cortes de outro instrumento.'),
  observation('regurgitation','Regurgitação','Presença avaliada clinicamente. Não acrescentar os pesos do Finnegan de 21 itens nem presumir equivalência com vômito em jato.')
 ],
 formula:'Total = número de critérios presentes entre os oito itens; cada presente vale 1 e cada ausente confirmado vale 0. Total inteiro de 0 a 8. Os três campos de população não somam pontos. Qualquer item desconhecido ou população não confirmada impede o total.',
 limits:'Esta é a variante binária de Devlin et al. (2020), não o Finnegan Queensland de 21 itens, o modelo simplificado de 2017 ou Eat, Sleep, Console. A derivação incluiu 424 neonatos e a validação externa 109. O estudo usou uma única avaliação por neonato: o maior escore no dia de início do tratamento, ou no terceiro dia de vida se nunca tratado. A Table 5 comparou 0–3, 4 e ≥5 com as faixas do instrumento original, com concordância apenas moderada (κ ponderado 0,55); não são critérios terapêuticos automáticos. Não há avaliação do risco individual, diagnóstico, indicação de medicamento ou alta. A publicação solicitou validação prospectiva da utilidade clínica. Convulsões e outras manifestações graves podem não aumentar este total: avaliação urgente e investigação de outras causas prevalecem sobre qualquer pontuação, inclusive zero.',
 sources:[ref('Devlin et al. · JAMA Network Open 2020 · Methods, Tables 4–5 e Limitations · CC-BY',primaryUrl),ref('Oei e Wouldes · comentário clínico original 2020 · limites de uma avaliação e sinais graves omitidos',editorialUrl)],
 source_validation:{references:[{examined:true,url:primaryUrl,entity:'Devlin et al. / JAMA Network Open',title:'Association of a Simplified Finnegan Neonatal Abstinence Scoring Tool With the Need for Pharmacologic Treatment for Neonatal Abstinence Syndrome',version_or_date:'2020-04-08',locator:'Methods: Data Collection / Analyses; Table 4; Table 5; Discussion; Limitations; Article Information',checked_at:'2026-10-07T08:37:41.557Z',evidence_sha256:'0924481091079f51bf7817e0ccd428f6d3978ecbf62f4572e967ee2dd3602c50',evidence_kind:'native_web_extracted_text_not_full_HTML',reliable_because:'Estudo original revisado por pares, com derivação, validação externa, tabela de oito itens e limites examinados. Autoridade suficiente para representar o somador binário na população identificada, sem decisão terapêutica.'}]},
 validate:values=>[...gates.filter(id=>!known(values[id])||Number(values[id])!==1),...FINNEGAN_DEVLIN2020_ITEMS.filter(id=>!known(values[id]))],
 compute:values=>{
  if(gates.some(id=>values[id]!==1)||FINNEGAN_DEVLIN2020_ITEMS.some(id=>values[id]!==0&&values[id]!==1))throw new TypeError('Critérios observados e população confirmada são obrigatórios.');
  const breakdown=FINNEGAN_DEVLIN2020_ITEMS.map(id=>({label:finneganDevlin2020.fields.find(field=>field.id===id).label,points:values[id]}));
  const total=breakdown.reduce((sum,item)=>sum+item.points,0);
  return {total,label:'Pontuação consultiva · oito itens',level:'medium',action:'Registre os sinais e integre a avaliação clínica. Esta soma não indica iniciar, ajustar ou suspender medicamento, nem determina alta. Manifestações graves exigem avaliação independentemente do total.',breakdown,audit:breakdown.map(item=>item.points).join(' + '),alerts:['Não usar as faixas 4 e ≥5 como gatilhos terapêuticos. Um total baixo ou zero não exclui abstinência, outra doença ou manifestações graves omitidas pelo modelo.']};
 }
});
