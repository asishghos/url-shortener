import { useState, useEffect } from 'react';
import { getTopLinks } from '../services/api';
import { TrendingUp, ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const TrendingUrls = ({ refreshTrigger }) => {
  const [topLinks, setTopLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const { theme } = useTheme();

  const fetchTopLinks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTopLinks();
      setTopLinks(data);
    } catch (err) {
      setError(err.error || 'Failed to load trending URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLinks();
  }, [refreshTrigger]);

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (loading && topLinks.length === 0) {
    return (
      <div className="trending-urls">
        <div className="section-header">
          <TrendingUp className="icon" />
          <h2>Trending URLs</h2>
          <button onClick={fetchTopLinks} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>
        <div className="loading-state">Loading trending URLs...</div>
      </div>
    );
  }

  return (
    <div className="trending-urls">
      <div className="section-header">
        <TrendingUp className="icon" />
        <h2>Trending URLs</h2>
        <button onClick={fetchTopLinks} className="refresh-btn" disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {topLinks.length === 0 ? (
        <div className="empty-state">
          <p>No trending URLs yet. Be the first to shorten a URL!</p>
        </div>
      ) : (
        <div className="trending-list">
          {topLinks.map((link, index) => (
            <div key={link.shortId} className="trending-item">
              <div className="trending-rank">
                <span className="rank-number">#{index + 1}</span>
                <div className="clicks-badge">
                  <span>{link.clicks}</span>
                  <small>clicks</small>
                </div>
              </div>
              
              <div className="trending-content">
                <div className="url-info">
                  <div className="short-url">
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-link"
                    >
                      {link.shortUrl}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="long-url" title={link.longUrl}>
                    {truncateUrl(link.longUrl)}
                  </div>
                  {link.createdAt && (
                    <div className="created-at">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="trending-actions">
                  <button
                    onClick={() => handleCopy(link.shortUrl, link.shortId)}
                    className="btn-icon"
                    aria-label="Copy URL"
                  >
                    {copiedId === link.shortId ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingUrls;

