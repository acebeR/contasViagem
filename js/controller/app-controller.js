import { carregarPessoas, setPessoas, getPessoas } from '../model/pessoas-model.js';
import {
  carregarDespesas,
  getDespesas,
  salvarDespesa,
  iniciarEdicao,
  excluirDespesa,
  calcularDividas
} from '../model/despesas-model.js';

import { renderCamposNomes } from '../view/pessoas-view.js';
import { atualizarFormulario, listarDespesas } from '../view/despesas-view.js';
import { renderResumo } from '../view/resumo-view.js';

export function iniciarApp() {
  carregarPessoas();
  carregarDespesas();

  document.getElementById('gerarCampos').onclick = () => {
    const qtd = Number(document.getElementById('numPessoas').value);

    renderCamposNomes(
      document.getElementById('camposNomes'),
      qtd,
      nomes => {
        setPessoas(nomes);
        document.getElementById('adicionarDespesa').style.display = 'block';
        atualizar();
      }
    );
  };

  document.getElementById('btnAdicionarDespesa').onclick = () => {
    const descricaoInput = document.getElementById('descricao');
    const valorInput = document.getElementById('valor');
    const pagadorSelect = document.getElementById('pagador');

    const descricao = descricaoInput.value.trim();
    const valor = Number(valorInput.value);
    const pagador = Number(pagadorSelect.value);

    const participantes = Array.from(
      document.querySelectorAll('#participantes input:checked')
    ).map(cb => Number(cb.value));

    if (!descricao || valor <= 0 || participantes.length === 0) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    salvarDespesa({
      descricao,
      valor,
      pagador,
      participantes
    });

    // limpar formulário
    descricaoInput.value = '';
    valorInput.value = '';
    document
      .querySelectorAll('#participantes input')
      .forEach(cb => cb.checked = true);

    atualizar();
  };

  atualizar();
}

function atualizar() {
  const pessoas = getPessoas();
  const despesas = getDespesas();

  if (pessoas.length) {
    atualizarFormulario(pessoas);
  }

  listarDespesas(
    pessoas,
    despesas,
    index => {
      const desp = iniciarEdicao(index);

      document.getElementById('descricao').value = desp.descricao;
      document.getElementById('valor').value = desp.valor;
      document.getElementById('pagador').value = desp.pagador;

      document
        .querySelectorAll('#participantes input')
        .forEach(cb => {
          cb.checked = desp.participantes.includes(Number(cb.value));
        });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    index => {
      excluirDespesa(index);
      atualizar();
    }
  );


  renderResumo(pessoas, calcularDividas(pessoas));
}
