-- Doctor License Management Stored Procedures
-- SQL Server

USE DoctorLicenseManagement;
GO

-- Drop stored procedures if they exist (for development)
IF OBJECT_ID('sp_GetDoctors', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetDoctors;
GO

IF OBJECT_ID('sp_GetDoctorById', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetDoctorById;
GO

IF OBJECT_ID('sp_GetExpiredDoctors', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetExpiredDoctors;
GO

-- Main stored procedure for doctor listing with search and filter functionality
CREATE PROCEDURE sp_GetDoctors
    @SearchTerm NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Main query with search and filter
    SELECT 
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        Status = CASE 
            WHEN LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 'Expired'
            WHEN Status = 'Suspended' THEN 'Suspended'
            ELSE 'Active'
        END,
        CreatedDate,
        IsDeleted,
        TotalCount = COUNT(*) OVER() -- For pagination
    FROM Doctors
    WHERE IsDeleted = 0
        AND (@SearchTerm IS NULL OR 
             FullName LIKE '%' + @SearchTerm + '%' OR 
             LicenseNumber LIKE '%' + @SearchTerm + '%')
        AND (@Status IS NULL OR 
             CASE 
                 WHEN LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 'Expired'
                 WHEN Status = 'Suspended' THEN 'Suspended'
                 ELSE 'Active'
             END = @Status)
    ORDER BY 
        CASE 
            WHEN LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 1
            ELSE 0
        END, -- Expired doctors first
        FullName
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Stored procedure to get doctor by ID
CREATE PROCEDURE sp_GetDoctorById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        Status = CASE 
            WHEN LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 'Expired'
            WHEN Status = 'Suspended' THEN 'Suspended'
            ELSE 'Active'
        END,
        CreatedDate,
        IsDeleted
    FROM Doctors
    WHERE Id = @Id AND IsDeleted = 0;
END
GO

-- Bonus: Stored procedure for expired doctors
CREATE PROCEDURE sp_GetExpiredDoctors
    @PageNumber INT = 1,
    @PageSize INT = 50
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        Status = 'Expired',
        CreatedDate,
        DaysExpired = DATEDIFF(DAY, LicenseExpiryDate, GETDATE()),
        TotalCount = COUNT(*) OVER()
    FROM Doctors
    WHERE IsDeleted = 0 
        AND LicenseExpiryDate < CAST(GETDATE() AS DATE)
    ORDER BY LicenseExpiryDate ASC -- Most recently expired first
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- Additional utility stored procedures
CREATE PROCEDURE sp_CheckLicenseNumberExists
    @LicenseNumber NVARCHAR(50),
    @ExcludeId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) AS Count
    FROM Doctors
    WHERE LicenseNumber = @LicenseNumber 
        AND IsDeleted = 0
        AND (@ExcludeId IS NULL OR Id != @ExcludeId);
END
GO

CREATE PROCEDURE sp_CheckEmailExists
    @Email NVARCHAR(100),
    @ExcludeId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(*) AS Count
    FROM Doctors
    WHERE Email = @Email 
        AND IsDeleted = 0
        AND (@ExcludeId IS NULL OR Id != @ExcludeId);
END
GO
