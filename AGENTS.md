# Project Rules - MVP Delivery

This file defines essential rules for building the Online Exam System MVP.

---

## 1. Project Goal

Build a dual-portal online examination platform:
- **Student Portal:** Take exams, view results, review mistakes
- **Admin Portal:** Manage questions, papers, students, results

---

## 2. Current Structure (MVP)

### Flat Route Structure (Current)
```
src/app/
├── page.tsx
├── login/
├── dashboard/
├── papers/
├── wrong-book/
└── admin/
    ├── questions/
    ├── papers/
    └── students/
```

### Folder Ownership
| Directory | Purpose |
|-----------|---------|
| `src/components/ui` | Reusable UI components (shadcn/ui) |
| `src/features` | Domain feature modules (future) |
| `src/hooks` | Shared React hooks |
| `src/services` | API service layer (future) |
| `src/repositories` | Data access layer (future) |
| `src/types` | Shared TypeScript types |
| `src/constants` | Shared constants |

---

## 3. Coding Rules

### TypeScript
- Strict mode enabled
- No `any` - use `unknown` if needed
- Use interfaces for shapes

### React/Next.js
- Use Server Components by default
- Use "use client" only when needed
- Keep components small and focused

### Naming
- Files: kebab-case (`question-card.tsx`)
- Components: PascalCase (`QuestionCard`)
- Functions: camelCase (`calculateScore`)

---

## 4. Development Priorities (MVP)

### Phase 1: Foundation
1. Prisma schema (User, Question, Paper, Result)
2. Database setup (PostgreSQL)

### Phase 2: Authentication
1. JWT auth
2. Login/register pages
3. Role-based access (ADMIN/STUDENT)

### Phase 3: Core Features
1. Question CRUD (admin)
2. Paper CRUD (admin)
3. Exam taking (student)
4. Results display

### Phase 4: Enhancements
1. Wrong book feature
2. Paper download
3. Analytics

---

## 5. Database (Next Step)

Follow `docs/database-design.md` for schema. Use Prisma for ORM.

```bash
npx prisma generate
npx prisma db push
```

---

## 6. Security (Future)

- Hash passwords with bcrypt
- JWT with short expiry
- Role-based middleware
- Input validation with Zod

---

## 7. Git Workflow

```bash
# Create branch
git checkout -b feature/description

# Commit changes
git add .
git commit -m "feat: description"

# Push
git push origin main
```

---

## 8. Quality Gates

Before any commit:
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No console.log in production code

---

## 9. Forbidden

- ❌ Commit secrets to repo
- ❌ Use `any` without justification
- ❌ Skip input validation
- ❌ Bypass authentication checks
