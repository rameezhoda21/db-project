-- ============================================================================
-- Authentication System - Users Table and Sequences
-- ============================================================================
-- This script creates the USERS table for authentication and registration
-- Run this AFTER 01_create_tables.sql
-- ============================================================================

-- Create sequence for USERS table
CREATE SEQUENCE user_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Sequences for auto-generating student and librarian IDs
CREATE SEQUENCE student_erp_seq
START WITH 26001
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE librarian_id_seq
START WITH 201
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- ============================================================================
-- USERS TABLE
-- Central authentication table for all user registrations
-- ============================================================================
CREATE TABLE USERS (
    user_id         NUMBER PRIMARY KEY,
    email           VARCHAR2(100) UNIQUE NOT NULL,
    password_hash   VARCHAR2(255) NOT NULL,
    first_name      VARCHAR2(100) NOT NULL,
    last_name       VARCHAR2(100) NOT NULL,
    role            VARCHAR2(20) NOT NULL CHECK (role IN ('student', 'librarian', 'admin')),
    status          VARCHAR2(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    erp_id          NUMBER,  -- Student ERP ID (stored during signup, validated during approval)
    librarian_id    NUMBER,  -- Links to LIBRARIAN table after approval
    reset_token     VARCHAR2(255),  -- Password reset token
    reset_token_expiry TIMESTAMP,  -- Token expiration time
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at     TIMESTAMP,
    approved_by     NUMBER,  -- admin_id who approved
    CONSTRAINT fk_user_approved_by FOREIGN KEY (approved_by) REFERENCES ADMINS(admin_id)
);

-- ============================================================================
-- Email Validation Trigger
-- Enforces email format rules based on role
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_validate_user_email
BEFORE INSERT OR UPDATE ON USERS
FOR EACH ROW
BEGIN
    -- Student emails must end with @khi.iba.edu.pk
    IF :NEW.role = 'student' THEN
        IF :NEW.email NOT LIKE '%@khi.iba.edu.pk' THEN
            RAISE_APPLICATION_ERROR(-20001, 'Student email must be an IBA email (@khi.iba.edu.pk)');
        END IF;
    END IF;
    
    -- Librarian emails must end with @gmail.com
    IF :NEW.role = 'librarian' THEN
        IF :NEW.email NOT LIKE '%@gmail.com' THEN
            RAISE_APPLICATION_ERROR(-20002, 'Librarian email must be a Gmail address (@gmail.com)');
        END IF;
    END IF;
    
    -- Admin emails must end with @gmail.com
    IF :NEW.role = 'admin' THEN
        IF :NEW.email NOT LIKE '%@gmail.com' THEN
            RAISE_APPLICATION_ERROR(-20003, 'Admin email must be a Gmail address (@gmail.com)');
        END IF;
    END IF;
    
    -- Auto-generate user_id if not provided
    IF :NEW.user_id IS NULL THEN
        SELECT user_seq.NEXTVAL INTO :NEW.user_id FROM DUAL;
    END IF;
END;
/

COMMIT;

-- ============================================================================
-- Note: The hardcoded admin in ADMINS table (admin_id=1) will NOT go through
-- the USERS table - it's pre-approved and used for initial system access
-- ============================================================================
