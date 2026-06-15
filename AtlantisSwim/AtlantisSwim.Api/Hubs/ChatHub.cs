using System.Collections.Concurrent;
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

        // userId -> number of active connections (a user may have multiple tabs open)
        private static readonly ConcurrentDictionary<int, int> _online = new();

        public ChatHub(DbSession db)
        {
            _db = db;
        }

        private int? CurrentUserId()
        {
            var idStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(idStr, out int id) ? id : (int?)null;
        }

        public override async Task OnConnectedAsync()
        {
            var id = CurrentUserId();
            if (id.HasValue)
            {
                var count = _online.AddOrUpdate(id.Value, 1, (_, c) => c + 1);
                if (count == 1) // just came online
                    await Clients.Others.SendAsync("UserOnline", id.Value);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(System.Exception? exception)
        {
            var id = CurrentUserId();
            if (id.HasValue)
            {
                var count = _online.AddOrUpdate(id.Value, 0, (_, c) => c - 1);
                if (count <= 0)
                {
                    _online.TryRemove(id.Value, out _);
                    await Clients.Others.SendAsync("UserOffline", id.Value);
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        // Returns the ids of users currently connected — used to seed the UI on load.
        public Task<int[]> GetOnlineUsers() => Task.FromResult(_online.Keys.ToArray());

        // Notify a contact that the current user is typing to them.
        public async Task Typing(int receiverId)
        {
            var senderId = CurrentUserId();
            if (senderId.HasValue)
                await Clients.User(receiverId.ToString()).SendAsync("UserTyping", senderId.Value);
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
                isRead = msg.IsRead,
                isEdited = msg.IsEdited,
                editedAt = msg.EditedAt,
                isDeleted = msg.IsDeleted
            };

            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", payload);
            await Clients.Caller.SendAsync("ReceiveMessage", payload);
        }

        public async Task EditMessage(int messageId, string content)
        {
            var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(senderIdStr, out int senderId)) return;
            if (string.IsNullOrWhiteSpace(content)) return;

            var msg = await _db.ChatMessages.FindAsync(messageId);
            // Only the author may edit, and a deleted message can't be edited.
            if (msg == null || msg.SenderId != senderId || msg.IsDeleted) return;

            msg.Content  = content.Trim();
            msg.IsEdited = true;
            msg.EditedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            await BroadcastUpdate(msg);
        }

        public async Task DeleteMessage(int messageId)
        {
            var senderIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(senderIdStr, out int senderId)) return;

            var msg = await _db.ChatMessages.FindAsync(messageId);
            // Only the author may delete; ignore an already-deleted message.
            if (msg == null || msg.SenderId != senderId || msg.IsDeleted) return;

            msg.IsDeleted = true;
            msg.Content   = string.Empty;   // wipe stored text — keep only the tombstone
            await _db.SaveChangesAsync();

            await BroadcastUpdate(msg);
        }

        // Notify both participants that a message changed (edited or deleted).
        private async Task BroadcastUpdate(Domain.Entities.Chat.ChatMessage msg)
        {
            var payload = new
            {
                id         = msg.Id,
                senderId   = msg.SenderId,
                receiverId = msg.ReceiverId,
                content    = msg.Content,
                sentAt     = msg.SentAt,
                isRead     = msg.IsRead,
                isEdited   = msg.IsEdited,
                editedAt   = msg.EditedAt,
                isDeleted  = msg.IsDeleted
            };

            await Clients.User(msg.ReceiverId.ToString()).SendAsync("MessageUpdated", payload);
            await Clients.Caller.SendAsync("MessageUpdated", payload);
        }

        public async Task MarkRead(int senderId)
        {
            var receiverIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(receiverIdStr, out int receiverId)) return;

            var unread = await _db.ChatMessages
                .Where(m => m.SenderId == senderId && m.ReceiverId == receiverId && !m.IsRead)
                .ToListAsync();

            foreach (var m in unread) m.IsRead = true;
            if (unread.Count > 0)
            {
                await _db.SaveChangesAsync();
                // Tell the original sender their messages to this reader were seen.
                await Clients.User(senderId.ToString()).SendAsync("MessagesRead", receiverId);
            }
        }
    }
}
