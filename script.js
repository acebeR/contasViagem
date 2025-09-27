// Variáveis globais
let pessoas = [];
let despesas = [];

// Pega elementos do DOM
const numPessoasInput = document.getElementById('numPessoas');
const gerarCamposBtn = document.getElementById('gerarCampos');
const camposNomesForm = document.getElementById('camposNomes');
const adicionarDespesaForm = document.getElementById('adicionarDespesa');
const resumoDiv = document.getElementById('resumo');
const pagadorSelect = document.getElementById('pagador');
const participantesDiv = document.getElementById('participantes');


// Evento para gerar campos de nome
gerarCamposBtn.addEventListener('click', () => {
  const num = parseInt(numPessoasInput.value);
  if (isNaN(num) || num < 1 || num > 10) {
    alert('Digite um número entre 1 e 10');
    return;
  }

  pessoas = []; // limpa lista
  despesas = []; // limpa despesas também

  camposNomesForm.style.display = 'block';
  adicionarDespesaForm.style.display = 'none';
  resumoDiv.innerHTML = '';

  // Limpa campos anteriores
  camposNomesForm.innerHTML = '';

  // Gera inputs para nomes
  for (let i = 1; i <= num; i++) {
    const label = document.createElement('label');
    label.textContent = `Nome da pessoa ${i}:`;
    label.htmlFor = `pessoa${i}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `pessoa${i}`;
    input.name = `pessoa${i}`;
    input.placeholder = `Pessoa ${i}`;
    input.required = true;

    camposNomesForm.appendChild(label);
    camposNomesForm.appendChild(input);
  }

  // Botão salvar nomes
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

    // Mostra o formulário de adicionar despesas
    adicionarDespesaForm.style.display = 'block';

    // Limpa campos do formulário de despesas
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';

    atualizarPagadorParticipantes(pessoas);
    mostrarTabelaDividas();
  });
});


// Atualiza select pagador e checkboxes participantes
function atualizarPagadorParticipantes(pessoas) {
  pagadorSelect.innerHTML = '';
  participantesDiv.innerHTML = '';

  pessoas.forEach((nome, i) => {
    // Select pagador
    const option = document.createElement('option');
    option.value = i;
    option.textContent = nome;
    pagadorSelect.appendChild(option);

    // Checkbox participantes
    const label = document.createElement('label');
    label.htmlFor = `part${i}`;

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


// Evento adicionar despesa
document.getElementById('btnAdicionarDespesa').addEventListener('click', () => {
  const descricao = document.getElementById('descricao').value.trim();
  const pagadorIdx = parseInt(pagadorSelect.value);
  const valor = parseFloat(document.getElementById('valor').value);
  const participantesChecked = Array.from(participantesDiv.querySelectorAll('input[type=checkbox]:checked')).map(c => parseInt(c.value));

  if (!descricao) {
    alert('Digite uma descrição da despesa');
    return;
  }
  if (isNaN(pagadorIdx) || pagadorIdx < 0) {
    alert('Escolha quem pagou');
    return;
  }
  if (isNaN(valor) || valor <= 0) {
    alert('Digite um valor válido');
    return;
  }
  if (participantesChecked.length === 0) {
    alert('Selecione pelo menos um participante');
    return;
  }

  despesas.push({
    descricao,
    pagador: pagadorIdx,
    valor,
    participantes: participantesChecked,
  });

  localStorage.setItem('despesas', JSON.stringify(despesas));

  alert('Despesa adicionada com sucesso!');

  // Limpa campos
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';

  mostrarTabelaDividas();
});


// Função que calcula as dívidas e mostra tabela
function mostrarTabelaDividas() {
  if (pessoas.length === 0) {
    resumoDiv.innerHTML = '<p>Nenhuma pessoa cadastrada.</p>';
    return;
  }

  if (despesas.length === 0) {
    resumoDiv.innerHTML = '<p>Nenhuma despesa cadastrada.</p>';
    return;
  }

  // Matriz para armazenar quanto cada pessoa deve para outra
  // dividas[devedor][credor] = valor
  const dividas = [];
  for (let i = 0; i < pessoas.length; i++) {
    dividas[i] = [];
    for (let j = 0; j < pessoas.length; j++) {
      dividas[i][j] = 0;
    }
  }

  // Calcula as dívidas com base nas despesas
  despesas.forEach(desp => {
    const valorPorPessoa = desp.valor / desp.participantes.length;
    desp.participantes.forEach(part => {
      if (part !== desp.pagador) {
        dividas[part][desp.pagador] += valorPorPessoa;
      }
    });
  });

  // Monta a tabela HTML
  let html = '<table><thead><tr><th>Devedor \\ Credor</th>';
  pessoas.forEach(nome => {
    html += `<th>${nome}</th>`;
  });
  html += '</tr></thead><tbody>';

  pessoas.forEach((nomeDevedor, i) => {
    html += `<tr><th>${nomeDevedor}</th>`;
    pessoas.forEach((nomeCredor, j) => {
      if (i === j) {
        html += '<td style="background:#eee;">-</td>';
      } else {
        const valor = dividas[i][j];
        html += `<td>${valor > 0 ? 'R$ ' + valor.toFixed(2) : '-'}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';

  resumoDiv.innerHTML = html;
}


// Ao carregar a página, tenta carregar dados do localStorage
window.addEventListener('load', () => {
  const pessoasSalvas = localStorage.getItem('pessoas');
  const despesasSalvas = localStorage.getItem('despesas');

  if (pessoasSalvas) {
    pessoas = JSON.parse(pessoasSalvas);
    // Preenche camposNomes com os nomes (exibe os campos)
    numPessoasInput.value = pessoas.length;
    camposNomesForm.style.display = 'block';
    adicionarDespesaForm.style.display = 'block';

    // Gera os inputs com os nomes preenchidos
    camposNomesForm.innerHTML = '';
    pessoas.forEach((nome, i) => {
      const label = document.createElement('label');
      label.textContent = `Nome da pessoa ${i + 1}:`;
      label.htmlFor = `pessoa${i + 1}`;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `pessoa${i + 1}`;
      input.name = `pessoa${i + 1}`;
      input.value = nome;
      input.required = true;

      camposNomesForm.appendChild(label);
      camposNomesForm.appendChild(input);
    });

    // Botão salvar nomes
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
      atualizarPagadorParticipantes(pessoas);
      mostrarTabelaDividas();
    });

    atualizarPagadorParticipantes(pessoas);
  }

  if (despesasSalvas) {
    despesas = JSON.parse(despesasSalvas);
  }

  mostrarTabelaDividas();
});
