// Site simulado para testar o envoltório: imita o adaptador (pede contexto ao ACESSO) e o código original (chama a OpenAI).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/file') return new Response(new Uint8Array([37, 80, 68, 70]), { headers: { 'content-type': 'application/pdf' } });
    const ctx = await env.ACESSO.contexto(request.headers.get('cookie') || '');
    if (url.pathname === '/quem') return Response.json({ usuario: ctx.usuario, temChave: !!ctx.chave });
    if (!ctx.chave) return Response.json({ erro: 'falta a chave' }, { status: 503 });
    if (url.pathname === '/api/chave-de-fora') {
      const r = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: 'Bearer sk-dono' }, body: '{"input":"oi"}' });
      return new Response(await r.text(), { status: r.status });
    }
    if (url.pathname === '/api/consulta') {
      const r = await fetch('https://api.openai.com/v1/responses/' + url.searchParams.get('id'), { headers: { Authorization: 'Bearer ' + ctx.chave } });
      return new Response(await r.text(), { status: r.status });
    }
    const r = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: 'Bearer ' + ctx.chave, 'Content-Type': 'application/json' }, body: JSON.stringify({ input: [{ role: 'user', content: [{ type: 'input_text', text: 'oi' }, { type: 'input_file', file_url: url.origin + '/api/file?token=abc' }] }] }) });
    return new Response(await r.text(), { status: r.status });
  },
};
