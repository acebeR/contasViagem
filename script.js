let pessoas = [];
let despesas = [];

// Gera campos para nomes
function gerarCampos() {
  const form = document.getElementById('form-nomes');
  const quantidade = parseInt(document.getElementById('quantidade').value);
  form.innerHTML = '';

  if (quantidade < 1 || quantidade > 10) {
    alert('Por favor, escolha um número entre 1 e 10');
    return;
  }

  for (let i = 1; i <= quantidade; i++) {
    const label = document.createElement('label');
    label.textContent = `Nome da pessoa ${i}:`;
    label.htmlFor = `pessoa${i}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `pessoa${i}`;
    input.name = `pessoa${i}`;
    input.required = true;

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(document.createElement('br'));
  }
}

// Salva nomes e atualiza selects e checkboxes
function salvarNomes() {
  const form = document.getElementById('form-nomes');
  const inputs = form.querySelectorAll('input[type="text"]');
  pessoas = [];

  for (const input of inputs) {
    if (input.value.trim() === '') {
      alert('Por favor, preencha todos os nomes');
      return;
    }
    pessoas.push(input.value.trim());
  }

  salvarNoStorage('pessoas', pessoas);
  carregarParticipantes();
  carregarPagador();
  mostrarDespesas();
  mostrarTabelaDividas();
  alert('Nomes salvos com sucesso!');
}

// Carrega checkbox dos participantes
function carregarParticipantes() {
  const div = document.getElementById('participantes');
  div.innerHTML = '';

  pessoas.forEach((nome, i) => {
    const label = document.createElement('label');
    label.style.marginRight = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = i;
    checkbox.name = 'participante';
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(nome));
    div.appendChild(label);
  });
}

// Carrega select de pagador
function carregarPagador() {
  const select = document.getElementById('pagador');
  select.innerHTML = '';

  pessoas.forEach((nome, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = nome;
    select.appendChild(option);
  });
}

// Adiciona despesa
function adicionarDespesa() {
  const descricao = document.getElementById('descricao').value.trim();
  const pagadorIndex = document.getElementById('pagador').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const checkboxes = document.querySelectorAll('input[name="participante"]:checked');

  if (!descricao) {
    alert('Informe a descrição da despesa.');
    return;
  }
  if (isNaN(valor) || valor <= 0) {
    alert('Informe um valor válido maior que zero.');
    return;
  }
  if (checkboxes.length === 0) {
    alert('Selecione pelo menos um participante.');
    return;
  }

  // Participantes que vão dividir a despesa
  const participantes = Array.from(checkboxes).map(cb => parseInt(cb.value));

  const despesa = {
    descricao,
    pagador: parseInt(pagadorIndex),
    valor,
    participantes,
  };

  despesas.push(despesa);
  salvarNoStorage('despesas', despesas);

  // Limpar campos
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  checkboxes.forEach(cb => (cb.checked = true));
  document.getElementById('pagador').selectedIndex = 0;

  mostrarDespesas();
  mostrarTabelaDividas();
}

// Mostra lista de despesas
function mostrarDespesas() {
  const lista = document.getElementById('lista-despesas');
  lista.innerHTML = '';

  despesas.forEach((d, i) => {
    const li = document.createElement('li');
    const nomesParticipantes = d.participantes.map(i => pessoas[i]).join(', ');
    li.textContent = `${d.descricao}: ${pessoas[d.pagador]} pagou R$ ${d.valor.toFixed(2)} (dividido entre ${nomesParticipantes})`;

    // Botão para remover despesa
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'X';
    btnRemover.style.marginLeft = '10px';
    btnRemover.onclick = () => {
      despesas.splice(i, 1);
      salvarNoStorage('despesas', despesas);
      mostrarDespesas();
      mostrarTabelaDividas();
    };

    li.appendChild(btnRemover);
    lista.appendChild(li);
  });
}
function calcularDividasDetalhadas() {
    if (pessoas.length === 0) return '';
  
    // Inicializa matriz de dívidas: quem deve (linha) para quem (coluna)
    const dividas = {};
    pessoas.forEach(devedor => {
      dividas[devedor] = {};
      pessoas.forEach(credor => {
        dividas[devedor][credor] = 0;
      });
    });
  
    despesas.forEach(d => {
      const valorPorPessoa = d.valor / d.participantes.length;
      const pagadorNome = pessoas[d.pagador];
  
      d.participantes.forEach(i => {
        const participanteNome = pessoas[i];
        if (i !== d.pagador) {
          // Participante deve sua parte para o pagador
          dividas[participanteNome][pagadorNome] += valorPorPessoa;
        }
      });
    });
  
    return dividas;
  }
  
  function mostrarTabelaDividas() {
    const dividas = calcularDividasDetalhadas();
    const container = document.getElementById('resumo');
    container.innerHTML = ''; // Limpa
  
    if (!dividas) return;
  
    // Cria tabela
    const tabela = document.createElement('table');
    tabela.style.borderCollapse = 'collapse';
    tabela.style.width = '100%';
  
    // Cabeçalho
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    const thVazio = document.createElement('th');
    thVazio.textContent = 'Quem deve → / Para ↓';
    thVazio.style.border = '1px solid #ddd';
    thVazio.style.padding = '8px';
    headerRow.appendChild(thVazio);
  
    pessoas.forEach(nome => {
      const th = document.createElement('th');
      th.textContent = nome;
      th.style.border = '1px solid #ddd';
      th.style.padding = '8px';
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    tabela.appendChild(thead);
  
    // Corpo da tabela
    const tbody = document.createElement('tbody');
  
    pessoas.forEach(devedor => {
      const tr = document.createElement('tr');
  
      const tdDevedor = document.createElement('td');
      tdDevedor.textContent = devedor;
      tdDevedor.style.border = '1px solid #ddd';
      tdDevedor.style.padding = '8px';
      tr.appendChild(tdDevedor);
  
      pessoas.forEach(credor => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ddd';
        td.style.padding = '8px';
        const valor = dividas[devedor][credor];
        td.textContent = valor > 0 ? `R$ ${valor.toFixed(2)}` : '-';
        td.style.textAlign = 'center';
        tr.appendChild(td);
      });
  
      tbody.appendChild(tr);
    });
  
    tabela.appendChild(tbody);
    container.appendChild(tabela);
  }
  
// Calcula quanto cada um deve ou recebe
function calcularResumo() {
  const resumo = document.getElementById('resumo');
  resumo.innerHTML = '';

  if (pessoas.length === 0) return;

  // Inicializa objeto para armazenar saldo de cada pessoa
  // saldo positivo = a receber, negativo = deve
  const saldos = {};
  pessoas.forEach(nome => saldos[nome] = 0);

  despesas.forEach(d => {
    const valorPorPessoa = d.valor / d.participantes.length;

    d.participantes.forEach(i => {
      const nome = pessoas[i];
      if (i === d.pagador) {
        // pagador pagou para si mesmo (não deve nada)
        saldos[nome] += d.valor - valorPorPessoa; 
        // pagador pagou o total, mas deve a sua parte, logo recebe a diferença
      } else {
        // os outros participantes devem a sua parte (valorPorPessoa)
        saldos[nome] -= valorPorPessoa;
      }
    });
  });

  // Mostrar na tela
  for (const [nome, saldo] of Object.entries(saldos)) {
    const li = document.createElement('li');
    if (saldo > 0) {
      li.textContent = `${nome} deve receber R$ ${saldo.toFixed(2)}`;
      li.style.color = 'green';
    } else if (saldo < 0) {
      li.textContent = `${nome} deve pagar R$ ${(-saldo).toFixed(2)}`;
      li.style.color = 'red';
    } else {
      li.textContent = `${nome} está quites`;
      li.style.color = 'gray';
    }
    resumo.appendChild(li);
  }
}

// Salva dados no localStorage
function salvarNoStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// Carrega dados do localStorage
function carregarDoStorage() {
  const pessoasSalvas = JSON.parse(localStorage.getItem('pessoas'));
  const despesasSalvas = JSON.parse(localStorage.getItem('despesas'));

  if (pessoasSalvas) {
    pessoas = pessoasSalvas;
    carregarParticipantes();
    carregarPagador();
  }

  if (despesasSalvas) {
    despesas = despesasSalvas;
  }

  mostrarDespesas();
  mostrarTabelaDividas();
}

// Ao carregar a página, carrega dados do localStorage
window.onload = () => {
    carregarDoStorage();
};
  