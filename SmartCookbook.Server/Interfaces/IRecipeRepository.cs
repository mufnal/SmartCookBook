using SmartCookbook.Server.Models;
using SmartCookbook.Server.Models.Dtos;

namespace SmartCookbook.Server.Interfaces
{
    public interface IRecipeRepository : IBaseRepository<Recipe, RecipeDto>
    {
        Task<List<RecipeDto>> GetMatchingRecipes(List<string> ingredients, int percentageMatched);
    }
}