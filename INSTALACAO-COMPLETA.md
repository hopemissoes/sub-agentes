# 🚀 Guia Completo de Instalação - Do Zero ao Funcionamento

## 📋 Pré-requisitos

### 1. Node.js (Obrigatório)

**O que é:** Ambiente que executa código JavaScript/TypeScript no servidor.

**Como instalar:**

**Windows:**
1. Baixe em: https://nodejs.org/
2. Escolha a versão LTS (recomendada)
3. Execute o instalador
4. Aceite as opções padrão
5. Teste no CMD/PowerShell:
```bash
node --version
npm --version
```

**Mac:**
```bash
# Com Homebrew
brew install node

# Ou baixe em https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Chave da API Anthropic (Obrigatório)

**Como obter:**

1. Acesse: https://console.anthropic.com/
2. Faça login ou crie uma conta
3. Vá em "API Keys"
4. Clique em "Create Key"
5. Copie a chave (começa com `sk-ant-...`)
6. **GUARDE BEM** - ela só aparece uma vez!

**Preço (importante saber):**
- Claude Sonnet: ~$3 por milhão de tokens
- 1 artigo completo ≈ 50.000-100.000 tokens
- Custo estimado: $0.15 - $0.30 por artigo

## 📦 Instalação do Sistema

### Passo 1: Baixar o Projeto

Se você ainda não tem o projeto localmente:

```bash
# Clone o repositório
git clone <url-do-seu-repositorio>
cd sub-agentes
```

Ou se já está na pasta (como agora):
```bash
cd /home/user/sub-agentes
```

### Passo 2: Instalar Dependências

```bash
npm install
```

**O que isso faz:**
- Baixa todas as bibliotecas necessárias
- Instala o SDK da Anthropic
- Configura o TypeScript
- Cria a pasta `node_modules/`

**Tempo estimado:** 1-3 minutos

### Passo 3: Configurar Variáveis de Ambiente

**Crie o arquivo `.env`:**

```bash
cp .env.example .env
```

**Edite o arquivo `.env`:**

No Windows use o Notepad:
```bash
notepad .env
```

No Mac/Linux:
```bash
nano .env
# ou
code .env  # se tiver VS Code
```

**Cole isso e SUBSTITUA pela sua chave real:**

```env
# IMPORTANTE: Substitua pela sua chave real da Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Modelo a usar (deixe como está)
MODEL=claude-sonnet-4-5-20250929

# Onde salvar os artigos gerados (pode mudar se quiser)
OUTPUT_DIR=./output
```

**Salve o arquivo!**

### Passo 4: Compilar o Código TypeScript

```bash
npm run build
```

**O que isso faz:**
- Converte código TypeScript → JavaScript
- Cria a pasta `dist/` com código compilado

**Se der erro:** Verifique se o Node.js está instalado corretamente.

## ✅ Testar se Está Funcionando

### Teste Rápido

```bash
npm run workflow "Teste de funcionamento"
```

**O que deve acontecer:**
1. Console mostra "WORKFLOW DE CRIAÇÃO DE ARTIGO"
2. Cada agente processa em sequência
3. Pasta `output/article-XXXX` é criada
4. Mensagem de sucesso aparece

**Se funcionar:** Parabéns! 🎉

**Se der erro comum:**
- "ANTHROPIC_API_KEY não encontrada" → Verifique o arquivo .env
- "Cannot find module" → Rode `npm install` novamente
- "API key invalid" → Verifique se a chave está correta

## 🎯 Primeiro Uso Real

```bash
npm run workflow "Cobertura de telemedicina em planos de saúde"
```

**Acompanhe no terminal:**
- ✓ ETAPA 1/4: PESQUISA PROFUNDA
- ✓ ETAPA 2/4: PRODUÇÃO DO ARTIGO HTML
- ✓ ETAPA 3/4: REVISÃO DO ARTIGO
- ✓ ETAPA 4/4: GERAÇÃO DE SCHEMAS

**Tempo estimado:** 2-5 minutos

**Resultado:**
Pasta `output/article-XXXXX/` com todos os arquivos

## 📂 Onde Ficam os Resultados

```
output/
└── article-2025-12-31T12-30-45-123Z/
    ├── 1-research.json              ← Pesquisa completa
    ├── 2-article.html               ← Artigo HTML original
    ├── 2-article-metadata.json      ← Info do artigo
    ├── 3-review.json                ← Análise da revisão
    ├── 3-article-revised.html       ← Artigo revisado (se houver)
    ├── 4-schemas.json               ← Schemas JSON-LD
    ├── article-final.html           ← 🎯 ARQUIVO PRINCIPAL
    └── workflow-context.json        ← Dados completos
```

**Arquivo mais importante:** `article-final.html`

Abra no navegador para ver o artigo completo!

## 🔧 Personalizar os Prompts

### Onde ficam os prompts?

```
src/config/prompts.ts
```

### Como editar?

**1. Abra o arquivo:**
```bash
code src/config/prompts.ts    # VS Code
# ou
nano src/config/prompts.ts    # Terminal
# ou
notepad src/config/prompts.ts # Windows
```

**2. Encontre o prompt que quer mudar:**

```typescript
export const RESEARCH_AGENT_CONFIG: AgentConfig = {
  name: 'Agente de Pesquisa',
  description: 'Realiza pesquisa profunda sobre temas de planos de saúde',
  systemPrompt: `
    ⬅️ AQUI ESTÁ O PROMPT!

    Você é um especialista em pesquisa sobre planos de saúde...

    Cole seu prompt específico aqui.
  `,
  maxTokens: 4096
};
```

**3. Substitua pelo SEU prompt**

**4. Salve o arquivo**

**5. Recompile:**
```bash
npm run build
```

**6. Teste:**
```bash
npm run workflow "Tema de teste"
```

### Há 4 prompts para personalizar:

1. **RESEARCH_AGENT_CONFIG** - Pesquisa profunda
2. **WRITER_AGENT_CONFIG** - Escrita do artigo
3. **REVIEWER_AGENT_CONFIG** - Revisão
4. **SCHEMA_AGENT_CONFIG** - Schemas SEO

Veja `CUSTOMIZACAO.md` para exemplos detalhados!

## ❓ Perguntas Frequentes

### 1. Preciso rodar `npm run build` sempre?

**Sim**, sempre que alterar arquivos `.ts` (TypeScript)

Workflow:
1. Edita `src/config/prompts.ts`
2. Roda `npm run build`
3. Roda `npm run workflow "tema"`

### 2. Posso usar em produção?

Sim! Mas configure:
- Variável de ambiente separada
- Controle de custos na Anthropic
- Rate limiting se necessário

### 3. Como saber quanto gastei?

Acesse: https://console.anthropic.com/settings/cost

### 4. Posso processar vários artigos de uma vez?

Sim, crie um script:

```typescript
// processar-lote.ts
import { ArticleWorkflow } from './src/workflow.js';

const temas = [
  'Tema 1',
  'Tema 2',
  'Tema 3'
];

const workflow = new ArticleWorkflow();

for (const tema of temas) {
  await workflow.execute(tema);
}
```

Execute:
```bash
npm run build
node dist/processar-lote.js
```

### 5. O sistema deleta arquivos antigos?

Não! Cada execução cria uma nova pasta com timestamp.

Você precisa limpar manualmente a pasta `output/` se quiser.

## 🆘 Resolução de Problemas

### Erro: "command not found: npm"

**Problema:** Node.js não instalado corretamente

**Solução:**
1. Reinstale o Node.js
2. Reinicie o terminal
3. Teste: `node --version`

### Erro: "ANTHROPIC_API_KEY não encontrada"

**Problema:** Arquivo `.env` não existe ou está mal configurado

**Solução:**
1. Verifique se `.env` existe na raiz do projeto
2. Abra e veja se tem `ANTHROPIC_API_KEY=sk-ant-...`
3. Sem espaços extras, sem aspas

### Erro: "Rate limit exceeded"

**Problema:** Muitas requisições em pouco tempo

**Solução:**
- Aguarde 1 minuto
- Verifique seu plano na Anthropic
- Considere upgrade se processar muito

### Erro: "Module not found"

**Problema:** Dependências não instaladas

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### JSON inválido na resposta

**Problema:** Agente não retornou JSON correto

**Solução:**
1. Verifique o prompt em `src/config/prompts.ts`
2. Seja mais explícito sobre o formato JSON
3. Aumente `maxTokens` se resposta foi cortada

## 📞 Suporte

Se nada funcionar:

1. Verifique versões:
```bash
node --version  # Deve ser 18+
npm --version
```

2. Veja os logs de erro completos

3. Teste a API diretamente:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5-20250929","max_tokens":100,"messages":[{"role":"user","content":"Olá"}]}'
```

---

Pronto para começar! 🚀
