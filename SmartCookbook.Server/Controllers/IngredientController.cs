using Microsoft.AspNetCore.Mvc;
using SmartCookbook.Server.Interfaces;
using SmartCookbook.Server.Models.Dtos;
using SmartCookbook.Server.Models;
using SmartCookbook.Server.Repositories;
using Microsoft.AspNetCore.Cors;

namespace SmartCookbook.Server.Controllers
{
    [EnableCors("OpenCORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientController(IIngredientRepository ingredientRepository) : ControllerBase
    {
        private readonly IIngredientRepository _ingredientRepository = ingredientRepository;

        [HttpGet("GetMandatory")]
        public async Task<ActionResult<List<string>>> GetMandatory()
        {
            var ingredients = await _ingredientRepository.GetMandatory();
            return Ok(ingredients);
        }

        [HttpGet]
        public async Task<ActionResult<List<string>>> Get()
        {
            var ingredients = await _ingredientRepository.GetIngredientsNames();
            return Ok(ingredients);
        }
    }
}