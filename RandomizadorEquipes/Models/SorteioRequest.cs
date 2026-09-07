namespace RandomizadorEquipes.Models
{
    public class SorteioRequest
    {
        public string Modo { get; set; } = "automatico";

        // Modo automático
        public List<string>? Pessoas { get; set; }

        // Modo manual
        public List<string>? PessoasSul { get; set; }
        public List<string>? PessoasNorte { get; set; }

        public int QuantidadeEquipesSul { get; set; }

        public int QuantidadeEquipesNorte { get; set; }
    }
}