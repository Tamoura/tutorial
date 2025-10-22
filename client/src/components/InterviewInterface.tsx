import { useState, useEffect } from 'react';
import { InterviewSession, Question, Evaluation } from '../types';
import { apiService } from '../services/api';

interface Props {
  session: InterviewSession;
  initialQuestion: Question;
  onComplete: (session: InterviewSession) => void;
}

export default function InterviewInterface({ session, initialQuestion, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [answer, setAnswer] = useState('');
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [startTime] = useState(Date.now());
  const [showEvaluation, setShowEvaluation] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before submitting.');
      return;
    }

    setLoading(true);
    setMessage('');
    setHints([]);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const response = await apiService.submitAnswer(
        session.id,
        currentQuestion.id,
        answer,
        timeSpent
      );

      setMessage(response.message || '');
      setCurrentEvaluation(response.evaluation || null);
      setShowEvaluation(true);

      // Wait a moment to show evaluation before moving on
      setTimeout(() => {
        if (response.nextAction === 'complete') {
          // Interview completed
          if (response.session) {
            onComplete(response.session);
          }
        } else if (response.question) {
          // Move to next question
          setCurrentQuestion(response.question);
          setAnswer('');
          setCurrentEvaluation(null);
          setShowEvaluation(false);
          setQuestionNumber(questionNumber + 1);
        }
      }, 3000);

    } catch (error) {
      console.error('Failed to submit answer:', error);
      setMessage('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = async () => {
    setLoading(true);
    try {
      const response = await apiService.requestHint(session.id);
      if (response.hints) {
        setHints([...hints, ...response.hints]);
      }
      if (response.message) {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Failed to request hint:', error);
      setMessage('Failed to get hint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="interview-interface">
      <div className="interview-header">
        <div className="session-info">
          <h2>
            {session.type === 'coding' && '💻 '}
            {session.type === 'system_design' && '🏗️ '}
            {session.type === 'behavioral' && '💬 '}
            {session.type === 'comprehensive' && '🎯 '}
            {session.type.replace('_', ' ').toUpperCase()} Interview
          </h2>
          {session.candidateName && <p>Candidate: {session.candidateName}</p>}
        </div>
        <div className="progress-info">
          <span className="question-counter">Question {questionNumber}</span>
        </div>
      </div>

      {message && (
        <div className="message-banner info">
          {message}
        </div>
      )}

      <div className="question-section">
        <div className="question-header">
          <h3>{currentQuestion.title}</h3>
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty) }}
          >
            {currentQuestion.difficulty}
          </span>
        </div>

        <div className="question-description">
          <pre>{currentQuestion.description}</pre>
        </div>

        {currentQuestion.timeLimit && (
          <div className="time-limit">
            ⏱️ Suggested time limit: {currentQuestion.timeLimit} minutes
          </div>
        )}
      </div>

      {hints.length > 0 && (
        <div className="hints-section">
          <h4>💡 Hints:</h4>
          {hints.map((hint, index) => (
            <div key={index} className="hint">
              {hint}
            </div>
          ))}
        </div>
      )}

      {showEvaluation && currentEvaluation && (
        <div className="evaluation-section">
          <h4>📊 Evaluation</h4>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{currentEvaluation.score}</span>
              <span className="score-label">/100</span>
            </div>
          </div>
          <p className="feedback">{currentEvaluation.feedback}</p>

          {currentEvaluation.strengths.length > 0 && (
            <div className="strengths">
              <strong>✅ Strengths:</strong>
              <ul>
                {currentEvaluation.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {currentEvaluation.improvements.length > 0 && (
            <div className="improvements">
              <strong>🔧 Areas for Improvement:</strong>
              <ul>
                {currentEvaluation.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!showEvaluation && (
        <>
          <div className="answer-section">
            <label htmlFor="answer">Your Answer:</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={12}
              disabled={loading}
            />
          </div>

          <div className="action-buttons">
            <button
              className="hint-button"
              onClick={handleRequestHint}
              disabled={loading}
            >
              💡 Get Hint
            </button>
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={loading || !answer.trim()}
            >
              {loading ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
