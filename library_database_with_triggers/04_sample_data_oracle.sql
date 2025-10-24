-- Sample data for Oracle
-- Run this after 01_create_tables_oracle.sql and 02_views_oracle.sql

-- Insert exactly one admin (required by your logic)
INSERT INTO ADMINS(admin_id, first_name, last_name, pass, email)
VALUES (1, 'Hasan', 'imam', 'admin_hashed_password', 'admin@example.com');

-- Insert a library policy row
INSERT INTO LIBRARY_POLICY(policy_id, loan_period_days, fine_per_day, admin_id)
VALUES (1, 14, 1.50, 1);

-- Insert 3 librarians (all linked to admin 1)
INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) VALUES
  (101, 'Alice', 'Librarian', 'alice_hashed', 'alice.lib@example.com', 1);
INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) VALUES
  (102, 'Bob', 'Librarian', 'bob_hashed', 'bob.lib@example.com', 1);
INSERT INTO LIBRARIAN(librarian_id, first_name, last_name, pass, email, admin_id) VALUES
  (103, 'Carol', 'Librarian', 'carol_hashed', 'carol.lib@example.com', 1);

-- Insert students
INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) VALUES
  (1001, 'John', 'Doe', 'john.doe@example.com', 'hash1', 0.00);
INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) VALUES
  (1002, 'Jane', 'Smith', 'jane.smith@example.com', 'hash2', 0.00);
INSERT INTO STUDENTS(erp_id, first_name, last_name, email, pass, fine_due) VALUES
  (1003, 'Sam', 'Green', 'sam.green@example.com', 'hash3', 0.00);

-- Insert books
INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) VALUES
  (1, 'The Example Book', 'Author A', 'Fiction', 2010, 2);
INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) VALUES
  (2, 'Learning SQL', 'Author B', 'Reference', 2018, 1);
INSERT INTO BOOKS(book_id, title, author, genre, year_published, available_copies) VALUES
  (3, 'Out of Stock Book', 'Author C', 'History', 2005, 0);

-- Insert borrows (insert with return_date NULL)
INSERT INTO BORROW(borrow_id, erp_id, book_id, due_date, return_date) 
VALUES (1, 1001, 1, NULL, NULL);
INSERT INTO BORROW(borrow_id, erp_id, book_id, due_date, return_date) 
VALUES (2, 1002, 2, NULL, TO_DATE('2025-09-20','YYYY-MM-DD'));

-- Reservation example
INSERT INTO RESERVATIONS(reservation_id, erp_id, book_id, reservation_date) VALUES
  (1, 1003, 3, TO_DATE('2025-10-10','YYYY-MM-DD'));

-- Insert fines: one unpaid and one already paid
INSERT INTO FINE(fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid) VALUES
  (1, 1001, 101, 1, 5.00, 'Overdue by 4 days', TO_DATE('2025-10-12','YYYY-MM-DD'), 0);
INSERT INTO FINE(fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid) VALUES
  (2, 1002, 102, 2, 2.50, 'Late return', TO_DATE('2025-09-21','YYYY-MM-DD'), 1);



-- Check if the due_date was auto-calculated
-- Issue_date was '01-OCT-25'. Policy is 14 days. Due_date should be '15-OCT-25'.
SELECT borrow_id, issue_date, due_date
FROM BORROW
WHERE borrow_id = 1;
COMMIT;
