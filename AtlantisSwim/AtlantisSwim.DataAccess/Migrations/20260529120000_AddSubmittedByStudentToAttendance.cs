using AtlantisSwim.DataAccess;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtlantisSwim.DataAccess.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(DbSession))]
    [Migration("20260529120000_AddSubmittedByStudentToAttendance")]
    public partial class AddSubmittedByStudentToAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SubmittedByStudent",
                table: "AttendanceRecords",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubmittedByStudent",
                table: "AttendanceRecords");
        }
    }
}
