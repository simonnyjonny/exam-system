# System Architecture

## 1. Architecture Overview

This application follows a **monolithic architecture** using Next.js App Router with a relational database. The architecture is designed for simplicity while maintaining scalability for university-scale deployments.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Browser   │  │    Mobile   │  │   Tablet/Desktop   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Next.js App Server                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │   API    │  │  Pages   │  │Components│  │  Hooks   │ │ │
│  │  │ Routes   │  │ (RSC)    │  │          │  │          │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
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

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | Framework, SSR, Routing |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | Component Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API | - | API Routes |
| Prisma | 6.x | ORM |
| PostgreSQL | 14+ | Database |

### Development
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |

---

## 3. Application Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth-related pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Student dashboard
│   │   ├── dashboard/
│   │   ├── papers/
│   │   ├── wrong-book/
│   │   └── history/
│   ├── (admin)/             # Admin portal
│   │   ├── admin/
│   │   ├── questions/
│   │   ├── papers/
│   │   └── students/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── questions/
│   │   ├── papers/
│   │   └── results/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── exam/               # Exam-specific components
│       ├── question-card.tsx
│       ├── timer.tsx
│       └── navigation.tsx
│
├── lib/                     # Utility functions
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Auth utilities
│   ├── utils.ts           # General utilities
│   └── validations.ts    # Zod schemas
│
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
│
└── types/                  # TypeScript types
    ├── question.ts
    ├── user.ts
    └── exam.ts
```

---

## 4. API Design Pattern

### RESTful API Structure

```
/api
├── /auth
│   ├── POST   /login          # User login
│   ├── POST   /logout         # User logout
│   ├── POST   /refresh       # Refresh token
│   └── POST   /register      # Student registration
│
├── /questions
│   ├── GET    /               # List questions
│   ├── POST   /               # Create question
│   ├── GET    /[id]           # Get question
│   ├── PUT    /[id]           # Update question
│   └── DELETE /[id]           # Delete question
│
├── /papers
│   ├── GET    /               # List papers
│   ├── POST   /               # Create paper
│   ├── GET    /[id]           # Get paper
│   ├── PUT    /[id]           # Update paper
│   ├── DELETE /[id]           # Delete paper
│   └── GET    /[id]/questions # Get paper questions
│
├── /exams
│   ├── GET    /available      # Available exams
│   ├── POST   /[id]/start     # Start exam
│   ├── POST   /[id]/submit    # Submit exam
│   └── GET    /[id]/result    # Get result
│
├── /results
│   ├── GET    /               # List results
│   ├── GET    /[id]           # Get result
│   └── GET    /student/[id]   # Student results
│
└── /users
    ├── GET    /               # List users (admin)
    ├── GET    /[id]           # Get user
    ├── PUT    /[id]           # Update user
    └── DELETE /[id]           # Delete user
```

---

## 5. Data Flow

### Exam Submission Flow
```
1. User submits answers
2. Frontend validates answers
3. API receives POST /api/exams/[id]/submit
4. Server authenticates token
5. Server fetches paper and correct answers
6. Server grades each question
7. Server calculates total score
8. Server saves result to database
9. Server returns result to client
10. Client displays results page
```

---

## 6. Security Architecture

### Authentication Flow
```
┌──────────┐     ┌───────────┐     ┌────────────┐
│  Client  │────▶│  Next.js  │────▶│ Database   │
│          │◀────│  API      │◀────│ (Postgres) │
└──────────┘     └───────────┘     └────────────┘
     │               │
     │               ▼
     │         ┌───────────┐
     │         │   JWT     │
     │         │  Validate │
     │         └───────────┘
     ▼
┌──────────┐
│  Store   │
│  Token   │
└──────────┘
```

### Security Layers
1. **Transport**: HTTPS only
2. **Authentication**: JWT with short expiry
3. **Authorization**: Role-based middleware
4. **Data**: Prisma parameterized queries
5. **Validation**: Zod schemas on all inputs

---

## 7. Deployment Architecture

### Development
- Local development server
- Local PostgreSQL database

### Production (Recommended)
- **Hosting**: Vercel / AWS EC2 / DigitalOcean
- **Database**: PostgreSQL (managed: RDS, Supabase, Neon)
- **Storage**: S3 for media files
- **CDN**: CloudFront for static assets

---

## 8. Scalability Considerations

### Horizontal Scaling
- Stateless API routes
- Session data in database
- CDN for static assets

### Database Optimization
- Indexes on frequently queried fields
- Pagination for list endpoints
- Connection pooling (Prisma)

### Caching Strategy
- React Query for client caching
- Server-side caching for static data
- Redis for session storage (optional)

---

## 9. Environment Configuration

```
.env
├── DATABASE_URL          # PostgreSQL connection
├── JWT_SECRET            # JWT signing key
├── JWT_EXPIRES_IN        # Token expiry time
├── NODE_ENV              # development/production
└── NEXT_PUBLIC_APP_URL   # App URL for CORS
```

---

## 10. Error Handling

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details?: Record<string, unknown>
  }
}
```

### Error Codes
| Code | Description |
|------|-------------|
| UNAUTHORIZED | Invalid or missing token |
| FORBIDDEN | Insufficient permissions |
| NOT_FOUND | Resource not found |
| VALIDATION_ERROR | Invalid input data |
| INTERNAL_ERROR | Server error |
