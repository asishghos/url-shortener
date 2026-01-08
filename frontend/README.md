# URL Shortener - Frontend

A modern React + Vite frontend for the URL Shortener application with dark/light mode support.

## Features

- 🌓 **Dark/Light Mode** - Toggle between themes with persistent storage
- 🔗 **URL Shortening** - Shorten URLs with optional custom aliases and expiration dates
- 📊 **Trending URLs** - View the most clicked shortened URLs
- 📈 **Analytics** - Visualize daily click statistics with interactive charts
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── URLShortener.jsx
│   │   ├── TrendingUrls.jsx
│   │   ├── AnalyticsChart.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
└── package.json
```

## Features Details

### URL Shortening
- Enter any valid URL to shorten
- Optional custom alias (3-20 characters, alphanumeric, hyphens, underscores)
- Optional expiration date
- Copy shortened URL with one click

### Trending URLs
- Displays top 10 most clicked URLs
- Shows click count, original URL, and creation date
- Refresh button to update data
- Copy functionality for each URL

### Analytics
- Daily clicks visualization
- Switch between bar and line charts
- Responsive design
- Auto-refresh on new URL creation

### Theme System
- Light and dark themes
- Persistent theme preference (localStorage)
- Smooth transitions
- Accessible color contrasts

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Lucide React** - Icon library

## API Integration

The frontend communicates with the backend API:

- `POST /api/shorten` - Shorten a URL
- `GET /api/analytics/top-links` - Get trending URLs
- `GET /api/analytics/daily-clicks` - Get daily click statistics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
