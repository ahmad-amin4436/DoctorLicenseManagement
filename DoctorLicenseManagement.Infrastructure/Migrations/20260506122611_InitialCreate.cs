using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DoctorLicenseManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Specialization = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LicenseExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Doctors",
                columns: new[] { "Id", "CreatedDate", "DeletedDate", "Email", "FullName", "LicenseExpiryDate", "LicenseNumber", "Specialization", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 6, 12, 26, 10, 168, DateTimeKind.Utc).AddTicks(5458), null, "john.smith@email.com", "Dr. John Smith", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MED123456", "Cardiology", "Active" },
                    { 2, new DateTime(2026, 4, 11, 12, 26, 10, 168, DateTimeKind.Utc).AddTicks(5467), null, "sarah.johnson@email.com", "Dr. Sarah Johnson", new DateTime(2024, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "MED789012", "Neurology", "Active" },
                    { 3, new DateTime(2026, 4, 16, 12, 26, 10, 168, DateTimeKind.Utc).AddTicks(5469), null, "michael.brown@email.com", "Dr. Michael Brown", new DateTime(2023, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "MED345678", "Pediatrics", "Expired" },
                    { 4, new DateTime(2026, 4, 21, 12, 26, 10, 168, DateTimeKind.Utc).AddTicks(5471), null, "emily.davis@email.com", "Dr. Emily Davis", new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "MED901234", "Orthopedics", "Active" },
                    { 5, new DateTime(2026, 4, 26, 12, 26, 10, 168, DateTimeKind.Utc).AddTicks(5473), null, "robert.wilson@email.com", "Dr. Robert Wilson", new DateTime(2024, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "MED567890", "Dermatology", "Suspended" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_Email",
                table: "Doctors",
                column: "Email",
                filter: "IsDeleted = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_ExpiryDate",
                table: "Doctors",
                column: "LicenseExpiryDate",
                filter: "IsDeleted = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_LicenseNumber",
                table: "Doctors",
                column: "LicenseNumber",
                filter: "IsDeleted = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_Status",
                table: "Doctors",
                column: "Status",
                filter: "IsDeleted = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Doctors");
        }
    }
}
