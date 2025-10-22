-- =====================================================
-- SAMPLE DATA FOR LIBRARY MANAGEMENT SYSTEM
-- Tables: ADMINS, LIBRARY_POLICY, LIBRARIAN, STUDENTS,
-- BOOKS, BORROW, RESERVATIONS, FINE
-- =====================================================

-- ---------- ADMINS ----------
INSERT INTO ADMINS (admin_id, name, pass, email)
VALUES (1, 'Admin One', 'admin123', 'admin1@library.com');



-- ---------- LIBRARY_POLICY ----------
INSERT INTO LIBRARY_POLICY (policy_id, loan_period_days, fine_per_day, admin_id)
VALUES (1, 14, 10.00, 1);

INSERT INTO LIBRARY_POLICY (policy_id, loan_period_days, fine_per_day, admin_id)
VALUES (2, 7, 5.00, 2);

-- ---------- LIBRARIAN ----------
INSERT INTO LIBRARIAN (librarian_id, name, pass, email, admin_id)
VALUES (1, 'Ali Khan', 'lib123', 'ali.khan@library.com', 1);

INSERT INTO LIBRARIAN (librarian_id, name, pass, email, admin_id)
VALUES (2, 'Sara Malik', 'lib456', 'sara.malik@library.com', 2);

-- ---------- STUDENTS ----------
INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass, fine_due)
VALUES (1001, 'Hamza', 'Ahmed', 'hamza.ahmed@student.com', '123', 0.00);

INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass, fine_due)
VALUES (1002, 'Fatima', 'Noor', 'fatima.noor@student.com', '456', 0.00);

INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass, fine_due)
VALUES (1003, 'Ahmed', 'Raza', 'ahmed.raza@student.com', '789', 50.00);

-- ---------- BOOKS ----------
INSERT INTO BOOKS (book_id, title, author, genre, year_published, available_copies)
VALUES (1, 'The C Programming Language', 'Kernighan & Ritchie', 'Computer Science', 1988, 3);

INSERT INTO BOOKS (book_id, title, author, genre, year_published, available_copies)
VALUES (2, 'Clean Code', 'Robert C. Martin', 'Software Engineering', 2008, 2);

INSERT INTO BOOKS (book_id, title, author, genre, year_published, available_copies)
VALUES (3, 'Head First SQL', 'Lynn Beighley', 'Database', 2009, 1);

INSERT INTO BOOKS (book_id, title, author, genre, year_published, available_copies)
VALUES (4, 'Effective Java', 'Joshua Bloch', 'Programming', 2018, 4);

-- ---------- BORROW ----------
-- Hamza borrowed Clean Code
INSERT INTO BORROW (borrow_id, erp_id, book_id, issue_date, due_date, return_date)
VALUES (1, 1001, 2, DATE '2025-10-01', DATE '2025-10-15', NULL);

-- Fatima borrowed Head First SQL and returned it
INSERT INTO BORROW (borrow_id, erp_id, book_id, issue_date, due_date, return_date)
VALUES (2, 1002, 3, DATE '2025-09-15', DATE '2025-09-29', DATE '2025-09-28');

-- Ahmed borrowed The C Programming Language
INSERT INTO BORROW (borrow_id, erp_id, book_id, issue_date, due_date, return_date)
VALUES (3, 1003, 1, DATE '2025-10-10', DATE '2025-10-24', NULL);

-- ---------- RESERVATIONS ----------
INSERT INTO RESERVATIONS (reservation_id, erp_id, book_id, reservation_date)
VALUES (1, 1001, 4, DATE '2025-10-05');

INSERT INTO RESERVATIONS (reservation_id, erp_id, book_id, reservation_date)
VALUES (2, 1002, 1, DATE '2025-10-06');

-- ---------- FINE ----------
-- Fine for Ahmed (unpaid)
INSERT INTO FINE (fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid)
VALUES (1, 1003, 2, 3, 75.00, 'Book damaged', DATE '2025-10-20', 0);

-- Fine for Fatima (paid)
INSERT INTO FINE (fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid)
VALUES (2, 1002, 1, 2, 25.00, 'Late return', DATE '2025-09-30', 1);


