---
title: Bounty Hunter Leaderboard
layout: base.njk
description: Submit and view bounty hunter kills - track the galaxy's most successful hunters
category: Community
---

# Bounty Hunter Leaderboard

Track the galaxy's most successful bounty hunters! Submit your kills and compete for the top spot.

## 🎯 Submit a Kill

<form id="kill-submission-form" class="submission-form">
  <div class="form-section">
    <h3>Hunter Information</h3>
    <div class="form-group">
      <label for="hunter-name">Hunter Name *</label>
      <input type="text" id="hunter-name" name="hunter-name" required 
             placeholder="Your character name">
    </div>
    
    <div class="form-group">
      <label for="hunter-faction">Faction</label>
      <select id="hunter-faction" name="hunter-faction">
        <option value="">Select Faction...</option>
        <option value="imperial">Imperial</option>
        <option value="rebel">Rebel</option>
        <option value="neutral">Neutral</option>
      </select>
    </div>
  </div>

  <div class="form-section">
    <h3>Target Information</h3>
    <div class="form-group">
      <label for="target-name">Target Name *</label>
      <input type="text" id="target-name" name="target-name" required 
             placeholder="Victim's character name">
    </div>
    
    <div class="form-group">
      <label for="target-level">Target Level</label>
      <input type="number" id="target-level" name="target-level" min="1" max="90" 
             placeholder="Target's level">
    </div>
    
    <div class="form-group">
      <label for="target-faction">Target Faction</label>
      <select id="target-faction" name="target-faction">
        <option value="">Select Faction...</option>
        <option value="imperial">Imperial</option>
        <option value="rebel">Rebel</option>
        <option value="neutral">Neutral</option>
      </select>
    </div>
  </div>

  <div class="form-section">
    <h3>Kill Details</h3>
    <div class="form-group">
      <label for="kill-date">Kill Date *</label>
      <input type="date" id="kill-date" name="kill-date" required>
    </div>
    
    <div class="form-group">
      <label for="kill-location">Location</label>
      <input type="text" id="kill-location" name="kill-location" 
             placeholder="e.g., Tatooine, Mos Eisley">
    </div>
    
    <div class="form-group">
      <label for="kill-method">Method</label>
      <select id="kill-method" name="kill-method">
        <option value="">Select Method...</option>
        <option value="ranged">Ranged Combat</option>
        <option value="melee">Melee Combat</option>
        <option value="trap">Trap/Explosive</option>
        <option value="poison">Poison</option>
        <option value="other">Other</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="kill-notes">Notes</label>
      <textarea id="kill-notes" name="kill-notes" rows="3"
                placeholder="Any additional details about the kill..."></textarea>
    </div>
  </div>

  <div class="form-section">
    <h3>Proof (Optional)</h3>
    <div class="form-group">
      <label for="screenshot">Screenshot URL</label>
      <input type="url" id="screenshot" name="screenshot" 
             placeholder="https://example.com/screenshot.jpg">
      <small>Link to screenshot or video proof</small>
    </div>
    
    <div class="form-group">
      <label for="witnesses">Witnesses</label>
      <input type="text" id="witnesses" name="witnesses" 
             placeholder="Names of witnesses (comma-separated)">
    </div>
  </div>

  <div class="form-group">
    <label>
      <input type="checkbox" id="agree-terms" name="agree-terms" required>
      I confirm this kill actually occurred and I have permission to submit this information
    </label>
  </div>

  <button type="submit" class="submit-btn">Submit Kill</button>
</form>

## 🏆 Leaderboard

<div class="leaderboard-controls">
  <div class="filter-group">
    <label for="sort-by">Sort by:</label>
    <select id="sort-by">
      <option value="kills">Total Kills</option>
      <option value="recent">Recent Activity</option>
      <option value="level">Highest Level Target</option>
      <option value="faction">Faction</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label for="faction-filter">Filter by Faction:</label>
    <select id="faction-filter">
      <option value="">All Factions</option>
      <option value="imperial">Imperial</option>
      <option value="rebel">Rebel</option>
      <option value="neutral">Neutral</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label for="time-filter">Time Period:</label>
    <select id="time-filter">
      <option value="all">All Time</option>
      <option value="month">This Month</option>
      <option value="week">This Week</option>
    </select>
  </div>
</div>

<div class="leaderboard-table">
  <table id="leaderboard">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Hunter</th>
        <th>Faction</th>
        <th>Total Kills</th>
        <th>Highest Level</th>
        <th>Recent Kill</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="leaderboard-body">
      <!-- Leaderboard data will be populated here -->
    </tbody>
  </table>
</div>

<div class="leaderboard-stats">
  <div class="stat-card">
    <h4>Total Kills</h4>
    <div id="total-kills" class="stat-number">0</div>
  </div>
  
  <div class="stat-card">
    <h4>Active Hunters</h4>
    <div id="active-hunters" class="stat-number">0</div>
  </div>
  
  <div class="stat-card">
    <h4>Top Hunter</h4>
    <div id="top-hunter" class="stat-text">--</div>
  </div>
  
  <div class="stat-card">
    <h4>Highest Level Target</h4>
    <div id="highest-level" class="stat-number">0</div>
  </div>
</div>

## 📋 Recent Kills

<div id="recent-kills" class="recent-kills">
  <!-- Recent kills will be populated here -->
</div>

## 📜 Rules & Guidelines

### **Submission Rules**
- **Accuracy**: Only submit kills that actually occurred
- **Permission**: Ensure you have permission to share target information
- **Proof**: Screenshots or witnesses are encouraged but not required
- **Respect**: Be respectful of other players and their privacy
- **No Harassment**: Do not use this system for harassment or griefing

### **Scoring System**
- **Base Points**: 1 point per kill
- **Level Bonus**: +0.1 points per target level above 50
- **Faction Bonus**: +0.5 points for cross-faction kills
- **Proof Bonus**: +0.2 points for verified kills with screenshots

### **Verification Process**
1. **Submission**: Kills are submitted through this form
2. **Review**: Our team reviews submissions for accuracy
3. **Verification**: Screenshots and witnesses help verify kills
4. **Approval**: Verified kills are added to the leaderboard
5. **Dispute**: Players can dispute incorrect submissions

### **Privacy & Safety**
- **Character Names**: Only character names are displayed (no real names)
- **Optional Details**: Location and method are optional
- **Screenshot Privacy**: Screenshots should not show personal information
- **Witness Protection**: Witness names are kept private unless specified

---

*This leaderboard is for entertainment and community building. Please respect other players and follow the community guidelines.* ⚖️

<script src="/scripts/leaderboard.js"></script> 