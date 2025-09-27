function adicionarConta() {
    const input = document.getElementById("nova-conta");
    const texto = input.value.trim();
    if (texto === "") return;
  
    const lista = document.getElementById("lista-contas");
    const item = document.createElement("li");
    item.textContent = texto;
    lista.appendChild(item);
    input.value = "";
  }
  