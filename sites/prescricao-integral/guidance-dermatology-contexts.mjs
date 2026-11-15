const cps='https://cps.ca/en/documents/position/antifungal-agents-common-infections';
const aad='https://www.aad.org/public/diseases/a-z/seborrheic-dermatitis-treatment';
const aadCare='https://www.aad.org/public/diseases/a-z/seborrheic-dermatitis-self-care';
const emollient='https://www.nhs.uk/tests-and-treatments/emollients/';
const ichthyosis='https://www.nhs.uk/conditions/ichthyosis/';
const eczema='https://www.rch.org.au/clinicalguide/guideline_index/eczema/';
const aap='https://www.aap.org/en/patient-care/atopic-dermatitis/treatment-of-atopic-dermatitis/';
const base={status:'source-reviewed',setting:'home',revisedAt:'2026-09-27',reviewNotes:'Cuidados de quadro localizado/estável. Prazos de revisão de 7 ou 14 dias, quando não fixados pela fonte, são escolhas operacionais explícitas; antecipar se houver piora. Não autorizam alta nem substituem avaliação de gravidade.'};
const sources=(...urls)=>urls.map(url=>({title:'Referência de cuidado e evolução clínica',url,accessed:'2026-09-27'}));
export const dermatologyGuidanceRecords=[
 {...base,name:'Candidíase cutânea',aliases:['Intertrigo candidiásico'],
 general:'Usar o antifúngico na frequência e duração indicadas. Não compartilhar toalhas nem acrescentar cremes com corticoide por conta própria.',
 diagnosis:'Lavar suavemente e secar as dobras sem fricção. Preferir roupas que não apertem e trocar peças úmidas. Não cobrir com plástico. Candidíase na boca, região genital ou fralda tem cuidados específicos.',
 expected:'Coceira e vermelhidão devem diminuir gradualmente. O tempo de tratamento varia com o medicamento e a extensão; completar o prazo do item prescrito. Calor e umidade favorecem recorrências.',
 alarm:'Observar aumento da área, fissuras dolorosas, secreção purulenta, novas lesões ou reação ao produto. Recorrências frequentes podem exigir investigação de fatores predisponentes.',
 immediate:'Procurar atendimento imediato se a vermelhidão se espalhar rapidamente com dor forte, febre ou prostração, ou se houver inchaço de lábios/língua e dificuldade para respirar após o medicamento.',
 return:'Reavaliar se não houver melhora em 14 dias, antes se piorar, e ao final do curso se persistirem lesões. Quadros extensos, repetidos ou em pessoa imunossuprimida precisam de avaliação dirigida.',
 sources:sources(cps,'https://www.nhs.uk/conditions/thrush-in-men-and-women/','https://www.rch.org.au/clinicalguide/guideline_index/Cellulitis_and_Skin_Infections/')},
 {...base,name:'Dermatite seborreica',aliases:['Eczema seborreico'],
 general:'Fazer limpeza suave e usar apenas produtos indicados para a idade e o local. Evitar água muito quente, fragrâncias e produtos irritantes.',
 diagnosis:'Não arrancar escamas nem coçar. No bebê com crosta láctea, usar xampu infantil e retirar somente escamas já soltas, delicadamente; não transferir xampu medicamentoso de adulto para o bebê. Na criança maior, cumprir o tempo de contato e frequência do produto prescrito.',
 expected:'O tratamento reduz descamação, coceira e vermelhidão; recaídas podem ocorrer e o plano de manutenção difere do tratamento da crise. A crosta láctea costuma desaparecer em semanas a meses.',
 alarm:'Observar secreção, dor, mau cheiro, aumento da vermelhidão, queda localizada de cabelos ou falta de resposta, pois outras doenças podem ter aparência semelhante.',
 immediate:'Buscar atendimento imediato diante de febre com piora do estado geral, vermelhidão dolorosa que se espalha rapidamente, acometimento ocular doloroso ou reação alérgica com dificuldade respiratória.',
 return:'Reavaliar em 2–4 semanas para conferir resposta e manutenção; antecipar se piorar, houver irritação importante ou sinais de infecção. Se o item prescrito determinar retorno mais cedo, seguir esse prazo.',
 sources:sources(aad,aadCare,'https://www.rch.org.au/clinicalguide/guideline_index/Cellulitis_and_Skin_Infections/')},
 {...base,name:'Xerose cutânea',aliases:['Pele seca','Ressecamento cutâneo'],
 general:'Preferir banhos curtos e mornos, limpeza suave sem perfume e secagem sem esfregar. Usar hidratante adequado à idade e à pele diariamente.',
 diagnosis:'Aplicar o emoliente sobretudo após o banho. Produtos com ureia podem arder em pele inflamada ou ferida; usar somente a concentração e os locais prescritos. Separar outros tópicos por 20–30 minutos e não misturar na mão.',
 expected:'A pele tende a ficar mais macia e menos desconfortável com cuidados regulares; pode voltar a ressecar se os cuidados forem interrompidos. Fissuras, inflamação persistente ou coceira intensa podem indicar outra condição associada.',
 alarm:'Observar ardor persistente, vermelhidão nova, bolinhas com pus, fissuras dolorosas ou coceira que prejudica o sono. Manter roupas e tecidos impregnados de emoliente longe de cigarro, velas e outras chamas.',
 immediate:'Procurar atendimento imediato se aparecerem febre e vermelhidão dolorosa em expansão, bolhas extensas, prostração ou reação alérgica com inchaço e falta de ar.',
 return:'Reavaliar tolerância e resposta em 2 semanas; antecipar diante de irritação ou infecção. Se o ressecamento persistir apesar do uso correto, revisar produto, diagnóstico e possíveis causas.',
 sources:sources(emollient,aap,'https://bula.gratis/pdfs/bula_1697787378180.pdf')},
 {...base,name:'Ictiose vulgar',aliases:[],
 general:'Manter rotina de hidratação e acompanhamento. A ictiose não é contagiosa; o tratamento busca controlar ressecamento e descamação.',
 diagnosis:'Usar emoliente após banho morno e não remover escamas com força. Aplicar ureia apenas quando indicada para a idade e em pele íntegra. Observar tolerância ao calor e evitar superaquecimento.',
 expected:'É uma condição geralmente crônica, com intensidade variável; a forma vulgar pode melhorar com a idade. O cuidado contínuo reduz sintomas, mas não promete desaparecimento definitivo.',
 alarm:'Observar rachaduras dolorosas, infecção, pele que limita movimentos, redução do suor, dificuldade com calor e alterações de visão ou audição. Esses achados exigem revisão do diagnóstico e da extensão.',
 immediate:'Buscar atendimento imediato diante de febre com prostração, sinais de superaquecimento, desidratação, bolhas extensas ou infecção em rápida expansão. Descamação intensa desde o nascimento precisa de avaliação especializada urgente.',
 return:'Rever tolerância ao tratamento inicial em 2 semanas e manter acompanhamento dermatológico regular. Antecipar se houver dor, fissuras, intolerância ao calor ou limitação funcional; formas graves têm plano próprio.',
 sources:sources(ichthyosis,'https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/ichthyosis/',emollient)}
];
const tinea={expected:'Espera-se diminuição progressiva da coceira e da lesão. A duração varia com o antifúngico e o local; cumprir o curso exato do item prescrito mesmo com melhora inicial. Não copiar a duração de outro creme.',return:'Reavaliar se não houver melhora em 14 dias, se piorar ou se persistir ao final do curso. Lesões no couro cabeludo/unhas, disseminadas ou recorrentes precisam de avaliação específica.',urls:[cps]};
const atopic={diagnosis:'Manter emoliente diário, inclusive entre crises, e banho morno curto com produto suave sem perfume. Aplicar o anti-inflamatório somente nas áreas e pelo tempo prescritos. Não fazer oclusão com plástico ou prolongar corticoide por conta própria.',return:'Na crise tratada, reavaliar se não houver melhora em 7 dias ou no prazo mais curto definido no item. Antecipar se surgirem pus, febre, bolhas dolorosas ou piora rápida. Crises repetidas, coceira que impede dormir e necessidade frequente de corticoide exigem ajuste do plano de manutenção.',urls:[eczema,aap]};
export const dermatologyGuidanceSupplements={
 'Tinea corporis':tinea,'Tinea cruris':tinea,'Tinea pedis':tinea,
 'Pitiríase versicolor':{return:'Completar o curso do antifúngico e reavaliar se persistirem descamação ou novas lesões ao final. A cor pode demorar meses para normalizar; alteração residual isolada não justifica prolongar o remédio. Recorrências frequentes exigem plano de prevenção.',urls:[cps,'https://www.nhs.uk/conditions/pityriasis-versicolor/']},
 'Candidíase de fraldas':{diagnosis:'Trocar fraldas assim que molhadas ou sujas, limpar com água morna, secar sem esfregar e deixar períodos sem fralda. Usar o antifúngico prescrito e manter barreira cutânea. Retirar somente sujeira visível, sem remover toda a barreira a cada troca. Evitar talco solto e produtos perfumados.',return:'Reavaliar se não melhorar em 3 dias, se persistir ao final do curso ou antes diante de piora, pus, bolhas ou febre. Não acrescentar corticoide potente nem prolongar antifúngico indefinidamente.',urls:['https://www.rch.org.au/clinicalguide/guideline_index/Nappy_rash/','https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Dermodex-Tratamento-Profissional-Consulta-Remedios.pdf']},
 'Candidíase oral (Sapo)':{diagnosis:'Distribuir o medicamento local nas lesões com cuidado; não esguichar no fundo da garganta. Se for gel oral, fracionar em pequenas porções e nunca aplicar no mamilo para o bebê sugar. Higienizar chupetas, bicos e utensílios.',return:'Reavaliar se não começar a melhorar em 7 dias, se persistir ao final do curso ou se voltar repetidamente. Dificuldade para alimentar, dor ao engolir ou redução da urina exigem retorno antes; não aumentar a dose nem trocar o produto por conta própria.',urls:[cps,'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Daktarin-Profissional-Consulta-Remedios.pdf']},
 'Dermatite atópica':atopic,'Dermatite Atópica em Pediatria':atopic
};
