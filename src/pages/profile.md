---
title: User Profile & Character Registry
layout: base.njk
description: Manage your SWGDB profile and register your SWG characters
category: Community
---

# User Profile & Character Registry

Manage your SWGDB account and register your SWG characters to track your progress and achievements.

## 👤 User Profile

<div id="user-profile" class="profile-section">
  <div class="profile-card">
    <div class="profile-header">
      <div class="profile-avatar">
        <img src="/images/default-avatar.png" alt="User Avatar" id="user-avatar">
        <button class="avatar-upload-btn" onclick="uploadAvatar()">Change Avatar</button>
      </div>
      <div class="profile-info">
        <h3 id="user-display-name">Guest User</h3>
        <p id="user-email">Not logged in</p>
        <div class="profile-stats">
          <span class="stat">📝 <span id="user-posts">0</span> posts</span>
          <span class="stat">🎮 <span id="user-characters">0</span> characters</span>
          <span class="stat">🏆 <span id="user-achievements">0</span> achievements</span>
        </div>
      </div>
    </div>
    
    <div class="profile-actions">
      <button id="login-btn" class="btn-primary" onclick="showLoginModal()">Login</button>
      <button id="register-btn" class="btn-secondary" onclick="showRegisterModal()">Register</button>
      <button id="logout-btn" class="btn-danger" onclick="logout()" style="display: none;">Logout</button>
    </div>
  </div>
</div>

## 🎮 Character Registry

<div id="character-registry" class="registry-section">
  <div class="registry-header">
    <h3>Your SWG Characters</h3>
    <button class="btn-primary" onclick="showAddCharacterModal()">Add Character</button>
  </div>
  
  <div id="characters-list" class="characters-grid">
    <!-- Characters will be populated here -->
  </div>
</div>

## 📊 Character Statistics

<div id="character-stats" class="stats-section">
  <div class="stats-grid">
    <div class="stat-card">
      <h4>Total Characters</h4>
      <div class="stat-number" id="total-characters">0</div>
    </div>
    
    <div class="stat-card">
      <h4>Highest Level</h4>
      <div class="stat-number" id="highest-level">0</div>
    </div>
    
    <div class="stat-card">
      <h4>Total Playtime</h4>
      <div class="stat-number" id="total-playtime">0h</div>
    </div>
    
    <div class="stat-card">
      <h4>Factions</h4>
      <div class="stat-number" id="faction-count">0</div>
    </div>
  </div>
</div>

## 🏆 Achievements

<div id="achievements" class="achievements-section">
  <h3>Your Achievements</h3>
  <div id="achievements-grid" class="achievements-grid">
    <!-- Achievements will be populated here -->
  </div>
</div>

## 📝 Activity History

<div id="activity-history" class="activity-section">
  <h3>Recent Activity</h3>
  <div id="activity-feed" class="activity-feed">
    <!-- Activity feed will be populated here -->
  </div>
</div>

<!-- Login Modal -->
<div id="login-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close" onclick="closeModal('login-modal')">&times;</span>
    <h3>Login to SWGDB</h3>
    
    <form id="login-form" class="auth-form">
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" name="password" required>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" id="remember-me" name="remember">
          Remember me
        </label>
      </div>
      
      <button type="submit" class="btn-primary">Login</button>
    </form>
    
    <p class="auth-links">
      <a href="#" onclick="showForgotPasswordModal()">Forgot Password?</a>
      <span> | </span>
      <a href="#" onclick="showRegisterModal()">Create Account</a>
    </p>
  </div>
</div>

<!-- Register Modal -->
<div id="register-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close" onclick="closeModal('register-modal')">&times;</span>
    <h3>Create SWGDB Account</h3>
    
    <form id="register-form" class="auth-form">
      <div class="form-group">
        <label for="register-username">Username</label>
        <input type="text" id="register-username" name="username" required>
      </div>
      
      <div class="form-group">
        <label for="register-email">Email</label>
        <input type="email" id="register-email" name="email" required>
      </div>
      
      <div class="form-group">
        <label for="register-password">Password</label>
        <input type="password" id="register-password" name="password" required>
      </div>
      
      <div class="form-group">
        <label for="register-confirm-password">Confirm Password</label>
        <input type="password" id="register-confirm-password" name="confirm-password" required>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" id="agree-terms" name="agree-terms" required>
          I agree to the <a href="/community-standards/">Community Standards</a>
        </label>
      </div>
      
      <button type="submit" class="btn-primary">Create Account</button>
    </form>
  </div>
</div>

<!-- Add Character Modal -->
<div id="add-character-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close" onclick="closeModal('add-character-modal')">&times;</span>
    <h3>Add SWG Character</h3>
    
    <form id="add-character-form" class="character-form">
      <div class="form-group">
        <label for="character-name">Character Name *</label>
        <input type="text" id="character-name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="character-server">Server *</label>
        <select id="character-server" name="server" required>
          <option value="">Select Server...</option>
          <option value="swgr">SWG Restoration</option>
          <option value="swgemu">SWGEmu</option>
          <option value="legends">SWG Legends</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="character-faction">Faction</label>
        <select id="character-faction" name="faction">
          <option value="">Select Faction...</option>
          <option value="imperial">Imperial</option>
          <option value="rebel">Rebel</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="character-profession">Primary Profession</label>
        <select id="character-profession" name="profession">
          <option value="">Select Profession...</option>
          <option value="bounty-hunter">Bounty Hunter</option>
          <option value="commando">Commando</option>
          <option value="smuggler">Smuggler</option>
          <option value="spy">Spy</option>
          <option value="medic">Medic</option>
          <option value="entertainer">Entertainer</option>
          <option value="artisan">Artisan</option>
          <option value="trader">Trader</option>
          <option value="ranger">Ranger</option>
          <option value="scout">Scout</option>
          <option value="squad-leader">Squad Leader</option>
          <option value="officer">Officer</option>
          <option value="pilot">Pilot</option>
          <option value="force-sensitive">Force Sensitive</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="character-level">Level</label>
        <input type="number" id="character-level" name="level" min="1" max="90">
      </div>
      
      <div class="form-group">
        <label for="character-playtime">Playtime (hours)</label>
        <input type="number" id="character-playtime" name="playtime" min="0">
      </div>
      
      <div class="form-group">
        <label for="character-notes">Notes</label>
        <textarea id="character-notes" name="notes" rows="3" 
                  placeholder="Any additional information about your character..."></textarea>
      </div>
      
      <button type="submit" class="btn-primary">Add Character</button>
    </form>
  </div>
</div>

---

*Your profile and character registry help us provide personalized content and track community achievements.* 🎮

<script src="/scripts/profile.js"></script> 