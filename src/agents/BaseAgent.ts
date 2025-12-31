import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig, AgentResponse } from '../types/index.js';

export class BaseAgent {
  protected client: Anthropic;
  protected config: AgentConfig;
  protected model: string;

  constructor(config: AgentConfig, apiKey: string, model?: string) {
    this.client = new Anthropic({ apiKey });
    this.config = config;
    this.model = model || config.model || 'claude-sonnet-4-5-20250929';
  }

  protected async callClaude(userMessage: string): Promise<string> {
    try {
      console.log(`\n[${this.config.name}] Processando...`);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.config.maxTokens || 4096,
        system: this.config.systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('Resposta inválida do Claude');
      }

      return textContent.text;
    } catch (error) {
      console.error(`[${this.config.name}] Erro:`, error);
      throw error;
    }
  }

  protected parseJsonResponse(response: string): any {
    // Tenta extrair JSON da resposta
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) ||
                      response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }

    // Se não encontrar JSON, tenta parsear a resposta inteira
    try {
      return JSON.parse(response);
    } catch {
      throw new Error('Não foi possível extrair JSON da resposta');
    }
  }

  async execute(input: any): Promise<AgentResponse> {
    throw new Error('Método execute deve ser implementado pela classe filha');
  }
}
