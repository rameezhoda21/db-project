-- ============================================================================
-- Sample Data for Library Management System
-- ============================================================================
-- Run this after: 01_create_tables.sql, 02_views_oracle.sql, 03_triggers_oracle.sql
-- This file populates the database with realistic test data
-- ============================================================================

-- Admin (single admin for system management)
INSERT INTO ADMINS(admin_id, first_name, last_name, pass, email)
VALUES (1, 'Admin', 'User', 'admin123', 'admin@iba.edu.pk');

-- Library Policy (14-day loan period, 10 Rs fine per day)
INSERT INTO LIBRARY_POLICY(policy_id, loan_period_days, fine_per_day, admin_id)
VALUES (1, 14, 10.00, 1);

-- Librarians (linked to admin)
INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (101, 'Sara', 'Ahmed', 'lib123', 'sara.ahmed@iba.edu.pk', 1);

INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (102, 'Ali', 'Khan', 'lib123', 'ali.khan@iba.edu.pk', 1);

INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) 
VALUES (103, 'Fatima', 'Malik', 'lib123', 'fatima.malik@iba.edu.pk', 1);

-- Students (realistic IBA students)
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

-- Books (diverse library collection)
INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (1, 'Database Systems: The Complete Book', 'Hector Garcia-Molina', 'Computer Science', 2008, 5);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (2, 'Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 2009, 3);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (3, 'Pakistan: A Modern History', 'Ian Talbot', 'History', 2012, 4);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (4, 'Principles of Marketing', 'Philip Kotler', 'Business', 2020, 6);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (5, 'Financial Accounting', 'Robert Libby', 'Finance', 2018, 2);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (6, 'Clean Code', 'Robert C. Martin', 'Computer Science', 2008, 0);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (7, 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Psychology', 2011, 8);

INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) 
VALUES (8, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 1925, 10);

-- Active Borrows (some books currently borrowed by students)
-- Note: Triggers will auto-set due_date and decrement available_copies
INSERT INTO BORROW(borrow_id, erp_id, book_id, issue_date, due_date, return_date) 
VALUES (1, 22001, 1, SYSDATE - 5, NULL, NULL);

INSERT INTO BORROW(borrow_id, erp_id, book_id, issue_date, due_date, return_date) 
VALUES (2, 22002, 4, SYSDATE - 3, NULL, NULL);

INSERT INTO RESERVATIONS(reservation_id, erp_id, book_id, reservation_date) 
VALUES (1, 22003, 6, SYSDATE);

INSERT INTO RESERVATIONS(reservation_id, erp_id, book_id, reservation_date) 
VALUES (2, 22005, 1, SYSDATE - 1);

-- Completed Borrow (returned book - for history)
INSERT INTO BORROW(borrow_id, erp_id, book_id, issue_date, due_date, return_date) 
VALUES (3, 22004, 5, SYSDATE - 20, SYSDATE - 18, SYSDATE - 16);

-- Fines (one student with unpaid fine)
-- Insert fines AFTER borrow rows exist to satisfy FK references
INSERT INTO FINE(fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid) 
VALUES (1, 22004, 101, 3, 20.00, 'Book returned 2 days late', SYSDATE - 5, 0);

-- Update students' fine_due to reflect unpaid fines (keeps trigger logic consistent)
UPDATE STUDENTS s
SET fine_due = (
	SELECT NVL(SUM(f.fine_amount), 0)
	FROM FINE f
	WHERE f.erp_id = s.erp_id
		AND f.paid = 0
);

COMMIT;

-- Verification queries (optional - for testing)
-- SELECT COUNT(*) AS total_students FROM STUDENTS;
-- SELECT COUNT(*) AS total_books FROM BOOKS;
-- SELECT COUNT(*) AS active_borrows FROM BORROW WHERE return_date IS NULL;
-- SELECT * FROM AvailableBooks;
-- SELECT * FROM FINES_DUE;
