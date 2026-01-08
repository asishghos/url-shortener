import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import URLShortener from './components/URLShortener';
import TrendingUrls from './components/TrendingUrls';
import AnalyticsChart from './components/AnalyticsChart';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlShortened = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>
              <span className="logo-icon">🔗</span>
              URL Shortener
            </h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <URLShortener onUrlShortened={handleUrlShortened} />
            
            <div className="dashboard-grid">
              <TrendingUrls refreshTrigger={refreshTrigger} />
              <AnalyticsChart refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <p>Built with React + Vite | Backend powered by Node.js + Express</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
