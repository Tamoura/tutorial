import { BaseAgent } from './BaseAgent';
import { CodingInterviewAgent } from './CodingInterviewAgent';
import { SystemDesignAgent } from './SystemDesignAgent';
import { BehavioralAgent } from './BehavioralAgent';
import {
  Question,
  Answer,
  Evaluation,
  AgentResponse,
  InterviewType,
  InterviewSession
} from '../types';
import { v4 as uuidv4 } from 'uuid';

export class OrchestratorAgent extends BaseAgent {
  private codingAgent: CodingInterviewAgent;
  private systemDesignAgent: SystemDesignAgent;
  private behavioralAgent: BehavioralAgent;
  private currentAgent: BaseAgent | null = null;
  private session: InterviewSession;
  private currentPhase: 'coding' | 'system_design' | 'behavioral' | 'completed' = 'coding';

  constructor() {
    super({
      name: 'Comprehensive Interview Orchestrator',
      type: InterviewType.COMPREHENSIVE,
      maxQuestions: 8, // Total across all agents
      enableHints: true,
      enableRealTimeFeedback: true
    });

    this.codingAgent = new CodingInterviewAgent();
    this.systemDesignAgent = new SystemDesignAgent();
    this.behavioralAgent = new BehavioralAgent();

    this.session = {
      id: uuidv4(),
      type: InterviewType.COMPREHENSIVE,
      startedAt: new Date(),
      questions: [],
      answers: [],
      evaluations: [],
      status: 'active'
    };
  }

  public startInterview(): AgentResponse {
    this.currentAgent = this.codingAgent;
    this.currentPhase = 'coding';

    const response = this.codingAgent.startInterview();

    if (response.question) {
      this.session.questions.push(response.question);
      this.currentQuestion = response.question;
    }

    return {
      message: `Welcome to the Comprehensive Technical Interview!

This interview consists of three phases:
1. 🖥️  Coding Interview (${this.codingAgent['config'].maxQuestions} questions)
2. 🏗️  System Design Interview (${this.systemDesignAgent['config'].maxQuestions} questions)
3. 💬 Behavioral Interview (${this.behavioralAgent['config'].maxQuestions} questions)

Let's begin with the coding phase!

${response.message}`,
      question: response.question,
      nextAction: 'answer_question'
    };
  }

  public submitAnswer(answer: Answer): AgentResponse {
    if (!this.currentAgent || !this.currentQuestion) {
      throw new Error('No active interview phase or question');
    }

    // Store the answer
    this.session.answers.push(answer);

    // Evaluate with current agent
    const evaluation = this.currentAgent.evaluateAnswer(this.currentQuestion, answer);
    this.session.evaluations.push(evaluation);

    // Check if current agent has more questions
    const currentAgentDone = this.isCurrentAgentDone();

    if (currentAgentDone) {
      return this.transitionToNextPhase();
    }

    // Get next question from current agent
    const nextQuestion = this.currentAgent.getNextQuestion();
    this.currentQuestion = nextQuestion;
    this.session.questions.push(nextQuestion);

    return {
      message: `Good work! Here's your evaluation and next question.`,
      question: nextQuestion,
      evaluation,
      nextAction: 'answer_question'
    };
  }

  public requestHint(): AgentResponse {
    if (!this.currentAgent || !this.currentQuestion) {
      throw new Error('No active question');
    }

    return this.currentAgent.requestHint();
  }

  public getNextQuestion(): Question {
    if (!this.currentAgent) {
      throw new Error('No active agent');
    }
    return this.currentAgent.getNextQuestion();
  }

  public evaluateAnswer(question: Question, answer: Answer): Evaluation {
    if (!this.currentAgent) {
      throw new Error('No active agent');
    }
    return this.currentAgent.evaluateAnswer(question, answer);
  }

  public provideHint(question: Question, attemptNumber: number): string {
    if (!this.currentAgent) {
      throw new Error('No active agent');
    }
    return this.currentAgent.provideHint(question, attemptNumber);
  }

  public getSession(): InterviewSession {
    return this.session;
  }

  public getOverallScore(): number {
    if (this.session.evaluations.length === 0) {
      return 0;
    }

    const totalScore = this.session.evaluations.reduce(
      (sum, eval) => sum + eval.score,
      0
    );

    return Math.round(totalScore / this.session.evaluations.length);
  }

  private isCurrentAgentDone(): boolean {
    if (!this.currentAgent) return true;

    const history = this.currentAgent.getQuestionHistory();
    const maxQuestions = this.currentAgent['config'].maxQuestions;

    return history.length >= maxQuestions;
  }

  private transitionToNextPhase(): AgentResponse {
    let message = '';
    let nextQuestion: Question | undefined;

    if (this.currentPhase === 'coding') {
      // Move to system design
      this.currentPhase = 'system_design';
      this.currentAgent = this.systemDesignAgent;

      const response = this.systemDesignAgent.startInterview();
      nextQuestion = response.question;

      if (nextQuestion) {
        this.session.questions.push(nextQuestion);
        this.currentQuestion = nextQuestion;
      }

      message = `
Great job completing the coding phase! 🎉

Phase 1 Complete: Coding Interview ✓
Your average score so far: ${this.getPhaseScore('coding')}%

Now let's move to Phase 2: System Design Interview 🏗️

${response.message}
      `.trim();

    } else if (this.currentPhase === 'system_design') {
      // Move to behavioral
      this.currentPhase = 'behavioral';
      this.currentAgent = this.behavioralAgent;

      const response = this.behavioralAgent.startInterview();
      nextQuestion = response.question;

      if (nextQuestion) {
        this.session.questions.push(nextQuestion);
        this.currentQuestion = nextQuestion;
      }

      message = `
Excellent work on system design! 🎉

Phase 2 Complete: System Design Interview ✓
Your average score so far: ${this.getPhaseScore('system_design')}%

Now let's move to Phase 3: Behavioral Interview 💬

${response.message}
      `.trim();

    } else {
      // Interview complete
      this.currentPhase = 'completed';
      this.session.status = 'completed';
      this.session.endedAt = new Date();
      this.session.overallScore = this.getOverallScore();

      const summary = this.generateInterviewSummary();

      message = `
🎊 Congratulations! You've completed all three phases of the interview! 🎊

${summary}

Thank you for participating in this comprehensive interview.
      `.trim();

      return {
        message,
        nextAction: 'complete'
      };
    }

    return {
      message,
      question: nextQuestion,
      nextAction: 'answer_question'
    };
  }

  private getPhaseScore(phase: 'coding' | 'system_design' | 'behavioral'): number {
    const phaseQuestions = this.session.questions.filter(q => {
      if (phase === 'coding') return q.type === InterviewType.CODING;
      if (phase === 'system_design') return q.type === InterviewType.SYSTEM_DESIGN;
      return q.type === InterviewType.BEHAVIORAL;
    });

    const phaseEvaluations = this.session.evaluations.slice(0, phaseQuestions.length);

    if (phaseEvaluations.length === 0) return 0;

    const totalScore = phaseEvaluations.reduce((sum, eval) => sum + eval.score, 0);
    return Math.round(totalScore / phaseEvaluations.length);
  }

  private generateInterviewSummary(): string {
    const codingScore = this.getPhaseScore('coding');
    const designScore = this.getPhaseScore('system_design');
    const behavioralScore = this.getPhaseScore('behavioral');
    const overallScore = this.getOverallScore();

    return `
📊 Interview Summary:

Phase 1 - Coding Interview: ${codingScore}%
Phase 2 - System Design Interview: ${designScore}%
Phase 3 - Behavioral Interview: ${behavioralScore}%

Overall Score: ${overallScore}%

Performance Rating: ${this.getPerformanceRating(overallScore)}

Total Questions: ${this.session.questions.length}
Duration: ${this.calculateDuration()}

${this.getRecommendations(codingScore, designScore, behavioralScore)}
    `.trim();
  }

  private getPerformanceRating(score: number): string {
    if (score >= 90) return '⭐⭐⭐⭐⭐ Outstanding';
    if (score >= 80) return '⭐⭐⭐⭐ Excellent';
    if (score >= 70) return '⭐⭐⭐ Good';
    if (score >= 60) return '⭐⭐ Fair';
    return '⭐ Needs Improvement';
  }

  private calculateDuration(): string {
    if (!this.session.endedAt) return 'In progress';

    const duration = this.session.endedAt.getTime() - this.session.startedAt.getTime();
    const minutes = Math.floor(duration / 60000);
    return `${minutes} minutes`;
  }

  private getRecommendations(coding: number, design: number, behavioral: number): string {
    const recommendations: string[] = [];

    if (coding < 70) {
      recommendations.push('- Practice more coding problems on LeetCode/HackerRank');
    }
    if (design < 70) {
      recommendations.push('- Study system design patterns and read case studies');
    }
    if (behavioral < 70) {
      recommendations.push('- Practice STAR method responses and reflect on past experiences');
    }

    if (recommendations.length === 0) {
      return '✅ Great performance across all areas! Keep up the excellent work.';
    }

    return `📚 Recommendations for improvement:\n${recommendations.join('\n')}`;
  }
}
