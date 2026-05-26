using System.ComponentModel.DataAnnotations;

namespace AtlantisSwim.Domain.Models.User
{
    public class CreateUserDto
    {
        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName  { get; set; } = string.Empty;
        [Required] public string Email     { get; set; } = string.Empty;
        [Required] public string Password  { get; set; } = string.Empty;
        public string Phone  { get; set; } = string.Empty;

        /// <summary>1 = Student, 2 = Coach, 3 = Admin</summary>
        [Required] public int RoleId { get; set; } = 1;
    }
}
