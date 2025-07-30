// Bounty Hunter Leaderboard
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('kill-submission-form');
  const leaderboardBody = document.getElementById('leaderboard-body');
  const recentKills = document.getElementById('recent-kills');
  
  if (!form) return;
  
  // Load leaderboard data from localStorage (in real app, this would be from server)
  let leaderboardData = JSON.parse(localStorage.getItem('swgdb-leaderboard')) || [];
  let recentKillsData = JSON.parse(localStorage.getItem('swgdb-recent-kills')) || [];
  
  // Initialize the page
  updateLeaderboard();
  updateRecentKills();
  updateStats();
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const killData = {
      id: Date.now().toString(),
      hunterName: formData.get('hunter-name'),
      hunterFaction: formData.get('hunter-faction'),
      targetName: formData.get('target-name'),
      targetLevel: parseInt(formData.get('target-level')) || 0,
      targetFaction: formData.get('target-faction'),
      killDate: formData.get('kill-date'),
      killLocation: formData.get('kill-location'),
      killMethod: formData.get('kill-method'),
      killNotes: formData.get('kill-notes'),
      screenshot: formData.get('screenshot'),
      witnesses: formData.get('witnesses'),
      submittedAt: new Date().toISOString(),
      verified: false,
      score: calculateKillScore(formData)
    };
    
    // Add to recent kills
    recentKillsData.unshift(killData);
    if (recentKillsData.length > 50) {
      recentKillsData.pop(); // Keep only last 50 kills
    }
    
    // Update leaderboard
    updateHunterStats(killData);
    
    // Save to localStorage
    localStorage.setItem('swgdb-leaderboard', JSON.stringify(leaderboardData));
    localStorage.setItem('swgdb-recent-kills', JSON.stringify(recentKillsData));
    
    // Update displays
    updateLeaderboard();
    updateRecentKills();
    updateStats();
    
    // Show success message
    showMessage('Kill submitted successfully! It will be reviewed by our team.', 'success');
    
    // Reset form
    form.reset();
  });
  
  // Calculate kill score
  function calculateKillScore(formData) {
    let score = 1; // Base points
    
    const targetLevel = parseInt(formData.get('target-level')) || 0;
    if (targetLevel > 50) {
      score += (targetLevel - 50) * 0.1; // Level bonus
    }
    
    const hunterFaction = formData.get('hunter-faction');
    const targetFaction = formData.get('target-faction');
    if (hunterFaction && targetFaction && hunterFaction !== targetFaction) {
      score += 0.5; // Cross-faction bonus
    }
    
    if (formData.get('screenshot')) {
      score += 0.2; // Proof bonus
    }
    
    return Math.round(score * 100) / 100;
  }
  
  // Update hunter statistics
  function updateHunterStats(killData) {
    const hunterName = killData.hunterName;
    let hunter = leaderboardData.find(h => h.name === hunterName);
    
    if (!hunter) {
      hunter = {
        name: hunterName,
        faction: killData.hunterFaction,
        totalKills: 0,
        totalScore: 0,
        highestLevel: 0,
        recentKill: null,
        kills: []
      };
      leaderboardData.push(hunter);
    }
    
    hunter.totalKills++;
    hunter.totalScore += killData.score;
    hunter.recentKill = killData.killDate;
    hunter.kills.push(killData);
    
    if (killData.targetLevel > hunter.highestLevel) {
      hunter.highestLevel = killData.targetLevel;
    }
  }
  
  // Update leaderboard display
  function updateLeaderboard() {
    const sortBy = document.getElementById('sort-by')?.value || 'kills';
    const factionFilter = document.getElementById('faction-filter')?.value || '';
    const timeFilter = document.getElementById('time-filter')?.value || 'all';
    
    // Filter and sort data
    let filteredData = [...leaderboardData];
    
    if (factionFilter) {
      filteredData = filteredData.filter(h => h.faction === factionFilter);
    }
    
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      if (timeFilter === 'month') {
        cutoff.setMonth(cutoff.getMonth() - 1);
      } else if (timeFilter === 'week') {
        cutoff.setDate(cutoff.getDate() - 7);
      }
      
      filteredData = filteredData.map(hunter => {
        const recentKills = hunter.kills.filter(kill => 
          new Date(kill.killDate) >= cutoff
        );
        return {
          ...hunter,
          totalKills: recentKills.length,
          totalScore: recentKills.reduce((sum, kill) => sum + kill.score, 0)
        };
      });
    }
    
    // Sort data
    filteredData.sort((a, b) => {
      switch (sortBy) {
        case 'kills':
          return b.totalKills - a.totalKills;
        case 'recent':
          return new Date(b.recentKill || 0) - new Date(a.recentKill || 0);
        case 'level':
          return b.highestLevel - a.highestLevel;
        case 'faction':
          return a.faction.localeCompare(b.faction);
        default:
          return b.totalScore - a.totalScore;
      }
    });
    
    // Update table
    leaderboardBody.innerHTML = '';
    
    filteredData.forEach((hunter, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${hunter.name}</strong></td>
        <td><span class="faction-badge ${hunter.faction}">${hunter.faction || 'Unknown'}</span></td>
        <td>${hunter.totalKills}</td>
        <td>${hunter.highestLevel}</td>
        <td>${hunter.recentKill ? new Date(hunter.recentKill).toLocaleDateString() : '--'}</td>
        <td>
          <button onclick="viewHunterDetails('${hunter.name}')" class="btn-small">View</button>
        </td>
      `;
      leaderboardBody.appendChild(row);
    });
  }
  
  // Update recent kills display
  function updateRecentKills() {
    recentKills.innerHTML = '';
    
    recentKillsData.slice(0, 10).forEach(kill => {
      const killCard = document.createElement('div');
      killCard.className = 'kill-card';
      killCard.innerHTML = `
        <div class="kill-header">
          <span class="hunter-name">${kill.hunterName}</span>
          <span class="kill-date">${new Date(kill.killDate).toLocaleDateString()}</span>
        </div>
        <div class="kill-details">
          <span class="target-name">→ ${kill.targetName}</span>
          ${kill.targetLevel ? `<span class="target-level">(Level ${kill.targetLevel})</span>` : ''}
        </div>
        ${kill.killLocation ? `<div class="kill-location">📍 ${kill.killLocation}</div>` : ''}
        ${kill.killMethod ? `<div class="kill-method">⚔️ ${kill.killMethod}</div>` : ''}
        <div class="kill-score">Score: ${kill.score}</div>
      `;
      recentKills.appendChild(killCard);
    });
  }
  
  // Update statistics
  function updateStats() {
    const totalKills = leaderboardData.reduce((sum, hunter) => sum + hunter.totalKills, 0);
    const activeHunters = leaderboardData.length;
    const topHunter = leaderboardData.length > 0 ? leaderboardData[0].name : '--';
    const highestLevel = Math.max(...leaderboardData.map(h => h.highestLevel), 0);
    
    document.getElementById('total-kills').textContent = totalKills;
    document.getElementById('active-hunters').textContent = activeHunters;
    document.getElementById('top-hunter').textContent = topHunter;
    document.getElementById('highest-level').textContent = highestLevel;
  }
  
  // Event listeners for filters
  document.getElementById('sort-by')?.addEventListener('change', updateLeaderboard);
  document.getElementById('faction-filter')?.addEventListener('change', updateLeaderboard);
  document.getElementById('time-filter')?.addEventListener('change', updateLeaderboard);
  
  // Helper functions
  function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem;
      background: ${type === 'success' ? '#28a745' : '#007bff'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
    `;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
  
  // Global function for viewing hunter details
  window.viewHunterDetails = function(hunterName) {
    const hunter = leaderboardData.find(h => h.name === hunterName);
    if (hunter) {
      alert(`${hunter.name}\nTotal Kills: ${hunter.totalKills}\nHighest Level: ${hunter.highestLevel}\nFaction: ${hunter.faction || 'Unknown'}`);
    }
  };
});

// Add CSS for the leaderboard
const style = document.createElement('style');
style.textContent = `
  .submission-form {
    max-width: 800px;
    margin: 0 auto 2rem;
  }
  
  .form-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .submit-btn {
    background: #dc3545;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    width: 100%;
  }
  
  .submit-btn:hover {
    background: #c82333;
  }
  
  .leaderboard-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-group select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .leaderboard-table {
    overflow-x: auto;
    margin-bottom: 2rem;
  }
  
  #leaderboard {
    width: 100%;
    border-collapse: collapse;
  }
  
  #leaderboard th,
  #leaderboard td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  #leaderboard th {
    background: #f8f9fa;
    font-weight: bold;
  }
  
  .faction-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .faction-badge.imperial { background: #dc3545; color: white; }
  .faction-badge.rebel { background: #007bff; color: white; }
  .faction-badge.neutral { background: #6c757d; color: white; }
  
  .btn-small {
    padding: 0.25rem 0.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .btn-small:hover {
    background: #0056b3;
  }
  
  .leaderboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
  }
  
  .stat-text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #007bff;
  }
  
  .recent-kills {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .kill-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .kill-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .hunter-name {
    font-weight: bold;
    color: #007bff;
  }
  
  .kill-date {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .kill-details {
    margin-bottom: 0.5rem;
  }
  
  .target-name {
    font-weight: bold;
  }
  
  .target-level {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .kill-location,
  .kill-method {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .kill-score {
    font-weight: bold;
    color: #28a745;
  }
`;
document.head.appendChild(style); 