# 💰 Fine Testing Guide

This guide explains how to test the overdue fine functionality in the library system.

---

## 🎯 Overview

The system automatically calculates fines for overdue books at **Rs 10 per day**. This guide will help you test:
- Making a book overdue
- Processing returns with fines
- Managing fine payments
- Preventing borrowing with unpaid fines

---

## 📋 Testing Steps

### Step 1: Find an Active Borrow

Login to Oracle SQL Developer and run:

```sql
-- View all active borrows for a student
SELECT borrow_id, book_id, erp_id, issue_date, due_date, status
FROM BORROW
WHERE erp_id = 29174 AND status = 'ISSUED'
ORDER BY borrow_id DESC;
```

Note down a `borrow_id` to use for testing.

---

### Step 2: Make a Book Overdue

Make the book 5 days overdue (Rs 50 fine):

```sql
-- Replace XX with your actual borrow_id
UPDATE BORROW
SET due_date = SYSDATE - 5
WHERE borrow_id = XX;

COMMIT;

-- Verify the change
SELECT borrow_id, book_id, issue_date, due_date, SYSDATE as today, status
FROM BORROW
WHERE borrow_id = XX;
```

---

### Step 3: Test Return with Fine (Librarian)

1. **Login as Librarian**
   - Email: `librarian@gmail.com`
   - Password: `12345678`

2. **Navigate to "Return Book"**
   - You should see the overdue book highlighted in **red**
   - Status will show "Overdue"

3. **Click "Return" button**
   - A confirmation modal will appear
   - Click "Process Return"

4. **Check the Toast Notification**
   - Should display: "Book returned successfully - Fine: Rs 50"
   - This confirms the fine was calculated (5 days × Rs 10/day = Rs 50)

---

### Step 4: Verify Fine Creation

Check if the fine was created in the database:

```sql
-- View all fines for the student
SELECT fine_id, erp_id, fine_amount, fine_reason, paid, fine_date
FROM FINE
WHERE erp_id = 29174
ORDER BY fine_date DESC;

-- Check student's total outstanding fine
SELECT erp_id, first_name, last_name, fine_due
FROM STUDENTS
WHERE erp_id = 29174;
```

You should see:
- A new fine record with `fine_amount = 50`
- `fine_reason` explaining the overdue period
- `paid = 0` (unpaid)
- Student's `fine_due = 50`

---

### Step 5: Test Borrowing Block (Student)

1. **Login as Student**
   - Email: `hasan.imam@khi.iba.edu.pk`
   - Password: `12345678`

2. **Try to Borrow a Book**
   - Go to "Search Books"
   - Click "Borrow" on any available book

3. **Check Error Message**
   - Should display: "You have an outstanding fine of Rs 50. Please pay fines before borrowing."
   - This confirms students with fines cannot borrow

---

### Step 6: Process Fine Payment (Admin)

1. **Login as Admin**
   - Email: `admin@gmail.com`
   - Password: `12345678`

2. **Navigate to "Manage Fines"**
   - You should see the Rs 50 fine listed

3. **Click "Mark as Paid"**
   - A confirmation modal will appear
   - Click "Mark as Paid" to confirm

4. **Verify**
   - Fine should disappear from the list
   - Student can now borrow books again

---

### Step 7: Verify Payment in Database

```sql
-- Check if fine was marked as paid
SELECT fine_id, erp_id, fine_amount, paid
FROM FINE
WHERE erp_id = 29174 AND fine_id = XX;  -- Use fine_id from earlier query

-- Check student's fine_due is now 0
SELECT erp_id, first_name, last_name, fine_due
FROM STUDENTS
WHERE erp_id = 29174;
```

---

## 🔄 Clean Up After Testing

To restore the borrow record back to normal (optional):

```sql
-- Find the returned borrow
SELECT borrow_id, book_id, status, return_date
FROM BORROW
WHERE erp_id = 29174 AND status = 'RETURNED'
ORDER BY borrow_id DESC;

-- Revert it back to ISSUED with normal due date
UPDATE BORROW
SET status = 'ISSUED',
    return_date = NULL,
    due_date = issue_date + 14
WHERE borrow_id = XX;  -- Your borrow_id

-- Return the book copy to inventory
UPDATE BOOKS
SET available_copies = available_copies - 1
WHERE book_id = YY;  -- Your book_id

COMMIT;
```

---

## ✅ What to Verify

- [ ] Overdue books show in red on Return Book page
- [ ] Fine is calculated correctly (Rs 10 × days overdue)
- [ ] Fine toast notification shows amount
- [ ] Fine is recorded in database
- [ ] Student's `fine_due` is updated
- [ ] Student cannot borrow with unpaid fines
- [ ] Error message is user-friendly
- [ ] Admin can mark fines as paid
- [ ] Payment clears student's fine
- [ ] Student can borrow after payment

---

## 📊 Fine Calculation Formula

```
Fine Amount = Days Overdue × Rs 10

Example:
- Due Date: Dec 1, 2025
- Return Date: Dec 6, 2025
- Days Overdue: 5
- Fine: 5 × Rs 10 = Rs 50
```

---

## 🔍 Troubleshooting

**Issue**: Fine not being calculated
- Check if the trigger `trg_borrow_after_return` exists
- Verify `LIBRARY_POLICY` table has `fine_per_day = 10`

**Issue**: Cannot mark fine as paid
- Ensure you're logged in as Admin
- Check database connection

**Issue**: Student can still borrow with fines
- Verify trigger `trg_borrow_before_insert` is enabled
- Check if `fine_due` column is updated correctly

---

## 📝 Notes

- Fines are calculated automatically by database triggers
- The system uses `SYSDATE` to determine overdue days
- All monetary values are in Pakistani Rupees (Rs)
- Fine records are permanent and cannot be deleted

---

Happy Testing! 🎉
