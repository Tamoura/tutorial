import { InterviewSession } from '../types';

interface Props {
  session: InterviewSession;
  onRestart: () => void;
}

export default function Results({ session, onRestart }: Props) {
  const getPerformanceRating = (score: number): string => {
    if (score >= 90) return '⭐⭐⭐⭐⭐ Outstanding';
    if (score >= 80) return '⭐⭐⭐⭐ Excellent';
    if (score >= 70) return '⭐⭐⭐ Good';
    if (score >= 60) return '⭐⭐ Fair';
    return '⭐ Needs Improvement';
  };

  const calculateDuration = (): string => {
    if (!session.endedAt) return 'N/A';
    const duration = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-header">
          <h2>🎊 Interview Complete!</h2>
          {session.candidateName && (
            <p className="candidate-name">Candidate: {session.candidateName}</p>
          )}
        </div>

        <div className="overall-score-section">
          <div className="score-display-large">
            <div className="score-circle-large">
              <span className="score-value-large">{session.overallScore || 0}</span>
              <span className="score-label-large">/100</span>
            </div>
            <div className="performance-rating">
              {getPerformanceRating(session.overallScore || 0)}
            </div>
          </div>
        </div>

        <div className="session-summary">
          <div className="summary-item">
            <span className="summary-label">Interview Type:</span>
            <span className="summary-value">
              {session.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Questions Answered:</span>
            <span className="summary-value">{session.answers.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Duration:</span>
            <span className="summary-value">{calculateDuration()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Date:</span>
            <span className="summary-value">
              {new Date(session.startedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="detailed-results">
          <h3>📝 Question-by-Question Breakdown</h3>
          {session.questions.map((question, index) => {
            const evaluation = session.evaluations[index];
            return (
              <div key={question.id} className="question-result">
                <div className="question-result-header">
                  <h4>
                    Q{index + 1}: {question.title}
                  </h4>
                  <span className="question-score">
                    Score: {evaluation?.score || 0}/100
                  </span>
                </div>
                <p className="question-difficulty">
                  Difficulty: <span className={`difficulty ${question.difficulty}`}>
                    {question.difficulty}
                  </span>
                </p>
                {evaluation && (
                  <>
                    <p className="evaluation-feedback">{evaluation.feedback}</p>
                    {evaluation.strengths.length > 0 && (
                      <div className="strengths-list">
                        <strong>Strengths:</strong>
                        <ul>
                          {evaluation.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {evaluation.improvements.length > 0 && (
                      <div className="improvements-list">
                        <strong>Improvements:</strong>
                        <ul>
                          {evaluation.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="results-actions">
          <button className="restart-button" onClick={onRestart}>
            🔄 Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
