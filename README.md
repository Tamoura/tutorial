# AI Interview Agent

A sophisticated multi-agent interview practice platform built with React, TypeScript, and Node.js. This system features specialized AI agents for technical coding, system design, and behavioral interviews.

## Features

### Multi-Agent System

The platform includes **4 specialized AI agents**, each with unique capabilities:

1. **Technical Coding Interview Agent** 💻
   - Asks algorithmic and data structure questions
   - Evaluates code solutions
   - Provides progressive hints
   - Assesses time/space complexity
   - Difficulty levels: Easy → Medium → Hard

2. **System Design Interview Agent** 🏗️
   - Presents architecture and scalability problems
   - Evaluates system design decisions
   - Checks for trade-off discussions
   - Assesses capacity planning
   - Focus on distributed systems concepts

3. **Behavioral Interview Agent** 💬
   - Asks behavioral questions using STAR method
   - Evaluates communication skills
   - Assesses leadership and teamwork
   - Provides feedback on response structure
   - Checks for specific examples and metrics

4. **Comprehensive Interview Orchestrator** 🎯
   - Coordinates all three interview types
   - Progressive interview flow
   - Complete interview experience
   - Comprehensive evaluation and scoring

### Key Capabilities

- **Session Management**: Track multiple interview sessions
- **Real-time Evaluation**: Immediate feedback on answers
- **Hint System**: Progressive hints for challenging questions
- **Score Tracking**: Detailed scoring with strengths/improvements
- **Question Database**: Extensive collection of interview questions
- **Responsive UI**: Modern, intuitive React interface

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- Modular agent architecture
- Session management system

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development
- **Axios** for API communication
- Modern CSS with gradient designs

## Project Structure

```
ai-interview-agent/
├── server/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── BaseAgent.ts
│   │   │   ├── CodingInterviewAgent.ts
│   │   │   ├── SystemDesignAgent.ts
│   │   │   ├── BehavioralAgent.ts
│   │   │   └── OrchestratorAgent.ts
│   │   ├── data/
│   │   │   ├── codingQuestions.ts
│   │   │   ├── systemDesignQuestions.ts
│   │   │   └── behavioralQuestions.ts
│   │   ├── services/
│   │   │   └── SessionManager.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InterviewSelection.tsx
│   │   │   ├── InterviewInterface.tsx
│   │   │   └── Results.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-agent
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This installs dependencies for both server and client.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This starts both backend (port 3001) and frontend (port 3000) concurrently.

### Individual Commands

**Backend only:**
```bash
npm run server:dev
```

**Frontend only:**
```bash
npm run client:dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

## API Endpoints

### Sessions
- `POST /api/sessions` - Create new interview session
- `GET /api/sessions/:id` - Get session details
- `GET /api/sessions` - Get all sessions
- `DELETE /api/sessions/:id` - Delete session

### Interview Actions
- `POST /api/sessions/:id/answers` - Submit an answer
- `POST /api/sessions/:id/hints` - Request a hint

### Information
- `GET /api/health` - Health check
- `GET /api/interview-types` - Get available interview types

## Usage Guide

### 1. Select Interview Type

Choose from four interview types:
- **Coding Interview** (3 questions)
- **System Design Interview** (2 questions)
- **Behavioral Interview** (3 questions)
- **Comprehensive Interview** (8 questions total)

### 2. Answer Questions

- Read the question carefully
- Use the code/text area to provide your answer
- Request hints if needed (affects evaluation)
- Submit your answer for evaluation

### 3. Receive Feedback

After each answer, you'll receive:
- **Score** (0-100)
- **Feedback** on your response
- **Strengths** identified in your answer
- **Areas for improvement**
- **Detailed analysis**

### 4. View Results

After completing all questions:
- Overall score and performance rating
- Duration and statistics
- Question-by-question breakdown
- Recommendations for improvement

## Agent Architecture

### BaseAgent

Abstract base class providing:
- Question management
- Answer evaluation framework
- Hint system
- Common utilities

### Specialized Agents

Each agent extends BaseAgent with:
- Question selection logic
- Domain-specific evaluation
- Custom hint strategies
- Scoring algorithms

### Orchestrator Pattern

The Orchestrator agent:
- Manages multiple specialized agents
- Handles phase transitions
- Aggregates scores
- Generates comprehensive reports

## Evaluation System

### Coding Questions
- Correctness
- Time/space complexity
- Code quality and readability
- Edge case handling

### System Design
- Component identification
- Scalability considerations
- Trade-off analysis
- Capacity planning

### Behavioral Responses
- STAR method usage
- Specificity and metrics
- Personal contribution clarity
- Learning and growth demonstration

## Question Database

### Coding Questions (6 questions)
- Two Sum (Easy)
- Valid Parentheses (Easy)
- Longest Substring Without Repeating Characters (Medium)
- Binary Tree Level Order Traversal (Medium)
- Merge K Sorted Lists (Hard)
- Trapping Rain Water (Hard)

### System Design Questions (5 questions)
- URL Shortener (Easy)
- Rate Limiter (Medium)
- Chat Application (Medium)
- YouTube (Hard)
- Distributed Cache (Hard)

### Behavioral Questions (7 questions)
- Tell me about yourself (Easy)
- Why do you want to work here? (Easy)
- Describe a challenging project (Medium)
- Tell me about a conflict (Medium)
- Learning new technology quickly (Medium)
- Tell me about a time you failed (Hard)
- Difficult technical decision (Hard)

## Future Enhancements

- [ ] Integration with actual AI/LLM APIs for advanced evaluation
- [ ] Code execution and testing for coding questions
- [ ] Timed interview mode with countdown
- [ ] Interview recording and playback
- [ ] Peer comparison and analytics
- [ ] Custom question creation
- [ ] Multi-language support
- [ ] Export results to PDF
- [ ] Interview scheduling system
- [ ] Video interview simulation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

Built with modern web technologies:
- React & TypeScript
- Node.js & Express
- Vite for blazing fast development
- Design inspired by modern interview platforms

---

**Happy Interviewing!** 🚀

For questions or support, please open an issue on GitHub.
