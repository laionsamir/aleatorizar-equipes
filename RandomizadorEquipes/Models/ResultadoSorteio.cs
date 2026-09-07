namespace RandomizadorEquipes.Models
{
    public class ResultadoSorteio
    {
        public List<Equipe> Sul { get; set; } = new();

        public List<Equipe> Norte { get; set; } = new();
    }
}