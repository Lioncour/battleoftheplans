import React, { useState, useEffect } from 'react';
import { Plan } from './types';
import { fetchData } from './services/data';
import PlanViewer from './components/PlanViewer';
import HorizontalTimeline from './components/HorizontalTimeline';
import './App.css';

function App() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { forecasts, participants } = await fetchData();
        // Create a plan object from the data
        const currentPlan: Plan = {
          id: '1',
          title: 'Battle of Plans 2024',
          description: 'Forecasts for various events in 2024',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
          forecasts,
          participants
        };
        setPlan(currentPlan);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Leaderboard calculation (dummy: all participants, score 102)
  const leaderboard = plan?.participants.map((p, i) => ({
    ...p,
    score: 102,
    rank: i + 1
  })) || [];

  if (loading) {
    return <div className="loading">LOADING SYSTEM...</div>;
  }

  if (error) {
    return <div className="error">ERROR: {error}</div>;
  }

  return (
    <div className="app-layout">
      <div className="main-content-area">
        <aside className="sidebar">
          <div>
            <h2 className="neon-text" style={{ color: 'var(--neon-pink)', fontWeight: 700, fontSize: '1.6rem', marginBottom: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
              Battle of the Plans
            </h2>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Season 2
            </div>
            <div className="section-title">Leaderboard</div>
            <button 
              onClick={() => console.log('Test button clicked!')}
              style={{ 
                background: 'red', 
                color: 'white', 
                padding: '10px', 
                margin: '10px',
                cursor: 'pointer'
              }}
            >
              Test Button
            </button>
            {leaderboard.map((entry) => (
              <div className="leaderboard-entry" key={entry.id}>
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="leaderboard-avatar"
                    style={{
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                      border: '3px solid blue'
                    }}
                    onMouseEnter={() => console.log('Mouse enter on avatar:', entry.name)}
                    onMouseLeave={() => console.log('Mouse leave on avatar:', entry.name)}
                    onClick={() => console.log('Avatar clicked:', entry.name)}
                  />
                ) : (
                  <div className="leaderboard-avatar">
                    {entry.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <span style={{ color: 'var(--text-primary)' }}>{entry.name}</span>
                <span className="leaderboard-score">{entry.score}</span>
              </div>
            ))}
          </div>
        </aside>
        
        <main className="main-content">
          {plan && <PlanViewer plan={plan} />}
        </main>
      </div>

      <div className="bottom-timeline">
        <div className="timeline-header">
          <h3>Timeline</h3>
          <span>July 1 - December 31, 2024</span>
        </div>
        <div className="timeline-container">
          <HorizontalTimeline />
        </div>
      </div>
    </div>
  );
}

export default App;
