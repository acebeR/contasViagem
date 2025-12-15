// app-controller.js
import { getPessoas, carregarPessoas, setPessoas } from '../model/pessoas-model.js';
import { getDespesas, carregarDespesas, salvarDespesa, editarDespesa, excluirDespesa, calcularDividas, setDespesas } from '../model/despesas-model.js';
import { renderCamposNomes } from '../view/pessoas-view.js';
import { atualizarFormulario, listarDespesas } from '../view/despesas-view.js';
import { renderResumo } from '../view/resumo-view.js';

const btnBaixarJSON = document.getElementById('btnBaixarJSON');
const btnImportarJSON = document.getElementById('btnImportarJSON');
const importarJSONInput = document.getElementById('importarJSON');

let editarIndex = null; // índice da despesa que está sendo editada

export async function iniciarApp() {
  // ----------------- LIMPAR CACHE AO INICIAR -----------------
  await setPessoas([]);
  await setDespesas([]);
  window.localStorage.clear();
  window.sessionStorage.clear();

  // Carregar dados
  carregarPessoas();
  carregarDespesas();

  // ----------------- EVENTO GERAR CAMPOS -----------------
  document.getElementById('gerarCampos').onclick = () => {
    const qtd = +document.getElementById('numPessoas').value;
    renderCamposNomes(document.getElementById('camposNomes'), qtd, async (nomes) => {
      await setPessoas(nomes);
      document.getElementById('adicionarDespesa').style.display = 'block';
      atualizar();
    });
  };

  // ----------------- EVENTO ADICIONAR/EDITAR DESPESA -----------------
  document.getElementById('btnAdicionarDespesa').onclick = async () => {
    const descricao = document.getElementById('descricao').value.trim();
    const valor = +document.getElementById('valor').value;
    const pagador = +document.getElementById('pagador').value;
    const participantes = [...document.querySelectorAll('#participantes input:checked')].map(i => +i.value);

    if (editarIndex !== null) {
      await editarDespesa(editarIndex, { descricao, valor, pagador, participantes });
      editarIndex = null; // limpa modo edição
    } else {
      await salvarDespesa({ descricao, valor, pagador, participantes });
    }

    // Limpa campos
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.querySelectorAll('#participantes input').forEach(i => i.checked = true);
    document.getElementById('pagador').selectedIndex = 0;

    atualizar();
  };

  atualizar();
}

// ----------------- FUNÇÃO ATUALIZAR -----------------
function atualizar() {
  const pessoas = getPessoas();
  const despesas = getDespesas();

  if (!editarIndex && pessoas.length) atualizarFormulario(pessoas);

  listarDespesas(pessoas, despesas,
    i => carregarDespesaParaEditar(i),
    i => { excluirDespesa(i); atualizar(); }
  );

  renderResumo(pessoas, calcularDividas(pessoas));
}

// ----------------- CARREGAR DESPESA PARA EDITAR -----------------
async function carregarDespesaParaEditar(i) {
  const d = getDespesas()[i];
  if (!d) return;

  editarIndex = i;

  const pessoas = getPessoas();
  if (!pessoas.length) {
    alert('Primeiro gere os campos de pessoas antes de editar a despesa!');
    return;
  }

  // Atualiza o formulário
  document.getElementById('descricao').value = d.descricao;
  document.getElementById('valor').value = d.valor;

  // Atualiza pagador
  const pagadorSelect = document.getElementById('pagador');
  pagadorSelect.innerHTML = '';
  pessoas.forEach((nome, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = nome;
    pagadorSelect.appendChild(opt);
  });
  pagadorSelect.value = d.pagador;

  // Atualiza participantes
  const participantesDiv = document.getElementById('participantes');
  participantesDiv.innerHTML = '';
  pessoas.forEach((nome, idx) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = idx;
    input.checked = d.participantes.includes(idx);
    label.appendChild(input);
    label.append(` ${nome}`);
    participantesDiv.appendChild(label);
  });

  document.getElementById('adicionarDespesa').style.display = 'block';
}

// ----------------- BOTÃO BAIXAR JSON -----------------
btnBaixarJSON.onclick = () => {
  const db = {
    pessoas: getPessoas(),
    despesas: getDespesas()
  };

  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'controle-despesas.json';
  a.click();

  URL.revokeObjectURL(url);
};

// ----------------- BOTÃO IMPORTAR JSON -----------------
btnImportarJSON.onclick = () => {
  importarJSONInput.click();
};

importarJSONInput.onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const db = JSON.parse(text);

    if (db.pessoas && Array.isArray(db.pessoas)) {
      await setPessoas(db.pessoas);
    }

    if (db.despesas && Array.isArray(db.despesas)) {
      await setDespesas(db.despesas);
    }

    atualizar();
    alert('JSON importado com sucesso!');
  } catch (err) {
    alert('Erro ao importar JSON: ' + err.message);
  } finally {
    importarJSONInput.value = ''; // limpa input
  }
};
