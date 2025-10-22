import { Question, InterviewType, QuestionCategory, DifficultyLevel } from '../types';

export const codingQuestions: Question[] = [
  {
    id: 'code_001',
    type: InterviewType.CODING,
    category: QuestionCategory.ALGORITHMS,
    difficulty: DifficultyLevel.EASY,
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    hints: [
      'Think about using a hash map to store numbers you\'ve seen',
      'For each number, check if (target - number) exists in your hash map',
      'The time complexity can be O(n) with the right approach'
    ],
    evaluationCriteria: [
      'Correct solution that returns the right indices',
      'Time complexity: O(n) using hash map',
      'Space complexity: O(n)',
      'Code handles edge cases',
      'Code is clean and readable'
    ],
    timeLimit: 15
  },
  {
    id: 'code_002',
    type: InterviewType.CODING,
    category: QuestionCategory.DATA_STRUCTURES,
    difficulty: DifficultyLevel.EASY,
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example:
Input: s = "()[]{}"
Output: true`,
    hints: [
      'Consider using a stack data structure',
      'Push opening brackets onto the stack',
      'When you see a closing bracket, check if it matches the top of the stack'
    ],
    evaluationCriteria: [
      'Correct use of stack data structure',
      'Handles all bracket types correctly',
      'Checks for matching pairs',
      'Clean and efficient implementation'
    ],
    timeLimit: 20
  },
  {
    id: 'code_003',
    type: InterviewType.CODING,
    category: QuestionCategory.ALGORITHMS,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
    hints: [
      'Use the sliding window technique',
      'Keep track of characters in the current window using a hash set or map',
      'Move the window when you find a duplicate'
    ],
    evaluationCriteria: [
      'Implements sliding window correctly',
      'Uses appropriate data structure (hash map/set)',
      'Time complexity: O(n)',
      'Handles edge cases (empty string, all unique, all same)'
    ],
    timeLimit: 25
  },
  {
    id: 'code_004',
    type: InterviewType.CODING,
    category: QuestionCategory.ALGORITHMS,
    difficulty: DifficultyLevel.MEDIUM,
    title: 'Binary Tree Level Order Traversal',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]`,
    hints: [
      'Use a queue for breadth-first search (BFS)',
      'Process nodes level by level',
      'Keep track of the current level size'
    ],
    evaluationCriteria: [
      'Correct BFS implementation',
      'Properly groups nodes by level',
      'Handles null nodes correctly',
      'Clean code structure'
    ],
    timeLimit: 25
  },
  {
    id: 'code_005',
    type: InterviewType.CODING,
    category: QuestionCategory.ALGORITHMS,
    difficulty: DifficultyLevel.HARD,
    title: 'Merge K Sorted Lists',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]`,
    hints: [
      'Consider using a min heap (priority queue)',
      'Add the first node from each list to the heap',
      'Always take the smallest node and add the next node from that list'
    ],
    evaluationCriteria: [
      'Optimal solution using heap/priority queue',
      'Time complexity: O(N log k) where N is total nodes',
      'Handles empty lists',
      'Memory efficient'
    ],
    timeLimit: 35
  },
  {
    id: 'code_006',
    type: InterviewType.CODING,
    category: QuestionCategory.CODING_PATTERNS,
    difficulty: DifficultyLevel.HARD,
    title: 'Trapping Rain Water',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6`,
    hints: [
      'Think about how water is trapped between two bars',
      'You need to find the maximum height to the left and right of each position',
      'Consider using two pointers from both ends'
    ],
    evaluationCriteria: [
      'Correct algorithm (two pointers or dynamic programming)',
      'Time complexity: O(n)',
      'Space complexity: O(1) for optimal solution',
      'Clear explanation of approach'
    ],
    timeLimit: 40
  }
];
