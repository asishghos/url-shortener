# Quick Setup Guide

## Prerequisites Installation

### MongoDB
Download and install from: https://www.mongodb.com/try/download/community
Or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Redis (Optional but Recommended)
Download and install from: https://redis.io/download
Or use Docker:
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example and update with your values
cp .env.example .env

# Edit .env file with your MongoDB and Redis URLs
# For local development, defaults should work:
# MONGO_URL=mongodb://localhost:27017/url-shortener
# REDIS_HOST=127.0.0.1
# REDIS_PORT=6379
# PORT=5000
# BASE_URL=http://localhost:5000

# Start the backend server
npm run dev
```

Backend should now be running on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### 3. Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the URL Shortener interface

## Testing the Application

1. **Shorten a URL:**
   - Enter a URL (e.g., `https://www.google.com`)
   - Optionally add a custom alias
   - Optionally set an expiration date
   - Click "Shorten URL"
   - Copy the shortened URL

2. **View Trending URLs:**
   - Scroll down to see the Trending URLs section
   - Click refresh to update the list
   - Click on any URL to open it
   - Use the copy button to copy URLs

3. **View Analytics:**
   - Check the Daily Clicks Analytics section
   - Toggle between Bar and Line charts
   - View click statistics over time

4. **Toggle Theme:**
   - Click the moon/sun icon in the header
   - Theme preference is saved automatically

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGO_URL in .env file
- Try: `mongosh` to test MongoDB connection

**Redis Connection Error:**
- Redis is required for analytics and caching
- Ensure Redis is running
- Check REDIS_HOST and REDIS_PORT in .env
- The app will work but analytics won't be tracked without Redis

**Port Already in Use:**
- Change PORT in .env file
- Update VITE_API_URL in frontend .env accordingly

### Frontend Issues

**API Connection Error:**
- Ensure backend is running
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors
- Verify backend CORS settings allow frontend origin

**Build Errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be v18+)

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Redis Analytics

Analytics are automatically enabled when Redis is running. The system uses:
- **Redis INCR** for total click tracking
- **Redis Hashes** for daily click tracking
- **Redis Sorted Sets** for trending URLs (O(log N) performance)

No additional setup required - just ensure Redis is running!

## Environment Variables Reference

### Backend (.env)
- `MONGO_URL` - MongoDB connection string
- `REDIS_HOST` - Redis host (default: 127.0.0.1)
- `REDIS_PORT` - Redis port (default: 6379)
- `PORT` - Backend server port (default: 5000)
- `BASE_URL` - Base URL for shortened links
- `REDIS_USER` - Redis username (optional)
- `REDIS_PASSWORD` - Redis password (optional)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

