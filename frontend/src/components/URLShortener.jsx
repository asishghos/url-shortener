import { useState } from 'react';
import { shortenUrl } from '../services/api';
import { Copy, Check, Link as LinkIcon, Calendar, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const URLShortener = ({ onUrlShortened }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!longUrl.trim()) {
        setError('Please enter a valid URL');
        setLoading(false);
        return;
      }

      // Validate URL format
      try {
        new URL(longUrl);
      } catch {
        setError('Please enter a valid URL (e.g., https://example.com)');
        setLoading(false);
        return;
      }

      const result = await shortenUrl(
        longUrl,
        customAlias || null,
        expiresAt || null
      );

      setShortUrl(result.shortUrl);
      setLongUrl('');
      setCustomAlias('');
      setExpiresAt('');
      
      if (onUrlShortened) {
        onUrlShortened();
      }
    } catch (err) {
      setError(err.error || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="url-shortener">
      <div className="section-header">
        <Sparkles className="icon" />
        <h2>Shorten Your URL</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="shorten-form">
        <div className="form-group">
          <label htmlFor="longUrl">
            <LinkIcon size={18} />
            Enter URL to shorten
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customAlias">Custom Alias (Optional)</label>
            <input
              type="text"
              id="customAlias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-link"
              disabled={loading}
              pattern="[a-zA-Z0-9-_]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiresAt">
              <Calendar size={16} />
              Expires At (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="result-box">
          <div className="result-header">
            <span>Short URL Created!</span>
          </div>
          <div className="result-content">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="short-url-input"
            />
            <button
              onClick={handleCopy}
              className="btn-copy"
              aria-label="Copy URL"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLShortener;

