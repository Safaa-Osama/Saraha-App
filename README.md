# 📩 Saraha App — Backend RESTful API

[![Node.js Version](https://img.shields.io/badge/Node.js-v20+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/Express-v5.2.1-black.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-In--Memory%20Cache-red.svg?style=for-the-badge&logo=redis)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Upload-blue.svg?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg?style=for-the-badge)](LICENSE)

A robust, enterprise-ready backend RESTful API that simulates the core functionality of the popular anonymous feedback platform **Saraha**. It enables users to create accounts, customize profiles, and receive anonymous feedback and messages without revealing the identity of the senders.

Built with modern Node.js, Express 5, MongoDB, and Redis, featuring layered security architecture (AES-256-GCM encryption, bcrypt hashing, JWT blacklisting, rate limiting, and event-driven email notifications).

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack & Tools](#-tech-stack--tools)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Getting Started](#-installation--getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
  - [Authentication & User Endpoints](#1-authentication--user-endpoints-users)
  - [Message Endpoints](#2-message-endpoints-messages)
  - [System Health](#3-system-health)
- [Security Highlights](#-security-highlights)
- [License & Author](#-license--author)

---

## 🚀 Key Features

### 👤 User Management & Authentication
- **Dual Sign-up Flow**:
  - `sign-up`: Profile registration with single profile picture uploaded directly to **Cloudinary**.
  - `sign-up2`: Profile registration with multiple cover pictures (up to 3 images).
- **Google OAuth2 Single Sign-On (SSO)**: One-click sign-in/up verified via Google Auth Library.
- **Two-Factor OTP Email Verification**: Time-limited 6-digit OTP sent via Nodemailer with custom HTML templates.
- **OTP Brute-Force & Flood Protection**: Redis-backed retry tracking, max attempts lockout (3 attempts), and temporary blocking cooldowns.
- **JWT Authentication with Dual Tokens**: Short-lived Access Tokens (`10m`) and long-lived Refresh Tokens (`1y`).
- **Token Invalidation & Blacklisting**:
  - Single-device logout via JTI revocation stored in Redis cache.
  - Global logout (`?flag=all`) invalidating all existing tokens using a timestamp tracking mechanism (`changeCredential`).
- **Profile Management**: View own profile (cached in Redis), update bio/personal info, update password, and view public shared profiles.
- **Password Recovery**: Secure password reset flow using verified OTP confirmation.

### ✉️ Anonymous Messaging
- **Identity Privacy**: Messages are stored and retrieved without exposing any sender information.
- **Multimedia Attachments**: Senders can attach image files to messages via Multer.
- **Targeted Delivery**: Send messages directly to users via recipient User ID or vanity profile links.
- **Inbox Queries**: Query all messages received by an authenticated user or browse specific user message logs.

### 🛡️ Layered Security Architecture
- **Symmetric Field Encryption**: Sensitive data like phone numbers are encrypted at rest using **AES-256-GCM** with unique IVs and authentication tags.
- **Password Hashing**: Industry-standard **Bcrypt** with configurable salt rounds.
- **DDoS & Rate Limiting**: Global rate limiting via `express-rate-limit` (100 requests per 15-minute window).
- **HTTP Hardening**: Secure HTTP headers powered by `helmet`.
- **CORS Protection**: Origin validation and restriction.
- **Strict Request Validation**: Comprehensive schema validation for `body`, `params`, `query`, and `files` using **Joi**.

### ⚡ Caching & Asynchronous Processing
- **Redis Caching**: High-performance key-value caching for OTP validation, token blacklists, user profiles, and rate limiting counters.
- **Event-Driven Architecture**: Decoupled, non-blocking email delivery utilizing Node.js `EventEmitter`.
- **Multi-Core Clustering**: Production-ready cluster configuration using **PM2** (`-i 0`).

---

## 🛠️ Tech Stack & Tools

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) (ES Modules) | Server-side JavaScript runtime (v20+ / v24) |
| **Framework** | [Express 5](https://expressjs.com/) | Fast, unopinionated web framework for Node.js |
| **Database** | [MongoDB](https://www.mongodb.com/) / [Mongoose 9](https://mongoosejs.com/) | Document-oriented NoSQL database & ODM |
| **In-Memory Store** | [Redis](https://redis.io/) (Upstash / Local) | High-speed cache for OTPs, tokens, and sessions |
| **Authentication** | [jsonwebtoken](https://jwt.io/), [Google Auth](https://github.com/googleapis/google-auth-library-nodejs) | Access/Refresh JWT authentication & Google SSO |
| **Security** | [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [Crypto](https://nodejs.org/api/crypto.html), [Helmet](https://helmetjs.github.io/) | AES-256-GCM encryption, hashing, and header protection |
| **Validation** | [Joi](https://joi.dev/) | Schema description and data validator |
| **File Uploads** | [Multer](https://github.com/expressjs/multer), [Cloudinary](https://cloudinary.com/) | Local disk storage and Cloud-based image management |
| **Mailing Service** | [Nodemailer](https://nodemailer.com/) | Gmail SMTP delivery for verification OTPs |
| **Process Manager** | [PM2](https://pm2.keymetrics.io/) | Production process manager with cluster mode |

---

## 🏛️ Architecture & Design Patterns

The codebase follows a modular, separation-of-concerns pattern:

```
lecture-saraha/
├── config/                         # Environment & application configurations
│   ├── .env.example               # Sample environment configuration template
│   ├── .env.development          # Development variables (git-ignored)
│   ├── .env.production           # Production variables (git-ignored)
│   └── config.service.js          # Centralized configuration loader
├── src/
│   ├── app.controller.js          # Express app bootstrap, global middlewares & routes
│   ├── index.js                   # Application entry point
│   ├── DB/                        # Database connectivity & models
│   │   ├── connection.js          # MongoDB connection handler
│   │   ├── db.services.js         # Generic reusable DB query helpers (CRUD)
│   │   ├── models/                # Mongoose data schemas
│   │   │   ├── user.Model.js      # User schema with virtuals & hooks
│   │   │   ├── message.model.js   # Message schema with user relation
│   │   │   └── invoke.Model.js    # Token invocation schema with TTL indexes
│   │   └── redis/                 # Redis client & caching methods
│   │       ├── redis.connect.js   # Redis client connection setup
│   │       └── redis.services.js  # Redis get/set/del/expire/counter helpers
│   ├── Modules/                   # Feature-based modular structure
│   │   ├── user/                  # User & Auth feature module
│   │   │   ├── user.controller.js # Route definitions & middleware chaining
│   │   │   ├── user.schema.js     # Joi validation rules for user actions
│   │   │   └── user.services.js   # User business logic & controllers
│   │   └── message/               # Anonymous message module
│   │       ├── message.controller.js # Route definitions for messages
│   │       ├── message.schema.js     # Joi validation rules for messages
│   │       └── message.service.js    # Message creation & query controllers
│   └── common/                    # Shared utilities & cross-cutting concerns
│       ├── enum/                  # Application enumerations (roles, providers, mimetypes)
│       ├── middleware/            # Custom Express middlewares (auth, Joi validator, Multer)
│       └── utilis/                # Utilities (crypto, hashing, tokens, Cloudinary, email)
│           ├── emailServices/     # Nodemailer transporter, HTML templates, event emitters
│           └── security/          # AES-256-GCM cipher and bcrypt implementations
├── uploads/                       # Local upload directory for file storage
└── package.json                   # Project metadata, dependencies, and scripts
```

---

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js**: v20.x or higher (Tested on Node 24.11)
- **npm** or **yarn**
- **MongoDB**: Local instance running on port `27017` or a MongoDB Atlas cloud URI
- **Redis**: Local Redis server running on port `6379` or Upstash Redis URL
- **Cloudinary Account**: Cloud name, API key, and API secret (for cloud image storage)
- **Gmail Account**: With an [App Password](https://support.google.com/accounts/answer/185833) configured for sending automated emails

---

## ⚙️ Installation & Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Safaa-Osama/Saraha-App.git
cd Saraha-App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create your environment file under the `config/` directory based on `.env.example`:

For development:
```bash
cp config/.env.example config/.env.development
```

For production:
```bash
cp config/.env.example config/.env.production
```

Fill in your actual credentials in the newly created environment file.

### 4. Run the Application

#### Development Mode (with PM2 Cluster & auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start listening at the configured port (default: `http://localhost:3000`).

---

## 🔐 Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number the HTTP server listens on | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DB_URI` | MongoDB local connection string | `mongodb://127.0.0.1:27017/sarahaApp` |
| `DB_URI_ONLINE` | MongoDB Atlas cloud connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `REDIS_URI` | Redis connection URL | `redis://127.0.0.1:6379` or `rediss://...` |
| `PRIVATE_KEY` | Secret key for signing JWT Access Tokens | `your_jwt_access_secret` |
| `REFRESH_SECRET_KEY` | Secret key for signing JWT Refresh Tokens | `your_jwt_refresh_secret` |
| `PREFIX` | Authorization header bearer prefix | `Bearer` |
| `SALT_ROUND` | Salt rounds for bcrypt password hashing | `10` |
| `CLOUD_NAME` | Cloudinary account cloud name | `your_cloudinary_name` |
| `CLOUD_KEY` | Cloudinary API Key | `your_cloudinary_api_key` |
| `CLOUD_SECRET` | Cloudinary API Secret | `your_cloudinary_api_secret` |
| `CLIENT_ID` | Google OAuth2 client ID for Google SSO | `xxxx.apps.googleusercontent.com` |
| `EMAIL` | Gmail address for sending verification emails | `your_email@gmail.com` |
| `PASS` | 16-character Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `TOEMAIL` | Fallback recipient email address | `recipient@example.com` |
| `ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:3000,http://localhost:5000` |

---

## 📡 API Documentation

### Base URL: `http://localhost:3000`

### 1. Authentication & User Endpoints (`/users`)

| Method | Endpoint | Auth | Description | Payload / Parameters |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/users/sign-up` | No | Register user with single profile picture | Multipart form-data (`userName`, `email`, `password`, `cpassword`, `phone`, `age`, `gender`, `attachment`) |
| `POST` | `/users/sign-up2` | No | Register user with multiple cover pictures | Multipart form-data (`userName`, `email`, `password`, `cpassword`, `phone`, `age`, `gender`, `attachments` up to 3) |
| `POST` | `/users/signup/gmail` | No | Google OAuth2 Single Sign-On | JSON: `{ "idToken": "google_id_token" }` |
| `POST` | `/users/sign-in` | No | User login (returns access & refresh token) | JSON: `{ "email": "...", "password": "..." }` |
| `GET` | `/users/confirm` | No | Verify account email with OTP | JSON: `{ "email": "...", "otp": "123456" }` |
| `GET` | `/users/resend` | No | Resend email verification OTP | JSON: `{ "email": "..." }` |
| `GET` | `/users/refreshToken` | Refresh | Issue new Access Token | Headers: `Authorization: Bearer <refreshToken>` |
| `GET` | `/users/logOut` | Bearer | Invalidate session (single or `?flag=all`) | Headers: `Authorization: Bearer <accessToken>` |
| `GET` | `/users/profile` | Bearer | Retrieve authenticated user's profile | Headers: `Authorization: Bearer <accessToken>` |
| `PATCH` | `/users/profile` | Bearer | Update user profile details | JSON: `{ "firstName", "lastName", "phone", "gender" }` |
| `PATCH` | `/users/profile/password` | Bearer | Change user password | JSON: `{ "oldPassword", "newPassword", "confirmPassword" }` |
| `PATCH` | `/users/profile/forget` | No | Request password reset OTP | JSON: `{ "email": "..." }` |
| `PATCH` | `/users/profile/reset` | No | Reset password using OTP | JSON: `{ "email", "otp", "password", "cpassword" }` |
| `GET` | `/users/profile/:id` | No | View public profile by user ID | Params: `id` (ObjectId) |
| `GET` | `/users` | No | Fetch list of users (public summary) | None |

### 2. Message Endpoints (`/messages`)

| Method | Endpoint | Auth | Description | Payload / Parameters |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/messages/send` | No | Send anonymous message to a user | Multipart form-data (`content`, `userId`, optional `attachments` up to 3) |
| `GET` | `/messages` | No | Retrieve all messages in system | None |
| `GET` | `/messages/userId/messages` | No | Retrieve messages received by specified user | Route params |
| `USE` | `/users/:userId/messages` | No | Nested router for user's messages | Forwarded to message router |

### 3. System Health

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | No | Application welcome & health status check |

---

## 🔒 Security Highlights

1. **AES-256-GCM Field-Level Encryption**:
   - User phone numbers are never stored in plain text.
   - Encrypted with AES-256-GCM using an authenticated tag and dynamic initialization vector (IV) to prevent cryptographic replay attacks.
2. **Token Blacklisting & Revocation**:
   - Every issued JWT contains a unique UUID `jti` claim.
   - On user logout, the token is stored in Redis with an expiration matching the token's remaining lifetime.
   - Any subsequent requests presenting that revoked token are immediately rejected.
3. **Password Change Invalidation**:
   - The user schema maintains a `changeCredential` timestamp.
   - Any token issued before a password change is automatically treated as invalid.
4. **Brute-Force & OTP Flooding Protection**:
   - Email verification OTPs expire in 3 minutes.
   - Maximum of 3 attempts before temporary blockout via Redis keys (`otp::<email>::max_tries`, `otp::<email>::blocked`).
5. **Rate Limiting & Headers**:
   - `express-rate-limit` prevents brute-force attempts.
   - `helmet` adds strict HTTP response headers against cross-site scripting (XSS), clickjacking, and mime sniffing.

---

## 📜 Available NPM Scripts

```bash
# Run in development mode with PM2 cluster mode
npm run dev

# Run in production mode
npm start
```

---

## 👤 Author

- **Safaa Osama** — [@Safaa-Osama](https://github.com/Safaa-Osama)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
