using Microsoft.EntityFrameworkCore;
using Notes.DAL.Entities;

namespace Notes.DAL.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Note> Notes => Set<Note>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Note>(entity =>
        {
            entity.ToTable("Notes");
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Title).IsRequired().HasMaxLength(200);
            entity.Property(n => n.Content).IsRequired().HasMaxLength(10000);
            entity.HasIndex(n => n.UpdatedAt); // список сортується за UpdatedAt
        });
    }
}