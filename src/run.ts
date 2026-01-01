import { ArticleWorkflow } from './workflow.js';

// Pega o tema dos argumentos
const args = process.argv.slice(2);
const topic = args.join(' ');

if (!topic) {
  console.error('❌ Erro: Tema não fornecido');
  console.log('\nUso: node dist/run.js "Seu tema aqui"');
  console.log('Ou: node dist/run.js Seu tema sem aspas');
  console.log('\nExemplo: node dist/run.js Cobertura de telemedicina');
  process.exit(1);
}

console.log(`Iniciando workflow para: "${topic}"\n`);

const workflow = new ArticleWorkflow();
workflow.execute(topic).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
