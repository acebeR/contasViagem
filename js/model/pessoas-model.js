let pessoas = [];

export function setPessoas(lista) {
  pessoas = lista;
  localStorage.setItem('pessoas', JSON.stringify(pessoas));
}

export function getPessoas() {
  return pessoas;
}

export function carregarPessoas() {
  const dados = localStorage.getItem('pessoas');
  pessoas = dados ? JSON.parse(dados) : [];
}
