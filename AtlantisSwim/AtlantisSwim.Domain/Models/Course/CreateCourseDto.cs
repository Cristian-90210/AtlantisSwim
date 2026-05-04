using System.ComponentModel.DataAnnotations;

namespace AtlantisSwim.Domain.Models.Course
{
    public class CreateCourseDto
    {
        [Required] public string  Name        { get; set; } = string.Empty;
        [Required] public string  Description { get; set; } = string.Empty;
        [Required] public decimal Price       { get; set; }
        [Required] public int     Capacity    { get; set; }
        public string Schedule { get; set; } = string.Empty;

        /// <summary>1 = Beginner, 2 = Intermediate, 3 = Advanced</summary>
        [Required] public int LevelId { get; set; }
    }
}
