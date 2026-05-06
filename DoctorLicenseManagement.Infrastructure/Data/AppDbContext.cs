using DoctorLicenseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DoctorLicenseManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Doctor> Doctors { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Doctor entity
        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Specialization)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.LicenseNumber)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<string>();

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            entity.Property(e => e.DeletedDate)
                .IsRequired(false);

            // Configure indexes
            entity.HasIndex(e => e.LicenseNumber)
                .HasDatabaseName("IX_Doctors_LicenseNumber")
                .HasFilter("IsDeleted = 0");

            entity.HasIndex(e => e.Email)
                .HasDatabaseName("IX_Doctors_Email")
                .HasFilter("IsDeleted = 0");

            entity.HasIndex(e => e.Status)
                .HasDatabaseName("IX_Doctors_Status")
                .HasFilter("IsDeleted = 0");

            entity.HasIndex(e => e.LicenseExpiryDate)
                .HasDatabaseName("IX_Doctors_ExpiryDate")
                .HasFilter("IsDeleted = 0");

            // Configure query filter for soft delete
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var doctors = new[]
        {
            new Doctor
            {
                Id = 1,
                FullName = "Dr. John Smith",
                Email = "john.smith@email.com",
                Specialization = "Cardiology",
                LicenseNumber = "MED123456",
                LicenseExpiryDate = new DateTime(2025, 12, 31),
                Status = Domain.Enums.DoctorStatus.Active,
                CreatedDate = DateTime.UtcNow.AddDays(-30),
                IsDeleted = false
            },
            new Doctor
            {
                Id = 2,
                FullName = "Dr. Sarah Johnson",
                Email = "sarah.johnson@email.com",
                Specialization = "Neurology",
                LicenseNumber = "MED789012",
                LicenseExpiryDate = new DateTime(2024, 6, 30),
                Status = Domain.Enums.DoctorStatus.Active,
                CreatedDate = DateTime.UtcNow.AddDays(-25),
                IsDeleted = false
            },
            new Doctor
            {
                Id = 3,
                FullName = "Dr. Michael Brown",
                Email = "michael.brown@email.com",
                Specialization = "Pediatrics",
                LicenseNumber = "MED345678",
                LicenseExpiryDate = new DateTime(2023, 12, 31),
                Status = Domain.Enums.DoctorStatus.Expired,
                CreatedDate = DateTime.UtcNow.AddDays(-20),
                IsDeleted = false
            },
            new Doctor
            {
                Id = 4,
                FullName = "Dr. Emily Davis",
                Email = "emily.davis@email.com",
                Specialization = "Orthopedics",
                LicenseNumber = "MED901234",
                LicenseExpiryDate = new DateTime(2026, 3, 15),
                Status = Domain.Enums.DoctorStatus.Active,
                CreatedDate = DateTime.UtcNow.AddDays(-15),
                IsDeleted = false
            },
            new Doctor
            {
                Id = 5,
                FullName = "Dr. Robert Wilson",
                Email = "robert.wilson@email.com",
                Specialization = "Dermatology",
                LicenseNumber = "MED567890",
                LicenseExpiryDate = new DateTime(2024, 9, 30),
                Status = Domain.Enums.DoctorStatus.Suspended,
                CreatedDate = DateTime.UtcNow.AddDays(-10),
                IsDeleted = false
            }
        };

        modelBuilder.Entity<Doctor>().HasData(doctors);
    }
}
