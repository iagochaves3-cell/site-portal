export const hypoglycemiaSources={
 glucagon:'https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/hcp/Glucagen_HypoKit_Bula_do_Profissional.pdf',
 patient:'https://www.novonordisk.com.br/content/dam/nncorp/br/pt/pdfs/bulas/patient/Glucagen_HypoKit_Bula_do_Paciente.pdf',
 rescue:'https://www.rch.org.au/diabetes/type-1-diabetes-toolkit/Glucagon_for_severe_hypoglycaemia/',
 rch:'https://www.rch.org.au/clinicalguide/guideline_index/Hypoglycaemia/',
 pch:'https://pch.health.wa.gov.au/For-health-professionals/Emergency-Department-Guidelines/Hypoglycaemia',
 ispad:'https://www.ispad.org/asset/F61C3D00-8344-4C30-A7B5E142B14737FE/',
 glucose:'https://www.fresenius-kabi.com/content/dam/fresenius-kabi/br/documents/bulas/medicamentos/Glicose%20%205_10%20-%20Bula%20Profissional%20de%20Sa%C3%BAde.pdf.coredownload.inline.pdf',
 msf:'https://medicalguidelines.msf.org/sites/default/files/2025-07/guideline-170-en.pdf'
};
const S=hypoglycemiaSources;
const B={catalogNew:true,reviewedAt:'2026-09-27',status:'source-reviewed',group:'support',minMonths:1,maxMonths:215.999,unit:'mg',single:true,acuteRescue:true,exactDiagnosis:true,renalAdjustment:false,hepaticAdjustment:false};
const glucagon={...B,medicationId:'med-219',name:'Glucagon — GlucaGen HypoKit',ingredient:'glucagon',family:'glucagon',basis:'fixed',
 diagnoses:['hipoglicemia grave no diabetes','plano de resgate de hipoglicemia no diabetes'],
 conditions:'Resgate de hipoglicemia GRAVE em criança com diabetes: perda de consciência, convulsão ou incapacidade de engolir com segurança. Pode compor o plano domiciliar com responsável treinado. Aplicar a dose de resgate e acionar imediatamente o SAMU 192; não esperar o medicamento funcionar para pedir ajuda. Não é insulina nem minidose de glucagon.',
 presentations:[{label:'GlucaGen HypoKit 1 mg + diluente próprio 1 mL → 1 mg/mL após reconstituição',amount:1,volume:1,step:.5,preparation:'Introduzir TODO o 1 mL do diluente da seringa no frasco de 1 mg; movimentar suavemente até dissolver. A solução deve ficar límpida, sem partículas: concentração final 1 mg/mL. Retirar bolhas e ajustar a seringa à marca da dose abaixo.'}],
 schedule:'uma administração de resgate se ocorrer hipoglicemia grave',duration:'episódio agudo; sem repetição automática',
 instructions:'Acionar o SAMU 192 e manter de lado se inconsciente. Não dar líquidos, alimentos ou açúcar pela boca enquanto não engolir com segurança. Se não responder em 10 minutos, a equipe deverá administrar glicose intravenosa. Ao despertar e conseguir engolir, oferecer carboidrato e depois refeição/lanche. Medir glicemia a cada 15 minutos na primeira hora e, após estabilizar, a cada hora por mais 4 horas sob orientação assistencial. Contatar a equipe de diabetes no mesmo dia para rever a causa e o plano. Não aplicar correção extra de insulina por conta própria após o resgate. Guardar o kit a 2–8 °C, protegido da luz, sem congelar. Usar imediatamente após misturar e descartar sobra; repor o kit utilizado.',
 contraindications:'Alergia ao glucagon/excipientes ou feocromocitoma. Insulinoma, jejum prolongado, hipoglicemia crônica ou por álcool podem comprometer a resposta e exigem atendimento e outro plano. Indometacina pode reduzir o efeito; varfarina e betabloqueadores exigem atenção a interações.',
 allergyTerms:['glucagon','glucagen'],avoidTerms:['feocromocitoma','insulinoma','jejum prolongado','hipoglicemia cronica','intoxicacao alcoolica','indometacina'],
 offLabel:'Bula brasileira e ISPAD documentam SC/IM. Prioriza-se o peso medido: 0,5 mg abaixo de 25 kg; 1 mg a partir de 25 kg, seguindo a instrução operacional RCH (meia dose apenas abaixo de 25 kg). A idade de 6–8 anos da bula é aproximação, não substitui o peso disponível. Ramo não neonatal (a partir de 1 mês); não extrapolar ao protocolo neonatal nem ao glucagon nasal.',
 sources:[S.glucagon,S.patient,S.rescue,S.ispad,S.pch]};
export const hypoglycemiaRegimens=[
 ...['im','sc'].flatMap(via=>[.5,1].map(dose=>({...glucagon,
  id:'glucagon-rescue-'+via+'-'+(dose===.5?'under25':'from25'),title:'Hipoglicemia no diabetes · glucagon '+via.toUpperCase()+', '+(dose===.5?'menos de 25 kg':'a partir de 25 kg'),
  route:via==='im'?'INTRAMUSCULAR':'SUBCUTÂNEA',dose,maxDose:dose,...(dose===.5?{maxWeight:25,maxWeightExclusive:true}:{minWeight:25}),
  injection:{route:via==='im'?'intramuscular':'subcutânea',method:via==='im'?'injetar a dose em músculo, pela técnica ensinada ao responsável; usar somente a via IM deste item':'injetar a dose sob a pele, pela técnica ensinada ao responsável; usar somente a via SC deste item'}
 }))),
 {...B,id:'dextrose10-hypoglycemia-iv',title:'Hipoglicemia · glicose 10% IV, dose inicial',medicationId:'med-218',name:'Glicose 10% intravenosa',ingredient:'glicose',family:'dextrose',route:'HOSPITALAR — IV',observedOnly:true,basis:'kg-dose',dose:200,
  diagnoses:['hipoglicemia','hipoglicemia pediatrica','hipoglicemia grave','hipoglicemia grave no diabetes'],
  presentations:[{label:'Fresenius Kabi glicose 10% — 100 mg/mL de glicose anidra, frasco 250 ou 500 mL',amount:100,volume:1,step:.1,readyToUse:true,preparation:'Usar solução estéril PRONTA de glicose 10% (100 mg/mL), inspecionada e identificada. Não substituir por glicose 25% ou 50% mantendo o mesmo volume. Preparar e administrar pela equipe assistencial com técnica asséptica.'}],
  infusion:{concentration:100,minutes:10,diluent:'nenhum — solução pronta a 10%'},schedule:'uma dose inicial de resgate',duration:'episódio agudo; verificar resposta antes de qualquer nova administração',
  conditions:'Hipoglicemia que exige correção parenteral, em unidade assistencial com acesso IV, glicemia e monitorização. Dose inicial 200 mg/kg = 2 mL/kg de glicose 10%, em 10 minutos. Preferir reposição enteral quando a consciência e a deglutição permitirem. Ramo de 1 mês a 17 anos; recém-nascidos seguem protocolo próprio.',
  instructions:'Monitorar consciência, sinais vitais e acesso venoso. Verificar glicemia 15 minutos após a administração; se continuar baixa ou os sintomas persistirem, reavaliar imediatamente e definir nova correção pela equipe, sem repetição fixa no receituário. Manter controles em 30 minutos e depois horários conforme evolução. Colher amostra crítica quando indicada, sem atrasar o tratamento. Após corrigir, oferecer carboidrato de absorção lenta quando seguro ou manter suporte IV prescrito pela equipe. Dor, edema ou extravasamento exigem interromper esta infusão e avaliar o acesso. Não compartilhar a linha com sangue. Conservar a 15–30 °C; descartar sobra e não usar solução turva ou embalagem violada.',
  contraindications:'Não usar este ramo para hiperglicemia ou tratamento da cetoacidose. Hipervolemia, hipocalemia, insuficiência renal/cardíaca, hemorragia intracraniana, desnutrição grave e alergia a componentes exigem protocolo específico. Não administrar por via IM ou SC.',
  allergyTerms:['glicose','dextrose','milho'],avoidTerms:['hiperglicemia','cetoacidose','hipervolemia','hipocalemia','insuficiencia renal','insuficiencia cardiaca','hemorragia intracraniana','desnutricao grave'],
  offLabel:'Esquema de resgate PCH/ISPAD/RCH, com controle precoce MSF. Bula Fresenius BU08: 100 mg de glicose anidra/mL equivalem a 110 mg de monoidratada/mL. A taxa do resgate é diferente da manutenção nutricional da bula. A bula contém redações conflitantes sobre diabetes; a indicação aqui é a HIPOGLICEMIA, respaldada pela ISPAD, e não infusão livre em hiperglicemia. Não há ajuste renal/hepático automático nem manutenção IV implícita.',
  sources:[S.glucose,S.pch,S.rch,S.ispad,S.msf]
 }
];

// Compatibility from IWK; dilution volumes are derived by conservation of mass.
// Concentrated stock is never presented as ready for injection.
const concentratedSource='https://www.samtec.com.br/media/upload/bulas/bula-3-glicose-bl3-r5.pdf';
const dilutionSource='https://www.dir.iwk.nshealth.ca/Home/PGDetails/7fc55a77-c2ba-e911-80f4-005056b200d2?PatientPopulation=Ped';
const dextroseReady=hypoglycemiaRegimens.find(r=>r.id==='dextrose10-hypoglycemia-iv');
for(const [percent,ampoule]of [[25,10],[50,10],[50,20]])hypoglycemiaRegimens.push({
 ...dextroseReady,id:`dextrose${percent}-to10-iv-${ampoule}ml`,title:`Hipoglicemia · glicose ${percent}% ${ampoule} mL diluída a 10%`,name:`Glicose ${percent}% — diluir para 10%`,
 presentations:[{label:`Samtec glicose ${percent}% =${percent*10} mg/mL — ampola ${ampoule} mL; DILUIÇÃO OBRIGATÓRIA para 10%`,amount:percent*10,volume:1,step:.01,concentrated:true,vialAmount:percent*10*ampoule,containerLabel:'ampola(s)',preparation:`Usar ampola íntegra de glicose Samtec ${percent}% (${percent*10} mg/mL), solução límpida. NÃO administrar o concentrado diretamente. Preparar a mistura abaixo com água ESTÉRIL PARA INJETÁVEIS, pela equipe assistencial; a água não deve ser injetada isoladamente. Homogeneizar e identificar a solução FINAL como glicose 10% (100 mg/mL). Usar imediatamente e descartar sobras.`}],
 infusion:{concentration:100,minutes:10,diluent:'água estéril para injetáveis'},
 conditions:'Alternativa quando glicose pronta a 10% não estiver disponível, para o mesmo resgate assistencial de hipoglicemia, de 1 mês a 17 anos. Dose final 200 mg/kg, volume FINAL 2 mL/kg em 10 minutos. A apresentação concentrada e a água são medidas separadamente antes de misturar. Não usar o volume final como volume a aspirar da ampola.',
 offLabel:`Bula Samtec BL3-R5: ${percent*10} mg/mL e ampola ${ampoule} mL; IWK confirma compatibilidade com água para injetáveis. A diluição para 100 mg/mL resulta da conservação da massa, não de uma dose nova: ${percent===25?'2 partes de glicose 25% +3 de água':'1 parte de glicose 50% +4 de água'}. Dose e tempo permanecem os do resgate PCH/ISPAD. Não usar SG5% como se fosse água: ele também contém glicose. Bula Samtec contém redação conflitante sobre diabetes; a hipoglicemia diabética é tratada conforme ISPAD. Esta escolha não valida todo o uso nutricional ou toda a monografia.`,
 sources:[concentratedSource,dilutionSource,S.pch,S.ispad,S.rch,S.msf]
});
