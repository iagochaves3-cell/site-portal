/* User-designated Bulário, ficha 281; product-specific check 2026-10-28. */
(function(root){'use strict';
const A=root.AnvisaAdditionalClinical,n=A.n,fields=A.confirms({newClinical:'Esquema diário apropriado: sem hepatopatia grave ou ajuste individual pendente; função renal avaliada (bula paciente e profissional divergem quanto ao ajuste renal)',newSafety:'Sem alergia à loratadina/componentes, má-absorção glicose-galactose ou insuficiência sacarase-isomaltase; diabetes, gravidez/lactação, interações e duplicidade de anti-histamínicos avaliados',newProduct:'Xarope Aché 1 mg/mL, registro 1057306250011, validade e copo dosador conferidos; não é associação nem gotas',newPrior:'Sem dose prévia/concomitante que ultrapasse o limite em 24 h; não duplicar dose esquecida'});
for(const f of Object.values(fields))f.required=true;
const diagnoses=Object.fromEntries(['USER-LOR-01','USER-LOR-02','USER-LOR-03'].map(k=>[k,['Rinite alérgica','Urticária crônica']]));
A.registry.loratadineUser={products:[['validated:lorAche1','Loratadina Aché 1 mg/mL · xarope 100 mL + copo · 1057306250011']],fields,diagnoses,calculate(i){
 const fail=reason=>({ok:false,reason:'NÃO CALCULADO: '+reason});
 if(!i||!diagnoses[i.scheme]?.includes(i.diagnosis)||i.route!=='VO'||i.product!=='validated:lorAche1')return fail('selecionar o esquema, diagnóstico, via oral e xarope vinculados.');
 const w=n(i.weight),a=n(i.age),m=i.unit==='anos'?a*12:i.unit==='meses'?a:NaN;
 if(!Number.isFinite(w)||w<=0||w>300||!Number.isFinite(m)||m<24||m>1440)return fail('peso positivo e idade válida a partir de 2 anos; lactentes não incluídos.');
 const eligible=i.scheme==='USER-LOR-01'?m<=144&&w<=30:i.scheme==='USER-LOR-02'?m<=144&&w>30:m>144;
 if(!eligible)return fail('idade/peso incompatíveis com o esquema selecionado; escolha outro explicitamente.');
 for(const [k,f]of Object.entries(fields))if(i[k]!=='confirmed')return fail('confirmar: '+f.label);
 const dose=i.scheme==='USER-LOR-01'?5:10,volume=dose/1;
 if(volume*1!==dose)return fail('conversão reversa inconsistente.');
 return {ok:true,doseMin:dose,doseMax:dose,doseUnit:'mg de loratadina',stockVolume:volume,daily:dose,interval:24,reference:dose+' mg por DOSE fixa, VO a cada 24 h; máximo '+dose+' mg/24 h neste esquema. Não multiplicar pelo peso.',limitText:'Máximo deste ramo '+dose+' mg em 24 h, incluindo doses já tomadas.',posology:'Loratadina Aché 1 mg/mL: administrar '+volume+' mL ('+dose+' mg) por via oral a cada 24 horas. Manter enquanto houver sintomas/exposição; reavaliar uso prolongado, persistência ou piora. Não duplicar dose esquecida.',preparation:'Xarope pronto para uso, medir '+volume+' mL com o copo dosador conferido. Sem diluição, BIC, gotas ou comprimidos neste vínculo.',preparationReason:null};
}};
})(typeof window!=='undefined'?window:globalThis);
