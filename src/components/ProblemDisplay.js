import React, { useEffect, useRef } from 'react';

function ProblemDisplay({
  loading,
  currentProblem,
  contestNames,
  getFormattedContestName,
  solvedProblemsByUser,
  onNextProblem,
  onAddToSheet,
  isInSheet
}) {
  const difficultyPointerRef = useRef(null);
  const difficultyBarFillRef = useRef(null);

  // Update difficulty pointer and bar
  useEffect(() => {
    if (!currentProblem || !difficultyPointerRef.current || !difficultyBarFillRef.current) return;

    const updateDifficultyPointer = () => {
      const rating = currentProblem.rating;
      const pointerValueSpan = difficultyPointerRef.current.querySelector('.pointer-value');
      
      if (!rating) {
        difficultyPointerRef.current.style.left = '50%';
        difficultyPointerRef.current.style.borderTopColor = '#4a6bff';
        difficultyBarFillRef.current.style.width = '0%';
        pointerValueSpan.textContent = 'N/A';
        return;
      }

      const minRatingVal = 800, maxRatingVal = 3500;
      const normalizedRating = Math.min(maxRatingVal, Math.max(minRatingVal, rating));
      const percentage = ((normalizedRating - minRatingVal) / (maxRatingVal - minRatingVal)) * 100;

      difficultyPointerRef.current.style.left = `${percentage}%`;
      difficultyBarFillRef.current.style.width = `${percentage}%`;

      let color, categoryText;
      if (rating < 1200) { color = '#00b894'; categoryText = 'Easy'; }
      else if (rating < 1400) { color = '#00cec9'; categoryText = 'Medium'; }
      else if (rating < 1600) { color = '#0984e3'; categoryText = 'Hard'; }
      else if (rating < 1900) { color = '#6c5ce7'; categoryText = 'Very Hard'; }
      else if (rating < 2100) { color = '#fd79a8'; categoryText = 'Challenging'; }
      else if (rating < 2300) { color = '#e17055'; categoryText = 'Difficult'; }
      else if (rating < 2400) { color = '#d63031'; categoryText = 'Expert'; }
      else { color = '#d63031'; categoryText = 'Master'; }

      difficultyPointerRef.current.style.borderTopColor = color;
      pointerValueSpan.textContent = `Rating: ${rating} (${categoryText})`;
    };

    updateDifficultyPointer();
  }, [currentProblem]);

  // Get problem solved status
  const getProblemSolvedStatus = () => {
    if (!currentProblem) return null;
    const key = `${currentProblem.contestId}-${currentProblem.index}`;
    const isSolved = solvedProblemsByUser.has(key);
    
    return (
      <div className={`problem-solved-status ${isSolved ? 'solved' : 'unsolved'}`}>
        {isSolved ? 'Solved' : 'Unsolved'}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="result-container animate__animated animate__fadeIn animate__delay-1s">
        <div className="loading glassmorphism">
          <div className="spinner">
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
          </div>
          <p>Loading problem database...</p>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="result-container animate__animated animate__fadeIn animate__delay-1s">
        <div className="problem-card glassmorphism">
          <p>No problems found with the current filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container animate__animated animate__fadeIn animate__delay-1s">
      <div className="problem-card glassmorphism">
        <div className="problem-header">
          <div className={`problem-type-badge problem-type-${currentProblem.index}`}>
            {currentProblem.index}
          </div>
          <h2>{currentProblem.name}</h2>
          <div className="problem-contest-id">
            {getFormattedContestName(currentProblem.contestId)} / ID: {currentProblem.contestId}{currentProblem.index}
          </div>
          <div className="difficulty-meter">
            <div className="difficulty-labels">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
              <span>Challenging</span>
              <span>Master</span>
            </div>
            <div className="difficulty-bar-container">
              <div className="difficulty-bar-track"></div>
              <div className="difficulty-bar-fill" ref={difficultyBarFillRef}></div>
              <div className="difficulty-pointer" ref={difficultyPointerRef}>
                <div className="pointer-arrow"></div>
                <span className="pointer-value"></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="problem-meta">
          <div className="meta-item">
            <i className="fas fa-star"></i>
            <span>Rating: {currentProblem.rating}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-users"></i>
            <span>Solved: {currentProblem.solvedCount.toLocaleString()}</span>
          </div>
          <div className="meta-item">
            {getProblemSolvedStatus()}
          </div>
        </div>
        
        <div className="problem-tags">
          {currentProblem.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="actions">
          <a
            href={`https://codeforces.com/contest/${currentProblem.contestId}/problem/${currentProblem.index}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn solve-btn"
          >
            <span className="btn-icon"><i className="fas fa-code"></i></span> 
            <span className="btn-text">Solve Problem</span>
            <div className="btn-hover-effect"></div>
          </a>
          <button 
            className={`btn sheet-btn ${isInSheet ? 'in-sheet' : ''}`} 
            onClick={onAddToSheet}
            disabled={isInSheet}
          >
            <span className="btn-icon">
              <i className={`fas ${isInSheet ? 'fa-check' : 'fa-plus'}`}></i>
            </span> 
            <span className="btn-text">
              {isInSheet ? 'In Sheet' : 'Add to Sheet'}
            </span>
            <div className="btn-hover-effect"></div>
          </button>
          <button className="btn next-btn" onClick={onNextProblem}>
            <span className="btn-icon"><i className="fas fa-random"></i></span> 
            <span className="btn-text">Next Problem</span>
            <div className="btn-hover-effect"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemDisplay; 