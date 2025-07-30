---
title: Submit Content
layout: base.njk
description: Submit new content to SWGDB - guides, tips, and discoveries
category: Community
---

# Submit Content

Help grow SWGDB by sharing your knowledge! Submit guides, tips, discoveries, or any SWG-related content.

## 📝 Submission Form

<form id="content-form" class="submission-form">
  <div class="form-group">
    <label for="title">Title *</label>
    <input type="text" id="title" name="title" required 
           placeholder="e.g., Complete Bounty Hunter Guide">
  </div>

  <div class="form-group">
    <label for="category">Category *</label>
    <select id="category" name="category" required>
      <option value="">Select a category...</option>
      <option value="Quests">Quests</option>
      <option value="Professions">Professions</option>
      <option value="Crafting">Crafting</option>
      <option value="Combat">Combat</option>
      <option value="Space">Space</option>
      <option value="Planets">Planets</option>
      <option value="Factions">Factions</option>
      <option value="Systems">Systems</option>
      <option value="Economy">Economy</option>
      <option value="Support">Support</option>
      <option value="Exploration">Exploration</option>
    </select>
  </div>

  <div class="form-group">
    <label for="tags">Tags (comma-separated)</label>
    <input type="text" id="tags" name="tags" 
           placeholder="e.g., Combat, PvP, Beginner">
  </div>

  <div class="form-group">
    <label for="description">Brief Description *</label>
    <textarea id="description" name="description" required rows="3"
              placeholder="A short description of your content..."></textarea>
  </div>

  <div class="form-group">
    <label for="content">Content (Markdown) *</label>
    <textarea id="content" name="content" required rows="15"
              placeholder="Write your content in Markdown format..."></textarea>
    <small class="help-text">
      Supports Markdown formatting. Use # for headers, **bold**, *italic*, [links](url), etc.
    </small>
  </div>

  <div class="form-group">
    <label for="author">Your Name/Handle</label>
    <input type="text" id="author" name="author" 
           placeholder="How you'd like to be credited">
  </div>

  <div class="form-group">
    <label for="contact">Contact Info (optional)</label>
    <input type="email" id="contact" name="contact" 
           placeholder="email@example.com (for follow-up questions)">
  </div>

  <div class="form-group">
    <label>
      <input type="checkbox" id="agree" name="agree" required>
      I agree to the <a href="/community-standards/">Community Standards</a>
    </label>
  </div>

  <button type="submit" class="submit-btn">Submit Content</button>
</form>

## 📋 Submission Guidelines

### What We Accept
- **Guides & Tutorials**: Step-by-step instructions for gameplay
- **Tips & Tricks**: Useful advice and shortcuts
- **Location Guides**: Planet and zone information
- **Mechanics Explanations**: How game systems work
- **Community Content**: Player stories and experiences
- **Bug Reports**: Issues you've discovered (with details)

### Quality Standards
- **Accuracy**: Verify information before submitting
- **Clarity**: Write clearly and organize your content
- **Completeness**: Include all necessary details
- **Originality**: Use your own words and experiences
- **Relevance**: Keep content focused on SWG

### Formatting Tips
- Use headers (# ## ###) to organize sections
- Include screenshots when helpful
- Add links to related content
- Use bullet points for lists
- Keep paragraphs short and readable

## ⏱️ Review Process

1. **Submission**: Your content is saved to our incoming folder
2. **Classification**: Our system automatically categorizes your content
3. **Review**: Our team reviews for quality and accuracy
4. **Publication**: Approved content is published to the site
5. **Notification**: You'll be notified of the status

**Typical review time**: 1-3 business days

## 🔧 Technical Details

### File Format
Your submission will be saved as a Markdown file with YAML frontmatter:

```yaml
---
title: Your Title
category: Selected Category
tags: [tag1, tag2]
description: Your description
author: Your Name
submitted_at: 2025-01-27
---
Your content here...
```

### Privacy
- Your contact information is kept private
- We may reach out for clarification or follow-up
- You can request content removal at any time

## ❓ Need Help?

- **Formatting Questions**: Check our [Markdown Guide](https://www.markdownguide.org/)
- **Technical Issues**: Contact us via Discord
- **Content Ideas**: Browse existing content for inspiration
- **Community Standards**: Review our [guidelines](/community-standards/)

---

*Thank you for contributing to the SWG community! Your knowledge helps players everywhere.* 🚀

<script src="/scripts/submitContent.js"></script> 