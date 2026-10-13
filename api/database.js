const Database = require('better-sqlite3');
const path = require('path');

// Создаём подключение к базе данных
const db = new Database(path.join(__dirname, 'database.db'));

// Создаём таблицу сотрудников SQL
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    birth_date TEXT,
    passport TEXT,
    phone TEXT,
    address TEXT,
    department TEXT,
    position TEXT,
    salary INTEGER,
    hire_date TEXT,
    is_fired INTEGER DEFAULT 0
  )
`);

module.exports = db;