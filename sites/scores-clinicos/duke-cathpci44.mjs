// Identified historical CathPCI v4.4 (2011) equation; not current registry coding.
// Decimal arithmetic stays rational until serialization. No ECG interpretation.
const ids=['age','criteria_confirmed','minutes','st','angina'];
const rational=(value)=>{
 if(typeof value!=='string'&&typeof value!=='number')return null;
 if(typeof value==='number'&&(!Number.isFinite(value)||value<0))return null;
 let text=String(value);
 // A numeric API argument can stringify in exponent notation; user text cannot.
 if(typeof value==='number'&&text.includes('e')){
  const [coefficient,exponent]=text.split('e'),[whole,fraction='']=coefficient.split('.');
  const digits=whole+fraction,position=whole.length+Number(exponent);
  text=position<=0?'0.'+'0'.repeat(-position)+digits:position>=digits.length?digits+'0'.repeat(position-digits.length):digits.slice(0,position)+'.'+digits.slice(position);
 }
 // 256 characters is an operational input limit, not a clinical precision rule.
 if(text.length>256||!/^\d+(\.\d+)?$/.test(text))return null;
 const [whole,fraction='']=text.split('.');
 return {numerator:BigInt(whole+fraction),denominator:10n**BigInt(fraction.length)};
};
const compare=(a,b)=>a.numerator*b.denominator-b.numerator*a.denominator;
const integer=n=>({numerator:BigInt(n),denominator:1n});
const multiply=(a,n)=>({numerator:a.numerator*BigInt(n),denominator:a.denominator});
const subtract=(a,b)=>({numerator:a.numerator*b.denominator-b.numerator*a.denominator,denominator:a.denominator*b.denominator});
const decimal=a=>{
 const negative=a.numerator<0n,absolute=negative?-a.numerator:a.numerator;
 let whole=absolute/a.denominator,remainder=absolute%a.denominator,fraction='';
 while(remainder){remainder*=10n;fraction+=String(remainder/a.denominator);remainder%=a.denominator;}
 return (negative?'-':'')+String(whole)+(fraction?'.'+fraction:'');
};
export function validateDukeCathpci44(values){
 if(!values||typeof values!=='object'||Array.isArray(values))return [...ids];
 const errors=[],parsed=Object.fromEntries(ids.map(id=>[id,rational(values[id])]));
 for(const id of ids)if(!parsed[id])errors.push(id);
 const inRange=(id,min,max,inclusive=true)=>{const value=parsed[id];if(value&&(compare(value,integer(min))<0n||(inclusive?compare(value,integer(max))>0n:compare(value,integer(max))>=0n)))errors.push(id);};
 inRange('age',18,75,false);inRange('minutes',0,40);inRange('st',0,20);
 if(parsed.criteria_confirmed&&compare(parsed.criteria_confirmed,integer(1))!==0n)errors.push('criteria_confirmed');
 if(parsed.angina&&![0,1,2].some(n=>compare(parsed.angina,integer(n))===0n))errors.push('angina');
 return [...new Set(errors)];
}
export function calculateDukeCathpci44(values){
 const errors=validateDukeCathpci44(values);
 if(errors.length)return {complete:false,total:null,errors,breakdown:[],audit:'Dados obrigatórios ausentes, inválidos ou fora do contexto desta variante histórica.'};
 const time=rational(values.minutes),rawST=rational(values.st),angina=rational(values.angina);
 const effectiveST=compare(rawST,integer(1))<0n?integer(0):rawST;
 const stPenalty=multiply(effectiveST,5),anginaPenalty=multiply(angina,4);
 const total=subtract(subtract(time,stPenalty),anginaPenalty),exactTotal=decimal(total);
 const level=compare(total,integer(-11))<=0n?'high':compare(total,integer(5))>=0n?'low':'medium';
 const category={high:'alto',medium:'intermediário',low:'baixo'}[level];
 return {complete:true,total:Number(exactTotal),exactTotal,displayValue:exactTotal.replace('.',','),level,
  label:`CathPCI 4.4 (2011) · risco ${category}`,
  action:'Categoria da definição histórica de 2011, para consulta profissional. Não corresponde à classificação atual CathPCI 5.1 nem fornece diagnóstico, conduta terapêutica ou probabilidade individual de sobrevida.',
  breakdown:[{label:'Duração no Bruce padrão (min)',points:Number(decimal(time))},{label:'−5 × ST efetivo (mm)',points:stPenalty.numerator===0n?0:-Number(decimal(stPenalty))},{label:'−4 × índice de angina',points:anginaPenalty.numerator===0n?0:-Number(decimal(anginaPenalty))}],
  audit:`CathPCI 4.4 (2011): ${decimal(time)} − 5×${decimal(effectiveST)} − 4×${decimal(angina)}; ST informado ${decimal(rawST)} mm${compare(rawST,integer(1))<0n?' (<1 mm: ST efetivo 0)':''}; cálculo decimal exato, sem arredondamento para classificar`,
  contractId:'duke-treadmill-acc-cathpci44-archival2011',effectiveST:decimal(effectiveST),historical:true};
}
