using AtlantisSwim.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/session")]
    [ApiController]
    [AllowAnonymous]
    public class PasswordResetController : ControllerBase
    {
        private readonly DbSession _db;
        private readonly IWebHostEnvironment _env;

        public PasswordResetController(DbSession db, IWebHostEnvironment env)
        {
            _db  = db;
            _env = env;
        }

        public class ForgotPasswordDto { public string Email { get; set; } = string.Empty; }
        public class ResetPasswordDto  { public string Token { get; set; } = string.Empty; public string NewPassword { get; set; } = string.Empty; }

        // POST /api/session/forgot-password
        // Generates a one-hour reset token. In production this would be emailed to the
        // user; in Development we return it directly so the flow is testable.
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var email = (dto.Email ?? string.Empty).Trim();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

            // Always respond the same way so we don't reveal whether an email exists.
            if (user == null)
                return Ok(new
                {
                    isSuccess = true,
                    message   = "Dacă adresa există, vei primi un cod de resetare.",
                    token     = (string?)null,
                });

            var token = Guid.NewGuid().ToString("N");
            user.ResetToken       = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _db.SaveChangesAsync();

            // Only expose the token outside production (no email server configured here).
            if (_env.IsDevelopment())
            {
                return Ok(new
                {
                    isSuccess = true,
                    message   = "Token de resetare generat (mod dezvoltare).",
                    token     = token,
                });
            }

            return Ok(new
            {
                isSuccess = true,
                message   = "Dacă adresa există, vei primi un cod de resetare.",
                token     = (string?)null,
            });
        }

        // POST /api/session/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest(new { isSuccess = false, message = "Token și parolă noi obligatorii." });

            if (dto.NewPassword.Length < 6)
                return BadRequest(new { isSuccess = false, message = "Parola trebuie să aibă cel puțin 6 caractere." });

            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == dto.Token &&
                u.ResetTokenExpiry != null &&
                u.ResetTokenExpiry > DateTime.UtcNow);

            if (user == null)
                return BadRequest(new { isSuccess = false, message = "Token invalid sau expirat." });

            user.Password         = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken       = null;
            user.ResetTokenExpiry = null;
            await _db.SaveChangesAsync();

            return Ok(new { isSuccess = true, message = "Parola a fost resetată cu succes." });
        }
    }
}
