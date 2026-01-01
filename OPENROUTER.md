# 🔌 Guia de Uso com OpenRouter

## O Que é OpenRouter?

OpenRouter é uma API unificada que dá acesso a múltiplos modelos de IA (Claude, GPT-4, Gemini, etc.) através de uma única interface.

**Vantagens:**
- ✅ Acesso a vários modelos diferentes
- ✅ Preços competitivos
- ✅ Sem precisar de múltiplas contas
- ✅ Mesma API para todos os modelos

## 🚀 Configuração Rápida

### 1. Obter Chave da API

1. Acesse: https://openrouter.ai/
2. Faça login
3. Vá em "Keys" → "Create Key"
4. Copie sua chave (começa com `sk-or-...`)

### 2. Configurar o .env

```bash
# Copie o exemplo
cp .env.example .env

# Edite o .env
nano .env  # ou use seu editor preferido
```

**Configure assim:**

```env
# Escolha openrouter como provedor
API_PROVIDER=openrouter

# Cole sua chave do OpenRouter
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXX

# Modelos para cada agente (veja opções abaixo)
MODEL_RESEARCH=anthropic/claude-opus-4-5
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-opus-4-5
MODEL_SCHEMA=anthropic/claude-haiku-4

# Diretório de saída
OUTPUT_DIR=./output
```

### 3. Pronto!

```bash
npm run workflow "Seu tema aqui"
```

## 📊 Modelos Disponíveis no OpenRouter

### Claude (Anthropic)

| Modelo | ID no OpenRouter | Custo* | Melhor Para |
|--------|------------------|--------|-------------|
| **Claude Opus 4.5** | `anthropic/claude-opus-4-5` | $$$ | Pesquisa complexa, revisão crítica |
| **Claude Sonnet 4.5** | `anthropic/claude-sonnet-4-5` | $$ | Equilíbrio perfeito, escrita de artigos |
| **Claude Haiku 4** | `anthropic/claude-haiku-4` | $ | Tarefas técnicas, schemas |

### GPT (OpenAI)

| Modelo | ID no OpenRouter | Custo* | Melhor Para |
|--------|------------------|--------|-------------|
| **GPT-4 Turbo** | `openai/gpt-4-turbo` | $$$ | Análises complexas |
| **GPT-4** | `openai/gpt-4` | $$$$ | Máxima qualidade |
| **GPT-3.5 Turbo** | `openai/gpt-3.5-turbo` | $ | Tarefas simples |

### Outros Modelos

| Modelo | ID no OpenRouter | Custo* | Melhor Para |
|--------|------------------|--------|-------------|
| **Gemini Pro** | `google/gemini-pro` | $$ | Alternativa econômica |
| **Llama 3.1 70B** | `meta-llama/llama-3.1-70b-instruct` | $ | Open source, barato |
| **Mixtral 8x7B** | `mistralai/mixtral-8x7b-instruct` | $ | Bom custo-benefício |

*Legenda: $ (barato) | $$ (médio) | $$$ (caro) | $$$$ (muito caro)

## 🎯 Estratégias de Uso

### Estratégia 1: Máxima Qualidade

Use modelos fortes em todas as etapas:

```env
MODEL_RESEARCH=anthropic/claude-opus-4-5
MODEL_WRITER=anthropic/claude-opus-4-5
MODEL_REVIEWER=anthropic/claude-opus-4-5
MODEL_SCHEMA=anthropic/claude-sonnet-4-5
```

**Custo:** ~$0.40-0.60 por artigo
**Qualidade:** ⭐⭐⭐⭐⭐

### Estratégia 2: Equilíbrio (Recomendado)

Use modelos apropriados para cada tarefa:

```env
MODEL_RESEARCH=anthropic/claude-opus-4-5      # Forte para pesquisa
MODEL_WRITER=anthropic/claude-sonnet-4-5      # Equilibrado
MODEL_REVIEWER=anthropic/claude-opus-4-5      # Forte para revisão
MODEL_SCHEMA=anthropic/claude-haiku-4         # Barato, tarefa técnica
```

**Custo:** ~$0.25-0.35 por artigo
**Qualidade:** ⭐⭐⭐⭐

### Estratégia 3: Econômica

Use modelos mais baratos:

```env
MODEL_RESEARCH=anthropic/claude-sonnet-4-5
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-sonnet-4-5
MODEL_SCHEMA=anthropic/claude-haiku-4
```

**Custo:** ~$0.15-0.25 por artigo
**Qualidade:** ⭐⭐⭐⭐

### Estratégia 4: Mix de Modelos

Experimente diferentes AIs:

```env
MODEL_RESEARCH=openai/gpt-4-turbo            # GPT para pesquisa
MODEL_WRITER=anthropic/claude-sonnet-4-5     # Claude para escrita
MODEL_REVIEWER=anthropic/claude-opus-4-5     # Claude Opus para revisão
MODEL_SCHEMA=anthropic/claude-haiku-4        # Haiku para schemas
```

**Custo:** ~$0.30-0.45 por artigo
**Qualidade:** ⭐⭐⭐⭐ (varia)

## 💰 Calculadora de Custos

### Estimativa por Etapa (tokens médios)

| Etapa | Tokens Input | Tokens Output | Custo (Opus) | Custo (Sonnet) | Custo (Haiku) |
|-------|--------------|---------------|--------------|----------------|---------------|
| Pesquisa | 500 | 2,000 | $0.034 | $0.008 | $0.001 |
| Escrita | 3,000 | 6,000 | $0.135 | $0.030 | $0.005 |
| Revisão | 8,000 | 6,000 | $0.210 | $0.046 | $0.007 |
| Schemas | 8,000 | 1,500 | $0.069 | $0.015 | $0.002 |
| **TOTAL** | ~19,500 | ~15,500 | **$0.448** | **$0.099** | **$0.015** |

*Valores aproximados. Custos reais variam por uso.

### Estratégias por Budget

**$0.10-0.15 por artigo:** Use Sonnet + Haiku
**$0.20-0.30 por artigo:** Use Opus na pesquisa e revisão
**$0.40+ por artigo:** Use Opus em tudo

## 🔧 Exemplos de Configuração

### Para Blog Pessoal (Economia)

```env
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-xxx

MODEL_RESEARCH=anthropic/claude-haiku-4
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-haiku-4
MODEL_SCHEMA=anthropic/claude-haiku-4
```

### Para Empresa (Qualidade)

```env
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-xxx

MODEL_RESEARCH=anthropic/claude-opus-4-5
MODEL_WRITER=anthropic/claude-opus-4-5
MODEL_REVIEWER=anthropic/claude-opus-4-5
MODEL_SCHEMA=anthropic/claude-sonnet-4-5
```

### Para Experimentação (Mix)

```env
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-xxx

MODEL_RESEARCH=openai/gpt-4-turbo
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=google/gemini-pro
MODEL_SCHEMA=meta-llama/llama-3.1-70b-instruct
```

## 📊 Comparação Anthropic vs OpenRouter

| Aspecto | Anthropic Direto | OpenRouter |
|---------|------------------|------------|
| **Modelos** | Apenas Claude | Claude + GPT + Gemini + outros |
| **Preço** | Fixo oficial | Pode ser similar ou menor |
| **Latência** | Baixa | Baixa (roteamento otimizado) |
| **Flexibilidade** | Apenas 1 modelo | Modelo diferente por agente |
| **Confiabilidade** | Alta (direto) | Alta (proxy confiável) |
| **Configuração** | Simples | Simples |

## 🛠️ Solução de Problemas

### Erro: "Invalid API key"

**Problema:** Chave incorreta ou expirada

**Solução:**
1. Verifique se copiou a chave completa
2. Confirme que começa com `sk-or-`
3. Gere uma nova chave em https://openrouter.ai/keys

### Erro: "Model not found"

**Problema:** Nome do modelo incorreto

**Solução:**
1. Veja modelos disponíveis: https://openrouter.ai/models
2. Use o ID exato (ex: `anthropic/claude-sonnet-4-5`)
3. Alguns modelos precisam de créditos

### Artigo com qualidade baixa

**Problema:** Modelo muito barato para a tarefa

**Solução:**
- Teste Sonnet ou Opus
- Use modelo forte na Escrita e Revisão
- Ajuste os prompts em `src/config/prompts.ts`

### Custo muito alto

**Problema:** Usando modelos caros demais

**Solução:**
- Schemas: use sempre Haiku (tarefa técnica simples)
- Escrita: Sonnet é suficiente
- Só use Opus onde realmente precisa

## 📈 Monitoramento de Custos

### Ver Gastos no OpenRouter

1. Acesse https://openrouter.ai/activity
2. Veja histórico de requisições
3. Monitore custo por modelo
4. Configure alertas de budget

### Dicas para Economizar

1. **Schemas sempre com Haiku** - é uma tarefa técnica que não precisa de modelo forte
2. **Teste Sonnet primeiro** - antes de pagar por Opus
3. **Ajuste prompts** - prompts melhores = menos tokens gastos
4. **Use cache** - se processar temas similares
5. **Monitore regularmente** - evite surpresas

## 🔄 Trocar Entre Anthropic e OpenRouter

É fácil alternar entre os dois:

### Usar Anthropic

```env
API_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
MODEL=claude-sonnet-4-5-20250929
```

### Usar OpenRouter

```env
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-xxx
MODEL=anthropic/claude-sonnet-4-5
```

Apenas mude `API_PROVIDER` e a respectiva chave!

## 🎓 Recomendações Finais

### Para Iniciantes

Comece com:
```env
API_PROVIDER=openrouter
MODEL_RESEARCH=anthropic/claude-sonnet-4-5
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-sonnet-4-5
MODEL_SCHEMA=anthropic/claude-haiku-4
```

**Por quê:** Simples, econômico, boa qualidade.

### Para Profissionais

Use:
```env
API_PROVIDER=openrouter
MODEL_RESEARCH=anthropic/claude-opus-4-5
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-opus-4-5
MODEL_SCHEMA=anthropic/claude-haiku-4
```

**Por quê:** Melhor qualidade onde importa, economiza onde pode.

### Para Experimentadores

Teste tudo:
- Semana 1: Apenas Claude
- Semana 2: Apenas GPT
- Semana 3: Mix de modelos
- Compare resultados e custos!

---

**Recursos:**
- OpenRouter: https://openrouter.ai/
- Modelos disponíveis: https://openrouter.ai/models
- Preços atualizados: https://openrouter.ai/models (aba "Pricing")
- Documentação: https://openrouter.ai/docs

**Suporte:**
- OpenRouter Discord: https://discord.gg/openrouter
- Documentação deste projeto: veja README.md
