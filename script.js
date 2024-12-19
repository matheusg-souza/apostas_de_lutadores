// Variáveis Globais
let lutadores = [];
let apostas = [];
let vencedor = null;

// Atualizar a lista de lutadores no select
function atualizarLutadores() {
    const select = document.getElementById("lutadorApostado");
    const selectVencedor = document.getElementById("selectVencedor");

    select.innerHTML = '<option value="">Selecione um Lutador</option>';
    selectVencedor.innerHTML = '<option value="">Selecione um Lutador</option>';

    lutadores.forEach(lutador => {
        const optionAposta = document.createElement("option");
        optionAposta.value = lutador;
        optionAposta.textContent = lutador;
        select.appendChild(optionAposta);

        const optionVencedor = document.createElement("option");
        optionVencedor.value = lutador;
        optionVencedor.textContent = lutador;
        selectVencedor.appendChild(optionVencedor);
    });
}

// Cadastrar Lutadores
document.getElementById("btnCadastrarLuta").addEventListener("click", () => {
    const lutador1 = document.getElementById("lutador1").value.trim();
    const lutador2 = document.getElementById("lutador2").value.trim();

    if (lutador1 && lutador2) {
        lutadores = [lutador1, lutador2];
        document.getElementById("lutaAtual").textContent = `Luta cadastrada: ${lutador1} vs ${lutador2}`;
        atualizarLutadores();
    } else {
        alert("Por favor, preencha os nomes dos dois lutadores!");
    }
});

// Apostar
document.getElementById("btnApostar").addEventListener("click", () => {
    const nome = document.getElementById("nomeApostador").value.trim();
    const valor = parseFloat(document.getElementById("valorAposta").value);
    const lutador = document.getElementById("lutadorApostado").value;

    if (nome && valor > 0 && lutador) {
        apostas.push({ nome, valor, lutador });
        const lista = document.getElementById("listaApostas");
        const apostaItem = document.createElement("div");
        apostaItem.innerHTML = `<strong>${nome}</strong> apostou R$${valor.toFixed(2)} em ${lutador}`;
        lista.appendChild(apostaItem);

        // Atualizar o saldo total de apostas
        atualizarSaldoTotal();
    } else {
        alert("Preencha todos os campos para apostar!");
    }
});


// Atualizar saldo total de apostas
function atualizarSaldoTotal() {
    const totalLutador1 = apostas
        .filter(a => a.lutador === lutadores[0])
        .reduce((sum, a) => sum + a.valor, 0);

    const totalLutador2 = apostas
        .filter(a => a.lutador === lutadores[1])
        .reduce((sum, a) => sum + a.valor, 0);

    const lista = document.getElementById("listaApostas");
    let saldoDiv = document.getElementById("saldoTotalApostas");

    if (!saldoDiv) {
        saldoDiv = document.createElement("div");
        saldoDiv.id = "saldoTotalApostas";
        saldoDiv.style.marginTop = "10px"; // Adicione espaço entre as apostas e o total
        saldoDiv.style.fontWeight = "bold"; // Destaque visual
        lista.appendChild(saldoDiv);
    }

    saldoDiv.innerHTML = `
        Total apostado: 
        ${lutadores[0]}: R$${totalLutador1.toFixed(2)} vs 
        ${lutadores[1]}: R$${totalLutador2.toFixed(2)}
    `;

    // Reposicionar no final da lista
    lista.appendChild(saldoDiv);
}


// Escolher o vencedor
document.getElementById("btnSimularLuta").addEventListener("click", () => {
    const selectVencedor = document.getElementById("selectVencedor");
    vencedor = selectVencedor.value;

    if (!vencedor) {
        alert("Selecione um vencedor para finalizar a luta!");
        return;
    }

    document.getElementById("resultadoLuta").textContent = `Resultado: ${vencedor} venceu!`;

    const totalApostado = apostas.reduce((sum, a) => sum + a.valor, 0);
    const ganhadores = apostas.filter(a => a.lutador === vencedor);

    if (ganhadores.length > 0) {
        const totalGanhadores = ganhadores.reduce((sum, g) => sum + g.valor, 0);
        const premioPorReal = (totalApostado * 0.8) / totalGanhadores; // Casa retém 20%

        const premiosDiv = document.getElementById("premiosDistribuidos");
        premiosDiv.innerHTML = "<h4>Prêmios:</h4>";

        ganhadores.forEach(g => {
            const premio = g.valor * premioPorReal;
            const premioItem = document.createElement("div");
            premioItem.textContent = `${g.nome} ganhou R$${premio.toFixed(2)}`;
            premiosDiv.appendChild(premioItem);
        });
    } else {
        document.getElementById("premiosDistribuidos").textContent = "Nenhum ganhador! A casa fica com todo o dinheiro.";
    }
});
