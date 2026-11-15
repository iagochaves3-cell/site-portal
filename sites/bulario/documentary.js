// Render the synchronized source inside the existing ten-section medicine sheet.
export function clinicalSheet(d,{section,domains,text,esc}) {
 const c=d.clinical_update.clinical;
 const provenance=d.clinical_update.provenance;
 const safeUrl=u=>{try{const p=new URL(u);return ['https:','http:'].includes(p.protocol)?p.href:''}catch{return ''}};
 const references=refs=>'<ul>'+refs.map(r=>{const u=safeUrl(r.url);return u?`<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(r.text||r.label||'Fonte original')} ↗</a></li>`:''}).join('')+'</ul>';
 const paragraphs=items=>(items||[]).map(text).join('');
 const groups=items=>(items||[]).map(g=>`<h4>${esc(g.title||g.indication||'Informação documental')}</h4>${g.population?text('População: '+g.population):''}${g.tags?text(g.tags):''}${g.context_label?text(g.context_label):''}${paragraphs(g.items||g.paragraphs)}${g.supplement?groups([g.supplement]):''}${g.sources?.length?references(g.sources):''}`).join('');
 const fallback='Este domínio não foi extraído separadamente na fonte. Consulte os cuidados e a bula específica; ausência de texto não significa ausência de risco.';
 const safety=c.safety||[];
 const adjustments=safety.filter(s=>/renal|hep[aá]ti|di[aá]lis|gesta|lacta|idos|neonat|obes/i.test(s));
 const monitoring=safety.filter(s=>/monitor|rea[çc][õo]|advers|superdose|toxic|distoni|sed[aã]|hemograma|eletro|press[aã]o|QT|ECG/i.test(s));
 let h='<div class="notice">Ficha atualizada com a versão '+esc(provenance.source_version)+' de Farmacologia Pediátrica. Datas, contexto e limitações da revisão de origem foram preservados. Não representa revisão integral de todas as bulas ou apresentações.</div>';
 const brazil=(c.brazil_presentations||[]).map(p=>text(`${p.name} · ${p.strength} · ${p.form} — RENAME, página ${p.page}`)).join('');
 h+=section(domains[0],groups(c.presentations)+brazil+(c.brazil_presentations_source?references([c.brazil_presentations_source])+text('RENAME — Ministério da Saúde, CC BY-NC-SA 4.0; edição e limites conforme a fonte.'):'' )||text('Apresentação não extraída nesta fonte.'),true);
 h+=section(domains[1],paragraphs(c.source_scope)+(c.indications||[]).map(r=>text(`${r.indication}\nPopulação: ${r.population||'Não definida no trecho'}${r.tags?'\n'+r.tags:''}`)).join(''),true);
 const review=d.clinical_update.source_review;
 h+=section(domains[2],(c.review?.alert?text(c.review.alert):'')+(review?.pending?.length?'<h4>Ressalvas específicas da revisão</h4>'+paragraphs(review.pending):'')+groups(c.regimens),true);
 h+=section(domains[3],groups(c.duration)+groups(c.duration_notes)||text('Prazo universal não informado; conferir cada indicação.'));
 h+=section(domains[4],groups(c.preparation)+groups(c.administration)||text(fallback));
 h+=section(domains[5],paragraphs(adjustments)||text(fallback));
 h+=section(domains[6],paragraphs(safety)+groups(c.review?.sections)||text(fallback));
 h+=section(domains[7],paragraphs(monitoring)||text(fallback));
 h+=section(domains[8],text('Farmacologia e conservação devem ser consultadas na bula específica. Quando presentes na revisão de origem, os detalhes são preservados nas observações abaixo.')+groups((c.review?.sections||[]).filter(s=>/farmaco|conserv|estabil|armazen/i.test(s.title||''))));
 let notes=text(`Sincronização: ${provenance.synced_date}. Revisão de origem: ${c.review?.date||'data específica não declarada'}.`)+text(c.review?.scope||'Escopo conforme os documentos vinculados.');
 if(review?.pending?.length)notes+='<h4>Limitações específicas da revisão de origem</h4>'+paragraphs(review.pending);
 notes+=references(d.resolved_source_references||[]);
 const checks=d.source_access_checks||[];
 if(checks.length)notes+=text(`Consulta de acesso aos arquivos em 26/10/2026: ${checks.filter(x=>x.retrieval_status==='PDF_RETRIEVED').length} de ${checks.length} PDFs recuperados. A recuperação técnica não equivale a leitura ou validação clínica integral.`);
 notes+=`<p><a href="${esc(provenance.url)}/#medicamento-${d.ordinal}" target="_blank" rel="noopener">Ficha no catálogo de origem ↗</a></p><p><a href="Bulario_Ped_Monster_Fonte.pdf#page=${d.page_start}" target="_blank">PDF histórico fornecido · página ${d.page_start} ↗</a></p>`;
 h+=section(domains[9],notes,true);
 h+=section('Texto integral extraído da ficha',text('Documento histórico preservado. A ficha atualizada e suas revisões estão nas seções acima.')+text(d.raw_text));
 return h;
}
