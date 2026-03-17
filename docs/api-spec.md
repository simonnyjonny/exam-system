# API Specification

## 1. API Overview

All API endpoints follow RESTful conventions. Communication is via JSON over HTTPS.

### Base URL
```
Production: https://api.examsystem.com
Development: http://localhost:3000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 2. Response Format

### Success Response
```typescript
{
  success: true,
  data: T,
  message?: string
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: Record<string, unknown>
  }
}
```

### Paginated Response
```typescript
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

---

## 3. Endpoints

### 3.1 Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```typescript
{
  email: string,
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      email: string,
      name: string,
      role: "ADMIN" | "STUDENT"
    },
    accessToken: string,
    expiresIn: number
  }
}
```

---

#### POST /api/auth/register
Register a new student account.

**Request:**
```typescript
{
  email: string,
  password: string,
  name: string,
  studentId: string
}
```

---

#### POST /api/auth/logout
Logout and invalidate token.

**Headers:** Authorization required

**Response:**
```typescript
{ success: true }
```

---

### 3.2 Questions

#### GET /api/questions
Get all questions (admin only).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| category | uuid | Filter by category |
| type | string | Filter by type |
| difficulty | string | Filter by difficulty |
| search | string | Search in content |

**Response:**
```typescript
{
  success: true,
  data: Question[],
  pagination: { page, limit, total, totalPages }
}
```

---

#### POST /api/questions
Create a new question (admin only).

**Request:**
```typescript
{
  categoryId: string,
  type: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "ESSAY",
  content: string,
  options?: string[],        // For MCQ/TF
  correctAnswer: string,
  explanation?: string,
  difficulty: "EASY" | "MEDIUM" | "HARD",
  points: number,
  imageUrl?: string
}
```

---

#### GET /api/questions/[id]
Get a specific question.

**Response:**
```typescript
{
  success: true,
  data: Question
}
```

---

#### PUT /api/questions/[id]
Update a question (admin only).

---

#### DELETE /api/questions/[id]
Delete a question (admin only).

---

### 3.3 Papers

#### GET /api/papers
Get all papers (admin) or available papers (student).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| page | number | Page number |
| limit | number | Items per page |

---

#### POST /api/papers
Create a new paper (admin only).

**Request:**
```typescript
{
  title: string,
  description?: string,
  duration: number,
  passingScore: number,
  randomizeQuestions: boolean,
  randomizeOptions: boolean,
  startTime?: string,
  endTime?: string,
  questions: {
    questionId: string,
    orderIndex: number,
    points: number
  }[]
}
```

---

#### GET /api/papers/[id]
Get paper details.

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    title: string,
    description: string,
    duration: number,
    passingScore: number,
    status: string,
    questions: {
      id: string,
      content: string,
      type: string,
      points: number
    }[]
  }
}
```

---

#### PUT /api/papers/[id]
Update paper (admin only).

---

#### DELETE /api/papers/[id]
Delete paper (admin only).

---

#### POST /api/papers/[id]/publish
Publish a paper (admin only).

---

### 3.4 Exams

#### GET /api/exams/available
Get available exams for current student.

---

#### POST /api/exams/[id]/start
Start an exam.

**Response:**
```typescript
{
  success: true,
  data: {
    examId: string,
    startedAt: string,
    timeLimit: number,
    questions: {
      id: string,
      content: string,
      type: string,
      options?: string[]
    }[]
  }
}
```

---

#### POST /api/exams/[id]/submit
Submit exam answers.

**Request:**
```typescript
{
  answers: {
    questionId: string,
    answer: string
  }[],
  timeTaken: number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    resultId: string,
    score: number,
    maxScore: number,
    percentage: number,
    passed: boolean,
    breakdown: {
      correct: number,
      incorrect: number,
      unanswered: number
    }
  }
}
```

---

#### GET /api/exams/[id]/result
Get exam result details.

---

### 3.5 Results

#### GET /api/results
Get student's result history.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

---

#### GET /api/results/[id]
Get specific result with answers.

---

#### GET /api/admin/results
Get all results (admin only).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| paperId | uuid | Filter by paper |
| studentId | uuid | Filter by student |
| page | number | Page number |
| limit | number | Items per page |

---

### 3.6 Users (Admin)

#### GET /api/users
Get all users (admin only).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| role | string | Filter by role |
| search | string | Search by name/email |
| page | number | Page number |
| limit | number | Items per page |

---

#### POST /api/users/import
Bulk import students (admin only).

**Request:** Multipart form data with CSV file

---

#### PUT /api/users/[id]
Update user details (admin only).

---

#### DELETE /api/users/[id]
Soft delete user (admin only).

---

### 3.7 Categories

#### GET /api/categories
Get all categories.

---

#### POST /api/categories
Create category (admin only).

---

#### DELETE /api/categories/[id]
Delete category (admin only).

---

## 4. HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error |

---

## 5. Error Codes

| Code | Description |
|------|-------------|
| AUTH_INVALID_CREDENTIALS | Invalid email or password |
| AUTH_TOKEN_EXPIRED | JWT token expired |
| AUTH_TOKEN_INVALID | Invalid JWT token |
| AUTH_UNAUTHORIZED | Authentication required |
| FORBIDDEN_INSUFFICIENT_PERMISSION | Admin access required |
| VALIDATION_ERROR | Request validation failed |
| NOT_FOUND_USER | User not found |
| NOT_FOUND_QUESTION | Question not found |
| NOT_FOUND_PAPER | Paper not found |
| NOT_FOUND_RESULT | Result not found |
| PAPER_ALREADY_PUBLISHED | Cannot modify published paper |
| PAPER_EXAM_IN_PROGRESS | Exam already in progress |
| EXAM_TIME_EXPIRED | Exam window closed |
| QUESTION_IN_USE | Cannot delete question in use |

---

## 6. Rate Limiting

- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **Exam Submission**: 10 requests per minute

---

## 7. Versioning

API versioning via URL path:
```
/api/v1/questions
```

Current version: v1
