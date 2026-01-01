import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, SchemaResult, ArticleResult } from '../types/index.js';
import { SCHEMA_AGENT_CONFIG } from '../config/prompts.js';

export class SchemaAgent extends BaseAgent {
  constructor(apiKey: string, model?: string, provider?: 'anthropic' | 'openrouter') {
    super(SCHEMA_AGENT_CONFIG, apiKey, model, provider);
  }

  async execute(article: ArticleResult): Promise<AgentResponse> {
    try {
      const userMessage = `Crie schemas JSON-LD para o seguinte artigo:

TÍTULO: ${article.title}

HTML:
${article.html}

Crie schemas apropriados e otimizados para SEO. Retorne no formato JSON especificado.`;

      const response = await this.callClaude(userMessage);
      const data = this.parseJsonResponse(response) as SchemaResult;

      console.log(`[${this.config.name}] ✓ Schemas criados`);
      console.log(`  - Tipos: ${data.schemaTypes?.join(', ') || 'N/A'}`);
      console.log(`  - Total: ${data.schemas?.length || 0} schemas`);

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}
