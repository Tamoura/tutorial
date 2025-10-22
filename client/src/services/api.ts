import axios from 'axios';
import { InterviewType, InterviewSession, AgentResponse, InterviewTypeInfo } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  // Get available interview types
  async getInterviewTypes(): Promise<InterviewTypeInfo[]> {
    const response = await api.get('/interview-types');
    return response.data.types;
  },

  // Create a new interview session
  async createSession(type: InterviewType, candidateName?: string): Promise<{
    session: InterviewSession;
    message: string;
  }> {
    const response = await api.post('/sessions', { type, candidateName });
    return response.data;
  },

  // Get session details
  async getSession(sessionId: string): Promise<{
    session: InterviewSession;
    currentQuestion: any;
  }> {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Submit an answer
  async submitAnswer(
    sessionId: string,
    questionId: string,
    content: string,
    timeSpent?: number
  ): Promise<AgentResponse> {
    const response = await api.post(`/sessions/${sessionId}/answers`, {
      questionId,
      content,
      timeSpent
    });
    return response.data;
  },

  // Request a hint
  async requestHint(sessionId: string): Promise<AgentResponse> {
    const response = await api.post(`/sessions/${sessionId}/hints`);
    return response.data;
  },

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`);
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/health');
    return response.data;
  }
};
