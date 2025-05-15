// Função que preenche o select de anos com base nos dados da API
export function preencherFiltroAno(dados) {
  const selectAno = document.getElementById('filtro-ano');

  // Adiciona a opção padrão "Todos"
  selectAno.innerHTML = '<option value="">Todos</option>';

  // Extrai e ordena os anos únicos presentes nos dados
  const anosUnicos = [...new Set(dados.map(item => item.ANO))].sort();

  // Cria e adiciona uma <option> para cada ano
  anosUnicos.forEach(ano => {
    const option = document.createElement('option');
    option.value = ano;
    option.textContent = ano;
    selectAno.appendChild(option);
  });
}

// A função para as IES segue a mesma lógica da de anos
export function preencherFiltroIES(dados) {
  const selectIES = document.getElementById('filtro-ies');
  selectIES.innerHTML = '<option value="">Todas</option>';
  const iesUnicas = [...new Set(dados.map(item => item.IES))].sort();
  iesUnicas.forEach(ies => {
    const option = document.createElement('option');
    option.value = ies;
    option.textContent = ies;
    selectIES.appendChild(option);
  });
}
