# 🧪 Exemplos de Teste - Sistema de Busca

Baseado nos dados reais do CSV, aqui estão exemplos práticos para testar:

---

## ✅ Teste 1: Busca por EMAIL

### Participante: Jose Luiz Goncalves Fortes Neto

**Digite no campo de busca:**
```
zenetofg@hotmail.com
```

**Resultado esperado:**
- ✅ Encontra o participante
- ✅ Nome já preenchido: "Jose Luiz Goncalves Fortes Neto"
- ✅ Gera certificado automaticamente

**Também funciona com:**
- `ZENETOFG@HOTMAIL.COM` (maiúsculas)
- `ZenetoFG@Hotmail.com` (misto)

---

## ✅ Teste 2: Busca por TELEFONE (com DDD completo)

### Participante: João Gabriel Bandeira

**Digite no campo de busca:**
```
5586988407528
```

**Formato original no CSV:** `5586988407528`

**Resultado esperado:**
- ✅ Encontra o participante
- ✅ Nome já preenchido: "João Gabriel Bandeira"
- ✅ Gera certificado automaticamente

---

## ✅ Teste 3: Busca por TELEFONE (sem DDD)

### Participante: Rafhael Ponte

**Telefone no CSV:** `5586981442843`

**Digite no campo de busca (SEM o 55 e 86):**
```
981442843
```

**Resultado esperado:**
- ✅ Encontra o participante
- ✅ Nome já preenchido: "Rafhael Ponte"
- ✅ Gera certificado automaticamente

**Também funciona com:**
- `86981442843` (com DDD 86)
- `5586981442843` (com código do país e DDD)

---

## ✅ Teste 4: Busca por CÓDIGO

### Participante: Hugo Assunção

**Digite no campo de busca:**
```
etkt_t2O6O6XfUkB91kuzg0ig
```

**Resultado esperado:**
- ✅ Encontra o participante
- ✅ Nome já preenchido: "Hugo Assunção"
- ✅ Gera certificado automaticamente

**Também funciona com:**
- `ETKT_T2O6O6XFUKB91KUZG0IG` (maiúsculas)
- `EtKt_T2o6o6XfUkB91kUzG0Ig` (misto)

---

## ⚠️ Teste 5: Participante SEM nome preenchido

Para testar esta funcionalidade, você precisaria ter um registro no CSV onde o campo `nome participante` esteja vazio.

**Exemplo hipotético:**
```csv
etkt_abc123,,teste@email.com,BR,5586999999999,...
```

**Resultado esperado:**
1. ✅ Encontra o participante
2. ⚠️ Mostra mensagem: "Participante encontrado! Para gerar seu certificado, precisamos que você digite seu nome completo."
3. 📝 Mostra campo de input para preencher o nome
4. ✅ Após preencher, gera o certificado

---

## ❌ Teste 6: Busca que NÃO deve encontrar

### Email inexistente
```
naoencontrado@teste.com
```
**Resultado:** ❌ "Participante não encontrado"

### Telefone inexistente
```
86900000000
```
**Resultado:** ❌ "Participante não encontrado"

### Código inexistente
```
etkt_naoexiste
```
**Resultado:** ❌ "Participante não encontrado"

### Busca parcial (não funciona)
```
zenetofg
```
**Resultado:** ❌ "Participante não encontrado"
**Motivo:** Precisa ser email completo `zenetofg@hotmail.com`

---

## 🎯 Formatos de Telefone Aceitos

O sistema é flexível com telefones do DDD 85 (Teresina):

| Formato no CSV | Buscas que funcionam |
|----------------|---------------------|
| `5586999887766` | `5586999887766`, `86999887766`, `999887766` |
| `86999887766` | `86999887766`, `999887766`, `5586999887766` |
| `999887766` | `999887766`, `86999887766`, `5586999887766` |

**Regra geral:**
- ✅ Aceita com país (55)
- ✅ Aceita com DDD (86)
- ✅ Aceita sem DDD
- ❌ Não aceita parcial (ex: `99988` não encontra)

---

## 🔍 Como Verificar os Logs

Abra o Console do Navegador (F12) e veja as mensagens:

### Busca por email:
```
🔍 Buscando por EMAIL: zenetofg@hotmail.com
✅ EMAIL encontrado: zenetofg@hotmail.com
```

### Busca por telefone:
```
🔍 Buscando por TELEFONE: 981442843
✅ TELEFONE encontrado (com DDD): 5586981442843
```

### Busca por código:
```
🔍 Buscando por CÓDIGO: etkt_t2o6o6xfukb91kuzg0ig
✅ CÓDIGO encontrado: etkt_t2O6O6XfUkB91kuzg0ig
```

---

## 🚀 Fluxo Completo de Teste

1. Acesse: `http://localhost:3000`
2. Digite um dos exemplos acima
3. Clique em "Buscar Certificado"
4. Aguarde o processamento
5. Verifique:
   - Se tem nome: redireciona para página de sucesso
   - Se não tem nome: pede para preencher
6. Faça download do PDF gerado

---

## 💡 Dicas

- Use o console do navegador (F12) para debug
- Teste diferentes formatos de telefone
- Teste emails com maiúsculas/minúsculas
- Verifique se o nome está preenchido no CSV

---

## 📝 Dados Reais para Teste Rápido

| Tipo | Valor | Participante |
|------|-------|--------------|
| Email | `zenetofg@hotmail.com` | Jose Luiz Goncalves Fortes Neto |
| Email | `j.gabrielbds@gmail.com` | João Gabriel Bandeira |
| Email | `filipeffsobral@gmail.com` | Filipe Sobral |
| Telefone | `5586988407528` | João Gabriel Bandeira |
| Telefone | `5586981442843` | Rafhael Ponte |
| Código | `etkt_t2O6O6XfUkB91kuzg0ig` | Hugo Assunção |
| Código | `etkt_EozbEn3UV1RAM8EqPFKb` | Filipe Sobral |
