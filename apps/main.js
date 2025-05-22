// Incorpora os outros arquivos JS ao main
import { buscarDados } from './conexaoApi.js';  // Função que busca os dados da API
import { preencherFiltroAno, preencherFiltroIES } from './filtrosApi.js'; // Funções que preenchem os filtros
import { atualizarDashboard } from './dashboard.js'; // Função que atualiza gráficos e tabela

let dados = []; // Variável que armazena os dados da API

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', async () => {
  const mensagemErro = document.getElementById('mensagem-erro');

  try {
    // Faz a requisição dos dados da API
    dados = await buscarDados();

    // Preenche os filtros com os dados recebidos
    preencherFiltroAno(dados);
    preencherFiltroIES(dados);

    // Atualiza o dashboard com os dados
    atualizarDashboard(dados);

    // Atualiza o dashboard quando os filtros mudarem
    document.getElementById('filtro-ano').addEventListener('change', () => atualizarDashboard(dados));
    document.getElementById('filtro-ies').addEventListener('change', () => atualizarDashboard(dados));
  } catch (e) {
    console.error('Erro ao buscar dados:', e);

    if (mensagemErro) {
      mensagemErro.textContent = 'Erro ao carregar os dados. Tente novamente mais tarde.';
      mensagemErro.style.display = 'block';
    }
  }
});

// Menu responsivo
const btnMenu = document.getElementById('btn-menu');
const navLinks = document.getElementById('nav-links');

if (btnMenu && navLinks) {
  btnMenu.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', aberto);
  });
}