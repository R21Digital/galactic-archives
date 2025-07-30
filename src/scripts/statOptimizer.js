// SWG Stat Optimizer
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('stat-calculator');
  const results = document.getElementById('optimization-results');
  
  if (!form) return;
  
  // Profession-specific stat requirements
  const professionRequirements = {
    'bounty-hunter': {
      primary: ['agility', 'quickness'],
      secondary: ['strength', 'constitution'],
      combat: ['ranged-accuracy', 'ranged-damage'],
      description: 'Ranged combat specialist with tracking abilities'
    },
    'commando': {
      primary: ['strength', 'constitution'],
      secondary: ['agility', 'stamina'],
      combat: ['melee-damage', 'ranged-damage'],
      description: 'Heavy armor combat specialist'
    },
    'medic': {
      primary: ['mind', 'focus'],
      secondary: ['constitution', 'stamina'],
      combat: ['defense'],
      description: 'Healing and support specialist'
    },
    'entertainer': {
      primary: ['mind', 'focus'],
      secondary: ['agility', 'quickness'],
      combat: ['defense'],
      description: 'Buffing and social specialist'
    },
    'artisan': {
      primary: ['stamina', 'mind'],
      secondary: ['focus', 'constitution'],
      combat: ['defense'],
      description: 'Crafting and resource specialist'
    },
    'trader': {
      primary: ['mind', 'focus'],
      secondary: ['stamina', 'constitution'],
      combat: ['defense'],
      description: 'Commerce and business specialist'
    },
    'ranger': {
      primary: ['agility', 'quickness'],
      secondary: ['strength', 'constitution'],
      combat: ['ranged-accuracy', 'melee-damage'],
      description: 'Survival and tracking specialist'
    },
    'scout': {
      primary: ['agility', 'quickness'],
      secondary: ['stamina', 'constitution'],
      combat: ['ranged-accuracy', 'defense'],
      description: 'Reconnaissance and survival specialist'
    },
    'squad-leader': {
      primary: ['mind', 'focus'],
      secondary: ['constitution', 'stamina'],
      combat: ['melee-damage', 'defense'],
      description: 'Leadership and tactical specialist'
    },
    'officer': {
      primary: ['mind', 'focus'],
      secondary: ['constitution', 'stamina'],
      combat: ['ranged-damage', 'defense'],
      description: 'Command and strategy specialist'
    },
    'pilot': {
      primary: ['agility', 'quickness'],
      secondary: ['mind', 'focus'],
      combat: ['ranged-accuracy'],
      description: 'Space combat and navigation specialist'
    },
    'force-sensitive': {
      primary: ['mind', 'willpower'],
      secondary: ['focus', 'constitution'],
      combat: ['melee-damage', 'defense'],
      description: 'Force abilities and lightsaber combat'
    }
  };
  
  // Equipment bonuses
  const equipmentBonuses = {
    'vibro-axe': { 'melee-damage': 50, 'melee-speed': -10 },
    'vibro-knuckler': { 'melee-damage': 30, 'melee-speed': 20 },
    'sword': { 'melee-damage': 40, 'melee-speed': 0 },
    'rifle': { 'ranged-damage': 60, 'ranged-speed': -20 },
    'pistol': { 'ranged-damage': 30, 'ranged-speed': 10 },
    'carbine': { 'ranged-damage': 45, 'ranged-speed': -5 },
    'light': { 'armor': 20, 'defense': 10 },
    'medium': { 'armor': 40, 'defense': 20 },
    'heavy': { 'armor': 60, 'defense': 30 },
    'battle': { 'armor': 80, 'defense': 40 },
    'light-shield': { 'defense': 15 },
    'medium-shield': { 'defense': 25 },
    'heavy-shield': { 'defense': 35 }
  };
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const stats = {
      profession: formData.get('profession'),
      level: parseInt(formData.get('level')) || 80,
      health: parseInt(formData.get('health')) || 1000,
      action: parseInt(formData.get('action')) || 1000,
      mind: parseInt(formData.get('mind')) || 1000,
      strength: parseInt(formData.get('strength')) || 100,
      constitution: parseInt(formData.get('constitution')) || 100,
      stamina: parseInt(formData.get('stamina')) || 100,
      agility: parseInt(formData.get('agility')) || 100,
      quickness: parseInt(formData.get('quickness')) || 100,
      focus: parseInt(formData.get('focus')) || 100,
      willpower: parseInt(formData.get('willpower')) || 100,
      'melee-accuracy': parseInt(formData.get('melee-accuracy')) || 0,
      'melee-speed': parseInt(formData.get('melee-speed')) || 0,
      'melee-damage': parseInt(formData.get('melee-damage')) || 0,
      'ranged-accuracy': parseInt(formData.get('ranged-accuracy')) || 0,
      'ranged-speed': parseInt(formData.get('ranged-speed')) || 0,
      'ranged-damage': parseInt(formData.get('ranged-damage')) || 0,
      defense: parseInt(formData.get('defense')) || 0,
      armor: parseInt(formData.get('armor')) || 0,
      weapon: formData.get('weapon'),
      'armor-type': formData.get('armor-type'),
      shield: formData.get('shield')
    };
    
    const analysis = analyzeStats(stats);
    displayResults(analysis);
  });
  
  function analyzeStats(stats) {
    const profession = professionRequirements[stats.profession];
    if (!profession) {
      return { error: 'Please select a profession' };
    }
    
    // Calculate base scores
    const baseStats = ['strength', 'constitution', 'stamina', 'agility', 'quickness', 'focus', 'willpower'];
    const combatStats = ['melee-accuracy', 'melee-speed', 'melee-damage', 'ranged-accuracy', 'ranged-speed', 'ranged-damage', 'defense', 'armor'];
    
    let totalScore = 0;
    let maxScore = 0;
    const recommendations = [];
    const priorities = [];
    
    // Analyze base stats
    baseStats.forEach(stat => {
      const value = stats[stat];
      const isPrimary = profession.primary.includes(stat);
      const isSecondary = profession.secondary.includes(stat);
      
      let targetValue = 100; // Base target
      if (isPrimary) targetValue = 150;
      if (isSecondary) targetValue = 125;
      
      const score = Math.min(value / targetValue, 1) * 100;
      totalScore += score;
      maxScore += 100;
      
      if (score < 70) {
        recommendations.push(`Increase ${stat.replace('-', ' ')} to at least ${Math.round(targetValue * 0.7)}`);
      }
      
      priorities.push({
        stat: stat,
        current: value,
        target: targetValue,
        priority: isPrimary ? 'High' : isSecondary ? 'Medium' : 'Low',
        score: score
      });
    });
    
    // Analyze combat stats
    combatStats.forEach(stat => {
      const value = stats[stat];
      const isCombat = profession.combat.includes(stat);
      
      let targetValue = 50; // Base combat target
      if (isCombat) targetValue = 100;
      
      const score = Math.min(value / targetValue, 1) * 100;
      totalScore += score;
      maxScore += 100;
      
      if (score < 60) {
        recommendations.push(`Improve ${stat.replace('-', ' ')} to at least ${Math.round(targetValue * 0.6)}`);
      }
    });
    
    // Apply equipment bonuses
    let equipmentBonus = 0;
    if (stats.weapon && equipmentBonuses[stats.weapon]) {
      equipmentBonus += 20;
    }
    if (stats['armor-type'] && equipmentBonuses[stats['armor-type']]) {
      equipmentBonus += 20;
    }
    if (stats.shield && equipmentBonuses[stats.shield]) {
      equipmentBonus += 15;
    }
    
    totalScore += equipmentBonus;
    maxScore += 55; // Max equipment bonus
    
    const performanceScore = Math.round((totalScore / maxScore) * 100);
    
    // Generate specific recommendations
    if (performanceScore < 70) {
      recommendations.push('Consider upgrading your equipment');
      recommendations.push('Focus on your profession\'s primary stats');
    }
    
    if (stats.level < 80) {
      recommendations.push('Continue leveling to unlock more stat points');
    }
    
    return {
      performanceScore: performanceScore,
      recommendations: recommendations,
      priorities: priorities.sort((a, b) => b.score - a.score),
      profession: profession,
      stats: stats
    };
  }
  
  function displayResults(analysis) {
    if (analysis.error) {
      alert(analysis.error);
      return;
    }
    
    // Show results section
    results.style.display = 'block';
    
    // Update performance score
    const scoreElement = document.getElementById('performance-score');
    scoreElement.textContent = `${analysis.performanceScore}%`;
    scoreElement.className = `score ${analysis.performanceScore >= 80 ? 'excellent' : analysis.performanceScore >= 60 ? 'good' : 'needs-improvement'}`;
    
    // Update recommendations
    const recommendationsElement = document.getElementById('recommendations');
    recommendationsElement.innerHTML = '';
    analysis.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      recommendationsElement.appendChild(li);
    });
    
    // Update priorities
    const prioritiesElement = document.getElementById('stat-priorities');
    prioritiesElement.innerHTML = '';
    analysis.priorities.slice(0, 5).forEach(priority => {
      const div = document.createElement('div');
      div.className = 'priority-item';
      div.innerHTML = `
        <span class="stat-name">${priority.stat.replace('-', ' ')}</span>
        <span class="stat-value">${priority.current}/${priority.target}</span>
        <span class="priority-level ${priority.priority.toLowerCase()}">${priority.priority}</span>
      `;
      prioritiesElement.appendChild(div);
    });
    
    // Generate simple chart
    generateStatChart(analysis.stats);
  }
  
  function generateStatChart(stats) {
    const chartElement = document.getElementById('stat-chart');
    chartElement.innerHTML = '';
    
    const baseStats = ['strength', 'constitution', 'stamina', 'agility', 'quickness', 'focus', 'willpower'];
    
    baseStats.forEach(stat => {
      const value = stats[stat];
      const percentage = Math.min((value / 150) * 100, 100);
      
      const bar = document.createElement('div');
      bar.className = 'stat-bar';
      bar.innerHTML = `
        <div class="stat-label">${stat.replace('-', ' ')}</div>
        <div class="stat-bar-container">
          <div class="stat-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="stat-value">${value}</div>
      `;
      chartElement.appendChild(bar);
    });
  }
});

// Add CSS for the optimizer
const style = document.createElement('style');
style.textContent = `
  .optimizer-form {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
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
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .optimize-btn {
    background: #007bff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    width: 100%;
    margin-top: 1rem;
  }
  
  .optimize-btn:hover {
    background: #0056b3;
  }
  
  .results-section {
    margin-top: 2rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .result-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .score {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }
  
  .score.excellent { color: #28a745; }
  .score.good { color: #ffc107; }
  .score.needs-improvement { color: #dc3545; }
  
  .recommendations-list {
    list-style: none;
    padding: 0;
  }
  
  .recommendations-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .priority-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .priority-level {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .priority-level.high { background: #dc3545; color: white; }
  .priority-level.medium { background: #ffc107; color: black; }
  .priority-level.low { background: #28a745; color: white; }
  
  .chart-container {
    margin-top: 1rem;
  }
  
  .stat-bar {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    width: 100px;
    font-weight: bold;
  }
  
  .stat-bar-container {
    flex: 1;
    height: 20px;
    background: #eee;
    border-radius: 10px;
    margin: 0 1rem;
    overflow: hidden;
  }
  
  .stat-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
  }
  
  .stat-value {
    width: 50px;
    text-align: right;
  }
`;
document.head.appendChild(style); 