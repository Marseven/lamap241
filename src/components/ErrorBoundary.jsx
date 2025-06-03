import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Envoyer l'erreur à un service de monitoring (Sentry, etc.)
    if (import.meta.env.PROD) {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold mb-2">Oops, quelque chose s'est mal passé</h1>
              <p className="text-gray-400">
                Une erreur inattendue s'est produite. Pas de panique, tes données sont en sécurité.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full btn-primary"
              >
                🏠 Retour à l'accueil
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary bg-gray-700"
              >
                🔄 Recharger la page
              </button>
            </div>

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-red-400 mb-2">
                  Détails de l'erreur (dev mode)
                </summary>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;