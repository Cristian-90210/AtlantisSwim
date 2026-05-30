using System;
using AtlantisSwim.DataAccess;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AtlantisSwim.DataAccess.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(DbSession))]
    [Migration("20260529000000_AddMissingModules")]
    public partial class AddMissingModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId = table.Column<int>(type: "integer", nullable: false),
                    AuthorUserId  = table.Column<int>(type: "integer", nullable: false),
                    Content       = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAt     = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentNotes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProgressSnapshots",
                columns: table => new
                {
                    Id            = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId = table.Column<int>(type: "integer", nullable: false),
                    CoachUserId   = table.Column<int>(type: "integer", nullable: true),
                    MetricKey     = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MetricValue   = table.Column<int>(type: "integer", nullable: false),
                    RecordedAt    = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt     = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressSnapshots", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RecoveryRequests",
                columns: table => new
                {
                    Id            = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId = table.Column<int>(type: "integer", nullable: false),
                    CoachUserId   = table.Column<int>(type: "integer", nullable: true),
                    Date          = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status        = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Notes         = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ConfirmedAt   = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RequestedAt   = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecoveryRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentHealthFlags",
                columns: table => new
                {
                    Id              = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId   = table.Column<int>(type: "integer", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: false),
                    Type            = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Severity        = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ProtocolText    = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive        = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt       = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentHealthFlags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpecialOffers",
                columns: table => new
                {
                    Id            = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StudentUserId = table.Column<int>(type: "integer", nullable: false),
                    SentByUserId  = table.Column<int>(type: "integer", nullable: false),
                    Title         = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description   = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Discount      = table.Column<int>(type: "integer", nullable: false),
                    ValidUntil    = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SentAt        = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecialOffers", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "StudentNotes");
            migrationBuilder.DropTable(name: "ProgressSnapshots");
            migrationBuilder.DropTable(name: "RecoveryRequests");
            migrationBuilder.DropTable(name: "StudentHealthFlags");
            migrationBuilder.DropTable(name: "SpecialOffers");
        }
    }
}
