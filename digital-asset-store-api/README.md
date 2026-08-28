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

### Authentication

| Method | Endpoint         | Description                           | Access |
| ------ | ---------------- | ------------------------------------- | ------ |
| POST   | `/auth/register` | Register a new user                   | Public |
| POST   | `/auth/login`    | Authenticate a user and receive a JWT | Public |

### Products

| Method | Endpoint        | Description            | Access |
| ------ | --------------- | ---------------------- | ------ |
| GET    | `/products`     | Get available products | Public |
| GET    | `/products/:id` | Get a specific product | Public |
| POST   | `/products`     | Create a product       | Seller |
| PATCH  | `/products/:id` | Update a product       | Seller |
| DELETE | `/products/:id` | Delete a product       | Seller |

### Purchases

| Method | Endpoint                 | Description        | Access |
| ------ | ------------------------ | ------------------ | ------ |
| POST   | `/products/:id/purchase` | Purchase a product | Buyer  |

## Example Purchase Request

An authenticated buyer can purchase a product by sending:

```http
POST /products/7/purchase
Authorization: Bearer <token>
```

The `7` represents the product ID.

The API gets the buyer's ID from the authenticated request:

```js
req.user.id;
```

It then creates a purchase:

```sql
INSERT INTO purchases (buyer_id, product_id)
VALUES ($1, $2)
RETURNING *;
```

This creates a relationship between the buyer and the product:

```text
Buyer
  │
  └── Purchase
         │
         └── Product
```

## Project Structure

```text
digital-asset-store-api/
│
├── db/
│
├── middleware/
│
├── routes/
│
├── utils/
│
├── index.js
├── schema.sql
├── package.json
└── package-lock.json
```

### `db/`

Contains the database-related code used by the application to connect to and interact with PostgreSQL.

### `middleware/`

Contains Express middleware used by the API, including authentication and authorization logic.

### `routes/`

Contains the API route definitions for the different resources and operations.

### `utils/`

Contains reusable utility functions used throughout the application.

### `index.js`

The main entry point of the application.

It initializes the Express application, configures the server, and mounts the API routes.

### `schema.sql`

Contains the PostgreSQL database schema used to create the application's tables and relationships.

### `package.json`

Contains the project's dependencies, scripts, and Node.js project configuration.

### `package-lock.json`

Locks the exact versions of the project's installed dependencies.

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
