export function atualizarFormulario(pessoas) {
  const pagador = document.getElementById('pagador');
  const participantes = document.getElementById('participantes');

  pagador.innerHTML = '';
  participantes.innerHTML = '';

  pessoas.forEach((nome, i) => {
    pagador.innerHTML += `<option value="${i}">${nome}</option>`;
    participantes.innerHTML += `
      <label>
        <input type="checkbox" value="${i}" checked> ${nome}
      </label>
    `;
  });
}

export function listarDespesas(pessoas, despesas, onEditar, onExcluir) {
  const div = document.getElementById('listaDespesas');

  if (!despesas.length) {
    div.innerHTML = '<p>Nenhuma despesa.</p>';
    return;
  }

  div.innerHTML = '<ul>' + despesas.map((d, i) => `
    <li>
      <strong>${d.descricao}</strong> - ${pessoas[d.pagador]} - R$ ${d.valor.toFixed(2)}
      <button data-e="${i}">Editar</button>
      <button data-x="${i}">Excluir</button>
    </li>
  `).join('') + '</ul>';

  div.querySelectorAll('[data-e]').forEach(b =>
    b.onclick = () => onEditar(b.dataset.e)
  );
  div.querySelectorAll('[data-x]').forEach(b =>
    b.onclick = () => onExcluir(b.dataset.x)
  );
}
