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

        if (quantidadeEquipes * 2 > pessoas.Count)
        {
            throw new ArgumentException(
                $"Cada equipe deve ter no mínimo 2 pessoas. Para {quantidadeEquipes} equipes, são necessárias pelo menos {quantidadeEquipes * 2} pessoas."
            );
        }

        if (pessoas.Count > quantidadeEquipes * 3)
        {
            var minimoEquipes = (int)Math.Ceiling(pessoas.Count / 3.0);
            throw new ArgumentException(
                $"Cada equipe pode ter no máximo 3 pessoas. Para {pessoas.Count} pessoas, crie pelo menos {minimoEquipes} equipes."
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

        if (pessoas.Count < 4)
        {
            throw new ArgumentException(
                "No modo automático são necessárias pelo menos 4 pessoas para formar equipes com no mínimo 2 integrantes cada."
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

        // Verifica se cada bloco tem quantidade suficiente para garantir entre 2 e 3 pessoas por equipe.
        if (
            pessoasSul.Count <
            request.QuantidadeEquipesSul * 2
        )
        {
            throw new ArgumentException(
                $"O Píer Sul recebeu {pessoasSul.Count} pessoas, mas precisa de pelo menos {request.QuantidadeEquipesSul * 2} para {request.QuantidadeEquipesSul} equipes com no mínimo 2 pessoas cada."
            );
        }

        if (
            pessoasSul.Count >
            request.QuantidadeEquipesSul * 3
        )
        {
            var minimoSul = (int)Math.Ceiling(pessoasSul.Count / 3.0);
            throw new ArgumentException(
                $"O Píer Sul recebeu {pessoasSul.Count} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos {minimoSul} equipes no Sul."
            );
        }

        if (
            pessoasNorte.Count <
            request.QuantidadeEquipesNorte * 2
        )
        {
            throw new ArgumentException(
                $"O Píer Norte recebeu {pessoasNorte.Count} pessoas, mas precisa de pelo menos {request.QuantidadeEquipesNorte * 2} para {request.QuantidadeEquipesNorte} equipes com no mínimo 2 pessoas cada."
            );
        }

        if (
            pessoasNorte.Count >
            request.QuantidadeEquipesNorte * 3
        )
        {
            var minimoNorte = (int)Math.Ceiling(pessoasNorte.Count / 3.0);
            throw new ArgumentException(
                $"O Píer Norte recebeu {pessoasNorte.Count} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos {minimoNorte} equipes no Norte."
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
            request.QuantidadeEquipesSul * 2 >
            pessoasSul.Count
        )
        {
            throw new ArgumentException(
                $"O Píer Sul precisa de pelo menos {request.QuantidadeEquipesSul * 2} pessoas para formar {request.QuantidadeEquipesSul} equipes com no mínimo 2 pessoas cada."
            );
        }

        if (
            pessoasSul.Count >
            request.QuantidadeEquipesSul * 3
        )
        {
            var minimoSul = (int)Math.Ceiling(pessoasSul.Count / 3.0);
            throw new ArgumentException(
                $"O Píer Sul tem {pessoasSul.Count} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos {minimoSul} equipes no Sul."
            );
        }

        if (
            request.QuantidadeEquipesNorte * 2 >
            pessoasNorte.Count
        )
        {
            throw new ArgumentException(
                $"O Píer Norte precisa de pelo menos {request.QuantidadeEquipesNorte * 2} pessoas para formar {request.QuantidadeEquipesNorte} equipes com no mínimo 2 pessoas cada."
            );
        }

        if (
            pessoasNorte.Count >
            request.QuantidadeEquipesNorte * 3
        )
        {
            var minimoNorte = (int)Math.Ceiling(pessoasNorte.Count / 3.0);
            throw new ArgumentException(
                $"O Píer Norte tem {pessoasNorte.Count} pessoas. Para respeitar o máximo de 3 por equipe, configure pelo menos {minimoNorte} equipes no Norte."
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
            (quantidadeSul + quantidadeNorte) * 2 >
            quantidadePessoas
        )
        {
            throw new ArgumentException(
                $"Cada equipe precisa de no mínimo 2 pessoas. Para {quantidadeSul + quantidadeNorte} equipes no total, são necessárias pelo menos {(quantidadeSul + quantidadeNorte) * 2} pessoas."
            );
        }

        if (
            quantidadePessoas >
            (quantidadeSul + quantidadeNorte) * 3
        )
        {
            var minimoTotal = (int)Math.Ceiling(quantidadePessoas / 3.0);
            throw new ArgumentException(
                $"Cada equipe pode ter no máximo 3 pessoas. Para {quantidadePessoas} pessoas no total, configure pelo menos {minimoTotal} equipes somando Sul e Norte."
            );
        }
    }
}