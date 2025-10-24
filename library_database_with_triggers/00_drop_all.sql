-- This script drops all objects to reset the database for testing.
-- Run this file first to get a clean environment.
-- run this and clean everything before running other scripts.
-- 01 file then 02 file then 03 file then 04 file
-- then use queries to test out the triggers and stuff

-- Drop views
DROP VIEW AvailableBooks;
DROP VIEW BorrowedBooks;
DROP VIEW FINES_DUE;
DROP VIEW Overdue_Borrows;

-- Drop tables (order matters due to foreign keys)
-- Drop "child" tables first, then "parent" tables.
DROP TABLE FINE;
DROP TABLE RESERVATIONS;
DROP TABLE BORROW;
DROP TABLE LIBRARIAN;
DROP TABLE LIBRARY_POLICY;
DROP TABLE ADMINS;
DROP TABLE STUDENTS;
DROP TABLE BOOKS;

COMMIT;