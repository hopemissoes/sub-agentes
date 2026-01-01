import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { WebSearchService, SearchResult } from './WebSearchService.js';
import { ContentExtractor, ExtractedContent } from './ContentExtractor.js';

type APIProvider = 'anthropic' | 'openrouter';

export interface DeepResearchConfig {
  // API de IA
  aiProvider: APIProvider;
  aiApiKey: string;
  aiModel: string;

  // API de Busca
  searchProvider: 'brave' | 'tavily';
  searchApiKey: string;

  // Configurações de pesquisa
  numberOfQueries?: number;      // Quantas queries gerar (padrão: 15)
  resultsPerQuery?: number;      // Resultados por query (padrão: 10)
  maxUrlsToExtract?: number;     // Máximo de URLs para extrair (padrão: 50)
}

export interface DeepResearchResult {
  topic: string;
  queries: string[];
  searchResults: SearchResult[];
  extractedContents: ExtractedContent[];
  synthesis: string;
  totalUrls: number;
  successfulExtractions: number;
}

export class DeepResearchService {
  private config: DeepResearchConfig;
  private anthropicClient?: Anthropic;
  private openaiClient?: OpenAI;
  private searchService: WebSearchService;
  private contentExtractor: ContentExtractor;

  constructor(config: DeepResearchConfig) {
    this.config = {
      numberOfQueries: 15,
      resultsPerQuery: 10,
      maxUrlsToExtract: 50,
      ...config
    };

    // Inicializa cliente de IA
    if (config.aiProvider === 'anthropic') {
      this.anthropicClient = new Anthropic({ apiKey: config.aiApiKey });
    } else {
      this.openaiClient = new OpenAI({
        apiKey: config.aiApiKey,
        baseURL: 'https://openrouter.ai/api/v1'
      });
    }

    // Inicializa serviço de busca
    this.searchService = new WebSearchService({
      provider: config.searchProvider,
      apiKey: config.searchApiKey,
      maxResultsPerQuery: config.resultsPerQuery
    });

    // Inicializa extrator de conteúdo
    this.contentExtractor = new ContentExtractor();
  }

  /**
   * Realiza uma pesquisa profunda completa
   */
  async research(topic: string): Promise<DeepResearchResult> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔬 INICIANDO PESQUISA PROFUNDA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 Tema: ${topic}\n`);

    // ETAPA 1: Gerar queries de pesquisa
    console.log('ETAPA 1: Gerando queries de pesquisa...');
    const queries = await this.generateSearchQueries(topic);
    console.log(`✓ ${queries.length} queries geradas\n`);

    // ETAPA 2: Buscar na web
    console.log('ETAPA 2: Buscando na web...');
    const searchResults = await this.searchService.searchMultiple(queries);
    console.log(`✓ ${searchResults.length} URLs encontradas\n`);

    // ETAPA 3: Extrair conteúdo
    console.log('ETAPA 3: Extraindo conteúdo das páginas...');
    const extractedContents = await this.contentExtractor.extractMultiple(
      searchResults,
      this.config.maxUrlsToExtract
    );
    console.log(`✓ ${extractedContents.length} páginas processadas\n`);

    // ETAPA 4: Sintetizar informações
    console.log('ETAPA 4: Sintetizando informações...');
    const synthesis = await this.synthesizeContent(topic, extractedContents);
    console.log(`✓ Síntese completa\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PESQUISA PROFUNDA CONCLUÍDA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📊 Estatísticas:`);
    console.log(`   • Queries executadas: ${queries.length}`);
    console.log(`   • URLs encontradas: ${searchResults.length}`);
    console.log(`   • Páginas processadas: ${extractedContents.length}`);
    console.log(`   • Palavras extraídas: ${extractedContents.reduce((sum, c) => sum + c.wordCount, 0).toLocaleString()}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    return {
      topic,
      queries,
      searchResults,
      extractedContents,
      synthesis,
      totalUrls: searchResults.length,
      successfulExtractions: extractedContents.length
    };
  }

  /**
   * Gera queries de pesquisa diversificadas
   */
  private async generateSearchQueries(topic: string): Promise<string[]> {
    const prompt = `Você é um especialista em pesquisa sobre planos de saúde no Brasil.

Gere ${this.config.numberOfQueries} queries de pesquisa diversificadas e específicas sobre o seguinte tema:

TEMA: ${topic}

INSTRUÇÕES:
- Crie queries que cubram DIFERENTES ASPECTOS do tema
- Inclua queries sobre:
  * Legislação e regulamentação ANS
  * Direitos do consumidor
  * Aspectos práticos e operacionais
  * Casos e jurisprudência
  * Notícias e atualizações recentes
  * Comparações e análises
  * Perguntas frequentes
- Use variações de palavras-chave
- Algumas queries devem ser em português formal, outras coloquiais
- Retorne APENAS uma lista JSON de strings, sem explicações

Formato de resposta:
["query 1", "query 2", "query 3", ...]`;

    const response = await this.callAI(prompt);

    try {
      // Tenta extrair JSON da resposta
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const queries = JSON.parse(jsonMatch[0]);
        return queries.slice(0, this.config.numberOfQueries);
      }
    } catch {
      // Se falhar, retorna queries padrão
      console.log('⚠️  Erro ao parsear queries, usando queries padrão');
    }

    // Fallback: queries padrão
    return this.getDefaultQueries(topic);
  }

  /**
   * Sintetiza o conteúdo extraído em uma pesquisa estruturada
   */
  private async synthesizeContent(topic: string, contents: ExtractedContent[]): Promise<string> {
    // Prepara o conteúdo para análise
    let contentText = '';
    for (const [index, content] of contents.entries()) {
      contentText += `\n\n═══ FONTE ${index + 1}: ${content.title} ═══\n`;
      contentText += `URL: ${content.url}\n\n`;
      contentText += content.content;
      contentText += '\n\n';

      // Limita o tamanho total para não exceder limite de tokens
      if (contentText.length > 80000) {
        contentText += '\n\n[Conteúdo adicional omitido devido ao limite de tamanho]';
        break;
      }
    }

    const prompt = `Você é um especialista em análise e síntese de informações sobre planos de saúde.

Analisando múltiplas fontes web, crie uma PESQUISA PROFUNDA E ABRANGENTE sobre o tema:

TEMA: ${topic}

FONTES CONSULTADAS (${contents.length} páginas web):
${contentText}

SUA TAREFA:
Sintetize todas as informações encontradas em uma pesquisa completa e estruturada.

INCLUA:
1. Visão geral do tema
2. Aspectos legais e regulatórios (ANS, leis aplicáveis)
3. Direitos e obrigações
4. Situação atual e tendências
5. Casos práticos e exemplos
6. Pontos de atenção e controvérsias
7. Recomendações e conclusões

IMPORTANTE:
- Use APENAS informações das fontes fornecidas
- Cite as fontes quando relevante (ex: "Segundo a fonte 3...")
- Seja detalhado e técnico
- Mantenha foco em planos de saúde no Brasil
- Organize de forma clara e lógica

Escreva a pesquisa completa:`;

    return await this.callAI(prompt, 8192);
  }

  /**
   * Chama a API de IA
   */
  private async callAI(prompt: string, maxTokens: number = 4096): Promise<string> {
    if (this.config.aiProvider === 'anthropic' && this.anthropicClient) {
      const response = await this.anthropicClient.messages.create({
        model: this.config.aiModel,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      });

      const textContent = response.content.find(c => c.type === 'text');
      if (textContent && textContent.type === 'text') {
        return textContent.text;
      }
    } else if (this.config.aiProvider === 'openrouter' && this.openaiClient) {
      const response = await this.openaiClient.chat.completions.create({
        model: this.config.aiModel,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.choices[0]?.message?.content || '';
    }

    throw new Error('Cliente de IA não inicializado');
  }

  /**
   * Queries padrão caso a geração automática falhe
   */
  private getDefaultQueries(topic: string): string[] {
    return [
      `${topic} planos de saúde`,
      `${topic} ANS regulamentação`,
      `${topic} direitos consumidor plano de saúde`,
      `${topic} Lei 9656/98`,
      `${topic} resolução normativa ANS`,
      `${topic} jurisprudência plano saúde`,
      `como funciona ${topic} plano de saúde`,
      `${topic} operadora saúde obrigação`,
      `${topic} cobertura obrigatória`,
      `${topic} plano saúde 2024 2025`,
      `${topic} mudanças regulamentação`,
      `perguntas frequentes ${topic} plano saúde`,
      `${topic} individual familiar empresarial`,
      `problemas ${topic} plano saúde`,
      `${topic} plano saúde Brasil`
    ];
  }
}
