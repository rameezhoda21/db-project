-- Library Management System - Sample Data
-- Oracle Database

-- ======================
-- ADMIN DATA
-- ======================

INSERT INTO ADMIN (admin_id, username, pass, email) VALUES 
(1, 'admin', 'admin123', 'admin@library.com');

-- ======================
-- LIBRARIAN DATA
-- ======================

INSERT INTO LIBRARIAN (librarian_id, first_name, last_name, email, pass) VALUES 
(1, 'John', 'Smith', 'john.smith@library.com', 'lib123'),
(2, 'Sarah', 'Johnson', 'sarah.johnson@library.com', 'lib123'),
(3, 'Michael', 'Brown', 'michael.brown@library.com', 'lib123');

-- ======================
-- STUDENT DATA
-- ======================

INSERT INTO STUDENTS (erp_id, first_name, last_name, email, pass) VALUES 
('S1001', 'Ali', 'Ahmed', 'ali.ahmed@student.edu', 'pass123'),
('S1002', 'Fatima', 'Khan', 'fatima.khan@student.edu', 'pass123'),
('S1003', 'Hassan', 'Ali', 'hassan.ali@student.edu', 'pass123'),
('S1004', 'Ayesha', 'Malik', 'ayesha.malik@student.edu', 'pass123'),
('S1005', 'Omar', 'Sheikh', 'omar.sheikh@student.edu', 'pass123');

-- ======================
-- BOOKS DATA
-- ======================

INSERT INTO BOOKS (book_id, title, author, isbn, available_copies, total_copies) VALUES 
(1, 'Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 5, 5),
(2, 'Clean Code', 'Robert C. Martin', '9780132350884', 3, 3),
(3, 'Design Patterns', 'Gang of Four', '9780201633610', 4, 4),
(4, 'The Pragmatic Programmer', 'Andrew Hunt', '9780135957059', 2, 2),
(5, 'Database System Concepts', 'Abraham Silberschatz', '9780078022159', 6, 6),
(6, 'Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 4, 4),
(7, 'Computer Networks', 'Andrew S. Tanenbaum', '9780132126953', 3, 3),
(8, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', '9780136042594', 5, 5),
(9, 'The Art of Computer Programming', 'Donald Knuth', '9780201896831', 2, 2),
(10, 'Software Engineering', 'Ian Sommerville', '9780133943030', 4, 4);

-- ======================
-- SAMPLE BORROW DATA (Optional)
-- ======================

-- Student S1001 borrows book 1
INSERT INTO BORROW (erp_id, book_id, borrow_date, due_date) VALUES 
('S1001', 1, SYSDATE - 5, SYSDATE + 9);

-- Student S1002 borrows book 5
INSERT INTO BORROW (erp_id, book_id, borrow_date, due_date) VALUES 
('S1002', 5, SYSDATE - 3, SYSDATE + 11);

-- Student S1003 borrows book 8
INSERT INTO BORROW (erp_id, book_id, borrow_date, due_date) VALUES 
('S1003', 8, SYSDATE - 7, SYSDATE + 7);

-- ======================
-- COMMIT
-- ======================

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================

-- Check all tables
SELECT 'Admin' AS table_name, COUNT(*) AS count FROM ADMIN
UNION ALL
SELECT 'Librarian', COUNT(*) FROM LIBRARIAN
UNION ALL
SELECT 'Students', COUNT(*) FROM STUDENTS
UNION ALL
SELECT 'Books', COUNT(*) FROM BOOKS
UNION ALL
SELECT 'Borrow', COUNT(*) FROM BORROW;
