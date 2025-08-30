import React from 'react';

function Controls({
  selectedProblemTypes,
  onProblemTypeToggle,
  availableProblemTypes,
  selectedContestTypes,
  onContestTypeToggle,
  availableContestTypes,
  minRating,
  setMinRating,
  maxRating,
  setMaxRating,
  cfHandle,
  setCfHandle,
  handleStatus,
  onHandleSubmit,
  availableTags,
  selectedTags,
  onTagToggle,
  onGenerateProblem
}) {
  return (
    <div className="controls animate__animated animate__fadeIn animate__delay-1s">
      <div className="filter-group glassmorphism">
        {/* Problem Type Selection */}
        <div className="filter-item">
          <label><i className="fas fa-puzzle-piece"></i> Problem Types</label>
          <div className="multi-select-container">
            {availableProblemTypes.map(type => (
              <button
                key={type.value}
                className={`multi-select-btn ${selectedProblemTypes.includes(type.value) ? 'selected' : ''}`}
                onClick={() => onProblemTypeToggle(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contest Type Selection */}
        <div className="filter-item">
          <label><i className="fas fa-trophy"></i> Contest Types</label>
          <div className="multi-select-container">
            {availableContestTypes.map(type => (
              <button
                key={type.value}
                className={`multi-select-btn ${selectedContestTypes.includes(type.value) ? 'selected' : ''}`}
                onClick={() => onContestTypeToggle(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div className="filter-row">
          <div className="filter-item">
            <label><i className="fas fa-star"></i> Min Rating</label>
            <div className="input-with-icon">
              <input
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value) || 800)}
                min="800"
                max="3500"
                step="100"
              />
              <i className="input-icon fas fa-arrow-down"></i>
            </div>
          </div>
          <div className="filter-item">
            <label><i className="fas fa-star"></i> Max Rating</label>
            <div className="input-with-icon">
              <input
                type="number"
                value={maxRating}
                onChange={(e) => setMaxRating(parseInt(e.target.value) || 3500)}
                min="800"
                max="3500"
                step="100"
              />
              <i className="input-icon fas fa-arrow-up"></i>
            </div>
          </div>
        </div>

        {/* Codeforces Handle */}
        <div className="filter-item">
          <label><i className="fas fa-user"></i> Codeforces Handle</label>
          <div className="input-with-button">
            <input
              type="text"
              value={cfHandle}
              onChange={(e) => setCfHandle(e.target.value)}
              placeholder="Enter your CF handle"
            />
            <button className="small-button" onClick={onHandleSubmit}>
              <i className="fas fa-search"></i> Check
            </button>
          </div>
          {handleStatus && (
            <span className={`status-message ${handleStatus.includes('Error') ? 'error' : 'success'}`}>
              {handleStatus}
            </span>
          )}
        </div>

        {/* Tags Selection */}
        <div className="tags-filter-item">
          <label><i className="fas fa-tags"></i> Problem Tags</label>
          <div className="filter-logic-display">
            <div className="filter-logic-dot"></div>
            <span>Select tags to filter problems (OR logic)</span>
          </div>
          <div className="tag-buttons-container">
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="glow-on-hover" onClick={onGenerateProblem}>
        <span className="btn-icon"><i className="fas fa-bolt"></i></span> 
        <span className="btn-text">Generate Problem</span>
        <div className="btn-hover-effect"></div>
      </button>
    </div>
  );
}

export default Controls; 