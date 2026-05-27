using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.User;
using AtlantisSwim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/coaches")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly DbSession _db;

        public CoachController(DbSession db)
        {
            _db = db;
        }

        // GET /api/coaches — public (displayed on landing page and courses page)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var coaches = await _db.Users
                .Where(u => u.Role == UserRole.Coach && u.IsActive)
                .Select(u => new CoachDto
                {
                    Id        = u.Id,
                    FirstName = u.FirstName,
                    LastName  = u.LastName,
                    Email     = u.Email,
                    Phone     = u.Phone ?? string.Empty,
                    IsActive  = u.IsActive
                })
                .ToListAsync();

            return Ok(coaches);
        }
    }
}
