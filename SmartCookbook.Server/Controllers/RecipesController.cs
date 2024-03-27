using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SmartCookbook.Server.Interfaces;
using SmartCookbook.Server.Models;
using SmartCookbook.Server.Models.Dtos;

namespace SmartCookbook.Server.Controllers
{
    [EnableCors("OpenCORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController(IRecipeRepository recipeRepository) : ControllerBase
    {
        private readonly IRecipeRepository _recipeRepository = recipeRepository;

        [HttpGet]
        public async Task<ActionResult<List<Recipe>>> Get()
        {
            var recipes = await _recipeRepository.Get();
            return Ok(recipes);
        }

        [HttpGet("GetMatchingRecipes")]
        public async Task<ActionResult<List<Recipe>>> GetMatchingRecipes([FromQuery] List<string> ingredients, int percentageMatched)
        {
            var recipes = await _recipeRepository.GetMatchingRecipes(ingredients, percentageMatched);
            return Ok(recipes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetById(int id)
        {
            var recipe = await _recipeRepository.GetById(id);
            return recipe is RecipeDto r ? Ok(r) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> Create([FromBody] RecipeDto recipeDto)
        {
            var createdRecipe = await _recipeRepository.Create(recipeDto);
            if (createdRecipe == null)
                return BadRequest();
            return Ok(createdRecipe);
        }

        [HttpPut]
        public async Task<ActionResult<Recipe>> Update([FromBody] RecipeDto recipeDto)
        {
            var updatedRecipe = await _recipeRepository.Update(recipeDto);

            if (updatedRecipe == null)
                return BadRequest();

            return Ok(updatedRecipe);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            await _recipeRepository.Delete(id);
            return NoContent();
        }
    }
}