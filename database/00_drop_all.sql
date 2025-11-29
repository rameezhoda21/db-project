-- ============================================================================
-- Library Management System - Clean Database Script
-- ============================================================================
-- This script drops ALL database objects to provide a clean slate
-- ⚠️ WARNING: This will DELETE all data permanently!
-- 
-- Use this when:
-- 1. Starting fresh setup
-- 2. Rebuilding database after schema changes
-- 3. Testing deployment process
--
-- Execution order for full setup:
-- 1. Run this file (00_drop_all.sql)
-- 2. Run 01_create_tables.sql
-- 3. Run 02_views_oracle.sql
-- 4. Run 03_triggers_oracle.sql
-- 5. Run 04_sample_data_oracle.sql
-- ============================================================================

-- Drop views first (no dependencies)
BEGIN
   EXECUTE IMMEDIATE 'DROP VIEW AvailableBooks';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP VIEW BorrowedBooks';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP VIEW FINES_DUE';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP VIEW Overdue_Borrows';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- Drop tables in reverse dependency order (child tables first, then parents)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE FINE CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE RESERVATIONS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE BORROW CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE LIBRARIAN CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE LIBRARY_POLICY CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE ADMINS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE STUDENTS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE BOOKS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- Drop USERS table (authentication/registration)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE USERS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- Drop sequences for USERS table
BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE user_seq';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE student_erp_seq';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE librarian_id_seq';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

COMMIT;

-- Display success message
BEGIN
   DBMS_OUTPUT.PUT_LINE('✓ All objects dropped successfully');
   DBMS_OUTPUT.PUT_LINE('✓ Database is clean and ready for fresh setup');
END;
/