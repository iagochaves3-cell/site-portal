// Clinical reference only. This module does not generate patient prescriptions.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function hydrationPage(data){
  return `<div class="reader-layout">
    <div class="reader-top"><span class="badge">PEDIATRIA · REIDRATAÇÃO</span><button class="button subtle" id="hydration-print">Imprimir / PDF</button></div>
    <div class="page-heading"><div class="eyebrow">AVALIAÇÃO · REPOSIÇÃO · MANUTENÇÃO</div><h1>Soroterapia na desidratação</h1><p>Guia do PDF fornecido, com protocolos diferenciados, exemplos conferidos e fontes primárias. Revisão documental por IA · 23/10/2026.</p></div>
    <p class="notice"><strong>Errata de segurança:</strong> os preparos com NaCl concentrado da página 13 do PDF estão incorretos. <a href="#soroterapia/misturas-e-errata-critica-do-pdf">Consulte a correção antes de usar o material de origem ↗</a></p>
    <details class="review-detail"><summary>Neste guia · ${data.sections.length} seções</summary><nav class="filters" aria-label="Seções de soroterapia">${data.sections.map(s=>`<a class="chip" href="#soroterapia/${esc(s.id)}">${esc(s.title)}</a>`).join('')}</nav></details>
    <article class="content">${data.sections.map(s=>`<section aria-labelledby="hydration-${esc(s.id)}"><h2 id="hydration-${esc(s.id)}" tabindex="-1">${esc(s.title)}</h2>${s.html}</section>`).join('')}</article>
    <section class="tool-strip"><div><h3>Confira a conversão de vazão.</h3><p>Use o fator real do equipo na calculadora de gotas/min.</p></div><a class="button" href="#calculadoras">Abrir calculadoras →</a></section>
    <details class="review-detail"><summary>Integridade da fonte e desta revisão</summary><dl><dt>Documento recebido</dt><dd>${esc(data.source.name)} · 17 páginas</dd><dt>SHA-256 do PDF</dt><dd>${esc(data.source.sha256)}</dd><dt>SHA-256 da síntese</dt><dd>${esc(data.sha256)}</dd><dt>Estado</dt><dd>Pesquisa e conferência por IA; sem homologação médica humana atribuída.</dd></dl></details>
  </div>`;
}
