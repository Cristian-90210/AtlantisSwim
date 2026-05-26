
using System.ComponentModel.DataAnnotations;

namespace AtlantisSwim.Domain.Entities.Chat
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; }
    }
}
