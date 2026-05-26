using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtlantisSwim.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeedMissingData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CourseLevels",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "For those with no prior swimming experience.", "Beginner" },
                    { 2, "For swimmers comfortable in water.", "Intermediate" },
                    { 3, "For experienced swimmers refining technique.", "Advanced" }
                });

            migrationBuilder.InsertData(
                table: "SwimmingServices",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "ServiceDescription", "ServiceName", "ServicePrice", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "One-on-one coaching sessions tailored to individual needs.", "Private Lessons", 80.00m, null },
                    { 2, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Small group lessons with up to 6 participants.", "Group Classes", 40.00m, null },
                    { 3, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Dedicated lane access for personal training sessions.", "Pool Lane Rental", 25.00m, null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password", "Phone", "RegisteredOn", "Role", "UserName" },
                values: new object[,]
                {
                    { 1, "admin@atlantisswim.ro", "Admin", "Atlantis", "Admin@1234", "0700000001", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 30, "admin" },
                    { 2, "coach@atlantisswim.ro", "Ioan", "Marinescu", "Coach@1234", "0700000002", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 20, "coach.ioan" }
                });

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "Capacity", "CreatedAt", "Description", "Enrolled", "LevelId", "Name", "Price", "Schedule", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 12, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "A foundational course covering basic strokes and water safety.", 0, 1, "Learn to Swim", 150.00m, "Mon, Wed 09:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 10, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Focus on freestyle and breaststroke technique for intermediate swimmers.", 0, 2, "Stroke Improvement", 200.00m, "Tue, Thu 18:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, 8, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "High-intensity training for competitive swimmers.", 0, 3, "Competitive Training", 280.00m, "Mon, Wed, Fri 07:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CourseLevels",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CourseLevels",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CourseLevels",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
