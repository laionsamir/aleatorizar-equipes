# Documentação do Randomizador de Equipes

Este é um sistema web desenvolvido para auxiliar na organização de equipes e na consulta de escalas de trabalho.

A aplicação permite realizar a divisão de pessoas em equipes de forma automática ou manual e também possui um leitor de escalas em PDF, capaz de interpretar os dados da escala e identificar os funcionários que estão trabalhando em uma determinada data.

## Funcionalidades

### Randomizador de Equipes

Permite dividir uma lista de pessoas entre equipes de forma rápida e aleatória.

O sistema possui dois modos de divisão:

* **Automático:** realiza o sorteio e distribui os participantes entre as equipes.
* **Manual:** permite organizar os participantes manualmente.

As equipes podem ser organizadas entre:

* Sul
* Norte

Também é possível definir a quantidade de equipes para cada região.

### Leitor de Escala em PDF

O sistema também possui uma funcionalidade para leitura de escalas em formato PDF.

A escala é utilizada como fonte de dados para identificar os funcionários e suas respectivas situações em cada dia.

O leitor utiliza a biblioteca **PdfPig** para extrair informações do documento PDF, incluindo textos, posições e códigos presentes na escala.

A partir dessas informações, o sistema consegue interpretar os dias da escala e identificar a situação de cada funcionário.

As situações utilizadas na escala são:

* **F:** Folga
* **FA:** Folga automática
* **L:** Férias
* **J:** Afastado
* **Sem código:** Funcionário trabalhando

Dessa forma, é possível consultar os funcionários que estão trabalhando em uma determinada data sem precisar analisar manualmente toda a escala.

## Endpoints da API

A seguir estão os endpoints disponíveis na API:

### Sortear Equipes

* **URL:** `http://localhost:5000/api/Equipes/sortear`
* **Descrição:** Realiza o sorteio e a divisão das pessoas entre as equipes.
* **Método HTTP:** POST
* **Corpo da Requisição:** JSON contendo a lista de pessoas e as configurações da divisão.
* **Retorno:** Retorna as equipes geradas com seus respectivos participantes.

### Leitura da Escala

* **URL:** `http://localhost:5000/api/...`
* **Descrição:** Realiza a leitura das informações da escala em PDF e interpreta os dados dos funcionários e seus respectivos dias.
* **Método HTTP:** GET/POST
* **Retorno:** Retorna os dados extraídos e processados da escala.

### Consulta de Funcionários por Data

* **URL:** `http://localhost:5000/api/...`
* **Descrição:** Consulta os funcionários que estão trabalhando em uma determinada data, considerando os códigos e situações presentes na escala.
* **Método HTTP:** GET
* **Parâmetro:** Data da consulta.
* **Retorno:** Retorna a lista de funcionários que estão trabalhando na data informada.

## Compartilhamento

Após realizar a divisão das equipes, o resultado pode ser compartilhado diretamente pela aplicação.

A programação gerada contém a data atual e a relação dos participantes organizados em suas respectivas equipes.

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

4. Restaure as dependências:

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
* PdfPig

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

A funcionalidade de leitura de escala utiliza serviços responsáveis por processar o PDF, extrair os dados e transformar as informações da escala em objetos utilizados pela aplicação.

## Aplicação Online

A aplicação está hospedada na Railway.

## Autor

Este projeto foi desenvolvido por [Laion Samir](https://github.com/laionsamir).

---

**Observação:** Os endpoints e portas apresentados acima devem ser ajustados conforme a configuração atual da aplicação.
