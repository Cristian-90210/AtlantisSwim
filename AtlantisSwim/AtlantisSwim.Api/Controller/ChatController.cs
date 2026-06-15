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

            var ids = users.Select(u => u.Id).ToList();

            // Pull every message exchanged between me and these users in one round-trip,
            // so we can compute the last-message time + unread count per conversation.
            var related = await _db.ChatMessages
                .Where(m => (m.SenderId == myId && ids.Contains(m.ReceiverId)) ||
                            (m.ReceiverId == myId && ids.Contains(m.SenderId)))
                .ToListAsync();

            var result = users
                .Select(u =>
                {
                    var convo = related
                        .Where(m => m.SenderId == u.Id || m.ReceiverId == u.Id)
                        .OrderBy(m => m.SentAt)
                        .ToList();
                    var last = convo.LastOrDefault();
                    return new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        u.role,
                        lastMessageAt      = last?.SentAt,
                        lastMessageContent = last == null ? null : (last.IsDeleted ? "Mesaj șters" : last.Content),
                        unreadCount        = convo.Count(m => m.SenderId == u.Id &&
                                                              m.ReceiverId == myId && !m.IsRead)
                    };
                })
                // Most-recently-active conversations first; contacts with no messages yet
                // fall to the bottom, ordered alphabetically.
                .OrderByDescending(x => x.lastMessageAt.HasValue)
                .ThenByDescending(x => x.lastMessageAt)
                .ThenBy(x => x.FirstName)
                .ThenBy(x => x.LastName)
                .ToList();

            return Ok(result);
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
                    m.IsRead,
                    m.IsEdited,
                    m.EditedAt,
                    m.IsDeleted
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
