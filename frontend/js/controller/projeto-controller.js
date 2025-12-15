export function iniciarProjetoController() {
  const btnInfo = document.getElementById('btnInfoProjeto');
  const modal = document.getElementById('modalProjeto');
  const textarea = document.getElementById('descricaoProjeto');
  const btnSalvar = document.getElementById('salvarDescricaoProjeto');
  const btnFechar = document.getElementById('fecharModalProjeto');

  console.log('Projeto controller carregado', btnInfo, modal);

  if (!btnInfo || !modal) {
    console.error('Botão ou modal não encontrado');
    return;
  }

  btnInfo.addEventListener('click', () => {
    textarea.value = localStorage.getItem('descricaoProjeto') || '';
    modal.classList.remove('hidden');
  });

  btnFechar.addEventListener('click', () => {
    modal.classList.add('hidden');
  });


  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}
