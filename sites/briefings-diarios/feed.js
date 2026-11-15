import {selectPage} from './feed-model.js';

export function initFeed(document, window) {
  const byId = id => document.getElementById(id);
  const list = byId('ecard-feed');
  if (!list) return;
  const entries = [...list.querySelectorAll('.ecard')].map(node => ({...node.dataset, node}));
  const order = byId('feed-order'), search = byId('archive-search'), series = byId('archive-series'), date = byId('archive-date');
  const previous = byId('feed-previous'), next = byId('feed-next');
  let page = 1;
  const scroll = top => window.scrollTo({top, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  function render(moveFocus = false) {
    const result = selectPage(entries, {order: order.value, page, query: search.value, series: series.value, date: date.value});
    page = result.page;
    for (const entry of entries) entry.node.hidden = true;
    let lastSpecialty;
    for (const entry of result.items) {
      const heading = entry.node.querySelector('.specialty-heading');
      heading.hidden = order.value !== 'specialty' || entry.specialty === lastSpecialty;
      lastSpecialty = entry.specialty;
      entry.node.hidden = false;
      list.append(entry.node);
    }
    previous.hidden = page === 1;
    next.hidden = page === result.pages;
    byId('feed-page').textContent = `Página ${page} de ${result.pages}`;
    byId('archive-status').textContent = result.total ? `${(page - 1) * 50 + 1}–${Math.min(page * 50, result.total)} de ${result.total} eCards` : 'Nenhum eCard encontrado';
    byId('archive-empty').hidden = result.total > 0;
    if (moveFocus) {
      byId('feed-title').focus({preventScroll: true});
      scroll(byId('feed-title').getBoundingClientRect().top + window.scrollY - 24);
    }
  }
  order.addEventListener('change', () => {page = 1; render();});
  for (const control of [search, series, date]) control.addEventListener('input', () => {page = 1; render();});
  byId('archive-clear').addEventListener('click', () => {search.value = series.value = date.value = ''; page = 1; render(); search.focus();});
  previous.addEventListener('click', () => {page--; render(true);});
  next.addEventListener('click', () => {page++; render(true);});
  byId('back-to-top').addEventListener('click', () => {scroll(0); byId('main').focus({preventScroll: true});});
  render();
  return {render};
}

if (typeof document !== 'undefined') initFeed(document, window);
