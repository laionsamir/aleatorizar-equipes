using Microsoft.AspNetCore.Mvc;
using RandomizadorEquipes.Models;
using RandomizadorEquipes.Services;

namespace RandomizadorEquipes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipesController : ControllerBase
{
    private readonly SorteioService _sorteioService;

    public EquipesController(
        SorteioService sorteioService)
    {
        _sorteioService = sorteioService;
    }

    /// <summary>
    /// Recebe a solicitação de sorteio e retorna as equipes geradas.
    /// </summary>
    [HttpPost("sortear")]
    public IActionResult Sortear(
        [FromBody] SorteioRequest request)
    {
        try
        {
            var resultado =
                _sorteioService
                    .SortearPorBlocos(request);

            return Ok(resultado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(
                new
                {
                    erro = ex.Message
                }
            );
        }
    }
}