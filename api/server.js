// Подключаем инструменты
const express = require('express')
const cors = require('cors')
const db = require('./database')

// Создаем сервер
const app = express()
const PORT = 3000

// Разрешаем серверу понимать JSON и обращения из браузера
app.use(cors())
app.use(express.json())

// Отдаём файлы из папки public (наш HTML/CSS)
app.use(express.static('../public'))

// Маршруты

// GET /api/employees - получить всех сотрудников
app.get('/api/employees', (req, res) => {
  const { department, position, search } = req.query
  
  let query = 'SELECT * FROM employees WHERE 1=1'
  const params = []

  if (department) {
    query += ' AND department = ?'
    params.push(department)
  }
  if (position) {
    query += ' AND position = ?'
    params.push(position)
  }
  if (search) {
    query += ' AND (last_name LIKE ? OR first_name LIKE ? OR middle_name LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const employees = db.prepare(query).all(...params)
  res.json(employees)
})

// POST /api/employees - создать сотрудника
app.post('/api/employees', (req, res) => {
  const { last_name, first_name, middle_name, birth_date, passport, 
          phone, address, department, position, salary, hire_date } = req.body

  const result = db.prepare(`
    INSERT INTO employees 
    (last_name, first_name, middle_name, birth_date, passport, phone, address, department, position, salary, hire_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(last_name, first_name, middle_name, birth_date, passport, phone, address, department, position, salary, hire_date)

  res.json({ id: result.lastInsertRowid, message: 'Сотрудник создан' })
})

// PUT /api/employees/:id - редактировать сотрудника
app.put('/api/employees/:id', (req, res) => {
  const { last_name, first_name, middle_name, birth_date, passport,
          phone, address, department, position, salary, hire_date } = req.body

  db.prepare(`
    UPDATE employees SET
    last_name=?, first_name=?, middle_name=?, birth_date=?, passport=?,
    phone=?, address=?, department=?, position=?, salary=?, hire_date=?
    WHERE id=? AND is_fired=0
  `).run(last_name, first_name, middle_name, birth_date, passport, phone, address, department, position, salary, hire_date, req.params.id)

  res.json({ message: 'Сотрудник обновлён' })
})

// PATCH /api/employees/:id/fire - уволить сотрудника
app.patch('/api/employees/:id/fire', (req, res) => {
  db.prepare('UPDATE employees SET is_fired=1 WHERE id=?').run(req.params.id)
  res.json({ message: 'Сотрудник уволен' })
})

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`)
})