# Online Exam System

A production-style online exam web application for university students.

## Project Status

**Stage:** Student Exam-Taking Module Implemented

The project now has working authentication with role-based access control, admin question management module, admin paper management module, and student exam-taking module with auto-grading.

## Features

### Admin Portal
- Question management (upload, edit, delete)
- Exam paper creation and management
- Student management
- Results review and analytics

### Student Portal
- Secure login
- Online examination
- Wrong answer review (wrong book)
- Exam history
- Paper download

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Session-based with bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd online-exam-system

# Install dependencies
npm install

# Copy environment file and configure DATABASE_URL
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Seed database with demo accounts
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@exam.com | admin123 |
| Student | student@exam.com | student123 |
| Student | student2@exam.com | student123 |

## Current Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Homepage | Public |
| `/login` | Login page | Public |
| `/dashboard` | Student dashboard | Student only |
| `/papers` | Available exam papers | Student only |
| `/exam/[paperId]` | Start/continue exam | Student only |
| `/exam/[paperId]/take` | Take exam | Student only |
| `/exam/[attemptId]/result` | Exam result | Student only |
| `/wrong-book` | Wrong questions review | Student only |
| `/admin` | Admin overview | Admin only |
| `/admin/questions` | Question list | Admin only |
| `/admin/questions/new` | Create question | Admin only |
| `/admin/questions/[id]` | Edit question | Admin only |
| `/admin/papers` | Paper management | Admin only |
| `/admin/students` | Student management | Admin only |

## Project Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── admin/
│   │   └── questions/          # Question management
│   │       ├── actions.ts
│   │       └── ...
│   ├── exam/                    # Student exam flow
│   │   ├── actions.ts          # Exam server actions
│   │   └── [paperId]/
│   │       ├── page.tsx        # Start/continue exam
│   │       └── take/
│   │           └── page.tsx   # Exam taking page
│   ├── exam/                    # Exam results
│   │   └── [attemptId]/
│   │       └── result/
│   │           └── page.tsx   # Result page
│   ├── wrong-book/             # Wrong question review
│   │   ├── actions.ts
│   │   └── page.tsx
│   └── ...
├── components/                  # Reusable UI components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utility functions
│   ├── auth/                   # Authentication
│   ├── rbac.ts                 # Role-based access
│   ├── prisma.ts               # Prisma client
│   ├── grading.ts              # Answer grading
│   └── validators/             # Input validation
├── repositories/               # Data access layer
│   ├── exam.repository.ts      # Exam data access
│   └── question.repository.ts   # Question data access
├── types/                      # TypeScript definitions
│   ├── exam.ts                 # Exam types
│   └── question.ts             # Question types
└── prisma/                     # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

## Documentation

- [Product Requirements](./docs/product-requirements.md)
- [System Architecture](./docs/system-architecture.md)
- [Database Design](./docs/database-design.md)
- [API Specification](./docs/api-spec.md)
- [Security Checklist](./docs/security-checklist.md)

## License

ISC
