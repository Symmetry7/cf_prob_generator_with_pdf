import React from 'react';

function Controls({
  selectedProblemTypes,
  onProblemTypeToggle,
  availableProblemTypes,
  selectedContestTypes,
  onContestTypeToggle,
  availableContestTypes,
  selectedEra,
  onEraToggle,
  availableEras,
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

        {/* Era Selection */}
        <div className="filter-item">
          <label><i className="fas fa-calendar-alt"></i> Era</label>
          <div className="multi-select-container">
            {availableEras.map(era => (
              <button
                key={era.value}
                className={`multi-select-btn ${selectedEra === era.value ? 'selected' : ''}`}
                onClick={() => onEraToggle(era.value)}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div className="filter-item">
          <label><i className="fas fa-star"></i> Rating Range</label>
          <div className="rating-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.target.value) || 800)}
              min="800"
              max="3500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxRating}
              onChange={(e) => setMaxRating(parseInt(e.target.value) || 3500)}
              min="800"
              max="3500"
            />
          </div>
        </div>

        {/* Codeforces Handle */}
        <div className="filter-item">
          <label><i className="fas fa-user"></i> CF Handle</label>
          <div className="handle-input">
            <input
              type="text"
              placeholder="Enter your handle"
              value={cfHandle}
              onChange={(e) => setCfHandle(e.target.value)}
            />
            <button onClick={onHandleSubmit} className="handle-submit-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          {handleStatus && <div className="handle-status">{handleStatus}</div>}
        </div>

        {/* Tags Selection */}
        <div className="filter-item">
          <label><i className="fas fa-tags"></i> Tags</label>
          <div className="tags-container">
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
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