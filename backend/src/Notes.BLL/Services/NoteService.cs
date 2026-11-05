using Notes.BLL.Dtos;
using Notes.BLL.Exceptions;
using Notes.BLL.Services.Interfaces;
using Notes.DAL.Entities;
using Notes.DAL.Repositories.Interfaces;

namespace Notes.BLL.Services;

public class NoteService(INoteRepository repository, TimeProvider timeProvider) : INoteService
{
    public async Task<IReadOnlyList<NoteDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var notes = await repository.GetAllAsync(cancellationToken);
        return notes.Select(ToDto).ToList();
    }

    public async Task<NoteDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        ToDto(await GetOrThrowAsync(id, cancellationToken));

    public async Task<NoteDto> CreateAsync(CreateNoteDto dto, CancellationToken cancellationToken = default)
    {
        var now = timeProvider.GetUtcNow().UtcDateTime;
        var note = new Note
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Content = dto.Content?.Trim() ?? string.Empty,
            CreatedAt = now,
            UpdatedAt = now
        };

        await repository.AddAsync(note, cancellationToken);
        return ToDto(note);
    }

    public async Task<NoteDto> UpdateAsync(Guid id, UpdateNoteDto dto, CancellationToken cancellationToken = default)
    {
        var note = await GetOrThrowAsync(id, cancellationToken);

        note.Title = dto.Title.Trim();
        note.Content = dto.Content?.Trim() ?? string.Empty;
        note.UpdatedAt = timeProvider.GetUtcNow().UtcDateTime;

        await repository.UpdateAsync(note, cancellationToken);
        return ToDto(note);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var note = await GetOrThrowAsync(id, cancellationToken);
        await repository.DeleteAsync(note, cancellationToken);
    }

    private async Task<Note> GetOrThrowAsync(Guid id, CancellationToken cancellationToken) =>
        await repository.GetByIdAsync(id, cancellationToken)
        ?? throw new NotFoundException(nameof(Note), id);

    private static NoteDto ToDto(Note note) =>
        new(note.Id, note.Title, note.Content, note.CreatedAt, note.UpdatedAt);
}