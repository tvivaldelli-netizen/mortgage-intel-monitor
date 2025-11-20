import { useState, useEffect } from 'react';
import { getArticles, refreshArticles } from '../services/api';
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import './Dashboard.css';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [filters]);

  async function loadArticles() {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles(filters);
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setError(null);
      const result = await refreshArticles();
      console.log(`Refreshed ${result.count} articles`);

      // Reload articles after refresh
      await loadArticles();
    } catch (err) {
      setError('Failed to refresh articles. Please try again.');
      console.error('Error refreshing articles:', err);
    } finally {
      setRefreshing(false);
    }
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mortgage Industry News Monitor</h1>
        <p className="subtitle">Stay updated with the latest mortgage industry news</p>
      </header>

      <FilterBar
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <h2>No articles found</h2>
          <p>Try adjusting your filters or click "Refresh Articles" to fetch new content.</p>
        </div>
      ) : (
        <div className="articles-container">
          <div className="articles-header">
            <h2>Articles ({articles.length})</h2>
          </div>

          <div className="articles-list">
            {articles.map((article) => (
              <ArticleCard key={article.link} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
