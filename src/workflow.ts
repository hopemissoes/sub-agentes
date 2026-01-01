import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { ResearchAgent, WriterAgent, ReviewerAgent, SchemaAgent } from './agents/index.js';
import { WorkflowContext } from './types/index.js';

// Carrega variáveis de ambiente
dotenv.config();

type APIProvider = 'anthropic' | 'openrouter';

export class ArticleWorkflow {
  private apiKey: string;
  private provider: APIProvider;
  private models: {
    research: string;
    writer: string;
    reviewer: string;
    schema: string;
  };
  private outputDir: string;
  private webResearch: {
    enabled: boolean;
    provider?: 'brave' | 'tavily';
    apiKey?: string;
  };

  constructor() {
    // Determina o provedor
    const providerEnv = process.env.API_PROVIDER || 'anthropic';
    this.provider = providerEnv as APIProvider;

    // Pega a chave da API correta
    if (this.provider === 'anthropic') {
      this.apiKey = process.env.ANTHROPIC_API_KEY || '';
      if (!this.apiKey) {
        throw new Error('ANTHROPIC_API_KEY não encontrada no arquivo .env');
      }
    } else if (this.provider === 'openrouter') {
      this.apiKey = process.env.OPENROUTER_API_KEY || '';
      if (!this.apiKey) {
        throw new Error('OPENROUTER_API_KEY não encontrada no arquivo .env');
      }
    } else {
      throw new Error(`Provedor inválido: ${providerEnv}. Use 'anthropic' ou 'openrouter'`);
    }

    // Configura modelos por agente
    const defaultModel = process.env.MODEL || 'claude-sonnet-4-5-20250929';
    this.models = {
      research: process.env.MODEL_RESEARCH || defaultModel,
      writer: process.env.MODEL_WRITER || defaultModel,
      reviewer: process.env.MODEL_REVIEWER || defaultModel,
      schema: process.env.MODEL_SCHEMA || defaultModel
    };

    // Configura web research
    const webResearchEnabled = process.env.ENABLE_WEB_RESEARCH === 'true';
    const webSearchProvider = process.env.WEB_SEARCH_PROVIDER as 'brave' | 'tavily' | undefined;
    const webSearchApiKey = webSearchProvider === 'brave'
      ? process.env.BRAVE_API_KEY
      : webSearchProvider === 'tavily'
        ? process.env.TAVILY_API_KEY
        : undefined;

    this.webResearch = {
      enabled: webResearchEnabled && !!webSearchProvider && !!webSearchApiKey,
      provider: webSearchProvider,
      apiKey: webSearchApiKey
    };

    this.outputDir = process.env.OUTPUT_DIR || './output';
  }

  async execute(topic: string): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 WORKFLOW DE CRIAÇÃO DE ARTIGO - PLANOS DE SAÚDE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 Tema: ${topic}`);
    console.log(`🔌 Provedor IA: ${this.provider.toUpperCase()}`);
    console.log(`🌐 Web Research: ${this.webResearch.enabled ? `HABILITADO (${this.webResearch.provider?.toUpperCase()})` : 'DESABILITADO'}`);
    console.log(`🤖 Modelos:`);
    console.log(`   • Pesquisa: ${this.models.research}`);
    console.log(`   • Escrita: ${this.models.writer}`);
    console.log(`   • Revisão: ${this.models.reviewer}`);
    console.log(`   • Schemas: ${this.models.schema}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const context: WorkflowContext = { topic };
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFolder = path.join(this.outputDir, `article-${timestamp}`);

    try {
      // Cria o diretório de output
      await fs.mkdir(outputFolder, { recursive: true });

      // ETAPA 1: Pesquisa
      console.log('📚 ETAPA 1/4: PESQUISA PROFUNDA');
      console.log('───────────────────────────────────────────────────────────');
      const researchAgent = new ResearchAgent(
        this.apiKey,
        this.models.research,
        this.provider,
        this.webResearch.enabled,
        this.webResearch.provider,
        this.webResearch.apiKey
      );
      const researchResult = await researchAgent.execute(topic);

      if (!researchResult.success) {
        throw new Error(`Erro na pesquisa: ${researchResult.error}`);
      }

      context.research = researchResult.data;
      await this.saveJson(outputFolder, '1-research.json', context.research);
      console.log('✓ Pesquisa salva em: 1-research.json\n');

      // ETAPA 2: Escrita do Artigo
      console.log('✍️  ETAPA 2/4: PRODUÇÃO DO ARTIGO HTML');
      console.log('───────────────────────────────────────────────────────────');

      if (!context.research) {
        throw new Error('Pesquisa não disponível');
      }

      const writerAgent = new WriterAgent(this.apiKey, this.models.writer, this.provider);
      const articleResult = await writerAgent.execute(context.research);

      if (!articleResult.success) {
        throw new Error(`Erro na escrita: ${articleResult.error}`);
      }

      context.article = articleResult.data;
      if (!context.article) {
        throw new Error('Artigo não foi gerado');
      }

      await this.saveHtml(outputFolder, '2-article.html', context.article.html);
      await this.saveJson(outputFolder, '2-article-metadata.json', context.article);
      console.log('✓ Artigo salvo em: 2-article.html\n');

      // ETAPA 3: Revisão
      console.log('🔍 ETAPA 3/4: REVISÃO DO ARTIGO');
      console.log('───────────────────────────────────────────────────────────');

      const reviewerAgent = new ReviewerAgent(this.apiKey, this.models.reviewer, this.provider);
      const reviewResult = await reviewerAgent.execute(context.article);

      if (!reviewResult.success) {
        throw new Error(`Erro na revisão: ${reviewResult.error}`);
      }

      context.review = reviewResult.data;
      if (!context.review) {
        throw new Error('Revisão não foi gerada');
      }

      await this.saveJson(outputFolder, '3-review.json', context.review);

      // Se houver versão revisada, salva também
      if (context.review.revisedHtml) {
        await this.saveHtml(outputFolder, '3-article-revised.html', context.review.revisedHtml);
        console.log('✓ Artigo revisado salvo em: 3-article-revised.html');
      }
      console.log('✓ Revisão salva em: 3-review.json\n');

      // ETAPA 4: Schemas
      console.log('🏗️  ETAPA 4/4: GERAÇÃO DE SCHEMAS');
      console.log('───────────────────────────────────────────────────────────');

      const schemaAgent = new SchemaAgent(this.apiKey, this.models.schema, this.provider);
      const finalArticle = context.review.revisedHtml
        ? { ...context.article, html: context.review.revisedHtml }
        : context.article;

      const schemaResult = await schemaAgent.execute(finalArticle);

      if (!schemaResult.success) {
        throw new Error(`Erro na geração de schemas: ${schemaResult.error}`);
      }

      context.schemas = schemaResult.data;
      if (!context.schemas) {
        throw new Error('Schemas não foram gerados');
      }

      await this.saveJson(outputFolder, '4-schemas.json', context.schemas);
      console.log('✓ Schemas salvos em: 4-schemas.json\n');

      // Salva artigo final com schemas integrados
      const finalHtml = this.integrateSchemas(
        context.review.revisedHtml || context.article.html,
        context.schemas.schemas
      );
      await this.saveHtml(outputFolder, 'article-final.html', finalHtml);

      // Salva contexto completo
      await this.saveJson(outputFolder, 'workflow-context.json', context);

      // Sumário final
      console.log('═══════════════════════════════════════════════════════════');
      console.log('✅ WORKFLOW CONCLUÍDO COM SUCESSO!');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`📁 Arquivos salvos em: ${outputFolder}`);
      console.log('\n📄 Arquivos gerados:');
      console.log('  • 1-research.json          - Resultado da pesquisa');
      console.log('  • 2-article.html           - Artigo original');
      console.log('  • 2-article-metadata.json  - Metadados do artigo');
      console.log('  • 3-review.json            - Resultado da revisão');
      if (context.review && context.review.revisedHtml) {
        console.log('  • 3-article-revised.html   - Artigo revisado');
      }
      console.log('  • 4-schemas.json           - Schemas JSON-LD');
      console.log('  • article-final.html       - Artigo final com schemas');
      console.log('  • workflow-context.json    - Contexto completo\n');

      console.log('📊 Estatísticas:');
      console.log(`  • Pontos-chave: ${context.research?.keyPoints.length || 0}`);
      console.log(`  • Palavras: ${context.article?.metadata.wordCount || 0}`);
      console.log(`  • Aprovado: ${context.review?.approved ? 'SIM' : 'NÃO'}`);
      console.log(`  • Sugestões: ${context.review?.suggestions.length || 0}`);
      console.log(`  • Schemas: ${context.schemas?.schemas.length || 0}`);
      console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
      console.error('\n❌ ERRO NO WORKFLOW:', error);
      throw error;
    }
  }

  private async saveJson(folder: string, filename: string, data: any): Promise<void> {
    const filepath = path.join(folder, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private async saveHtml(folder: string, filename: string, html: string): Promise<void> {
    const filepath = path.join(folder, filename);
    await fs.writeFile(filepath, html, 'utf-8');
  }

  private integrateSchemas(html: string, schemas: any[]): string {
    // Converte schemas para tags script JSON-LD
    const schemaScripts = schemas.map(schema =>
      `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`
    ).join('\n');

    // Insere schemas antes do fechamento do </head>
    if (html.includes('</head>')) {
      return html.replace('</head>', `${schemaScripts}\n</head>`);
    }

    // Se não houver </head>, insere no início
    return `<!DOCTYPE html>\n<html>\n<head>\n${schemaScripts}\n</head>\n<body>\n${html}\n</body>\n</html>`;
  }
}

// Execução do workflow se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const topic = process.argv[2];

  if (!topic) {
    console.error('❌ Erro: Tema não fornecido');
    console.log('\nUso: npm run workflow "Seu tema aqui"');
    console.log('Exemplo: npm run workflow "Cobertura de telemedicina em planos de saúde"');
    process.exit(1);
  }

  const workflow = new ArticleWorkflow();
  workflow.execute(topic).catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}
