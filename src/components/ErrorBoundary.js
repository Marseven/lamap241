import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            return (_jsx("div", { className: "min-h-screen bg-black text-white flex items-center justify-center p-4", children: _jsxs("div", { className: "max-w-md w-full text-center", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE15" }), _jsx("h1", { className: "text-2xl font-bold mb-2", children: "Oops, quelque chose s'est mal pass\u00E9" }), _jsx("p", { className: "text-gray-400", children: "Une erreur inattendue s'est produite. Pas de panique, tes donn\u00E9es sont en s\u00E9curit\u00E9." })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: this.handleReset, className: "w-full btn-primary", children: "\uD83C\uDFE0 Retour \u00E0 l'accueil" }), _jsx("button", { onClick: () => window.location.reload(), className: "w-full btn-primary bg-gray-700", children: "\uD83D\uDD04 Recharger la page" })] }), import.meta.env.DEV && this.state.errorInfo && (_jsxs("details", { className: "mt-8 text-left", children: [_jsx("summary", { className: "cursor-pointer text-red-400 mb-2", children: "D\u00E9tails de l'erreur (dev mode)" }), _jsx("pre", { className: "bg-gray-900 p-4 rounded text-xs overflow-auto", children: this.state.errorInfo.componentStack })] }))] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
