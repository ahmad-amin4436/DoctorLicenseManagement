-- Doctor License Management Database Schema
-- SQL Server

-- Create database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DoctorLicenseManagement')
BEGIN
    CREATE DATABASE DoctorLicenseManagement;
END
GO

USE DoctorLicenseManagement;
GO

-- Drop table if exists (for development)
IF OBJECT_ID('Doctors', 'U') IS NOT NULL
    DROP TABLE Doctors;
GO

-- Create Doctors table
CREATE TABLE Doctors (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Specialization NVARCHAR(100) NOT NULL,
    LicenseNumber NVARCHAR(50) NOT NULL UNIQUE,
    LicenseExpiryDate DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0,
    DeletedDate DATETIME2 NULL
);
GO

-- Create indexes for performance
CREATE INDEX IX_Doctors_LicenseNumber ON Doctors(LicenseNumber) WHERE IsDeleted = 0;
CREATE INDEX IX_Doctors_Email ON Doctors(Email) WHERE IsDeleted = 0;
CREATE INDEX IX_Doctors_Status ON Doctors(Status) WHERE IsDeleted = 0;
CREATE INDEX IX_Doctors_ExpiryDate ON Doctors(LicenseExpiryDate) WHERE IsDeleted = 0;
GO

-- Create a trigger to automatically update status based on expiry date
CREATE TRIGGER TR_Doctors_UpdateStatus
ON Doctors
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE d
    SET Status = CASE 
        WHEN i.LicenseExpiryDate < CAST(GETDATE() AS DATE) THEN 'Expired'
        WHEN i.Status = 'Suspended' THEN 'Suspended'
        ELSE 'Active'
    END
    FROM Doctors d
    INNER JOIN inserted i ON d.Id = i.Id
    WHERE d.IsDeleted = 0;
END
GO

-- Insert sample data for testing
INSERT INTO Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status) VALUES
('Dr. John Smith', 'john.smith@email.com', 'Cardiology', 'MED123456', '2025-12-31', 'Active'),
('Dr. Sarah Johnson', 'sarah.johnson@email.com', 'Neurology', 'MED789012', '2024-06-30', 'Active'),
('Dr. Michael Brown', 'michael.brown@email.com', 'Pediatrics', 'MED345678', '2023-12-31', 'Expired'),
('Dr. Emily Davis', 'emily.davis@email.com', 'Orthopedics', 'MED901234', '2026-03-15', 'Active'),
('Dr. Robert Wilson', 'robert.wilson@email.com', 'Dermatology', 'MED567890', '2024-09-30', 'Suspended');
GO
