-- ============================================================================
-- Clean Database - Login Credentials Only
-- ============================================================================
-- This file contains ONLY login credentials for students and librarians
-- All other data (books, borrows, fines) will be managed through the webapp
-- ============================================================================

-- Admin (single admin for system management)
INSERT INTO ADMINS(admin_id, first_name, last_name, pass, email)
VALUES (1, 'Admin', 'User', 'admin123', 'admin@iba.edu.pk');

-- Library Policy (14-day loan period, 10 Rs fine per day)
INSERT INTO LIBRARY_POLICY(policy_id, loan_period_days, fine_per_day, admin_id)
VALUES (1, 14, 10.00, 1);

-- ============================================================================
-- LIBRARIANS (ID / Password)
-- ============================================================================
INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (101, 'Sara', 'Ahmed', 'lib123', 'sara.ahmed@iba.edu.pk', 1);

INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (102, 'Ali', 'Khan', 'lib123', 'ali.khan@iba.edu.pk', 1);

INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (103, 'Fatima', 'Malik', 'lib123', 'fatima.malik@iba.edu.pk', 1);

-- ============================================================================
-- STUDENTS (ERP ID / Password)
-- ============================================================================
INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) 
VALUES (22001, 'Ahmed', 'Hassan', 'ahmed.hassan@khi.iba.edu.pk', 'pass123', 0.00);

INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) 
VALUES (22002, 'Ayesha', 'Siddiqui', 'ayesha.siddiqui@khi.iba.edu.pk', 'pass123', 0.00);

INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) 
VALUES (22003, 'Usman', 'Raza', 'usman.raza@khi.iba.edu.pk', 'pass123', 0.00);

INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) 
VALUES (22004, 'Zainab', 'Ali', 'zainab.ali@khi.iba.edu.pk', 'pass123', 0.00);

INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) 
VALUES (22005, 'Hassan', 'Mahmood', 'hassan.mahmood@khi.iba.edu.pk', 'pass123', 0.00);

COMMIT;

-- ============================================================================
-- NO BOOKS, NO BORROWS, NO FINES
-- Everything else will be managed through the webapp by librarians
-- ============================================================================
