CREATE TABLE STUDENTS (
    erp_id   NUMBER PRIMARY KEY,
    first_name VARCHAR2(255) NOT NULL,
    last_name VARCHAR2(255) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    pass VARCHAR2(255) NOT NULL,
    fine_due NUMBER(10, 2) DEFAULT 0.00
);


CREATE TABLE BOOKS (
    book_id NUMBER PRIMARY KEY,
    title VARCHAR2(255) NOT NULL,
    author VARCHAR2(255) NOT NULL,
    genre VARCHAR2(255),
    year_published NUMBER,
    available_copies NUMBER DEFAULT 0 CHECK (available_copies >= 0)
);

CREATE TABLE BORROW(
    borrow_id NUMBER PRIMARY KEY,
    erp_id NUMBER NOT NULL,
    book_id NUMBER NOT NULL,
    issue_date DATE DEFAULT SYSDATE NOT NULL, 
    due_date DATE,
    return_date DATE,
    CONSTRAINT fk_erp FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_bk FOREIGN KEY (book_id) REFERENCES BOOKS(book_id)
);

CREATE TABLE ADMINS (
    admin_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    pass VARCHAR2(255) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL
);

CREATE TABLE LIBRARY_POLICY(
    policy_id NUMBER PRIMARY KEY,
    loan_period_days NUMBER NOT NULL,
    fine_per_day NUMBER(5, 2) NOT NULL,
    admin_id NUMBER,
    CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

CREATE TABLE RESERVATIONS (
    reservation_id NUMBER PRIMARY KEY,
    erp_id NUMBER NOT NULL,
    book_id NUMBER NOT NULL,
    reservation_date DATE NOT NULL,
    CONSTRAINT fk_res_erp FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_res_bk FOREIGN KEY (book_id) REFERENCES BOOKS(book_id)
);

CREATE TABLE LIBRARIAN(
    librarian_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    pass VARCHAR2(255) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    admin_id NUMBER,
    CONSTRAINT fk_lib_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

CREATE TABLE FINE (
    fine_id NUMBER PRIMARY KEY,
    erp_id NUMBER NOT NULL,
    librarian_id NUMBER NOT NULL,
    borrow_id NUMBER NOT NULL,
    fine_amount NUMBER(10, 2) NOT NULL,
    fine_reason VARCHAR2(255),
    fine_date DATE DEFAULT SYSDATE NOT NULL,
    paid NUMBER(1) DEFAULT 0 CHECK (paid IN (0,1)),

    CONSTRAINT fk_fine_erp FOREIGN KEY (erp_id)
        REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_fine_lib FOREIGN KEY (librarian_id)
        REFERENCES LIBRARIAN(librarian_id),
    CONSTRAINT fk_fine_borrow FOREIGN KEY (borrow_id)
        REFERENCES BORROW(borrow_id)
);

