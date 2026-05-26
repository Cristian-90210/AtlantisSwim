using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtlantisSwim.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ImportFrontendData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "Capacity", "CreatedAt", "Description", "Enrolled", "LevelId", "Name", "Price", "Schedule", "UpdatedAt" },
                values: new object[,]
                {
                    { 4, 10, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Learn the basics of floating and kicking.", 8, 1, "Beginner Swim - Kids", 250.00m, "Mon, Wed 16:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, 15, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Refine your technique for competition.", 12, 3, "Advanced Freestyle", 400.00m, "Tue, Thu 19:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, 8, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Perfect your backstroke form.", 5, 2, "Backstroke Mastery", 300.00m, "Fri 17:00, Sat 10:00", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "SwimmingServices",
                columns: new[] { "Id", "CreatedAt", "IsDeleted", "ServiceDescription", "ServiceName", "ServicePrice", "UpdatedAt" },
                values: new object[,]
                {
                    { 4, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "4 lecții de înot în grup, valabil 1 lună. Durata: 45 min/ședință.", "Abonament 4 Frecvențe", 1000.00m, null },
                    { 5, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "8 lecții de înot în grup, valabil 1 lună. Durata: 45 min/ședință.", "Abonament Standard 8 Frecvențe", 2000.00m, null },
                    { 6, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "12 antrenamente în grup, valabil 1 lună. Ideal pentru progres rapid.", "Abonament Pro 12 Frecvențe", 3000.00m, null },
                    { 7, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "24 lecții în grup (8/lună × 3 luni). Progres constant, reducere 10%.", "Abonament Standard 3 Luni", 5400.00m, null },
                    { 8, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "36 lecții în grup (12/lună × 3 luni). Progres accelerat, reducere 10%.", "Abonament Pro 3 Luni", 7500.00m, null },
                    { 9, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "5 ședințe individuale 1 la 1, valabil 3 săptămâni. Durata: 45 min/ședință.", "Abonament Individual 5", 2250.00m, null },
                    { 10, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "10 ședințe individuale 1 la 1, valabil 5 săptămâni. Reducere 7%.", "Abonament Individual 10", 4500.00m, null },
                    { 11, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "8 ședințe cu transport tur-retur din Chișinău, valabil 1 lună.", "Abonament Transport Chișinău", 2400.00m, null },
                    { 12, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "8 ședințe cu transport din Ialoveni la Arena Chișinău, valabil 1 lună.", "Abonament Transport Ialoveni", 2600.00m, null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password", "Phone", "RegisteredOn", "Role", "UserName" },
                values: new object[,]
                {
                    { 3, "catalina@atlantisswim.md", "Cătălina", "Moraru", "antrenor1234", "0700000003", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 20, "catalina" },
                    { 4, "catalin@atlantisswim.md", "Cătălin", "Ciobanu", "antrenor1234", "0700000004", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 20, "catalin" },
                    { 5, "alexandru@atlantisswim.md", "Alexandru", "Rusu", "antrenor1234", "0700000005", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 20, "alexandru" },
                    { 6, "admin@school.com", "Super", "Admin", "admin1234", "0700000006", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 30, "super.admin" },
                    { 7, "director@school.com", "Director", "Ionescu", "admin1234", "0700000007", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 30, "director" },
                    { 8, "manager@school.com", "Manager", "Stancu", "admin1234", "0700000008", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 30, "manager" },
                    { 9, "andrei.popov@student.md", "Andrei", "Popov", "elev1234", "0700000009", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "andrei.popov" },
                    { 10, "elena.dumitru@student.md", "Elena", "Dumitru", "elev1234", "0700000010", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "elena.dumitru" },
                    { 11, "mihai.voicu@student.md", "Mihai", "Voicu", "elev1234", "0700000011", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "mihai.voicu" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "SwimmingServices",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 11);
        }
    }
}
