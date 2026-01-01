import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  content?: string;
}

export interface SearchConfig {
  provider: 'brave' | 'tavily';
  apiKey: string;
  maxResultsPerQuery?: number;
  timeout?: number;
}

export class WebSearchService {
  private config: SearchConfig;

  constructor(config: SearchConfig) {
    this.config = {
      maxResultsPerQuery: 10,
      timeout: 10000,
      ...config
    };
  }

  /**
   * Realiza uma busca e retorna os resultados
   */
  async search(query: string): Promise<SearchResult[]> {
    console.log(`  🔍 Buscando: "${query}"`);

    try {
      if (this.config.provider === 'brave') {
        return await this.searchBrave(query);
      } else if (this.config.provider === 'tavily') {
        return await this.searchTavily(query);
      }

      throw new Error(`Provider não suportado: ${this.config.provider}`);
    } catch (error) {
      console.error(`  ❌ Erro ao buscar "${query}":`, error instanceof Error ? error.message : error);
      return [];
    }
  }

  /**
   * Busca usando Brave Search API
   */
  private async searchBrave(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': this.config.apiKey
        },
        params: {
          q: query,
          count: this.config.maxResultsPerQuery,
          search_lang: 'pt',
          country: 'BR'
        },
        timeout: this.config.timeout
      });

      const results: SearchResult[] = [];

      if (response.data.web?.results) {
        for (const item of response.data.web.results) {
          results.push({
            title: item.title || '',
            url: item.url || '',
            description: item.description || ''
          });
        }
      }

      console.log(`  ✓ Encontrados ${results.length} resultados`);
      return results;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.error('  ⚠️  Rate limit atingido. Aguarde um momento.');
      }
      throw error;
    }
  }

  /**
   * Busca usando Tavily AI
   */
  private async searchTavily(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.post(
        'https://api.tavily.com/search',
        {
          api_key: this.config.apiKey,
          query: query,
          search_depth: 'advanced',
          max_results: this.config.maxResultsPerQuery,
          include_answer: false,
          include_raw_content: true
        },
        {
          timeout: this.config.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const results: SearchResult[] = [];

      if (response.data.results) {
        for (const item of response.data.results) {
          results.push({
            title: item.title || '',
            url: item.url || '',
            description: item.content || '',
            content: item.raw_content || undefined
          });
        }
      }

      console.log(`  ✓ Encontrados ${results.length} resultados`);
      return results;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza múltiplas buscas em paralelo
   */
  async searchMultiple(queries: string[]): Promise<SearchResult[]> {
    console.log(`\n🔎 Realizando ${queries.length} buscas...`);

    const allResults: SearchResult[] = [];
    const seenUrls = new Set<string>();

    // Processa em lotes para não sobrecarregar a API
    const batchSize = 3;
    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      const batchPromises = batch.map(q => this.search(q));
      const batchResults = await Promise.all(batchPromises);

      for (const results of batchResults) {
        for (const result of results) {
          // Remove duplicatas por URL
          if (!seenUrls.has(result.url)) {
            seenUrls.add(result.url);
            allResults.push(result);
          }
        }
      }

      // Pequena pausa entre lotes
      if (i + batchSize < queries.length) {
        await this.sleep(1000);
      }
    }

    console.log(`\n✓ Total de ${allResults.length} resultados únicos encontrados\n`);
    return allResults;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
