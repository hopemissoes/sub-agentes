# 🔬 Guia de Modelos para Pesquisa Profunda

Este documento lista **todos os modelos disponíveis no OpenRouter** que podem fazer pesquisa web REAL.

---

## 🌐 MODELOS COM PESQUISA WEB NATIVA

### **1. PERPLEXITY (Recomendados para Pesquisa)**

#### **Perplexity Sonar Huge** ⭐⭐⭐⭐⭐
```env
MODEL_RESEARCH=perplexity/llama-3.1-sonar-huge-128k-online
```
- **Contexto:** 128k tokens
- **Pesquisa:** Muito profunda (100+ fontes)
- **Custo:** ~$5/milhão de tokens input (~$0.01-0.02 por pesquisa)
- **Quando usar:** Pesquisa MUITO profunda e detalhada
- **Melhor para:** Artigos complexos, análises técnicas

#### **Perplexity Sonar Large** ⭐⭐⭐⭐
```env
MODEL_RESEARCH=perplexity/llama-3.1-sonar-large-128k-online
```
- **Contexto:** 128k tokens
- **Pesquisa:** Profunda (50+ fontes)
- **Custo:** ~$3/milhão de tokens input (~$0.006-0.01 por pesquisa)
- **Quando usar:** Pesquisa profunda com custo menor
- **Melhor para:** Artigos padrão, bom custo-benefício

#### **Perplexity Sonar (Base)** ⭐⭐⭐
```env
MODEL_RESEARCH=perplexity/llama-3.1-sonar-128k-online
```
- **Contexto:** 128k tokens
- **Pesquisa:** Moderada (30+ fontes)
- **Custo:** ~$1/milhão de tokens input (~$0.002-0.005 por pesquisa)
- **Quando usar:** Pesquisa básica, custo muito baixo
- **Melhor para:** Testes, artigos simples

---

### **2. DEEPSEEK (Com busca web)**

#### **DeepSeek R1** ⭐⭐⭐⭐
```env
MODEL_RESEARCH=deepseek/deepseek-r1
```
- **Contexto:** 64k tokens
- **Pesquisa:** Profunda com raciocínio
- **Custo:** ~$0.55/milhão de tokens (~$0.001-0.003 por pesquisa)
- **Quando usar:** Análise lógica + pesquisa
- **Melhor para:** Pesquisa com raciocínio complexo
- **MUITO BARATO!**

---

### **3. GOOGLE GEMINI (Com busca Google integrada)**

#### **Gemini 2.0 Flash (Experimental)** ⭐⭐⭐⭐
```env
MODEL_RESEARCH=google/gemini-2.0-flash-exp:free
```
- **Contexto:** 1M tokens
- **Pesquisa:** Google Search integrado
- **Custo:** **GRÁTIS** (rate limited)
- **Quando usar:** Testes, prototipagem
- **Melhor para:** Experimentação sem custo

#### **Gemini 1.5 Pro** ⭐⭐⭐⭐
```env
MODEL_RESEARCH=google/gemini-pro-1.5
```
- **Contexto:** 2M tokens
- **Pesquisa:** Google Search nativo
- **Custo:** ~$1.25/milhão de tokens
- **Quando usar:** Pesquisa com contexto MUITO grande
- **Melhor para:** Análise de muitos documentos + pesquisa web

---

## 🤖 MODELOS SEM PESQUISA WEB (Usam conhecimento base)

### **CLAUDE (Anthropic)**

```env
# Claude Opus 4.5 - Mais inteligente (sem web)
MODEL_RESEARCH=anthropic/claude-opus-4.5

# Claude Sonnet 4.5 - Equilibrado (sem web)
MODEL_RESEARCH=anthropic/claude-sonnet-4-5

# Claude Haiku 4 - Rápido e barato (sem web)
MODEL_RESEARCH=anthropic/claude-haiku-4
```

**IMPORTANTE:** Claude não tem pesquisa web! Usa apenas conhecimento de treinamento (até Jan 2025).

---

## 📊 COMPARAÇÃO RÁPIDA

| Modelo | Pesquisa Web | Custo/Pesquisa | Profundidade | Velocidade |
|--------|--------------|----------------|--------------|------------|
| **Perplexity Huge** | ✅ Sim | $0.01-0.02 | ⭐⭐⭐⭐⭐ | Moderada |
| **Perplexity Large** | ✅ Sim | $0.006-0.01 | ⭐⭐⭐⭐ | Rápida |
| **DeepSeek R1** | ✅ Sim | $0.001-0.003 | ⭐⭐⭐⭐ | Lenta |
| **Gemini Flash (Free)** | ✅ Sim | **GRÁTIS** | ⭐⭐⭐ | Rápida |
| **Gemini Pro 1.5** | ✅ Sim | $0.005-0.015 | ⭐⭐⭐⭐ | Moderada |
| Claude Opus | ❌ Não | $0.15-0.30 | ⭐⭐⭐ | Lenta |

---

## 💡 RECOMENDAÇÕES

### **Para MÁXIMA profundidade:**
```env
MODEL_RESEARCH=perplexity/llama-3.1-sonar-huge-128k-online
```

### **Para MELHOR custo-benefício:**
```env
MODEL_RESEARCH=perplexity/llama-3.1-sonar-large-128k-online
```

### **Para ECONOMIZAR (quase grátis):**
```env
MODEL_RESEARCH=deepseek/deepseek-r1
```

### **Para TESTAR grátis:**
```env
MODEL_RESEARCH=google/gemini-2.0-flash-exp:free
```

---

## 🔄 COMO TESTAR DIFERENTES MODELOS

1. **Edite o `.env`:**
   ```env
   MODEL_RESEARCH=perplexity/llama-3.1-sonar-huge-128k-online
   ```

2. **Execute:**
   ```bash
   npm run workflow "plano hapvida fortaleza"
   ```

3. **Compare os resultados**

4. **Escolha o melhor para seu caso!**

---

## ⚙️ CONFIGURAÇÃO RECOMENDADA

```env
# PESQUISA: Use modelo com pesquisa web nativa
MODEL_RESEARCH=perplexity/llama-3.1-sonar-huge-128k-online

# ESCRITA: Claude é excelente para escrever
MODEL_WRITER=anthropic/claude-sonnet-4-5

# REVISÃO: Claude para análise crítica
MODEL_REVIEWER=anthropic/claude-sonnet-4-5

# SCHEMA: Claude Haiku (rápido e barato)
MODEL_SCHEMA=anthropic/claude-haiku-4
```

---

## 📌 DICA PRO

Você pode usar **modelos diferentes** para cada teste:

```bash
# Teste 1: Perplexity Huge (mais caro, mais profundo)
# Edite .env: MODEL_RESEARCH=perplexity/llama-3.1-sonar-huge-128k-online
npm run workflow "plano hapvida fortaleza"

# Teste 2: DeepSeek R1 (barato, bom raciocínio)
# Edite .env: MODEL_RESEARCH=deepseek/deepseek-r1
npm run workflow "plano hapvida fortaleza"

# Compare os resultados e escolha o melhor!
```

---

**Agora você tem total liberdade para escolher o modelo ideal! 🚀**
