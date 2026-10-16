# Природні мандри — Backend

## Запуск

1. Встановіть залежності:

```powershell
npm ci
```

2. Якщо `.env` ще немає, створіть його:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

3. У `.env` задайте:

```dotenv
MONGODB_URL="ваш персональний рядок підключення"
PORT=3000
CORS_ORIGINS=http://localhost:3001
```

Рядок підключення та персональні дані доступу отримайте у тімліда. Перед підключенням передайте тімліду свою публічну IP-адресу для додавання в MongoDB Atlas.

4. Запустіть сервер:

```powershell
npm run dev
```

Успішний запуск:

```text
Connected to MongoDB
Server is running on http://localhost:3000
```

API: `http://localhost:3000/api`. Контролери поки повертають `501` — це очікувано до реалізації задач.

**Не додавайте `.env` та паролі до Git.**