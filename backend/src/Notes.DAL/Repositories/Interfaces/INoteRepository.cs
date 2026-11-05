using Notes.DAL.Entities;

namespace Notes.DAL.Repositories.Interfaces;

public interface INoteRepository
{
    Task<List<Note>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Note?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Note note, CancellationToken cancellationToken = default);
    Task UpdateAsync(Note note, CancellationToken cancellationToken = default);
    Task DeleteAsync(Note note, CancellationToken cancellationToken = default);
}