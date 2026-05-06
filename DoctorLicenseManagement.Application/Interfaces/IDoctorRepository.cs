using DoctorLicenseManagement.Domain.Entities;
using DoctorLicenseManagement.Domain.ValueObjects;
using DoctorLicenseManagement.Application.DTOs;

namespace DoctorLicenseManagement.Application.Interfaces;

public interface IDoctorRepository
{
    Task<PaginationResult<DoctorDto>> GetDoctorsAsync(DoctorSearchDto searchDto);
    Task<DoctorDto?> GetDoctorByIdAsync(int id);
    Task<DoctorDto?> GetExpiredDoctorsAsync(int pageNumber = 1, int pageSize = 50);
    Task<DoctorDto> CreateDoctorAsync(CreateDoctorDto createDoctorDto);
    Task<DoctorDto?> UpdateDoctorAsync(int id, UpdateDoctorDto updateDoctorDto);
    Task<bool> UpdateDoctorStatusAsync(int id, DoctorLicenseManagement.Domain.Enums.DoctorStatus status);
    Task<bool> DeleteDoctorAsync(int id);
    Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeId = null);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
}
