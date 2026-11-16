# Pacotes de transporte dos servidores (ramo auxiliar — não publicar)

Arquivos `.bin` deste ramo são os programas de servidor dos sites, **cifrados** (AES-256-GCM),
usados apenas para levar os programas até a Cloudflare em 16/11/2026.

- Não fazem parte de nenhum site e não devem ser unidos ao ramo `main`.
- Sem a chave de transporte, o conteúdo é ilegível. A chave não está no repositório.
- Os programas em uso ficam na Cloudflare (Workers). Este ramo pode ser apagado pelo dono a qualquer momento.
