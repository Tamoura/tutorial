import { useState, useEffect } from 'react';
import { InterviewType, InterviewTypeInfo, InterviewSession, Question } from './types';
import { apiService } from './services/api';
import InterviewSelection from './components/InterviewSelection';
import InterviewInterface from './components/InterviewInterface';
import Results from './components/Results';
import './App.css';

type AppState = 'selection' | 'interview' | 'results';

function App() {
  const [state, setState] = useState<AppState>('selection');
  const [interviewTypes, setInterviewTypes] = useState<InterviewTypeInfo[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInterviewTypes();
  }, []);

  const loadInterviewTypes = async () => {
    try {
      const types = await apiService.getInterviewTypes();
      setInterviewTypes(types);
    } catch (err) {
      setError('Failed to load interview types');
      console.error(err);
    }
  };

  const startInterview = async (type: InterviewType, candidateName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { session } = await apiService.createSession(type, candidateName);
      setCurrentSession(session);
      if (session.questions && session.questions.length > 0) {
        setCurrentQuestion(session.questions[0]);
      }
      setState('interview');
    } catch (err) {
      setError('Failed to start interview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewComplete = (session: InterviewSession) => {
    setCurrentSession(session);
    setState('results');
  };

  const handleRestart = () => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setError(null);
    setState('selection');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Interview Agent</h1>
        <p className="subtitle">Multi-Agent Interview Practice Platform</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {state === 'selection' && (
          <InterviewSelection
            interviewTypes={interviewTypes}
            onStart={startInterview}
            loading={loading}
          />
        )}

        {state === 'interview' && currentSession && currentQuestion && (
          <InterviewInterface
            session={currentSession}
            initialQuestion={currentQuestion}
            onComplete={handleInterviewComplete}
          />
        )}

        {state === 'results' && currentSession && (
          <Results session={currentSession} onRestart={handleRestart} />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React, TypeScript, and Express | Multi-Agent AI System</p>
      </footer>
    </div>
  );
}

export default App;
