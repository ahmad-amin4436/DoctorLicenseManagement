using System.ComponentModel.DataAnnotations;
using DoctorLicenseManagement.Domain.Enums;

namespace DoctorLicenseManagement.Application.DTOs;

public class UpdateDoctorDto
{
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Specialization is required")]
    [StringLength(100, ErrorMessage = "Specialization cannot exceed 100 characters")]
    public string Specialization { get; set; } = string.Empty;

    [Required(ErrorMessage = "License number is required")]
    [StringLength(50, ErrorMessage = "License number cannot exceed 50 characters")]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "License expiry date is required")]
    public DateTime LicenseExpiryDate { get; set; }

    public DoctorStatus Status { get; set; }
}
