import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💥</div>
            
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: 'var(--lamap-red)', 
              marginBottom: '1rem' 
            }}>
              Oops ! Une erreur s'est produite
            </div>
            
            <div style={{ 
              fontSize: '1rem', 
              color: '#888', 
              marginBottom: '2rem',
              maxWidth: '400px',
              lineHeight: '1.5'
            }}>
              Quelque chose s'est mal passé. Notre équipe a été notifiée et travaille sur le problème.
            </div>

            {/* Détails de l'erreur en mode développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                background: '#111',
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                maxWidth: '600px',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--lamap-red)', marginBottom: '0.5rem' }}>
                  Détails de l'erreur:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#ccc', fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo.componentStack && (
                  <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }}>
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                  color: 'var(--lamap-white)',
                  border: '2px solid var(--lamap-red)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(198, 40, 40, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(198, 40, 40, 0.3)';
                }}
              >
                🔄 Recharger la page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: '#2A2A2A',
                  color: 'var(--lamap-white)',
                  border: '1px solid #444',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#444';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#2A2A2A';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🏠 Retour à l'accueil
              </button>
            </div>

            <div style={{ 
              fontSize: '0.8rem', 
              color: '#666', 
              marginTop: '3rem',
              fontStyle: 'italic',
              maxWidth: '400px'
            }}>
              Si le problème persiste, n'hésitez pas à contacter notre support technique.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;