# URL Shortener – Full Stack Application

A complete URL shortening service with a modern React frontend and Node.js backend, featuring analytics, rate limiting, caching, and real-time statistics.

## 🚀 Features

### Frontend (React + Vite)
- 🌓 **Dark/Light Mode** - Toggle between themes with persistent storage
- 🔗 **URL Shortening** - Shorten URLs with optional custom aliases and expiration dates
- 📊 **Trending URLs** - View the most clicked shortened URLs
- 📈 **Analytics Dashboard** - Visualize daily click statistics with interactive charts
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

### Backend (Node.js + Express)
- ⚡ **Fast Redirects** - Redis caching for instant URL lookups
- 🛡️ **Rate Limiting** - Protect API endpoints from abuse
- 📊 **Analytics** - Track clicks with Redis (ultra-fast in-memory analytics)
- 🔒 **URL Validation** - Comprehensive input validation
- ⏰ **Expiration Support** - Set expiration dates for shortened URLs
- 🎯 **Custom Aliases** - Create memorable short URLs

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher) - Required for analytics and caching

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGO_URL=mongodb://localhost:27017/url-shortener
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=5000
BASE_URL=http://localhost:5000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
URL Shortener/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and service configurations
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── services/        # Analytics service (Redis-based)
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Theme)
│   │   ├── services/        # API service layer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### URL Shortening
- `POST /api/shorten` - Create a shortened URL
  ```json
  {
    "longUrl": "https://example.com",
    "customAlias": "optional-alias",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
  ```

### Analytics
- `GET /api/analytics/top-links` - Get top 10 most clicked URLs (powered by Redis Sorted Sets)
- `GET /api/analytics/daily-clicks?shortId=<id>&days=<n>` - Get daily click statistics (powered by Redis Hashes)

### Redirect
- `GET /:shortId` - Redirect to original URL

## 🎨 Frontend Features

### URL Shortener Component
- Input validation for URLs
- Custom alias support (3-20 characters)
- Optional expiration date
- One-click copy functionality

### Trending URLs
- Real-time top 10 URLs
- Click count display
- Copy and open functionality
- Auto-refresh on new URL creation

### Analytics Chart
- Daily clicks visualization
- Bar and line chart modes
- Responsive design
- Interactive tooltips

## 🔧 Backend Improvements Made

1. **Enhanced URL Validation** - Proper URL format checking
2. **Better Error Handling** - Comprehensive error messages
3. **Custom Alias Validation** - Format and length validation
4. **Expiration Date Validation** - Ensures future dates only
5. **Redis Connection Fix** - Proper connection state checking
6. **IP Address Handling** - Fallback for IP extraction
7. **Analytics Enhancement** - Returns full URL information
8. **Route Protection** - Excludes API paths from shortId matching

## 🚦 Usage

1. Start MongoDB and Redis (if using)
2. Start the backend server: `cd backend && npm run dev`
3. Start the frontend: `cd frontend && npm run dev`
4. Open `http://localhost:5173` in your browser
5. Shorten URLs and view analytics!

## 📊 Architecture

Below are UML diagrams describing the backend system architecture and flows.

## Component diagram
```mermaid
graph TD
subgraph "Clients"
  U["User (Browser)"]
  A["Admin Panel (Flutter)"]
end
subgraph "Backend"
  API["Express App"]
  Rts["Routes: /api, /api/analytics"]
  Ctrls["Controllers: UrlController, AnalyticsController"]
  Utils["Utils: RateLimiter, Shortener"]
  Analytics["Analytics Service (Redis)"]
end
subgraph "Data Stores"
  R["Redis"]
  M["MongoDB"]
end
U -->|"POST /api/shorten\nGET /:shortId"| API
A -->|"GET /api/analytics/*"| API
API --> Rts
Rts --> Ctrls
Ctrls -->|"CRUD"| M
API -->|"GET/SET rate, url:*"| R
API -->|"trackClick()"| Analytics
Analytics -->|"INCR, HINCRBY, ZINCRBY"| R
Ctrls -->|"getTrendingUrls()"| Analytics
```

## Class diagram
```mermaid
classDiagram
class Url {
  +shortId: String
  +longUrl: String
  +createdAt: Date
  +clicks: Number
  +expiresAt: Date
}
class Analytics {
  +shortId: String
  +ip: String
  +userAgent: String
  +referrer: String
  +timestamp: Date
}
class UrlController {
  +shortenUrl(req, res)
}
class AnalyticsController {
  +getTopLinks(req, res)
  +getDailyClicks(req, res)
}
class RateLimiter {
  +invoke(limit, windowSeconds) middleware
}
class Shortener {
  +generateShortId(): String
}
class RedisClient
class AnalyticsService {
  +trackClick(shortId, ip, meta)
  +getTotalClicks(shortId)
  +getDailyClicks(shortId, days)
  +getTrendingUrls(limit)
}
class ExpressApp {
  +startServer()
  +GET(":shortId")
}
ExpressApp --> UrlController
ExpressApp --> AnalyticsController
ExpressApp --> RedisClient
ExpressApp --> AnalyticsService
UrlController --> Shortener
UrlController --> Url
AnalyticsController --> AnalyticsService
AnalyticsController --> Url
RateLimiter --> RedisClient
AnalyticsService --> RedisClient
```

## Sequence diagram – Shorten URL
```mermaid
sequenceDiagram
autonumber
actor U as User
participant API as Express App
participant RL as RateLimiter (Redis)
participant CTRL as UrlController
participant DB as MongoDB (Url)
U->>API: POST /api/shorten {longUrl, customAlias, expiresAt}
API->>RL: check ip rate
alt over limit
  RL-->>API: 429 Too Many Requests
  API-->>U: 429 error
else allowed
  RL-->>API: ok
  API->>CTRL: shortenUrl()
  alt customAlias provided
    CTRL->>DB: findOne({shortId: customAlias})
    DB-->>CTRL: exists?
  end
  CTRL->>DB: save({shortId,longUrl,expiresAt})
  CTRL-->>API: {shortUrl,expiresAt}
  API-->>U: 201 Created
end
```

## Sequence diagram – Redirect and analytics
```mermaid
sequenceDiagram
autonumber
actor U as User
participant API as Express App
participant Cache as Redis
participant DB as MongoDB (Url)
participant Analytics as Analytics Service
U->>API: GET /:shortId
API->>Cache: GET url:shortId
alt cache hit
  Cache-->>API: longUrl
  API->>Analytics: trackClick(shortId, ip)
  Analytics->>Cache: INCR url:clicks:shortId
  Analytics->>Cache: HINCRBY url:daily:shortId date
  Analytics->>Cache: ZINCRBY trending:urls 1 shortId
  API-->>U: 302 Redirect longUrl
else cache miss
  Cache-->>API: null
  API->>DB: findOne({shortId})
  alt expired
    API->>Cache: DEL url:shortId
    API-->>U: 410 Gone
  else found
    DB-->>API: entry
    API->>Cache: SET url:shortId longUrl EX=3600
    API->>Analytics: trackClick(shortId, ip)
    Analytics->>Cache: INCR url:clicks:shortId
    Analytics->>Cache: HINCRBY url:daily:shortId date
    Analytics->>Cache: ZINCRBY trending:urls 1 shortId
    API-->>U: 302 Redirect longUrl
  else not found
    DB-->>API: null
    API-->>U: 404 Not Found
  end
end
```

## Deployment diagram
```mermaid
graph LR
subgraph "Client"
  Browser["User Browser"]
  Admin["Admin Panel (Flutter app)"]
end
subgraph "App Server"
  Express["Node.js Express API"]
end
subgraph "Data Layer"
  Mongo["MongoDB"]
  Redis["Redis (Cache + Analytics)"]
end
Browser --> Express
Admin --> Express
Express --> Mongo
Express --> Redis
```
