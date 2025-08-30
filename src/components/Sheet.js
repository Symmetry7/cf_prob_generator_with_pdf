import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Sheet({
  problems,
  contestNames,
  getFormattedContestName,
  solvedProblemsByUser,
  onRemoveProblem,
  onBackToMain
}) {
  const sheetRef = useRef(null);

  // Export sheet to PDF
  const exportToPDF = () => {
    if (problems.length === 0) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Codeforces Practice Sheet', 105, 20, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    doc.text(`Total Problems: ${problems.length}`, 105, 40, { align: 'center' });

    // Create table with embedded links
    doc.autoTable({
      head: [['#', 'ID (Clickable)', 'Name', 'Rating', 'Tags', 'Contest', 'Solved']],
      body: problems.map((problem, index) => [
        index + 1,
        `${problem.contestId}${problem.index}`,
        problem.name,
        problem.rating || 'N/A',
        problem.tags.join(', '),
        getFormattedContestName(problem.contestId),
        solvedProblemsByUser.has(`${problem.contestId}-${problem.index}`) ? '✓' : '✗'
      ]),
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [74, 107, 255],
        textColor: 255
      },
      columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 25 }, // ID (Clickable)
        2: { cellWidth: 50 }, // Name
        3: { cellWidth: 20 }, // Rating
        4: { cellWidth: 40 }, // Tags
        5: { cellWidth: 35 }, // Contest
        6: { cellWidth: 20 }  // Solved
      }
    });

    // Add clickable links after the table is created
    const finalY = doc.lastAutoTable.finalY;
    let currentY = finalY + 10;
    
    // Add note about clickable links
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255);
    doc.text('Clickable Problem Links:', 20, currentY);
    currentY += 15;
    
    // Add each problem as a clickable link
    doc.setFontSize(8);
    problems.forEach((problem, index) => {
      if (currentY > 250) { // Check if we need a new page
        doc.addPage();
        currentY = 20;
      }
      
      const problemUrl = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
      const linkText = `${index + 1}. ${problem.contestId}${problem.index} - ${problem.name}`;
      
      // Create clickable link
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(linkText, 20, currentY, {
        url: problemUrl,
        underline: true
      });
      
      currentY += 8;
    });

    // Save PDF
    doc.save('codeforces-practice-sheet.pdf');
  };

  if (problems.length === 0) {
    return (
      <div className="sheet-container animate__animated animate__fadeIn animate__delay-1s">
        <div className="empty-sheet glassmorphism">
          <div className="empty-sheet-icon">
            <i className="fas fa-list-alt"></i>
          </div>
          <h2>Your Sheet is Empty</h2>
          <p>Start adding problems from the Problem Selector to build your practice sheet!</p>
          <button className="btn primary-btn" onClick={onBackToMain}>
            <i className="fas fa-arrow-left"></i> Go to Problem Selector
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-container animate__animated animate__fadeIn animate__delay-1s">
      <div className="sheet-header glassmorphism">
        <div className="sheet-info">
          <h2><i className="fas fa-list-alt"></i> My Practice Sheet</h2>
          <p>Total Problems: {problems.length}</p>
          <p>Problems Solved: {problems.filter(p =>
            solvedProblemsByUser.has(`${p.contestId}-${p.index}`)
          ).length}</p>
        </div>
        <div className="sheet-actions">
          <button className="btn export-btn" onClick={exportToPDF}>
            <i className="fas fa-download"></i> Export PDF
          </button>
          <button className="btn back-btn" onClick={onBackToMain}>
            <i className="fas fa-arrow-left"></i> Back to Selector
          </button>
        </div>
      </div>

      <div className="problems-list">
        {problems.map((problem, index) => {
          const isSolved = solvedProblemsByUser.has(`${problem.contestId}-${problem.index}`);
          const addedDate = new Date(problem.addedAt).toLocaleDateString();

          return (
            <div key={`${problem.contestId}-${problem.index}`} className="sheet-problem-card glassmorphism">
              <div className="problem-header">
                <div className="problem-index">
                  <span className="problem-number">{index + 1}</span>
                  <div className={`problem-type-badge problem-type-${problem.index}`}>
                    {problem.index}
                  </div>
                </div>
                <div className="problem-title">
                  <h3>{problem.name}</h3>
                  <div className="problem-contest">
                    {getFormattedContestName(problem.contestId)} / ID: {problem.contestId}{problem.index}
                  </div>
                </div>
                <div className="problem-actions">
                  <button
                    className="btn remove-btn"
                    onClick={() => onRemoveProblem(problem)}
                    title="Remove from sheet"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="problem-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <i className="fas fa-star"></i>
                    <span>Rating: {problem.rating || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-users"></i>
                    <span>Solved: {problem.solvedCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Added: {addedDate}</span>
                  </div>
                  <div className={`detail-item status ${isSolved ? 'solved' : 'unsolved'}`}>
                    <i className={`fas ${isSolved ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                    <span>{isSolved ? 'Solved' : 'Unsolved'}</span>
                  </div>
                </div>

                <div className="problem-tags">
                  {problem.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="problem-links">
                <a
                  href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn solve-btn"
                >
                  <i className="fas fa-code"></i> Solve on Codeforces
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sheet;
