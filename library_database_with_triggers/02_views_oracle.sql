CREATE VIEW AvailableBooks AS 
SELECT book_id, title, author, genre, year_published, available_copies
FROM BOOKS
WHERE available_copies > 0;


CREATE VIEW BorrowedBooks AS 
SELECT b.borrow_id, s.erp_id,  bk.book_id, bk.title, b.issue_date, b.due_date, b.return_date
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
WHERE b.return_date IS NULL;

CREATE  VIEW FINES_DUE AS
SELECT
    f.fine_id,
    s.erp_id,
    f.fine_amount AS amount,
    f.fine_date,
    f.paid,
    f.fine_reason
FROM FINE f
JOIN STUDENTS s ON f.erp_id = s.erp_id
WHERE f.paid = 0
  AND f.fine_amount > 0;

CREATE VIEW Overdue_Borrows AS
SELECT b.borrow_id, b.erp_id, s.first_name, s.last_name, b.book_id, bk.title,
       b.issue_date, b.due_date
FROM BORROW b
JOIN STUDENTS s ON b.erp_id = s.erp_id
JOIN BOOKS bk ON b.book_id = bk.book_id
WHERE b.return_date IS NULL
  AND b.due_date < TRUNC(SYSDATE);