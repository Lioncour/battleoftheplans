export interface IPlan {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  forecasts: Array<{
    id: string;
    type: 'date' | 'list' | 'map' | 'number';
    question: string;
    correctAnswer: any;
  }>;
  guesses: Array<{
    id: string;
    forecastId: string;
    guesserName: string;
    guess: any;
    score?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
let plans: IPlan[] = [];
let nextId = 1;

export class Plan {
  static async findOne(query: any): Promise<IPlan | null> {
    if (query.$or) {
      return plans.find(plan => 
        query.$or.some((condition: any) => 
          Object.keys(condition).every(key => plan[key as keyof IPlan] === condition[key])
        )
      ) || null;
    }
    return plans.find(plan => 
      Object.keys(query).every(key => plan[key as keyof IPlan] === query[key])
    ) || null;
  }

  static async findById(id: string): Promise<IPlan | null> {
    return plans.find(plan => plan.id === id) || null;
  }

  static async save(planData: Partial<IPlan>): Promise<IPlan> {
    const now = new Date();
    const plan: IPlan = {
      id: planData.id || nextId.toString(),
      name: planData.name!,
      startDate: planData.startDate!,
      endDate: planData.endDate!,
      status: planData.status || 'upcoming',
      forecasts: planData.forecasts || [],
      guesses: planData.guesses || [],
      createdAt: planData.createdAt || now,
      updatedAt: now
    };

    if (!planData.id) {
      nextId++;
      plans.push(plan);
    } else {
      const index = plans.findIndex(p => p.id === plan.id);
      if (index >= 0) {
        plans[index] = plan;
      } else {
        plans.push(plan);
      }
    }

    return plan;
  }
}

export default Plan; 