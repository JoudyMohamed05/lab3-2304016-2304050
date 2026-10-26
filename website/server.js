const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- sessions (who is logged in) ----------
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-real-projects',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' },
}));
// make the logged-in user available to every view as `user`
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, name: req.session.userName } : null;
  next();
});

// Bonus: image upload (book covers / author photos)
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, 'public', 'uploads'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')),
  }),
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ---------- Login / Register / Logout ----------
// New session id after login (protects against session fixation); user_id is kept on the server.
function loginUser(req, user, res, next) {
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.userId = user.user_id;
    req.session.userName = user.name;
    req.session.save((err2) => (err2 ? next(err2) : res.redirect('/')));
  });
}

app.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('register', { errors: [], values: {} });
});

app.post('/register', wrap(async (req, res, next) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';
  const confirm = req.body.confirm_password || '';

  // same rules and messages as public/validate.js
  const errors = [];
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!confirm) errors.push('Confirm password is required');
  if (password && confirm && password !== confirm) errors.push('Passwords do not match');
  if (errors.length) return res.render('register', { errors, values: { name, email } });

  const hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', [email, name, hash]);
    loginUser(req, { user_id: result.insertId, name }, res, next);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {            // MySQL error 1062 (UNIQUE email)
      return res.render('register', { errors: ['Email Already Exists'], values: { name, email } });
    }
    throw err;
  }
}));

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { errors: [], values: {} });
});

app.post('/login', wrap(async (req, res, next) => {
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';

  const errors = [];
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (errors.length) return res.render('login', { errors, values: { email } });

  const [rows] = await pool.query(
    'SELECT user_id, name, password_hash FROM users WHERE email = ?', [email]);
  const ok = rows.length > 0 && await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) {   // same message for a wrong e-mail and a wrong password
    return res.render('login', { errors: ['Invalid email or password'], values: { email } });
  }
  loginUser(req, rows[0], res, next);
}));

app.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Everything below needs a logged-in user, otherwise go to the login page
app.use((req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
});

// ---------- F2.1 Show both tables ----------
app.get('/', wrap(async (req, res) => {
  const [books] = await pool.query('SELECT * FROM book');
  const [authors] = await pool.query('SELECT * FROM author');
  res.render('index', { books, authors });
}));

// ---------- Authors: add / edit / remove ----------
app.post('/authors/add', upload.single('image'), wrap(async (req, res) => {
  const { name, country } = req.body;
  const image = req.file ? req.file.filename : null;
  await pool.query('INSERT INTO author (name, country, image) VALUES (?, ?, ?)', [name, country, image]);
  res.redirect('/');
}));

app.get('/authors/:id/edit', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM author WHERE author_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).send('Author not found');
  res.render('edit_author', { author: rows[0] });
}));

app.post('/authors/:id/edit', upload.single('image'), wrap(async (req, res) => {
  const { name, country } = req.body;
  if (req.file) {
    await pool.query('UPDATE author SET name = ?, country = ?, image = ? WHERE author_id = ?',
      [name, country, req.file.filename, req.params.id]);
  } else {
    await pool.query('UPDATE author SET name = ?, country = ? WHERE author_id = ?',
      [name, country, req.params.id]);
  }
  res.redirect('/');
}));

// ON DELETE CASCADE in the database removes the author's books too
app.post('/authors/:id/delete', wrap(async (req, res) => {
  await pool.query('DELETE FROM author WHERE author_id = ?', [req.params.id]);
  res.redirect('/');
}));

// ---------- Books: add / edit / remove ----------
app.post('/books/add', upload.single('image'), wrap(async (req, res) => {
  const { title, price, author_id } = req.body;
  const image = req.file ? req.file.filename : null;
  await pool.query('INSERT INTO book (title, price, author_id, image) VALUES (?, ?, ?, ?)',
    [title, price, author_id, image]);
  res.redirect('/');
}));

app.get('/books/:id/edit', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM book WHERE book_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).send('Book not found');
  const [authors] = await pool.query('SELECT * FROM author');
  res.render('edit_book', { book: rows[0], authors });
}));

app.post('/books/:id/edit', upload.single('image'), wrap(async (req, res) => {
  const { title, price, author_id } = req.body;
  if (req.file) {
    await pool.query('UPDATE book SET title = ?, price = ?, author_id = ?, image = ? WHERE book_id = ?',
      [title, price, author_id, req.file.filename, req.params.id]);
  } else {
    await pool.query('UPDATE book SET title = ?, price = ?, author_id = ? WHERE book_id = ?',
      [title, price, author_id, req.params.id]);
  }
  res.redirect('/');
}));

app.post('/books/:id/delete', wrap(async (req, res) => {
  await pool.query('DELETE FROM book WHERE book_id = ?', [req.params.id]);
  res.redirect('/');
}));

// ---------- error page ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`<h2>Error</h2><p>${String(err.sqlMessage || err.message).replace(/</g, '&lt;')}</p><a href="/">Back</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Library website running on http://localhost:${PORT}`));
