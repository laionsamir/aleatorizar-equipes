using RandomizadorEquipes.Models;

namespace RandomizadorEquipes.Services;

public class SorteioService
{
    public List<Equipe> Sortear(
        List<string> pessoas,
        int quantidadeEquipes)
    {
        if (pessoas == null)
        {
            throw new ArgumentException(
                "A lista de pessoas não pode ser nula."
            );
        }

        // Remove nomes vazios e espaços desnecessários.
        pessoas = LimparPessoas(pessoas);

        if (pessoas.Count == 0)
        {
            throw new ArgumentException(
                "A lista de pessoas não pode estar vazia."
            );
        }

        if (quantidadeEquipes <= 0)
        {
            throw new ArgumentException(
                "A quantidade de equipes deve ser maior que zero."
            );
        }

        if (quantidadeEquipes > pessoas.Count)
        {
            throw new ArgumentException(
                "A quantidade de equipes não pode ser maior que a quantidade de pessoas."
            );
        }

        // Embaralha as pessoas.
        Random random = new();

        pessoas = pessoas
            .OrderBy(_ => random.Next())
            .ToList();

        var equipes = new List<Equipe>();

        // Cria as equipes.
        for (int i = 0; i < quantidadeEquipes; i++)
        {
            equipes.Add(
                new Equipe
                {
                    Numero = i + 1
                }
            );
        }

        // Distribui as pessoas entre as equipes.
        for (int i = 0; i < pessoas.Count; i++)
        {
            int equipeIndex = i % quantidadeEquipes;

            equipes[equipeIndex]
                .Pessoas
                .Add(
                    new Pessoa
                    {
                        Nome = pessoas[i]
                    }
                );
        }

        return equipes;
    }


   

    
    // Realiza o sorteio dos blocos Sul e Norte.
    public ResultadoSorteio SortearPorBlocos(
        SorteioRequest request)
    {
        if (request.Modo == "manual")
        {
            return SortearManual(request);
        }

        return SortearAutomatico(request);
    }


    
    // Divide automaticamente as pessoas entre Sul e Norte.
    private ResultadoSorteio SortearAutomatico(
        SorteioRequest request)
    {
        if (request.Pessoas == null)
        {
            throw new ArgumentException(
                "Informe a lista de pessoas."
            );
        }

        var pessoas = LimparPessoas(
            request.Pessoas
        );

        if (pessoas.Count < 2)
        {
            throw new ArgumentException(
                "No modo automático são necessárias pelo menos duas pessoas."
            );
        }

        ValidarQuantidadeEquipes(
            pessoas.Count,
            request.QuantidadeEquipesSul,
            request.QuantidadeEquipesNorte
        );

        // Embaralha antes de dividir os blocos.
        pessoas = Embaralhar(pessoas);

        var pessoasSul = new List<string>();
        var pessoasNorte = new List<string>();

        // Divide as pessoas entre Sul e Norte.
        for (int i = 0; i < pessoas.Count; i++)
        {
            if (i % 2 == 0)
            {
                pessoasSul.Add(pessoas[i]);
            }
            else
            {
                pessoasNorte.Add(pessoas[i]);
            }
        }

        // Verifica se há pessoas suficientes em cada bloco.
        if (
            pessoasSul.Count <
            request.QuantidadeEquipesSul
        )
        {
            throw new ArgumentException(
                "Não há pessoas suficientes para as equipes do Sul."
            );
        }

        if (
            pessoasNorte.Count <
            request.QuantidadeEquipesNorte
        )
        {
            throw new ArgumentException(
                "Não há pessoas suficientes para as equipes do Norte."
            );
        }

        return new ResultadoSorteio
        {
            Sul = Sortear(
                pessoasSul,
                request.QuantidadeEquipesSul
            ),

            Norte = Sortear(
                pessoasNorte,
                request.QuantidadeEquipesNorte
            )
        };
    }


    

    // Realiza o sorteio usando listas separadas para Sul e Norte.
    private ResultadoSorteio SortearManual(
        SorteioRequest request)
    {
        if (request.PessoasSul == null)
        {
            throw new ArgumentException(
                "Informe as pessoas do Sul."
            );
        }

        if (request.PessoasNorte == null)
        {
            throw new ArgumentException(
                "Informe as pessoas do Norte."
            );
        }

        var pessoasSul =
            LimparPessoas(request.PessoasSul);

        var pessoasNorte =
            LimparPessoas(request.PessoasNorte);

        if (pessoasSul.Count == 0)
        {
            throw new ArgumentException(
                "Informe pelo menos uma pessoa no Sul."
            );
        }

        if (pessoasNorte.Count == 0)
        {
            throw new ArgumentException(
                "Informe pelo menos uma pessoa no Norte."
            );
        }

        if (
            request.QuantidadeEquipesSul >
            pessoasSul.Count
        )
        {
            throw new ArgumentException(
                "Há mais equipes do que pessoas no Sul."
            );
        }

        if (
            request.QuantidadeEquipesNorte >
            pessoasNorte.Count
        )
        {
            throw new ArgumentException(
                "Há mais equipes do que pessoas no Norte."
            );
        }

        return new ResultadoSorteio
        {
            Sul = Sortear(
                pessoasSul,
                request.QuantidadeEquipesSul
            ),

            Norte = Sortear(
                pessoasNorte,
                request.QuantidadeEquipesNorte
            )
        };
    }



   
    // Remove espaços e nomes vazios.
    private List<string> LimparPessoas(
        List<string> pessoas)
    {
        return pessoas
            .Select(p => p.Trim())
            .Where(
                p => !string.IsNullOrWhiteSpace(p)
            )
            .ToList();
    }


    
    // Embaralha a lista de pessoas.
    private List<string> Embaralhar(
        List<string> pessoas)
    {
        Random random = new();

        return pessoas
            .OrderBy(_ => random.Next())
            .ToList();
    }


   
    // Valida a quantidade de equipes.
    private void ValidarQuantidadeEquipes(
        int quantidadePessoas,
        int quantidadeSul,
        int quantidadeNorte)
    {
        if (quantidadeSul <= 0)
        {
            throw new ArgumentException(
                "A quantidade de equipes do Sul deve ser maior que zero."
            );
        }

        if (quantidadeNorte <= 0)
        {
            throw new ArgumentException(
                "A quantidade de equipes do Norte deve ser maior que zero."
            );
        }

        if (
            quantidadeSul +
            quantidadeNorte >
            quantidadePessoas
        )
        {
            throw new ArgumentException(
                "Não há pessoas suficientes para todas as equipes."
            );
        }
    }
}