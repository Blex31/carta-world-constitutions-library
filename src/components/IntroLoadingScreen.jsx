import React, { useState, useEffect } from 'react';

export default function IntroLoadingScreen({ onComplete, autoDismissMs = 3800 }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    'Unsealing the constitutional archive…',
    'Checking the live, approved constitutional catalogue…',
    'Indexing bills of rights and plain-language provisions…',
    'Archive ready. Entering reading chamber…'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / autoDismissMs) * 100));
      setProgress(rawProgress);

      if (rawProgress < 30) {
        setPhaseIndex(0);
      } else if (rawProgress < 65) {
        setPhaseIndex(1);
      } else if (rawProgress < 90) {
        setPhaseIndex(2);
      } else {
        setPhaseIndex(3);
      }

      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoDismissMs]);

  // Handle escape or enter key for immediate entry
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleDismiss();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleDismiss() {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 550);
  }

  return (
    <div
      className={`intro-screen-overlay ${isExiting ? 'intro-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction to CARTA World Constitutions Library"
    >
      {/* Background Archival Elements */}
      <div className="intro-backdrop-texture" />
      <div className="intro-ambient-glow" />
      <div className="intro-archival-frame">
        <span className="corner-ornament top-left">✦</span>
        <span className="corner-ornament top-right">✦</span>
        <span className="corner-ornament bottom-left">✦</span>
        <span className="corner-ornament bottom-right">✦</span>
      </div>

      {/* Top Bar with Brand & Skip Action */}
      <header className="intro-topbar">
        <div className="intro-brand">
          <span className="intro-monogram">C<i></i></span>
          <div className="intro-brand-text">
            <span className="intro-brand-title">CARTA</span>
            <span className="intro-brand-sub">WORLD CONSTITUTIONS LIBRARY</span>
          </div>
        </div>
        <button
          className="intro-skip-btn"
          onClick={handleDismiss}
          title="Skip to library (or press Enter)"
        >
          <span>Enter Library</span>
          <span className="intro-skip-arrow">→</span>
        </button>
      </header>

      {/* Central Quotation Chamber */}
      <main className="intro-chamber">
        <div className="intro-seal-badge">
          <span className="intro-seal-glyph">§</span>
          <span className="intro-seal-label">PUBLIC LAW · 1776</span>
        </div>

        <div className="intro-eyebrow">
          <span className="intro-filigree-line"></span>
          <span className="intro-eyebrow-text">FOUNDATIONAL PRINCIPLE OF HUMAN RIGHTS</span>
          <span className="intro-filigree-line"></span>
        </div>

        <div className="intro-quote-container">
          <span className="intro-quote-mark" aria-hidden="true">“</span>
          <blockquote className="intro-quote-text">
            We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are <em className="intro-highlight">Life, Liberty and the pursuit of Happiness</em>
          </blockquote>
        </div>

        <div className="intro-attribution">
          <div className="intro-attribution-author">
            — The Declaration of Independence · In Congress, July 4, 1776
          </div>
          <div className="intro-attribution-sub">
            The universal moral bedrock of constitutional equality, human dignity, and inalienable liberty.
          </div>
        </div>
      </main>

      {/* Bottom Loading Progress & Status Deck */}
      <footer className="intro-footer">
        <div className="intro-progress-container">
          <div className="intro-progress-track">
            <div
              className="intro-progress-bar"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="intro-status-row">
            <span className="intro-status-text">
              <span className="intro-status-pulse">●</span> {phases[phaseIndex]}
            </span>
            <span className="intro-progress-percent">{progress}%</span>
          </div>
        </div>

        <button
          className="intro-enter-btn"
          onClick={handleDismiss}
          aria-label="Enter CARTA Library"
        >
          <span>Begin Reading</span>
          <span className="intro-enter-arrow">→</span>
        </button>
      </footer>
    </div>
  );
}
