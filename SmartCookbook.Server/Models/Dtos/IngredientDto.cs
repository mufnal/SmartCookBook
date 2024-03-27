using AutoMapper;
using SmartCookbook.Server.Enums;

namespace SmartCookbook.Server.Models.Dtos
{
    public class IngredientDto : BaseEntityDto
    {
        public string Name { get; set; } = string.Empty;

        public int? AmountOf { get; set; }

        public Unit? Unit { get; set; }
        public bool Mandatory { get; set; }

        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<IngredientDto, Ingredient>().ReverseMap();
            }
        }
    }
}