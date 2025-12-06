-- ============================================================================
-- SEQUENCES FOR AUTO-INCREMENT IDs
-- Run this file BEFORE creating tables
-- ============================================================================

-- Sequence for BORROW table
CREATE SEQUENCE borrow_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Sequence for FINE table
CREATE SEQUENCE fine_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Sequence for BOOKS table
CREATE SEQUENCE book_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;
