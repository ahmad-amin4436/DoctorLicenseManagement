using DoctorLicenseManagement.Domain.Enums;

namespace DoctorLicenseManagement.Domain.Entities;

public class Doctor
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public DoctorStatus Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedDate { get; set; }

    // Computed property to check if license is expired
    public bool IsLicenseExpired => LicenseExpiryDate < DateTime.Today;

    // Method to update status based on business rules
    public void UpdateStatus()
    {
        if (IsLicenseExpired && Status != DoctorStatus.Suspended)
        {
            Status = DoctorStatus.Expired;
        }
        else if (Status == DoctorStatus.Expired && !IsLicenseExpired)
        {
            Status = DoctorStatus.Active;
        }
    }

    // Method to soft delete
    public void SoftDelete()
    {
        IsDeleted = true;
        DeletedDate = DateTime.UtcNow;
    }

    // Validation method
    public bool IsValid(out List<string> errors)
    {
        errors = new List<string>();

        if (string.IsNullOrWhiteSpace(FullName))
            errors.Add("Full name is required.");

        if (string.IsNullOrWhiteSpace(Email))
            errors.Add("Email is required.");
        else if (!IsValidEmail(Email))
            errors.Add("Email format is invalid.");

        if (string.IsNullOrWhiteSpace(Specialization))
            errors.Add("Specialization is required.");

        if (string.IsNullOrWhiteSpace(LicenseNumber))
            errors.Add("License number is required.");

        if (LicenseExpiryDate == default)
            errors.Add("License expiry date is required.");

        return errors.Count == 0;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}
