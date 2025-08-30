import React from 'react';

function Header() {
  return (
    <header className="animate__animated animate__fadeInDown">
      <div className="logo">
        <span className="logo-symm">symm</span>
        <span className="logo-div2">Div2+</span>
        <span className="logo-badge">BETA</span>
      </div>
      <h1>Codeforces Problem Selector</h1>
      <p className="subtitle">Sharpen your skills with targeted Div 2 A-G problems</p>
      <div className="header-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>
    </header>
  );
}

export default Header; 