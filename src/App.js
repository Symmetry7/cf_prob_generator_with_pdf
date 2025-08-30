import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Controls from './components/Controls';
import ProblemDisplay from './components/ProblemDisplay';
import Stats from './components/Stats';
import Footer from './components/Footer';
import Sheet from './components/Sheet';

function App() {
  // State variables
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contestNames, setContestNames] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [solvedProblemsByUser, setSolvedProblemsByUser] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'sheet'
  const [sheetProblems, setSheetProblems] = useState([]);

  // Filter states - Updated for multiple selection
  const [selectedProblemTypes, setSelectedProblemTypes] = useState(['random']);
  const [selectedContestTypes, setSelectedContestTypes] = useState(['any']);
  const [minRating, setMinRating] = useState(800);
  const [maxRating, setMaxRating] = useState(3500);
  const [cfHandle, setCfHandle] = useState('');
  const [handleStatus, setHandleStatus] = useState('');

  // Available tags
  const availableTags = [
    "2-sat", "binary search", "bitmasks", "brute force", "chinese remainder theorem",
    "combinatorics", "constructive algorithms", "data structures", "dfs and similar",
    "divide and conquer", "dp", "dsu", "expression parsing", "fft", "flows",
    "games", "geometry", "graph matchings", "graphs", "greedy", "hashing",
    "implementation", "interactive", "math", "matrices", "meet-in-the-middle",
    "number theory", "probabilities", "schedules", "shortest paths", "sortings",
    "string suffix structures", "strings", "ternary search", "trees", "two pointers"
  ];

  // Available problem types and contest types for selection
  const availableProblemTypes = [
    { value: 'random', label: 'Random' },
    { value: 'A', label: 'Problem A' },
    { value: 'B', label: 'Problem B' },
    { value: 'C', label: 'Problem C' },
    { value: 'D', label: 'Problem D' },
    { value: 'E', label: 'Problem E' },
    { value: 'F', label: 'Problem F' },
    { value: 'G', label: 'Problem G' }
  ];

  const availableContestTypes = [
    { value: 'any', label: 'Any Contest' },
    { value: 'div2', label: 'Div 2' },
    { value: 'div3', label: 'Div 3' },
    { value: 'div4', label: 'Div 4' },
    { value: 'educational', label: 'Educational' },
    { value: 'global', label: 'Global Round' },
    { value: 'div1+div2', label: 'Div 1 + Div 2' }
  ];

  // Load sheet problems from localStorage on component mount
  useEffect(() => {
    const savedSheet = localStorage.getItem('codeforcesSheet');
    if (savedSheet) {
      try {
        const parsedSheet = JSON.parse(savedSheet);
        setSheetProblems(parsedSheet);
        console.log('Loaded sheet from localStorage:', parsedSheet.length, 'problems');
      } catch (error) {
        console.error('Error loading sheet from localStorage:', error);
        localStorage.removeItem('codeforcesSheet'); // Clear corrupted data
      }
    }
  }, []);

  // Utility functions
  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const getFormattedContestName = useCallback((contestId) => {
    const name = contestNames[contestId] || `Contest ${contestId}`;
    if (name.includes('Educational Codeforces Round')) return name.replace('Educational Codeforces Round', 'Edu. Round');
    if (name.includes('Codeforces Round #') && name.includes('(Div. 2)')) return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 2)', '');
    if (name.includes('Codeforces Round #') && name.includes('(Div. 1 + Div. 2)')) return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 1 + Div. 2)', '');
    if (name.includes('Codeforces Global Round')) return name.replace('Codeforces Global Round', 'Global Round');
    if (name.length > 30) return name.replace('Codeforces Round #', 'CF #');
    return name;
  }, [contestNames]);

  // Fetch data from Codeforces API
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const problemsResponse = await fetch('https://codeforces.com/api/problemset.problems?lang=en');
      const problemsData = await problemsResponse.json();
      if (problemsData.status !== 'OK') throw new Error(problemsData.comment);

      const filteredProblems = problemsData.result.problems.filter(p =>
        p.type === "PROGRAMMING" &&
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(p.index) &&
        p.rating !== undefined &&
        p.rating <= 2400
      );

      const stats = problemsData.result.problemStatistics || [];
      const solvedCountsMap = new Map();
      stats.forEach(stat => solvedCountsMap.set(`${stat.contestId}-${stat.index}`, stat.solvedCount));
      
      const problemsWithStats = filteredProblems.map(p => ({
        ...p,
        solvedCount: solvedCountsMap.get(`${p.contestId}-${p.index}`) || 0
      }));

      setProblems(problemsWithStats);

      // Fetch contest names
      const contestListResponse = await fetch('https://codeforces.com/api/contest.list?lang=en');
      const contestListData = await contestListResponse.json();
      if (contestListData.status === 'OK') {
        const contestNamesMap = {};
        contestListData.result.forEach(c => contestNamesMap[c.id] = c.name);
        setContestNames(contestNamesMap);
      }

      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, []);

  // Filter problems based on current filters - Updated for multiple selection
  const filterProblems = useCallback(() => {
    const filtered = problems.filter(p => {
      // Problem type matching - check if any selected type matches
      const typeMatch = selectedProblemTypes.includes('random') || selectedProblemTypes.includes(p.index);
      
      const ratingMatch = p.rating >= minRating && p.rating <= maxRating;
      
      // Contest type matching - check if any selected contest type matches
      let contestMatch = true;
      if (!selectedContestTypes.includes('any')) {
        const name = contestNames[p.contestId] || '';
        contestMatch = selectedContestTypes.some(contestType => {
          if (contestType === 'div2') return name.toLowerCase().includes('(div. 2)');
          if (contestType === 'div3') return name.toLowerCase().includes('(div. 3)');
          if (contestType === 'div4') return name.toLowerCase().includes('(div. 4)');
          if (contestType === 'educational') return name.toLowerCase().includes('educational');
          if (contestType === 'global') return name.toLowerCase().includes('global round');
          if (contestType === 'div1+div2') return name.toLowerCase().includes('(div. 1 + div. 2)');
          return false;
        });
      }
      
      let tagMatch = true;
      if (selectedTags.length > 0) {
        tagMatch = selectedTags.some(tag => 
          p.tags.some(pt => pt.toLowerCase() === tag.toLowerCase())
        );
      }
      
      return typeMatch && ratingMatch && contestMatch && tagMatch;
    });
    
    setFilteredProblems(filtered);
    return filtered;
  }, [problems, selectedProblemTypes, selectedContestTypes, minRating, maxRating, selectedTags, contestNames]);

  // Generate a random problem - FIXED: No more infinite loop!
  const generateProblem = useCallback(() => {
    if (filteredProblems.length === 0) {
      setCurrentProblem(null);
      return;
    }
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setCurrentProblem(randomProblem);
  }, [filteredProblems]);

  // Add current problem to sheet
  const addToSheet = useCallback(() => {
    if (!currentProblem) return;
    
    const problemKey = `${currentProblem.contestId}-${currentProblem.index}`;
    
    setSheetProblems(prev => {
      const isAlreadyInSheet = prev.some(p => 
        `${p.contestId}-${p.index}` === problemKey
      );
      
      if (!isAlreadyInSheet) {
        const problemWithTimestamp = {
          ...currentProblem,
          addedAt: new Date().toISOString()
        };
        const newSheet = [...prev, problemWithTimestamp];
        // Save to localStorage immediately
        localStorage.setItem('codeforcesSheet', JSON.stringify(newSheet));
        console.log('Added problem to sheet and saved to localStorage:', problemKey);
        return newSheet;
      }
      return prev;
    });
  }, [currentProblem]);

  // Remove problem from sheet
  const removeFromSheet = useCallback((problemToRemove) => {
    setSheetProblems(prev => {
      const newSheet = prev.filter(p => 
        `${p.contestId}-${p.index}` !== `${problemToRemove.contestId}-${problemToRemove.index}`
      );
      // Save to localStorage immediately
      localStorage.setItem('codeforcesSheet', JSON.stringify(newSheet));
      console.log('Removed problem from sheet and saved to localStorage:', `${problemToRemove.contestId}-${problemToRemove.index}`);
      return newSheet;
    });
  }, []);

  // Fetch user submissions to check solved problems
  const fetchUserSubmissions = useCallback(async (handle) => {
    setHandleStatus('Checking handle...');
    try {
      const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`);
      const data = await response.json();
      if (data.status === 'OK') {
        const solvedProblems = new Set();
        data.result.forEach(sub => {
          if (sub.verdict === 'OK') {
            solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        });
        setSolvedProblemsByUser(solvedProblems);
        setHandleStatus(`Handle "${handle}" loaded. (${solvedProblems.size} solved)`);
      } else {
        throw new Error(data.comment);
      }
    } catch (err) {
      setHandleStatus(`Error: ${err.message}`);
    }
  }, []);

  // Handle tag selection
  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Handle problem type selection
  const handleProblemTypeToggle = useCallback((problemType) => {
    setSelectedProblemTypes(prev => {
      if (problemType === 'random') {
        return ['random'];
      }
      if (prev.includes(problemType)) {
        const newSelection = prev.filter(t => t !== problemType);
        return newSelection.length === 0 ? ['random'] : newSelection;
      } else {
        const newSelection = prev.filter(t => t !== 'random');
        return [...newSelection, problemType];
      }
    });
  }, []);

  // Handle contest type selection
  const handleContestTypeToggle = useCallback((contestType) => {
    setSelectedContestTypes(prev => {
      if (contestType === 'any') {
        return ['any'];
      }
      if (prev.includes(contestType)) {
        const newSelection = prev.filter(t => t !== contestType);
        return newSelection.length === 0 ? ['any'] : newSelection;
      } else {
        const newSelection = prev.filter(t => t !== 'any');
        return [...newSelection, contestType];
      }
    });
  }, []);

  // Handle handle submission
  const handleHandleSubmit = useCallback(() => {
    if (cfHandle.trim()) {
      fetchUserSubmissions(cfHandle.trim());
    }
  }, [cfHandle, fetchUserSubmissions]);

  // Effects
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Only filter problems when filters change, don't auto-generate
  useEffect(() => {
    if (problems.length > 0) {
      filterProblems();
    }
  }, [filterProblems, problems.length]);

  // Generate initial problem only once when data is loaded
  useEffect(() => {
    if (filteredProblems.length > 0 && !currentProblem) {
      generateProblem();
    }
  }, [filteredProblems.length, currentProblem, generateProblem]);

  // Render main page
  if (currentPage === 'main') {
    return (
      <div className="container">
        <Header />
        
        <div className="page-navigation">
          <button 
            className="nav-btn active" 
            onClick={() => setCurrentPage('main')}
          >
            <i className="fas fa-home"></i> Problem Selector
          </button>
          <button 
            className="nav-btn" 
            onClick={() => setCurrentPage('sheet')}
          >
            <i className="fas fa-list"></i> My Sheet ({sheetProblems.length})
          </button>
        </div>
        
        <Controls
          selectedProblemTypes={selectedProblemTypes}
          onProblemTypeToggle={handleProblemTypeToggle}
          availableProblemTypes={availableProblemTypes}
          selectedContestTypes={selectedContestTypes}
          onContestTypeToggle={handleContestTypeToggle}
          availableContestTypes={availableContestTypes}
          minRating={minRating}
          setMinRating={setMinRating}
          maxRating={maxRating}
          setMaxRating={setMaxRating}
          cfHandle={cfHandle}
          setCfHandle={setCfHandle}
          handleStatus={handleStatus}
          onHandleSubmit={handleHandleSubmit}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onGenerateProblem={generateProblem}
        />
        
        <ProblemDisplay
          loading={loading}
          currentProblem={currentProblem}
          contestNames={contestNames}
          getFormattedContestName={getFormattedContestName}
          solvedProblemsByUser={solvedProblemsByUser}
          onNextProblem={generateProblem}
          onAddToSheet={addToSheet}
          isInSheet={currentProblem ? sheetProblems.some(p => 
            `${p.contestId}-${p.index}` === `${currentProblem.contestId}-${currentProblem.index}`
          ) : false}
        />
        
        <Stats
          totalProblems={problems.length}
          filteredProblems={filteredProblems.length}
          lastUpdated={lastUpdated}
          formatDate={formatDate}
        />
        
        <Footer />
      </div>
    );
  }

  // Render sheet page
  return (
    <div className="container">
      <Header />
      
      <div className="page-navigation">
        <button 
          className="nav-btn" 
          onClick={() => setCurrentPage('main')}
        >
          <i className="fas fa-home"></i> Problem Selector
        </button>
        <button 
          className="nav-btn active" 
          onClick={() => setCurrentPage('sheet')}
        >
          <i className="fas fa-list"></i> My Sheet ({sheetProblems.length})
        </button>
      </div>
      
      <Sheet 
        problems={sheetProblems}
        contestNames={contestNames}
        getFormattedContestName={getFormattedContestName}
        solvedProblemsByUser={solvedProblemsByUser}
        onRemoveProblem={removeFromSheet}
        onBackToMain={() => setCurrentPage('main')}
      />
      
      <Footer />
    </div>
  );
}

export default App; 