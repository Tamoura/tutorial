import {
  Question,
  Answer,
  Evaluation,
  AgentResponse,
  AgentConfig,
  InterviewType
} from '../types';

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected currentQuestion: Question | null = null;
  protected questionHistory: Question[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract getNextQuestion(): Question;
  abstract evaluateAnswer(question: Question, answer: Answer): Evaluation;
  abstract provideHint(question: Question, attemptNumber: number): string;

  public startInterview(): AgentResponse {
    const question = this.getNextQuestion();
    this.currentQuestion = question;
    this.questionHistory.push(question);

    return {
      message: `Welcome! I'm the ${this.config.name}. Let's begin your ${this.config.type} interview.`,
      question,
      nextAction: 'answer_question'
    };
  }

  public submitAnswer(answer: Answer): AgentResponse {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }

    const evaluation = this.evaluateAnswer(this.currentQuestion, answer);

    // Check if we should continue
    if (this.questionHistory.length >= this.config.maxQuestions) {
      return {
        message: 'Interview completed! Thank you for your participation.',
        evaluation,
        nextAction: 'complete'
      };
    }

    // Get next question
    const nextQuestion = this.getNextQuestion();
    this.currentQuestion = nextQuestion;
    this.questionHistory.push(nextQuestion);

    return {
      message: 'Great! Here\'s your next question.',
      question: nextQuestion,
      evaluation,
      nextAction: 'answer_question'
    };
  }

  public requestHint(): AgentResponse {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }

    if (!this.config.enableHints) {
      return {
        message: 'Hints are not enabled for this interview.',
        nextAction: 'answer_question'
      };
    }

    const hint = this.provideHint(this.currentQuestion, this.questionHistory.length);

    return {
      message: 'Here\'s a hint to help you:',
      hints: [hint],
      question: this.currentQuestion,
      nextAction: 'answer_question'
    };
  }

  public getCurrentQuestion(): Question | null {
    return this.currentQuestion;
  }

  public getQuestionHistory(): Question[] {
    return this.questionHistory;
  }

  protected selectQuestionByDifficulty(questions: Question[]): Question {
    // Progressive difficulty: start easy, then medium, then hard
    const completedCount = this.questionHistory.length;

    if (completedCount < 2) {
      return questions.find(q => q.difficulty === 'easy') || questions[0];
    } else if (completedCount < 4) {
      return questions.find(q => q.difficulty === 'medium') || questions[0];
    } else {
      return questions.find(q => q.difficulty === 'hard') || questions[0];
    }
  }

  protected calculateScore(
    correctness: number,
    completeness: number,
    efficiency: number,
    clarity: number
  ): number {
    return Math.round(
      correctness * 0.4 +
      completeness * 0.3 +
      efficiency * 0.2 +
      clarity * 0.1
    );
  }
}
