import { QuestionType } from '@prisma/client';

export interface GradingResult {
  isCorrect: boolean | null;
  score: number;
  feedback?: string;
}

export function gradeAnswer(
  questionType: QuestionType,
  studentAnswer: string | string[] | null,
  correctAnswer: string | string[] | null,
  maxScore: number
): GradingResult {
  console.log('[GRADE-FN] gradeAnswer called:', { questionType, studentAnswer, correctAnswer, maxScore });
  
  if (studentAnswer === null || studentAnswer === undefined || studentAnswer === '') {
    console.log('[GRADE-FN] Empty student answer, marking incorrect');
    return { isCorrect: false, score: 0 };
  }

  try {
    switch (questionType) {
      case 'SINGLE_CHOICE':
        console.log('[GRADE-FN] Calling gradeSingleChoice');
        return gradeSingleChoice(studentAnswer as string, correctAnswer as string, maxScore);
      
      case 'MULTIPLE_CHOICE':
        console.log('[GRADE-FN] Calling gradeMultipleChoice');
        return gradeMultipleChoice(studentAnswer as string[], correctAnswer as string[], maxScore);
      
      case 'TRUE_FALSE':
        console.log('[GRADE-FN] Calling gradeTrueFalse');
        return gradeTrueFalse(studentAnswer as string, correctAnswer as string, maxScore);
      
      case 'FILL_BLANK':
        console.log('[GRADE-FN] Calling gradeFillBlank');
        return gradeFillBlank(studentAnswer as string, correctAnswer as string, maxScore);
      
      case 'ESSAY':
        console.log('[GRADE-FN] Calling gradeEssay');
        return gradeEssay(studentAnswer as string, maxScore);
      
      default:
        console.log('[GRADE-FN] Unknown type:', questionType);
        return { isCorrect: null, score: 0, feedback: 'Unknown question type' };
    }
  } catch (err) {
    console.error('[GRADE-FN] ERROR in grading:', err);
    throw err;
  }
}

function gradeSingleChoice(studentAnswer: string, correctAnswer: string, maxScore: number): GradingResult {
  const isCorrect = studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  return {
    isCorrect,
    score: isCorrect ? maxScore : 0,
  };
}

function gradeMultipleChoice(studentAnswers: string[], correctAnswers: string[], maxScore: number): GradingResult {
  if (!Array.isArray(studentAnswers) || studentAnswers.length === 0) {
    return { isCorrect: false, score: 0 };
  }

  const normalizedStudent = new Set(
    studentAnswers.map(a => a.trim().toLowerCase()).filter(a => a !== '')
  );
  const normalizedCorrect = new Set(
    correctAnswers.map(a => a.trim().toLowerCase())
  );

  const isCorrect = 
    normalizedStudent.size === normalizedCorrect.size &&
    [...normalizedStudent].every(a => normalizedCorrect.has(a));

  return {
    isCorrect,
    score: isCorrect ? maxScore : 0,
  };
}

function gradeTrueFalse(studentAnswer: string, correctAnswer: string, maxScore: number): GradingResult {
  const normalizedStudent = studentAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  
  const studentBool = normalizedStudent === 'true' || normalizedStudent === 't' || normalizedStudent === '1';
  const correctBool = normalizedCorrect === 'true' || normalizedCorrect === 't' || normalizedCorrect === '1';
  
  const isCorrect = studentBool === correctBool;
  
  return {
    isCorrect,
    score: isCorrect ? maxScore : 0,
  };
}

function gradeFillBlank(studentAnswer: string, correctAnswer: string, maxScore: number): GradingResult {
  const normalizedStudent = studentAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  
  const isCorrect = normalizedStudent === normalizedCorrect;
  
  return {
    isCorrect,
    score: isCorrect ? maxScore : 0,
  };
}

function gradeEssay(studentAnswer: string, maxScore: number): GradingResult {
  if (!studentAnswer || studentAnswer.trim().length === 0) {
    return { isCorrect: null, score: 0, feedback: 'Essay requires manual grading' };
  }
  
  return {
    isCorrect: null,
    score: 0,
    feedback: 'Essay requires manual grading',
  };
}

export function parseQuestionAnswer(answerJson: string | string[] | null): string | string[] {
  console.log('[PARSE] parseQuestionAnswer input:', answerJson, 'type:', typeof answerJson);
  
  if (answerJson === null || answerJson === undefined) {
    console.log('[PARSE] null/undefined, returning empty string');
    return '';
  }
  
  if (typeof answerJson === 'string') {
    try {
      const parsed = JSON.parse(answerJson);
      console.log('[PARSE] parsed JSON:', parsed, 'type:', typeof parsed);
      
      if (parsed && typeof parsed === 'object') {
        if ('single' in parsed) {
          console.log('[PARSE] extracting single:', parsed.single);
          return parsed.single as string;
        }
        if ('multiple' in parsed) {
          console.log('[PARSE] extracting multiple:', parsed.multiple);
          return parsed.multiple as string[];
        }
        if ('trueFalse' in parsed) {
          console.log('[PARSE] extracting trueFalse:', parsed.trueFalse);
          return String(parsed.trueFalse);
        }
        if ('fillBlank' in parsed) {
          console.log('[PARSE] extracting fillBlank:', parsed.fillBlank);
          return parsed.fillBlank as string;
        }
        if ('essay' in parsed) {
          console.log('[PARSE] extracting essay:', parsed.essay);
          return parsed.essay as string;
        }
        console.log('[PARSE] unknown object structure');
        return '';
      }
      console.log('[PARSE] returning parsed:', parsed);
      return parsed;
    } catch (e) {
      console.log('[PARSE] JSON parse failed, returning original:', answerJson);
      return answerJson;
    }
  }
  
  // Handle when answerJson is already an object (not a string)
  if (answerJson && typeof answerJson === 'object') {
    console.log('[PARSE] answerJson is already an object:', answerJson);
    const parsed = answerJson as Record<string, unknown>;
    if ('single' in parsed) {
      console.log('[PARSE] extracting single from object:', parsed.single);
      return parsed.single as string;
    }
    if ('multiple' in parsed) {
      console.log('[PARSE] extracting multiple from object:', parsed.multiple);
      return parsed.multiple as string[];
    }
    if ('trueFalse' in parsed) {
      console.log('[PARSE] extracting trueFalse from object:', parsed.trueFalse);
      return String(parsed.trueFalse);
    }
    if ('fillBlank' in parsed) {
      console.log('[PARSE] extracting fillBlank from object:', parsed.fillBlank);
      return parsed.fillBlank as string;
    }
    if ('essay' in parsed) {
      console.log('[PARSE] extracting essay from object:', parsed.essay);
      return parsed.essay as string;
    }
    console.log('[PARSE] unknown object structure, returning empty');
    return '';
  }
  
  console.log('[PARSE] not string or object, returning:', answerJson);
  return answerJson;
}

export function parseQuestionOptions(optionsJson: string | null): string[] {
  if (!optionsJson) {
    return [];
  }
  
  try {
    const parsed = JSON.parse(optionsJson);
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    if (parsed.length === 0) {
      return [];
    }
    
    if (typeof parsed[0] === 'string') {
      return parsed as string[];
    }
    
    if (typeof parsed[0] === 'object' && parsed[0] !== null) {
      return parsed
        .map((opt: any) => opt.text)
        .filter((text): text is string => typeof text === 'string' && text.trim() !== '');
    }
    
    return [];
  } catch {
    return [];
  }
}

export function serializeStudentAnswer(answer: string | string[]): string {
  console.log('[SERIALIZE] input:', answer, 'isArray:', Array.isArray(answer));
  if (Array.isArray(answer)) {
    const result = JSON.stringify(answer);
    console.log('[SERIALIZE] array result:', result);
    return result;
  }
  console.log('[SERIALIZE] string result:', answer);
  return answer;
}

export function deserializeStudentAnswer(answerJson: string): string | string[] {
  console.log('[DESERIALIZE] input:', answerJson);
  try {
    const parsed = JSON.parse(answerJson);
    if (Array.isArray(parsed)) {
      console.log('[DESERIALIZE] array result:', parsed);
      return parsed;
    }
    console.log('[DESERIALIZE] string result:', answerJson);
    return answerJson;
  } catch {
    console.log('[DESERIALIZE] parse failed, returning string:', answerJson);
    return answerJson;
  }
}
