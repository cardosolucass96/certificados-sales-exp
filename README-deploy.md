# Deploy - Certificados Sales Experience

## Arquivos de Deploy

- **Dockerfile** — Multi-stage build para produção (porta 3000)
- **docker-compose.stack.yml** — Stack para deploy via Portainer/Docker Swarm com Traefik
- **scripts/init-server.js** — Script de inicialização que cria pastas necessárias

## Passos para Deploy (Portainer)

### 1. Configurar DNS
Crie um registro A apontando para o IP da VPS:
- `certificados.cardosolucas.com` → IP da VPS

### 2. Deploy via Portainer
**Opção A - Git Repository:**
- Stacks → Add stack → Git repository
- Repository URL: `https://github.com/cardosolucass96/certificados-sales-exp`
- Branch: `main`
- Compose path: `docker-compose.stack.yml`
- Habilite "Build images"

**Opção B - Web editor:**
- Cole o conteúdo do `docker-compose.stack.yml`

### 3. Variáveis de Ambiente
Configure no editor de Stack do Portainer:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://certificados.cardosolucas.com
```

### 4. Rede Traefik
- A stack usa a rede externa `CardosoNet`
- Se sua rede Traefik tiver outro nome, ajuste em `docker-compose.stack.yml`:
  - Campo `networks.name`
  - Label `traefik.docker.network`

### 5. Certificados TLS
- O Traefik usa o resolver `letsencryptresolver`
- Se usar outro nome, atualize a label `traefik.http.routers.certificados.tls.certresolver`

### 6. Verificar Implantação
Após deploy, acesse:
- https://certificados.cardosolucas.com

O sistema armazena os certificados localmente em `/app/public/certificados/` dentro do container.

## Observações de Segurança

- ✅ Certificados são gerados e armazenados localmente
- ✅ Não há credenciais sensíveis para configurar
- ⚠️ Configure backups periódicos da pasta `public/certificados/` se necessário
