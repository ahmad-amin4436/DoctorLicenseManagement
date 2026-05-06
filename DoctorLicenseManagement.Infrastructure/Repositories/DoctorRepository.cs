using DoctorLicenseManagement.Domain.Entities;
using DoctorLicenseManagement.Domain.ValueObjects;
using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Application.Interfaces;
using DoctorLicenseManagement.Domain.Enums;
using DoctorLicenseManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace DoctorLicenseManagement.Infrastructure.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<DoctorRepository> _logger;

    public DoctorRepository(AppDbContext context, ILogger<DoctorRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginationResult<DoctorDto>> GetDoctorsAsync(DoctorSearchDto searchDto)
    {
        try
        {
            var searchTerm = searchDto.SearchTerm?.Trim();
            var status = searchDto.Status;

            var query = _context.Doctors.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(d => d.FullName.Contains(searchTerm) || d.LicenseNumber.Contains(searchTerm));
            }

            // Apply status filter
            if (status.HasValue)
            {
                var today = DateTime.Today;
                switch (status.Value)
                {
                    case DoctorStatus.Active:
                        query = query.Where(d => d.Status != DoctorStatus.Suspended && d.LicenseExpiryDate >= today);
                        break;
                    case DoctorStatus.Expired:
                        query = query.Where(d => d.LicenseExpiryDate < today);
                        break;
                    case DoctorStatus.Suspended:
                        query = query.Where(d => d.Status == DoctorStatus.Suspended);
                        break;
                }
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var doctors = await query
                .OrderBy(d => d.FullName)
                .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Email = d.Email,
                    Specialization = d.Specialization,
                    LicenseNumber = d.LicenseNumber,
                    LicenseExpiryDate = d.LicenseExpiryDate,
                    Status = d.Status,
                    CreatedDate = d.CreatedDate
                })
                .ToListAsync();

            return new PaginationResult<DoctorDto>
            {
                Data = doctors,
                TotalCount = totalCount,
                PageNumber = searchDto.PageNumber,
                PageSize = searchDto.PageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctors with search criteria: {@SearchDto}", searchDto);
            throw;
        }
    }

    public async Task<DoctorDto?> GetDoctorByIdAsync(int id)
    {
        try
        {
            var doctor = await _context.Doctors
                .Where(d => d.Id == id && d.IsDeleted == false)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Email = d.Email,
                    Specialization = d.Specialization,
                    LicenseNumber = d.LicenseNumber,
                    LicenseExpiryDate = d.LicenseExpiryDate,
                    Status = d.Status,
                    CreatedDate = d.CreatedDate
                })
                .FirstOrDefaultAsync();

            return doctor;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctor with ID: {DoctorId}", id);
            throw;
        }
    }

    public async Task<DoctorDto?> GetExpiredDoctorsAsync(int pageNumber = 1, int pageSize = 50)
    {
        try
        {
            var today = DateTime.Today;
            var query = _context.Doctors
                .Where(d => d.IsDeleted == false && d.LicenseExpiryDate < today);

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination and calculate days expired
            var expiredDoctor = await query
                .OrderBy(d => d.LicenseExpiryDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Email = d.Email,
                    Specialization = d.Specialization,
                    LicenseNumber = d.LicenseNumber,
                    LicenseExpiryDate = d.LicenseExpiryDate,
                    Status = DoctorStatus.Expired,
                    CreatedDate = d.CreatedDate,
                    DaysExpired = (int)(today - d.LicenseExpiryDate).TotalDays
                })
                .FirstOrDefaultAsync();

            return expiredDoctor;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving expired doctors");
            throw;
        }
    }

    public async Task<DoctorDto> CreateDoctorAsync(CreateDoctorDto createDoctorDto)
    {
        try
        {
            var doctor = new Doctor
            {
                FullName = createDoctorDto.FullName,
                Email = createDoctorDto.Email,
                Specialization = createDoctorDto.Specialization,
                LicenseNumber = createDoctorDto.LicenseNumber,
                LicenseExpiryDate = createDoctorDto.LicenseExpiryDate,
                Status = DoctorStatus.Active,
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false
            };

            // Auto-update status based on expiry date
            doctor.UpdateStatus();

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.FullName,
                Email = doctor.Email,
                Specialization = doctor.Specialization,
                LicenseNumber = doctor.LicenseNumber,
                LicenseExpiryDate = doctor.LicenseExpiryDate,
                Status = doctor.Status,
                CreatedDate = doctor.CreatedDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating doctor: {@DoctorDto}", createDoctorDto);
            throw;
        }
    }

    public async Task<DoctorDto?> UpdateDoctorAsync(int id, UpdateDoctorDto updateDoctorDto)
    {
        try
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return null;

            doctor.FullName = updateDoctorDto.FullName;
            doctor.Email = updateDoctorDto.Email;
            doctor.Specialization = updateDoctorDto.Specialization;
            doctor.LicenseNumber = updateDoctorDto.LicenseNumber;
            doctor.LicenseExpiryDate = updateDoctorDto.LicenseExpiryDate;
            doctor.Status = updateDoctorDto.Status;

            // Auto-update status based on expiry date
            doctor.UpdateStatus();

            await _context.SaveChangesAsync();

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.FullName,
                Email = doctor.Email,
                Specialization = doctor.Specialization,
                LicenseNumber = doctor.LicenseNumber,
                LicenseExpiryDate = doctor.LicenseExpiryDate,
                Status = doctor.Status,
                CreatedDate = doctor.CreatedDate
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating doctor with ID {DoctorId}: {@DoctorDto}", id, updateDoctorDto);
            throw;
        }
    }

    public async Task<bool> UpdateDoctorStatusAsync(int id, DoctorStatus status)
    {
        try
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return false;

            doctor.Status = status;
            
            // Auto-update status based on expiry date
            doctor.UpdateStatus();

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status for doctor with ID {DoctorId} to {Status}", id, status);
            throw;
        }
    }

    public async Task<bool> DeleteDoctorAsync(int id)
    {
        try
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return false;

            doctor.SoftDelete();
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting doctor with ID {DoctorId}", id);
            throw;
        }
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        try
        {
            _logger.LogInformation("Checking email existence for: {Email}", email);
            
            var query = _context.Doctors.AsQueryable();
            
            if (excludeId.HasValue)
            {
                query = query.Where(d => d.Email == email && d.Id != excludeId.Value);
            }
            else
            {
                query = query.Where(d => d.Email == email);
            }
            
            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking email existence: {Email}", email);
            throw;
        }
    }

    public async Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeId = null)
    {
        try
        {
            _logger.LogInformation("Checking license number existence for: {LicenseNumber}", licenseNumber);
            
            var query = _context.Doctors.AsQueryable();
            
            if (excludeId.HasValue)
            {
                query = query.Where(d => d.LicenseNumber == licenseNumber && d.Id != excludeId.Value);
            }
            else
            {
                query = query.Where(d => d.LicenseNumber == licenseNumber);
            }
            
            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking license number existence: {LicenseNumber}", licenseNumber);
            throw;
        }
    }
}
