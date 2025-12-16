import { carregarDB, salvarDB } from './db.js';

let pessoas = [];

export async function carregarPessoas() {
  const db = await carregarDB();
  pessoas = db.pessoas || [];
}

export function getPessoas() {
  return pessoas;
}

export async function setPessoas(novas) {
  pessoas = novas;
  const db = await carregarDB();
  db.pessoas = pessoas;
  await salvarDB(db);
}
