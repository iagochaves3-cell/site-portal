export function number(value,label='Valor',{min=0,max=Infinity,zero=false}={}){
  const text=String(value??'').trim();
  if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) throw new Error(`${label}: informe um número válido.`);
  const n=Number(text.replace(',','.'));
  if(!Number.isFinite(n)||(zero?n<min:n<=min)||n>max) throw new Error(`${label}: valor fora do intervalo permitido.`);
  return n;
}
export function calculate(kind,input){
  const v=(key,label,options)=>number(input[key],label,options);
  const weight=()=>v('weight','Peso');
  const sex=()=>{if(!['M','F'].includes(input.sex))throw new Error('Selecione o sexo utilizado pela equação.');return input.sex;};
  const age=(min,max=120)=>v('age','Idade',{min,max,zero:true});
  if(kind==='infusion'){
    const w=weight(),d=v('dose','Dose'),c=v('concentration','Concentração final');
    if(!['mcg/kg/min','mcg/kg/h','mg/kg/h','U/kg/h'].includes(input.unit))throw new Error('Unidade inválida.');
    const factor=input.unit==='mcg/kg/min'?60:1;
    const rate=d*w*factor/c,reverse=rate*c/(w*factor);
    return {value:rate,unit:'mL/h',formula:`${d} × ${w} × ${factor} ÷ ${c}`,detail:`Conferência reversa: ${reverse.toPrecision(6)} ${input.unit}. Dose e concentração são as informadas; este cálculo não seleciona medicamento ou regime.`};
  }
  if(kind==='drops'){
    const rate=v('rate','Vazão'),factor=v('factor','Fator do equipo',{max:200});
    return {value:rate*factor/60,unit:'gotas/min',formula:`${rate} × ${factor} ÷ 60`,detail:`Valor matemático. Arredondamento para gotas inteiras altera a vazão; em infusões críticas, usar bomba. Fator informado: ${factor} gotas/mL.`};
  }
  if(kind==='dose'){
    const w=weight(),d=v('dose','Dose em mg/kg/dose'),c=v('concentration','Concentração em mg/mL');
    const cap=String(input.maximum??'').trim()===''?Infinity:v('maximum','Máximo em mg/dose');
    const dose=Math.min(w*d,cap),volume=dose/c;
    return {value:volume,unit:'mL/dose',formula:`mínimo(${w} × ${d}; ${Number.isFinite(cap)?cap:'sem teto informado'}) ÷ ${c}`,detail:`Dose total: ${dose} mg. Reversa: ${volume.toPrecision(6)} mL × ${c} mg/mL = ${dose} mg (${(dose/w).toPrecision(6)} mg/kg/dose). ${dose<w*d?'Teto informado aplicado.':'O limite deve corresponder à indicação e à apresentação.'}`};
  }
  if(kind==='bmi'){
    age(20); const w=weight(),h=v('height','Altura em metros',{max:3}),bmi=w/(h*h);
    const label=bmi<18.5?'Baixo peso':bmi<25?'Faixa saudável':bmi<30?'Sobrepeso':bmi<35?'Obesidade I':bmi<40?'Obesidade II':'Obesidade III';
    return {value:bmi,unit:'kg/m²',formula:`${w} ÷ ${h}²`,detail:`${label}. Classificação CDC para adultos ≥20 anos. É medida de triagem; não se aplica às curvas pediátricas.`};
  }
  if(kind==='cg'){
    const a=age(18),w=weight(),cr=v('creatinine','Creatinina'),f=sex()==='F'?.85:1;
    return {value:(140-a)*w/(72*cr)*f,unit:'mL/min',formula:`(140 − ${a}) × ${w} ÷ (72 × ${cr}) × ${f}`,detail:'Clearance estimado, não indexado à superfície corporal. Equação histórica; usar quando pertinente à bula/protocolo. A escolha de peso em obesidade requer avaliação clínica. Não arredondar artificialmente a creatinina.'};
  }
  if(kind==='ckd'){
    const a=age(18),cr=v('creatinine','Creatinina'),f=sex()==='F',k=f?.7:.9,alpha=f?-.241:-.302;
    return {value:142*Math.min(cr/k,1)**alpha*Math.max(cr/k,1)**(-1.2)*.9938**a*(f?1.012:1),unit:'mL/min/1,73 m²',formula:`142 × mín(${cr}/${k}; 1)^${alpha} × máx(${cr}/${k}; 1)^−1,200 × 0,9938^${a}${f?' × 1,012':''}`,detail:'CKD-EPI 2021 creatinina, sem raça, adultos ≥18 anos. O valor indexado não equivale automaticamente a mL/min para ajuste de fármacos. Um resultado isolado não diagnostica DRC.'};
  }
  if(kind==='schwartz'){
    age(1,16); const h=v('height','Altura em centímetros',{max:250}),cr=v('creatinine','Creatinina');
    return {value:.413*h/cr,unit:'mL/min/1,73 m²',formula:`0,413 × ${h} ÷ ${cr}`,detail:'Schwartz bedside 2009. Faixa operacional 1–16 anos, conforme população original com DRC. Não usar em neonatos. CKiD U25 pode ser mais apropriada conforme o cenário.'};
  }
  throw new Error('Calculadora não encontrada.');
}
