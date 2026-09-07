namespace RandomizadorEquipes.Models;

public class Equipe
{
    public int Numero { get; set; }

    public List<Pessoa> Pessoas { get; set; } = new();
}
