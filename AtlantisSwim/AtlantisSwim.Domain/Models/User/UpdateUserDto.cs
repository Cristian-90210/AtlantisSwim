namespace AtlantisSwim.Domain.Models.User
{
    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName  { get; set; }
        public string? Email     { get; set; }
        public string? Phone     { get; set; }
        public string? Password  { get; set; }
        public int?    RoleId    { get; set; }
        public bool?   IsActive  { get; set; }
    }
}
