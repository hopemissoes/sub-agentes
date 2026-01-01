import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, ResearchResult } from '../types/index.js';
import { RESEARCH_AGENT_CONFIG } from '../config/prompts.js';
import { DeepResearchService } from '../services/DeepResearchService.js';

export class ResearchAgent extends BaseAgent {
  private enableWebResearch: boolean;
  private searchProvider?: 'brave' | 'tavily';
  private searchApiKey?: string;

  constructor(
    apiKey: string,
    model?: string,
    provider?: 'anthropic' | 'openrouter',
    enableWebResearch: boolean = false,
    searchProvider?: 'brave' | 'tavily',
    searchApiKey?: string
  ) {
    super(RESEARCH_AGENT_CONFIG, apiKey, model, provider);
    this.enableWebResearch = enableWebResearch;
    this.searchProvider = searchProvider;
    this.searchApiKey = searchApiKey;
  }

  async execute(topic: string): Promise<AgentResponse> {
    try {
      // Se web research estiver habilitado, usa deep research
      if (this.enableWebResearch && this.searchProvider && this.searchApiKey) {
        return await this.executeWithWebResearch(topic);
      }

      // Caso contrário, usa conhecimento do Claude (padrão)
      return await this.executeWithKnowledge(topic);

    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Pesquisa usando conhecimento do Claude (sem web)
   */
  private async executeWithKnowledge(topic: string): Promise<AgentResponse> {
    const userMessage = `Realize uma pesquisa profunda sobre o seguinte tema relacionado a planos de saúde:

TEMA: ${topic}

Lembre-se de retornar a resposta no formato JSON especificado.`;

    const response = await this.callClaude(userMessage);
    const data = this.parseJsonResponse(response) as ResearchResult;

    console.log(`[${this.config.name}] ✓ Pesquisa concluída (conhecimento base)`);
    console.log(`  - ${data.keyPoints?.length || 0} pontos-chave identificados`);
    console.log(`  - ${data.sources?.length || 0} fontes listadas`);

    return {
      success: true,
      data
    };
  }

  /**
   * Pesquisa usando web research REAL
   */
  private async executeWithWebResearch(topic: string): Promise<AgentResponse> {
    if (!this.searchProvider || !this.searchApiKey) {
      throw new Error('Search provider ou API key não configurados');
    }

    console.log(`[${this.config.name}] 🌐 Modo: PESQUISA WEB PROFUNDA`);
    console.log(`[${this.config.name}] Provider: ${this.searchProvider.toUpperCase()}\n`);

    // Inicializa serviço de deep research
    const deepResearch = new DeepResearchService({
      aiProvider: this.provider,
      aiApiKey: this.anthropicClient
        ? (this.anthropicClient as any).apiKey
        : (this.openaiClient as any).apiKey,
      aiModel: this.model,
      searchProvider: this.searchProvider,
      searchApiKey: this.searchApiKey,
      numberOfQueries: 8,         // 8 queries diferentes (reduzido para evitar rate limit)
      resultsPerQuery: 8,         // 8 resultados por query = 64 URLs
      maxUrlsToExtract: 50        // Extrai conteúdo de até 50 páginas
    });

    // Realiza a pesquisa profunda
    const deepResult = await deepResearch.research(topic);

    // Agora processa a pesquisa com Claude para estruturar no formato esperado
    const userMessage = `Você recebeu uma pesquisa profunda sobre o tema: "${topic}"

PESQUISA REALIZADA:
${deepResult.synthesis}

ESTATÍSTICAS:
- ${deepResult.totalUrls} URLs analisadas
- ${deepResult.successfulExtractions} páginas processadas
- ${deepResult.queries.length} queries de busca executadas

Com base nesta pesquisa profunda, estruture as informações no formato JSON especificado, incluindo:
- topic: o tema pesquisado
- research: a pesquisa completa (use o conteúdo acima)
- sources: liste as principais fontes consultadas (URLs das páginas processadas)
- keyPoints: extraia os pontos-chave mais importantes da pesquisa`;

    const response = await this.callClaude(userMessage);
    const data = this.parseJsonResponse(response) as ResearchResult;

    // Adiciona as URLs reais como fontes
    if (deepResult.extractedContents.length > 0) {
      const topSources = deepResult.extractedContents
        .slice(0, 15)
        .map(c => `${c.title} - ${c.url}`);

      data.sources = [...(data.sources || []), ...topSources];
    }

    console.log(`\n[${this.config.name}] ✓ Pesquisa web profunda concluída`);
    console.log(`  - ${data.keyPoints?.length || 0} pontos-chave identificados`);
    console.log(`  - ${data.sources?.length || 0} fontes reais consultadas`);
    console.log(`  - ${deepResult.totalUrls} URLs analisadas`);
    console.log(`  - ${deepResult.successfulExtractions} páginas processadas\n`);

    return {
      success: true,
      data
    };
  }
}
