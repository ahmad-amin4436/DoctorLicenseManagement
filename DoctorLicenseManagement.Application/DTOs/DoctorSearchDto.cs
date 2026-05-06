using DoctorLicenseManagement.Domain.Enums;

namespace DoctorLicenseManagement.Application.DTOs;

public class DoctorSearchDto
{
    public string? SearchTerm { get; set; }
    public DoctorStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
