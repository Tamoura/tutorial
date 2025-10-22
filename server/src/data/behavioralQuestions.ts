import { Question, InterviewType, QuestionCategory, DifficultyLevel } from '../types';

export const behavioralQuestions: Question[] = [
  {
    id: 'beh_001',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.EASY,
    title: 'Tell me about yourself',
    description: `Please provide a brief introduction about yourself, your background, and what brings you to this interview.

Focus on:
- Your professional background
- Key skills and experiences
- What you're looking for in your next role
- Why you're interested in this opportunity`,
    hints: [
      'Keep it professional and relevant to the role',
      'Structure your answer with a clear beginning, middle, and end',
      'Highlight 2-3 key achievements or experiences',
      'Connect your background to the role you\'re applying for'
    ],
    evaluationCriteria: [
      'Clear and concise introduction',
      'Relevant professional experience highlighted',
      'Shows enthusiasm and motivation',
      'Well-structured response',
      'Connects background to the opportunity'
    ],
    timeLimit: 3
  },
  {
    id: 'beh_002',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.EASY,
    title: 'Why do you want to work here?',
    description: `Explain why you're interested in working for this company and in this particular role.

Consider discussing:
- What you know about the company
- What excites you about the opportunity
- How your goals align with the company's mission
- What you hope to contribute`,
    hints: [
      'Research the company beforehand',
      'Be specific about what attracts you',
      'Connect your skills and experience to their needs',
      'Show genuine enthusiasm'
    ],
    evaluationCriteria: [
      'Shows knowledge about the company',
      'Demonstrates genuine interest',
      'Connects personal goals with company mission',
      'Specific rather than generic',
      'Expresses what they can contribute'
    ],
    timeLimit: 3
  },
  {
    id: 'beh_003',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Describe a challenging project you worked on',
    description: `Tell me about a challenging project or problem you faced at work and how you handled it.

Use the STAR method:
- Situation: Set the context
- Task: Explain what needed to be done
- Action: Describe what you did
- Result: Share the outcome

Focus on demonstrating problem-solving skills, technical abilities, and collaboration.`,
    hints: [
      'Choose a genuinely challenging technical problem',
      'Explain the technical complexity clearly',
      'Emphasize your specific contributions',
      'Mention what you learned from the experience',
      'Include measurable results if possible'
    ],
    evaluationCriteria: [
      'Uses STAR method effectively',
      'Describes a genuinely challenging situation',
      'Clearly explains their role and actions',
      'Demonstrates problem-solving skills',
      'Shows learning and growth',
      'Includes measurable results',
      'Well-structured narrative'
    ],
    timeLimit: 5
  },
  {
    id: 'beh_004',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Tell me about a time you had a conflict with a team member',
    description: `Describe a situation where you had a disagreement or conflict with a colleague and how you resolved it.

Address:
- The nature of the conflict
- Your approach to resolving it
- Communication strategies used
- The outcome
- What you learned`,
    hints: [
      'Choose an example with a positive resolution',
      'Focus on the resolution process, not the conflict itself',
      'Show emotional intelligence and communication skills',
      'Demonstrate ability to see different perspectives',
      'Emphasize learning and relationship building'
    ],
    evaluationCriteria: [
      'Handles conflict maturely',
      'Shows strong communication skills',
      'Demonstrates empathy and perspective-taking',
      'Focuses on resolution and outcomes',
      'Takes appropriate responsibility',
      'Shows learning from the experience',
      'Maintains professionalism'
    ],
    timeLimit: 5
  },
  {
    id: 'beh_005',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Describe a time when you had to learn a new technology quickly',
    description: `Tell me about a time when you needed to learn a new programming language, framework, or technology in a short period of time.

Include:
- Why you needed to learn it
- Your learning approach
- Challenges you faced
- How you applied the knowledge
- The outcome`,
    hints: [
      'Show your learning methodology',
      'Emphasize resourcefulness and adaptability',
      'Mention specific resources you used',
      'Discuss how you validated your learning',
      'Share the successful application'
    ],
    evaluationCriteria: [
      'Demonstrates strong learning ability',
      'Shows systematic approach to learning',
      'Exhibits resourcefulness',
      'Overcomes challenges effectively',
      'Successfully applies new knowledge',
      'Shows adaptability',
      'Clear structure and storytelling'
    ],
    timeLimit: 5
  },
  {
    id: 'beh_006',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.HARD,
    title: 'Tell me about a time you failed',
    description: `Describe a significant professional failure or mistake you made and what you learned from it.

Discuss:
- What happened and why
- The impact of the failure
- How you responded
- What you learned
- How you've applied those lessons since

This question assesses self-awareness, accountability, and growth mindset.`,
    hints: [
      'Choose a real failure, not a humble brag',
      'Take ownership without excessive self-criticism',
      'Focus heavily on what you learned',
      'Show how you\'ve grown from the experience',
      'Demonstrate resilience and positive attitude'
    ],
    evaluationCriteria: [
      'Shows genuine self-awareness',
      'Takes appropriate accountability',
      'Demonstrates learning and growth',
      'Shows resilience and positive attitude',
      'Provides specific lessons learned',
      'Explains how behavior changed',
      'Balances honesty with professionalism',
      'Growth mindset evident'
    ],
    timeLimit: 5
  },
  {
    id: 'beh_007',
    type: InterviewType.BEHAVIORAL,
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.HARD,
    title: 'Describe a time you had to make a difficult technical decision',
    description: `Tell me about a time when you had to make a difficult technical decision with significant trade-offs.

Cover:
- The situation and constraints
- The options you considered
- Your decision-making process
- Who you consulted
- The decision you made and why
- The outcome and any lessons learned`,
    hints: [
      'Explain the technical trade-offs clearly',
      'Show your analytical thinking process',
      'Demonstrate consultation with others',
      'Discuss both short-term and long-term implications',
      'Be honest about the outcome, even if imperfect'
    ],
    evaluationCriteria: [
      'Clear explanation of technical complexity',
      'Systematic decision-making approach',
      'Considers multiple perspectives and trade-offs',
      'Shows collaboration and consultation',
      'Demonstrates technical depth',
      'Discusses long-term implications',
      'Shows ownership of decision',
      'Reflects on outcome and lessons'
    ],
    timeLimit: 7
  }
];
