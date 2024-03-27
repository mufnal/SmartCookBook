using System.ComponentModel.DataAnnotations;

namespace SmartCookbook.Server.Models
{
    public class Recipe : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public int Difficulty { get; set; }
        public int TimeInMinutes { get; set; }
        public int NumberOfServings { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public IList<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
        public IList<Step> Steps { get; set; } = new List<Step>();
    }
}