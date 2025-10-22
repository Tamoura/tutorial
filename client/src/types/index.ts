export enum InterviewType {
  CODING = 'coding',
  SYSTEM_DESIGN = 'system_design',
  BEHAVIORAL = 'behavioral',
  COMPREHENSIVE = 'comprehensive'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestionCategory {
  ALGORITHMS = 'algorithms',
  DATA_STRUCTURES = 'data_structures',
  SYSTEM_DESIGN = 'system_design',
  BEHAVIORAL = 'behavioral',
  CODING_PATTERNS = 'coding_patterns'
}

export interface Question {
  id: string;
  type: InterviewType;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  hints?: string[];
  expectedAnswer?: string;
  evaluationCriteria?: string[];
  timeLimit?: number;
}

export interface Answer {
  questionId: string;
  content: string;
  submittedAt: Date;
  timeSpent?: number;
}

export interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  detailedAnalysis?: string;
}

export interface InterviewSession {
  id: string;
  type: InterviewType;
  candidateName?: string;
  startedAt: Date;
  endedAt?: Date;
  questions: Question[];
  answers: Answer[];
  evaluations: Evaluation[];
  overallScore?: number;
  status: 'active' | 'completed' | 'paused';
}

export interface AgentResponse {
  message: string;
  question?: Question;
  evaluation?: Evaluation;
  hints?: string[];
  nextAction?: string;
  session?: InterviewSession;
}

export interface InterviewTypeInfo {
  id: InterviewType;
  name: string;
  description: string;
  icon: string;
  maxQuestions: number;
}
