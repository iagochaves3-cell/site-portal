// Output validation only. Product, regimen, history and calculation gates remain
// in the existing clinical engine; this does not validate a medication source.
export function assertFinalClinicalText(text){
 if(typeof text!=='string'||!text.trim())throw Error('O bloco final está vazio.');
 if(/https?:\/\/|www\.|cite|\[[^\]]+\]\([^)]*\)|\b(?:DOI|PMID)\s*:/i.test(text)||/^\s*(?:(?:\d+[.)]|[—–*-])\s*)*(?:#{1,6}\s*)?(?:\*\*)?(?:fontes?|referências?(?: bibliográficas?)?|cálculos?|cálculo reverso|fórmula|comentários técnicos|fundamentação técnica)(?:\*\*)?\s*(?::|$)/im.test(text)||/\d[^\n]*(?:×|÷|\*|\bx\b|\+|\s-\s|\/)[^\n]*=\s*\d/i.test(text))throw Error('Fontes, cálculos e comentários técnicos devem ficar fora do bloco final. Revise os campos de orientação.');
 if(/[\[<]\s*(?:peso|idade|dose|duração|concentração|apresentação|medicamento|via|intervalo)(?:\s+[^\]>]*)?[\]>]/i.test(text))throw Error('Complete os dados clínicos essenciais antes de liberar o bloco final.');
 return text;
}
