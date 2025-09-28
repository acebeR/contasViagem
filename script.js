// Variáveis globais
let pessoas = [];
let despesas = [];
let indexEditando = -1; // -1 = modo "adicionar"

// Elementos do DOM
const numPessoasInput = document.getElementById('numPessoas');
const gerarCamposBtn = document.getElementById('gerarCampos');
const camposNomesForm = document.getElementById('camposNomes');
const adicionarDespesaForm = document.getElementById('adicionarDespesa');
const resumoDiv = document.getElementById('resumo');
const listaDespesasDiv = document.getElementById('listaDespesas');
const pagadorSelect = document.getElementById('pagador');
const participantesDiv = document.getElementById('participantes');

// Geração dos campos de nomes
gerarCamposBtn.addEventListener('click', () => {
  const num = parseInt(numPessoasInput.value);
  if (isNaN(num) || num < 1 || num > 10) {
    alert('Digite um número entre 1 e 10');
    return;
  }

  pessoas = [];
  despesas = [];
  camposNomesForm.innerHTML = '';
  resumoDiv.innerHTML = '';
  listaDespesasDiv.innerHTML = '';
  adicionarDespesaForm.style.display = 'none';
  camposNomesForm.style.display = 'block';

  for (let i = 1; i <= num; i++) {
    const label = document.createElement('label');
    label.textContent = `Nome da pessoa ${i}:`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `pessoa${i}`;
    input.name = `pessoa${i}`;
    input.placeholder = `Pessoa ${i}`;
    input.required = true;

    camposNomesForm.appendChild(label);
    camposNomesForm.appendChild(input);
  }

  const btnSalvar = document.createElement('button');
  btnSalvar.type = 'button';
  btnSalvar.id = 'salvarNomes';
  btnSalvar.textContent = 'Salvar nomes';
  camposNomesForm.appendChild(btnSalvar);

  btnSalvar.addEventListener('click', () => {
    const novosNomes = [];
    for (let i = 1; i <= num; i++) {
      const val = document.getElementById(`pessoa${i}`).value.trim();
      if (!val) {
        alert(`Preencha o nome da pessoa ${i}`);
        return;
      }
      novosNomes.push(val);
    }

    pessoas = novosNomes;
    localStorage.setItem('pessoas', JSON.stringify(pessoas));

    alert('Nomes salvos! Agora você pode adicionar despesas.');

    adicionarDespesaForm.style.display = 'block';
    atualizarPagadorParticipantes();
    mostrarTabelaDividas();
    mostrarListaDespesas();
  });
});

function atualizarPagadorParticipantes() {
  pagadorSelect.innerHTML = '';
  participantesDiv.innerHTML = '';

  pessoas.forEach((nome, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = nome;
    pagadorSelect.appendChild(option);

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `part${i}`;
    checkbox.value = i;
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${nome}`));

    participantesDiv.appendChild(label);
  });
}

// Adicionar ou Editar despesa
document.getElementById('btnAdicionarDespesa').addEventListener('click', () => {
  const descricao = document.getElementById('descricao').value.trim();
  const pagadorIdx = parseInt(pagadorSelect.value);
  const valor = parseFloat(document.getElementById('valor').value);
  const participantesChecked = Array.from(participantesDiv.querySelectorAll('input[type=checkbox]:checked')).map(cb => parseInt(cb.value));

  if (!descricao || isNaN(pagadorIdx) || isNaN(valor) || valor <= 0 || participantesChecked.length === 0) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const novaDespesa = {
    descricao,
    pagador: pagadorIdx,
    valor,
    participantes: participantesChecked,
  };

  if (indexEditando >= 0) {
    despesas[indexEditando] = novaDespesa;
    indexEditando = -1;
    alert('Despesa editada com sucesso!');
  } else {
    despesas.push(novaDespesa);
    alert('Despesa adicionada com sucesso!');
  }

  localStorage.setItem('despesas', JSON.stringify(despesas));

  // Limpa campos
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  participantesDiv.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true);

  mostrarTabelaDividas();
  mostrarListaDespesas();
});

// Mostrar tabela de dívidas
function mostrarTabelaDividas() {
  if (pessoas.length === 0) {
    resumoDiv.innerHTML = '<p>Nenhuma pessoa cadastrada.</p>';
    return;
  }

  if (despesas.length === 0) {
    resumoDiv.innerHTML = '<p>Nenhuma despesa cadastrada.</p>';
    return;
  }

  const dividas = Array.from({ length: pessoas.length }, () => Array(pessoas.length).fill(0));

  despesas.forEach(desp => {
    const valorPorPessoa = desp.valor / desp.participantes.length;
    desp.participantes.forEach(part => {
      if (part !== desp.pagador) {
        dividas[part][desp.pagador] += valorPorPessoa;
      }
    });
  });

  let html = '<table><thead><tr><th>Devedor \\ Credor</th>';
  pessoas.forEach(nome => html += `<th>${nome}</th>`);
  html += '</tr></thead><tbody>';

  pessoas.forEach((nomeDevedor, i) => {
    html += `<tr><th>${nomeDevedor}</th>`;
    pessoas.forEach((_, j) => {
      html += `<td>${i === j ? '-' : (dividas[i][j] > 0 ? `R$ ${dividas[i][j].toFixed(2)}` : '-')}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  resumoDiv.innerHTML = html;
}

// Mostrar lista de despesas
function mostrarListaDespesas() {
  if (despesas.length === 0) {
    listaDespesasDiv.innerHTML = '<p>Nenhuma despesa registrada.</p>';
    return;
  }

  let html = '<h2>Despesas</h2><ul>';
  despesas.forEach((desp, index) => {
    const participantesNomes = desp.participantes.map(i => pessoas[i]).join(', ');
    html += `
      <li>
        <strong>${desp.descricao}</strong> - 
        Pagador: ${pessoas[desp.pagador]}, 
        Valor: R$ ${desp.valor.toFixed(2)}, 
        Participantes: ${participantesNomes}
        <button onclick="editarDespesa(${index})">Editar</button>
        <button onclick="excluirDespesa(${index})">Excluir</button>
      </li>
    `;
  });
  html += '</ul>';

  listaDespesasDiv.innerHTML = html;
}

// Editar despesa
function editarDespesa(index) {
  const desp = despesas[index];
  document.getElementById('descricao').value = desp.descricao;
  pagadorSelect.value = desp.pagador;
  document.getElementById('valor').value = desp.valor;
  participantesDiv.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = desp.participantes.includes(parseInt(cb.value));
  });

  indexEditando = index;
  window.scrollTo(0, 0);
}

// Excluir despesa
function excluirDespesa(index) {
  if (confirm('Deseja excluir esta despesa?')) {
    despesas.splice(index, 1);
    localStorage.setItem('despesas', JSON.stringify(despesas));
    mostrarTabelaDividas();
    mostrarListaDespesas();
  }
}

// Carregar dados do localStorage ao iniciar
window.addEventListener('load', () => {
  const pessoasSalvas = localStorage.getItem('pessoas');
  const despesasSalvas = localStorage.getItem('despesas');

  if (pessoasSalvas) {
    pessoas = JSON.parse(pessoasSalvas);
    numPessoasInput.value = pessoas.length;
    camposNomesForm.innerHTML = '';
    camposNomesForm.style.display = 'block';
    adicionarDespesaForm.style.display = 'block';

    pessoas.forEach((nome, i) => {
      const label = document.createElement('label');
      label.textContent = `Nome da pessoa ${i + 1}:`;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `pessoa${i + 1}`;
      input.name = `pessoa${i + 1}`;
      input.value = nome;
      input.required = true;

      camposNomesForm.appendChild(label);
      camposNomesForm.appendChild(input);
    });

    const btnSalvar = document.createElement('button');
    btnSalvar.type = 'button';
    btnSalvar.id = 'salvarNomes';
    btnSalvar.textContent = 'Salvar nomes';
    camposNomesForm.appendChild(btnSalvar);

    btnSalvar.addEventListener('click', () => {
      const novosNomes = [];
      for (let i = 1; i <= pessoas.length; i++) {
        const val = document.getElementById(`pessoa${i}`).value.trim();
        if (!val) {
          alert(`Preencha o nome da pessoa ${i}`);
          return;
        }
        novosNomes.push(val);
      }
      pessoas = novosNomes;
      localStorage.setItem('pessoas', JSON.stringify(pessoas));
      alert('Nomes salvos!');
      atualizarPagadorParticipantes();
      mostrarTabelaDividas();
      mostrarListaDespesas();
    });

    atualizarPagadorParticipantes();
  }

  if (despesasSalvas) {
    despesas = JSON.parse(despesasSalvas);
  }

  mostrarTabelaDividas();
  mostrarListaDespesas();
});
