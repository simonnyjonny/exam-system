# Project Rules and Guidelines

This file defines the rules, conventions, and workflows for developing the Online Exam System.

---

## 1. Product Goal

**Mission:** Build a production-ready online examination platform for universities with dual portals (Admin and Student) enabling secure exam creation, delivery, and performance tracking.

### Core Principles
- **Security First:** Exam integrity and data protection are paramount
- **User Experience:** Intuitive interfaces for both admins and students
- **Performance:** Fast, responsive pages with efficient data handling
- **Maintainability:** Clean, modular code suitable for long-term development

---

## 2. Architecture Rules

### 2.1 Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Database:** PostgreSQL with Prisma ORM

### 2.2 Project Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/      # Auth routes (login, register)
│   ├── (dashboard)/ # Student dashboard routes
│   ├── (admin)/     # Admin portal routes
│   └── api/         # API routes
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── forms/       # Form components
│   ├── layout/      # Layout components
│   └── exam/        # Exam-specific components
├── lib/             # Utilities and helpers
│   ├── db.ts        # Prisma client
│   ├── auth.ts      # Auth utilities
│   └── utils.ts     # General utilities
└── prisma/          # Database schema
```

### 2.3 API Design
- RESTful conventions
- JSON request/response format
- Bearer token authentication
- Versioned endpoints (/api/v1/)

---

## 3. Coding Rules

### 3.1 TypeScript
- **Strict mode enabled** in tsconfig.json
- No `any` types - use `unknown` when necessary
- Use interfaces for object shapes
- Use type aliases for unions/enums
- Export types that are reused

### 3.2 React/Next.js
- Use Server Components by default
- Use "use client" directive only when needed
- Keep components small and focused
- Co-locate component styles
- Use proper error boundaries

### 3.3 Naming Conventions
- **Files:** kebab-case (e.g., question-card.tsx)
- **Components:** PascalCase (e.g., QuestionCard)
- **Functions:** camelCase (e.g., calculateScore)
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase

### 3.4 Code Style
- Use ESLint and Prettier
- 2-space indentation
- Single quotes for strings
- Trailing commas
- No semicolons (unless required)
- Prefer arrow functions for callbacks

### 3.5 Import Order
```typescript
// 1. React/Next imports
import { useState } from 'react';
import Link from 'next/link';

// 2. External libraries
import { z } from 'zod';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/exam/question-card';

// 4. Lib utilities
import { db } from '@/lib/db';
import { validateAnswer } from '@/lib/utils';

// 5. Types
import type { Question, Answer } from '@/types';
```

---

## 4. Validation Rules

### 4.1 Input Validation
- Validate ALL user inputs with Zod schemas
- Sanitize string inputs
- Validate file uploads (type, size limits)
- Rate limit sensitive endpoints

### 4.2 API Validation
```typescript
// Example: Question creation validation
const CreateQuestionSchema = z.object({
  categoryId: z.string().uuid(),
  type: z.enum(['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'ESSAY']),
  content: z.string().min(10).max(2000),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  points: z.number().int().positive().default(1),
});
```

### 4.3 Database Validation
- Use Prisma schema constraints
- Add database indexes for frequently queried fields
- Validate foreign key relationships
- Use transactions for multi-step operations

---

## 5. RBAC & Security Rules

### 5.1 Roles
| Role | Permissions |
|------|-------------|
| ADMIN | Full CRUD on questions, papers, users, results |
| STUDENT | Take exams, view own results, review mistakes |

### 5.2 Authorization Middleware
```typescript
// Require admin role
export function requireAdmin(user: User) {
  if (user.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
}

// Check resource ownership
export function canAccessResult(user: User, result: Result) {
  return user.role === 'ADMIN' || result.studentId === user.id;
}
```

### 5.3 Security Requirements
- Hash passwords with bcrypt (cost factor 12)
- JWT tokens with 15-minute expiration
- HTTPS only in production
- Input sanitization on all endpoints
- CSRF protection
- Rate limiting on auth endpoints

### 5.4 Exam Security
- Log tab switch events
- Prevent multiple submissions
- Server-side timestamps
- Store IP addresses for audit

---

## 6. Delivery Workflow

### 6.1 Before Writing Code
1. Read relevant documentation
2. Understand the feature requirements
3. Check existing patterns in codebase
4. Plan component structure

### 6.2 Development Process
1. Create branch: `feature/description` or `fix/description`
2. Write code following coding rules
3. Add TypeScript types
4. Test locally
5. Run linting and type checking

### 6.3 Code Quality Gates
```bash
# Must pass before commit
npm run lint         # ESLint
npm run type-check  # TypeScript
npm run build        # Production build
```

### 6.4 Commit Messages
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

### 6.5 Pull Request
- Reference issue numbers
- Describe changes made
- Test on staging before merge

---

## 7. Component Guidelines

### 7.1 UI Components (shadcn/ui)
- Use shadcn/ui as base
- Customize via Tailwind classes
- Keep components in `src/components/ui/`

### 7.2 Feature Components
- Co-locate in feature folders
- Include component, tests, and utilities together
- Use composition over inheritance

### 7.3 Props Interface
```typescript
interface QuestionCardProps {
  question: Question;
  answer?: string;
  showAnswer?: boolean;
  onAnswerChange?: (answer: string) => void;
  disabled?: boolean;
}
```

---

## 8. Testing Guidelines

### 8.1 Unit Tests
- Test utility functions
- Test validation schemas
- Test component rendering

### 8.2 Integration Tests
- Test API endpoints
- Test database operations
- Test auth flows

### 8.3 Test Structure
```typescript
describe('calculateScore', () => {
  it('should calculate correct score', () => {
    const result = calculateScore(answers, questions);
    expect(result).toBe(85);
  });
});
```

---

## 9. Documentation Requirements

### 9.1 Code Documentation
- Document complex logic with comments
- Use JSDoc for public functions
- Keep README up to date

### 9.2 API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes

---

## 10. Performance Guidelines

### 10.1 Frontend
- Use React Server Components
- Implement proper loading states
- Optimize images (next/image)
- Lazy load heavy components

### 10.2 Backend
- Use database indexes
- Implement pagination
- Cache expensive queries
- Use connection pooling

---

## 11. Environment Configuration

### Required Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Rules
- Never commit `.env` files
- Use `.env.example` as template
- Validate env vars at startup

---

## 12. Forbidden Practices

### Never Do
- ❌ Commit secrets or API keys
- ❌ Use `any` type without justification
- ❌ Skip input validation
- ❌ Bypass authentication checks
- ❌ Write SQL queries manually (use Prisma)
- ❌ Disable TypeScript strict mode
- ❌ Leave console.log in production code

---

## 13. Next Steps

When implementing new features:
1. Check database schema in `docs/database-design.md`
2. Review API spec in `docs/api-spec.md`
3. Follow security checklist in `docs/security-checklist.md`
4. Use consistent naming from this document
5. Add tests for new functionality
