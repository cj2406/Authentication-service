# Authentication Service

A full-stack authentication system built with Express.js, React, Prisma, TypeScript, and PostgreSQL. Features secure JWT-based authentication with refresh token rotation and password hashing using Argon2.

## Project Structure

```
authentication-service/
├── client/                 # React TypeScript frontend (Vite)
│   ├── src/
│   │   ├── components/     # Login, Signup, Authenticated components
│   │   ├── auth/           # Authentication logic and API calls
│   │   ├── api/            # API client setup
│   │   └── dependency/     # Dependency injection
│   └── package.json
├── server/                 # Express.js TypeScript backend
│   ├── src/
│   │   ├── auth/           # Authentication controller, routes, service
│   │   ├── user/           # User controller and routes
│   │   ├── middleware/     # Auth, rate limiting, error handling
│   │   ├── utils/          # JWT and refresh token utilities
│   │   └── db/             # Prisma database client
│   ├── prisma/             # Database schema and migrations
│   └── package.json
└── docker-compose.yml      # PostgreSQL database setup
```

## Features

- **User Registration & Login** - Secure user registration with email validation and password hashing
- **JWT Authentication** - Stateless authentication using JSON Web Tokens
- **Refresh Token Rotation** - Secure refresh token pattern with selector/verifier implementation
- **Password Security** - Argon2 password hashing
- **Rate Limiting** - API rate limiting to prevent abuse
- **Error Handling** - Comprehensive error handling middleware
- **CORS Support** - Configured for cross-origin requests
- **TypeScript** - Full type safety on both client and server
- **Docker Support** - PostgreSQL containerized with Docker Compose

## Tech Stack

### Frontend
- **React** 19.2.8 - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client
- **ESLint** - Code linting

### Backend
- **Express.js** 5.2.1 - Web framework
- **TypeScript** 7.0.2 - Type-safe JavaScript
- **Prisma** 7.9.1 - ORM for database management
- **PostgreSQL** - Database
- **Argon2** - Password hashing
- **jsonwebtoken** - JWT creation and verification
- **express-rate-limit** - Rate limiting middleware

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose (for PostgreSQL)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd authentication-service
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

This starts a PostgreSQL db with:
- User: `auth_user`
- Password: `auth_password`
- Database: `auth_db`
- Port: `5432`

### 3. Setup Server

```bash
cd server
npm install

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Setup Client (in a new terminal)

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST /register** - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST /login** - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Returns: `accessToken`, `refreshToken`, `user` object

- **POST /refresh** - Refresh access token using refresh token
  - Automatically rotates refresh tokens for security

- **POST /logout** - Logout user (revokes refresh token)

### User Routes (`/api/users`)

- **GET /profile** - Get authenticated user profile (requires valid access token)

## Authentication Flow

1. **Registration**: User creates an account with email and password
   - Password is hashed using Argon2
   - User is stored in PostgreSQL

2. **Login**: User authenticates with email and password
   - Returns an access token (short-lived, ~1 hour)
   - Returns a refresh token (long-lived, 7 days)
   - Refresh token is stored in database with selector/verifier pattern

3. **Access Protected Routes**: Client sends access token in Authorization header
   - Middleware validates token signature and expiration

4. **Token Refresh**: When access token expires, client uses refresh token
   - Old refresh token is revoked
   - New access token and refresh token pair are issued
   - Enables detection of token theft

5. **Logout**: User logs out
   - Refresh token is marked as revoked
   - Cannot be reused

## Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://auth_user:auth_password@localhost:5432/auth_db"
JWT_SECRET="your-secret-key-here"
```

## Development

### Server Commands

```bash
npm run dev     # Run with tsx watch
npm run start   # Build and run
```

### Client Commands

```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Database Migrations

Prisma migrations are stored in `server/prisma/migrations/`. To add changes:

```bash
cd server
npx prisma migrate dev --name <migration-name>
```

## Security Considerations

- Passwords are hashed with Argon2 (memory-hard algorithm)
- Refresh tokens use a secure selector/verifier pattern:
  - Only the selector is stored in the database
  - Verifier is hashed before storage
  - Token theft is detectable when old token is reused
- Access tokens are short-lived and stored in secure HTTP-only cookies
- CORS is restricted to the frontend origin
- Rate limiting protects against brute-force attacks

## Error Handling

The API returns consistent error responses with status codes:

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad request / validation error
- `401` - Unauthorized / invalid credentials
- `409` - Conflict / user already exists
- `500` - Internal server error

## Testing

### Test Database Connection

```bash
curl http://localhost:5000/api/test-db
```

### Test API Health

```bash
curl http://localhost:5000/api/test
```

## License

ISC

## Contributing

1. Create a new branch for your feature
2. Make your changes to the branch
3. Submit a pull request

---

For questions or issues, please open an issue in the repository.Ill reply as soon as possible
