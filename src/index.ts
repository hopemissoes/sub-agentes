import dotenv from 'dotenv';
import { ArticleWorkflow } from './workflow.js';

dotenv.config();

/**
 * Exemplo de uso do sistema de agentes
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🏥 SISTEMA DE AGENTES - ARTIGOS DE PLANOS DE SAÚDE');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Exemplo de tema
  const exampleTopic = 'Cobertura obrigatória de exames preventivos nos planos de saúde';

  console.log('Este é um exemplo de uso do sistema.');
  console.log(`Tema exemplo: "${exampleTopic}"\n`);
  console.log('Para executar o workflow com seu próprio tema:');
  console.log('  npm run workflow "Seu tema aqui"\n');

  // Descomente para executar o exemplo
  /*
  const workflow = new ArticleWorkflow();
  await workflow.execute(exampleTopic);
  */
}

// Exporta para uso em outros módulos
export { ArticleWorkflow };
export * from './agents/index.js';
export * from './types/index.js';

// Executa main se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Erro:', error);
    process.exit(1);
  });
}
