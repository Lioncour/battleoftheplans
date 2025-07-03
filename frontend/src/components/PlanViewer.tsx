import React, { useState } from 'react';
import { Plan, Forecast } from '../types';
import { format } from 'date-fns';

interface PlanViewerProps {
  plan: Plan;
}

const PlanViewer: React.FC<PlanViewerProps> = ({ plan }) => {
  const [expandedForecasts, setExpandedForecasts] = useState<Set<string>>(new Set());

  // Get all forecasts for the same title to show predictions
  const getPredictionsForForecast = (forecast: Forecast) => {
    return plan.forecasts.filter(f => f.title === forecast.title);
  };

  // Get participant avatar by name
  const getParticipantAvatar = (participantName: string) => {
    const participant = plan.participants.find(p => p.name === participantName);
    return participant?.avatar;
  };

  const toggleForecast = (forecastId: string) => {
    const newExpanded = new Set(expandedForecasts);
    if (newExpanded.has(forecastId)) {
      newExpanded.delete(forecastId);
    } else {
      newExpanded.add(forecastId);
    }
    setExpandedForecasts(newExpanded);
  };

  return (
    <div className="plan-viewer">
      <div className="forecasts-section">
        <div className="forecasts-grid">
          {plan.forecasts.map((forecast) => {
            const predictions = getPredictionsForForecast(forecast);
            const isExpanded = expandedForecasts.has(forecast.id);
            
            return (
              <div key={forecast.id} className="forecast-card">
                <div 
                  className="forecast-header"
                  onClick={() => toggleForecast(forecast.id)}
                >
                  <div className="forecast-title-section">
                    <h4>{forecast.title}</h4>
                  </div>
                  <div className="forecast-toggle">
                    <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>
                
                <div className={`forecast-details ${isExpanded ? 'expanded' : ''}`}>
                  <p className="forecast-description">{forecast.description}</p>
                  <div className="forecast-meta">
                    <span className="forecast-date">
                      Date: {format(new Date(forecast.date), 'dd.MM.yyyy')}
                    </span>
                  </div>
                  
                  {/* Predictions section */}
                  <div className="predictions-section">
                    <div className="predictions-title">Predictions</div>
                    <div className="predictions-grid">
                      {predictions.map((prediction, index) => (
                        <div key={`${prediction.id}-${index}`} className="prediction-item">
                          {getParticipantAvatar(prediction.participants[0]) ? (
                            <img
                              src={getParticipantAvatar(prediction.participants[0])}
                              alt={prediction.participants[0]}
                              className="prediction-avatar"
                              style={{
                                transition: 'transform 0.25s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(3)';
                                e.currentTarget.style.zIndex = '1000';
                                e.currentTarget.style.filter = 'contrast(2) drop-shadow(0 0 8px #fff6e0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.25), 0 0 0 4px #C2B280';
                                const rect = e.currentTarget.getBoundingClientRect();
                                const padding = 32;
                                if (rect.left < padding) {
                                  e.currentTarget.classList.add('avatar-left');
                                } else if (window.innerWidth - rect.right < padding) {
                                  e.currentTarget.classList.add('avatar-right');
                                }
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.zIndex = '10';
                                e.currentTarget.style.filter = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.classList.remove('avatar-left');
                                e.currentTarget.classList.remove('avatar-right');
                              }}
                            />
                          ) : (
                            <div className="prediction-avatar">
                              {prediction.participants[0].split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <span className="prediction-text">
                            {prediction.participants[0]}: {prediction.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanViewer; 