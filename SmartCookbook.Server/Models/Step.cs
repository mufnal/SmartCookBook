using System.ComponentModel.DataAnnotations;

namespace SmartCookbook.Server.Models
{
    public class Step : BaseEntity
    {
        public string Description { get; set; } = string.Empty;
        public int Index { get; set; }
    }
}