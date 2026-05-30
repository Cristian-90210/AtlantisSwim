using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Offers
{
    public class SpecialOffer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student receiving offer)

        [Required]
        public int SentByUserId { get; set; }    // FK → Users.Id (admin who sent)

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        // Discount percentage 0–100
        [Required]
        [Range(0, 100)]
        public int Discount { get; set; }

        [Required]
        public DateTime ValidUntil { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
