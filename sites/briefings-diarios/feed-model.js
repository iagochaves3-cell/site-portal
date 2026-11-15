export const PAGE_SIZE = 50;
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const collator = new Intl.Collator('pt-BR', {sensitivity: 'base', numeric: true});
export function organize(items, order = 'date_desc') {
  return [...items].sort((a, b) => {
    const recent = String(b.date).localeCompare(String(a.date));
    if (order === 'date_asc') return -recent;
    if (order === 'title_asc') return collator.compare(normalize(a.title), normalize(b.title)) || recent;
    if (order === 'specialty') return collator.compare(a.specialty || 'Outros', b.specialty || 'Outros') || recent;
    return recent;
  });
}
export function selectPage(items, {order = 'date_desc', page = 1, query = '', series = '', date = ''} = {}) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const filtered = items.filter(item => (!series || item.series === series) && (!date || item.date === date) && terms.every(term => normalize(item.search ?? item.title).includes(term)));
  const sorted = organize(filtered, order);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(pages, Math.max(1, Math.trunc(Number(page)) || 1));
  return {items: sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), total: sorted.length, page: current, pages};
}
