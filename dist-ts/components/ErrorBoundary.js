import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            return (_jsx("div", { className: "mobile-container neon-theme", children: _jsxs("div", { style: {
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '2rem',
                    }, children: [_jsx("div", { style: { fontSize: '4rem', marginBottom: '1rem' }, children: "\uD83D\uDCA5" }), _jsx("div", { style: {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'var(--lamap-red)',
                                marginBottom: '1rem'
                            }, children: "Oops ! Une erreur s'est produite" }), _jsx("div", { style: {
                                fontSize: '1rem',
                                color: '#888',
                                marginBottom: '2rem',
                                maxWidth: '400px',
                                lineHeight: '1.5'
                            }, children: "Quelque chose s'est mal pass\u00E9. Notre \u00E9quipe a \u00E9t\u00E9 notifi\u00E9e et travaille sur le probl\u00E8me." }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("div", { style: {
                                background: '#111',
                                border: '1px solid #444',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '2rem',
                                maxWidth: '600px',
                                textAlign: 'left',
                                overflow: 'auto',
                                maxHeight: '200px'
                            }, children: [_jsx("div", { style: { fontSize: '0.9rem', color: 'var(--lamap-red)', marginBottom: '0.5rem' }, children: "D\u00E9tails de l'erreur:" }), _jsx("div", { style: { fontSize: '0.8rem', color: '#ccc', fontFamily: 'monospace' }, children: this.state.error.toString() }), this.state.errorInfo.componentStack && (_jsx("div", { style: { fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }, children: this.state.errorInfo.componentStack }))] })), _jsxs("div", { style: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }, children: [_jsx("button", { onClick: () => window.location.reload(), style: {
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
                                    }, onMouseOver: (e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.5)';
                                    }, onMouseOut: (e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(198, 40, 40, 0.3)';
                                    }, children: "\uD83D\uDD04 Recharger la page" }), _jsx("button", { onClick: () => window.location.href = '/', style: {
                                        background: '#2A2A2A',
                                        color: 'var(--lamap-white)',
                                        border: '1px solid #444',
                                        borderRadius: '12px',
                                        padding: '12px 24px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }, onMouseOver: (e) => {
                                        e.target.style.background = '#444';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }, onMouseOut: (e) => {
                                        e.target.style.background = '#2A2A2A';
                                        e.target.style.transform = 'translateY(0)';
                                    }, children: "\uD83C\uDFE0 Retour \u00E0 l'accueil" })] }), _jsx("div", { style: {
                                fontSize: '0.8rem',
                                color: '#666',
                                marginTop: '3rem',
                                fontStyle: 'italic',
                                maxWidth: '400px'
                            }, children: "Si le probl\u00E8me persiste, n'h\u00E9sitez pas \u00E0 contacter notre support technique." })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
