-- Library Management System - Database Schema
-- Oracle Database

-- ======================
-- TABLES
-- ======================

-- Admin Table
CREATE TABLE ADMIN (
    admin_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    pass VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    created_at DATE DEFAULT SYSDATE
);

-- Librarian Table
CREATE TABLE LIBRARIAN (
    librarian_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    pass VARCHAR2(100) NOT NULL,
    hire_date DATE DEFAULT SYSDATE
);

-- Students Table
CREATE TABLE STUDENTS (
    erp_id VARCHAR2(20) PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    pass VARCHAR2(100) NOT NULL,
    enrollment_date DATE DEFAULT SYSDATE
);

-- Books Table
CREATE TABLE BOOKS (
    book_id NUMBER PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    author VARCHAR2(100) NOT NULL,
    isbn VARCHAR2(20),
    available_copies NUMBER DEFAULT 0,
    total_copies NUMBER DEFAULT 0
);

-- Borrow Table
CREATE TABLE BORROW (
    borrow_id NUMBER PRIMARY KEY,
    erp_id VARCHAR2(20) NOT NULL,
    book_id NUMBER NOT NULL,
    borrow_date DATE DEFAULT SYSDATE,
    due_date DATE DEFAULT SYSDATE + 14,
    return_date DATE,
    FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES BOOKS(book_id) ON DELETE CASCADE
);

-- Reservations Table
CREATE TABLE RESERVATIONS (
    reservation_id NUMBER PRIMARY KEY,
    erp_id VARCHAR2(20) NOT NULL,
    book_id NUMBER NOT NULL,
    reservation_date DATE DEFAULT SYSDATE,
    status VARCHAR2(20) DEFAULT 'pending',
    FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES BOOKS(book_id) ON DELETE CASCADE
);

-- Fine Table
CREATE TABLE FINE (
    fine_id NUMBER PRIMARY KEY,
    erp_id VARCHAR2(20) NOT NULL,
    librarian_id NUMBER,
    borrow_id NUMBER,
    fine_amount NUMBER(10,2) NOT NULL,
    fine_reason VARCHAR2(200),
    fine_date DATE DEFAULT SYSDATE,
    paid NUMBER(1) DEFAULT 0,
    FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id) ON DELETE CASCADE,
    FOREIGN KEY (librarian_id) REFERENCES LIBRARIAN(librarian_id) ON DELETE SET NULL,
    FOREIGN KEY (borrow_id) REFERENCES BORROW(borrow_id) ON DELETE CASCADE
);

-- ======================
-- SEQUENCES
-- ======================

CREATE SEQUENCE borrow_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE reservation_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fine_seq START WITH 1 INCREMENT BY 1;

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_borrow_erp ON BORROW(erp_id);
CREATE INDEX idx_borrow_book ON BORROW(book_id);
CREATE INDEX idx_reservation_erp ON RESERVATIONS(erp_id);
CREATE INDEX idx_fine_erp ON FINE(erp_id);
