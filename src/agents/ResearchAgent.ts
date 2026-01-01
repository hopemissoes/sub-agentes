import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, ResearchResult } from '../types/index.js';
import { RESEARCH_AGENT_CONFIG } from '../config/prompts.js';

export class ResearchAgent extends BaseAgent {
  constructor(apiKey: string, model?: string, provider?: 'anthropic' | 'openrouter') {
    super(RESEARCH_AGENT_CONFIG, apiKey, model, provider);
  }

  async execute(topic: string): Promise<AgentResponse> {
    try {
      const userMessage = `Realize uma pesquisa profunda sobre o seguinte tema relacionado a planos de saúde:

TEMA: ${topic}

Lembre-se de retornar a resposta no formato JSON especificado.`;

      const response = await this.callClaude(userMessage);
      const data = this.parseJsonResponse(response) as ResearchResult;

      console.log(`[${this.config.name}] ✓ Pesquisa concluída`);
      console.log(`  - ${data.keyPoints?.length || 0} pontos-chave identificados`);
      console.log(`  - ${data.sources?.length || 0} fontes listadas`);

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
