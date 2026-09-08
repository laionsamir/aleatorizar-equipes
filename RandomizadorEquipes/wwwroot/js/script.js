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

            if (
                quantidadeEquipesSul >
                listaSul.length
            ) {

                mensagem.textContent =
                    "O Píer Sul não pode ter mais equipes do que pessoas.";

                return;
            }

            if (
                quantidadeEquipesNorte >
                listaNorte.length
            ) {

                mensagem.textContent =
                    "O Píer Norte não pode ter mais equipes do que pessoas.";

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

            if (
                quantidadeEquipesSul +
                quantidadeEquipesNorte >
                pessoas.length
            ) {

                mensagem.textContent =
                    "A quantidade total de equipes não pode ser maior que a quantidade de pessoas.";

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

            if (
                quantidadeEquipesSul >
                listaSul.length
            ) {

                mensagem.textContent =
                    "O Píer Sul recebeu poucas pessoas para a quantidade de equipes escolhida.";

                return;
            }

            if (
                quantidadeEquipesNorte >
                listaNorte.length
            ) {

                mensagem.textContent =
                    "O Píer Norte recebeu poucas pessoas para a quantidade de equipes escolhida.";

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

    let texto =
        "Boa tarde a todos. Segue a programação do dia  \n\n";

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