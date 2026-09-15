using Microsoft.AspNetCore.Mvc;
using RandomizadorEquipes.Services;

namespace RandomizadorEquipes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EscalaController : ControllerBase
{
    private readonly EscalaService _escalaService;
    private readonly ILogger<EscalaController> _logger;

    public EscalaController(EscalaService escalaService, ILogger<EscalaController> logger)
    {
        _escalaService = escalaService;
        _logger = logger;
    }

    /// <summary>
    /// Consulta os funcionários que trabalham na data especificada.
    /// </summary>
    /// <param name="data">Data no formato AAAA-MM-DD</param>
    [HttpGet]
    public IActionResult ObterEscala([FromQuery] DateTime? data)
    {
        try
        {
            if (!data.HasValue)
            {
                return BadRequest(new { erro = "A data deve ser informada." });
            }

            var funcionarios = _escalaService.ObterFuncionariosQueTrabalham(data.Value);
            return Ok(funcionarios);
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogError(ex, "Arquivo de escala não encontrado");
            return NotFound(new { erro = "Arquivo de escala PDF não foi encontrado no servidor." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar escala");
            return StatusCode(500, new { erro = "Erro ao processar a escala: " + ex.Message });
        }
    }
}
