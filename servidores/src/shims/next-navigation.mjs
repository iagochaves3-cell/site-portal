// Substituto mínimo de "next/navigation" para rotas de servidor.
// O adaptador converte estes erros em respostas HTTP.
export function redirect(url, tipo = 'replace') {
  const erro = new Error('NEXT_REDIRECT');
  erro.digest = 'NEXT_REDIRECT;' + tipo + ';' + url + ';307;';
  throw erro;
}
export function permanentRedirect(url, tipo = 'replace') {
  const erro = new Error('NEXT_REDIRECT');
  erro.digest = 'NEXT_REDIRECT;' + tipo + ';' + url + ';308;';
  throw erro;
}
export function notFound() {
  const erro = new Error('NEXT_NOT_FOUND');
  erro.digest = 'NEXT_NOT_FOUND';
  throw erro;
}
