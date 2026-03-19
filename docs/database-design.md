# Database Design

## 1. Schema Overview

The database schema is designed for an **MVP online exam system** with PostgreSQL and Prisma ORM.

### Design Principles
- **MVP-first**: Core features only, extensible for future
- **Soft delete**: Destructive operations use `deletedAt` timestamp
- **JSON fields**: Proper Prisma `Json` type for structured data
- **Audit trail**: All admin actions logged
- **Multi-attempt**: Students can retake papers multiple times

---

## 2. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Paper     │       │  Question   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ username    │       │ title       │◀──────│ subject_id  │
│ email       │       │ subject_id  │       │ stem        │
│ passwordHash│       │ creator_id │       │ options_json│
│ role        │       │ status      │       │ answer_json │
│ studentNo   │       └──────┬──────┘       │ difficulty  │
│ status      │              │              │ creator_id  │
│ deletedAt   │              │              │ deletedAt   │
└──────┬──────┘              │              └──────┬──────┘
       │                    │                     │
       │                    ▼                     │
       │              ┌─────────────┐             │
       │              │PaperQuestion│             │
       │              ├─────────────┤             │
       │              │ paper_id    │◀────────────┤
       │              │ question_id │             │
       │              │ score       │             │
       │              │ sort_order  │             │
       │              └─────────────┘             │
       │                    │                     │
       │                    ▼                     │
       │              ┌─────────────┐       ┌─────────────┐
       └─────────────▶│ExamAttempt │◀──────│ExamAnswer   │
                      ├─────────────┤       ├─────────────┤
                      │ paper_id    │       │ attempt_id  │
                      │ student_id  │       │ question_id │
                      │ attempt_no  │       │ is_correct  │
                      │ status      │       │ score       │
                      │ start_time  │       └──────┬──────┘
                      │ submit_time │              │
                      │ total_score │              │
                      └──────┬──────┘              │
                             │                     │
                             ▼                     ▼
                      ┌─────────────┐       ┌─────────────┐
                      │WrongQuestion│       │ Attachment  │
                      ├─────────────┤       ├─────────────┤
                      │ student_id │       │ biz_type    │
                      │ question_id │       │ biz_id      │
                      │ source_attempt_id │ │ file_url    │
                      │ wrong_count │       └─────────────┘
                      │ corrected   │
                      └─────────────┘
```

---

## 3. Table Definitions

### 3.1 User (`users`)

**Purpose**: System users - both students and administrators

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| passwordHash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL, default STUDENT | ADMIN or STUDENT |
| studentNo | VARCHAR(50) | NULLABLE | University student ID |
| className | VARCHAR(100) | NULLABLE | Student class |
| status | ENUM | NOT NULL, default ACTIVE | ACTIVE, INACTIVE, SUSPENDED |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |
| deletedAt | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Indexes**: email, username, role, studentNo, status

**Relationships**:
- Created questions (one-to-many with Question)
- Created papers (one-to-many with Paper)
- Exam attempts (one-to-many with ExamAttempt)
- Wrong questions (one-to-many with WrongQuestion)
- Sessions (one-to-many with Session)

---

### 3.1.1 Session (`sessions`)

**Purpose**: Server-trusted session tokens for authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| token | VARCHAR(64) | UNIQUE, NOT NULL | Random 64-char session token |
| userId | UUID | FK, NOT NULL | Reference to User |
| expiresAt | TIMESTAMP | NOT NULL | Session expiration time |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes**: userId, expiresAt

**OnDelete Behavior**: Cascade - deleting user removes all sessions

**Security**: Token is server-trusted; user data is resolved from DB on each request, not stored in cookie

---

### 3.2 Subject (`subjects`)

**Purpose**: Academic subjects/courses for organizing questions and papers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Subject name |
| code | VARCHAR(20) | UNIQUE, NULLABLE | Subject code (e.g., CS101) |
| description | TEXT | NULLABLE | Subject description |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes**: name, code

**Relationships**:
- Questions (one-to-many)
- Papers (one-to-many)

---

### 3.3 Question (`questions`)

**Purpose**: Question bank with various question types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| subjectId | UUID | FK, NOT NULL | Reference to Subject |
| type | ENUM | NOT NULL | SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK, ESSAY |
| stem | TEXT | NOT NULL | Question content |
| optionsJson | JSON | NULLABLE | Options for choice questions |
| answerJson | JSON | NOT NULL | Correct answer(s) |
| analysis | TEXT | NULLABLE | Explanation after answer |
| difficulty | ENUM | NOT NULL, default MEDIUM | EASY, MEDIUM, HARD |
| tagsJson | JSON | NULLABLE | Tags for organization |
| status | ENUM | NOT NULL, default DRAFT | DRAFT, PUBLISHED, ARCHIVED |
| creatorId | UUID | FK, NOT NULL | Reference to User (admin) |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |
| deletedAt | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Indexes**: subjectId, type, difficulty, status, creatorId

**JSON Fields**:
- `optionsJson`: `["Option A", "Option B", "Option C", "Option D"]`
- `answerJson`: `"A"` or `["A", "C"]` for multiple choice
- `tagsJson`: `["algorithms", "sorting", "difficult"]`

**Relationships**:
- Subject (many-to-one)
- Creator (many-to-one with User)
- Paper questions (one-to-many)
- Exam answers (one-to-many)
- Wrong questions (one-to-many)

---

### 3.4 Paper (`papers`)

**Purpose**: Exam paper configuration

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Paper title |
| subjectId | UUID | FK, NOT NULL | Reference to Subject |
| description | TEXT | NULLABLE | Paper description |
| durationMinutes | INT | NOT NULL, default 90 | Exam duration in minutes |
| totalScore | INT | NOT NULL, default 100 | Total possible score |
| passingScore | INT | NOT NULL, default 60 | Passing score threshold |
| status | ENUM | NOT NULL, default DRAFT | DRAFT, PUBLISHED, ARCHIVED |
| publishedAt | TIMESTAMP | NULLABLE | Publication timestamp |
| createdBy | UUID | FK, NOT NULL | Reference to User (admin) |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |
| deletedAt | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Indexes**: subjectId, status, createdBy, publishedAt

**Relationships**:
- Subject (many-to-one)
- Creator (many-to-one with User)
- Paper questions (one-to-many)
- Exam attempts (one-to-many)

---

### 3.5 PaperQuestion (`paper_questions`)

**Purpose**: Junction table linking papers to questions with scoring

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| paperId | UUID | FK, NOT NULL | Reference to Paper |
| questionId | UUID | FK, NOT NULL | Reference to Question |
| score | INT | NOT NULL, default 5 | Points for this question |
| sortOrder | INT | NOT NULL, default 0 | Display order in paper |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |

**Constraints**: UNIQUE(paperId, questionId)

**Indexes**: paperId, questionId

**OnDelete Behavior**: 
- Deleting Paper cascades to remove PaperQuestions (Cascade)
- Deleting Question does NOT cascade - PaperQuestion records remain (orphan prevention requires business logic)

---

### 3.6 ExamAttempt (`exam_attempts`)

**Purpose**: Student exam attempt record

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| paperId | UUID | FK, NOT NULL | Reference to Paper |
| studentId | UUID | FK, NOT NULL | Reference to User (student) |
| attemptNo | INT | NOT NULL, default 1 | 1st, 2nd, 3rd attempt |
| status | ENUM | NOT NULL | NOT_STARTED, IN_PROGRESS, SUBMITTED, GRADED, EXPIRED |
| startTime | TIMESTAMP | NULLABLE | When student started exam |
| submitTime | TIMESTAMP | NULLABLE | When student submitted |
| totalScore | INT | NULLABLE | Final score after grading |
| autoGradedAt | TIMESTAMP | NULLABLE | When auto-grading completed |
| ipAddress | VARCHAR(45) | NULLABLE | Student IP for audit |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Constraints**: UNIQUE(paperId, studentId, attemptNo)

**Multi-Attempt Policy**:
- Students can take the same paper multiple times
- `attemptNo` starts at 1 and increments for each attempt
- Unique constraint allows multiple attempts: (paperId, studentId, attemptNo)
- Queries can retrieve: latest attempt, best score, attempt history

**Indexes**: paperId, studentId, status

**Relationships**:
- Paper (many-to-one)
- Student (many-to-one with User)
- Answers (one-to-many)
- Wrong questions (one-to-many)

---

### 3.7 ExamAnswer (`exam_answers`)

**Purpose**: Student's answer for each question in an attempt

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| attemptId | UUID | FK, NOT NULL | Reference to ExamAttempt |
| questionId | UUID | FK, NOT NULL | Reference to Question |
| studentAnswerJson | JSON | NOT NULL | Student's answer as JSON |
| isCorrect | BOOLEAN | NULLABLE | Correctness (null until graded) |
| score | INT | NULLABLE | Points earned |
| reviewedAt | TIMESTAMP | NULLABLE | Manual review timestamp |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Constraints**: UNIQUE(attemptId, questionId) - One answer per question per attempt

**Indexes**: attemptId, questionId

**OnDelete Behavior**: Cascade - answers deleted when attempt deleted

**Grading Logic**:
- Objective questions (SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK): Auto-graded
- ESSAY: Manual review required (reviewedAt set)

**Relationships**:
- Attempt (many-to-one)
- Question (many-to-one)

---

### 3.8 WrongQuestion (`wrong_questions`)

**Purpose**: Wrong question book - accumulated mistakes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| studentId | UUID | FK, NOT NULL | Reference to User (student) |
| questionId | UUID | FK, NOT NULL | Reference to Question |
| sourceAttemptId | UUID | NULLABLE | Reference to ExamAttempt |
| wrongCount | INT | NOT NULL, default 1 | Accumulated mistake count |
| lastWrongAt | TIMESTAMP | NOT NULL | Last time got wrong |
| corrected | BOOLEAN | NOT NULL, default false | Got correct in later attempt |
| note | TEXT | NULLABLE | Student's personal note |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

**Constraints**: UNIQUE(studentId, questionId) - One record per student-question pair

**Indexes**: studentId, questionId

**Design Rationale**:
- `sourceAttemptId` is nullable to support future practice mode
- When student answers incorrectly, wrongCount increments
- When student gets it correct later, `corrected` flag is set to true
- Both wrongCount and lastWrongAt are updated on each wrong attempt

**Accumulation Logic**:
1. Student answers question wrong in attempt
2. Upsert WrongQuestion: increment wrongCount, update lastWrongAt
3. If student later answers correctly, set corrected = true
4. Query can filter by corrected = false for "still wrong" questions

---

### 3.9 Attachment (`attachments`)

**Purpose**: File attachments for questions, papers, or results

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| bizType | ENUM | NOT NULL | QUESTION, PAPER, RESULT |
| bizId | STRING | NOT NULL | ID of associated record |
| fileName | VARCHAR(255) | NOT NULL | Original file name |
| fileUrl | TEXT | NOT NULL | Storage URL (S3/local) |
| fileSize | INT | NULLABLE | File size in bytes |
| mimeType | VARCHAR(100) | NULLABLE | MIME type |
| uploadedBy | UUID | FK, NOT NULL | Reference to User |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes**: (bizType, bizId), uploadedBy

---

### 3.10 AuditLog (`audit_logs`)

**Purpose**: Admin action audit trail

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid() | Unique identifier |
| userId | UUID | FK, NOT NULL | Reference to User (admin) |
| action | VARCHAR(50) | NOT NULL | CREATE, UPDATE, DELETE, LOGIN, etc. |
| module | VARCHAR(50) | NOT NULL | QUESTION, PAPER, USER, etc. |
| targetType | VARCHAR(50) | NULLABLE | Table name affected |
| targetId | UUID | NULLABLE | ID of affected record |
| detailJson | JSON | NULLABLE | JSON details of action |
| ipAddress | VARCHAR(45) | NULLABLE | Admin IP for audit |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |

**Indexes**: userId, action, module, (targetType, targetId), createdAt

---

## 4. Indexing Strategy

### Query-Focused Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| User | email, username | Login queries |
| User | role, status | User filtering |
| Question | subjectId, status | Question bank queries |
| Question | type, difficulty | Filtering questions |
| Paper | subjectId, status | Paper list queries |
| Paper | publishedAt | Active exams |
| ExamAttempt | studentId, status | Student exam status |
| ExamAnswer | attemptId | Fetch attempt answers |
| WrongQuestion | studentId | Student's wrong questions |

---

## 5. Soft Delete Strategy

Tables with soft delete support:
- User (`deletedAt`)
- Question (`deletedAt`)
- Paper (`deletedAt`)

**Implementation**:
- Default queries should filter `deletedAt: null`
- Admin views can optionally include deleted records
- Related data (questions in papers) cascade appropriately

---

## 6. OnDelete Behavior Summary

| Relation | OnDelete | Description |
|----------|----------|-------------|
| Question → creator | Default (None) | Creator cannot be deleted if questions exist |
| Question → subject | Default (None) | Subject cannot be deleted if questions exist |
| Paper → creator | Default (None) | Creator cannot be deleted if papers exist |
| Paper → subject | Default (None) | Subject cannot be deleted if papers exist |
| PaperQuestion → paper | **Cascade** | Deleting paper removes all paper questions |
| PaperQuestion → question | **None** | Deleting question does NOT cascade (orphans remain - business logic should prevent) |
| ExamAnswer → attempt | **Cascade** | Deleting attempt cascades to answers |
| ExamAnswer → question | None | Deleting question does NOT cascade |
| WrongQuestion → sourceAttempt | **None** (nullable) | Wrong question persists even if attempt deleted |
| Attachment → uploader | Default (None) | Cannot delete user if attachments exist |
| AuditLog → user | Default (None) | Cannot delete user if audit logs exist |

---

## 7. Key Constraints

1. **Unique constraints**:
   - User: username, email
   - Subject: code
   - PaperQuestion: (paperId, questionId)
   - ExamAnswer: (attemptId, questionId)
   - WrongQuestion: (studentId, questionId)
   - ExamAttempt: (paperId, studentId, attemptNo)

2. **Referential integrity**:
   - Paper → PaperQuestion: Cascade (deleting paper removes questions)
   - ExamAttempt → ExamAnswer: Cascade (deleting attempt removes answers)
   - Question deletion does NOT cascade - handled by business logic

3. **Data integrity**:
   - Enums restrict valid values
   - Timestamps auto-managed by Prisma

---

## 8. Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Push schema to database
npx prisma db push

# View database
npx prisma studio
```

---

## 9. Prisma 7 Configuration

This project uses **Prisma 7** with the new configuration approach:

- **Database URL**: Configured in `prisma.config.ts`, not in schema.prisma
- **Environment variable**: `DATABASE_URL` must be set in `.env`
- **Schema file**: Does NOT contain `url = env("DATABASE_URL")` (Prisma 7 requirement)

Example `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/exam_system"
```

---

## 10. Future Extension Notes

| Extension | Description |
|-----------|-------------|
| Multi-tenancy | Add `tenantId` to all models |
| Anti-cheat | Add `browserFingerprint`, `tabSwitchCount` to ExamAttempt |
| Manual grading | Add `graderId`, `gradingComment` to ExamAnswer |
| Analytics | Create separate aggregation tables |
| Notifications | Add Notification model |
| Bookmarks | Add Bookmark model for saved questions |
| Practice mode | Use nullable `sourceAttemptId` in WrongQuestion |
