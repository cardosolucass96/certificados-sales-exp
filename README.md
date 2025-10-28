# Sistema de Certificados - Sales Experience

Sistema para geração de certificados do evento Sales Experience Teresina.

## 🚀 Funcionalidades

- Busca de participantes por código, e-mail ou telefone
- Validação de dados do participante
- Solicitação de nome completo caso não esteja preenchido
- Geração automática de certificado em PDF
- Armazenamento local dos certificados
- Link público para download do certificado

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Execute o projeto em modo desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

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
│   └── pdf-generator.ts             # Gerador de PDF com nome do participante
├── styles/
│   └── globals.css                  # Estilos globais (Tailwind)
├── public/
│   ├── certificados/                # Certificados gerados
│   ├── fonts/                       # Fonte Montserrat
│   └── modelo-certificado.pdf       # Template do certificado
├── participantes-sales-teresina.csv # Dados dos participantes
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
   - Sistema gera PDF com o nome do participante usando pdf-lib
   - Salva o certificado localmente em `public/certificados/`
   - Retorna link público para download

4. **Página de Sucesso**
   - Exibe link do certificado
   - Permite copiar o link
   - Permite visualizar o PDF

## 🔑 Variáveis de Ambiente

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Nota:** Em produção, configure `NEXT_PUBLIC_APP_URL` com a URL do seu servidor.

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
- **@pdf-lib/fontkit** - Suporte para fontes customizadas
- **csv-parse** - Leitura de CSV

## 📝 Próximos Passos

- [ ] Enviar certificado por e-mail
- [ ] Dashboard administrativo
- [ ] Relatórios de certificados gerados

## 🐛 Troubleshooting

### Participante não encontrado

Certifique-se de que o arquivo `participantes-sales-teresina.csv` está na raiz do projeto e contém os dados corretos.

### Erro ao gerar PDF

Verifique se todas as dependências foram instaladas corretamente:

```bash
npm install
```
