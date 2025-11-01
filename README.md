# Arena Streams - Sports Streaming Platform

A modern, responsive sports streaming platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎯 Modern and attractive UI design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🏈 Multiple sports categories (Football, Basketball, Tennis, and more)
- 🔴 Live match streaming with real-time indicators
- 👥 Live viewer counts
- 💬 Live chat functionality
- ⭐ Favorite matches
- 🔍 Search functionality
- 🎨 Beautiful gradients and animations
- ⚡ Fast and optimized with Vite

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Header.tsx     # Navigation header
│   ├── MatchCard.tsx  # Match display card
│   ├── LiveBadge.tsx  # Live indicator
│   └── SportIcon.tsx  # Sport category icon
├── pages/             # Page components
│   ├── Home.tsx       # Homepage
│   ├── Matches.tsx    # All matches page
│   ├── Sports.tsx     # Sport-specific page
│   └── WatchStream.tsx # Streaming page
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## API Integration

The app is ready for API integration. Mock data is currently used in:
- `src/pages/Home.tsx` - Live and upcoming matches
- `src/pages/Matches.tsx` - All matches with filters
- `src/pages/Sports.tsx` - Sport-specific matches
- `src/pages/WatchStream.tsx` - Match details and stream data

Replace the mock data with your API calls to fetch real match information.

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Components
All components are modular and can be easily customized in the `src/components/` directory.

## License

MIT

