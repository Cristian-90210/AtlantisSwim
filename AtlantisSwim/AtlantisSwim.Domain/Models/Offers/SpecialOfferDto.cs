namespace AtlantisSwim.Domain.Models.Offers
{
    public class SpecialOfferDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int SentByUserId { get; set; }
        public string SentByName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Discount { get; set; }
        public DateTime ValidUntil { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class CreateSpecialOfferDto
    {
        public int StudentUserId { get; set; }
        public int SentByUserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Discount { get; set; }
        public DateTime ValidUntil { get; set; }
    }
}
