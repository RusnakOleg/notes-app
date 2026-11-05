using Microsoft.EntityFrameworkCore;
using Notes.DAL.Data;
using Notes.DAL.Entities;
using Notes.DAL.Repositories.Interfaces;

namespace Notes.DAL.Repositories;

public class NoteRepository(AppDbContext db) : INoteRepository
{
    public Task<List<Note>> GetAllAsync(CancellationToken cancellationToken = default) =>
        db.Notes
            .AsNoTracking()
            .OrderByDescending(n => n.UpdatedAt)
            .ToListAsync(cancellationToken);

    public Task<Note?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        db.Notes.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

    public async Task AddAsync(Note note, CancellationToken cancellationToken = default)
    {
        db.Notes.Add(note);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Note note, CancellationToken cancellationToken = default)
    {
        db.Notes.Update(note);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Note note, CancellationToken cancellationToken = default)
    {
        db.Notes.Remove(note);
        await db.SaveChangesAsync(cancellationToken);
    }
}