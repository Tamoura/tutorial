import { BaseAgent } from './BaseAgent';
import {
  Question,
  Answer,
  Evaluation,
  InterviewType,
  DifficultyLevel
} from '../types';
import { codingQuestions } from '../data/codingQuestions';

export class CodingInterviewAgent extends BaseAgent {
  private availableQuestions: Question[];
  private usedQuestionIds: Set<string>;

  constructor() {
    super({
      name: 'Coding Interview Agent',
      type: InterviewType.CODING,
      maxQuestions: 3,
      enableHints: true,
      enableRealTimeFeedback: true
    });

    this.availableQuestions = [...codingQuestions];
    this.usedQuestionIds = new Set();
  }

  public getNextQuestion(): Question {
    // Filter out already used questions
    const unusedQuestions = this.availableQuestions.filter(
      q => !this.usedQuestionIds.has(q.id)
    );

    if (unusedQuestions.length === 0) {
      throw new Error('No more questions available');
    }

    // Select question based on difficulty progression
    const question = this.selectQuestionByDifficulty(unusedQuestions);
    this.usedQuestionIds.add(question.id);

    return question;
  }

  public evaluateAnswer(question: Question, answer: Answer): Evaluation {
    // Simulated AI evaluation - in production, this would call an LLM API
    const evaluation = this.analyzeCode(question, answer.content);

    return {
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      detailedAnalysis: evaluation.detailedAnalysis
    };
  }

  public provideHint(question: Question, attemptNumber: number): string {
    if (!question.hints || question.hints.length === 0) {
      return 'No hints available for this question.';
    }

    // Provide progressively more detailed hints
    const hintIndex = Math.min(attemptNumber - 1, question.hints.length - 1);
    return question.hints[hintIndex];
  }

  private analyzeCode(question: Question, code: string): Evaluation {
    // Simulated analysis - in production, use LLM for detailed analysis
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 0;

    // Check code length
    if (code.length > 50) {
      strengths.push('Provided a substantial solution');
      score += 20;
    } else {
      improvements.push('Solution seems incomplete or too brief');
    }

    // Check for common patterns based on difficulty
    if (question.difficulty === DifficultyLevel.EASY) {
      if (code.includes('map') || code.includes('hash') || code.includes('{}')) {
        strengths.push('Uses appropriate data structure (hash map)');
        score += 25;
      }
      if (code.includes('for') || code.includes('while')) {
        strengths.push('Implements iteration correctly');
        score += 20;
      }
    }

    // Check for code quality indicators
    if (code.includes('//') || code.includes('/*')) {
      strengths.push('Includes comments to explain logic');
      score += 10;
    }

    if (code.includes('function') || code.includes('=>') || code.includes('def')) {
      strengths.push('Properly structured with functions');
      score += 15;
    }

    // Check for edge cases handling
    if (code.includes('if') && code.includes('null') || code.includes('undefined') || code.includes('None')) {
      strengths.push('Considers edge cases and null checks');
      score += 10;
    } else {
      improvements.push('Consider handling edge cases (null, empty inputs)');
    }

    // Generate feedback based on score
    let feedback = '';
    if (score >= 80) {
      feedback = 'Excellent solution! You demonstrated strong problem-solving skills and code quality.';
    } else if (score >= 60) {
      feedback = 'Good effort! Your solution shows understanding, but there\'s room for improvement.';
    } else if (score >= 40) {
      feedback = 'Fair attempt. The solution needs more work on correctness and completeness.';
    } else {
      feedback = 'The solution needs significant improvement. Review the problem requirements and try again.';
    }

    // Add generic improvements if score is low
    if (score < 70) {
      if (improvements.length < 2) {
        improvements.push('Consider optimizing time complexity');
        improvements.push('Add more test cases to verify correctness');
      }
    }

    const detailedAnalysis = `
Question: ${question.title} (${question.difficulty})

Code Analysis:
- The solution demonstrates ${score >= 70 ? 'good' : 'basic'} understanding of the problem
- Time complexity appears to be ${this.estimateComplexity(code)}
- Code readability is ${code.includes('//') ? 'good with comments' : 'could be improved with comments'}

Expected Approach:
${question.evaluationCriteria?.join('\n- ') || 'See question description'}

Your approach:
${strengths.join('\n- ')}

Areas for improvement:
${improvements.join('\n- ')}
    `.trim();

    return {
      score: Math.min(100, score),
      feedback,
      strengths,
      improvements,
      detailedAnalysis
    };
  }

  private estimateComplexity(code: string): string {
    const nestedLoops = (code.match(/for|while/g) || []).length;

    if (nestedLoops >= 3) return 'O(n³) or higher';
    if (nestedLoops === 2) return 'O(n²)';
    if (nestedLoops === 1) return 'O(n)';
    if (code.includes('map') || code.includes('hash')) return 'O(n) with hash map';
    return 'O(1) or O(log n)';
  }
}
