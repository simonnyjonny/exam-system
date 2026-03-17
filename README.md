# Online Exam System

A production-style online exam web application for university students, built with modern technologies.

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
- **Authentication**: JWT-based (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
exam-system/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utility functions
│   └── prisma/          # Database schema
├── docs/                # Documentation
├── public/              # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Documentation

- [Product Requirements](./docs/product-requirements.md)
- [System Architecture](./docs/system-architecture.md)
- [Database Design](./docs/database-design.md)
- [API Specification](./docs/api-spec.md)
- [Security Checklist](./docs/security-checklist.md)

## License

ISC
