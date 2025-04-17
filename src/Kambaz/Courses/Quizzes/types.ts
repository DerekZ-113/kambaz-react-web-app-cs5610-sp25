export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  quizType: 'GRADED_QUIZ' | 'PRACTICE_QUIZ' | 'GRADED_SURVEY' | 'UNGRADED_SURVEY';
  points: number;
  assignmentGroup?: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptsAllowed: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string | null;
  availableDate?: string | null;
  untilDate?: string | null;
  published: boolean;
  creator?: string;
  questionCount?: number;
}

export interface User {
  _id: string;
  username: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'USER';
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface QuizCardProps {
  quiz: Quiz;
  userRole: string;
  cid: string;  // Changed from courseId to cid
  onQuizUpdated?: () => void;
}

export interface FacultyControlsProps {
  quiz: Quiz;
  cid: string;  // Changed from courseId to cid
  onQuizUpdated?: () => void;
}

export interface StudentControlsProps {
  quiz: Quiz;
  cid: string;  // Changed from courseId to cid
}

export interface QuizzesListProps {
  currentUser: User | null;
}

// Add this Choice interface for multiple choice questions
export interface Choice {
  _id: string;
  text: string;
}

// Add the base Question interface
export interface Question {
  _id: string;
  title: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  points: number;
  position?: number;
  quizId: string;
  
  // Multiple choice specific properties
  choices?: Choice[];
  correctChoiceIndex?: number;
  
  // True/False specific property
  correctAnswer?: boolean;
  
  // Fill in the blank specific property
  possibleAnswers?: string[];
}

// Add this interface for quiz attempts
export interface QuizAttempt {
  _id: string;
  quiz: string;
  user: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  score: number;
  answers: QuestionAnswer[];
}

// Add this interface for question answers
export interface QuestionAnswer {
  questionId: string;
  answer: any;
  correct: boolean;
  points: number;
}