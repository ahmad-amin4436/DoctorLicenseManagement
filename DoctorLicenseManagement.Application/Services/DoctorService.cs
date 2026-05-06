using DoctorLicenseManagement.Domain.Entities;
using DoctorLicenseManagement.Domain.ValueObjects;
using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Application.Interfaces;
using DoctorLicenseManagement.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace DoctorLicenseManagement.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly ILogger<DoctorService> _logger;

    public DoctorService(IDoctorRepository doctorRepository, ILogger<DoctorService> logger)
    {
        _doctorRepository = doctorRepository;
        _logger = logger;
    }

    public async Task<PaginationResult<DoctorDto>> GetDoctorsAsync(DoctorSearchDto searchDto)
    {
        try
        {
            return await _doctorRepository.GetDoctorsAsync(searchDto);
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
            return await _doctorRepository.GetDoctorByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctor with ID: {DoctorId}", id);
            throw;
        }
    }

    public async Task<PaginationResult<DoctorDto>> GetExpiredDoctorsAsync(int pageNumber = 1, int pageSize = 50)
    {
        try
        {
            var expiredDoctors = await _doctorRepository.GetExpiredDoctorsAsync(pageNumber, pageSize);
            
            // Convert to PaginationResult if needed
            return new PaginationResult<DoctorDto>
            {
                Data = expiredDoctors != null ? new List<DoctorDto> { expiredDoctors } : new List<DoctorDto>(),
                TotalCount = expiredDoctors != null ? 1 : 0,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
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
            // Validate business rules
            if (await _doctorRepository.LicenseNumberExistsAsync(createDoctorDto.LicenseNumber))
            {
                throw new InvalidOperationException($"License number '{createDoctorDto.LicenseNumber}' already exists.");
            }

            if (await _doctorRepository.EmailExistsAsync(createDoctorDto.Email))
            {
                throw new InvalidOperationException($"Email '{createDoctorDto.Email}' already exists.");
            }

            // Auto-update status based on expiry date
            var doctor = new Doctor
            {
                FullName = createDoctorDto.FullName,
                Email = createDoctorDto.Email,
                Specialization = createDoctorDto.Specialization,
                LicenseNumber = createDoctorDto.LicenseNumber,
                LicenseExpiryDate = createDoctorDto.LicenseExpiryDate,
                Status = DoctorStatus.Active, // Will be auto-updated by repository
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false
            };

            doctor.UpdateStatus();

            return await _doctorRepository.CreateDoctorAsync(createDoctorDto);
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
            // Check if doctor exists
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null)
            {
                throw new KeyNotFoundException($"Doctor with ID {id} not found.");
            }

            // Validate business rules
            if (await _doctorRepository.LicenseNumberExistsAsync(updateDoctorDto.LicenseNumber, id))
            {
                throw new InvalidOperationException($"License number '{updateDoctorDto.LicenseNumber}' already exists.");
            }

            if (await _doctorRepository.EmailExistsAsync(updateDoctorDto.Email, id))
            {
                throw new InvalidOperationException($"Email '{updateDoctorDto.Email}' already exists.");
            }

            return await _doctorRepository.UpdateDoctorAsync(id, updateDoctorDto);
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
            // Check if doctor exists
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null)
            {
                throw new KeyNotFoundException($"Doctor with ID {id} not found.");
            }

            return await _doctorRepository.UpdateDoctorStatusAsync(id, status);
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
            // Check if doctor exists
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null)
            {
                throw new KeyNotFoundException($"Doctor with ID {id} not found.");
            }

            return await _doctorRepository.DeleteDoctorAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting doctor with ID {DoctorId}", id);
            throw;
        }
    }
}
