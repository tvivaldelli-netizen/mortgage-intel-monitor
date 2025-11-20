import { useState, useEffect } from 'react';
import { getSources } from '../services/api';
import './FilterBar.css';

export default function FilterBar({ onFilterChange, onRefresh, isRefreshing }) {
  const [sources, setSources] = useState([]);
  const [filters, setFilters] = useState({
    source: '',
    keyword: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadSources();
  }, []);

  async function loadSources() {
    try {
      const sourcesData = await getSources();
      setSources(sourcesData);
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  }

  function handleFilterChange(key, value) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  function handleClearFilters() {
    const clearedFilters = {
      source: '',
      keyword: '',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="source-filter">Source</label>
          <select
            id="source-filter"
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="filter-input"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source.name} value={source.name}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="keyword-filter">Keyword</label>
          <input
            id="keyword-filter"
            type="text"
            placeholder="Search articles..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="start-date-filter">Start Date</label>
          <input
            id="start-date-filter"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="end-date-filter">End Date</label>
          <input
            id="end-date-filter"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-actions">
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-primary"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Articles'}
          </button>
        </div>
      </div>
    </div>
  );
}
