import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import './ServerWakeUp.css';

const ServerWakeUp = ({ onReady }) => {
  const [status, setStatus] = useState('waking'); // 'waking', 'ready', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        // Call health endpoint to wake up the server
        await checkHealth();
        setStatus('ready');
        
        // Show "Good to go" message for 1.5 seconds before showing the app
        setTimeout(() => {
          onReady();
        }, 1500);
      } catch (err) {
        console.error('Health check failed:', err);
        setError(err.message || 'Failed to wake up server');
        setStatus('error');
        
        // Still proceed after error, but with a delay
        setTimeout(() => {
          onReady();
        }, 2000);
      }
    };

    wakeUpServer();
  }, [onReady]);

  return (
    <div className="server-wakeup">
      <div className="wakeup-content">
        {status === 'waking' && (
          <>
            <div className="circular-progress">
              <svg className="progress-ring" viewBox="0 0 100 100">
                <circle
                  className="progress-ring-circle"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
              </svg>
            </div>
            <p className="wakeup-message">Waking up server...</p>
          </>
        )}
        
        {status === 'ready' && (
          <>
            <div className="success-icon">✓</div>
            <p className="wakeup-message success">Good to go!</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="error-icon">⚠</div>
            <p className="wakeup-message error">{error}</p>
            <p className="wakeup-submessage">Continuing anyway...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ServerWakeUp;

