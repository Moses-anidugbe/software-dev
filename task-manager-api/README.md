# Task Manager API

A RESTful API for managing personal tasks with user authentication.

Users can register an account, log in, and securely manage their own tasks. Authentication is handled using JSON Web Tokens (JWT), and passwords are securely hashed with bcrypt.

## Features

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- User-specific task management
- Full CRUD operations for tasks
- Input validation
- PostgreSQL database integration

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- dotenv

## Project Structure

```text
task-manager/
├── db/
│   └── index.js
├── middleware/
│   ├── authenticateToken.js
│   └── validateId.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── utils/
│   └── validateTask.js
├── .env.example
├── .gitignore
├── package.json
└── index.js
```

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/task-manager-api.git
```

Move into the project folder:

```bash
cd task-manager-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_USER=your_username
DB_HOST=localhost
DB_NAME=task_manager
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=replace_with_a_long_random_secret
```

## Database Setup

Create the PostgreSQL database.

Run the schema file:

```bash
psql -U your_username -d task_manager -f schema.sql
```

## Running the Server

```bash
npm start
```

or

```bash
node index.js
```

The server will start on:

```
http://localhost:3000
```

---

# API Endpoints

## Authentication

### Register

```
POST /auth/register
```

Example request:

```json
{
  "username": "moses",
  "email": "moses@example.com",
  "password": "password123"
}
```

---

### Login

```
POST /auth/login
```

Example request:

```json
{
  "email": "moses@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "message": "Login successful.",
  "token": "<jwt_token>"
}
```

---

# Tasks

All task routes require:

```
Authorization: Bearer <jwt_token>
```

---

### Get all tasks

```
GET /tasks
```

Returns all tasks belonging to the authenticated user.

---

### Get a task

```
GET /tasks/:id
```

Returns a single task if it belongs to the authenticated user.

---

### Create a task

```
POST /tasks
```

Example request:

```json
{
  "title": "Finish backend project",
  "description": "Complete the Task Manager API"
}
```

---

### Update a task

```
PATCH /tasks/:id
```

Example request:

```json
{
  "completed": true
}
```

---

### Delete a task

```
DELETE /tasks/:id
```

Deletes the specified task if it belongs to the authenticated user.

---

## Security

- Passwords are hashed using bcrypt.
- Authentication uses JWT.
- Protected routes require a valid Bearer token.
- Users can only access their own tasks.
- Parameterized SQL queries are used to prevent SQL injection.

## Future Improvements

- Refresh tokens
- Role-based authorization
- Pagination and filtering
- Automated tests
- Swagger/OpenAPI documentation
- Docker support
- Deployment
