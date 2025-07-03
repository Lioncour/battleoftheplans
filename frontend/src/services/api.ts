import axios from 'axios';
import { Plan } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCurrentPlan = async (): Promise<Plan> => {
  const response = await api.get('/plans/current');
  return response.data;
};

export const createPlan = async (planData: Partial<Plan>): Promise<Plan> => {
  const response = await api.post('/plans', planData);
  return response.data;
};

export const submitGuess = async (
  planId: string,
  forecastId: string,
  guesserName: string,
  guess: any
): Promise<Plan> => {
  const response = await api.post(`/plans/${planId}/guess`, {
    forecastId,
    guesserName,
    guess,
  });
  return response.data;
};

export const startPlan = async (planId: string): Promise<Plan> => {
  const response = await api.post(`/plans/${planId}/start`);
  return response.data;
}; 