import React from 'react';
import { format, parseISO } from 'date-fns';
import { Forecast } from '../types';

interface HorizontalTimelineProps {
  closedForecasts?: Array<Forecast & { closedAt: Date }>;
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ closedForecasts = [] }) => {
  // Timeline period: July 1 - December 31, 2024
  const timelineStart = new Date('2024-07-01');
  const timelineEnd = new Date('2024-12-31');
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));

  // Generate month markers
  const months = [
    { name: 'JUL', date: new Date('2024-07-01') },
    { name: 'AUG', date: new Date('2024-08-01') },
    { name: 'SEP', date: new Date('2024-09-01') },
    { name: 'OCT', date: new Date('2024-10-01') },
    { name: 'NOV', date: new Date('2024-11-01') },
    { name: 'DEC', date: new Date('2024-12-01') }
  ];

  const getPositionForDate = (date: Date) => {
    const daysFromStart = Math.ceil((date.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(100, (daysFromStart / totalDays) * 100));
  };

  const getPositionForMonth = (date: Date) => {
    return getPositionForDate(date);
  };

  return (
    <div className="horizontal-timeline">
      {/* Timeline line */}
      <div className="timeline-line">
        {/* Month markers */}
        {months.map((month, index) => (
          <div
            key={month.name}
            className="month-marker"
            style={{ left: `${getPositionForMonth(month.date)}%` }}
          >
            <div className="month-dot"></div>
            <span className="month-label">{month.name}</span>
          </div>
        ))}

        {/* Closed forecasts */}
        {closedForecasts.map((forecast, index) => {
          const forecastDate = parseISO(forecast.date);
          const position = getPositionForDate(forecastDate);
          
          return (
            <div
              key={`${forecast.id}-${index}`}
              className="forecast-marker"
              style={{ left: `${position}%` }}
            >
              <div className="forecast-dot"></div>
              <div className="forecast-tooltip">
                <div className="tooltip-header">
                  <span className="participant-name">{forecast.participants[0]}</span>
                  <span className="close-date">{format(forecast.closedAt, 'dd.MM.yyyy')}</span>
                </div>
                <div className="tooltip-description">{forecast.description}</div>
                <div className="tooltip-forecast-date">
                  Forecast: {format(forecastDate, 'dd.MM.yyyy')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* No forecasts message */}
      {closedForecasts.length === 0 && (
        <div className="timeline-placeholder">
          <span>No forecasts closed yet. Close a forecast to see it here!</span>
        </div>
      )}
    </div>
  );
};

export default HorizontalTimeline; 