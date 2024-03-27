using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SmartCookbook.Server.Databases;
using SmartCookbook.Server.Interfaces;
using SmartCookbook.Server.Models.Dtos;
using SmartCookbook.Server.Models;
using SmartCookbook.Server.Repositories;

namespace SmartCookbook.Server.Repositories
{
    public class IngredientRepository(ApplicationDbContext dbContext, IMapper mapper) : BaseRepository<Ingredient, IngredientDto>(dbContext, mapper), IIngredientRepository
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        public async Task<List<string>> GetMandatory()
        {
            var ingredients = (await _dbContext.Ingredients.ToListAsync())
                .GroupBy(e => e.Name)
                .Select(e => e.First())
                .Where(e => e.IsMandatory == true)
                .ToList();
            var listOfIngredientsNames = ingredients.Where(e => e.IsMandatory == true).Select(e => e.Name).ToList();
            return listOfIngredientsNames;
        }

        public async Task<List<string>> GetIngredientsNames()
        {
            var ingredients = (await _dbContext.Ingredients.ToListAsync())
                .GroupBy(e => e.Name)
                .Select(e => e.First())
                .ToList();
            var listOfIngredientsNames = ingredients.Select(e => e.Name).ToList();
            return listOfIngredientsNames;
        }
    }
}