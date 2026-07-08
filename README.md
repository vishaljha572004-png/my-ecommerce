# 🛒 Grocery E-Commerce Backend

Node.js + Express + MongoDB + Redis

## Tech Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache / Queue**: Redis (ioredis + BullMQ)
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Joi
- **Testing**: Jest + Supertest

---

## Quick Start

### 1. Clone karo aur dependencies install karo
```bash
git clone <repo-url>
cd grocery-ecommerce
npm install
```

### 2. Environment variables setup karo
```bash
cp .env.example .env
# .env file mein apni values fill karo
```

### 3. Docker se MongoDB + Redis start karo
```bash
docker-compose up -d

# GUIs:
# Mongo Express  → http://localhost:8081
# Redis Commander → http://localhost:8082
```

### 4. Server start karo
```bash
npm run dev        # development (nodemon)
npm start          # production
```

### 5. Health check
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "success": true,
  "status": "healthy",
  "services": { "mongo": "connected", "redis": "connected" }
}
```

---

## Project Structure

```
src/
├── config/          # MongoDB, Redis, env validation
├── models/          # Mongoose schemas (Day 2+)
├── modules/         # Feature modules (auth, products, cart...)
├── cache/           # Redis cache service + keys + middleware
├── queues/          # BullMQ queue definitions
├── workers/         # BullMQ job processors (Day 14)
└── common/          # Errors, middleware, utils
```

## 15-Day Build Plan

| Day | Feature |
|-----|---------|
| 1 | ✅ Project setup, MongoDB + Redis connect |
| 2 | User model + Registration |
| 3 | Auth — JWT + Redis sessions |
| 4 | Rate limiter + User profile APIs |
| 5 | Category + Product models |
| 6 | Product APIs + Caching |
| 7 | Search + Autocomplete |
| 8 | Cart — full Redis implementation |
| 9 | Inventory — Redis atomic ops |
| 10 | Delivery slots + Slot locking |
| 11 | Orders + Checkout flow |
| 12 | Payments + Webhook |
| 13 | Promotions + Coupons |
| 14 | BullMQ workers + Notifications |
| 15 | Testing + Deploy prep |
