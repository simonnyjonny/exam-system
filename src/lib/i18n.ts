export type Language = 'zh' | 'en';

export interface Translations {
  // Common
  common: {
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    back: string;
    search: string;
    filter: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
    actions: string;
    status: string;
    total: string;
    backToList: string;
    noData: string;
    required: string;
  };
  
  // Auth
  auth: {
    login: string;
    logout: string;
    username: string;
    password: string;
    loginButton: string;
    loginError: string;
    selectRole: string;
  };
  
  // Nav
  nav: {
    dashboard: string;
    papers: string;
    wrongBook: string;
    admin: string;
    questions: string;
    students: string;
    questionBank: string;
    paperManagement: string;
    studentManagement: string;
    examResults: string;
  };
  
  // Question
  question: {
    title: string;
    createTitle: string;
    editTitle: string;
    stem: string;
    type: string;
    subject: string;
    difficulty: string;
    options: string;
    correctAnswer: string;
    referenceAnswer: string;
    analysis: string;
    tags: string;
    status: string;
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    deleteConfirm: string;
    singleChoice: string;
    multipleChoice: string;
    trueFalse: string;
    fillBlank: string;
    essay: string;
    easy: string;
    medium: string;
    hard: string;
    draft: string;
    published: string;
    archived: string;
    selectCorrectAnswer: string;
    noCorrectAnswer: string;
    selectSubject: string;
    selectType: string;
  };
  
  // Paper
  paper: {
    title: string;
    createTitle: string;
    editTitle: string;
    subject: string;
    duration: string;
    passingScore: string;
    description: string;
    questions: string;
    totalQuestions: string;
    totalScore: string;
    status: string;
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    publishSuccess: string;
    deleteConfirm: string;
    draft: string;
    published: string;
    archived: string;
    minutes: string;
    points: string;
    selectQuestions: string;
    noQuestions: string;
    questionCount: string;
    questionPoints: string;
  };
  
  // Exam
  exam: {
    startExam: string;
    continueExam: string;
    submitExam: string;
    examInProgress: string;
    examCompleted: string;
    timeRemaining: string;
    questionNum: string;
    selectOption: string;
    unansweredWarning: string;
    unansweredConfirm: string;
    submitSuccess: string;
    examExpired: string;
    attemptId: string;
    instructions: string;
    instructionsList: string[];
    importantNotes: string;
    previousAttempts: string;
    resultTitle: string;
    score: string;
    passed: string;
    failed: string;
    correct: string;
    incorrect: string;
    unanswered: string;
    yourAnswer: string;
    correctAnswer: string;
    questionReview: string;
    takeAgain: string;
    autoGraded: string;
    manualGraded: string;
    passed: string;
  };
  
  // Result
  result: {
    title: string;
    score: string;
    passed: string;
    failed: string;
    correctCount: string;
    incorrectCount: string;
    unansweredCount: string;
    viewDetails: string;
  };
  
  // Wrong Book
  wrongBook: {
    title: string;
    empty: string;
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    timesWrong: string;
    practiceAgain: string;
    clearRecord: string;
  };
  
  // Dashboard
  dashboard: {
    welcome: string;
    takeExam: string;
    myResults: string;
    wrongBook: string;
    examHistory: string;
    noExams: string;
    noResults: string;
  };
  
  // Student
  student: {
    papers: string;
    availablePapers: string;
    noPapers: string;
    startTime: string;
    status: string;
    notStarted: string;
    inProgress: string;
    submitted: string;
    graded: string;
    expired: string;
    retake: string;
    viewResult: string;
  };
}

const zh: Translations = {
  common: {
    submit: '提交',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    back: '返回',
    search: '搜索',
    filter: '筛选',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    yes: '是',
    no: '否',
    actions: '操作',
    status: '状态',
    total: '共计',
    backToList: '返回列表',
    noData: '暂无数据',
    required: '必填',
  },
  
  auth: {
    login: '登录',
    logout: '退出登录',
    username: '用户名',
    password: '密码',
    loginButton: '登 录',
    loginError: '用户名或密码错误',
    selectRole: '选择角色',
  },
  
  nav: {
    dashboard: '控制台',
    papers: '试卷',
    wrongBook: '错题本',
    admin: '管理',
    questions: '题目管理',
    students: '学生管理',
    questionBank: '题库',
    paperManagement: '试卷管理',
    studentManagement: '学生管理',
    examResults: '考试成绩',
  },
  
  question: {
    title: '题目管理',
    createTitle: '创建题目',
    editTitle: '编辑题目',
    stem: '题目内容',
    type: '题目类型',
    subject: '所属科目',
    difficulty: '难度',
    options: '选项',
    correctAnswer: '正确答案',
    referenceAnswer: '参考答案',
    analysis: '答案解析',
    tags: '标签',
    status: '状态',
    createSuccess: '题目创建成功',
    updateSuccess: '题目更新成功',
    deleteSuccess: '题目删除成功',
    deleteConfirm: '确定要删除这道题目吗？',
    singleChoice: '单选题',
    multipleChoice: '多选题',
    trueFalse: '判断题',
    fillBlank: '填空题',
    essay: '简答题',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
    selectCorrectAnswer: '选择正确答案',
    noCorrectAnswer: '未选择正确答案',
    selectSubject: '选择科目',
    selectType: '选择类型',
  },
  
  paper: {
    title: '试卷管理',
    createTitle: '创建试卷',
    editTitle: '编辑试卷',
    subject: '所属科目',
    duration: '考试时长',
    passingScore: '及格分数',
    description: '试卷描述',
    questions: '题目',
    totalQuestions: '总题数',
    totalScore: '总分',
    status: '状态',
    createSuccess: '试卷创建成功',
    updateSuccess: '试卷更新成功',
    deleteSuccess: '试卷删除成功',
    publishSuccess: '试卷发布成功',
    deleteConfirm: '确定要删除这份试卷吗？',
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
    minutes: '分钟',
    points: '分',
    selectQuestions: '选择题目',
    noQuestions: '暂无题目',
    questionCount: '题目数量',
    questionPoints: '题目分值',
  },
  
  exam: {
    startExam: '开始考试',
    continueExam: '继续考试',
    submitExam: '提交试卷',
    examInProgress: '考试进行中',
    examCompleted: '考试已完成',
    timeRemaining: '剩余时间',
    questionNum: '第 {n} 题',
    selectOption: '请选择一个选项',
    unansweredWarning: '您有 {n} 道题目未作答',
    unansweredConfirm: '确定要提交吗？',
    submitSuccess: '试卷提交成功',
    examExpired: '考试已过期',
    attemptId: '考试ID',
    instructions: '考试须知',
    instructionsList: [
      '开始答题后，计时器开始计时',
      '您必须在规定时间内提交试卷',
      '提交前可以修改答案',
      '提交后将不能修改答案',
      '错题会自动记录到错题本',
    ],
    importantNotes: '重要提示',
    previousAttempts: '历史考试次数',
    resultTitle: '考试成绩',
    score: '得分',
    passed: '及格',
    failed: '不及格',
    correct: '正确',
    incorrect: '错误',
    unanswered: '未答',
    yourAnswer: '你的答案',
    correctAnswer: '正确答案',
    questionReview: '题目回顾',
    takeAgain: '再次考试',
    autoGraded: '自动评分',
    manualGraded: '人工评分',
  },
  
  result: {
    title: '考试成绩',
    score: '得分',
    passed: '及格',
    failed: '不及格',
    correctCount: '正确题数',
    incorrectCount: '错误题数',
    unansweredCount: '未答题数',
    viewDetails: '查看详情',
  },
  
  wrongBook: {
    title: '错题本',
    empty: '暂无错题记录',
    question: '题目',
    yourAnswer: '你的答案',
    correctAnswer: '正确答案',
    timesWrong: '错误次数',
    practiceAgain: '再练一次',
    clearRecord: '清除记录',
  },
  
  dashboard: {
    welcome: '欢迎回来',
    takeExam: '参加考试',
    myResults: '我的成绩',
    wrongBook: '错题本',
    examHistory: '考试记录',
    noExams: '暂无考试',
    noResults: '暂无成绩',
  },
  
  student: {
    papers: '试卷列表',
    availablePapers: '可参加的考试',
    noPapers: '暂无可用试卷',
    startTime: '开始时间',
    status: '状态',
    notStarted: '未开始',
    inProgress: '进行中',
    submitted: '已提交',
    graded: '已评分',
    expired: '已过期',
    retake: '重新考试',
    viewResult: '查看成绩',
  },
};

const en: Translations = {
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    actions: 'Actions',
    status: 'Status',
    total: 'Total',
    backToList: 'Back to List',
    noData: 'No Data',
    required: 'Required',
  },
  
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    loginError: 'Invalid username or password',
    selectRole: 'Select Role',
  },
  
  nav: {
    dashboard: 'Dashboard',
    papers: 'Papers',
    wrongBook: 'Wrong Book',
    admin: 'Admin',
    questions: 'Questions',
    students: 'Students',
    questionBank: 'Question Bank',
    paperManagement: 'Papers',
    studentManagement: 'Students',
    examResults: 'Results',
  },
  
  question: {
    title: 'Questions',
    createTitle: 'Create Question',
    editTitle: 'Edit Question',
    stem: 'Question Stem',
    type: 'Question Type',
    subject: 'Subject',
    difficulty: 'Difficulty',
    options: 'Options',
    correctAnswer: 'Correct Answer',
    referenceAnswer: 'Reference Answer',
    analysis: 'Analysis',
    tags: 'Tags',
    status: 'Status',
    createSuccess: 'Question created successfully',
    updateSuccess: 'Question updated successfully',
    deleteSuccess: 'Question deleted successfully',
    deleteConfirm: 'Are you sure you want to delete this question?',
    singleChoice: 'Single Choice',
    multipleChoice: 'Multiple Choice',
    trueFalse: 'True/False',
    fillBlank: 'Fill in Blank',
    essay: 'Essay',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    selectCorrectAnswer: 'Select Correct Answer',
    noCorrectAnswer: 'No correct answer selected',
    selectSubject: 'Select Subject',
    selectType: 'Select Type',
  },
  
  paper: {
    title: 'Papers',
    createTitle: 'Create Paper',
    editTitle: 'Edit Paper',
    subject: 'Subject',
    duration: 'Duration',
    passingScore: 'Passing Score',
    description: 'Description',
    questions: 'Questions',
    totalQuestions: 'Total Questions',
    totalScore: 'Total Score',
    status: 'Status',
    createSuccess: 'Paper created successfully',
    updateSuccess: 'Paper updated successfully',
    deleteSuccess: 'Paper deleted successfully',
    publishSuccess: 'Paper published successfully',
    deleteConfirm: 'Are you sure you want to delete this paper?',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    minutes: 'minutes',
    points: 'points',
    selectQuestions: 'Select Questions',
    noQuestions: 'No Questions',
    questionCount: 'Question Count',
    questionPoints: 'Points',
  },
  
  exam: {
    startExam: 'Start Exam',
    continueExam: 'Continue Exam',
    submitExam: 'Submit Exam',
    examInProgress: 'Exam In Progress',
    examCompleted: 'Exam Completed',
    timeRemaining: 'Time Remaining',
    questionNum: 'Question {n}',
    selectOption: 'Select an option',
    unansweredWarning: 'You have {n} unanswered question(s)',
    unansweredConfirm: 'Are you sure you want to submit?',
    submitSuccess: 'Exam submitted successfully',
    examExpired: 'Exam has expired',
    attemptId: 'Attempt ID',
    instructions: 'Instructions',
    instructionsList: [
      'Once you start, the timer will begin',
      'You must submit before the time expires',
      'You can change your answers before submitting',
      'After submission, you cannot change your answers',
      'Wrong answers will be recorded in your wrong question book',
    ],
    importantNotes: 'Important Instructions',
    previousAttempts: 'Previous Attempts',
    resultTitle: 'Exam Result',
    score: 'Score',
    passed: 'Passed',
    failed: 'Failed',
    correct: 'Correct',
    incorrect: 'Incorrect',
    unanswered: 'Unanswered',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    questionReview: 'Question Review',
    takeAgain: 'Take Again',
    autoGraded: 'Auto Graded',
    manualGraded: 'Manual Graded',
  },
  
  result: {
    title: 'Exam Result',
    score: 'Score',
    passed: 'Passed',
    failed: 'Failed',
    correctCount: 'Correct',
    incorrectCount: 'Incorrect',
    unansweredCount: 'Unanswered',
    viewDetails: 'View Details',
  },
  
  wrongBook: {
    title: 'Wrong Book',
    empty: 'No wrong answers yet',
    question: 'Question',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    timesWrong: 'Times Wrong',
    practiceAgain: 'Practice Again',
    clearRecord: 'Clear Record',
  },
  
  dashboard: {
    welcome: 'Welcome',
    takeExam: 'Take an Exam',
    myResults: 'My Results',
    wrongBook: 'Wrong Book',
    examHistory: 'Exam History',
    noExams: 'No Exams Available',
    noResults: 'No Results Yet',
  },
  
  student: {
    papers: 'Papers',
    availablePapers: 'Available Exams',
    noPapers: 'No Papers Available',
    startTime: 'Start Time',
    status: 'Status',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    submitted: 'Submitted',
    graded: 'Graded',
    expired: 'Expired',
    retake: 'Retake',
    viewResult: 'View Result',
  },
};

export const translations: Record<Language, Translations> = { zh, en };

export function getTranslation(lang: Language): Translations {
  return translations[lang];
}
