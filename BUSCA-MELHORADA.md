# 🔍 Sistema de Busca Melhorado

## Como funciona agora

A busca foi completamente refeita para ser **mais inteligente e precisa**:

### 1. **Identificação Automática do Tipo de Busca**

O sistema identifica automaticamente o que você está buscando:

#### 📧 **EMAIL**
- Detecta se contém `@`
- Busca exata (ignora maiúsculas/minúsculas)
- Remove acentos para comparação
- **Exemplo**: `joao@gmail.com` encontra `João@Gmail.com`

#### 📱 **TELEFONE**
- Detecta se é apenas números (10 ou 11 dígitos)
- Aceita com ou sem DDD 85
- Busca exata por números

**Exemplos válidos:**
- `85999887766` (11 dígitos com DDD)
- `999887766` (9 dígitos sem DDD)
- `99988776` (8 dígitos sem DDD, sem o 9)

**Como funciona:**
- Se você digitar `85999887766`, procura exato
- Se você digitar `999887766`, procura exato OU com `85` na frente
- Se cadastrado tiver `85999887766` e você buscar `999887766`, **encontra**
- Se cadastrado tiver `999887766` e você buscar `85999887766`, **encontra**

#### 🎫 **CÓDIGO**
- Qualquer texto que não seja email nem telefone
- Busca exata (ignora maiúsculas/minúsculas)
- Remove acentos para comparação
- **Exemplo**: `etkt_abc123` encontra `ETKT_ABC123`

---

### 2. **Verificação de Nome do Participante**

Depois de encontrar o participante:

1. ✅ **Nome preenchido**: Gera o certificado automaticamente
2. ⚠️ **Nome vazio**: Mostra campo para você preencher antes de gerar

---

### 3. **Busca Exata (Não Aproximada)**

- ❌ Não aceita busca parcial
- ❌ Não aceita "parecido"
- ✅ Só encontra se for **exatamente igual**

**Exemplos:**
- ❌ Buscar `joao@` não encontra `joao@gmail.com`
- ❌ Buscar `999887` não encontra `85999887766`
- ✅ Buscar `joao@gmail.com` encontra `joao@gmail.com`
- ✅ Buscar `85999887766` encontra `85999887766`

---

## 🧪 Testando

### Teste 1: Busca por Email
```
Digite: lucas@exemplo.com
Resultado: Encontra se houver participante com esse email exato
```

### Teste 2: Busca por Telefone (com DDD)
```
Digite: 85999887766
Resultado: Encontra se houver esse número exato
```

### Teste 3: Busca por Telefone (sem DDD)
```
Digite: 999887766
Resultado: Encontra se houver 999887766 OU 85999887766
```

### Teste 4: Busca por Código
```
Digite: etkt_WUCopX8eSuanhenMJoZk
Resultado: Encontra se houver esse código exato
```

---

## 📋 Logs no Console

O sistema agora mostra logs detalhados:

```
🔍 Buscando por EMAIL: lucas@exemplo.com
✅ EMAIL encontrado: Lucas@Exemplo.com

🔍 Buscando por TELEFONE: 85999887766
✅ TELEFONE encontrado (exato): 85999887766

🔍 Buscando por CÓDIGO: etkt_abc123
✅ CÓDIGO encontrado: etkt_ABC123
```

Verifique o console do navegador (F12) para ver o que está acontecendo!

---

## ⚙️ Configuração Atual

- **Email**: Busca exata (case-insensitive, sem acentos)
- **Telefone**: Busca exata com flexibilidade no DDD 85
- **Código**: Busca exata (case-insensitive, sem acentos)
- **Nome**: Validado antes de gerar PDF

---

## 🐛 Problemas Comuns

### "Participante não encontrado"
- ✅ Verifique se digitou exatamente como está no CSV
- ✅ Para telefone, tente com e sem o DDD 85
- ✅ Para email, confira se não tem espaços

### "Nome não preenchido"
- ✅ Digite seu nome completo no campo que aparece
- ✅ O nome não estava cadastrado no sistema
- ✅ Após preencher, o PDF será gerado

---

## 🎯 Resumo

**ANTES:** Busca genérica e imprecisa
**AGORA:** 
- ✅ Identifica o tipo automaticamente
- ✅ Busca exata e precisa
- ✅ Valida nome antes de gerar PDF
- ✅ Logs detalhados para debug
- ✅ Flexibilidade no telefone (com/sem DDD)
