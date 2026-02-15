# 🔐 Backend Authentication Service

A production-ready authentication API built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**. Features JWT access tokens, secure refresh token rotation, rate limiting, and a full CI/CD pipeline.

## ✨ Features

- User signup & login with bcrypt password hashing
- JWT access tokens (short-lived) + refresh token rotation (httpOnly cookies)
- Token versioning for force-logout across all devices
- Rate limiting on login endpoint
- Security headers via Helmet
- Dockerized with multi-stage builds
- CI/CD with GitHub Actions (lint → test → security scan → deploy)

## 🛠️ Tech Stack

| Layer     | Technology                             |
| --------- | -------------------------------------- |
| Runtime   | Node.js 20                             |
| Framework | Express.js                             |
| Database  | MySQL 8                                |
| ORM       | Prisma (MariaDB adapter)               |
| Auth      | JWT + bcryptjs                         |
| DevOps    | Docker, Docker Compose, GitHub Actions |
| Quality   | ESLint, Jest                           |

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

```bash
git clone https://github.com/shounaksarker/backend-authenication.git
cd backend-authenication
```

### 2. Configure Environment Variables

Copy the example env file and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5100
NODE_ENV=development

DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=authdb
DATABASE_URL=mysql://root:your_secure_password@db:3306/authdb

JWT_ACCESS_SECRET=your_jwt_secret_here
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

> ⚠️ **Important:** Replace `your_secure_password` and `your_jwt_secret_here` with strong, unique values.

### 3. Start with Docker Compose

```bash
docker compose up --build -d
```

This will:

1. Pull the MySQL 8 image
2. Build the Node.js application image (multi-stage)
3. Start the database container and wait until it's healthy
4. Run Prisma migrations automatically
5. Start the application server on port **5100**

### 4. Verify It's Running

```bash
curl http://localhost:5100/health
```

Expected response:

```json
{
  "status": "ok",
  "uptime": 5.123
}
```

## 📡 API Endpoints

| Method | Endpoint               | Auth      | Description              |
| ------ | ---------------------- | --------- | ------------------------ |
| `POST` | `/api/v1/auth/signup`  | ❌        | Register a new user      |
| `POST` | `/api/v1/auth/login`   | ❌        | Login & receive tokens   |
| `GET`  | `/api/v1/auth/me`      | ✅ Bearer | Get current user profile |
| `POST` | `/api/v1/auth/refresh` | 🍪 Cookie | Refresh access token     |
| `POST` | `/api/v1/auth/logout`  | 🍪 Cookie | Logout & revoke token    |
| `GET`  | `/health`              | ❌        | Health check             |

### Quick Test

```bash
# Signup
curl -X POST http://localhost:5100/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "MyStr0ngP@ss"}'

# Login
curl -X POST http://localhost:5100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "MyStr0ngP@ss"}' \
  -c cookies.txt

# Get Profile (use the accessToken from login response)
curl http://localhost:5100/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up --build -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Stop and remove all data (⚠️ deletes database)
docker compose down -v

# Rebuild after code changes
docker compose up --build -d
```

## 🧑‍💻 Local Development (without Docker)

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 📚 Documentation

See [auth-service-bangla-docs.md](./auth-service-bangla-docs.md) for comprehensive line-by-line documentation in Bangla covering all 16 chapters — from project structure to Docker & CI/CD.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
