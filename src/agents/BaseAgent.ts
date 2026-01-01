import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { AgentConfig, AgentResponse } from '../types/index.js';

type APIProvider = 'anthropic' | 'openrouter';

export class BaseAgent {
  protected anthropicClient?: Anthropic;
  protected openaiClient?: OpenAI;
  protected provider: APIProvider;
  protected config: AgentConfig;
  protected model: string;

  constructor(config: AgentConfig, apiKey: string, model?: string, provider: APIProvider = 'anthropic') {
    this.provider = provider;
    this.config = config;
    this.model = model || config.model || 'claude-sonnet-4-5-20250929';

    if (provider === 'anthropic') {
      this.anthropicClient = new Anthropic({ apiKey });
    } else if (provider === 'openrouter') {
      this.openaiClient = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://github.com/health-plan-article-agents',
          'X-Title': 'Health Plan Article Agents'
        }
      });
    }
  }

  protected async callClaude(userMessage: string): Promise<string> {
    try {
      console.log(`\n[${this.config.name}] Processando com ${this.provider}...`);
      console.log(`[${this.config.name}] Modelo: ${this.model}`);

      if (this.provider === 'anthropic' && this.anthropicClient) {
        return await this.callAnthropic(userMessage);
      } else if (this.provider === 'openrouter' && this.openaiClient) {
        return await this.callOpenRouter(userMessage);
      }

      throw new Error('Cliente de API não inicializado');
    } catch (error) {
      console.error(`[${this.config.name}] Erro:`, error);
      throw error;
    }
  }

  private async callAnthropic(userMessage: string): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error('Cliente Anthropic não inicializado');
    }

    const response = await this.anthropicClient.messages.create({
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
  }

  private async callOpenRouter(userMessage: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('Cliente OpenRouter não inicializado');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: this.model,
      max_tokens: this.config.maxTokens || 4096,
      messages: [
        {
          role: 'system',
          content: this.config.systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      throw new Error('Resposta inválida do OpenRouter');
    }

    return message;
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
