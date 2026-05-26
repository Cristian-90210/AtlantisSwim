using System.Security.Claims;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly DbSession _db;

        public ChatHub(DbSession db)
        {
            _db = db;
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(senderIdStr, out int senderId)) return;

            if (string.IsNullOrWhiteSpace(content)) return;

            var sender = await _db.Users.FindAsync(senderId);
            var receiver = await _db.Users.FindAsync(receiverId);
            if (sender == null || receiver == null) return;

            var msg = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content.Trim(),
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _db.ChatMessages.Add(msg);
            await _db.SaveChangesAsync();

            var payload = new
            {
                id = msg.Id,
                senderId = msg.SenderId,
                senderName = $"{sender.FirstName} {sender.LastName}".Trim(),
                receiverId = msg.ReceiverId,
                receiverName = $"{receiver.FirstName} {receiver.LastName}".Trim(),
                content = msg.Content,
                sentAt = msg.SentAt,
                isRead = msg.IsRead
            };

            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", payload);
            await Clients.Caller.SendAsync("ReceiveMessage", payload);
        }

        public async Task MarkRead(int senderId)
        {
            var receiverIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(receiverIdStr, out int receiverId)) return;

            var unread = await _db.ChatMessages
                .Where(m => m.SenderId == senderId && m.ReceiverId == receiverId && !m.IsRead)
                .ToListAsync();

            foreach (var m in unread) m.IsRead = true;
            if (unread.Count > 0) await _db.SaveChangesAsync();
        }
    }
}
