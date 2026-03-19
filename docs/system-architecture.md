# System Architecture

## 1. Architecture Overview

This application follows a **monolithic architecture** using Next.js App Router with a relational database.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Next.js App Server                    │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   Prisma ORM     │────────▶│     PostgreSQL Database   │  │
│  └──────────────────┘         └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack (Current)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | Framework, SSR, Routing |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | Component Library |
| Prisma | 7.x | ORM (configured) |
| PostgreSQL | 14+ | Database |

---

## 2.1 Implemented Modules

| Module | Status | Description |
|--------|--------|-------------|
| Authentication | ✅ | Session-based with database tokens |
| RBAC | ✅ | Admin/Student role-based access |
| Question Bank | ✅ | CRUD with soft delete |
| Paper Management | ✅ | CRUD, publish/archive workflow, question selection |
| Exam Taking | ✅ | Full flow: start, continue, submit, auto-grade |
| Wrong Book | ✅ | Wrong question tracking and review |

---

## 3. Project Structure (Current)

### 3.1 Root Structure

```
src/
├── app/                      # Next.js App Router pages
├── components/               # Reusable UI components
│   └── ui/                   # shadcn/ui base components
├── features/                 # Feature modules (future)
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities
│   ├── auth/                 # Authentication
│   ├── validators/           # Input validation
│   ├── rbac.ts              # Role-based access
│   └── prisma.ts            # Prisma client
├── services/                 # API services (future)
├── repositories/             # Data access layer
├── types/                    # TypeScript types
├── constants/                # Application constants
└── prisma/                  # Database schema
```

### 3.2 App Directory (Current - Flat Structure)

The current implementation uses a flat route structure with modular organization.

```
src/app/
├── page.tsx                  # Homepage (landing)
├── layout.tsx               # Root layout
├── globals.css
│
├── login/
│   ├── page.tsx             # Login page
│   ├── LoginForm.tsx        # Login form component
│   └── actions.ts           # Login server actions
│
├── logout/
│   └── actions.ts           # Logout server actions
│
├── dashboard/
│   └── page.tsx             # Student dashboard
│
├── papers/
│   └── page.tsx             # Available exam papers list
│
├── exam/
│   └── [paperId]/
│       ├── page.tsx         # Exam start/continue page
│       └── take/
│           └── page.tsx    # Exam taking page with client component
│
├── exam/
│   └── [attemptId]/
│       └── result/
│           └── page.tsx    # Exam result page with question review
│
├── wrong-book/
│   ├── page.tsx            # Wrong questions list with subject filter
│   └── actions.ts          # Wrong question fetch actions
│
└── admin/
    ├── page.tsx             # Admin overview
    ├── questions/
    │   ├── page.tsx         # Question list
    │   ├── actions.ts       # Question CRUD actions
    │   ├── new/
    │   │   └── page.tsx     # Create question
    │   ├── [id]/
    │   │   └── page.tsx     # Edit question
    │   ├── question-filter-form.tsx
    │   ├── question-list.tsx
    │   ├── question-form.tsx
    │   └── question-edit-form.tsx
    ├── papers/
    │   └── page.tsx         # Paper management
    └── students/
        └── page.tsx         # Student management
```

### 3.3 Route Groups (Future Refactoring)

The following route group structure is planned for future implementation to better separate portals:

```
src/app/
├── (auth)/                   # [FUTURE] Auth routes
│   ├── login/
│   └── register/
│
├── (student)/                # [FUTURE] Student portal
│   ├── layout.tsx           # Student-specific layout
│   ├── dashboard/
│   ├── papers/
│   └── wrong-book/
│
└── (admin)/                 # [FUTURE] Admin portal
    ├── layout.tsx           # Admin-specific layout
    ├── admin/
    ├── questions/
    ├── papers/
    └── students/
```

---

## 3.1 Question Module Architecture (Implemented)

The question module follows a layered architecture within the Next.js App Router:

```
src/app/admin/questions/
├── page.tsx                    # Server Component - Question list
├── actions.ts                  # Server Actions - CRUD operations
├── question-form.tsx          # Client Component - Create form
├── question-edit-form.tsx     # Client Component - Edit form
├── question-list.tsx          # Client Component - List display
├── question-filter-form.tsx   # Client Component - Filters
├── new/
│   └── page.tsx              # Server Component - Create page
└── [id]/
    └── page.tsx               # Server Component - Edit page
```

### Layer Flow:
1. **Page Layer** (`page.tsx`) - Server Components handle routing and data fetching
2. **Actions Layer** (`actions.ts`) - Server Actions bridge UI to business logic
3. **Validation Layer** (`validators/`) - Input validation
4. **Repository Layer** (`repositories/`) - Data access via Prisma
5. **Database Layer** - PostgreSQL with Prisma ORM

### Key Files:
| File | Responsibility |
|------|---------------|
| `actions.ts` | `fetchQuestions`, `createQuestionAction`, `updateQuestionAction`, `deleteQuestionAction` |
| `question.validator.ts` | `validateCreateQuestion`, `validateUpdateQuestion` |
| `question.repository.ts` | CRUD operations, soft delete, filtering |

**Note:** Services layer (`src/services/`) is currently a placeholder. The actions layer currently serves as the service layer for the question module.

---

## 4. Component Organization

### 4.1 src/components/ - Reusable UI

```
src/components/
├── ui/                       # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
│
└── layout/                   # [FUTURE] Layout components
    ├── navbar.tsx
    └── sidebar.tsx
```

### 4.2 src/features/ - Domain Modules

Feature modules contain domain-specific components, hooks, and types.

```
src/features/
├── auth/                     # [FUTURE] Auth feature
├── exam/                     # [FUTURE] Exam taking feature
├── questions/                # [FUTURE] Question management
├── papers/                   # [FUTURE] Paper management
└── results/                  # [FUTURE] Results feature
```

---

## 5. Current Development Stage

### MVP Complete
- ✅ All core features implemented
- ✅ Student portal: papers, exam taking, results, wrong book
- ✅ Admin portal: questions, papers, students management
- ✅ Authentication and RBAC
- ✅ Database schema with Prisma ORM

---

## 6. API Design (Server Actions)

This application uses **Next.js Server Actions** instead of traditional REST APIs. All data operations are performed through server-side functions called directly from components.

```
src/app/exam/
├── actions.ts               # Exam-related server actions
│
src/app/wrong-book/
├── actions.ts               # Wrong question server actions
│
src/app/admin/questions/
├── actions.ts               # Question CRUD server actions
```

### Server Action Patterns:
- Direct function calls from Client Components
- Type-safe input validation via Zod
- Repository pattern for data access

---

## 7. Environment Configuration

```
.env
├── DATABASE_URL          # PostgreSQL connection string
├── NODE_ENV              # development/production
└── NEXT_PUBLIC_APP_URL   # App URL (optional)
```

---

## 8. Error Handling (Planned)

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
