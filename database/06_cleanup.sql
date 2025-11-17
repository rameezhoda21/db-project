-- ============================================================================
-- Cleanup Script - Remove All Data (Keep Table Structure)
-- ============================================================================
-- Run this before running 05_clean_data_login_only.sql
-- This removes ALL data from ALL tables to give you a clean slate
-- ============================================================================

-- Delete in correct order (respecting foreign key constraints)
DELETE FROM FINE;
DELETE FROM RESERVATIONS;
DELETE FROM BORROW;
DELETE FROM BOOKS;
DELETE FROM STUDENTS;
DELETE FROM LIBRARIAN;
DELETE FROM LIBRARY_POLICY;
DELETE FROM ADMINS;

COMMIT;

-- Verification (should all return 0)
SELECT 'ADMINS' AS table_name, COUNT(*) AS row_count FROM ADMINS
UNION ALL
SELECT 'LIBRARY_POLICY', COUNT(*) FROM LIBRARY_POLICY
UNION ALL
SELECT 'LIBRARIAN', COUNT(*) FROM LIBRARIAN
UNION ALL
SELECT 'STUDENTS', COUNT(*) FROM STUDENTS
UNION ALL
SELECT 'BOOKS', COUNT(*) FROM BOOKS
UNION ALL
SELECT 'BORROW', COUNT(*) FROM BORROW
UNION ALL
SELECT 'RESERVATIONS', COUNT(*) FROM RESERVATIONS
UNION ALL
SELECT 'FINE', COUNT(*) FROM FINE;

-- ============================================================================
-- NOW you can run 05_clean_data_login_only.sql
-- ============================================================================
