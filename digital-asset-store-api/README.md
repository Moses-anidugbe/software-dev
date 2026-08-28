# Digital Asset Store API

A RESTful API for a digital marketplace where **Sellers** can list digital products and **Buyers** can browse and purchase them.

This project was built to practice backend development concepts including REST API design, PostgreSQL, JWT authentication, password hashing, middleware, and Role-Based Access Control (RBAC).

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-Based Access Control (RBAC)
- Seller product management
- Product browsing
- Product purchasing
- PostgreSQL database
- Parameterized SQL queries
- Environment variable configuration
- Foreign-key relationships between users, products, and purchases

## Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **pg** — PostgreSQL client for Node.js
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication
- **dotenv** — Environment variable management

## How It Works

The API has two main user roles:

### Seller

Sellers can create and manage their digital products.

A product belongs to the seller who created it through the `seller_id` foreign key.

### Buyer

Buyers can browse available products and purchase them.

When a buyer purchases a product, the API creates a record in the `purchases` table linking the authenticated buyer to the product.

The buyer's ID is obtained from the authenticated JWT rather than being supplied by the client.

For example:

```js
const result = await client.query(
  "INSERT INTO purchases (buyer_id, product_id) VALUES ($1, $2) RETURNING *",
  [req.user.id, id],
);
```

Here:

- `req.user.id` is the authenticated user's ID.
- `id` is the product ID from the request.
- PostgreSQL creates the purchase record and automatically sets `purchased_at`.

## Authentication & Authorization

The API uses **JSON Web Tokens (JWT)** for authentication.

After logging in, a user receives a token that must be included when accessing protected routes:

```http
Authorization: Bearer <token>
```

The authentication middleware verifies the token and attaches the user's information to the request:

```js
req.user;
```

This allows protected routes to access information such as:

```js
req.user.id;
req.user.role;
```

Role-based authorization then determines whether the authenticated user is allowed to perform a particular action.

For example, seller-only operations can be protected with role-based middleware so that buyers cannot create or manage products.

## Database Schema

The database contains three main tables:

```text
users
  │
  ├──── products
  │
  └──── purchases ──── products
```

### Users

Stores registered users.

```text
id
email
password_hash
role
```

The `role` determines whether the user is a buyer or seller.

### Products

Stores the digital products listed on the marketplace.

```text
id
seller_id
title
price
download_url
```

`seller_id` references the user who created the product.

### Purchases

Stores records of products purchased by buyers.

```text
id
buyer_id
product_id
purchased_at
```

`buyer_id` references the purchasing user, while `product_id` references the purchased product.

The foreign-key constraints ensure that purchases cannot reference users or products that don't exist.

## API Endpoints

All endpoints are mounted under `/api`.

### Authentication

| Method | Endpoint             | Description                            | Access |
| ------ | -------------------- | -------------------------------------- | ------ |
| POST   | `/api/auth/signup`   | Register a new user (`buyer`/`seller`) | Public |
| POST   | `/api/auth/register` | Alias for user registration            | Public |
| POST   | `/api/auth/login`    | Authenticate a user and receive a JWT  | Public |

### Products

| Method | Endpoint                     | Description                      | Access |
| ------ | ---------------------------- | -------------------------------- | ------ |
| GET    | `/api/products`              | List available products (public) | Public |
| GET    | `/api/products/:id`          | Get product details by ID        | Public |
| POST   | `/api/products`              | Create a digital product listing | Seller |
| POST   | `/api/products/:id/buy`      | Purchase a product               | Buyer  |
| POST   | `/api/products/:id/purchase` | Purchase a product (alias)       | Buyer  |

### Purchases

| Method | Endpoint             | Description                          | Access |
| ------ | -------------------- | ------------------------------------ | ------ |
| GET    | `/api/purchases`     | Get authenticated buyer purchase log | Buyer  |
| POST   | `/api/purchases/:id` | Purchase product by ID               | Buyer  |

## Project Structure

```text
digital-asset-store-api/
├── src/
│   ├── config/
│   │   ├── env.js                # Environment variables & configuration
│   │   └── db.js                 # PostgreSQL connection pool (pg.Pool)
│   │
│   ├── controllers/              # HTTP request/response controllers
│   │   ├── auth.controller.js
│   │   ├── products.controller.js
│   │   └── purchases.controller.js
│   │
│   ├── services/                 # Business logic and database operations
│   │   ├── auth.service.js
│   │   ├── products.service.js
│   │   └── purchases.service.js
│   │
│   ├── middleware/               # Express middleware
│   │   ├── authenticateToken.js  # JWT authentication
│   │   ├── requireRole.js        # Role-based access control (RBAC)
│   │   ├── validate.js           # Generic validator runner
│   │   └── errorHandler.js       # Centralized error handler
│   │
│   ├── validators/               # Input validation logic
│   │   ├── auth.validator.js
│   │   └── product.validator.js
│   │
│   ├── routes/                   # Route definitions
│   │   ├── index.js              # Master API router (/api)
│   │   ├── auth.routes.js
│   │   ├── products.routes.js
│   │   └── purchases.routes.js
│   │
│   ├── utils/
│   │   └── AppError.js           # Operational error class
│   │
│   ├── app.js                    # Express app configuration & middleware
│   └── server.js                 # HTTP server bootstrap & DB connection
│
├── .env.example
├── schema.sql
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Moses-anidugbe/backend-projects.git
```

Navigate to the project:

```bash
cd backend-projects/digital-asset-store-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file containing the required environment variables.

For example:

```env
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

Use your own database credentials and JWT secret.

Do not commit your `.env` file to GitHub.

### 4. Set up PostgreSQL

Create a PostgreSQL database and run the project's schema:

```bash
psql -U postgres -d your_database -f schema.sql
```

This creates the required tables and relationships.

### 5. Start the server

For development:

```bash
npm run dev
```

Or start the application normally:

```bash
npm start
```

The API will run on the port specified in your environment variables.

## Security

The API implements several security practices:

- Passwords are hashed with bcrypt before being stored.
- JWTs are used for authentication.
- Protected routes require authentication.
- Role-Based Access Control restricts actions based on user roles.
- SQL queries use parameterized values.
- Database foreign keys enforce valid relationships.
- Sensitive configuration is stored in environment variables.
- The authenticated user's ID is obtained from the JWT rather than trusting a user-supplied ID.

## Database Relationships

The relationships between the tables can be summarized as:

```text
users
  │
  │  seller_id
  ▼
products
  │
  │  product_id
  ▼
purchases
  ▲
  │  buyer_id
  │
users
```

A user can create multiple products as a seller.

A user can also make multiple purchases as a buyer.

Each purchase connects one buyer with one product.

## Future Improvements

Possible improvements for the project include:

- Shopping cart functionality
- Purchase history
- Download authorization for purchased products
- Product search and filtering
- Pagination
- Product categories
- Payment integration
- Seller statistics/dashboard
- Automated API testing
- Input validation improvements
- API documentation with Swagger/OpenAPI
- Refresh tokens
- Preventing duplicate purchases of the same product

## Purpose

This project was built as a backend development project to gain practical experience with building a multi-user REST API.

It combines several backend concepts into one application:

- REST API design
- Node.js and Express
- PostgreSQL
- Relational database design
- Authentication
- JWT
- Password hashing
- Middleware
- Role-Based Access Control
- Foreign keys
- Parameterized SQL queries
- Environment variables
