# E-Learning Platform

Một nền tảng E‑Learning hỗ trợ quản lý khóa học, lớp học trực tuyến (Jitsi), lưu trữ media (AWS S3) và tối ưu hiệu năng bằng Redis. Dự án được xây dựng theo kiến trúc Frontend–Backend tách biệt, dễ mở rộng và triển khai.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Frontend](#frontend)

  * [Environment Variables](#frontend-environment-variables)
  * [Run Frontend](#run-frontend)
* [Backend](#backend)

  * [Requirements](#backend-requirements)
  * [Environment Variables](#backend-environment-variables)
  * [Run Backend](#run-backend)
* [Notes](#notes)
* [Security](#security)
* [Future Improvements](#future-improvements)

---

## Overview

Hệ thống E‑Learning cung cấp các chức năng chính:

* Quản lý khóa học, lớp học và bài giảng
* Lớp học trực tuyến theo thời gian thực với **Jitsi**
* Upload và phát media thông qua **AWS S3**
* Xác thực và phân quyền bằng **JWT**
* Tối ưu hiệu năng bằng **Redis cache**

---

## Tech Stack

**Frontend**

* React + Vite
* TypeScript
* SCSS / CSS Modules

**Backend**

* Node.js + Express
* MongoDB (Mongoose)
* Redis
* JWT Authentication

**Third‑party Services**

* Jitsi (Live Class)
* AWS S3 (Media Storage)

---

## Project Structure

```text
root
├── frontend/        # Client application (React)
└── backend/         # Server application (Node.js)
```

---

## Frontend

### Frontend Environment Variables

Tạo file `.env` tại thư mục **frontend root**:

```env
VITE_API_URL=http://localhost:5000/api
```

> Frontend sẽ sử dụng biến `VITE_API_URL` để giao tiếp với backend API.

### Run Frontend

```bash
npm install
npm run dev
```

---

## Backend

### Backend Requirements

* Node.js (>= 18 recommended)
* MongoDB (local hoặc MongoDB Atlas)
* Redis (local hoặc remote)

---

### Backend Environment Variables

Tạo file `.env` tại thư mục **backend root**:

```env
# =========================
# Server
# =========================
PORT=5000
NODE_ENV=development

# =========================
# Database (MongoDB)
# =========================
MONGO_URI=mongodb://127.0.0.1:27017/e_learning-DATN
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>

# =========================
# JWT Authentication
# =========================
JWT_SECRET=your_access_token_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_ACCESS_TOKEN_EXPIRES=1d
JWT_REFRESH_TOKEN_EXPIRES=7d

# =========================
# Jitsi (Live Class)
# =========================
JITSI_SECRET=your_jitsi_secret
JITSI_APP_ID=your_jitsi_app_id
JITSI_DOMAIN=your_jitsi_domain

# =========================
# AWS S3 (Media Storage)
# =========================
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_BUCKET_NAME=your_bucket_name
AWS_EXPIRES_IN=900
AWS_PUBLIC_URL=https://your-public-bucket-url

# =========================
# Redis (Cache / Queue)
# =========================
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=RedisPasswordExample
```

---

### Run Backend

```bash
npm install
npm run dev
```

---

## Notes

* Backend chạy mặc định tại **port 5000**
* MongoDB và Redis **phải được khởi động trước** khi chạy backend
* Redis được sử dụng cho:

  * Cache dữ liệu
  * Giảm tải cho database
* AWS S3 dùng để:

  * Lưu trữ video bài giảng
  * Upload tài liệu học tập
* Jitsi dùng cho:

  * Lớp học trực tuyến (Live Class)

---

## Security

⚠️ **Lưu ý bảo mật**:

* Không commit file `.env` hoặc secret thật lên Git
* Thêm `.env` vào `.gitignore`
* Chỉ sử dụng placeholder khi public source code

---

## Future Improvements

* Docker & Docker Compose cho môi trường development/production
* CI/CD pipeline
* Monitoring & Logging (Prometheus, Grafana)
* Phân quyền chi tiết hơn (RBAC)

---

© E‑Learning Platform
