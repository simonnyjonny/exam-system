# Product Requirements Document

## 1. Project Overview

### Project Name
Online Exam System

### Core Functionality
A dual-portal online examination system enabling administrators to create and manage exams while providing students a seamless testing experience.

### Target Users
- **Primary**: University students taking online examinations
- **Secondary**: Professors/administrators managing questions and exams

---

## 2. MVP Requirements (Current Phase)

### 2.1 Authentication
- Email/password login
- JWT-based authentication
- Role-based access (ADMIN, STUDENT)

### 2.2 Admin Portal
- Create/edit/delete questions
- Create/edit/delete exam papers
- View student list
- View exam results

### 2.3 Student Portal
- View available exams
- Take exam with timer
- View results immediately
- Review wrong answers

---

## 3. Future Requirements (Post-MVP)

### 3.1 Enhanced Question Management
- Bulk import via CSV/Excel
- Question versioning
- Question categories/tags

### 3.2 Enhanced Paper Management
- Exam scheduling (start/end time)
- Randomize questions/options
- Paper templates

### 3.3 Enhanced Student Features
- Performance trends over time
- Practice mode
- Paper download

### 3.4 Enhanced Admin Features
- Analytics dashboard
- Bulk student import
- Export reports (CSV/PDF)

---

## 4. Question Types (Future)

| Type | Description |
|------|-------------|
| MCQ | Multiple choice (4 options) |
| TRUE_FALSE | True/False |
| FILL_BLANK | Fill in the blank |
| ESSAY | Essay response |

---

## 5. Data Models (Planned)

- **User**: id, email, password, name, role, studentId
- **Question**: id, content, type, options, answer, difficulty, points
- **Category**: id, name, description
- **Paper**: id, title, duration, passingScore, questions
- **Result**: id, studentId, paperId, score, answers, submittedAt

---

## 6. Non-Functional Requirements

### Performance
- Page load < 2 seconds
- Support 1000+ concurrent users

### Security
- Password hashing (bcrypt)
- JWT with expiration
- HTTPS only
- Input validation

---

## 7. Out of Scope (MVP)

- Real-time proctoring
- Payment integration
- Email notifications
- Mobile native apps
- Multi-language support
