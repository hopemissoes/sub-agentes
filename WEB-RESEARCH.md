# 🌐 Web Research - Pesquisa Profunda Real

## 🎯 O Que É?

**Web Research é a funcionalidade MAIS IMPORTANTE do sistema!**

Quando habilitado, o agente de pesquisa **consulta 100+ sites REAIS** da internet antes de criar o artigo, similar ao "Deep Research" do Claude.

## 🚀 Como Funciona?

```
VOCÊ
  ↓
Fornece um TEMA
  ↓
╔═══════════════════════════════════════════════════════╗
║  AGENTE DE PESQUISA COM WEB RESEARCH                  ║
╚═══════════════════════════════════════════════════════╝
  ↓
┌───────────────────────────────────────────────────────┐
│ ETAPA 1: Gerar Queries de Pesquisa                   │
│                                                        │
│ Claude gera 15 queries diferentes sobre o tema:       │
│ • "Telemedicina planos saúde ANS"                    │
│ • "Regulamentação telemedicina 2025"                 │
│ • "Direitos telemedicina consumidor"                 │
│ • ... (12 mais)                                       │
└───────────────────────────────────────────────────────┘
  ↓
┌───────────────────────────────────────────────────────┐
│ ETAPA 2: Buscar na Web                                │
│                                                        │
│ Para cada query:                                       │
│ • Busca no Brave/Tavily                               │
│ • Pega top 10 resultados                              │
│ • Total: ~150 URLs encontradas                        │
└───────────────────────────────────────────────────────┘
  ↓
┌───────────────────────────────────────────────────────┐
│ ETAPA 3: Extrair Conteúdo                             │
│                                                        │
│ De até 100 páginas:                                   │
│ • Acessa cada URL                                     │
│ • Extrai HTML                                         │
│ • Converte para Markdown                              │
│ • Remove elementos desnecessários                     │
│ • Total: ~50.000-100.000 palavras extraídas          │
└───────────────────────────────────────────────────────┘
  ↓
┌───────────────────────────────────────────────────────┐
│ ETAPA 4: Sintetizar com IA                            │
│                                                        │
│ Claude analisa TODO o conteúdo:                       │
│ • Lê todas as 50-100 páginas                         │
│ • Identifica informações relevantes                   │
│ • Organiza por temas                                  │
│ • Cria pesquisa completa e estruturada               │
└───────────────────────────────────────────────────────┘
  ↓
📄 PESQUISA PROFUNDA COMPLETA
   Com informações de 100+ sites reais
```

## ⚙️ Configuração

### 1. Obter Chave da API

#### Opção A: Brave Search (RECOMENDADO - GRÁTIS)

1. Acesse: https://brave.com/search/api/
2. Crie uma conta (grátis)
3. Vá em "Get Started"
4. Clique em "Get API Key"
5. Copie sua chave

**Plano Grátis:**
- ✅ 2.000 consultas/mês
- ✅ 15 queries × 10 resultados = 150 buscas por artigo
- ✅ ~13 artigos/mês grátis

#### Opção B: Tavily AI (PAGO - Melhor para IA)

1. Acesse: https://tavily.com/
2. Crie uma conta
3. Vá em "API Keys"
4. Copie sua chave

**Custo:**
- 💰 $0.001 por busca
- 💰 ~$0.15 por artigo (150 buscas)
- ✅ Resultados otimizados para IA
- ✅ Conteúdo já pré-processado

### 2. Configurar o .env

```bash
# Copie o exemplo
cp .env.example .env

# Edite
nano .env
```

**Para usar Brave (Grátis):**

```env
# Habilitar web research
ENABLE_WEB_RESEARCH=true

# Usar Brave
WEB_SEARCH_PROVIDER=brave

# Sua chave do Brave
BRAVE_API_KEY=BSA_XXXXXXXXXXXXXXXXXXXXXXXX

# APIs de IA (escolha uma)
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-xxx
```

**Para usar Tavily (Pago):**

```env
# Habilitar web research
ENABLE_WEB_RESEARCH=true

# Usar Tavily
WEB_SEARCH_PROVIDER=tavily

# Sua chave do Tavily
TAVILY_API_KEY=tvly-XXXXXXXXXXXXXXXXXXXXXXXX

# APIs de IA (escolha uma)
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-xxx
```

### 3. Executar

```bash
npm run workflow "Cobertura de telemedicina em planos de saúde"
```

## 📊 O Que Esperar

### Console Output

```
═══════════════════════════════════════════════════════════
🚀 WORKFLOW DE CRIAÇÃO DE ARTIGO - PLANOS DE SAÚDE
═══════════════════════════════════════════════════════════
📋 Tema: Cobertura de telemedicina em planos de saúde
🔌 Provedor IA: OPENROUTER
🌐 Web Research: HABILITADO (BRAVE)
🤖 Modelos:
   • Pesquisa: anthropic/claude-opus-4-5
   • Escrita: anthropic/claude-sonnet-4-5
   • Revisão: anthropic/claude-opus-4-5
   • Schemas: anthropic/claude-haiku-4
═══════════════════════════════════════════════════════════

📚 ETAPA 1/4: PESQUISA PROFUNDA
───────────────────────────────────────────────────────────
[Agente de Pesquisa] 🌐 Modo: PESQUISA WEB PROFUNDA
[Agente de Pesquisa] Provider: BRAVE

═══════════════════════════════════════════════════════════
🔬 INICIANDO PESQUISA PROFUNDA
═══════════════════════════════════════════════════════════
📋 Tema: Cobertura de telemedicina em planos de saúde

ETAPA 1: Gerando queries de pesquisa...
✓ 15 queries geradas

ETAPA 2: Buscando na web...
🔎 Realizando 15 buscas...

  🔍 Buscando: "telemedicina planos saúde ANS"
  ✓ Encontrados 10 resultados
  🔍 Buscando: "regulamentação telemedicina 2025"
  ✓ Encontrados 10 resultados
  ...

✓ Total de 142 resultados únicos encontrados

ETAPA 3: Extraindo conteúdo das páginas...
📚 Extraindo conteúdo de até 100 páginas...

  Lote 1/20:
    📄 Extraindo: https://www.ans.gov.br/...
    ✓ Extraído: 1,245 palavras
    📄 Extraindo: https://www.saude.gov.br/...
    ✓ Extraído: 982 palavras
    ...

✓ Conteúdo extraído de 87 páginas com sucesso

ETAPA 4: Sintetizando informações...
✓ Síntese completa

═══════════════════════════════════════════════════════════
✅ PESQUISA PROFUNDA CONCLUÍDA
═══════════════════════════════════════════════════════════
📊 Estatísticas:
   • Queries executadas: 15
   • URLs encontradas: 142
   • Páginas processadas: 87
   • Palavras extraídas: 72,543
═══════════════════════════════════════════════════════════

[Agente de Pesquisa] ✓ Pesquisa web profunda concluída
  - 8 pontos-chave identificados
  - 102 fontes reais consultadas
  - 142 URLs analisadas
  - 87 páginas processadas

✓ Pesquisa salva em: 1-research.json
```

### Tempo de Execução

- **Sem Web Research:** 1-2 minutos
- **Com Web Research:** 5-10 minutos

O tempo extra vale a pena! Informações REAIS e ATUALIZADAS.

### Arquivos Gerados

```
output/article-XXXX/
├── 1-research.json          ← Pesquisa com fontes reais
│   {
│     "topic": "...",
│     "research": "Pesquisa de 87 sites...",
│     "sources": [
│       "ANS - Regulamentação... - https://ans.gov.br/...",
│       "Portal Saúde - ... - https://saude.gov.br/...",
│       ... (102 fontes)
│     ],
│     "keyPoints": [...]
│   }
├── 2-article.html           ← Artigo baseado em dados reais
├── 3-review.json
├── 4-schemas.json
└── article-final.html       ← Artigo final completo
```

## 💰 Custos

### Com Brave (Grátis)

| Item | Quantidade | Custo |
|------|-----------|-------|
| Buscas web | 150 | $0.00 (grátis) |
| Tokens IA | ~60.000 | $0.20-0.40 |
| **TOTAL** | - | **$0.20-0.40** |

### Com Tavily (Pago)

| Item | Quantidade | Custo |
|------|-----------|-------|
| Buscas web | 150 | $0.15 |
| Tokens IA | ~60.000 | $0.20-0.40 |
| **TOTAL** | - | **$0.35-0.55** |

## 🔍 Comparação

### SEM Web Research

```
VOCÊ → Claude → Artigo

Base: Conhecimento do Claude (até jan/2025)
Tempo: 1-2 min
Fontes: Conhecimento treinado
Atualização: Limitada
```

**Bom para:**
- ✅ Temas gerais
- ✅ Conceitos estabelecidos
- ✅ Rapidez

**Limitações:**
- ❌ Sem dados de 2025
- ❌ Sem preços atuais
- ❌ Sem notícias recentes

### COM Web Research

```
VOCÊ → 15 Queries → 150 URLs → 100 Páginas → Claude → Artigo

Base: 100+ sites REAIS
Tempo: 5-10 min
Fontes: URLs reais consultadas
Atualização: Tempo real
```

**Bom para:**
- ✅ Tudo do anterior, MAIS:
- ✅ Dados atualizados de 2025
- ✅ Preços e tabelas recentes
- ✅ Notícias e mudanças
- ✅ Análise de múltiplas fontes
- ✅ Informações específicas do Brasil

**Limitações:**
- ⏱️ Mais lento (mas vale a pena!)
- 💰 Pequeno custo adicional

## 🎯 Quando Usar Cada Modo?

### Use SEM Web Research quando:

- Tema muito geral (ex: "O que é plano de saúde")
- Conceitos básicos e estabelecidos
- Quer velocidade máxima
- Testar o sistema

### Use COM Web Research quando:

- **Quer a melhor qualidade possível** ← RECOMENDADO
- Precisa de dados atualizados
- Temas específicos ou técnicos
- Comparações e análises detalhadas
- Informações recentes (2024-2025)
- Artigos para publicação real

## ⚙️ Configurações Avançadas

### Ajustar Profundidade

Edite `src/agents/ResearchAgent.ts:79-90`:

```typescript
const deepResearch = new DeepResearchService({
  // ... outras configs
  numberOfQueries: 15,        // Aumentar para mais diversidade
  resultsPerQuery: 10,        // Aumentar para mais URLs
  maxUrlsToExtract: 100       // Aumentar para processar mais páginas
});
```

**Exemplos:**

**Pesquisa SUPER Profunda:**
```typescript
numberOfQueries: 25,        // 25 queries
resultsPerQuery: 15,        // 15 resultados cada = 375 URLs
maxUrlsToExtract: 200       // Processa até 200 páginas
```

**Pesquisa Rápida:**
```typescript
numberOfQueries: 8,         // 8 queries
resultsPerQuery: 8,         // 8 resultados = 64 URLs
maxUrlsToExtract: 30        // Processa até 30 páginas
```

## 🐛 Solução de Problemas

### Erro: "Search provider ou API key não configurados"

**Causa:** Web research habilitado mas sem chave da API

**Solução:**
```env
# No .env
ENABLE_WEB_RESEARCH=true
WEB_SEARCH_PROVIDER=brave
BRAVE_API_KEY=sua_chave_aqui  # ← Não esqueça!
```

### Erro: "Rate limit exceeded"

**Causa:** Muitas requisições em pouco tempo

**Solução:**
1. Brave grátis: 2.000/mês - aguarde reset mensal
2. Considere Tavily (sem rate limit)
3. Reduza `numberOfQueries` no código

### Muitas páginas com timeout

**Causa:** Sites lentos ou bloqueando bot

**Solução:**
- Aumentar timeout em `ContentExtractor.ts:11`
- Normal perder 10-20% das URLs
- O sistema continua com as que funcionaram

### Pesquisa com poucas fontes

**Causa:** Tema muito específico ou queries inadequadas

**Solução:**
1. Verifique queries geradas em `1-research.json`
2. Ajuste prompt de geração de queries
3. Teste queries manualmente no Google

## 📈 Métricas Esperadas

**Bom resultado:**
- ✅ 80-150 URLs encontradas
- ✅ 50-100 páginas processadas
- ✅ 40.000-80.000 palavras extraídas
- ✅ 8-15 pontos-chave

**Resultado excelente:**
- ⭐ 150+ URLs encontradas
- ⭐ 80-150 páginas processadas
- ⭐ 80.000+ palavras extraídas
- ⭐ 12-20 pontos-chave

## 🎓 Dicas

1. **Temas específicos funcionam melhor**
   - ❌ "Planos de saúde"
   - ✅ "Cobertura de telemedicina em planos individuais ANS 2025"

2. **Deixe rodar até o final**
   - Processar 100 páginas leva tempo
   - Cada página = mais qualidade

3. **Use Brave para começar**
   - Grátis
   - Ótimos resultados
   - Só mude se precisar de mais

4. **Monitore os custos**
   - Brave: gratuito (2k/mês)
   - IA: principal custo (~$0.30/artigo)

5. **Revise o arquivo `1-research.json`**
   - Veja quais sites foram consultados
   - Confirme qualidade das fontes
   - Ajuste queries se necessário

## 🚀 Exemplo Completo de Uso

```bash
# 1. Configure o .env
cat > .env << EOF
# IA
API_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-xxx

# Web Research (IMPORTANTE!)
ENABLE_WEB_RESEARCH=true
WEB_SEARCH_PROVIDER=brave
BRAVE_API_KEY=BSA-xxx

# Modelos
MODEL_RESEARCH=anthropic/claude-opus-4-5
MODEL_WRITER=anthropic/claude-sonnet-4-5
MODEL_REVIEWER=anthropic/claude-opus-4-5
MODEL_SCHEMA=anthropic/claude-haiku-4
EOF

# 2. Instale dependências
npm install

# 3. Compile
npm run build

# 4. Execute!
npm run workflow "Carência para internação em planos de saúde empresariais"

# 5. Aguarde 5-10 minutos

# 6. Veja os resultados em output/
```

---

**Com Web Research, seus artigos terão:**
- ✅ Informações REAIS de 100+ sites
- ✅ Dados ATUALIZADOS de 2025
- ✅ Fontes VERIFICÁVEIS (URLs reais)
- ✅ Qualidade PROFISSIONAL

**Perfeito para seu caso de planos de saúde!** 🏥
