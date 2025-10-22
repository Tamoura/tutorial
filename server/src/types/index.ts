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
  timeLimit?: number; // in minutes
}

export interface Answer {
  questionId: string;
  content: string;
  submittedAt: Date;
  timeSpent?: number; // in seconds
}

export interface Evaluation {
  score: number; // 0-100
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
}

export interface AgentConfig {
  name: string;
  type: InterviewType;
  maxQuestions: number;
  enableHints: boolean;
  enableRealTimeFeedback: boolean;
}
