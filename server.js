const express = require('express')
/* встроенный в Node.js модуль fs (сокращение от File System), который позволяет работать с файловой системой: читать, записывать, удалять и изменять файлы */
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const FILE_PATH = './json/users.json'
const ROLES_PATH = './json/roles.json'

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.post('/users', (req, res) => {
  // Читаем текущих пользователей
  let users = []
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, 'utf-8')
    if (data.trim() !== '') {
      users = JSON.parse(data)
    }
  }

  // Находим максимальный ID и увеличиваем его на 1
  const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0
  const newUser = {
    id: maxId + 1,
    name: req.body.name,
    email: req.body.email,
    roleId: parseInt(req.body.roleId)
  }

  // Добавляем и сохраняем
  users.push(newUser)
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2))
  /*
  JSON.stringify(value, replacer, space)
  value — объект, который нужно сериализовать (users)
  replacer — можно указать массив или функцию для фильтрации ключей (здесь null, значит все ключи включаются)
  space — отвечает за отступы в итоговом JSON (делает его читаемым)
  */

  res.status(201).json({ message: 'Пользователь добавлен', user: newUser })
})

app.get('/download/users', (req, res) => {
  res.download(FILE_PATH, 'users.json')
})

app.get('/roles', (req, res) => {
  const rolesData = fs.readFileSync(ROLES_PATH, 'utf-8')
  const roles = JSON.parse(rolesData)
  res.json(roles)
})

app.get('/users', (req, res) => {
  const usersData = fs.readFileSync(FILE_PATH, 'utf-8')
  const rolesData = fs.readFileSync(ROLES_PATH, 'utf-8')

  const users = JSON.parse(usersData)
  const roles = JSON.parse(rolesData)

  const usersWithRoleName = users.map(user => {
    const role = roles.find(r => r.id === user.roleId)
    return {
      ...user,
      role: role ? role.name : 'Неизвестно'
    }
  })

  res.json(usersWithRoleName)
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
