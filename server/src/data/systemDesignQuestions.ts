import { Question, InterviewType, QuestionCategory, DifficultyLevel } from '../types';

export const systemDesignQuestions: Question[] = [
  {
    id: 'sd_001',
    type: InterviewType.SYSTEM_DESIGN,
    category: QuestionCategory.SYSTEM_DESIGN,
    difficulty: DifficultyLevel.EASY,
    title: 'Design a URL Shortener',
    description: `Design a URL shortening service like bit.ly or TinyURL.

Requirements:
1. Users can input a long URL and get a short URL back
2. When users visit the short URL, they should be redirected to the original URL
3. Short URLs should be unique and relatively short (6-8 characters)
4. The system should handle millions of URLs

Discuss:
- API design
- Database schema
- URL generation algorithm
- Scalability considerations`,
    hints: [
      'Think about how to generate unique short codes (hashing, base62 encoding, counter)',
      'Consider using a NoSQL database for quick lookups',
      'Think about caching frequently accessed URLs',
      'Consider how to handle collisions in short URL generation'
    ],
    evaluationCriteria: [
      'Clear API design (REST endpoints)',
      'Appropriate database choice and schema',
      'Good URL generation strategy',
      'Considers caching for performance',
      'Discusses scalability (load balancing, database sharding)',
      'Addresses potential issues (collisions, expiration)'
    ],
    timeLimit: 30
  },
  {
    id: 'sd_002',
    type: InterviewType.SYSTEM_DESIGN,
    category: QuestionCategory.SYSTEM_DESIGN,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Design a Rate Limiter',
    description: `Design a rate limiting system that can be used to prevent abuse of an API.

Requirements:
1. Limit the number of requests a user can make within a time window
2. Support different rate limits for different users/tiers
3. Should work in a distributed system
4. Low latency impact on requests

Discuss:
- Different rate limiting algorithms
- Storage mechanism
- Handling distributed systems
- Monitoring and metrics`,
    hints: [
      'Consider algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window',
      'Think about using Redis for distributed rate limiting',
      'Consider how to handle clock synchronization in distributed systems',
      'Think about what happens when the rate limiter fails'
    ],
    evaluationCriteria: [
      'Understands different rate limiting algorithms',
      'Chooses appropriate algorithm with justification',
      'Designs for distributed environment',
      'Uses Redis or similar for shared state',
      'Considers edge cases (time synchronization, failures)',
      'Discusses monitoring and alerting'
    ],
    timeLimit: 35
  },
  {
    id: 'sd_003',
    type: InterviewType.SYSTEM_DESIGN,
    category: QuestionCategory.SYSTEM_DESIGN,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Design a Chat Application',
    description: `Design a real-time chat application like WhatsApp or Slack.

Requirements:
1. One-on-one messaging
2. Group chats
3. Online/offline status
4. Message delivery confirmation
5. Support for millions of users
6. Message history

Discuss:
- Architecture and components
- Real-time communication protocol
- Database design
- Scalability
- Reliability and fault tolerance`,
    hints: [
      'Consider WebSockets for real-time communication',
      'Think about message queues for reliability',
      'Consider how to store messages efficiently (Cassandra, MongoDB)',
      'Think about presence service for online/offline status',
      'Consider CDN for media files'
    ],
    evaluationCriteria: [
      'Appropriate protocol choice (WebSockets, long polling)',
      'Good database design for messages and users',
      'Discusses scalability (sharding, load balancing)',
      'Considers reliability (message queues, acknowledgments)',
      'Addresses real-time features (presence, typing indicators)',
      'Thinks about security (encryption, authentication)'
    ],
    timeLimit: 45
  },
  {
    id: 'sd_004',
    type: InterviewType.SYSTEM_DESIGN,
    category: QuestionCategory.SYSTEM_DESIGN,
    difficulty: DifficultyLevel.HARD,
    title: 'Design YouTube',
    description: `Design a video sharing platform like YouTube.

Requirements:
1. Users can upload videos
2. Users can watch videos with minimal latency
3. Support for billions of videos and millions of concurrent viewers
4. Video recommendations
5. Video processing (transcoding to multiple formats)
6. Analytics and metrics

Discuss:
- Architecture and microservices
- Video storage and CDN
- Video processing pipeline
- Search and recommendation system
- Scalability and performance`,
    hints: [
      'Think about separating upload, processing, and streaming services',
      'Consider using object storage (S3) and CDN for video delivery',
      'Think about async video processing with message queues',
      'Consider how to handle live streaming differently',
      'Think about caching strategies at multiple levels'
    ],
    evaluationCriteria: [
      'Comprehensive microservices architecture',
      'Appropriate storage solution (object storage + CDN)',
      'Well-designed video processing pipeline',
      'Good understanding of video streaming protocols',
      'Scalability considerations (global distribution, edge servers)',
      'Discusses recommendation system at high level',
      'Considers cost optimization',
      'Addresses monitoring and analytics'
    ],
    timeLimit: 50
  },
  {
    id: 'sd_005',
    type: InterviewType.SYSTEM_DESIGN,
    category: QuestionCategory.SYSTEM_DESIGN,
    difficulty: DifficultyLevel.HARD,
    title: 'Design a Distributed Cache',
    description: `Design a distributed caching system like Redis or Memcached.

Requirements:
1. Fast read and write operations (sub-millisecond)
2. Support for millions of keys
3. High availability and fault tolerance
4. Data eviction policies
5. Support for different data types
6. Distributed across multiple nodes

Discuss:
- Architecture and data structures
- Consistent hashing for distribution
- Replication and fault tolerance
- Eviction policies (LRU, LFU, etc.)
- Network protocol design`,
    hints: [
      'Think about consistent hashing for data distribution',
      'Consider replication for fault tolerance',
      'Think about how to implement LRU efficiently (doubly linked list + hash map)',
      'Consider using TCP vs UDP for different operations',
      'Think about how to handle node failures and recovery'
    ],
    evaluationCriteria: [
      'Strong understanding of caching fundamentals',
      'Consistent hashing implementation',
      'Appropriate eviction policy choice',
      'Replication strategy for high availability',
      'Efficient data structures for cache operations',
      'Discusses monitoring and observability',
      'Considers network efficiency',
      'Addresses edge cases (cache stampede, hotkeys)'
    ],
    timeLimit: 50
  }
];
