using System.Security.Claims;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Controller
{
    [ApiController]
    [Route("api/chat")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly DbSession _db;

        public ChatController(DbSession db)
        {
            _db = db;
        }

        // GET /api/chat/users — list of users the current user can chat with
        [HttpGet("users")]
        public async Task<IActionResult> GetChatUsers()
        {
            var myIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(myIdStr, out int myId)) return Unauthorized();

            var me = await _db.Users.FindAsync(myId);
            if (me == null) return Unauthorized();

            IQueryable<UserData> query = me.Role switch
            {
                UserRole.Student => _db.Users.Where(u => u.Role == UserRole.Coach  && u.IsActive),
                UserRole.Coach   => _db.Users.Where(u => u.Role == UserRole.Student && u.IsActive),
                _                => _db.Users.Where(u => u.Id != myId && u.IsActive),
            };

            var users = await query
                .Select(u => new { u.Id, u.FirstName, u.LastName, role = (int)u.Role })
                .ToListAsync();

            return Ok(users);
        }

        // GET /api/chat/history/{otherUserId} — conversation history + marks incoming as read
        [HttpGet("history/{otherUserId:int}")]
        public async Task<IActionResult> GetHistory(int otherUserId)
        {
            var myIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(myIdStr, out int myId)) return Unauthorized();

            var messages = await _db.ChatMessages
                .Where(m =>
                    (m.SenderId == myId    && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == myId))
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.Id,
                    m.SenderId,
                    m.ReceiverId,
                    m.Content,
                    m.SentAt,
                    m.IsRead
                })
                .ToListAsync();

            // Mark incoming messages as read
            var unread = await _db.ChatMessages
                .Where(m => m.SenderId == otherUserId && m.ReceiverId == myId && !m.IsRead)
                .ToListAsync();

            foreach (var m in unread) m.IsRead = true;
            if (unread.Count > 0) await _db.SaveChangesAsync();

            return Ok(messages);
        }
    }
}
