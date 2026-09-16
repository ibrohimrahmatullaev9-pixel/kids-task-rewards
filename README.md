# 👨‍👧‍👦 Kids Task Rewards

Приложение для управления задачами между родителями и детьми с системой кредитов и очков.

## 🎯 Функционал

### Для Родителя:
- ✅ Регистрация и вход
- ✅ Создание задач для детей
- ✅ Управление задачами
- ✅ Просмотр прогресса ребёнка
- ✅ Добавление бонусных очков
- ✅ Уникальный код для подключения детей

### Для Ребёнка:
- ✅ Регистрация и вход
- ✅ Ввод кода родителя для подключения
- ✅ Просмотр своих задач
- ✅ Отметить задачу как выполненную
- ✅ Просмотр своих очков и статистики

## 🚀 Установка и запуск

### Требования
- Node.js (v14 или выше)
- MongoDB (локально или MongoDB Atlas)
- npm или yarn

### Шаги установки

1. Клонируем репозиторий:
```bash
git clone https://github.com/ibrohimrahmatullaev9-pixel/kids-task-rewards.git
cd kids-task-rewards
```

2. Устанавливаем зависимости backend:
```bash
npm install
```

3. Устанавливаем зависимости frontend:
```bash
cd client
npm install
cd ..
```

4. Создаём файл `.env`:
```bash
cp .env.example .env
```

5. Редактируем `.env` и добавляем свои значения:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kids-tasks
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

6. Запускаем MongoDB (если локально):
```bash
mongod
```

7. Запускаем Backend:
```bash
npm run dev
```

8. В новом терминале запускаем Frontend:
```bash
cd client
npm start
```

## 📂 Структура проекта

```
kids-task-rewards/
├── server.js              # Главный файл backend
├── package.json           # Зависимости
├── .env                   # Переменные окружения
├── models/                # Модели данных
│   ├── User.js
│   ├── Task.js
│   └── Credit.js
├── routes/                # API endpoints
│   ├── auth.js
│   ├── tasks.js
│   ├── credits.js
│   └── parent.js
├── middleware/            # Middleware
│   └── auth.js
└── client/                # React приложение
    ├── src/
    ├── public/
    └── package.json
```

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/connect-child` - Подключить ребёнка по коду

### Задачи
- `POST /api/tasks/create` - Создать задачу (родитель)
- `GET /api/tasks/parent-tasks` - Задачи родителя
- `GET /api/tasks/child-tasks` - Задачи ребёнка
- `POST /api/tasks/complete/:taskId` - Выполнить задачу

### Кредиты
- `GET /api/credits/balance` - Баланс кредитов
- `GET /api/credits/history/:childId` - История кредитов
- `POST /api/credits/add-bonus` - Добавить бонус

### Родитель
- `GET /api/parent/children` - Список детей
- `GET /api/parent/child-stats/:childId` - Статистика ребёнка
- `DELETE /api/parent/task/:taskId` - Удалить задачу

## 🔐 Безопасность

- Пароли хешируются с помощью bcryptjs
- Аутентификация через JWT токены
- Защита API endpoints через middleware

## 📝 Лицензия

MIT
