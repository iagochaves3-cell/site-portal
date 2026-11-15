/* Evaluates the bounded formula vocabulary of the archived, documented contracts.
   No eval, dynamic code or generic concentration inference. */
(function(root){
'use strict';
function parse(formula){
 const s=formula.replace(/^=/,'').replace(/_xlfn\./g,'').replace(/_xlpm\./g,''); let i=0;
 const tokens=[];
 while(i<s.length){
  if(/\s/.test(s[i])){i++;continue}
  if(s[i]==='"'){let v='';i++;while(i<s.length){if(s[i]==='"'){if(s[i+1]==='"'){v+='"';i+=2;continue}i++;break}v+=s[i++]}tokens.push({t:'str',v});continue}
  const m=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|^\$?[A-Za-z_][A-Za-z_\d.$]*|^(?:>=|<=|<>|[+*/^&=<>(),-])/);
  if(!m)throw Error('Unsupported formula token');tokens.push({t:/^\d|^\./.test(m[0])?'num':'sym',v:m[0]});i+=m[0].length;
 }
 let p=0;const peek=()=>tokens[p]?.v;
 function atom(){const t=tokens[p++];if(!t)throw Error('Incomplete expression');
  if(t.t==='str')return {type:'value',v:t.v};if(t.t==='num')return {type:'value',v:Number(t.v)};
  if(t.v==='-'||t.v==='+')return {type:'unary',op:t.v,arg:atom()};
  if(t.v==='('){const v=expr(0);if(tokens[p++]?.v!==')')throw Error('Unclosed group');return v}
  if(peek()==='('){p++;const args=[];if(peek()!==')'){do{args.push(expr(0));if(peek()!==',')break;p++}while(true)}if(tokens[p++]?.v!==')')throw Error('Unclosed call');return {type:'call',name:t.v.toUpperCase(),args}}
  return {type:'name',name:t.v.replace(/\$/g,'').toUpperCase()};
 }
 const prec={'=':1,'<>':1,'>':1,'<':1,'>=':1,'<=':1,'&':2,'+':3,'-':3,'*':4,'/':4,'^':5};
 function expr(min){let left=atom();while(prec[peek()]>=min){const op=tokens[p++].v;left={type:'binary',op,left,right:expr(prec[op]+1)}}return left}
 const result=expr(0);if(p!==tokens.length)throw Error('Trailing expression');return result;
}
const cache=new Map();
function evaluate(formula,env){let tree=cache.get(formula);if(!tree){tree=parse(formula);cache.set(formula,tree)}
 function run(n,scope){
  if(n.type==='value')return n.v;
  if(n.type==='name'){if(n.name==='TRUE')return true;if(n.name==='FALSE')return false;if(n.name in scope)return scope[n.name];throw Error('Missing reference '+n.name)}
  if(n.type==='unary')return n.op==='-'?-Number(run(n.arg,scope)):Number(run(n.arg,scope));
  if(n.type==='binary'){const a=run(n.left,scope),b=run(n.right,scope);switch(n.op){case '&':return String(a)+String(b);case '+':return +a + +b;case '-':return a-b;case '*':return a*b;case '/':if(+b===0)throw Error('Division by zero');return a/b;case '^':return a**b;case '=':return a===b;case '<>':return a!==b;case '>':return a>b;case '<':return a<b;case '>=':return a>=b;case '<=':return a<=b;}}
  const a=n.args;
  if(n.name==='IF')return run(run(a[0],scope)?a[1]:a[2],scope);
  if(n.name==='IFERROR'){try{return run(a[0],scope)}catch{return run(a[1],scope)}}
  if(n.name==='LET'){const local=Object.create(scope);for(let j=0;j<a.length-1;j+=2){if(a[j].type!=='name')throw Error('Invalid LET name');local[a[j].name]=run(a[j+1],local)}return run(a[a.length-1],local)}
  if(n.name==='SWITCH'){const value=run(a[0],scope);for(let j=1;j<a.length-1;j+=2)if(value===run(a[j],scope))return run(a[j+1],scope);if(a.length%2===0)return run(a[a.length-1],scope);throw Error('Unmatched switch')}
  const v=a.map(x=>run(x,scope));switch(n.name){case 'AND':return v.every(Boolean);case 'OR':return v.some(Boolean);case 'NOT':return !v[0];case 'ISNUMBER':return typeof v[0]==='number'&&Number.isFinite(v[0]);case 'MIN':return Math.min(...v);case 'MAX':return Math.max(...v);case 'ROUND':return Number(Number(v[0]).toFixed(v[1]));case 'LEFT':return String(v[0]).slice(0,v[1]??1);case 'FIND':{const idx=String(v[1]).indexOf(String(v[0]),(v[2]||1)-1);if(idx<0)throw Error('FIND');return idx+1}case 'VALUE':{const x=Number(String(v[0]).replace(',','.'));if(!Number.isFinite(x))throw Error('VALUE');return x}default:throw Error('Unsupported function '+n.name)}
 }
 return run(tree,env);
}
function calculate(rule,input){const row=rule.provenance.evbic_row_trace_only,env={B3:input.weight,D3:input.age,F8:input.complete};env['E'+row]=input.product;env['F'+row]=input.regimen;const outputs={};
 for(const col of ['G','H','I','J','K','L','M','N']){try{outputs[col]=evaluate(rule.provenance.formula_set_reference[col],env)}catch{outputs[col]='PENDENTE: contrato não interpretado integralmente; consultar Excel'}env[col+row]=outputs[col]}
 return outputs;
}
root.AnvisaContractEngine={calculate,evaluate,parse};
if(typeof module!=='undefined')module.exports=root.AnvisaContractEngine;
})(typeof window!=='undefined'?window:globalThis);
