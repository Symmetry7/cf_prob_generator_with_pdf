import React from 'react';

function Footer() {
  return (
    <footer className="animate__animated animate__fadeIn animate__delay-2s">
      <p>Made with <span className="heart-pulse">❤️</span> By Symmetry</p>
      <div className="social-links">
        <a href="https://www.instagram.com/symmv_09" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-instagram"></i> Instagram
        </a>
        <a href="https://www.linkedin.com/in/vinayak-tiwari-960976274/" target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-linkedin"></i> LinkedIn
        </a>
      </div>
      <p className="credit">symmDiv2+ © 2025 | Not affiliated with Codeforces</p>
      <div className="footer-decoration">
        <div className="decoration-dot"></div>
        <div className="decoration-dot"></div>
        <div className="decoration-dot"></div>
      </div>
    </footer>
  );
}

export default Footer; 