-- Library Management System - Database Views
-- Oracle Database

-- View: Available Books
-- Shows books that have copies available for borrowing
CREATE OR REPLACE VIEW AvailableBooks AS
SELECT 
    book_id,
    title,
    author,
    isbn,
    available_copies,
    total_copies
FROM BOOKS
WHERE available_copies > 0
ORDER BY title;

-- View: Borrowed Books
-- Shows all currently borrowed books with student information
CREATE OR REPLACE VIEW BorrowedBooks AS
SELECT 
    b.borrow_id,
    b.erp_id,
    s.first_name || ' ' || s.last_name AS student_name,
    bk.book_id,
    bk.title,
    bk.author,
    b.borrow_date,
    b.due_date,
    b.return_date,
    CASE 
        WHEN b.return_date IS NULL AND b.due_date < SYSDATE THEN 'Overdue'
        WHEN b.return_date IS NULL THEN 'Active'
        ELSE 'Returned'
    END AS status
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
ORDER BY b.borrow_date DESC;

-- View: Overdue Borrows
-- Shows only overdue books (not yet returned and past due date)
CREATE OR REPLACE VIEW Overdue_Borrows AS
SELECT 
    b.borrow_id,
    b.erp_id,
    s.first_name || ' ' || s.last_name AS student_name,
    s.email,
    bk.book_id,
    bk.title,
    b.borrow_date,
    b.due_date,
    TRUNC(SYSDATE - b.due_date) AS days_overdue
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
WHERE b.return_date IS NULL 
  AND b.due_date < SYSDATE
ORDER BY days_overdue DESC;

-- View: Student Fine Summary
-- Shows total fines for each student
CREATE OR REPLACE VIEW StudentFineSummary AS
SELECT 
    s.erp_id,
    s.first_name || ' ' || s.last_name AS student_name,
    COUNT(f.fine_id) AS total_fines,
    SUM(CASE WHEN f.paid = 0 THEN f.fine_amount ELSE 0 END) AS unpaid_amount,
    SUM(CASE WHEN f.paid = 1 THEN f.fine_amount ELSE 0 END) AS paid_amount,
    SUM(f.fine_amount) AS total_amount
FROM STUDENTS s
LEFT JOIN FINE f ON s.erp_id = f.erp_id
GROUP BY s.erp_id, s.first_name, s.last_name
HAVING COUNT(f.fine_id) > 0
ORDER BY unpaid_amount DESC;

-- View: Book Popularity
-- Shows books sorted by number of times borrowed
CREATE OR REPLACE VIEW BookPopularity AS
SELECT 
    bk.book_id,
    bk.title,
    bk.author,
    COUNT(b.borrow_id) AS times_borrowed,
    bk.available_copies,
    bk.total_copies
FROM BOOKS bk
LEFT JOIN BORROW b ON bk.book_id = b.book_id
GROUP BY bk.book_id, bk.title, bk.author, bk.available_copies, bk.total_copies
ORDER BY times_borrowed DESC;
