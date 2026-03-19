# API Specification

> **Note**: This application uses **Next.js Server Actions** instead of traditional REST APIs. The specification below describes the actual implemented behavior through server functions, not HTTP endpoints.

---

## 1. Implementation Approach

This application uses **Server Actions** for all data operations:
- Direct function calls from Client Components
- Type-safe parameters with Zod validation
- Repository pattern for data access layer

### Base Files:
- `src/app/exam/actions.ts` - Exam flow actions
- `src/app/wrong-book/actions.ts` - Wrong question actions
- `src/app/admin/questions/actions.ts` - Question CRUD actions
- `src/repositories/exam.repository.ts` - Exam data access

---

## 2. Response Format

### ActionResult<T>
```typescript
interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}
```

---

## 3. Server Actions

### 3.1 Exam Flow (Student)

#### fetchAvailablePapers(filter?)
Get list of available exam papers for student.

**Parameters:**
```typescript
interface ExamFilter {
  subjectId?: string;
  search?: string;
}
```

**Returns:**
```typescript
{ papers: ExamPaper[]; total: number }
```

---

#### startExamAction(paperId)
Start or continue an exam attempt.

**Parameters:**
```typescript
paperId: string
```

**Returns:**
```typescript
ActionResult<ExamAttempt>
{
  success: true,
  data: {
    id: string,
    paperId: string,
    studentId: string,
    attemptNo: number,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED',
    startTime: Date | null
  }
}
```

**Behavior:**
- Checks for existing IN_PROGRESS attempt
- If exists, returns existing attempt (continue exam)
- If not, creates new attempt and starts it

---

#### fetchQuestionsForExam(paperId)
Get questions for exam taking (without correct answers).

**Parameters:**
```typescript
paperId: string
```

**Returns:**
```typescript
ExamQuestionForTaking[] | null
// {
//   id: string,
//   questionId: string,
//   stem: string,
//   type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY',
//   options: string[],  // Available options for choice questions
//   sortOrder: number,
//   score: number
// }
```

---

#### submitAnswersAction(attemptId, answers)
Submit exam answers and trigger grading.

**Parameters:**
```typescript
{
  attemptId: string,
  answers: Array<{
    questionId: string,
    answer: string | string[]  // string for single/fill-blank, string[] for multiple choice
  }>
}
```

**Returns:**
```typescript
ActionResult<ExamResult>
{
  success: true,
  data: {
    attemptId: string,
    paperId: string,
    paperTitle: string,
    subjectName: string,
    attemptNo: number,
    status: 'GRADED',
    totalScore: number,
    passingScore: number,
    passed: boolean,
    questionResults: QuestionResult[]
  }
}
```

**Grading Logic:**
- Objective questions (SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE): Auto-graded
- FILL_BLANK: Auto-graded with case-insensitive comparison
- ESSAY: Returns `isCorrect: null`, requires manual grading

---

#### fetchResult(attemptId)
Fetch exam result with question-by-question breakdown.

**Parameters:**
```typescript
attemptId: string
```

**Returns:**
```typescript
ExamResult | null
// {
//   attemptId: string,
//   paperId: string,
//   paperTitle: string,
//   subjectName: string,
//   attemptNo: number,
//   totalScore: number,
//   passingScore: number,
//   passed: boolean,
//   questionResults: QuestionResult[]
// }
```

**QuestionResult:**
```typescript
{
  questionId: string,
  stem: string,
  type: QuestionType,
  studentAnswer: string | string[],
  correctAnswer: string | string[],
  isCorrect: boolean | null,  // null for ESSAY (not graded)
  score: number | null,
  maxScore: number
}
```

---

### 3.2 Wrong Book (Student)

#### fetchWrongQuestions()
Get all wrong questions for current student.

**Returns:**
```typescript
WrongQuestionItem[]
// [{
//   id: string,
//   questionId: string,
//   questionStem: string,
//   questionType: string,
//   subjectName: string,
//   wrongCount: number,
//   lastWrongAt: Date,
//   corrected: boolean
// }]
```

**Filters:**
- Only returns questions where `corrected === false`
- Ordered by `lastWrongAt` descending

---

### 3.3 Question Management (Admin)

#### fetchQuestions(filter?)
Get paginated question list.

**Parameters:**
```typescript
{
  page?: number,
  limit?: number,
  subjectId?: string,
  type?: QuestionType,
  difficulty?: Difficulty,
  search?: string
}
```

---

#### createQuestionAction(data)
Create a new question.

**Parameters:**
```typescript
{
  subjectId: string,
  type: QuestionType,
  stem: string,
  optionsJson?: string,    // JSON array for choice questions
  answerJson: string,      // Correct answer(s)
  analysis?: string,       // Explanation
  difficulty: Difficulty
}
```

---

#### updateQuestionAction(id, data)
Update existing question.

---

#### deleteQuestionAction(id)
Soft delete a question.

---

### 3.4 Paper Management (Admin)

#### fetchPapers(filter?)
Get paper list.

---

#### createPaperAction(data)
Create exam paper.

**Parameters:**
```typescript
{
  title: string,
  subjectId: string,
  description?: string,
  durationMinutes: number,
  passingScore: number,
  questionIds: string[]     // Selected question IDs
}
```

---

#### publishPaperAction(paperId)
Publish paper to make it available to students.

---

## 4. Database Entities

### ExamAttempt
```typescript
{
  id: string,
  paperId: string,
  studentId: string,
  attemptNo: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'EXPIRED',
  startTime: Date | null,
  submitTime: Date | null,
  totalScore: number | null,
  autoGradedAt: Date | null
}
```

### ExamAnswer
```typescript
{
  id: string,
  attemptId: string,
  questionId: string,
  studentAnswerJson: string,   // Serialized as JSON
  isCorrect: boolean | null,   // null until graded
  score: number | null,
  reviewedAt: Date | null      // For manual grading
}
```

### WrongQuestion
```typescript
{
  id: string,
  studentId: string,
  questionId: string,
  sourceAttemptId: string | null,
  wrongCount: number,
  lastWrongAt: Date,
  corrected: boolean,
  note: string | null
}
```

---

## 5. Security Considerations

- All student actions verify `session.userId === attempt.studentId`
- Exam answers never expose correct answers to client
- Question answers (answerJson) only fetched server-side during grading
- Role-based access control enforced via `guardStudent()` / `guardAdmin()`

---

## 6. Question Types

| Type | Grading | Answer Format |
|------|---------|---------------|
| SINGLE_CHOICE | Auto | string (e.g., "A") |
| MULTIPLE_CHOICE | Auto | string[] (e.g., ["A", "C"]) |
| TRUE_FALSE | Auto | string ("true"/"false") |
| FILL_BLANK | Auto | string |
| ESSAY | Manual | string |

---

## 7. Grading Flow

1. Student submits answers via `submitAnswersAction`
2. Server serializes answers and saves to `ExamAnswer`
3. Server updates attempt status to SUBMITTED
4. Server calls `gradeAttempt`:
   - For each question: grades and updates ExamAnswer
   - If incorrect: records to WrongQuestion table
   - Updates attempt status to GRADED
   - Calculates total score
5. Returns ExamResult to client
6. Student can view result at `/exam/[attemptId]/result`
