// User Profile and Character Registry
document.addEventListener('DOMContentLoaded', function() {
  // Load user data from localStorage (in real app, this would be from server)
  let currentUser = JSON.parse(localStorage.getItem('swgdb-current-user')) || null;
  let characters = JSON.parse(localStorage.getItem('swgdb-characters')) || [];
  let achievements = JSON.parse(localStorage.getItem('swgdb-achievements')) || [];
  
  // Initialize the page
  updateUserProfile();
  updateCharactersList();
  updateCharacterStats();
  updateAchievements();
  updateActivityFeed();
  
  // Login form handler
  document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simple validation (in real app, this would validate against server)
    if (email && password) {
      loginUser(email, password);
    } else {
      showMessage('Please enter both email and password', 'error');
    }
  });
  
  // Register form handler
  document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    if (username && email && password) {
      registerUser(username, email, password);
    } else {
      showMessage('Please fill in all fields', 'error');
    }
  });
  
  // Add character form handler
  document.getElementById('add-character-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser) {
      showMessage('Please login to add characters', 'error');
      return;
    }
    
    const formData = new FormData(e.target);
    const characterData = {
      id: Date.now().toString(),
      userId: currentUser.id,
      name: formData.get('name'),
      server: formData.get('server'),
      faction: formData.get('faction'),
      profession: formData.get('profession'),
      level: parseInt(formData.get('level')) || 0,
      playtime: parseInt(formData.get('playtime')) || 0,
      notes: formData.get('notes'),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    characters.push(characterData);
    localStorage.setItem('swgdb-characters', JSON.stringify(characters));
    
    updateCharactersList();
    updateCharacterStats();
    updateUserProfile();
    
    showMessage('Character added successfully!', 'success');
    closeModal('add-character-modal');
    e.target.reset();
  });
  
  // User authentication functions
  function loginUser(email, password) {
    // Mock login (in real app, this would validate against server)
    const mockUser = {
      id: 'user-' + Date.now(),
      username: email.split('@')[0],
      email: email,
      avatar: '/images/default-avatar.png',
      posts: 0,
      characters: characters.filter(c => c.userId === 'user-' + Date.now()).length,
      achievements: 0,
      createdAt: new Date().toISOString()
    };
    
    currentUser = mockUser;
    localStorage.setItem('swgdb-current-user', JSON.stringify(currentUser));
    
    updateUserProfile();
    showMessage('Login successful!', 'success');
    closeModal('login-modal');
  }
  
  function registerUser(username, email, password) {
    // Mock registration (in real app, this would create account on server)
    const newUser = {
      id: 'user-' + Date.now(),
      username: username,
      email: email,
      avatar: '/images/default-avatar.png',
      posts: 0,
      characters: 0,
      achievements: 0,
      createdAt: new Date().toISOString()
    };
    
    currentUser = newUser;
    localStorage.setItem('swgdb-current-user', JSON.stringify(newUser));
    
    updateUserProfile();
    showMessage('Account created successfully!', 'success');
    closeModal('register-modal');
  }
  
  function logout() {
    currentUser = null;
    localStorage.removeItem('swgdb-current-user');
    updateUserProfile();
    showMessage('Logged out successfully', 'info');
  }
  
  // Update user profile display
  function updateUserProfile() {
    const displayName = document.getElementById('user-display-name');
    const userEmail = document.getElementById('user-email');
    const userPosts = document.getElementById('user-posts');
    const userCharacters = document.getElementById('user-characters');
    const userAchievements = document.getElementById('user-achievements');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (currentUser) {
      displayName.textContent = currentUser.username;
      userEmail.textContent = currentUser.email;
      userPosts.textContent = currentUser.posts;
      userCharacters.textContent = characters.filter(c => c.userId === currentUser.id).length;
      userAchievements.textContent = achievements.filter(a => a.userId === currentUser.id).length;
      
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
    } else {
      displayName.textContent = 'Guest User';
      userEmail.textContent = 'Not logged in';
      userPosts.textContent = '0';
      userCharacters.textContent = '0';
      userAchievements.textContent = '0';
      
      loginBtn.style.display = 'inline-block';
      registerBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
    }
  }
  
  // Update characters list
  function updateCharactersList() {
    const charactersList = document.getElementById('characters-list');
    const userCharacters = currentUser ? characters.filter(c => c.userId === currentUser.id) : [];
    
    charactersList.innerHTML = '';
    
    if (userCharacters.length === 0) {
      charactersList.innerHTML = `
        <div class="empty-state">
          <p>No characters registered yet.</p>
          <p>Add your first character to get started!</p>
        </div>
      `;
      return;
    }
    
    userCharacters.forEach(character => {
      const characterCard = document.createElement('div');
      characterCard.className = 'character-card';
      characterCard.innerHTML = `
        <div class="character-header">
          <h4>${character.name}</h4>
          <span class="character-server">${character.server}</span>
        </div>
        <div class="character-details">
          ${character.faction ? `<span class="faction-badge ${character.faction}">${character.faction}</span>` : ''}
          ${character.profession ? `<span class="profession-badge">${character.profession}</span>` : ''}
          ${character.level ? `<span class="level-badge">Level ${character.level}</span>` : ''}
        </div>
        ${character.playtime ? `<div class="playtime">⏱️ ${character.playtime}h played</div>` : ''}
        ${character.notes ? `<div class="notes">📝 ${character.notes}</div>` : ''}
        <div class="character-actions">
          <button onclick="editCharacter('${character.id}')" class="btn-small">Edit</button>
          <button onclick="deleteCharacter('${character.id}')" class="btn-small btn-danger">Delete</button>
        </div>
      `;
      charactersList.appendChild(characterCard);
    });
  }
  
  // Update character statistics
  function updateCharacterStats() {
    const userCharacters = currentUser ? characters.filter(c => c.userId === currentUser.id) : [];
    
    const totalCharacters = userCharacters.length;
    const highestLevel = Math.max(...userCharacters.map(c => c.level || 0), 0);
    const totalPlaytime = userCharacters.reduce((sum, c) => sum + (c.playtime || 0), 0);
    const factionCount = new Set(userCharacters.map(c => c.faction).filter(f => f)).size;
    
    document.getElementById('total-characters').textContent = totalCharacters;
    document.getElementById('highest-level').textContent = highestLevel;
    document.getElementById('total-playtime').textContent = totalPlaytime + 'h';
    document.getElementById('faction-count').textContent = factionCount;
  }
  
  // Update achievements
  function updateAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    const userAchievements = currentUser ? achievements.filter(a => a.userId === currentUser.id) : [];
    
    achievementsGrid.innerHTML = '';
    
    if (userAchievements.length === 0) {
      achievementsGrid.innerHTML = `
        <div class="empty-state">
          <p>No achievements yet.</p>
          <p>Complete tasks and contribute to earn achievements!</p>
        </div>
      `;
      return;
    }
    
    userAchievements.forEach(achievement => {
      const achievementCard = document.createElement('div');
      achievementCard.className = 'achievement-card';
      achievementCard.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <h4>${achievement.title}</h4>
        <p>${achievement.description}</p>
        <span class="achievement-date">${new Date(achievement.earnedAt).toLocaleDateString()}</span>
      `;
      achievementsGrid.appendChild(achievementCard);
    });
  }
  
  // Update activity feed
  function updateActivityFeed() {
    const activityFeed = document.getElementById('activity-feed');
    
    // Mock activity data
    const activities = [
      { type: 'character', text: 'Added character "BobaFett"', date: new Date() },
      { type: 'achievement', text: 'Earned "First Character" achievement', date: new Date(Date.now() - 86400000) },
      { type: 'post', text: 'Posted in General Discussion', date: new Date(Date.now() - 172800000) }
    ];
    
    activityFeed.innerHTML = '';
    
    activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.innerHTML = `
        <span class="activity-icon">${getActivityIcon(activity.type)}</span>
        <span class="activity-text">${activity.text}</span>
        <span class="activity-date">${formatDate(activity.date)}</span>
      `;
      activityFeed.appendChild(activityItem);
    });
  }
  
  // Helper functions
  function getActivityIcon(type) {
    const icons = {
      'character': '🎮',
      'achievement': '🏆',
      'post': '📝',
      'login': '🔐'
    };
    return icons[type] || '📋';
  }
  
  function formatDate(date) {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
    `;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
  
  // Global functions for modals and actions
  window.showLoginModal = function() {
    document.getElementById('login-modal').style.display = 'block';
  };
  
  window.showRegisterModal = function() {
    document.getElementById('register-modal').style.display = 'block';
  };
  
  window.showAddCharacterModal = function() {
    if (!currentUser) {
      showMessage('Please login to add characters', 'error');
      return;
    }
    document.getElementById('add-character-modal').style.display = 'block';
  };
  
  window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = 'none';
  };
  
  window.uploadAvatar = function() {
    if (!currentUser) {
      showMessage('Please login to change avatar', 'error');
      return;
    }
    showMessage('Avatar upload feature coming soon!', 'info');
  };
  
  window.editCharacter = function(characterId) {
    showMessage('Character editing feature coming soon!', 'info');
  };
  
  window.deleteCharacter = function(characterId) {
    if (confirm('Are you sure you want to delete this character?')) {
      characters = characters.filter(c => c.id !== characterId);
      localStorage.setItem('swgdb-characters', JSON.stringify(characters));
      updateCharactersList();
      updateCharacterStats();
      showMessage('Character deleted successfully', 'success');
    }
  };
  
  // Close modals when clicking outside
  window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  };
});

// Add CSS for the profile system
const style = document.createElement('style');
style.textContent = `
  .profile-section {
    margin-bottom: 2rem;
  }
  
  .profile-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }
  
  .profile-avatar {
    text-align: center;
  }
  
  .profile-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #007bff;
  }
  
  .avatar-upload-btn {
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  
  .profile-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .profile-info p {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
  
  .profile-stats {
    display: flex;
    gap: 1rem;
  }
  
  .stat {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .profile-actions {
    display: flex;
    gap: 1rem;
  }
  
  .btn-primary {
    background: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-secondary {
    background: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-danger {
    background: #dc3545;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .registry-section {
    margin-bottom: 2rem;
  }
  
  .registry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .characters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .character-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .character-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .character-header h4 {
    margin: 0;
    color: #333;
  }
  
  .character-server {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .character-details {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }
  
  .faction-badge,
  .profession-badge,
  .level-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .faction-badge.imperial { background: #dc3545; color: white; }
  .faction-badge.rebel { background: #007bff; color: white; }
  .faction-badge.neutral { background: #6c757d; color: white; }
  
  .profession-badge {
    background: #28a745;
    color: white;
  }
  
  .level-badge {
    background: #ffc107;
    color: black;
  }
  
  .playtime,
  .notes {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .character-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .stats-section {
    margin-bottom: 2rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
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
  
  .achievements-section {
    margin-bottom: 2rem;
  }
  
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .achievement-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .achievement-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .achievement-date {
    color: #6c757d;
    font-size: 0.8rem;
  }
  
  .activity-section {
    margin-bottom: 2rem;
  }
  
  .activity-feed {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    font-size: 1.2rem;
  }
  
  .activity-text {
    flex: 1;
  }
  
  .activity-date {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }
  
  .modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    position: relative;
  }
  
  .close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 2rem;
    cursor: pointer;
    color: #6c757d;
  }
  
  .auth-form,
  .character-form {
    margin-top: 1rem;
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
  
  .auth-links {
    margin-top: 1rem;
    text-align: center;
  }
  
  .auth-links a {
    color: #007bff;
    text-decoration: none;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }
`;
document.head.appendChild(style); 