# Study.io Backend API Documentation

## Overview
Study.io is a backend API service built with Fastify that helps users manage their study materials through subjects, topics, and matters. The API uses JWT authentication and integrates with Google OAuth for user authentication.

## Base URL
```
http://localhost:3333
```

## Authentication
All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### Register/Login with Google
```http
POST /register
```
Authenticates a user using Google OAuth.

**Request Body:**
```json
{
  "access_token": "string" // Google OAuth access token
}
```

**Response:**
```json
{
  "token": "string" // JWT token for subsequent requests
}
```

#### Get Current User
```http
GET /me
```
Returns information about the currently authenticated user.

**Response:**
```json
{
  "user": {
    "sub": "string", // User ID
    "name": "string",
    "avatarUrl": "string"
  }
}
```

### Subjects

#### List Subjects
```http
GET /subjects
```
Returns a list of all subjects for the authenticated user.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "excerpt": "string",
    "createdAt": "string"
  }
]
```

#### Create Subject
```http
POST /subjects
```
Creates a new subject.

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "userId": "string",
  "createdAt": "string"
}
```

#### Get Subject by ID
```http
GET /subjects/:id
```
Returns detailed information about a specific subject, including its topics.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdAt": "string",
  "topics": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "isCompleted": "boolean",
      "createdAt": "string"
    }
  ]
}
```

### Topics

#### List Topics
```http
GET /topics
```
Returns a list of topics for a specific subject.

**Request Parameters:**
- `id`: Subject ID (UUID)

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "excerpt": "string",
    "isCompleted": "boolean"
  }
]
```

#### Create Topic
```http
POST /topics
```
Creates a new topic within a subject.

**Request Parameters:**
- `id`: Subject ID (UUID)

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "isCompleted": "boolean" // Optional, defaults to false
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "isCompleted": "boolean",
  "subjectId": "string",
  "createdAt": "string"
}
```

### Matters

#### List Matters
```http
GET /matters
```
Returns a list of matters for a specific topic.

**Request Parameters:**
- `id`: Topic ID (UUID)

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "isDone": "boolean"
  }
]
```

#### Create Matter
```http
POST /matters
```
Creates a new matter within a topic.

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "isDone": "boolean",
  "topicId": "string"
}
```

## Data Models

### User
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `googleId`: String (Unique, Optional)
- `avatarUrl`: String (Optional)
- `createdAt`: DateTime

### Subject
- `id`: UUID (Primary Key)
- `name`: String
- `description`: String
- `createdAt`: DateTime
- `userId`: String (Foreign Key to User)

### Topic
- `id`: UUID (Primary Key)
- `name`: String
- `description`: String
- `createdAt`: DateTime
- `isCompleted`: Boolean
- `subjectId`: String (Foreign Key to Subject)

### Matter
- `id`: UUID (Primary Key)
- `name`: String
- `isDone`: Boolean
- `topicId`: String (Foreign Key to Topic)

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Development
To run the project locally:

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL="file:./dev.db"
```

3. Run the development server:
```bash
npm run dev
```

The server will start on port 3333.
