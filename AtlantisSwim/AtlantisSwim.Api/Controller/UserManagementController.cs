using System.Security.Claims;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.User;
using AtlantisSwim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UserManagementController : ControllerBase
    {
        private readonly DbSession _db;

        public UserManagementController(DbSession db)
        {
            _db = db;
        }

        // GET /api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _db.Users
                .Select(u => ToDto(u))
                .ToListAsync();
            return Ok(users);
        }

        // GET /api/users/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(ToDto(user));
        }

        // POST /api/users  — Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict(new { message = "Email already exists." });

            var user = new UserData
            {
                FirstName    = dto.FirstName,
                LastName     = dto.LastName,
                Email        = dto.Email,
                Password     = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                UserName     = dto.Email.Split('@')[0],
                Phone        = dto.Phone,
                Role         = (UserRole)dto.RoleId,
                IsActive     = true,
                RegisteredOn = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToDto(user));
        }

        // PUT /api/users/{id}  — Admin only
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (dto.FirstName != null) user.FirstName = dto.FirstName;
            if (dto.LastName  != null) user.LastName  = dto.LastName;
            if (dto.Email     != null) user.Email     = dto.Email;
            if (dto.Phone     != null) user.Phone     = dto.Phone;
            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            if (dto.RoleId    != null) user.Role      = (UserRole)dto.RoleId.Value;
            if (dto.IsActive  != null) user.IsActive  = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return Ok(ToDto(user));
        }

        // DELETE /api/users/{id}  — Admin only
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsActive = false;   // soft delete — preserves FK integrity
            await _db.SaveChangesAsync();
            return NoContent();
        }

        public class AvatarDto { public string? Avatar { get; set; } }

        // PUT /api/users/me/avatar — the logged-in user updates their own picture
        [HttpPut("me/avatar")]
        public async Task<IActionResult> UpdateMyAvatar([FromBody] AvatarDto dto)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(idStr, out int myId)) return Unauthorized();

            var user = await _db.Users.FindAsync(myId);
            if (user == null) return NotFound();

            // Basic guard: only accept image data URLs, capped to keep the row reasonable.
            var avatar = dto.Avatar?.Trim();
            if (!string.IsNullOrEmpty(avatar))
            {
                if (!avatar.StartsWith("data:image/"))
                    return BadRequest(new { message = "Format invalid. Încarcă o imagine." });
                if (avatar.Length > 2_000_000)
                    return BadRequest(new { message = "Imaginea este prea mare (max ~1.5MB)." });
            }

            user.Avatar = string.IsNullOrEmpty(avatar) ? null : avatar;
            await _db.SaveChangesAsync();
            return Ok(ToDto(user));
        }

        private static UserDto ToDto(UserData u) => new()
        {
            Id           = u.Id,
            FirstName    = u.FirstName,
            LastName     = u.LastName,
            UserName     = u.UserName,
            Email        = u.Email,
            Phone        = u.Phone ?? string.Empty,
            RoleId       = (int)u.Role,
            RoleName     = u.Role switch
            {
                UserRole.Student => "Elev",
                UserRole.Coach   => "Antrenor",
                UserRole.Admin   => "Admin",
                _                => u.Role.ToString()
            },
            IsActive     = u.IsActive,
            RegisteredOn = u.RegisteredOn,
            Avatar       = u.Avatar
        };
    }
}
