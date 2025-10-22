CREATE TABLE STUDENTS (
    erp_id   INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    fine_due DECIMAL(10, 2) DEFAULT 0.00
);


CREATE TABLE BOOKS (
    book_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    year_published INT,
    available_copies INT DEFAULT 0
);

CREATE TABLE BORROW(
    borrow_id INT PRIMARY KEY,
    erp_id INT,
    book_id INT,
    issue_date DATE NOT NULL,
    due_date DATE,
    return_date DATE,
    CONSTRAINT fk_erp FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_bk FOREIGN KEY (book_id) REFERENCES BOOKS(book_id)
);

CREATE TABLE ADMINS (
    admin_id INT PRIMARY KEY,
    name VARCHAR(100)  NOT NULL,
    pass VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE LIBRARY_POLICY(
    policy_id INT PRIMARY KEY,
    loan_period_days INT NOT NULL,
    fine_per_day DECIMAL(5, 2) NOT NULL,
    admin_id INT,
    CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

CREATE TABLE RESERVATIONS (
    reservation_id INT PRIMARY KEY,
    erp_id INT,
    book_id INT,
    reservation_date DATE NOT NULL,
    CONSTRAINT fk_res_erp FOREIGN KEY (erp_id) REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_res_bk FOREIGN KEY (book_id) REFERENCES BOOKS(book_id)
);

CREATE TABLE LIBRARIAN(
    librarian_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    admin_id INT,
    CONSTRAINT fk_lib_admin FOREIGN KEY (admin_id) REFERENCES ADMINS(admin_id)
);

CREATE TABLE FINE (
    fine_id INT PRIMARY KEY,
    erp_id INT NOT NULL,
    librarian_id INT NOT NULL,
    borrow_id INT NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    fine_reason VARCHAR2(255),
    fine_date DATE DEFAULT SYSDATE NOT NULL,
    paid INT DEFAULT 0 CHECK (paid IN (0,1)),

    CONSTRAINT fk_fine_erp FOREIGN KEY (erp_id)
        REFERENCES STUDENTS(erp_id),
    CONSTRAINT fk_fine_lib FOREIGN KEY (librarian_id)
        REFERENCES LIBRARIAN(librarian_id),
    CONSTRAINT fk_fine_borrow FOREIGN KEY (borrow_id)
        REFERENCES BORROW(borrow_id)
);

