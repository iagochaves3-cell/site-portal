/** Research contract only. Fresh implementation of published nSOFA table.
 * Sources: Wynn/Polin DOI 10.1038/s41390-019-0517-2;
 * Fleiss et al. DOI 10.1001/jamanetworkopen.2020.36518, Table 1.
 * No code from an external repository has been installed or executed.
 */
export const CONTEXTS = Object.freeze(['loi_vlbw_2019_2021','loi_all_nicu_2025','general_nicu_2021']);
export const VASOACTIVES = Object.freeze(['dopamine','dobutamine','epinephrine','norepinephrine','vasopressin','milrinone','phenylephrine']);
export const missing = value => value === undefined || value === null || value === '';
const validNumber = v => typeof v === 'number' && Number.isFinite(v);
const invalid = (field,reason) => ({field,reason});
// Snapshot own data descriptors once. Never read accessors or invoke coercion.
// A Proxy can run reflection traps; catch failures. This is not an object sandbox.
function safeRecord(raw) {
  try {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {data:Object.create(null),invalid:true};
    const proto=Object.getPrototypeOf(raw);
    if (proto !== Object.prototype && proto !== null) return {data:Object.create(null),invalid:true};
    const descriptors=Object.getOwnPropertyDescriptors(raw),data=Object.create(null);
    for (const key of Reflect.ownKeys(descriptors)) {
      const descriptor=descriptors[key];
      if (!Object.hasOwn(descriptor,'value')) return {data:Object.create(null),invalid:true};
      data[key]=descriptor.value;
    }
    return {data,invalid:false};
  } catch {return {data:Object.create(null),invalid:true};}
}


// Rational decimal interpretation of the finite numeric input's canonical string.
// E.g. .28 is interpreted as 28/100; no binary product or epsilon at a threshold.
function decimalRational(value) {
  const [mantissa,expText='0']=Number.prototype.toString.call(value).toLowerCase().split('e');
  const [whole,fraction='']=mantissa.split('.');
  const exponent=Number(expText)-fraction.length;
  const integer=BigInt(whole+fraction);
  return exponent>=0 ? [integer*10n**BigInt(exponent),1n] : [integer,10n**BigInt(-exponent)];
}
function fitsDecimalPrecision(value,places) {
  return validNumber(value) && decimalRational(value)[1] <= 10n**BigInt(places);
}
function sfLessThan(spo2,fio2,threshold) {
  const [sn,sd]=decimalRational(spo2),[fn,fd]=decimalRational(fio2);
  return sn*fd < BigInt(threshold)*fn*sd;
}

export function assessNsofaContext(raw = {}) {
  const parsed=safeRecord(raw),c=parsed.data;
  const issues = parsed.invalid ? [invalid('context','Objeto de contexto inválido; somente propriedades próprias de dados.')] : [], warnings = [];
  if (!CONTEXTS.includes(c.kind)) issues.push(invalid('context.kind','Escolha explicitamente um contexto sustentado.'));
  if (c.neonatalNicuConfirmed !== true) issues.push(invalid('context.neonatalNicuConfirmed','Confirmar paciente da população de UTI neonatal; não aplicar como SOFA adulto/pediátrico.'));
  if (c.kind === 'loi_vlbw_2019_2021' || c.kind === 'loi_all_nicu_2025') {
    if (!validNumber(c.ageAtEventHours) || c.ageAtEventHours <= 72) issues.push(invalid('context.ageAtEventHours','Infecção/avaliação índice deve ocorrer após 72 horas de vida.'));
    if (!validNumber(c.offsetHours)) issues.push(invalid('context.offsetHours','Registrar horas da avaliação em relação ao evento índice.'));
    if (c.kind === 'loi_vlbw_2019_2021') {
      if (!validNumber(c.gestationalAgeAtBirthWeeks) || c.gestationalAgeAtBirthWeeks <= 0 || c.gestationalAgeAtBirthWeeks >= 33) issues.push(invalid('context.gestationalAgeAtBirthWeeks','Contexto original exige idade gestacional ao nascer <33 semanas.'));
      if (!validNumber(c.birthWeightGrams) || c.birthWeightGrams <= 0 || c.birthWeightGrams >= 1500) issues.push(invalid('context.birthWeightGrams','Contexto original de muito baixo peso: peso ao nascer <1500 g.'));
      if (c.indexAnchor !== 'blood_culture') issues.push(invalid('context.indexAnchor','Usar a coleta da hemocultura como T0.'));
      if (c.infectionConfirmed !== true) warnings.push('O contexto prognóstico original foi estudado em infecção confirmada; suspeita ainda não confirmada tem evidência própria em 2025.');
      if (validNumber(c.offsetHours) && ![-48,-24,-12,-6,0,6,12,24,48].includes(c.offsetHours)) warnings.push('Instante fora dos nove tempos específicos avaliados no contexto original; saída apenas descritiva.');
    } else {
      if (c.indexAnchor !== 'new_parenteral_antibiotic') issues.push(invalid('context.indexAnchor','Na coorte de 2025, T0 é a nova administração de antibiótico parenteral de amplo espectro.'));
      if (c.antibioticFreePrior48Hours !== true) issues.push(invalid('context.antibioticFreePrior48Hours','A definição de nova avaliação de 2025 exigia ausência de antibiótico nas 48 h anteriores.'));
      if (validNumber(c.offsetHours) && ![0,6].includes(c.offsetHours)) warnings.push('Instante fora de T0/T6 estudados em 2025; saída apenas descritiva.');
    }
  }
  if (c.kind === 'general_nicu_2021') {
    if (!validNumber(c.hoursSinceAdmission) || c.hoursSinceAdmission < 0 || c.hoursSinceAdmission > 672) issues.push(invalid('context.hoursSinceAdmission','Contexto geral validado até 28 dias após a admissão em UTI neonatal.'));
    warnings.push('Coorte geral: escores horários e máximos por janela foram estudados. Um valor isolado não equivale ao máximo das primeiras 24 h ou de 28 dias.');
  }
  return {status:issues.length ? 'context_not_confirmed' : 'context_confirmed',issues,warnings};
}

export function calculateNsofa(raw = {}) {
  const parsed=safeRecord(raw),v=parsed.data;
  const issues = parsed.invalid ? [invalid('values','Objeto de valores inválido; somente propriedades próprias de dados.')] : [], warnings = [];
  const checkBool = k => { if (typeof v[k] !== 'boolean') issues.push(invalid(k,'Resposta explícita sim/não obrigatória; ausente não é não.')); };
  checkBool('intubated'); checkBool('systemicSteroid');
  if (!validNumber(v.vasoactiveCount) || !Number.isInteger(v.vasoactiveCount) || v.vasoactiveCount < 0 || v.vasoactiveCount > VASOACTIVES.length) issues.push(invalid('vasoactiveCount','Contagem inteira de agentes distintos listados, de 0 a 7.'));
  if (v.snapshotConfirmed !== true) issues.push(invalid('snapshotConfirmed','Confirmar suporte no instante e, se intubado, SpO2/FiO2 pareadas e confiáveis.'));
  if (v.latestAvailablePlateletConfirmed !== true) issues.push(invalid('latestAvailablePlateletConfirmed','Confirmar último resultado plaquetário disponível ao clínico no instante avaliado.'));
  if (!validNumber(v.platelets) || v.platelets < 0) issues.push(invalid('platelets','Contagem medida, numérica e não negativa obrigatória.'));
  if (!['10^9/L','10^3/uL','/uL'].includes(v.plateletUnit)) issues.push(invalid('plateletUnit','Selecionar unidade explícita; não inferir pela magnitude.'));
  let respiratory = null, ratio = null;
  if (v.intubated === false) {
    respiratory = 0; // Explicit source branch, NOT imputation of missing oxygen values.
    if (!missing(v.spo2Percent) || !missing(v.fio2Fraction)) warnings.push('SpO2/FiO2 não participa da pontuação respiratória quando explicitamente não intubado. Não equivale a ausência de doença respiratória.');
  }
  if (v.intubated === true) {
    if (!validNumber(v.spo2Percent) || v.spo2Percent <= 0 || v.spo2Percent > 100 || !fitsDecimalPrecision(v.spo2Percent,6)) issues.push(invalid('spo2Percent','Informar porcentagem numérica >0 e ≤100, por exemplo 95, até 6 casas decimais; 0 não é substituto para ausente.'));
    if (!validNumber(v.fio2Fraction) || v.fio2Fraction < 0.21 || v.fio2Fraction > 1 || !fitsDecimalPrecision(v.fio2Fraction,3)) issues.push(invalid('fio2Fraction','Informar fração 0,21–1,00, até 3 casas decimais. Não converter unidade silenciosamente.'));
    if (!issues.some(i=>['spo2Percent','fio2Fraction'].includes(i.field))) {
      ratio = v.spo2Percent/v.fio2Fraction;
      // Compare exact decimal rational inputs, severest category first.
      // The displayed ratio may be binary float; it never drives classification.
      respiratory = sfLessThan(v.spo2Percent,v.fio2Fraction,100) ? 8
        : sfLessThan(v.spo2Percent,v.fio2Fraction,150) ? 6
        : sfLessThan(v.spo2Percent,v.fio2Fraction,200) ? 4
        : sfLessThan(v.spo2Percent,v.fio2Fraction,300) ? 2 : 0;
      if (v.spo2Percent < 60) warnings.push('SpO2 <60% está fora da faixa exibida pela calculadora da UF. A tabela publicada não declara piso; verificar confiabilidade/percentual. Não arredondar nem limitar para 60.');
    }
  }
  const cardiovascular = !issues.some(i=>['systemicSteroid','vasoactiveCount'].includes(i.field))
    ? (v.vasoactiveCount === 0 ? 0 : v.vasoactiveCount === 1 ? 2 : 3) + (v.systemicSteroid ? 1 : 0) : null;
  let hematologic = null, plateletCount10e9L = null;
  if (!issues.some(i=>['platelets','plateletUnit'].includes(i.field))) {
    plateletCount10e9L = v.plateletUnit === '/uL' ? v.platelets/1000 : v.platelets;
    hematologic = plateletCount10e9L < 50 ? 3 : plateletCount10e9L < 100 ? 2 : plateletCount10e9L < 150 ? 1 : 0;
    if (plateletCount10e9L > 1500) warnings.push('Contagem plaquetária muito elevada: conferir unidade e transcrição; valor não foi corrigido automaticamente.');
  }
  return {
    status: issues.length ? 'incomplete_or_invalid' : 'complete',
    total: issues.length ? null : respiratory + cardiovascular + hematologic,
    components:{respiratory,cardiovascular,hematologic},
    calculated:{sfRatio:ratio,platelets10e9L:plateletCount10e9L}, issues,warnings,
    interpretation:'Soma descritiva dos três domínios, 0–15. Maior valor representa maior carga pontuada de disfunção/suporte. Não diagnostica sepse nem fornece probabilidade individual de óbito ou conduta.',
    probability:null,treatmentRecommendation:null,dischargeRecommendation:null
  };
}

export function evaluateNsofa(raw = {}) {
  const parsed=safeRecord(raw),input=parsed.data;
  const context = assessNsofaContext(input.context), score = calculateNsofa(input.values);
  return {...score,context,status:context.issues.length ? 'context_not_confirmed' : score.status,total:context.issues.length ? null : score.total,warnings:[...context.warnings,...score.warnings]};
}

export function compareNsofaSnapshots(earlierRaw,laterRaw) {
  const e=safeRecord(earlierRaw),l=safeRecord(laterRaw),earlier=e.data,later=l.data;
  if (e.invalid || l.invalid) return {status:'incomplete',delta:null,maximum:null};
  if (!earlier || !later || earlier.status !== 'complete' || later.status !== 'complete' || !Number.isInteger(earlier.total) || !Number.isInteger(later.total) || earlier.total<0 || earlier.total>15 || later.total<0 || later.total>15) return {status:'incomplete',delta:null,maximum:null};
  return {status:'complete',delta:later.total-earlier.total,maximum:Math.max(earlier.total,later.total),interpretation:'Diferença aritmética e máximo de dois totais completos válidos. A função não confirma identidade do paciente, contexto ou ordem temporal. Sem diagnóstico, limiar terapêutico ou probabilidade individual.'};
}

// Catalog adapter. Flat, strict, locale-aware UI/API inputs; no shared-file edits.
const REVIEW_DATE='10/10/2026';
const selectField=(id,label,options,hint='',group='Contexto da avaliação')=>({id,label,type:'select',noPoints:true,group,hint,options:[...options.map(([value,label])=>({value,label})),{value:-1,label:'Não confirmado / desconhecido'}]});
const numberField=(id,label,min,max,precision=0,hint='',group='Contexto da avaliação',allowNA=false)=>({id,label,type:'number',noPoints:true,min,max,precision,step:precision?10**-precision:1,hint,group,allowNA});
const fields=[
 selectField('clinical_context','Contexto da aplicação',[[0,'Infecção tardia em prematuro de muito baixo peso · 2019/2021'],[1,'Avaliação de infecção tardia em toda UTI neonatal · 2025'],[2,'Descrição em UTI neonatal geral · 2021'],[3,'Outro contexto']], 'A mesma soma não torna populações, marcos temporais e prognósticos intercambiáveis.'),
 selectField('neonatal_nicu','Paciente da população de UTI neonatal',[[1,'Sim, contexto neonatal em UTI neonatal confirmado'],[0,'Não / outra população']], 'Não basta estar em qualquer UTI. Não aplicar como SOFA adulto ou pediátrico.'),
 selectField('context_confirmation','Contexto clínico e marco temporal conferidos',[[1,'Contexto prematuro de muito baixo peso e infecção tardia'],[2,'Nova avaliação tardia em UTI neonatal conforme definição de 2025'],[3,'Descrição da população geral de UTI neonatal até 28 dias da admissão'],[0,'Não atendidos']], 'Confirma o contexto clínico básico, não toda elegibilidade retrospectiva das coortes. No original, <33 semanas, <1500 g e evento >72 h; na validação de 2021, primeira LOI sem antibiótico nas 48 h anteriores. A duração futura do antibiótico não deve ser esperada para avaliar o paciente.'),
 numberField('gestational_age_weeks','Idade gestacional ao nascer (semanas)',0,50,3,'Obrigatória somente no contexto original: <33 semanas. Nos demais, deixe vazio ou escreva NA; a opção ampla não exige prematuridade.','Contexto da avaliação',true),
 numberField('birth_weight_g','Peso ao nascer (g)',0,20000,3,'Obrigatório somente no contexto original: <1500 g. Nos demais, vazio ou NA; não inserir peso atual.','Contexto da avaliação',true),
 numberField('age_at_event_hours','Idade pós-natal no evento índice (h)',0,1000000,3,'Obrigatória nos contextos tardios: >72 h. Não é idade corrigida nem tempo desde admissão. No contexto geral, vazio ou NA. Não se aplica teto de 28 dias de vida à infecção tardia.','Contexto da avaliação',true),
 selectField('index_anchor','Marco temporal escolhido',[[0,'T0 = coleta da hemocultura (original)'],[1,'T0 = nova administração parenteral de antibiótico de amplo espectro (2025)'],[2,'Admissão na UTI neonatal (descrição geral)']], 'Selecione o marco correspondente ao contexto, sem trocá-los.'),
 numberField('offset_hours','Horas da observação em relação a T0',-1000000,1000000,3,'Original: −48, −24, −12, −6, 0, +6, +12, +24, +48 h. Coorte 2025: 0 ou +6 h. Outros instantes geram aviso descritivo. No contexto geral, vazio ou NA.','Contexto da avaliação',true),
 numberField('hours_since_admission','Horas desde a admissão em UTI neonatal',0,1000000,3,'Somente contexto geral: 0–672 h, até alta ou morte. Nos contextos tardios, vazio ou NA. Não é tempo desde nascimento.','Contexto da avaliação',true),
 selectField('antibiotic_free48h','Antibióticos nas 48 h antes da nova avaliação',[[1,'Ausência de antibiótico confirmada nas 48 h anteriores'],[0,'Houve antibiótico nesse período'],[2,'Não se aplica ao seletor atual']], 'Obrigatório para a opção ampla de 2025. Nos demais contextos, pode ficar vazio ou não se aplica.'),
 selectField('infection_confirmed','Situação da infecção no contexto tardio',[[1,'Confirmada por avaliação clínica/microbiológica pertinente'],[0,'Suspeita, ainda não confirmada'],[2,'Não se aplica ao contexto geral']], 'O escore não estabelece o diagnóstico. Suspeita é suficiente na coorte ampla de 2025.'),
 numberField('observed_date','Data da observação (AAAAMMDD)',19000101,21991231,0,'Data local, por exemplo 20261010; não informar nome nem data de nascimento.','Instante da observação'),
 numberField('observed_hour','Hora (0–23)',0,23,0,'Relógio de 24 horas.','Instante da observação'),
 numberField('observed_minute','Minuto (0–59)',0,59,0,'Mesmo instante clínico para os componentes.','Instante da observação'),
 numberField('utc_offset_minutes','Diferença para UTC (minutos)',-840,840,0,'UTC = 0; UTC−03:00 = −180.','Instante da observação'),
 selectField('danger_signs','Urgência clínica observada',[[0,'Sem os sinais listados, após avaliação'],[1,'Instabilidade, piora importante, apneia ou hipoperfusão'],[2,'Parada / reanimação ou suporte extracorpóreo']], 'A urgência prevalece sobre a pontuação e não depende de completar o formulário.','Segurança da observação'),
 selectField('support_interpretable','Suporte e medicamentos interpretáveis por esta tabela',[[1,'Estado de intubação e fármacos listados conferidos; sem situação não mapeada'],[0,'Há droga não listada, bolus isolado, via aérea não classificável ou suporte extracorpóreo']], 'Fármacos listados: dopamina, dobutamina, epinefrina, norepinefrina, vasopressina, milrinona e fenilefrina. Não inferir equivalência de outras drogas/suportes.','Segurança da observação'),
 selectField('snapshot_confirmed','Componentes contemporâneos e medidas confiáveis',[[1,'Suporte do mesmo instante; SpO₂/FiO₂ pareadas e confiáveis se intubado'],[0,'Há momentos diferentes, dúvida da medida ou suporte desconhecido']], 'Não somar máximos isolados de horários diferentes. Não retirar suporte para pontuar.','Segurança da observação'),
 selectField('intubated','Intubado no instante avaliado',[[1,'Sim, intubação para ventilação invasiva confirmada'],[0,'Não, ausência de intubação confirmada']], 'CPAP/NIPPV/alto fluxo sem intubação pertence ao ramo não intubado. Estado desconhecido não vale não.','Respiratório'),
 numberField('spo2_percent','SpO₂ (%)',0,100,6,'Obrigatória somente se intubado. Exemplo 95; não 0,95. Se não intubado, vazio ou NA. A tabela não impõe limite de 97%; valores <60% pedem conferência e aviso.','Respiratório',true),
 numberField('fio2_fraction','FiO₂ (fração)',0.21,1,3,'Obrigatória somente se intubado. Exemplo 0,30; não 30. Se não intubado, vazio ou NA. Até três casas, sem arredondamento.','Respiratório',true),
 numberField('vasoactive_count','Número de agentes vasoativos/inotrópicos distintos',0,7,0,'Em uso no mesmo instante, somente os sete fármacos listados. Zero exige ausência confirmada. Não usar valor do VIS, número de bolsas ou agentes de outros horários.','Cardiovascular'),
 selectField('systemic_steroid','Corticoide sistêmico administrado ao bebê',[[1,'Sim'],[0,'Não']], 'Não contar corticoide materno antenatal nem corticoide tópico/inalado. O critério não é restrito à hidrocortisona.','Cardiovascular'),
 numberField('platelets','Última contagem plaquetária disponível',0,2000000,6,'Valor quantitativo conhecido. Não colhido, agregação/clumps ou unidade incerta impedem o total. Zero somente se realmente medido.','Hematológico'),
 selectField('platelet_unit','Unidade das plaquetas',[[0,'×10⁹/L'],[1,'×10³/µL'],[2,'/µL (contagem absoluta)']], '×10⁹/L e ×10³/µL são numericamente iguais. /µL será explicitamente dividido por 1000.','Hematológico'),
 numberField('platelet_result_age_hours','Idade do resultado disponível no instante (h)',0,1000000,3,'Horas desde a disponibilidade desse resultado até a observação. Não inserir resultado futuro. A fonte não define validade máxima universal; a idade fica explícita.','Hematológico'),
 selectField('latest_platelet_confirmed','Último resultado disponível ao clínico confirmado',[[1,'Sim, resultado mais recente já disponível no instante'],[0,'Não / resultado futuro ou disponibilidade incerta']], 'Não escolher o menor valor futuro nem supor normalidade quando ausente.','Hematológico')
];
function parseAdapterField(field,raw) {
 if (typeof raw!=='string' && typeof raw!=='number') return undefined;
 if (field.type==='select') return field.options.find(o=>raw===o.value||raw===String(o.value))?.value;
 if (typeof raw==='number') {
  if (!Number.isFinite(raw)||Object.is(raw,-0)||raw<field.min||raw>field.max||!fitsDecimalPrecision(raw,field.precision)) return undefined;
  return field.precision===0&&!Number.isInteger(raw)?undefined:raw;
 }
 if (!/^-?\d+(?:[.,]\d+)?$/.test(raw)) return undefined;
 const text=raw.replace(',','.');
 if ((text.split('.')[1]?.length||0)>field.precision) return undefined;
 const value=Number(text);
 if (!Number.isFinite(value)||Object.is(value,-0)||value<field.min||value>field.max) return undefined;
 return field.precision===0&&!Number.isInteger(value)?undefined:value;
}
function readAdapter(raw) {
 const record=safeRecord(raw),data=Object.create(null),errors=[],notApplicable=[],observations=Object.create(null);
 if(record.invalid)return {data,errors:fields.map(f=>f.id),notApplicable,observations,payloadInvalid:true};
 const observation=record.data.spo2_percent;
 if(typeof observation==='number'&&Number.isFinite(observation)&&observation>=0&&observation<=100)observations.spo2=observation;
 else if(typeof observation==='string'&&observation.length<=40&&/^\d+(?:[.,]\d+)?$/.test(observation)){const n=Number(observation.replace(',','.'));if(Number.isFinite(n)&&n>=0&&n<=100)observations.spo2=n;}
 const known=new Set(fields.map(f=>f.id));
 if(Reflect.ownKeys(record.data).some(k=>typeof k!=='string'||!known.has(k)))errors.push('clinical_context');
 const context=parseAdapterField(fields.find(f=>f.id==='clinical_context'),record.data.clinical_context);
 const intubated=parseAdapterField(fields.find(f=>f.id==='intubated'),record.data.intubated);
 const active=f=>{
  if(['gestational_age_weeks','birth_weight_g'].includes(f.id))return context===0;
  if(['age_at_event_hours','offset_hours','infection_confirmed'].includes(f.id))return context===0||context===1;
  if(f.id==='hours_since_admission')return context===2;
  if(f.id==='antibiotic_free48h')return context===1;
  if(['spo2_percent','fio2_fraction'].includes(f.id))return intubated!==0;
  return true;
 };
 for(const field of fields) {
  const value=record.data[field.id];
  if(!active(field)) {
   notApplicable.push(field.id);data[field.id]=undefined;
   // Empty/NA explicitly means structurally inapplicable, never a zero substitution.
   // Stale valid values may remain when a context changes; they are never scored.
   if(!missing(value)&&value!=='NA'&&value!=='N/A'&&parseAdapterField(field,value)===undefined)errors.push(field.id);
   continue;
  }
  const parsed=parseAdapterField(field,value);data[field.id]=parsed;
  if(parsed===undefined||(field.type==='select'&&parsed===-1))errors.push(field.id);
 }
 if(data.observed_date!==undefined){const y=Math.floor(data.observed_date/10000),m=Math.floor(data.observed_date/100)%100,d=data.observed_date%100,date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()+1!==m||date.getUTCDate()!==d)errors.push('observed_date');}
 return {data,errors:[...new Set(errors)],notApplicable,observations,payloadInvalid:false};
}
const pad=(n,size=2)=>String(n).padStart(size,'0');
// Exact chronology comparisons over the accepted decimal hour values, not binary sums.
function sumLessThan(a,b,c){const [an,ad]=decimalRational(a),[bn,bd]=decimalRational(b),[cn,cd]=decimalRational(c);return (an*bd+bn*ad)*cd<cn*ad*bd;}
function observedMoment(d){const s=String(d.observed_date),o=d.utc_offset_minutes;return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${pad(d.observed_hour)}:${pad(d.observed_minute)}${o<0?'-':'+'}${pad(Math.floor(Math.abs(o)/60))}:${pad(Math.abs(o)%60)}`;}
const descriptive='Descrição de três domínios no instante avaliado. Maior soma indica maior carga pontuada de disfunção/suporte; não é diagnóstico de sepse, probabilidade individual de óbito ou indicação automática de tratamento, transfusão, internação ou alta. Zero não exclui infecção nem doença grave.';
const emergency='Instabilidade, piora importante, apneia ou hipoperfusão exigem avaliação clínica imediata. Não aguardar o escore; qualquer total, inclusive zero, fica subordinado à avaliação clínica.';
function evaluateAdapter(raw) {
 const {data:d,errors,notApplicable,observations,payloadInvalid}=readAdapter(raw),reasons=[],alerts=[];
 if(d.danger_signs===1||d.danger_signs===2)alerts.push(emergency);
 if(observations.spo2!==undefined&&observations.spo2<60)alerts.push('SpO₂ informada abaixo de 60%: confirmar imediatamente a medida/unidade e avaliar a oxigenação e o estado clínico. Este alerta local de segurança permanece mesmo se não intubado, inelegível ou com dados faltantes; não aguardar o escore.');
 if(d.danger_signs===2)reasons.push('Parada, reanimação ou suporte extracorpóreo não são mapeados por este contrato pontual.');
 if(d.neonatal_nicu===0)reasons.push('População diferente da UTI neonatal: não interpretar como nSOFA.');
 if(d.clinical_context===3)reasons.push('Contexto fora das três aplicações verificadas.');
 if(d.context_confirmation===0)reasons.push('Contexto clínico não confirmado.');
 if(d.context_confirmation>0&&d.clinical_context!==undefined&&d.context_confirmation!==d.clinical_context+1)reasons.push('A confirmação pertence a outro contexto; confira novamente após a troca de aplicação.');
 if(d.index_anchor!==undefined&&d.clinical_context!==undefined&&d.index_anchor!==d.clinical_context)reasons.push('Marco temporal incompatível com a aplicação selecionada.');
 if((d.clinical_context===0||d.clinical_context===1)&&d.infection_confirmed===2)reasons.push('Informar suspeita ou confirmação da infecção no contexto tardio.');
 if(d.clinical_context===0){if(d.gestational_age_weeks!==undefined&&(d.gestational_age_weeks<=0||d.gestational_age_weeks>=33))reasons.push('Aplicação original: idade gestacional ao nascer deve ser <33 semanas.');if(d.birth_weight_g!==undefined&&(d.birth_weight_g<=0||d.birth_weight_g>=1500))reasons.push('Aplicação original: peso ao nascer deve ser <1500 g.');}
 if((d.clinical_context===0||d.clinical_context===1)&&d.age_at_event_hours!==undefined&&d.age_at_event_hours<=72)reasons.push('O evento tardio deve ocorrer após 72 h de vida.');
 if((d.clinical_context===0||d.clinical_context===1)&&d.age_at_event_hours!==undefined&&d.offset_hours!==undefined){
  if(sumLessThan(d.age_at_event_hours,d.offset_hours,0))reasons.push('Cronologia incompatível: a observação antecederia o nascimento. Guarda local de consistência, não um limiar do nSOFA.');
  if(d.platelet_result_age_hours!==undefined&&sumLessThan(d.age_at_event_hours,d.offset_hours,d.platelet_result_age_hours))reasons.push('Cronologia incompatível: o resultado plaquetário antecederia o nascimento. Confira a idade no evento, o intervalo de T0 e a idade do resultado.');
 }
 if(d.clinical_context===1&&d.antibiotic_free48h!==undefined&&d.antibiotic_free48h!==1)reasons.push('A nova avaliação de 2025 exige 48 h anteriores sem antibiótico.');
 if(d.clinical_context===2&&d.hours_since_admission>672)reasons.push('Contexto geral fora dos primeiros 28 dias após admissão.');
 if(d.support_interpretable===0)reasons.push('Há suporte ou agente não mapeado; não criar equivalências automáticas.');
 if(d.snapshot_confirmed===0)reasons.push('Componentes não contemporâneos ou medidas não confiáveis.');
 if(d.latest_platelet_confirmed===0)reasons.push('Último resultado disponível não confirmado; não imputar normalidade nem usar resultado futuro.');
 const common={complete:false,total:null,breakdown:[],errors,alerts,level:alerts.length?'high':'medium',notApplicable,probability:null,treatmentRecommendation:null,dischargeRecommendation:null};
 if(reasons.length)return {...common,complete:errors.length===0,status:'ineligible',displayValue:'Não aplicável',label:'nSOFA não emitido',reason:reasons.join(' '),action:[...alerts,...reasons,descriptive].join(' '),audit:'Sem total: contexto ou observação não interpretável.'};
 if(errors.length||payloadInvalid)return {...common,status:'incomplete',label:'Dados insuficientes ou inválidos',reason:'Informe os campos aplicáveis. Ausente/desconhecido não equivale a zero. Os campos condicionais não aplicáveis podem ficar vazios ou NA.',action:[...alerts,descriptive].join(' '),audit:'Sem total: campos inválidos ou incompletos.'};
 const context={kind:CONTEXTS[d.clinical_context],neonatalNicuConfirmed:d.neonatal_nicu===1,ageAtEventHours:d.age_at_event_hours,offsetHours:d.offset_hours,gestationalAgeAtBirthWeeks:d.gestational_age_weeks,birthWeightGrams:d.birth_weight_g,indexAnchor:d.index_anchor===0?'blood_culture':d.index_anchor===1?'new_parenteral_antibiotic':'nicu_admission',antibioticFreePrior48Hours:d.antibiotic_free48h===1,infectionConfirmed:d.infection_confirmed===1,hoursSinceAdmission:d.hours_since_admission};
 const result=evaluateNsofa({context,values:{intubated:d.intubated===1,spo2Percent:d.spo2_percent,fio2Fraction:d.fio2_fraction,vasoactiveCount:d.vasoactive_count,systemicSteroid:d.systemic_steroid===1,platelets:d.platelets,plateletUnit:['10^9/L','10^3/uL','/uL'][d.platelet_unit],snapshotConfirmed:d.snapshot_confirmed===1,latestAvailablePlateletConfirmed:d.latest_platelet_confirmed===1}});
 if(result.total===null)return {...common,status:'incomplete',errors:fields.map(f=>f.id),label:'Dados não calculáveis',reason:[...result.issues,...result.context.issues].map(x=>x.reason).join(' '),action:descriptive,audit:'Sem total: revisão dos dados necessária.'};
 const moment=observedMoment(d),warnings=[...result.warnings],p=result.components;
 const breakdown=[{label:'Respiratório',points:p.respiratory,detail:d.intubated===0?'Não intubado confirmado: 0 pontos; SpO₂/FiO₂ não aplicáveis.':`SpO₂ ${d.spo2_percent}% / FiO₂ ${d.fio2_fraction}; categoria decidida por racionais decimais exatos: ${p.respiratory} pontos.`},{label:'Cardiovascular',points:p.cardiovascular,detail:`${d.vasoactive_count} agente(s) distinto(s); corticoide sistêmico ${d.systemic_steroid===1?'sim':'não'}: ${p.cardiovascular} pontos.`},{label:'Hematológico',points:p.hematologic,detail:`${result.calculated.platelets10e9L} ×10⁹/L; resultado disponível há ${d.platelet_result_age_hours} h: ${p.hematologic} pontos.`}];
 return {...common,complete:true,status:'scored',total:result.total,displayValue:String(result.total),level:alerts.length?'high':'neutral',label:'nSOFA · disfunção/suporte observado',breakdown,observedAt:moment,application:fields[0].options.find(o=>o.value===d.clinical_context).label,warningNotes:warnings,action:[...alerts,descriptive,...warnings].join(' '),audit:`${p.respiratory} + ${p.cardiovascular} + ${p.hematologic} = ${result.total}. ${d.intubated===0?'Não intubado confirmado; SpO₂/FiO₂ não aplicáveis. ':''}Instante: ${moment}. Marco: ${fields.find(f=>f.id==='index_anchor').options.find(o=>o.value===d.index_anchor).label}; ${d.clinical_context===2?d.hours_since_admission+' h desde admissão':d.offset_hours+' h de T0'}. Plaquetas: último resultado já disponível, idade ${d.platelet_result_age_hours} h. Sem soma de máximos de horários diferentes.`};
}
export const nSofaNeonatalScore={
 id:'nsofa-neonatal',name:'nSOFA · neonatal',shortName:'nSOFA',subtitle:'Disfunção orgânica neonatal · contexto e momento explícitos · 0–15',expanded:true,
 specialty:'Neonatologia',specialties:['Neonatologia','Pediatria','Emergência e UTI','Infectologia'],population:'UTI neonatal · prematuros e a termo conforme aplicação',aliases:['Neonatal Sequential Organ Failure Assessment','Neonatal SOFA','SOFA neonatal','nSOFA Wynn Polin'],conditions:['Sepse','Disfunção orgânica neonatal'],purposes:['Descrição de disfunção orgânica'],keywords:['neonato','prematuro','sepse tardia','UTI neonatal'],searchTerms:['intubação','plaquetas','suporte cardiovascular'],reviewDate:REVIEW_DATE,range:'0–15',max:15,unit:'pontos',resultScale:true,categoricalOnIneligible:true,
 scope:'Três aplicações da mesma tabela: (1) contexto original de infecção tardia (>72 h) em nascidos <33 semanas e <1500 g, com T0 na coleta de hemocultura; (2) nova avaliação tardia em UTI neonatal de 2025, todas as idades gestacionais/pesos, após 48 h sem antibiótico, T0 na nova administração parenteral; (3) descrição geral em UTI neonatal, até 28 dias da admissão. Não é teste diagnóstico. A opção original identifica contexto clínico básico, sem certificar todos os critérios retrospectivos de pesquisa. Se não intubado, SpO₂/FiO₂ não se aplicam e podem ficar vazias/NA.',
 eligibilityConfirmation:'Conferi população, contexto, marco temporal e observação. Entendo que o resultado é descritivo, não diagnóstico, probabilidade individual nem ordem de tratamento/alta.',
 formula:'nSOFA = respiratório (0, 2, 4, 6 ou 8) + cardiovascular (0–4) + hematológico (0–3). Respiratório: não intubado = 0; se intubado, S/F ≥300 = 0; 200–<300 = 2; 150–<200 = 4; 100–<150 = 6; <100 = 8, usando SpO₂ em % e FiO₂ em fração. Cardiovascular: nenhum/um/≥2 agentes vale 0/2/3, somando 1 se corticoide sistêmico. Plaquetas ×10⁹/L: ≥150 = 0; 100–<150 = 1; 50–<100 = 2; <50 = 3.',
 limits:descriptive+' Instituições podem usar limiares diferentes de intubação, corticoides e vasoativos, afetando a pontuação. O domínio respiratório zero em não intubados não exclui hipoxemia importante. Não importar critérios do SOFA/pSOFA, VIS ou Phoenix. Valores ausentes nunca recebem zero; não reproduzir a imputação de normalidade do estudo retrospectivo geral de 2021. Usar último resultado plaquetário já disponível, sem validade máxima universal inventada. A calculadora UF exibe SpO₂ 60–100%, mas a tabela publicada não impõe piso; <60% gera aviso e exige confirmação de medida. SpO₂ 0 é guarda local de validade da medida. O alerta prioritário de SpO₂ <60% é guarda local de segurança, independente dos pontos da tabela, da elegibilidade e da completude. Precisão técnica: SpO₂ até 6 casas e FiO₂ até 3, sem arredondamento; comparações por racionais decimais exatos. Nos contextos tardios, a idade no evento mais o intervalo até a observação não pode ser negativa; a idade do resultado plaquetário não pode superar essa idade observada. São guardas locais de cronologia, não limiares publicados do nSOFA. O contexto geral registra tempo desde admissão, que não é substituto para idade pós-natal; sua confirmação da última plaqueta continua necessária. Outros limites de formulário (horas até 1.000.000, peso até 20.000 g, plaquetas até 2.000.000 na unidade selecionada, calendário 1900–2199) são guardas técnicas, não faixas clínicas nem limites de validade da fonte. Sem mapeamento de bolus isolados, drogas não listadas, via aérea não classificável ou suporte extracorpóreo. Os máximos e probabilidades dos estudos não são calculados por esta ficha pontual. A cautela publicada em 2021 é histórica: a diretriz suíça de 2024 admite uso descritivo/seriado; isso não autoriza decisões automáticas. Redação PT-BR editorial, sem validação transcultural independente.',
 sources:[{title:'Wynn e Polin · nSOFA original 2019/2020',url:'https://www.nature.com/articles/s41390-019-0517-2'},{title:'Fleiss et al. 2021 · tabela completa e validação multicêntrica',url:'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2775925'},{title:'Wynn et al. 2021 · validação em UTI neonatal geral',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9045002/'},{title:'Al Gharaibeh et al. 2025 · todas as avaliações de infecção tardia',url:'https://www.nature.com/articles/s41372-025-02304-2'},{title:'Diretriz suíça 2024 · uso descritivo/seriado',url:'https://link.springer.com/article/10.1007/s00431-024-05811-0'},{title:'University of Florida · calculadora dos autores',url:'https://peds.ufl.edu/apps/nsofa/default.aspx'}],
 reuse:{kind:'independent-factual-method-implementation',attribution:'Método de Wynn/Polin; tabela conferida em Fleiss et al., JAMA Network Open 2021 (CC-BY). Redação e código próprios; sem figuras, PDF ou software externo copiado/executado. Estudos posteriores podem ter licenças diferentes.'},fields
};
nSofaNeonatalScore.safeCalculate=evaluateAdapter;
nSofaNeonatalScore.compute=evaluateAdapter;
nSofaNeonatalScore.safeValidate=v=>evaluateAdapter(v).errors;
nSofaNeonatalScore.validate=nSofaNeonatalScore.safeValidate;
nSofaNeonatalScore.countCompleted=v=>fields.length-readAdapter(v).errors.length;
nSofaNeonatalScore.assessPartial=v=>{const r=evaluateAdapter(v);return r.alerts.length||r.status==='ineligible'?{level:r.alerts.length?'high':'medium',alert:[...r.alerts,...(r.status==='ineligible'?[r.reason]:[])].join(' ')}:null;};
export const nSofaScores=[nSofaNeonatalScore];
export function calculateNsofaScore(id,values){return id==='nsofa-neonatal'?evaluateAdapter(values):{complete:false,status:'unknown',total:null,errors:[],alerts:[],breakdown:[],level:'medium',label:'Instrumento desconhecido',action:'Selecione nSOFA neonatal.',audit:'Sem cálculo.'};}
