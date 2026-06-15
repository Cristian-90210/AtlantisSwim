namespace AtlantisSwim.Domain.Models.User
{
    public class UserAuthResponseDto
    {
        public int    Id        { get; set; }
        public string UserName  { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName  { get; set; } = string.Empty;
        public string Email     { get; set; } = string.Empty;

        /// <summary>1 = Student, 2 = Coach, 3 = Admin</summary>
        public int    RoleId    { get; set; }

        /// <summary>Elev | Antrenor | Admin</summary>
        public string RoleName  { get; set; } = string.Empty;

        /// <summary>JWT bearer token — store as auth_token in localStorage</summary>
        public string Token     { get; set; } = string.Empty;

        /// <summary>Profile picture as a data URL, or null.</summary>
        public string? Avatar   { get; set; }
    }
}
