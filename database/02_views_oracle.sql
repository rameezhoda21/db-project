-- ============================================================================
-- Library Management System - Database Views
-- ============================================================================
-- Run this AFTER: 01_create_tables.sql
-- Run this BEFORE: 03_triggers_oracle.sql
-- ============================================================================

-- ============================================================================
-- VIEW: AvailableBooks
-- Shows all books that can currently be borrowed (available_copies > 0)
-- ============================================================================
CREATE VIEW AvailableBooks AS 
SELECT 
    book_id, 
    title, 
    author, 
    genre, 
    year_published, 
    available_copies
FROM BOOKS
WHERE available_copies > 0;

-- ============================================================================
-- VIEW: BorrowedBooks
-- Shows all currently borrowed books (not yet returned)
-- ============================================================================
CREATE VIEW BorrowedBooks AS 
SELECT 
    b.borrow_id,
    s.erp_id,
    s.first_name || ' ' || s.last_name AS student_name,
    bk.book_id,
    bk.title,
    b.issue_date,
    b.due_date,
    b.return_date
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
WHERE b.return_date IS NULL;

-- ============================================================================
-- VIEW: FINES_DUE
-- Shows all unpaid fines for students
-- ============================================================================
CREATE VIEW FINES_DUE AS
SELECT
    f.fine_id,
    s.erp_id,
    s.first_name || ' ' || s.last_name AS student_name,
    f.fine_amount,
    f.fine_date,
    f.fine_reason,
    f.paid
FROM FINE f
JOIN STUDENTS s ON f.erp_id = s.erp_id
WHERE f.paid = 0
  AND f.fine_amount > 0;

-- ============================================================================
-- VIEW: Overdue_Borrows
-- Shows all books that are overdue (past due_date and not returned)
-- ============================================================================
CREATE VIEW Overdue_Borrows AS
SELECT 
    b.borrow_id,
    b.erp_id,
    s.first_name,
    s.last_name,
    b.book_id,
    bk.title,
    b.issue_date,
    b.due_date,
    TRUNC(SYSDATE - b.due_date) AS days_overdue
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
WHERE b.return_date IS NULL
  AND b.due_date < SYSDATE;

COMMIT;