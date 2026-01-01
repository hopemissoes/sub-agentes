import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { SearchResult } from './WebSearchService.js';

export interface ExtractedContent {
  url: string;
  title: string;
  content: string;
  wordCount: number;
}

export class ContentExtractor {
  private turndownService: TurndownService;
  private timeout: number;
  private maxContentLength: number;

  constructor(timeout: number = 15000, maxContentLength: number = 10000) {
    this.timeout = timeout;
    this.maxContentLength = maxContentLength;

    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });

    // Remove elementos desnecessários
    this.turndownService.remove(['script', 'style', 'nav', 'footer', 'iframe', 'noscript']);
  }

  /**
   * Extrai conteúdo de uma URL
   */
  async extractFromUrl(url: string): Promise<ExtractedContent | null> {
    try {
      console.log(`    📄 Extraindo: ${url}`);

      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HealthPlanResearchBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        maxRedirects: 5
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Remove elementos desnecessários
      $('script, style, nav, footer, iframe, noscript, aside, .advertisement, .ads').remove();

      // Tenta pegar o título
      let title = $('meta[property="og:title"]').attr('content') ||
                  $('title').text() ||
                  $('h1').first().text() ||
                  'Sem título';

      title = title.trim();

      // Extrai conteúdo principal
      let content = '';

      // Tenta pegar o conteúdo do article
      const article = $('article, main, .content, .post, .article, [role="main"]');

      if (article.length > 0) {
        content = article.first().html() || '';
      } else {
        // Se não encontrar, pega o body
        content = $('body').html() || '';
      }

      // Converte HTML para Markdown
      let markdown = this.turndownService.turndown(content);

      // Limpa o markdown
      markdown = this.cleanMarkdown(markdown);

      // Limita o tamanho
      if (markdown.length > this.maxContentLength) {
        markdown = markdown.substring(0, this.maxContentLength) + '\n\n[Conteúdo truncado...]';
      }

      const wordCount = markdown.split(/\s+/).length;

      console.log(`    ✓ Extraído: ${wordCount} palavras`);

      return {
        url,
        title,
        content: markdown,
        wordCount
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.log(`    ⏱️  Timeout: ${url}`);
        } else if (error.response?.status === 403 || error.response?.status === 401) {
          console.log(`    🚫 Acesso negado: ${url}`);
        } else {
          console.log(`    ❌ Erro: ${error.message}`);
        }
      } else {
        console.log(`    ❌ Erro ao processar: ${url}`);
      }
      return null;
    }
  }

  /**
   * Extrai conteúdo de múltiplas URLs
   */
  async extractMultiple(results: SearchResult[], maxUrls: number = 20): Promise<ExtractedContent[]> {
    console.log(`\n📚 Extraindo conteúdo de até ${maxUrls} páginas...\n`);

    const urlsToExtract = results.slice(0, maxUrls);
    const extracted: ExtractedContent[] = [];

    // Processa em lotes pequenos para não sobrecarregar
    const batchSize = 5;

    for (let i = 0; i < urlsToExtract.length; i += batchSize) {
      const batch = urlsToExtract.slice(i, i + batchSize);

      console.log(`  Lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(urlsToExtract.length / batchSize)}:`);

      const batchPromises = batch.map(result => this.extractFromUrl(result.url));
      const batchResults = await Promise.all(batchPromises);

      for (const content of batchResults) {
        if (content && content.wordCount > 50) { // Só adiciona se tiver conteúdo relevante
          extracted.push(content);
        }
      }

      // Pausa entre lotes
      if (i + batchSize < urlsToExtract.length) {
        await this.sleep(2000);
      }
    }

    console.log(`\n✓ Conteúdo extraído de ${extracted.length} páginas com sucesso\n`);

    return extracted;
  }

  /**
   * Limpa o markdown removendo espaços extras e linhas vazias
   */
  private cleanMarkdown(markdown: string): string {
    return markdown
      // Remove múltiplas linhas vazias
      .replace(/\n{3,}/g, '\n\n')
      // Remove espaços no final das linhas
      .replace(/[ \t]+$/gm, '')
      // Remove links muito longos (provavelmente URLs de imagens)
      .replace(/\[([^\]]{0,100})\]\([^\)]{200,}\)/g, '')
      // Remove caracteres especiais problemáticos
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '')
      .trim();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
