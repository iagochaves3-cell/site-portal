import {hypoglycemiaSources as S} from './medication-regimens-hypoglycemia.mjs';
const content={
 general:'Registrar glicemias, horários, alimentação, exercício e medicamentos recentes. Levar medidor/sensor e lista das doses ao atendimento. Crianças com diabetes precisam de plano de resgate acessível à família e à escola.',
 diagnosis:'Confirmar glicose baixa e investigar a causa. Se a criança estiver sonolenta, inconsciente, convulsionando ou não engolir com segurança, não oferecer nada pela boca. O glucagon deve ser preparado e aplicado por pessoa treinada, na dose e via da receita; glicose IV é administrada pela equipe assistencial.',
 expected:'A recuperação pode ocorrer em minutos após a correção, mas a hipoglicemia pode voltar. Glucagon geralmente produz resposta em cerca de 10 minutos. Ausência de melhora exige tratamento imediato pela equipe e busca de outras causas.',
 alarm:'Suor frio, palidez, tremor, fome, fraqueza, irritabilidade ou comportamento diferente podem indicar nova queda. Náuseas e vômitos após glucagon requerem atenção à segurança para engolir e ao risco de recorrência.',
 immediate:'Desmaio, convulsão, confusão, dificuldade de despertar ou de engolir são emergência: acionar SAMU 192, manter de lado se inconsciente e iniciar o resgate prescrito. Não aguardar a resposta ao glucagon para pedir socorro. Persistência ou nova queda após tratamento exige reavaliação imediata.',
 return:'Depois de usar glucagon, obter avaliação emergencial e contatar a equipe de diabetes no mesmo dia para revisar doses e fatores desencadeantes. Conferir glicemia a cada 15 minutos na primeira hora e depois a cada hora por mais 4 horas conforme orientação assistencial. Alta após hipoglicemia inexplicada depende de estabilidade, alimentação eficaz e investigação/seguimento definidos pela equipe; um único valor normal não basta.',
 urls:[S.glucagon,S.rescue,S.rch,S.pch,S.ispad,S.msf]
};
export const hypoglycemiaGuidanceSupplements={'Hipoglicemia Pediátrica':content};
export const hypoglycemiaGuidanceRecords=[
 {name:'Hipoglicemia grave',aliases:[],setting:'urgent'},
 {name:'Hipoglicemia grave no diabetes',aliases:['Plano de resgate de hipoglicemia no diabetes'],setting:'urgent'}
].map(r=>({...r,...content,status:'source-reviewed',revisedAt:'2026-09-27',sources:content.urls.map(url=>({url,title:'Hipoglicemia — diretriz institucional ou bula brasileira',accessed:'2026-09-27'})),reviewNotes:'Resgate agudo e prevenção de recorrência, sem autorização automática de alta. O contexto neonatal permanece separado. As medidas domiciliares pressupõem treinamento e plano previamente prescrito.'}));
