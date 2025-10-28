# Sistema de Certificados - Sales Experience

Sistema para geração de certificados do evento Sales Experience Teresina.

## 🚀 Funcionalidades

- Busca de participantes por código, e-mail ou telefone
- Validação de dados do participante
- Solicitação de nome completo caso não esteja preenchido
- Geração automática de certificado em PDF
- Upload e armazenamento no MinIO
- Link público para download do certificado

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

O arquivo `.env.local` já está configurado com as credenciais do MinIO.

3. Execute o projeto em modo desenvolvimento:

```bash
npm run dev
```

4. Acesse no navegador:

```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
certificados-sales-exp/
├── pages/
│   ├── api/
│   │   ├── buscar-participante.ts   # API para buscar participante no CSV
│   │   └── gerar-certificado.ts     # API para gerar e fazer upload do PDF
│   ├── _app.tsx                     # Configuração do App Next.js
│   ├── _document.tsx                # Configuração do Document Next.js
│   ├── index.tsx                    # Página inicial com formulário
│   └── sucesso.tsx                  # Página de sucesso com link do certificado
├── lib/
│   ├── participants.ts              # Utilitário para ler e buscar no CSV
│   ├── minio.ts                     # Cliente MinIO e funções de upload
│   └── pdf-generator.ts             # Gerador de PDF com nome do participante
├── styles/
│   └── globals.css                  # Estilos globais (Tailwind)
├── participantes-sales-teresina.csv # Dados dos participantes (convertido)
├── participantes-sales-teresina.xlsx # Dados dos participantes (original)
├── credentials minio.json           # Credenciais do MinIO
├── .env.local                       # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Fluxo de Uso

1. **Busca do Participante**
   - Usuário acessa a página inicial
   - Digita código do ticket, e-mail ou telefone
   - Sistema busca no arquivo `participantes-sales-teresina.csv`

2. **Validação do Nome**
   - Se o nome completo estiver preenchido → gera certificado
   - Se não estiver → solicita o nome completo

3. **Geração do Certificado**
   - Sistema gera PDF com o nome do participante
   - Faz upload para o MinIO
   - Retorna link público

4. **Página de Sucesso**
   - Exibe link do certificado
   - Permite copiar o link
   - Permite visualizar o PDF

## 🔑 Variáveis de Ambiente

```env
MINIO_ENDPOINT=minio.grupovorp.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=tu6gysXY9yFEGKO2cBhv
MINIO_SECRET_KEY=OWevInkkkEFwSz0EOlPi9iS2XHMBLeQGN9dHcEqB
MINIO_BUCKET=certificados-sales
MINIO_REGION=us-east-1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **pdf-lib** - Geração de PDFs
- **MinIO** - Armazenamento de objetos
- **csv-parse** - Leitura de CSV

## 📝 Próximos Passos

- [ ] Adicionar template personalizado de PDF
- [ ] Enviar certificado por e-mail
- [ ] Sistema de logs
- [ ] Dashboard administrativo
- [ ] Relatórios de certificados gerados

## 🐛 Troubleshooting

### Erro ao conectar ao MinIO

Verifique se as credenciais no `.env.local` estão corretas.

### Participante não encontrado

Certifique-se de que o arquivo `participantes-sales-teresina.csv` está na raiz do projeto e contém os dados corretos.

**Nota:** Se você tiver apenas o arquivo `.xlsx`, execute o script de conversão:

```bash
node convert-excel-to-csv.js
```

### Erro ao gerar PDF

Verifique se todas as dependências foram instaladas corretamente:

```bash
npm install
```
