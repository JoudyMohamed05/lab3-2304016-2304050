const mysql = require('mysql2/promise');

// Change these values (or set environment variables) to match your MySQL.
module.exports = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library',
});
