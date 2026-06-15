using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.User
{
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(30)]
        public string FirstName { get; set; }

        [StringLength(30)]
        public string LastName { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 4)]
        public string UserName { get; set; }
        
        [Required]
        [StringLength(30)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "text")]
        public string Password { get; set; }

        [StringLength(12)]
        public string Phone { get; set; }

        public UserRole Role { get; set; }

        [DataType(DataType.Date)]
        public DateTime RegisteredOn { get; set; }

        public bool IsActive { get; set; } = true;

        // Profile picture stored as a data URL (data:image/...;base64,...). Nullable.
        [Column(TypeName = "text")]
        public string? Avatar { get; set; }

        // Self-service password reset (token + expiry). Nullable when no reset pending.
        [StringLength(100)]
        public string? ResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }
    }
}
