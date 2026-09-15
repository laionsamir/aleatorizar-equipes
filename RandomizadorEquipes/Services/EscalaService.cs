using RandomizadorEquipes.Models;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace RandomizadorEquipes.Services;

public class EscalaService
{
    private readonly IWebHostEnvironment _env;

    public EscalaService(IWebHostEnvironment env)
    {
        _env = env;
    }

    private string ObterCaminhoPdf()
    {
        var caminho = Path.Combine(_env.ContentRootPath, "Pdf", "escala.pdf");
        if (File.Exists(caminho)) return caminho;

        caminho = Path.Combine(AppContext.BaseDirectory, "Pdf", "escala.pdf");
        if (File.Exists(caminho)) return caminho;

        caminho = Path.Combine(Directory.GetCurrentDirectory(), "Pdf", "escala.pdf");
        return caminho;
    }

    public List<FuncionarioEscalaDto> ObterFuncionariosQueTrabalham(DateTime data)
    {
        var caminhoPdf = ObterCaminhoPdf();
        if (!File.Exists(caminhoPdf))
        {
            throw new FileNotFoundException($"Arquivo de escala não encontrado em: {caminhoPdf}");
        }

        using var documento = PdfDocument.Open(caminhoPdf);

        var pagina1 = documento.GetPage(1);
        var palavrasPagina1 = pagina1.GetWords().ToList();

        var dias = ExtrairDiasCabecalho(palavrasPagina1);

        int mes = data.Month;
        int ano = data.Year;

        var mesTexto = palavrasPagina1.FirstOrDefault(p => EhMes(p.Text))?.Text;
        var anoTexto = palavrasPagina1.FirstOrDefault(p => EhAno(p.Text))?.Text;
        if (!string.IsNullOrEmpty(mesTexto) && !string.IsNullOrEmpty(anoTexto))
        {
            try
            {
                var periodo = ObterPeriodo(mesTexto, anoTexto);
                mes = periodo.Mes;
                ano = periodo.Ano;
            }
            catch
            {
            }
        }

        var funcionarios = new List<Funcionario>();

        int totalPaginas = Math.Min(3, documento.NumberOfPages);
        for (int numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++)
        {
            var pagina = documento.GetPage(numeroPagina);
            var palavras = pagina.GetWords().ToList();

            var funcionariosPagina = ExtrairFuncionariosPagina(
                palavras,
                dias,
                mes,
                ano
            );

            funcionarios.AddRange(funcionariosPagina);
        }

        var funcionariosAtivos = funcionarios
            .Where(f => f.Ativo)
            .ToList();

        var resultados = ConsultarPorData(
            funcionariosAtivos,
            data
        );

        return resultados
            .Where(r => r.Trabalha)
            .Select(r => new FuncionarioEscalaDto
            {
                Nome = r.Funcionario.Nome,
                Matricula = r.Funcionario.Matricula,
                Horario = r.Funcionario.Horario
            })
            .ToList();
    }

    public bool TrabalhaNoDia(string codigo)
    {
        return codigo != "F"
            && codigo != "FA"
            && codigo != "L"
            && codigo != "J";
    }

    public SituacaoFuncionario ConsultarSituacao(
        Funcionario funcionario,
        DateTime data)
    {
        var dia = funcionario.Dias.FirstOrDefault(d => d.Data.Date == data.Date);
        var codigo = dia?.Codigo ?? "";

        return new SituacaoFuncionario
        {
            Funcionario = funcionario,
            Data = data,
            Codigo = codigo,
            Trabalha = TrabalhaNoDia(codigo)
        };
    }

    public List<SituacaoFuncionario> ConsultarPorData(
        List<Funcionario> funcionarios,
        DateTime data)
    {
        var resultados = new List<SituacaoFuncionario>();
        foreach (var funcionario in funcionarios)
        {
            var situacao = ConsultarSituacao(funcionario, data);
            resultados.Add(situacao);
        }
        return resultados;
    }

    public int EncontrarDiaMaisProximo(
        double posicaoCodigo,
        List<(int Dia, double X)> dias)
    {
        var diaMaisProximo = dias
            .MinBy(dia => Math.Abs(dia.X - posicaoCodigo));

        return diaMaisProximo.Dia;
    }

    public List<DiaEscala> CriarDiasEscala(
        List<(int Dia, double X)> dias,
        List<(string Codigo, double X)> codigos,
        int mes,
        int ano)
    {
        var resultado = new List<DiaEscala>();

        foreach (var dia in dias)
        {
            resultado.Add(new DiaEscala
            {
                Data = new DateTime(ano, mes, dia.Dia),
                Codigo = ""
            });
        }

        foreach (var codigo in codigos)
        {
            var dia = EncontrarDiaMaisProximo(codigo.X, dias);
            var diaEscala = resultado.FirstOrDefault(d => d.Data.Day == dia);
            if (diaEscala != null)
            {
                diaEscala.Codigo = codigo.Codigo;
            }
        }

        return resultado;
    }

    public int ObterNumeroMes(string nomeMes)
    {
        return nomeMes.ToUpper() switch
        {
            "JANEIRO" => 1,
            "FEVEREIRO" => 2,
            "MARÇO" => 3,
            "ABRIL" => 4,
            "MAIO" => 5,
            "JUNHO" => 6,
            "JULHO" => 7,
            "AGOSTO" => 8,
            "SETEMBRO" => 9,
            "OUTUBRO" => 10,
            "NOVEMBRO" => 11,
            "DEZEMBRO" => 12,
            _ => throw new ArgumentException("Mês inválido.")
        };
    }

    public bool EhMes(string texto)
    {
        return texto.ToUpper() switch
        {
            "JANEIRO" => true,
            "FEVEREIRO" => true,
            "MARÇO" => true,
            "ABRIL" => true,
            "MAIO" => true,
            "JUNHO" => true,
            "JULHO" => true,
            "AGOSTO" => true,
            "SETEMBRO" => true,
            "OUTUBRO" => true,
            "NOVEMBRO" => true,
            "DEZEMBRO" => true,
            _ => false
        };
    }

    public bool EhAno(string texto)
    {
        return int.TryParse(texto, out var ano)
            && ano >= 2000
            && ano <= 2100;
    }

    public (int Mes, int Ano) ObterPeriodo(string nomeMes, string nomeAno)
    {
        var mes = ObterNumeroMes(nomeMes);
        var ano = int.Parse(nomeAno);
        return (mes, ano);
    }

    public string ExtrairNome(
        List<Word> palavras,
        double yFuncionario)
    {
        var nome = palavras
            .Where(palavra =>
                Math.Abs(palavra.BoundingBox.Bottom - yFuncionario) < 1 &&
                palavra.BoundingBox.Left >= 66 &&
                palavra.BoundingBox.Left < 220)
            .OrderBy(palavra => palavra.BoundingBox.Left)
            .Select(palavra => palavra.Text);

        return string.Join(" ", nome);
    }

    public string ExtrairHorario(
        List<Word> palavras,
        double yFuncionario)
    {
        var horario = palavras
            .Where(palavra =>
                Math.Abs(palavra.BoundingBox.Bottom - yFuncionario) < 1 &&
                palavra.BoundingBox.Left >= 228 &&
                palavra.BoundingBox.Left < 280)
            .OrderBy(palavra => palavra.BoundingBox.Left)
            .Select(palavra => palavra.Text);

        return string.Join(" ", horario);
    }

    public List<(string Codigo, double X)> ExtrairCodigos(
        List<Word> palavras,
        double yFuncionario)
    {
        return palavras
            .Where(palavra =>
                Math.Abs(palavra.BoundingBox.Bottom - yFuncionario) < 1 &&
                (palavra.Text == "F" ||
                 palavra.Text == "FA" ||
                 palavra.Text == "L" ||
                 palavra.Text == "J"))
            .Select(palavra => (
                Codigo: palavra.Text,
                X: palavra.BoundingBox.Left
            ))
            .ToList();
    }

    public List<(int Dia, double X)> ExtrairDiasCabecalho(
        List<Word> palavras)
    {
        var candidatos = palavras
            .Where(palavra =>
                int.TryParse(palavra.Text, out var numero) &&
                numero >= 1 &&
                numero <= 30 &&
                palavra.BoundingBox.Left >= 281 &&
                palavra.BoundingBox.Left <= 743)
            .ToList();

        var grupos = candidatos
            .GroupBy(palavra =>
                Math.Round(palavra.BoundingBox.Bottom, 1))
            .OrderByDescending(grupo => grupo.Count())
            .ToList();

        var grupoCabecalho = grupos
            .FirstOrDefault(grupo => grupo.Count() >= 30)
            ?? grupos.FirstOrDefault();

        if (grupoCabecalho == null)
        {
            return new List<(int Dia, double X)>();
        }

        return grupoCabecalho
            .OrderBy(palavra => palavra.BoundingBox.Left)
            .Select(palavra => (
                Dia: int.Parse(palavra.Text),
                X: palavra.BoundingBox.Left
            ))
            .ToList();
    }

    public bool FuncionarioValido(Funcionario funcionario)
    {
        if (string.IsNullOrWhiteSpace(funcionario.Nome))
            return false;

        if (string.IsNullOrWhiteSpace(funcionario.Horario))
            return false;

        if (funcionario.Dias.Count != 30)
            return false;

        return true;
    }

    public Funcionario CriarFuncionario(
        List<Word> palavras,
        string matricula,
        List<(int Dia, double X)> dias,
        int mes,
        int ano)
    {
        var palavraMatricula = palavras
            .First(palavra => palavra.Text == matricula);

        var yFuncionario = palavraMatricula.BoundingBox.Bottom;

        var nome = ExtrairNome(palavras, yFuncionario);
        var horario = ExtrairHorario(palavras, yFuncionario);
        var codigos = ExtrairCodigos(palavras, yFuncionario);
        var escala = CriarDiasEscala(dias, codigos, mes, ano);

        return new Funcionario
        {
            Matricula = matricula,
            Nome = nome,
            Horario = horario,
            Dias = escala,
            Ativo = FuncionarioAtivo(matricula)
        };
    }

    public List<Funcionario> ExtrairFuncionariosPagina(
        List<Word> palavras,
        List<(int Dia, double X)> dias,
        int mes,
        int ano)
    {
        var matriculas = palavras
            .Where(palavra =>
                palavra.Text.Length == 6 &&
                palavra.Text.All(char.IsDigit))
            .ToList();

        var funcionarios = new List<Funcionario>();

        foreach (var matricula in matriculas)
        {
            var funcionario = CriarFuncionario(
                palavras,
                matricula.Text,
                dias,
                mes,
                ano
            );

            funcionarios.Add(funcionario);
        }

        return funcionarios;
    }

    public bool FuncionarioAtivo(string matricula)
    {
        var matriculasInativas = new HashSet<string>
        {
            "901314",
            "900991",
            "900360"
        };

        return !matriculasInativas.Contains(matricula);
    }
}
