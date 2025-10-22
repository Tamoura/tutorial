import express, { Request, Response } from 'express';
import cors from 'cors';
import { SessionManager } from './services/SessionManager';
import { InterviewType, Answer } from './types';
import { OrchestratorAgent } from './agents/OrchestratorAgent';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Session manager
const sessionManager = new SessionManager();

// Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AI Interview Agent API is running' });
});

/**
 * POST /api/sessions
 * Create a new interview session
 * Body: { type: InterviewType, candidateName?: string }
 */
app.post('/api/sessions', (req: Request, res: Response) => {
  try {
    const { type, candidateName } = req.body;

    if (!type || !Object.values(InterviewType).includes(type)) {
      return res.status(400).json({
        error: 'Invalid interview type. Must be one of: coding, system_design, behavioral, comprehensive'
      });
    }

    const session = sessionManager.createSession(type, candidateName);
    const agent = sessionManager.getAgent(session.id);

    res.status(201).json({
      session,
      message: agent instanceof OrchestratorAgent
        ? 'Comprehensive interview session created successfully'
        : `${type} interview session created successfully`
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/sessions/:sessionId
 * Get session details
 */
app.get('/api/sessions/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const agent = sessionManager.getAgent(sessionId);
    let currentQuestion = null;

    if (agent) {
      currentQuestion = agent.getCurrentQuestion();
    }

    res.json({ session, currentQuestion });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/sessions
 * Get all sessions
 */
app.get('/api/sessions', (req: Request, res: Response) => {
  try {
    const sessions = sessionManager.getAllSessions();
    res.json({ sessions, count: sessions.length });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/sessions/:sessionId/answers
 * Submit an answer to a question
 * Body: { questionId: string, content: string, timeSpent?: number }
 */
app.post('/api/sessions/:sessionId/answers', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { questionId, content, timeSpent } = req.body;

    if (!questionId || !content) {
      return res.status(400).json({ error: 'questionId and content are required' });
    }

    const session = sessionManager.getSession(sessionId);
    const agent = sessionManager.getAgent(sessionId);

    if (!session || !agent) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session is not active' });
    }

    const answer: Answer = {
      questionId,
      content,
      submittedAt: new Date(),
      timeSpent
    };

    const response = agent.submitAnswer(answer);

    // Update session
    session.answers.push(answer);
    if (response.evaluation) {
      session.evaluations.push(response.evaluation);
    }
    if (response.question) {
      session.questions.push(response.question);
    }
    if (response.nextAction === 'complete') {
      session.status = 'completed';
      session.endedAt = new Date();

      // Calculate overall score
      if (agent instanceof OrchestratorAgent) {
        session.overallScore = agent.getOverallScore();
      } else if (session.evaluations.length > 0) {
        session.overallScore = Math.round(
          session.evaluations.reduce((sum, e) => sum + e.score, 0) / session.evaluations.length
        );
      }
    }

    sessionManager.updateSession(sessionId, session);

    res.json({
      ...response,
      session
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/sessions/:sessionId/hints
 * Request a hint for the current question
 */
app.post('/api/sessions/:sessionId/hints', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = sessionManager.getSession(sessionId);
    const agent = sessionManager.getAgent(sessionId);

    if (!session || !agent) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session is not active' });
    }

    const response = agent.requestHint();

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Delete a session
 */
app.delete('/api/sessions/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const deleted = sessionManager.deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/interview-types
 * Get available interview types
 */
app.get('/api/interview-types', (req: Request, res: Response) => {
  res.json({
    types: [
      {
        id: InterviewType.CODING,
        name: 'Technical Coding Interview',
        description: 'Practice coding problems and algorithms',
        icon: '💻',
        maxQuestions: 3
      },
      {
        id: InterviewType.SYSTEM_DESIGN,
        name: 'System Design Interview',
        description: 'Design scalable systems and architectures',
        icon: '🏗️',
        maxQuestions: 2
      },
      {
        id: InterviewType.BEHAVIORAL,
        name: 'Behavioral Interview',
        description: 'Answer behavioral questions using STAR method',
        icon: '💬',
        maxQuestions: 3
      },
      {
        id: InterviewType.COMPREHENSIVE,
        name: 'Comprehensive Interview',
        description: 'Complete all three interview types',
        icon: '🎯',
        maxQuestions: 8
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Interview Agent server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
