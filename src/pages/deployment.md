---
title: Deployment Guide
layout: base.njk
description: Complete guide for deploying SWGDB to production
category: Development
---

# Deployment Guide

Complete instructions for deploying SWGDB to production and making it live.

## 🚀 Deployment Options

### **Option 1: Netlify (Recommended)**

Netlify provides free hosting with automatic deployments from GitHub.

#### **Step 1: Prepare for Deployment**
```bash
# Build the site
npm run build

# Test the build locally
npx serve _site
```

#### **Step 2: Deploy to Netlify**
1. **Push to GitHub**: Ensure all changes are committed and pushed
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `_site`
3. **Configure Domain**:
   - Add custom domain: `swgdb.com`
   - Configure DNS settings
   - Enable HTTPS

#### **Step 3: Environment Variables**
Set these in Netlify dashboard:
```
NODE_ENV=production
SITE_URL=https://swgdb.com
```

### **Option 2: Vercel**

Vercel offers excellent performance and easy deployment.

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Deploy**
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Step 3: Configure**
- Set custom domain in Vercel dashboard
- Configure environment variables
- Enable automatic deployments

### **Option 3: GitHub Pages**

Free hosting directly from GitHub.

#### **Step 1: Configure GitHub Actions**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build site
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

#### **Step 2: Enable GitHub Pages**
1. Go to repository Settings
2. Navigate to Pages section
3. Select "GitHub Actions" as source
4. Configure custom domain if needed

## 🔧 Production Configuration

### **Environment Setup**
Create `.env.production`:
```env
NODE_ENV=production
SITE_URL=https://swgdb.com
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

### **SEO Optimization**
1. **Update `src/_data/metadata.js`**:
```javascript
export default {
  siteName: 'SWGDB',
  siteUrl: 'https://swgdb.com',
  siteDescription: 'A unified SWG knowledge hub.',
  siteImage: '/images/og-image.png',
  googleAnalytics: 'GA_MEASUREMENT_ID',
  googleAdsense: 'ca-pub-XXXXXXXXXX'
};
```

2. **Generate sitemap**:
```bash
npm run build
# Sitemap will be generated at _site/sitemap.xml
```

3. **Submit to search engines**:
- Google Search Console
- Bing Webmaster Tools
- Submit sitemap URL

### **Performance Optimization**

#### **Image Optimization**
```bash
# Install image optimization tools
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant

# Add to package.json scripts
"optimize:images": "imagemin src/images/* --out-dir=src/images/optimized"
```

#### **CSS/JS Minification**
Update `.eleventy.js`:
```javascript
// Add minification plugins
const minifyHTML = require('html-minifier').minify;
const minifyCSS = require('css-minify').minify;
const minifyJS = require('terser').minify;

// Configure minification
eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
  if (outputPath.endsWith('.html')) {
    return minifyHTML(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    });
  }
  return content;
});
```

#### **Caching Headers**
Add to server configuration:
```
# Cache static assets
/assets/* 1y
/images/* 1y
/scripts/* 1y
/styles/* 1y

# Cache HTML pages
/*.html 1h
```

## 📊 Analytics & Monitoring

### **Google Analytics Setup**
1. Create Google Analytics 4 property
2. Add tracking code to `src/_includes/seo.njk`
3. Configure goals and events
4. Set up conversion tracking

### **Performance Monitoring**
1. **Lighthouse CI**:
```bash
npm install --save-dev @lhci/cli
```

2. **Add to package.json**:
```json
{
  "scripts": {
    "lighthouse": "lhci autorun"
  },
  "lighthouserc": {
    "ci": {
      "collect": {
        "url": ["http://localhost:8080"]
      },
      "assert": {
        "preset": "lighthouse:recommended"
      }
    }
  }
}
```

### **Error Monitoring**
1. **Sentry Setup**:
```bash
npm install @sentry/browser
```

2. **Add to main JavaScript**:
```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});
```

## 🔒 Security Configuration

### **Content Security Policy**
Add to `src/_includes/seo.njk`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
">
```

### **HTTPS Configuration**
1. **SSL Certificate**: Enable automatic SSL
2. **HSTS Headers**: Add security headers
3. **CSP Headers**: Implement Content Security Policy

### **Rate Limiting**
Configure rate limiting for:
- API endpoints
- Form submissions
- Search requests

## 📱 Mobile Optimization

### **Progressive Web App**
1. **Create `public/manifest.json`**:
```json
{
  "name": "SWGDB",
  "short_name": "SWGDB",
  "description": "SWG Knowledge Base",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Add service worker**:
```javascript
// public/sw.js
const CACHE_NAME = 'swgdb-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/search.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

## 🚀 Launch Checklist

### **Pre-Launch**
- [ ] All pages load correctly
- [ ] Forms work properly
- [ ] Search functionality works
- [ ] Mobile responsive design
- [ ] SEO meta tags complete
- [ ] Analytics tracking enabled
- [ ] Error pages configured
- [ ] Performance optimized
- [ ] Security headers set
- [ ] SSL certificate active

### **Launch Day**
- [ ] Deploy to production
- [ ] Test all functionality
- [ ] Monitor error logs
- [ ] Check analytics data
- [ ] Verify search indexing
- [ ] Test on multiple devices
- [ ] Monitor performance metrics

### **Post-Launch**
- [ ] Monitor user feedback
- [ ] Track performance metrics
- [ ] Update content regularly
- [ ] Maintain security updates
- [ ] Backup data regularly
- [ ] Monitor server logs

## 🔄 Continuous Deployment

### **Automated Workflow**
1. **GitHub Actions**: Automate testing and deployment
2. **Branch Protection**: Require reviews for main branch
3. **Environment Staging**: Test changes before production
4. **Rollback Plan**: Quick rollback if issues arise

### **Monitoring Setup**
1. **Uptime Monitoring**: Pingdom or UptimeRobot
2. **Error Tracking**: Sentry for JavaScript errors
3. **Performance Monitoring**: New Relic or DataDog
4. **User Analytics**: Google Analytics + Hotjar

---

*Your SWGDB site is now ready for production! Follow this guide to deploy successfully.* 🚀 