import express from 'express';
import Plan from '../models/Plan';

const router = express.Router();

// Get current plan
router.get('/current', async (req, res) => {
  try {
    const plan = await Plan.findOne({
      $or: [
        { status: 'active' },
        { status: 'upcoming' }
      ]
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'No active or upcoming plan found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ message: 'Error fetching plan', error });
  }
});

// Create new plan
router.post('/', async (req, res) => {
  try {
    const { name, startDate, endDate, forecasts } = req.body;
    
    console.log('Received plan creation request:', {
      name,
      startDate,
      endDate,
      forecasts
    });
    
    // Check if there's already an active or upcoming plan
    const existingPlan = await Plan.findOne({
      $or: [
        { status: 'active' },
        { status: 'upcoming' }
      ]
    });
    
    if (existingPlan) {
      return res.status(400).json({ message: 'There is already an active or upcoming plan' });
    }
    
    // Convert string dates to Date objects and add IDs to forecasts
    const planData = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      forecasts: forecasts.map((f: any, index: number) => ({
        id: `forecast_${Date.now()}_${index}`,
        type: f.type,
        question: f.question,
        correctAnswer: f.correctAnswer
      }))
    };
    
    console.log('Creating plan with data:', planData);
    
    const plan = await Plan.save(planData);
    
    console.log('Plan created successfully:', plan);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ 
      message: 'Error creating plan', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    });
  }
});

// Submit a guess
router.post('/:planId/guess', async (req, res) => {
  try {
    const { planId } = req.params;
    const { forecastId, guesserName, guess } = req.body;
    
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    if (plan.status !== 'upcoming') {
      return res.status(400).json({ message: 'Can only submit guesses for upcoming plans' });
    }
    
    // Check if user already guessed this forecast
    const existingGuess = plan.guesses.find(
      g => g.forecastId === forecastId && g.guesserName === guesserName
    );
    
    if (existingGuess) {
      return res.status(400).json({ message: 'You have already submitted a guess for this forecast' });
    }
    
    plan.guesses.push({ 
      id: `guess_${Date.now()}_${Math.random()}`,
      forecastId, 
      guesserName, 
      guess 
    });
    await Plan.save(plan);
    
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error submitting guess:', error);
    res.status(500).json({ message: 'Error submitting guess', error });
  }
});

// Start a plan
router.post('/:planId/start', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await Plan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    if (plan.status !== 'upcoming') {
      return res.status(400).json({ message: 'Can only start upcoming plans' });
    }
    
    plan.status = 'active';
    await Plan.save(plan);
    
    res.json(plan);
  } catch (error) {
    console.error('Error starting plan:', error);
    res.status(500).json({ message: 'Error starting plan', error });
  }
});

// Set correct answer and scores for a forecast (admin)
router.post('/:planId/forecast/:forecastId/resolve', async (req, res) => {
  try {
    const { planId, forecastId } = req.params;
    const { correctAnswer, scores } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Find the forecast and update correctAnswer
    const forecast = plan.forecasts.find(f => f.id === forecastId);
    if (!forecast) {
      return res.status(404).json({ message: 'Forecast not found' });
    }
    forecast.correctAnswer = correctAnswer;

    // Update scores for guesses
    if (Array.isArray(scores)) {
      for (const { guessId, score } of scores) {
        const guess = plan.guesses.find(g => g.id === guessId);
        if (guess) {
          guess.score = score;
        }
      }
    }

    await Plan.save(plan);
    res.json(plan);
  } catch (error) {
    console.error('Error resolving forecast:', error);
    res.status(500).json({ message: 'Error resolving forecast', error });
  }
});

export default router; 