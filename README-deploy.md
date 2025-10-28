Resumo de deploy

Arquivos criados:
- Dockerfile — multi-stage para build e execução em produção (porta 3000)
- docker-compose.stack.yml — stack pronta para deploy via Portainer / Docker Swarm. Aplica labels Traefik para `certificados.cardosolucas.com`.
- .env.production.sample — amostra de variáveis de ambiente (NUNCA commit com segredos reais)

Passos rápidos (Portainer):
1) Configurar DNS:
   - Crie um registro A para certificados.cardosolucas.com apontando para o IP da sua VPS.

2) Via Portainer (Stacks -> Add stack -> Git repository):
   - Repository URL: https://github.com/cardosolucass96/certificados-sales-exp
   - Branch: main
   - Compose path: (se você colocar o arquivo na raiz do repositório) `docker-compose.stack.yml`, ou se usar o arquivo local no Portainer cole o conteúdo.
   - Habilite "Build images" (Portainer pode montar a build) se quiser que a imagem seja construída no host.

3) Variáveis de ambiente:
   - No editor de Stack (se estiver usando Portainer) adicione as variáveis do `.env.production.sample` com os valores reais (MINIO_*, NEXT_PUBLIC_APP_URL).
   - Alternativa mais segura: usar Docker secrets para MINIO_SECRET_KEY e MINIO_ACCESS_KEY.

4) Rede Traefik:
   - O stack usa a rede externa `CardosoNet` conforme sua configuração do Traefik.
   - Se sua rede tem outro nome ajuste `docker-compose.stack.yml` (campo networks.name e traefik.docker.network label).

5) Certificados TLS:
   - O Traefik naquele `traefik.yaml` usa o resolver `letsencryptresolver`. O `docker-compose.stack.yml` já referencia esse resolver.
   - Se seu resolver tiver outro nome, atualize a label `traefik.http.routers.certificados.tls.certresolver`.

6) Verificar MinIO:
   - Certifique-se que o endpoint MINIO_ENDPOINT é acessível a partir da VPS e que o bucket `MINIO_BUCKET` existe.

Observações e segurança:
- NÃO comite chaves no repositório. Use Portainer env vars / Docker secrets.
- Recomendo criar um Healthcheck simples (opcional) para o serviço, ou configurar replicas/placement conforme sua arquitetura.

Se quiser, posso gerar um PR no seu repositório com esses arquivos (Dockerfile + docker-compose.stack.yml + README) — quer que eu faça isso agora?
