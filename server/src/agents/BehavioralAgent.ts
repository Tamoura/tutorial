import { BaseAgent } from './BaseAgent';
import {
  Question,
  Answer,
  Evaluation,
  InterviewType
} from '../types';
import { behavioralQuestions } from '../data/behavioralQuestions';

export class BehavioralAgent extends BaseAgent {
  private availableQuestions: Question[];
  private usedQuestionIds: Set<string>;

  constructor() {
    super({
      name: 'Behavioral Interview Agent',
      type: InterviewType.BEHAVIORAL,
      maxQuestions: 3,
      enableHints: true,
      enableRealTimeFeedback: true
    });

    this.availableQuestions = [...behavioralQuestions];
    this.usedQuestionIds = new Set();
  }

  public getNextQuestion(): Question {
    const unusedQuestions = this.availableQuestions.filter(
      q => !this.usedQuestionIds.has(q.id)
    );

    if (unusedQuestions.length === 0) {
      throw new Error('No more questions available');
    }

    const question = this.selectQuestionByDifficulty(unusedQuestions);
    this.usedQuestionIds.add(question.id);

    return question;
  }

  public evaluateAnswer(question: Question, answer: Answer): Evaluation {
    const evaluation = this.analyzeBehavioralResponse(question, answer.content);

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
      return 'Use the STAR method: Situation, Task, Action, Result. Be specific and focus on your individual contributions.';
    }

    const hintIndex = Math.min(attemptNumber - 1, question.hints.length - 1);
    return question.hints[hintIndex];
  }

  private analyzeBehavioralResponse(question: Question, response: string): Evaluation {
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 0;

    const lowerResponse = response.toLowerCase();

    // Check for STAR method components
    const starComponents = {
      situation: ['situation', 'context', 'background', 'at', 'when', 'where'],
      task: ['task', 'challenge', 'goal', 'objective', 'needed to', 'had to'],
      action: ['action', 'did', 'implemented', 'decided', 'created', 'developed', 'i ', 'my'],
      result: ['result', 'outcome', 'achieved', 'accomplished', 'improved', 'increased', 'decreased']
    };

    let starScore = 0;
    for (const [component, keywords] of Object.entries(starComponents)) {
      if (keywords.some(keyword => lowerResponse.includes(keyword))) {
        strengths.push(`Includes ${component.charAt(0).toUpperCase() + component.slice(1)} component`);
        starScore += 12.5;
      } else {
        improvements.push(`Could strengthen ${component.charAt(0).toUpperCase() + component.slice(1)} component`);
      }
    }

    score += starScore;

    // Check for specificity (numbers, names, concrete details)
    const hasNumbers = /\d+/.test(response) ||
                      lowerResponse.includes('percent') ||
                      lowerResponse.includes('increased') ||
                      lowerResponse.includes('decreased');
    if (hasNumbers) {
      strengths.push('Uses specific metrics and measurable results');
      score += 15;
    } else {
      improvements.push('Add specific metrics or quantifiable results');
    }

    // Check for "I" statements (shows ownership)
    const iStatements = (response.match(/\bI\b/g) || []).length;
    if (iStatements >= 3) {
      strengths.push('Clearly articulates personal contributions');
      score += 10;
    } else if (iStatements === 0) {
      improvements.push('Use more "I" statements to highlight your individual contributions');
    }

    // Check response length
    if (response.length > 300) {
      strengths.push('Provides detailed, comprehensive response');
      score += 10;
    } else if (response.length < 100) {
      improvements.push('Response is too brief - provide more detail and context');
      score -= 10;
    }

    // Check for learning/growth mention
    if (lowerResponse.includes('learn') || lowerResponse.includes('grew') ||
        lowerResponse.includes('improve') || lowerResponse.includes('develop')) {
      strengths.push('Demonstrates learning and personal growth');
      score += 10;
    } else {
      improvements.push('Mention what you learned or how you grew from the experience');
    }

    // Check for collaboration indicators
    if (lowerResponse.includes('team') || lowerResponse.includes('colleague') ||
        lowerResponse.includes('collaborate') || lowerResponse.includes('together')) {
      strengths.push('Shows teamwork and collaboration skills');
      score += 8;
    }

    // Check for problem-solving indicators
    if (lowerResponse.includes('solution') || lowerResponse.includes('solved') ||
        lowerResponse.includes('approach') || lowerResponse.includes('strategy')) {
      strengths.push('Demonstrates problem-solving approach');
      score += 7;
    }

    // Ensure score is in valid range
    score = Math.max(0, Math.min(100, score));

    // Generate feedback
    let feedback = '';
    if (score >= 80) {
      feedback = 'Excellent behavioral response! You used the STAR method effectively and provided specific, relevant examples.';
    } else if (score >= 60) {
      feedback = 'Good response with relevant examples. Consider adding more specific details and measurable results.';
    } else if (score >= 40) {
      feedback = 'Decent attempt, but the response lacks structure or specific details. Try using the STAR method more clearly.';
    } else {
      feedback = 'The response needs significant improvement. Focus on the STAR method and provide specific, detailed examples.';
    }

    const detailedAnalysis = `
Question: ${question.title}

Behavioral Response Analysis:

STAR Method Assessment:
${Object.keys(starComponents).map(comp => {
  const hasComponent = starComponents[comp as keyof typeof starComponents].some(
    keyword => lowerResponse.includes(keyword)
  );
  return `- ${comp.charAt(0).toUpperCase() + comp.slice(1)}: ${hasComponent ? '✓ Present' : '✗ Missing'}`;
}).join('\n')}

Strengths Identified:
${strengths.length > 0 ? strengths.map(s => `- ${s}`).join('\n') : '- Consider the feedback below'}

Areas for Improvement:
${improvements.length > 0 ? improvements.map(i => `- ${i}`).join('\n') : '- Great job! Minor refinements could enhance the response'}

Key Tips for Behavioral Interviews:
1. Use the STAR method consistently
2. Be specific with metrics and results
3. Focus on YOUR actions and contributions
4. Show learning and growth
5. Keep responses structured and concise (2-4 minutes)
6. Practice active listening and answer the question asked
    `.trim();

    return {
      score,
      feedback,
      strengths,
      improvements,
      detailedAnalysis
    };
  }
}
