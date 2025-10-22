import { InterviewSession, InterviewType } from '../types';
import { CodingInterviewAgent } from '../agents/CodingInterviewAgent';
import { SystemDesignAgent } from '../agents/SystemDesignAgent';
import { BehavioralAgent } from '../agents/BehavioralAgent';
import { OrchestratorAgent } from '../agents/OrchestratorAgent';
import { BaseAgent } from '../agents/BaseAgent';

export class SessionManager {
  private sessions: Map<string, { agent: BaseAgent; session: InterviewSession }>;

  constructor() {
    this.sessions = new Map();
  }

  public createSession(type: InterviewType, candidateName?: string): InterviewSession {
    let agent: BaseAgent;

    switch (type) {
      case InterviewType.CODING:
        agent = new CodingInterviewAgent();
        break;
      case InterviewType.SYSTEM_DESIGN:
        agent = new SystemDesignAgent();
        break;
      case InterviewType.BEHAVIORAL:
        agent = new BehavioralAgent();
        break;
      case InterviewType.COMPREHENSIVE:
        agent = new OrchestratorAgent();
        break;
      default:
        throw new Error(`Unknown interview type: ${type}`);
    }

    const response = agent.startInterview();

    const session: InterviewSession = {
      id: this.generateSessionId(),
      type,
      candidateName,
      startedAt: new Date(),
      questions: response.question ? [response.question] : [],
      answers: [],
      evaluations: [],
      status: 'active'
    };

    this.sessions.set(session.id, { agent, session });

    return session;
  }

  public getSession(sessionId: string): InterviewSession | undefined {
    const data = this.sessions.get(sessionId);
    return data?.session;
  }

  public getAgent(sessionId: string): BaseAgent | undefined {
    const data = this.sessions.get(sessionId);
    return data?.agent;
  }

  public getAllSessions(): InterviewSession[] {
    return Array.from(this.sessions.values()).map(data => data.session);
  }

  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  public updateSession(sessionId: string, session: InterviewSession): void {
    const data = this.sessions.get(sessionId);
    if (data) {
      data.session = session;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
