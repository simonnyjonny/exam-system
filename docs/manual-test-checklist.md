# Manual Testing Checklist

This document outlines the step-by-step manual testing process for the Online Exam System.

---

## Prerequisites

1. **Database Required**: You need PostgreSQL running locally
2. **Environment Setup**: Configure `.env` with your DATABASE_URL

---

## Setup Steps (Run in Order)

### Step 1: Configure Database
```bash
# Edit .env file with your PostgreSQL connection
DATABASE_URL="postgresql://user:password@localhost:5432/examdb?schema=public"
```

### Step 2: Generate Prisma Client
```bash
npm run db:generate
```

### Step 3: Push Schema to Database
```bash
npm run db:push
```

### Step 4: Seed Demo Data
```bash
npm run db:seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Open Browser
Navigate to: http://localhost:3000

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@exam.com | admin123 |
| Student | student@exam.com | student123 |
| Student | student2@exam.com | student123 |

---

## Test Flow (Recommended Order)

### Phase 1: Admin Tests

#### 1. Admin Login
- [ ] Go to http://localhost:3000/login
- [ ] Login with admin@exam.com / admin123
- [ ] Should redirect to /admin

#### 2. Create Subject (if needed)
- [ ] Navigate to /admin/papers
- [ ] Check if subjects exist (CS101, MATH101)
- [ ] If not, create subjects first via database

#### 3. Create Questions
- [ ] Go to /admin/questions
- [ ] Click "Create Question"
- [ ] Create at least 5 questions with different types:
  - 2 SINGLE_CHOICE questions
  - 1 MULTIPLE_CHOICE question
  - 1 TRUE_FALSE question
  - 1 FILL_BLANK question
- [ ] Mark questions as PUBLISHED

#### 4. Create Exam Paper
- [ ] Go to /admin/papers
- [ ] Create new paper with:
  - Title: "Test Exam"
  - Select subject
  - Add 3-5 questions
  - Duration: 30 minutes
  - Passing score: 60%
- [ ] Save as DRAFT

#### 5. Publish Paper
- [ ] Find the paper in the list
- [ ] Click "Publish" to make it available to students

#### 6. Admin Logout
- [ ] Click "Logout" in header

---

### Phase 2: Student Tests

#### 7. Student Login
- [ ] Go to http://localhost:3000/login
- [ ] Login with student@exam.com / student123
- [ ] Should redirect to /dashboard

#### 8. View Available Papers
- [ ] Go to /papers
- [ ] Should see the published exam paper

#### 9. Start Exam
- [ ] Click on exam paper
- [ ] Click "Start Exam" button
- [ ] Should navigate to exam taking page

#### 10. Take Exam
- [ ] Answer all questions
- [ ] Test SINGLE_CHOICE selection
- [ ] Test MULTIPLE_CHOICE (select multiple options)
- [ ] Test TRUE_FALSE
- [ ] Test FILL_BLANK
- [ ] Leave one question unanswered (to test unanswered handling)

#### 11. Submit Exam
- [ ] Click "Submit Exam"
- [ ] Confirm submission
- [ ] Should redirect to result page

#### 12. View Result
- [ ] Verify score percentage
- [ ] Verify PASS/FAIL status
- [ ] Check correct/incorrect/unanswered counts
- [ ] Review each question:
  - Student answer displayed correctly
  - Correct answer shown for wrong answers
  - No correct answers leaked for unanswered questions

#### 13. Continue In-Progress Exam
- [ ] Start exam again
- [ ] Don't submit
- [ ] Navigate away
- [ ] Return to /papers
- [ ] Click same exam
- [ ] Should see "Continue Exam" button
- [ ] Click to continue with previous answers

#### 14. View Wrong Book
- [ ] Go to /wrong-book
- [ ] Should see questions answered incorrectly
- [ ] Verify subject filter works
- [ ] Check wrong count display

---

## Expected Results

### Correct Answers
- Student answer shown in green
- Correct answer displayed

### Incorrect Answers  
- Student answer shown in red
- Correct answer displayed

### Unanswered Questions
- Shows "(No answer)"
- Marked as Unanswered in result summary

### Passing
- Score >= passingScore (e.g., 60%)
- Green "PASSED" badge

### Failing
- Score < passingScore
- Red "FAILED" badge

---

## Known Issues to Watch

1. **Route Conflict**: Fixed - `/exam/[paperId]` and `/exam/[attemptId]` now restructured
2. **Import Paths**: Fixed - question-form imports corrected
3. **LoginResult Export**: Fixed - type export for Server Actions compatibility

---

## Quick Test Commands

```bash
# Full reset
rm -rf .next
npm run db:generate
npm run db:push  
npm run db:seed
npm run dev

# Quick restart (if DB already set up)
npm run dev
```

---

## Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env

### "Module not found"
- Run `npm run db:generate`

### "Questions not showing in paper"
- Ensure questions are PUBLISHED status
- Refresh the page
