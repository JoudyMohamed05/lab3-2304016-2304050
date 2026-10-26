# Lab 3 - Foreign Keys and Simple SQL

Students: Joudy Mohamed Aly (2304050), Raneem Ahmed Ragab (2304016)

## Requirements
- MySQL Server + MySQL client
- Node.js (v18 or newer)

## Problem 1 (COMPANY database)
```
mysql -u root -p < problem1_DDL.sql
mysql -u root -p < problem1_DML.sql
mysql -u root -p company
```
The answers of Q1.1 - Q1.3 are in `problem1_Answers.txt`.

## Problem 2 (Library database + website)
1. Build the database and the seed data:
```
mysql -u root -p < problem2_DDL.sql
mysql -u root -p < problem2_DML.sql
```
   `problem2_DDL.sql` also creates the `users` table (login / register, from Lab 2) in the same `library` database.
2. Set your MySQL password (or edit `website/db.js`):
   - Windows PowerShell: `$env:DB_PASSWORD="your_password"`
   - Linux / macOS: `export DB_PASSWORD=your_password`
3. Run the website:
```
cd website
npm install
npm start
```
4. Open http://localhost:3000 - you are sent to the login page. Click **Register** to create an account, then use the library.
   (Optional: set `SESSION_SECRET` the same way as `DB_PASSWORD` to use your own session secret.)

## Website features
- Login / Register / Logout (from Lab 2): passwords stored as bcrypt hashes, all SQL uses `?` parameters, the logged-in user is kept in a server-side session, every library page redirects to `/login` if nobody is logged in
- Checks in the browser (`public/validate.js`) and again on the server, with the messages `Name is required`, `Email is required`, `Password is required`, `Confirm password is required`, `Passwords do not match`, `Email Already Exists`, `Invalid email or password`
- F2.1 show the books table (with author_id) and the authors table
- F2.2 add a book / add an author
- F2.3 edit a book / edit an author
- F2.4 remove a book
- F2.5 remove an author (its books are deleted too: `ON DELETE CASCADE`)
- Bonus: upload a cover image for books and a photo for authors
