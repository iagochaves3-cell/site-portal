/* Narrow independently verified links. No generic kg calculator or inferred products. */
(function(root){'use strict';
const BULA='https://knighttx.com.br/bulas/Ambisome_HCP.pdf',REG='https://dados.anvisa.gov.br/dados/CONSULTAS/PRODUTOS/TA_CONSULTA_MEDICAMENTOS.CSV';
const requirements={hepatic:'Função hepática avaliada e sem insuficiência',clinical:'Sem alergia, gestação/lactação, mucormicose, infecção do SNC ou necessidade de esquema próprio; função renal estável, exames e interações revisados',monitoring:'Equipe hospitalar e monitorização renal, hepática, hematológica, potássio e magnésio disponíveis',test:'Dose-teste de 1 mg em até 10 min, com observação de 30 min, já realizada e tolerada',prior:'Nenhuma dose terapêutica de anfotericina nas últimas 24 horas (exceto a dose-teste declarada)'};
function number(v){if(!['string','number'].includes(typeof v))return NaN;return /^\d+(?:[.,]\d{1,3})?$/.test(String(v).trim())?Number(String(v).replace(',','.')):NaN;}
function calculate(input){const fail=reason=>({ok:false,reason:'NÃO CALCULADO: '+reason});
 if(!input||typeof input!=='object'||Array.isArray(input))return fail('dados ausentes ou inválidos.');
 if(input.scheme!=='RGM-MED-014-01'||input.product!=='validated:ambisome50')return fail('produto/formulação ou esquema sem vínculo validado.');
 const w=number(input.weight),a=number(input.age);if(!Number.isFinite(w)||w<=0||!Number.isFinite(a)||a<0)return fail('peso/idade inválidos; use números positivos e até 3 casas decimais (idade pode ser zero).');
 if(w>300)return fail('peso acima de 300 kg fora do escopo operacional; exige individualização. Não é um teto de dose.');
 if(!['dias','meses','anos'].includes(input.unit))return fail('unidade da idade ausente.');
 if((input.unit==='dias'&&a<=31)||(input.unit==='meses'&&a<=1)||(input.unit==='anos'&&a<=1/12))return fail('idade de um mês ou menos / transição em dias sem mês completo comprovado; requer avaliação própria.');
 if(!['Candidíase invasiva — esquema definido por infectologia','Aspergilose invasiva — esquema definido por infectologia'].includes(input.diagnosis)||input.route!=='IV')return fail('indicação ou via não vinculada a este esquema.');
 for(const [key,label] of Object.entries(requirements))if(input[key]!=='confirmed')return fail('confirmar: '+label+'.');
 if(!['0','1'].includes(input.testToday))return fail('informar se a dose-teste de 1 mg ocorreu nas últimas 24 horas.');
 const dose=3*w,stock=dose/4,exposure=dose+Number(input.testToday);if(![dose,stock,exposure].every(Number.isFinite))return fail('resultado fora da capacidade numérica.');
 const result={ok:true,doseMin:dose,doseMax:dose,stockMin:stock,stockMax:stock,exposure24h:exposure,dailyTherapeutic:dose,intervalHours:24,source:BULA,regulatorySource:REG,date:'2026-10-26',preparationReason:'Selecionar diluente, concentração FINAL e tempo de infusão; volume da ampola não define a bomba.'};
 if(input.diluent&&input.diluent!=='sg5'){result.preparationReason='NÃO CALCULADO — INCOMPATÍVEL: AmBisome não pode ser diluído em salina nem misturado com eletrólitos/outros fármacos.';return result;}
 if(input.diluent!=='sg5'||!['0.2','2'].includes(input.finalConcentration)||!['30','60'].includes(input.minutes))return result;
 const c=Number(input.finalConcentration),t=Number(input.minutes);result.finalVolume=dose/c;result.diluentVolume=result.finalVolume-stock;result.rate=result.finalVolume*60/t;result.finalConcentration=c;result.minutes=t;result.preparationReason=null;return result;
}
root.AnvisaTableClinical={calculate,requirements,BULA,REG};if(typeof module!=='undefined')module.exports=root.AnvisaTableClinical;
})(typeof window!=='undefined'?window:globalThis);
