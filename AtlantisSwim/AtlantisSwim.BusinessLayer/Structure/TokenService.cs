using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AtlantisSwim.Domain.Entities.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class TokenService
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiresInHours;

        public TokenService()
        {
            // Read from appsettings.json via configuration
            var config = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            _key           = config["Jwt:Key"]           ?? "AtlantisSwim-SuperSecret-JWT-Key-2024!@#$%^&*()";
            _issuer        = config["Jwt:Issuer"]        ?? "AtlantisSwim.Api";
            _audience      = config["Jwt:Audience"]      ?? "AtlantisSwim.Frontend";
            _expiresInHours = int.TryParse(config["Jwt:ExpiresInHours"], out var h) ? h : 24;
        }

        public string GenerateToken(int userId, string email, UserRole role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role,               role.ToString()),
                new Claim("roleId",                      ((int)role).ToString()),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             _issuer,
                audience:           _audience,
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(_expiresInHours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Obsolete("Use GenerateToken(userId, email, role) instead.")]
        public string GenerateToken() => Guid.NewGuid().ToString();
    }
}
