## 🔹 Описание
- JSON.stringify(value, replacer, space)
  value — объект, который нужно сериализовать (users)
  replacer — можно указать массив или функцию для фильтрации ключей (здесь null, значит все ключи включаются)
  space — отвечает за отступы в итоговом JSON (делает его читаемым)
- Клиентская часть (Vue):
```
downloadUsers () {
  window.open('http://localhost:3000/download/users')
}
```
Это метод, который вызывается при нажатии кнопки "Скачать пользователей". Он открывает новую вкладку или окно браузера.

- Серверная часть (Express):
```
app.get('/download/users', (req, res) => {
  res.download(FILE_PATH, 'users.json')
})
```
Когда происходит GET-запрос на /download/users, сервер:

Находит файл по пути FILE_PATH (например, ./data/users.json);

Отправляет его пользователю;

Принуждает браузер скачать файл, а не отобразить его в окне;

Файл будет сохранён на диск с именем users.json, даже если оригинальное имя другое.

## 🔹 Установка
### Установка все зависимости в файл указанные в `package.json`.
```
npm install
```

### Запуск локального сервера
```
npm run serve
```

### Компиляция и минификация для продакшена
```
npm run build
```
