-- ============================================================================
-- LIBRARY MANAGEMENT SYSTEM - TRIGGERS
-- Run this file AFTER creating tables (01) and views (02)
-- ============================================================================
-- This file contains all triggers including the approval workflow for borrowing
-- ============================================================================

/*
==================================================================================
TRIGGER 1: trg_borrow_before_insert
==================================================================================
Runs BEFORE a new row is inserted into the BORROW table.
Handles business rules for PENDING requests:
1. Checks if the student has outstanding fines
2. Checks if the book is in stock (available_copies > 0)
3. For PENDING requests, doesn't set dates or reduce copies yet
4. For ISSUED requests (direct issue by librarian), sets dates and reduces copies
*/
CREATE OR REPLACE TRIGGER trg_borrow_before_insert
BEFORE INSERT ON BORROW
FOR EACH ROW
DECLARE
    v_fine_due STUDENTS.fine_due%TYPE;
    v_available_copies BOOKS.available_copies%TYPE;
BEGIN
    -- Only check fines for pending requests (not when librarian issues)
    IF :NEW.status = 'PENDING' THEN
        -- Check for outstanding fines
        SELECT fine_due
        INTO v_fine_due
        FROM STUDENTS
        WHERE erp_id = :NEW.erp_id;

        IF v_fine_due > 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'You have an outstanding fine of Rs ' || v_fine_due || '. Please pay fines before borrowing.');
        END IF;

        -- Check book availability
        SELECT available_copies
        INTO v_available_copies
        FROM BOOKS
        WHERE book_id = :NEW.book_id;

        IF v_available_copies <= 0 THEN
            RAISE_APPLICATION_ERROR(-20002, 'This book is currently unavailable. All copies are borrowed.');
        END IF;
        
        -- For pending requests, don't set dates or reduce copies yet
        :NEW.issue_date := NULL;
        :NEW.due_date := NULL;
    END IF;
    
    -- When status is ISSUED (librarian approves), set dates and reduce copies
    IF :NEW.status = 'ISSUED' THEN
        DECLARE
            v_loan_period NUMBER;
        BEGIN
            -- Get loan period from policy
            SELECT loan_period_days
            INTO v_loan_period
            FROM LIBRARY_POLICY
            WHERE ROWNUM = 1;
            
            -- Set issue date to approval date (or now if not set)
            IF :NEW.approval_date IS NOT NULL THEN
                :NEW.issue_date := :NEW.approval_date;
            ELSE
                :NEW.issue_date := SYSDATE;
                :NEW.approval_date := SYSDATE;
            END IF;
            
            -- Calculate due date
            :NEW.due_date := :NEW.issue_date + v_loan_period;
        END;
    END IF;
END;
/

/*
==================================================================================
TRIGGER 2: trg_borrow_before_update
==================================================================================
Runs BEFORE status is updated from PENDING to ISSUED.
Sets issue_date and due_date when librarian approves a request.
*/
CREATE OR REPLACE TRIGGER trg_borrow_before_update
BEFORE UPDATE OF status ON BORROW
FOR EACH ROW
WHEN (NEW.status = 'ISSUED' AND OLD.status = 'PENDING')
DECLARE
    v_loan_period NUMBER;
BEGIN
    -- Get loan period from policy
    SELECT loan_period_days
    INTO v_loan_period
    FROM LIBRARY_POLICY
    WHERE ROWNUM = 1;
    
    -- Set issue date to approval date (or now if not set)
    IF :NEW.approval_date IS NOT NULL THEN
        :NEW.issue_date := :NEW.approval_date;
    ELSE
        :NEW.issue_date := SYSDATE;
        :NEW.approval_date := SYSDATE;
    END IF;
    
    -- Calculate due date
    :NEW.due_date := :NEW.issue_date + v_loan_period;
END;
/

/*
==================================================================================
TRIGGER 3: trg_borrow_after_approval
==================================================================================
Runs AFTER status changes from PENDING to ISSUED.
Reduces available_copies when librarian approves a borrow request.
*/
CREATE OR REPLACE TRIGGER trg_borrow_after_approval
AFTER UPDATE OF status ON BORROW
FOR EACH ROW
WHEN (NEW.status = 'ISSUED' AND OLD.status = 'PENDING')
BEGIN
    -- Reduce available copies when librarian approves
    UPDATE BOOKS
    SET available_copies = available_copies - 1
    WHERE book_id = :NEW.book_id;
END;
/

/*
==================================================================================
TRIGGER 4: trg_borrow_before_return
==================================================================================
Runs BEFORE return_date is set.
Updates status to RETURNED when a book is returned.
*/
CREATE OR REPLACE TRIGGER trg_borrow_before_return
BEFORE UPDATE OF return_date ON BORROW
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND OLD.return_date IS NULL AND NEW.status = 'ISSUED')
BEGIN
    -- Set status to RETURNED
    :NEW.status := 'RETURNED';
END;
/

/*
==================================================================================
TRIGGER 5: trg_borrow_after_return
==================================================================================
Runs AFTER return_date is set.
1. Calculates overdue fine if book returned late
2. Increases available_copies
3. Updates student's fine_due
*/
CREATE OR REPLACE TRIGGER trg_borrow_after_return
AFTER UPDATE OF return_date ON BORROW
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND OLD.return_date IS NULL)
DECLARE
    v_days_overdue NUMBER;
    v_fine_per_day NUMBER;
    v_fine_amount NUMBER := 0;
BEGIN
    -- Calculate overdue fine
    v_days_overdue := TRUNC(:NEW.return_date) - TRUNC(:NEW.due_date);
    
    IF v_days_overdue > 0 THEN
        -- Get fine rate from policy
        SELECT fine_per_day
        INTO v_fine_per_day
        FROM LIBRARY_POLICY
        WHERE ROWNUM = 1;
        
        v_fine_amount := v_days_overdue * v_fine_per_day;
        
        -- Insert fine record (use librarian who issued the book, or default to 101 if null)
        INSERT INTO FINE (fine_id, erp_id, librarian_id, borrow_id, fine_amount, fine_reason, fine_date, paid)
        VALUES (fine_seq.NEXTVAL, :NEW.erp_id, NVL(:NEW.librarian_id, 101), :NEW.borrow_id, v_fine_amount, 
                'Late return - ' || v_days_overdue || ' days overdue', SYSDATE, 0);
        
        -- Update student's total fine
        UPDATE STUDENTS
        SET fine_due = fine_due + v_fine_amount
        WHERE erp_id = :NEW.erp_id;
    END IF;
    
    -- Increase available copies
    UPDATE BOOKS
    SET available_copies = available_copies + 1
    WHERE book_id = :NEW.book_id;
END;
/

PROMPT ============================================================================
PROMPT All triggers created successfully!
PROMPT ============================================================================
