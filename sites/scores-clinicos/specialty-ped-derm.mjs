// Expansão delimitada · Pediatria e Dermatologia · 04/10/2026.
import {make,s,y,n,ref,b} from './expanded-scores.mjs';
const meta=f=>({...f,noPoints:true});
// Clinical safety only: CPS current guidance prioritizes immediate assessment
// of ill-appearing infants. Do not complete the rule or impute missing tests.
function stepAppearanceAlert(values) {
 try {
  if(values===null||typeof values!=='object'||Array.isArray(values))return null;
  const descriptor=Object.getOwnPropertyDescriptor(values,'illAppearing');
  if(!descriptor||!Object.hasOwn(descriptor,'value')||!(descriptor.value===1||descriptor.value==='1'))return null;
  return {level:'high',alert:'Aparência alterada ou suspeita clínica de sepse informada: avaliação clínica imediata. Não aguardar exames nem a conclusão do formulário. Este alerta não confirma diagnóstico nem completa a classificação Step-by-Step.'};
 } catch {return null;}
}
const reviewDate='04/10/2026';
const R={
 step:ref('Canadian Paediatric Society · lactente febril ≤90 dias · tabela 1, versão consultada 04/10/2026','https://cps.ca/en/documents/position/management-of-well-appearing-febrile-young-infants-aged-90-days'),
 stepOriginal:ref('Gomez et al. · validação Step-by-Step · Pediatrics 2016','https://pemcincinnati.com/blog/wp-content/uploads/2016/12/9-Validation-of-the-step-by-step.pdf'),
 pecarn:ref('Holmes et al. · PECARN abdominal original · Ann Emerg Med 2013','https://pubmed.ncbi.nlm.nih.gov/23375510/'),
 pecarn2024:ref('Holmes et al. · validação prospectiva · Lancet Child Adolesc Health 2024','https://www.sciencedirect.com/science/article/pii/S2352464224000294'),
 gagsOriginal:ref('Doshi et al. · GAGS original · Int J Dermatol 1997','https://pubmed.ncbi.nlm.nih.gov/9248884/'),
 gags:ref('Pakornphadungsit et al. · autoavaliação TGAGS em adultos tailandeses; tabela 2 descreve GAGS · 2023','https://pmc.ncbi.nlm.nih.gov/articles/PMC10629409/'),
 gagsBands:ref('ClinicalTrials.gov · protocolo NCT07250880 · faixas 0–44 incluindo 39–44','https://cdn.clinicaltrials.gov/large-docs/80/NCT07250880/Prot_000.pdf'),
 vasi:ref('Ezzedine et al. · T-VASI e F-VASI · JAMA Dermatology 2025 · suplemento 2, eFigure 2','https://jamanetwork.com/journals/jamadermatology/fullarticle/2825426'),
 vasiOriginal:ref('Hamzavi et al. · fórmula original do VASI · 2004','https://jamanetwork.com/journals/jamadermatology/fullarticle/480622'),
};

const pecarnCriteria=[
 ['abdominalWallTrauma','Trauma da parede abdominal ou sinal do cinto de segurança'],
 ['gcsLow','Glasgow ≤13'],
 ['abdominalTenderness','Dor à palpação abdominal'],
 ['thoracicWallTrauma','Trauma da parede torácica'],
 ['abdominalPain','Queixa de dor abdominal'],
 ['decreasedBreathSounds','Murmúrio vesicular diminuído'],
 ['vomiting','Vômitos após o trauma'],
];
const gagsRegions=[['forehead','Fronte',2],['rightCheek','Bochecha direita',2],['leftCheek','Bochecha esquerda',2],['nose','Nariz',1],['chin','Queixo',1],['chestBack','Tórax e dorso superior (uma região conjunta)',3]];
const lesionOptions=[[0,'Sem lesões'],[1,'Comedão'],[2,'Pápula'],[3,'Pústula'],[4,'Nódulo']];
const vasiStrata=[10,25,50,75,90,100];

export const specialtyExpansionPart=[
make({id:'step-by-step',name:'Step-by-Step · lactente febril',specialty:'Pediatria',specialties:['Pediatria','Infectologia'],reviewDate:'12/10/2026',assessPartial:stepAppearanceAlert,
 subtitle:'Risco sequencial de infecção bacteriana invasiva · CPS/Gomez',population:'0–90 dias · febre sem foco; baixo risco somente de 22–90 dias',aliases:['febre sem foco','lactente febril','sepse','procalcitonina','infecção bacteriana invasiva'],max:2,range:'Baixo / intermediário / alto',unit:'regra',resultScale:false,
 scope:'Lactentes até 90 dias, a termo, previamente saudáveis, com temperatura retal documentada ≥38 °C e sem foco. A confirmação de elegibilidade inclui ausência de exposição recente a antibióticos, imunodeficiência, doença crônica e internação neonatal prolongada. Regra de risco, sem pontuação aditiva. Febre após vacinação exige interpretação clínica específica dos marcadores.',
 fields:[meta(y('eligible','População elegível e febre ≥38 °C confirmadas',1,'A termo, previamente saudável, sem foco e sem fatores de exclusão descritos acima.')),meta(n('ageDays','Idade (dias completos)',0,90)),meta(y('illAppearing','Aparência alterada ou suspeita clínica de sepse')),meta(y('leukocyturia','Leucócitos positivos na urina')),meta(n('pct','Procalcitonina (ng/mL)',0,1000,.01,'PCT igual a 0,5 já é critério de alto risco.')),meta(n('crp','Proteína C reativa (mg/L)',0,1000,.1,'Se o laboratório usar mg/dL, multiplicar por 10 antes de inserir.')),meta(n('anc','Neutrófilos absolutos (/µL ou células/mm³)',0,100000,1,'Contagem absoluta, não percentual.'))],
 validate:x=>Number(x.eligible)!==1?['eligible']:[],
 formula:'Alto risco: aparência alterada OU idade ≤21 dias OU leucocitúria OU PCT ≥0,5 ng/mL. Na ausência desses fatores, intermediário se PCR >20 mg/L OU ANC >10.000/µL; caso contrário, baixo risco. Os valores 0/1/2 codificam categorias e não somam pontos.',
 compute:x=>{const high=x.illAppearing===1||x.ageDays<=21||x.leukocyturia===1||x.pct>=.5;const intermediate=!high&&(x.crp>20||x.anc>10000);const total=high?2:intermediate?1:0;const displayValue=['Baixo','Intermediário','Alto'][total];return {total,displayValue,label:`${displayValue} risco pela regra`,level:high?'high':intermediate?'medium':'low',action:high?'Avaliar e tratar prontamente a possibilidade de infecção bacteriana invasiva; instabilidade e sinais de meningite exigem ação imediata.':intermediate?'Prosseguir investigação e observação de infecção bacteriana invasiva; não preencher exames ausentes como normais.':'Risco reduzido, sem exclusão de infecção invasiva. Integrar avaliação por idade, exames, culturas, observação e seguimento antes de definir destino.',breakdown:[],audit:`Regra sequencial: idade=${x.ageDays} dias; aparência alterada=${x.illAppearing}; leucocitúria=${x.leukocyturia}; PCT=${x.pct} ng/mL; PCR=${x.crp} mg/L; ANC=${x.anc}/µL`,alerts:x.ageDays>=22&&x.ageDays<=28?['Idade de 22–28 dias: especial cautela; classificação de baixo risco não determina alta.']:[]};},
 limits:'Após imunização, marcadores inflamatórios podem elevar-se e perder utilidade para distinguir infecção. Vacinação recente não comprova causa benigna nem exclui ITU ou infecção invasiva; não aplicar exclusão temporal automática nem dispensar avaliação por atribuir a febre à vacina. A CPS2026 aborda esse cenário separadamente. Febre muito recente pode preceder elevação dos marcadores; manter observação e reavaliação. Baixo risco não exclui bacteremia ou meningite. A categoria não determina alta nem dispensa exames por si só. Nenhum resultado laboratorial desconhecido deve ser assumido normal. Prematuros e lactentes com fatores de exclusão exigem avaliação individual.',sources:[R.step,R.stepOriginal]}),

make({id:'pecarn-abdominal',name:'PECARN · trauma abdominal fechado',specialty:'Pediatria',specialties:['Pediatria','Cirurgia geral','Trauma'],reviewDate,
 subtitle:'Regra de muito baixo risco de lesão intra-abdominal com intervenção',population:'Menores de 18 anos · trauma fechado do tronco',aliases:['trauma pediátrico','trauma abdominal','abdome','lesão intra-abdominal','tomografia'],max:7,unit:'critérios',resultScale:false,
 scope:'Menores de 18 anos com trauma fechado do tronco. Aplicar após avaliação e estabilização inicial, com exame confiável. O alvo é lesão intra-abdominal que exige intervenção aguda, não qualquer alteração tomográfica.',
 fields:[meta(y('eligible','Paciente <18 anos com trauma fechado e avaliação clínica confiável',1,'Após estabilização inicial; não usar a regra para retardar atendimento de choque ou peritonite.')),...pecarnCriteria.map(([id,label])=>meta(y(id,label)))],
 validate:x=>Number(x.eligible)!==1?['eligible']:[],
 formula:'Muito baixo risco somente se os sete fatores estiverem ausentes: parede abdominal/sinal do cinto, Glasgow ≤13, dor à palpação abdominal, parede torácica, queixa de dor abdominal, murmúrio vesicular diminuído e vômitos. A contagem não corresponde a uma probabilidade por ponto.',
 compute:x=>{const total=pecarnCriteria.reduce((sum,[id])=>sum+x[id],0);return {total,label:total===0?'Muito baixo risco pela regra':'Não classificado como muito baixo risco',level:total===0?'low':'medium',action:total===0?'A regra pode apoiar evitar tomografia quando a avaliação clínica completa concorda. Manter observação e reavaliação quando indicadas.':'Reavaliar mecanismo, exame, evolução e exames complementares. Um ou mais critérios presentes não determinam tomografia automaticamente.',breakdown:pecarnCriteria.map(([id,label])=>({label,points:x[id]})),audit:`${total} de 7 critérios de risco presentes; classificação por ausência de todos os critérios`};},
 limits:'Não somar probabilidades por fator nem extrapolar a trauma penetrante. Instabilidade, peritonismo e suspeita clínica relevante têm prioridade. Um fator presente não indica tomografia automaticamente. A regra não exclui todas as lesões intra-abdominais e não substitui observação clínica.',sources:[R.pecarn,R.pecarn2024]}),

make({id:'gags',name:'GAGS · acne',specialty:'Dermatologia',reviewDate,
 subtitle:'Acne vulgar · versão operacional com faixa 39–44 explícita',population:'Adolescentes e adultos com acne vulgar',aliases:['acne','comedão','pápula','pústula','acne nodular','global acne grading system'],max:44,
 scope:'Avaliação clínica da lesão de maior grau em cada uma das seis regiões. Pesos do GAGS de Doshi; classificação operacional 39–44 muito grave conforme protocolo NCT07250880, que cobre explicitamente a fronteira de 39.',
 fields:gagsRegions.map(([id,label,factor])=>meta(s(id,label,lesionOptions,`Selecionar a lesão de maior grau presente na região; fator ×${factor}.`))),
 formula:'GAGS = 2×fronte + 2×bochecha direita + 2×bochecha esquerda + nariz + queixo + 3×tórax/dorso superior. Cada grau: 0 sem lesões; 1 comedão; 2 pápula; 3 pústula; 4 nódulo. Total 0–44.',
 bands:[b(0,'Sem acne ativa','low','Registrar impacto e alterações residuais quando presentes.'),b(18,'Leve pelo GAGS','low','Integrar distribuição, cicatrizes, impacto psicossocial e evolução.'),b(30,'Moderada pelo GAGS','medium','Reavaliar atividade, risco de cicatrizes e plano terapêutico.'),b(38,'Grave pelo GAGS','high','Avaliação dermatológica prioritária conforme quadro e risco de cicatrizes.'),b(44,'Muito grave pelo GAGS','high','Priorizar avaliação clínica e dermatológica, com atenção a cicatrizes e impacto psicossocial.')],
 compute:x=>{const breakdown=gagsRegions.map(([id,label,factor])=>({label:`${label} ×${factor}`,points:x[id]*factor}));const total=breakdown.reduce((sum,item)=>sum+item.points,0);const label=total===0?'Sem acne ativa':total<=18?'Leve pelo GAGS':total<=30?'Moderada pelo GAGS':total<=38?'Grave pelo GAGS':'Muito grave pelo GAGS';return {total,label,level:total>30?'high':total>18?'medium':'low',action:'Integrar número de lesões, cicatrizes, distribuição, impacto psicossocial e resposta em série. A pontuação não escolhe medicação ou tratamento isoladamente.',breakdown,audit:gagsRegions.map(([id,,factor])=>`${factor}×${x[id]}`).join(' + ')};},
 limits:'GAGS clínico, sem ultrassonografia. O estudo tailandês de 2023 validou autoavaliação TGAGS em adultos, não esta redação em português nem aplicação pediátrica; sua tabela descreve fatores e critérios do GAGS. Tórax e dorso superior formam uma região conjunta. Não somar tipos de lesão dentro da mesma região. Não mede cicatrizes nem impacto psicossocial. Alguns relatos escrevem >39; esta versão identifica explicitamente 39–44, conforme protocolo citado.',sources:[R.gagsOriginal,R.gags,R.gagsBands]}),

make({id:'tvasi',name:'T-VASI · vitiligo',specialty:'Dermatologia',reviewDate,
 subtitle:'Área ponderada por despigmentação · registro agregado por estratos',population:'Adultos 18–65 anos · vitiligo não segmentar · estudo 2025',aliases:['vitiligo','vitiligo area scoring index','despigmentação','repigmentação'],max:100,range:'0–100',unit:'índice',resultScale:false,precision:2,
 scope:'Avaliação clínica por profissional treinado. Fórmula do T-VASI e áreas corporais da eFigure 2 do estudo JAMA Dermatology 2025, incluindo face/cabeça/pescoço no total. Este formulário agrega lesões com a mesma despigmentação residual em seis estratos; preserva a soma por lesão e não reproduz o desenho do formulário de pesquisa.',
 fields:[meta(y('eligible','Adulto de 18–65 anos com vitiligo não segmentar e avaliação clínica realizada',1,'População do estudo utilizado; não aplicar automaticamente como classificação validada pediátrica.')),...vasiStrata.map(p=>meta(n('area'+p,`Área com ${p}% de despigmentação residual (unidades de mão)`,0,100,.01,'Somar somente lesões desta faixa, sem duplicar áreas. Uma mão com palma e face volar dos dedos ≈1% da superfície corporal.')))],
 validate:x=>{if(Number(x.eligible)!==1)return ['eligible'];return vasiStrata.reduce((sum,p)=>sum+Number(x['area'+p]),0)>100?vasiStrata.map(p=>'area'+p):[];},
 formula:'T-VASI = Σ[área em unidades de mão × fração de despigmentação]. Agrupamento equivalente: 0,10×A10 + 0,25×A25 + 0,50×A50 + 0,75×A75 + 0,90×A90 + A100. Soma das áreas ≤100; áreas com 0% de despigmentação não pontuam.',
 compute:x=>{const breakdown=vasiStrata.map(p=>({label:`Área ${p}% ×${p/100}`,points:x['area'+p]*p/100}));const total=breakdown.reduce((sum,item)=>sum+item.points,0);return {total,label:total===0?'Sem despigmentação registrada':'Área ponderada pela despigmentação',level:'medium',action:'Comparar avaliações seriadas com a mesma delimitação corporal e, quando possível, o mesmo avaliador. Maior índice indica maior área ponderada; não há cortes universais de gravidade neste cálculo.',breakdown,audit:vasiStrata.map(p=>`${x['area'+p]}×${p/100}`).join(' + ')};},
 limits:'Registro agregado por estratos, não estimativa por fotografia automática. Não repetir a área total em vários campos nem substituir mão inteira por palma isolada. Na eFigure 2, face faz parte do T-VASI; F-VASI é medida separada e não deve ser somada outra vez. A versão original de 2004 excluía face/pescoço; não misturar delimitações em séries. Sem diagnóstico, grau de gravidade ou escolha de tratamento automáticos. O estudo de validação citado recrutou adultos 18–65 anos.',sources:[R.vasi,R.vasiOriginal]}),
];
