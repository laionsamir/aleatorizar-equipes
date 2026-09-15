# Documentação do Randomizador de Equipes

Este é um sistema web desenvolvido para realizar a divisão de pessoas em equipes de forma rápida e aleatória, com opções de organização manual e automática.

## Endpoints da API

A seguir estão os endpoints disponíveis na API:

### Sortear Equipes

* **URL:** `http://localhost:5000/api/Equipes/sortear`
* **Descrição:** Realiza o sorteio e a divisão das pessoas entre as equipes.
* **Método HTTP:** POST
* **Corpo da Requisição:** JSON contendo a lista de pessoas e as configurações da divisão.
* **Retorno:** Retorna as equipes geradas com seus respectivos participantes.

### Testar a API

* **URL:** `http://localhost:5000/api/Equipes`
* **Descrição:** Endpoint utilizado para verificar o funcionamento da API.
* **Método HTTP:** GET
* **Retorno:** Retorna uma resposta da API.

## Funcionalidades

### Divisão Automática

Permite informar uma lista de pessoas e realizar automaticamente a divisão entre as equipes.

O sistema realiza o sorteio de forma aleatória, distribuindo os participantes conforme a quantidade de equipes definida.

### Divisão Manual

Permite realizar a organização dos participantes manualmente, possibilitando ao usuário definir em qual equipe cada pessoa ficará.

### Organização por Equipes

As equipes são organizadas entre:

* Sul
* Norte

O usuário pode definir a quantidade de equipes para cada região.

### Compartilhamento

Após realizar a divisão, o resultado pode ser compartilhado diretamente pela aplicação.

O sistema gera uma mensagem contendo a programação das equipes e a data atual.

Também é possível compartilhar o resultado diretamente pelo WhatsApp.

## Setup do Projeto

1. Clone o repositório do projeto:

```bash
git clone https://github.com/laionsamir/aleatorizar-equipes.git
```

2. Acesse a pasta do projeto:

```bash
cd aleatorizar-equipes
```

3. Abra o projeto no Visual Studio.

4. Restaure as dependências do projeto:

```bash
dotnet restore
```

5. Execute o projeto:

```bash
dotnet run
```

6. Acesse a aplicação no navegador utilizando a URL informada pelo ASP.NET Core.

## Tecnologias Utilizadas

* C#
* ASP.NET Core
* .NET
* HTML
* CSS
* JavaScript
* Bootstrap

## Estrutura do Projeto

O projeto utiliza ASP.NET Core no backend e arquivos estáticos no frontend.

```text
RandomizadorEquipes/
├── Controllers/
├── Models/
├── Services/
├── wwwroot/
│   ├── css/
│   ├── js/
│   └── index.html
├── Program.cs
└── RandomizadorEquipes.csproj
```

## Aplicação Online

A aplicação está hospedada na Railway e pode ser acessada através da versão publicada do projeto.

## Autor

Este projeto foi desenvolvido por [Laion Samir](https://github.com/laionsamir).

---

**Observação:** A porta utilizada pela aplicação pode variar conforme a configuração do ambiente. Utilize a URL apresentada pelo ASP.NET Core ao executar o projeto localmente.
