using AutoMapper;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using SmartCookbook.Server.Databases;
using SmartCookbook.Server.Interfaces;
using SmartCookbook.Server.Models;
using SmartCookbook.Server.Models.Dtos;

namespace SmartCookbook.Server.Repositories
{
    public class BaseRepository<T, TDto> : IBaseRepository<T, TDto> where T : BaseEntity, new() where TDto : BaseEntityDto
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        private readonly DbSet<T> table;

        public BaseRepository(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            table = _dbContext.Set<T>();
        }

        public virtual async Task<TDto> Create(TDto tDto)
        {
            //null entity exception
            if (tDto == null)
                throw new NotImplementedException();

            var entity = await table.FirstOrDefaultAsync(e => e.Id == tDto.Id);

            //entity exists exception
            if (entity != null)
                throw new NotImplementedException();

            var dbEntity = new T();

            _mapper.Map(tDto, dbEntity);

            await table.AddAsync(dbEntity);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<TDto>(dbEntity);
        }

        public virtual async Task Delete(int id)
        {
            var entity = await table.FirstOrDefaultAsync(e => e.Id == id);
            if (entity != null)
            {
                table.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }

        public virtual async Task<List<TDto>> Get()
        {
            return _mapper.Map<List<TDto>>(await table.ToListAsync());
        }

        public virtual async Task<TDto> GetById(int id)
        {
            var t = await table.FirstOrDefaultAsync(e => e.Id == id);
            var tDto = _mapper.Map<TDto>(t);
            return tDto;
        }

        public virtual async Task<TDto> Update(TDto tDto)
        {
            //null entity exception
            if (tDto == null)
                throw new NotImplementedException();

            var entity = await table.FirstOrDefaultAsync(e => e.Id == tDto.Id) ?? throw new NotImplementedException();
            _mapper.Map(tDto, entity);
            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
            var mappedEntity = _mapper.Map<TDto>(entity);
            return mappedEntity;
        }
    }
}