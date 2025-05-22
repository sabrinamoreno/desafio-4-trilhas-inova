// Declara a variável graficoAtual como nula para inserir posteriormente
let graficoAtual = null;

// Função principal que atualiza o dashboard
export function atualizarDashboard(dados) {
  const ano = document.getElementById('filtro-ano').value;
  const ies = document.getElementById('filtro-ies').value;

  let filtrados = dados.filter(d => (!ano || d.ANO === ano) && (!ies || d.IES === ies));
  atualizarGrafico(filtrados); // atualiza o gráfico
  atualizarTabela(filtrados); // atualiza a tabela
  atualizarCards(filtrados);  // atualiza os cards também
}

// Função para atualizar os cards com os dados totais
function atualizarCards(dadosFiltrados) {
  const totalAprovados = dadosFiltrados.reduce((soma, item) => soma + (item.APROVADOS || 0), 0);
  const totalReprovados = dadosFiltrados.reduce((soma, item) => soma + (item.REPROVADOS || 0), 0);
  const totalEvadidos = dadosFiltrados.reduce((soma, item) => soma + (item.EVADIDOS || 0), 0);

  const totalMeta = dadosFiltrados.reduce((soma, item) => {
    const valorMeta = parseFloat(item.META);
    return soma + (isFinite(valorMeta) ? valorMeta : 0);
  }, 0);

  function formatarNumeroAbreviado(valor) {
    if (valor >= 1_000_000) {
      return (valor / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (valor >= 1_000) {
      return (valor / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return valor.toString();
  }

  document.getElementById("card-aprovados").textContent = totalAprovados;
  document.getElementById("card-reprovados").textContent = totalReprovados;
  document.getElementById("card-evadidos").textContent = totalEvadidos;
  document.getElementById("card-meta").textContent = formatarNumeroAbreviado(totalMeta);
}

// Função que atualiza o gráfico com os dados filtrados
function atualizarGrafico(dados) {
  const ctx = document.getElementById('grafico').getContext('2d');
  if (graficoAtual) graficoAtual.destroy();

  const cursos = dados.slice(0, 10);
  const nomesCompletos = cursos.map(d => d.CURSO);
  const telaPequena = window.innerWidth < 600; // Variável que vai verificar o tamanho da tela

  const nomesParaEixo = cursos.map(d => {
    if (telaPequena) {
      return d.CURSO.split(' - ')[0];
    }
    return d.CURSO.length > 15 ? d.CURSO.slice(0, 15) + '...' : d.CURSO;
  });

  graficoAtual = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomesParaEixo,
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
    options: { // Altera o estilo do gráfico para telas menores
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: !telaPequena, // esconde eixo X se a tela for pequena
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              const index = context[0].dataIndex;
              return nomesCompletos[index]; // mostra nome completo no tooltip
            }
          }
        },
        legend: {
          position: 'top'
        }
      }
    }
  });
}

// Função que atualiza a tabela com os dados
function atualizarTabela(dados) {
  const tbody = document.querySelector('#tabela-cursos tbody');
  const cardsContainer = document.getElementById('cards-mobile');
  tbody.innerHTML = '';
  cardsContainer.innerHTML = ''; // limpa os cards antigos

  if (!dados.length) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhum dado encontrado</td></tr>`;
    return;
  }

  dados.forEach(d => {
    // Monta a linha da tabela
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.CURSO}</td>
      <td>${d.APROVADOS}</td>
      <td>${d.REPROVADOS}</td>
      <td>${d.EVADIDOS}</td>
      <td>${d.FALECIDOS ?? '-'}</td>
    `;
    tbody.appendChild(tr);

    // Monta o card correspondente
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <p><span>Curso:</span> ${d.CURSO}</p>
      <p><span>Aprovados:</span> ${d.APROVADOS}</p>
      <p><span>Reprovados:</span> ${d.REPROVADOS}</p>
      <p><span>Evadidos:</span> ${d.EVADIDOS}</p>
      <p><span>Falecidos:</span> ${d.FALECIDOS ?? '-'}</p>
    `;
    cardsContainer.appendChild(card);
  });
}