-- Library Management System - Database Triggers
-- Oracle Database

-- ======================
-- AUTO-INCREMENT TRIGGERS
-- ======================

-- Trigger: Auto-increment borrow_id
CREATE OR REPLACE TRIGGER borrow_id_trigger
BEFORE INSERT ON BORROW
FOR EACH ROW
BEGIN
    IF :NEW.borrow_id IS NULL THEN
        :NEW.borrow_id := borrow_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger: Auto-increment reservation_id
CREATE OR REPLACE TRIGGER reservation_id_trigger
BEFORE INSERT ON RESERVATIONS
FOR EACH ROW
BEGIN
    IF :NEW.reservation_id IS NULL THEN
        :NEW.reservation_id := reservation_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger: Auto-increment fine_id
CREATE OR REPLACE TRIGGER fine_id_trigger
BEFORE INSERT ON FINE
FOR EACH ROW
BEGIN
    IF :NEW.fine_id IS NULL THEN
        :NEW.fine_id := fine_seq.NEXTVAL;
    END IF;
END;
/

-- ======================
-- BUSINESS LOGIC TRIGGERS
-- ======================

-- Trigger: Decrease available copies when book is borrowed
CREATE OR REPLACE TRIGGER decrease_book_copies
AFTER INSERT ON BORROW
FOR EACH ROW
BEGIN
    UPDATE BOOKS
    SET available_copies = available_copies - 1
    WHERE book_id = :NEW.book_id
    AND available_copies > 0;
END;
/

-- Trigger: Increase available copies when book is returned
CREATE OR REPLACE TRIGGER increase_book_copies
AFTER UPDATE OF return_date ON BORROW
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND OLD.return_date IS NULL)
BEGIN
    UPDATE BOOKS
    SET available_copies = available_copies + 1
    WHERE book_id = :NEW.book_id;
END;
/

-- Trigger: Check if student has outstanding fines before borrowing
CREATE OR REPLACE TRIGGER check_fines_before_borrow
BEFORE INSERT ON BORROW
FOR EACH ROW
DECLARE
    v_unpaid_fines NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_unpaid_fines
    FROM FINE
    WHERE erp_id = :NEW.erp_id
    AND paid = 0;
    
    IF v_unpaid_fines > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Cannot borrow: Student has unpaid fines');
    END IF;
END;
/

-- Trigger: Check if book is available before borrowing
CREATE OR REPLACE TRIGGER check_book_availability
BEFORE INSERT ON BORROW
FOR EACH ROW
DECLARE
    v_available NUMBER;
BEGIN
    SELECT available_copies
    INTO v_available
    FROM BOOKS
    WHERE book_id = :NEW.book_id;
    
    IF v_available <= 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Book is not available for borrowing');
    END IF;
END;
/

-- Trigger: Prevent borrowing more than 3 books at once
CREATE OR REPLACE TRIGGER check_borrow_limit
BEFORE INSERT ON BORROW
FOR EACH ROW
DECLARE
    v_active_borrows NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_active_borrows
    FROM BORROW
    WHERE erp_id = :NEW.erp_id
    AND return_date IS NULL;
    
    IF v_active_borrows >= 3 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Cannot borrow more than 3 books at once');
    END IF;
END;
/

-- Trigger: Auto-calculate fine for overdue books
CREATE OR REPLACE TRIGGER auto_calculate_fine
AFTER UPDATE OF return_date ON BORROW
FOR EACH ROW
WHEN (NEW.return_date IS NOT NULL AND OLD.return_date IS NULL)
DECLARE
    v_days_late NUMBER;
    v_fine_amount NUMBER;
BEGIN
    -- Calculate days late
    v_days_late := TRUNC(:NEW.return_date - :NEW.due_date);
    
    -- Only create fine if book is returned late
    IF v_days_late > 0 THEN
        v_fine_amount := v_days_late * 10; -- 10 units per day
        
        INSERT INTO FINE (erp_id, borrow_id, fine_amount, fine_reason, paid)
        VALUES (
            :NEW.erp_id,
            :NEW.borrow_id,
            v_fine_amount,
            'Late return: ' || v_days_late || ' days overdue',
            0
        );
    END IF;
END;
/
