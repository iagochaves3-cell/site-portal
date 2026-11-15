const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=src=>/^\/cards\/estudo-continuado\/[a-zA-Z0-9/._-]+\.png$/.test(src)?src:'';

export function summaryCards(topic){
  const cards=topic.summaryCards||[];
  if(!cards.length)return '';
  const sources=[...new Map(cards.flatMap(c=>c.sources).map(s=>[s.url,s])).values()];
  return `<section class="study-cards" aria-label="Cards didáticos de ${escape(topic.title)}"><h3>Cards didáticos</h3><p class="study-card-hint">${cards.length} cards · selecione para ampliar e navegar</p><div class="study-card-grid">${cards.map((c,i)=>`<figure><a href="${asset(c.src)}" data-study-card="${i}" target="_blank" rel="noopener" aria-label="Ampliar card ${i+1}: ${escape(c.title)}"><img src="${asset(c.src)}" alt="${escape(c.alt)}" width="${c.width}" height="${c.height}" loading="lazy" decoding="async"></a><figcaption>${i+1}. ${escape(c.title)}</figcaption></figure>`).join('')}</div><details class="study-card-transcripts"><summary>Texto acessível dos cards</summary>${cards.map(c=>`<h4>${escape(c.title)}</h4><p>${escape(c.transcript).replace(/\n/g,'<br>')}</p>`).join('')}</details><div class="study-card-sources"><strong>Referências dos cards</strong><ul>${sources.map(s=>`<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.label)} ↗</a></li>`).join('')}</ul></div></section>`;
}

export function bindSummaryCards(topic){
  const cards=topic.summaryCards||[];
  if(!cards.length)return;
  let dialog=document.getElementById('study-card-viewer');
  if(!dialog){
    dialog=document.createElement('dialog');
    dialog.id='study-card-viewer';
    dialog.setAttribute('aria-labelledby','study-card-viewer-title');
    dialog.innerHTML='<div class="study-viewer-toolbar"><strong id="study-card-viewer-title"></strong><button type="button" data-close autofocus aria-label="Fechar card">Fechar ×</button></div><div class="study-viewer-scroll"><img alt=""></div><div class="study-viewer-controls"><button type="button" data-prev aria-label="Card anterior">← Anterior</button><span data-counter role="status" aria-live="polite"></span><button type="button" data-next aria-label="Próximo card">Próximo →</button><button type="button" data-zoom aria-pressed="false">Ampliar texto</button><a data-original target="_blank" rel="noopener">Abrir imagem ↗</a></div>';
    document.body.append(dialog);
    dialog.querySelector('[data-close]').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
    dialog.addEventListener('close',()=>document.body.classList.remove('study-viewer-open'));
  }
  let current=0;
  const draw=()=>{
    const card=cards[current],img=dialog.querySelector('img');
    img.src=asset(card.src);img.alt=card.alt;
    dialog.querySelector('#study-card-viewer-title').textContent=card.title;
    dialog.querySelector('[data-counter]').textContent=`${current+1} de ${cards.length}`;
    dialog.querySelector('[data-prev]').disabled=current===0;
    dialog.querySelector('[data-next]').disabled=current===cards.length-1;
    dialog.querySelector('[data-original]').href=asset(card.src);
    dialog.querySelector('.study-viewer-scroll').scrollTo(0,0);
  };
  const change=delta=>{current=Math.min(cards.length-1,Math.max(0,current+delta));draw()};
  dialog.querySelector('[data-prev]').onclick=()=>change(-1);
  dialog.querySelector('[data-next]').onclick=()=>change(1);
  dialog.querySelector('[data-zoom]').onclick=e=>{const zoom=dialog.classList.toggle('is-zoomed');e.currentTarget.setAttribute('aria-pressed',String(zoom));e.currentTarget.textContent=zoom?'Ajustar à tela':'Ampliar texto'};
  dialog.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(e.key==='ArrowRight'?1:-1)}};
  document.querySelectorAll('[data-study-card]').forEach(link=>link.onclick=e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||typeof dialog.showModal!=='function')return;
    e.preventDefault();current=Number(link.dataset.studyCard);
    dialog.classList.remove('is-zoomed');
    const zoom=dialog.querySelector('[data-zoom]');zoom.setAttribute('aria-pressed','false');zoom.textContent='Ampliar texto';
    draw();dialog.showModal();document.body.classList.add('study-viewer-open');
  });
}
