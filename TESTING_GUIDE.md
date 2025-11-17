# 🚀 Complete Setup & Testing Guide

## Step 1: Clean the Database (Remove Sample Data)

Run this in **SQL Developer** connected as `hasan`:

```sql
-- Delete all existing data (keep tables structure)
DELETE FROM FINE;
DELETE FROM RESERVATIONS;
DELETE FROM BORROW;
DELETE FROM BOOKS;
COMMIT;
```

## Step 2: Run Clean Login Data Script

In SQL Developer, run the file:
**`database/05_clean_data_login_only.sql`**

This will give you:
- 1 Admin
- 3 Librarians (IDs: 101, 102, 103 | Password: `lib123`)
- 5 Students (ERPs: 22001-22005 | Password: `pass123`)
- **NO BOOKS, NO BORROWS, NO FINES** (clean slate!)

## Step 3: Restart Servers

### Backend:
```powershell
cd C:\Users\hasan\Desktop\db-project\backend
node server.js
```

### Frontend (new terminal):
```powershell
cd C:\Users\hasan\Desktop\db-project\frontend
npm start
```

## Step 4: Login Credentials

### Librarian Login:
- Username: `101` (or `102`, `103`)
- Password: `lib123`

### Student Login:
- ERP ID: `22001` (or `22002`, `22003`, `22004`, `22005`)
- Password: `pass123`

---

## 🧪 Testing Flow

### Test 1: Librarian Adds Book
1. Login as librarian (`101` / `lib123`)
2. Go to **Manage Books**
3. Click **+ Add New Book**
4. Fill in:
   - Title: `Introduction to Databases`
   - Author: `Ramez Elmasri`
   - ISBN: `978-0133970777`
   - Genre: `Computer Science`
   - Year: `2015`
   - Total Copies: `5`
5. Click **Add Book**
6. ✅ Book should appear in the table!

### Test 2: Student Sees New Book
1. **Logout** from librarian
2. Login as student (`22001` / `pass123`)
3. Go to **Search Books**
4. ✅ You should see the book you just added!

### Test 3: Librarian Issues Book
1. Logout and login as librarian again
2. Go to **Issue Book**
3. Enter:
   - ERP ID: `22001`
   - Select the book you added
4. Click **Issue Book**
5. ✅ Success message should appear
6. Go to **View Borrows** → You should see the active borrow record

### Test 4: Student Sees Borrowed Book
1. Logout and login as student (`22001` / `pass123`)
2. Go to **Borrowed Books**
3. ✅ You should see the book with:
   - Issue date (today)
   - Due date (today + 14 days)
   - Status: "On Time"

### Test 5: Librarian Returns Book (Late Return with Fine)
1. Logout and login as librarian
2. Go to **Return Book**
3. Find the borrow record for student 22001
4. Click **Return**
5. ✅ Since it's on time, no fine should be charged

### Test 6: Test Late Return with Fine

**To test fines, we need to manually set an old due date:**

Run this in SQL Developer:
```sql
-- Find the borrow_id first
SELECT * FROM BORROW WHERE return_date IS NULL;

-- Update the due_date to 5 days ago (replace BORROW_ID with actual ID)
UPDATE BORROW 
SET due_date = SYSDATE - 5, issue_date = SYSDATE - 19
WHERE borrow_id = 1;  -- Replace with actual borrow_id

COMMIT;
```

Now in the webapp:
1. Librarian → **Return Book**
2. Click **Return** on the overdue book
3. ✅ Fine should be calculated automatically (Rs 50 for 5 days late)

### Test 7: Student Sees Fine
1. Logout and login as student (`22001` / `pass123`)
2. Go to **Fines**
3. ✅ You should see:
   - Total fine: Rs 50
   - Fine details showing the book and days late

---

## 📊 What the Triggers Do Automatically

1. **On Book Issue:**
   - Sets `due_date` = issue_date + 14 days
   - Decrements `available_copies` by 1
   - Blocks if student has fines > 0

2. **On Book Return:**
   - Increments `available_copies` by 1
   - If late, creates FINE record with amount = days_late × 10
   - Updates `STUDENTS.fine_due`

3. **On Fine Payment:**
   - Marks fine as `paid = 1`
   - Recalculates student's total `fine_due`

---

## ✅ Complete Feature Checklist

### Librarian Can:
- ✅ Add new books to inventory
- ✅ Delete books from inventory
- ✅ Issue books to students
- ✅ Process returns with automatic fine calculation
- ✅ View all active borrows
- ✅ View complete borrow history

### Student Can:
- ✅ Search all books in inventory
- ✅ View borrowed books with due dates
- ✅ View fines with details
- ✅ See real-time updates from librarian actions

### Database Triggers Handle:
- ✅ Auto-calculate due dates (14 days)
- ✅ Auto-decrement/increment available_copies
- ✅ Block borrowing if student has fines
- ✅ Auto-calculate fines on late returns
- ✅ Auto-update student fine_due balance

---

## 🔧 Troubleshooting

### Backend not starting?
```powershell
# Kill all Node processes
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force

# Restart backend
cd C:\Users\hasan\Desktop\db-project\backend
node server.js
```

### Frontend not loading?
- Check if port 3000 is in use
- Clear browser cache
- Check browser console for errors

### Database connection issues?
- Verify Oracle DB is running
- Check credentials in `backend/.env`
- Test connection in SQL Developer

---

## 🎉 You're All Set!

Your library management system is now fully functional with:
- ✅ Complete CRUD operations
- ✅ Real-time updates across user roles
- ✅ Automatic trigger-based business logic
- ✅ Professional UI with IBA branding

**The focus is on database operations and CRUD - login is hardcoded as intended!**
