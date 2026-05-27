using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Announcement;
using AtlantisSwim.Domain.Models.Announcement;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly DbSession _db;

        public AnnouncementService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<AnnouncementDto>> GetAllAsync(string? target = null)
        {
            var query = from a in _db.Announcements
                        where a.IsActive
                        join u in _db.Users on a.AuthorUserId equals u.Id
                        orderby a.CreatedAt descending
                        select new AnnouncementDto
                        {
                            Id           = a.Id,
                            Title        = a.Title,
                            Message      = a.Message,
                            Target       = a.Target,
                            AuthorUserId = a.AuthorUserId,
                            AuthorName   = u.FirstName + " " + u.LastName,
                            CreatedAt    = a.CreatedAt,
                            IsActive     = a.IsActive
                        };

            if (!string.IsNullOrWhiteSpace(target))
                query = query.Where(a => a.Target == "all" || a.Target == target);

            return await query.ToListAsync();
        }

        public async Task<AnnouncementDto?> GetByIdAsync(int id)
        {
            var a = await _db.Announcements.FindAsync(id);
            if (a == null) return null;

            var author = await _db.Users.FindAsync(a.AuthorUserId);
            return new AnnouncementDto
            {
                Id           = a.Id,
                Title        = a.Title,
                Message      = a.Message,
                Target       = a.Target,
                AuthorUserId = a.AuthorUserId,
                AuthorName   = author != null ? $"{author.FirstName} {author.LastName}" : string.Empty,
                CreatedAt    = a.CreatedAt,
                IsActive     = a.IsActive
            };
        }

        public async Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto)
        {
            var announcement = new AnnouncementData
            {
                Title        = dto.Title,
                Message      = dto.Message,
                Target       = dto.Target,
                AuthorUserId = dto.AuthorUserId,
                IsActive     = true,
                CreatedAt    = DateTime.UtcNow
            };

            _db.Announcements.Add(announcement);
            await _db.SaveChangesAsync();

            var author = await _db.Users.FindAsync(announcement.AuthorUserId);
            return new AnnouncementDto
            {
                Id           = announcement.Id,
                Title        = announcement.Title,
                Message      = announcement.Message,
                Target       = announcement.Target,
                AuthorUserId = announcement.AuthorUserId,
                AuthorName   = author != null ? $"{author.FirstName} {author.LastName}" : string.Empty,
                CreatedAt    = announcement.CreatedAt,
                IsActive     = announcement.IsActive
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var announcement = await _db.Announcements.FindAsync(id);
            if (announcement == null) return false;

            announcement.IsActive = false; // soft delete
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
