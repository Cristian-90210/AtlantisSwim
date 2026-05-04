namespace AtlantisSwim.Domain.Models.User
{
    public class UserDto
    {
        public int    Id        { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName  { get; set; } = string.Empty;
        public string UserName  { get; set; } = string.Empty;
        public string Email     { get; set; } = string.Empty;
        public string Phone     { get; set; } = string.Empty;
        public int    RoleId    { get; set; }
        public string RoleName  { get; set; } = string.Empty;
        public bool   IsActive  { get; set; }
        public DateTime RegisteredOn { get; set; }
    }
}
