# Approval Workflow Setup Instructions

## Overview
The borrow approval workflow requires database schema changes. Follow these steps to enable the new feature.

## What Changed
- Students now create **pending borrow requests** instead of immediate borrows
- Librarians see requests in new **Issue Requests** page and approve them at the counter
- Student "My Books" page shows both pending requests and issued books
- Issue/due dates are set only when librarian approves (not when student requests)

## Database Migration Steps

### Step 1: Add Status Columns to BORROW Table
Run this in SQL Developer or SQL*Plus:

```sql
-- Connect to your database
sqlplus hasan/123@ORCL

-- Run the migration
@C:\Users\hasan\Desktop\db-project\database\07_add_borrow_approval.sql
```

This adds:
- `status` column (PENDING/ISSUED/RETURNED)
- `approval_date` column
- `librarian_id` column (tracks who approved)

### Step 2: Update Triggers
Run the updated triggers:

```sql
@C:\Users\hasan\Desktop\db-project\database\08_updated_triggers_approval.sql
```

This replaces the old triggers with new ones that:
- Don't reduce copies on PENDING requests
- Set dates and reduce copies only when status changes to ISSUED
- Handle fine calculation on return

### Step 3: Verify Changes
Check the schema was updated:

```sql
SELECT table_name, column_name, data_type, data_default 
FROM user_tab_columns 
WHERE table_name = 'BORROW' 
  AND column_name IN ('STATUS', 'APPROVAL_DATE', 'LIBRARIAN_ID')
ORDER BY column_id;
```

Expected output: 3 rows showing the new columns.

### Step 4: Restart Backend
After DB changes, restart your backend server:

```powershell
cd C:\Users\hasan\Desktop\db-project\backend
# Stop the current server (Ctrl+C) then:
npm run dev
```

### Step 5: Test the Flow

**As Student (ERP: 22001, pass: pass123):**
1. Login → Search Books
2. Click "Borrow" on any book
3. See message: "Request submitted! Go to the counter to collect your book."
4. Go to "My Books" → see book with status "Pending Approval"

**As Librarian (ID: 101, pass: lib123):**
1. Login → Issue Requests
2. See the pending request with student details
3. Click "Issue Book" to approve
4. Success message appears, request disappears

**Back as Student:**
1. Refresh "My Books" page
2. Status changed to "Issued" with issue date and due date shown

## Troubleshooting

### Error: "ORA-00904: 'STATUS': invalid identifier"
**Cause:** Migration script not run yet.
**Fix:** Run `07_add_borrow_approval.sql`

### Error: "ORA-04098: trigger is invalid"
**Cause:** Old trigger references don't match new schema.
**Fix:** Run `08_updated_triggers_approval.sql` to replace triggers

### Pending requests not showing
**Cause:** Backend not restarted after DB changes.
**Fix:** Restart backend server

### Issue date not being set
**Cause:** Trigger not updated or approval_date missing.
**Fix:** Ensure `08_updated_triggers_approval.sql` was run successfully

## Rollback (if needed)

To revert to old behavior:

```sql
-- Remove new columns
ALTER TABLE BORROW DROP COLUMN status;
ALTER TABLE BORROW DROP COLUMN approval_date;
ALTER TABLE BORROW DROP COLUMN librarian_id;

-- Restore old triggers
@C:\Users\hasan\Desktop\db-project\database\03_triggers_oracle.sql
```

## For Teammates

If you're cloning this repo after the approval workflow was added:

1. **Pull latest code** from GitHub
2. **Run DB migrations** (steps 1-2 above) if your DB doesn't have the new columns
3. **Restart backend and frontend**
4. **Test the flow** as described in Step 5

The frontend will automatically use the new workflow once backend is updated.

## Summary of Files Changed

**Database:**
- `database/07_add_borrow_approval.sql` - NEW: Adds status columns
- `database/08_updated_triggers_approval.sql` - NEW: Updated triggers

**Backend:**
- `backend/routes/student.js` - Changed borrow to create PENDING request
- `backend/routes/librarian.js` - Added pending requests endpoint + approve endpoint

**Frontend:**
- `frontend/src/pages/student/searchBooks.jsx` - Updated borrow message
- `frontend/src/pages/student/borrowedBooks.jsx` - Now "My Books" with status display
- `frontend/src/pages/librarian/issueRequests.jsx` - NEW: Replaces issueBook.jsx
- `frontend/src/App.js` - Updated route from issue-book to issue-requests
- All librarian navbar links updated to "Issue Requests"

## Questions?

If you encounter issues not covered here, check:
1. Backend terminal for error messages
2. Browser console for frontend errors
3. SQL*Plus output when running migration scripts

The approval workflow is now production-ready! 🎉
