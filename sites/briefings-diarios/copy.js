for (const button of document.querySelectorAll('button[data-copy-target]')) {
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copyTarget);
    const status = document.getElementById(button.dataset.copyStatus);
    if (!text || !status) return;
    button.disabled = true;
    status.textContent = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text.textContent);
      status.textContent = 'Texto copiado.';
    } catch {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Texto selecionado. Copie para a área de transferência.';
      } else {
        status.textContent = 'Copie o texto diretamente do bloco.';
      }
    } finally {
      button.disabled = false;
    }
  });
}
