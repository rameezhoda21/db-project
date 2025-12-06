-- ============================================================================
-- Library Management System - Table Creation Script
-- ============================================================================
-- This script creates all database tables for the IBA Library System
-- Run this file FIRST before views and triggers
-- ============================================================================

-- ============================================================================
-- STUDENTS TABLE
-- Stores student information, login credentials, and outstanding fines
-- ============================================================================
CREATE TABLE STUDENTS (
    erp_id          NUMBER PRIMARY KEY,
    first_name      VARCHAR2(255) NOT NULL,
    last_name       VARCHAR2(255) NOT NULL,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    pass            VARCHAR2(255) NOT NULL,
    fine_due        NUMBER(10, 2) DEFAULT 0.00 CHECK (fine_due >= 0),
    reset_token     VARCHAR2(255),
    reset_token_expiry TIMESTAMP
);

-- ============================================================================
-- BOOKS TABLE
-- Central catalog of all books with availability tracking
-- ============================================================================
CREATE TABLE BOOKS (
    book_id             NUMBER PRIMARY KEY,
    title               VARCHAR2(255) NOT NULL,
    author              VARCHAR2(255) NOT NULL,
    genre               VARCHAR2(255),
    year_published      NUMBER CHECK (year_published >= 1000 AND year_published <= 9999),
    available_copies    NUMBER DEFAULT 0 CHECK (available_copies >= 0)
);

-- ============================================================================
-- ADMINS TABLE
-- System administrators who manage the library system
-- ============================================================================
CREATE TABLE ADMINS (
    admin_id        NUMBER PRIMARY KEY,
    first_name      VARCHAR2(100) NOT NULL,
    last_name       VARCHAR2(100) NOT NULL,
    pass            VARCHAR2(255) NOT NULL,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    reset_token     VARCHAR2(255),
    reset_token_expiry TIMESTAMP
);

-- ============================================================================
-- LIBRARY_POLICY TABLE
-- Defines system-wide borrowing rules (loan period, fines)
-- ============================================================================
CREATE TABLE LIBRARY_POLICY (
    policy_id           NUMBER PRIMARY KEY,
    loan_period_days    NUMBER NOT NULL CHECK (loan_period_days > 0),
    fine_per_day        NUMBER(5, 2) NOT NULL CHECK (fine_per_day >= 0),
    admin_id            NUMBER,
    CONSTRAINT fk_policy_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

-- ============================================================================
-- LIBRARIAN TABLE
-- Library staff who manage books, borrowing, and fines
-- ============================================================================
CREATE TABLE LIBRARIAN (
    librarian_id    NUMBER PRIMARY KEY,
    first_name      VARCHAR2(100) NOT NULL,
    last_name       VARCHAR2(100) NOT NULL,
    pass            VARCHAR2(255) NOT NULL,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    admin_id        NUMBER,
    reset_token     VARCHAR2(255),
    reset_token_expiry TIMESTAMP,
    CONSTRAINT fk_lib_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

-- ============================================================================
-- BORROW TABLE
-- Tracks all borrowing transactions (past and present)
-- ============================================================================
CREATE TABLE BORROW (
    borrow_id       NUMBER PRIMARY KEY,
    erp_id          NUMBER NOT NULL,
    book_id         NUMBER NOT NULL,
    issue_date      DATE,
    due_date        DATE,
    return_date     DATE,
    status          VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    approval_date   DATE,
    librarian_id    NUMBER,
    CONSTRAINT fk_borrow_student FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES BOOKS(book_id),
    CONSTRAINT fk_borrow_librarian FOREIGN KEY (librarian_id) REFERENCES LIBRARIAN(librarian_id),
    CONSTRAINT chk_return_after_issue CHECK (return_date IS NULL OR return_date >= issue_date),
    CONSTRAINT chk_borrow_status CHECK (status IN ('PENDING', 'ISSUED', 'RETURNED'))
);

-- ============================================================================
-- FINE TABLE
-- Records all fines issued to students for late returns or damages
-- ============================================================================
CREATE TABLE FINE (
    fine_id         NUMBER PRIMARY KEY,
    erp_id          NUMBER NOT NULL,
    librarian_id    NUMBER NOT NULL,
    borrow_id       NUMBER NOT NULL,
    fine_amount     NUMBER(10, 2) NOT NULL CHECK (fine_amount >= 0),
    fine_reason     VARCHAR2(255),
    fine_date       DATE DEFAULT SYSDATE NOT NULL,
    paid            NUMBER(1) DEFAULT 0 CHECK (paid IN (0, 1)),
    CONSTRAINT fk_fine_student FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_fine_librarian FOREIGN KEY (librarian_id) REFERENCES LIBRARIAN(librarian_id),
    CONSTRAINT fk_fine_borrow FOREIGN KEY (borrow_id) REFERENCES BORROW(borrow_id)
);

COMMIT;