let despesas = [];
let indexEditando = -1;

export function carregarDespesas() {
  const data = localStorage.getItem('despesas');
  despesas = data ? JSON.parse(data) : [];
}

export function getDespesas() {
  return despesas;
}

export function salvarDespesa(despesa) {
  if (indexEditando >= 0) {
    despesas[indexEditando] = despesa;
    indexEditando = -1;
  } else {
    despesas.push(despesa);
  }
  persistir();
}

export function iniciarEdicao(index) {
  indexEditando = index;
  return despesas[index];
}

export function excluirDespesa(index) {
  despesas.splice(index, 1);
  persistir();
}

export function calcularDividas(pessoas) {
  const dividas = Array.from({ length: pessoas.length }, () =>
    Array(pessoas.length).fill(0)
  );

  despesas.forEach(desp => {
    const valorPorPessoa = desp.valor / desp.participantes.length;
    desp.participantes.forEach(p => {
      if (p !== desp.pagador) {
        dividas[p][desp.pagador] += valorPorPessoa;
      }
    });
  });

  return dividas;
}

function persistir() {
  localStorage.setItem('despesas', JSON.stringify(despesas));
}
