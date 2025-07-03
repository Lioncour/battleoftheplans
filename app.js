// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    renderLeaderboard();
    renderForecasts();
});

// Render the leaderboard
function renderLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    
    // Create leaderboard entries with dummy scores
    const leaderboard = appData.participants.map((participant, index) => ({
        ...participant,
        score: 102,
        rank: index + 1
    }));

    leaderboardContainer.innerHTML = leaderboard.map(entry => `
        <div class="leaderboard-entry">
            ${entry.avatar ? 
                `<img src="${entry.avatar}" alt="${entry.name}" class="leaderboard-avatar">` :
                `<div class="leaderboard-avatar">${entry.name.split(' ').map(n => n[0]).join('')}</div>`
            }
            <span style="color: var(--text-primary)">${entry.name}</span>
            <span class="leaderboard-score">${entry.score}</span>
        </div>
    `).join('');
}

// Render the forecasts
function renderForecasts() {
    const forecastsContainer = document.getElementById('forecasts-container');
    
    // Get unique forecast titles to group predictions
    const uniqueTitles = [...new Set(appData.forecasts.map(f => f.title))];
    
    forecastsContainer.innerHTML = uniqueTitles.map(title => {
        const forecastsForTitle = appData.forecasts.filter(f => f.title === title);
        const firstForecast = forecastsForTitle[0];
        
        return `
            <div class="forecast-card" data-title="${title}">
                <div class="forecast-header" onclick="toggleForecast('${title}')">
                    <div class="forecast-title-section">
                        <h4>${title}</h4>
                    </div>
                    <div class="forecast-toggle">
                        <span class="toggle-icon">▼</span>
                    </div>
                </div>
                
                <div class="forecast-details">
                    <p class="forecast-description">${firstForecast.description}</p>
                    <div class="forecast-meta">
                        <span class="forecast-date">
                            Date: ${formatDate(firstForecast.date)}
                        </span>
                    </div>
                    
                    <div class="predictions-section">
                        <div class="predictions-title">Predictions</div>
                        <div class="predictions-grid">
                            ${forecastsForTitle.map(prediction => {
                                const participant = appData.participants.find(p => p.name === prediction.participants[0]);
                                return `
                                    <div class="prediction-item">
                                        ${participant && participant.avatar ? 
                                            `<img src="${participant.avatar}" alt="${prediction.participants[0]}" class="prediction-avatar">` :
                                            `<div class="prediction-avatar">${prediction.participants[0].split(' ').map(n => n[0]).join('')}</div>`
                                        }
                                        <span class="prediction-text">
                                            ${prediction.participants[0]}: ${prediction.description}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle forecast expansion
function toggleForecast(title) {
    const forecastCard = document.querySelector(`[data-title="${title}"]`);
    const details = forecastCard.querySelector('.forecast-details');
    const toggleIcon = forecastCard.querySelector('.toggle-icon');
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        toggleIcon.classList.remove('expanded');
    } else {
        details.classList.add('expanded');
        toggleIcon.classList.add('expanded');
    }
}

// Format date helper function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
} 