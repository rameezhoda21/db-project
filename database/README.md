# Database - Library Management System

SQL scripts for Oracle Database setup.

## 📂 Files

- `schema.sql` - Database tables and structure
- `views.sql` - Database views for common queries
- `triggers.sql` - Automated business logic triggers
- `seed-data.sql` - Sample data for testing

## 🚀 Setup Instructions

### 1. Connect to Oracle Database

```sql
sqlplus username/password@localhost:1521/orcl
```

### 2. Run Scripts in Order

```sql
-- Create tables
@schema.sql

-- Create views
@views.sql

-- Create triggers
@triggers.sql

-- (Optional) Load sample data
@seed-data.sql
```

## 📊 Database Structure

### Tables
- **ADMIN** - System administrators
- **LIBRARIAN** - Library staff
- **STUDENTS** - Student users
- **BOOKS** - Book inventory
- **BORROW** - Borrowing records
- **RESERVATIONS** - Book reservations
- **FINE** - Fine records

### Views
- **AvailableBooks** - Books with available copies
- **BorrowedBooks** - All borrowed books with status
- **Overdue_Borrows** - Overdue books
- **StudentFineSummary** - Fine totals per student
- **BookPopularity** - Books by borrow count

### Triggers
- Auto-increment primary keys
- Update available copies on borrow/return
- Check fines before borrowing
- Verify book availability
- Enforce 3-book borrow limit
- Auto-calculate late fees (10 units/day)

## 🔐 Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Librarians:**
- ID: `1`, Password: `lib123`
- ID: `2`, Password: `lib123`
- ID: `3`, Password: `lib123`

**Students:**
- ERP: `S1001`, Password: `pass123`
- ERP: `S1002`, Password: `pass123`
- ERP: `S1003`, Password: `pass123`
- ERP: `S1004`, Password: `pass123`
- ERP: `S1005`, Password: `pass123`

## ⚠️ Notes

- Change default passwords in production
- Adjust fine calculation in triggers as needed
- Modify borrow limits in triggers if required
