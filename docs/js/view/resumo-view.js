export function renderResumo(pessoas, dividas) {
  const div = document.getElementById('resumo');

  if (!pessoas.length || !dividas.length) {
    div.innerHTML = '<p>Nenhum dado.</p>';
    return;
  }

  let html = '<table><tr><th></th>';
  pessoas.forEach(p => html += `<th>${p}</th>`);
  html += '</tr>';

  pessoas.forEach((p, i) => {
    html += `<tr><th>${p}</th>`;
    pessoas.forEach((_, j) => {
      html += `<td>${i === j ? '-' : dividas[i][j].toFixed(2)}</td>`;
    });
    html += '</tr>';
  });

  html += '</table>';
  div.innerHTML = html;
}
