const BASE_URL = 'https://contasviagemrebeca.onrender.com'; // <- URL do seu backend no Render

export async function carregarDB() {
  const r = await fetch(`${BASE_URL}/api/db`, { cache: 'no-store' });
  return r.json();
}

export async function salvarDB(data) {
  await fetch(`${BASE_URL}/api/db`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data, null, 2),
    cache: 'no-store'
  });
}
