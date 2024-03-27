namespace SmartCookbook.Server.Interfaces
{
    public interface IBaseRepository<T, TDto> where T : class
    {
        Task<List<TDto>> Get();

        Task<TDto> Create(TDto tDto);

        Task<TDto> Update(TDto tDto);

        Task<TDto> GetById(int id);

        Task Delete(int id);
    }
}