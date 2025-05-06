[![CodeFactor](https://www.codefactor.io/repository/github/jarkkokarki/web-project-backend/badge)](https://www.codefactor.io/repository/github/jarkkokarki/web-project-backend)
<br>
[API](https://10.120.32.87/app)
<br>
[DOC](https://jarkkokarki.github.io/Web-Project-Backend/)

# Web-Project-Backend

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Main Endpoints](#main-endpoints)
- [Testing the API](#testing-the-api)
- [License](#license)

---

## Overview

This is a Node.js/Express backend for a web application providing a RESTful API for user management, authentication, menu management, orders, reservations, Stripe payments, contact messages, and route calculations (Digitransit API). It supports multi-language menu items, JWT authentication, and secure payment processing.

---

## Features

- User registration, login, profile management, and authentication (JWT)
- Admin and user roles with access control
- Menu management (CRUD, categories, diets, images)
- Order management (create, update, view, user-specific and admin/employee)
- Reservation system with table availability checks
- Stripe payment integration for orders
- Contact form/message management
- Route and leg calculation using Digitransit API
- RESTful API with detailed documentation (apidoc, jsdoc)
- File upload support (user profile pictures, menu images)
- Multi-language support for menu items (English, Finnish)
- Environment-based configuration

---

## Tech Stack

- Node.js
- Express.js
- MySQL (mysql2)
- JWT (jsonwebtoken)
- Stripe API
- Multer (file uploads)
- Sharp (image processing)
- dotenv
- apidoc & jsdoc (documentation)
- Digitransit API (route/leg calculations)
- CORS

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/JarkkoKarki/Web-Project-Backend.git
```

### 2. Navigate to the Project Directory

```sh
cd Web-Project-Backend
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Edit .env and set:

DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET=your_jwt_secret
DIGITRANSIT_SUBSCRIPTION_KEY=your_digitransit_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

### 5. Start the Development Server

```sh
npm run dev
```

The server will run at http://127.0.0.1:3000.

---

### Scripts

```sh
npm start
```

— Start the server

```sh
npm run dev
```

— Start the server with nodemon (auto-restart on changes)

```sh
npm run docs
```

— Generate JSDoc documentation

```sh
npm run generate-docs
```

— Generate API documentation with apidoc (if configured)

```sh
npm run deploy-docs
```

— Build and deploy documentation to GitHub Pages

---

### API Documentation

API Docs:
http://localhost:3000/apidoc (after running npx apidoc -i src/ -o public/apidoc/)

HTML API endpoints:
http://localhost:3000/

---

### Project Structure

Web-Project-Backend/
├── apidoc/ # Generated API documentation (do not edit manually)
├── public/ # Static files, images, apidoc, HTML docs
├── src/
│ ├── app.js # Express app setup
│ ├── index.js # Server entry point
│ ├── api/
│ │ ├── controllers/ # Route controllers (business logic)
│ │ ├── models/ # Database models
│ │ ├── routes/ # Express routers for each resource
│ │ ├── middlewares/ # Custom middleware (auth, file upload, etc.)
│ │ └── index.js # API router
│ ├── rest/ # REST client test files (for VSCode REST Client)
│ └── utils/ # Utility modules (database, helpers)
├── uploads/ # Uploaded images (user/menu)
├── .env # Environment variables (not committed)
├── .env.sample # Sample env file
├── package.json
├── README.md

---

### Main Endpoints

#### Users

- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create user (JSON or multipart/form-data for profile picture)
- `PUT /api/users/:id` — Update user (auth required)
- `DELETE /api/users/:id` — Delete user (auth required)

#### Auth

- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Get current user info (auth required)
- `POST /api/auth/register` — Register admin (admin only)
- `GET /api/auth/logout` — Logout

#### Menu

- `GET /api/menu` — Get all menu items (both languages)
- `GET /api/menu/products/:lang` — Get menu items by language
- `GET /api/menu/products/:id` — Get menu item by ID
- `POST /api/menu` — Add menu item (admin only, file upload)
- `PUT /api/menu/:id` — Update menu item (admin only)
- `DELETE /api/menu/:id` — Delete menu item (admin only)

#### Orders

- `GET /api/orders/:lang` — List all orders (admin/employee)
- `GET /api/orders/myorders/:lang` — List my orders (auth required)
- `POST /api/orders` — Create order (auth required)
- `PUT /api/orders/:id` — Update order (admin/employee)

#### Reservations

- `GET /api/reservations` — List all reservations
- `POST /api/reservations/reserve` — Create reservation
- `GET /api/reservations/:id` — Get reservations by user ID
- `DELETE /api/reservations/:reservationId` — Delete reservation (auth required)

#### Payments

- `POST /api/payment/create-checkout-session` — Create Stripe checkout session

#### Contact

- `POST /api/contact` — Send contact message
- `GET /api/contact` — List all contact messages
- `DELETE /api/contact/:id` — Delete contact message

#### Route

- `GET /api/route/:olat/:olng/:lat/:lng` — Get route data (Digitransit)
- `GET /api/route/legs/:olat/:olng/:lat/:lng` — Get route legs data

---

### Testing the API

- Use the provided `.rest` files in `src/rest/` with the [VSCode REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
- Or use Postman, Insomnia, or cURL.
- Example requests and responses are available in `public/html/document.html`.

---

### Environment Variables

Copy `.env.sample` to `.env` and fill in your credentials:

```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
DIGITRANSIT_SUBSCRIPTION_KEY=your_digitransit_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---
