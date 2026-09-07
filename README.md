# Documentação do Randomizador de Equipes

Este é um sistema web para realizar sorteios e organizar participantes em equipes.

A aplicação permite realizar sorteios de forma automática ou manual, organizando os participantes entre equipes dos Píeres Sul e Norte.

## Endpoints da API

A seguir estão os endpoints disponíveis na API:

### Sortear Equipes

- **URL:** `http://localhost:7288/api/Equipes/sortear`
- **Descrição:** Permite realizar o sorteio dos participantes e distribuir as pessoas entre as equipes.
- **Método HTTP:** POST
- **Corpo da Requisição:** JSON contendo os dados necessários para realizar o sorteio.
- **Retorno:** Retorna os dados das equipes sorteadas.

## Funcionalidades

- Sorteio automático de participantes.
- Sorteio manual de participantes.
- Distribuição dos participantes em equipes.
- Organização das equipes entre Píer Sul e Píer Norte.
- Visualização dos participantes de cada equipe.
- Alteração do titular da equipe.
- Exclusão do resultado do sorteio.
- Compartilhamento do resultado.
- Compartilhamento do resultado pelo WhatsApp.
- Interface responsiva para dispositivos móveis.

## Setup do Projeto

1. Clone o repositório do projeto:

```bash
git clone URL_DO_REPOSITORIO