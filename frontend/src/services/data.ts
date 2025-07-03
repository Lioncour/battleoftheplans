import { Forecast, Participant } from '../types';

export const fetchData = async (): Promise<{ forecasts: Forecast[], participants: Participant[] }> => {
  try {
    const response = await fetch('/data/forecasts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}; 