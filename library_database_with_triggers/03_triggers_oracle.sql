-- This file contains all the triggers for the Library Management System.
-- Run this file AFTER creating tables (01) and views (02).

/*
==================================================================================
TRIGGER 1: trg_borrow_before_insert
==================================================================================
This is a "compound" trigger that runs BEFORE a new row is inserted into the BORROW table.
It handles three critical business rules in one place:
1. Checks if the student has outstanding fines.
2. Checks if the book is in stock (available_copies > 0).
3. Automatically calculates and sets the due_date based on the LIBRARY_POLICY.
*/
CREATE OR REPLACE TRIGGER trg_borrow_before_insert
BEFORE INSERT ON BORROW
FOR EACH ROW
DECLARE
    v_fine_due STUDENTS.fine_due%TYPE;
    v_available_copies BOOKS.available_copies%TYPE;
    v_loan_period LIBRARY_POLICY.loan_period_days%TYPE;
BEGIN
    -- 1. Check for outstanding fines
    SELECT fine_due
    INTO v_fine_due
    FROM STUDENTS
    WHERE erp_id = :NEW.erp_id;

    IF v_fine_due > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Student ' || :NEW.erp_id || ' has an outstanding fine of ' || v_fine_due || ' and cannot borrow new books.');
    END IF;

    -- 2. Check book availability
    -- Using "FOR UPDATE" locks the row to prevent race conditions
    SELECT available_copies
    INTO v_available_copies
    FROM BOOKS
    WHERE book_id = :NEW.book_id
    FOR UPDATE;

    IF v_available_copies <= 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Book ' || :NEW.book_id || ' is not available. All copies are borrowed.');
    END IF;

    -- 3. Auto-calculate Due Date
    -- Assumes only one policy row exists
    SELECT loan_period_days
    INTO v_loan_period
    FROM LIBRARY_POLICY
    WHERE ROWNUM = 1; -- Simple way to get the single policy

    -- Set the due_date for the new borrow record
    :NEW.due_date := :NEW.issue_date + v_loan_period;

END;
/


/*
==================================================================================
TRIGGER 2: trg_borrow_after_insert
==================================================================================
This trigger fires AFTER a new borrow record is successfully inserted.
It updates the inventory in the BOOKS table by decrementing (subtracting 1)
the available_copies count for the borrowed book.
*/
CREATE OR REPLACE TRIGGER trg_borrow_after_insert
AFTER INSERT ON BORROW
FOR EACH ROW
BEGIN
    UPDATE BOOKS
    SET available_copies = available_copies - 1
    WHERE book_id = :NEW.book_id;
END;
/


/*
==================================================================================
TRIGGER 3: trg_borrow_after_update
==================================================================================
This trigger fires AFTER a borrow record is updated.
It specifically checks if the 'return_date' was just changed from NULL to a value.
If so, it increments (adds 1) the available_copies count in the BOOKS table.
*/
CREATE OR REPLACE TRIGGER trg_borrow_after_update
AFTER UPDATE ON BORROW
FOR EACH ROW
BEGIN
    -- Check if the book is being returned (return_date changed from NULL to a value)
    IF :OLD.return_date IS NULL AND :NEW.return_date IS NOT NULL THEN
        UPDATE BOOKS
        SET available_copies = available_copies + 1
        WHERE book_id = :NEW.book_id;
    END IF;
END;
/


/*
==================================================================================
MODIFIED TRIGGER 4: trg_fine_after_insert
==================================================================================
Now only updates fine_due if the inserted fine is UNPAID (paid = 0).
*/
CREATE OR REPLACE TRIGGER trg_fine_after_insert
AFTER INSERT ON FINE
FOR EACH ROW
BEGIN
    -- ONLY update the student's fine_due if the fine is inserted as UNPAID (paid = 0)
    IF :NEW.paid = 0 THEN
        UPDATE STUDENTS
        SET fine_due = fine_due + :NEW.fine_amount
        WHERE erp_id = :NEW.erp_id;
    END IF;
END;
/


/*
==================================================================================
TRIGGER 5: trg_fine_after_update
==================================================================================
This trigger fires AFTER a fine record is updated.
It specifically checks if the 'paid' status was just changed from 0 to 1.
If so, it updates the student's total 'fine_due' by subtracting the paid amount.
*/
CREATE OR REPLACE TRIGGER trg_fine_after_update
AFTER UPDATE ON FINE
FOR EACH ROW
BEGIN
    -- Check if the fine was just paid (paid changed from 0 to 1)
    IF :OLD.paid = 0 AND :NEW.paid = 1 THEN
        UPDATE STUDENTS
        SET fine_due = fine_due - :NEW.fine_amount
        WHERE erp_id = :NEW.erp_id;
    END IF;
END;
/
COMMIT;