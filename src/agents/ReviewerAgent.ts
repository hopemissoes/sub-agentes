import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, ReviewResult, ArticleResult } from '../types/index.js';
import { REVIEWER_AGENT_CONFIG } from '../config/prompts.js';

export class ReviewerAgent extends BaseAgent {
  constructor(apiKey: string, model?: string) {
    super(REVIEWER_AGENT_CONFIG, apiKey, model);
  }

  async execute(article: ArticleResult): Promise<AgentResponse> {
    try {
      const userMessage = `Revise o seguinte artigo sobre planos de saúde:

TÍTULO: ${article.title}

HTML:
${article.html}

METADADOS:
- Palavras: ${article.metadata?.wordCount || 'N/A'}
- Criado em: ${article.metadata?.createdAt || 'N/A'}

Avalie cuidadosamente e retorne sua análise no formato JSON especificado.`;

      const response = await this.callClaude(userMessage);
      const data = this.parseJsonResponse(response) as ReviewResult;

      console.log(`[${this.config.name}] ✓ Revisão concluída`);
      console.log(`  - Aprovado: ${data.approved ? 'SIM' : 'NÃO'}`);
      console.log(`  - Sugestões: ${data.suggestions?.length || 0}`);

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
