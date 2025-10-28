export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
}

export interface Quiz {
  topic: string;
  questions: Question[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  isComplete: boolean;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export type AppState = 'landing' | 'quiz' | 'results';