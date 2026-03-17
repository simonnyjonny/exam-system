# Product Requirements Document

## 1. Project Overview

### Project Name
Online Exam System

### Project Type
Full-stack web application (University examination platform)

### Core Functionality
A dual-portal online examination system enabling administrators to create and manage exams while providing students a seamless testing experience with instant results and performance analytics.

### Target Users
- **Primary**: University students taking online examinations
- **Secondary**: Professors/administrators managing questions and exams

---

## 2. User Portals

### 2.1 Admin Portal

#### Question Management
- **Upload Questions**: Bulk import via CSV/Excel, manual entry
- **Question Types**: Multiple choice, true/false, fill-in-blank, essay
- **Question Bank**: Categorize by subject, difficulty, topic
- **Edit/Delete**: Modify existing questions with version history
- **Search & Filter**: Find questions by content, type, category

#### Paper Management
- **Create Paper**: Assemble questions into exam papers
- **Set Parameters**: Time limit, passing score, randomize questions
- **Schedule Exams**: Define exam windows (start/end time)
- **Paper Templates**: Save reusable templates
- **Publish/Unpublish**: Control paper availability

#### Student Management
- **Student Directory**: View all registered students
- **Import Students**: Bulk import from CSV
- **Reset Password**: Admin-assisted password reset
- **View Activity**: Track student login and exam history

#### Results & Analytics
- **Exam Results**: View all submissions with scores
- **Statistics**: Pass rate, average score, score distribution
- **Export Reports**: Download results as CSV/PDF
- **Anti-cheat Alerts**: Flag suspicious behavior

### 2.2 Student Portal

#### Authentication
- **Login**: Email/password authentication
- **Session Management**: Automatic timeout handling

#### Exam Taking
- **Available Exams**: List of scheduled exams
- **Exam Interface**: Clean, distraction-free testing environment
- **Question Navigation**: Jump between questions, mark for review
- **Auto-save**: Periodic answer auto-save
- **Time Management**: Visible countdown, submission warning

#### Wrong Book (Mistake Review)
- **Review Mistakes**: View incorrect answers with explanations
- **Filter by Subject**: Category-based review
- **Re-attempt**: Practice similar questions

#### History & Reports
- **Exam History**: Past exam attempts with scores
- **Performance Trends**: Score progression over time
- **Download Papers**: Export completed exam papers

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC): Admin, Student
- Password requirements: minimum 8 characters
- Session timeout after 30 minutes of inactivity

### 3.2 Question Bank
| Feature | Description |
|---------|-------------|
| CRUD Operations | Create, read, update, delete questions |
| Question Types | MCQ (4 options), True/False, Fill-in, Essay |
| Difficulty Levels | Easy, Medium, Hard |
| Categories | Subject, Chapter, Topic tags |
| Media Support | Image upload for questions |

### 3.3 Exam Paper
| Feature | Description |
|---------|-------------|
| Paper Creation | Select questions, set scores |
| Time Limits | Configurable duration per paper |
| Randomization | Option to shuffle question/order |
| Passing Score | Configurable threshold |
| Anti-cheat | Browser tab switch detection |

### 3.4 Exam Taking
| Feature | Description |
|---------|-------------|
| Timer | Countdown with warnings at 10min, 5min |
| Navigation | Previous/Next, Jump to question |
| Mark for Review | Flag questions for later review |
| Submit | Final submission with confirmation |

### 3.5 Results
| Feature | Description |
|---------|-------------|
| Immediate Results | Auto-grade on submission (MCQ only) |
| Detailed Review | Show correct answers, explanations |
| Score Report | Breakdown by topic/section |
| Export | PDF download of results |

---

## 4. Non-Functional Requirements

### Performance
- Page load time: < 2 seconds
- Exam submission: < 3 seconds
- Support 1000+ concurrent users

### Security
- HTTPS only
- Password hashing (bcrypt)
- CSRF protection
- Input validation & sanitization
- SQL injection prevention (Prisma ORM)

### Usability
- Responsive design (mobile, tablet, desktop)
- Keyboard navigation support
- High contrast mode support

### Reliability
- 99.9% uptime during exam periods
- Auto-save every 30 seconds during exam
- Data backup daily

---

## 5. User Flows

### Admin: Create Exam Paper
1. Navigate to Admin > Papers
2. Click "Create New Paper"
3. Enter paper details (title, duration, passing score)
4. Select questions from bank or add new
5. Set question order and point values
6. Save as draft or publish

### Student: Take Exam
1. Login to student portal
2. View available exams
3. Click "Start" on desired exam
4. Read instructions, click "Begin"
5. Answer questions, navigate freely
6. Review marked questions
7. Submit exam
8. View immediate results

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| User Registration | 100% of enrolled students |
| Exam Completion Rate | > 95% |
| System Availability | 99.9% |
| User Satisfaction | > 4.5/5 |
| Support Tickets | < 10% of users |

---

## 7. Out of Scope (Phase 1)

- Real-time proctoring with video
- Payment integration
- Email notifications
- Mobile native apps
- Multi-language support
- Offline exam mode
