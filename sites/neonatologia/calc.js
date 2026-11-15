'use strict';
(function (root) {
  const positive = (v, name) => { const n = Number(String(v).trim().replace(',', '.')); if (!Number.isFinite(n) || n <= 0) throw new Error(name + ': informe um número maior que zero.'); return n; };
  const bounded = (v, name, min, max) => { const n = positive(v, name); if(n < min || n > max) throw new Error(name + ': valor fora do intervalo de entrada ('+min+' a '+max+').'); return n; };
  const api = {
    infusion(weight, dose, concentration, unit) {
      const w = bounded(weight,'Peso (kg)',0.2,15), d = positive(dose,'Dose'), c = positive(concentration,'Concentração final');
      const units = {'mcg/kg/min':60,'mcg/kg/h':1,'mg/kg/h':1,'U/kg/h':1};
      if(!Object.hasOwn(units,unit)) throw new Error('Unidade de dose inválida.');
      const rate=w*d*units[unit]/c; return {rate,reverse:rate*c/(w*units[unit]),unit};
    },
    gir(weight, concentrationPercent, rate) {
      const w=bounded(weight,'Peso (kg)',0.2,15), c=bounded(concentrationPercent,'Glicose (%)',0.1,50), r=positive(rate,'Vazão (mL/h)');
      return {gir:c*10*r/(60*w),fluid:r*24/w,mgml:c*10};
    },
    fluid(weight, perDay) {const w=bounded(weight,'Peso (kg)',0.2,15),v=positive(perDay,'Volume (mL/kg/dia)');return {daily:w*v,hourly:w*v/24};},
    dose(weight, perKg, concentration) {const w=bounded(weight,'Peso (kg)',0.2,15),d=positive(perKg,'Dose (mg/kg/dose)'),c=positive(concentration,'Concentração (mg/mL)');return {total:w*d,volume:w*d/c,reverse:(w*d/c)*c/w};},
    tidal(weight, perKg) {const w=bounded(weight,'Peso (kg)',0.2,15),v=positive(perKg,'Alvo (mL/kg)');return {volume:w*v};},
    oxygenIndex(fio2, map, pao2) {const f=bounded(fio2,'FiO2 (%)',21,100),m=positive(map,'Pressão média (cmH2O)'),p=positive(pao2,'PaO2 arterial (mmHg)');return {oi:f*m/p};},
    age(birth, reference) {const b=new Date(birth),r=new Date(reference);if(!Number.isFinite(+b)||!Number.isFinite(+r))throw new Error('Informe data e hora válidas.');const hours=(r-b)/3600000;if(hours<0)throw new Error('A avaliação deve ocorrer após o nascimento.');if(hours>24*366)throw new Error('Confirme as datas: intervalo superior a um ano.');return {hours,days:Math.floor(hours/24),extra:Math.floor(hours%24),period:hours<168?'Neonatal precoce':hours<672?'Neonatal tardio':'28 dias completos ou mais'};},
    bilirubin(value, unit) {const n=positive(value,'Bilirrubina');if(unit==='mg/dL')return {value:n*17.1,unit:'µmol/L'};if(unit==='µmol/L')return {value:n/17.1,unit:'mg/dL'};throw new Error('Unidade inválida.');}
  };
  for (const name of Object.keys(api)) {
    if (name === 'age') continue;
    const calculate = api[name];
    api[name] = (...args) => {
      const result = calculate(...args);
      if (Object.values(result).some(v => typeof v === 'number' && (!Number.isFinite(v) || v <= 0))) {
        throw new Error('Resultado fora do intervalo numérico. Confira os valores e as unidades.');
      }
      return result;
    };
  }
  root.NeoCalc=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
