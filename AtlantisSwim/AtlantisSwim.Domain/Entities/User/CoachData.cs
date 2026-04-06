namespace AtlantisSwim.Domain.Entities.User
{
    public class CoachData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Specialization { get; set; }
        public int ExperienceYears { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string Status { get; set; } // Active / Inactive
    }
}
