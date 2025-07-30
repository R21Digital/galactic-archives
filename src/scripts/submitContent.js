// Content submission form handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('content-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      tags: formData.get('tags'),
      description: formData.get('description'),
      content: formData.get('content'),
      author: formData.get('author'),
      contact: formData.get('contact'),
      submitted_at: new Date().toISOString()
    };
    
    // Validate required fields
    if (!data.title || !data.category || !data.description || !data.content) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }
    
    // Create YAML frontmatter
    const yaml = `---
title: "${data.title}"
category: "${data.category}"
tags: [${data.tags ? data.tags.split(',').map(t => `"${t.trim()}"`).join(', ') : ''}]
description: "${data.description}"
author: "${data.author || 'Anonymous'}"
submitted_at: "${data.submitted_at}"
contact: "${data.contact || ''}"
---

`;
    
    // Combine YAML and content
    const fullContent = yaml + data.content;
    
    // Create filename
    const filename = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.md';
    
    // Save to incoming folder (this would normally be sent to server)
    saveSubmission(filename, fullContent, data);
  });
});

function saveSubmission(filename, content, metadata) {
  // In a real implementation, this would send to server
  // For now, we'll simulate the process
  
  // Create download link for the user
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Show success message
  showMessage(`
    ✅ Content submitted successfully!
    
    Your file "${filename}" has been downloaded.
    In a real implementation, this would be automatically saved to our incoming folder.
    
    Thank you for contributing to SWGDB!
  `, 'success');
  
  // Reset form
  document.getElementById('content-form').reset();
}

function showMessage(message, type = 'info') {
  // Remove existing messages
  const existing = document.querySelector('.form-message');
  if (existing) {
    existing.remove();
  }
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message-${type}`;
  messageEl.innerHTML = message.replace(/\n/g, '<br>');
  
  // Insert after form
  const form = document.getElementById('content-form');
  form.parentNode.insertBefore(messageEl, form.nextSibling);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 10000);
}

// Add some basic form validation
document.addEventListener('DOMContentLoaded', function() {
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      if (this.value.length > 100) {
        this.setCustomValidity('Title must be 100 characters or less');
      } else {
        this.setCustomValidity('');
      }
    });
  }
  
  if (contentInput) {
    contentInput.addEventListener('input', function() {
      if (this.value.length < 50) {
        this.setCustomValidity('Content must be at least 50 characters');
      } else {
        this.setCustomValidity('');
      }
    });
  }
}); 