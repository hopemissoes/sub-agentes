import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, ArticleResult, ResearchResult } from '../types/index.js';
import { WRITER_AGENT_CONFIG } from '../config/prompts.js';

export class WriterAgent extends BaseAgent {
  constructor(apiKey: string, model?: string) {
    super(WRITER_AGENT_CONFIG, apiKey, model);
  }

  async execute(research: ResearchResult): Promise<AgentResponse> {
    try {
      const userMessage = `Com base na seguinte pesquisa, crie um artigo completo em HTML:

TEMA: ${research.topic}

PESQUISA:
${research.research}

PONTOS-CHAVE A ABORDAR:
${research.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

FONTES PARA REFERÊNCIA:
${research.sources.map((source, i) => `${i + 1}. ${source}`).join('\n')}

Lembre-se de retornar a resposta no formato JSON especificado, com HTML completo e válido.`;

      const response = await this.callClaude(userMessage);
      const data = this.parseJsonResponse(response) as ArticleResult;

      console.log(`[${this.config.name}] ✓ Artigo criado`);
      console.log(`  - Título: ${data.title}`);
      console.log(`  - Palavras: ${data.metadata?.wordCount || 'N/A'}`);

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
