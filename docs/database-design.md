# Database Design

## 1. Schema Overview

This document outlines the database schema for the Online Exam System. The design follows normalization principles while balancing query performance.

---

## 2. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Paper     │       │   Result    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │◀──────│ created_by  │       │ student_id  │
│ email       │       │ id          │◀──────│ paper_id    │
│ password    │       │ title       │       │ id          │────▶ User
│ name        │       │ duration    │       │ score       │
│ role        │       │ passing_score│      │ submitted_at│
│ created_at  │       │ status      │       │ answers     │
│ updated_at  │       │ published_at│       └─────────────┘
└─────────────┘       │ created_at  │              ▲
        │             │ updated_at  │              │
        │             └─────────────┘              │
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────┐
│                     PaperQuestion                         │
├──────────────────────────────────────────────────────────┤
│ paper_id        │ question_id      │ order │ points     │
└──────────────────────────────────────────────────────────┘
        │                    │
        ▼                    ▼
┌─────────────┐       ┌─────────────┐
│  Question   │       │   Category  │
├─────────────┤       ├─────────────┤
│ id          │◀──────│ id          │
│ category_id │       │ name        │
│ type        │       │ description │
│ content     │       │ created_at  │
│ options     │       └─────────────┘
│ answer      │
│ explanation │
│ difficulty  │
│ points      │
│ created_at  │
│ updated_at  │
└─────────────┘
```

---

## 3. Tables

### 3.1 User

Stores all user accounts (students and administrators).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| name | VARCHAR(255) | NOT NULL | Full name |
| role | ENUM('ADMIN', 'STUDENT') | NOT NULL, default 'STUDENT' | User role |
| student_id | VARCHAR(50) | NULLABLE | University student ID |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- `idx_user_email` on email
- `idx_user_role` on role
- `idx_user_student_id` on student_id

---

### 3.2 Category

Question categories for organization (subjects, chapters, topics).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Category name |
| description | TEXT | NULLABLE | Category description |
| parent_id | UUID | FK, NULLABLE | Self-reference for hierarchy |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |

**Indexes:**
- `idx_category_parent` on parent_id

---

### 3.3 Question

Question bank storing all exam questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| category_id | UUID | FK, NOT NULL | Category reference |
| type | ENUM('MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'ESSAY') | NOT NULL | Question type |
| content | TEXT | NOT NULL | Question text |
| options | JSONB | NULLABLE | Options for MCQ/TF (array) |
| correct_answer | TEXT | NOT NULL | Correct answer |
| explanation | TEXT | NULLABLE | Answer explanation |
| difficulty | ENUM('EASY', 'MEDIUM', 'HARD') | NOT NULL, default 'MEDIUM' | Difficulty level |
| points | INTEGER | NOT NULL, default 1 | Point value |
| image_url | VARCHAR(500) | NULLABLE | Optional image |
| created_by | UUID | FK, NOT NULL | Admin who created |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- `idx_question_category` on category_id
- `idx_question_type` on type
- `idx_question_difficulty` on difficulty

---

### 3.4 Paper

Exam paper configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Paper title |
| description | TEXT | NULLABLE | Paper description |
| duration | INTEGER | NOT NULL | Duration in minutes |
| passing_score | INTEGER | NOT NULL, default 60 | Passing percentage |
| randomize_questions | BOOLEAN | NOT NULL, default false | Randomize order |
| randomize_options | BOOLEAN | NOT NULL, default false | Randomize options |
| status | ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') | NOT NULL, default 'DRAFT' | Paper status |
| published_at | TIMESTAMP | NULLABLE | Publication timestamp |
| start_time | TIMESTAMP | NULLABLE | Exam start window |
| end_time | TIMESTAMP | NULLABLE | Exam end window |
| created_by | UUID | FK, NOT NULL | Admin who created |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes:**
- `idx_paper_status` on status
- `idx_paper_created_by` on created_by

---

### 3.5 PaperQuestion

Junction table linking papers to questions with ordering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| paper_id | UUID | FK, NOT NULL | Paper reference |
| question_id | UUID | FK, NOT NULL | Question reference |
| order_index | INTEGER | NOT NULL | Display order |
| points | INTEGER | NOT NULL | Point value for this question |

**Primary Key:** (paper_id, question_id)

---

### 3.6 Result

Student exam results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| student_id | UUID | FK, NOT NULL | Student reference |
| paper_id | UUID | FK, NOT NULL | Paper reference |
| score | INTEGER | NOT NULL | Total score |
| max_score | INTEGER | NOT NULL | Maximum possible score |
| percentage | DECIMAL(5,2) | NOT NULL | Score percentage |
| passed | BOOLEAN | NOT NULL | Pass/fail status |
| started_at | TIMESTAMP | NOT NULL | Exam start time |
| submitted_at | TIMESTAMP | NOT NULL | Submission time |
| time_taken | INTEGER | NOT NULL | Time spent in seconds |
| answers | JSONB | NOT NULL | Student answers |
| ip_address | VARCHAR(45) | NULLABLE | Submission IP |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |

**Indexes:**
- `idx_result_student` on student_id
- `idx_result_paper` on paper_id

---

### 3.7 Session

Active user sessions for security tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| user_id | UUID | FK, NOT NULL | User reference |
| token | VARCHAR(500) | UNIQUE, NOT NULL | JWT token |
| expires_at | TIMESTAMP | NOT NULL | Expiration timestamp |
| created_at | TIMESTAMP | NOT NULL, default now() | Creation timestamp |

**Indexes:**
- `idx_session_token` on token
- `idx_session_user` on user_id

---

## 4. Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Paper | One-to-Many | Admin can create many papers |
| User → Question | One-to-Many | Admin can create many questions |
| User → Result | One-to-Many | Student has many results |
| Category → Question | One-to-Many | Category has many questions |
| Category → Category | One-to-Many (Self) | Categories can have subcategories |
| Paper → PaperQuestion | One-to-Many | Paper has many questions |
| Question → PaperQuestion | One-to-Many | Question appears in many papers |
| Paper → Result | One-to-Many | Paper has many results |

---

## 5. Data Integrity Rules

1. **Question Deletion**: Cannot delete if used in published papers
2. **Paper Deletion**: Cannot delete if has results
3. **User Deletion**: Soft delete (set inactive) instead of hard delete
4. **Result Modification**: Results cannot be modified after submission

---

## 6. Query Optimization Notes

### Frequently Accessed Data
- User lookups by email: indexed
- Question lookups by category: indexed
- Result lookups by student: indexed
- Paper lookups by status: indexed

### Pagination
- All list endpoints must use cursor-based or offset pagination
- Maximum 100 items per page

### JSON Usage
- `options` field uses JSONB for flexible MCQ options
- `answers` field uses JSONB for flexible answer storage
