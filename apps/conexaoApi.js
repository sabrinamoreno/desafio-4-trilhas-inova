// Salva a URL da API em uma constante
export const urlDaApi = "https://apigatewayolinda.mec.gov.br/api/olinda/consultar-olinda-bi?token_acesso=n66pOqP3U0y2e4J98ICfIsdWaeZ72gIS1HovmNsijBVY0lP4dRS2BUnrlesJTE3gVpq4oDJYDoHBCYcmyv9MqELFPsKTcxKlgTUi&servico=PDA_SECADI%23PDA_SECADI_Sisfor_Indicador_Curso&retorno=json";

// Exporta a função que busca os dados e retorna em um JSON
export async function buscarDados() {
  const response = await fetch(urlDaApi);
  if (!response.ok) throw new Error('Erro na resposta da API');
  const json = await response.json();
  return json.body;
}