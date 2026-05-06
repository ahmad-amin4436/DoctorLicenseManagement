using Microsoft.AspNetCore.Mvc;
using DoctorLicenseManagement.Application.Interfaces;
using DoctorLicenseManagement.Application.DTOs;
using DoctorLicenseManagement.Domain.Enums;

namespace DoctorLicenseManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorService _doctorService;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(IDoctorService doctorService, ILogger<DoctorsController> logger)
    {
        _doctorService = doctorService;
        _logger = logger;
    }

    /// <summary>
    /// Get all doctors with optional search and filtering
    /// </summary>
    /// <param name="searchTerm">Search by name or license number</param>
    /// <param name="status">Filter by status</param>
    /// <param name="pageNumber">Page number for pagination</param>
    /// <param name="pageSize">Page size for pagination</param>
    /// <returns>Paginated list of doctors</returns>
    [HttpGet]
    public async Task<IActionResult> GetDoctors(
        [FromQuery] string? searchTerm = null,
        [FromQuery] DoctorStatus? status = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var searchDto = new DoctorSearchDto
            {
                SearchTerm = searchTerm,
                Status = status,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _doctorService.GetDoctorsAsync(searchDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctors");
            return StatusCode(500, new { error = "An error occurred while retrieving doctors" });
        }
    }

    /// <summary>
    /// Get doctor by ID
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>Doctor details</returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDoctor(int id)
    {
        try
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound(new { error = $"Doctor with ID {id} not found" });
            }

            return Ok(doctor);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctor with ID: {DoctorId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the doctor" });
        }
    }

    /// <summary>
    /// Get expired doctors
    /// </summary>
    /// <param name="pageNumber">Page number for pagination</param>
    /// <param name="pageSize">Page size for pagination</param>
    /// <returns>Paginated list of expired doctors</returns>
    [HttpGet("expired")]
    public async Task<IActionResult> GetExpiredDoctors(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var result = await _doctorService.GetExpiredDoctorsAsync(pageNumber, pageSize);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving expired doctors");
            return StatusCode(500, new { error = "An error occurred while retrieving expired doctors" });
        }
    }

    /// <summary>
    /// Create a new doctor
    /// </summary>
    /// <param name="createDoctorDto">Doctor creation data</param>
    /// <returns>Created doctor details</returns>
    [HttpPost]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto createDoctorDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid input data", details = ModelState });
            }

            var doctor = await _doctorService.CreateDoctorAsync(createDoctorDto);
            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating doctor: {@DoctorDto}", createDoctorDto);
            return StatusCode(500, new { error = "An error occurred while creating the doctor" });
        }
    }

    /// <summary>
    /// Update an existing doctor
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <param name="updateDoctorDto">Doctor update data</param>
    /// <returns>Updated doctor details</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDto updateDoctorDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid input data", details = ModelState });
            }

            var doctor = await _doctorService.UpdateDoctorAsync(id, updateDoctorDto);
            if (doctor == null)
            {
                return NotFound(new { error = $"Doctor with ID {id} not found" });
            }

            return Ok(doctor);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating doctor with ID {DoctorId}: {@DoctorDto}", id, updateDoctorDto);
            return StatusCode(500, new { error = "An error occurred while updating the doctor" });
        }
    }

    /// <summary>
    /// Update doctor status
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <param name="status">New status</param>
    /// <returns>Success indicator</returns>
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateDoctorStatus(int id, [FromBody] DoctorStatus status)
    {
        try
        {
            var result = await _doctorService.UpdateDoctorStatusAsync(id, status);
            if (!result)
            {
                return NotFound(new { error = $"Doctor with ID {id} not found" });
            }

            return Ok(new { message = $"Doctor status updated to {status}" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status for doctor with ID {DoctorId} to {Status}", id, status);
            return StatusCode(500, new { error = "An error occurred while updating the doctor status" });
        }
    }

    /// <summary>
    /// Soft delete a doctor
    /// </summary>
    /// <param name="id">Doctor ID</param>
    /// <returns>Success indicator</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        try
        {
            var result = await _doctorService.DeleteDoctorAsync(id);
            if (!result)
            {
                return NotFound(new { error = $"Doctor with ID {id} not found" });
            }

            return Ok(new { message = "Doctor deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting doctor with ID {DoctorId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the doctor" });
        }
    }
}
