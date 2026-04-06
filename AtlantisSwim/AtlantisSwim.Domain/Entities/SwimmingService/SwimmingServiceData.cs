using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AtlantisSwim.Domain.Entities.SwimmingService
{
    public class SwimmingServiceData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ServiceName { get; set; }

        [StringLength(400)]
        public string ServiceDescription { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ServicePrice { get; set; }

        public bool IsDeleted { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; }
    }
}
