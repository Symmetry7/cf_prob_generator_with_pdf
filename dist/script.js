document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const problemTypeSelect = document.getElementById('problem-type');
    const contestTypeSelect = document.getElementById('contest-type');
    const tagsContainer = document.getElementById('tags-container');
    const minRatingInput = document.getElementById('min-rating');
    const maxRatingInput = document.getElementById('max-rating');
    const generateBtn = document.getElementById('generate-btn');
    const nextBtn = document.getElementById('next-btn');
    const loadingElement = document.getElementById('loading');
    const problemDisplay = document.getElementById('problem-display');
    const problemTitle = document.getElementById('problem-title');
    const problemTypeBadge = document.getElementById('problem-type-badge');
    const problemContestId = document.getElementById('problem-contest-id');
    const problemRating = document.getElementById('problem-rating');
    const problemSolvedCount = document.getElementById('problem-solved-count');
    const problemTagsContainer = document.getElementById('problem-tags');
    const problemLink = document.getElementById('problem-link');
    const totalProblemsElement = document.getElementById('total-problems');
    const filteredProblemsElement = document.getElementById('filtered-problems');
    const difficultyPointer = document.getElementById('difficulty-pointer');
    const difficultyBarFill = document.getElementById('difficulty-bar-fill');
    const lastUpdatedElement = document.getElementById('last-updated');
    const filterLogicType = document.getElementById('filter-logic-type');

    // Codeforces handle feature
    const cfHandleInput = document.getElementById('cf-handle-input');
    const loadHandleBtn = document.getElementById('load-handle-btn');
    const handleStatusMessage = document.getElementById('handle-status-message');
    const problemSolvedStatus = document.getElementById('problem-solved-status');

    // Data variables
    let problems = [];
    let filteredProblems = [];
    let currentProblem = null;
    const contestNames = {};
    let selectedTags = [];
    let solvedProblemsByUser = new Set();

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

    // --- Utility Functions ---
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    let lastUpdated = new Date();
    lastUpdatedElement.textContent = `Last Updated: ${formatDate(lastUpdated)}`;

    function getFormattedContestName(contestId) {
        const name = contestNames[contestId] || `Contest ${contestId}`;
        if (name.includes('Educational Codeforces Round')) return name.replace('Educational Codeforces Round', 'Edu. Round');
        if (name.includes('Codeforces Round #') && name.includes('(Div. 2)')) return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 2)', '');
        if (name.includes('Codeforces Round #') && name.includes('(Div. 1 + Div. 2)')) return name.replace('Codeforces Round #', 'Round #').replace(' (Div. 1 + Div. 2)', '');
        if (name.includes('Codeforces Global Round')) return name.replace('Codeforces Global Round', 'Global Round');
        if (name.length > 30) return name.replace('Codeforces Round #', 'CF #');
        return name;
    }

    function updateDifficultyPointer(rating) {
        const pointerValueSpan = difficultyPointer.querySelector('.pointer-value');
        if (!rating) {
            difficultyPointer.style.left = '50%';
            difficultyPointer.style.borderTopColor = '#4a6bff';
            difficultyBarFill.style.width = '0%';
            pointerValueSpan.textContent = 'N/A';
            return;
        }
        const minRatingVal = 800, maxRatingVal = 3500;
        const normalizedRating = Math.min(maxRatingVal, Math.max(minRatingVal, rating));
        const percentage = ((normalizedRating - minRatingVal) / (maxRatingVal - minRatingVal)) * 100;

        difficultyPointer.style.left = `${percentage}%`;
        difficultyBarFill.style.width = `${percentage}%`;

        let color, categoryText;
        if (rating < 1200) { color = '#00b894'; categoryText = 'Easy'; }
        else if (rating < 1400) { color = '#00cec9'; categoryText = 'Medium'; }
        else if (rating < 1600) { color = '#0984e3'; categoryText = 'Hard'; }
        else if (rating < 1900) { color = '#6c5ce7'; categoryText = 'Very Hard'; }
        else if (rating < 2100) { color = '#fd79a8'; categoryText = 'Challenging'; }
        else if (rating < 2300) { color = '#e17055'; categoryText = 'Difficult'; }
        else if (rating < 2400) { color = '#d63031'; categoryText = 'Expert'; }
        else { color = '#d63031'; categoryText = 'Master'; }

        difficultyPointer.style.borderTopColor = color;
        pointerValueSpan.textContent = `Rating: ${rating} (${categoryText})`;
    }

    // --- Fetch Data ---
    async function fetchAllData() {
        loadingElement.classList.remove('hidden');
        problemDisplay.classList.add('hidden');
        loadingElement.textContent = 'Fetching problems...';

        try {
            const problemsResponse = await fetch('https://codeforces.com/api/problemset.problems?lang=en');
            const problemsData = await problemsResponse.json();
            if (problemsData.status !== 'OK') throw new Error(problemsData.comment);

            problems = problemsData.result.problems.filter(p =>
                p.type === "PROGRAMMING" &&
                ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(p.index) &&
                p.rating !== undefined &&
                p.rating <= 2400
            );

            const stats = problemsData.result.problemStatistics || [];
            const solvedCountsMap = new Map();
            stats.forEach(stat => solvedCountsMap.set(`${stat.contestId}-${stat.index}`, stat.solvedCount));
            problems.forEach(p => p.solvedCount = solvedCountsMap.get(`${p.contestId}-${p.index}`) || 0);

            const contestListResponse = await fetch('https://codeforces.com/api/contest.list?lang=en');
            const contestListData = await contestListResponse.json();
            if (contestListData.status === 'OK') {
                contestListData.result.forEach(c => contestNames[c.id] = c.name);
            }

            lastUpdated = new Date();
            lastUpdatedElement.textContent = `Last Updated: ${formatDate(lastUpdated)}`;
            totalProblemsElement.textContent = problems.length;

            filterProblems();
            loadingElement.classList.add('hidden');
            generateProblem();

        } catch (error) {
            console.error('Error:', error);
            loadingElement.textContent = `Error: ${error.message}`;
        }
    }

    // --- Filtering & Display ---
    function filterProblems() {
        const type = problemTypeSelect.value;
        const contestType = contestTypeSelect.value;
        const minRating = parseInt(minRatingInput.value) || 800;
        const maxRating = parseInt(maxRatingInput.value) || 3500;

        filteredProblems = problems.filter(p => {
            const typeMatch = type === 'random' || p.index === type;
            const ratingMatch = p.rating >= minRating && p.rating <= maxRating;
            let contestMatch = true;
            if (contestType !== 'any') {
                const name = contestNames[p.contestId] || '';
                contestMatch = name.toLowerCase().includes(contestType.toLowerCase());
            }
            let tagMatch = true;
            if (selectedTags.length > 0) {
                tagMatch = selectedTags.some(tag => p.tags.some(pt => pt.toLowerCase() === tag.toLowerCase()));
            }
            return typeMatch && ratingMatch && contestMatch && tagMatch;
        });

        filteredProblemsElement.textContent = filteredProblems.length;
        return filteredProblems;
    }

    function generateProblem() {
        const list = filterProblems();
        if (list.length === 0) {
            problemTitle.textContent = 'No problems found.';
            problemSolvedStatus.textContent = '';
            return;
        }
        currentProblem = list[Math.floor(Math.random() * list.length)];
        problemTitle.textContent = currentProblem.name;
        problemTypeBadge.textContent = currentProblem.index;
        problemContestId.textContent = `${getFormattedContestName(currentProblem.contestId)} / ID: ${currentProblem.contestId}${currentProblem.index}`;
        problemRating.textContent = `Rating: ${currentProblem.rating}`;
        problemSolvedCount.textContent = `Solved: ${currentProblem.solvedCount.toLocaleString()}`;
        problemLink.href = `https://codeforces.com/contest/${currentProblem.contestId}/problem/${currentProblem.index}`;
        problemTagsContainer.innerHTML = currentProblem.tags.map(t => `<span>${t}</span>`).join(', ');
        updateDifficultyPointer(currentProblem.rating);
        updateProblemSolvedStatus();
    }

    // --- Handle Solved Status ---
    async function fetchUserSubmissions(handle) {
        handleStatusMessage.textContent = 'Checking handle...';
        try {
            const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`);
            const data = await response.json();
            if (data.status === 'OK') {
                solvedProblemsByUser.clear();
                data.result.forEach(sub => {
                    if (sub.verdict === 'OK') solvedProblemsByUser.add(`${sub.problem.contestId}-${sub.problem.index}`);
                });
                handleStatusMessage.textContent = `Handle "${handle}" loaded. (${solvedProblemsByUser.size} solved)`;
                handleStatusMessage.className = 'success';
                updateProblemSolvedStatus();
            } else throw new Error(data.comment);
        } catch (err) {
            handleStatusMessage.textContent = `Error: ${err.message}`;
            handleStatusMessage.className = 'error';
        }
    }

    function updateProblemSolvedStatus() {
        if (!currentProblem) return;
        const key = `${currentProblem.contestId}-${currentProblem.index}`;
        if (solvedProblemsByUser.has(key)) {
            problemSolvedStatus.textContent = 'Solved';
            problemSolvedStatus.className = 'problem-solved-status solved';
        } else {
            problemSolvedStatus.textContent = 'Unsolved';
            problemSolvedStatus.className = 'problem-solved-status unsolved';
        }
    }

    // --- Tag System ---
    function initializeTags() {
        tagsContainer.innerHTML = '';
        availableTags.forEach(tag => {
            const btn = document.createElement('span');
            btn.textContent = tag;
            btn.classList.add('tag-button');
            btn.dataset.tag = tag.toLowerCase();
            tagsContainer.appendChild(btn);
        });
        tagsContainer.addEventListener('click', e => {
            if (e.target.classList.contains('tag-button')) {
                const tag = e.target.dataset.tag;
                if (e.target.classList.contains('selected')) {
                    e.target.classList.remove('selected');
                    selectedTags = selectedTags.filter(t => t !== tag);
                } else {
                    e.target.classList.add('selected');
                    selectedTags.push(tag);
                }
                generateProblem();
            }
        });
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generateProblem);
    nextBtn.addEventListener('click', generateProblem);
    loadHandleBtn.addEventListener('click', () => {
        const handle = cfHandleInput.value.trim();
        if (handle) fetchUserSubmissions(handle);
    });

    // Init
    initializeTags();
    fetchAllData();
});
