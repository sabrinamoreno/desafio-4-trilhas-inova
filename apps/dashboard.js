// Declara a variável graficoAtual como nula para inserir posteriormente
let graficoAtual = null;

// Função principal que atualiza o dashboard
export function atualizarDashboard(dados) {
  const ano = document.getElementById('filtro-ano').value;
  const ies = document.getElementById('filtro-ies').value;

  let filtrados = dados.filter(d => (!ano || d.ANO === ano) && (!ies || d.IES === ies));
  atualizarGrafico(filtrados); //atualiza o grafico
  atualizarTabela(filtrados); // atualiza a tabela
  atualizarCards(filtrados); // atualiza s cards também
}

// Função para atualizar os cards com os dados totais
function atualizarCards(dadosFiltrados) {
  const totalAprovados = dadosFiltrados.reduce((soma, item) => soma + (item.APROVADOS || 0), 0);
  const totalReprovados = dadosFiltrados.reduce((soma, item) => soma + (item.REPROVADOS || 0), 0);
  const totalEvadidos = dadosFiltrados.reduce((soma, item) => soma + (item.EVADIDOS || 0), 0);

  // Tratamento para o valor da meta anual
  const totalMeta = dadosFiltrados.reduce((soma, item) => {
    const valorMeta = parseFloat(item.META);
    return soma + (isFinite(valorMeta) ? valorMeta : 0);
  }, 0);

  // Função para exibir número em formato abreviado (K, M)
  function formatarNumeroAbreviado(valor) {
    if (valor >= 1_000_000) {
      return (valor / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (valor >= 1_000) {
      return (valor / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return valor.toString();
  }

  // Atualiza os elementos no HTML
  document.getElementById("card-aprovados").textContent = totalAprovados;
  document.getElementById("card-reprovados").textContent = totalReprovados;
  document.getElementById("card-evadidos").textContent = totalEvadidos;
  document.getElementById("card-meta").textContent = formatarNumeroAbreviado(totalMeta);
}

// Função que atualiza o gráfico com os dados filtrados
function atualizarGrafico(dados) {
  const ctx = document.getElementById('grafico').getContext('2d');
  if (graficoAtual) graficoAtual.destroy();

  const cursos = dados.slice(0, 10); // Pega apenas os 10 primeiros cursos

  // Criação do gráfico através do Chart
  graficoAtual = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cursos.map(d => d.CURSO),
      datasets: [
        {
          label: 'Aprovados',
          data: cursos.map(d => d.APROVADOS),
          backgroundColor: 'rgb(0, 119, 187)'
        },
        {
          label: 'Reprovados',
          data: cursos.map(d => d.REPROVADOS),
          backgroundColor: 'rgb(230, 97, 0)'
        },
        {
          label: 'Evadidos',
          data: cursos.map(d => d.EVADIDOS),
          backgroundColor: 'rgb(204, 121, 167)'
        },
        {
          label: 'Meta',
          data: cursos.map(d => d.META),
          type: 'line',
          borderColor: 'rgb(0, 153, 136)',
          backgroundColor: 'rgb(0, 153, 136)',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Função que atualiza a tabela com os dados
function atualizarTabela(dados) {
  const tbody = document.querySelector('#tabela-cursos tbody');
  tbody.innerHTML = '';

  if (!dados.length) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhum dado encontrado</td></tr>`;
    return;
  }

  dados.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.CURSO}</td>
      <td>${d.APROVADOS}</td>
      <td>${d.REPROVADOS}</td>
      <td>${d.EVADIDOS}</td>
      <td>${d.FALECIDOS ?? '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}