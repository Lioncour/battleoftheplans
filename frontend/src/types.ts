export interface Participant {
  id: string;
  name: string;
  email: string;
  score: number;
  avatar?: string;
}

export interface Forecast {
  id: string;
  date: string;
  title: string;
  description: string;
  participants: string[];
  answerDate: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  forecasts: Forecast[];
  participants: Participant[];
} 