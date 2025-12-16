
import { carregarDB, salvarDB } from './db.js'; 
let despesas = [];

export function carregarDespesas() {
  const data = localStorage.getItem('despesas');
  despesas = data ? JSON.parse(data) : [];
  return despesas;
}

export function getDespesas() {
  return despesas;
}

export function salvarDespesa(despesa) {
  despesas.push(despesa);
  localStorage.setItem('despesas', JSON.stringify(despesas));
}

export function editarDespesa(index, novaDespesa) {
  despesas[index] = novaDespesa;
  localStorage.setItem('despesas', JSON.stringify(despesas));
}

export function excluirDespesa(index) {
  despesas.splice(index, 1);
  localStorage.setItem('despesas', JSON.stringify(despesas));
}

// ✅ Este é o cálculo que faltava
export function calcularDividas(pessoas) {
  const n = pessoas.length;
  const dividas = Array.from({ length: n }, () => Array(n).fill(0));

  despesas.forEach(d => {
    const valorPorPessoa = d.valor / d.participantes.length;
    d.participantes.forEach(p => {
      if (p !== d.pagador) {
        dividas[p][d.pagador] += valorPorPessoa;
      }
    });
  });

  return dividas;
}
export async function setDespesas(novasDespesas) {
  despesas = novasDespesas;
  const db = await carregarDB();
  db.despesas = despesas;
  await salvarDB(db);
}