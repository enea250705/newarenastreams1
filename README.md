# Arena Streams - Sports Streaming Platform

A pure HTML/CSS/JavaScript sports streaming platform with live match viewing, multiple sports categories, and integrated popunder ad system.

## 🚀 Quick Start

### Running Locally

1. Navigate to the `public` directory:
   ```bash
   cd public
   ```

2. Start a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```

3. Open your browser:
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
public/
├── index.html              # Homepage
├── matches.html            # All matches page
├── watch.html              # Stream player page
├── football.html           # Football category
├── basketball.html         # Basketball category
├── american-football.html  # American Football category
├── hockey.html             # Hockey category
├── baseball.html           # Baseball category
├── tennis.html             # Tennis category
├── fight.html              # MMA/Fighting category
├── cricket.html            # Cricket category
├── rugby.html              # Rugby category
├── motor-sports.html       # Motor Sports category
├── js/
│   ├── api.js              # API integration
│   ├── home.js             # Homepage functionality
│   └── ad-script.js        # Popunder ad system
├── manifest.json           # PWA manifest
├── robots.txt              # SEO robots file
└── sitemap.xml             # SEO sitemap
```

## ✨ Features

- 🏆 **Multiple Sports Categories**: Football, Basketball, Tennis, UFC, Hockey, Baseball, Cricket, Rugby, American Football, Motor Sports
- 📺 **Live Streaming**: Watch matches with 10 streaming server options
- 🎯 **Real-time Match Data**: Fetches live matches from Streamed.pk API
- 💰 **Popunder Ad System**: Integrated intellipopup ad network
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔍 **SEO Optimized**: Meta tags, sitemap, robots.txt, structured data
- ⚡ **Fast Loading**: Pure HTML/CSS/JS - no build process required

## 🎮 API Integration

The platform integrates with the Streamed.pk API:
- **Base URL**: `https://streamed.pk/api/`
- **Endpoints**:
  - `/api/matches/live` - Live matches
  - `/api/matches/all-today` - Today's matches
  - `/api/stream/{source}/{id}` - Stream data
  - `/api/sports` - Available sports
  - `/api/images/badge/{id}.webp` - Team badges

## 💻 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Tailwind CSS utility classes (inline styles)
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **API Integration** - Fetch API for data

## 📝 Documentation

- `HTML_VERSION_GUIDE.md` - HTML version setup guide
- `QUICK_START_HTML.md` - Quick start instructions
- `SEO_OPTIMIZATIONS.md` - SEO implementation details
- `AD_SYSTEM_EXPLANATION.md` - Ad integration guide

## 🌐 Deployment

Simply upload the `public` folder contents to any web server. No build process needed!

## 📄 License

This project is for educational purposes.
