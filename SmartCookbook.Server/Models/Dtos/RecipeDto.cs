using AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace SmartCookbook.Server.Models.Dtos
{
    public class RecipeDto : BaseEntityDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public int Difficulty { get; set; }
        public int TimeInMinutes { get; set; }
        public int NumberOfServings { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public List<Ingredient> Ingredients { get; set; } = [];
        public List<Step> Steps { get; set; } = [];

        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<RecipeDto, Recipe>().ReverseMap();
            }
        }
    }
}