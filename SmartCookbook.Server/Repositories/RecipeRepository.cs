using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SmartCookbook.Server.Databases;
using SmartCookbook.Server.Interfaces;
using SmartCookbook.Server.Models;
using SmartCookbook.Server.Models.Dtos;
using System.Security.Cryptography.X509Certificates;

namespace SmartCookbook.Server.Repositories
{
    public class RecipeRepository : BaseRepository<Recipe, RecipeDto>, IRecipeRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        private readonly DbSet<Recipe> table;

        public RecipeRepository(ApplicationDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            table = _dbContext.Set<Recipe>();
        }

        public override async Task<RecipeDto> Update(RecipeDto recipeDto)
        {
            //null entity exception
            if (recipeDto == null)
                throw new NotImplementedException();

            var recipe = await table
                .Include(e=>e.Ingredients)
                .Include(e=>e.Steps)
                .FirstOrDefaultAsync(e => e.Id == recipeDto.Id) ?? throw new NotImplementedException();
            _mapper.Map(recipeDto, recipe);
            _dbContext.Update(recipe);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<RecipeDto>(recipe);
        }

        public override async Task<List<RecipeDto>> Get()
        {
            return _mapper.Map<List<RecipeDto>>(await _dbContext.Recipes
                .Include(e => e.Ingredients)
                .Include(e => e.Steps)
                .ToListAsync());
        }

        public override async Task<RecipeDto> GetById(int id)
        {
            return _mapper.Map<RecipeDto>(await _dbContext.Recipes
                .Include(e => e.Ingredients)
                .Include(e => e.Steps)
                .FirstOrDefaultAsync(e => e.Id == id));
        }

        public override async Task Delete(int id)
        {
            var entity = await table
                .Include(e => e.Ingredients)
                .Include(e => e.Steps)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (entity != null)
            {
                table.Remove(entity);
            }
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<RecipeDto>> GetMatchingRecipes(List<string> ingredients, int percentageRequired)
        {
            var allRecipes = await Get();
            int matchedIngredients = 0;
            List<RecipeDto> matchingRecipes = [];
            foreach (var recipe in allRecipes)
            {
                var ingredientsList = recipe.Ingredients.Where(e => e.IsMandatory == true).Select(e => e.Name).ToList();
                matchedIngredients = ingredientsList.Intersect(ingredients).Count();
                float percentageMatched = (float)matchedIngredients / recipe.Ingredients.Where(e => e.IsMandatory == true).ToList().Count;
                percentageMatched = float.IsNaN(percentageMatched) ? 0 : percentageMatched;
                if (percentageMatched * 100 >= percentageRequired)
                {
                    matchingRecipes.Add(recipe);
                }
            }
            return matchingRecipes;
        }
    }
}