namespace RandomizadorEquipes.Models;

public class Funcionario
{
    public string Nome { get; set; } = string.Empty;

    public string Matricula { get; set; } = string.Empty;

    public string Horario { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    public List<DiaEscala> Dias { get; set; } = new();
}
