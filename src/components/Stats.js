import React from 'react';

function Stats({ totalProblems, filteredProblems, lastUpdated, formatDate }) {
  return (
    <div className="stats animate__animated animate__fadeIn animate__delay-2s">
      <div className="stat-item glassmorphism">
        <div className="stat-icon"><i className="fas fa-database"></i></div>
        <div className="stat-content">
          <span className="stat-value">{totalProblems}</span>
          <span className="stat-label">Total Problems</span>
        </div>
      </div>
      <div className="stat-item glassmorphism">
        <div className="stat-icon"><i className="fas fa-filter"></i></div>
        <div className="stat-content">
          <span className="stat-value">{filteredProblems}</span>
          <span className="stat-label">Matching Filters</span>
        </div>
      </div>
      <div className="stat-item glassmorphism">
        <div className="stat-icon"><i className="fas fa-sync-alt"></i></div>
        <div className="stat-content">
          <span className="stat-value">Last Updated: {formatDate(lastUpdated)}</span>
          <span className="stat-label">Last Updated</span>
        </div>
      </div>
    </div>
  );
}

export default Stats; 