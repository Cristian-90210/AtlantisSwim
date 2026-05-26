using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtlantisSwim.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddFrontendStudents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "Id", "DateOfBirth", "Email", "EnrolledOn", "FirstName", "IsActive", "LastName", "Phone", "SwimmingLevel" },
                values: new object[,]
                {
                    { 4, new DateTime(2014, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), "andrei.p@gmail.com", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Andrei", true, "Popov", "0721000004", "Beginner" },
                    { 5, new DateTime(2002, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), "elena.d@yahoo.com", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Elena", true, "Dumitru", "0721000005", "Advanced" },
                    { 6, new DateTime(2008, 7, 10, 0, 0, 0, 0, DateTimeKind.Utc), "mihai.v@gmail.com", new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Mihai", false, "Voicu", "0721000006", "Intermediate" },
                    { 7, new DateTime(2016, 2, 28, 0, 0, 0, 0, DateTimeKind.Utc), "ioana.s@gmail.com", new DateTime(2024, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ioana", true, "Stan", "0721000007", "Beginner" },
                    { 8, new DateTime(1995, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), "george.e@music.com", new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), "George", true, "Enescu", "0721000008", "Advanced" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
