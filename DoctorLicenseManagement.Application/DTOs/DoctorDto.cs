using DoctorLicenseManagement.Domain.Enums;

namespace DoctorLicenseManagement.Application.DTOs;

public class DoctorDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public DoctorStatus Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int? DaysExpired { get; set; } // For expired doctors
}
