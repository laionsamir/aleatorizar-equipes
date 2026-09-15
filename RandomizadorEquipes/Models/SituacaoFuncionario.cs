namespace RandomizadorEquipes.Models;

public class SituacaoFuncionario
{
    public Funcionario Funcionario { get; set; } = new();

    public DateTime Data { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public bool Trabalha { get; set; }
}
