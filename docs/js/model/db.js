export async function carregarDB() {
  const r = await fetch('http://localhost:3000/api/db', { cache: 'no-store' });
  return r.json();
}

export async function salvarDB(data) {
  await fetch('http://localhost:3000/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data, null, 2),
    cache: 'no-store'
  });
}
