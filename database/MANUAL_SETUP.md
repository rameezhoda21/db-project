# ============================================================================
# Manual Database Setup Using SQL Developer
# ============================================================================
# If the PowerShell script doesn't work, follow these steps in SQL Developer
# ============================================================================

## STEPS:

1. Open SQL Developer
2. Create/Open your Oracle connection (User: C##RAMEEZHODA, Password: 123)
3. Click the connection to connect
4. Open SQL Worksheet (File > Open SQL Worksheet or Ctrl+Shift+N)

5. Execute files IN THIS ORDER:
   
   a) 00_drop_all.sql
      - Click "Open File" icon or Ctrl+O
      - Navigate to: db-project/database/00_drop_all.sql
      - Press F5 (Run Script) or click the "Run Script" icon (second play button)
   
   b) 01_create_tables.sql
      - File > Open > db-project/database/01_create_tables.sql
      - Press F5 (Run Script)
   
   c) 02_views_oracle.sql
      - File > Open > db-project/database/02_views_oracle.sql
      - Press F5 (Run Script)
   
   d) 03_triggers_oracle.sql
      - File > Open > db-project/database/03_triggers_oracle.sql
      - Press F5 (Run Script)
   
   e) 04_sample_data_oracle.sql
      - File > Open > db-project/database/04_sample_data_oracle.sql
      - Press F5 (Run Script)

6. Verify the setup:
   - Run: SELECT table_name FROM user_tables;
   - You should see: STUDENTS, BOOKS, BORROW, ADMINS, LIBRARY_POLICY, RESERVATIONS, etc.

## IMPORTANT NOTES:

- Always use F5 (Run Script) NOT F9 (Run Statement)
- F5 runs the entire file as a script
- Check the "Script Output" tab for any errors
- If you see "ORA-00942: table or view does not exist" errors when dropping, that's normal on first run
