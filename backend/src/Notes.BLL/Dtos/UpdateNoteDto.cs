using System.ComponentModel.DataAnnotations;

namespace Notes.BLL.Dtos;

public class UpdateNoteDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(10000)]
    public string? Content { get; set; }
}