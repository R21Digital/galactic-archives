// Forum functionality
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('new-discussion-form');
  const recentDiscussions = document.getElementById('recent-discussions');
  
  if (!form) return;
  
  // Load forum data from localStorage (in real app, this would be from server)
  let discussions = JSON.parse(localStorage.getItem('swgdb-discussions')) || [];
  
  // Initialize the page
  updateRecentDiscussions();
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const discussionData = {
      id: Date.now().toString(),
      category: formData.get('category'),
      title: formData.get('title'),
      content: formData.get('content'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
      author: 'Anonymous', // In real app, this would be the logged-in user
      createdAt: new Date().toISOString(),
      replies: 0,
      views: 0,
      likes: 0
    };
    
    // Add to discussions
    discussions.unshift(discussionData);
    if (discussions.length > 100) {
      discussions.pop(); // Keep only last 100 discussions
    }
    
    // Save to localStorage
    localStorage.setItem('swgdb-discussions', JSON.stringify(discussions));
    
    // Update display
    updateRecentDiscussions();
    
    // Show success message
    showMessage('Discussion started successfully!', 'success');
    
    // Reset form
    form.reset();
  });
  
  // Update recent discussions display
  function updateRecentDiscussions() {
    recentDiscussions.innerHTML = '';
    
    discussions.slice(0, 5).forEach(discussion => {
      const discussionCard = document.createElement('div');
      discussionCard.className = 'discussion-card';
      discussionCard.innerHTML = `
        <div class="discussion-header">
          <span class="discussion-category">${getCategoryEmoji(discussion.category)} ${discussion.category}</span>
          <span class="discussion-date">${formatDate(discussion.createdAt)}</span>
        </div>
        <h4 class="discussion-title">${discussion.title}</h4>
        <p class="discussion-excerpt">${discussion.content.substring(0, 100)}${discussion.content.length > 100 ? '...' : ''}</p>
        <div class="discussion-meta">
          <span class="discussion-author">by ${discussion.author}</span>
          <span class="discussion-stats">
            💬 ${discussion.replies} replies • 👁️ ${discussion.views} views
          </span>
        </div>
        ${discussion.tags.length > 0 ? `
          <div class="discussion-tags">
            ${discussion.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      `;
      recentDiscussions.appendChild(discussionCard);
    });
  }
  
  // Helper functions
  function getCategoryEmoji(category) {
    const emojis = {
      'general': '🎮',
      'combat': '⚔️',
      'crafting': '🏗️',
      'exploration': '🗺️',
      'support': '🤖',
      'roleplay': '🎨'
    };
    return emojis[category] || '💬';
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
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
});

// Add CSS for the forum
const style = document.createElement('style');
style.textContent = `
  .forum-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .category-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .category-card h3 {
    margin: 0 0 0.5rem 0;
    color: #007bff;
  }
  
  .category-card p {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
  
  .category-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .category-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .category-link:hover {
    background: #0056b3;
    color: white;
  }
  
  .discord-integration {
    margin: 2rem 0;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .discord-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .discord-info h4 {
    margin: 0 0 1rem 0;
    color: #7289da;
  }
  
  .discord-info p {
    margin: 0.5rem 0;
    color: #6c757d;
  }
  
  .discord-btn {
    display: inline-block;
    padding: 1rem 2rem;
    background: #7289da;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .discord-btn:hover {
    background: #5b6eae;
    color: white;
  }
  
  .recent-discussions {
    margin: 2rem 0;
  }
  
  .discussion-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-bottom: 1rem;
  }
  
  .discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .discussion-category {
    font-weight: bold;
    color: #007bff;
  }
  
  .discussion-date {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .discussion-title {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .discussion-excerpt {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
  
  .discussion-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .discussion-author {
    font-weight: bold;
    color: #007bff;
  }
  
  .discussion-stats {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .discussion-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag {
    padding: 0.25rem 0.5rem;
    background: #e9ecef;
    color: #495057;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  
  .discussion-form {
    max-width: 800px;
    margin: 2rem auto;
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
    background: #28a745;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    width: 100%;
  }
  
  .submit-btn:hover {
    background: #218838;
  }
  
  .forum-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .stat-item {
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
  
  .stat-label {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .popular-topics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  
  .topic-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .topic-card h4 {
    margin: 0 0 0.5rem 0;
    color: #007bff;
  }
  
  .topic-card p {
    margin: 0 0 1rem 0;
    color: #6c757d;
  }
  
  .topic-stats {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(style); 