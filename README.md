# Digital Marketplace — Project Setup

## Requirements

- Docker & Docker Compose **or**:
  - Node.js (v18+)
  - npm (v9+)
  - PHP (8.1+)
  - Composer
  - MySQL or PostgreSQL

---

## 1. Running with Docker (Recommended)

### 1.1. Clone the repository

```bash
git clone <repo-url>
cd codemotion-test
```

### 1.2. Start containers

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### 1.3. Initialize the database

In a new terminal:

```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## 2. Local Development (without Docker)

### 2.1. Backend (Laravel) (optional*)

```bash
cd backend
composer install
cp .env.example .env
# Set up your DB credentials in .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### 2.2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 3. Default Users

After seeding, you will have 3 users:

- user1@example.com / password
- user2@example.com / password
- user3@example.com / password

Each user:
- Balance: $5000.00
- 3 unique items

---


## 4. Notes

- All data will be reset if you run seeding with the `--fresh` key.
- To change ports or environment variables, edit the `.env` files in backend and frontend.
- For any issues, check the logs in the respective containers or development servers. 