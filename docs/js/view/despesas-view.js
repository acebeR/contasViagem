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

  div.innerHTML = '<ul>' + despesas.map((d, i) => {
    if (!d) return '';

    const nomesParticipantes = d.participantes.map(idx => pessoas[idx]).join(', ');

    return `
      <li>
        <strong>${d.descricao}</strong> - ${pessoas[d.pagador]} pagou. 
        Participantes: ${nomesParticipantes} - R$ ${d.valor.toFixed(2)}
        <button data-e="${i}">Editar</button>
        <button data-x="${i}">Excluir</button>
      </li>
    `;
  }).join('') + '</ul>';

  div.querySelectorAll('[data-e]').forEach(b =>
    b.onclick = () => {
      const idx = +b.dataset.e;
      if (despesas[idx]) onEditar(idx);
    }
  );


  div.querySelectorAll('[data-x]').forEach(b =>
    b.onclick = () => {
      const idx = +b.dataset.x;
      if (despesas[idx]) onExcluir(idx);
    }
  );
}

