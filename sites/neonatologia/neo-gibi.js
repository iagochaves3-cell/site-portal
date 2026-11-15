/* Ajusta apenas os deslocamentos da navegação fixa ao tamanho real do cabeçalho. */
'use strict';
(() => {
  const header = document.querySelector('.header');
  const search = document.querySelector('.searchbar');
  if (!header || !search) return;
  function syncOffsets() {
    const h = Math.ceil(header.getBoundingClientRect().height);
    const s = Math.ceil(search.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--neo-header-height', h + 'px');
    document.documentElement.style.setProperty('--neo-sticky-height', (h + s) + 'px');
  }
  syncOffsets();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(syncOffsets);
    observer.observe(header);
    observer.observe(search);
  } else window.addEventListener('resize', syncOffsets);
})();
