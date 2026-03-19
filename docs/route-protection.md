# Route Protection Strategy

## Current Approach (MVP)

Route protection is implemented via **page-level guards** in `src/lib/rbac.ts`. This is the primary and only protection mechanism for the MVP.

### Why No Middleware?

1. **Page-level guards are sufficient** - Each protected page explicitly calls a guard function
2. **Simplicity** - No additional configuration needed
3. **Flexibility** - Guards can be customized per-page if needed
4. **No overengineering** - Middleware adds complexity without clear benefit for MVP

### Future Enhancement

Middleware can be added later for:
- Coarse route grouping protection
- Rate limiting
- Request logging
- API route protection

When adding middleware, consider:
- Session validation via database (not cookie-only for security)
- Performance impact of database queries on every request
- Caching strategies

## Guard Functions

| Function | Purpose | Redirects To |
|----------|---------|--------------|
| `guardAdmin()` | Requires ADMIN role | `/login` or `/dashboard` |
| `guardStudent()` | Requires STUDENT role | `/login` or `/admin` |
| `guardAnyUser()` | Requires any authenticated user | `/login` |
| `guardGuest()` | Requires no session (for login/register pages) | `/admin` or `/dashboard` |

## Protected Routes

### Admin Routes (require ADMIN)
- `/admin` - guardAdmin()
- `/admin/questions` - guardAdmin()
- `/admin/papers` - guardAdmin()
- `/admin/students` - guardAdmin()

### Student Routes (require STUDENT)
- `/dashboard` - guardStudent() (via manual session check)
- `/papers` - guardStudent()
- `/wrong-book` - guardStudent()

### Guest Routes (require no session)
- `/login` - Currently allows both guests and authenticated users (minor MVP limitation)

### Public Routes
- `/` - Landing page (no auth required)
- `/logout` - Handles logout (no guard needed)

## Usage

```typescript
// In a protected page (Server Component)
import { guardAdmin } from '@/lib/rbac';

export default async function AdminPage() {
  await guardAdmin(); // Redirects if not admin
  // ... page content
}
```

## Manual Session Check (Alternative)

Some pages use manual session checks instead of guards:

```typescript
import { getSession } from '@/lib/auth';

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  // ... page content
}
```

This approach provides more flexibility but is more verbose.
