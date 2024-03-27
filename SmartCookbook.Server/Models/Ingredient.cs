using SmartCookbook.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace SmartCookbook.Server.Models
{
    public class Ingredient : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public int? AmountOf { get; set; }

        public Unit? Unit { get; set; }
        public bool IsMandatory { get; set; }
    }
}