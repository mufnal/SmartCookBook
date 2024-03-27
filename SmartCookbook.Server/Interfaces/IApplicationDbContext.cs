using Microsoft.EntityFrameworkCore;
using SmartCookbook.Server.Models;

namespace SmartCookbook.Server.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Recipe> Recipes { get; }
        DbSet<Ingredient> Ingredients { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}