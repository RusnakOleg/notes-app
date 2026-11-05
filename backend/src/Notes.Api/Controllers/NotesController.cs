using Microsoft.AspNetCore.Mvc;
using Notes.BLL.Dtos;
using Notes.BLL.Services.Interfaces;

namespace Notes.Api.Controllers;

[ApiController]
[Route("notes")]
[Produces("application/json")]
public class NotesController(INoteService noteService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken) =>
        Ok(await noteService.GetAllAsync(cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken) =>
        Ok(await noteService.GetByIdAsync(id, cancellationToken));

    [HttpPost]
    public async Task<IActionResult> Create(CreateNoteDto dto, CancellationToken cancellationToken)
    {
        var created = await noteService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateNoteDto dto, CancellationToken cancellationToken) =>
        Ok(await noteService.UpdateAsync(id, dto, cancellationToken));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await noteService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}