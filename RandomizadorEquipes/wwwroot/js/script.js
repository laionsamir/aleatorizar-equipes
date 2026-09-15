const botao = document.getElementById("sortear");

const botaoApagar =
    document.getElementById("apagarEquipes");

const textarea =
    document.getElementById("pessoas");

const pessoasSul =
    document.getElementById("pessoasSul");

const pessoasNorte =
    document.getElementById("pessoasNorte");

const quantidadeSul =
    document.getElementById("quantidadeEquipesSul");

const quantidadeNorte =
    document.getElementById("quantidadeEquipesNorte");

const resultado =
    document.getElementById("resultado");

const mensagem =
    document.getElementById("mensagem");

const modoAutomatico =
    document.getElementById("modoAutomatico");

const modoManual =
    document.getElementById("modoManual");

const areaAutomatico =
    document.getElementById("areaAutomatico");

const areaManual =
    document.getElementById("areaManual");

let equipesSul = [];
let equipesNorte = [];

modoAutomatico.addEventListener(
    "change",
    () => {

        if (modoAutomatico.checked) {

            areaAutomatico.style.display =
                "block";

            areaManual.style.display =
                "none";

        }

    }
);

modoManual.addEventListener(
    "change",
    () => {

        if (modoManual.checked) {

            areaAutomatico.style.display =
                "none";

            areaManual.style.display =
                "block";

        }

    }
);

botao.addEventListener(
    "click",
    async () => {

        mensagem.textContent = "";

        resultado.innerHTML = "";

        const modo =
            modoManual.checked
                ? "manual"
                : "automatico";

        let listaSul = [];

        let listaNorte = [];

        let quantidadeEquipesSul =
            Number(quantidadeSul.value);

        let quantidadeEquipesNorte =
            Number(quantidadeNorte.value);

        if (
            quantidadeEquipesSul <= 0 ||
            quantidadeEquipesNorte <= 0
        ) {

            mensagem.textContent =
                "Informe uma quantidade válida de equipes.";

            return;
        }

        if (modo === "manual") {

            listaSul =
                pessoasSul.value
                    .split(/\r?\n/)
                    .map(nome => nome.trim())
                    .filter(nome => nome !== "");

            listaNorte =
                pessoasNorte.value
                    .split(/\r?\n/)
                    .map(nome => nome.trim())
                    .filter(nome => nome !== "");

            if (listaSul.length === 0) {

                mensagem.textContent =
                    "Digite pelo menos uma pessoa no Píer Sul.";

                return;
            }

            if (listaNorte.length === 0) {

                mensagem.textContent =
                    "Digite pelo menos uma pessoa no Píer Norte.";

                return;
            }

            if (quantidadeEquipesSul * 2 > listaSul.length) {
                mensagem.textContent =
                    `O Píer Sul precisa de no mínimo ${quantidadeEquipesSul * 2} pessoas para formar ${quantidadeEquipesSul} equipes com pelo menos 2 integrantes cada.`;
                return;
            }

            if (listaSul.length > quantidadeEquipesSul * 3) {
                const minSul = Math.ceil(listaSul.length / 3);
                mensagem.textContent =
                    `O Píer Sul tem ${listaSul.length} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos ${minSul} equipes no Sul.`;
                return;
            }

            if (quantidadeEquipesNorte * 2 > listaNorte.length) {
                mensagem.textContent =
                    `O Píer Norte precisa de no mínimo ${quantidadeEquipesNorte * 2} pessoas para formar ${quantidadeEquipesNorte} equipes com pelo menos 2 integrantes cada.`;
                return;
            }

            if (listaNorte.length > quantidadeEquipesNorte * 3) {
                const minNorte = Math.ceil(listaNorte.length / 3);
                mensagem.textContent =
                    `O Píer Norte tem ${listaNorte.length} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos ${minNorte} equipes no Norte.`;
                return;
            }

        }

        else {

            const pessoas =
                textarea.value
                    .split(/\r?\n/)
                    .map(nome => nome.trim())
                    .filter(nome => nome !== "");

            if (pessoas.length === 0) {

                mensagem.textContent =
                    "Digite pelo menos uma pessoa.";

                return;
            }

            if ((quantidadeEquipesSul + quantidadeEquipesNorte) * 2 > pessoas.length) {
                mensagem.textContent =
                    `São necessárias pelo menos ${(quantidadeEquipesSul + quantidadeEquipesNorte) * 2} pessoas para formar ${quantidadeEquipesSul + quantidadeEquipesNorte} equipes com no mínimo 2 integrantes cada.`;
                return;
            }

            if (pessoas.length > (quantidadeEquipesSul + quantidadeEquipesNorte) * 3) {
                const minTotal = Math.ceil(pessoas.length / 3);
                mensagem.textContent =
                    `Para ${pessoas.length} pessoas com no máximo 3 por equipe, configure pelo menos ${minTotal} equipes no total (Sul + Norte).`;
                return;
            }

            pessoas.sort(
                () => Math.random() - 0.5
            );

            pessoas.forEach(
                (pessoa, index) => {
                    if (index % 2 === 0) {
                        listaSul.push(pessoa);
                    }
                    else {
                        listaNorte.push(pessoa);
                    }
                }
            );

            if (quantidadeEquipesSul * 2 > listaSul.length) {
                mensagem.textContent =
                    `O Píer Sul ficou com ${listaSul.length} pessoas, mas precisa de pelo menos ${quantidadeEquipesSul * 2} para formar ${quantidadeEquipesSul} equipes com no mínimo 2 pessoas cada.`;
                return;
            }

            if (listaSul.length > quantidadeEquipesSul * 3) {
                const minSul = Math.ceil(listaSul.length / 3);
                mensagem.textContent =
                    `O Píer Sul ficou com ${listaSul.length} pessoas. Para no máximo 3 por equipe, configure pelo menos ${minSul} equipes no Sul.`;
                return;
            }

            if (quantidadeEquipesNorte * 2 > listaNorte.length) {
                mensagem.textContent =
                    `O Píer Norte ficou com ${listaNorte.length} pessoas, mas precisa de pelo menos ${quantidadeEquipesNorte * 2} para formar ${quantidadeEquipesNorte} equipes com no mínimo 2 pessoas cada.`;
                return;
            }

            if (listaNorte.length > quantidadeEquipesNorte * 3) {
                const minNorte = Math.ceil(listaNorte.length / 3);
                mensagem.textContent =
                    `O Píer Norte ficou com ${listaNorte.length} pessoas. Para no máximo 3 por equipe, configure pelo menos ${minNorte} equipes no Norte.`;
                return;
            }

        }

        try {

            const response =
                await fetch(
                    "/api/Equipes/sortear",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            modo: modo,

                            pessoas:
                                modo === "automatico"
                                    ? listaSul.concat(listaNorte)
                                    : null,

                            pessoasSul:
                                listaSul,

                            pessoasNorte:
                                listaNorte,

                            quantidadeEquipesSul:
                                quantidadeEquipesSul,

                            quantidadeEquipesNorte:
                                quantidadeEquipesNorte

                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                mensagem.textContent =
                    data.erro ||
                    "Erro ao realizar o sorteio.";

                return;
            }

            equipesSul =
                data.sul || [];

            equipesNorte =
                data.norte || [];

            mostrarResultado();

        }
        catch (error) {

            console.error(error);

            mensagem.textContent =
                "Erro ao conectar com o servidor.";

        }

    }
);

function mostrarResultado() {

    resultado.innerHTML = "";

    if (equipesSul.length > 0) {

        resultado.appendChild(
            criarBloco(
                "Píer Sul",
                equipesSul
            )
        );

    }

    if (equipesNorte.length > 0) {

        resultado.appendChild(
            criarBloco(
                "Píer Norte",
                equipesNorte
            )
        );

    }

}

function criarBloco(
    titulo,
    equipes
) {

    const bloco =
        document.createElement("div");

    bloco.classList.add("bloco");

    const tituloBloco =
        document.createElement("div");

    tituloBloco.classList.add(
        "titulo-bloco"
    );

    tituloBloco.textContent =
        titulo;

    bloco.appendChild(
        tituloBloco
    );

    equipes.forEach(
        (equipe, index) => {

            const divEquipe =
                document.createElement("div");

            divEquipe.classList.add(
                "equipe"
            );

            const titular =
                equipe.pessoas.find(
                    pessoa =>
                        pessoa.funcao === "T"
                );

            const linhaTitulo =
                document.createElement("div");

            linhaTitulo.classList.add(
                "equipe-titulo"
            );

            const nomeTitular =
                titular
                    ? titular.nome
                    : equipe.pessoas[0]?.nome;

            if (nomeTitular) {

                linhaTitulo.textContent =
                    `${index + 1}- ${nomeTitular}`;

            }

            if (titular) {

                linhaTitulo.textContent +=
                    " T";

            }

            linhaTitulo.addEventListener(
                "click",
                () => {

                    const pessoa =
                        equipe.pessoas.find(
                            p =>
                                p.nome ===
                                nomeTitular
                        );

                    if (pessoa) {

                        trocarTitular(
                            equipe,
                            pessoa
                        );

                    }

                }
            );

            divEquipe.appendChild(
                linhaTitulo
            );

            equipe.pessoas
                .filter(
                    pessoa =>
                        pessoa.nome !==
                        nomeTitular
                )
                .forEach(
                    pessoa => {

                        const divPessoa =
                            document.createElement(
                                "div"
                            );

                        divPessoa.classList.add(
                            "pessoa"
                        );

                        divPessoa.textContent =
                            pessoa.nome;

                        divPessoa.addEventListener(
                            "click",
                            () => {

                                trocarTitular(
                                    equipe,
                                    pessoa
                                );

                            }
                        );

                        divEquipe.appendChild(
                            divPessoa
                        );

                    }
                );

            bloco.appendChild(
                divEquipe
            );

        }
    );

    return bloco;
}

function trocarTitular(
    equipe,
    pessoaSelecionada
) {

    if (
        pessoaSelecionada.funcao === "T"
    ) {

        pessoaSelecionada.funcao = null;

    }

    else {

        equipe.pessoas.forEach(
            pessoa => {

                pessoa.funcao = null;

            }
        );

        pessoaSelecionada.funcao = "T";

    }

    mostrarResultado();

}

botaoApagar.addEventListener(
    "click",
    () => {

        equipesSul = [];

        equipesNorte = [];

        resultado.innerHTML = "";

        mensagem.textContent = "";

    }
);

const botaoWhatsApp =
    document.getElementById("compartilharWhatsApp");

botaoWhatsApp.addEventListener(
    "click",
    () => {

        if (
            !resultado ||
            resultado.innerText.trim() === ""
        ) {

            mensagem.textContent =
                "Faça o sorteio antes de compartilhar.";

            return;
        }

        const texto =
            gerarTextoCompartilhamento();

        const url =
            "https://wa.me/?text=" +
            encodeURIComponent(texto);

        window.open(
            url,
            "_blank"
        );

    }
);

function gerarTextoCompartilhamento() {

    const data = new Date();

    const dataFormatada =
        data.toLocaleDateString("pt-BR");

    let texto =
        `Boa tarde a todos. Segue a programação do dia ${dataFormatada}\n\n`;

    const blocos =
        resultado.querySelectorAll(".bloco");

    blocos.forEach(
        bloco => {

            const titulo =
                bloco.querySelector(
                    ".titulo-bloco"
                );

            if (titulo) {

                texto +=
                    `${titulo.innerText.toUpperCase()}\n\n`;

            }

            const equipes =
                bloco.querySelectorAll(".equipe");

            equipes.forEach(
                (equipe, index) => {

                    const tituloEquipe =
                        equipe.querySelector(
                            ".equipe-titulo"
                        );

                    if (tituloEquipe) {

                        texto +=
                            `${tituloEquipe.innerText}\n`;

                    }

                    const pessoas =
                        equipe.querySelectorAll(
                            ".pessoa"
                        );

                    pessoas.forEach(
                        pessoa => {

                            texto +=
                                `• ${pessoa.innerText}\n`;

                        }
                    );

                    texto += "\n";

                }
            );

            texto += "\n";

        }
    );

    return texto;
}

// ==============================================
// CONTROLE DE NAVEGAÇÃO ENTRE TELAS / ABAS
// ==============================================
const btnAbaEscala = document.getElementById("btnAbaEscala");
const btnAbaSorteador = document.getElementById("btnAbaSorteador");
const secaoEscala = document.getElementById("secaoEscala");
const secaoSorteador = document.getElementById("secaoSorteador");
const btnAtalhoEscala = document.getElementById("btnAtalhoEscala");

function mudarAba(abaDestino) {
    if (abaDestino === "escala") {
        btnAbaEscala.classList.add("active");
        btnAbaSorteador.classList.remove("active");
        secaoEscala.style.display = "block";
        secaoSorteador.style.display = "none";
    } else {
        btnAbaSorteador.classList.add("active");
        btnAbaEscala.classList.remove("active");
        secaoSorteador.style.display = "block";
        secaoEscala.style.display = "none";
    }
}

if (btnAbaEscala && btnAbaSorteador) {
    btnAbaEscala.addEventListener("click", () => mudarAba("escala"));
    btnAbaSorteador.addEventListener("click", () => mudarAba("sorteador"));
}

if (btnAtalhoEscala) {
    btnAtalhoEscala.addEventListener("click", () => mudarAba("escala"));
}

// ==============================================
// LEITOR DE ESCALA — LÓGICA DO CLIENTE
// ==============================================
const dataEscala = document.getElementById("dataEscala");
const consultarEscala = document.getElementById("consultarEscala");
const mensagemEscala = document.getElementById("mensagemEscala");
const containerResultadoEscala = document.getElementById("containerResultadoEscala");
const escalaTituloData = document.getElementById("escalaTituloData");
const escalaContador = document.getElementById("escalaContador");
const filtroNomeEscala = document.getElementById("filtroNomeEscala");
const filtroHorarioEscala = document.getElementById("filtroHorarioEscala");
const btnMarcarTodos = document.getElementById("btnMarcarTodos");
const btnDesmarcarTodos = document.getElementById("btnDesmarcarTodos");
const listaFuncionariosEscala = document.getElementById("listaFuncionariosEscala");
const contadorSelecionados = document.getElementById("contadorSelecionados");
const btnEnviarParaSorteador = document.getElementById("btnEnviarParaSorteador");
const alertaImportacao = document.getElementById("alertaImportacao");
const textoAlertaImportacao = document.getElementById("textoAlertaImportacao");

// Estado dos colaboradores carregados da escala
let funcionariosEscala = [];

// Sugere a data inicial (caso não esteja preenchida)
if (dataEscala && !dataEscala.value) {
    dataEscala.value = "2026-09-15";
}

async function carregarEscala() {
    if (!dataEscala || !dataEscala.value) {
        exibirMensagemEscala("Por favor, selecione uma data para consultar.", "erro");
        return;
    }

    consultarEscala.disabled = true;
    consultarEscala.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> <span>Consultando...</span>';
    exibirMensagemEscala("", "");

    try {
        const dataSelecionada = dataEscala.value;
        const resposta = await fetch(`/api/escala?data=${dataSelecionada}`);

        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => ({ erro: "Erro ao consultar a escala." }));
            throw new Error(erroData.erro || "Não foi possível carregar a escala.");
        }

        const dados = await resposta.json();

        if (!dados || dados.length === 0) {
            containerResultadoEscala.style.display = "none";
            exibirMensagemEscala("Nenhum funcionário escalado para trabalhar nesta data.", "erro");
            return;
        }

        // Mapeia para estado com selecionado = true
        funcionariosEscala = dados.map(item => ({
            ...item,
            selecionado: true
        }));

        // Atualiza título e badge
        const partesData = dataSelecionada.split("-");
        const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        escalaTituloData.textContent = `Escala de ${dataFormatada}`;
        escalaContador.textContent = `${funcionariosEscala.length} trabalhando`;

        // Preenche opções de horários no filtro
        popularFiltroHorarios(funcionariosEscala);

        // Renderiza lista de colaboradores
        renderizarListaFuncionarios();

        containerResultadoEscala.style.display = "block";
        exibirMensagemEscala("", "");

    } catch (erro) {
        console.error("Erro ao consultar escala:", erro);
        containerResultadoEscala.style.display = "none";
        exibirMensagemEscala(erro.message || "Erro inesperado ao consultar a escala.", "erro");
    } finally {
        consultarEscala.disabled = false;
        consultarEscala.innerHTML = '<i class="bi bi-search"></i> <span>Consultar escala</span>';
    }
}

function exibirMensagemEscala(texto, tipo) {
    if (!mensagemEscala) return;
    mensagemEscala.textContent = texto;
    mensagemEscala.className = "mensagem-escala";
    if (tipo) {
        mensagemEscala.classList.add(tipo);
    }
}

function popularFiltroHorarios(lista) {
    if (!filtroHorarioEscala) return;
    const horarios = [...new Set(lista.map(f => f.horario).filter(Boolean))].sort();

    filtroHorarioEscala.innerHTML = '<option value="">Todos os horários</option>';
    horarios.forEach(horario => {
        const opt = document.createElement("option");
        opt.value = horario;
        opt.textContent = horario;
        filtroHorarioEscala.appendChild(opt);
    });
}

function renderizarListaFuncionarios() {
    if (!listaFuncionariosEscala) return;

    const termoBusca = (filtroNomeEscala?.value || "").toLowerCase().trim();
    const horarioFiltro = filtroHorarioEscala?.value || "";

    listaFuncionariosEscala.innerHTML = "";

    const filtrados = funcionariosEscala.filter(f => {
        const bateNome = !termoBusca || f.nome.toLowerCase().includes(termoBusca) || f.matricula.includes(termoBusca);
        const bateHorario = !horarioFiltro || f.horario === horarioFiltro;
        return bateNome && bateHorario;
    });

    if (filtrados.length === 0) {
        listaFuncionariosEscala.innerHTML = '<p style="color: #8c9396; grid-column: 1/-1; text-align: center; padding: 25px 0;">Nenhum funcionário encontrado com os filtros aplicados.</p>';
        atualizarContadorSelecionados();
        return;
    }

    filtrados.forEach((func) => {
        const card = document.createElement("div");
        card.className = `card-funcionario ${func.selecionado ? "selecionado" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "check-func";
        checkbox.checked = func.selecionado;

        checkbox.addEventListener("change", (e) => {
            e.stopPropagation();
            func.selecionado = checkbox.checked;
            card.classList.toggle("selecionado", func.selecionado);
            atualizarContadorSelecionados();
        });

        // Clique em qualquer parte do card alterna a seleção
        card.addEventListener("click", () => {
            checkbox.checked = !checkbox.checked;
            func.selecionado = checkbox.checked;
            card.classList.toggle("selecionado", func.selecionado);
            atualizarContadorSelecionados();
        });

        const infoDiv = document.createElement("div");
        infoDiv.className = "info-func";

        const nomeEl = document.createElement("div");
        nomeEl.className = "nome-func";
        nomeEl.textContent = formatarNomeExibicao(func.nome);
        nomeEl.title = func.nome;

        const detalhesEl = document.createElement("div");
        detalhesEl.className = "detalhes-func";
        detalhesEl.innerHTML = `
            <span>Matrícula: ${func.matricula}</span>
            <span class="badge-horario">${func.horario || "Geral"}</span>
        `;

        infoDiv.appendChild(nomeEl);
        infoDiv.appendChild(detalhesEl);

        card.appendChild(checkbox);
        card.appendChild(infoDiv);

        listaFuncionariosEscala.appendChild(card);
    });

    atualizarContadorSelecionados();
}

function atualizarContadorSelecionados() {
    const totalSelecionados = funcionariosEscala.filter(f => f.selecionado).length;
    if (contadorSelecionados) {
        contadorSelecionados.textContent = totalSelecionados;
    }
    if (btnEnviarParaSorteador) {
        btnEnviarParaSorteador.disabled = totalSelecionados === 0;
    }
}

if (consultarEscala) {
    consultarEscala.addEventListener("click", carregarEscala);
}

if (dataEscala) {
    dataEscala.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            carregarEscala();
        }
    });
}

if (filtroNomeEscala) {
    filtroNomeEscala.addEventListener("input", renderizarListaFuncionarios);
}

if (filtroHorarioEscala) {
    filtroHorarioEscala.addEventListener("change", renderizarListaFuncionarios);
}

if (btnMarcarTodos) {
    btnMarcarTodos.addEventListener("click", () => {
        const termoBusca = (filtroNomeEscala?.value || "").toLowerCase().trim();
        const horarioFiltro = filtroHorarioEscala?.value || "";

        funcionariosEscala.forEach(f => {
            const bateNome = !termoBusca || f.nome.toLowerCase().includes(termoBusca) || f.matricula.includes(termoBusca);
            const bateHorario = !horarioFiltro || f.horario === horarioFiltro;
            if (bateNome && bateHorario) {
                f.selecionado = true;
            }
        });
        renderizarListaFuncionarios();
    });
}

if (btnDesmarcarTodos) {
    btnDesmarcarTodos.addEventListener("click", () => {
        const termoBusca = (filtroNomeEscala?.value || "").toLowerCase().trim();
        const horarioFiltro = filtroHorarioEscala?.value || "";

        funcionariosEscala.forEach(f => {
            const bateNome = !termoBusca || f.nome.toLowerCase().includes(termoBusca) || f.matricula.includes(termoBusca);
            const bateHorario = !horarioFiltro || f.horario === horarioFiltro;
            if (bateNome && bateHorario) {
                f.selecionado = false;
            }
        });
        renderizarListaFuncionarios();
    });
}

// Funções auxiliares para formatação de nomes
function formatarNomeExibicao(nomeCompleto) {
    if (!nomeCompleto) return "";
    const preposicoes = ["de", "da", "do", "das", "dos", "e"];
    return nomeCompleto
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((palavra, index) => {
            if (index > 0 && preposicoes.includes(palavra)) {
                return palavra;
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        })
        .join(" ");
}

function formatarPrimeiroNome(nomeCompleto, listaSelecionados = []) {
    if (!nomeCompleto) return "";
    const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return "";

    const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const primeiroNome = capitalizar(partes[0]);

    // Se houver mais de uma pessoa com o mesmo primeiro nome na lista de selecionados,
    // inclui a inicial do segundo nome/sobrenome para diferenciar (ex: "Ana L." e "Ana C.")
    if (listaSelecionados && listaSelecionados.length > 0) {
        const pessoasMesmoPrimeiroNome = listaSelecionados.filter(f => {
            const p = (f.nome || "").trim().split(/\s+/)[0];
            return p.toLowerCase() === partes[0].toLowerCase();
        });

        if (pessoasMesmoPrimeiroNome.length > 1 && partes.length > 1) {
            const segundo = capitalizar(partes[1]);
            return `${primeiroNome} ${segundo.charAt(0)}.`;
        }
    }

    return primeiroNome;
}

// Botão: Enviar Selecionados para o Sorteador
if (btnEnviarParaSorteador) {
    btnEnviarParaSorteador.addEventListener("click", () => {
        const selecionados = funcionariosEscala.filter(f => f.selecionado);

        if (selecionados.length === 0) {
            alert("Selecione pelo menos um colaborador para enviar ao sorteador.");
            return;
        }

        const nomesTexto = selecionados.map(f => formatarPrimeiroNome(f.nome, selecionados)).join("\n");

        // Preenche o textarea do modo automático
        if (textarea) {
            textarea.value = nomesTexto;
        }

        // Se estiver no modo manual, preenche também
        if (pessoasSul && modoManual && modoManual.checked) {
            pessoasSul.value = nomesTexto;
        }

        // Ajusta as quantidades de equipes para garantir entre 2 e 3 pessoas por equipe
        const totalPessoas = selecionados.length;
        const totalSul = Math.ceil(totalPessoas / 2);
        const totalNorte = Math.floor(totalPessoas / 2);

        const minSul = Math.max(1, Math.ceil(totalSul / 3));
        const maxSul = Math.max(minSul, Math.floor(totalSul / 2));
        const minNorte = Math.max(1, Math.ceil(totalNorte / 3));
        const maxNorte = Math.max(minNorte, Math.floor(totalNorte / 2));

        if (quantidadeSul) {
            quantidadeSul.min = minSul;
            quantidadeSul.max = maxSul;
            const valorSul = Number(quantidadeSul.value);
            if (valorSul < minSul || valorSul > maxSul) {
                quantidadeSul.value = minSul;
            }
        }
        if (quantidadeNorte) {
            quantidadeNorte.min = minNorte;
            quantidadeNorte.max = maxNorte;
            const valorNorte = Number(quantidadeNorte.value);
            if (valorNorte < minNorte || valorNorte > maxNorte) {
                quantidadeNorte.value = minNorte;
            }
        }

        // Troca para a aba do Sorteador
        mudarAba("sorteador");

        // Exibe alerta de confirmação no topo do Sorteador
        if (alertaImportacao && textoAlertaImportacao) {
            textoAlertaImportacao.textContent = `${selecionados.length} colaboradores importados da escala com sucesso! Pronto para realizar o sorteio.`;
            alertaImportacao.style.display = "flex";
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Oculta o alerta após 7 segundos
            setTimeout(() => {
                alertaImportacao.style.display = "none";
            }, 7000);
        }
    });
}