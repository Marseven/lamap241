import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingPage = ({ 
  title = "Chargement...", 
  subtitle = null, 
  showProgress = false, 
  progress = 0,
  showLogo = true 
}) => {
  const progressStyle = {
    width: '200px',
    height: '4px',
    backgroundColor: '#333',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '1rem',
  };

  const progressBarStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, var(--lamap-red), #a32222)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    width: `${progress}%`,
    boxShadow: '0 0 10px rgba(198, 40, 40, 0.5)',
  };

  return (
    <div className="mobile-container neon-theme">
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        {showLogo && (
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src="/logo.png" 
              alt="La Map 241" 
              style={{ 
                width: '120px', 
                height: 'auto',
                opacity: 0.9,
              }} 
            />
            <div style={{ 
              fontSize: '1.2rem', 
              color: 'var(--lamap-red)', 
              fontWeight: 'bold',
              marginTop: '0.5rem',
            }}>
              La Map 241
            </div>
          </div>
        )}

        <LoadingSpinner 
          size="large" 
          color="primary"
        />

        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'var(--lamap-white)',
          marginTop: '2rem',
        }}>
          {title}
        </div>

        {subtitle && (
          <div style={{
            fontSize: '0.9rem',
            color: '#888',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }}>
            {subtitle}
          </div>
        )}

        {showProgress && (
          <div style={{ marginTop: '2rem' }}>
            <div style={progressStyle}>
              <div style={progressBarStyle}></div>
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#888',
              marginTop: '0.5rem',
            }}>
              {Math.round(progress)}%
            </div>
          </div>
        )}

        <div style={{
          fontSize: '0.8rem',
          color: '#666',
          marginTop: '3rem',
          fontStyle: 'italic',
        }}>
          🎮 Préparez-vous pour une partie épique !
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;