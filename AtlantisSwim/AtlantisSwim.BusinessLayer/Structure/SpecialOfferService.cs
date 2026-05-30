using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Offers;
using AtlantisSwim.Domain.Models.Offers;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class SpecialOfferService : ISpecialOfferService
    {
        private readonly DbSession _db;

        public SpecialOfferService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<SpecialOfferDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<SpecialOfferDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(o => o.StudentUserId == studentUserId).ToListAsync();

        public async Task<SpecialOfferDto> CreateAsync(CreateSpecialOfferDto dto)
        {
            var offer = new SpecialOffer
            {
                StudentUserId = dto.StudentUserId,
                SentByUserId  = dto.SentByUserId,
                Title         = dto.Title,
                Description   = dto.Description,
                Discount      = dto.Discount,
                ValidUntil    = dto.ValidUntil,
                SentAt        = DateTime.UtcNow
            };
            _db.SpecialOffers.Add(offer);
            await _db.SaveChangesAsync();
            return await ToDto(offer);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var offer = await _db.SpecialOffers.FindAsync(id);
            if (offer == null) return false;
            _db.SpecialOffers.Remove(offer);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<SpecialOfferDto> BuildQuery() =>
            from o in _db.SpecialOffers
            join s  in _db.Users on o.StudentUserId equals s.Id
            join sb in _db.Users on o.SentByUserId  equals sb.Id
            orderby o.SentAt descending
            select new SpecialOfferDto
            {
                Id            = o.Id,
                StudentUserId = o.StudentUserId,
                StudentName   = s.FirstName  + " " + s.LastName,
                SentByUserId  = o.SentByUserId,
                SentByName    = sb.FirstName + " " + sb.LastName,
                Title         = o.Title,
                Description   = o.Description,
                Discount      = o.Discount,
                ValidUntil    = o.ValidUntil,
                SentAt        = o.SentAt
            };

        private async Task<SpecialOfferDto> ToDto(SpecialOffer o)
        {
            var student = await _db.Users.FindAsync(o.StudentUserId);
            var sender  = await _db.Users.FindAsync(o.SentByUserId);
            return new SpecialOfferDto
            {
                Id            = o.Id,
                StudentUserId = o.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                SentByUserId  = o.SentByUserId,
                SentByName    = sender  != null ? $"{sender.FirstName} {sender.LastName}"   : string.Empty,
                Title         = o.Title,
                Description   = o.Description,
                Discount      = o.Discount,
                ValidUntil    = o.ValidUntil,
                SentAt        = o.SentAt
            };
        }
    }
}
