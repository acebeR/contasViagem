export function renderCamposNomes(form, quantidade, onSalvar) {
  form.innerHTML = '<h2>Participantes</h2>';
  form.style.display = 'block';

  for (let i = 1; i <= quantidade; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'campo-form';

    const label = document.createElement('label');
    label.textContent = `Nome da pessoa ${i}:`;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `pessoa${i}`;
    input.placeholder = `Ex: Pessoa ${i}`;
    input.required = true;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Salvar nomes';

  btn.onclick = () => {
    const nomes = [];
    for (let i = 1; i <= quantidade; i++) {
      const val = document.getElementById(`pessoa${i}`).value.trim();
      if (!val) {
        alert(`Preencha o nome da pessoa ${i}`);
        return;
      }
      nomes.push(val);
    }
    onSalvar(nomes);
  };

  form.appendChild(btn);
}
