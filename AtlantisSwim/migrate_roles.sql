-- ============================================================
-- ROLE STANDARDISATION  –  PostgreSQL
-- Old: Student=1, Coach=20, Admin=30
-- New: Student=1, Coach=2,  Admin=3
--
-- HOW TO RUN (choose one):
--   psql  : psql -U <user> -d <dbname> -f migrate_roles.sql
--   Docker: docker exec -i <container> psql -U <user> -d <dbname> < migrate_roles.sql
--
-- NOTE: PostgreSQL is case-sensitive for quoted identifiers.
--       "Users" and "Role" must be quoted exactly as shown below.
-- ============================================================


-- ── STEP 1 – VERIFY BEFORE ──────────────────────────────────
-- Shows current distribution so you can confirm what exists.
\echo '=== BEFORE: role distribution ==='
SELECT "Role", COUNT(*) AS "Count"
FROM   "Users"
GROUP  BY "Role"
ORDER  BY "Role";


-- ── STEP 2 – SAFE UPDATE INSIDE A TRANSACTION ───────────────
BEGIN;

-- Coach: 20 → 2
UPDATE "Users"
SET    "Role" = 2
WHERE  "Role" = 20;

-- Report how many rows were updated
\echo '--- Coach rows updated (20→2):'
SELECT ROW_COUNT();   -- psql-only; remove if running from code

-- Admin: 30 → 3
UPDATE "Users"
SET    "Role" = 3
WHERE  "Role" = 30;

\echo '--- Admin rows updated (30→3):'
SELECT ROW_COUNT();   -- psql-only; remove if running from code

-- ── STEP 3 – VERIFY AFTER (inside the transaction) ──────────
\echo '=== AFTER: role distribution ==='
SELECT "Role", COUNT(*) AS "Count"
FROM   "Users"
GROUP  BY "Role"
ORDER  BY "Role";

-- Sanity-check: no old values should remain
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Users" WHERE "Role" IN (20, 30)) THEN
        RAISE EXCEPTION 'Old role values (20/30) still present – rolling back!';
    END IF;
END $$;

COMMIT;


-- ── STEP 4 – SPOT-CHECK INDIVIDUAL ROWS ─────────────────────
\echo '=== Sample rows after migration ==='
SELECT "Id", "UserName", "Email", "Role"
FROM   "Users"
ORDER  BY "Role", "Id";
