import {norm} from './core.mjs';
// Explicit source identities only. Matching a drug never makes an old route or
// formulation interchangeable with a structured regimen's named presentation.
export const medicationCatalogAliases={
 'guia-197':{id:'med-218',sourceName:'Glicose hipertônica',targetName:'Glicose'},
 'guia-32':{id:'med-39',sourceName:'Ampicilina sódica',targetName:'Ampicilina'},
 'guia-96':{id:'med-105',sourceName:'Cefuroxima axetila / sódica',targetName:'Cefuroxima (Axetila / Sódica)'},
 'guia-165':{id:'med-185',sourceName:'Esomeprazol magnésico / sódico',targetName:'Esomeprazol'},
 'guia-311':{id:'med-340',sourceName:'Pantoprazol sódico',targetName:'Pantoprazol'}
};
export function buildMedicationCanonicalMap(catalog,evidence){
 const byId=new Map(catalog.map(m=>[m.id,m]));
 const name=m=>evidence[m.id]?.name||m.name;
 const canonicalNames=new Map(catalog.filter(m=>m.source==='fonte-014').map(m=>[norm(name(m)),m.id]));
 return new Map(catalog.map(m=>{
  const alias=medicationCatalogAliases[m.id],target=alias&&byId.get(alias.id);
  const explicit=alias&&target&&norm(name(m))===norm(alias.sourceName)&&norm(name(target))===norm(alias.targetName);
  return [m.id,explicit?alias.id:canonicalNames.get(norm(name(m)))||m.id];
 }));
}
