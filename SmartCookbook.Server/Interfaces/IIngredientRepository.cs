using SmartCookbook.Server.Models;
using SmartCookbook.Server.Models.Dtos;

namespace SmartCookbook.Server.Interfaces
{
    public interface IIngredientRepository : IBaseRepository<Ingredient, IngredientDto>
    {
        Task<List<string>> GetMandatory();
        Task<List<string>> GetIngredientsNames();
    }
}