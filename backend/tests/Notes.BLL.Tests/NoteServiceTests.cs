using Notes.BLL.Dtos;
using Notes.BLL.Exceptions;
using Notes.BLL.Services;
using Notes.DAL.Entities;
using Notes.DAL.Repositories.Interfaces;
using NSubstitute;

namespace Notes.BLL.Tests;

public class NoteServiceTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 4, 12, 0, 0, TimeSpan.Zero);

    private readonly INoteRepository _repository = Substitute.For<INoteRepository>();
    private readonly NoteService _service;

    public NoteServiceTests() =>
        _service = new NoteService(_repository, new FixedTimeProvider(Now));

    [Fact]
    public async Task CreateAsync_TrimsInput_AndSetsIdAndTimestamps()
    {
        var result = await _service.CreateAsync(new CreateNoteDto { Title = "  Title  ", Content = "  Body  " });

        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Title", result.Title);
        Assert.Equal("Body", result.Content);
        Assert.Equal(Now.UtcDateTime, result.CreatedAt);
        Assert.Equal(Now.UtcDateTime, result.UpdatedAt);
        await _repository.Received(1).AddAsync(Arg.Any<Note>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateAsync_NullContent_BecomesEmptyString()
    {
        var result = await _service.CreateAsync(new CreateNoteDto { Title = "Title", Content = null });

        Assert.Equal(string.Empty, result.Content);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllNotes()
    {
        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns([NewNote(), NewNote()]);

        var result = await _service.GetAllAsync();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingNote_ReturnsDto()
    {
        var note = NewNote();
        _repository.GetByIdAsync(note.Id, Arg.Any<CancellationToken>()).Returns(note);

        var result = await _service.GetByIdAsync(note.Id);

        Assert.Equal(note.Id, result.Id);
    }

    [Fact]
    public async Task GetByIdAsync_MissingNote_ThrowsNotFound()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Note?)null);

        await Assert.ThrowsAsync<NotFoundException>(() => _service.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task UpdateAsync_ChangesFieldsAndUpdatedAt_ButKeepsCreatedAt()
    {
        var note = NewNote();
        var createdAt = note.CreatedAt;
        _repository.GetByIdAsync(note.Id, Arg.Any<CancellationToken>()).Returns(note);

        var result = await _service.UpdateAsync(note.Id, new UpdateNoteDto { Title = " New ", Content = " Text " });

        Assert.Equal("New", result.Title);
        Assert.Equal("Text", result.Content);
        Assert.Equal(createdAt, result.CreatedAt);
        Assert.Equal(Now.UtcDateTime, result.UpdatedAt);
        await _repository.Received(1).UpdateAsync(note, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAsync_MissingNote_ThrowsNotFound_AndDoesNotSave()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Note?)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.UpdateAsync(Guid.NewGuid(), new UpdateNoteDto { Title = "x" }));

        await _repository.DidNotReceive().UpdateAsync(Arg.Any<Note>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task DeleteAsync_ExistingNote_CallsRepository()
    {
        var note = NewNote();
        _repository.GetByIdAsync(note.Id, Arg.Any<CancellationToken>()).Returns(note);

        await _service.DeleteAsync(note.Id);

        await _repository.Received(1).DeleteAsync(note, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task DeleteAsync_MissingNote_ThrowsNotFound_AndDoesNotDelete()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Note?)null);

        await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(Guid.NewGuid()));
        await _repository.DidNotReceive().DeleteAsync(Arg.Any<Note>(), Arg.Any<CancellationToken>());
    }

    private static Note NewNote() => new()
    {
        Id = Guid.NewGuid(),
        Title = "Title",
        Content = "Content",
        CreatedAt = Now.UtcDateTime.AddDays(-1),
        UpdatedAt = Now.UtcDateTime.AddDays(-1)
    };

    private sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }
}