using Notes.BLL.Dtos;

namespace Notes.BLL.Services.Interfaces;

public interface INoteService
{
    Task<IReadOnlyList<NoteDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<NoteDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<NoteDto> CreateAsync(CreateNoteDto dto, CancellationToken cancellationToken = default);
    Task<NoteDto> UpdateAsync(Guid id, UpdateNoteDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}