import { useState } from 'react';
import { InterviewType, InterviewTypeInfo } from '../types';

interface Props {
  interviewTypes: InterviewTypeInfo[];
  onStart: (type: InterviewType, candidateName?: string) => void;
  loading: boolean;
}

export default function InterviewSelection({ interviewTypes, onStart, loading }: Props) {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [candidateName, setCandidateName] = useState('');

  const handleStart = () => {
    if (selectedType) {
      onStart(selectedType, candidateName || undefined);
    }
  };

  return (
    <div className="interview-selection">
      <div className="selection-content">
        <h2>Choose Your Interview Type</h2>
        <p className="selection-description">
          Select an interview type to begin your practice session with our specialized AI agents.
        </p>

        <div className="name-input-section">
          <label htmlFor="candidateName">Your Name (Optional)</label>
          <input
            id="candidateName"
            type="text"
            placeholder="Enter your name..."
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="name-input"
          />
        </div>

        <div className="interview-types-grid">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              className={`interview-type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="card-icon">{type.icon}</div>
              <h3>{type.name}</h3>
              <p className="card-description">{type.description}</p>
              <div className="card-meta">
                <span className="question-count">{type.maxQuestions} questions</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="start-button"
          onClick={handleStart}
          disabled={!selectedType || loading}
        >
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
      </div>
    </div>
  );
}
