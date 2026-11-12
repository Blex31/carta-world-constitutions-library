import React, { useState, useEffect } from 'react';

export default function IntroLoadingScreen({ onComplete, autoDismissMs = 3800 }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / autoDismissMs) * 100));
      setProgress(rawProgress);

      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoDismissMs]);

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
      aria-label="CARTA World Constitutions Library"
    >
      <main className="intro-chamber">
        <div className="intro-brand">
          <span className="intro-monogram">C</span>
          <span className="intro-brand-title">CARTA</span>
        </div>

        <blockquote className="intro-quote-text">
          “We hold these truths to be self-evident, that all men are created equal,
          that they are endowed by their Creator with certain unalienable Rights,
          that among these are Life, Liberty and the pursuit of Happiness.”
        </blockquote>
        <cite className="intro-quote-attribution">
          The Declaration of Independence · 1776
        </cite>

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
        </div>

        <button
          className="intro-enter-btn"
          onClick={handleDismiss}
          aria-label="Enter CARTA Library"
        >
          Enter Library
        </button>
      </main>
    </div>
  );
}
