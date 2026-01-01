# 🎓 Guia Para Iniciantes Absolutos - Passo a Passo

## 📍 PARTE 1: Baixar e Preparar o Projeto

### Passo 1: Onde Está o Projeto Agora?

O código que eu criei está no **GitHub** (ou seu servidor Git).

Você precisa **baixar** ele para seu computador.

### Passo 2: Abrir o Terminal

**Windows:**
1. Pressione `Windows + R`
2. Digite `cmd`
3. Pressione Enter
4. Uma janela preta abre (esse é o terminal)

**Mac:**
1. Pressione `Cmd + Espaço`
2. Digite `terminal`
3. Pressione Enter

**Linux:**
1. Pressione `Ctrl + Alt + T`

### Passo 3: Escolher Onde Baixar

Decida onde quer o projeto. Por exemplo:

```bash
# Windows - Vá para a pasta Documentos
cd C:\Users\SeuNome\Documents

# Mac/Linux - Vá para a pasta home
cd ~
```

**O que é `cd`?** = "Change Directory" = Ir para uma pasta

### Passo 4: Baixar o Projeto

**Opção A: Se tem Git instalado**

```bash
git clone <URL_DO_SEU_REPOSITORIO>
```

Substitua `<URL_DO_SEU_REPOSITORIO>` pela URL real, tipo:
```bash
git clone https://github.com/seu-usuario/sub-agentes
```

**Opção B: Se NÃO tem Git**

1. Vá no GitHub (navegador)
2. Clique em "Code" (botão verde)
3. Clique em "Download ZIP"
4. Extraia o ZIP na pasta que você quer
5. No terminal, vá até essa pasta

### Passo 5: Entrar na Pasta do Projeto

```bash
cd sub-agentes
```

**Explicando:**
- `cd` = comando para entrar em uma pasta
- `sub-agentes` = nome da pasta do projeto

**Como saber se deu certo?**

No terminal vai aparecer algo tipo:
```
C:\Users\SeuNome\Documents\sub-agentes>
```

Ou no Mac/Linux:
```
~/sub-agentes $
```

### Passo 6: Ver o Que Tem na Pasta

```bash
# Windows
dir

# Mac/Linux
ls
```

Você deve ver:
```
package.json
README.md
src/
tsconfig.json
...
```

**Se viu isso = está no lugar certo!** ✅

### Passo 7: Instalar as Dependências

Agora sim, rode:

```bash
npm install
```

**O que isso faz?**
- Lê o arquivo `package.json`
- Vê quais bibliotecas o projeto precisa
- Baixa TODAS automaticamente
- Salva na pasta `node_modules/`

**Tempo:** 1-3 minutos (depende da internet)

**Você vai ver:**
```
npm WARN deprecated ...
added 234 packages in 45s
```

**Se aparecer isso = funcionou!** ✅

### Passo 8: Configurar a Chave da API

**Criar o arquivo `.env`:**

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Editar o arquivo `.env`:**

```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

**Cole isso (com SUA chave real):**

```env
ANTHROPIC_API_KEY=sk-ant-api03-XXXXX
MODEL=claude-sonnet-4-5-20250929
OUTPUT_DIR=./output
```

**Salvar:**
- Notepad: Ctrl+S e fecha
- Nano: Ctrl+X, depois Y, depois Enter

### Passo 9: Compilar o Código

```bash
npm run build
```

**O que isso faz?**
- Transforma TypeScript (.ts) em JavaScript (.js)
- Cria a pasta `dist/`

**Você vai ver:**
```
> build
> tsc

(sem erros = sucesso!)
```

### Passo 10: TESTAR!

```bash
npm run workflow "Teste de funcionamento"
```

**O que vai acontecer:**
1. Terminal vai mostrar progresso
2. Cada agente vai processar
3. Pasta `output/` vai ser criada
4. Mensagem de sucesso aparece

**Se funcionou = PARABÉNS!** 🎉

---

## 🤖 PARTE 2: Como os Agentes Funcionam Juntos

Vou explicar o fluxo completo:

### Estrutura Visual

```
VOCÊ
  ↓
  Dá um TEMA
  ↓
┌─────────────────────────────────────────┐
│  WORKFLOW (Orquestrador)                │
│  Coordena tudo                          │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  AGENTE 1: Pesquisa                     │
│                                          │
│  ENTRADA: "Telemedicina em planos"      │
│  PROCESSO: Claude pesquisa/sintetiza    │
│  SAÍDA: {                               │
│    topic: "...",                        │
│    research: "texto completo...",       │
│    sources: [...],                      │
│    keyPoints: [...]                     │
│  }                                      │
└─────────────────────────────────────────┘
  ↓ (passa a pesquisa para o próximo)
┌─────────────────────────────────────────┐
│  AGENTE 2: Escrita                      │
│                                          │
│  ENTRADA: Recebe a pesquisa do Agente 1 │
│  PROCESSO: Cria artigo HTML             │
│  SAÍDA: {                               │
│    html: "<article>...</article>",      │
│    title: "...",                        │
│    metadata: {...}                      │
│  }                                      │
└─────────────────────────────────────────┘
  ↓ (passa o artigo para o próximo)
┌─────────────────────────────────────────┐
│  AGENTE 3: Revisão                      │
│                                          │
│  ENTRADA: Recebe o artigo do Agente 2   │
│  PROCESSO: Revisa e melhora             │
│  SAÍDA: {                               │
│    approved: true/false,                │
│    suggestions: [...],                  │
│    revisedHtml: "..."                   │
│  }                                      │
└─────────────────────────────────────────┘
  ↓ (passa artigo revisado para o próximo)
┌─────────────────────────────────────────┐
│  AGENTE 4: Schemas                      │
│                                          │
│  ENTRADA: Recebe artigo final           │
│  PROCESSO: Cria schemas SEO             │
│  SAÍDA: {                               │
│    schemas: [{...}, {...}],             │
│    schemaTypes: ["Article", "FAQ"]      │
│  }                                      │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│  WORKFLOW                               │
│  Junta tudo e salva arquivos            │
└─────────────────────────────────────────┘
  ↓
📁 PASTA output/ COM TODOS OS ARQUIVOS
```

### Exemplo Prático com Tema Real

**Você executa:**
```bash
npm run workflow "Cobertura de telemedicina"
```

**O que acontece por dentro:**

#### Momento 1: Agente de Pesquisa
```javascript
// Workflow chama
const researchAgent = new ResearchAgent(apiKey);
const research = await researchAgent.execute("Cobertura de telemedicina");

// Agente 1 retorna
{
  topic: "Cobertura de telemedicina",
  research: "A telemedicina foi regulamentada pela ANS através da RN 453...",
  sources: ["RN ANS 453", "Lei 13.989/2020"],
  keyPoints: [
    "Obrigatoriedade de cobertura",
    "Modalidades permitidas",
    "Direitos do beneficiário"
  ]
}
```

#### Momento 2: Agente de Escrita
```javascript
// Workflow passa a pesquisa do Agente 1
const writerAgent = new WriterAgent(apiKey);
const article = await writerAgent.execute(research);

// Agente 2 retorna
{
  html: `
    <article>
      <h1>Cobertura de Telemedicina nos Planos de Saúde</h1>
      <section>
        <h2>O que diz a ANS</h2>
        <p>Segundo a RN 453...</p>
      </section>
      ...
    </article>
  `,
  title: "Cobertura de Telemedicina nos Planos de Saúde",
  metadata: {
    wordCount: 1500,
    createdAt: "2025-01-01T10:00:00Z"
  }
}
```

#### Momento 3: Agente de Revisão
```javascript
// Workflow passa o artigo do Agente 2
const reviewerAgent = new ReviewerAgent(apiKey);
const review = await reviewerAgent.execute(article);

// Agente 3 retorna
{
  approved: true,
  suggestions: [
    "Adicionar exemplo prático de uso",
    "Melhorar CTA no final"
  ],
  revisedHtml: "<article>...</article>", // versão melhorada
  comments: "Artigo bem estruturado, aprovado com pequenas sugestões"
}
```

#### Momento 4: Agente de Schemas
```javascript
// Workflow passa o artigo revisado
const schemaAgent = new SchemaAgent(apiKey);
const schemas = await schemaAgent.execute(revisedArticle);

// Agente 4 retorna
{
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Cobertura de Telemedicina...",
      ...
    },
    {
      "@type": "FAQPage",
      ...
    }
  ],
  schemaTypes: ["Article", "FAQPage"]
}
```

#### Momento 5: Salvamento Final
```javascript
// Workflow junta tudo e salva
await saveFile('1-research.json', research);
await saveFile('2-article.html', article.html);
await saveFile('3-review.json', review);
await saveFile('4-schemas.json', schemas);
await saveFile('article-final.html', articleWithSchemas);
```

### Como os Agentes se Comunicam

**Código real no `src/workflow.ts`:**

```typescript
// ETAPA 1: Pesquisa
const researchAgent = new ResearchAgent(apiKey);
const researchResult = await researchAgent.execute(topic);
context.research = researchResult.data; // ← Salva no contexto

// ETAPA 2: Escrita (usa resultado da etapa 1)
const writerAgent = new WriterAgent(apiKey);
const articleResult = await writerAgent.execute(context.research); // ← Usa contexto
context.article = articleResult.data; // ← Salva no contexto

// ETAPA 3: Revisão (usa resultado da etapa 2)
const reviewerAgent = new ReviewerAgent(apiKey);
const reviewResult = await reviewerAgent.execute(context.article); // ← Usa contexto
context.review = reviewResult.data;

// ETAPA 4: Schemas (usa resultado da etapa 3)
const schemaAgent = new SchemaAgent(apiKey);
const schemaResult = await schemaAgent.execute(finalArticle); // ← Usa contexto
context.schemas = schemaResult.data;
```

### Resumo: Dependências Entre Agentes

```
Agente 1 (Pesquisa)
   ↓ precisa de: TEMA (você fornece)
   ↓ produz: PESQUISA
   ↓
Agente 2 (Escrita)
   ↓ precisa de: PESQUISA (do Agente 1)
   ↓ produz: ARTIGO HTML
   ↓
Agente 3 (Revisão)
   ↓ precisa de: ARTIGO (do Agente 2)
   ↓ produz: REVISÃO + ARTIGO MELHORADO
   ↓
Agente 4 (Schemas)
   ↓ precisa de: ARTIGO FINAL (do Agente 3)
   ↓ produz: SCHEMAS JSON-LD
   ↓
Arquivos Finais Salvos
```

**Por isso eles rodam em SEQUÊNCIA, não em paralelo!**

Cada um depende do resultado do anterior.

---

## 🔧 PARTE 3: OpenRouter - Como Integrar

Você mencionou que tem **OpenRouter**! Ótimo, é ainda melhor!

### Por Que OpenRouter é Melhor?

1. **Vários modelos disponíveis**
2. **Preços menores** em muitos casos
3. **Modelos especializados** para diferentes tarefas

### Como Integrar OpenRouter

Vou modificar o sistema para aceitar OpenRouter.

**O que muda:**

**Antes (só Anthropic):**
```typescript
const client = new Anthropic({ apiKey });
```

**Depois (OpenRouter):**
```typescript
// Usa a API compatível com OpenAI (OpenRouter suporta)
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});
```

### Estratégia: Modelo Diferente por Agente

Podemos usar modelos diferentes para cada agente:

```typescript
// Agente 1 (Pesquisa) - Modelo forte para research
MODEL_RESEARCH=anthropic/claude-opus-4-5

// Agente 2 (Escrita) - Modelo equilibrado
MODEL_WRITER=anthropic/claude-sonnet-4-5

// Agente 3 (Revisão) - Modelo forte
MODEL_REVIEWER=anthropic/claude-opus-4-5

// Agente 4 (Schemas) - Modelo mais barato (tarefa técnica)
MODEL_SCHEMA=anthropic/claude-haiku-4
```

**Vantagem:** Economiza dinheiro usando modelo caro só onde precisa!

### Quer que Eu Implemente?

Posso modificar o sistema agora para:

1. ✅ Suportar OpenRouter
2. ✅ Permitir modelo diferente por agente
3. ✅ Adicionar web research real (via API)
4. ✅ Usar modelos especializados para cada tarefa

**Você quer que eu faça isso?**

---

## 📝 Checklist de Instalação

Marque conforme for fazendo:

- [ ] Node.js instalado (`node --version` funciona)
- [ ] Repositório baixado (tem a pasta `sub-agentes`)
- [ ] Terminal aberto na pasta correta (`cd sub-agentes`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Código compilado (`npm run build`)
- [ ] Teste executado (`npm run workflow "teste"`)

---

## 🆘 Erros Comuns

### "npm não é reconhecido"
**Problema:** Node.js não instalado
**Solução:** Instale Node.js e reinicie o terminal

### "Cannot find module"
**Problema:** npm install não foi executado
**Solução:** Rode `npm install` na pasta do projeto

### "cd: sub-agentes: No such file or directory"
**Problema:** Você não está na pasta onde baixou o projeto
**Solução:** Use `cd` para ir até a pasta correta

### "Permission denied"
**Mac/Linux:** Adicione `sudo` antes do comando
```bash
sudo npm install
```

---

Alguma dúvida específica? Me fala em qual passo você está!
