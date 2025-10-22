import { BaseAgent } from './BaseAgent';
import {
  Question,
  Answer,
  Evaluation,
  InterviewType
} from '../types';
import { systemDesignQuestions } from '../data/systemDesignQuestions';

export class SystemDesignAgent extends BaseAgent {
  private availableQuestions: Question[];
  private usedQuestionIds: Set<string>;

  constructor() {
    super({
      name: 'System Design Interview Agent',
      type: InterviewType.SYSTEM_DESIGN,
      maxQuestions: 2,
      enableHints: true,
      enableRealTimeFeedback: true
    });

    this.availableQuestions = [...systemDesignQuestions];
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
    const evaluation = this.analyzeSystemDesign(question, answer.content);

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
      return 'Think about: scalability, reliability, and performance trade-offs.';
    }

    const hintIndex = Math.min(attemptNumber - 1, question.hints.length - 1);
    return question.hints[hintIndex];
  }

  private analyzeSystemDesign(question: Question, design: string): Evaluation {
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 0;

    const lowerDesign = design.toLowerCase();

    // Check for key system design components
    const components = {
      'api': ['api', 'endpoint', 'rest', 'graphql'],
      'database': ['database', 'db', 'sql', 'nosql', 'postgres', 'mongodb', 'cassandra'],
      'cache': ['cache', 'redis', 'memcached'],
      'loadbalancer': ['load balanc', 'lb', 'nginx'],
      'queue': ['queue', 'kafka', 'rabbitmq', 'message'],
      'cdn': ['cdn', 'content delivery'],
      'microservices': ['microservice', 'service'],
      'scalability': ['scal', 'horizontal', 'vertical', 'shard'],
      'reliability': ['reliability', 'fault toleran', 'replication', 'backup']
    };

    let componentScore = 0;
    for (const [component, keywords] of Object.entries(components)) {
      if (keywords.some(keyword => lowerDesign.includes(keyword))) {
        strengths.push(`Considers ${component.replace('_', ' ')}`);
        componentScore += 10;
      }
    }

    score += Math.min(componentScore, 50);

    // Check for trade-off discussion
    if (lowerDesign.includes('trade') || lowerDesign.includes('vs') ||
        lowerDesign.includes('advantage') || lowerDesign.includes('disadvantage')) {
      strengths.push('Discusses trade-offs between different approaches');
      score += 15;
    } else {
      improvements.push('Should discuss trade-offs between design choices');
    }

    // Check for numbers/capacity planning
    if (/\d+/.test(design) && (lowerDesign.includes('qps') || lowerDesign.includes('user') ||
        lowerDesign.includes('request') || lowerDesign.includes('storage'))) {
      strengths.push('Includes capacity planning with estimates');
      score += 15;
    } else {
      improvements.push('Should include back-of-the-envelope calculations');
    }

    // Check for diagram or structure
    if (design.includes('->') || design.includes('|') || design.includes('```') ||
        lowerDesign.includes('component') || lowerDesign.includes('layer')) {
      strengths.push('Provides structured design or diagram');
      score += 10;
    } else {
      improvements.push('Consider providing a diagram or structured component layout');
    }

    // Check depth of answer
    if (design.length > 500) {
      strengths.push('Comprehensive and detailed design');
      score += 10;
    } else if (design.length < 200) {
      improvements.push('Design lacks sufficient detail and depth');
    }

    // Generate feedback
    let feedback = '';
    if (score >= 80) {
      feedback = 'Outstanding system design! You covered key components, scalability, and trade-offs effectively.';
    } else if (score >= 60) {
      feedback = 'Good system design with solid understanding of core concepts. Some areas could be more detailed.';
    } else if (score >= 40) {
      feedback = 'Basic design with some good ideas, but needs more depth in key areas like scalability and reliability.';
    } else {
      feedback = 'Design needs significant improvement. Focus on core components, scalability, and trade-offs.';
    }

    const detailedAnalysis = `
Question: ${question.title} (${question.difficulty})

System Design Analysis:

Key Components Identified:
${strengths.length > 0 ? strengths.map(s => `- ${s}`).join('\n') : '- Limited components identified'}

Evaluation Criteria:
${question.evaluationCriteria?.map(c => `- ${c}`).join('\n') || 'See question requirements'}

Areas for Improvement:
${improvements.length > 0 ? improvements.map(i => `- ${i}`).join('\n') : '- Continue to deepen understanding of distributed systems'}

Remember: Good system design requires:
1. Clarifying requirements and constraints
2. High-level architecture
3. Detailed component design
4. Scalability considerations
5. Trade-off analysis
6. Discussion of potential bottlenecks
    `.trim();

    return {
      score: Math.min(100, score),
      feedback,
      strengths,
      improvements,
      detailedAnalysis
    };
  }
}
