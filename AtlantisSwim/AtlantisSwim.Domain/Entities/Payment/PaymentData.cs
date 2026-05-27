using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Payment
{
    public class PaymentData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id

        // FK → Subscriptions.Id (set after subscription is created)
        public int? SubscriptionId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        // "card", "cash", "transfer"
        [Required]
        [StringLength(20)]
        public string Method { get; set; } = "card";

        // "pending", "completed", "failed", "refunded"
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "pending";

        [StringLength(200)]
        public string? TransactionReference { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }
    }
}
